import './index.css'

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei';
import AntigravityBackground from './components/AntigravityBackground';
import Robot from './components/Robot';
import HangingRobot from './components/HangingRobot';
import ProjectsRing from './components/ProjectsRing';
import ProjectStack3D from './components/ProjectStack3D';
import AboutImageCard from './components/AboutImageCard';

// Custom cursor component
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      <motion.div
        className="fixed w-8 h-8 border-2 border-cyan-400 rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      />
    </>
  );
};

// Loading screen
const LoadingScreen = ({ isLoading }) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-cyan-400 font-mono text-sm whitespace-nowrap"
            >
              Initializing...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 3D Animated Globe
const AnimatedSphere = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1, 100, 100]} scale={2.5}>
        <MeshDistortMaterial
          color="#06b6d4"
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

// Hero Section
const HeroSection = () => {
  // Typing Effect
  const [typedText, setTypedText] = useState('');
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const skills = ['Data Structures', 'Full Stack Developer', 'React Developer', 'Problem Solver', 'AI/ML'];

  useEffect(() => {
    const currentSkill = skills[currentSkillIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= currentSkill.length) {
        setTypedText(currentSkill.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setTypedText('');
          setCurrentSkillIndex((prev) => (prev + 1) % skills.length);
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, [currentSkillIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">

      <div className="relative z-20 max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center">

        {/* Left Column: Text Content */}
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-cyan-400 text-sm md:text-base mb-4 font-mono tracking-wider"
            >
              &lt;Hello World /&gt;
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-5xl md:text-7xl lg:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 leading-tight"
            >
              Rishabh Sharma
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-2xl md:text-3xl lg:text-3xl font-semibold mb-6 text-white"
            >
              Aspiring Software/Web Developer
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="text-lg md:text-xl text-gray-300 mb-8 italic max-w-lg"
            >
              "Building scalable digital solutions with code and creativity."
            </motion.p>

            <div className="flex items-center gap-2 mb-10 h-8">
              <span className="text-cyan-400 font-mono text-xl">{typedText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-cyan-400 text-xl"
              >
                |
              </motion.span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-wrap gap-4"
            >
              <a href="#projects">
                <button className="group relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105">
                  <span className="relative z-10">View Projects</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </a>

              <a href="/resume_rishabh.html" download="Rishabh_Sharma_Resume.html" target="_blank" rel="noopener noreferrer">
                <button className="group relative px-6 py-3 bg-white/5 backdrop-blur-md border-2 border-cyan-400/30 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105">
                  <span className="relative z-10">Download Resume</span>
                </button>
              </a>

              <a href="#contact">
                <button className="group relative px-6 py-3 bg-white/5 backdrop-blur-md border-2 border-purple-400/30 rounded-lg font-semibold text-white overflow-hidden transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105">
                  <span className="relative z-10">Contact Me</span>
                </button>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Column: Hanging Robot */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-[500px] lg:h-[700px] w-full relative"
        >
          <HangingRobot />
        </motion.div>

      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-cyan-400 text-3xl"
        >
          ↓
        </motion.div>
      </motion.div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="relative py-12 px-4 md:px-8 lg:px-12 overflow-hidden bg-transparent">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 items-stretch">
          {/* Left Column: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-full"
          >
            <div className="relative h-full p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:border-cyan-400/50 transition-all duration-300">
              <div className="absolute -top-3 -left-3 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-3 -right-3 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl" />

              <div className="relative space-y-6">
                <div className="text-cyan-400 text-5xl mb-4">👨‍💻</div>

                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">I’m Rishabh Sharma</h3>
                  <p className="text-cyan-400 font-mono text-lg">Aspiring Software/Web Developer</p>
                </div>

                <div className="text-gray-300 space-y-2 leading-relaxed text-base md:text-lg">
                  <p>🔭 I’m currently pursuing B.Tech (2nd Year) in Computer Science</p>
                  <p>✒️ I have a background in Computer Science and Programming</p>
                  <p>🌱 I’m currently learning Data Structures, .NET, and Full Stack Development</p>
                  <p>👯 I’m looking to collaborate on Web Development projects</p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">📧</span>
                    <a href="mailto:rishabhsharma14426@gmail.com" className="hover:text-cyan-400 transition-colors">rishabhsharma14426@gmail.com</a>
                  </p>
                  <p className="flex items-center gap-3 text-gray-300">
                    <span className="text-xl">📍</span>
                    <span>Mathura, India – 281001</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: 3D Robot */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center h-full min-h-[400px]"
          >
            <AboutImageCard imageUrl="/about-me.jpg" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Projects Section
// Projects Section
const ProjectsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate effect
  useEffect(() => {
    if (isPaused) return; // Stop rotation if paused
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const projects = [
    {
      title: 'Full-Stack Web App',
      description: 'A scalable MERN stack application with authentication, real-time features, and responsive design.',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      gradient: 'from-cyan-500 to-blue-600',
      icon: '🌐',
    },
    {
      title: 'CODEGUARDIA',
      description: 'Advanced code security and monitoring system designed to protect and analyze codebases.',
      tech: ['Python', 'Pandas', 'Plotly', 'SQL'],
      gradient: 'from-blue-500 to-purple-600',
      icon: '🛡️',
      isCodeGuardia: true,
    },
    {
      title: 'AI/ML Project',
      description: 'Machine learning model for predictive analytics with high accuracy and real-world applications.',
      tech: ['Python', 'TensorFlow', 'Scikit-learn', 'NumPy'],
      gradient: 'from-purple-500 to-pink-600',
      icon: '🤖',
    },
    {
      title: 'API-Based App',
      description: 'RESTful API integration project with secure endpoints and efficient data handling.',
      tech: ['Node.js', 'Express', 'REST', 'JWT'],
      gradient: 'from-pink-500 to-red-600',
      icon: '🔌',
    },
    {
      title: 'Portfolio Website',
      description: 'Modern 3D portfolio featuring interactive elements and smooth animations.',
      tech: ['React', 'Three.js', 'Tailwind', 'Framer'],
      gradient: 'from-cyan-400 to-teal-500',
      icon: '🎨',
    },
    {
      title: 'Data Visualizer',
      description: 'Interactive dashboard for visualizing complex datasets.',
      tech: ['D3.js', 'React', 'Firebase'],
      gradient: 'from-orange-500 to-red-500',
      icon: '📊',
    }
  ];

  return (
    <section
      id="projects"
      className="relative min-h-screen py-10 px-4 overflow-hidden bg-transparent flex flex-col justify-center"
      onClick={() => setIsPaused(false)} // Resume rotation on background click
    >

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Project List & Info */}
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-widest">
              Selected Works
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-white leading-tight">
              Featured <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Projects
              </span>
            </h2>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed">
              A collection of high-end digital experiences, built with precision and a focus on performance.
            </p>
          </motion.div>

          {/* Interactive List - Editorial Style */}
          <div className="space-y-1">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className={`group cursor-pointer flex items-center justify-between p-4 rounded-2xl transition-all duration-500
                                ${activeIndex === index ? 'bg-white/5 backdrop-blur-md border border-white/10' : 'hover:bg-white/[0.02] border border-transparent'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(index);
                  setIsPaused(true);
                }}
              >
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-black font-mono transition-all duration-500 ${activeIndex === index ? 'text-cyan-400 translate-x-1' : 'text-gray-800'}`}>
                    0{index + 1}
                  </span>

                  <div>
                    <h3 className={`text-2xl font-bold transition-all duration-500 ${activeIndex === index ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                      {project.title}
                    </h3>
                    <div className={`overflow-hidden transition-all duration-500 ${activeIndex === index ? 'max-h-20 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                      <div className="flex gap-2">
                        {project.tech.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] uppercase tracking-widest text-cyan-400/80 font-bold px-2 py-0.5 border border-cyan-400/20 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  animate={{ x: activeIndex === index ? 0 : -10, opacity: activeIndex === index ? 1 : 0 }}
                  className="text-cyan-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: 3D Project Stack */}
        <div className="h-[600px] w-full relative">
          <ProjectStack3D
            projects={projects}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            setIsPaused={setIsPaused}
          />
        </div>
      </div>
    </section>
  );
};

// Skills Section
const SkillsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const skillCategories = [
    {
      category: 'Frontend',
      skills: ['HTML', 'CSS', 'JavaScript', 'React'],
      details: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Tailwind CSS', 'Redux', 'Next.js', 'Framer Motion', 'Bootstrap', 'Material UI'],
      icon: '🎨',
      color: 'cyan',
    },
    {
      category: 'Backend',
      skills: ['Node.js', 'Express', 'REST APIs'],
      details: ['Node.js', 'Express.js', 'RESTful Architecture', 'GraphQL', 'Socket.io', 'JWT Authentication', 'Microservices', 'Serverless'],
      icon: '⚙️',
      color: 'blue',
    },
    {
      category: 'Languages',
      skills: ['Python', 'Java', 'C++'],
      details: ['Python', 'Java (Core & Advanced)', 'C++', 'JavaScript', 'TypeScript', 'SQL', 'Bash/Shell'],
      icon: '💻',
      color: 'purple',
    },
    {
      category: 'Database',
      skills: ['SQL', 'MongoDB', 'PostgreSQL'],
      details: ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase', 'Database Design', 'Normalization'],
      icon: '🗄️',
      color: 'pink',
    },
    {
      category: 'Tools',
      skills: ['Git', 'Docker', 'AWS', 'Linux'],
      details: ['Git & GitHub', 'Docker', 'Kubernetes', 'AWS (EC2, S3, Lambda)', 'Linux Administration', 'Postman', 'Vite', 'Webpack'],
      icon: '🛠️',
      color: 'indigo',
    },
    {
      category: 'Concepts',
      skills: ['DSA', 'OOP', 'System Design'],
      details: ['Data Structures', 'Algorithms', 'Object-Oriented Programming', 'System Design', 'Design Patterns', 'Agile/Scrum', 'CI/CD Pipelines', 'Testing'],
      icon: '📚',
      color: 'violet',
    },
  ];

  const colorMap = {
    cyan: 'from-cyan-400 to-cyan-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    pink: 'from-pink-400 to-pink-600',
    indigo: 'from-indigo-400 to-indigo-600',
    violet: 'from-violet-400 to-violet-600',
  };

  return (
    <section id="skills" className="relative py-24 px-4 overflow-hidden bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Technical Skills
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 text-lg">Click on any card to view detailed skill set</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              layoutId={`card-${category.category}`}
              onClick={() => setSelectedCategory(category)}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative cursor-pointer"
            >
              <div className="relative p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-500/20">
                <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[category.color]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{category.icon}</span>
                    <h3 className="text-xl font-bold text-white">{category.category}</h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 bg-gradient-to-r ${colorMap[category.color]} bg-opacity-20 border border-white/20 rounded-full text-sm text-white font-medium backdrop-blur-sm`}
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-400">+More</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCategory(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`card-${selectedCategory.category}`}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${colorMap[selectedCategory.color]} opacity-20 blur-3xl rounded-full pointer-events-none`} />

              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
              >
                ✕
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-6xl">{selectedCategory.icon}</span>
                  <div>
                    <h3 className="text-3xl font-bold text-white">{selectedCategory.category}</h3>
                    <p className="text-gray-400">Comprehensive Skill Set</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedCategory.details.map((skill, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-white/5 border border-white/10 rounded-xl text-center hover:border-white/30 transition-colors"
                    >
                      <span className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${colorMap[selectedCategory.color]}`}>
                        {skill}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Education Section
const EducationSection = () => {
  const education = [
    {
      degree: 'B.Tech in Computer Science & Engineering',
      institution: 'GLA University, Mathura',
      period: '2023 - 2027',
      status: 'Pursuing',
      details: 'Focusing on Advanced Algorithms, Machine Learning, and Full Stack Development.',
      icon: '🎓',
      color: 'cyan',
    },
    {
      degree: 'Diploma in Engineering',
      institution: 'Board of Technical Education',
      period: '2020 - 2023',
      status: 'Completed',
      details: 'Specialized in Computer Science with a focus on Software Fundamentals and Networking.',
      icon: '📜',
      color: 'blue',
    },
    {
      degree: 'Higher Secondary Education',
      institution: "St. Paul's Senior Sec. School | CBSE",
      period: '2018 - 2020',
      status: 'Completed',
      details: 'Completed with a focus on Physics, Chemistry, and Mathematics.',
      icon: '🏫',
      color: 'purple',
    },
  ];

  const colorMap = {
    cyan: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5',
    blue: 'border-blue-500/30 text-blue-400 bg-blue-500/5',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/5',
  };

  return (
    <section id="education" className="relative py-24 px-4 bg-transparent overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            Academic Journey
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
            My <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">Education</span>
          </h2>
          <p className="text-gray-400 text-lg italic font-light max-w-2xl mx-auto">
            "Education is not the learning of facts, but the training of the mind to think."
          </p>
        </motion.div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent" />

          <div className="space-y-12">
            {education.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col md:flex-row items-center cursor-default
                  ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Content Card */}
                <div className="w-full md:w-[45%]">
                  <motion.div
                    whileHover={{ scale: 1.02, translateY: -5 }}
                    className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group shadow-2xl transition-all duration-500 hover:border-cyan-400/30"
                  >
                    {/* Animated Shine Effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />

                    <div className="relative z-20">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-4xl">{item.icon}</span>
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border rounded-full ${colorMap[item.color]}`}>
                          {item.status}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                        {item.degree}
                      </h3>
                      <p className="text-gray-300 font-medium mb-4">{item.institution}</p>

                      <div className="w-full h-px bg-white/5 mb-4" />

                      <div className="flex justify-between items-center text-sm font-mono tracking-wider">
                        <span className="text-cyan-400/80">{item.period}</span>
                        <span className="text-gray-500 text-[10px] uppercase">Validated</span>
                      </div>

                      <p className="mt-4 text-gray-400 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-20 overflow-hidden">
                        {item.details}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Timeline Center Node */}
                <div className="relative flex items-center justify-center w-12 mx-auto md:w-[10%] my-6 md:my-0">
                  <div className="w-4 h-4 bg-cyan-500 rounded-full border-4 border-black z-10 shadow-[0_0_20px_rgba(6,182,212,0.8)]" />
                  <div className="absolute w-8 h-8 bg-cyan-400/20 rounded-full animate-ping" />
                </div>

                {/* Date Side (Hidden on Mobile) */}
                <div className="hidden md:block w-[45%] text-left px-8">
                  <span className="text-4xl font-black font-mono text-gray-800 opacity-30 select-none">
                    {item.period.split(' - ')[0]}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' or 'error'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    // Replace with your actual Service ID, Template ID, and Public Key from EmailJS
    const serviceId = 'service_ubf8xct';
    const templateId = 'template_ydj0aom';
    const publicKey = 'nt4mJGSnQV_ond_Oa';

    emailjs.send(
      serviceId,
      templateId,
      {
        from_name: form.name,
        to_name: "Rishabh Sharma",
        from_email: form.email,
        to_email: "rishabhsharma14426@gmail.com",
        message: form.message,
      },
      publicKey
    )
      .then(() => {
        setLoading(false);
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(null), 5000);
      }, (error) => {
        setLoading(false);
        setStatus('error');
        console.error(error);
        setTimeout(() => setStatus(null), 5000);
      });
  };

  return (
    <section id="contact" className="relative py-24 px-4 overflow-hidden bg-transparent">
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600">
            Let's Connect
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto rounded-full" />
          <p className="text-gray-400 mt-4 text-lg">Ready to collaborate on exciting projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
        >
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                placeholder="Your name"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
              <textarea
                rows={4}
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                placeholder="Let's discuss your project..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-center mt-4"
              >
                Message sent successfully!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-center mt-4"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 flex justify-center gap-6"
        >
          <a
            href="https://github.com/rish0000-dot"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-1"
          >
            <svg className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>

          <a
            href="https://www.linkedin.com/in/rishabh-sharma"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-1"
          >
            <svg className="w-8 h-8 text-white group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          <a
            href="https://leetcode.com/u/rishabh_sharma__/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/30 hover:-translate-y-1"
          >
            <svg className="w-8 h-8 text-white group-hover:text-yellow-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.843 5.843 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
            </svg>
          </a>

          <a
            href="https://www.instagram.com/rishabh__brahman___/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/30 hover:-translate-y-1"
          >
            <svg className="w-8 h-8 text-white group-hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href="mailto:rishabhsharma14426@gmail.com"
            className="group relative p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl transition-all duration-300 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1"
          >
            <svg className="w-8 h-8 text-white group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="relative py-8 px-4 border-t border-white/10">
      <div className="absolute inset-0 bg-black" />
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <p className="text-gray-400 font-mono">
          &lt;/&gt; Designed & Built by <span className="text-cyan-400">Rishabh Sharma</span> • {new Date().getFullYear()}
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Made with React, Three.js & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};

// Navigation
const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center justify-center w-14 h-14 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg shadow-cyan-500/20 group cursor-pointer overflow-hidden"
        >
          {/* Animated Gradient Background on Hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-purple-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Glowing Border effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 rounded-xl transition-colors duration-500" />

          {/* Text */}
          <span className="relative z-10 text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 group-hover:from-white group-hover:to-cyan-200 transition-all duration-300 font-sans tracking-tighter">
            RS
          </span>

          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
        </motion.div>

        <div className="hidden md:flex gap-8">
          {['About', 'Skills', 'Education', 'Projects', 'Contact'].map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              whileHover={{ scale: 1.1 }}
              className="text-gray-300 hover:text-cyan-400 transition-colors font-medium"
            >
              {item}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

// Main App Component
export default function PortfolioWebsite() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          overflow-x: hidden;
          cursor: none;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #000;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #06b6d4, #8b5cf6);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0891b2, #7c3aed);
        }
      `}</style>

      <LoadingScreen isLoading={isLoading} />
      <CustomCursor />
      <AntigravityBackground /> {/* Added Global Background */}
      <Navigation />

      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <EducationSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Dark mode toggle */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-8 right-8 z-50 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-2xl hover:border-cyan-400 transition-all duration-300"
      >
        {darkMode ? '☀️' : '🌙'}
      </motion.button>
    </div>
  );
}
