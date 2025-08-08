import React, { useState } from 'react';
import { useAppStore } from '../../stores/appStore';
import apiFetch from '../../lib/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface LoginFormProps {
  onSuccess: () => void;
  switchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useAppStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const { user, accessToken, refreshToken } = await response.json();
      setUser(user, { accessToken, refreshToken });
      onSuccess();

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        <p className="text-center text-gray-500 mt-2">
          Welcome back! Please enter your details.
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">
          <p>{error}</p>
        </div>
      )}

      <Input
        id="email"
        type="email"
        label="Email Address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="you@example.com"
      />

      <Input
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        placeholder="••••••••"
      />

      <div>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <LoadingSpinner /> : 'Sign In'}
        </Button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button type="button" onClick={switchToRegister} className="font-medium text-brand-maroon hover:underline">
          Sign up
        </button>
      </p>
    </form>
  );
};
