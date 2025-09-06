<template>
  <section class="grid cols-2">
    <div class="card">
      <h2 class="title" style="margin-top:0;">Create Account</h2>
      <form @submit.prevent="submit">
        <div class="grid cols-2">
          <div>
            <label>Name</label>
            <input v-model="name" required />
          </div>
          <div>
            <label>Phone</label>
            <input v-model="phone" required />
          </div>
        </div>
        <div class="grid cols-2" style="margin-top:12px;">
          <div>
            <label>Email</label>
            <input type="email" v-model="email" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" v-model="password" required minlength="6" />
          </div>
        </div>
        <div class="hr"></div>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <router-link class="btn ghost" to="/login">I already have an account</router-link>
          <button class="btn primary" :disabled="loading">{{ loading ? 'Creating…' : 'Register' }}</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h3>Welcome!</h3>
      <p class="muted">Create an account to start booking and manage your reservations in your dashboard.</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const name = ref('Demo User')
const phone = ref('0771234567')
const email = ref('demo@hotel.com')
const password = ref('password')
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    await auth.register({ name: name.value, phone: phone.value, email: email.value, password: password.value })
    router.push('/dashboard')
  } finally { loading.value = false }
}
</script>