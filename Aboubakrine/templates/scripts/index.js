import { initializeGrid } from "./map.js";
import { movePlayer } from "./player.mjs";
import { placeBomb} from "./bomb.mjs";
import { pattern, pattern1, pattern2, pattern3, pattern4, pattern5 } from "./pattern.js";

const patterns = [pattern, pattern1, pattern2, pattern3, pattern4, pattern5];
const randomIndex = Math.floor(Math.random() * patterns.length);
const model = patterns[randomIndex];
const gridSize = 15;
const grid = document.getElementById('grid');
const cells = [];
let lives = 3;
const initPlayerPos = { row: 1, col: 1 };
const bombDelay = 2000;

initializeGrid(gridSize, model, initPlayerPos, cells, grid);

document.addEventListener('keydown', (event) => {
    movePlayer(event, initPlayerPos, gridSize, model, cells);
});

document.addEventListener('keydown', (event) => {
    if (event.key === ' ' || event.key === 'Spacebar') {
        placeBomb(initPlayerPos, cells, gridSize, bombDelay);
        console.log('placement bomb');
    }
});


