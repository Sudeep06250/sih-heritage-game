/* =========================================
   HERITAGE QUEST
   RESTORE THE PAST
========================================= */


/* =========================================
   LEVEL DATA
========================================= */

const levels = [

    {
        level: 1,

        title: "Konark Sun Temple",

        description:
            "Rebuild the iconic monument of Odisha.",

        image:
            "assets/konark.jpg",

        grid: 2,

        points: 100,

        leftFacts: {

            title: "🏛️ Temple Facts",

            facts: [

                {
                    icon: "📍",
                    label: "Location",
                    text: "Konark, Odisha"
                },

                {
                    icon: "🕰️",
                    label: "Built",
                    text: "13th Century"
                },

                {
                    icon: "☀️",
                    label: "Dedicated to",
                    text: "Sun God, Surya"
                }

            ]

        },

        rightFacts: {

            title: "✨ Did You Know?",

            facts: [

                {
                    icon: "🛞",
                    text:
                        "The temple is designed as <b>Surya's giant chariot.</b>"
                },

                {
                    icon: "☀️",
                    text:
                        "It has <b>24 beautifully carved wheels.</b>"
                },

                {
                    icon: "🏛️",
                    text:
                        "It is a <b>UNESCO World Heritage Site.</b>"
                }

            ]

        }

    },


    {
        level: 2,

        title: "Pattachitra",

        description:
            "Reconstruct Odisha's traditional Pattachitra artwork.",

        image:
            "assets/pattachitra.jpg",

        grid: 3,

        points: 200,

        leftFacts: {

            title: "🎨 Pattachitra Facts",

            facts: [

                {
                    icon: "📍",
                    label: "Origin",
                    text: "Odisha"
                },

                {
                    icon: "🎨",
                    label: "Art Form",
                    text: "Traditional Folk Art"
                },

                {
                    icon: "🖌️",
                    label: "Style",
                    text: "Natural Colours & Fine Lines"
                }

            ]

        },

        rightFacts: {

            title: "✨ Did You Know?",

            facts: [

                {
                    icon: "🖼️",
                    text:
                        "Pattachitra literally means <b>painting on cloth.</b>"
                },

                {
                    icon: "🌿",
                    text:
                        "Traditional artists use <b>natural colours.</b>"
                },

                {
                    icon: "🛕",
                    text:
                        "Many paintings depict stories of <b>Jagannath and Krishna.</b>"
                }

            ]

        }

    },


    {
        level: 3,

        title: "Rashi Patra",

        description:
            "Complete this traditional piece of Odisha heritage art.",

        image:
            "assets/rashipatra.jpg",

        grid: 4,

        points: 300,

        leftFacts: {

            title: "📜 Rashi Patra Facts",

            facts: [

                {
                    icon: "📍",
                    label: "Tradition",
                    text: "Odisha"
                },

                {
                    icon: "📜",
                    label: "Medium",
                    text: "Traditional Manuscript Art"
                },

                {
                    icon: "🌿",
                    label: "Heritage",
                    text: "Ancient Artistic Tradition"
                }

            ]

        },

        rightFacts: {

            title: "✨ Did You Know?",

            facts: [

                {
                    icon: "📖",
                    text:
                        "Traditional Odisha manuscripts preserve <b>stories and knowledge.</b>"
                },

                {
                    icon: "🎨",
                    text:
                        "Decorative illustrations add <b>artistic beauty.</b>"
                },

                {
                    icon: "🏛️",
                    text:
                        "Such traditions help preserve <b>Odisha's cultural heritage.</b>"
                }

            ]

        }

    }

];


/* =========================================
   GAME VARIABLES
========================================= */

let currentLevel = 0;

let score = 0;

let lives = 3;

let timeLeft = 60;

let timerInterval = null;

let draggedPiece = null;

let placedPieces = 0;


/* =========================================
   GET HTML ELEMENTS
========================================= */

const introScreen =
    document.getElementById("introScreen");

const puzzleScreen =
    document.getElementById("puzzleScreen");

