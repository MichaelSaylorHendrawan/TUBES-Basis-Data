import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    roles: [],
    permissions: [],
    token: localStorage.getItem('token') || null,
    isAuthenticated: false
  }),

  actions: {
    async login(credentials) {
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

    async checkAuth() {
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