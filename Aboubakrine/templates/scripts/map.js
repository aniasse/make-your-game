export function initializeGrid(gridSize, model, initPlayerPos, cells, grid) {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.dataset.row = i;
            cell.dataset.col = j;

            if (model[i][j] === "X") {
                cell.className = 'cell wall';
            } else if (model[i][j] === "B") {
                cell.className = 'cell brick';
            } else if (i === initPlayerPos.row && j === initPlayerPos.col) {
                cell.className = 'cell empty player';
            } else {
                cell.className = 'cell empty';
            }

            cells.push(cell);
            grid.appendChild(cell);
        }
    }
}