const successScreen =
    document.getElementById("successScreen");

const gameOverScreen =
    document.getElementById("gameOverScreen");

const finalScreen =
    document.getElementById("finalScreen");


const startButton =
    document.getElementById("startButton");

const nextButton =
    document.getElementById("nextButton");

const restartButton =
    document.getElementById("restartButton");

const playAgainButton =
    document.getElementById("playAgainButton");


const puzzleBoard =
    document.getElementById("puzzleBoard");

const piecesContainer =
    document.getElementById("piecesContainer");


const scoreDisplay =
    document.getElementById("score");

const livesDisplay =
    document.getElementById("lives");

const timerDisplay =
    document.getElementById("timer");


const levelNumber =
    document.getElementById("levelNumber");

const levelTitle =
    document.getElementById("levelTitle");

const levelDescription =
    document.getElementById("levelDescription");


const successMessage =
    document.getElementById("successMessage");

const finalScore =
    document.getElementById("finalScore");


/* =========================================
   FACT ELEMENTS
========================================= */

const leftFactTitle =
    document.getElementById("leftFactTitle");

const rightFactTitle =
    document.getElementById("rightFactTitle");


const factIcon1 =
    document.getElementById("factIcon1");

const factLabel1 =
    document.getElementById("factLabel1");

const factText1 =
    document.getElementById("factText1");


const factIcon2 =
    document.getElementById("factIcon2");

const factLabel2 =
    document.getElementById("factLabel2");

const factText2 =
    document.getElementById("factText2");


const factIcon3 =
    document.getElementById("factIcon3");

const factLabel3 =
    document.getElementById("factLabel3");

const factText3 =
    document.getElementById("factText3");


const factIcon4 =
    document.getElementById("factIcon4");

const factText4 =
    document.getElementById("factText4");


const factIcon5 =
    document.getElementById("factIcon5");

const factText5 =
    document.getElementById("factText5");


const factIcon6 =
    document.getElementById("factIcon6");

const factText6 =
    document.getElementById("factText6");


/* =========================================
   START BUTTON
========================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* =========================================
   START GAME
========================================= */

function startGame() {

    currentLevel = 0;

    score = 0;

    lives = 3;

    updateScore();

    updateLives();

    startLevel();

}


/* =========================================
   START LEVEL
========================================= */

function startLevel() {

    clearInterval(timerInterval);

    hideAllScreens();

    puzzleScreen.classList.remove(
        "hidden"
    );


    placedPieces = 0;

    draggedPiece = null;
    selectedPiece = null;


    const level =
        levels[currentLevel];


    levelNumber.textContent =
        `LEVEL ${level.level}`;


    levelTitle.textContent =
        `Restore the ${level.title}`;


    levelDescription.textContent =
        level.description;


    /* TIMER */

    timeLeft = 60;

    timerDisplay.textContent =
        timeLeft;


    timerInterval = setInterval(
        () => {

            timeLeft--;

            timerDisplay.textContent =
                timeLeft;


            if (timeLeft <= 0) {

                clearInterval(timerInterval);

                loseLife();

            }

        },
        1000
    );


    createPuzzle(level);

}


/* =========================================
   CREATE PUZZLE
========================================= */

