'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

export default function EnhancedQRCode() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Deterministic QR pattern (memoized)
  const qrPattern = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => (i * 7) % 2 === 0);
  }, []);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative"
    >
      {children}
    </motion.div>
  );

  if (!mounted) {
    return (
      <Wrapper>
        <div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="relative w-64 h-64 bg-white rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center p-4">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          style={{ width: 240, height: 240 }}
        >
          {/* Border */}
          <rect x="0" y="0" width="100" height="100" fill="white" stroke="var(--primary-600)" strokeWidth="2" />

          {/* Finder patterns */}
          {[
            [2, 2],
            [78, 2],
            [2, 78],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="20" height="20" fill="var(--primary-600)" />
              <rect x={x + 2} y={y + 2} width="16" height="16" fill="white" />
              <rect x={x + 4} y={y + 4} width="12" height="12" fill="var(--primary-600)" />
            </g>
          ))}

          {/* Timing patterns */}
          {Array.from({ length: 13 }).map((_, i) => (
            <rect
              key={`th-${i}`}
              x={i * 4 + 24}
              y="8"
              width="4"
              height="4"
              fill={i % 2 === 0 ? 'var(--primary-600)' : 'white'}
            />
          ))}

          {Array.from({ length: 13 }).map((_, i) => (
            <rect
              key={`tv-${i}`}
              x="8"
              y={i * 4 + 24}
              width="4"
              height="4"
              fill={i % 2 === 0 ? 'var(--primary-600)' : 'white'}
            />
          ))}

          {/* Data blocks */}
          {qrPattern.map((fill, i) => (
            <rect
              key={i}
              x={40 + (i % 6) * 5}
              y={40 + Math.floor(i / 6) * 5}
              width="4"
              height="4"
              fill={fill ? 'var(--primary-600)' : 'white'}
            />
          ))}

          {/* Center accent */}
          <rect x="44" y="44" width="12" height="12" fill="var(--accent-500)" opacity="0.3" rx="2" />
        </svg>
      </div>

      <div className="text-center mt-4">
        <p style={{ color: 'var(--fg)', fontWeight: 600 }}>Download CIRS</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Scan to get the app
        </p>
      </div>
    </Wrapper>
  );
}
