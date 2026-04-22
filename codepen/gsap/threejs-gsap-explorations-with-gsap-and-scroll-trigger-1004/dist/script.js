// Import libraries from CDN
import * as THREE from "https://esm.sh/three@0.136.0";
import { gsap } from "https://esm.sh/gsap@3.11.0";
import { ScrollTrigger } from "https://esm.sh/gsap@3.11.0/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = null; // Set to null for transparency

// Set up camera with centered position
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Set up renderer with transparency
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Transparent background
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Set canvas to appear above content
const canvas = renderer.domElement;
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.style.zIndex = "10"; // Higher than content
canvas.style.pointerEvents = "none"; // Allow clicking through

// Create an enhanced star texture for brighter, more distinct particles
function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  // Create more detailed radial gradient for star with brighter core
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)"); // Core
  gradient.addColorStop(0.1, "rgba(255, 255, 255, 0.95)"); // Near core - brighter
  gradient.addColorStop(0.3, "rgba(200, 200, 255, 0.7)"); // Middle - brighter
  gradient.addColorStop(0.6, "rgba(140, 140, 230, 0.4)"); // Outer middle - brighter
  gradient.addColorStop(1, "rgba(40, 40, 120, 0)"); // Edge

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  // Add stronger cross shape for enhanced sparkle effect
  ctx.globalCompositeOperation = "lighten";
  const linearGradient = ctx.createLinearGradient(32, 0, 32, 64);
  linearGradient.addColorStop(0, "rgba(100, 100, 230, 0)");
  linearGradient.addColorStop(0.5, "rgba(250, 250, 255, 0.7)"); // Brighter center
  linearGradient.addColorStop(1, "rgba(100, 100, 230, 0)");

  ctx.fillStyle = linearGradient;
  ctx.fillRect(28, 0, 8, 64);

  // Horizontal line - brighter
  const horizontalGradient = ctx.createLinearGradient(0, 32, 64, 32);
  horizontalGradient.addColorStop(0, "rgba(100, 100, 230, 0)");
  horizontalGradient.addColorStop(0.5, "rgba(250, 250, 255, 0.7)"); // Brighter center
  horizontalGradient.addColorStop(1, "rgba(100, 100, 230, 0)");

  ctx.fillStyle = horizontalGradient;
  ctx.fillRect(0, 28, 64, 8);

  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Create a group to hold the cube and its wireframe
const cubeGroup = new THREE.Group();
scene.add(cubeGroup);

// Create higher-resolution cube geometry
const geometry = new THREE.BoxGeometry(2, 2, 2, 4, 4, 4);

// Create custom vertex shader with enhanced position and normal data
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Create shader material with enhanced uniforms
const uniforms = {
  iTime: { value: 0 },
  iResolution: { value: new THREE.Vector2(512, 512) },
  scrollProgress: { value: 0.0 } // Track scroll progress
};

