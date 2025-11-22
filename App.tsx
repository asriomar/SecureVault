import React, { useState, useEffect } from 'react';
import { AuthPage } from './pages/AuthPage';
import { DownloadPage } from './pages/DownloadPage';
import { User } from './types';
import { authService } from './services/authService';
import { Lock } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session (mocked for demo purposes)
    const checkSession = async () => {
      // In a real app, we would validate the token with the backend
      // Here we just check if a "token" exists in localStorage
      const token = localStorage.getItem('auth_token');
      if (token) {
        // Ideally fetch user profile here
        // For demo, we might need to clear if we don't have user data in memory, 
        // or persist user data to localstorage too.
        // Let's just require fresh login for safety in this simple demo unless we stored user object
        const storedUser = localStorage.getItem('secure_vault_current_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('secure_vault_current_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', 'valid');
  };

  const handleLogout = () => {
    authService.logout();
    localStorage.removeItem('secure_vault_current_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      {user ? (
        <DownloadPage user={user} onLogout={handleLogout} />
      ) : (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;