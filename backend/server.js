import express from 'express'
import cors from 'cors'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me'
const DB_FILE = process.env.DB_FILE || './data.sqlite'

const db = await open({ filename: DB_FILE, driver: sqlite3.Database })

// Initialize DB
await db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    createdAt TEXT DEFAULT (DATE('now'))
  );
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL,
    pricePerNight REAL NOT NULL,
    image TEXT
  );
  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    roomId INTEGER NOT NULL,
    checkIn TEXT NOT NULL,
    checkOut TEXT NOT NULL,
    guests INTEGER NOT NULL,
    contactName TEXT,
    contactEmail TEXT,
    contactPhone TEXT,
    totalPrice REAL NOT NULL,
    status TEXT DEFAULT 'confirmed',
    reference TEXT UNIQUE,
    createdAt TEXT DEFAULT (DATETIME('now')),
    FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(roomId) REFERENCES rooms(id) ON DELETE CASCADE
  );
`)

// Seed rooms if empty
const roomCount = (await db.get('SELECT COUNT(*) as c FROM rooms')).c
if (roomCount === 0) {
  const rooms = [
    { name: 'Deluxe King', description: 'Spacious room with king bed and city view.', capacity: 2, pricePerNight: 140, image: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Family Suite', description: 'Two-bedroom suite perfect for families.', capacity: 4, pricePerNight: 220, image: 'https://images.unsplash.com/photo-1616596875585-2a8e4d4f1e8e?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Twin Room', description: 'Comfortable twin beds for friends.', capacity: 2, pricePerNight: 110, image: 'https://images.unsplash.com/photo-1551776235-3b03d3e2f2c5?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Executive Suite', description: 'Luxury suite with lounge access.', capacity: 3, pricePerNight: 300, image: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=1200&auto=format&fit=crop' },
    { name: 'Budget Single', description: 'Cozy room for solo travelers.', capacity: 1, pricePerNight: 70, image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3b2b8e?q=80&w=1200&auto=format&fit=crop' }
  ]
  const stmt = await db.prepare('INSERT INTO rooms (name, description, capacity, pricePerNight, image) VALUES (?,?,?,?,?)')
  for (const r of rooms) await stmt.run(r.name, r.description, r.capacity, r.pricePerNight, r.image)
  await stmt.finalize()
  console.log('Seeded rooms')
}

function generateRef() {
  return 'HB' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ error: 'Missing token' })
  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Auth endpoints
app.post('/api/register', async (req, res) => {
  const { name, phone, email, password } = req.body
  if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
  const existing = await db.get('SELECT id FROM users WHERE email = ?', email)
  if (existing) return res.status(409).json({ error: 'Email already registered' })
  const hash = await bcrypt.hash(password, 10)
  const result = await db.run('INSERT INTO users (name, phone, email, password_hash) VALUES (?,?,?,?)', name, phone || '', email, hash)
  const user = { id: result.lastID, name, phone: phone || '', email }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ user, token })
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  const row = await db.get('SELECT * FROM users WHERE email = ?', email)
  if (!row) return res.status(401).json({ error: 'Invalid credentials' })
  const ok = await bcrypt.compare(password, row.password_hash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const user = { id: row.id, name: row.name, phone: row.phone, email: row.email }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' })
  res.json({ user, token })
})

// Rooms search
app.get('/api/rooms', async (req, res) => {
  const { checkIn, checkOut } = req.query
  const guests = parseInt(req.query.guests || "1", 10)

  // filter by capacity
  let rooms = await db.all('SELECT * FROM rooms WHERE capacity >= ?', guests)

  if (!checkIn || !checkOut) {
    return res.json(rooms)
  }

  // filter by availability: no overlapping bookings (confirmed only)
  const available = []
  for (const r of rooms) {
    const overlap = await db.get(`
      SELECT 1 FROM bookings 
      WHERE roomId = ? AND status = 'confirmed'
      AND NOT (date(checkOut) <= date(?) OR date(checkIn) >= date(?))
    `, r.id, checkIn, checkOut)
    if (!overlap) available.push(r)
  }

  res.json(available)
})


// Create booking
app.post('/api/bookings', auth, async (req, res) => {
  const { roomId, checkIn, checkOut, guests, contactName, contactEmail, contactPhone } = req.body
  if (!roomId || !checkIn || !checkOut || !guests) return res.status(400).json({ error: 'Missing fields' })

  const room = await db.get('SELECT * FROM rooms WHERE id = ?', roomId)
  if (!room) return res.status(404).json({ error: 'Room not found' })

  // availability check
  const overlap = await db.get(`
    SELECT 1 FROM bookings 
    WHERE roomId = ? AND status = 'confirmed'
    AND NOT (date(checkOut) <= date(?) OR date(checkIn) >= date(?))
  `, roomId, checkIn, checkOut)
  if (overlap) return res.status(409).json({ error: 'Room not available' })

  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000*60*60*24)))
  const totalPrice = nights * room.pricePerNight
  const reference = generateRef()
  const result = await db.run(`
    INSERT INTO bookings (userId, roomId, checkIn, checkOut, guests, contactName, contactEmail, contactPhone, totalPrice, status, reference)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
  `, req.user.id, roomId, checkIn, checkOut, guests, contactName || '', contactEmail || '', contactPhone || '', totalPrice, reference)

  res.json({ id: result.lastID, reference, totalPrice })
})

// List bookings for user
app.get('/api/bookings', auth, async (req, res) => {
  const rows = await db.all(`
    SELECT b.*, r.name as roomName 
    FROM bookings b JOIN rooms r ON b.roomId = r.id 
    WHERE b.userId = ? 
    ORDER BY date(b.checkIn) DESC
  `, req.user.id)
  res.json(rows)
})

// Cancel booking
app.delete('/api/bookings/:id', auth, async (req, res) => {
  const b = await db.get('SELECT * FROM bookings WHERE id = ? AND userId = ?', req.params.id, req.user.id)
  if (!b) return res.status(404).json({ error: 'Not found' })
  await db.run('UPDATE bookings SET status = "cancelled" WHERE id = ?', b.id)
  res.json({ success: true })
})

app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))

// Serve frontend in production
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vue frontend (after build)
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});