// Enhanced galaxy shader with nebula and color shifts
const fragmentShader = `
  uniform float iTime;
  uniform vec2 iResolution;
  uniform float scrollProgress;
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  
  void mainImage(out vec4 O, vec2 I) {
      vec2 r = iResolution.xy;
      vec2 z;
      vec2 i;
      vec2 f = I*(z+=4.-4.*abs(.7-dot(I=(I+I-r)/r.y, I)));
      
      // Add subtle movement to pattern
      float timeOffset = sin(iTime * 0.2) * 0.1;
      f.x += timeOffset;
      f.y -= timeOffset;
      
      // More iterations based on scroll progress for increasing detail
      float iterations = mix(8.0, 12.0, scrollProgress);
      
      for(O *= 0.; i.y++<iterations;
          O += (sin(f += cos(f.yx*i.y+i+iTime)/i.y+.7)+1.).xyyx
          * abs(f.x-f.y));
      
      O = tanh(7.*exp(z.x-4.-I.y*vec4(-1,1,2,0))/O);
      
      // Add pulsing effect
      float pulse = 1.0 + 0.2 * sin(iTime * 0.5);
      O.rgb *= pulse;
      
      // Add color shifting nebula effect
      float nebula = sin(I.x * 0.01 + iTime * 0.3) * sin(I.y * 0.01 - iTime * 0.2);
      nebula = abs(nebula) * 0.5;
      
      // Create shifting color palette that changes with scroll
      vec3 color1 = mix(vec3(0.1, 0.2, 0.8), vec3(0.8, 0.1, 0.5), scrollProgress); // Blue to purple
      vec3 color2 = mix(vec3(0.8, 0.2, 0.7), vec3(0.2, 0.8, 0.7), scrollProgress); // Purple to teal
      vec3 colorMix = mix(color1, color2, sin(iTime * 0.2) * 0.5 + 0.5);
      
      // Apply nebula color to darker areas
      O.rgb = mix(O.rgb, colorMix, nebula * (1.0 - length(O.rgb)));
  }
  
  void main() {
      // Map the position on the cube face to shader coordinates
      vec2 cubeUV = vUv * iResolution;
      
      vec4 fragColor;
      mainImage(fragColor, cubeUV);
      
      // Add depth effect based on normals and position
      float depthFactor = abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fragColor.rgb *= 0.7 + 0.3 * depthFactor;
      
      // Add edge glow - intensity increases with scroll
      float edge = 1.0 - max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)) * 2.0;
      edge = pow(edge, 4.0);
      fragColor.rgb += edge * vec3(0.1, 0.2, 0.8) * (0.6 + scrollProgress * 0.4);
      
      // Boost brightness
      fragColor.rgb *= 2.0;
      
      gl_FragColor = fragColor;
  }
`;

// Create material with optimized settings for visibility
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: uniforms,
  transparent: true,
  opacity: 1.0,
  side: THREE.DoubleSide
});

// Create cube mesh
const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true;
cube.receiveShadow = true;
cubeGroup.add(cube);

// Create wireframe for edges
const wireframe = new THREE.LineSegments(
  new THREE.EdgesGeometry(geometry, 10), // Lower threshold for more visible edges
  new THREE.LineBasicMaterial({
    color: 0x4488ff,
    linewidth: 1.5,
    transparent: true,
    opacity: 0.1
  })
);
wireframe.scale.setScalar(1.001); // Slightly larger to prevent z-fighting
cubeGroup.add(wireframe);

// Helper function for smooth interpolation
function lerp(start, end, amt) {
  return start * (1 - amt) + end * amt;
}

// Enhanced particle system with zoom effect
function createEnhancedParticles() {
  const particleSettings = {
    PARTICLE_COUNT: 2000, // More individual particles instead of connections
    PARTICLE_MOUSE_INFLUENCE: 0.0001, // Subtle mouse effect
    PARTICLE_REPULSION_RADIUS: 0.8,
    PARTICLE_REPULSION_STRENGTH: 0.00008,
    PARTICLE_CONNECTION_DISTANCE: 0.5, // Much smaller connection distance
    PARTICLE_DEPTH_RANGE: 12 // How far particles extend in Z-direction
  };

  const particles = new THREE.BufferGeometry();
  const particleCount = particleSettings.PARTICLE_COUNT;
  const positions = new Float32Array(particleCount * 3);
  const originalPositions = new Float32Array(particleCount * 3); // Store original positions
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);
  const depths = new Float32Array(particleCount); // Store depth for zoom effect

  // Distribute particles in 3D volume with more depth variation
  for (let i = 0; i < particleCount; i++) {
    // Use spherical distribution for wider spread
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    // Create deeper z-range for zoom effect
    const radius = 3 + Math.random() * 3; // Base radius 3-6
    const depthExtension =
      Math.random() * particleSettings.PARTICLE_DEPTH_RANGE -
      particleSettings.PARTICLE_DEPTH_RANGE / 2;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi) + depthExtension;

    // Store original positions for resetting
    originalPositions[i * 3] = positions[i * 3];
    originalPositions[i * 3 + 1] = positions[i * 3 + 1];
    originalPositions[i * 3 + 2] = positions[i * 3 + 2];

    // Store original depth for zoom calculation
    depths[i] = positions[i * 3 + 2];

    // Gentler velocities
    velocities[i * 3] = (Math.random() - 0.5) * 0.0004;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.0004;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.0002; // Less z movement

    // Size based on depth - farther particles are smaller
    const z = positions[i * 3 + 2];
    const normalizedDepth =
      (z + particleSettings.PARTICLE_DEPTH_RANGE / 2) /
      particleSettings.PARTICLE_DEPTH_RANGE;
    sizes[i] = 0.008 + 0.03 * (1 - normalizedDepth); // Closer particles are larger

    // Color based on depth - create depth perception
    const brightness = 0.5 + 0.5 * (1 - normalizedDepth); // Brighter in front
    colors[i * 3] = 0.4 + 0.3 * brightness; // R
    colors[i * 3 + 1] = 0.4 + 0.3 * brightness; // G
    colors[i * 3 + 2] = 0.7 + 0.3 * brightness; // B - bluer in front
  }

  particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particles.setAttribute(
    "originalPosition",
    new THREE.BufferAttribute(originalPositions, 3)
  );
  particles.setAttribute("velocity", new THREE.BufferAttribute(velocities, 3));
  particles.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  particles.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  particles.setAttribute("depth", new THREE.BufferAttribute(depths, 1));

  const particleTexture = createStarTexture();

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.03, // Slightly larger individual particles
    map: particleTexture,
    transparent: true,
    vertexColors: true,
    opacity: 0.9, // More visible individual particles
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true // Important for size to change with distance
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  // Create very subtle constellation lines
  const constellationMaterial = new THREE.LineBasicMaterial({
    color: 0x3366ff,
    transparent: true,
    opacity: 0.08, // Lower opacity for subtler effect
    blending: THREE.AdditiveBlending
  });

  const constellationGeometry = new THREE.BufferGeometry();
  const constellationSystem = new THREE.LineSegments(
    constellationGeometry,
    constellationMaterial
  );
  scene.add(constellationSystem);

  return {
    particleSystem,
    constellationSystem,
    settings: particleSettings
  };
}

