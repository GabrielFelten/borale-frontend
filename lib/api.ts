// Funções utilitárias para chamadas à API
// Estas funções serão usadas quando a API estiver pronta

export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

// Funções específicas para cada recurso

export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  signup: async (email: string, password: string, name: string) => {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    })
  },
}

export const userApi = {
  getProfile: async (userId: string) => {
    return apiRequest(`/api/users/${userId}`)
  },

  updateProfile: async (userId: string, data: any) => {
    return apiRequest(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

export const booksApi = {
  getAll: async () => {
    return apiRequest("/api/books")
  },

  getUserBooks: async (userId: string) => {
    return apiRequest(`/api/users/${userId}/books`)
  },

  create: async (userId: string, bookData: any) => {
    return apiRequest(`/api/users/${userId}/books`, {
      method: "POST",
      body: JSON.stringify(bookData),
    })
  },

  update: async (userId: string, bookId: number, bookData: any) => {
    return apiRequest(`/api/users/${userId}/books/${bookId}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    })
  },

  delete: async (userId: string, bookId: number) => {
    return apiRequest(`/api/users/${userId}/books/${bookId}`, {
      method: "DELETE",
    })
  },
}