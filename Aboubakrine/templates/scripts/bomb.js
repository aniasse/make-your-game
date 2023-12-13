import { playerDiv, cells, gridSize, bombDelay, model } from "./constants.js";
import { delay } from "./utils.js";
import { incrementScore, handlePlayerCollision } from "./script.js";
let Bombs = 1
let canPose;
if (Bombs > 0) {
    canPose = true
} else {
    canPose = false
}


let bombExploiding = false;
async function placeBomb() {
    console.log("vous disposew de :", Bombs, "bombs", "possibility de placement de bomb : ", canPose)
    if (canPose && !bombExploiding) {
        const bombPos = { row: parseInt(playerDiv.dataset.row), col: parseInt(playerDiv.dataset.col) };
        const bombCell = cells[bombPos.row * gridSize + bombPos.col];
        bombCell.classList.add('bomb');
        Bombs--
        bombExploiding = true;
        await delay(bombDelay);
        explodeBomb(bombPos);
        await delay(1000)
        bombExploiding = false
    }
    await delay(bombDelay)

}

async function explodeBomb(bombPos) {
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.remove('bomb');
    Bombs++
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
export { placeBomb } 