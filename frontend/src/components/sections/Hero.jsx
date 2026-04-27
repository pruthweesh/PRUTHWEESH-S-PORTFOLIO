import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaChevronDown } from 'react-icons/fa';

const Typewriter = ({ texts, delay, pause }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [textArrayIndex, setTextArrayIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[textArrayIndex];
    let timeout;
    
    if (isDeleting) {
      if (currentIndex > 0) {
        timeout = setTimeout(() => {
          setCurrentText(text.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        }, delay / 2);
      } else {
        setIsDeleting(false);
        setTextArrayIndex((prev) => (prev + 1) % texts.length);
      }
    } else {
      if (currentIndex < text.length) {
        timeout = setTimeout(() => {
          setCurrentText(text.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        }, delay);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pause);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, textArrayIndex, texts, delay, pause]);

  return <span>{currentText}<span className="animate-pulse text-primary">|</span></span>;
};

const Particles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: Math.random() * 5 + 5, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
          className="absolute w-1 h-1 bg-primary/40 dark:bg-white/20 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-hero-gradient text-text-primary">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/40 blur-[120px] animate-blob opacity-40 dark:opacity-25" />
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-secondary/30 blur-[120px] animate-blob opacity-30 dark:opacity-20" style={{ animationDelay: '2s' }} />
      </div>
      
      <Particles />

      <div className="max-w-4xl mx-auto px-6 lg:px-12 w-full flex flex-col items-center justify-center text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-mono text-sm shadow-glow backdrop-blur-sm"
          >
            [ &lt;/&gt; MERN Stack Developer ]
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[7rem] font-[800] mb-4 leading-tight tracking-[0.02em] sm:tracking-[0.05em] font-display uppercase dark:text-white dark:drop-shadow-[0_0_20px_rgba(6,182,212,0.4)] text-text-primary px-2"
          >
            PRUTHWEESH NV
          </motion.h1>

          <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-primary mb-6 font-mono h-12">
            <Typewriter 
              texts={["MERN Stack Developer", "Full Stack Enthusiast", "React.js Developer", "Problem Solver"]} 
              delay={80} 
              pause={2000} 
            />
          </div>
          
          <p className="text-sm sm:text-base md:text-lg text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Information Technology undergraduate at JKKN College of Engineering & Technology, specializing in MERN stack development. Passionate about building scalable, user-friendly web applications.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 w-full sm:w-auto">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full sm:w-auto"
            >
              View Projects
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-outline w-full sm:w-auto"
            >
              Get in Touch
            </motion.a>
          </div>

          <div className="flex items-center gap-6 mb-16">
            <a href="https://github.com/pruthweesh" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary hover:scale-125 transition-all duration-300">
              <FaGithub size={28} />
            </a>
            <a href="https://linkedin.com/in/pruthweesh" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary hover:scale-125 transition-all duration-300">
              <FaLinkedin size={28} />
            </a>
            <a href="mailto:pruthweesh2006@gmail.com" className="text-text-secondary hover:text-primary hover:scale-125 transition-all duration-300">
              <FaEnvelope size={28} />
            </a>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="glass-card px-5 py-3 md:px-8 md:py-4 rounded-2xl flex items-center gap-4 border-primary/20 bg-primary/5 hover:border-primary/50 transition-colors shadow-glow-sm"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-lg md:text-xl shadow-inner">🏆</div>
            <div className="text-left">
              <span className="block text-[10px] md:text-xs text-primary font-mono uppercase tracking-wider">Top Achievement</span>
              <span className="text-sm md:text-base font-bold text-text-primary">1st Rank — Department | 3 Consecutive Years</span>
            </div>
          </motion.div>

        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-secondary"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <FaChevronDown size={24} className="text-primary/70" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
