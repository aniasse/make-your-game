import { pattern, pattern1, pattern2, pattern3, pattern4, pattern5 } from "./pattern.js";

const patterns = [pattern, pattern1, pattern2, pattern3, pattern4, pattern5]
const randomIndex = Math.floor(Math.random() * patterns.length);
const model = patterns[randomIndex];

const gridSize = 15;
const grid = document.getElementById('grid');
const cells = [];

// initialisation des coordonnées du joueur principal
const initPlayerPos = { row: 1, col: 1 };



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
const bombDelay = 2000; // Délai en millisecondes avant l'explosion de la bombe

function placeBomb() {
    const bombPos = { row: initPlayerPos.row, col: initPlayerPos.col };

    // Récupérer la cellule à la position de la bombe
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];

    // Ajouter la classe 'bomb' à la cellule
    bombCell.classList.add('bomb');
}

