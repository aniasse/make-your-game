import { pattern, pattern1, pattern2, pattern3, pattern4, pattern5 } from "./pattern.js";

const patterns = [pattern, pattern1, pattern2, pattern3, pattern4, pattern5]
const randomIndex = Math.floor(Math.random() * patterns.length);
let lives = 3
// const model = patterns[randomIndex];
const model= pattern5
const gridSize = 15;
const grid = document.getElementById('grid');
const cells = [];

// initialisation des coordonnées du joueur principal
const initPlayerPos = { row: 1, col: 1 };
// delai avant explosion bomb
const bombDelay = 2000;


// Initialisation grid de base
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.col = j;

        // placement murs player et cellules vides
        if (model[i][j] === "X") {
            cell.className = 'cell wall';
        }else if (model[i][j] === "B") {
            cell.className = 'cell brick';
        } else if (i === initPlayerPos.row && j === initPlayerPos.col) {
            cell.className = 'cell empty player';
        } else {
            cell.className = 'cell empty';
        }

        cells.push(cell);
        grid.appendChild(cell);
    }
};

// deplacement joueur principal

document.addEventListener('keydown', (event) => {
    const playerPos = document.querySelector('.player');
    
    let newRow = initPlayerPos.row;
    let newCol = initPlayerPos.col;

    switch (event.key) {
        case 'ArrowUp':
            newRow--;
            break;
        case 'ArrowDown':
            newRow++;
            break;
        case 'ArrowLeft':
            newCol--;
            break;
        case 'ArrowRight':
            newCol++;
            break;
        case ' ':
        case 'Spacebar':
            placeBomb();
            console.log('placement bomb')
            return; 
        default:
            return;
    }

    /*  Vérifiez si les nouvelles coordonnées 
        sont dans les limites de la grille et 
        si la cellule est vide  */
    if (
        newRow >= 0 && newRow < gridSize && 
        newCol >= 0 && newCol < gridSize && 
        model[newRow][newCol] !== "X" &&
        model[newRow][newCol] !== "B"
        ) {
        // Déplacez le joueur vers la nouvelle position
        playerPos.classList.remove('player');
        initPlayerPos.row = newRow;
        initPlayerPos.col = newCol;
        const newplayerPos = cells[newRow * gridSize + newCol];
        newplayerPos.classList.add('player');
    }
});



/* placement bomb  */

function placeBomb() {
    const bombPos = { row: initPlayerPos.row, col: initPlayerPos.col };

    // Récupérer la cellule à la position de la bombe
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];

    // Ajouter la classe 'bomb' à la cellule
    bombCell.classList.add('bomb');
    setTimeout(()=> explodeBomb(bombPos), bombDelay)
}

function explodeBomb(bombPos){
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.remove('bomb')

   // determination onde d'explosion
    propagateExplosion(bombPos.row, bombPos.col);
    propagateExplosion(bombPos.row - 1 , bombPos.col);
    propagateExplosion(bombPos.row + 1 , bombPos.col);
    propagateExplosion(bombPos.row , bombPos.col - 1);
    propagateExplosion(bombPos.row , bombPos.col + 1);
}

 // logique d'explosion

function propagateExplosion(row, col) {
    const currentCell = cells[row * gridSize + col];
    if (model[row][col] !== 'X') {
        currentCell.classList.add('onde');
    }

    setTimeout(() => {
        currentCell.classList.remove('onde');
        if (currentCell.classList.contains('player')) {
            lives--;
            console.log(lives);
            console.log('you lose One live point');
        
            if (lives === 0) {
                console.log('Game Over');
            }
        }
        
    }, 1000);

   // destruction brick
    if (model[row][col] === 'B') {
        model[row][col] = 'V'; 
    }


    if (model[row][col] === 'V') {
        currentCell.classList.remove('brick');
        currentCell.classList.add('empty')
    }
}
