import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, PerspectiveCamera, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { useSpring, animated } from '@react-spring/three';

const AnimatedRoundedBox = animated(RoundedBox);

const Card = ({ project, index, total, activeIndex, isStackHovered, hoveredCard, onHover, onClick }) => {
    const isActuallyHovered = hoveredCard === index;
    const isSelected = activeIndex === project.originalIndex;
    const lightRef = useRef();
    const { mouse, viewport } = useThree();

    // Animation values - Substantial "Deep Spring" feel
    const fanOutZ = isStackHovered ? -index * 1.8 : -index * 0.3;
    const fanOutX = isStackHovered ? index * 0.7 : 0;
    const fanOutY = isStackHovered ? -index * 0.2 : 0;
    const rotationY = isStackHovered ? THREE.MathUtils.degToRad(-15 + (index / total) * 30) : 0;

    const spring = useSpring({
        position: [
            fanOutX,
            fanOutY,
            isActuallyHovered ? fanOutZ + 1.5 : fanOutZ
        ],
        rotation: [0, rotationY, 0],
        scale: isActuallyHovered ? 1.1 : (isSelected ? 1.05 : 1),
        opacity: isStackHovered ? (isActuallyHovered ? 1 : 0.4) : (isSelected ? 1 : 0.8),
        config: { mass: 2, tension: 150, friction: 18 } // Substantial feel
    });

    // Flashlight effect logic
    useFrame(() => {
        if (lightRef.current && isActuallyHovered) {
            const x = (mouse.x * viewport.width) / 10;
            const y = (mouse.y * viewport.height) / 10;
            lightRef.current.position.set(x, y, 1);
        }
    });

    return (
        <animated.group
            position={spring.position}
            rotation={spring.rotation}
            scale={spring.scale}
            onPointerOver={(e) => {
                e.stopPropagation();
                onHover(index);
            }}
            onPointerOut={() => onHover(null)}
            onClick={onClick}
        >
            {/* Layer 1: Metallic Backing Plate */}
            <RoundedBox args={[3.8, 5.2, 0.12]} radius={0.1} smoothness={4} position={[0, 0, -0.05]}>
                <meshStandardMaterial
                    color="#020617"
                    metalness={1}
                    roughness={0.2}
                />
            </RoundedBox>

            {/* Layer 2: Ultra-Premium Glass Core */}
            <AnimatedRoundedBox args={[3.8, 5.2, 0.1]} radius={0.15} smoothness={4}>
                <meshStandardMaterial
                    color={isActuallyHovered ? "#06b6d4" : (isSelected ? "#1e293b" : "#0f172a")}
                    transparent
                    opacity={spring.opacity}
                    roughness={0.05}
                    metalness={0.9}
                    emissive={isActuallyHovered ? "#06b6d4" : "#000000"}
                    emissiveIntensity={isActuallyHovered ? 0.3 : 0}
                />
            </AnimatedRoundedBox>

            {/* Layer 3: Details & Procedural Pattern Overlay */}
            <RoundedBox args={[3.7, 5.1, 0.01]} radius={0.1} smoothness={4} position={[0, 0, 0.051]}>
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={isActuallyHovered ? 0.08 : 0.02}
                    roughness={0}
                    metalness={1}
                />
            </RoundedBox>

            {/* Premium Glowing Edge */}
            <RoundedBox args={[3.84, 5.24, 0.02]} radius={0.15} smoothness={4} position={[0, 0, -0.02]}>
                <meshBasicMaterial
                    color={isActuallyHovered ? "#22d3ee" : (isSelected ? "#0ea5e9" : "#ffffff")}
                    transparent
                    opacity={isActuallyHovered ? 1 : 0.1}
                />
            </RoundedBox>

            {/* Dynamic Local Flashlight */}
            {isActuallyHovered && (
                <pointLight
                    ref={lightRef}
                    intensity={2}
                    distance={8}
                    color="#ffffff"
                />
            )}

            {/* High-End Content Layout */}
            <group position={[0, 0, 0.12]}>
                {/* Visual Accent */}
                <mesh position={[-1.4, 2.1, 0]}>
                    <planeGeometry args={[0.4, 0.02]} />
                    <meshBasicMaterial color="#06b6d4" />
                </mesh>

                {/* Main Icon */}
                <Text
                    position={[0, 1.6, 0]}
                    fontSize={1.2}
                    color="white"
                >
                    {project.icon}
                </Text>

                {/* Typography Hierarchy */}
                <Text
                    position={[0, 0.4, 0]}
                    fontSize={0.28}
                    maxWidth={3}
                    textAlign="center"
                    color="white"
                    fontWeight="950"
                    letterSpacing={0.15}
                >
                    {project.title.toUpperCase()}
                </Text>

                <Text
                    position={[0, -0.8, 0]}
                    fontSize={0.18}
                    maxWidth={3}
                    textAlign="center"
                    color="#cbd5e1"
                    lineHeight={1.6}
                >
                    {project.description}
                </Text>

                {/* Enhanced Tech Tags */}
                <group position={[0, -2, 0]}>
                    {project.tech?.slice(0, 3).map((t, i) => (
                        <group key={i} position={[(i - 1) * 1.1, 0, 0]}>
                            <Text
                                fontSize={0.12}
                                color="#22d3ee"
                                fontWeight="bold"
                            >
                                {t}
                            </Text>
                            <mesh position={[0, -0.15, 0]}>
                                <planeGeometry args={[0.4, 0.01]} />
                                <meshBasicMaterial color="#22d3ee" transparent opacity={0.3} />
                            </mesh>
                        </group>
                    ))}
                </group>
            </group>
        </animated.group>
    );
};


