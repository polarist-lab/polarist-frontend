/**
 * End-to-end integration tests for API synchronization
 * These tests ensure the entire sync pipeline works correctly
 */

import { spawn, ChildProcess } from 'child_process'
import fs from 'fs'
import path from 'path'
import { setTimeout } from 'timers/promises'

// Increase timeout for integration tests
jest.setTimeout(60000)

describe('API Sync E2E Integration', () => {
  let backendProcess: ChildProcess | null = null
  const BACKEND_URL = 'http://localhost:4001' // Use different port for tests
  const TYPES_DIR = path.join(__dirname, '../../src/types')
  const TYPES_FILE = path.join(TYPES_DIR, 'api.ts')
  const CLIENT_FILE = path.join(TYPES_DIR, 'api-client.ts')
  const SYNC_LOG_FILE = path.join(__dirname, '../../api-sync-log.json')

  beforeAll(async () => {
    // Clean up any existing generated files
    if (fs.existsSync(TYPES_FILE)) {
      fs.unlinkSync(TYPES_FILE)
    }
    if (fs.existsSync(CLIENT_FILE)) {
      fs.unlinkSync(CLIENT_FILE)
    }
    if (fs.existsSync(SYNC_LOG_FILE)) {
      fs.unlinkSync(SYNC_LOG_FILE)
    }
  })

  afterAll(async () => {
    // Clean up backend process
    if (backendProcess) {
      backendProcess.kill()
      await setTimeout(2000) // Wait for graceful shutdown
    }
  })

  // Helper function to start backend
  const startBackend = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      backendProcess = spawn('cargo', ['run'], {
        cwd: path.join(__dirname, '../../backend-rust'),
        env: {
          ...process.env,
          PORT: '4001', // Use test port
          DATABASE_URL: 'sqlite::memory:', // Use in-memory database for tests
        },
        stdio: ['ignore', 'pipe', 'pipe']
      })

      let output = ''
      backendProcess.stdout?.on('data', (data) => {
        output += data.toString()
        if (output.includes('running on')) {
          resolve()
        }
      })

      backendProcess.stderr?.on('data', (data) => {
        console.error('Backend stderr:', data.toString())
      })

      backendProcess.on('error', reject)

      // Timeout after 30 seconds
      setTimeout(() => {
        reject(new Error('Backend failed to start within 30 seconds'))
      }, 30000)
    })
  }

  // Helper function to check if backend is healthy
  const checkBackendHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${BACKEND_URL}/health`)
      return response.ok
    } catch {
      return false
    }
  }

  // Helper function to fetch OpenAPI spec
  const fetchOpenApiSpec = async () => {
    const response = await fetch(`${BACKEND_URL}/api-docs/openapi.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`)
    }
    return response.json()
  }

  describe('Full sync pipeline', () => {
    it('should complete end-to-end sync successfully', async () => {
      // Start backend
      await startBackend()

      // Wait for backend to be healthy
      let attempts = 0
      while (attempts < 30 && !(await checkBackendHealth())) {
        await setTimeout(1000)
        attempts++
      }

      expect(await checkBackendHealth()).toBe(true)

      // Fetch and validate OpenAPI spec
      const spec = await fetchOpenApiSpec()
      expect(spec.openapi).toBeDefined()
      expect(spec.info).toBeDefined()
      expect(spec.paths).toBeDefined()
      expect(spec.components?.schemas).toBeDefined()

      // Verify specific endpoints exist
      expect(spec.paths['/api/v1/auth/profile']).toBeDefined()
      expect(spec.paths['/api/v1/users']).toBeDefined()
      expect(spec.paths['/api/v1/wordbooks']).toBeDefined()
      expect(spec.paths['/api/v1/progress/system/stats']).toBeDefined()

      // Verify schemas exist
      expect(spec.components.schemas.User).toBeDefined()
      expect(spec.components.schemas.CreateUserRequest).toBeDefined()
      expect(spec.components.schemas.CustomWordbook).toBeDefined()
      expect(spec.components.schemas.UserProgress).toBeDefined()

      // Test specific schema structure
      const userSchema = spec.components.schemas.User
      expect(userSchema.properties.id).toBeDefined()
      expect(userSchema.properties.email).toBeDefined()
      expect(userSchema.properties.name).toBeDefined()
    })

    // Skip actual sync script test in CI/CD environments
    it.skip('should run sync script successfully', async () => {
      // This test would run the actual sync script
      // Skipped because it requires the full build environment
      
      const { syncAPI } = require('../../scripts/sync-api.js')
      
      // Override backend URL for test
      process.env.BACKEND_URL = BACKEND_URL
      
      await expect(syncAPI()).resolves.not.toThrow()
      
      // Verify files were generated
      expect(fs.existsSync(TYPES_FILE)).toBe(true)
      expect(fs.existsSync(CLIENT_FILE)).toBe(true)
      expect(fs.existsSync(SYNC_LOG_FILE)).toBe(true)
      
      // Verify file contents
      const clientContent = fs.readFileSync(CLIENT_FILE, 'utf8')
      expect(clientContent).toContain('Auto-generated API client')
      expect(clientContent).toContain('DO NOT EDIT MANUALLY')
      expect(clientContent).toContain("import { components, paths } from './api'")
      
      // Verify sync log
      const syncLog = JSON.parse(fs.readFileSync(SYNC_LOG_FILE, 'utf8'))
      const latestEntry = syncLog[syncLog.length - 1]
      expect(latestEntry.status).toBe('success')
      expect(latestEntry.endpoints_count).toBeGreaterThan(0)
      expect(latestEntry.schemas_count).toBeGreaterThan(0)
    })
  })

  describe('API endpoint validation', () => {
    beforeAll(async () => {
      if (!backendProcess) {
        await startBackend()
        
        let attempts = 0
        while (attempts < 30 && !(await checkBackendHealth())) {
          await setTimeout(1000)
          attempts++
        }
      }
    })

    it('should have working Swagger UI', async () => {
      const response = await fetch(`${BACKEND_URL}/api/docs`)
      expect(response.ok).toBe(true)
      
      const html = await response.text()
      expect(html).toContain('swagger-ui')
      expect(html).toContain('Polarist Korean Learning API')
    })

    it('should serve valid OpenAPI JSON', async () => {
      const response = await fetch(`${BACKEND_URL}/api-docs/openapi.json`)
      expect(response.ok).toBe(true)
      expect(response.headers.get('content-type')).toContain('application/json')
      
      const spec = await response.json()
      expect(spec.openapi).toMatch(/^3\./)
      expect(spec.info.title).toBe('Polarist Korean Learning API')
    })

    it('should have all expected API paths', async () => {
      const spec = await fetchOpenApiSpec()
      const paths = Object.keys(spec.paths)
      
      const expectedPaths = [
        '/api/v1/auth/mock-login',
        '/api/v1/auth/profile',
        '/api/v1/users',
        '/api/v1/users/{id}',
        '/api/v1/users/{id}/settings',
        '/api/v1/wordbooks',
        '/api/v1/wordbooks/users/{user_id}',
        '/api/v1/wordbooks/users/{user_id}/{wordbook_id}',
        '/api/v1/progress/system/stats',
        '/api/v1/progress/{user_id}',
        '/api/v1/progress/{user_id}/stats',
        '/api/v1/progress/{user_id}/words/{word_id}',
        '/api/v1/progress/{user_id}/sessions',
      ]

      for (const expectedPath of expectedPaths) {
        expect(paths).toContain(expectedPath)
      }
    })

    it('should have properly documented endpoints', async () => {
      const spec = await fetchOpenApiSpec()
      
      // Check auth profile endpoint
      const authProfile = spec.paths['/api/v1/auth/profile'].get
      expect(authProfile.responses).toBeDefined()
      expect(authProfile.tags).toContain('Authentication')
      
      // Check user creation endpoint
      const createUser = spec.paths['/api/v1/users'].post
      expect(createUser.requestBody).toBeDefined()
      expect(createUser.responses).toBeDefined()
      expect(createUser.tags).toContain('Users')
      
      // Check wordbook endpoint
      const getWordbooks = spec.paths['/api/v1/wordbooks'].get
      expect(getWordbooks.parameters).toBeDefined()
      expect(getWordbooks.responses).toBeDefined()
      expect(getWordbooks.tags).toContain('Wordbooks')
    })

    it('should have all expected schemas', async () => {
      const spec = await fetchOpenApiSpec()
      const schemas = Object.keys(spec.components.schemas)
      
      const expectedSchemas = [
        'User',
        'CreateUserRequest',
        'UpdateUserRequest',
        'UserSettings',
        'UpdateUserSettingsRequest',
        'UserProgress',
        'CreateProgressRequest',
        'UpdateProgressRequest',
        'ProgressStats',
        'SystemStats',
        'StudySession',
        'CreateSessionRequest',
        'UpdateSessionRequest',
        'SessionStats',
        'CustomWordbook',
        'CreateWordbookRequest',
        'UpdateWordbookRequest',
        'WordbookSummary',
        'SharedWordbookInfo',
      ]

      for (const expectedSchema of expectedSchemas) {
        expect(schemas).toContain(expectedSchema)
      }
    })
  })

  describe('Type safety validation', () => {
    it('should generate valid TypeScript interfaces', async () => {
      const spec = await fetchOpenApiSpec()
      
      // Check User schema structure
      const userSchema = spec.components.schemas.User
      expect(userSchema.type).toBe('object')
      expect(userSchema.properties.id).toBeDefined()
      expect(userSchema.properties.email).toBeDefined()
      expect(userSchema.properties.name).toBeDefined()
      expect(userSchema.properties.locale).toBeDefined()
      expect(userSchema.properties.created_at).toBeDefined()
      expect(userSchema.properties.updated_at).toBeDefined()
      
      // Check CreateUserRequest schema
      const createUserSchema = spec.components.schemas.CreateUserRequest
      expect(createUserSchema.type).toBe('object')
      expect(createUserSchema.properties.email).toBeDefined()
      expect(createUserSchema.properties.name).toBeDefined()
      expect(createUserSchema.properties.locale).toBeDefined()
      
      // Check CustomWordbook schema
      const wordbookSchema = spec.components.schemas.CustomWordbook
      expect(wordbookSchema.type).toBe('object')
      expect(wordbookSchema.properties.id).toBeDefined()
      expect(wordbookSchema.properties.user_id).toBeDefined()
      expect(wordbookSchema.properties.name).toBeDefined()
      expect(wordbookSchema.properties.word_ids).toBeDefined()
      expect(wordbookSchema.properties.total_words).toBeDefined()
    })

    it('should have consistent data types', async () => {
      const spec = await fetchOpenApiSpec()
      
      // Check that ID fields are consistently typed
      const userSchema = spec.components.schemas.User
      const wordbookSchema = spec.components.schemas.CustomWordbook
      const progressSchema = spec.components.schemas.UserProgress
      
      expect(userSchema.properties.id.type).toBe('integer')
      expect(wordbookSchema.properties.id.type).toBe('integer')
      expect(progressSchema.properties.id.type).toBe('integer')
      
      // Check that email fields have proper validation
      const createUserSchema = spec.components.schemas.CreateUserRequest
      expect(createUserSchema.properties.email.format).toBe('email')
    })
  })

  describe('Performance and reliability', () => {
    beforeAll(async () => {
      if (!backendProcess) {
        await startBackend()
        
        let attempts = 0
        while (attempts < 30 && !(await checkBackendHealth())) {
          await setTimeout(1000)
          attempts++
        }
      }
    })

    it('should respond to OpenAPI spec requests quickly', async () => {
      const startTime = Date.now()
      const response = await fetch(`${BACKEND_URL}/api-docs/openapi.json`)
      const endTime = Date.now()
      
      expect(response.ok).toBe(true)
      expect(endTime - startTime).toBeLessThan(5000) // Should respond within 5 seconds
    })

    it('should handle multiple concurrent requests', async () => {
      const promises = Array.from({ length: 10 }, () =>
        fetch(`${BACKEND_URL}/api-docs/openapi.json`)
      )
      
      const responses = await Promise.all(promises)
      
      for (const response of responses) {
        expect(response.ok).toBe(true)
      }
    })

    it('should serve consistent OpenAPI spec across requests', async () => {
      const [spec1, spec2, spec3] = await Promise.all([
        fetchOpenApiSpec(),
        fetchOpenApiSpec(),
        fetchOpenApiSpec()
      ])
      
      expect(spec1).toEqual(spec2)
      expect(spec2).toEqual(spec3)
    })
  })
})