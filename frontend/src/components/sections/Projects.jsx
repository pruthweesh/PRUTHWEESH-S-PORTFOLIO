import { motion } from 'framer-motion';
import { ExternalLink, Check } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackProjects = [
    {
      _id: '01',
      title: 'MyWell — Groundwater Analysis Platform',
      badge: 'NEW',
      description: 'A web-based solution to analyze groundwater availability and support agricultural decision-making, leveraging satellite and geospatial data from NASA, ISRO, and ESA to estimate potential groundwater zones.',
      techStack: ['JavaScript', 'React.js', 'Geospatial Data', 'APIs'],
      features: [
        'Satellite-based groundwater zone estimation',
        'Agricultural decision support interface',
        'Geospatial data visualization'
      ],
      liveLink: '#',
      githubLink: '#'
    },
    {
      _id: '02',
      title: 'Lab Attendance System',
      description: 'Automated lab attendance tracking using barcode-based identification with real-time data processing and secure storage.',
      techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
      features: [
        'Built RESTful APIs for student records and attendance data management',
        'Barcode scanning functionality for fast attendance marking',
        'Responsive interface for seamless cross-device usage',
        'MongoDB integration for secure and efficient data retrieval'
      ],
      githubLink: '#'
    },
    {
      _id: '03',
      title: 'Portfolio Website',
      description: 'Personal portfolio website built with React showcasing professional projects, technical skills, and experience with modern UI design principles.',
      techStack: ['React.js', 'Tailwind CSS'],
      features: [
        'Fully responsive design for all device sizes',
        'Clean UI with structured layout',
        'Optimized for user experience and accessibility',
        'Modern web development best practices'
      ],
      githubLink: '#'
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/portfolio');
        if (response.data.success && response.data.data?.projects?.length > 0) {
          setProjects(response.data.data.projects);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="section-padding px-6 lg:px-12 relative overflow-hidden bg-background-section-1">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 font-display text-text-primary"
          >
            Featured Projects
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary font-mono text-sm tracking-widest uppercase"
          >
            Things I've built
          </motion.p>
        </div>

        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.9 },
                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
              }}
              whileHover={{ 
                y: -15,
                transition: { duration: 0.3 }
              }}
              className="glass-card relative flex flex-col h-full border-t-[3px] border-t-primary/50 hover:border-t-primary group overflow-hidden shadow-lg hover:shadow-glow transition-all duration-500"
            >
              {/* Subtle overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


              <div className="p-6 sm:p-8 flex flex-col h-full relative z-10">
                <div className="flex justify-between items-start gap-4 mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-text-primary font-display leading-tight w-[80%] group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.badge && (
                    <motion.span 
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="px-2 py-0.5 sm:py-1 bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold tracking-wider uppercase rounded border border-primary/30 shadow-glow"
                    >
                      {project.badge}
                    </motion.span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack?.map(tech => (
                    <span key={tech} className="px-2 py-1 rounded bg-background-tertiary border border-border text-[11px] font-mono text-secondary tracking-wider group-hover:border-primary/30 transition-colors">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-text-secondary text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="mb-8 space-y-2">
                  {project.features?.map((feature, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <Check size={16} className="text-success shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4 mt-auto">
                  {project.liveLink && (
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.liveLink} target="_blank" rel="noopener noreferrer" 
                      className="flex-1 text-center py-2 bg-primary text-white dark:text-slate-900 font-bold rounded-lg hover:shadow-glow transition-all"
                    >
                      Live Demo
                    </motion.a>
                  )}
                  {project.githubLink && (
                    <motion.a 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={project.githubLink} target="_blank" rel="noopener noreferrer" 
                      className="flex-1 text-center py-2 border border-primary text-primary hover:bg-primary/10 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    >
                      <FaGithub size={16} /> Repo
                    </motion.a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
