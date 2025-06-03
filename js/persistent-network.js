// js/persistent-network.js
function initPersistentNetwork() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded, skipping persistent network animation.');
        return;
    }

    const canvas = document.getElementById('persistent-network-canvas');
    if (!canvas) {
        console.error('Persistent network canvas not found.');
        return;
    }

    let scene, camera, renderer, particles, lines;
    let particleSystem, lineSystem;
    let particleCount = 300; // Adjusted for performance
    const maxConnections = 2; // Max connections per particle
    const maxConnectionDistance = 150; // Max distance for a connection
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3); // Not used yet, but for future
    const particleSpeeds = [];

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 600; // Start further back

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        stencil: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const pMaterial = new THREE.PointsMaterial({
        color: 0xaaaaaa, // Light gray
        size: 2,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending, // Softer look
        depthWrite: false
    });

    const particleGeometry = new THREE.BufferGeometry();
    const particleSpread = 1000; // How far particles spread initially

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        particlePositions[i3] = (Math.random() - 0.5) * particleSpread * 2;
        particlePositions[i3 + 1] = (Math.random() - 0.5) * particleSpread * 1.5; // Slightly less Y spread
        particlePositions[i3 + 2] = (Math.random() - 0.5) * particleSpread;

        particleSpeeds.push({
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1,
            z: (Math.random() - 0.5) * 0.1
        });
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleSystem = new THREE.Points(particleGeometry, pMaterial);
    scene.add(particleSystem);

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x555555, // Darker gray for lines
        transparent: true,
        opacity: 0.05, // Start very subtle
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = []; // Store as pairs of (x1,y1,z1, x2,y2,z2)

    // Simplified initial line creation: connect some random pairs within distance
    let connectionCount = 0;
    const attemptedConnections = particleCount * maxConnections; // Try to make this many connections

    for(let i=0; i < attemptedConnections; i++) {
        const p1_idx = Math.floor(Math.random() * particleCount);
        const p2_idx = Math.floor(Math.random() * particleCount);
        if (p1_idx === p2_idx) continue;

        const dx = particlePositions[p1_idx*3] - particlePositions[p2_idx*3];
        const dy = particlePositions[p1_idx*3+1] - particlePositions[p2_idx*3+1];
        const dz = particlePositions[p1_idx*3+2] - particlePositions[p2_idx*3+2];
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        if (dist < maxConnectionDistance && dist > 0) { // Ensure not connecting to self or too far
            linePositions.push(particlePositions[p1_idx*3], particlePositions[p1_idx*3+1], particlePositions[p1_idx*3+2]);
            linePositions.push(particlePositions[p2_idx*3], particlePositions[p2_idx*3+1], particlePositions[p2_idx*3+2]);
            connectionCount++;
        }
        if(connectionCount > particleCount * 1.5) break; // Limit total lines to avoid too much density
    }

    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    lineSystem = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSystem);


    // Animation Loop
    let lastScrollY = window.scrollY;
    let targetRotationX = 0;
    let targetRotationY = 0;

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.00005; // Slower overall animation speed

        // Particle movement
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] += particleSpeeds[i].x;
            positions[i3 + 1] += particleSpeeds[i].y;
            positions[i3 + 2] += particleSpeeds[i].z;

            // Boundary check (wrap around) - simple version
            if (positions[i3] > particleSpread || positions[i3] < -particleSpread) particleSpeeds[i].x *= -1;
            if (positions[i3+1] > particleSpread*0.75 || positions[i3+1] < -particleSpread*0.75) particleSpeeds[i].y *= -1;
            if (positions[i3+2] > particleSpread*0.5 || positions[i3+2] < -particleSpread*0.5) particleSpeeds[i].z *= -1;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Line update - for this simplified version, lines are static relative to particles they connect
        // So, we don't need to update lineGeometry positions every frame *if* particles don't change indices
        // However, since particles ARE moving, the lines should ideally update.
        // For performance, this example does NOT update line endpoints per frame.
        // A more advanced version would update lineGeometry or use a shader.

        // Subtle rotation of the whole system
        scene.rotation.y = time * 0.2;
        scene.rotation.x = time * 0.1;

        // Scroll interaction - subtle
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        lastScrollY = currentScrollY;

        // Map scroll to subtle changes
        targetRotationX += scrollDelta * 0.0001;
        targetRotationY += scrollDelta * 0.00005;
        scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05; // Smoothly interpolate
        scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;

        const scrollFactor = Math.min(1, currentScrollY / (document.body.scrollHeight - window.innerHeight + 0.001)); // Normalize scroll 0-1
        lineMaterial.opacity = Math.max(0.02, 0.05 + scrollFactor * 0.08); // Increase opacity on scroll, min 0.02
        pMaterial.opacity = Math.max(0.1, 0.2 + scrollFactor * 0.2);

        // Pulse line opacity very subtly
        lineMaterial.opacity = Math.max(0.02, lineMaterial.opacity * (0.95 + Math.sin(Date.now()*0.001) * 0.05));


        renderer.render(scene, camera);
    }

    // Window Resize Handler
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onWindowResize, false);

    // Initial call
    if (renderer) { // Ensure renderer was initialized
         animate();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPersistentNetwork);
} else {
    initPersistentNetwork();
}
