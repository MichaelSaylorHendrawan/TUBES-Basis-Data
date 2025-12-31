import { defineStore } from 'pinia'
import axios from 'axios'

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    total: 0,
    loading: false,
    error: '',
    page: 1,
    perPage: 10,
    search: '',
    sort: 'name',
    sortDir: 'asc',
  }),
  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = ''
      try {
        const { page = this.page, perPage = this.perPage, search = this.search, sort = this.sort, sortDir = this.sortDir } = params
        const res = await axios.get('/api/products', {
          params: { page, per_page: perPage, search, sort, sort_dir: sortDir }
        })
        this.products = res.data.data
        this.total = res.data.total
        this.page = page
        this.perPage = perPage
        this.search = search
        this.sort = sort
        this.sortDir = sortDir
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Failed to fetch products'
      }
      this.loading = false
    },
    setPage(page) {
      this.page = page
      this.fetchProducts({ page })
    },
    setSearch(search) {
      this.search = search
      this.fetchProducts({ search, page: 1 })
    },
    setSort(sort, sortDir = 'asc') {
      this.sort = sort
      this.sortDir = sortDir
      this.fetchProducts({ sort, sortDir })
    }
  }
})
