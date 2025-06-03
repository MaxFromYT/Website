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
            // Simple display of some fetched data
            displayArea.innerHTML = `
                <h3>User Details (from JSONPlaceholder)</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Website:</strong> ${data.website}</p>
                <h4>Address:</h4>
                <p>
                    ${data.address.street}, ${data.address.suite}<br>
                    ${data.address.city}, ${data.address.zipcode}
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

    const follower = document.querySelector('.cursor-follower');
    if (follower) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        const trailFactor = 0.15;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
        });
        function updateFollower() {
            const dx = mouseX - followerX; const dy = mouseY - followerY;
            followerX += dx * trailFactor; followerY += dy * trailFactor;
            if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
                follower.style.transform = `translate(${followerX-(follower.offsetWidth/2)}px, ${followerY-(follower.offsetHeight/2)}px) scale(${follower.classList.contains('hover-link')?2.5:1})`;
            }
            requestAnimationFrame(updateFollower);
        }
        requestAnimationFrame(updateFollower);
        const links = document.querySelectorAll('a, button, .swiper-button-prev, .swiper-button-next, .play-button-overlay');
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                follower.classList.add('hover-link');
                follower.style.transform = `translate(${followerX-(follower.offsetWidth/2)}px, ${followerY-(follower.offsetHeight/2)}px) scale(2.5)`;
            });
            link.addEventListener('mouseleave', () => {
                follower.classList.remove('hover-link');
                follower.style.transform = `translate(${followerX-(follower.offsetWidth/2)}px, ${followerY-(follower.offsetHeight/2)}px) scale(1)`;
            });
        });
        setTimeout(() => {
            followerX = mouseX; followerY = mouseY;
            const initialScale = document.body.matches(':hover') ? 1 : 0;
            follower.style.transform = `translate(${followerX-(follower.offsetWidth/2)}px, ${followerY-(follower.offsetHeight/2)}px) scale(${initialScale})`;
        }, 10);
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
});
