// Three.js Hero Particle Animation
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        console.error('Hero canvas not found');
        return;
    }

    let scene, camera, renderer, particles, material;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2; // Initialize with window size
    let windowHalfY = window.innerHeight / 2; // Initialize with window size

    // Attempt to get hero section dimensions for more accurate initial setup
    const heroSection = document.getElementById('home');
    const initialWidth = heroSection ? heroSection.offsetWidth : window.innerWidth;
    const initialHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    windowHalfX = initialWidth / 2; // Update based on hero section if available
    windowHalfY = initialHeight / 2;


    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, initialWidth / initialHeight, 1, 3000); // Adjusted far plane
    camera.position.z = 1000; // Move camera further out to see more particles

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI screens

    // Particles
    const particleCount = 5000; // Number of particles
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3); // For individual particle colors if needed

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        // Position (randomly in a sphere)
        const x = Math.random() * 2000 - 1000; // Spread them out more
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Color (shades of grey/white, with a hint of Apple blue)
        const randomValue = Math.random();
        if (randomValue < 0.05) { // 5% chance of blue
            color.setHSL(0.6, 0.7, Math.random() * 0.5 + 0.5); // Apple-like Blue
        } else {
            const intensity = Math.random() * 0.5 + 0.5; // Mostly lighter greys/whites
            color.setRGB(intensity, intensity, intensity);
        }
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for particles
    material = new THREE.PointsMaterial({
        size: 3, // Particle size
        vertexColors: true, // Use colors defined in geometry
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending, // For a brighter, glowing effect
        depthWrite: false // Important for additive blending to look good
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse move listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);

    // Resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.00005; // Slower overall animation speed

        // Subtle camera movement based on mouse position
        camera.position.x += (mouseX - camera.position.x) * 0.03; // Smoother follow
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        // Animate particles
        particles.rotation.x = time * 0.2; // Slow rotation
        particles.rotation.y = time * 0.15;

        // Optionally, animate individual particles if more complexity is needed (can impact performance)
        // For example, a slight sine wave movement for each particle:
        // const positions = particles.geometry.attributes.position.array;
        // for (let i = 0; i < particleCount; i++) {
        //     positions[i * 3 + 1] += Math.sin(time * 100 + positions[i*3]) * 0.1;
        // }
        // particles.geometry.attributes.position.needsUpdate = true;


        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const heroElem = document.getElementById('home');
        const currentWidth = heroElem ? heroElem.offsetWidth : window.innerWidth;
        const currentHeight = heroElem ? heroElem.offsetHeight : window.innerHeight;

        windowHalfX = currentWidth / 2;
        windowHalfY = currentHeight / 2;

        camera.aspect = currentWidth / currentHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentWidth, currentHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX) / 2; // Divide by 2 to reduce sensitivity
        mouseY = (event.clientY - windowHalfY) / 2;
    }

    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = (event.touches[0].pageX - windowHalfX) / 2;
            mouseY = (event.touches[0].pageY - windowHalfY) / 2;
        }
    }

    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = (event.touches[0].pageX - windowHalfX) / 2;
            mouseY = (event.touches[0].pageY - windowHalfY) / 2;
        }
    }

    animate();
    // Call onWindowResize once after a short delay to ensure heroSection dimensions are final
    setTimeout(onWindowResize, 100);
}

// Delay initialization until DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}
