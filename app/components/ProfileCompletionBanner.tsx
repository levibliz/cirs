'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function ProfileCompletionBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-20 left-0 right-0 z-40 mx-4"
      >
        <div
          className="max-w-2xl mx-auto rounded-2xl p-4 md:p-6 shadow-lg border"
          style={{
            background: 'linear-gradient(90deg, var(--primary-500), var(--accent-500))',
            color: 'white',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(255,255,255,0.95)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base">
                  Complete your profile to unlock all features
                </p>
                <p className="text-white/90 text-xs md:text-sm">
                  Add your contact information and get verified today
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href="/profile-setup" legacyBehavior>
                <a
                  className="px-4 py-2 rounded-lg font-medium text-sm"
                  style={{
                    background: 'var(--bg, white)',
                    color: 'var(--primary-600)',
                  }}
                >
                  Complete
                </a>
              </Link>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'rgba(255,255,255,0.9)', background: 'transparent' }}
                aria-label="Dismiss banner"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'currentColor' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}