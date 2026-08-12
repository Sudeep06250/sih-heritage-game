/* =====================================================
   KONARK — ECHOES OF THE SUN
===================================================== */


/* =====================================================
   GAME STATE
===================================================== */

let clues = 0;

let currentElement = null;

let discovered = {

    wheel: false,

    horse: false,

    dancer: false,

    surya: false,

    food: false,

    music: false,

    architecture: false,

    history: false

};


/* =====================================================
   MUSIC
===================================================== */

const odishaMusic =
    document.getElementById("odishaMusic");

const playMusicButton =
    document.getElementById("playMusicButton");

const musicStatus =
    document.getElementById("musicStatus");


/* =====================================================
   START EXPLORATION
===================================================== */

function startExploration() {

    const dialogue =
        document.getElementById("dialogue");

    dialogue.style.display = "none";


    const objects =
        document.querySelectorAll(".object");


    objects.forEach(function(object) {

        object.classList.add("show");

    });

}


/* =====================================================
   SHOW INFORMATION
===================================================== */

function showInfo(type) {

    currentElement = type;


    const title =
        document.getElementById("popupTitle");

    const text =
        document.getElementById("popupText");

    const image =
        document.getElementById("popupImage");

    const category =
        document.getElementById("popupCategory");

    const collectButton =
        document.getElementById("collectButton");

    const musicPlayer =
        document.getElementById("musicPlayer");


    /* Hide music player by default */

    musicPlayer.classList.remove("active");


    /* Stop music whenever another discovery opens */

    stopMusic();


    /* =================================================
       WHEEL
    ================================================== */

    if (type === "wheel") {

        category.innerText =
            "ARCHITECTURE";

        title.innerText =
            "The Great Chariot Wheels";

        text.innerText =
            "Konark is conceived as the monumental " +
            "chariot of Surya, the Sun God. Its famous " +
            "stone wheels are among the most recognizable " +
            "features of the temple.";

        image.src =
            "konark-wheel.jpg";
    }


    /* =================================================
       HORSE
    ================================================== */

    else if (type === "horse") {

        category.innerText =
            "SYMBOLISM";

        title.innerText =
            "The Seven Horses";

        text.innerText =
            "The temple was imagined as the chariot " +
            "of Surya, drawn by seven horses. The horses " +
            "form an important part of the temple's " +
            "chariot symbolism.";

        image.src =
            "konark-horse.jpg";
    }


    /* =================================================
       DANCER
    ================================================== */

    else if (type === "dancer") {

        category.innerText =
            "ART & SCULPTURE";

        title.innerText =
            "Stories in Stone";

        text.innerText =
            "Konark is richly decorated with sculptures " +
            "of dancers, musicians, animals and scenes " +
            "representing different aspects of life.";

        image.src =
            "konark-dancer.jpg";
    }


    /* =================================================
       SURYA
    ================================================== */

    else if (type === "surya") {

        category.innerText =
            "RELIGION";

        title.innerText =
            "Surya — The Sun God";

        text.innerText =
            "The Konark temple is dedicated to Surya, " +
            "the Sun God. Representations of Surya are " +
            "an important part of the temple's identity.";

        image.src =
            "konark-surya.jpg";
    }


    /* =================================================
       FOOD
    ================================================== */

    else if (type === "food") {

        category.innerText =
            "ODISHA CULTURE";

        title.innerText =
            "Taste of Odisha";

        text.innerText =
            "Odisha has a rich culinary tradition. " +
            "Regional dishes such as Dalma and Pakhala " +
            "reflect the state's distinctive food culture. " +
            "Traditional sweets are also an important part " +
            "of Odisha's culinary heritage.";

        image.src =
            "konark-food.jpg";
    }


    /* =================================================
       MUSIC
    ================================================== */

    else if (type === "music") {

        category.innerText =
            "MUSIC & CULTURE";

        title.innerText =
            "Music of Odisha";

        text.innerText =
            "Music has an important place in Odisha's " +
            "cultural traditions. Musical traditions are " +
            "closely connected with dance, festivals and " +
            "religious practices.";

        image.src =
            "konark-music.jpg";


        /* Show music player ONLY for Music */

        musicPlayer.classList.add("active");
    }


    /* =================================================
       ARCHITECTURE
    ================================================== */

    else if (type === "architecture") {

        category.innerText =
            "ARCHITECTURE";

        title.innerText =
            "The Architecture of Konark";

        text.innerText =
            "Konark is renowned for its monumental stone " +
            "architecture and detailed carvings. The temple " +
            "was designed as the magnificent chariot of " +
            "Surya, creating a unique architectural form.";

        image.src =
            "konark-architecture.jpg";
    }


    /* =================================================
       HISTORY
    ================================================== */

    else if (type === "history") {

        category.innerText =
            "HISTORY";

        title.innerText =
            "The Story of Konark";

        text.innerText =
            "The Konark Sun Temple is a historic monument " +
            "of Odisha and a remarkable example of medieval " +
            "Indian architecture. Its stone carvings and " +
            "design preserve an important part of India's " +
            "cultural heritage.";

        image.src =
            "konark-history.jpg";
    }


    /* =================================================
       COLLECT BUTTON
    ================================================== */

    if (discovered[type]) {

        collectButton.innerText =
            "DISCOVERY ALREADY COLLECTED ✓";

        collectButton.disabled = true;

        collectButton.style.opacity = "0.5";

        collectButton.style.cursor = "default";

    }

    else {

        collectButton.innerText =
            "COLLECT DISCOVERY ✓";

        collectButton.disabled = false;

        collectButton.style.opacity = "1";

        collectButton.style.cursor = "pointer";
    }


    /* =================================================
       OPEN POPUP
    ================================================= */

    document
        .getElementById("popup")
        .classList.add("active");

}


