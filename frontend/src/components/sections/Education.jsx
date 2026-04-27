import { motion } from 'framer-motion';
import { GraduationCap, ScrollText, Trophy, Check, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import Modal from '../ui/Modal';

const Education = () => {
  const [certifications, setCertifications] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [educations, setEducations] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalTitle, setModalTitle] = useState('');

  const fallbackEducations = [
    {
      _id: 'fallback_edu1',
      degree: 'Bachelor of Technology',
      field: 'Information Technology',
      institution: 'JKKN College of Engineering and Technology',
      location: 'Tamil Nadu, India',
      period: '2023 – 2027',
      score: 'CGPA: 8.41 / 10.0'
    },
    {
      _id: 'fallback_edu2',
      degree: 'Higher Secondary Certificate (HSC)',
      field: '',
      institution: 'JKKN Matric Hr. Sec School, Kumarapalayam',
      location: '',
      period: '2023',
      score: '82.33%'
    }
  ];

  const fallbackCertifications = [
    'Advanced JavaScript – GUVI',
    'Git & GitHub Bootcamp – LetsUpgrade',
    'Data Structures & Algorithms using Python – LinkedIn Learning',
    'Full Stack Web Development – LinkedIn Learning',
    'MERN Stack – Coursera'
  ];

  const fallbackAchievements = [
    '1st Rank in Department — 3 Consecutive Academic Years',
    '1st Prize — Code Contest at ASTHRA 2K25, K.S.R. College of Engineering (Aug 2025)',
    'Research Paper presented at IC-DISQC 2024 — Advancements in Robotics'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certRes, achRes, eduRes] = await Promise.all([
          api.get('/certifications'),
          api.get('/achievements'),
          api.get('/educations')
        ]);
        
        if (certRes.data.success && certRes.data.data.length > 0) {
          setCertifications(certRes.data.data);
        } else {
          setCertifications(fallbackCertifications);
        }

        if (achRes.data.success && achRes.data.data.length > 0) {
          setAchievements(achRes.data.data);
        } else {
          setAchievements(fallbackAchievements);
        }

        if (eduRes.data.success && eduRes.data.data.length > 0) {
          setEducations(eduRes.data.data);
        } else {
          setEducations(fallbackEducations);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setCertifications(fallbackCertifications);
        setAchievements(fallbackAchievements);
        setEducations(fallbackEducations);
      }
    };
    fetchData();
  }, []);

  return (
    <section id="education" className="section-padding px-6 lg:px-12 relative overflow-hidden bg-background-section-2">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4 font-display text-text-primary"
          >
            Education & Certifications
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Education */}
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
            className="space-y-6"
          >
            {educations.map((edu, index) => (
              index === 0 ? (
                <motion.div 
                  key={edu._id || index}
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    show: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                  whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  className="glass-card p-8 border-t-[3px] border-primary relative overflow-hidden group shadow-lg hover:shadow-glow"
                >
                  <div className="absolute top-4 right-4 text-primary/10 group-hover:scale-110 transition-transform duration-500">
                    <GraduationCap size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-6 shadow-glow group-hover:animate-bounce">
                      <GraduationCap size={24} />
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-text-primary font-display mb-1 group-hover:text-primary transition-colors">{edu.degree}</h3>
                    {edu.field && <h4 className="text-lg md:text-xl font-bold text-primary mb-4">{edu.field}</h4>}
                    <p className="text-text-secondary font-medium mb-1 text-sm md:text-base">{edu.institution}</p>
                    {edu.location && <p className="text-text-muted text-sm mb-4">{edu.location}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-4">
                      <span className="px-4 py-1.5 rounded-full bg-background-tertiary border border-border text-sm font-mono text-text-secondary">
                        {edu.period}
                      </span>
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold shadow-glow text-sm">
                        {edu.score?.includes('CGPA') || edu.score?.includes('Score') ? edu.score : `Score: ${edu.score}`}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key={edu._id || index}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                  className="glass-card p-6 border-l-4 border-slate-500 hover:border-primary transition-all shadow-md hover:shadow-glow-sm"
                >
                  <h4 className="text-lg font-bold text-text-primary mb-1">{edu.degree}</h4>
                  <p className="text-text-muted mb-2">{edu.institution}</p>
                  <div className="flex gap-4 text-sm font-mono">
                    <span className="text-text-secondary">Score: <span className="text-text-primary font-bold">{edu.score}</span></span>
                    <span className="text-text-muted">|</span>
                    <span className="text-text-secondary">Year: <span className="text-text-primary font-bold">{edu.period}</span></span>
                  </div>
                </motion.div>
              )
            ))}
          </motion.div>

          {/* Right Column: Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-text-primary mb-6 font-display flex items-center gap-3">
              <ScrollText className="text-secondary" /> Certifications
            </h3>
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    show: { opacity: 1, scale: 1 }
                  }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => {
                    if (cert.image) {
                      setSelectedImages([cert.image]);
                      setCurrentImageIndex(0);
                      setModalTitle(cert.title);
                    }
                  }}
                  className={`glass-card p-4 flex items-start gap-3 border border-white/5 hover:border-secondary/50 transition-all group ${cert.image ? 'cursor-pointer shadow-md hover:shadow-glow-sm' : 'cursor-default'}`}
                >
                  <span className="text-xl group-hover:rotate-12 transition-transform">📜</span>
                  <p className="text-sm font-medium text-text-secondary leading-snug">
                    {typeof cert === 'string' ? cert : (
                      <>
                        <span className="text-text-primary font-bold group-hover:text-secondary transition-colors">{cert.title}</span>
                        {cert.issuer && <span className="block text-xs text-text-muted mt-1">— {cert.issuer}</span>}
                        {cert.image && <span className="text-[10px] text-secondary mt-1 block font-bold">View Certificate →</span>}
                      </>
                    )}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div
          id="achievements"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 pt-12 border-t border-border"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-6 font-display flex items-center gap-3 justify-center">
            <Trophy className="text-primary" /> Achievements
          </h3>
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
            className="flex flex-col gap-4 max-w-4xl mx-auto"
          >
            {achievements.map((achievement, index) => (
              <motion.div 
                key={index} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                onClick={() => {
                  const images = achievement.images || (achievement.image ? [achievement.image] : []);
                  if (images.length > 0) {
                    setSelectedImages(images);
                    setCurrentImageIndex(0);
                    setModalTitle(achievement.title);
                  }
                }}
                className={`glass-card p-4 sm:p-5 border-l-4 border-l-primary flex gap-4 items-start hover:shadow-lg transition-all group ${(achievement.images?.length > 0 || achievement.image) ? 'cursor-pointer' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Check size={16} />
                </div>
                <div className="text-text-secondary font-medium w-full">
                  {typeof achievement === 'string' ? (
                    <p>{achievement}</p>
                  ) : (
                    <>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                      <p className="text-text-primary font-bold text-base md:text-lg group-hover:text-primary transition-colors">{achievement.title}</p>
                      {(achievement.images?.length > 0 || achievement.image) && (
                        <div className="flex items-center gap-2 self-start sm:self-center">
                          {achievement.images?.length > 1 && (
                            <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full text-primary font-bold border border-primary/20">
                              {achievement.images.length} Images
                            </span>
                          )}
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-white dark:text-background-dark hover:bg-primary/90 transition-all text-xs font-bold shadow-lg shadow-primary/20 group/btn whitespace-nowrap"
                          >
                            <ImageIcon size={14} />
                            <span>View proof</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                      <p className="text-sm mt-1">{achievement.description}</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Certificate/Achievement Image Modal */}
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
                    <ChevronRight size={24} />
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

      </div>
    </section>
  );
};

export default Education;
