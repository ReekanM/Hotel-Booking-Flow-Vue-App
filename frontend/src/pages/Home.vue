<template>
  <section>
    <div class="hero card">
      <h1 class="title">Find your perfect stay</h1>
      <p class="subtitle">Search rooms by dates and guests</p>
      <form @submit.prevent="onSearch" class="grid cols-3">
        <div>
          <label>Check-in</label>
          <input type="date" v-model="search.checkIn" required />
        </div>
        <div>
          <label>Check-out</label>
          <input type="date" v-model="search.checkOut" required />
        </div>
        <div>
          <label>Guests</label>
          <select v-model.number="search.guests">
            <option v-for="n in 6" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div style="grid-column: 1/-1; display:flex; justify-content:flex-end;">
          <button class="btn primary">SEARCH FOR ROOMS</button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useBookingStore } from '../store/booking'

const router = useRouter()
const booking = useBookingStore()
const search = reactive({ ...booking.search })

function onSearch() {
  booking.setSearch(search)
  router.push({ name: 'rooms' })
}
</script>