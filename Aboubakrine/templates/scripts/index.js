import { initializeGrid } from "./map.js";
import { movePlayer } from "./player.mjs";
import { placeBomb} from "./bomb.mjs";
import { model, gridSize, grid, initPlayerPos, bombDelay, cells  } from "./utils.mjs";


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


