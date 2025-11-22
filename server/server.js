/* 
  NOTE: This file contains the Node.js backend logic requested.
  In a real full-stack environment, run this with `node server/server.js`.
  For this frontend demo, the `services/authService.ts` mimics this behavior 
  so you can see the UI work immediately in the browser.
*/

import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DB_FOLDER = path.join(__dirname, 'db');
const USERS_FILE = path.join(DB_FOLDER, 'users.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure DB exists
const initDb = async () => {
  try {
    await fs.access(DB_FOLDER);
  } catch {
    await fs.mkdir(DB_FOLDER, { recursive: true });
  }
  try {
    await fs.access(USERS_FILE);
  } catch {
    await fs.writeFile(USERS_FILE, JSON.stringify([]));
  }
};

// Helpers
const getUsers = async () => {
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
};

const saveUser = async (user) => {
  const users = await getUsers();
  users.push(user);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const users = await getUsers();
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, HASH this password!
      createdAt: new Date().toISOString()
    };

    await saveUser(newUser);

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ user: userWithoutPassword, token: 'mock-jwt-token' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: 'mock-jwt-token' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Start
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
