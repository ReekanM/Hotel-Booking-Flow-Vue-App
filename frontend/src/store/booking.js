import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    search: {
      checkIn: '',
      checkOut: '',
      guests: 1
    },
    availableRooms: [],
    selectedRoom: null,
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    lastBooking: null
  }),
  actions: {
    setSearch(payload) { this.search = payload },
    setAvailableRooms(list) { this.availableRooms = list },
    selectRoom(room) { this.selectedRoom = room },
    setContact(payload) { this.contact = payload },
    setLastBooking(payload) { this.lastBooking = payload },
    reset() {
      this.availableRooms = []
      this.selectedRoom = null
      this.contact = { name: '', email: '', phone: '' }
      this.lastBooking = null
    }
  }
})