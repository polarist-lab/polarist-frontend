#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const OPENAPI_URL = `${BACKEND_URL}/api-docs/openapi.json`;
const TYPES_DIR = path.join(__dirname, '../src/types');
const TYPES_OUTPUT = path.join(TYPES_DIR, 'api.ts');
const CLIENT_OUTPUT = path.join(TYPES_DIR, 'api-client.ts');
const SYNC_LOG_FILE = path.join(__dirname, '../api-sync-log.json');

function logSync(status, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    status,
    backend_url: BACKEND_URL,
    ...details
  };

  let logs = [];
  if (fs.existsSync(SYNC_LOG_FILE)) {
    try {
      logs = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
    } catch (error) {
      console.warn(`Warning: Could not read existing sync log: ${error.message}`);
    }
  }

  logs.push(logEntry);
  
  // Keep only last 50 entries
  if (logs.length > 50) {
    logs = logs.slice(-50);
  }

  fs.writeFileSync(SYNC_LOG_FILE, JSON.stringify(logs, null, 2));
}

async function fetchOpenApiSpec() {
  console.log(`📡 Fetching OpenAPI spec from ${OPENAPI_URL}`);
  
  // Use curl to fetch the spec
  try {
    const specJson = execSync(`curl -s "${OPENAPI_URL}"`, { encoding: 'utf8' });
    return JSON.parse(specJson);
  } catch (error) {
    throw new Error(`Failed to fetch OpenAPI spec: ${error.message}`);
  }
}

