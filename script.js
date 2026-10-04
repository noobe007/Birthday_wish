/* =====================================================
   SETTINGS
===================================================== */

/*
    IMPORTANT

    Your partner's birthday:

    October 5, 2026 at 12:00 AM

    Change this if needed.
*/

const birthdayDate =
    new Date("October 4, 2026 00:00:00").getTime();



/* =====================================================
   ELEMENTS
===================================================== */

const openingScreen =
    document.getElementById("openingScreen");

const openGiftButton =
    document.getElementById("openGiftButton");

const cinematicIntro =
    document.getElementById("cinematicIntro");

const countdownScreen =
    document.getElementById("countdownScreen");

const fireworksScreen =
    document.getElementById("fireworksScreen");

const mainWebsite =
    document.getElementById("mainWebsite");

const backgroundMusic =
    document.getElementById("backgroundMusic");



/* =====================================================
   OPEN GIFT
===================================================== */

openGiftButton.addEventListener(
    "click",
    startExperience
);


function startExperience() {

    /*
        Music starts here.

        This is important because
        browsers usually block
        automatic audio playback.
    */
    backgroundMusic.volume = 0.35;

    backgroundMusic
        .play()
        .catch(() => {
            console.log(
                "Music requires user interaction."
            );
        });


    openingScreen.style.opacity = "0";


    setTimeout(() => {

        openingScreen.style.display = "none";

        startCinematicIntro();

    }, 1500);

}



/* =====================================================
   CINEMATIC INTRO
===================================================== */

function startCinematicIntro() {

    cinematicIntro.style.display = "flex";


    /*
        Intro animation lasts approximately
        14 seconds.
    */

    setTimeout(() => {

        cinematicIntro.style.opacity = "0";


        setTimeout(() => {

            cinematicIntro.style.display = "none";

            showCountdown();

        }, 1500);

    }, 14000);

}



/* =====================================================
   COUNTDOWN
===================================================== */

function showCountdown() {

    countdownScreen.style.display = "flex";

    countdownScreen.style.opacity = "1";

    updateCountdown();

    countdownTimer = setInterval(
        updateCountdown,
        1000
    );

}


let countdownTimer;



