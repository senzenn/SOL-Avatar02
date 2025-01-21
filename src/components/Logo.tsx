"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

const letterVariants = {
  initial: (i: number) => ({
    y: -10,
    opacity: 0,
  }),
  animate: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: i * 0.08,
    },
  }),
  hover: (i: number) => ({
    y: Math.sin(i * Math.PI) * 2,
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 1 + i * 0.1,
      ease: "linear",
    },
  }),
};

export const Logo = () => {
  return (
    <Link href="/">
      <motion.div
        className="relative flex items-center group"
        initial="initial"
        animate="animate"
        whileHover="hover"
      >
        <div className="flex items-center">
          {/* SOLAVATAR */}
          {'SOLAVATAR'.split('').map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              className="text-2xl font-bold tracking-wider"
              style={{ 
                background: i < 3 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(100,232,222,0.9))'
                  : 'linear-gradient(135deg, rgba(100,232,222,0.9), rgba(140,255,247,0.9))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 10px rgba(100,232,222,0.3))',
                padding: '0 1px',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>
        
        {/* Glassy background effect */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-lg"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(100,232,222,0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.5rem 1rem',
            transform: 'scale(1.1)',
          }}
          whileHover={{
            scale: 1.15,
            transition: { duration: 0.3 }
          }}
        />
      </motion.div>
    </Link>
  );
}; 