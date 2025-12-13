'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
	{
		id: 1,
		name: 'Sarah Johnson',
		role: 'Community Organizer',
		quote: 'CIRS has revolutionized how we track city issues. Response times have improved dramatically.',
		rating: 5,
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
	},
	{
		id: 2,
		name: 'Mike Chen',
		role: 'City Manager',
		quote: 'The data insights from CIRS help us prioritize infrastructure projects more effectively.',
		rating: 5,
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
	},
	{
		id: 3,
		name: 'Emma Davis',
		role: 'Resident',
		quote: 'Finally, a platform where my voice is heard. The pothole on Main St got fixed within weeks!',
		rating: 5,
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
	},
	{
		id: 4,
		name: 'James Wilson',
		role: 'Park Volunteer',
		quote: "Organizing community cleanups is now so much easier with CIRS's coordination features.",
		rating: 5,
		avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
	},
];

export default function TestimonialCarousel() {
	const [current, setCurrent] = useState(0);
	const [autoPlay, setAutoPlay] = useState(true);

	useEffect(() => {
		if (!autoPlay) return;
		const interval = setInterval(() => {
			setCurrent((prev) => (prev + 1) % testimonials.length);
		}, 5000);
		return () => clearInterval(interval);
	}, [autoPlay]);

	const next = () => {
		setCurrent((prev) => (prev + 1) % testimonials.length);
		setAutoPlay(false);
	};

	const prev = () => {
		setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
		setAutoPlay(false);
	};

	return (
		<section
			className="py-12 md:py-20 bg-gradient-to-br from-white via-slate-50/30 to-slate-50/20 dark:from-slate-900 dark:via-slate-800/10 dark:to-slate-900/5"
			style={{
				background:
					'linear-gradient(135deg, var(--bg), rgba(37, 99, 235, 0.03), rgba(251, 113, 133, 0.02))',
			}}
		>
			<div className="container mx-auto px-4 md:px-6">
				<div className="relative">
					<AnimatePresence mode="wait">
						<motion.div
							key={current}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							className="mx-auto max-w-2xl text-center"
						>
							{/* Star Rating */}
							<div className="mb-8 flex justify-center gap-1">
								{[...Array(5)].map((_, i) => (
									<svg
										key={i}
										className="w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
										style={{ color: 'var(--gold-500)' }}
									>
										<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
									</svg>
								))}
							</div>

							{/* Quote */}
							<blockquote className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 mb-8">
								"{testimonials[current].quote}"
							</blockquote>

							{/* Avatar & User Info */}
							<div className="flex items-center justify-center gap-4">
								<img
									src={testimonials[current].avatar}
									alt={testimonials[current].name}
									className="w-14 h-14 rounded-full border-2"
									style={{ borderColor: 'var(--primary-500)' }}
								/>
								<div className="text-left">
									<p className="font-bold text-slate-800 dark:text-slate-200">
										{testimonials[current].name}
									</p>
									<p style={{ color: 'var(--primary-600)' }}>
										{testimonials[current].role}
									</p>
								</div>
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Navigation Buttons */}
					<div className="flex justify-center items-center gap-4 mt-12">
						<button
							onClick={prev}
							className="p-2 md:p-3 rounded-full transition-colors"
							style={{
								backgroundColor: 'var(--primary-100)',
								color: 'var(--primary-600)',
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-200)')}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-100)')}
							aria-label="Previous testimonial"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
							</svg>
						</button>

						{/* Dots */}
						<div className="flex gap-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => {
										setCurrent(index);
										setAutoPlay(false);
									}}
									className="rounded-full transition-all"
									style={{
										width: index === current ? '32px' : '8px',
										height: '8px',
										backgroundColor:
											index === current ? 'var(--primary-600)' : 'var(--primary-300)',
									}}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>

						<button
							onClick={next}
							className="p-2 md:p-3 rounded-full transition-colors"
							style={{
								backgroundColor: 'var(--primary-100)',
								color: 'var(--primary-600)',
							}}
							onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-200)')}
							onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-100)')}
							aria-label="Next testimonial"
						>
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}