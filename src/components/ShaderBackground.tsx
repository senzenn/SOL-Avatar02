'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec2 mouse;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 normalizedMouse = mouse / resolution.xy;
    
    // Create a gradient based on distance from mouse
    float dist = distance(uv, normalizedMouse);
    float strength = smoothstep(0.5, 0.0, dist);
    
    // Create a moving noise pattern
    float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453123);
    noise = mix(0.95, 1.0, noise);
    
    // Create base color with subtle variation
    vec3 baseColor = vec3(0.0, 0.0, 0.1);
    vec3 accentColor = vec3(0.0, 0.4, 1.0);
    
    // Mix colors based on mouse distance and time
    vec3 finalColor = mix(baseColor, accentColor, strength * noise * (sin(time * 0.5) * 0.5 + 0.5));
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export default function ShaderBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      fragmentShader,
      vertexShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
      }
    });
    materialRef.current = material;

    // Create mesh
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = time;
        
        // Smooth mouse movement
        const currentMouse = materialRef.current.uniforms.mouse.value;
        const targetMouse = mouseRef.current;
        currentMouse.x += (targetMouse.x - currentMouse.x) * 0.1;
        currentMouse.y += (targetMouse.y - currentMouse.y) * 0.1;
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (materialRef.current) {
        materialRef.current.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
      }
    };
    window.addEventListener('resize', handleResize);

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: window.innerHeight - e.clientY // Flip Y coordinate for WebGL
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #000010, #000025)' }}
    />
  );
} 