function createPuzzle(level) {

    puzzleBoard.innerHTML = "";

    piecesContainer.innerHTML = "";


    const grid =
        level.grid;


    const totalPieces =
        grid * grid;


    /* BOARD GRID */

    puzzleBoard.style.gridTemplateColumns =
        `repeat(${grid}, 1fr)`;


    /* =====================================
       CREATE EMPTY BOARD SLOTS
    ====================================== */

    for (
        let i = 0;
        i < totalPieces;
        i++
    ) {

        const slot =
            document.createElement("div");


        slot.classList.add(
            "puzzle-slot"
        );


        slot.dataset.position =
            i;


        slot.addEventListener(
            "dragover",
            handleDragOver
        );


        slot.addEventListener(
            "drop",
            handleDrop
        );

        /* Mobile-friendly: tap the destination slot. */
        slot.addEventListener(
            "click",
            handleSlotTap
        );


        puzzleBoard.appendChild(
            slot
        );

    }


    /* =====================================
       CREATE PIECES
    ====================================== */

    let pieces = [];


    for (
        let i = 0;
        i < totalPieces;
        i++
    ) {

        const piece =
            document.createElement("div");


        piece.classList.add(
            "puzzle-piece"
        );


        piece.draggable = true;


        piece.dataset.correctPosition =
            i;


        piece.style.setProperty(
            "--image",
            `url("${level.image}")`
        );


        const row =
            Math.floor(i / grid);


        const column =
            i % grid;


        piece.style.setProperty(
            "--background-size",
            `${grid * 100}% ${grid * 100}%`
        );


        const x =
            (column / (grid - 1)) * 100;


        const y =
            (row / (grid - 1)) * 100;


        piece.style.setProperty(
            "--background-position",
            `${x}% ${y}%`
        );


        piece.addEventListener(
            "dragstart",
            handleDragStart
        );

        /* Mobile-friendly: tap a piece, then tap its correct slot. */
        piece.addEventListener(
            "click",
            handlePieceTap
        );


        pieces.push(piece);

    }


    /* SHUFFLE */

    pieces =
        shuffleArray(pieces);


    /* ADD TO BROKEN PIECES */

    pieces.forEach(
        piece => {

            piecesContainer.appendChild(
                piece
            );

        }
    );

}


/* =========================================
   MOBILE TAP-TO-PLACE
========================================= */

let selectedPiece = null;

function handlePieceTap(event) {

    const piece = event.currentTarget;

    if (!piece.draggable) {
        return;
    }

    if (selectedPiece && selectedPiece !== piece) {
        selectedPiece.classList.remove("selected");
    }

    selectedPiece = piece;
    draggedPiece = piece;

    piece.classList.add("selected");
}


function handleSlotTap(event) {

    if (!selectedPiece) {
        return;
    }

    const slot = event.currentTarget;

    if (slot.children.length > 0) {
        return;
    }

    const correctPosition =
        selectedPiece.dataset.correctPosition;

    const slotPosition =
        slot.dataset.position;

    if (correctPosition === slotPosition) {

        slot.appendChild(selectedPiece);

        selectedPiece.draggable = false;
        selectedPiece.style.cursor = "default";
        selectedPiece.classList.remove("selected");

        slot.classList.add("correct");

        placedPieces++;

        score += 10;
        updateScore();

        const level = levels[currentLevel];
        const totalPieces = level.grid * level.grid;

        selectedPiece = null;
        draggedPiece = null;

        if (placedPieces === totalPieces) {
            puzzleCompleted();
        }

    } else {

        selectedPiece.classList.remove("selected");
        selectedPiece = null;
        draggedPiece = null;

        loseLife();
    }
}


/* =========================================
   DRAG START
========================================= */

function handleDragStart(event) {

    draggedPiece =
        event.target;

}


/* =========================================
   DRAG OVER
========================================= */

function handleDragOver(event) {

    event.preventDefault();

}


/* =========================================
   DROP
========================================= */

function handleDrop(event) {

    event.preventDefault();


    const slot =
        event.currentTarget;


    if (!draggedPiece) {

        return;

    }


    /* Already occupied */

    if (slot.children.length > 0) {

        return;

    }


    const correctPosition =
        draggedPiece.dataset.correctPosition;


    const slotPosition =
        slot.dataset.position;


    /* =====================================
       CORRECT POSITION
    ====================================== */

    if (
        correctPosition ===
        slotPosition
    ) {

        slot.appendChild(
            draggedPiece
        );


        draggedPiece.draggable =
            false;


        draggedPiece.style.cursor =
            "default";


        slot.classList.add(
            "correct"
        );


        placedPieces++;


        score += 10;

        updateScore();


        const level =
            levels[currentLevel];


        const totalPieces =
            level.grid * level.grid;


        if (
            placedPieces ===
            totalPieces
        ) {

            puzzleCompleted();

        }

    }


    /* =====================================
       WRONG POSITION
    ====================================== */

    else {

        loseLife();

    }


    draggedPiece = null;

}