// Create enhanced particles
const enhancedParticles = createEnhancedParticles();

// Update particle zoom based on scroll
function updateParticleZoom(scrollProgress) {
  if (!enhancedParticles || !enhancedParticles.particleSystem) return;

  const particleSystem = enhancedParticles.particleSystem;
  const positions = particleSystem.geometry.attributes.position.array;
  const originalPositions =
    particleSystem.geometry.attributes.originalPosition.array;
  const sizes = particleSystem.geometry.attributes.size.array;
  const colors = particleSystem.geometry.attributes.color.array;
  const particleCount = positions.length / 3;

  // Create bell curve for zoom effect - matches cube zoom curve
  let zoomCurve;
  if (scrollProgress < 0.5) {
    // First half - zoom in (0 to 1)
    zoomCurve = gsap.utils.clamp(0, 1, scrollProgress * 2);
  } else {
    // Second half - zoom out (1 to 0)
    zoomCurve = gsap.utils.clamp(0, 1, 2 - scrollProgress * 2);
  }

  // Apply easing to make the zoom feel more natural
  zoomCurve = gsap.parseEase("power2.inOut")(zoomCurve);

  // Enhanced particle zoom effect that matches cube zoom
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // Zoom effect - particles move outward during extreme zoom to create "flying through space" effect
    const zPosition = originalPositions[i3 + 2];
    const radialPosition = Math.sqrt(
      originalPositions[i3] * originalPositions[i3] +
        originalPositions[i3 + 1] * originalPositions[i3 + 1]
    );

    // Push particles outward during zoom
    const pushFactor = 1 + zoomCurve * 1.5; // Max 2.5x distance at peak zoom
    positions[i3] = originalPositions[i3] * pushFactor;
    positions[i3 + 1] = originalPositions[i3 + 1] * pushFactor;

    // Z-position is special - particles move toward camera during zoom
    let targetZ = zPosition;
    if (Math.abs(zPosition) > 1) {
      // Distant particles move toward camera
      targetZ = zPosition * (1 - zoomCurve * 0.5);
    } else {
      // Close particles move past camera
      targetZ = zPosition - zoomCurve * Math.sign(zPosition) * 2;
    }

    // Apply smooth transition
    positions[i3 + 2] = lerp(positions[i3 + 2], targetZ, 0.1);

    // Size increases dramatically during zoom
    const distFromCamera = Math.abs(positions[i3 + 2]);
    const closenessFactor = Math.max(0, 1 - distFromCamera / 5);
    const sizeBoost = 1 + zoomCurve * 4.0; // Much larger at max zoom
    sizes[i] = (0.008 + 0.03 * closenessFactor) * sizeBoost;

    // Brighten particles during zoom
    const brightnessBoost = zoomCurve * 0.3; // Additional brightness at max zoom
    const baseBrightness = 0.5 + closenessFactor * 0.5;
    const brightness = baseBrightness + brightnessBoost;

    colors[i3] = 0.4 + 0.3 * brightness; // R
    colors[i3 + 1] = 0.4 + 0.3 * brightness; // G
    colors[i3 + 2] = 0.7 + 0.3 * brightness; // B
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
  particleSystem.geometry.attributes.size.needsUpdate = true;
  particleSystem.geometry.attributes.color.needsUpdate = true;
}

