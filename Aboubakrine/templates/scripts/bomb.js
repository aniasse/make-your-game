import { playerDiv, cells, gridSize, model } from "./constants.js";

import { incrementScore, incrementScore2, handlePlayerCollision, } from "./script.js";




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
        const enemies = document.querySelectorAll('.enemy');
        enemies.forEach(enemyDiv => {
            const enemyRow = parseInt(enemyDiv.dataset.row);
            const enemyCol = parseInt(enemyDiv.dataset.col);

            if (row === enemyRow && col === enemyCol) {
                enemyDiv.remove();
                incrementScore2();
            }
        });
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
export { propagateExplosion } 