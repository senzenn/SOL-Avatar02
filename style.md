# Sol Avatar Design System

## Overview
A comprehensive design system for Sol Avatar, inspired by award-winning 3D websites and modern web design principles.

## Core Design Principles
- Immersive 3D experiences
- Fluid animations and transitions
- High performance and accessibility
- Modern and futuristic aesthetic

## Color System
```css
--background: 240 100% 5%;     /* Deep space black */
--primary: 217 100% 50%;       /* Electric blue */
--secondary: 217 100% 15%;     /* Muted blue */
--accent: 280 100% 50%;        /* Neon purple */
```

## Typography
### Hierarchy
- Display: 4rem/64px (Hero titles)
- H1: 3rem/48px (Section headers)
- H2: 2.5rem/40px (Sub-sections)
- H3: 2rem/32px (Card titles)
- Body: 1rem/16px (Main content)
- Small: 0.875rem/14px (Captions)

### Font Families
```css
--font-sans: 'Inter', system-ui;
--font-mono: 'JetBrains Mono', monospace;
```

## Animation Patterns

### 1. Text Effects
#### 3D Text
```css
.text-3d {
  text-shadow: 
    0px 1px 0px hsl(var(--primary) / 0.9),
    0px 2px 0px hsl(var(--primary) / 0.8),
    0px 3px 0px hsl(var(--primary) / 0.7),
    0px 4px 0px hsl(var(--primary) / 0.6),
    0px 5px 10px rgba(0, 0, 0, 0.4);
}
```
Usage: Main headings and hero text

#### Glitch Effect
```css
.glitch {
  position: relative;
  /* See animations.css for full implementation */
}
```
Usage: Interactive elements and hover states

### 2. Motion Effects
#### Floating Animation
```css
.animate-float {
  animation: float 6s ease-in-out infinite;
}
```
Usage: 3D models and decorative elements

#### Parallax Scrolling
```css
.parallax-wrap {
  perspective: 1000px;
}
.parallax-layer {
  transform-style: preserve-3d;
}
```
Usage: Background elements and depth layers

### 3. Interactive Elements
#### Magnetic Effect
```css
.magnetic {
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}
```
Usage: Buttons and clickable elements

#### Hover States
```css
.interactive-element {
  transition: all 0.3s ease;
}
.interactive-element:hover {
  transform: translateY(-2px);
  filter: brightness(1.2);
}
```

## Component Patterns

### 1. Hero Section
- Full-screen 3D scene
- Animated text reveal
- Floating elements
- Scroll indicator

### 2. Navigation
- Minimal top bar
- Full-screen overlay menu
- Animated transitions
- Context-aware states

### 3. Content Cards
```css
.card {
  @apply bg-secondary/10 backdrop-blur-sm;
  @apply border border-primary/20;
  @apply rounded-lg p-6;
  @apply transition-all duration-300;
}
```

### 4. Loading States
- Progressive loading
- Skeleton screens
- Smooth transitions
- Loading indicators

## Micro-interactions

### 1. Cursor Effects
- Custom cursor styles
- Hover states
- Click effects
- Context indicators

### 2. Scroll-based Animations
```css
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3. Form Elements
- Floating labels
- Validation states
- Error animations
- Success indicators

## Performance Guidelines

### 1. Animation Performance
- Use `transform` and `opacity` for animations
- Implement `will-change` for heavy animations
- Use `requestAnimationFrame` for JS animations
- Debounce scroll events

### 2. Asset Loading
- Progressive image loading
- Lazy loading for off-screen content
- Asset preloading for critical content
- Optimized 3D models

## Accessibility

### 1. Motion Preferences
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

### 2. Color Contrast
- Minimum contrast ratio: 4.5:1
- Clear focus states
- Readable text on all backgrounds

## Implementation Guide

### 1. Required Dependencies
```bash
npm install gsap three @react-three/fiber @react-three/drei @react-spring/three @react-spring/web framer-motion
```

### 2. File Structure
```
src/
  ├── styles/
  │   ├── animations.css
  │   └── components.css
  ├── components/
  │   ├── 3d/
  │   ├── animations/
  │   └── ui/
  └── hooks/
      └── useAnimations.ts
```

### 3. Best Practices
- Use CSS variables for dynamic values
- Implement mobile-first responsive design
- Optimize for performance
- Follow accessibility guidelines
- Document component usage

## Resources
- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Animation Platform](https://greensock.com/gsap/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

## Component Implementations

### 1. Hero Section Implementation
```tsx
// components/Hero.tsx
"use client";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";

export function Hero() {
  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* 3D Background */}
      <Canvas className="absolute inset-0">
        <Environment preset="night" />
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
        </mesh>
      </Canvas>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.h1 
          className="text-3d text-6xl md:text-8xl font-bold text-gradient"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          SOL AVATAR
        </motion.h1>
        
        <motion.p
          className="mt-4 text-xl md:text-2xl text-foreground/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Next Generation Avatar Platform
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full">
          <div className="w-1 h-2 bg-primary mx-auto mt-2 rounded-full animate-scroll" />
        </div>
      </motion.div>
    </div>
  );
}
```

### 2. Custom Cursor Implementation
```tsx
// components/CustomCursor.tsx
"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer');
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className="fixed w-4 h-4 bg-primary rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: position.x - 8,
          y: position.y - 8,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />
      
      {/* Cursor trail */}
      <motion.div
        className="fixed w-8 h-8 border border-primary rounded-full pointer-events-none z-40"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 24 }}
      />
    </>
  );
}
```

### 3. Magnetic Button Implementation
```tsx
// components/MagneticButton.tsx
"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, className = "", onClick }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
    
    const center = {
      x: left + width / 2,
      y: top + height / 2
    };

    setPosition({
      x: (clientX - center.x) * 0.2,
      y: (clientY - center.y) * 0.2
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative px-6 py-3 rounded-lg bg-primary/10 border border-primary/20 
        hover:bg-primary/20 transition-colors ${className}`}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}
```

### 4. Scroll-Based Text Reveal
```tsx
// components/ScrollRevealText.tsx
"use client";
import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ScrollRevealTextProps {
  children: React.ReactNode;
  threshold?: number;
}

export function ScrollRevealText({ children, threshold = 0.5 }: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, threshold, 1], [0, 1, 0]);
  const y = useTransform(scrollYProgress, [0, threshold, 1], [100, 0, -100]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      className="relative py-20"
    >
      {children}
    </motion.div>
  );
}
```

## Advanced Animation Patterns

### 1. Text Split Animation
```tsx
// components/SplitText.tsx
"use client";
import { motion } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
}

export function SplitText({ text, className = "" }: SplitTextProps) {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, idx) => (
        <motion.span
          key={idx}
          className="inline-block mr-2"
          variants={child}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
```

### 2. Parallax Section Implementation
```tsx
// components/ParallaxSection.tsx
"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
}

export function ParallaxSection({ children, speed = 0.5 }: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
}
```

## Implementation Guidelines

### 1. Performance Optimization
```typescript
// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}
```

### 2. Asset Loading Strategy
```typescript
// utils/assetLoader.ts
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadModel = async (url: string): Promise<void> => {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(url, () => resolve(), undefined, reject);
  });
};
``` 