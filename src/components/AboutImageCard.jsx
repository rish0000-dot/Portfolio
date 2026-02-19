import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const AboutImageCard = ({ imageUrl }) => {
    // Motion values for tilt effect
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    // Transform motion values into rotation degrees for 3D effect
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["25deg", "-25deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-25deg", "25deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative group cursor-pointer h-full w-full max-w-[450px]"
        >
            {/* Outer Glow / Background Layer */}
            <div
                style={{ transform: "translateZ(-20px)" }}
                className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"
            ></div>

            <div
                style={{ transform: "translateZ(20px)" }}
                className="relative bg-black/40 backdrop-blur-md rounded-3xl p-3 border border-white/10 overflow-hidden shadow-2xl h-full flex flex-col"
            >
                <div className="relative flex-grow overflow-hidden rounded-2xl">
                    {/* The Image - Grayscale transition */}
                    <motion.img
                        src={imageUrl || "/about-me.jpg"}
                        alt="About Rishabh"
                        className="w-full h-full object-cover transition-all duration-700 filter grayscale group-hover:grayscale-0 brightness-90 group-hover:brightness-110"
                        onLoad={() => console.log('Portfolio: About image loaded successfully')}
                        onError={(e) => {
                            console.error('Portfolio Error: About image failing to load.');
                            e.target.src = "https://images.unsplash.com/photo-1620712943543-bcc4628c9759?q=80&w=1000&auto=format&fit=crop";
                        }}
                    />

                    {/* Overlay for depth and branding */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-700" />

                    {/* Hover Light Sweep */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-full group-hover:translate-y-[-100%] transition-transform duration-1000 ease-in-out" />
                </div>
            </div>

            {/* Floating Decorative Accents */}
            <div style={{ transform: "translateZ(40px)" }} className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-cyan-400 rounded-tl-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div style={{ transform: "translateZ(40px)" }} className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-purple-400 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
        </motion.div>
    );
};

export default AboutImageCard;
