import Game from "./src/components/petBlock/Game.js";

const game = new Game();
export default game;

// Initialize game state
let savedPets = JSON.parse(localStorage.getItem("pets"));
if (savedPets) {
  game.pets = game.deserializePets(savedPets) || game.pets;
}
game.coins = JSON.parse(localStorage.getItem("coins")) || 100;