// Add special particle effects based on interactions
function createParticleEffects() {
  const effects = {
    // Create burst of particles from the cube
    emitFromCube: function (count = 15) {
      if (!enhancedParticles || !enhancedParticles.particleSystem) return;

      const particleSystem = enhancedParticles.particleSystem;
      const positions = particleSystem.geometry.attributes.position.array;
      const velocities = particleSystem.geometry.attributes.velocity.array;
      const sizes = particleSystem.geometry.attributes.size.array;
      const colors = particleSystem.geometry.attributes.color.array;
      const particleCount = positions.length / 3;

      // Get random vertices from cube
      const cubeVertices = [];
      const positionAttr = cube.geometry.attributes.position;

      for (let i = 0; i < positionAttr.count; i++) {
        cubeVertices.push(
          new THREE.Vector3(
            positionAttr.getX(i),
            positionAttr.getY(i),
            positionAttr.getZ(i)
          )
        );
      }

      // Emit particles from random vertices
      for (let i = 0; i < count; i++) {
        // Select random particles to repurpose
        const particleIndex = Math.floor(Math.random() * particleCount);
        const i3 = particleIndex * 3;

        // Get random vertex
        const vertexIndex = Math.floor(Math.random() * cubeVertices.length);
        const vertex = cubeVertices[vertexIndex].clone();

        // Apply cube's transformation
        vertex.applyMatrix4(cube.matrixWorld);

        // Position particle at vertex
        positions[i3] = vertex.x;
        positions[i3 + 1] = vertex.y;
        positions[i3 + 2] = vertex.z;

        // Set outward velocity
        const speed = 0.02 + Math.random() * 0.04;
        velocities[i3] = (Math.random() - 0.5) * speed;
        velocities[i3 + 1] = (Math.random() - 0.5) * speed;
        velocities[i3 + 2] = (Math.random() - 0.5) * speed;

        // Increase size for visibility
        sizes[particleIndex] = 0.03 + Math.random() * 0.03;

        // Brighten color
        colors[i3] = 0.8 + Math.random() * 0.2; // R
        colors[i3 + 1] = 0.8 + Math.random() * 0.2; // G
        colors[i3 + 2] = 1.0; // B
      }

      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.velocity.needsUpdate = true;
      particleSystem.geometry.attributes.size.needsUpdate = true;
      particleSystem.geometry.attributes.color.needsUpdate = true;
    },

    // Create whirlpool effect around cube
    createWhirlpool: function (duration = 2.0) {
      if (!enhancedParticles || !enhancedParticles.particleSystem) return;

      const particleSystem = enhancedParticles.particleSystem;
      const positions = particleSystem.geometry.attributes.position.array;
      const velocities = particleSystem.geometry.attributes.velocity.array;
      const particleCount = positions.length / 3;

      // Store original state
      const originalVelocities = new Float32Array(velocities);

      // Start animation
      let startTime = performance.now();

      function animateWhirlpool() {
        const elapsed = (performance.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1.0);

        if (progress < 1.0) {
          // Continue animation
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Get vector from cube to particle
            const dx = positions[i3] - cubeGroup.position.x;
            const dy = positions[i3 + 1] - cubeGroup.position.y;
            const dz = positions[i3 + 2] - cubeGroup.position.z;

            // Distance from cube
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (distance < 8) {
              // Create whirlpool effect - spiral around cube
              const strength = (1 - Math.min(distance / 8, 1)) * 0.001;
              const angle = Math.atan2(dy, dx) + 0.05; // Small increment for spiral

              // Apply spiral force
              const fx = -dy * strength;
              const fy = dx * strength;
              const fz = -0.0002 * distance; // Pull slightly toward cube

              velocities[i3] = originalVelocities[i3] + fx;
              velocities[i3 + 1] = originalVelocities[i3 + 1] + fy;
              velocities[i3 + 2] = originalVelocities[i3 + 2] + fz;
            }
          }

          particleSystem.geometry.attributes.velocity.needsUpdate = true;
          requestAnimationFrame(animateWhirlpool);
        } else {
          // Reset velocities to original
          for (let i = 0; i < velocities.length; i++) {
            velocities[i] = originalVelocities[i];
          }
          particleSystem.geometry.attributes.velocity.needsUpdate = true;
        }
      }

      animateWhirlpool();
    },

    // Pulse wave emanating from cube
    emitPulseWave: function () {
      if (!enhancedParticles || !enhancedParticles.particleSystem) return;

      const particleSystem = enhancedParticles.particleSystem;
      const positions = particleSystem.geometry.attributes.position.array;
      const sizes = particleSystem.geometry.attributes.size.array;
      const colors = particleSystem.geometry.attributes.color.array;
      const particleCount = positions.length / 3;

      // Store original sizes
      const originalSizes = new Float32Array(sizes);
      const originalColors = new Float32Array(colors);

      // Wave parameters
      const waveSpeed = 3; // Units per second
      const waveDuration = 2.5; // Seconds
      const waveWidth = 1.0; // Width of the wave pulse

      // Animation
      let startTime = performance.now();

      function animatePulseWave() {
        const elapsed = (performance.now() - startTime) / 1000;
        const waveDistance = elapsed * waveSpeed;

        if (elapsed < waveDuration) {
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;

            // Distance from cube center
            const dx = positions[i3] - cubeGroup.position.x;
            const dy = positions[i3 + 1] - cubeGroup.position.y;
            const dz = positions[i3 + 2] - cubeGroup.position.z;
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

            // Check if particle is in the wave front
            const distFromWave = Math.abs(distance - waveDistance);

            if (distFromWave < waveWidth) {
              // Calculate wave intensity (strongest at center of wave)
              const waveIntensity = 1 - distFromWave / waveWidth;

              // Increase size at wave front
              sizes[i] = originalSizes[i] * (1 + waveIntensity * 2);

              // Change color at wave front - blue/purple glow
              colors[i3] = originalColors[i3] + waveIntensity * 0.4; // R
              colors[i3 + 1] = originalColors[i3 + 1] + waveIntensity * 0.2; // G
              colors[i3 + 2] = originalColors[i3 + 2] + waveIntensity * 0.7; // B
            } else {
              // Reset to original properties
              sizes[i] = originalSizes[i];
              colors[i3] = originalColors[i3];
              colors[i3 + 1] = originalColors[i3 + 1];
              colors[i3 + 2] = originalColors[i3 + 2];
            }
          }

          particleSystem.geometry.attributes.size.needsUpdate = true;
          particleSystem.geometry.attributes.color.needsUpdate = true;
          requestAnimationFrame(animatePulseWave);
        } else {
          // Reset to original values
          for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            sizes[i] = originalSizes[i];
            colors[i3] = originalColors[i3];
            colors[i3 + 1] = originalColors[i3 + 1];
            colors[i3 + 2] = originalColors[i3 + 2];
          }

          particleSystem.geometry.attributes.size.needsUpdate = true;
          particleSystem.geometry.attributes.color.needsUpdate = true;
        }
      }

      animatePulseWave();
    }
  };

  return effects;
}

