// Main JS file for site-wide scripts and GSAP animations

function fetchAndDisplayMockData() {
    const displayArea = document.getElementById('fetched-data-display');
    if (!displayArea) {
        // console.warn('API data display area not found.'); // Removed for cleanup
        return;
    }

    displayArea.innerHTML = '<p>Loading data...</p>'; // Show loading message

    fetch('https://jsonplaceholder.typicode.com/users/1') // Fetch a single user as an example
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Display mock Mac Pro system info
            displayArea.innerHTML = `
                <h3>Mock System Report</h3>
                <p><strong>Device Name:</strong> ${data.name}'s Mac Pro</p> <!-- Using fetched name for some dynamic feel -->
                <p><strong>Model Identifier:</strong> MacPro7,1</p>
                <p><strong>Processor Name:</strong> Apple M2 Ultra</p>
                <p><strong>Memory:</strong> 192 GB</p>
                <p><strong>Graphics:</strong> Apple M2 Ultra (Integrated)</p>
                <p><strong>Serial Number (Mock):</strong> ${data.id.toString().padStart(8, '0')}${data.username.toUpperCase()}</p>
                <h4>Storage:</h4>
                <p>
                    <strong>Capacity:</strong> 8TB SSD<br>
                    <strong>Available:</strong> ${Math.floor(8000 - (data.id * 100))} GB <!-- Fake available space based on ID -->
                </p>
                <h4>Network:</h4>
                <p>
                    <strong>Primary Interface:</strong> Ethernet 1<br>
                    <strong>IP Address (Local):</strong> 192.168.${data.address.geo.lat.split('.')[1] % 255}.${data.address.geo.lng.split('.')[1] % 255} <!-- Fake local IP -->
                </p>
            `;
        })
        .catch(error => {
            // console.error('Error fetching mock data:', error); // Removed for cleanup
            displayArea.innerHTML = `<p style="color: red;">Failed to load data: ${error.message}</p>`;
        });
}

