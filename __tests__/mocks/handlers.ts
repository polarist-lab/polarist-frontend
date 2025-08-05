import { http, HttpResponse } from 'msw'

const BASE_URL = '/api/v1'

export const handlers = [
  // Auth endpoints
  http.get(`${BASE_URL}/auth/profile`, () => {
    return HttpResponse.json({
      user: {
        id: 1,
        email: "test@example.com",
        name: "Test User",
        locale: "en",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      message: "User profile retrieved successfully"
    })
  }),

  http.post(`${BASE_URL}/auth/migrate-guest-data`, async ({ request }) => {
    const body = await request.json() as { guest_id: string }
    return HttpResponse.json({
      success: true,
      message: "Guest data migrated successfully",
      guest_id: body.guest_id
    })
  }),

  // User endpoints
  http.post(`${BASE_URL}/users`, async ({ request }) => {
    const body = await request.json() as any
    return HttpResponse.json({
      user: {
        id: Math.floor(Math.random() * 1000),
        email: body.email,
        name: body.name,
        locale: body.locale || "en",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: "User created successfully"
    })
  }),

  http.get(`${BASE_URL}/users/:id`, ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      user: {
        id: parseInt(id as string),
        email: "test@example.com",
        name: "Test User",
        locale: "en",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      message: "User retrieved successfully"
    })
  }),

  http.patch(`${BASE_URL}/users/:id`, async ({ params, request }) => {
    const { id } = params
    const body = await request.json() as any
    return HttpResponse.json({
      user: {
        id: parseInt(id as string),
        email: "test@example.com",
        name: body.name || "Test User",
        locale: body.locale || "en",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: new Date().toISOString()
      },
      message: "User updated successfully"
    })
  }),

  http.get(`${BASE_URL}/users/:id/settings`, ({ params }) => {
    const { id } = params
    return HttpResponse.json({
      settings: {
        id: 1,
        user_id: parseInt(id as string),
        learning_goal: "conversational",
        study_reminders: true,
        email_notifications: true,
        difficulty_level: "intermediate",
        daily_goal: 30,
        preferred_study_time: "morning",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      },
      message: "User settings retrieved successfully"
    })
  }),

  // Wordbook endpoints
  http.get(`${BASE_URL}/wordbooks`, ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    
    return HttpResponse.json({
      wordbooks: Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
        id: i + 1,
        name: `Public Wordbook ${i + 1}`,
        description: `Description for wordbook ${i + 1}`,
        total_words: Math.floor(Math.random() * 100) + 10,
        study_count: Math.floor(Math.random() * 50),
        categories: ["basic", "common"],
        difficulties: ["beginner", "intermediate"],
        tags: ["public", "korean"],
        is_public: true,
        is_shared: true,
        share_code: `share_${i + 1}`,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      })),
      message: "Public wordbooks retrieved successfully"
    })
  }),

  http.get(`${BASE_URL}/wordbooks/users/:userId`, ({ params, request }) => {
    const { userId } = params
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    return HttpResponse.json({
      wordbooks: Array.from({ length: Math.min(limit, 3) }, (_, i) => ({
        id: i + 1,
        name: `User Wordbook ${i + 1}`,
        description: `User's wordbook ${i + 1}`,
        total_words: Math.floor(Math.random() * 50) + 5,
        study_count: Math.floor(Math.random() * 20),
        categories: ["personal"],
        difficulties: ["beginner"],
        tags: ["user", "custom"],
        is_public: false,
        is_shared: false,
        share_code: null,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z"
      })),
      message: "User wordbooks retrieved successfully"
    })
  }),

  http.post(`${BASE_URL}/wordbooks/users/:userId`, async ({ params, request }) => {
    const { userId } = params
    const body = await request.json() as any
    return HttpResponse.json({
      wordbook: {
        id: Math.floor(Math.random() * 1000),
        user_id: parseInt(userId as string),
        name: body.name,
        description: body.description,
        word_ids: JSON.stringify(body.word_ids),
        categories: JSON.stringify(body.categories || []),
        difficulties: JSON.stringify(body.difficulties || []),
        is_public: body.is_public || false,
        is_shared: false,
        share_code: null,
        tags: JSON.stringify(body.tags || []),
        total_words: body.word_ids?.length || 0,
        study_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: "Wordbook created successfully"
    })
  }),

  // Progress endpoints
  http.get(`${BASE_URL}/progress/system/stats`, () => {
    return HttpResponse.json({
      stats: {
        total_unique_words: 1250,
        total_progress_records: 5678
      },
      message: "System-wide statistics retrieved successfully"
    })
  }),

  http.get(`${BASE_URL}/progress/:userId`, ({ params, request }) => {
    const { userId } = params
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '50')
    
    return HttpResponse.json({
      progress: Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: i + 1,
        user_id: parseInt(userId as string),
        word_id: `word_${i + 1}`,
        is_learned: Math.random() > 0.5,
        attempts: Math.floor(Math.random() * 10) + 1,
        correct_answers: Math.floor(Math.random() * 5),
        confidence: Math.floor(Math.random() * 5) + 1,
        last_studied: new Date().toISOString(),
        created_at: "2024-01-01T00:00:00Z",
        updated_at: new Date().toISOString()
      })),
      message: "User progress retrieved successfully"
    })
  }),

  http.get(`${BASE_URL}/progress/:userId/stats`, ({ params }) => {
    const { userId } = params
    return HttpResponse.json({
      stats: {
        total_words: 100,
        learned_words: 35,
        total_attempts: 250,
        total_correct: 180,
        accuracy_percentage: 72.0,
        average_confidence: 3.2,
        words_studied_today: 5,
        current_streak: 7,
        longest_streak: 15
      },
      message: "Progress statistics retrieved successfully"
    })
  }),

  http.post(`${BASE_URL}/progress/:userId/words/:wordId`, async ({ params, request }) => {
    const { userId, wordId } = params
    const body = await request.json() as any
    return HttpResponse.json({
      progress: {
        id: Math.floor(Math.random() * 1000),
        user_id: parseInt(userId as string),
        word_id: wordId as string,
        is_learned: body.is_learned || false,
        attempts: body.attempts || 0,
        correct_answers: body.correct_answers || 0,
        confidence: body.confidence || 0,
        last_studied: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      message: "Word progress created successfully"
    })
  }),

  // Error cases
  http.get(`${BASE_URL}/users/99999`, () => {
    return new HttpResponse(null, { 
      status: 404,
      statusText: 'User not found' 
    })
  }),
]