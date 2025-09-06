import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Rooms from '../pages/Rooms.vue'
import Contact from '../pages/Contact.vue'
import Confirmation from '../pages/Confirmation.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import { useAuthStore } from '../store/auth'
import { useBookingStore } from '../store/booking'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/rooms', name: 'rooms', component: Rooms },
  { path: '/contact', name: 'contact', component: Contact, meta: { requiresAuth: true, requiresSelectedRoom: true } },
  { path: '/confirmation', name: 'confirmation', component: Confirmation, meta: { requiresAuth: true } },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const booking = useBookingStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  if (to.meta.requiresSelectedRoom && !booking.selectedRoom) {
    next({ name: 'rooms' })
    return
  }
  next()
})

export default router