// Initialize particle effects
const particleEffects = createParticleEffects();

// Add lighting for better 3D perception
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7);
directionalLight.castShadow = true;
scene.add(directionalLight);

const pointLight = new THREE.PointLight(0x3366ff, 1.5, 20);
pointLight.position.set(-3, 2, 5);
scene.add(pointLight);

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Set up mouse interaction with improved stability
const mouse = new THREE.Vector2(0, 0);

window.addEventListener("mousemove", (event) => {
  // Update mouse position for cube rotation
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Only apply mouse rotation when not scrolling
  if (!ScrollTrigger.isScrolling()) {
    gsap.to(cubeGroup.rotation, {
      x: "+=" + (mouse.y * 0.03 - cubeGroup.rotation.x * 0.02),
      y: "+=" + (mouse.x * 0.03 - cubeGroup.rotation.y * 0.02),
      duration: 1,
      ease: "power2.out",
      overwrite: "auto"
    });
  }
});

// Update click handler to include particle effects
document.addEventListener("click", () => {
  // Random animation on click
  gsap.to(cubeGroup.rotation, {
    x: cubeGroup.rotation.x + Math.PI * 0.25 * (Math.random() - 0.5),
    y: cubeGroup.rotation.y + Math.PI * 0.25 * (Math.random() - 0.5),
    z: cubeGroup.rotation.z + Math.PI * 0.25 * (Math.random() - 0.5),
    duration: 1,
    ease: "back.out(1.5)"
  });

  // Choose a random effect
  const effectChoice = Math.floor(Math.random() * 3);
  switch (effectChoice) {
    case 0:
      particleEffects.emitFromCube();
      break;
    case 1:
      particleEffects.createWhirlpool();
      break;
    case 2:
      particleEffects.emitPulseWave();
      break;
  }
});