function generateApiClient(openApiSpec) {
  console.log('🔧 Generating API client...');
  
  const title = openApiSpec.info?.title || 'API';
  const version = openApiSpec.info?.version || '1.0.0';
  const description = openApiSpec.info?.description || '';

  const clientContent = `/**
 * ${title} v${version}
 * ${description}
 * 
 * Auto-generated API client
 * Generated at: ${new Date().toISOString()}
 * Backend URL: ${BACKEND_URL}
 * 
 * ⚠️  DO NOT EDIT MANUALLY - This file is auto-generated
 * Run 'npm run sync-api' to regenerate
 */

import { components, paths } from './api';

export type ApiSchema = components['schemas'];
export type ApiPaths = paths;

// Common response wrapper
export type ApiResponse<T> = {
  data?: T;
  message?: string;
  error?: string;
};

// HTTP client configuration
export interface ApiConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private config: Required<ApiConfig>;

  constructor(config: ApiConfig = {}) {
    this.baseURL = config.baseURL || '/api/v1';
    this.config = {
      baseURL: this.baseURL,
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  private async request<T>(
    method: string,
    path: string,
    data?: any,
    config?: Partial<ApiConfig>
  ): Promise<T> {
    const url = \`\${this.baseURL}\${path}\`;
    const requestConfig = { ...this.config, ...config };

    try {
      const response = await fetch(url, {
        method,
        headers: requestConfig.headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: AbortSignal.timeout(requestConfig.timeout),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(\`HTTP \${response.status}: \${response.statusText} - \${errorText}\`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response.text() as unknown as T;
    } catch (error) {
      console.error(\`API request failed: \${method} \${url}\`, error);
      throw error;
    }
  }

  // Auth endpoints
  auth = {
    getProfile: () => 
      this.request<ApiResponse<ApiSchema['User']>>('GET', '/auth/profile'),
    migrateGuestData: (data: ApiSchema['MigrateGuestDataRequest']) =>
      this.request<ApiResponse<any>>('POST', '/auth/migrate-guest-data', data),
  };

  // User endpoints  
  users = {
    create: (data: ApiSchema['CreateUserRequest']) =>
      this.request<ApiResponse<ApiSchema['User']>>('POST', '/users', data),
    get: (id: number) =>
      this.request<ApiResponse<ApiSchema['User']>>('GET', \`/users/\${id}\`),
    update: (id: number, data: ApiSchema['UpdateUserRequest']) =>
      this.request<ApiResponse<ApiSchema['User']>>('PATCH', \`/users/\${id}\`, data),
    getSettings: (id: number) =>
      this.request<ApiResponse<ApiSchema['UserSettings']>>('GET', \`/users/\${id}/settings\`),
    updateSettings: (id: number, data: ApiSchema['UpdateUserSettingsRequest']) =>
      this.request<ApiResponse<ApiSchema['UserSettings']>>('PATCH', \`/users/\${id}/settings\`, data),
  };

  // Wordbook endpoints
  wordbooks = {
    getPublic: (params?: Partial<ApiSchema['WordbookQuery']>) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<ApiResponse<ApiSchema['WordbookSummary'][]>>('GET', \`/wordbooks?\${query}\`);
    },
    getShared: (shareCode: string) =>
      this.request<ApiResponse<ApiSchema['SharedWordbookInfo']>>('GET', \`/wordbooks/shared/\${shareCode}\`),
    getUserWordbooks: (userId: number, params?: Partial<ApiSchema['WordbookQuery']>) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<ApiResponse<ApiSchema['WordbookSummary'][]>>('GET', \`/wordbooks/users/\${userId}?\${query}\`);
    },
    create: (userId: number, data: ApiSchema['CreateWordbookRequest']) =>
      this.request<ApiResponse<ApiSchema['CustomWordbook']>>('POST', \`/wordbooks/users/\${userId}\`, data),
    get: (userId: number, wordbookId: number) =>
      this.request<ApiResponse<ApiSchema['CustomWordbook']>>('GET', \`/wordbooks/users/\${userId}/\${wordbookId}\`),
    update: (userId: number, wordbookId: number, data: ApiSchema['UpdateWordbookRequest']) =>
      this.request<ApiResponse<ApiSchema['CustomWordbook']>>('PATCH', \`/wordbooks/users/\${userId}/\${wordbookId}\`, data),
    delete: (userId: number, wordbookId: number) =>
      this.request<ApiResponse<void>>('DELETE', \`/wordbooks/users/\${userId}/\${wordbookId}\`),
    share: (userId: number, wordbookId: number) =>
      this.request<ApiResponse<{ share_code: string }>>('POST', \`/wordbooks/users/\${userId}/\${wordbookId}/share\`),
    unshare: (userId: number, wordbookId: number) =>
      this.request<ApiResponse<void>>('POST', \`/wordbooks/users/\${userId}/\${wordbookId}/unshare\`),
  };

  // Progress endpoints
  progress = {
    getSystemStats: () =>
      this.request<ApiResponse<ApiSchema['SystemStats']>>('GET', '/progress/system/stats'),
    getUserProgress: (userId: number, params?: Partial<ApiSchema['ProgressQuery']>) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<ApiResponse<ApiSchema['UserProgress'][]>>('GET', \`/progress/\${userId}?\${query}\`);
    },
    getStats: (userId: number) =>
      this.request<ApiResponse<ApiSchema['ProgressStats']>>('GET', \`/progress/\${userId}/stats\`),
    getWordProgress: (userId: number, wordId: string) =>
      this.request<ApiResponse<ApiSchema['UserProgress']>>('GET', \`/progress/\${userId}/words/\${encodeURIComponent(wordId)}\`),
    createWordProgress: (userId: number, wordId: string, data: ApiSchema['CreateProgressRequest']) =>
      this.request<ApiResponse<ApiSchema['UserProgress']>>('POST', \`/progress/\${userId}/words/\${encodeURIComponent(wordId)}\`, data),
    updateWordProgress: (userId: number, wordId: string, data: ApiSchema['UpdateProgressRequest']) =>
      this.request<ApiResponse<ApiSchema['UserProgress']>>('PATCH', \`/progress/\${userId}/words/\${encodeURIComponent(wordId)}\`, data),
    getSessions: (userId: number, params?: Partial<ApiSchema['SessionQuery']>) => {
      const query = new URLSearchParams(params as any).toString();
      return this.request<ApiResponse<ApiSchema['StudySession'][]>>('GET', \`/progress/\${userId}/sessions?\${query}\`);
    },
    createSession: (userId: number, data: ApiSchema['CreateSessionRequest']) =>
      this.request<ApiResponse<ApiSchema['StudySession']>>('POST', \`/progress/\${userId}/sessions\`, data),
    getSession: (userId: number, sessionId: string) =>
      this.request<ApiResponse<ApiSchema['StudySession']>>('GET', \`/progress/\${userId}/sessions/\${encodeURIComponent(sessionId)}\`),
    updateSession: (userId: number, sessionId: string, data: ApiSchema['UpdateSessionRequest']) =>
      this.request<ApiResponse<ApiSchema['StudySession']>>('PATCH', \`/progress/\${userId}/sessions/\${encodeURIComponent(sessionId)}\`, data),
  };
}

// Default client instance
export const apiClient = new ApiClient();

// Export client class for custom instances
export { ApiClient };

// Export all types from api.ts
export * from './api';
`;

  fs.writeFileSync(CLIENT_OUTPUT, clientContent);
  console.log(`✅ API client generated at ${CLIENT_OUTPUT}`);
}

