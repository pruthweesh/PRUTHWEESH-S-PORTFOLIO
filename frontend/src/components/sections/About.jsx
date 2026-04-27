import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  const fallbackAbout = {
    name: "Pruthweesh NV",
    role: "MERN Stack Developer",
    location: "Tamil Nadu, India",
    degree: "B.Tech IT — JKKN CET",
    cgpa: "8.41 / 10",
    status: "Open to Opportunities",
    github: "https://github.com/pruthweesh",
    linkedin: "https://linkedin.com/in/pruthweesh",
    email: "pruthweesh2006@gmail.com",
    paragraphs: [
      "I am an Information Technology undergraduate at JKKN College of Engineering and Technology (2023–2027), building a strong foundation in full-stack web development with specialization in the MERN stack.",
      "Through internships and personal projects, I have gained practical experience in React.js, Tailwind CSS, Node.js, Express.js, and MongoDB — building responsive UIs, RESTful APIs, and database-driven applications.",
      "I secured 1st Rank in my department for 3 consecutive academic years, won 1st Prize at Code Contest ASTHRA 2K25, and presented a research paper at the International Conference IC-DISQC 2024. I am actively seeking full-stack development opportunities."
    ],
    resumeLink: "/resume.pdf"
  };

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await api.get('/about');
        if (response.data.success && response.data.data.length > 0) {
          setAboutData(response.data.data[0]); // Using the first about entry
        } else {
          setAboutData(fallbackAbout);
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
        setAboutData(fallbackAbout);
      }
    };
    fetchAbout();
  }, []);

  if (!aboutData) return null;
  return (
    <section id="about" className="section-padding px-6 lg:px-12 relative overflow-hidden bg-background-section-2">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Left Column: Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-4"
          >
            <motion.div 
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="glass-card p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden group shadow-xl hover:shadow-glow"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Avatar placeholder / image */}
              <motion.div 
                whileHover={{ rotate: 5, scale: 1.1 }}
                className="w-32 h-32 rounded-full mb-6 p-1 bg-gradient-to-tr from-primary to-secondary shadow-glow"
              >
                <div className="w-full h-full rounded-full bg-background-dark flex items-center justify-center overflow-hidden border-[3px] border-background-dark group-hover:border-primary/50 transition-all duration-500">
                  <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-500">👨‍💻</span>
                </div>
              </motion.div>

              <h3 className="text-2xl font-bold text-text-primary mb-1 font-display group-hover:text-primary transition-colors">{aboutData.name}</h3>
              <p className="text-primary font-medium mb-4">{aboutData.role}</p>
              <p className="text-text-secondary text-sm mb-6 flex items-center gap-1 justify-center">
                {aboutData.location} <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>📍</motion.span>
              </p>

              <div className="w-full space-y-3 mb-6 relative z-10">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="w-full px-4 py-2 bg-background-tertiary rounded-lg border border-border text-sm text-text-secondary font-medium transition-all hover:border-primary/30"
                >
                  {aboutData.degree}
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="w-full px-4 py-2 bg-background-tertiary rounded-lg border border-border text-sm text-text-secondary font-medium flex justify-between transition-all hover:border-primary/30"
                >
                  <span>CGPA:</span>
                  <span className="text-primary font-bold">{aboutData.cgpa}</span>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="w-full px-4 py-2 bg-[rgba(16,185,129,0.1)] rounded-lg border border-[rgba(16,185,129,0.2)] text-sm text-success font-medium flex items-center justify-center gap-2 transition-all"
                >
                  {aboutData.status} <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>✅</motion.span>
                </motion.div>
              </div>

              {/* Social Links inside Profile Card */}
              <div className="flex gap-4 relative z-10">
                {aboutData.github && (
                  <motion.a 
                    whileHover={{ scale: 1.2, rotate: -10 }}
                    href={aboutData.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-background-tertiary rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border"
                  >
                    <FaGithub size={18} />
                  </motion.a>
                )}
                {aboutData.github && (
                  <motion.a 
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    href={aboutData.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-background-tertiary rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border"
                  >
                    <FaLinkedin size={18} />
                  </motion.a>
                )}
                {aboutData.email && (
                  <motion.a 
                    whileHover={{ scale: 1.2, y: -5 }}
                    href={`mailto:${aboutData.email}`} className="p-2 bg-background-tertiary rounded-md hover:bg-primary/20 hover:text-primary transition-colors text-text-secondary border border-border"
                  >
                    <FaEnvelope size={18} />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8"
          >
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <span className="text-primary font-mono text-sm tracking-widest font-semibold uppercase">
                &lt; ABOUT ME /&gt;
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, filter: 'blur(5px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-text-primary font-display"
            >
              Who Am I?
            </motion.h2>

            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                    delayChildren: 0.4
                  }
                }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-6 text-text-secondary text-lg leading-relaxed mb-10"
            >
              {aboutData.paragraphs?.map((para, index) => (
                <motion.p 
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                >
                  {para}
                </motion.p>
              ))}
            </motion.div>

            <motion.a 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={aboutData.resumeLink || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline flex items-center gap-3 w-fit hover:shadow-glow group"
            >
              <Download size={20} className="group-hover:animate-bounce" />
              <span>Download Resume</span>
            </motion.a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
