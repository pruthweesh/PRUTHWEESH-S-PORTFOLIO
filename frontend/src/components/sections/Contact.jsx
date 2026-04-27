import { motion } from 'framer-motion';
import { Mail, Send, Loader2 } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactLinks = [
    {
      icon: <Mail size={28} className="text-primary" />,
      label: 'Email',
      value: 'pruthweesh2006@gmail.com',
      href: 'mailto:pruthweesh2006@gmail.com'
    },
    {
      icon: <FaLinkedin size={28} className="text-primary" />,
      label: 'LinkedIn',
      value: 'linkedin.com/in/pruthweesh',
      href: 'https://linkedin.com/in/pruthweesh'
    },
    {
      icon: <FaGithub size={28} className="text-primary" />,
      label: 'GitHub',
      value: 'github.com/pruthweesh',
      href: 'https://github.com/pruthweesh'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      return toast.error('Please fill in all fields');
    }
    
    setIsSubmitting(true);
    try {
      const response = await api.post('/contact', formData);
      if (response.data.success || response.status === 201) {
        toast.success('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="pt-24 pb-8 px-6 lg:px-12 relative overflow-hidden bg-background-section-1">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6 font-display text-text-primary"
          >
            Let's Connect
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto text-lg leading-relaxed"
          >
            I'm actively seeking opportunities in full-stack development. Feel free to reach out for collaborations, internships, or tech conversations.
          </motion.p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-16"
        >
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1 }
              }}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 }
              }}
              className="glass-card p-8 flex flex-col items-center text-center hover:bg-primary/5 hover:border-primary/30 group shadow-lg hover:shadow-glow transition-all"
            >
              <motion.div 
                whileHover={{ rotate: 15 }}
                className="mb-4 p-4 rounded-full bg-primary/10 group-hover:scale-110 transition-transform duration-300 group-hover:shadow-glow"
              >
                {link.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-text-primary mb-2 font-display">{link.label}</h3>
              <p className="text-text-secondary text-sm font-medium transition-colors group-hover:text-primary">{link.value}</p>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-2xl mb-32"
        >
          <form onSubmit={handleSubmit} className="glass-card p-5 sm:p-8 flex flex-col gap-6 border-t-4 border-t-primary shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="w-full">
                <label htmlFor="name" className="block text-text-primary font-bold mb-2 text-sm uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="email" className="block text-text-primary font-bold mb-2 text-sm uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="message" className="block text-text-primary font-bold mb-2 text-sm uppercase tracking-wider">Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                rows="5"
                className="w-full bg-background-tertiary border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300 resize-y"
                placeholder="How can we work together?"
                required
              ></textarea>
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-glow"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 
                  <span className="uppercase tracking-widest">Send Message</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Footer */}
        <div className="w-full text-center border-t border-white/10 pt-8 flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <p className="text-text-secondary font-medium">
              © 2026 Pruthweesh NV. All rights reserved.
            </p>
            <a href="/admin/login" className="text-text-muted hover:text-primary transition-colors opacity-50 hover:opacity-100" title="Admin Login">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Contact;