document.addEventListener('DOMContentLoaded', () => {

    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    const heroH2 = document.querySelector('.hero-section h2');
    const heroP = document.querySelector('.hero-section p');

    if (heroH2 && typeof SplitText !== 'undefined') {
        gsap.set(heroH2, { perspective: 400 });
        const splitH2 = new SplitText(heroH2, { type: "chars,words" });
        gsap.from(splitH2.chars, {
            duration: 0.8, opacity: 0, scale: 0, y: 80, rotationX: -90,
            transformOrigin: "0% 50% -50", ease: "back.out(1.2)", stagger: 0.03, delay: 0.5
        });
    } else if (heroH2) {
        gsap.from(heroH2, { duration: 1, y: 50, opacity: 0, delay: 0.5, ease: "power3.out" });
    }

    if (heroP && typeof SplitText !== 'undefined') {
        const splitP = new SplitText(heroP, { type: "words,lines" });
        gsap.from(splitP.words, {
            duration: 0.6, opacity: 0, y: 40, ease: "circ.out", stagger: 0.05, delay: 1.0
        });
    } else if (heroP) {
        gsap.from(heroP, { duration: 1, y: 30, opacity: 0, delay: 1.0, ease: "power3.out" });
    }

    if (document.querySelector('.advanced-carousel')) {
        const swiper = new Swiper('.advanced-carousel', {
            direction: 'horizontal', loop: true, effect: 'fade',
            fadeEffect: { crossFade: true },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            keyboard: { enabled: true, onlyInViewport: false },
            a11y: { prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide', paginationBulletMessage: 'Go to slide {{index}}' },
        });
    }

    let navLinks;
    let sections;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Comment out or remove the generic section fade-in to replace with custom ones
        /*
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach((section, index) => {
            if (section.classList.contains('feature-section') || section.id === 'home' || section.id === 'contact') {
                // Avoid applying generic animations to sections that will get custom ones below
                if (!['user-authentication', 'cms-placeholder-area', 'user-dashboard', 'recommendations-section'].includes(section.id)) {
                    gsap.set(section, { opacity: 0, y: 75 });
                    ScrollTrigger.create({
                        trigger: section, start: "top 90%", end: "bottom 10%",
                        onEnter: () => {
                            gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index * 0.1 });
                            if (SoundManager && section.id !== 'home') SoundManager.playSound('section_reveal');
                        },
                        onLeaveBack: () => gsap.to(section, { opacity: 0, y: 75, duration: 0.4, ease: 'power2.in' }),
                        once: false // Set to true if you want it only once, but custom anims below use true
                    });
                }
            }
        });
        */

        // Entrance Animation for #user-authentication
        const authSection = document.getElementById('user-authentication');
        if (authSection) { // Check if element exists before setting up animation
            gsap.set(authSection.querySelectorAll('.auth-form'), { autoAlpha: 0, y: 50 });
            gsap.set(authSection.querySelectorAll('.form-group, .social-login-container'), { autoAlpha: 0, x: -30 });

            ScrollTrigger.create({
                trigger: authSection,
                start: "top 80%",
                once: true, // Play animation once
                onEnter: () => {
                    gsap.timeline({ defaults: { ease: "power3.out" } })
                        .to(authSection.querySelectorAll('.auth-form'), { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.2 })
                        .to(authSection.querySelectorAll('.form-group, .social-login-container'), { autoAlpha: 1, x: 0, duration: 0.5, stagger: 0.1 }, "-=0.3");
                }
            });
        }

        // Entrance Animation for #cms-placeholder-area (Mac Pro News & Articles)
        const cmsSection = document.getElementById('cms-placeholder-area');
        if (cmsSection) {
            const editor = cmsSection.querySelector('.wysiwyg-editor-placeholder-container');
            const articles = cmsSection.querySelectorAll('.cms-content-block');

            if (editor) gsap.set(editor, { autoAlpha: 0, scale: 0.9, y: 30 });
            gsap.set(articles, { autoAlpha: 0, y: 50, rotationX: -20 }); // Initial slightly tilted state

            ScrollTrigger.create({
                trigger: cmsSection,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
                    if (editor) tl.to(editor, { autoAlpha: 1, scale: 1, y: 0, duration: 0.8 });
                    tl.to(articles, {
                        autoAlpha: 1,
                        y: 0,
                        rotationX: 0,
                        duration: 0.7,
                        stagger: 0.2
                    }, editor ? "-=0.5" : "+=0");
                }
            });
        }

        // Entrance Animation for #user-dashboard
        const dashboardSection = document.getElementById('user-dashboard');
        if (dashboardSection) {
            const widgets = dashboardSection.querySelectorAll('.dashboard-widget');
            gsap.set(widgets, { autoAlpha: 0, scale: 0.8, rotationZ: (i) => (i % 2 === 0 ? -5 : 5) });

            ScrollTrigger.create({
                trigger: dashboardSection,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    gsap.to(widgets, {
                        autoAlpha: 1,
                        scale: 1,
                        rotationZ: 0,
                        duration: 0.6,
                        stagger: {
                            amount: 0.5,
                            from: "random", // or "start", "center", "edges"
                            ease: "power2.out"
                        },
                        ease: "elastic.out(1, 0.75)"
                    });
                }
            });
        }

        // Entrance Animation for #recommendations-section
        const recSection = document.getElementById('recommendations-section');
        if (recSection) {
            const cards = recSection.querySelectorAll('.recommendation-card');
            gsap.set(cards, {
                autoAlpha: 0,
                z: -200,
                rotationY: -45,
                skewX: -10
            });
            const cardContainer = recSection.querySelector('.recommendations-grid');
            if (cardContainer) gsap.set(cardContainer, { perspective: 1000 });

            ScrollTrigger.create({
                trigger: recSection,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(cards, {
                        autoAlpha: 1,
                        z: 0,
                        rotationY: 0,
                        skewX: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: "power3.out"
                    });
                }
            });
        }

        navLinks = document.querySelectorAll('header nav ul li a');
        // Corrected sections query to include top-level sections and those within #new-features-container
        sections = document.querySelectorAll('main > section[id], #new-features-container > section[id]');

        // Advanced 3D Text Animations for Feature Section Titles
        let splitTextAvailable = false;
        if (typeof SplitText !== 'undefined') {
            // Assuming SplitText is globally available or already registered if using modules
            // If it's a GSAP club plugin that needs explicit registration: gsap.registerPlugin(SplitText);
            splitTextAvailable = true;
        } else {
            console.warn("SplitText plugin is not available. Fallback text animations will be less complex.");
        }

        const featureSectionTitles = document.querySelectorAll('#new-features-container > .feature-section > h2');

        featureSectionTitles.forEach((title, index) => {
            gsap.set(title, { perspective: 800 });

            if (splitTextAvailable) {
                const split = new SplitText(title, { type: "chars,words" });
                gsap.set(split.chars, { autoAlpha: 0 });

                if (index % 3 === 0) { // Style 1: Chars fly in from different depths
                    gsap.set(split.chars, {
                        z: () => gsap.utils.random(-150, 50),
                        rotationX: () => gsap.utils.random(-90, 90),
                        rotationY: () => gsap.utils.random(-45, 45),
                        scale: () => gsap.utils.random(0.5, 1.5)
                    });
                    ScrollTrigger.create({
                        trigger: title,
                        start: "top 85%",
                        once: true,
                        onEnter: () => {
                            gsap.to(split.chars, {
                                autoAlpha: 1, z: 0, rotationX: 0, rotationY: 0, scale: 1,
                                duration: 0.8, stagger: { amount: 0.6, from: "random" },
                                ease: "expo.out"
                            });
                        }
                    });
                } else if (index % 3 === 1) { // Style 2: Words cascade in with a 3D flip
                    gsap.set(split.words, { autoAlpha: 0, rotationX: -90, yPercent: -50, transformOrigin: "center center -50" });
                    ScrollTrigger.create({
                        trigger: title,
                        start: "top 85%",
                        once: true,
                        onEnter: () => {
                            gsap.to(split.words, {
                                autoAlpha: 1, rotationX: 0, yPercent: 0,
                                duration: 0.7, stagger: 0.15, ease: "power3.out"
                            });
                        }
                    });
                } else { // Style 3: Characters reveal with a wave and scale
                    gsap.set(split.chars, { autoAlpha: 0, scale: 0.2, y: (i) => (i % 2 === 0 ? -20 : 20) });
                    ScrollTrigger.create({
                        trigger: title,
                        start: "top 85%",
                        once: true,
                        onEnter: () => {
                            gsap.to(split.chars, {
                                autoAlpha: 1, scale: 1, y: 0,
                                duration: 0.6, stagger: 0.05, ease: "back.out(1.4)"
                            });
                        }
                    });
                }
            } else { // Fallback if SplitText is not available
                gsap.set(title, { autoAlpha: 0, y: 50, rotationX: -30 });
                ScrollTrigger.create({
                    trigger: title,
                    start: "top 85%",
                    once: true,
                    onEnter: () => {
                        gsap.to(title, {
                            autoAlpha: 1, y: 0, rotationX: 0,
                            duration: 0.8, ease: "power3.out"
                        });
                    }
                });
            }
        });


        function updateActiveNavLink() {
            let currentSectionId = '';
            let minDistance = Infinity;
            const viewportCenterY = window.pageYOffset + window.innerHeight / 2;
            const headerHeight = document.querySelector('header')?.offsetHeight || 70;


            sections.forEach(section => {
                const sectionTop = section.offsetTop - headerHeight; // Adjust for sticky header
                const sectionHeight = section.offsetHeight;
                const sectionCenterY = sectionTop + sectionHeight / 2;

                // Check if section is in viewport (more than 10% visible)
                const visibleTop = Math.max(sectionTop, window.pageYOffset);
                const visibleBottom = Math.min(sectionTop + sectionHeight, window.pageYOffset + window.innerHeight);
                const visibleHeight = Math.max(0, visibleBottom - visibleTop);
                const visibleRatio = visibleHeight / sectionHeight;

                if (visibleRatio > 0.1) {
                    const distanceToViewportCenter = Math.abs(viewportCenterY - sectionCenterY);
                    if (distanceToViewportCenter < minDistance) {
                        minDistance = distanceToViewportCenter;
                        currentSectionId = section.getAttribute('id');
                    }
                }
            });

            // Fallback for very top of page for #home
            if (window.pageYOffset < (sections[0]?.offsetTop - headerHeight - 50 || 200) && sections[0]?.id === 'home') {
                 currentSectionId = 'home';
            }

            // Special handling for #new-features-container link
            const newFeaturesContainerElement = document.getElementById('new-features-container');
            let isInsideNewFeaturesContainer = false;
            if (newFeaturesContainerElement) {
                const targetSectionElement = document.getElementById(currentSectionId);
                if (targetSectionElement && newFeaturesContainerElement.contains(targetSectionElement) &&
                    currentSectionId !== 'user-dashboard' &&
                    currentSectionId !== 'ugc-feed-section' &&
                    currentSectionId !== 'advanced-form-section') {
                    isInsideNewFeaturesContainer = true;
                }
            }

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentSectionId) {
                    link.classList.add('active');
                }
            });
        }
        window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
        updateActiveNavLink();

        navLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                if (SoundManager) SoundManager.playSound('nav_hover');
            });
            link.addEventListener('click', function(event) {
                event.preventDefault();
                if (SoundManager) SoundManager.playSound('nav_click');
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (!targetSection) return;

                const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                let scrollToPosition = targetSection.offsetTop - headerHeight;

                // If target is #new-features-container, scroll to its top, or slightly above its first child.
                if (targetId === '#new-features-container' && targetSection.id === 'new-features-container') {
                     // We want to see the start of this scrollable area, not necessarily a specific child.
                     // The offsetTop of new-features-container itself might be what we need.
                     // The container an H2, so scrolling to its top is fine.
                }


                // Simplified scroll logic
                if (typeof ScrollToPlugin !== 'undefined') {
                    gsap.to(window, { duration: 0.8, scrollTo: { y: scrollToPosition, autoKill: true }, ease: "power2.inOut" });
                } else {
                    window.scrollTo({ top: scrollToPosition, behavior: 'smooth' });
                }

                // Update active link immediately after click for responsiveness
                // updateActiveNavLink(); // This might be too soon if scroll is not instant. Better to rely on scroll listener.
            });
        });

        const heroSectionForSound = document.querySelector('#home');
        if (heroSectionForSound && SoundManager) {
            ScrollTrigger.create({
                trigger: heroSectionForSound, start: "top 80%", end: "bottom top",
                onEnter: () => SoundManager.playAmbientLoop('hero_ambient', 2),
                onLeave: () => SoundManager.stopAmbientLoop('hero_ambient', 2),
                onEnterBack: () => SoundManager.playAmbientLoop('hero_ambient', 2),
                onLeaveBack: () => SoundManager.stopAmbientLoop('hero_ambient', 2),
            });
        }
        // Sound trigger for hero section can remain if #home is still used.
        // Removed sound trigger for legacy-dataviz
    }

    const svgPaths = document.querySelectorAll('#hero-decorative-svg path');
    if (svgPaths.length > 0 && typeof gsap !== 'undefined') {
        if (typeof DrawSVGPlugin !== 'undefined') {
            gsap.registerPlugin(DrawSVGPlugin);
            gsap.set(svgPaths, { drawSVG: "0%" });
            gsap.to(svgPaths, {
                duration: 2, drawSVG: "100%", stagger: 0.3, ease: "power2.inOut",
                delay: 1.5, repeat: -1, yoyo: true, repeatDelay: 1
            });
        } else {
            svgPaths.forEach((path, index) => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                gsap.fromTo(path,
                    { strokeDashoffset: length },
                    { strokeDashoffset: 0, duration: 2, ease: "power1.inOut",
                      delay: 1.5 + index * 0.3, repeat: -1, yoyo: true, repeatDelay: 1 }
                );
            });
        }
    }

    const heroSVG = document.querySelector("#hero-decorative-svg");
    if (heroSVG && typeof gsap !== 'undefined') {
        if (typeof Physics2DPlugin !== 'undefined') {
            gsap.registerPlugin(Physics2DPlugin);
            gsap.killTweensOf("#hero-decorative-svg");
            const heroSectionForMouse = document.querySelector('.hero-section');
            let svgPhysics = {
                x: gsap.getProperty(heroSVG, "x"), y: gsap.getProperty(heroSVG, "y"),
                rotation: gsap.getProperty(heroSVG, "rotation"),
                velocityX: 0, velocityY: 0, angularVelocity: 0
            };
            gsap.ticker.add(() => {
                gsap.set(heroSVG, { x: svgPhysics.x, y: svgPhysics.y, rotation: svgPhysics.rotation });
            });
            if (heroSectionForMouse) {
                heroSectionForMouse.addEventListener('mousemove', (e) => {
                    const rect = heroSectionForMouse.getBoundingClientRect();
                    const mouseXPercent = (e.clientX - rect.left) / rect.width;
                    const mouseYPercent = (e.clientY - rect.top) / rect.height;
                    gsap.to(svgPhysics, {
                        velocityX: (mouseXPercent - 0.5) * 50, velocityY: (mouseYPercent - 0.5) * 50,
                        angularVelocity: (Math.random() - 0.5) * 30,
                        duration: 0.5, ease: "power1.out"
                    });
                });
            }
            gsap.to(svgPhysics, {
                physics2D: { velocity: 200, angle: "+=0", gravity: 0, friction: 0.3 },
                duration: 1000, repeat: -1
            });
        } else {
            gsap.to("#hero-decorative-svg", {
                duration: 5, y: "-=15px", x: "+=10px", rotation: 5,
                ease: "sine.inOut", repeat: -1, yoyo: true
            });
        }
    }

    const videoPlaceholders = document.querySelectorAll('.video-player-placeholder');
    videoPlaceholders.forEach(placeholder => {
        const playButton = placeholder.querySelector('.play-button-overlay');
        const videoTitlePara = placeholder.querySelector('p');
        const videoTitle = videoTitlePara ? videoTitlePara.textContent : 'video';

        if (playButton && videoTitlePara) {
             playButton.setAttribute('aria-label', `Play video: ${videoTitle}`);
        }

        if (playButton) {
            const action = () => {
                playButton.style.display = 'none';
                const fakeControls = placeholder.querySelector('.fake-controls');
                if (fakeControls) {
                    fakeControls.style.opacity = '1';
                    fakeControls.style.transform = 'translateY(0)';
                }
            };

            // Remove previous listeners if they were stored on the element, to prevent duplication
            if (playButton._clickHandler) playButton.removeEventListener('click', playButton._clickHandler);
            if (playButton._keydownHandler) playButton.removeEventListener('keydown', playButton._keydownHandler);

            playButton._clickHandler = action;
            playButton._keydownHandler = (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    action();
                }
            };

            playButton.addEventListener('click', playButton._clickHandler);
            playButton.addEventListener('keydown', playButton._keydownHandler);
        }
    });

    // New Dot and Outline Cursor Logic
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let outlineX = 0, outlineY = 0;

        const dotTrailFactor = 0.9; // Dot is very responsive
        const outlineTrailFactor = 0.2; // Outline has a smoother trail

        let animationFrameId = null;
        let isCursorVisible = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (!isCursorVisible) {
                isCursorVisible = true;
                document.body.classList.add('cursor-visible');
                // Initialize positions immediately for first render
                dotX = mouseX;
                dotY = mouseY;
                outlineX = mouseX;
                outlineY = mouseY;
                cursorDot.style.transform = `translate(${dotX - cursorDot.offsetWidth / 2}px, ${dotY - cursorDot.offsetHeight / 2}px)`;
                cursorOutline.style.transform = `translate(${outlineX - cursorOutline.offsetWidth / 2}px, ${outlineY - cursorOutline.offsetHeight / 2}px)`;
            }
        });

        function updateCursor() {
            if (isCursorVisible) {
                // Update Dot position
                const dxDot = mouseX - dotX;
                const dyDot = mouseY - dotY;
                dotX += dxDot * dotTrailFactor;
                dotY += dyDot * dotTrailFactor;
                cursorDot.style.transform = `translate(${dotX - cursorDot.offsetWidth / 2}px, ${dotY - cursorDot.offsetHeight / 2}px)`;

                // Update Outline position
                const dxOutline = mouseX - outlineX;
                const dyOutline = mouseY - outlineY;
                outlineX += dxOutline * outlineTrailFactor;
                outlineY += dyOutline * outlineTrailFactor;
                cursorOutline.style.transform = `translate(${outlineX - cursorOutline.offsetWidth / 2}px, ${outlineY - cursorOutline.offsetHeight / 2}px) scale(${cursorOutline.classList.contains('cursor-hover-link') ? 1.5 : 1})`;
            }
            animationFrameId = requestAnimationFrame(updateCursor);
        }

        // Start animation loop
        animationFrameId = requestAnimationFrame(updateCursor);

        const interactiveElements = document.querySelectorAll('a, button, .swiper-button-prev, .swiper-button-next, .play-button-overlay, input[type="submit"], input[type="button"], select, textarea, input[type="text"], input[type="email"], input[type="password"], .auth-form label, .checkbox-label');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.classList.add('cursor-hover-link');
                // Optional: Add class to dot as well if needed for its own hover style
                // cursorDot.classList.add('cursor-hover-link');
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.classList.remove('cursor-hover-link');
                // cursorDot.classList.remove('cursor-hover-link');
            });
        });

        // Hide cursor elements if mouse leaves window
        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-visible');
            isCursorVisible = false; // Will re-initialize on next mousemove in window
        });
        document.addEventListener('mouseenter', () => {
             if (!isCursorVisible) { // Re-initialize if mouse enters again
                isCursorVisible = true;
                document.body.classList.add('cursor-visible');
            }
        });
    }

    const navLinksForSplit = document.querySelectorAll('header nav ul li a');
    if (typeof SplitText !== 'undefined' && typeof gsap !== 'undefined') {
        navLinksForSplit.forEach(link => {
            const split = new SplitText(link, { type: "chars" });
            link.addEventListener('mouseenter', () => {
                gsap.to(split.chars, {
                    duration: 0.4, opacity: 0.7, y: (i) => (i % 2 === 0 ? -5 : 5),
                    rotationX: (i) => (i % 2 === 0 ? 15 : -15), color: "#00aaff",
                    stagger: 0.03, ease: "power2.out"
                });
            });
            link.addEventListener('mouseleave', () => {
                gsap.to(split.chars, {
                    duration: 0.3, opacity: 1, y: 0, rotationX: 0, color: "#f5f5f7",
                    stagger: 0.02, ease: "power1.in"
                });
            });
        });
    }

    // Call for fetching mock API data
    if (document.getElementById('api-data-placeholder')) {
        fetchAndDisplayMockData();
    }

    // Hover Animation for Recommendation Cards
    const recCards = document.querySelectorAll('#recommendations-section .recommendation-card');
    if (recCards.length > 0 && typeof gsap !== 'undefined') {
        recCards.forEach(card => {
            const cardWrapper = card;
            gsap.set(cardWrapper, { transformStyle: "preserve-3d", transformPerspective: 1000 });

            card.addEventListener('mouseenter', (e) => { // Pass event to access mouseX/Y directly
                gsap.to(cardWrapper, {
                    duration: 0.4,
                    rotationY: () => {
                        const rect = cardWrapper.getBoundingClientRect();
                        const mouseX = e.clientX - rect.left;
                        return (mouseX / rect.width - 0.5) * -30;
                    },
                    rotationX: () => {
                        const rect = cardWrapper.getBoundingClientRect();
                        const mouseY = e.clientY - rect.top;
                        return (mouseY / rect.height - 0.5) * 20;
                    },
                    scale: 1.03,
                    boxShadow: "0 12px 25px rgba(0,0,0,0.12)",
                    ease: "power2.out"
                });
            });

            card.addEventListener('mousemove', (e) => {
                 gsap.to(cardWrapper, {
                    duration: 0.6,
                    rotationY: () => {
                        const rect = cardWrapper.getBoundingClientRect();
                        const mouseX = e.clientX - rect.left;
                        return (mouseX / rect.width - 0.5) * -30;
                    },
                    rotationX: () => {
                        const rect = cardWrapper.getBoundingClientRect();
                        const mouseY = e.clientY - rect.top;
                        return (mouseY / rect.height - 0.5) * 20;
                    },
                    ease: "power1.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(cardWrapper, {
                    duration: 0.5,
                    rotationY: 0,
                    rotationX: 0,
                    scale: 1,
                    boxShadow: "0 2px 5px rgba(0,0,0,0.05)", // Original shadow from CSS
                    ease: "elastic.out(1, 0.75)"
                });
            });
        });
    }

    // Hover Animation for Dashboard Widgets
    const dashboardWidgets = document.querySelectorAll('#user-dashboard .dashboard-widget');
    if (dashboardWidgets.length > 0 && typeof gsap !== 'undefined') {
        dashboardWidgets.forEach(widget => {
            const title = widget.querySelector('h4');
            const originalBoxShadow = window.getComputedStyle(widget).boxShadow; // Get computed style
            const originalBorderColor = window.getComputedStyle(widget).borderColor;

            widget.addEventListener('mouseenter', () => {
                gsap.to(widget, {
                    duration: 0.3,
                    y: -5,
                    scale: 1.01,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                    borderColor: "#007aff",
                    ease: "power2.out"
                });
                if (title) gsap.to(title, { duration: 0.3, color: "#007aff", ease: "power2.out" });
            });

            widget.addEventListener('mouseleave', () => {
                gsap.to(widget, {
                    duration: 0.4,
                    y: 0,
                    scale: 1,
                    boxShadow: originalBoxShadow,
                    borderColor: originalBorderColor,
                    ease: "power2.out"
                });
                if (title) gsap.to(title, { duration: 0.3, color: "#1d1d1f", ease: "power2.out" });
            });
        });
    }

    // Interactive Button Enhancements (General .btn)
    const allButtons = document.querySelectorAll('.btn');
    if (allButtons.length > 0 && typeof gsap !== 'undefined') {
        allButtons.forEach(button => {
            // Ensure existing listeners are cleared if this code runs multiple times (e.g. hot reload)
            // However, standard DOMContentLoaded usually runs once.
            // For simplicity, we'll assume it runs once. If issues, add explicit listener removal.

            button.addEventListener('mousedown', () => {
                 gsap.to(button, { scale: 0.95, duration: 0.1, ease: "power1.in" });
            });
            button.addEventListener('mouseup', () => {
                gsap.to(button, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.6)"});
            });
             button.addEventListener('mouseleave', () => {
                if (gsap.getProperty(button, "scale") !== 1) {
                    gsap.to(button, { scale: 1, duration: 0.4, ease: "elastic.out(1, 0.6)"});
                }
            });
        });
    }


    // Conditional Logic for Advanced Form (Contact/Survey)
    const enquiryTypeSelect = document.getElementById('form-enquiry-type');
    const otherEnquiryGroup = document.getElementById('other-enquiry-type-group');
    const otherEnquiryInput = document.getElementById('form-other-enquiry-specify');

    if (enquiryTypeSelect && otherEnquiryGroup) {
        enquiryTypeSelect.addEventListener('change', function() {
            if (this.value === 'other') {
                otherEnquiryGroup.style.display = 'block';
                if(otherEnquiryInput) otherEnquiryInput.required = true; // Optionally make it required
            } else {
                otherEnquiryGroup.style.display = 'none';
                if(otherEnquiryInput) {
                    otherEnquiryInput.required = false; // Optionally remove required
                    otherEnquiryInput.value = ''; // Clear the value
                }
            }
        });
        // Trigger change event on load in case 'other' is pre-selected (though not in current HTML)
        if (enquiryTypeSelect.value === 'other') {
            enquiryTypeSelect.dispatchEvent(new Event('change'));
        }
    }

    // Chat Bubble and Panel Logic
    const chatBubbleToggle = document.getElementById('chat-bubble-toggle');
    const chatSelectionPopup = document.getElementById('chat-selection-popup');
    const chatSelectButtons = document.querySelectorAll('.btn-chat-select');
    const chatPanels = document.querySelectorAll('.chat-panel');
    const closeChatButtons = document.querySelectorAll('.btn-close-chat');

    if (chatBubbleToggle) {
        chatBubbleToggle.addEventListener('click', () => {
            const isExpanded = chatBubbleToggle.getAttribute('aria-expanded') === 'true';
            chatBubbleToggle.setAttribute('aria-expanded', !isExpanded);
            if (chatSelectionPopup) {
                chatSelectionPopup.style.display = isExpanded ? 'none' : 'flex';
            }
            // If opening selection popup, ensure all main chat panels are closed
            if (!isExpanded) {
                chatPanels.forEach(panel => {
                    panel.style.display = 'none';
                    panel.classList.remove('active');
                });
            }
        });
    }

    chatSelectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetPanelId = button.getAttribute('data-chat-target');
            const targetPanel = document.getElementById(targetPanelId);

            // Hide all panels first
            chatPanels.forEach(panel => {
                panel.style.display = 'none';
                panel.classList.remove('active');
            });

            // Show target panel
            if (targetPanel) {
                targetPanel.style.display = 'flex'; // Or 'block' if that's how it's styled
                setTimeout(() => targetPanel.classList.add('active'), 10); // For transition
            }

            if (chatSelectionPopup) {
                chatSelectionPopup.style.display = 'none';
            }
            if (chatBubbleToggle) {
                chatBubbleToggle.setAttribute('aria-expanded', 'true'); // Bubble is active if a panel is open
            }
        });
    });

    closeChatButtons.forEach(button => {
        button.addEventListener('click', () => {
            const panelToClose = button.closest('.chat-panel');
            if (panelToClose) {
                panelToClose.style.display = 'none';
                panelToClose.classList.remove('active');
            }
            // Check if any other panel is open, if not, set bubble to collapsed
            const anyPanelOpen = Array.from(chatPanels).some(p => p.style.display !== 'none' && p.classList.contains('active'));
            if (!anyPanelOpen && chatBubbleToggle) {
                chatBubbleToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Optional: Close popups/panels if clicking outside
    document.addEventListener('click', function(event) {
        if (chatBubbleToggle && chatSelectionPopup) {
            const isClickInsideBubbleContainer = chatBubbleToggle.parentElement.contains(event.target);
            const isClickInsidePopup = chatSelectionPopup.contains(event.target);

            if (!isClickInsideBubbleContainer && !isClickInsidePopup && chatSelectionPopup.style.display === 'flex') {
                chatSelectionPopup.style.display = 'none';
                // Only set expanded to false if no chat panel is active
                const anyPanelOpen = Array.from(chatPanels).some(p => p.classList.contains('active'));
                if (!anyPanelOpen) {
                    chatBubbleToggle.setAttribute('aria-expanded', 'false');
                }
            }
        }
    });

    // Auto-adjust textarea height in chat input
    const chatTextareas = document.querySelectorAll('.chat-input-area textarea');
    chatTextareas.forEach(textarea => {
        textarea.addEventListener('input', function () {
            this.style.height = 'auto'; // Reset height
            this.style.height = (this.scrollHeight) + 'px'; // Set to scroll height
            // Max height check if needed
            // if (this.scrollHeight > SOME_MAX_HEIGHT) {
            //     this.style.height = SOME_MAX_HEIGHT + 'px';
            //     this.style.overflowY = 'auto';
            // } else {
            //     this.style.overflowY = 'hidden';
            // }
        });
    });

    // Predictive Search Logic
    const searchInput = document.getElementById('header-search-input');
    const predictiveSearchResults = document.getElementById('predictive-search-results');
    const typedSearchTerm = document.getElementById('typed-search-term');

    if (searchInput && predictiveSearchResults && typedSearchTerm) {
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim() !== '') {
                predictiveSearchResults.style.display = 'block'; // Show immediately on focus if there's text
                setTimeout(() => predictiveSearchResults.classList.add('active'), 0); // Add active for transition
                typedSearchTerm.textContent = searchInput.value;
            }
        });

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();
            if (query !== '') {
                typedSearchTerm.textContent = query;
                // In a real scenario, fetch/filter results here
                // For now, just show the static list
                predictiveSearchResults.style.display = 'block';
                setTimeout(() => predictiveSearchResults.classList.add('active'), 0);
            } else {
                predictiveSearchResults.classList.remove('active');
                // Wait for transition to complete before hiding
                setTimeout(() => predictiveSearchResults.style.display = 'none', 150);
            }
        });

        // Hide dropdown when clicking outside
        // Use a timeout for blur to allow click on suggestion items
        let blurTimeout;
        searchInput.addEventListener('blur', () => {
            blurTimeout = setTimeout(() => {
                predictiveSearchResults.classList.remove('active');
                setTimeout(() => predictiveSearchResults.style.display = 'none', 150);
            }, 200); // Delay to allow click on suggestion item
        });

        // If a suggestion item is clicked, we might want to fill the input or navigate
        // For now, just prevent the blur from hiding it too soon if we were to handle click
        if (predictiveSearchResults) {
            predictiveSearchResults.addEventListener('mousedown', (event) => {
                // If a suggestion link is clicked, prevent blur from hiding the dropdown immediately
                if (event.target.classList.contains('suggestion-item') || event.target.closest('.suggestion-item')) {
                    clearTimeout(blurTimeout);
                }
            });
        }
    }

    // Advanced File Upload Logic
    const dragDropArea = document.getElementById('drag-drop-area');
    const fileUploadFallback = document.getElementById('file-upload-fallback');
    const filePreviewArea = document.getElementById('file-preview-area');
    const uploadStatusArea = document.querySelector('.upload-status-area');
    const progressFilled = document.querySelector('.progress-filled-upload');
    const uploadFeedback = document.getElementById('upload-feedback');

    if (dragDropArea && fileUploadFallback && filePreviewArea && uploadStatusArea && progressFilled && uploadFeedback) {

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false); // Prevent browser from opening file if dropped outside zone
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, () => {
                dragDropArea.classList.add('dragover');
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dragDropArea.addEventListener(eventName, () => {
                dragDropArea.classList.remove('dragover');
            }, false);
        });

        dragDropArea.addEventListener('drop', (e) => {
            handleFiles(e.dataTransfer.files);
        }, false);

        fileUploadFallback.addEventListener('change', (e) => {
            handleFiles(e.target.files);
        }, false);

        function handleFiles(files) {
            filePreviewArea.innerHTML = ''; // Clear previous previews
            uploadFeedback.textContent = '';
            uploadFeedback.className = '';

            if (!files.length) {
                filePreviewArea.style.display = 'none';
                uploadStatusArea.style.display = 'none';
                uploadFeedback.textContent = 'No files selected.';
                return;
            }

            filePreviewArea.style.display = 'block';
            uploadStatusArea.style.display = 'block';
            progressFilled.style.width = '0%';
            progressFilled.textContent = '0%';

            Array.from(files).forEach(file => {
                const previewItem = document.createElement('div');
                previewItem.className = 'file-preview-item';

                const fileIcon = document.createElement('span');
                fileIcon.className = 'file-icon-preview';
                fileIcon.textContent = '📄'; // Generic file icon

                const fileName = document.createElement('span');
                fileName.className = 'file-name';
                fileName.textContent = file.name;

                const fileSize = document.createElement('span');
                fileSize.className = 'file-size';
                fileSize.textContent = formatFileSize(file.size);

                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-file-btn';
                removeBtn.innerHTML = '&times;'; // '×' character
                removeBtn.setAttribute('aria-label', `Remove ${file.name}`);
                removeBtn.onclick = () => {
                    previewItem.remove();
                    // If all files are removed, hide preview and status
                    if (filePreviewArea.children.length === 0) {
                        filePreviewArea.style.display = 'none';
                        uploadStatusArea.style.display = 'none';
                    }
                };

                previewItem.appendChild(fileIcon);
                previewItem.appendChild(fileName);
                previewItem.appendChild(fileSize);
                previewItem.appendChild(removeBtn);
                filePreviewArea.appendChild(previewItem);
            });

            // Simulate upload
            let currentProgress = 0;
            const interval = setInterval(() => {
                currentProgress += 10;
                if (currentProgress <= 100) {
                    progressFilled.style.width = currentProgress + '%';
                    progressFilled.textContent = currentProgress + '%';
                    if (currentProgress === 100) {
                        progressFilled.classList.add('full');
                    }
                } else {
                    clearInterval(interval);
                    uploadFeedback.textContent = 'Upload complete!';
                    uploadFeedback.className = 'success'; // For success styling
                    // setTimeout(() => { // Optionally hide status after a delay
                    //    uploadStatusArea.style.display = 'none';
                    //    filePreviewArea.style.display = 'none';
                    //    filePreviewArea.innerHTML = '';
                    // }, 3000);
                }
            }, 200);
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

    // Hero Foreground Canvas Animation
    const fgCanvas = document.getElementById('hero-foreground-canvas');
    if (fgCanvas) {
        const fgCtx = fgCanvas.getContext('2d');
        let fgCanvasWidth = window.innerWidth;
        let fgCanvasHeight = window.innerHeight; // Or hero section height
        const swirls = [];

        function resizeFgCanvas() {
            const heroSection = document.getElementById('home'); // Assuming 'home' is the ID of the hero section
            fgCanvasWidth = heroSection ? heroSection.offsetWidth : window.innerWidth;
            fgCanvasHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;

            // Adjust for device pixel ratio for sharper rendering
            fgCanvas.width = fgCanvasWidth * window.devicePixelRatio;
            fgCanvas.height = fgCanvasHeight * window.devicePixelRatio;
            fgCanvas.style.width = fgCanvasWidth + 'px';
            fgCanvas.style.height = fgCanvasHeight + 'px';
            fgCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }

        class Swirl {
            constructor() {
                this.x = Math.random() * fgCanvasWidth;
                this.y = Math.random() * fgCanvasHeight;
                this.radius = 20 + Math.random() * 50;
                this.angle = Math.random() * Math.PI * 2;
                this.speed = (Math.random() - 0.5) * 0.04; // Can be positive or negative
                this.length = Math.PI / 2 + Math.random() * Math.PI; // Length of the arc
                this.lineWidth = 1 + Math.random() * 2;
                // Using a base color and animating opacity via GSAP and draw method
                this.baseColor = Math.random() > 0.5 ? '0, 122, 255' : '200, 200, 200';
                this.currentOpacity = 0; // Start transparent, GSAP will fade it in
                this.life = 0;
                this.maxLife = 100 + Math.random() * 100; // Frames to live

                // Animate opacity in with GSAP
                gsap.to(this, { currentOpacity: 0.3 + Math.random() * 0.5, duration: 0.5 + Math.random() * 0.5 });
            }

            update() {
                this.angle += this.speed;
                this.life++;
                if (this.life > this.maxLife * 0.7) { // Start fading out
                    // Let GSAP handle fade-out for smoothness if preferred, or manual like this
                    this.currentOpacity -= 0.01;
                }
            }

            draw() {
                if (this.currentOpacity <= 0) return;
                fgCtx.beginPath();
                fgCtx.arc(this.x, this.y, this.radius, this.angle, this.angle + this.length);
                fgCtx.strokeStyle = `rgba(${this.baseColor}, ${this.currentOpacity})`;
                fgCtx.lineWidth = this.lineWidth;
                fgCtx.stroke();
            }
        }

        function createSwirls() {
            if (swirls.length < 50 && Math.random() < 0.3) { // Max 50 swirls, add periodically
                swirls.push(new Swirl());
            }
        }

        function animateForeground() {
            fgCtx.clearRect(0, 0, fgCanvasWidth, fgCanvasHeight); // Use scaled dimensions for clearing
            createSwirls();
            for (let i = swirls.length - 1; i >= 0; i--) {
                const swirl = swirls[i];
                swirl.update();
                if (swirl.currentOpacity <= 0 || swirl.life >= swirl.maxLife) {
                    swirls.splice(i, 1);
                } else {
                    swirl.draw();
                }
            }
        }

        if (typeof gsap !== 'undefined') {
            gsap.ticker.add(animateForeground);
            window.addEventListener('resize', resizeFgCanvas);
            resizeFgCanvas(); // Initial size set
        } else {
            // console.warn("GSAP not available for foreground canvas animation."); // Already removed this type of comment
        }
    }

    // Generative Art Block Initialization
    function initGenerativeArtBlock(containerId) {
        const container = document.getElementById(containerId);
        if (!container || typeof THREE === 'undefined') {
            // console.warn(`Container ${containerId} not found or THREE.js missing.`); // Keep this commented for prod
            return;
        }

        let scene, camera, renderer, mesh;
        let mouseX = 0, mouseY = 0; // For mouse interaction

        function init() {
            scene = new THREE.Scene();
            const width = container.clientWidth;
            const height = container.clientHeight;

            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 3; // Adjusted for TorusKnot size

            renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                stencil: false
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const geometry = new THREE.TorusKnotGeometry(1, 0.2, 80, 12); // Adjusted params for visual appeal
            const material = new THREE.MeshStandardMaterial({
                color: 0x007aff, // Apple Blue
                metalness: 0.6,
                roughness: 0.3, // Slightly less rough for more shine
                emissive: 0x002244, // Darker blue emissive
                emissiveIntensity: 0.25 // Subtle emissive intensity
            });
            mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Slightly brighter ambient
            scene.add(ambientLight);
            const pointLight = new THREE.PointLight(0xffffff, 0.8, 150); // Brighter point light
            pointLight.position.set(2, 3, 4); // Adjusted position
            scene.add(pointLight);

            // Second point light for more even lighting
            const pointLight2 = new THREE.PointLight(0xffffff, 0.4, 100);
            pointLight2.position.set(-4, -2, -3);
            scene.add(pointLight2);


            container.addEventListener('mousemove', onMouseMove, false);
            // Optimization: Only add resize listener if it's truly dynamic or unique per block.
            // If all blocks are similar size or resize with window, a single global handler is better.
            // For now, keeping it local for encapsulation.
            window.addEventListener('resize', onWindowResize, false);
            animate();
        }

        function onMouseMove(event) {
            const rect = container.getBoundingClientRect();
            mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onWindowResize() {
            // Debounce or throttle this if many instances are created
            const width = container.clientWidth;
            const height = container.clientHeight;
            if (width > 0 && height > 0) { // Ensure container is visible
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height);
            }
        }

        let targetRotationX = 0;
        let targetRotationY = 0;

        function animate() {
            requestAnimationFrame(animate);

            // Smooth mouse interaction
            targetRotationX = mouseY * 0.3;
            targetRotationY = mouseX * 0.3;

            mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
            mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
            mesh.rotation.z += 0.002; // Slower constant spin

            renderer.render(scene, camera);
        }

        // Handle cases where container might not be immediately visible or sized
        // Use a small timeout or IntersectionObserver if size is an issue on load
        if (container.clientWidth > 0 && container.clientHeight > 0) {
            init();
        } else {
            // Fallback or wait for visibility if needed, for now, log warning if not sized
            // console.warn(`Container ${containerId} has no dimensions at init time.`);
            // Optionally, use a ResizeObserver to init when size is available
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                        init();
                        resizeObserver.unobserve(container); // Stop observing once initialized
                        break;
                    }
                }
            });
            resizeObserver.observe(container);
        }
    }

    // Call for the first block
    if (document.getElementById('genArtBlock1')) {
        initGenerativeArtBlock('genArtBlock1');
    }
});