function updateCountdown() {

    const now =
        new Date().getTime();


    const distance =
        birthdayDate - now;


    /*
        Birthday reached
    */

    if (distance <= 0) {

        clearInterval(countdownTimer);

        startFireworksSequence();

        return;
    }


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (distance %
            (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (distance %
            (1000 * 60 * 60)) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (distance %
            (1000 * 60)) /
            1000
        );


    document.getElementById("days")
        .textContent =
        String(days).padStart(2, "0");


    document.getElementById("hours")
        .textContent =
        String(hours).padStart(2, "0");


    document.getElementById("minutes")
        .textContent =
        String(minutes).padStart(2, "0");


    document.getElementById("seconds")
        .textContent =
        String(seconds).padStart(2, "0");

}



/* =====================================================
   FIREWORKS
===================================================== */

const canvas =
    document.getElementById(
        "fireworksCanvas"
    );

const ctx =
    canvas.getContext("2d");


let fireworks = [];

let particles = [];



function resizeCanvas() {

    canvas.width =
        window.innerWidth;

    canvas.height =
        window.innerHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();



/* =====================================================
   FIREWORK
===================================================== */

class Firework {

    constructor() {

        this.x =
            Math.random() *
            canvas.width;

        this.y =
            canvas.height;

        this.targetX =
            Math.random() *
            canvas.width;

        this.targetY =
            Math.random() *
            canvas.height *
            .55;

        this.speed = 8;

        this.angle =
            Math.atan2(
                this.targetY - this.y,
                this.targetX - this.x
            );

        this.velocityX =
            Math.cos(this.angle) *
            this.speed;

        this.velocityY =
            Math.sin(this.angle) *
            this.speed;

        this.exploded = false;

    }


    update() {

        this.x +=
            this.velocityX;

        this.y +=
            this.velocityY;


        if (
            this.y <= this.targetY
        ) {

            this.explode();

            this.exploded = true;

        }

    }


    explode() {

        for (
            let i = 0;
            i < 100;
            i++
        ) {

            particles.push(
                new Particle(
                    this.x,
                    this.y
                )
            );

        }

    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ffffff";

        ctx.fill();

    }

}



/* =====================================================
   PARTICLE
===================================================== */

class Particle {

    constructor(x, y) {

        this.x = x;

        this.y = y;

        this.speed =
            Math.random() * 7 + 2;

        this.angle =
            Math.random() *
            Math.PI *
            2;

        this.velocityX =
            Math.cos(this.angle) *
            this.speed;

        this.velocityY =
            Math.sin(this.angle) *
            this.speed;

        this.alpha = 1;

        this.gravity = .06;

        this.hue =
            Math.random() * 360;

    }


    update() {

        this.velocityY +=
            this.gravity;

        this.x +=
            this.velocityX;

        this.y +=
            this.velocityY;

        this.alpha -= .012;

    }


    draw() {

        ctx.save();

        ctx.globalAlpha =
            this.alpha;

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            `hsl(${this.hue},100%,70%)`;

        ctx.fill();

        ctx.restore();

    }

}



/* =====================================================
   FIREWORK ANIMATION
===================================================== */

function animateFireworks() {

    ctx.fillStyle =
        "rgba(2,1,6,.2)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    if (
        Math.random() < .12
    ) {

        fireworks.push(
            new Firework()
        );

    }


    fireworks.forEach(
        (firework, index) => {

            firework.update();

            firework.draw();


            if (
                firework.exploded
            ) {

                fireworks.splice(
                    index,
                    1
                );

            }

        }
    );


    particles.forEach(
        (particle, index) => {

            particle.update();

            particle.draw();


            if (
                particle.alpha <= 0
            ) {

                particles.splice(
                    index,
                    1
                );

            }

        }
    );


    requestAnimationFrame(
        animateFireworks
    );

}



/* =====================================================
   START FIREWORK SEQUENCE
===================================================== */

function startFireworksSequence() {

    countdownScreen.style.opacity = "0";


    setTimeout(() => {

        countdownScreen.style.display =
            "none";

        fireworksScreen.style.display =
            "flex";

        fireworksScreen.style.opacity =
            "1";

        animateFireworks();

    }, 1500);


    /*
        After fireworks...
    */

    setTimeout(() => {

        fireworksScreen.style.opacity =
            "0";

    }, 7000);


    setTimeout(() => {

        fireworksScreen.style.display =
            "none";

        mainWebsite.style.display =
            "block";


        setTimeout(() => {

            mainWebsite.style.opacity =
                "1";


            startTypingEffect();

        }, 100);

        window.scrollTo(
            0,
            0
        );

    }, 9000);

}



/* =====================================================
   TYPING LOVE LETTER
===================================================== */

const loveLetter = `Happy Birthday, Aloy. ❤️

Words will never be enough to explain what you mean to me.

Somehow, among all the people in this world, our paths crossed. And slowly, without even realizing it, you became such an important part of my life.

I love our conversations. I love the random things we talk about. I love the laughter. I love the little arguments. I love the moments where we don't even need to say much.

Every memory with you has become a little piece of my heart.

Today, I just want you to know something...

You are incredibly special to me.

I hope this new year of your life brings you happiness, peace, success, and everything your heart wishes for.

And I hope I get to be there for many of those moments.

Happy Birthday, Aloy. ❤️

Here's to our memories.

Here's to our story.

And here's to everything that is still waiting for us. ❤️`;

let typingStarted = false;

function startTypingEffect() {

    // Prevent the function from running twice
    if (typingStarted) {
        return;
    }

    typingStarted = true;

    const textElement =
        document.getElementById("typingText");

    textElement.textContent = "";

    let index = 0;

    function typeCharacter() {

        if (index < loveLetter.length) {

            textElement.textContent +=
                loveLetter.charAt(index);

            index++;

            setTimeout(typeCharacter, 35);

        }

    }

    typeCharacter();
}



/* =====================================================
   SMOOTH SCROLL
===================================================== */

function scrollToSection(id) {

    const element =
        document.getElementById(id);


    if (!element) return;


    element.scrollIntoView({
        behavior: "smooth"
    });

}



/* =====================================================
   LOWER BACKGROUND MUSIC WHEN
   VOICE MESSAGE PLAYS
===================================================== */

const audioPlayers =
    document.querySelectorAll(
        "audio:not(#backgroundMusic)"
    );


// Normal background music volume
const normalMusicVolume = 0.35;

// Volume while voice message is playing
const voiceMusicVolume = 0.08;


audioPlayers.forEach(audio => {

    audio.addEventListener("play", () => {

        // Lower background music
        backgroundMusic.volume =
            voiceMusicVolume;

    });


    audio.addEventListener("pause", () => {

        // Restore background music
        backgroundMusic.volume =
            normalMusicVolume;

    });


    audio.addEventListener("ended", () => {

        // Restore background music
        backgroundMusic.volume =
            normalMusicVolume;

    });

});



/* =====================================================
   SCROLL REVEAL
===================================================== */

const revealElements =
    document.querySelectorAll(
        ".timeline-item, .voice-card, .gallery-item"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                    }

                }
            );

        },
        {
            threshold: .15
        }
    );


revealElements.forEach(
    element => {

        observer.observe(element);

    }
);