// Text animation function
function animateTextElements() {
  // Get all section titles and descriptions
  const titles = document.querySelectorAll(".title");
  const descriptions = document.querySelectorAll(".description");

  // Create a timeline for each section
  document.querySelectorAll(".section").forEach((section, index) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
        toggleActions: "play none none reverse"
      }
    });

    tl.to(
      titles[index],
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out"
      },
      0
    );

    tl.to(
      descriptions[index],
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2
      },
      0
    );

    // Add parallax effect
    tl.to(
      cubeGroup.position,
      {
        z: -1 * index, // Move cube deeper with each section
        duration: 1
      },
      0
    );
  });
}

// Create enhanced rotation timeline with extreme zoom effect
const scrollTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".content",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.5,
    markers: false,
    onUpdate: (self) => {
      // Update scroll progress uniform in shader
      uniforms.scrollProgress.value = self.progress;

      // Create bell curve for zoom effect - max zoom at middle of scroll
      let zoomCurve;
      if (self.progress < 0.5) {
        // First half - zoom in (0 to 1)
        zoomCurve = gsap.utils.clamp(0, 1, self.progress * 2);
      } else {
        // Second half - zoom out (1 to 0)
        zoomCurve = gsap.utils.clamp(0, 1, 2 - self.progress * 2);
      }

      // Apply easing to make the zoom feel more natural
      zoomCurve = gsap.parseEase("power2.inOut")(zoomCurve);

      // Update FOV based on zoom curve - dramatic narrow FOV at max zoom
      const minFOV = 20; // Very narrow FOV at max zoom
      const maxFOV = 60; // Normal FOV at start/end
      camera.fov = maxFOV - (maxFOV - minFOV) * zoomCurve;
      camera.updateProjectionMatrix();

      // Update cube scale - make it slightly larger at max zoom
      const maxScale = 1.2;
      cubeGroup.scale.setScalar(1 + (maxScale - 1) * zoomCurve);
    }
  }
});

// Extreme zoom effect as we scroll
scrollTimeline
  .to(cubeGroup.rotation, {
    x: Math.PI * 1.2,
    y: Math.PI * 2,
    z: Math.PI * 0.3,
    ease: "power2.inOut",
    immediateRender: false
  })
  .to(
    camera.position,
    {
      z: 0.8, // Extreme zoom - gets very close to the cube
      y: 0.2,
      x: 0,
      ease: "power2.inOut"
    },
    0.5 // Place this at the middle of the timeline
  )
  .to(
    camera.position,
    {
      z: 4.0, // Zoom back out
      y: 0,
      x: 0,
      ease: "power2.inOut"
    },
    1.0 // Place this at the end of the timeline
  )
  .to(
    {},
    {
      duration: 1,
      onUpdate: function () {
        camera.lookAt(cubeGroup.position);
      }
    },
    0
  );

