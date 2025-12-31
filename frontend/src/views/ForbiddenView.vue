<template>
  <div>
    <NavBar />
    <div class="container mt-5">
      <div class="alert alert-danger">
        <h4 class="alert-heading">Forbidden</h4>
        <p>You do not have permission to access this page.</p>
        <hr>
        <p class="mb-0">If you believe this is an error, contact the administrator.</p>
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
