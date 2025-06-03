// Three.js Hero Advanced 3D Scene
function initHeroAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) {
        // console.error('Hero canvas not found'); // Removed for prod
        return;
    }

    let scene, camera, renderer, sculptureGroup;
    let mouseX = 0, mouseY = 0;

    const heroSection = document.getElementById('home');
    let viewWidth = heroSection ? heroSection.offsetWidth : window.innerWidth;
    let viewHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    let windowHalfX = viewWidth / 2;
    let windowHalfY = viewHeight / 2;


    // Scene setup
    scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x1d1d1f, 500, 2000); // Subtle fog for depth

    camera = new THREE.PerspectiveCamera(60, viewWidth / viewHeight, 0.1, 2000); // Adjusted FOV and far plane
    camera.position.z = 600; // Camera position to view the sculpture

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(viewWidth, viewHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.outputEncoding = THREE.sRGBEncoding; // For more accurate colors with PBR
    // renderer.toneMapping = THREE.ACESFilmicToneMapping; // For HDR-like effect
    // renderer.toneMappingExposure = 1.0;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Soft white light
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.1 ); // skyColor, groundColor, intensity
    scene.add( hemiLight );

    const pointLight1 = new THREE.PointLight(0x0071e3, 0.7, 1500); // Apple Blueish light, intensity 0.7
    pointLight1.position.set(300, 200, 400);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 1500); // White light, intensity 0.5
    pointLight2.position.set(-300, -100, 300);
    scene.add(pointLight2);

    // Geometric Sculpture
    sculptureGroup = new THREE.Group();
    const baseGeometry = new THREE.SphereGeometry(30, 32, 32); // Base geometry for spheres

    for (let i = 0; i < 25; i++) { // Create a cluster of spheres
        const material = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.7 ? 0x0071e3 : (Math.random() > 0.5 ? 0xbbbbbb : 0xdddddd), // More varied grays, less frequent blue
            metalness: 0.85, // Slightly less mirror-like
            roughness: Math.random() * 0.3 + 0.2, // Range from fairly smooth to moderately rough
            flatShading: false
        });

        const sphere = new THREE.Mesh(baseGeometry, material); // Reuse baseGeometry

        // Fibonacci sphere algorithm for even distribution
        const phi = Math.acos(-1 + (2 * i) / 24); // 24 instead of 25 to avoid pole duplication if endpoint included
        const theta = Math.sqrt(25 * Math.PI) * phi;

        sphere.position.x = 200 * Math.cos(theta) * Math.sin(phi);
        sphere.position.y = 200 * Math.sin(theta) * Math.sin(phi);
        sphere.position.z = 200 * Math.cos(phi);

        const scale = Math.random() * 0.5 + 0.5;
        sphere.scale.set(scale,scale,scale);
        sphere.userData.originalScale = scale; // Store original scale for animation

        sculptureGroup.add(sphere);
    }
    scene.add(sculptureGroup);

    // Mouse move listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchstart', onDocumentTouchStart, { passive: false });
    document.addEventListener('touchmove', onDocumentTouchMove, { passive: false });


    // Resize listener
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        const time = Date.now() * 0.0001;

        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        sculptureGroup.rotation.x = time * 0.3;
        sculptureGroup.rotation.y = time * 0.2;

        sculptureGroup.children.forEach((child, index) => {
            const k = Math.sin(time * 2 + index * 0.5);
            const scaleFactor = 1 + k * 0.05;
            if (child.userData.originalScale) { // Check if originalScale was stored
                 child.scale.set(child.userData.originalScale * scaleFactor, child.userData.originalScale * scaleFactor, child.userData.originalScale*scaleFactor);
            }
        });

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        viewWidth = heroSection ? heroSection.offsetWidth : window.innerWidth;
        viewHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
        windowHalfX = viewWidth / 2;
        windowHalfY = viewHeight / 2;

        camera.aspect = viewWidth / viewHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewWidth, viewHeight);
    }

    function onDocumentMouseMove(event) {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    }

    function onDocumentTouchStart(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = (event.touches[0].pageX - windowHalfX);
            mouseY = (event.touches[0].pageY - windowHalfY);
        }
    }

    function onDocumentTouchMove(event) {
        if (event.touches.length === 1) {
            event.preventDefault();
            mouseX = (event.touches[0].pageX - windowHalfX);
            mouseY = (event.touches[0].pageY - windowHalfY);
        }
    }

    animate();
    onWindowResize();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}
```
