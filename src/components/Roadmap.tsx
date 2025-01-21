'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

interface RoadmapItem {
  year: string;
  title: string;
  description: string;
  color: string;
  icon: JSX.Element;
  features: string[];
  monthlyGoals: {
    month: string;
    goals: string[];
  }[];
  status: 'completed' | 'in-progress' | 'upcoming';
  progress: number;
}

const roadmapData: RoadmapItem[] = [
  {
    year: '2024 Q1',
    title: 'Solana Integration',
    description: 'Seamless integration with Solana blockchain for high-performance transactions and smart contracts.',
    color: '#9945FF',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <path d="M10 30.977l8.159 7.105 9.545-15.177" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M37.705 24.903c0 7.413-6.292 13.424-14.052 13.424-7.761 0-14.053-6.011-14.053-13.424 0-7.413 6.292-13.424 14.053-13.424 7.76 0 14.052 6.011 14.052 13.424z" stroke="currentColor" strokeWidth="2"/>
        <path d="M27.684 19.104l-4.031-6.625-4.032 6.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19.621 28.827l4.032 6.625 4.031-6.625" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    status: 'in-progress',
    progress: 65,
    features: [
      'High-performance Transaction System',
      'Smart Contract Integration',
      'Wallet Connection',
      'Security Protocols'
    ],
    monthlyGoals: [
      {
        month: 'January',
        goals: ['Blockchain Architecture Setup', 'Smart Contract Development']
      },
      {
        month: 'February',
        goals: ['Wallet Integration', 'Transaction Testing']
      },
      {
        month: 'March',
        goals: ['Security Audits', 'Performance Optimization']
      }
    ]
  },
  {
    year: '2024 Q2',
    title: 'Avatar System',
    description: 'Advanced 3D avatar creation and customization system with real-time rendering.',
    color: '#14F195',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <circle cx="24" cy="16" r="10" stroke="currentColor" strokeWidth="2"/>
        <path d="M10 42c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M24 26c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 18s1.5 2 4 2 4-2 4-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    status: 'upcoming',
    progress: 0,
    features: [
      '3D Model Generation',
      'Real-time Customization',
      'Animation System',
      'Asset Management'
    ],
    monthlyGoals: [
      {
        month: 'April',
        goals: ['3D Engine Integration', 'Model Pipeline Setup']
      },
      {
        month: 'May',
        goals: ['Customization Tools', 'Animation System']
      },
      {
        month: 'June',
        goals: ['Asset Management', 'Performance Testing']
      }
    ]
  },
  {
    year: '2024 Q3',
    title: 'NFT Marketplace',
    description: 'Dynamic NFT marketplace for trading unique avatar assets and accessories.',
    color: '#00C2FF',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <rect x="8" y="8" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 24l6 6 12-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 34h20M24 8v32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <path d="M8 24h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    status: 'upcoming',
    progress: 0,
    features: [
      'NFT Minting System',
      'Trading Platform',
      'Asset Verification',
      'Marketplace Analytics'
    ],
    monthlyGoals: [
      {
        month: 'July',
        goals: ['NFT Contract Development', 'Marketplace Frontend']
      },
      {
        month: 'August',
        goals: ['Trading System', 'Asset Verification']
      },
      {
        month: 'September',
        goals: ['Analytics Dashboard', 'Platform Testing']
      }
    ]
  },
  {
    year: '2024 Q4',
    title: 'DeFi Integration',
    description: 'Comprehensive DeFi features including staking, rewards, and token economics.',
    color: '#FF9C00',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <path d="M24 8v32M8 24h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2"/>
        <path d="M24 16l8 8-8 8-8-8 8-8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    status: 'upcoming',
    progress: 0,
    features: [
      'Token Staking System',
      'Reward Distribution',
      'Liquidity Pools',
      'Yield Farming'
    ],
    monthlyGoals: [
      {
        month: 'October',
        goals: ['Staking System', 'Token Economics']
      },
      {
        month: 'November',
        goals: ['Reward Mechanisms', 'Pool Implementation']
      },
      {
        month: 'December',
        goals: ['Yield Farming', 'Security Audits']
      }
    ]
  },
  {
    year: '2025 Q1',
    title: 'Gaming Integration',
    description: 'Gaming platform integration enabling use of avatars and assets across multiple games.',
    color: '#FF0080',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <rect x="8" y="16" width="32" height="20" rx="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 26h4m-2-2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="32" cy="26" r="2" fill="currentColor"/>
        <circle cx="28" cy="26" r="2" fill="currentColor"/>
        <path d="M12 16v-4a4 4 0 014-4h16a4 4 0 014 4v4" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    status: 'upcoming',
    progress: 0,
    features: [
      'Game SDK Development',
      'Cross-game Asset System',
      'Achievement Tracking',
      'Reward Integration'
    ],
    monthlyGoals: [
      {
        month: 'January 2025',
        goals: ['SDK Development', 'Game Integration']
      },
      {
        month: 'February 2025',
        goals: ['Asset System', 'Testing Suite']
      },
      {
        month: 'March 2025',
        goals: ['Platform Launch', 'Developer Onboarding']
      }
    ]
  },
  {
    year: '2025 Q2',
    title: 'Metaverse Launch',
    description: 'Full metaverse platform launch with social features and virtual experiences.',
    color: '#7C3AED',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
        <path d="M24 8L40 40H8L24 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="28" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M20 28a4 4 0 018 0" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 20l8-8 8 8M16 36h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    status: 'upcoming',
    progress: 0,
    features: [
      'Virtual World Creation',
      'Social Interaction System',
      'Event Platform',
      'Creator Tools'
    ],
    monthlyGoals: [
      {
        month: 'April 2025',
        goals: ['World Building Tools', 'Social Features']
      },
      {
        month: 'May 2025',
        goals: ['Event System', 'Creator Platform']
      },
      {
        month: 'June 2025',
        goals: ['Platform Launch', 'Community Events']
      }
    ]
  }
];

