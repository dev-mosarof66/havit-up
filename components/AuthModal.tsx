import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdClose } from 'react-icons/md';
import { loginUser, registerUser } from '@/app/actions/authActions';
import { useRouter } from 'next/navigation';
import { Snackbar, Alert } from '@mui/material';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Reset mode when modal opens with a new initial mode
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      // Optional: reset fields on open
      setEmail('');
      setPassword('');
      setName('');
      setShowPassword(false);
      setError('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#09090b] border border-[#27272a] p-8 shadow-2xl overflow-hidden"
        >
          {/* Subtle background glow inside modal */}
          <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-white/5 blur-[80px] rounded-full pointer-events-none" />

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
          >
            <MdClose size={24} />
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'login' 
                ? 'Enter your details to access your habits.' 
                : 'Start tracking your habits and shaping your future.'}
            </p>
          </div>

          <form className="flex flex-col gap-4 relative z-10" action={async (formData) => {
            setError('');
            setIsLoading(true);
            const res = mode === 'login' ? await loginUser(formData) : await registerUser(formData);
            setIsLoading(false);
            if (res.success) {
              onClose();
              router.push('/dashboard');
            } else {
              setError(res.error || 'Something went wrong');
            }
          }}>
            {/* Error is now handled by MUI Snackbar */}
            
            {mode === 'register' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input 
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-[#27272a] px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <input 
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#27272a] px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">Password</label>
                {mode === 'login' && (
                  <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Forgot password?</a>
                )}
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#121212] border border-[#27272a] px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-white text-black font-bold py-3.5 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
            >
              {isLoading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400 relative z-10">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="text-white hover:underline font-medium">Sign up</button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="text-white hover:underline font-medium">Sign in</button>
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%', backgroundColor: '#ef4444', color: '#fff' }}>
          {error}
        </Alert>
      </Snackbar>
    </AnimatePresence>
  );
}
