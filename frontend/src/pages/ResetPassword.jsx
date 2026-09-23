import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, ChevronRight, KeyRound, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      toast.success(response.data.message || 'Password reset successfully!');
      navigate('/admin/login');
    } catch (error) {
      console.error(error);
      const message =
        error.response?.data?.message ||
        'Password reset failed. Link may have expired or already been used.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand/Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <KeyRound size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Set New Password</h1>
          <p className="text-slate-400 mt-2 font-medium">Please enter your new password below</p>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                  required
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
              <p className="text-xs text-slate-500 ml-1">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 ml-1">Confirm New Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                  required
                  placeholder="••••••••"
                  minLength={6}
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
                  Reset Password <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/admin/login')} 
            className="text-slate-500 hover:text-white transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
