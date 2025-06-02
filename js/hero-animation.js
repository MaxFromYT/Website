// Three.js Hero Particle Animation
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        // console.error('Hero canvas not found'); // Removed console.error
        return;
    }

    let scene, camera, renderer, particles, material;
    let mouseX = 0, mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    const heroSection = document.getElementById('home');
    const initialWidth = heroSection ? heroSection.offsetWidth : window.innerWidth;
    const initialHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

    windowHalfX = initialWidth / 2;
    windowHalfY = initialHeight / 2;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, initialWidth / initialHeight, 1, 3000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
    renderer.setSize(initialWidth, initialHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color = new THREE.Color();

    for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const randomValue = Math.random();
        if (randomValue < 0.05) {
            color.setHSL(0.6, 0.7, Math.random() * 0.5 + 0.5);
        } else {
            const intensity = Math.random() * 0.5 + 0.5;
            color.setRGB(intensity, intensity, intensity);
        }
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: 3,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    window.addEventListener('resize', onWindowResize, false);

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.00005;

        camera.position.x += (mouseX - camera.position.x) * 0.03;
        camera.position.y += (-mouseY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        particles.rotation.x = time * 0.2;
        particles.rotation.y = time * 0.15;

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
        mouseX = (event.clientX - windowHalfX) / 2;
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
    setTimeout(onWindowResize, 100);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}
