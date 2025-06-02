// Main JS file for site-wide scripts and GSAP animations

document.addEventListener('DOMContentLoaded', () => {
    // GSAP Animation for Hero Text
    if (document.querySelector('.hero-section h2') && document.querySelector('.hero-section p')) {
        gsap.from(".hero-section h2", { duration: 1, y: 50, opacity: 0, delay: 0.5, ease: "power3.out" });
        gsap.from(".hero-section p", { duration: 1, y: 30, opacity: 0, delay: 0.8, ease: "power3.out" });
    }

    // Initialize Advanced Carousel (Swiper.js)
    if (document.querySelector('.advanced-carousel')) {
        const swiper = new Swiper('.advanced-carousel', {
            direction: 'horizontal',
            loop: true,
            effect: 'fade',
            fadeEffect: { crossFade: true },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            keyboard: { enabled: true, onlyInViewport: false },
            a11y: { prevSlideMessage: 'Previous slide', nextSlideMessage: 'Next slide', paginationBulletMessage: 'Go to slide {{index}}' },
        });
    }

    // GSAP and ScrollTrigger dependent animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Interactive Timeline Animations
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            gsap.set(item, { opacity: 0, y: 50 });
            ScrollTrigger.create({
                trigger: item, start: "top 85%", end: "bottom 15%",
                onEnter: () => gsap.to(item, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index % 2 === 0 ? 0 : 0.2 }),
                onLeaveBack: () => gsap.to(item, { opacity: 0, y: 50, duration: 0.4, ease: 'power2.in' }),
                once: false
            });
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                gsap.set(dot, { scale: 0 });
                ScrollTrigger.create({
                    trigger: item, start: "top 80%",
                    onEnter: () => gsap.to(dot, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)', delay: (index % 2 === 0 ? 0 : 0.2) + 0.2 }),
                    onLeaveBack: () => gsap.to(dot, { scale: 0, duration: 0.3, ease: 'power2.in' }),
                    once: false
                });
            }
        });

        // Scroll-Triggered Animations for General Content Sections
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach((section, index) => {
            // Avoid re-animating sections that are part of the timeline, as they have their own logic
            if (!section.closest('.timeline')) {
                gsap.set(section, { opacity: 0, y: 75 });
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 90%",
                    end: "bottom 10%",
                    onEnter: () => gsap.to(section, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: index * 0.1 }),
                    onLeaveBack: () => gsap.to(section, { opacity: 0, y: 75, duration: 0.4, ease: 'power2.in' }),
                    once: false
                });
            }
        });

        // Scroll-Spy for Active Navigation State
        const navLinks = document.querySelectorAll('header nav ul li a');
        const sections = document.querySelectorAll('section[id]');
        function updateActiveNavLink() {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 2 && pageYOffset < sectionTop + sectionHeight / 2) { // Adjusted threshold to be more centered
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
        window.addEventListener('scroll', updateActiveNavLink);
        updateActiveNavLink(); // Initial check

    } else {
        console.warn("GSAP or ScrollTrigger not available for advanced animations.");
    }

    // Video Placeholder Interaction
    const videoPlaceholders = document.querySelectorAll('.video-player-placeholder');
    videoPlaceholders.forEach(placeholder => {
        const playButton = placeholder.querySelector('.play-button-overlay');
        const videoTitle = placeholder.querySelector('p')?.textContent || 'video';
        if (playButton) {
            playButton.addEventListener('click', () => {
                console.log(`Attempting to play: ${videoTitle}`);
                playButton.style.display = 'none';
                const fakeControls = placeholder.querySelector('.fake-controls');
                if (fakeControls) {
                    fakeControls.style.opacity = '1';
                    fakeControls.style.transform = 'translateY(0)';
                }
            });
        }
    });

    // Custom Cursor Follower
    const follower = document.querySelector('.cursor-follower');
    if (follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        const trailFactor = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function updateFollower() {
            const dx = mouseX - followerX;
            const dy = mouseY - followerY;
            followerX += dx * trailFactor;
            followerY += dy * trailFactor;

            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                follower.style.transform = `translate(${followerX - (follower.offsetWidth / 2)}px, ${followerY - (follower.offsetHeight / 2)}px) scale(${follower.classList.contains('hover-link') ? 2.5 : 1})`;
            }
            requestAnimationFrame(updateFollower);
        }
        requestAnimationFrame(updateFollower);

        const links = document.querySelectorAll('a, button, .swiper-button-prev, .swiper-button-next, .play-button-overlay');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                follower.classList.add('hover-link');
                // Update scale directly as the main transform is now handled in updateFollower
                follower.style.transform = `translate(${followerX - (follower.offsetWidth / 2)}px, ${followerY - (follower.offsetHeight / 2)}px) scale(2.5)`;

            });
            link.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-link');
                 // Update scale directly
                follower.style.transform = `translate(${followerX - (follower.offsetWidth / 2)}px, ${followerY - (follower.offsetHeight / 2)}px) scale(1)`;
            });
        });
         // Initial positioning based on current mouse (if any) or default to 0,0
        // This ensures the follower doesn't jump from a default CSS position
        setTimeout(() => { // Delay slightly to ensure mouseX/Y might be populated
            followerX = mouseX;
            followerY = mouseY;
            // The scale is handled by body:hover .cursor-follower initially
            // For the very first frame, ensure it's correctly positioned and scaled.
            const initialScale = document.body.matches(':hover') ? 1 : 0;
            follower.style.transform = `translate(${followerX - (follower.offsetWidth / 2)}px, ${followerY - (follower.offsetHeight / 2)}px) scale(${initialScale})`;
        }, 10);

    }
});