const Stack = ({ projects, activeIndex, setActiveIndex, setIsPaused }) => {
    const [isStackHovered, setIsStackHovered] = useState(false);
    const [hoveredCard, setHoveredCard] = useState(null);
    const groupRef = useRef();
    const { mouse, viewport } = useThree();

    const handleStackOver = () => {
        setIsStackHovered(true);
        if (setIsPaused) setIsPaused(true);
    };

    const handleStackOut = () => {
        setIsStackHovered(false);
        if (setIsPaused) setIsPaused(false);
    };

    useFrame(() => {
        if (groupRef.current) {
            const px = (mouse.x * viewport.width) / 10;
            const py = (mouse.y * viewport.height) / 10;
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, px, 0.06);
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, py, 0.06);

            // Subtle rotation based on mouse
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.06);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.1, 0.06);
        }
    });

    const stackProjects = useMemo(() => {
        if (!projects || projects.length === 0) return [];
        const start = Math.max(0, activeIndex - 3);
        const end = Math.min(projects.length, start + 8);
        return projects.slice(start, end).map((p, i) => ({ ...p, originalIndex: start + i }));
    }, [projects, activeIndex]);

    return (
        <group
            ref={groupRef}
            onPointerOver={handleStackOver}
            onPointerOut={handleStackOut}
            position={[0, 0, 0]}
        >
            {stackProjects.map((project, i) => (
                <Card
                    key={project.originalIndex}
                    index={i}
                    total={stackProjects.length}
                    project={project}
                    activeIndex={activeIndex}
                    isStackHovered={isStackHovered}
                    hoveredCard={hoveredCard}
                    onHover={setHoveredCard}
                    onClick={() => setActiveIndex(project.originalIndex)}
                />
            ))}
        </group>
    );
};

const ProjectStack3D = ({ projects, activeIndex, setActiveIndex, setIsPaused }) => {
    return (
        <div className="w-full h-full relative" style={{ minHeight: '650px' }}>
            <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 12], fov: 35 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={35} />

                <ambientLight intensity={0.5} />

                {/* Multi-point Cinematic Lighting */}
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#06b6d4" />
                <spotLight position={[-10, -10, 10]} angle={0.15} penumbra={1} intensity={1} color="#3b82f6" />
                <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffffff" />

                <Suspense fallback={<Text color="white">CALIBRATING INTERFACE...</Text>}>
                    <Stack
                        projects={projects}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        setIsPaused={setIsPaused}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default ProjectStack3D;
