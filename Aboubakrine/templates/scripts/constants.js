import { pattern } from "./pattern.js";

export const path = "/Aboubakrine/templates/front-tools/images/"
// const model = patterns[randomIndex];
export const model= pattern
export const gridSize = 15;
export const grid = document.getElementById('grid');
export const cells = [];
export const playerDiv = document.createElement('div');
// initialisation des coordonnées du joueur principal
export const initPlayerPos = { row: 1, col: 1 };
// delai avant explosion bomb
export const bombDelay = 2000;
export const EndScore = document.querySelector(".endScore span");
export const gameOver = document.querySelector(".App");
export const gameActivity = document.querySelector('.stats')
export const winScore = document.querySelector(".winScore span");
export const GameWon = document.querySelector(".Won")
