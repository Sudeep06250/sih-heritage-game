<script>

/* =========================================================
   HERITAGE QUEST — MODE 1
   SOUND IDENTIFIER
   EXACT 6 AUDIO/ANSWER MAPPINGS
========================================================= */

const GAME_ITEMS = {

    bell: {
        name: "TEMPLE BELL",
        audio: "assets/audio/Bell.mp3"
    },

    flute: {
        name: "FLUTE",
        audio: "assets/audio/Flute.mp3"
    },

    mardala: {
        name: "MARDALA",
        audio: "assets/audio/Mardala.mp3"
    },

    ocean: {
        name: "OCEAN",
        audio: "assets/audio/Ocean.mp3"
    },

    odissi: {
        name: "ODISSI",
        audio: "assets/audio/Odishi.mp3"
    },

    shankha: {
        name: "SHANKHA",
        audio: "assets/audio/Sankha.mp3"
    }

};


/* =========================================================
   QUESTIONS
========================================================= */

const ALL_QUESTIONS = [
    "bell",
    "flute",
    "mardala",
    "ocean",
    "odissi",
    "shankha"
];

let questions = [...ALL_QUESTIONS];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let bestStreak = 0;
let correctAnswers = 0;

let selectedAnswer = null;
let locked = false;


/* =========================================================
   AUDIO
========================================================= */

/*
    IMPORTANT:
    We are deliberately using a normal HTML Audio object.

    NO AudioContext.
    NO MediaElementSource.
    NO GainNode.

    This is much safer for local files opened through
    file:// in Edge/Chrome.
*/

const audio = new Audio();

audio.preload = "auto";
audio.loop = false;
audio.volume = 1.0;


/* =========================================================
   GET PAGE ELEMENTS
========================================================= */

const soundButton =
    document.getElementById("soundButton");

const soundStatus =
    document.getElementById("soundStatus");

const submitButton =
    document.getElementById("submitButton");

const cardElements =
    document.querySelectorAll(".card");

const scoreElement =
    document.getElementById("score");

const streakElement =
    document.getElementById("streak");

const questionHeader =
    document.getElementById("questionHeader");

const questionNumber =
    document.getElementById("questionNumber");

const progressPercent =
    document.getElementById("progressPercent");

const progressFill =
    document.getElementById("progressFill");

const feedback =
    document.getElementById("feedback");


/* =========================================================
   SHUFFLE
========================================================= */

function shuffle(array) {

    const shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled;
}


/* =========================================================
   STOP AUDIO
========================================================= */

function stopAudio() {

    audio.pause();

    /*
       Reset to the beginning so that if the
       player is clicked again, the sound starts
       from the beginning.
    */

    audio.currentTime = 0;

    soundButton.classList.remove("playing");

    soundButton.textContent = "▶";

    soundStatus.textContent = "PLAY SOUND";
}


/* =========================================================
   LOAD CURRENT QUESTION
========================================================= */

function loadQuestion() {

    locked = false;

    selectedAnswer = null;

    /*
       VERY IMPORTANT:
       Always stop the previous sound first.
    */

    stopAudio();


    /*
       Remove all previous card states.
    */

    cardElements.forEach(card => {

        card.classList.remove(
            "selected",
            "correct",
            "wrong"
        );

    });


    submitButton.disabled = true;


    /*
       Get the exact answer ID for this question.
    */

    const answerId =
        questions[currentQuestion];


    /*
       Get the exact matching game object.
    */

    const item =
        GAME_ITEMS[answerId];


    if (!item) {

        console.error(
            "ERROR: No game item found for:",
            answerId
        );

        return;
    }


    /*
       =====================================================
       EXACT AUDIO MAPPING
       =====================================================

       bell    → assets/audio/Bell.mp3
       flute   → assets/audio/Flute.mp3
       mardala → assets/audio/Mardala.mp3
       ocean   → assets/audio/Ocean.mp3
       odissi  → assets/audio/Odishi.mp3
       shankha → assets/audio/Sankha.mp3
    */

    audio.src = item.audio;

    audio.load();


    /*
       Normal browser volume.
    */

    audio.volume = 1.0;


    updateUI();


    console.log(
        "QUESTION:",
        currentQuestion + 1,
        "| ANSWER:",
        item.name,
        "| AUDIO:",
        item.audio
    );
}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    const question =
        currentQuestion + 1;


    questionHeader.textContent =
        `${question} / 6`;


    questionNumber.textContent =
        `${question} / 6`;


    /*
       Example:
       Question 1 → 0%
       Question 2 → 17%
       Question 3 → 33%
       ...
       Question 6 → 83%
    */

    const progress =
        Math.round(
            (currentQuestion / 6) * 100
        );


    progressPercent.textContent =
        `${progress}%`;


    progressFill.style.width =
        `${progress}%`;


    scoreElement.textContent =
        score;


    streakElement.textContent =
        streak;
}


