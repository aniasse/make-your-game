const gridSize = 15;
const grid = document.getElementById('grid');
const cells = [];

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
        } else {
            cell.className = 'cell empty';
        }

        cells.push(cell);
        grid.appendChild(cell);
    }
}