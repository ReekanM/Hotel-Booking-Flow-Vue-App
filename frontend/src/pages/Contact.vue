<template>
  <section>
    <h2 class="title">Contact Information</h2>
    <div class="grid cols-2">
      <div class="card">
        <h3 style="margin-top:0;">Guest Details</h3>
        <form @submit.prevent="submit">
          <div class="grid cols-2">
            <div>
              <label>Full Name</label>
              <input v-model="contact.name" required />
            </div>
            <div>
              <label>Phone</label>
              <input v-model="contact.phone" required />
            </div>
          </div>
          <div style="margin-top:12px;">
            <label>Email</label>
            <input type="email" v-model="contact.email" required />
          </div>
          <div class="hr"></div>
          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <router-link class="btn ghost" to="/rooms">Back</router-link>
            <button class="btn primary" :disabled="submitting">{{ submitting ? 'Submitting…' : 'Confirm Booking' }}</button>
          </div>
        </form>
      </div>
      <div class="card">
        <h3 style="margin-top:0;">Booking Summary</h3>
        <RoomCard :room="booking.selectedRoom" />
        <p class="muted">Dates: {{ booking.search.checkIn }} → {{ booking.search.checkOut }}</p>
        <p class="muted">Guests: {{ booking.search.guests }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useBookingStore } from '../store/booking'
import api from '../utils/api'
import RoomCard from '../components/RoomCard.vue'
import { useRouter } from 'vue-router'

const booking = useBookingStore()
const router = useRouter()
const contact = reactive({ ...booking.contact })
const submitting = ref(false)

async function submit() {
  submitting.value = true
  try {
    const payload = {
      roomId: booking.selectedRoom.id,
      checkIn: booking.search.checkIn,
      checkOut: booking.search.checkOut,
      guests: booking.search.guests,
      contactName: contact.name,
      contactEmail: contact.email,
      contactPhone: contact.phone,
    }
    const { data } = await api.post('/bookings', payload)
    booking.setContact(contact)
    booking.setLastBooking(data)
    router.push({ name: 'confirmation' })
  } finally {
    submitting.value = false
  }
}
</script>