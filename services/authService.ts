import axios from 'axios';
import { AuthResponse, User } from '../types';

// Configuration
const API_URL = 'http://localhost:3001/api';
const USE_MOCK_BACKEND = true; // Set to false if running the actual Node.js server provided in server/server.js

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// --- MOCK BACKEND IMPLEMENTATION (For Browser Demo) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockRegister = async (data: any): Promise<AuthResponse> => {
  await delay(1000); // Simulate network latency
  
  const usersJson = localStorage.getItem('secure_vault_users');
  const users: any[] = usersJson ? JSON.parse(usersJson) : [];
  
  if (users.find((u: any) => u.email === data.email)) {
    throw new Error('User already exists');
  }

  const newUser = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    password: data.password, // In a real app, never store plain text
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  localStorage.setItem('secure_vault_users', JSON.stringify(users));

  const { password, ...safeUser } = newUser;
  return { user: safeUser, token: 'mock-jwt-token-' + Date.now() };
};

const mockLogin = async (data: any): Promise<AuthResponse> => {
  await delay(800); // Simulate network latency
  
  const usersJson = localStorage.getItem('secure_vault_users');
  const users: any[] = usersJson ? JSON.parse(usersJson) : [];
  
  const user = users.find((u: any) => u.email === data.email && u.password === data.password);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { password, ...safeUser } = user;
  return { user: safeUser, token: 'mock-jwt-token-' + Date.now() };
};
// -------------------------------------------------------

export const authService = {
  register: async (data: any): Promise<AuthResponse> => {
    if (USE_MOCK_BACKEND) {
      return mockRegister(data);
    }
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    if (USE_MOCK_BACKEND) {
      return mockLogin(data);
    }
    const response = await api.post<AuthResponse>('/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
  }
};
