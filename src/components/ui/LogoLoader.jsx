/**
 * File: LogoLoader.jsx
 * Purpose: Stylish loading animation using the brand logo image with Framer Motion.
 * Dependencies: React, framer-motion
 * Notes: Uses spring physics for smooth logo entrance and looping shimmer/pulse.
 */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sizeMap = {
  sm: { logo: 'h-16', container: 'min-h-[30vh]' },
  md: { logo: 'h-24', container: 'h-[60vh]' },
  lg: { logo: 'h-32', container: 'h-[80vh]' },
};

export const LogoLoader = ({ size = 'md' }) => {
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex ${s.container} items-center justify-center bg-[#FAF8F5]`}>
      <div className="flex flex-col items-center">
        {/* Logo with spring entrance + gentle pulse */}
        <motion.div
          className="relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 120,
            damping: 14,
            mass: 0.8,
          }}
        >
          <motion.img
            src="/logo.png"
            alt="Loading..."
            className={`${s.logo} w-auto object-contain`}
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
          />

          {/* Shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(192,82,44,0.12) 40%, rgba(192,82,44,0.25) 50%, rgba(192,82,44,0.12) 60%, transparent 100%)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
        </motion.div>

        {/* Animated dots */}
        <div className="flex gap-2 mt-5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: '#C0522C' }}
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.3, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
