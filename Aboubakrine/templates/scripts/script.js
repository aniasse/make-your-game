import { placeBomb } from "./bomb.js";
import { model, gridSize, grid, initPlayerPos, cells, path, playerDiv, EndScore } from "./constants.js";

const gameOver = document.querySelector(".App")
let score = 0


let lives = 3;
let timerMinutes = 5;
let timerSeconds = 0;
let leg = 'right';
let pausemenu = false;

playerDiv.classList.add('player');
playerDiv.dataset.row = initPlayerPos.row;
playerDiv.dataset.col = initPlayerPos.col;
playerDiv.style.backgroundImage = `url(${path}right-3.png)`;

for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.col = j;

        if (i === 1 && j === 1) {
            cell.appendChild(playerDiv);
        }

        if (model[i][j] === "X") {
            cell.className = 'cell wall';
        } else if (model[i][j] === "B") {
            cell.className = 'cell brick';
        } else {
            cell.className = 'cell empty';
        }

        cells.push(cell);
        grid.appendChild(cell);
    }
}

document.addEventListener('keydown', handleKeyPress);

function animate() {
    requestAnimationFrame(animate);
}

document.addEventListener('DOMContentLoaded', () => {

    updateTimerUI();
    animate();

    setInterval(() => {
        if (!pausemenu) {
            if (timerMinutes > 0 || timerSeconds > 0) {
                if (timerSeconds === 0) {
                    timerMinutes--;
                    timerSeconds = 59;
                } else {
                    timerSeconds--;
                }
                updateTimerUI();
            } else {
                console.log('Game Over - Time Up');
                console.log(EndScore)
                EndScore.textContent = score
                gameOver.classList.add('over')
            }
        }
    }, 1000);
});

function updateTimerUI() {
    timerElement.textContent = `${timerMinutes}:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;
}



requestAnimationFrame(animate);

async function handleKeyPress(event) {
    if (pausemenu) return;

    const playerPos = playerDiv;
    let newRow = parseInt(playerDiv.dataset.row);
    let newCol = parseInt(playerDiv.dataset.col);

    switch (event.key) {
        case 'ArrowUp':
            movePlayer('back');
            newRow--;
            break;
        case 'ArrowDown':
            movePlayer('front');
            newRow++;
            break;
        case 'ArrowLeft':
            movePlayer('left');
            newCol--;
            break;
        case 'ArrowRight':
            movePlayer('right');
            newCol++;
            break;
        case ' ':
        case 'Spacebar':
            placeBomb();
            console.log('placement bomb');
            return;
        default:
            return;
    }

    if (isValidMove(newRow, newCol)) {
        movePlayerTo(newRow, newCol);
    }
}

function movePlayer(direction) {
    playerDiv.style.backgroundImage = `url(${path}${direction}-${leg === 'right' ? '1' : '2'}.png)`;
    leg = leg === 'right' ? 'left' : 'right';
}

function isValidMove(row, col) {
    const isBombCell = cells[row * gridSize + col].classList.contains('bomb');
    return (
        row >= 0 &&
        row < gridSize &&
        col >= 0 &&
        col < gridSize &&
        model[row][col] !== "X" &&
        model[row][col] !== "B" &&
        !isBombCell
    );
}

function movePlayerTo(newRow, newCol) {
    playerDiv.style.transition = "top 0.2s ease, left 0.2s ease";
    playerDiv.dataset.row = newRow;
    playerDiv.dataset.col = newCol;
    playerDiv.style.top = `${newRow * 40}px`;
    playerDiv.style.left = `${newCol * 40}px`;
}




export function incrementScore() {
    score += 10;
    scoreElement.textContent = score;
}

export function handlePlayerCollision() {
    lives--;
    console.log('You lose one live point');
    console.log('you have', lives, 'life points')
    updateLivesUI();
    if (lives === 0) {
        console.log('Game Over');
        EndScore.textContent = score
        gameOver.classList.add('over')
        body.classList.add('over')
    }
}


function updateLivesUI() {
    // Supprime toutes les vies actuelles du DOM.
    livesContainer.innerHTML = '';

    // Ajoute le nombre actuel de vies au DOM.
    for (let i = 0; i < lives; i++) {
        const heartIcon = document.createElement('span');
        heartIcon.innerHTML = '&hearts;';
        livesContainer.appendChild(heartIcon);
    }
}


/// pause

function work() {
    function ResumeGame() {
        document.getElementById("pauseContainer").style.zIndex = "0";
        pausemenu = false
        document.body.classList.remove("menu-overlay");
    }
    function RestartGame() {
        window.location.reload()
    }
    function ExitFame() {
        window.location.href = "homepage.html"
    }
    const CONTINUE = document.getElementById("CONTINUE")
    const RESTART = document.getElementById("RESTART")
    const EXIT = document.getElementById("EXIT")
    CONTINUE.addEventListener("click", ResumeGame)
    RESTART.addEventListener("click", RestartGame)
    EXIT.addEventListener("click", ExitFame)
}

document.addEventListener('DOMContentLoaded', work)

document.addEventListener(
    'keydown',
    (event) => {
        if (event.key == 'Escape') {
            if (pausemenu) {
                document.getElementById("pauseContainer").style.zIndex = "0";
                pausemenu = false
                document.body.classList.remove("menu-overlay");

            } else {
                document.getElementById("pauseContainer").style.zIndex = "2";
                pausemenu = true
                document.body.classList.add("menu-overlay");
            }
        }
    })

const scoreElement = document.querySelector('.score span');
const livesContainer = document.querySelector('.lives');
const timerElement = document.querySelector('.timer span');

// Mettez à jour le DOM lors de l'initialisation du jeu.
scoreElement.textContent = score;

updateLivesUI();
updateTimerUI();
