// Comprehensive form validation utilities

// Email validation
export const validateEmail = (email) => {
  if (!email) return "Email is required"
  if (typeof email !== 'string') return "Email must be a string"
  
  const trimmedEmail = email.trim()
  if (!trimmedEmail) return "Email cannot be empty"
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) return "Invalid email format"
  
  if (trimmedEmail.length > 254) return "Email is too long"
  
  return null
}

// Password validation
export const validatePassword = (password) => {
  if (!password) return "Password is required"
  if (typeof password !== 'string') return "Password must be a string"
  
  if (password.length < 6) return "Password must be at least 6 characters long"
  if (password.length > 128) return "Password is too long"
  
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  
  if (!hasUpperCase) return "Password must contain at least one uppercase letter"
  if (!hasLowerCase) return "Password must contain at least one lowercase letter"
  if (!hasNumbers) return "Password must contain at least one number"
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'password123', 'admin', 'qwerty']
  if (commonPasswords.includes(password.toLowerCase())) {
    return "Password is too common, please choose a stronger password"
  }
  
  return null
}

// Name validation
export const validateName = (name, fieldName = "Name") => {
  if (!name) return `${fieldName} is required`
  if (typeof name !== 'string') return `${fieldName} must be a string`
  
  const trimmedName = name.trim()
  if (!trimmedName) return `${fieldName} cannot be empty`
  
  if (trimmedName.length < 2) return `${fieldName} must be at least 2 characters long`
  if (trimmedName.length > 50) return `${fieldName} is too long`
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/
  if (!nameRegex.test(trimmedName)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
  }
  
  return null
}

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password"
  if (password !== confirmPassword) return "Passwords do not match"
  return null
}

// Registration form validation
export const validateRegistrationForm = (formData) => {
  const errors = {}
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  
  const firstNameError = validateName(formData.firstName, "First name")
  if (firstNameError) errors.firstName = firstNameError
  
  const lastNameError = validateName(formData.lastName, "Last name")
  if (lastNameError) errors.lastName = lastNameError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {}
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  if (!formData.password) {
    errors.password = "Password is required"
  } else if (formData.password.trim().length === 0) {
    errors.password = "Password cannot be empty"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Forgot password form validation
export const validateForgotPasswordForm = (formData) => {
  const errors = {}
  
  const emailError = validateEmail(formData.email)
  if (emailError) errors.email = emailError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Reset password form validation
export const validateResetPasswordForm = (formData) => {
  const errors = {}
  
  const passwordError = validatePassword(formData.password)
  if (passwordError) errors.password = passwordError
  
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword)
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Real-time validation hook for forms
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  
  const validateField = (name, value) => {
    if (validationRules[name]) {
      return validationRules[name](value, values)
    }
    return null
  }
  
  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }
  
  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }))
    
    const error = validateField(name, values[name])
    setErrors(prev => ({ ...prev, [name]: error }))
  }
  
  const validateAll = () => {
    const newErrors = {}
    let isValid = true
    
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name])
      if (error) {
        newErrors[name] = error
        isValid = false
      }
    })
    
    setErrors(newErrors)
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true
      return acc
    }, {}))
    
    return isValid
  }
  
  const reset = () => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
  }
  
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  }
}

// Sanitization utilities
export const sanitize = {
  email: (email) => email?.trim().toLowerCase() || '',
  name: (name) => name?.trim().replace(/\s+/g, ' ') || '',
  password: (password) => password || '' // Don't trim passwords as spaces might be intentional
}

// Error message formatting
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  if (error?.error) return error.error
  return "An unexpected error occurred"
}

// Success message formatting
export const formatSuccessMessage = (message, defaultMessage = "Operation completed successfully") => {
  if (typeof message === 'string') return message
  if (message?.message) return message.message
  return defaultMessage
}