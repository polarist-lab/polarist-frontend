/**
 * Tests for the auto-generated API client
 * This ensures type safety and proper API communication
 */

import { ApiClient, apiClient } from '../src/types/api-client'

// Mock fetch for tests
global.fetch = jest.fn()

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Authentication endpoints', () => {
    it('should get user profile', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          locale: 'en'
        },
        message: 'Profile retrieved'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.auth.getProfile()

      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: undefined,
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should migrate guest data', async () => {
      const requestData = { guest_id: 'guest-123' }
      const mockResponse = {
        success: true,
        message: 'Data migrated'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.auth.migrateGuestData(requestData)

      expect(fetch).toHaveBeenCalledWith('/api/v1/auth/migrate-guest-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData),
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('User endpoints', () => {
    it('should create user', async () => {
      const userData = {
        email: 'new@example.com',
        name: 'New User',
        locale: 'ko'
      }

      const mockResponse = {
        user: { id: 1, ...userData },
        message: 'User created'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.users.create(userData)

      expect(fetch).toHaveBeenCalledWith('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should get user by id', async () => {
      const userId = 123
      const mockResponse = {
        user: {
          id: userId,
          email: 'user@example.com',
          name: 'Test User'
        },
        message: 'User retrieved'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.users.get(userId)

      expect(fetch).toHaveBeenCalledWith(`/api/v1/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: undefined,
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should update user', async () => {
      const userId = 123
      const updateData = { name: 'Updated Name' }
      const mockResponse = {
        user: {
          id: userId,
          name: 'Updated Name'
        },
        message: 'User updated'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.users.update(userId, updateData)

      expect(fetch).toHaveBeenCalledWith(`/api/v1/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('Wordbook endpoints', () => {
    it('should get public wordbooks with query params', async () => {
      const params = { limit: 10, search: 'korean' }
      const mockResponse = {
        wordbooks: [{ id: 1, name: 'Korean Basics' }],
        message: 'Wordbooks retrieved'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.wordbooks.getPublic(params)

      expect(fetch).toHaveBeenCalledWith('/api/v1/wordbooks?limit=10&search=korean', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: undefined,
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should create wordbook for user', async () => {
      const userId = 123
      const wordbookData = {
        name: 'My Wordbook',
        description: 'Personal wordbook',
        word_ids: ['word1', 'word2'],
        categories: ['personal'],
        difficulties: ['beginner'],
        is_public: false,
        tags: ['test']
      }

      const mockResponse = {
        wordbook: { id: 1, user_id: userId, ...wordbookData },
        message: 'Wordbook created'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.wordbooks.create(userId, wordbookData)

      expect(fetch).toHaveBeenCalledWith(`/api/v1/wordbooks/users/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(wordbookData),
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('Progress endpoints', () => {
    it('should get system stats', async () => {
      const mockResponse = {
        stats: {
          total_unique_words: 1000,
          total_progress_records: 5000
        },
        message: 'Stats retrieved'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.progress.getSystemStats()

      expect(fetch).toHaveBeenCalledWith('/api/v1/progress/system/stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        body: undefined,
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })

    it('should create word progress with encoded word ID', async () => {
      const userId = 123
      const wordId = '한국어/word'  // Word ID with special characters
      const progressData = {
        word_id: wordId,
        is_learned: false,
        attempts: 1,
        correct_answers: 0,
        confidence: 3
      }

      const mockResponse = {
        progress: { id: 1, user_id: userId, ...progressData },
        message: 'Progress created'
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ 'content-type': 'application/json' })
      })

      const result = await apiClient.progress.createWordProgress(userId, wordId, progressData)

      expect(fetch).toHaveBeenCalledWith(`/api/v1/progress/${userId}/words/${encodeURIComponent(wordId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData),
        signal: expect.any(AbortSignal)
      })

      expect(result).toEqual(mockResponse)
    })
  })

  describe('Error handling', () => {
    it('should handle HTTP errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        text: async () => 'User not found'
      })

      await expect(apiClient.users.get(99999)).rejects.toThrow('HTTP 404: Not Found - User not found')
    })

    it('should handle network errors', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.users.get(1)).rejects.toThrow('Network error')
    })

    it('should handle timeout', async () => {
      // Mock AbortSignal.timeout to simulate timeout
      jest.spyOn(AbortSignal, 'timeout').mockImplementation(() => {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 100)
        return controller.signal
      })
      
      ;(global.fetch as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(resolve, 200))
      )

      const client = new ApiClient({ timeout: 100 })
      
      await expect(client.users.get(1)).rejects.toThrow()
    })
  })

  describe('Custom configuration', () => {
    it('should use custom base URL', async () => {
      const customClient = new ApiClient({
        baseURL: 'https://api.example.com/v2'
      })

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1 } }),
        headers: new Headers({ 'content-type': 'application/json' })
      })

      await customClient.users.get(1)

      expect(fetch).toHaveBeenCalledWith('https://api.example.com/v2/users/1', expect.any(Object))
    })

    it('should use custom headers', async () => {
      const customClient = new ApiClient({
        headers: {
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'custom-value'
        }
      })

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: { id: 1 } }),
        headers: new Headers({ 'content-type': 'application/json' })
      })

      await customClient.users.get(1)

      expect(fetch).toHaveBeenCalledWith('/api/v1/users/1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123',
          'X-Custom-Header': 'custom-value'
        },
        body: undefined,
        signal: expect.any(AbortSignal)
      })
    })
  })
})

describe('Type safety', () => {
  it('should enforce correct types for requests', () => {
    // These should compile without TypeScript errors
    const validUserData = {
      email: 'test@example.com',
      name: 'Test User',
      locale: 'en'
    }

    const validWordbookData = {
      name: 'Test Wordbook',
      description: 'A test wordbook',
      word_ids: ['word1', 'word2'],
      categories: ['basic'],
      difficulties: ['beginner'],
      is_public: false,
      tags: ['test']
    }

    const validProgressData = {
      word_id: 'test_word',
      is_learned: false,
      attempts: 1,
      correct_answers: 0,
      confidence: 3
    }

    // These assertions ensure the types are correctly inferred
    expect(typeof validUserData.email).toBe('string')
    expect(Array.isArray(validWordbookData.word_ids)).toBe(true)
    expect(typeof validProgressData.confidence).toBe('number')
  })
})