/* =========================================================
   PLAY / STOP BUTTON
========================================================= */

soundButton.addEventListener(
    "click",
    async function() {

        /*
           If the current question is locked,
           don't allow playback.
        */

        if (locked) {
            return;
        }


        /*
           IF SOUND IS CURRENTLY PLAYING:
           CLICK AGAIN = STOP.
        */

        if (!audio.paused) {

            stopAudio();

            return;
        }


        /*
           Make sure the correct audio is loaded.
        */

        const answerId =
            questions[currentQuestion];

        const item =
            GAME_ITEMS[answerId];


        if (!item) {

            console.error(
                "Audio mapping missing."
            );

            return;
        }


        /*
           Safety check.
           If browser hasn't loaded the correct
           source, load it again.
        */

        if (
            !audio.src ||
            !audio.src.endsWith(item.audio)
        ) {

            audio.src =
                item.audio;

            audio.load();

        }


        /*
           ALWAYS START FROM CURRENT POSITION.

           Since stopAudio() resets to 0,
           a fresh click normally starts at 0.
        */

        try {

            await audio.play();


            soundButton.classList.add(
                "playing"
            );

            soundButton.textContent =
                "■";

            soundStatus.textContent =
                "STOP SOUND";


        } catch (error) {

            console.error(
                "AUDIO PLAYBACK ERROR:",
                error
            );


            showFeedback(
                "Audio could not play. Check the MP3 file path.",
                "error"
            );

        }

    }
);


/* =========================================================
   AUDIO EVENTS
========================================================= */

audio.addEventListener(
    "ended",
    function() {

        soundButton.classList.remove(
            "playing"
        );

        soundButton.textContent =
            "▶";

        soundStatus.textContent =
            "PLAY SOUND";

        audio.currentTime = 0;

    }
);


/*
   If the browser pauses the audio for any
   other reason, update the button.
*/

audio.addEventListener(
    "pause",
    function() {

        if (
            audio.currentTime >=
            audio.duration
        ) {
            return;
        }

        soundButton.classList.remove(
            "playing"
        );

        soundButton.textContent =
            "▶";

        soundStatus.textContent =
            "PLAY SOUND";

    }
);


/* =========================================================
   AUDIO ERROR
========================================================= */

audio.addEventListener(
    "error",
    function() {

        console.error(
            "FAILED TO LOAD AUDIO:",
            audio.src
        );


        showFeedback(
            "Audio file could not be loaded.",
            "error"
        );

    }
);


/* =========================================================
   SELECT ANSWER CARD
========================================================= */

cardElements.forEach(card => {

    function selectCard() {

        if (locked) {
            return;
        }


        /*
           Remove selection from all cards.
        */

        cardElements.forEach(other => {

            other.classList.remove(
                "selected"
            );

        });


        /*
           Select clicked card.
        */

        card.classList.add(
            "selected"
        );


        selectedAnswer =
            card.dataset.answer;


        submitButton.disabled =
            false;

    }


    card.addEventListener(
        "click",
        selectCard
    );


    /*
       Keyboard accessibility.
    */

    card.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                selectCard();

            }

        }
    );

});


/* =========================================================
   SUBMIT ANSWER
========================================================= */

submitButton.addEventListener(
    "click",
    function() {

        if (
            !selectedAnswer ||
            locked
        ) {

            return;

        }


        /*
           Stop sound when answer is submitted.
        */

        stopAudio();


        /*
           The correct answer is determined
           DIRECTLY from the question ID.

           It is NOT determined from card position.
        */

        const correctAnswer =
            questions[currentQuestion];


        /* =================================================
           CORRECT ANSWER
        ================================================= */

        if (
            selectedAnswer ===
            correctAnswer
        ) {

            locked = true;


            score += 10;

            streak++;

            correctAnswers++;


            if (
                streak > bestStreak
            ) {

                bestStreak =
                    streak;

            }


            const selectedCard =
                document.querySelector(
                    `.card[data-answer="${selectedAnswer}"]`
                );


            if (selectedCard) {

                selectedCard.classList.remove(
                    "selected"
                );

                selectedCard.classList.add(
                    "correct"
                );

            }


            scoreElement.textContent =
                score;

            streakElement.textContent =
                streak;


            submitButton.disabled =
                true;


            showFeedback(
                "✓ CORRECT! +10 POINTS",
                "success"
            );


            /*
               Automatically move to next
               question after 1.1 seconds.
            */

            setTimeout(
                function() {

                    currentQuestion++;


                    if (
                        currentQuestion >= 6
                    ) {

                        finishGame();

                    } else {

                        loadQuestion();

                    }

                },
                1100
            );

        }


        /* =================================================
           WRONG ANSWER
        ================================================= */

        else {

            streak = 0;

            streakElement.textContent =
                streak;


            const selectedCard =
                document.querySelector(
                    `.card[data-answer="${selectedAnswer}"]`
                );


            if (selectedCard) {

                selectedCard.classList.add(
                    "wrong"
                );

            }


            showFeedback(
                "✕ INCORRECT — TRY AGAIN",
                "error"
            );


            /*
               Give the player another attempt.
            */

            setTimeout(
                function() {

                    if (selectedCard) {

                        selectedCard.classList.remove(
                            "wrong",
                            "selected"
                        );

                    }


                    selectedAnswer =
                        null;

                    submitButton.disabled =
                        true;

                },
                650
            );

        }

    }
);


