<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">RBAC System</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/dashboard">Dashboard</router-link>
          </li>
          <li v-if="authStore.hasRole('admin')" class="nav-item">
            <router-link class="nav-link" to="/admin">Admin Panel</router-link>
          </li>
        </ul>
        <div class="navbar-text">
          <span class="me-3 text-light">
            <i class="fas fa-user me-1"></i>
            {{ authStore.user?.name }} ({{ authStore.roles.join(', ') }})
          </span>
          <button class="btn btn-outline-light btn-sm" @click="logout">
            <i class="fas fa-sign-out-alt me-1"></i>Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const logout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>