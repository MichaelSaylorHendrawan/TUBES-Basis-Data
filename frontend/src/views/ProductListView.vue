<template>
  <div class="container py-4">
    <h2 class="mb-4">Porsche Showroom Products</h2>
    <div class="row mb-3">
      <div class="col-md-6">
        <input v-model="search" @keyup.enter="onSearch" class="form-control" placeholder="Search by name or category..." />
      </div>
      <div class="col-md-6 text-end">
        <button class="btn btn-primary" @click="onSearch">Search</button>
      </div>
    </div>
    <div v-if="productStore.loading" class="text-center my-4">
      <span class="spinner-border"></span> Loading products...
    </div>
    <div v-else>
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th @click="sort('name')">Name <i :class="sortIcon('name')"></i></th>
            <th @click="sort('category')">Category <i :class="sortIcon('category')"></i></th>
            <th @click="sort('price')">Price <i :class="sortIcon('price')"></i></th>
            <th @click="sort('stock')">Stock <i :class="sortIcon('stock')"></i></th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in productStore.products" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.category }}</td>
            <td>Rp {{ p.price.toLocaleString() }}</td>
            <td>{{ p.stock }}</td>
            <td>
              <span :class="statusClass(p.status)">{{ p.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="productStore.total > productStore.perPage" class="d-flex justify-content-center mt-3">
        <nav>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: productStore.page === 1 }">
              <a class="page-link" href="#" @click.prevent="setPage(productStore.page - 1)">Prev</a>
            </li>
            <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: n === productStore.page }">
              <a class="page-link" href="#" @click.prevent="setPage(n)">{{ n }}</a>
            </li>
            <li class="page-item" :class="{ disabled: productStore.page === totalPages }">
              <a class="page-link" href="#" @click.prevent="setPage(productStore.page + 1)">Next</a>
            </li>
          </ul>
        </nav>
      </div>
      <div v-if="productStore.error" class="alert alert-danger mt-3">{{ productStore.error }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()
const search = ref(productStore.search)

const onSearch = () => {
  productStore.setSearch(search.value)
}

const sort = (field) => {
  let dir = 'asc'
  if (productStore.sort === field && productStore.sortDir === 'asc') dir = 'desc'
  productStore.setSort(field, dir)
}

const sortIcon = (field) => {
  if (productStore.sort !== field) return 'fas fa-sort text-muted'
  return productStore.sortDir === 'asc' ? 'fas fa-sort-up text-primary' : 'fas fa-sort-down text-primary'
}

const setPage = (n) => {
  if (n < 1 || n > totalPages.value) return
  productStore.setPage(n)
}

const totalPages = computed(() => Math.ceil(productStore.total / productStore.perPage))

const statusClass = (status) => {
  if (status === 'available') return 'badge bg-success'
  if (status === 'sold') return 'badge bg-secondary'
  if (status === 'reserved') return 'badge bg-warning text-dark'
  return 'badge bg-light text-dark'
}

onMounted(() => {
  productStore.fetchProducts()
})
</script>
