import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, Float, Environment, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';

const ProjectCard = ({ project, index, total, activeIndex, onClick, isPaused }) => {
    // Calculate position in a ring
    const theta = (index / total) * Math.PI * 2;
    const radius = 2.0; // Tighter radius for overlap/fan effect

    const x = Math.sin(theta) * radius;
    const z = Math.cos(theta) * radius;

    // Rotation: Normal to the cylinder surface
    const rotY = Math.atan2(x, z);

    // Animation values
    const isActive = index === activeIndex;

    // Spring animation for smooth movement
    const { position, rotation, scale } = useSpring({
        position: [x, 0, z],
        rotation: [0, rotY, 0],
        scale: isActive ? 1.1 : 0.8,
        config: { mass: 2, tension: 150, friction: 30 }
    });

    return (
        <animated.group
            position={position}
            rotation={rotation}
            scale={scale}
        >
            <Float speed={2} rotationIntensity={0.05} floatIntensity={0.2}>
                <Html transform occlude distanceFactor={1.5} position={[0, 0, 0]}>
                    <div
                        className={`w-[700px] p-12 rounded-[2rem] border transition-all duration-700 backdrop-blur-xl select-none group relative overflow-hidden cursor-pointer
              ${isActive
                                ? 'bg-white/10 border-cyan-400 shadow-[0_0_80px_rgba(6,182,212,0.4)] z-50'
                                : 'bg-black/60 border-white/5 opacity-40 hover:opacity-80 hover:bg-white/5 grayscale hover:grayscale-0'
                            }`}
                        onClick={() => onClick(index)}
                    >
                        {/* Glass Reflection */}
                        <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'group-hover:opacity-40'}`} />

                        <div className="relative z-10">
                            <div className="h-80 mb-10 bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden flex items-center justify-center text-[10rem] shadow-inner border border-white/5 relative group-hover:scale-105 transition-transform duration-500">
                                <span className="filter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">{project.icon}</span>
                                {/* Decorative glint */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
                            </div>

                            <h3 className={`text-6xl font-bold mb-6 truncate transition-all duration-300 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 translate-x-1' : 'text-white'}`}>
                                {project.title}
                            </h3>
                            <p className="text-2xl text-gray-300 line-clamp-3 mb-8 leading-relaxed font-light tracking-wide">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-4 mb-6">
                                {project.tech.slice(0, 3).map((t, i) => (
                                    <span key={i} className={`text-lg uppercase tracking-wider px-4 py-2 rounded-lg border transition-colors duration-300 ${isActive ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons - Only when active and interaction paused */}
                            {isActive && isPaused && (
                                <div className="flex gap-4 mt-4 animate-fadeIn">
                                    <button
                                        className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xl font-bold text-white shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open('https://github.com/rish0000-dot/CODEGUARDIA-PROJECT', '_blank');
                                        }}
                                    >
                                        View Demo
                                    </button>
                                    <button
                                        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl text-xl font-bold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open('https://github.com/rish0000-dot/CODEGUARDIA-PROJECT', '_blank');
                                        }}
                                    >
                                        GitHub
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Html>
            </Float>
        </animated.group>
    );
};

const RingGroup = ({ projects, activeIndex, setActiveIndex, isPaused, setIsPaused }) => {
    const groupRef = useRef();

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Target rotation: -activeIndex * (2PI / total)
            const targetRotation = -(activeIndex / projects.length) * Math.PI * 2;

            // Smooth rotation
            let current = groupRef.current.rotation.y;
            let target = targetRotation;

            const PI2 = Math.PI * 2;
            while (target - current > Math.PI) target -= PI2;
            while (target - current < -Math.PI) target += PI2;

            // Slower for heavier feel
            groupRef.current.rotation.y = THREE.MathUtils.lerp(current, target, 0.02);
        }
    });

    return (
        <group ref={groupRef}>
            {projects.map((project, i) => (
                <ProjectCard
                    key={i}
                    index={i}
                    total={projects.length}
                    project={project}
                    activeIndex={activeIndex}

                    onClick={(idx) => { setActiveIndex(idx); setIsPaused(true); }}
                    isPaused={isPaused}
                />
            ))}
        </group>
    );
};

const ProjectsRing = ({ projects, activeIndex, setActiveIndex, isPaused, setIsPaused }) => {
    const ringProjects = useMemo(() => {
        if (projects.length === 0) return [];
        if (projects.length >= 6) return projects;
        let filled = [...projects];
        while (filled.length < 6) {
            filled = [...filled, ...projects];
        }
        return filled;
    }, [projects]);

    return (
        <div className="w-full h-[600px] lg:h-[700px] flex items-center">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 9], fov: 40 }}>
                {/* Adjusted camera position for tighter framing with larger cards */}
                <ambientLight intensity={0.5} />
                <Environment preset="city" />

                <RingGroup
                    projects={ringProjects}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                />

                <fog attach="fog" args={['#000', 6, 14]} />
            </Canvas>
        </div>
    );
};

export default ProjectsRing;
