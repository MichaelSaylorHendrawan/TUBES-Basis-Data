<template>
  <div>
    <NavBar />
    <div class="container mt-4">
      <div class="card">
        <div class="card-body">
          <h3>Admin Panel</h3>
          <p>This is a placeholder Admin view. Only users with the <strong>admin</strong> role should access this page.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from '../components/NavBar.vue'
</script>

<style scoped>
.container { max-width: 900px; }
</style>
