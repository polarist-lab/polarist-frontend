#!/usr/bin/env node

/**
 * API Sync Validation Script
 * 
 * This script validates that the API documentation and type synchronization
 * is properly maintained and up to date.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const TYPES_DIR = path.join(__dirname, '../src/types');
const TYPES_FILE = path.join(TYPES_DIR, 'api.ts');
const CLIENT_FILE = path.join(TYPES_DIR, 'api-client.ts');
const SYNC_LOG_FILE = path.join(__dirname, '../api-sync-log.json');
const BACKEND_RUST_DIR = path.join(__dirname, '../backend-rust');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

class ValidationError extends Error {
  constructor(message, suggestion = null) {
    super(message);
    this.suggestion = suggestion;
  }
}

function checkFileExists(filePath, description) {
  if (!fs.existsSync(filePath)) {
    throw new ValidationError(
      `${description} not found at ${filePath}`,
      'Run npm run sync-api to generate missing files'
    );
  }
}

function checkBackendRunning() {
  try {
    execSync(`curl -s ${BACKEND_URL}/health`, { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

async function checkOpenApiEndpoint() {
  try {
    const response = execSync(`curl -s "${BACKEND_URL}/api-docs/openapi.json"`, { encoding: 'utf8' });
    const spec = JSON.parse(response);
    
    if (!spec.info || !spec.paths || !spec.components) {
      throw new ValidationError(
        'OpenAPI specification is incomplete',
        'Check backend utoipa configuration'
      );
    }
    
    return {
      endpoints: Object.keys(spec.paths).length,
      schemas: Object.keys(spec.components.schemas || {}).length,
      version: spec.info.version
    };
  } catch (error) {
    throw new ValidationError(
      `Failed to fetch or parse OpenAPI spec: ${error.message}`,
      'Ensure backend is running and /api-docs/openapi.json is accessible'
    );
  }
}

function checkRustCodeAnnotations() {
  const issues = [];
  
  // Check handlers for utoipa annotations
  const handlersDir = path.join(BACKEND_RUST_DIR, 'src/handlers');
  if (fs.existsSync(handlersDir)) {
    const handlerFiles = fs.readdirSync(handlersDir)
      .filter(file => file.endsWith('.rs') && file !== 'mod.rs');
    
    handlerFiles.forEach(file => {
      const content = fs.readFileSync(path.join(handlersDir, file), 'utf8');
      
      // Check for async fn without utoipa::path
      const asyncFnRegex = /pub\s+async\s+fn\s+(\w+)/g;
      const utiopaPathRegex = /#\[utoipa::path\(/g;
      
      const asyncFns = [...content.matchAll(asyncFnRegex)].map(match => match[1]);
      const utiopaPaths = [...content.matchAll(utiopaPathRegex)];
      
      if (asyncFns.length > utiopaPaths.length) {
        issues.push(`${file}: ${asyncFns.length} async functions but only ${utiopaPaths.length} utoipa::path annotations`);
      }
    });
  }
  
  // Check models for ToSchema derives
  const modelsDir = path.join(BACKEND_RUST_DIR, 'src/models');
  if (fs.existsSync(modelsDir)) {
    const modelFiles = fs.readdirSync(modelsDir)
      .filter(file => file.endsWith('.rs') && file !== 'mod.rs');
    
    modelFiles.forEach(file => {
      const content = fs.readFileSync(path.join(modelsDir, file), 'utf8');
      
      // Check for struct/enum without ToSchema
      const structRegex = /#\[derive\(.*?\)\]\s*pub\s+struct\s+(\w+)/g;
      const enumRegex = /#\[derive\(.*?\)\]\s*pub\s+enum\s+(\w+)/g;
      
      const structs = [...content.matchAll(structRegex)];
      const enums = [...content.matchAll(enumRegex)];
      
      [...structs, ...enums].forEach(match => {
        const deriveLine = match[0];
        const typeName = match[1];
        
        if (!deriveLine.includes('ToSchema')) {
          issues.push(`${file}: ${typeName} missing ToSchema derive`);
        }
      });
    });
  }
  
  return issues;
}

function checkTypeScriptFiles() {
  const issues = [];
  
  // Check if API types file is recent
  if (fs.existsSync(TYPES_FILE)) {
    const stats = fs.statSync(TYPES_FILE);
    const age = Date.now() - stats.mtime.getTime();
    const ageHours = age / (1000 * 60 * 60);
    
    if (ageHours > 24) {
      issues.push(`API types file is ${Math.round(ageHours)} hours old - consider running sync-api`);
    }
  }
  
  // Check if API client imports exist
  if (fs.existsSync(CLIENT_FILE)) {
    const content = fs.readFileSync(CLIENT_FILE, 'utf8');
    
    if (!content.includes("import { components, paths } from './api'")) {
      issues.push('API client missing proper imports from generated types');
    }
    
    if (!content.includes('DO NOT EDIT MANUALLY')) {
      issues.push('API client missing auto-generation warning');
    }
  }
  
  return issues;
}

function checkSyncHistory() {
  if (!fs.existsSync(SYNC_LOG_FILE)) {
    throw new ValidationError(
      'No sync history found',
      'Run npm run sync-api at least once'
    );
  }
  
  const logs = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
  const latest = logs[logs.length - 1];
  
  if (latest.status !== 'success') {
    throw new ValidationError(
      `Last sync failed: ${latest.error}`,
      'Run npm run sync-api to retry synchronization'
    );
  }
  
  const age = Date.now() - new Date(latest.timestamp).getTime();
  const ageHours = age / (1000 * 60 * 60);
  
  return {
    lastSync: latest.timestamp,
    ageHours: Math.round(ageHours * 10) / 10,
    endpoints: latest.endpoints_count,
    schemas: latest.schemas_count
  };
}

async function runValidation() {
  log('🔍 Running API synchronization validation...', 'blue');
  log(`Backend URL: ${BACKEND_URL}`, 'blue');
  
  const warnings = [];
  let errors = 0;
  
  try {
    // 1. Check required files exist
    log('\n1️⃣  Checking required files...', 'magenta');
    checkFileExists(TYPES_FILE, 'API types file');
    checkFileExists(CLIENT_FILE, 'API client file');
    log('✅ All required files exist', 'green');
    
    // 2. Check backend is running
    log('\n2️⃣  Checking backend status...', 'magenta');
    if (!checkBackendRunning()) {
      throw new ValidationError(
        'Backend is not running',
        'Start backend with: npm run dev:backend'
      );
    }
    log('✅ Backend is running', 'green');
    
    // 3. Check OpenAPI endpoint
    log('\n3️⃣  Validating OpenAPI specification...', 'magenta');
    const specInfo = await checkOpenApiEndpoint();
    log(`✅ OpenAPI spec valid: ${specInfo.endpoints} endpoints, ${specInfo.schemas} schemas`, 'green');
    
    // 4. Check Rust code annotations
    log('\n4️⃣  Checking Rust code annotations...', 'magenta');
    const rustIssues = checkRustCodeAnnotations();
    if (rustIssues.length > 0) {
      rustIssues.forEach(issue => warnings.push(`Rust: ${issue}`));
      log(`⚠️  Found ${rustIssues.length} potential issues in Rust code`, 'yellow');
    } else {
      log('✅ Rust code annotations look good', 'green');
    }
    
    // 5. Check TypeScript files
    log('\n5️⃣  Checking TypeScript files...', 'magenta');
    const tsIssues = checkTypeScriptFiles();
    if (tsIssues.length > 0) {
      tsIssues.forEach(issue => warnings.push(`TypeScript: ${issue}`));
      log(`⚠️  Found ${tsIssues.length} potential issues in TypeScript files`, 'yellow');
    } else {
      log('✅ TypeScript files look good', 'green');
    }
    
    // 6. Check sync history
    log('\n6️⃣  Checking sync history...', 'magenta');
    const syncInfo = checkSyncHistory();
    log(`✅ Last successful sync: ${syncInfo.lastSync} (${syncInfo.ageHours}h ago)`, 'green');
    
    if (syncInfo.ageHours > 24) {
      warnings.push(`Sync is ${syncInfo.ageHours} hours old - consider running npm run sync-api`);
    }
    
    // 7. TypeScript validation
    log('\n7️⃣  Running TypeScript validation...', 'magenta');
    try {
      execSync('npm run validate-types', { stdio: 'pipe' });
      log('✅ TypeScript validation passed', 'green');
    } catch (error) {
      throw new ValidationError(
        'TypeScript validation failed',
        'Run npm run validate-types for details'
      );
    }
    
  } catch (error) {
    if (error instanceof ValidationError) {
      log(`\n❌ ${error.message}`, 'red');
      if (error.suggestion) {
        log(`💡 Suggestion: ${error.suggestion}`, 'yellow');
      }
      errors++;
    } else {
      log(`\n❌ Unexpected error: ${error.message}`, 'red');
      errors++;
    }
  }
  
  // Summary
  log('\n📋 Validation Summary:', 'blue');
  log(`   Errors: ${errors}`, errors > 0 ? 'red' : 'green');
  log(`   Warnings: ${warnings.length}`, warnings.length > 0 ? 'yellow' : 'green');
  
  if (warnings.length > 0) {
    log('\n⚠️  Warnings:', 'yellow');
    warnings.forEach(warning => log(`   - ${warning}`, 'yellow'));
  }
  
  if (errors === 0) {
    log('\n🎉 API synchronization validation passed!', 'green');
    log('📖 Swagger UI available at: ' + BACKEND_URL + '/api/docs', 'blue');
  } else {
    log('\n❌ API synchronization validation failed!', 'red');
    process.exit(1);
  }
}

// Handle script arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
API Sync Validation Script

Usage:
  node scripts/validate-api-sync.js [options]

Options:
  --help              Show this help message
  --quiet             Only show errors and warnings
  --fix               Attempt to fix issues automatically

Examples:
  npm run validate-api-sync
  node scripts/validate-api-sync.js --quiet
    `);
    process.exit(0);
  }
  
  if (args.includes('--quiet')) {
    // Override log function to be quieter
    const originalLog = log;
    log = (message, color) => {
      if (message.includes('❌') || message.includes('⚠️') || message.includes('📋')) {
        originalLog(message, color);
      }
    };
  }
  
  runValidation();
}

module.exports = { runValidation };