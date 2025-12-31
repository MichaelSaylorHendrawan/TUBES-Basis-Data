<template>
  <div>
    <NavBar />
    <div class="container-fluid mt-4">
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                <i class="fas fa-tachometer-alt me-2"></i>User Dashboard
                <span v-if="authStore.hasRole('admin')" class="badge bg-primary ms-2">Admin</span>
                <span v-else-if="authStore.hasRole('editor')" class="badge bg-success ms-2">Editor</span>
                <span v-else class="badge bg-secondary ms-2">Viewer</span>
              </h5>
              
              <div class="btn-group" role="group">
                <button 
                  class="btn btn-outline-primary" 
                  @click="togglePagination"
                  :class="{ active: dashboardStore.withPagination }"
                >
                  <i class="fas fa-file-alt me-1"></i>
                  {{ dashboardStore.withPagination ? 'With Pagination' : 'Without Pagination' }}
                </button>
                
                <button 
                  v-if="authStore.hasRole('admin')" 
                  class="btn btn-outline-danger"
                  @click="stressTest"
                  title="Run Stress Test"
                >
                  <i class="fas fa-bolt me-1"></i>Stress Test
                </button>
              </div>
            </div>
            
            <div class="card-body">
              <!-- Search and Controls -->
              <div class="row mb-4">
                <div class="col-md-6">
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="fas fa-search"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Search by name, email, or department..."
                      v-model="searchInput"
                      @input="onSearch"
                    />
                  </div>
                </div>
                <div class="col-md-6 text-end">
                  <div class="btn-group">
                    <button class="btn btn-outline-info" @click="dashboardStore.fetchUsers(1)">
                      <i class="fas fa-sync-alt" :class="{ 'fa-spin': dashboardStore.loading }"></i>
                      Refresh
                    </button>
                    <button 
                      v-if="authStore.hasPermission('edit data')"
                      class="btn btn-outline-success"
                      @click="showAddModal = true"
                    >
                      <i class="fas fa-plus me-1"></i>Add User
                    </button>
                  </div>
                </div>
              </div>
              
              <!-- Stats Card -->
              <div class="row mb-4" v-if="authStore.hasRole('admin')">
                <div class="col-md-3">
                  <div class="card text-white bg-primary">
                    <div class="card-body">
                      <h6>Total Users</h6>
                      <h4>{{ dashboardStore.pagination.total.toLocaleString() }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-success">
                    <div class="card-body">
                      <h6>Active Users</h6>
                      <h4>{{ activeUsersCount.toLocaleString() }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-info">
                    <div class="card-body">
                      <h6>Current Page</h6>
                      <h4>{{ dashboardStore.pagination.current_page }}</h4>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-warning">
                    <div class="card-body">
                      <h6>Items Per Page</h6>
                      <h4>{{ dashboardStore.pagination.per_page }}</h4>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Table -->
              <div class="table-responsive">
                <table class="table table-hover table-striped">
                  <thead>
                    <tr>
                      <th @click="dashboardStore.setSort('id')" style="cursor: pointer;">
                        ID
                        <i v-if="dashboardStore.sortBy === 'id'" 
                           class="fas" 
                           :class="dashboardStore.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                      </th>
                      <th @click="dashboardStore.setSort('name')" style="cursor: pointer;">
                        Name
                        <i v-if="dashboardStore.sortBy === 'name'" 
                           class="fas" 
                           :class="dashboardStore.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                      </th>
                      <th @click="dashboardStore.setSort('email')" style="cursor: pointer;">
                        Email
                        <i v-if="dashboardStore.sortBy === 'email'" 
                           class="fas" 
                           :class="dashboardStore.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                      </th>
                      <th @click="dashboardStore.setSort('department')" style="cursor: pointer;">
                        Department
                        <i v-if="dashboardStore.sortBy === 'department'" 
                           class="fas" 
                           :class="dashboardStore.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                      </th>
                      <th @click="dashboardStore.setSort('status')" style="cursor: pointer;">
                        Status
                        <i v-if="dashboardStore.sortBy === 'status'" 
                           class="fas" 
                           :class="dashboardStore.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down'"></i>
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="dashboardStore.loading">
                      <td colspan="6" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2">Loading users...</p>
                      </td>
                    </tr>
                    <tr v-else-if="dashboardStore.users.length === 0">
                      <td colspan="6" class="text-center text-muted">
                        <i class="fas fa-database fa-2x mb-2"></i>
                        <p>No users found</p>
                      </td>
                    </tr>
                    <tr v-else v-for="user in dashboardStore.users" :key="user.id">
                      <td>{{ user.id }}</td>
                      <td>{{ user.name }}</td>
                      <td>{{ user.email }}</td>
                      <td>
                        <span class="badge bg-info">{{ user.department }}</span>
                      </td>
                      <td>
                        <span class="badge" :class="getStatusClass(user.status)">
                          {{ user.status }}
                        </span>
                      </td>
                      <td>
                        <button 
                          v-if="authStore.hasPermission('edit data')"
                          class="btn btn-sm btn-outline-primary me-1"
                          @click="editUser(user)"
                        >
                          <i class="fas fa-edit"></i>
                        </button>
                        <button 
                          v-if="authStore.hasPermission('delete data') && authStore.hasRole('admin')"
                          class="btn btn-sm btn-outline-danger"
                          @click="deleteUser(user.id)"
                        >
                          <i class="fas fa-trash"></i>
                        </button>
                        <span v-else class="text-muted">No actions</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Pagination -->
              <div v-if="dashboardStore.withPagination && dashboardStore.pagination.last_page > 1" 
                   class="d-flex justify-content-center mt-4">
                <nav>
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: dashboardStore.pagination.current_page === 1 }">
                      <button class="page-link" @click="changePage(dashboardStore.pagination.current_page - 1)">
                        Previous
                      </button>
                    </li>
                    
                    <li v-for="page in pageRange" 
                        :key="page" 
                        class="page-item" 
                        :class="{ active: page === dashboardStore.pagination.current_page }">
                      <button class="page-link" @click="changePage(page)">
                        {{ page }}
                      </button>
                    </li>
                    
                    <li class="page-item" :class="{ disabled: dashboardStore.pagination.current_page === dashboardStore.pagination.last_page }">
                      <button class="page-link" @click="changePage(dashboardStore.pagination.current_page + 1)">
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
              
              <!-- Info Footer -->
              <div class="mt-3 text-muted small">
                <p>
                  <i class="fas fa-info-circle me-1"></i>
                  Showing 
                  <strong>{{ dashboardStore.users.length }}</strong> of 
                  <strong>{{ dashboardStore.pagination.total.toLocaleString() }}</strong> users
                  <span v-if="dashboardStore.withPagination">
                    (Page {{ dashboardStore.pagination.current_page }} of {{ dashboardStore.pagination.last_page }})
                  </span>
                  <span v-else>
                    (All data loaded - Use with caution for large datasets)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useDashboardStore } from '../stores/dashboard'
import { useProductStore } from '../stores/products'
import ProductListView from './ProductListView.vue'
import NavBar from '../components/NavBar.vue'

              <!-- User Table (admin/editor) or Product List (viewer) -->
              <div v-if="authStore.hasRole('admin') || authStore.hasRole('editor')">
                <div class="table-responsive">
                  <!-- ...existing code for user table... -->
                </div>
              </div>
              <div v-else>
                <ProductListView />
              </div>