// Add ambient light adjustment based on scroll
scrollTimeline.to(
  ambientLight,
  {
    intensity: 1.2, // Increase ambient light as we scroll
    ease: "power1.inOut"
  },
  0
);

// Animation loop with enhanced zoom effect and constellations
function animate(timestamp) {
  requestAnimationFrame(animate);

  const timeSeconds = timestamp * 0.001;

  // Update time uniform for galaxy shader
  uniforms.iTime.value = timeSeconds;

  // Add subtle continuous rotation to cube when not scrolling
  if (!ScrollTrigger.isScrolling()) {
    cubeGroup.rotation.x += 0.0005;
    cubeGroup.rotation.y += 0.0008;
  }

  // Update particle animation with zoom effect
  if (enhancedParticles && enhancedParticles.particleSystem) {
    const particleSystem = enhancedParticles.particleSystem;
    const constellationSystem = enhancedParticles.constellationSystem;
    const settings = enhancedParticles.settings;

    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;
    const colors = particleSystem.geometry.attributes.color.array;
    const particleCount = positions.length / 3;

    // Get current scroll progress for zoom effect
    const scrollProgress = uniforms.scrollProgress.value;

    // Update particle zoom based on scroll
    updateParticleZoom(scrollProgress);

    // Create arrays for constellation lines
    const connectedPoints = [];

    // Pulse factor
    const pulseFactor = 1.0 + 0.1 * Math.sin(timeSeconds * 0.5);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Apply gentle movement
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      // Apply subtle mouse influence
      positions[i3] +=
        (mouse.x * 3 - positions[i3]) * settings.PARTICLE_MOUSE_INFLUENCE;
      positions[i3 + 1] +=
        (mouse.y * 3 - positions[i3 + 1]) * settings.PARTICLE_MOUSE_INFLUENCE;

      // Get distance from center for boundary check
      const distFromCenter = Math.sqrt(
        positions[i3] * positions[i3] +
          positions[i3 + 1] * positions[i3 + 1] +
          positions[i3 + 2] * positions[i3 + 2]
      );

      // Reset particles if they go too far
      if (distFromCenter > 10) {
        // Create new position on sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const radius = 5 + Math.random() * 2;

        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi) * (1 - scrollProgress * 0.3); // Closer at higher scroll

        // Reset velocity
        velocities[i3] = (Math.random() - 0.5) * 0.0004;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.0004;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.0002;
      }

      // Create minimal constellation connections - only very close particles
      if (i % 50 === 0 && scrollProgress > 0.6) {
        // Much fewer connections, only at deep scroll
        // Connect only to very close particles
        for (let j = i + 1; j < Math.min(i + 100, particleCount); j += 10) {
          const j3 = j * 3;
          const dx = positions[i3] - positions[j3];
          const dy = positions[i3 + 1] - positions[j3 + 1];
          const dz = positions[i3 + 2] - positions[j3 + 2];
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Significantly smaller connection distance
          const connectionThreshold = 0.5;

          if (distance < connectionThreshold) {
            // Only connect particles that are in front of camera
            if (positions[i3 + 2] < 3 && positions[j3 + 2] < 3) {
              connectedPoints.push(
                positions[i3],
                positions[i3 + 1],
                positions[i3 + 2],
                positions[j3],
                positions[j3 + 1],
                positions[j3 + 2]
              );
            }
          }
        }
      }
    }

    // Update constellation lines
    const constellationGeometry = constellationSystem.geometry;
    constellationGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(connectedPoints, 3)
    );
    constellationGeometry.attributes.position.needsUpdate = true;

    // Very subtle constellation effect that only appears when deeply scrolled
    constellationSystem.material.opacity =
      Math.max(0, scrollProgress - 0.6) * 0.15;

    particleSystem.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

// Initialize text animations when page loads
window.addEventListener("DOMContentLoaded", () => {
  animateTextElements();
});

// Start animation loop
animate(0);