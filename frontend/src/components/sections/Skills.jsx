import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const Skills = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackCategories = [
    {
      title: 'Frontend Development 🎨',
      tags: ['HTML5', 'CSS3', 'JavaScript', 'React.js', 'Tailwind CSS v3', 'Responsive Design']
    },
    {
      title: 'Backend Development ⚙️',
      tags: ['Node.js (Basic)', 'Express.js (Basic)']
    },
    {
      title: 'Databases 🗄️',
      tags: ['MongoDB', 'MySQL (XAMPP local)']
    },
    {
      title: 'Programming Languages 💻',
      tags: ['JavaScript', 'Python (Basic)']
    },
    {
      title: 'Tools & Platforms 🛠️',
      tags: ['Git', 'GitHub', 'VS Code', 'Claude AI', 'Cursor AI', 'Lovable AI', 'Bolt', 'Antigravity']
    }
  ];

  useEffect(() => {
    let cancelled = false;
    const fetchSkills = async () => {
      try {
        const response = await api.get('/portfolio');
        if (!cancelled) {
          if (response.data.success && response.data.data?.skills?.length > 0) {
            const skills = response.data.data.skills;
            const grouped = {
              frontend: { title: 'Frontend Development 🎨', tags: [] },
              backend: { title: 'Backend Development ⚙️', tags: [] },
              database: { title: 'Databases 🗄️', tags: [] },
              'programming languages': { title: 'Programming Languages 💻', tags: [] },
              tools: { title: 'Tools & Platforms 🛠️', tags: [] },
            };
            
            skills.forEach(skill => {
              if (!skill.name) return;
              const rawCat = skill.category ? skill.category.trim() : 'Other';
              const catKey = rawCat.toLowerCase();
              
              if (catKey.includes('front')) {
                grouped.frontend.tags.push(skill.name);
              } else if (catKey.includes('back')) {
                grouped.backend.tags.push(skill.name);
              } else if (catKey.includes('data') || catKey.includes('db') || catKey.includes('sql')) {
                grouped.database.tags.push(skill.name);
              } else if (catKey.includes('lang') || catKey.includes('program')) {
                grouped['programming languages'].tags.push(skill.name);
              } else if (catKey.includes('tool') || catKey.includes('platform')) {
                grouped.tools.tags.push(skill.name);
              } else {
                if (!grouped[catKey]) {
                  grouped[catKey] = { title: rawCat, tags: [] };
                }
                grouped[catKey].tags.push(skill.name);
              }
            });
            
            // Only keep categories that have tags
            const formattedCategories = Object.values(grouped).filter(cat => cat.tags.length > 0);
            
            if (formattedCategories.length > 0) {
              setCategories(formattedCategories);
            } else {
              setCategories(fallbackCategories);
            }
          } else {
            setCategories(fallbackCategories);
          }
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
        if (!cancelled) {
          setCategories(fallbackCategories);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchSkills();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="skills" className="section-padding px-6 lg:px-12 relative overflow-hidden bg-background-section-3">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 font-display text-text-primary"
          >
            Technical Skills
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary font-mono text-sm tracking-widest uppercase"
          >
            Technologies I work with
          </motion.p>
        </div>

        {loading && categories.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="glass-card p-6 sm:p-8 border-t-[3px] border-t-primary/20 animate-pulse h-48">
                <div className="h-6 bg-slate-700/40 rounded w-2/3 mb-6" />
                <div className="flex flex-wrap gap-3">
                  <div className="h-7 w-20 bg-slate-700/30 rounded-full" />
                  <div className="h-7 w-24 bg-slate-700/30 rounded-full" />
                  <div className="h-7 w-16 bg-slate-700/30 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            key={categories.map(c => c.title).join('-') || 'skills-list'}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {categories.map((category, idx) => (
              <motion.div
                key={category.title}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className="glass-card p-6 sm:p-8 border-t-[3px] border-t-primary/80 hover:border-t-primary group relative overflow-hidden h-full"
              >
                {/* Subtle glow border animation effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <h3 className="text-xl font-bold text-text-primary mb-6 font-display relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {category.title}
                </h3>
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="flex flex-wrap gap-3 relative z-10"
                >
                  {category.tags.map(tag => (
                    <motion.span 
                      key={tag} 
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        show: { opacity: 1, scale: 1 }
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        backgroundColor: "rgba(var(--accent-primary-rgb), 0.2)",
                        borderColor: "var(--accent-primary)"
                      }}
                      className="px-3 py-1.5 rounded-full font-mono text-xs text-primary bg-primary/10 border border-primary/30 transition-all duration-300 cursor-default"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Skills;
