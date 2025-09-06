<template>
  <section>
    <h2 class="title">Available Rooms</h2>
    <p class="subtitle">From {{ booking.search.checkIn || '—' }} to {{ booking.search.checkOut || '—' }} · Guests: {{ booking.search.guests }}</p>
    <div v-if="loading" class="card">Loading rooms…</div>
    <div v-else-if="rooms.length === 0" class="empty">No rooms available for your search.</div>
    <div class="grid" style="gap:16px;">
      <RoomCard v-for="r in rooms" :key="r.id" :room="r" :selectable="true" @select="select(r)" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useBookingStore } from '../store/booking'
import api from '../utils/api'
import RoomCard from '../components/RoomCard.vue'
import { useRouter } from 'vue-router'

const booking = useBookingStore()
const rooms = ref([])
const loading = ref(false)
const router = useRouter()

async function fetchRooms() {
  loading.value = true
  try {
    const params = new URLSearchParams(booking.search).toString()
    const { data } = await api.get(`/rooms?${params}`)
    rooms.value = data
  } finally { loading.value = false }
}

function select(room) {
  booking.selectRoom(room)
   if (!booking.search.checkIn || !booking.search.checkOut) {
    // No dates selected → redirect back to search page
    router.push({ name: 'home' })
  } else {
    // Dates exist → continue to contact info
    router.push({ name: 'contact' })
  }
}

onMounted(fetchRooms)
</script>