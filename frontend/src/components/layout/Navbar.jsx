import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/useThemeStore';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'About', path: '#about' },
    { name: 'Skills', path: '#skills' },
    { name: 'Experience', path: '#experience' },
    { name: 'Projects', path: '#projects' },
    { name: 'Education & Certifications', path: '#education' },
    { name: 'Achievements', path: '#achievements' },
    { name: 'Contact', path: '#contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${isScrolled
        ? 'py-2 bg-nav backdrop-blur-xl border-b border-border shadow-lg shadow-black/5'
        : 'py-4 bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">
          <Link to="/" className="relative group flex items-center">
            <img
              src={logo}
              alt="Pruthweesh Logo"
              className="h-12 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-glow"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <div className="flex space-x-8 bg-background-tertiary backdrop-blur-md px-6 py-2.5 rounded-full border border-border shadow-sm">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-sm font-semibold tracking-wide text-text-secondary hover:text-primary transition-colors relative group py-1"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              ))}
            </div>

            {/* Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`relative flex items-center w-[56px] h-[28px] rounded-full p-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'bg-[#06b6d4] shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]' : 'bg-[#0369a1] shadow-[0_0_15px_rgba(3,105,161,0.4)] hover:shadow-[0_0_20px_rgba(3,105,161,0.6)]'
                }`}
              aria-label="Toggle Theme"
            >
              <div
                className={`absolute flex justify-center items-center w-[22px] h-[22px] bg-white rounded-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'translate-x-[26px]' : 'translate-x-0'
                  }`}
              >
                {isDarkMode ? (
                  <Moon size={14} className="text-[#06b6d4]" />
                ) : (
                  <Sun size={14} className="text-[#0369a1]" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Toggle & Menu */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Theme Toggle Pill */}
            <button
              onClick={toggleTheme}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className={`relative flex items-center w-[56px] h-[28px] rounded-full p-1 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'bg-[#06b6d4] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-[#0369a1] hover:shadow-[0_0_15px_rgba(3,105,161,0.4)]'
                }`}
              aria-label="Toggle Theme"
            >
              <div
                className={`absolute flex justify-center items-center w-[22px] h-[22px] bg-white rounded-full transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isDarkMode ? 'translate-x-[26px]' : 'translate-x-0'
                  }`}
              >
                {isDarkMode ? (
                  <Moon size={14} className="text-[#06b6d4]" />
                ) : (
                  <Sun size={14} className="text-[#0369a1]" />
                )}
              </div>
            </button>
            <button onClick={toggleMenu} className="text-text-primary p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Top Level Fixed */}
      <div className={`md:hidden fixed inset-0 bg-background-dark z-[1000] flex flex-col transition-all duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 backdrop-blur-3xl bg-background-dark/90" />
        
        <button 
          onClick={toggleMenu} 
          className="absolute top-8 right-8 text-text-primary p-3 bg-background-tertiary rounded-full border border-border hover:border-primary transition-all z-[1010]"
        >
          <X size={24} />
        </button>
        
        <div className="relative z-[1005] h-full overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center items-center p-10 w-full">
            <div className="flex flex-col space-y-6 text-center w-full max-w-xs py-20">
              {navLinks.map((link, idx) => (
                <motion.a
                  key={link.name}
                  href={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isMenuOpen ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-bold tracking-tight text-text-primary hover:text-primary transition-all py-2 border-b border-border/30"
                >
                  {link.name}
                </motion.a>
              ))}
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isMenuOpen ? { opacity: 1 } : {}}
                transition={{ delay: 0.8 }}
                className="pt-8"
              >
                <Link
                  to="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-8 py-3 rounded-xl bg-primary text-white dark:text-background-dark font-bold tracking-widest text-sm shadow-glow block"
                >
                  ADMIN PORTAL
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
