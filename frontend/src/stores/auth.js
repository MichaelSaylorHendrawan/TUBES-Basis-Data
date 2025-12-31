import { defineStore } from 'pinia'
import axios from 'axios'

// DEV ONLY: set to true to mock an authenticated user with selectable role (do NOT commit)
const DEV_AUTH = true
// Set development role for quick preview: 'admin' | 'editor' | 'viewer'
const DEV_AUTH_ROLE = 'viewer'

const ROLE_PERMISSIONS = {
  admin: ['view dashboard', 'edit data', 'delete data', 'manage users'],
  editor: ['view dashboard', 'edit data'],
  viewer: ['view dashboard']
}

if (DEV_AUTH) {
  // set token in localStorage and axios header for local development
  localStorage.setItem('token', 'dev-token')
  axios.defaults.headers.common['Authorization'] = `Bearer dev-token`
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: DEV_AUTH ? { id: 1, name: `${DEV_AUTH_ROLE.charAt(0).toUpperCase() + DEV_AUTH_ROLE.slice(1)} User`, email: `${DEV_AUTH_ROLE}@example.com` } : null,
    roles: DEV_AUTH ? [DEV_AUTH_ROLE] : [],
    permissions: DEV_AUTH ? ROLE_PERMISSIONS[DEV_AUTH_ROLE] : [],
    token: DEV_AUTH ? 'dev-token' : (localStorage.getItem('token') || null),
    isAuthenticated: DEV_AUTH ? true : false
  }),

  actions: {
    async login(credentials) {
      // DEV: If DEV_AUTH is enabled, skip backend and set mock user
      if (DEV_AUTH) {
        // Use DEV_AUTH_ROLE and ROLE_PERMISSIONS mapping
        this.user = { id: 1, name: `${DEV_AUTH_ROLE.charAt(0).toUpperCase() + DEV_AUTH_ROLE.slice(1)} User`, email: `${DEV_AUTH_ROLE}@example.com` }
        this.roles = [DEV_AUTH_ROLE]
        this.permissions = ROLE_PERMISSIONS[DEV_AUTH_ROLE] || []
        this.token = 'dev-token'
        this.isAuthenticated = true

        // Save token to localStorage and set axios header
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`

        return { success: true, data: { user: this.user, roles: this.roles, permissions: this.permissions, token: this.token } }
      }

      try {
        const response = await axios.post('/login', credentials)
        
        this.user = response.data.user
        this.roles = response.data.roles
        this.permissions = response.data.permissions
        this.token = response.data.token
        this.isAuthenticated = true
        
        // Save token to localStorage
        localStorage.setItem('token', this.token)
        
        // Set default axios header
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return { success: true, data: response.data }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Login failed' }
      }
    },

    async logout() {
      try {
        await axios.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      }
      
      // Clear state
      this.user = null
      this.roles = []
      this.permissions = []
      this.token = null
      this.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('token')
      
      // Remove axios header
      delete axios.defaults.headers.common['Authorization']
    },

    async register(credentials) {
      // DEV: simulate register
      if (DEV_AUTH) {
        this.user = { id: Date.now(), name: credentials.name || credentials.email.split('@')[0], email: credentials.email }
        this.roles = ['viewer']
        this.permissions = ROLE_PERMISSIONS['viewer']
        this.token = 'dev-token'
        this.isAuthenticated = true
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return { success: true, data: { user: this.user } }
      }

      try {
        const response = await axios.post('/register', credentials)
        this.user = response.data.user
        this.roles = response.data.roles || []
        this.permissions = response.data.permissions || []
        this.token = response.data.token
        this.isAuthenticated = true
        localStorage.setItem('token', this.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return { success: true, data: response.data }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Register failed' }
      }
    },

    async forgotPassword(email) {
      const maskEmail = (e) => {
        const [local, domain] = e.split('@')
        const mask = s => {
          if (!s) return ''
          if (s.length <= 2) return s[0] + '*'
          return s[0] + '*'.repeat(Math.max(1, s.length - 2)) + s[s.length -1]
        }
        const domainParts = domain ? domain.split('.') : ['']
        const maskedDomain = domainParts.map(p => mask(p)).join('.')
        return `${mask(local)}@${maskedDomain}`
      }

      if (DEV_AUTH) {
        return { success: true, message: `Jika email terdaftar, instruksi reset telah dikirim ke ${maskEmail(email)}`, masked: maskEmail(email) }
      }

      try {
        const response = await axios.post('/password/forgot', { email })
        return { success: true, message: response.data.message || 'Password reset sent' }
      } catch (error) {
        return { success: false, message: error.response?.data?.message || 'Request failed' }
      }
    },

    async checkAuth() {
      if (DEV_AUTH) return true
      if (!this.token) return false
      
      try {
        const response = await axios.get('/user')
        
        this.user = response.data.user
        this.roles = response.data.roles
        this.permissions = response.data.permissions
        this.isAuthenticated = true
        
        return true
      } catch (error) {
        this.logout()
        return false
      }
    },

    hasRole(role) {
      return this.roles.includes(role)
    },

    hasPermission(permission) {
      return this.permissions.includes(permission)
    }
  }
})