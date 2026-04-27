import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';
import { useEffect } from 'react';

// Layouts & Pages
// import Navbar from './components/layout/Navbar';
// import Home from './pages/Home';
// import ProjectDetails from './pages/ProjectDetails';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <nav className="p-4 bg-white/10 dark:bg-black/10 backdrop-blur-md sticky top-0 z-50 shadow">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-primary">Pruthweesh Portfolio</Link>
            <div className="space-x-4">
              <Link to="/admin/dashboard" className="hover:text-primary">Admin</Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/projects/:id" element={<ProjectDetails />} /> */}
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
              <div className="text-center mt-20">
                <h1 className="text-4xl font-bold mb-4">Portfolio Building In Progress...</h1>
                <Link to="/admin/login" className="btn-primary mt-4 inline-block">Go to Admin Login</Link>
              </div>
            } />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