/* =====================================================
   PLAY / PAUSE MUSIC
===================================================== */

function toggleMusic() {

    if (!odishaMusic) {
        return;
    }


    if (odishaMusic.paused) {

        odishaMusic
            .play()
            .then(function() {

                playMusicButton.innerText =
                    "⏸ PAUSE ODISHA MUSIC";

                musicStatus.innerText =
                    "🎵 Odisha music is playing...";

            })
            .catch(function(error) {

                console.log(
                    "Audio could not be played:",
                    error
                );

                musicStatus.innerText =
                    "Unable to play the audio. " +
                    "Check that odisha-music.mp3 " +
                    "is in the project folder.";
            });

    }

    else {

        odishaMusic.pause();

        playMusicButton.innerText =
            "▶ PLAY ODISHA MUSIC";

        musicStatus.innerText =
            "Music paused.";
    }

}


/* =====================================================
   STOP MUSIC
===================================================== */

function stopMusic() {

    if (!odishaMusic) {
        return;
    }


    odishaMusic.pause();

    odishaMusic.currentTime = 0;


    if (playMusicButton) {

        playMusicButton.innerText =
            "▶ PLAY ODISHA MUSIC";
    }


    if (musicStatus) {

        musicStatus.innerText =
            "Listen to a traditional " +
            "Odisha-inspired melody.";
    }

}


/* =====================================================
   CLOSE POPUP
===================================================== */

function closePopup() {

    stopMusic();


    document
        .getElementById("popup")
        .classList.remove("active");

}


/* =====================================================
   COLLECT DISCOVERY
===================================================== */

function collectClue() {

    if (
        currentElement === null ||
        discovered[currentElement]
    ) {

        return;
    }


    discovered[currentElement] = true;

    clues++;


    document
        .getElementById("clueCount")
        .innerText = clues;


    /* Change discovered object to green */

    const object =
        document.querySelector(
            "." + currentElement
        );


    if (object) {

        object.style.borderColor =
            "#7cff6b";

        object.style.boxShadow =
            "0 0 15px #7cff6b, " +
            "0 0 35px rgba(124,255,107,0.5)";

        object.style.animation =
            "none";
    }


    closePopup();


    /* =================================================
       ALL 8 FOUND
    ================================================== */

    if (clues === 8) {

        setTimeout(function() {

            document
                .getElementById("keyMessage")
                .classList.add("active");

        }, 600);

    }

}


/* =====================================================
   CONTINUE JOURNEY
===================================================== */

function continueJourney() {

    alert(
        "🔑 Key collected!\n\n" +
        "Next: Then vs Now — The Story of Konark"
    );


    /*
       Later we will replace this with:

       window.location.href =
           "then-now.html";
    */

}


/* =====================================================
   WHEN AUDIO FINISHES
===================================================== */

if (odishaMusic) {

    odishaMusic.addEventListener(
        "ended",
        function() {

            playMusicButton.innerText =
                "▶ PLAY ODISHA MUSIC";

            musicStatus.innerText =
                "🎵 Music finished. Play again?";

        }
    );

}