"use client";
import { useEffect, useRef } from "react";
import { useIntro } from "@/context/IntroContext";
import * as THREE from "three";

export const HeroSection = () => {
  const { isIntroDone } = useIntro();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0c0c0e");

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // --- Lighting ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(15, 25, 20);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 1.8);
    dirLight2.position.set(-15, -15, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 3, 40);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // --- 3D Text Plane at Z = 0 for True Z-Depth Intersecting ---
    const createTextPlane = () => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = 2048;
      textCanvas.height = 1024;
      const ctx = textCanvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

        // Subtitle
        ctx.font = "bold 28px monospace";
        ctx.fillStyle = "#60a5fa";
        ctx.textAlign = "center";
        ctx.letterSpacing = "6px";
        ctx.fillText("INTERACTIVE 3D EXPERIENCE", 1024, 280);

        // Main Title: LABTOBIT
        ctx.font = "900 210px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("LABTOBIT", 1024, 480);

        // Sub Title: STUDIO (Outline)
        ctx.font = "900 210px sans-serif";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 5;
        ctx.textAlign = "center";
        ctx.strokeText("STUDIO", 1024, 680);
      }

      const textTexture = new THREE.CanvasTexture(textCanvas);
      textTexture.minFilter = THREE.LinearFilter;
      textTexture.magFilter = THREE.LinearFilter;

      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        depthWrite: false, // Prevents text transparent box from occluding objects behind it
      });

      // Aspect ratio of the canvas plane
      const planeGeo = new THREE.PlaneGeometry(18, 9);
      const textMesh = new THREE.Mesh(planeGeo, textMaterial);
      textMesh.position.set(0, 0, 0); // Positioned right at Z = 0
      return textMesh;
    };

    const textPlane = createTextPlane();
    scene.add(textPlane);

    // --- 3D Jack Mesh Helper ---
    const createJackGeometry = () => {
      const group = new THREE.Group();

      const cylinderGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.6, 32);
      const capGeo = new THREE.SphereGeometry(0.35, 32, 16);

      const colorPalette = [
        0x1d4ed8, // Royal Blue
        0x3b82f6, // Bright Blue
        0xe2e8f0, // Slate Off-White
        0x18181b, // Dark Charcoal
        0x94a3b8, // Light Metallic Grey
      ];

      const chosenColor =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];

      const material = new THREE.MeshStandardMaterial({
        color: chosenColor,
        roughness: 0.25,
        metalness: 0.1,
      });

      // Leg Y
      const meshY = new THREE.Mesh(cylinderGeo, material);
      meshY.castShadow = true;
      meshY.receiveShadow = true;
      group.add(meshY);

      // Leg X
      const meshX = new THREE.Mesh(cylinderGeo, material);
      meshX.rotation.z = Math.PI / 2;
      meshX.castShadow = true;
      meshX.receiveShadow = true;
      group.add(meshX);

      // Leg Z
      const meshZ = new THREE.Mesh(cylinderGeo, material);
      meshZ.rotation.x = Math.PI / 2;
      meshZ.castShadow = true;
      meshZ.receiveShadow = true;
      group.add(meshZ);

      // End Caps
      const capsPositions = [
        [0, 1.3, 0],
        [0, -1.3, 0],
        [1.3, 0, 0],
        [-1.3, 0, 0],
        [0, 0, 1.3],
        [0, 0, -1.3],
      ];

      capsPositions.forEach(([x, y, z]) => {
        const cap = new THREE.Mesh(capGeo, material);
        cap.position.set(x, y, z);
        cap.castShadow = true;
        cap.receiveShadow = true;
        group.add(cap);
      });

      return group;
    };

    // --- Cluster Setup with Depth Layering & Center Text Clearing ---
    const jackCount = 30;
    const jacks: {
      group: THREE.Group;
      basePos: THREE.Vector3;
      rotationSpeed: THREE.Vector3;
      velocity: THREE.Vector3;
      floatPhase: number;
    }[] = [];

    const mainCluster = new THREE.Group();
    scene.add(mainCluster);

    for (let i = 0; i < jackCount; i++) {
      const jack = createJackGeometry();

      // Smart position generation:
      // Keep central text region (X: -5 to +5, Y: -2.5 to +2.5) cleaner,
      // and place 60% behind Z=0 and 40% in front of Z=0 for true 3D depth layering!
      let x = (Math.random() - 0.5) * 26;
      let y = (Math.random() - 0.5) * 15;

      // If it lands right on top of the central text, push it further outwards or to front/back
      if (Math.abs(x) < 6 && Math.abs(y) < 3.5) {
        if (Math.random() > 0.3) {
          x += (x >= 0 ? 4.5 : -4.5);
        }
      }

      // Layering Z depth: Some in FRONT of text (Z > +1.2), some BEHIND text (Z < -1.2)
      const inFront = i % 3 === 0; // ~33% in front, ~67% behind
      const z = inFront
        ? 1.5 + Math.random() * 3.5  // In front of text
        : -1.5 - Math.random() * 4.5; // Behind text

      jack.position.set(x, y, z);
      jack.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const scale = 0.6 + Math.random() * 0.45;
      jack.scale.set(scale, scale, scale);

      mainCluster.add(jack);

      jacks.push({
        group: jack,
        basePos: new THREE.Vector3(x, y, z),
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012,
          (Math.random() - 0.5) * 0.012
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        floatPhase: Math.random() * Math.PI * 2,
      });
    }

    // --- Mouse & Raycasting ---
    const mouse = new THREE.Vector2(-999, -999);
    const targetMouse = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      targetMouse.x = mouse.x * 2;
      targetMouse.y = mouse.y * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop ---
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Camera parallax tilt
      mainCluster.rotation.y += (targetMouse.x * 0.25 - mainCluster.rotation.y) * 0.04;
      mainCluster.rotation.x += (-targetMouse.y * 0.25 - mainCluster.rotation.x) * 0.04;

      // Also subtly tilt text plane for parallax
      textPlane.rotation.y = mainCluster.rotation.y * 0.3;
      textPlane.rotation.x = mainCluster.rotation.x * 0.3;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(mainCluster.children, true);

      let hoveredGroup: THREE.Object3D | null = null;
      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent !== mainCluster) {
          obj = obj.parent;
        }
        hoveredGroup = obj;
      }

      jacks.forEach((j) => {
        const floatY = Math.sin(elapsedTime * 1.4 + j.floatPhase) * 0.3;
        const floatX = Math.cos(elapsedTime * 1.1 + j.floatPhase) * 0.2;

        j.group.rotation.x += j.rotationSpeed.x;
        j.group.rotation.y += j.rotationSpeed.y;
        j.group.rotation.z += j.rotationSpeed.z;

        if (hoveredGroup === j.group) {
          j.group.rotation.x += 0.08;
          j.group.rotation.y += 0.08;
          j.velocity.z += 0.06;
        }

        j.velocity.multiplyScalar(0.92);
        j.group.position.x = j.basePos.x + floatX + j.velocity.x;
        j.group.position.y = j.basePos.y + floatY + j.velocity.y;
        j.group.position.z = j.basePos.z + j.velocity.z;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0c0c0e] text-white ${
        !isIntroDone ? "hidden" : "block"
      }`}
    >
      {/* 3D WebGL Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Subtle Noise Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.08] z-10 mix-blend-overlay"
        style={{
          backgroundImage:
            'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")',
          backgroundRepeat: "repeat",
        }}
      />

      {/* Bottom Bar: + + SCROLL TO EXPLORE + + */}
      <div className="absolute bottom-6 left-0 right-0 z-20 px-8 flex items-center justify-between text-xs font-mono tracking-widest text-zinc-400 mix-blend-difference pointer-events-none select-none">
        <span>+</span>
        <div className="flex items-center gap-3">
          <span>+</span>
          <span className="uppercase text-[11px] font-semibold text-white tracking-[0.3em]">
            SCROLL TO EXPLORE
          </span>
          <span>+</span>
        </div>
        <span>+</span>
      </div>
    </section>
  );
};
