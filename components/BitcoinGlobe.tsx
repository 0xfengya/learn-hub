"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BitcoinGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    const size = Math.min(mountRef.current.clientWidth, 500);
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Create wireframe sphere (globe)
    const sphereGeo = new THREE.SphereGeometry(2, 32, 32);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xf7931a,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const sphere = new THREE.Mesh(sphereGeo, wireMat);
    scene.add(sphere);

    // Create orbiting particles (nodes)
    const particleCount = 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      positions[i * 3] = 2.3 * Math.cos(theta) * Math.sin(phi);
      positions[i * 3 + 1] = 2.3 * Math.sin(theta) * Math.sin(phi);
      positions[i * 3 + 2] = 2.3 * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xf7931a,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Glowing center ring
    const ringGeo = new THREE.TorusGeometry(2.6, 0.02, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf7931a,
      transparent: true,
      opacity: 0.4,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.015, 16, 100),
      new THREE.MeshBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.25,
      })
    );
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    camera.position.z = 5;

    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      sphere.rotation.y += 0.003;
      sphere.rotation.x += 0.001;
      particles.rotation.y -= 0.002;
      particles.rotation.x += 0.0005;
      ring1.rotation.z += 0.004;
      ring2.rotation.z -= 0.003;

      // Subtle mouse parallax
      scene.rotation.y += (mouse.x * 0.3 - scene.rotation.y) * 0.02;
      scene.rotation.x += (mouse.y * 0.2 - scene.rotation.x) * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      renderer.dispose();
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full max-w-[500px] aspect-square mx-auto"
    />
  );
}