/* =========================================
   PUZZLE COMPLETED
========================================= */

function puzzleCompleted() {

    clearInterval(
        timerInterval
    );


    const level =
        levels[currentLevel];


    score += level.points;


    updateScore();


    updateFacts(level);


    successMessage.textContent =
        `Amazing! You restored the ${level.title}.`;


    setTimeout(
        () => {

            hideAllScreens();

            successScreen.classList.remove(
                "hidden"
            );

        },
        500
    );

}


/* =========================================
   UPDATE FACTS
========================================= */

function updateFacts(level) {


    /* LEFT */

    leftFactTitle.textContent =
        level.leftFacts.title;


    const left =
        level.leftFacts.facts;


    factIcon1.textContent =
        left[0].icon;

    factLabel1.textContent =
        left[0].label;

    factText1.textContent =
        left[0].text;


    factIcon2.textContent =
        left[1].icon;

    factLabel2.textContent =
        left[1].label;

    factText2.textContent =
        left[1].text;


    factIcon3.textContent =
        left[2].icon;

    factLabel3.textContent =
        left[2].label;

    factText3.textContent =
        left[2].text;


    /* RIGHT */

    rightFactTitle.textContent =
        level.rightFacts.title;


    const right =
        level.rightFacts.facts;


    factIcon4.textContent =
        right[0].icon;

    factText4.innerHTML =
        right[0].text;


    factIcon5.textContent =
        right[1].icon;

    factText5.innerHTML =
        right[1].text;


    factIcon6.textContent =
        right[2].icon;

    factText6.innerHTML =
        right[2].text;

}


/* =========================================
   NEXT LEVEL
========================================= */

nextButton.addEventListener(
    "click",
    () => {

        currentLevel++;


        if (
            currentLevel >=
            levels.length
        ) {

            showFinalScreen();

            return;

        }


        startLevel();

    }
);


/* =========================================
   LOSE LIFE
========================================= */

function loseLife() {

    lives--;

    updateLives();


    if (lives <= 0) {

        clearInterval(
            timerInterval
        );


        hideAllScreens();


        gameOverScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   RESTART CURRENT LEVEL
========================================= */

restartButton.addEventListener(
    "click",
    () => {

        lives = 3;

        updateLives();

        startLevel();

    }
);


/* =========================================
   FINAL SCREEN
========================================= */

function showFinalScreen() {

    clearInterval(
        timerInterval
    );


    hideAllScreens();


    finalScreen.classList.remove(
        "hidden"
    );


    finalScore.textContent =
        score;

}


/* =========================================
   PLAY AGAIN
========================================= */

playAgainButton.addEventListener(
    "click",
    () => {

        currentLevel = 0;

        score = 0;

        lives = 3;

        updateScore();

        updateLives();

        startLevel();

    }
);


/* =========================================
   UPDATE SCORE
========================================= */

function updateScore() {

    scoreDisplay.textContent =
        score;

}


/* =========================================
   UPDATE LIVES
========================================= */

function updateLives() {

    livesDisplay.textContent =
        lives;

}


/* =========================================
   HIDE ALL SCREENS
========================================= */

function hideAllScreens() {

    introScreen.classList.add(
        "hidden"
    );


    puzzleScreen.classList.add(
        "hidden"
    );


    successScreen.classList.add(
        "hidden"
    );


    gameOverScreen.classList.add(
        "hidden"
    );


    finalScreen.classList.add(
        "hidden"
    );

}


/* =========================================
   SHUFFLE
========================================= */

function shuffleArray(array) {

    const shuffled =
        [...array];


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
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }


    return shuffled;

}


/* =========================================
   INITIAL STATE
========================================= */

updateScore();

updateLives();

timerDisplay.textContent = 60;