import { defineStore } from 'pinia'
import axios from 'axios'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    users: [],
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0
    },
    loading: false,
    search: '',
    sortBy: 'id',
    sortOrder: 'desc',
    withPagination: true
  }),

  actions: {
    async fetchUsers(page = 1) {
      this.loading = true
      
      try {
        let url = '/dashboard'
        const params = new URLSearchParams()
        
        if (this.withPagination) {
          params.append('page', page)
          params.append('per_page', this.pagination.per_page)
        }
        
        if (this.search) {
          params.append('search', this.search)
        }
        
        params.append('sort_by', this.sortBy)
        params.append('sort_order', this.sortOrder)
        
        const response = await axios.get(`${url}?${params.toString()}`)
        
        if (this.withPagination && response.data.data) {
          this.users = response.data.data
          this.pagination = {
            current_page: response.data.current_page,
            last_page: response.data.last_page,
            per_page: response.data.per_page,
            total: response.data.total
          }
        } else {
          this.users = response.data
          this.pagination = {
            current_page: 1,
            last_page: 1,
            per_page: this.users.length,
            total: this.users.length
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        this.loading = false
      }
    },

    setSearch(search) {
      this.search = search
      this.fetchUsers(1)
    },

    setSort(column) {
      if (this.sortBy === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortBy = column
        this.sortOrder = 'asc'
      }
      this.fetchUsers(this.pagination.current_page)
    },

    togglePagination() {
      this.withPagination = !this.withPagination
      this.fetchUsers(1)
    }
  }
})