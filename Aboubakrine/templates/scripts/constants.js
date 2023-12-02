import { pattern, pattern1, pattern2, pattern3, pattern4, pattern5 } from "./pattern.js";

const patterns = [pattern, pattern1, pattern2, pattern3, pattern4, pattern5]
const randomIndex = Math.floor(Math.random() * patterns.length);

// const model = patterns[randomIndex];
export const model= pattern5
export const gridSize = 15;
export const grid = document.getElementById('grid');
export const cells = [];

// initialisation des coordonnées du joueur principal
export const initPlayerPos = { row: 1, col: 1 };
// delai avant explosion bomb
export const bombDelay = 2000;
