import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Lock, Mail, ChevronRight, LayoutDashboard, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      toast.success('Logged in successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error('Please enter your email address');
      return;
    }
    setIsForgotLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email: forgotEmail });
      toast.success(
        response.data.message || 'If an account exists with this email, a password reset link has been sent.'
      );
      setIsForgotMode(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand/Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
            <LayoutDashboard size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Console</h1>
          <p className="text-slate-400 mt-2 font-medium">
            {isForgotMode ? 'Enter your email to receive a password reset link' : 'Please sign in to manage your portfolio'}
          </p>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          {!isForgotMode ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                    required
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-bold text-slate-400">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(true);
                      setForgotEmail(email);
                    }}
                    className="text-xs text-primary hover:underline font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Registered Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type="email" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                    required
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isForgotLoading}
                className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isForgotLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Send Reset Link <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => setIsForgotMode(false)}
                className="w-full py-3 rounded-2xl border border-slate-700 text-slate-400 font-bold hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-slate-500 hover:text-white transition-colors text-sm font-medium"
          >
            ← Back to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
