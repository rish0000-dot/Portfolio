import React from 'react';
import { motion } from 'framer-motion';

const ProjectsBackground = () => {
    // Placeholder images or patterns since we don't have real screenshots yet
    const items = Array.from({ length: 8 });

    return (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10 pointer-events-none flex flex-col justify-center gap-10">
            {/* Row 1: Left to Right */}
            <div className="flex gap-10">
                <motion.div
                    className="flex gap-10 min-w-full"
                    animate={{ x: [0, -1000] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {[...items, ...items].map((_, i) => (
                        <div key={i} className="w-[300px] h-[200px] bg-cyan-900/40 border border-cyan-500/30 rounded-xl flex-shrink-0 flex items-center justify-center text-5xl">
                            💻
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Row 2: Right to Left */}
            <div className="flex gap-10">
                <motion.div
                    className="flex gap-10 min-w-full"
                    animate={{ x: [-1000, 0] }}
                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                >
                    {[...items, ...items].map((_, i) => (
                        <div key={i} className="w-[300px] h-[200px] bg-purple-900/40 border border-purple-500/30 rounded-xl flex-shrink-0 flex items-center justify-center text-5xl">
                            🚀
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectsBackground;
