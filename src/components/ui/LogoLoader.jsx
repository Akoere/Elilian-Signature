/**
 * File: LogoLoader.jsx
 * Purpose: Stylish, minimalist loading animation using the brand logo.
 * Dependencies: React, framer-motion
 * Notes: Uses a gentle, slow opacity fade (breathing effect) without harsh movement.
 */
import React from 'react';
import { motion } from 'framer-motion';

const sizeMap = {
  sm: { logo: 'h-16', container: 'min-h-[30vh]' },
  md: { logo: 'h-24', container: 'h-[60vh]' },
  lg: { logo: 'h-32', container: 'h-[80vh]' },
};

export const LogoLoader = ({ size = 'md' }) => {
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex ${s.container} items-center justify-center bg-[#FAF8F5]`}>
      <motion.div
        className="flex flex-col items-center justify-center p-8"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <img
          src="/logo.png"
          alt="Loading..."
          className={`${s.logo} w-auto object-contain`}
        />
      </motion.div>
    </div>
  );
};

