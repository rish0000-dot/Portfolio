import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Helper to generate text coordinates
const getTextCoordinates = (text, count) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1000;
  canvas.height = 300;

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 200px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const pixels = [];

  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > 128) { // If pixel is bright
      const x = (i / 4) % canvas.width;
      const y = Math.floor((i / 4) / canvas.width);
      pixels.push({
        x: (x - canvas.width / 2) * 0.015, // Scale down
        y: -(y - canvas.height / 2) * 0.015
      });
    }
  }

  // Downsample to fit count
  const result = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const pixel = pixels[Math.floor(Math.random() * pixels.length)] || { x: 0, y: 0 };
    result[i * 3] = pixel.x;
    result[i * 3 + 1] = pixel.y;
    result[i * 3 + 2] = 0; // Flat text
  }
  return result;
};

const ParticleField = ({ mode }) => {
  const ref = useRef();
  const { viewport } = useThree();
  const count = 6000;

  const [positions, velocity, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const palette = [
      new THREE.Color('#06b6d4'), new THREE.Color('#8b5cf6'),
      new THREE.Color('#3b82f6'), new THREE.Color('#ffffff')
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, vel, col];
  }, []); // Initial only

  // Pre-calculate target shapes
  const targets = useMemo(() => {
    const sphere = new Float32Array(count * 3);
    const ring = new Float32Array(count * 3);
    const expand = new Float32Array(count * 3);
    const text = getTextCoordinates('PORTFOLIO', count);
    const dna = new Float32Array(count * 3);
    const cube = new Float32Array(count * 3);
    const wave = new Float32Array(count * 3);
    const vortex = new Float32Array(count * 3);
    const galaxy = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5;
      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      // Ring
      const ringR = 3 + Math.random() * 0.5;
      const ringTheta = Math.random() * Math.PI * 2;
      ring[i * 3] = ringR * Math.cos(ringTheta);
      ring[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      ring[i * 3 + 2] = ringR * Math.sin(ringTheta);

      // Expand (Chaos)
      expand[i * 3] = (Math.random() - 0.5) * 15;
      expand[i * 3 + 1] = (Math.random() - 0.5) * 15;
      expand[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // DNA (Double Helix)
      const dnaT = (i / count) * Math.PI * 20; // Length
      const dnaR = 1.5;
      // Strand 1 (even indices)
      if (i % 2 === 0) {
        dna[i * 3] = Math.cos(dnaT) * dnaR;
        dna[i * 3 + 1] = (i / count) * 10 - 5; // Vertical spread
        dna[i * 3 + 2] = Math.sin(dnaT) * dnaR;
      } else {
        // Strand 2 (odd indices, offset by PI)
        dna[i * 3] = Math.cos(dnaT + Math.PI) * dnaR;
        dna[i * 3 + 1] = (i / count) * 10 - 5;
        dna[i * 3 + 2] = Math.sin(dnaT + Math.PI) * dnaR;
      }

      // Cube (Grid)
      const cubeSize = 3;
      // We can just scatter points within a cube volume, but grid looks cooler. 
      // Random within box for simpler visual
      cube[i * 3] = (Math.random() - 0.5) * cubeSize * 2;
      cube[i * 3 + 1] = (Math.random() - 0.5) * cubeSize * 2;
      cube[i * 3 + 2] = (Math.random() - 0.5) * cubeSize * 2;

      // Wave (Sine Plane)
      const wx = (Math.random() - 0.5) * 10;
      const wz = (Math.random() - 0.5) * 10;
      wave[i * 3] = wx;
      wave[i * 3 + 1] = Math.sin(wx) * Math.cos(wz) * 1.5;
      wave[i * 3 + 2] = wz;

      // Vortex (Tornado)
      const vt = Math.random() * Math.PI * 20;
      const vy = (i / count) * 8 - 4;
      const vr = (vy + 5) * 0.5; // Radius grows with height
      vortex[i * 3] = Math.cos(vt) * vr;
      vortex[i * 3 + 1] = vy;
      vortex[i * 3 + 2] = Math.sin(vt) * vr;

      // Galaxy (Spiral Arms)
      const arm = i % 3; // 3 arms
      const gTheta = Math.random() * Math.PI * 2; // Position along arm
      const gR = Math.random() * 5; // Distance from center
      // Spiral equation: theta offset by radius
      const spiralTheta = gTheta + gR * 2 + (arm * (Math.PI * 2 / 3));

      galaxy[i * 3] = Math.cos(spiralTheta) * gR;
      galaxy[i * 3 + 1] = (Math.random() - 0.5) * 0.5; // Flat plane
      galaxy[i * 3 + 2] = Math.sin(spiralTheta) * gR;
    }

    return { sphere, ring, expand, text, dna, cube, wave, vortex, galaxy };
  }, []);

  useFrame((state, delta) => {
    // Determine target based on mode
    let targetPositions = null;
    let physicsMode = false;

    if (mode === 'sphere') targetPositions = targets.sphere;
    else if (mode === 'ring') targetPositions = targets.ring;
    else if (mode === 'text') targetPositions = targets.text;
    else if (mode === 'expand') targetPositions = targets.expand;
    else if (mode === 'dna') targetPositions = targets.dna;
    else if (mode === 'cube') targetPositions = targets.cube;
    else if (mode === 'wave') targetPositions = targets.wave;
    else if (mode === 'vortex') targetPositions = targets.vortex;
    else if (mode === 'galaxy') targetPositions = targets.galaxy;
    else physicsMode = true; // 'swarm'

    const currentPositions = ref.current.geometry.attributes.position.array;
    const mouseX = (state.mouse.x * viewport.width) / 2;
    const mouseY = (state.mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const px = currentPositions[idx];
      const py = currentPositions[idx + 1];
      const pz = currentPositions[idx + 2];

      if (physicsMode) {
        // Swarm Logic
        const dx = mouseX - px;
        const dy = mouseY - py;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Random wander force
        const wx = (Math.random() - 0.5) * 0.05;
        const wy = (Math.random() - 0.5) * 0.05;
        const wz = (Math.random() - 0.5) * 0.05;

        // Mouse Attraction
        let ax = wx;
        let ay = wy;
        let az = wz;

        if (dist > 0.1) {
          const force = 3.0 / (dist + 0.5);
          ax += dx * force * 0.2; // Softer force
          ay += dy * force * 0.2;
        }

        // Return to near-center if too far
        const centerDist = Math.sqrt(px * px + py * py + pz * pz);
        if (centerDist > 4) {
          ax -= px * 0.1;
          ay -= py * 0.1;
          az -= pz * 0.1;
        }

        velocity[idx] += ax * delta;
        velocity[idx + 1] += ay * delta;
        velocity[idx + 2] += az * delta;
        velocity[idx] *= 0.95; // Damping
        velocity[idx + 1] *= 0.95;
        velocity[idx + 2] *= 0.95;

        currentPositions[idx] += velocity[idx] * delta;
        currentPositions[idx + 1] += velocity[idx + 1] * delta;
        currentPositions[idx + 2] += velocity[idx + 2] * delta;

      } else {
        // Shape Transition Logic (Lerp)
        const tx = targetPositions[idx];
        const ty = targetPositions[idx + 1];
        const tz = targetPositions[idx + 2];

        const lerpSpeed = 2.0 * delta; // Constant convergence

        // Simple ease-out
        currentPositions[idx] += (tx - px) * lerpSpeed;
        currentPositions[idx + 1] += (ty - py) * lerpSpeed;
        currentPositions[idx + 2] += (tz - pz) * lerpSpeed;

        // Add slight noise
        currentPositions[idx] += (Math.random() - 0.5) * 0.01;
      }
    }

    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        vertexColors
        size={0.005} // Smaller for cleaner shapes
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const AntigravityBackground = () => {
  const [mode, setMode] = useState('swarm');
  const modes = [
    'swarm', 'sphere', 'ring', 'expand', 'text',
    'dna', 'cube', 'wave', 'vortex', 'galaxy'
  ]; // 10 modes

  useEffect(() => {
    const interval = setInterval(() => {
      setMode(prev => {
        const idx = modes.indexOf(prev);
        return modes[(idx + 1) % modes.length];
      });
    }, 10000); // Change every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const cycleMode = () => {
    setMode(prev => {
      const idx = modes.indexOf(prev);
      return modes[(idx + 1) % modes.length];
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-0 bg-black">
        <Canvas camera={{ position: [0, 0, 5.5], fov: 60 }}>
          <ParticleField mode={mode} />
        </Canvas>
      </div>

      {/* Manual Toggle Button */}
      <button
        onClick={cycleMode}
        className="fixed bottom-5 left-5 z-50 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs text-white uppercase tracking-widest hover:bg-white/20 transition-all font-mono animate-pulse"
      >
        {mode} Animation
      </button>
    </>
  );
};

export default AntigravityBackground;
