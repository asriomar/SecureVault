import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { authService } from '../services/authService';
import { AuthMode, User } from '../types';
import { Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<AuthMode>(AuthMode.LOGIN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === AuthMode.REGISTER) {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        const response = await authService.register({ name, email, password });
        onLoginSuccess(response.user);
      } else {
        const response = await authService.login({ email, password });
        onLoginSuccess(response.user);
      }
    } catch (err: any) {
      // Handle simulated backend errors or real axios errors
      const msg = err.response?.data?.message || err.message || "Authentication failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === AuthMode.LOGIN ? AuthMode.REGISTER : AuthMode.LOGIN);
    setError(null);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Visuals */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-20">
            <img 
                src="https://picsum.photos/1000/1200?grayscale&blur=2" 
                alt="Background" 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="relative z-10 text-white max-w-md px-8">
            <div className="mb-6 bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">Secure your digital assets.</h1>
            <p className="text-indigo-200 text-lg leading-relaxed">
                Join thousands of developers who trust SecureVault for storing their critical project artifacts. 
                Encrypted, fast, and reliable.
            </p>
            <div className="mt-12 flex space-x-4">
                <div className="h-2 w-12 bg-indigo-500 rounded-full"></div>
                <div className="h-2 w-2 bg-indigo-500/50 rounded-full"></div>
                <div className="h-2 w-2 bg-indigo-500/50 rounded-full"></div>
            </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 lg:px-12">
        <div className="w-full max-w-md">
            <div className="text-center mb-10 lg:text-left">
                <h2 className="text-3xl font-bold text-slate-900">
                    {mode === AuthMode.LOGIN ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-slate-500 mt-2">
                    {mode === AuthMode.LOGIN 
                        ? 'Enter your credentials to access your vault.' 
                        : 'Start your 14-day free trial today. No credit card required.'}
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r">
                    <div className="flex items-center">
                        <span className="font-medium mr-2">Error:</span> {error}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === AuthMode.REGISTER && (
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        icon={<UserIcon className="w-5 h-5 text-slate-400" />}
                    />
                )}
                
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    icon={<Mail className="w-5 h-5 text-slate-400" />}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    icon={<Lock className="w-5 h-5 text-slate-400" />}
                />

                {mode === AuthMode.REGISTER && (
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        icon={<Lock className="w-5 h-5 text-slate-400" />}
                    />
                )}

                <div className="pt-2">
                    <Button isLoading={isLoading} type="submit">
                        {mode === AuthMode.LOGIN ? 'Sign In' : 'Create Account'} 
                        {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                    </Button>
                </div>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
                {mode === AuthMode.LOGIN ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={toggleMode}
                    className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline focus:outline-none"
                >
                    {mode === AuthMode.LOGIN ? 'Sign up for free' : 'Log in here'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};