async function syncAPI() {
  try {
    console.log('🚀 Starting API synchronization...');
    console.log(`Backend URL: ${BACKEND_URL}`);
    
    // Ensure backend is running by checking health endpoint
    try {
      execSync(`curl -s ${BACKEND_URL}/health`, { stdio: 'pipe' });
      console.log('✅ Backend is running');
    } catch (error) {
      console.error('❌ Backend is not running. Please start it with: npm run dev:backend');
      logSync('error', { error: 'Backend not running' });
      process.exit(1);
    }

    // Create types directory if it doesn't exist
    if (!fs.existsSync(TYPES_DIR)) {
      fs.mkdirSync(TYPES_DIR, { recursive: true });
    }

    // Fetch OpenAPI spec
    const openApiSpec = await fetchOpenApiSpec();
    
    // Generate TypeScript types from OpenAPI spec
    console.log('📝 Generating TypeScript types...');
    execSync(`npx openapi-typescript ${OPENAPI_URL} --output ${TYPES_OUTPUT}`, {
      stdio: 'inherit'
    });

    console.log('✅ API types synced successfully!');
    console.log(`📁 Types written to: ${TYPES_OUTPUT}`);
    
    // Generate API client
    generateApiClient(openApiSpec);
    
    // Validate types
    console.log('🔍 Validating TypeScript types...');
    try {
      execSync('npm run validate-types', { stdio: 'inherit' });
      console.log('✅ Type validation passed!');
    } catch (error) {
      console.warn('⚠️  Type validation failed. Please check the generated types.');
    }

    // Log successful sync
    logSync('success', {
      types_generated: true,
      client_generated: true,
      endpoints_count: Object.keys(openApiSpec.paths || {}).length,
      schemas_count: Object.keys(openApiSpec.components?.schemas || {}).length,
    });

    console.log('\n🎉 API synchronization complete!');
    console.log(`📁 Types: ${TYPES_OUTPUT}`);
    console.log(`📁 Client: ${CLIENT_OUTPUT}`);
    console.log(`📖 Swagger UI: ${BACKEND_URL}/api/docs`);
    
  } catch (error) {
    console.error('❌ Error syncing API:', error.message);
    logSync('error', { error: error.message, stack: error.stack });
    process.exit(1);
  }
}

// Handle script arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--check')) {
    // Check if sync is needed
    try {
      execSync(`curl -s ${BACKEND_URL}/health`, { stdio: 'pipe' });
      if (!fs.existsSync(TYPES_OUTPUT)) {
        console.log('❌ API types not found, sync needed');
        process.exit(1);
      }
      console.log('✅ API sync appears up to date');
    } catch (error) {
      console.log('❌ Backend is not running');
      process.exit(1);
    }
  } else if (args.includes('--status')) {
    // Show sync status
    if (fs.existsSync(SYNC_LOG_FILE)) {
      const logs = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'));
      const latest = logs[logs.length - 1];
      const status = latest.status === 'success' ? '✅' : '❌';
      console.log(`${status} Last sync: ${latest.timestamp} - ${latest.status}`);
      if (latest.error) {
        console.log(`Error: ${latest.error}`);
      }
      if (latest.endpoints_count) {
        console.log(`Endpoints: ${latest.endpoints_count}, Schemas: ${latest.schemas_count}`);
      }
    } else {
      console.log('No sync history found');
    }
  } else {
    // Run sync
    syncAPI();
  }
}

module.exports = { syncAPI };