interface LabelData {
  label: string;
  title: string;
  description: string;
  color: string;
  features: string[];
}

const labelData: LabelData[] = [
  {
    label: "SOLANA",
    title: "Blockchain Integration",
    description: "Leveraging Solana's high-performance blockchain for secure and scalable transactions.",
    color: "#9945FF",
    features: ["Fast Transaction Processing", "Low Gas Fees", "Smart Contract Integration"]
  },
  {
    label: "AVATAR",
    title: "3D Avatar System",
    description: "Advanced avatar creation and customization system with real-time rendering.",
    color: "#14F195",
    features: ["Real-time 3D Rendering", "Custom Animation System", "Cross-platform Support"]
  },
  {
    label: "NFT",
    title: "Digital Assets",
    description: "Unique digital assets powered by NFT technology on the Solana blockchain.",
    color: "#00C2FF",
    features: ["Unique Asset Creation", "Marketplace Integration", "Rarity System"]
  },
  {
    label: "DEFI",
    title: "Financial System",
    description: "Decentralized financial system for asset trading and management.",
    color: "#FF9C00",
    features: ["Token Staking", "Reward System", "Asset Trading"]
  },
  {
    label: "GAMING",
    title: "Gaming Integration",
    description: "Seamless integration with gaming platforms and metaverse environments.",
    color: "#FF0080",
    features: ["Game Asset Integration", "Cross-game Compatibility", "Real-time Interactions"]
  },
  {
    label: "METAVERSE",
    title: "Virtual World",
    description: "Immersive metaverse experience with social interactions and events.",
    color: "#7C3AED",
    features: ["Virtual Events", "Social Interactions", "World Building"]
  }
];

// Add these styles to your global CSS or tailwind config
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }
  
  .animate-spin-slow {
    animation: spin-slow 8s linear infinite;
  }
  
  .animate-bounce-slow {
    animation: bounce-slow 2s ease-in-out infinite;
  }
