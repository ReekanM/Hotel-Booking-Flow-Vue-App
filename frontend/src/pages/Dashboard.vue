<template>
  <section>
    <h2 class="title">Your Bookings</h2>
    <p class="subtitle">View upcoming and past bookings. You can cancel upcoming bookings here.</p>
    <div class="grid cols-2">
      <div class="card">
        <h3>Upcoming</h3>
        <table v-if="upcoming.length">
          <thead><tr><th>Ref</th><th>Room</th><th>Dates</th><th>Total</th><th></th></tr></thead>
          <tbody>
            <tr v-for="b in upcoming" :key="b.id">
              <td>{{ b.reference }}</td>
              <td>{{ b.roomName }}</td>
              <td>{{ b.checkIn }} → {{ b.checkOut }}</td>
              <td>${{ b.totalPrice }}</td>
              <td style="text-align:right;">
                <button class="btn danger" @click="cancelBooking(b)">Cancel</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty">No upcoming bookings.</div>
      </div>
      <div class="card">
        <h3>Past</h3>
        <table v-if="past.length">
          <thead><tr><th>Ref</th><th>Room</th><th>Dates</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            <tr v-for="b in past" :key="b.id">
              <td>{{ b.reference }}</td>
              <td>{{ b.roomName }}</td>
              <td>{{ b.checkIn }} → {{ b.checkOut }}</td>
              <td>${{ b.totalPrice }}</td>
              <td><span class="badge">{{ b.status }}</span></td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty">No past bookings.</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import api from '../utils/api'

const items = ref([])

const today = new Date().toISOString().slice(0,10)
const upcoming = computed(() => items.value.filter(b => b.status !== 'cancelled' && b.checkOut >= today))
const past = computed(() => items.value.filter(b => b.checkOut < today || b.status === 'cancelled'))

async function fetchBookings() {
  const { data } = await api.get('/bookings')
  items.value = data
}

async function cancelBooking(b) {
  if (!confirm(`Cancel booking ${b.reference}?`)) return
  await api.delete(`/bookings/${b.id}`)
  await fetchBookings()
}

onMounted(fetchBookings)
</script>