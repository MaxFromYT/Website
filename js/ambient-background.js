// Three.js Ambient Background Animation (Subtle Grid/Plexus)
function initAmbientBackground() {
    const canvas = document.getElementById('ambient-bg-canvas');
    if (!canvas) { return; }

    let scene, camera, renderer, gridLines, dust; // Added dust here
    let viewWidth = window.innerWidth;
    let viewHeight = window.innerHeight;

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, viewWidth / viewHeight, 1, 3000);
    camera.position.z = 500;

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        stencil: false
    });
    renderer.setSize(viewWidth, viewHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Subtle Animated Grid
    const gridSize = 1000;
    const gridDivisions = 30;
    const gridLineColor = new THREE.Color(0x3a3a3e); // Slightly darker and less blue

    const gridMaterial = new THREE.LineBasicMaterial({
        color: gridLineColor,
        transparent: true,
        opacity: 0.15 // Initial opacity, will be animated
    });

    const gridPoints = [];
    const gridStep = gridSize / gridDivisions;

    for (let i = -gridSize / 2; i <= gridSize / 2; i += gridStep) {
        gridPoints.push(new THREE.Vector3(-gridSize / 2, 0, i));
        gridPoints.push(new THREE.Vector3(gridSize / 2, 0, i));
        gridPoints.push(new THREE.Vector3(i, 0, -gridSize / 2));
        gridPoints.push(new THREE.Vector3(i, 0, gridSize / 2));
    }

    const gridGeometry = new THREE.BufferGeometry().setFromPoints(gridPoints);
    gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    gridLines.rotation.x = Math.PI / 2.5;
    scene.add(gridLines);

    // Dust Particles
    const dustParticleCount = 300;
    const dustOriginalY = new Float32Array(dustParticleCount);
    const dustGeometry = new THREE.BufferGeometry();
    const dustVertices = [];

    for (let i = 0; i < dustParticleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 1000 - 500;
        dustVertices.push(x, y, z);
        dustOriginalY[i] = y; // Store initial Y
    }
    dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));

    // Attempt to add per-particle opacity attribute
    const initialOpacities = new Float32Array(dustParticleCount);
    for(let i=0; i<dustParticleCount; i++) initialOpacities[i] = 0.1 + Math.random() * 0.2;
    dustGeometry.setAttribute('opacity', new THREE.BufferAttribute(initialOpacities, 1));

    const dustMaterial = new THREE.PointsMaterial({
        color: 0x555555, // Slightly lighter dust
        size: 1,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    dustGeometry.deleteAttribute('opacity'); // Ensure if it was added before

    dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);

    // Secondary Particle Layer (dust2)
    let dust2;
    const dustParticleCount2 = 150;
    const dustOriginalY2 = new Float32Array(dustParticleCount2);
    const dustGeometry2 = new THREE.BufferGeometry();
    const dustVertices2 = [];
    for (let i = 0; i < dustParticleCount2; i++) {
        const x = Math.random() * 1500 - 750; // More spread out
        const y = Math.random() * 1500 - 750;
        const z = Math.random() * 800 - 400;
        dustVertices2.push(x, y, z);
        dustOriginalY2[i] = y;
    }
    dustGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices2, 3));
    const dustMaterial2 = new THREE.PointsMaterial({
        color: 0x007aff, // Apple Blue particles
        size: 1.5,       // Slightly larger
        transparent: true,
        opacity: 0.0,    // Start transparent, fade in
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    dust2 = new THREE.Points(dustGeometry2, dustMaterial2);
    scene.add(dust2);


    // Resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const currentTime = Date.now(); // Cache Date.now()
        const time = currentTime * 0.0001;
        const fastTime = currentTime * 0.0005; // For things needing faster changes


        // Generative Grid Behavior
        if (gridLines) {
            gridLines.rotation.y = time * 0.1;
            // gridLines.material.opacity = 0.06 + Math.sin(fastTime * 0.5) * 0.04; // More subtle // Old
            const gridPulse = (Math.sin(currentTime * 0.002) + 1) / 2; // 0 to 1 over time, use currentTime
            gridLines.material.opacity = 0.03 + gridPulse * 0.07; // Base opacity 0.03, pulse up to 0.1
        }

        // Enhanced Generative Dust Particle Behavior
        if (dust) {
            dust.rotation.y = time * 0.05;
            dust.material.opacity = Math.max(0.03, (Math.sin(fastTime * 0.7) + 1) / 2 * 0.15); // More subtle dust


            const positions = dust.geometry.attributes.position.array;
            for (let i = 0; i < dustParticleCount; i++) {
                 positions[i * 3] += (Math.random() - 0.5) * 0.5;
                 positions[i * 3 + 1] = dustOriginalY[i] + Math.sin(fastTime * 0.3 + i * 0.8) * 30 + (Math.random() - 0.5) * 5;
                 positions[i * 3 + 2] += (Math.random() - 0.5) * 0.5;

                if (positions[i * 3] > 1000) positions[i * 3] = -1000;
                if (positions[i * 3] < -1000) positions[i * 3] = 1000;
                // Y wrapping can be adjusted based on desired effect - let it flow more freely for now
                if (positions[i * 3 + 1] > 1000) positions[i * 3 + 1] = dustOriginalY[i] - (1000 - dustOriginalY[i]); // Attempt to re-enter from other side relative to original Y
                if (positions[i * 3 + 1] < -1000) positions[i * 3 + 1] = dustOriginalY[i] + (1000 + dustOriginalY[i]);

                if (positions[i * 3 + 2] > 500) positions[i * 3 + 2] = -500;
                if (positions[i * 3 + 2] < -500) positions[i * 3 + 2] = 500;
            }
            dust.geometry.attributes.position.needsUpdate = true;
        }

        if (dust2) {
            dust2.rotation.y = time * 0.03; // Slower rotation
            dust2.material.opacity = Math.max(0, (Math.sin(fastTime * 0.4 + 0.5) + 1) / 2 * 0.3); // Slower, distinct pulse for opacity

            const positions2 = dust2.geometry.attributes.position.array;
            for (let i = 0; i < dustParticleCount2; i++) {
                 positions2[i * 3] += (Math.random() - 0.5) * 0.3; // Slower drift
                 positions2[i * 3 + 1] = dustOriginalY2[i] + Math.sin(fastTime * 0.2 + i * 0.9) * 20 + (Math.random() - 0.5) * 3;
                 positions2[i * 3 + 2] += (Math.random() - 0.5) * 0.3;
                // Basic wrapping logic (can be improved)
                if (positions2[i * 3] > 750) positions2[i * 3] = -750; if (positions2[i * 3] < -750) positions2[i * 3] = 750;
                if (positions2[i * 3 + 1] > 750) positions2[i * 3 + 1] = dustOriginalY2[i] - (750 - dustOriginalY2[i]);
                if (positions2[i * 3 + 1] < -750) positions2[i * 3 + 1] = dustOriginalY2[i] + (750 + dustOriginalY2[i]);
                if (positions2[i * 3 + 2] > 400) positions2[i * 3 + 2] = -400; if (positions2[i * 3 + 2] < -400) positions2[i * 3 + 2] = 400;
            }
            dust2.geometry.attributes.position.needsUpdate = true;
        }


        renderer.render(scene, camera);
    }

    function onWindowResize() {
        viewWidth = window.innerWidth;
        viewHeight = window.innerHeight;
        camera.aspect = viewWidth / viewHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewWidth, viewHeight);
    }

    animate();
    onWindowResize();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAmbientBackground);
} else {
    initAmbientBackground();
}
