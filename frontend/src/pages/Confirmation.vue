<template>
  <section>
    <div class="card">
      <h2 class="title" style="margin-top:0; text-align:center;">Your Booking has been Confirmed 🎉</h2>
      <p class="subtitle" style="text-align:center;">Your booking reference: <strong>{{ booking.lastBooking?.reference }}</strong></p>
      <div class="grid cols-2">
        <div>
          <h3>Packgage Details</h3>
          <p>Room : {{ booking.selectedRoom?.name }}</p>
          <p>Check-In / Check-Out : {{ booking.search.checkIn }} → {{ booking.search.checkOut }}</p>
          <p>Guests : {{ booking.search.guests }}</p>
          <p>Total Price : ${{ booking.lastBooking?.totalPrice }}</p>
        </div>
        <div>
          <h3>Guest Details</h3>
          <p>Name : {{ booking.contact.name }}</p>
          <p>Email Address : {{ booking.contact.email }}</p>
          <p>Phpne Number : {{ booking.contact.phone }}</p>
        </div>
      </div>
      <div class="hr"></div>
      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <router-link class="btn" to="/dashboard">Go to Dashboard</router-link>
        <router-link class="btn ghost" to="/">Make another booking</router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useBookingStore } from '../store/booking'
const booking = useBookingStore()
</script>