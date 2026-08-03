"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const FeaturedWorkSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // --- Three.js Scene Setup ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x2d5bff, 1.5);
    dirLight2.position.set(-10, -10, -5);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 2, 30);
    pointLight.position.set(0, 0, 10);
    scene.add(pointLight);

    // --- Create 3D Glass/Metallic Jack Block ---
    const create3DBlock = (color = 0xe2e8f0) => {
      const group = new THREE.Group();

      const cylinderGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.4, 32);
      const capGeo = new THREE.SphereGeometry(0.35, 32, 16);

      const material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.15,
        metalness: 0.85,
        envMapIntensity: 1.5,
      });

      // Axis 1 (X)
      const meshX = new THREE.Mesh(cylinderGeo, material);
      meshX.rotation.z = Math.PI / 2;
      group.add(meshX);

      const capX1 = new THREE.Mesh(capGeo, material);
      capX1.position.set(1.2, 0, 0);
      group.add(capX1);

      const capX2 = new THREE.Mesh(capGeo, material);
      capX2.position.set(-1.2, 0, 0);
      group.add(capX2);

      // Axis 2 (Y)
      const meshY = new THREE.Mesh(cylinderGeo, material);
      group.add(meshY);

      const capY1 = new THREE.Mesh(capGeo, material);
      capY1.position.set(0, 1.2, 0);
      group.add(capY1);

      const capY2 = new THREE.Mesh(capGeo, material);
      capY2.position.set(0, -1.2, 0);
      group.add(capY2);

      // Axis 3 (Z)
      const meshZ = new THREE.Mesh(cylinderGeo, material);
      meshZ.rotation.x = Math.PI / 2;
      group.add(meshZ);

      const capZ1 = new THREE.Mesh(capGeo, material);
      capZ1.position.set(0, 0, 1.2);
      group.add(capZ1);

      const capZ2 = new THREE.Mesh(capGeo, material);
      capZ2.position.set(0, 0, -1.2);
      group.add(capZ2);

      return group;
    };

    // Instantiate 3 Floating Blocks
    const blocks: { mesh: THREE.Group; basePos: THREE.Vector3; rotSpeed: THREE.Vector3 }[] = [];

    const blockConfigs = [
      { pos: new THREE.Vector3(-4.5, 2.5, 3), color: 0xced6e0, scale: 1.1 },
      { pos: new THREE.Vector3(3.8, 1.2, 4), color: 0xffffff, scale: 0.95 },
      { pos: new THREE.Vector3(2.2, -2.8, 3.5), color: 0xb0bec5, scale: 1.25 },
    ];

    blockConfigs.forEach((cfg) => {
      const block = create3DBlock(cfg.color);
      block.position.copy(cfg.pos);
      block.scale.setScalar(cfg.scale);
      scene.add(block);

      blocks.push({
        mesh: block,
        basePos: cfg.pos.clone(),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.01
        ),
      });
    });

    // --- Mouse Parallax ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    window.addEventListener("mousemove", handleMouseMove);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Animate each floating 3D block
      blocks.forEach((b, i) => {
        b.mesh.rotation.x += b.rotSpeed.x;
        b.mesh.rotation.y += b.rotSpeed.y;
        b.mesh.rotation.z += b.rotSpeed.z;

        // Floating sine oscillation
        b.mesh.position.y = b.basePos.y + Math.sin(time * 1.5 + i * 2) * 0.3;
        b.mesh.position.x = b.basePos.x + Math.cos(time * 1.2 + i * 1.5) * 0.2;

        // Parallax response
        b.mesh.position.x += mouse.x * 0.4;
        b.mesh.position.y += mouse.y * 0.4;
      });

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    // --- GSAP Entrance Animation ---
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(reqId);
      ctx.revert();
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[90vh] bg-gradient-to-b from-[#e3ebf5] via-[#dbe5f2] to-[#d3dfe9] text-[#0A0D14] overflow-hidden flex flex-col justify-center items-center py-20 px-6 sm:px-12 md:px-16"
    >
      {/* Interactive 3D WebGL Canvas for Floating Blocks */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      />

      {/* Main Container */}
      <div className="relative z-0 max-w-7xl mx-auto w-full flex flex-col justify-between items-start h-full space-y-16">
        {/* Massive Screenshot-Style Typography */}
        <div ref={titleRef} className="w-full flex flex-col select-none">
          <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.85] text-[#0A0D14]">
            FEATURED
          </h1>
          <h1 className="text-[12vw] sm:text-[11vw] md:text-[10vw] font-black uppercase tracking-tighter leading-[0.85] text-[#0A0D14] sm:ml-[8vw]">
            WORK
          </h1>
        </div>

        {/* Bottom Right Description Paragraph */}
        <div className="w-full flex justify-end pt-8">
          <p className="text-slate-700 font-medium text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm text-left leading-relaxed">
            Award-winning design & development studio building websites, activations,
            and digital experiences that make people stop scrolling.
          </p>
        </div>
      </div>
    </section>
  );
};
