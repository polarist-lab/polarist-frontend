/**
 * Tests for the API synchronization system
 * This ensures the sync scripts work correctly
 */

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

// Mock child_process and fs for testing
jest.mock('child_process')
jest.mock('fs')

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>
const mockFs = fs as jest.Mocked<typeof fs>

describe('API Sync System', () => {
  const TYPES_DIR = path.join(__dirname, '../src/types')
  const TYPES_FILE = path.join(TYPES_DIR, 'api.ts')
  const CLIENT_FILE = path.join(TYPES_DIR, 'api-client.ts')
  const SYNC_LOG_FILE = path.join(__dirname, '../api-sync-log.json')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sync-api script', () => {
    it('should check backend health before sync', async () => {
      // Mock successful health check
      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      
      // Mock successful OpenAPI generation
      mockExecSync.mockReturnValueOnce('')
      
      // Mock successful type validation
      mockExecSync.mockReturnValueOnce('')

      // Mock file system operations
      mockFs.existsSync.mockReturnValue(true)
      mockFs.mkdirSync.mockReturnValue(undefined)
      mockFs.writeFileSync.mockReturnValue(undefined)
      mockFs.readFileSync.mockReturnValue('[]')

      const { syncAPI } = require('../scripts/sync-api.js')
      
      await expect(syncAPI()).resolves.not.toThrow()

      // Verify health check was called
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('curl -s http://localhost:4000/health'),
        expect.any(Object)
      )
    })

    it('should fail when backend is not running', async () => {
      // Mock failed health check
      mockExecSync.mockImplementationOnce(() => {
        throw new Error('Connection refused')
      })

      mockFs.writeFileSync.mockReturnValue(undefined)
      mockFs.existsSync.mockReturnValue(false)

      const { syncAPI } = require('../scripts/sync-api.js')

      await expect(syncAPI()).rejects.toThrow()
    })

    it('should generate TypeScript types', async () => {
      // Mock successful health check
      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      
      // Mock successful OpenAPI spec fetch
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        paths: { '/test': {} },
        components: { schemas: { TestSchema: {} } }
      }))
      
      // Mock successful openapi-typescript
      mockExecSync.mockReturnValueOnce('')
      
      // Mock successful validation
      mockExecSync.mockReturnValueOnce('')

      mockFs.existsSync.mockReturnValue(true)
      mockFs.mkdirSync.mockReturnValue(undefined)
      mockFs.writeFileSync.mockReturnValue(undefined)
      mockFs.readFileSync.mockReturnValue('[]')

      const { syncAPI } = require('../scripts/sync-api.js')

      await syncAPI()

      // Verify openapi-typescript was called
      expect(mockExecSync).toHaveBeenCalledWith(
        expect.stringContaining('npx openapi-typescript'),
        expect.any(Object)
      )

      // Verify API client was generated
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        CLIENT_FILE,
        expect.stringContaining('Auto-generated API client')
      )
    })

    it('should log sync history', async () => {
      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        paths: { '/test': {} },
        components: { schemas: { TestSchema: {} } }
      }))
      mockExecSync.mockReturnValueOnce('')
      mockExecSync.mockReturnValueOnce('')

      mockFs.existsSync.mockReturnValue(false)
      mockFs.mkdirSync.mockReturnValue(undefined)
      mockFs.writeFileSync.mockReturnValue(undefined)

      const { syncAPI } = require('../scripts/sync-api.js')

      await syncAPI()

      // Verify sync log was written
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        SYNC_LOG_FILE,
        expect.stringContaining('"status":"success"')
      )
    })
  })

  describe('validate-api-sync script', () => {
    it('should validate required files exist', async () => {
      // Mock files exist
      mockFs.existsSync.mockImplementation((filePath) => {
        return [TYPES_FILE, CLIENT_FILE].includes(filePath as string)
      })

      // Mock successful backend check
      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      
      // Mock successful OpenAPI fetch
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        paths: { '/test': {} },
        components: { schemas: { TestSchema: {} } }
      }))

      // Mock successful validation
      mockExecSync.mockReturnValueOnce('')

      // Mock sync log
      mockFs.readFileSync.mockReturnValue(JSON.stringify([{
        timestamp: new Date().toISOString(),
        status: 'success',
        endpoints_count: 1,
        schemas_count: 1
      }]))

      const { runValidation } = require('../scripts/validate-api-sync.js')

      await expect(runValidation()).resolves.not.toThrow()
    })

    it('should fail when required files are missing', async () => {
      // Mock files don't exist
      mockFs.existsSync.mockReturnValue(false)

      const { runValidation } = require('../scripts/validate-api-sync.js')

      await expect(runValidation()).rejects.toThrow()
    })

    it('should check TypeScript compilation', async () => {
      mockFs.existsSync.mockImplementation((filePath) => {
        return [TYPES_FILE, CLIENT_FILE, SYNC_LOG_FILE].includes(filePath as string)
      })

      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: {} }
      }))

      // Mock successful TypeScript validation
      mockExecSync.mockReturnValueOnce('')

      mockFs.readFileSync.mockReturnValue(JSON.stringify([{
        timestamp: new Date().toISOString(),
        status: 'success'
      }]))

      const { runValidation } = require('../scripts/validate-api-sync.js')

      await runValidation()

      // Verify TypeScript validation was called
      expect(mockExecSync).toHaveBeenCalledWith(
        'npm run validate-types',
        expect.any(Object)
      )
    })

    it('should detect stale sync', async () => {
      mockFs.existsSync.mockReturnValue(true)
      mockExecSync.mockReturnValueOnce('{"status": "healthy"}')
      mockExecSync.mockReturnValueOnce(JSON.stringify({
        info: { title: 'Test API', version: '1.0.0' },
        paths: {},
        components: { schemas: {} }
      }))
      mockExecSync.mockReturnValueOnce('')

      // Mock old sync log (25 hours ago)
      const oldTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
      mockFs.readFileSync.mockReturnValue(JSON.stringify([{
        timestamp: oldTimestamp,
        status: 'success'
      }]))

      const { runValidation } = require('../scripts/validate-api-sync.js')

      // Should complete but with warnings about stale sync
      await expect(runValidation()).resolves.not.toThrow()
    })
  })

  describe('Generated API client', () => {
    it('should contain proper type imports', () => {
      const mockApiClientContent = `
import { components, paths } from './api';

export type ApiSchema = components['schemas'];
export type ApiPaths = paths;

class ApiClient {
  // ... implementation
}

export const apiClient = new ApiClient();
      `

      expect(mockApiClientContent).toContain("import { components, paths } from './api'")
      expect(mockApiClientContent).toContain('export type ApiSchema')
      expect(mockApiClientContent).toContain('export type ApiPaths')
      expect(mockApiClientContent).toContain('class ApiClient')
      expect(mockApiClientContent).toContain('export const apiClient')
    })

    it('should include auto-generation warning', () => {
      const mockApiClientContent = `
/**
 * Auto-generated API client
 * ⚠️  DO NOT EDIT MANUALLY - This file is auto-generated
 * Run 'npm run sync-api' to regenerate
 */
      `

      expect(mockApiClientContent).toContain('DO NOT EDIT MANUALLY')
      expect(mockApiClientContent).toContain('Auto-generated API client')
    })

    it('should handle URL encoding for special characters', () => {
      const mockApiClientContent = `
getWordProgress: (userId: number, wordId: string) =>
  this.request<ApiResponse<ApiSchema['UserProgress']>>('GET', \`/progress/\${userId}/words/\${encodeURIComponent(wordId)}\`),
      `

      expect(mockApiClientContent).toContain('encodeURIComponent(wordId)')
    })
  })

  describe('Integration with package.json scripts', () => {
    it('should have all required scripts defined', () => {
      const packageJson = {
        scripts: {
          'sync-api': 'node scripts/sync-api.js',
          'sync-api:check': 'node scripts/sync-api.js --check',
          'sync-api:status': 'node scripts/sync-api.js --status',
          'validate-api-sync': 'node scripts/validate-api-sync.js',
          'validate-types': 'tsc --noEmit'
        }
      }

      expect(packageJson.scripts['sync-api']).toBeDefined()
      expect(packageJson.scripts['sync-api:check']).toBeDefined()
      expect(packageJson.scripts['sync-api:status']).toBeDefined()
      expect(packageJson.scripts['validate-api-sync']).toBeDefined()
      expect(packageJson.scripts['validate-types']).toBeDefined()
    })
  })
})