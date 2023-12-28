import { propagateExplosion } from "./bomb.js";
import { model, gridSize, grid, initPlayerPos, cells, path, playerDiv, EndScore, gameOver, gameActivity } from "./constants.js";
import { delay } from "./utils.js";

let score = 0, lives = 3, timerMinutes = 5, timerSeconds = 0, leg = 'right', pausemenu = false,
    bombExploiding = false, canPose = true, Bombs = 1, bombDelay = 2000;




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
        } else if (model[i][j] === "E") {
            cell.className = 'cell enemy'
        }else {
            cell.className = 'cell empty';
        }

        cells.push(cell);
        grid.appendChild(cell);
    }
}


function moveEnemies() {
    const enemies = document.querySelectorAll('.cell.enemy');
    enemies.forEach(enemy => {
        console.log('Enemy position:', enemy.dataset.row, enemy.dataset.col);
        // Générer un mouvement aléatoire (haut, bas, gauche, droite)
        const randomDirection = getRandomDirection();
        enemy.style.backgroundImage = `url(${path}enemy.gif)`
        let newRow = parseInt(enemy.dataset.row);
        let newCol = parseInt(enemy.dataset.col);

        switch (randomDirection) {
            case 'up':
                newRow--;
                break;
            case 'down':
                newRow++;
                break;
            case 'left':
                newCol--;
                break;
            case 'right':
                newCol++;
                break;
            default:
                break;
        }

        // Vérifier si le mouvement est valide
        if (isValidMove(newRow, newCol)) {
            moveEnemyTo(enemy, newRow, newCol);
        }
    });

    // Appeler la fonction de déplacement des ennemis toutes les 500 millisecondes
    setTimeout(moveEnemies, 500);
}

function getRandomDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    const randomIndex = Math.floor(Math.random() * directions.length);
    return directions[randomIndex];
}

function moveEnemyTo(enemy, newRow, newCol) {

    enemy.style.transition = "top 0.5s ease, left 0.5s ease";
    enemy.dataset.row = newRow;
    enemy.dataset.col = newCol;
    enemy.style.top = `${newRow * 40}px`;
    enemy.style.left = `${newCol * 40}px`;
}


document.addEventListener('keydown', handleKeyPress);




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
                console.log('Game Over - Time Up');
                gameEnd()
            }
        }
    }, 1000);

    moveEnemies();
});

function updateTimerUI() {
    timerElement.textContent = `${timerMinutes}:${timerSeconds < 10 ? '0' : ''}${timerSeconds}`;
}

requestAnimationFrame(updateTimerUI)

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

// export {pauseTime};

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



async function placeBomb() {
    console.log("Vous disposez de :", Bombs, "bombs", "Possibilité de placement de bomb :", canPose);

    if (canPose && Bombs > 0 && !bombExploiding) {
        const bombPos = { row: parseInt(playerDiv.dataset.row), col: parseInt(playerDiv.dataset.col) };
        const bombCell = cells[bombPos.row * gridSize + bombPos.col];
        bombCell.classList.add('bomb');

        Bombs--;
        canPose = false; // Désactiver la possibilité de poser une bombe temporairement

        bombExploiding = true;
        setTimeout(async function () {
            await explodeBomb(bombPos);
            canPose = true; // Réactiver la possibilité de poser une bombe
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
    // await delay(100);
    propagateExplosion(bombPos.row - 1, bombPos.col);
    // await delay(100);
    propagateExplosion(bombPos.row + 1, bombPos.col);
    // await delay(100);
    propagateExplosion(bombPos.row, bombPos.col - 1);
    // await delay(100);
    propagateExplosion(bombPos.row, bombPos.col + 1);
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
        gameEnd()
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

function gameEnd() {
    EndScore.textContent = score
    gameOver.classList.add('over')
    grid.style.display = 'none'
    gameActivity.style.display = 'none'
}

