"use client";

import { Camera, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const features = [
    {
      id: 1,
      icon: Camera,
      title: "Report Issues",
      description: "Easily report problems with photos, location data, and detailed descriptions for faster resolution.",
      items: ["Photo uploads", "Map integration", "Categorized issues"]
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Track Progress",
      description: "Follow the status of your reports from submission to resolution with real-time insights.",
      items: ["Real-time updates", "Status notifications", "Resolution timeline"]
    },
    {
      id: 3,
      icon: Users,
      title: "Community Voting",
      description: "Upvote issues in your area to help prioritize what matters most to your community.",
      items: ["Issue upvoting", "Trending issues", "Community feedback"]
    }
  ];

  return (
    <section 
      className="w-full py-20"
      style={{
        background: `linear-gradient(to bottom, var(--bg), rgba(37, 99, 235, 0.03))`
      }}
    >
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-4"
          style={{
            backgroundColor: 'var(--primary-100)',
            color: 'var(--primary-700)'
          }}
        >
          Features
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold"
          style={{ color: 'var(--fg)' }}
        >
          Everything you need <br />
          <span 
            style={{
              background: 'linear-gradient(90deg, var(--primary-600), var(--accent-500))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            to improve your community
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 max-w-2xl mx-auto"
          style={{ color: 'var(--muted)' }}
        >
          CIRS provides a comprehensive platform for citizens and city workers to collaborate 
          on local issues and build stronger communities together.
        </motion.p>

        {/* Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                key={feature.id}
                className="rounded-2xl p-8 text-left shadow-lg border transition-all hover:shadow-xl hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--bg)',
                  borderColor: 'var(--glass-border)',
                }}
                variants={itemVariants}
              >
                <div 
                  className="p-3 rounded-xl w-fit mb-4"
                  style={{
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-600)'
                  }}
                >
                  <Icon size={26} />
                </div>
                
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: 'var(--fg)' }}
                >
                  {feature.title}
                </h3>
                
                <p 
                  className="mb-4"
                  style={{ color: 'var(--muted)' }}
                >
                  {feature.description}
                </p>
                
                <ul 
                  className="space-y-2"
                  style={{ color: 'var(--fg)' }}
                >
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span 
                        style={{ color: 'var(--accent-500)' }}
                        className="font-bold"
                      >
                        ✔
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}

        </motion.div>
      </div>
    </section>
  );
}
