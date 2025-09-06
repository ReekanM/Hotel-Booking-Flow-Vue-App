<template>
  <section class="grid cols-2">
    <div class="card">
      <h2 class="title" style="margin-top:0;">Login</h2>
      <form @submit.prevent="submit">
        <div>
          <label>Email</label>
          <input type="email" v-model="email" required />
        </div>
        <div style="margin-top:12px;">
          <label>Password</label>
          <input type="password" v-model="password" required />
        </div>
        <div class="hr"></div>
        <div style="display:flex; gap:12px; justify-content:flex-end;">
          <router-link class="btn ghost" to="/register">Create account</router-link>
          <button class="btn primary" :disabled="loading">{{ loading ? 'Logging in…' : 'Login' }}</button>
        </div>
      </form>
    </div>
    <div class="card">
      <h3>Why login?</h3>
      <p class="muted">Access your dashboard to view upcoming and past bookings, and cancel a booking if plans change.</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRoute, useRouter } from 'vue-router'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('demo@hotel.com')
const password = ref('password')
const loading = ref(false)

async function submit() {
  loading.value = true
  try {
    await auth.login({ email: email.value, password: password.value })
    router.push(route.query.redirect || '/dashboard')
  } finally { loading.value = false }
}
</script>