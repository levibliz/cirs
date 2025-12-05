"use client";

import { ArrowRight, Play, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="w-full py-24" style={{ background: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-4xl md:text-6xl font-extrabold leading-tight"
            style={{ color: "var(--fg)" }}
          >
            See It. Report It. <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--primary-600), var(--accent-500))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Make Your City Better.
            </span>
          </h1>

          <p
            className="mt-6 text-lg max-w-md"
            style={{ color: "var(--muted)" }}
          >
            CIRS is a Community Issue Reporting System that helps citizens
            report and track local problems like potholes, broken streetlights,
            and garbage collection delays. Join thousands working to improve
            their communities.
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              className="text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg transition hover:shadow-xl"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary-500), var(--accent-500))",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get Started <ArrowRight size={18} />
            </button>

            <button
              className="px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition"
              style={{
                border: `2px solid var(--primary-200)`,
                color: "var(--primary-600)",
                backgroundColor: "var(--primary-50)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-100)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary-50)";
              }}
            >
              <Play size={18} /> Watch Demo
            </button>
          </div>

          {/* Rating */}
          <div
            className="flex items-center gap-2 mt-6 text-sm"
            style={{ color: "var(--muted)" }}
          >
            <div className="flex" style={{ color: "var(--gold-500)" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="currentColor" />
              ))}
            </div>
            <span>4.8/5 from 2,500+ users</span>
          </div>
        </motion.div>

        {/* Right Decorative Box (No image needed) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div
            className="w-full h-72 md:h-96 rounded-3xl shadow-xl border flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, var(--primary-50), var(--accent-50))",
              borderColor: "var(--primary-200)",
            }}
          >
            <span
              className="font-semibold px-4 py-2 rounded-full shadow"
              style={{
                background: "var(--bg)",
                color: "var(--primary-600)",
              }}
            >
              Live Demo
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
