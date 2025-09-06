<template>
  <div class="app">
    <Header />
    <main class="container">
      <router-view />
    </main>
    <footer class="footer">
      <div class="container">
        <p>© {{ new Date().getFullYear() }} Hotel Booking. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style scoped>
.footer {
  margin-top: 40px;
  border-top: 1px solid var(--border);
  padding: 24px 0;
  color: var(--muted-foreground);
  font-size: 14px;
}
</style>