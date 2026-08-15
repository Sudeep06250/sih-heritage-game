/* =========================================
   HERITAGE QUEST
   RESTORE THE PAST PUZZLE
========================================= */


/* ---------- LEVEL DATA ---------- */

const levels = [

    {
        level: 1,

        title: "Restore the Konark Sun Temple",

        description:
            "Rebuild the iconic monument of Odisha.",

        image:
            "assets/konark.jpg",

        grid: 2,

        points: 100
    },

    {
        level: 2,

        title: "Restore the Pattachitra",

        description:
            "Reconstruct Odisha's traditional Pattachitra artwork.",

        image:
            "assets/pattachitra.jpg",

        grid: 3,

        points: 200
    },

    {
        level: 3,

        title: "Restore the Rashi Patra",

        description:
            "Complete this traditional piece of Odisha heritage art.",

        image:
            "assets/rashipatra.jpg",

        grid: 4,

        points: 300
    }

];


/* ---------- GAME VARIABLES ---------- */

let currentLevel = 0;

let score = 0;

let lives = 3;

let timeLeft = 60;

let timerInterval;

let draggedPiece = null;

let placedPieces = 0;


/* ---------- ELEMENTS ---------- */

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
   START GAME
========================================= */

startButton.addEventListener("click", () => {

    currentLevel = 0;

    score = 0;

    lives = 3;

    updateScore();

    updateLives();

    startLevel();

});


/* =========================================
   START LEVEL
========================================= */

function startLevel() {

    clearInterval(timerInterval);

    hideAllScreens();

    puzzleScreen.classList.remove("hidden");

    placedPieces = 0;

    const level = levels[currentLevel];

    levelNumber.textContent =
        `LEVEL ${level.level}`;

    levelTitle.textContent =
        level.title;

    levelDescription.textContent =
        level.description;


    /* TIMER */

    timeLeft = 60;

    timerDisplay.textContent =
        timeLeft;

    timerInterval = setInterval(() => {

        timeLeft--;

        timerDisplay.textContent =
            timeLeft;

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            loseLife();

        }

    }, 1000);


    createPuzzle(level);

}


/* =========================================
   CREATE PUZZLE
========================================= */

function createPuzzle(level) {

    puzzleBoard.innerHTML = "";

    piecesContainer.innerHTML = "";


    const grid = level.grid;

    const totalPieces =
        grid * grid;


    /* GRID SIZE */

    puzzleBoard.style.gridTemplateColumns =
        `repeat(${grid}, 1fr)`;


    /* CREATE BOARD SLOTS */

    for (let i = 0; i < totalPieces; i++) {

        const slot =
            document.createElement("div");

        slot.classList.add("puzzle-slot");

        slot.dataset.position = i;

        slot.addEventListener(
            "dragover",
            handleDragOver
        );

        slot.addEventListener(
            "drop",
            handleDrop
        );

        puzzleBoard.appendChild(slot);

    }


    /* CREATE PIECES */

    let pieces = [];

    for (let i = 0; i < totalPieces; i++) {

        const piece =
            document.createElement("div");

        piece.classList.add("puzzle-piece");

        piece.draggable = true;

        piece.dataset.correctPosition = i;

        /*
            Background image is used instead
            of cutting the actual image.
        */

        piece.style.setProperty(
            "--image",
            `url("${level.image}")`
        );


        /*
            Calculate position inside image.
        */

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


        pieces.push(piece);

    }


    /* SHUFFLE */

    pieces =
        shuffleArray(pieces);


    /* PUT PIECES IN CONTAINER */

    pieces.forEach(piece => {

        piecesContainer.appendChild(piece);

    });

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


    const correctPosition =
        draggedPiece.dataset.correctPosition;


    const slotPosition =
        slot.dataset.position;


    /* CORRECT */

    if (correctPosition === slotPosition) {

        slot.appendChild(draggedPiece);

        draggedPiece.draggable = false;

        draggedPiece.style.cursor =
            "default";

        slot.classList.add("correct");

        placedPieces++;

        score += 10;

        updateScore();


        /*
            Check whether entire puzzle
            is completed.
        */

        const level =
            levels[currentLevel];

        const totalPieces =
            level.grid * level.grid;


        if (placedPieces === totalPieces) {

            puzzleCompleted();

        }

    }


    /* WRONG */

    else {

        loseLife();

    }

}


/* =========================================
   PUZZLE COMPLETED
========================================= */

function puzzleCompleted() {

    clearInterval(timerInterval);


    const level =
        levels[currentLevel];


    score += level.points;


    updateScore();


    setTimeout(() => {

        hideAllScreens();

        successScreen.classList.remove(
            "hidden"
        );


        successMessage.textContent =
            `Amazing! You restored ${level.title}.`;

    }, 500);

}


/* =========================================
   NEXT LEVEL
========================================= */

nextButton.addEventListener("click", () => {

    currentLevel++;

    if (currentLevel >= levels.length) {

        showFinalScreen();

        return;

    }

    startLevel();

});


/* =========================================
   LOSE LIFE
========================================= */

function loseLife() {

    lives--;

    updateLives();


    if (lives <= 0) {

        clearInterval(timerInterval);

        hideAllScreens();

        gameOverScreen.classList.remove(
            "hidden"
        );

    }

}


/* =========================================
   RESTART
========================================= */

restartButton.addEventListener("click", () => {

    lives = 3;

    updateLives();

    startLevel();

});


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
   FINAL SCREEN
========================================= */

function showFinalScreen() {

    clearInterval(timerInterval);

    hideAllScreens();

    finalScreen.classList.remove(
        "hidden"
    );

    finalScore.textContent =
        score;

}


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
   HIDE SCREENS
========================================= */

function hideAllScreens() {

    introScreen.classList.add("hidden");

    puzzleScreen.classList.add("hidden");

    successScreen.classList.add("hidden");

    gameOverScreen.classList.add("hidden");

    finalScreen.classList.add("hidden");

}


/* =========================================
   SHUFFLE ARRAY
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