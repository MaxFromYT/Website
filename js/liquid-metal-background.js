// js/liquid-metal-background.js
function initLiquidMetalBackground() {
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded, skipping liquid metal background.');
        return;
    }

    const canvas = document.getElementById('liquid-metal-canvas');
    if (!canvas) {
        console.error('Liquid metal canvas not found.');
        return;
    }

    let scene, camera, renderer, material, mesh;
    let uniforms;

    // Scene
    scene = new THREE.Scene();

    // Camera - Orthographic for full-screen shader plane
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true, // Good to have for shaders too, though less critical than geometry
        stencil: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Geometry - A simple plane that covers the screen
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Uniforms
    uniforms = {
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        // Add more uniforms for actual liquid metal shader later
    };

    // Placeholder Vertex Shader
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0); // Orthographic camera handles projection
        }
    `;

    // New Fragment Shader for "Liquid Metal" like effect
    const fragmentShader = `
        varying vec2 vUv;
        uniform float u_time;
        uniform vec2 u_resolution;

        // Basic pseudo-random generator
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        // Function to create a "flow" pattern
        float flow_pattern(vec2 st, float time) {
            float S = sin(time * 0.2);
            float C = cos(time * 0.2);

            st = mat2(C, -S, S, C) * st; // Rotate UVs over time

            vec2 q = vec2(0.);
            q.x = fract(st.x + time * 0.05); // Horizontal flow
            q.y = fract(st.y + time * 0.03); // Vertical flow, slightly different speed

            float r1 = random(q + vec2(1.7, 9.2) + 0.17 * time);
            float r2 = random(q + vec2(8.3, 2.8) + 0.11 * time);

            // Mix random values to create a smoother pattern
            return mix(r1, r2, sin(q.x * 3.14159) * cos(q.y * 3.14159 * 0.5));
        }

        void main() {
            vec2 uv = vUv;
            // Aspect correction could be applied here if needed:
            // float aspect = u_resolution.x / u_resolution.y;
            // vec2 P = uv - vec2(0.5); // Center origin
            // P.x *= aspect;
            // P += vec2(0.5); // Restore origin
            // uv = P;


            float t = u_time * 0.2; // Slow down time for the flow pattern

            // Create multiple layers of flow patterns, scaled and offset
            float c1 = flow_pattern(uv * 2.0 + vec2(0.1, 0.1), t);
            float c2 = flow_pattern(uv * 3.0 - vec2(0.05, 0.05), t + 5.0);
            float c3 = flow_pattern(uv * 1.5 + vec2(0.2, -0.15), t + 10.0);

            // Combine the patterns
            float combined_flow = (c1 + c2 + c3) / 3.0;

            // Make it look more "metallic" or "watery"
            float intensity = smoothstep(0.3, 0.7, combined_flow);

            vec3 color = vec3(intensity); // Grayscale for a metallic sheen
            // vec3 color = vec3(intensity * 0.2, intensity * 0.5, intensity * 0.9); // Example blueish liquid

            // Add some subtle ripples or distortion based on another noise layer
            vec2 distorted_uv = uv + vec2(sin(uv.y * 10.0 + t * 5.0) * 0.01, cos(uv.x * 10.0 + t * 5.0) * 0.01);
            float distortion_noise = random(distorted_uv * 5.0 + t);
            color *= (0.8 + distortion_noise * 0.2);

            float alpha = smoothstep(0.2, 0.6, combined_flow) * 0.5 + 0.1;

            gl_FragColor = vec4(color, alpha);
        }
    `;

    // Shader Material
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        transparent: true, // Needed for alpha in fragment shader
        depthWrite: false
    });

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Fade in canvas using GSAP
    if (typeof gsap !== 'undefined') {
        gsap.to(renderer.domElement, { opacity: 1, duration: 2.5, delay: 0.5 }); // Fade in longer, slight delay
    } else {
        renderer.domElement.style.opacity = '1'; // Fallback
    }

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        uniforms.u_time.value += 0.01; // Adjusted time increment
        renderer.render(scene, camera);
    }

    // Window Resize Handler
    function onWindowResize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
        // Camera update not needed for orthographic if geometry always fills screen
    }
    window.addEventListener('resize', onWindowResize, false);

    // Initial call
    if (renderer) {
        animate();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLiquidMetalBackground);
} else {
    initLiquidMetalBackground();
}
