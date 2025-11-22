export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'zip' | 'img' | 'doc';
  date: string;
}

export enum AuthMode {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER'
}
