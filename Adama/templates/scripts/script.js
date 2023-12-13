import { model, gridSize, grid, initPlayerPos, bombDelay, cells, path } from "./constants.js";

let score = 0;
let timerMinutes = 5;
let timerSeconds = 0;
let lives = 3;
let leg = 'right';
let pausemenu = false;
let canPose = true;
let bombExploiding = false;
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
class Enemy {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.element = document.createElement('div');
        this.element.classList.add('enemy');
        // Ajouter l'élément ennemi à la grille.
        cells.push(this.element);
        grid.appendChild(this.element);
    }

    async move() {
          // Générer un nombre aléatoire entre 0 et 3 pour déterminer la direction.
          const randomDirection = Math.floor(Math.random() * 4);

          // Sauvegarder la position actuelle pour la mise à jour après le délai.
          const currentRow = this.row;
          const currentCol = this.col;
  
          // Déplacer l'ennemi en fonction de la direction aléatoire.
          switch (randomDirection) {
              case 0: // Haut
                  this.row = Math.max(this.row - 1, 0);
                  break;
              case 1: // Bas
                  this.row = Math.min(this.row + 1, gridSize - 1);
                  break;
              case 2: // Gauche
                  this.col = Math.max(this.col - 1, 0);
                  break;
              case 3: // Droite
                  this.col = Math.min(this.col + 1, gridSize - 1);
                  break;
              default:
                  break;
          }
  
          // Vérifier si le mouvement est valide en utilisant isValidMove.
          if (isValidMove(this.row, this.col)) {
              // Mettre à jour la position après un délai de 200 millisecondes.
            //   await delay(200);
              this.updatePosition();
          } else {
              // Revertir à la position initiale s'il y a un mouvement invalide.
              this.row = currentRow;
              this.col = currentCol;
          }
    }

    updatePosition() {
        // Mettre à jour la position de l'élément ennemi dans le DOM.
        this.element.style.transition = "top 1s ease, left 1s ease";
        this.element.dataset.row = this.row;
        this.element.dataset.col = this.col;
        this.element.style.top = `${this.row * 40}px`;
        this.element.style.left = `${this.col * 40}px`;
    }
    destroy() {
        // Supprimer l'élément ennemi de la grille.
        cells.splice(cells.indexOf(this.element), 1);
        grid.removeChild(this.element);
    }

}

const enemies = [
    new Enemy(13, 1),
    new Enemy(13, 1),
    new Enemy(13, 1),
    new Enemy(13, 1),
];

function animate() {
    requestAnimationFrame(animate);
    enemies.forEach(enemy => {
        enemy.move();
    });


}

document.addEventListener('DOMContentLoaded', () => {

    updateTimerUI();
    animate();

    setInterval(() => {
        if (!pausemenu){
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

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function placeBomb() {
    if (canPose && !bombExploiding){
        const bombPos = { row: parseInt(playerDiv.dataset.row), col: parseInt(playerDiv.dataset.col) };
        const bombCell = cells[bombPos.row * gridSize + bombPos.col];
        bombCell.classList.add('bomb');
        canPose = false;
        bombExploiding = true;
        await delay(bombDelay);
        explodeBomb(bombPos);
        await delay(1000)
        bombExploiding = false
    }
    await delay(bombDelay )
    canPose = true;
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
            incrementScore();
        }

        if (model[row][col] === 'V') {
            currentCell.classList.remove('brick');
            currentCell.classList.add('empty');
        }
    }, 1000);
}


function incrementScore() {
    score += 10; 
    scoreElement.textContent = score;
}

function handlePlayerCollision() {
    lives--;
    console.log('You lose one live point');
    console.log('you have', lives, 'life points')
    updateLivesUI();
    if (lives === 0) {
        console.log('Game Over');
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