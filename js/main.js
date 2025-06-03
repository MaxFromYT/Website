// Main JS file for site-wide scripts and GSAP animations

function fetchAndDisplayMockData() {
    const displayArea = document.getElementById('fetched-data-display');
    if (!displayArea) {
        console.warn('API data display area not found.');
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
            console.error('Error fetching mock data:', error);
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
        // if(typeof SplitText === 'undefined') console.warn("SplitText plugin not available for H2. Using fallback animation.");
    }

    if (heroP && typeof SplitText !== 'undefined') {
        const splitP = new SplitText(heroP, { type: "words,lines" });
        gsap.from(splitP.words, {
            duration: 0.6, opacity: 0, y: 40, ease: "circ.out", stagger: 0.05, delay: 1.0
        });
    } else if (heroP) {
        gsap.from(heroP, { duration: 1, y: 30, opacity: 0, delay: 1.0, ease: "power3.out" });
        // if(typeof SplitText === 'undefined') console.warn("SplitText plugin not available for P. Using fallback animation.");
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

        const biographySection = document.querySelector('#biography');
        if (biographySection) {
            ScrollTrigger.getAll().forEach(st => {
                if (st.trigger === biographySection) {
                    st.kill();
                }
            });
            gsap.set(biographySection, { opacity: 1, y: 0, clearProps: "ScrollTrigger" });

            const bioMainText = biographySection.querySelectorAll('p:not(.quote)');
            const reviewQuotesContainer = biographySection.querySelector('.review-quotes');
            const reviewQuotes = biographySection.querySelectorAll('.review-quotes .quote');
            const timelineContainer = biographySection.querySelector('.timeline');

            gsap.set([reviewQuotesContainer, timelineContainer], { opacity: 0 });
            gsap.set(reviewQuotesContainer, {y: 50});
            if (timelineContainer) gsap.set(timelineContainer, {x: -100});

            const bioScrubTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: biographySection, pin: true, start: "top top",
                    end: "+=2000", scrub: 1.2, anticipatePin: 1
                }
            });
            bioScrubTimeline.to(bioMainText, { opacity: 0.7, scale: 0.98, duration: 0.5, ease: "power1.inOut" }, 0);
            if (reviewQuotesContainer) {
                bioScrubTimeline.to(reviewQuotesContainer, { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, ">-0.2");
                if (reviewQuotes.length > 0) {
                     bioScrubTimeline.from(reviewQuotes, { opacity: 0, x: 50, duration: 0.8, stagger: 0.3, ease: "back.out(1.4)" }, "-=0.5");
                }
            }
            if (timelineContainer) {
                bioScrubTimeline.to(timelineContainer, { opacity: 1, x: 0, duration: 1.5, ease: "expo.out" }, ">-0.5");
                bioScrubTimeline.to(bioMainText, { opacity: 0.3, x: () => -(biographySection.offsetWidth * 0.1), duration: 1.5, ease: "power1.inOut" }, "<");
            }
        }

        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            gsap.set(item, { opacity: 0, y: 50 });
            ScrollTrigger.create({
                trigger: item, start: "top 85%", end: "bottom 15%",
                scroller: biographySection && biographySection.matches(".gsap-pin-active") ? biographySection : window,
                onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index % 2 === 0 ? 0 : 0.2 }),
                onLeaveBack: () => gsap.to(item, { opacity: 0, y: 50, duration: 0.4, ease: 'power2.in' }),
                once: false
            });
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                gsap.set(dot, { scale: 0 });
                ScrollTrigger.create({
                    trigger: item, start: "top 80%",
                    scroller: biographySection && biographySection.matches(".gsap-pin-active") ? biographySection : window,
                    onEnter: () => gsap.to(dot, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: (index % 2 === 0 ? 0 : 0.2) + 0.2 }),
                    onLeaveBack: () => gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.in' }),
                    once: false
                });
            }
        });

        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach((section, index) => {
            if (section.id !== 'biography' && !section.closest('.timeline')) {
                gsap.set(section, { opacity: 0, y: 75 });
                ScrollTrigger.create({
                    trigger: section, start: "top 90%", end: "bottom 10%",
                    onEnter: () => {
                        gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index * 0.1 });
                        if (SoundManager && section.id !== 'home') SoundManager.playSound('section_reveal');
                    },
                    onLeaveBack: () => gsap.to(section, { opacity: 0, y: 75, duration: 0.4, ease: 'power2.in' }),
                    once: false
                });
            }
        });

        const videoGalleryWrapper = document.querySelector('.video-gallery-wrapper');
        const videoGalleryTrack = document.querySelector('.video-gallery-track');
        if (videoGalleryWrapper && videoGalleryTrack && videoGalleryTrack.children.length > 1) {
            let scrollDistance = videoGalleryTrack.offsetWidth - videoGalleryWrapper.offsetWidth;
            if (scrollDistance > 0) {
                let videoTrackTween = gsap.to(videoGalleryTrack, {
                    x: () => -scrollDistance, ease: "none",
                    scrollTrigger: {
                        trigger: videoGalleryWrapper, start: "center center",
                        end: () => "+=" + videoGalleryTrack.offsetWidth,
                        scrub: 1.5, pin: true, invalidateOnRefresh: true, anticipatePin: 1
                    }
                });
                const videoItems = videoGalleryTrack.querySelectorAll('.video-player-placeholder');
                videoItems.forEach(item => {
                    gsap.to(item, { scale: 0.95, opacity: 0.7, ease: "none",
                        scrollTrigger: { trigger: item, containerAnimation: videoTrackTween, start: "center right", end: "center left", scrub: true }
                    });
                    gsap.to(item, { scale: 1, opacity: 1, ease: "none",
                        scrollTrigger: { trigger: item, containerAnimation: videoTrackTween, start: "left center", end: "right center", scrub: true }
                    });
                });
            }
        }

        navLinks = document.querySelectorAll('header nav ul li a');
        sections = document.querySelectorAll('main > section[id]');
        const allSectionsForTransition = Array.from(sections);

        function updateActiveNavLink() {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 2 && pageYOffset < sectionTop + sectionHeight / 2) {
                     currentSectionId = section.getAttribute('id');
                }
            });
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
                const outPromises = allSectionsForTransition.map(section => {
                    if (section !== targetSection && gsap.getProperty(section, "opacity") == 1) {
                        return gsap.to(section, {
                            duration: 0.5, opacity: 0, ease: "power2.in"
                        }).then(() => gsap.set(section, {display: 'none'}));
                    }
                    return Promise.resolve();
                });
                Promise.all(outPromises).then(() => {
                    gsap.set(targetSection, { display: 'block', opacity: 0 });
                    gsap.to(targetSection, {
                        duration: 0.7, opacity: 1, ease: "power3.out", delay: 0.1,
                        onComplete: () => {
                            const headerHeight = document.querySelector('header')?.offsetHeight || 70;
                            if (typeof ScrollToPlugin !== 'undefined') {
                                gsap.to(window, { duration: 0.8, scrollTo: { y: targetSection.offsetTop - headerHeight }, ease: "power2.inOut" });
                            } else {
                                window.scrollTo({ top: targetSection.offsetTop - headerHeight, behavior: 'smooth' });
                            }
                        }
                    });
                });
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
        const dataVizSection = document.querySelector('#legacy-dataviz');
        if (dataVizSection && SoundManager) {
             ScrollTrigger.create({
                trigger: dataVizSection, start: "top center", end: "bottom center",
                onEnter: () => { SoundManager.playSound('viz_start'); SoundManager.playAmbientLoop('viz_ambient', 1.5); },
                onLeave: () => SoundManager.stopAmbientLoop('viz_ambient', 1.5),
                onEnterBack: () => { SoundManager.playSound('viz_start'); SoundManager.playAmbientLoop('viz_ambient', 1.5); },
                onLeaveBack: () => SoundManager.stopAmbientLoop('viz_ambient', 1.5),
            });
        }
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
            // console.warn("DrawSVGPlugin not available. Using fallback SVG animation.");
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
            // console.warn("Physics2DPlugin not available for hero SVG. Using existing float animation.");
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
    } else {
        // if(typeof SplitText === 'undefined') console.warn("SplitText plugin not available for nav link hover effects. Using CSS fallback hover effects."); // Removed
    }

    // Call for fetching mock API data
    if (document.getElementById('api-data-placeholder')) {
        fetchAndDisplayMockData();
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
});
