import { placeBomb } from "./bomb.mjs";

let legState = 'left';

export function movePlayer(event, initPlayerPos, gridSize, model, cells) {
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
            console.log('placement bomb');
            return;
        default:
            return;
    }

    if (
        newRow >= 0 && newRow < gridSize &&
        newCol >= 0 && newCol < gridSize &&
        model[newRow][newCol] !== "X" &&
        model[newRow][newCol] !== "B"
    ) {
        playerPos.classList.remove('player');
        initPlayerPos.row = newRow;
        initPlayerPos.col = newCol;
        const newPlayerPos = cells[newRow * gridSize + newCol];
        newPlayerPos.classList.toggle('player','player-left', newRow === initPlayerPos.row && newCol < initPlayerPos.col);
        newPlayerPos.classList.toggle('player','player-right', newRow === initPlayerPos.row && newCol > initPlayerPos.col);
        newPlayerPos.classList.toggle('player-front-left', newRow > initPlayerPos.row);
        newPlayerPos.classList.toggle('player-front-right', newRow > initPlayerPos.row);
        newPlayerPos.classList.toggle('player-back-left', newRow < initPlayerPos.row);
        newPlayerPos.classList.toggle('player-back-right', newRow < initPlayerPos.row);
    
    }
}
