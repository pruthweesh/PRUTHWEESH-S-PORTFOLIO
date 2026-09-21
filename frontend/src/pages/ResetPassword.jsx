import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, ChevronRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });

      toast.success(response.data.message || 'Password reset successfully');
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Reset link is invalid or has expired');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Brand/Logo Section */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow animate-pulse">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Reset Password</h1>
          <p className="text-slate-400 mt-2 font-medium">Create a new secure password for your account</p>
        </div>

        <div className="bg-[#1e293b] rounded-3xl p-8 border border-slate-700/50 shadow-2xl">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto border border-emerald-500/20">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-white">Password Reset!</h3>
              <p className="text-sm text-slate-400">
                Your password has been updated successfully. Redirecting you to the sign in page...
              </p>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full btn-primary py-3.5 rounded-2xl font-bold mt-4"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                    required
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-400 ml-1">Confirm New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-[#0f172a] border border-slate-700/50 focus:border-primary outline-none text-white transition-all placeholder:text-slate-600"
                    required
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    Reset Password <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="w-full py-2 text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2"
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

export default ResetPassword;
