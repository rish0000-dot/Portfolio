import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated, config } from '@react-spring/three';

const Card = ({ project, index, total, activeIndex, isHovered, onCardHover }) => {
    const meshRef = useRef();

    // Calculate stack position
    // We want cards to stack along Z, slightly offset in X and Y
    const isSelected = index === activeIndex;
    const isThisHovered = isHovered === index;

    // Separation factor when stack is fanned out (global hover)
    const spread = isHovered !== null ? 1.2 : 0.15;

    // Base transforms
    const targetX = index * (isHovered !== null ? 0.4 : 0.05);
    const targetY = index * (isHovered !== null ? -0.2 : -0.02);
    const targetZ = -index * spread;

    // Rotation for fan effect
    const targetRotY = isHovered !== null ? THREE.MathUtils.degToRad(-15 + (index / total) * 30) : 0;

    const { pos, rot, sca, contrast, glow } = useSpring({
        pos: [targetX, targetY, isThisHovered ? targetZ + 0.5 : targetZ],
        rot: [0, targetRotY, 0],
        sca: isThisHovered ? 1.05 : 1,
        contrast: isThisHovered ? 1.2 : 1,
        glow: isThisHovered ? 1 : 0,
        config: { mass: 1, tension: 170, friction: 26, clamp: false }
    });

    return (
        <animated.group
            position={pos}
            rotation={rot}
            scale={sca}
            onPointerOver={(e) => {
                e.stopPropagation();
                onCardHover(index);
            }}
            onPointerOut={() => onCardHover(null)}
        >
            <Html
                transform
                occlude
                distanceFactor={4}
                position={[0, 0, 0]}
                style={{
                    transition: 'all 0.5s ease-out',
                    filter: isHovered !== null && !isThisHovered ? 'brightness(0.5) blur(1px)' : 'none'
                }}
            >
                <div
                    className={`w-[600px] p-8 rounded-3xl border border-white/20 backdrop-blur-2xl transition-all duration-500
            ${isThisHovered ? 'bg-white/10 shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'bg-black/40 shadow-2xl'}
          `}
                >
                    {/* Glass Finish Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none pointer-events-none rounded-3xl" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                            <span className="text-6xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{project.icon}</span>
                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-gray-400">
                                0{index + 1}
                            </div>
                        </div>

                        <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">
                            {project.title}
                        </h3>

                        <p className="text-xl text-gray-300 line-clamp-2 mb-6 font-light">
                            {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {project.tech.map((t, i) => (
                                <span key={i} className="text-[10px] uppercase tracking-widest px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </Html>
        </animated.group>
    );
};

const Stack = ({ projects }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const groupRef = useRef();
    const { mouse, viewport } = useThree();

    useFrame((state) => {
        if (groupRef.current) {
            const targetX = (mouse.x * viewport.width) / 10;
            const targetY = (mouse.y * viewport.height) / 10;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.1);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
        }
    });

    return (
        <group ref={groupRef} position={[2, 0, 0]}> {/* Position stack on the right */}
            {projects.map((project, i) => (
                <Card
                    key={i}
                    index={i}
                    total={projects.length}
                    project={project}
                    isHovered={hoveredIndex}
                    onCardHover={setHoveredIndex}
                />
            ))}
        </group>
    );
};

const ProjectStack = ({ projects }) => {
    return (
        <div className="w-full h-full">
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 35 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={35} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Environment preset="city" />

                <Stack projects={projects} />

                <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
            </Canvas>

            {/* Background grain effect overlay for the whole canvas area */}
            <div className="absolute inset-0 pointer-events-none opacity-20 contrast-150 brightness-50 mix-blend-overlay"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
        </div>
    );
};

export default ProjectStack;
