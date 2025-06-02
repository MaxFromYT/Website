// Three.js Fictional Data Visualization
function initDataVizAnimation() {
    const canvas = document.getElementById('dataviz-canvas');
    if (!canvas || typeof THREE === 'undefined' || typeof gsap === 'undefined') {
        if (!canvas) console.warn("Dataviz canvas not found."); // Keep warnings for dev
        if (typeof THREE === 'undefined') console.warn("THREE is not defined for Dataviz.");
        if (typeof gsap === 'undefined') console.warn("GSAP is not defined for Dataviz.");
        return;
    }

    let scene, camera, renderer, mainGroup;
    const nodes = [];
    const lines = [];

    const container = document.querySelector('.dataviz-canvas-container');
    let viewWidth = container.clientWidth;
    let viewHeight = container.clientHeight;

    // Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, viewWidth / viewHeight, 1, 5000);
    camera.position.z = 800;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(viewWidth, viewHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    mainGroup.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x0071e3, 0.8);
    directionalLight.position.set(1, 1, 1);
    mainGroup.add(directionalLight);

    const data = [
        { id: "1988", label: "1988: Karajan Prize", type: "year", x: -400, y: 200, z: 0, connections: ["Debut"] },
        { id: "Debut", label: "Early Debuts", type: "event", x: -300, y: 150, z: 50, connections: ["RFP"] },
        { id: "RFP", label: "1995: Royal Flemish Phil.", type: "orchestra", x: -150, y: 100, z: -50, connections: ["BPhil"] },
        { id: "BPhil", label: "2005: Berlin Phil. Debut", type: "orchestra", x: 0, y: 0, z: 0, connections: ["SFGS", "Award"] },
        { id: "SFGS", label: "2010: SF Global Symphony", type: "orchestra", x: 150, y: -100, z: 50, connections: ["Present"] },
        { id: "Award", label: "2018: Chevalier Award", type: "event", x: 50, y: -180, z: -30, connections: ["Present"] },
        { id: "Present", label: "Present Day", type: "year", x: 350, y: -250, z: 0 }
    ];

    const nodeGeometry = new THREE.SphereGeometry(12, 16, 16);
    const nodeMaterials = {
        year: new THREE.MeshStandardMaterial({ color: 0x0071e3, metalness: 0.7, roughness: 0.4 }),
        orchestra: new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 }),
        event: new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.6, roughness: 0.5 })
    };

    data.forEach(d => {
        const material = nodeMaterials[d.type] || nodeMaterials.event;
        const sphere = new THREE.Mesh(nodeGeometry, material);
        sphere.position.set(d.x, d.y, d.z);
        sphere.userData = d;
        nodes.push(sphere);
        mainGroup.add(sphere);
    });

    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x555577, transparent: true, opacity: 0.3, linewidth: 1
    });

    data.forEach(d => {
        if (d.connections) {
            const startNode = nodes.find(n => n.userData.id === d.id);
            d.connections.forEach(connId => {
                const endNode = nodes.find(n => n.userData.id === connId);
                if (startNode && endNode) {
                    const points = [startNode.position.clone(), endNode.position.clone()]; // Use .clone()
                    const geometry = new THREE.BufferGeometry().setFromPoints(points);
                    const line = new THREE.Line(geometry, lineMaterial.clone());
                    lines.push(line);
                    mainGroup.add(line);
                }
            });
        }
    });

    mainGroup.rotation.x = 0.2;
    mainGroup.rotation.y = -0.3;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#legacy-dataviz",
            start: "top center+=100px",
            end: "bottom bottom",
            scrub: 1.5,
            onEnter: () => {
                gsap.set(nodes, { scale: 0.01, opacity: 0 });
                gsap.set(lines, { opacity: 0 });

                gsap.to(nodes, {
                    scale: 1, opacity: 1, duration: 1, stagger: 0.1,
                    ease: "elastic.out(0.8, 0.5)", delay: 0.2
                });
                lines.forEach((line, index) => {
                    const originalOpacity = line.material.opacity; // Store original line opacity
                    line.material.opacity = 0; // Start line fully transparent for this effect

                    // Create a temporary line for the "drawing" effect with a brighter color
                    const drawEffectMaterial = new THREE.LineBasicMaterial({
                        color: 0x88aaff, // Brighter color for drawing
                        transparent: true,
                        opacity: 0, // Start transparent
                        linewidth: line.material.linewidth
                    });
                    const tempDrawLine = new THREE.Line(line.geometry, drawEffectMaterial);
                    line.parent.add(tempDrawLine);

                    // Animate the drawing effect line
                    gsap.timeline({ delay: 0.5 + index * 0.05})
                        .fromTo(tempDrawLine.geometry.attributes.position,
                            { array: new Float32Array([...line.geometry.attributes.position.array.slice(0,3), ...line.geometry.attributes.position.array.slice(0,3)]) },
                            { array: line.geometry.attributes.position.array, duration: 1, ease: "power1.inOut",
                              onUpdate: function() { tempDrawLine.geometry.attributes.position.needsUpdate = true; }
                            }
                        )
                        .to(tempDrawLine.material, { opacity: 0.7, duration: 0.5 }, 0) // Fade in the drawing line
                        .to(tempDrawLine.material, { opacity: 0, duration: 0.5, delay: 0.5, onComplete: () => {
                            line.parent.remove(tempDrawLine); // Remove temp line
                            line.material.opacity = originalOpacity; // Restore original line's opacity
                        }}, ">");
                });
            },
            onLeaveBack: () => {
                gsap.to(nodes, { scale: 0.01, opacity: 0, duration: 0.5, stagger: 0.05 });
                gsap.to(lines, { opacity: 0, duration: 0.3 });
            },
            once: false
        }
    });

    tl.to(mainGroup.rotation, { y: "+=1.5", x: "-=0.3", ease: "none" }, 0);
    tl.to(mainGroup.position, { z: "-=200", ease: "none"}, 0);

    window.addEventListener('resize', onWindowResizeViz, false);
    function onWindowResizeViz() {
        if (!container) return; // Add check for container
        viewWidth = container.clientWidth;
        viewHeight = container.clientHeight;
        camera.aspect = viewWidth / viewHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(viewWidth, viewHeight);
    }

    function renderLoop() {
        requestAnimationFrame(renderLoop);
        nodes.forEach(node => {
            node.rotation.y += 0.005;
        });
        renderer.render(scene, camera);
    }
    renderLoop();
    onWindowResizeViz();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDataVizAnimation);
} else {
    initDataVizAnimation();
}
