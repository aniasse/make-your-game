import { propagateExplosion } from "./bomb.js";
import { model, gridSize, grid, initPlayerPos, cells, path, playerDiv, EndScore, gameOver, gameActivity, GameWon, winScore } from "./constants.js";
import { delay, requestTimeout } from "./utils.js";

let score = 0, lives = 3, timerMinutes = 5, timerSeconds = 0, leg = 'right', pausemenu = false,
    bombExploiding = false, canPose = true, Bombs = 1, bombDelay = 2000;


playerDiv.classList.add('player');
playerDiv.dataset.row = initPlayerPos.row;
playerDiv.dataset.col = initPlayerPos.col;
playerDiv.style.backgroundImage = `url(${path}right-3.png)`;
playerDiv.style.willChange = 'transform';

// initialisation grid

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
        } else if (model[i][j] === "E") {
            const enemyDiv = createEnemy(i, j);
            cell.className = 'cell empty';
            cell.appendChild(enemyDiv);
        } else {
            cell.className = 'cell empty';
        }

        cells.push(cell);
        grid.appendChild(cell);
    }
}

let enemies = document.querySelectorAll('.enemy');


function moveEnemies() {

    enemies.forEach(enemyDiv => {
        const randomDirection = getRandomDirection();
        let newRow = parseInt(enemyDiv.dataset.row), newCol = parseInt(enemyDiv.dataset.col);
        switch (randomDirection) {
            case 'up':
                if (!pausemenu && isValidMove(newRow - 1, newCol) && !enemiesCollision(newRow - 1, newCol, enemyDiv, enemies)) {
                    moveEnemyTo(enemyDiv, newRow - 1, newCol);
                    newRow--;
                }
                break;
            case 'down':
                if (!pausemenu && isValidMove(newRow + 1, newCol) && !enemiesCollision(newRow + 1, newCol, enemyDiv, enemies)) {
                    moveEnemyTo(enemyDiv, newRow + 1, newCol);
                    newRow++;
                }
                break;
            case 'left':
                if (!pausemenu && isValidMove(newRow, newCol - 1) && !enemiesCollision(newRow, newCol - 1, enemyDiv, enemies)) {
                    moveEnemyTo(enemyDiv, newRow, newCol - 1);
                    newCol--;
                }
                break;
            case 'right':
                if (!pausemenu && isValidMove(newRow, newCol + 1) && !enemiesCollision(newRow, newCol + 1, enemyDiv, enemies)) {
                    moveEnemyTo(enemyDiv, newRow, newCol + 1);
                    newCol++;
                }
                break;
            default:
                break;
        }

    });

    if (lives > 0) requestTimeout(moveEnemies, 2000);
}

const win = () => {
    if (enemies.length === 0) {
        winner();
    }
} 


function enemyKil() {
    enemies = document.querySelectorAll('.enemy')
    for (const enemyDiv of enemies) {
        const enemyRow = parseInt(enemyDiv.dataset.row);
        const enemyCol = parseInt(enemyDiv.dataset.col);
        const playerRow = parseInt(playerDiv.dataset.row);
        const playerCol = parseInt(playerDiv.dataset.col);
        if (enemyRow === playerRow && enemyCol === playerCol && !pausemenu) {
            handlePlayerCollision();
        }
    }
}

function enemiesCollision(newRow, newCol, currentEnemy, allEnemies) {
    for (const enemy of allEnemies) {
        if (enemy !== currentEnemy) {
            const enemyRow = parseInt(enemy.dataset.row);
            const enemyCol = parseInt(enemy.dataset.col);

            if (newRow === enemyRow && newCol === enemyCol) {
                return true
            }
        }
    }
    return false
}


function getRandomDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function createEnemy(row, col) {
    const enemyDiv = document.createElement('div');
    enemyDiv.classList.add('enemy');
    enemyDiv.dataset.row = row;
    enemyDiv.dataset.col = col;
    enemyDiv.style.backgroundImage = `url(${path}enemy.gif)`;

    return enemyDiv;
}

function moveEnemyTo(enemyDiv, newRow, newCol) {
    enemyDiv.style.transition = "top 0.5s ease, left 0.5s ease";
    enemyDiv.dataset.row = newRow;
    enemyDiv.dataset.col = newCol;
    enemyDiv.style.top = `${newRow * 40}px`;
    enemyDiv.style.left = `${newCol * 40}px`;

    enemyKil()
}


document.addEventListener('keydown', handleKeyPress, { passive: true });


// Timer

document.addEventListener('DOMContentLoaded', () => {

    updateTimerUI();

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
                gameEnd()
            }
        }
    }, 1000);

    moveEnemies();
});

 


function updateTimerUI() {
    timerElement.textContent = `${timerMinutes}:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;
    win();
}

requestAnimationFrame(updateTimerUI)

// gestion deplacement joueur

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
    enemyKil()
}



async function placeBomb() {

    if (canPose && Bombs > 0 && !bombExploiding && lives > 0 && enemies.length > 0) {
        const bombPos = { row: parseInt(playerDiv.dataset.row), col: parseInt(playerDiv.dataset.col) };
        const bombCell = cells[bombPos.row * gridSize + bombPos.col];
        bombCell.classList.add('bomb');

        Bombs--;
        canPose = false;

        bombExploiding = true;
       requestTimeout(async function () {
            await explodeBomb(bombPos);
            canPose = true;
            bombExploiding = false;
        }, bombDelay);
    }
}

async function explodeBomb(bombPos) {
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    while (pausemenu) {
        await delay(1)
    }
    await delay(1000)
    bombCell.classList.remove('bomb');
    Bombs++
    propagateExplosion(bombPos.row, bombPos.col);
    propagateExplosion(bombPos.row - 1, bombPos.col);
    propagateExplosion(bombPos.row + 1, bombPos.col);
    propagateExplosion(bombPos.row, bombPos.col - 1);
    propagateExplosion(bombPos.row, bombPos.col + 1);
}

export function incrementScore() {
    score += 10;
    scoreElement.textContent = score;
}
export function incrementScore2() {
    score += 100;
    scoreElement.textContent = score;
}
let invincible = false;

export function handlePlayerCollision() {
    if (!invincible) {
        lives--;
        if (lives > 0) {
            invincible = true;
            setTimeout(() => {
                invincible = false;
            }, 1000);
            updateLivesUI();
        } else {
            gameEnd();
        }
    }
}


function updateLivesUI() {
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

const battleScene = document.querySelector(".scene")

function gameEnd() {
    EndScore.textContent = score
    gameOver.classList.add('over')
    battleScene.style.display = 'none'
    gameActivity.style.display = 'none'
}

function winner() {
    winScore.textContent = score
    GameWon.classList.add('winner')
    battleScene.style.display = 'none'
    gameActivity.style.display = 'none'
}

