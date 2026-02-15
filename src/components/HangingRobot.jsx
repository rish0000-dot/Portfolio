import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useSpring } from '@react-spring/three';
import { PerspectiveCamera, Float, Environment, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';



const ChromeRobotModel = () => {
    const groupRef = useRef();
    const bodyRef = useRef();
    const headRef = useRef();
    const leftArmRef = useRef();
    const rightArmRef = useRef();
    const leftLegRef = useRef();
    const rightLegRef = useRef();


    const [waving, setWaving] = useState(false);

    const { mouse, viewport } = useThree();

    const handleWave = (e) => {
        e.stopPropagation();
        setWaving(true);
        setTimeout(() => setWaving(false), 2500); // Wave for 2.5 seconds
    };


    useFrame((state) => {
        // Mouse interaction logic
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;

        // Target rotations
        const targetRotX = -mouse.y * 0.5;
        const targetRotY = mouse.x * 0.5;

        // Whole body sway (float effect)
        if (groupRef.current) {
            // Sway the whole group slightly based on mouse horizontal position
            groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, mouse.x * 0.1, 0.05);
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -mouse.y * 0.1, 0.05);
        }

        // Head look at
        if (headRef.current) {
            headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY * 1.2, 0.1);
            headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX * 0.8, 0.1);
        }

        // Limbs movement (slight dangle/physics simulation feel)
        const time = state.clock.getElapsedTime();
        const dangle = Math.sin(time * 2) * 0.1;

        if (leftArmRef.current) leftArmRef.current.rotation.x = dangle;

        // Right Arm Logic (Waving vs Dangle)
        if (rightArmRef.current) {
            if (waving) {
                // Waving Animation: Raised arm and fast z-rotation
                rightArmRef.current.rotation.z = Math.PI - 0.5 + Math.sin(time * 15) * 0.5; // Wave up high
                rightArmRef.current.rotation.x = -0.5; // Tilt forward slightly
            } else {
                // Normal Dangle
                rightArmRef.current.rotation.z = THREE.MathUtils.lerp(rightArmRef.current.rotation.z, 0, 0.1);
                rightArmRef.current.rotation.x = -dangle;
            }
        }

        if (leftLegRef.current) leftLegRef.current.rotation.z = dangle * 0.5;
        if (rightLegRef.current) rightLegRef.current.rotation.z = -dangle * 0.5;
    });

    // Chrome Material props
    const chromeMaterial = <meshStandardMaterial color="#ffffff" metalness={1} roughness={0.15} envMapIntensity={1.5} />;
    const darkChromeMaterial = <meshStandardMaterial color="#444444" metalness={1} roughness={0.2} />;



    return (
        <group
            ref={groupRef}
            position={[0, -0.5, 0]}
            onClick={handleWave}
            onPointerOver={() => document.body.style.cursor = 'pointer'}
            onPointerOut={() => document.body.style.cursor = 'auto'}
        >
            {/* Speech Bubble */}
            {waving && (
                <Html position={[0.6, 2, 0]} center>
                    <div className="bg-white text-black px-4 py-2 rounded-2xl font-bold text-xl shadow-lg animate-bounce border-2 border-cyan-400 bubble-tail transform">
                        Hi! 👋
                    </div>
                </Html>
            )}



            {/* Character Group */}
            <group ref={bodyRef}>
                {/* HEAD */}
                <group ref={headRef} position={[0, 1.4, 0]}>
                    <mesh position={[0, 0, 0]}>
                        <sphereGeometry args={[0.45, 32, 32]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Eyes - Big glossy anime style eyes */}
                    <mesh position={[-0.15, 0.05, 0.38]} rotation={[0.1, 0, 0]}>
                        <sphereGeometry args={[0.14, 32, 32]} />
                        <meshStandardMaterial color="#000000" roughness={0} />
                    </mesh>
                    <mesh position={[0.15, 0.05, 0.38]} rotation={[0.1, 0, 0]}>
                        <sphereGeometry args={[0.14, 32, 32]} />
                        <meshStandardMaterial color="#000000" roughness={0} />
                    </mesh>
                    {/* Eye reflections */}
                    <mesh position={[-0.18, 0.1, 0.48]}>
                        <sphereGeometry args={[0.03]} />
                        <meshBasicMaterial color="white" />
                    </mesh>
                    <mesh position={[0.12, 0.1, 0.48]}>
                        <sphereGeometry args={[0.03]} />
                        <meshBasicMaterial color="white" />
                    </mesh>
                </group>

                {/* NECK */}
                <mesh position={[0, 0.95, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.2]} />
                    {darkChromeMaterial}
                </mesh>

                {/* TORSO */}
                <mesh position={[0, 0.4, 0]}>
                    {/* Upper Body */}
                    <cylinderGeometry args={[0.3, 0.25, 0.8, 16]} />
                    {chromeMaterial}
                </mesh>
                {/* Backpack/Jetpack detail */}
                <mesh position={[0, 0.5, -0.25]}>
                    <boxGeometry args={[0.4, 0.5, 0.2]} />
                    {darkChromeMaterial}
                </mesh>
                {/* Sword/Antenna Handle look-alike */}
                <mesh position={[0.2, 0.6, -0.35]} rotation={[0, 0, -0.5]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.8]} />
                    <meshStandardMaterial color="#888" metalness={0.8} />
                </mesh>

                {/* ARMS */}
                <group ref={leftArmRef} position={[-0.35, 0.7, 0]}>
                    {/* Shoulder */}
                    <mesh>
                        <sphereGeometry args={[0.18]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Arm */}
                    <mesh position={[-0.1, -0.4, 0]} rotation={[0, 0, 0.2]}>
                        <capsuleGeometry args={[0.12, 0.6]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Hand */}
                    <mesh position={[-0.2, -0.8, 0]}>
                        <sphereGeometry args={[0.15]} />
                        {chromeMaterial}
                    </mesh>
                </group>

                <group ref={rightArmRef} position={[0.35, 0.7, 0]}>
                    {/* Shoulder */}
                    <mesh>
                        <sphereGeometry args={[0.18]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Arm */}
                    <mesh position={[0.1, -0.4, 0]} rotation={[0, 0, -0.2]}>
                        <capsuleGeometry args={[0.12, 0.6]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Hand */}
                    <mesh position={[0.2, -0.8, 0]}>
                        <sphereGeometry args={[0.15]} />
                        {chromeMaterial}
                    </mesh>
                </group>

                {/* LEGS */}
                <group ref={leftLegRef} position={[-0.2, 0, 0]}>
                    <mesh position={[0, -0.4, 0]}>
                        <capsuleGeometry args={[0.13, 0.7]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Boot */}
                    <mesh position={[0, -0.9, 0.1]}>
                        <boxGeometry args={[0.25, 0.3, 0.4]} />
                        {darkChromeMaterial}
                    </mesh>
                </group>

                <group ref={rightLegRef} position={[0.2, 0, 0]}>
                    <mesh position={[0, -0.4, 0]}>
                        <capsuleGeometry args={[0.13, 0.7]} />
                        {chromeMaterial}
                    </mesh>
                    {/* Boot */}
                    <mesh position={[0, -0.9, 0.1]}>
                        <boxGeometry args={[0.25, 0.3, 0.4]} />
                        {darkChromeMaterial}
                    </mesh>
                </group>

            </group>
        </group>
    );
};

const HangingRobot = () => {
    return (
        <div className="w-full h-full">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 0, 6]} />
                <ambientLight intensity={0.2} />

                {/* Environment for Chrome Reflection */}
                <Environment preset="studio" />

                {/* Lights for dramatic effect */}
                <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2} color="#44aaff" />
                <spotLight position={[-5, 5, 5]} angle={0.3} penumbra={1} intensity={1} color="#ff44aa" />
                <pointLight position={[0, 0, 3]} intensity={0.5} color="white" />

                <ChromeRobotModel />
            </Canvas>
        </div>
    );
};

export default HangingRobot;
