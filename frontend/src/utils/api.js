import axios from 'axios'

const api = axios.create({
  baseURL: "/api"   // relative, works on both local & Render
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api