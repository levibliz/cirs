'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { toast, ToastContainer } from 'react-toastify';
import Navbar from "./components/Navbar";
import useProfileStatus from "./hooks/useProfileStatus";
import TestimonialCarousel from "./components/TestimonialCarousel";
import { AnimatePresence } from "framer-motion";
import EnhancedQRCode from "./components/EnhancedQRCode";
import Link from "next/link";
import FeaturesSection from "./components/FeaturesSection";
import HeroSection from "./components/HeroSection";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  popular: boolean;
  icon: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  category: string;
  avatar: string;
}

interface Step {
  step: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  gradient: string;
}

function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [faqFilter, setFaqFilter] = useState("All");
  const router = useRouter();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();
  const { isProfileComplete, isLoading: profileLoading } = useProfileStatus();

  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
          element.classList.add("animate-fade-up");
        }
      });
    };
    window.addEventListener("scroll", animateOnScroll);
    animateOnScroll();
    return () => window.removeEventListener("scroll", animateOnScroll);
  }, []);

  useEffect(() => {
    const profileJustSubmitted = sessionStorage.getItem('profileJustSubmitted') === 'true';
    if (isSignedIn && !profileLoading && !isProfileComplete && !profileJustSubmitted) {
      router.push('/dashboard');
    }
  }, [isSignedIn, profileLoading, isProfileComplete, router]);

  const logout = async () => {
    try {
      await signOut();
      toast.info('Logged out successfully');
      setTimeout(() => router.push('/'), 2500);
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const questions: FAQ[] = [
    {
      id: 1,
      question: "How do I report an issue?",
      answer: "You can report an issue by taking a photo, marking the location on the map, and adding a detailed description.",
      popular: true,
      icon: "📸"
    },
    {
      id: 2,
      question: "How long does it take to resolve an issue?",
      answer: "Resolution time depends on the issue severity. Most issues are reviewed within 24-48 hours.",
      popular: true,
      icon: "⏱️"
    },
    {
      id: 3,
      question: "Can I track my reported issue?",
      answer: "Yes, you can track the status of your report in real-time through the app dashboard.",
      popular: false,
      icon: "📍"
    },
    {
      id: 4,
      question: "Is my data safe?",
      answer: "We use industry-standard encryption and security measures to protect your data.",
      popular: false,
      icon: "🔒"
    }
  ];

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "John Doe",
      role: "Community Leader",
      quote: "CIRS has transformed how we report and track community issues.",
      rating: 5,
      category: "Community",
      avatar: "https://via.placeholder.com/56"
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "City Official",
      quote: "The platform has improved our response time significantly.",
      rating: 5,
      category: "Government",
      avatar: "https://via.placeholder.com/56"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Resident",
      quote: "Easy to use and very effective for getting issues fixed in our neighborhood.",
      rating: 4,
      category: "Community",
      avatar: "https://via.placeholder.com/56"
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Municipal Worker",
      quote: "Best tool we've used for community engagement.",
      rating: 5,
      category: "Government",
      avatar: "https://via.placeholder.com/56"
    }
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-label={`${rating} out of 5 stars`}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );

  const steps: Step[] = [
    {
      step: "01",
      title: "Report an Issue",
      description: "Take a photo, mark the location on the map, and add a detailed description of the problem you've encountered and we will reach you out soon.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      step: "02",
      title: "City Review",
      description: "City workers review and prioritize issues based on severity, impact, and community votes to ensure efficient resource allocation.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 12l2 2 4-4" />
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3" />
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3" />
          <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3" />
          <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3" />
        </svg>
      ),
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      step: "03",
      title: "Track Resolution",
      description: "Follow the progress of your report from submission to completion with real-time updates and transparent communication.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
          <polyline points="16 7 22 7 22 13" />
        </svg>
      ),
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div>
      <Navbar />
       <HeroSection />
       <FeaturesSection />
      <main className="min-h-screen">
        {/* How It Works Section */}
        <section className="relative py-24 bg-gradient-to-b from-white via-slate-50/50 to-emerald-50/30 dark:from-slate-900 dark:via-slate-800/50 dark:to-emerald-900/10 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-emerald-100/30 to-teal-100/30 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-teal-100/30 to-cyan-100/30 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-5 py-3 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border border-emerald-200/60 dark:border-emerald-700/50 mb-8 shadow-sm">
                <span className="text-emerald-800 dark:text-emerald-200 font-bold text-sm uppercase tracking-wider">How It Works</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="text-slate-800 dark:text-slate-200">Simple process,</span>
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  powerful results
                </span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
                CIRS makes it easy to report issues and track their resolution in just a few simple steps. 
                Join thousands of citizens making their communities better.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="hidden lg:block relative">
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-gradient-to-r from-emerald-200 via-teal-200 to-cyan-200 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-800"></div>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  {steps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                        <div className="relative mb-6 flex justify-center">
                          <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <span className="text-white font-bold text-lg">{step.step}</span>
                          </div>
                        </div>

                        <div className="text-center">
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                            {step.title}
                          </h3>
                          
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:hidden space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="relative">
                    {index < steps.length - 1 && (
                      <div className="absolute left-10 top-20 w-0.5 h-16 bg-gradient-to-b from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700"></div>
                    )}
                    
                    <div className="flex gap-6">
                      <div className="flex-shrink-0">
                        <div className={`w-20 h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">{step.step}</span>
                        </div>
                      </div>
                      
                      <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            {step.icon}
                          </div>
                          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                            {step.title}
                          </h3>
                        </div>
                        
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>


        
        {/* Testimonials Section */}
        <section className="relative py-24 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-slate-900 dark:via-emerald-900/10 dark:to-teal-900/5 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -right-32 w-64 h-64 bg-gradient-to-l from-emerald-100/40 to-teal-100/40 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-teal-100/40 to-cyan-100/40 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/50 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50 mb-6">
                <span className="text-emerald-700 dark:text-emerald-300 font-medium text-sm">Testimonials</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Trusted by communities
                </span>
                <br />
                <span className="text-slate-800 dark:text-slate-200">everywhere</span>
              </h2>
              
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                See what citizens and city workers are saying about CIRS and how it's transforming communities across the nation.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="absolute -top-3 left-8">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      {testimonial.category}
                    </div>
                  </div>

                  <div className="relative mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800/50 dark:to-teal-800/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg 
                        className="w-6 h-6 text-emerald-600 dark:text-emerald-400" 
                        fill="currentColor" 
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                      >
                        <path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-1.1.9-2 2-2V8zM22 8c-3.3 0-6 2.7-6 6v10h10V14h-4c0-1.1.9-2 2-2V8z"/>
                      </svg>
                    </div>
                  </div>

                  <blockquote className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed mb-6 relative z-10">
                    "{testimonial.quote}"
                  </blockquote>

                  <StarRating rating={testimonial.rating} />

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full p-0.5">
                        <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-full"></div>
                      </div>
                      <img
                        src={testimonial.avatar}
                        alt={`${testimonial.name}'s avatar`}
                        className="relative w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {testimonial.name}
                      </h3>
                      <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-500/10 dark:to-teal-500/10 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <TestimonialCarousel />

        {/* FAQs Section */}
        <motion.section
          id="faqs"
          className="bg-gray-50 dark:bg-gray-900 py-6 md:py-12 lg:py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <div className="container px-4 mx-auto">
            <motion.div className="flex flex-col items-center space-y-4 text-center w-full" variants={itemVariants}>
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-emerald-100 px-3 py-1 text-sm text-emerald-700">FAQs</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed">
                  Find answers to commonly asked questions about CIRS platform features and services.
                </p>
              </div>
              {/* FAQ Filter */}
              <div className="flex gap-2 items-center justify-center mt-2">
                {["All", "Popular"].map((type) => (
                  <button
                    key={type}
                    className={`px-4 py-2 rounded-full transition
                      ${faqFilter === type
                        ? "bg-emerald-500 text-white font-semibold"
                        : "bg-emerald-100 text-emerald-800"}`}
                    onClick={() => setFaqFilter(type)}
                    aria-pressed={faqFilter === type}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </motion.div>

            <div className="w-full mt-8 max-w-3xl mx-auto space-y-4">
              {(faqFilter === "All" ? questions : questions.filter(f => f.popular)).map((faq) => (
                <div
                  key={faq.id}
                  className="faq-card-glass py-2 px-1 mb-2 w-full overflow-hidden"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActiveFaq(activeFaq === faq.id ? null : faq.id);
                    }
                  }}
                >
                  <button
                    className={`w-full text-left flex items-center justify-between px-4 py-3 border-0 outline-none focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-none rounded-lg transition-colors duration-300 text-base md:text-lg
                      ${activeFaq === faq.id
                        ? "bg-white dark:bg-emerald-700/30 text-emerald-900 dark:text-white font-semibold"
                        : "bg-emerald-50 dark:bg-[#181e2f] text-emerald-800 dark:text-white hover:bg-emerald-100 dark:hover:bg-[#22273b]"
                      }`}
                    style={{ minHeight: 56 }}
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    aria-expanded={activeFaq === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <span className="flex items-center gap-2 font-medium">
                      {faq.icon}
                      {faq.question}
                      {faq.popular && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-700 text-xs font-semibold">
                          Popular
                        </span>
                      )}
                    </span>
                    {activeFaq === faq.id ? (
                      <svg className="w-5 h-5 text-emerald-500 transition-transform duration-300 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-emerald-500 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {activeFaq === faq.id && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        className="mt-1 px-4 bg-white/90 dark:bg-[#151c29ef] rounded-b-lg shadow-sm overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        layout
                      >
                        <motion.p
                          className="py-3 text-left text-gray-700 dark:text-white"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.3 }}
                        >
                          {faq.answer}
                        </motion.p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            <style>{`
              .faq-card-glass {
                background: rgba(255,255,255,0.85);
                border-radius: 1rem;
                box-shadow: 0 2px 16px rgba(44,62,80,0.05);
                backdrop-filter: blur(6px);
                border: 1px solid rgba(52,211,153,0.12);
                margin-bottom: 18px;
                transition: box-shadow 0.3s, background 0.3s;
              }
              .faq-card-glass:focus-within,
              .faq-card-glass:hover {
                box-shadow: 0 6px 48px rgba(32,90,90,0.14);
                background: rgba(240,253,250,0.97);
              }
              .dark .faq-card-glass {
                background: rgba(18,22,34,0.83);
                border: 1px solid rgba(16,185,129,0.09);
              }
              .dark .faq-card-glass:focus-within,
              .dark .faq-card-glass:hover {
                background: rgba(16,185,129,0.04);
                box-shadow: 0 10px 48px rgba(16,185,129,0.14);
              }
            `}</style>
          </div>
        </motion.section>

        {/* Download Section */}
        <section id="download" className="py-6 md:py-12 lg:py-16 bg-emerald-50 dark:bg-[#161c28] dark:text-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 animate-on-scroll">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight bg-gradient-to-tr from-[#7cf9ff] to-[#0037ff] bg-clip-text text-transparent">Ready to improve your community?</h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">Download the CIRS app today and start making a difference in your neighborhood.</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/download-ios">
                    <button className="flex h-10 items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring duration-300 gap-2">
                      <svg width="14" height="20" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23.1148 17.6371C23.0761 13.4472 26.6335 11.4088 26.7961 11.3139C24.7815 8.45 21.6588 8.0587 20.5615 8.0275C17.9388 7.7584 15.3948 9.5576 14.0588 9.5576C12.6961 9.5576 10.6388 8.0535 8.42146 8.0977C5.56813 8.1406 2.89879 9.7513 1.43479 12.2525C-1.58654 17.3524 0.666794 24.8469 3.56146 28.9692C5.00946 30.9881 6.70146 33.2423 8.91613 33.163C11.0828 33.0759 11.8921 31.8162 14.5068 31.8162C17.0975 31.8162 17.8575 33.163 20.1161 33.1123C22.4415 33.0759 23.9055 31.0843 25.3028 29.0472C26.9761 26.7332 27.6481 24.4543 27.6748 24.3373C27.6201 24.3191 23.1588 22.659 23.1148 17.6371Z" fill="white" />
                        <path d="M18.8481 5.3157C20.0135 3.8948 20.8108 1.9617 20.5895 0C18.9028 0.0728 16.7935 1.1375 15.5788 2.5272C14.5041 3.7518 13.5441 5.759 13.7921 7.6466C15.6868 7.7844 17.6321 6.7145 18.8481 5.3157Z" fill="white" />
                      </svg>
                      Download for iOS
                    </button>
                  </Link>
                  <Link href="/download-android">
                    <button className="flex h-10 items-center justify-center rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring duration-300 gap-2">
                      <svg width="14" height="16" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.8942 0.800352C0.503072 1.2001 0.276718 1.82248 0.276718 2.62848V31.378C0.276718 32.184 0.503072 32.8064 0.8942 33.2061L0.990735 33.2939L17.4913 17.1901V16.8099L0.990735 0.706104L0.8942 0.800352Z" fill="url(#paint0_linear_0_1)" />
                        <path d="M22.9854 22.5607L17.4913 17.1901V16.8099L22.9921 11.4392L23.1153 11.5091L29.6296 15.128C31.4887 16.155 31.4887 17.845 29.6296 18.8785L23.1153 22.4909L22.9854 22.5607V22.5607Z" fill="url(#paint1_linear_0_1)" />
                        <path d="M23.1153 22.4909L17.4913 17L0.894196 33.2061C1.51168 33.8399 2.51863 33.9162 3.66372 33.2825L23.1153 22.4909" fill="url(#paint2_linear_0_1)" />
                        <path d="M23.1153 11.5091L3.66372 0.717505C2.51863 0.0902547 1.51168 0.166628 0.894196 0.800377L17.4913 17L23.1153 11.5091Z" fill="url(#paint3_linear_0_1)" />
                        <defs>
                          <linearGradient id="paint0_linear_0_1" x1="16.0263" y1="31.6774" x2="-5.78457" y2="9.33801" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#00A0FF" />
                            <stop offset="0.0066" stopColor="#00A1FF" />
                            <stop offset="0.2601" stopColor="#00BEFF" />
                            <stop offset="0.5122" stopColor="#00D2FF" />
                            <stop offset="0.7604" stopColor="#00DFFF" />
                            <stop offset="1" stopColor="#00E3FF" />
                          </linearGradient>
                          <linearGradient id="paint1_linear_0_1" x1="32.0505" y1="16.9982" x2="-0.167689" y2="16.9982" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FFE000" />
                            <stop offset="0.4087" stopColor="#FFBD00" />
                            <stop offset="0.7754" stopColor="#FFA500" />
                            <stop offset="1" stopColor="#FF9C00" />
                          </linearGradient>
                          <linearGradient id="paint2_linear_0_1" x1="20.0571" y1="14.0151" x2="-9.52016" y2="-16.2789" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FF3A44" />
                            <stop offset="1" stopColor="#C31162" />
                          </linearGradient>
                          <linearGradient id="paint3_linear_0_1" x1="-3.28365" y1="42.7709" x2="9.92394" y2="29.2434" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#32A071" />
                            <stop offset="0.0685" stopColor="#2DA771" />
                            <stop offset="0.4762" stopColor="#15CF74" />
                            <stop offset="0.8009" stopColor="#06E775" />
                            <stop offset="1" stopColor="#00F076" />
                          </linearGradient>
                        </defs>
                      </svg>
                      Download for Android
                    </button>
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex items-center justify-end animate-on-scroll px-6">
                <EnhancedQRCode />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
