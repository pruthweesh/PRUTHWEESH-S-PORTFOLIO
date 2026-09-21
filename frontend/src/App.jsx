import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';
import { useEffect } from 'react';

// Layouts & Pages
import Navbar from './components/layout/Navbar';
import ScrollProgress from './components/layout/ScrollProgress';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

const AppContent = () => {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 transition-colors duration-500 selection:bg-primary/30">
      {!isAdminRoute && <Navbar />}
      {!isAdminRoute && <ScrollProgress />}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={
            <div className="text-center py-20 px-4">
              <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
              <Link to="/" className="btn-primary mt-4 inline-block">Go Home</Link>
            </div>
          } />
        </Routes>
      </main>
      <Toaster position="bottom-right" toastOptions={{ className: 'dark:bg-slate-800 dark:text-white' }} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
