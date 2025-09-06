# Hotel Booking – Full Stack (Vue 3 + Node/Express + SQLite)

End-to-end solution for the "Hotel Booking Flow with User Login" assignment.

## Requirements matched
- Login/Register/Dashboard accessible via masthead ✅
- Room Search → Rooms → Contact → Confirmation flow ✅
- Only logged-in users view/cancel bookings ✅
- Vue 3 + Pinia + Router (Vite) ✅
- **No CSS framework**, custom CSS with responsive layout ✅
- Public repo + demo ready structure ✅

## Local Setup

### 1) Backend (API)
```bash
cd backend
cp .env.example .env   # optionally edit JWT_SECRET/PORT
npm install
npm run dev            # starts http://localhost:4000
```

### 2) Frontend (Vue app)
```bash
cd ../frontend
npm install
# point frontend to API
echo "VITE_API_URL=http://localhost:4000/api" > .env
npm run dev            # starts http://localhost:5173
```

Visit: http://localhost:5173

### Demo credentials
- You can Register your own account
- Or use: `demo@hotel.com / password` (register first)

## Deploy (suggested)
- Backend: Render/Railway/Heroku (Node + SQLite file)  
- Frontend: Netlify/Vercel (set `VITE_API_URL` to your deployed API)

## Project Structure
- `frontend/` Vue 3 app (Vite, Pinia, Router, Axios)
- `backend/` Express API + SQLite (rooms seed, JWT auth)

## Notes
- Availability checks exclude existing **confirmed** bookings with date overlap.
- Dashboard splits bookings into **upcoming** and **past** (or cancelled).
- Cancellation marks booking as `cancelled`.