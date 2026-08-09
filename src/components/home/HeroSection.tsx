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

    // --- WebGL Resource Tracking for Disposal ---
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const texturesToDispose: THREE.Texture[] = [];

    // --- Larger 3D Text Plane at Z = 0 ---
    const createTextPlane = () => {
      const textCanvas = document.createElement("canvas");
      textCanvas.width = 2048;
      textCanvas.height = 1024;
      const ctx = textCanvas.getContext("2d");

      if (ctx) {
        ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

        // Subtitle
        ctx.font = "bold 32px monospace";
        ctx.fillStyle = "#60a5fa";
        ctx.textAlign = "center";
        ctx.letterSpacing = "8px";
        ctx.fillText("INTERACTIVE 3D EXPERIENCE", 1024, 220);

        // Main Title: LABTOBIT
        ctx.font = "900 270px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.fillText("LABTOBIT", 1024, 470);

        // Sub Title: STUDIO
        ctx.font = "900 270px sans-serif";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 6;
        ctx.textAlign = "center";
        ctx.strokeText("STUDIO", 1024, 720);
      }

      const textTexture = new THREE.CanvasTexture(textCanvas);
      textTexture.minFilter = THREE.LinearFilter;
      textTexture.magFilter = THREE.LinearFilter;
      texturesToDispose.push(textTexture);

      const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        depthWrite: false,
      });
      materialsToDispose.push(textMaterial);

      const planeGeo = new THREE.PlaneGeometry(24, 12);
      geometriesToDispose.push(planeGeo);

      const textMesh = new THREE.Mesh(planeGeo, textMaterial);
      textMesh.position.set(0, 0, 0);
      return textMesh;
    };

    const textPlane = createTextPlane();
    scene.add(textPlane);

    // Shared geometries for jacks (instantiated once instead of 32 times)
    const cylinderGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.6, 32);
    const capGeo = new THREE.SphereGeometry(0.35, 32, 16);
    geometriesToDispose.push(cylinderGeo, capGeo);

    // --- 3D Jack Mesh Helper ---
    const createJackGeometry = () => {
      const group = new THREE.Group();

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
      materialsToDispose.push(material);

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

      capsPositions.forEach(([cx, cy, cz]) => {
        const cap = new THREE.Mesh(capGeo, material);
        cap.position.set(cx, cy, cz);
        cap.castShadow = true;
        cap.receiveShadow = true;
        group.add(cap);
      });

      return group;
    };

    // --- Cluster Setup ---
    const jackCount = 32;
    const jacks: {
      group: THREE.Group;
      basePos: THREE.Vector3;
      rotationSpeed: THREE.Vector3;
      velocity: THREE.Vector3;
      floatPhase: number;
      radius: number;
    }[] = [];

    const mainCluster = new THREE.Group();
    scene.add(mainCluster);

    for (let i = 0; i < jackCount; i++) {
      const jack = createJackGeometry();

      let x = (Math.random() - 0.5) * 28;
      const y = (Math.random() - 0.5) * 16;

      if (Math.abs(x) < 8 && Math.abs(y) < 4) {
        if (Math.random() > 0.3) {
          x += x >= 0 ? 5.5 : -5.5;
        }
      }

      const inFront = i % 3 === 0;
      const z = inFront
        ? 1.5 + Math.random() * 3.5
        : -1.5 - Math.random() * 4.5;

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
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        velocity: new THREE.Vector3(0, 0, 0),
        floatPhase: Math.random() * Math.PI * 2,
        radius: 1.8 * scale,
      });
    }

    // --- Mouse & Dragging Logic ---
    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    const dragPlane = new THREE.Plane();
    const planeIntersectPoint = new THREE.Vector3();
    const grabOffset = new THREE.Vector3();
    const lastMousePos = new THREE.Vector2();

    let isDragging = false;
    let draggedJack: (typeof jacks)[0] | null = null;

    const getNDCCoords = (e: MouseEvent) => {
      return new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };

    const handleMouseDown = (e: MouseEvent) => {
      const coords = getNDCCoords(e);
      raycaster.setFromCamera(coords, camera);
      const intersects = raycaster.intersectObjects(mainCluster.children, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj.parent !== mainCluster) {
          obj = obj.parent;
        }

        const foundJack = jacks.find((j) => j.group === obj);
        if (foundJack) {
          isDragging = true;
          draggedJack = foundJack;
          canvas.style.cursor = "grabbing";

          const hitPoint = intersects[0].point;
          dragPlane.setFromNormalAndCoplanarPoint(
            camera.getWorldDirection(new THREE.Vector3()).negate(),
            hitPoint
          );

          grabOffset.subVectors(foundJack.group.position, hitPoint);
          lastMousePos.set(e.clientX, e.clientY);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const coords = getNDCCoords(e);
      mouse.copy(coords);

      if (isDragging && draggedJack) {
        raycaster.setFromCamera(coords, camera);
        if (raycaster.ray.intersectPlane(dragPlane, planeIntersectPoint)) {
          const targetPos = planeIntersectPoint.clone().add(grabOffset);

          // Add spin while dragging based on mouse movement speed
          const dx = e.clientX - lastMousePos.x;
          const dy = e.clientY - lastMousePos.y;

          draggedJack.rotationSpeed.x = dy * 0.003 + (Math.random() - 0.5) * 0.01;
          draggedJack.rotationSpeed.y = dx * 0.003 + (Math.random() - 0.5) * 0.01;

          draggedJack.basePos.copy(targetPos);
          lastMousePos.set(e.clientX, e.clientY);
        }
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        isDragging = false;
        draggedJack = null;
        canvas.style.cursor = "grab";
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // --- Animation Loop with Drag Collision Knockback & Drag Spinning ---
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // --- 3D Collision & Repulsion Physics (including active Drag Ramming) ---
      for (let i = 0; i < jacks.length; i++) {
        for (let j = i + 1; j < jacks.length; j++) {
          const j1 = jacks[i];
          const j2 = jacks[j];

          const pos1 = j1.group.position;
          const pos2 = j2.group.position;

          const dist = pos1.distanceTo(pos2);
          const minDist = j1.radius + j2.radius;

          if (dist < minDist && dist > 0.001) {
            const overlap = minDist - dist;
            const diff = new THREE.Vector3().subVectors(pos1, pos2).normalize();

            // Dragged object rams into another object -> forcefully push the other object away!
            if (j1 === draggedJack) {
              j2.velocity.addScaledVector(diff, -overlap * 0.35);
              j2.basePos.addScaledVector(diff, -overlap * 0.25);
              j2.rotationSpeed.x += (Math.random() - 0.5) * 0.04;
              j2.rotationSpeed.y += (Math.random() - 0.5) * 0.04;
            } else if (j2 === draggedJack) {
              j1.velocity.addScaledVector(diff, overlap * 0.35);
              j1.basePos.addScaledVector(diff, overlap * 0.25);
              j1.rotationSpeed.x += (Math.random() - 0.5) * 0.04;
              j1.rotationSpeed.y += (Math.random() - 0.5) * 0.04;
            } else {
              // Standard block collision
              j1.velocity.addScaledVector(diff, overlap * 0.08);
              j2.velocity.addScaledVector(diff, -overlap * 0.08);
              j1.basePos.addScaledVector(diff, overlap * 0.04);
              j2.basePos.addScaledVector(diff, -overlap * 0.04);
            }
          }
        }
      }

      // --- Update position and active spin for ALL jacks (including dragged jack) ---
      jacks.forEach((j) => {
        const floatY = Math.sin(elapsedTime * 2.0 + j.floatPhase) * 0.45;
        const floatX = Math.cos(elapsedTime * 1.5 + j.floatPhase) * 0.35;

        // Keep active spin on ALL blocks (no more stuck feeling during drag!)
        j.group.rotation.x += j.rotationSpeed.x;
        j.group.rotation.y += j.rotationSpeed.y;
        j.group.rotation.z += j.rotationSpeed.z;

        // Velocity damping
        j.velocity.multiplyScalar(0.92);

        j.group.position.x = j.basePos.x + floatY * 0.2 + j.velocity.x;
        j.group.position.y = j.basePos.y + floatX * 0.2 + j.velocity.y;
        j.group.position.z = j.basePos.z + j.velocity.z;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();

      // Clean up WebGL assets to release memory from GPU
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      texturesToDispose.forEach((t) => t.dispose());
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={`relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0c0c0e] text-white transition-opacity duration-700 ${
        !isIntroDone ? "opacity-0 pointer-events-none" : "opacity-100"
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
