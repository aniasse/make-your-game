// import { pattern } from "./pattern,js";

const gridSize = 15;
const grid = document.getElementById('grid');
const cells = [];

// initialise les coordonnées du joueur principal
const initPlayerPos = { row: 1, col: 1 };

const pattern = [
    "XXXXXXXXXXXXXXX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XVXVXVXVXVXVXVX",
    "XVVVVVVVVVVVVVX",
    "XXXXXXXXXXXXXXX"
];


// Initialisation grid de base
for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement('div');
        cell.dataset.row = i;
        cell.dataset.col = j;

        // placement murs et cellules vides
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

// depacement jouer principal

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

    // Vérifiez si les nouvelles coordonnées sont dans les limites de la grille et si la cellule est vide
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
