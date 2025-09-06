import { defineStore } from 'pinia'
import api from '../utils/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    async register(payload) {
      const { data } = await api.post('/register', payload)
      this.user = data.user
      this.token = data.token
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', this.token)
    },
    async login(payload) {
      const { data } = await api.post('/login', payload)
      this.user = data.user
      this.token = data.token
      localStorage.setItem('user', JSON.stringify(this.user))
      localStorage.setItem('token', this.token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }
})