<template>
  <header class="header">
    <div class="container nav">
      <router-link class="brand" to="/">Hotel<span style="color: var(--primary)">.</span>Booking</router-link>
      <div class="spacer"></div>
      <router-link to="/" class="btn ghost">Room Search</router-link>
      <router-link to="/rooms" class="btn ghost">Rooms</router-link>
      <template v-if="!auth.isAuthenticated">
        <router-link to="/login" class="btn">Login</router-link>
        <router-link to="/register" class="btn primary">Register</router-link>
      </template>
      <template v-else>
        <router-link to="/dashboard" class="btn">Dashboard</router-link>
        <button class="btn ghost" @click="auth.logout(); $router.push('/')">Logout</button>
      </template>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '../store/auth'
const auth = useAuthStore()
</script>