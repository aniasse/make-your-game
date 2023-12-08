import { model, gridSize, grid, initPlayerPos, bombDelay, cells, path } from "./constants.js";

let lives = 3;
console.log('you have', lives, 'life points');
let leg = 'right';
let pausemenu = false;

const playerDiv = document.createElement('div');
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
    return (
        row >= 0 &&
        row < gridSize &&
        col >= 0 &&
        col < gridSize &&
        model[row][col] !== "X" &&
        model[row][col] !== "B"
    );
}

function movePlayerTo(newRow, newCol) {
    playerDiv.style.transition = "top 0.2s ease, left 0.2s ease";
    playerDiv.dataset.row = newRow;
    playerDiv.dataset.col = newCol;
    playerDiv.style.top = `${newRow * 40}px`;
    playerDiv.style.left = `${newCol * 40}px`;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function placeBomb() {
    const bombPos = { row: parseInt(playerDiv.dataset.row), col: parseInt(playerDiv.dataset.col) };
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.add('bomb');

    await delay(bombDelay);
    explodeBomb(bombPos);
}

async function explodeBomb(bombPos) {
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.remove('bomb');

    propagateExplosion(bombPos.row, bombPos.col);
    await delay(100);
    propagateExplosion(bombPos.row - 1, bombPos.col);
    await delay(100);
    propagateExplosion(bombPos.row + 1, bombPos.col);
    await delay(100);
    propagateExplosion(bombPos.row, bombPos.col - 1);
    await delay(100);
    propagateExplosion(bombPos.row, bombPos.col + 1);
}

// logique d'explosion
function propagateExplosion(row, col) {
    const currentCell = cells[row * gridSize + col];

    if (model[row][col] !== 'X') {
        currentCell.classList.add('onde');
    }

    setTimeout(() => {
        currentCell.classList.remove('onde');

        // Vérifie la collision avec le joueur
        const playerRow = parseInt(playerDiv.dataset.row);
        const playerCol = parseInt(playerDiv.dataset.col);

        if (row === playerRow && col === playerCol) {
            handlePlayerCollision();
        }

        // Destruction de la brique
        if (model[row][col] === 'B') {
            model[row][col] = 'V';
        }

        if (model[row][col] === 'V') {
            currentCell.classList.remove('brick');
            currentCell.classList.add('empty');
        }
    }, 1000);
}

function handlePlayerCollision() {
    lives--;
    console.log('You lose one live point');
    console.log('you have', lives, 'life points')
    if (lives === 0) {
        console.log('Game Over');
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
        alert("RESTART")
    }
    function ExitFame() {
        alert("QUIT GAME")
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