/* =========================================================
   FEEDBACK
========================================================= */

let feedbackTimer = null;

function showFeedback(
    message,
    type
) {

    clearTimeout(
        feedbackTimer
    );


    feedback.textContent =
        message;


    feedback.className =
        `feedback show ${type}`;


    feedbackTimer =
        setTimeout(
            function() {

                feedback.classList.remove(
                    "show"
                );

            },
            1100
        );

}


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame() {

    stopAudio();


    progressPercent.textContent =
        "100%";


    progressFill.style.width =
        "100%";


    document.getElementById(
        "finalScore"
    ).textContent =
        `${score} / 60`;


    document.getElementById(
        "finalCorrect"
    ).textContent =
        `${correctAnswers} / 6`;


    document.getElementById(
        "finalBestStreak"
    ).textContent =
        bestStreak;


    document.getElementById(
        "finalAccuracy"
    ).textContent =
        `${Math.round(
            (correctAnswers / 6) * 100
        )}%`;


    document.getElementById(
        "completion"
    ).classList.add(
        "show"
    );

}


/* =========================================================
   PLAY AGAIN
========================================================= */

document.getElementById(
    "playAgain"
).addEventListener(
    "click",
    function() {

        stopAudio();


        score = 0;

        streak = 0;

        bestStreak = 0;

        correctAnswers = 0;

        currentQuestion = 0;

        selectedAnswer = null;

        locked = false;


        questions =
            shuffle(ALL_QUESTIONS);


        document.getElementById(
            "completion"
        ).classList.remove(
            "show"
        );


        scoreElement.textContent =
            "0";


        streakElement.textContent =
            "0";


        progressPercent.textContent =
            "0%";


        progressFill.style.width =
            "0%";


        loadQuestion();

    }
);


/* =========================================================
   JOURNAL / MAP / INVENTORY
========================================================= */

const modal =
    document.getElementById(
        "infoModal"
    );

const modalTitle =
    document.getElementById(
        "modalTitle"
    );

const modalText =
    document.getElementById(
        "modalText"
    );

const modalClose =
    document.getElementById(
        "modalClose"
    );


const modalContent = {

    journal: {

        title: "JOURNAL",

        text: `
            <p>
                <strong>Echoes of Bharat — Mode 1</strong>
            </p>

            <p>
                You are exploring the soundscape of
                Konark through six cultural elements.
                Listen carefully and identify each sound.
            </p>

            <p>
                Every correct identification earns
                <strong>10 points</strong>.
            </p>
        `

    },


    map: {

        title: "MAP",

        text: `
            <p>
                <strong>KONARK SUN TEMPLE</strong>
            </p>

            <p>
                Location: Konark, Odisha, India.
            </p>

            <p>
                Current quest location:
                <strong>Konark — Mode 1.</strong>
            </p>
        `

    },


    inventory: {

        title: "INVENTORY",

        text: `
            <p>
                <strong>HERITAGE ELEMENTS</strong>
            </p>

            <p>
                Your Mode 1 collection contains exactly
                six elements:
            </p>

            <p>
                • Temple Bell<br>
                • Flute<br>
                • Mardala<br>
                • Ocean<br>
                • Odissi<br>
                • Shankha
            </p>
        `

    }

};


/* =========================================================
   TOP BUTTONS
========================================================= */

document.querySelectorAll(
    ".top-action"
).forEach(button => {

    button.addEventListener(
        "click",
        function() {

            const type =
                button.dataset.modal;

            const data =
                modalContent[type];


            if (!data) {
                return;
            }


            modalTitle.textContent =
                data.title;


            modalText.innerHTML =
                data.text;


            modal.classList.add(
                "show"
            );

        }
    );

});


/* =========================================================
   CLOSE MODAL
========================================================= */

modalClose.addEventListener(
    "click",
    function() {

        modal.classList.remove(
            "show"
        );

    }
);


modal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "show"
            );

        }

    }
);


/* =========================================================
   START GAME
========================================================= */

questions =
    shuffle(ALL_QUESTIONS);


loadQuestion();

</script>