`;

export default function Roadmap() {
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const prevProgress = useRef(0);
  
  // Optimized GSAP animations
  useEffect(() => {
    if (!mainContainerRef.current || !containerRef.current) return;

    const sections = gsap.utils.toArray('.roadmap-item');
    const totalWidth = (sections.length - 1) * 1000;

    // Kill any existing animations
    gsap.killTweensOf(containerRef.current);
    ScrollTrigger.getAll().forEach(t => t.kill());

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mainContainerRef.current,
        pin: true,
        pinSpacing: true,
        scrub: 2, // Increased for smoother scrolling
        snap: {
          snapTo: "labels",
          duration: { min: 0.2, max: 0.5 },
          delay: 0.1,
          ease: "power1.inOut"
        },
        end: () => `+=${totalWidth}`,
        onUpdate: (self) => {
          const progress = self.progress;
          if (Math.abs(progress - prevProgress.current) > 0.001) {
            const rawIndex = progress * (roadmapData.length - 1);
            const sectionIndex = Math.round(rawIndex);
            setActiveIndex(Math.min(sectionIndex, roadmapData.length - 1));
            prevProgress.current = progress;
            setScrollProgress(progress);
          }
        }
      }
    });

    // Add labels for snapping
    sections.forEach((_, i) => {
      tl.addLabel(`section${i}`, i * (1 / (sections.length - 1)));
    });

    // Smoother horizontal scroll animation
    tl.to(containerRef.current, {
      x: -totalWidth,
      ease: "none",
      duration: 1,
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.killTweensOf(containerRef.current);
    };
  }, []);

  // Optimized label click handler
  const handleLabelClick = (index: number) => {
    if (!mainContainerRef.current) return;
    
    const progress = index / (roadmapData.length - 1);
    const scrollTrigger = ScrollTrigger.getAll()[0];
    
    if (scrollTrigger) {
      gsap.to(window, {
        scrollTo: {
          y: progress * scrollTrigger.end,
          autoKill: true
        },
        duration: 1.5,
        ease: "power3.inOut",
        overwrite: true
      });
    }
  };

  return (
    <div ref={mainContainerRef} className="relative min-h-screen bg-[#0A0A1E] overflow-hidden">
      {/* Version Label */}
      <div className="fixed top-8 left-8 text-white/50 text-sm z-50">
        v1.0 2025 — 2026
      </div>

      {/* Menu Button */}
      <div className="fixed top-8 right-8 text-white/50 text-sm z-50">
        MENU
      </div>

      {/* Fixed Header */}
      <motion.h2 
        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 text-4xl md:text-5xl lg:text-6xl font-syne text-white text-center"
      >
        SOLAVATAR ROADMAP
      </motion.h2>

      {/* Side Labels */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50">
        <div className="absolute left-0 top-0 w-64 h-full bg-gradient-to-r from-[#0A0A1E] via-[#0A0A1E]/95 to-transparent backdrop-blur-2xl -z-10" />
        
        <div className="relative space-y-8">
          {labelData.map((labelItem, index) => (
            <motion.button 
              key={labelItem.label}
              onClick={() => handleLabelClick(index)}
              initial={{ opacity: 0.4, x: -20 }}
              animate={{ 
                opacity: activeIndex === index ? 1 : 0.4,
                color: activeIndex === index ? labelItem.color : '#ffffff',
                x: activeIndex === index ? 0 : -20,
                textShadow: activeIndex === index ? `0 0 20px ${labelItem.color}80` : 'none'
              }}
              whileHover={{ 
                opacity: 1,
                x: 5,
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                transition: { duration: 0.3 }
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="block text-sm tracking-wider font-medium relative group cursor-pointer hover:text-white"
            >
              <motion.div
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{ backgroundColor: labelItem.color }}
                initial={{ scale: 0 }}
                animate={{ scale: activeIndex === index ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
              {labelItem.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-screen">
        <div ref={containerRef} className="absolute top-0 left-0 h-full flex items-center transform-gpu">
          <div className="flex pl-[20vw] gap-20">
            {roadmapData.map((item, index) => {
              const isActive = activeIndex === index;
              const distance = Math.abs(activeIndex - index);
              const isVisible = distance <= 1;
              
              return (
                <motion.div
                  key={item.year}
                  className="roadmap-item relative w-[800px] h-[500px] flex-shrink-0 transform-gpu"
                  initial={false}
                  animate={{ 
                    opacity: isVisible ? 1 : 0,
                    scale: isActive ? 1 : 0.95,
                    filter: isVisible ? 'blur(0px)' : 'blur(4px)',
                    x: isActive ? 0 : (index > activeIndex ? 100 : -100),
                    rotateY: isActive ? 0 : (index > activeIndex ? 15 : -15),
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 80,
                    damping: 25,
                    mass: 0.5,
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                    rotateY: { duration: 0.4 },
                    x: { type: "spring", stiffness: 100, damping: 30, mass: 0.5 }
                  }}
                  style={{
                    perspective: '2000px',
                    transformStyle: 'preserve-3d',
                    zIndex: isActive ? 2 : 1,
                    willChange: 'transform'
                  }}
                >
                  <motion.div 
                    className="bg-[#0A0A1E]/30 backdrop-blur-md p-12 rounded-xl border h-full relative overflow-hidden group transform-gpu"
                    style={{ 
                      borderColor: `${item.color}20`,
                      boxShadow: `0 0 40px ${item.color}10`,
                    }}
                    initial={false}
                    animate={{
                      rotateY: (activeIndex - index) * 8,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 80,
                      damping: 25,
                    }}
                  >
                    {/* Progress Bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
                      <motion.div
                        className="h-full"
                        style={{ 
                          backgroundColor: item.color,
                          width: `${item.progress}%`
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>

                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div 
                        className={`w-2 h-2 rounded-full ${
                          item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'in-progress' ? 'bg-yellow-500 animate-pulse' :
                          'bg-blue-500'
                        }`}
                      />
                      <span className="text-xs text-white/60 uppercase">
                        {item.status}
                      </span>
                    </div>

                    {/* Enhanced Glow Effect */}
                    <motion.div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ 
                        background: `
                          radial-gradient(circle at 50% 0%, ${item.color}15 0%, transparent 50%),
                          radial-gradient(circle at 50% 100%, ${item.color}10 0%, transparent 50%)
                        `,
                        filter: 'blur(40px)'
                      }}
                    />

                    {/* Icon with Animation */}
                    <motion.div 
                      className="mb-8 relative text-white/80 hover:text-white transition-colors"
                      whileHover={{ scale: 1.1, rotateZ: 5 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    <span 
                      className="text-xl md:text-2xl block mb-4 font-syne"
                      style={{ color: item.color }}
                    >
                      {item.year}
                    </span>
                    <h3 className="text-2xl md:text-3xl text-white font-syne mb-4">
                      {item.title}
                    </h3>
                    <p className="text-white/70 font-grotesk mb-6">
                      {item.description}
                    </p>

                    {/* Features List with Animation */}
                    <div className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <motion.div 
                          key={featureIndex}
                          className="flex items-center space-x-2"
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: featureIndex * 0.1 }}
                        >
                          <div 
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-white/80 text-sm">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Expandable Monthly Goals */}
                    <AnimatePresence>
                      {expandedItem === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t"
                          style={{ borderColor: `${item.color}20` }}
                        >
                          <h4 className="text-lg text-white mb-4">Monthly Goals</h4>
                          {item.monthlyGoals.map((monthlyGoal, monthIndex) => (
                            <div key={monthIndex} className="mb-4">
                              <h5 
                                className="text-sm mb-2"
                                style={{ color: item.color }}
                              >
                                {monthlyGoal.month}
                              </h5>
                              <ul className="space-y-2">
                                {monthlyGoal.goals.map((goal, goalIndex) => (
                                  <motion.li
                                    key={goalIndex}
                                    initial={{ x: -10, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: goalIndex * 0.1 }}
                                    className="text-white/70 text-sm flex items-center space-x-2"
                                  >
                                    <div 
                                      className="w-1 h-1 rounded-full"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span>{goal}</span>
                                  </motion.li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Fade Overlays with optimized gradients */}
        <div className="fixed left-0 top-0 w-[35vw] h-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A1E] via-[#0A0A1E]/98 to-transparent z-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A1E] via-[#0A0A1E]/95 to-transparent blur-2xl z-30" />
        </div>
        <div className="fixed right-0 top-0 w-[35vw] h-full pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A1E] via-[#0A0A1E]/98 to-transparent z-40" />
          <div className="absolute inset-0 bg-gradient-to-l from-[#0A0A1E] via-[#0A0A1E]/95 to-transparent blur-2xl z-30" />
        </div>
      </div>
    </div>
  );
} 