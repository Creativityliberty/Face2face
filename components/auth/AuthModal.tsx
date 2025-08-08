import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  const switchToRegister = () => setView('register');
  const switchToLogin = () => setView('login');

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={view === 'login' ? 'Welcome Back' : 'Create Account'}>
      <div className="p-6">
        {view === 'login' ? (
          <LoginForm onSuccess={handleSuccess} switchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} switchToLogin={switchToLogin} />
        )}
      </div>
    </Modal>
  );
};
