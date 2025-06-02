// js/sound-manager.js
const SoundManager = {
    sounds: {},
    ambientLoops: {},
    masterVolume: 0.7, // Overall volume control (0 to 1)
    isInitialized: false,
    soundPath: './sounds/', // Placeholder path

    init: function() {
        if (this.isInitialized) return;

        // Define sounds and their placeholder sources
        this.sounds = {
            'nav_hover': {
                src: this.soundPath + 'nav_hover_tick.mp3',
                volume: 0.3,
                instance: null,
                description: "Short, crisp, clean digital tick. Almost like a precise mechanical switch. Very subtle."
            },
            'nav_click': {
                src: this.soundPath + 'nav_click_confirm.mp3',
                volume: 0.5,
                instance: null,
                description: "Slightly more resonant than hover, a soft 'confirm' or 'engage' sound. Gentle, positive."
            },
            'section_reveal': {
                src: this.soundPath + 'section_swoosh_gentle.mp3',
                volume: 0.4,
                instance: null,
                description: "A soft, smooth whoosh with a subtle ethereal shimmer. Not too fast, conveys elegant movement."
            },
            'viz_start': {
                src: this.soundPath + 'viz_start_chime.mp3',
                volume: 0.4,
                instance: null,
                description: "A clear, crystalline chime or bell sound, signifying activation or data appearing. Modern and clean."
            }
        };

        this.ambientLoops = {
            'hero_ambient': {
                src: this.soundPath + 'hero_ambient_pad.mp3',
                volume: 0.0, targetVolume: 0.10,
                instance: null, fading: false,
                description: "Very low, deep, slowly evolving synth pad. Minimalist, slightly melancholic but with a sense of vastness and technology. Think 'Mac Pro' screensaver but in audio."
            },
            'viz_ambient': {
                src: this.soundPath + 'viz_ambient_digital.mp3',
                volume: 0.0, targetVolume: 0.08,
                instance: null, fading: false,
                description: "Subtle, sparse digital texture. Faint data-like pulses, quiet clicks, and clean, short synthesized tones. Evokes information flow, very high-tech and clean."
            }
        };

        for (const key in this.sounds) {
            try {
                this.sounds[key].instance = new Audio(this.sounds[key].src);
                this.sounds[key].instance.volume = this.sounds[key].volume * this.masterVolume;
                this.sounds[key].instance.load();
                this.sounds[key].instance.onerror = () => { /* console.warn(`SoundManager: Error loading ${key} - ${this.sounds[key].src}`); */ }; // Commented out
            } catch (e) {
                // console.warn(`SoundManager: Could not create Audio object for ${key} (likely due to test environment).`, e); // Commented out
            }
        }
        for (const key in this.ambientLoops) {
            try {
                this.ambientLoops[key].instance = new Audio(this.ambientLoops[key].src);
                this.ambientLoops[key].instance.volume = this.ambientLoops[key].volume * this.masterVolume;
                this.ambientLoops[key].instance.loop = true;
                this.ambientLoops[key].instance.load();
                this.ambientLoops[key].instance.onerror = () => { /* console.warn(`SoundManager: Error loading loop ${key} - ${this.ambientLoops[key].src}`); */ }; // Commented out
            } catch (e) {
                // console.warn(`SoundManager: Could not create Audio object for loop ${key} (likely due to test environment).`, e); // Commented out
            }
        }

        this.isInitialized = true;
    },

    playSound: function(soundName) {
        if (!this.isInitialized || !this.sounds[soundName] || !this.sounds[soundName].instance) return;
        const sound = this.sounds[soundName];
        sound.instance.currentTime = 0;
        sound.instance.play().catch(e => { /* console.warn(`SoundManager: Could not play ${soundName}`, e) */ });
    },

    playAmbientLoop: function(loopName, fadeDuration = 1) {
        if (!this.isInitialized || !this.ambientLoops[loopName] || !this.ambientLoops[loopName].instance) return;
        const loop = this.ambientLoops[loopName];

        if (loop.instance.paused) {
            loop.instance.volume = 0;
            loop.instance.play().catch(e => { /* console.warn(`SoundManager: Could not play loop ${loopName}`, e) */ });
        }

        if (typeof gsap !== 'undefined') {
            if (loop.fading) gsap.killTweensOf(loop.instance);
            loop.fading = true;
            gsap.to(loop.instance, {
                volume: loop.targetVolume * this.masterVolume,
                duration: fadeDuration,
                ease: "sine.inOut",
                onComplete: () => loop.fading = false
            });
        } else {
            loop.instance.volume = loop.targetVolume * this.masterVolume;
        }
    },

    stopAmbientLoop: function(loopName, fadeDuration = 1) {
        if (!this.isInitialized || !this.ambientLoops[loopName] || !this.ambientLoops[loopName].instance || this.ambientLoops[loopName].instance.paused) return;
        const loop = this.ambientLoops[loopName];

        if (typeof gsap !== 'undefined') {
            if (loop.fading) gsap.killTweensOf(loop.instance);
            loop.fading = true;
            gsap.to(loop.instance, {
                volume: 0,
                duration: fadeDuration,
                ease: "sine.inOut",
                onComplete: () => {
                    loop.instance.pause();
                    loop.fading = false;
                }
            });
        } else {
             loop.instance.volume = 0;
             loop.instance.pause();
        }
    },
};
SoundManager.init();
