'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { Logo } from './Logo';

interface NavItem {
  label: string;
  href: string;
  number: string;
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/', number: '01' },
  { label: 'INSPIRATION', href: '/inspiration', number: '02' },
  { label: 'CONCEPT', href: '/concept', number: '03' },
  { label: 'DESIGN', href: '/design', number: '04' },
  { label: 'DOUBLE HULL', href: '/double-hull', number: '05' },
  { label: 'OPERATION MODE', href: '/operation', number: '06' },
  { label: 'CREATE', href: '/create', number: '07' },
  { label: 'ROADMAP', href: '/roadmap', number: '08' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLUListElement>(null);
  const timeline = useRef<GSAPTimeline>();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Add shader animation
  useEffect(() => {
    if (!menuRef.current) return;

    const shaderAnimation = gsap.to(menuRef.current, {
      backgroundImage: 'radial-gradient(circle at var(--mouse-x) var(--mouse-y), rgba(0,0,25,0.95) 0%, rgba(0,0,10,0.98) 100%)',
      duration: 0.5,
      paused: true,
    });

    const handleMouseMove = (e: MouseEvent) => {
      if (!menuRef.current || !isOpen) return;
      
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      
      menuRef.current.style.setProperty('--mouse-x', `${x}%`);
      menuRef.current.style.setProperty('--mouse-y', `${y}%`);
      shaderAnimation.play();
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isOpen]);

  useEffect(() => {
    // Initialize GSAP timeline
    timeline.current = gsap.timeline({
      paused: true,
      onStart: () => setIsAnimating(true),
      onComplete: () => setIsAnimating(false),
      onReverseComplete: () => setIsAnimating(false),
    });

    if (menuRef.current && linksRef.current) {
      timeline.current
        .fromTo(
          menuRef.current,
          { 
            opacity: 0,
            backdropFilter: 'blur(0px)',
            visibility: 'hidden'
          },
          { 
            opacity: 1,
            backdropFilter: 'blur(20px)',
            visibility: 'visible',
            duration: 0.5,
            ease: 'power2.inOut'
          }
        )
        .fromTo(
          linksRef.current.children,
          { 
            opacity: 0,
            y: 50,
            rotationX: -45,
            filter: 'blur(10px)',
            pointerEvents: 'none'
          },
          { 
            opacity: 1,
            y: 0,
            rotationX: 0,
            filter: 'blur(0px)',
            pointerEvents: 'auto',
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out"
          },
          "-=0.3"
        );
    }
  }, []);

  const handleMenuToggle = () => {
    if (isAnimating) return;
    
    if (timeline.current) {
      if (!isOpen) {
        setIsOpen(true);  // flow open menu 
        document.body.style.overflow = 'hidden';
        timeline.current.play();
      } else {
        timeline.current.reverse().then(() => {
          setIsOpen(false);
          document.body.style.overflow = '';
        });
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Main Navbar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 bg-transparent">
        {/* Left - Version */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] md:text-xs lg:text-sm text-white/60 tracking-widest">
            v1.0 2025 — 2026
          </span>
        </div>

        {/* Center - Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Logo />
        </div>

        {/* Right - Menu Toggle */}
        <button
          onClick={handleMenuToggle}
          disabled={isAnimating}
          className="relative text-white hover:text-[#0066FF] transition-colors text-sm tracking-wider group disabled:opacity-50 px-4 py-2"
          aria-label={isOpen ? "Close Menu" : "Open Menu"}
        >
          <span className="relative z-10 text-sm md:text-base lg:text-lg uppercase">
            {isOpen ? 'Close' : 'Menu'}
          </span>
        </button>
      </div>

      {/* Full Screen Menu */}
      <div 
        ref={menuRef}
        className={cn(
          "fixed inset-0 transition-all duration-500",
          isOpen ? "visible" : "invisible"
        )}
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,25,0.98) 0%, rgba(0,0,10,0.99) 100%)',
          '--mouse-x': '50%',
          '--mouse-y': '50%',
        } as any}
        aria-hidden={!isOpen}
      >
        {/* Navigation Links */}
        <nav className="h-full flex flex-col items-start justify-center px-4 sm:px-6 md:px-16 lg:px-24">
          <ul ref={linksRef} className="space-y-2 sm:space-y-3 md:space-y-6 w-full max-w-4xl mx-auto">
            {navItems.map((item, index) => (
              <li 
                key={item.href} 
                className="overflow-hidden"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                <Link
                  href={item.href}
                  onClick={handleMenuToggle}
                  className="group flex items-center space-x-2 sm:space-x-4 text-lg sm:text-xl md:text-4xl lg:text-5xl relative hover:text-[#0066FF]"
                >
                  <span className="text-[#0066FF] font-light opacity-60 group-hover:opacity-100 transition-all w-8 sm:w-12 md:w-16 shrink-0">
                    {item.number}
                  </span>
                  <span className="text-white/90 group-hover:text-white transition-colors tracking-wider relative">
                    {item.label}
                    <div 
                      className={cn(
                        "absolute inset-0 bg-gradient-to-r from-[#0066FF] to-[#0044AA] opacity-0 transition-opacity blur-xl",
                        activeIndex === index ? "opacity-30" : "opacity-0"
                      )}
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Decorative Lines with Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-[#0066FF]/50 via-[#0066FF]/20 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-[#0066FF]/50 via-[#0066FF]/20 to-transparent" />
          
          {/* Additional Glowing Lines */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0066FF]/20 to-transparent" />
        </div>
      </div>
    </header>
  );
} 