import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';
import { PerspectiveCamera, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const RobotModel = () => {
    const headRef = useRef();
    const eyesRef = useRef();
    const { mouse, viewport } = useThree();

    // Smooth animation for head rotation
    const [springs, api] = useSpring(() => ({
        rotation: [0, 0, 0],
        config: { mass: 1, tension: 170, friction: 26 },
    }));

    useFrame((state) => {
        // Calculate target rotation based on mouse position
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;

        // Look at mouse logic
        const targetX = -mouse.y * 0.5; // Look up/down
        const targetY = mouse.x * 0.5;  // Look left/right

        api.start({
            rotation: [targetX, targetY, 0],
        });

        if (headRef.current) {
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetX, 0.1);
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetY, 0.1);
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Head Group */}
                <group ref={headRef} position={[0, 0.5, 0]}>
                    {/* Main Head Shape (Cube with rounded corners looking cute) */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 1, 1]} />
                        <meshStandardMaterial color="#06b6d4" roughness={0.3} metalness={0.8} />
                    </mesh>

                    {/* Face Screen (Black glass) */}
                    <mesh position={[0, 0, 0.51]}>
                        <planeGeometry args={[1, 0.8]} />
                        <meshStandardMaterial color="#000000" roughness={0.2} metalness={1} />
                    </mesh>

                    {/* Glowing Eyes */}
                    <group ref={eyesRef} position={[0, 0, 0.52]}>
                        {/* Left Eye */}
                        <mesh position={[-0.25, 0.05, 0]}>
                            <capsuleGeometry args={[0.08, 0.15, 4, 8]} />
                            <meshBasicMaterial color="#00ffff" toneMapped={false} />
                            <pointLight distance={1} intensity={2} color="#00ffff" />
                        </mesh>
                        {/* Right Eye */}
                        <mesh position={[0.25, 0.05, 0]}>
                            <capsuleGeometry args={[0.08, 0.15, 4, 8]} />
                            <meshBasicMaterial color="#00ffff" toneMapped={false} />
                            <pointLight distance={1} intensity={2} color="#00ffff" />
                        </mesh>
                    </group>

                    {/* Antenna */}
                    <mesh position={[0, 0.6, 0]}>
                        <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                        <meshStandardMaterial color="#888" />
                    </mesh>
                    <mesh position={[0, 0.9, 0]}>
                        <sphereGeometry args={[0.1]} />
                        <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={2} />
                        <pointLight distance={2} intensity={2} color="#ff00ff" />
                    </mesh>
                </group>

                {/* Neck */}
                <mesh position={[0, -0.1, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.3]} />
                    <meshStandardMaterial color="#333" />
                </mesh>

                {/* Body */}
                <mesh position={[0, -0.8, 0]}>
                    <sphereGeometry args={[0.9, 32, 32]} />
                    <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.6} />
                </mesh>

                {/* Core Light */}
                <mesh position={[0, -0.8, 0.75]}>
                    <circleGeometry args={[0.2, 32]} />
                    <meshBasicMaterial color="#a855f7" toneMapped={false} />
                    <pointLight distance={3} intensity={3} color="#a855f7" />
                </mesh>

            </Float>

            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={10} blur={2.5} far={4} />
        </group>
    );
};

const Robot = () => {
    return (
        <div className="w-full h-[300px] lg:h-[400px]">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#06b6d4" />
                <RobotModel />
            </Canvas>
        </div>
    );
};

export default Robot;
