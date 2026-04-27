import { motion } from 'framer-motion';
import { ChevronRight, Image as ImageIcon, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../ui/Modal';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState('');

  const fallbackExperiences = [
    {
      _id: 'fallback1',
      title: 'MERN Stack Web Development Intern',
      company: 'UptoSkills',
      period: 'Jan 2026 – Apr 2026 | Remote',
      roleTypes: 'Frontend Developer (4 months) + Team Captain (1 month)',
      responsibilities: [
        'Developed responsive, interactive UIs using React.js and Tailwind CSS v3',
        'Led the frontend team as Captain — coordinated tasks and feature delivery timelines',
        'Collaborated on code integration using Git and GitHub for version control',
        'Gained hands-on experience in API integration and performance optimization',
        'Contributed to frontend development of the <a href="#" class="text-primary hover:underline">Syncaura project</a>'
      ],
      tags: ['React.js', 'Tailwind CSS', 'Node.js', 'Git', 'GitHub']
    }
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get('/experiences');
        if (response.data.success && response.data.data.length > 0) {
          setExperiences(response.data.data);
        } else {
          setExperiences(fallbackExperiences);
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
        setExperiences(fallbackExperiences);
      }
    };
    fetchExperiences();
  }, []);
  return (
    <section id="experience" className="section-padding px-6 lg:px-12 relative overflow-hidden bg-background-section-2">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 font-display text-text-primary"
          >
            Experience
          </motion.h2>
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
          className="relative border-l-0 md:border-l-2 border-primary/30 ml-0 md:ml-8 space-y-8 md:space-y-12 pb-8"
        >
          
          {experiences.map((exp, idx) => (
            <motion.div 
              key={exp._id || idx}
              variants={{
                hidden: { opacity: 0, x: -30 },
                show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="relative pl-0 md:pl-12 group"
            >
              {/* Timeline Dot */}
              <motion.div 
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (idx * 0.1), type: "spring", stiffness: 200 }}
                className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-background-dark border-4 border-primary shadow-glow z-10 group-hover:scale-125 transition-transform duration-300 hidden md:block" 
              />

              <motion.div 
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                className="glass-card p-6 sm:p-8 relative border-t-4 border-t-primary/40 md:border-t-0 md:border-l-4 md:border-l-primary/30 hover:border-t-primary md:hover:border-l-primary transition-all duration-300 shadow-lg hover:shadow-glow"
              >
                
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 font-display group-hover:text-primary transition-colors">
                        {exp.title}
                      </h3>
                      <p className="text-primary font-semibold text-base md:text-lg hover:underline decoration-primary/50 underline-offset-4 cursor-default">
                        {exp.company}
                      </p>
                    </div>
                    {(exp.images?.length > 0) && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        {exp.images?.length > 1 && (
                          <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full text-primary font-bold border border-primary/20">
                            {exp.images.length} Images
                          </span>
                        )}
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedImages(exp.images);
                            setCurrentImageIndex(0);
                            setModalTitle(exp.title);
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white dark:text-background-dark hover:bg-primary/90 transition-all text-xs font-bold shadow-lg shadow-primary/20 group/btn whitespace-nowrap"
                        >
                          <ImageIcon size={14} />
                          <span>View Proof</span>
                        </motion.button>
                      </div>
                    )}
                  </div>

                <div className="flex flex-wrap gap-3 mb-6 mt-4">
                  <span className="px-3 py-1 rounded-full bg-background-tertiary border border-border text-text-secondary text-sm font-mono">
                    {exp.period}
                  </span>
                  {exp.roleTypes && (
                    <span className="px-3 py-1 rounded-full bg-[rgba(124,58,237,0.1)] border border-secondary/30 text-secondary text-sm font-mono">
                      {exp.roleTypes}
                    </span>
                  )}
                </div>

                <ul className="space-y-3 text-text-secondary mb-6">
                  {exp.responsibilities.map((resp, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="flex items-start gap-3"
                    >
                      <ChevronRight size={18} className="text-primary mt-1 shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: resp }} />
                    </motion.li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {exp.tags.map(tag => (
                    <motion.span 
                      key={tag} 
                      whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--accent-primary-rgb), 0.2)" }}
                      className="px-3 py-1 rounded-full font-mono text-xs text-primary bg-primary/10 border border-primary/20"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}

        </motion.div>
      </div>

      {/* Experience Image Modal */}
      <Modal
        isOpen={selectedImages.length > 0}
        onClose={() => setSelectedImages([])}
        title={modalTitle}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-full group">
            <img 
              src={selectedImages[currentImageIndex]} 
              alt={`${modalTitle} - ${currentImageIndex + 1}`} 
              className="w-full h-auto rounded-lg shadow-2xl"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
            
            {selectedImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === 0 ? selectedImages.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex((prev) => (prev === selectedImages.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRightIcon size={24} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {selectedImages.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary scale-125' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center w-full mt-6">
            <p className="text-text-muted text-sm font-mono">
              {selectedImages.length > 1 ? `Image ${currentImageIndex + 1} of ${selectedImages.length}` : ''}
            </p>
            <button 
              onClick={() => setSelectedImages([])}
              className="btn-primary px-8 py-2 rounded-full text-sm font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Experience;
