<template>
  <div class="card room-card">
    <img class="room-image" :src="room.image" :alt="room.name" />
    <div>
      <div style="display:flex; align-items:center; gap:8px; justify-content:space-between;">
        <h3 class="title" style="font-size:20px; margin:0;">{{ room.name }}</h3>
        <span class="badge">{{ room.capacity }} Guests</span>
      </div>
      <p class="muted" style="margin:8px 0 12px;">{{ room.description }}</p>
      <div class="row" style="align-items:center;">
        <div class="price">${{ room.pricePerNight }}<span class="muted">/night</span></div>
        <div class="spacer"></div>
        <button v-if="selectable" class="btn primary" @click="$emit('select')">BOOK ROOM</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  room: { type: Object, required: true },
  selectable: { type: Boolean, default: false }
})
</script>