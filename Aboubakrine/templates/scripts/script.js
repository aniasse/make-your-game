import { pattern } from "./pattern.js";

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
        if (pattern[i][j] === "X") {
            cell.className = 'cell wall';
        } else if (i === initPlayerPos.row && j === initPlayerPos.col) {
            cell.className = 'cell player';
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
        default:
            return;
    }

    /*  Vérifiez si les nouvelles coordonnées 
        sont dans les limites de la grille et 
        si la cellule est vide  */
    if (
        newRow >= 0 && newRow < gridSize && 
        newCol >= 0 && newCol < gridSize && 
        pattern[newRow][newCol] !== "X"
        ) {
        // Déplacez le joueur vers la nouvelle position
        playerPos.classList.remove('player');
        initPlayerPos.row = newRow;
        initPlayerPos.col = newCol;
        const newplayerPos = cells[newRow * gridSize + newCol];
        newplayerPos.classList.add('player');
    }
});

// placement bomb 
const bombDelay = 2000; // Délai en millisecondes avant l'explosion de la bombe
let canPlaceBomb = true;

function placeBomb() {
    if (canPlaceBomb) {
        const bombPos = { row: initPlayerPos.row, col: initPlayerPos.col };

        // Créer l'élément de la bombe et l'ajouter à la grille
        const bomb = document.createElement('div');
        bomb.classList.add('cell', 'bomb');
        bomb.dataset.row = bombPos.row;
        bomb.dataset.col = bombPos.col;
        grid.appendChild(bomb);
        console.log(bomb)
        // Définir un délai avant l'explosion de la bombe
        // setTimeout(() => {
        //     explodeBomb(bombPos);
        // }, bombDelay);

        // Empêcher le joueur de placer une autre bombe immédiatement
        canPlaceBomb = false;
        setTimeout(() => {
            canPlaceBomb = true;
        }, bombDelay + 1000); // Permettre au joueur de placer une autre bombe après l'explosion
    }
}


// Écouteur d'événements pour placer des bombes (par exemple, appuyer sur la barre d'espace)
document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        console.log('place bomb')
        placeBomb();
    }
});