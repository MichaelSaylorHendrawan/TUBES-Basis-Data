<template>
  <div class="login-container">
    <div class="row justify-content-center align-items-center min-vh-100">
      <div class="col-md-4 col-sm-8">
        <div class="card shadow-lg">
          <div class="card-header bg-primary text-white text-center">
            <h4><i class="fas fa-lock me-2"></i>RBAC System Login</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" v-model="form.email" required ref="loginEmail">
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" class="form-control" v-model="form.password" required>
              </div>
              <div class="mb-3">
                <p class="text-muted small">
                  <strong>Test Accounts:</strong><br>
                  Admin: admin@example.com / password<br>
                  Editor: editor@example.com / password<br>
                  Viewer: viewer@example.com / password
                </p>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  <i class="fas fa-sign-in-alt me-2"></i>Login
                </button>
              </div>

              <div class="d-flex justify-content-between mt-3">
                <a href="#" @click.prevent="showRegister = true">Create an account</a>
                <a href="#" @click.prevent="showForgot = true">Forgot password?</a>
              </div>

              <div v-if="error" class="alert alert-danger mt-3">
                {{ error }}
              </div>
            </form>

            <!-- Register Modal (simple inline) -->
            <div v-if="showRegister" class="modal-backdrop">
              <div class="modal-dialog modal-sm modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Create Account</h5>
                    <button type="button" class="btn-close" @click="showRegister = false"></button>
                  </div>
                  <div class="modal-body">
                    <div v-if="registerMessage" class="alert alert-info">{{ registerMessage }}</div>
                    <div class="mb-3">
                      <label class="form-label">Name</label>
                      <input class="form-control" v-model="registerForm.name" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" v-model="registerForm.email" />
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Password</label>
                      <input type="password" class="form-control" v-model="registerForm.password" />
                    </div>
                    <div class="d-grid">
                      <button class="btn btn-success" @click="handleRegister" :disabled="registerLoading">
                        <span v-if="registerLoading" class="spinner-border spinner-border-sm me-2"></span>
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Forgot Password Modal (styled like Login) -->
            <div v-if="showForgot" class="modal-backdrop">
              <div class="modal-dialog modal-dialog-centered">
                <div class="card shadow-lg">
                  <div class="card-header bg-warning text-dark text-center">
                    <h5 class="mb-0">Forgot Password</h5>
                  </div>
                  <div class="card-body">
                    <p class="text-muted small">Enter your email and we'll send reset instructions. We will show a partially masked email in the confirmation.</p>

                    <div v-if="forgotMessage" class="alert alert-info">{{ forgotMessage }}</div>

                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input type="email" class="form-control" v-model="forgotEmail" />
                    </div>

                    <div class="d-grid mb-2">
                      <button class="btn btn-warning" @click="handleForgot" :disabled="forgotLoading">
                        <span v-if="forgotLoading" class="spinner-border spinner-border-sm me-2"></span>
                        Send Reset Link
                      </button>
                    </div>

                    <div class="text-center">
                      <a href="#" @click.prevent="handleBackToLogin">Sudah punya password? Login</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

// Register / Forgot Password UI state
const showRegister = ref(false)
const showForgot = ref(false)
const registerForm = ref({ name: '', email: '', password: '' })
const registerLoading = ref(false)
const registerMessage = ref('')
const forgotEmail = ref('')
const forgotLoading = ref(false)
const forgotMessage = ref('')
// ref to focus login email input when returning from forgot modal
const loginEmail = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    router.push('/dashboard')
  } else {
    error.value = result.message
  }
  
  loading.value = false
}

const handleRegister = async () => {
  registerLoading.value = true
  registerMessage.value = ''
  const result = await authStore.register(registerForm.value)
  if (result.success) {
    registerMessage.value = 'Account created — you are now logged in.'
    showRegister.value = false
    router.push('/dashboard')
  } else {
    registerMessage.value = result.message || 'Register failed'
  }
  registerLoading.value = false
}

const handleForgot = async () => {
  forgotLoading.value = true
  forgotMessage.value = ''
  const result = await authStore.forgotPassword(forgotEmail.value)
  if (result.success) {
    forgotMessage.value = result.message || 'If the email exists, reset instructions were sent.'
  } else {
    forgotMessage.value = result.message || 'Request failed'
  }
  forgotLoading.value = false
}

const handleBackToLogin = () => {
  // Close forgot modal, copy email back to login and focus
  showForgot.value = false
  if (forgotEmail.value) form.value.email = forgotEmail.value
  nextTick(() => {
    if (loginEmail.value && loginEmail.value.focus) loginEmail.value.focus()
  })
}
</script>

<style scoped>
.min-vh-100 {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>