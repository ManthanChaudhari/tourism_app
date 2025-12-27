// Auth utility functions for API calls

// Retry configuration
const RETRY_ATTEMPTS = 3
const RETRY_DELAY = 1000 // 1 second

// Helper function to handle network retries
const withRetry = async (fn, attempts = RETRY_ATTEMPTS) => {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn()
    } catch (error) {
      // Don't retry on client errors (4xx) or on the last attempt
      if (error.message.includes('4') || i === attempts - 1) {
        throw error
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)))
    }
  }
}

// Helper function to handle API calls
const apiCall = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
  }

  return data
}

export const authAPI = {
  async register(userData) {
    return withRetry(() => apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }))
  },

  async login(credentials) {
    return withRetry(() => apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }))
  },

  async logout() {
    return withRetry(() => apiCall("/api/auth/logout", {
      method: "POST",
    }))
  },

  async forgotPassword(email) {
    return withRetry(() => apiCall("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }))
  },

  async resetPassword(password) {
    return withRetry(() => apiCall("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ password }),
    }))
  },
}

// Validation utilities
export const validation = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return "Email is required"
    if (!emailRegex.test(email)) return "Invalid email format"
    return null
  },

  password: (password) => {
    if (!password) return "Password is required"
    if (password.length < 6) return "Password must be at least 6 characters long"
    
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    }
    
    return null
  },

  name: (name, fieldName = "Name") => {
    if (!name) return `${fieldName} is required`
    if (name.trim().length === 0) return `${fieldName} cannot be empty`
    if (name.length < 2) return `${fieldName} must be at least 2 characters long`
    return null
  },

  confirmPassword: (password, confirmPassword) => {
    if (!confirmPassword) return "Please confirm your password"
    if (password !== confirmPassword) return "Passwords do not match"
    return null
  }
}

// Error handling utilities
export const errorHandler = {
  getErrorMessage: (error) => {
    if (typeof error === 'string') return error
    if (error?.message) return error.message
    if (error?.error) return error.error
    return "An unexpected error occurred"
  },

  isNetworkError: (error) => {
    const message = errorHandler.getErrorMessage(error).toLowerCase()
    return message.includes('network') || 
           message.includes('fetch') || 
           message.includes('connection') ||
           message.includes('timeout')
  },

  isValidationError: (error) => {
    const message = errorHandler.getErrorMessage(error).toLowerCase()
    return message.includes('invalid') || 
           message.includes('required') || 
           message.includes('format') ||
           message.includes('must contain')
  }
}