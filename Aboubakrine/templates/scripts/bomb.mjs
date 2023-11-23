
export function placeBomb(initPlayerPos, cells, gridSize, bombDelay) {
    const bombPos = { row: initPlayerPos.row, col: initPlayerPos.col };
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.add('bomb');
    setTimeout(() => explodeBomb(bombPos, cells, gridSize), bombDelay);
}

export function explodeBomb(bombPos, cells, gridSize) {
    const bombCell = cells[bombPos.row * gridSize + bombPos.col];
    bombCell.classList.remove('bomb');
    propagateExplosion(bombPos.row, bombPos.col, cells, gridSize);
    propagateExplosion(bombPos.row - 1, bombPos.col, cells, gridSize);
    propagateExplosion(bombPos.row + 1, bombPos.col, cells, gridSize);
    propagateExplosion(bombPos.row, bombPos.col - 1, cells, gridSize);
    propagateExplosion(bombPos.row, bombPos.col + 1, cells, gridSize);
}

export function propagateExplosion(row, col, cells, gridSize) {
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

    if (model[row][col] === 'B') {
        model[row][col] = 'V';
    }

    if (model[row][col] === 'V') {
        currentCell.classList.remove('brick');
        currentCell.classList.add('empty');
    }
}
