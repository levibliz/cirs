'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function EnhancedQRCode() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate consistent QR pattern (not random)
  const generateQRPattern = () => {
    const pattern = [];
    for (let i = 0; i < 36; i++) {
      // Use deterministic pattern instead of Math.random()
      pattern.push((i * 7) % 2 === 0);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  if (!mounted) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      <div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center p-4">
        <div className="relative bg-white">
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ width: '240px', height: '240px' }}>
            {/* Border */}
            <rect x="0" y="0" width="100" height="100" fill="white" stroke="var(--primary-600)" strokeWidth="2" />

            {/* Top-left finder pattern */}
            <rect x="2" y="2" width="20" height="20" fill="var(--primary-600)" />
            <rect x="4" y="4" width="16" height="16" fill="white" />
            <rect x="6" y="6" width="12" height="12" fill="var(--primary-600)" />

            {/* Top-right finder pattern */}
            <rect x="78" y="2" width="20" height="20" fill="var(--primary-600)" />
            <rect x="80" y="4" width="16" height="16" fill="white" />
            <rect x="82" y="6" width="12" height="12" fill="var(--primary-600)" />

            {/* Bottom-left finder pattern */}
            <rect x="2" y="78" width="20" height="20" fill="var(--primary-600)" />
            <rect x="4" y="80" width="16" height="16" fill="white" />
            <rect x="6" y="82" width="12" height="12" fill="var(--primary-600)" />

            {/* Timing patterns */}
            {[...Array(13)].map((_, i) => (
              <rect
                key={`timing-h-${i}`}
                x={i * 4 + 24}
                y="8"
                width="4"
                height="4"
                fill={i % 2 === 0 ? 'var(--primary-600)' : 'white'}
              />
            ))}

            {[...Array(13)].map((_, i) => (
              <rect
                key={`timing-v-${i}`}
                x="8"
                y={i * 4 + 24}
                width="4"
                height="4"
                fill={i % 2 === 0 ? 'var(--primary-600)' : 'white'}
              />
            ))}

            {/* Data area with deterministic pattern */}
            {qrPattern.map((shouldFill, i) => (
              <rect
                key={`data-${i}`}
                x={40 + (i % 6) * 5}
                y={40 + Math.floor(i / 6) * 5}
                width="4"
                height="4"
                fill={shouldFill ? 'var(--primary-600)' : 'white'}
              />
            ))}

            {/* Center accent (Coral color) */}
            <rect x="44" y="44" width="12" height="12" fill="var(--accent-500)" opacity="0.3" rx="2" />
          </svg>
        </div>
      </div>

      {/* Info below QR */}
      <div className="text-center mt-4">
        <p style={{ color: 'var(--fg)', fontWeight: 600 }}>Download CIRS</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>Scan to get the app</p>
      </div>
    </motion.div>
  );
}