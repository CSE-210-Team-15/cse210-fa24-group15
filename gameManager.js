import Game from "./src/components/petBlock/Game.js";

const game = new Game();
export default game;

// Initialize game state
let savedPets;
let savedCoins;

try {
  savedPets =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("pets"))
      : null;
  savedCoins =
    typeof localStorage !== "undefined"
      ? JSON.parse(localStorage.getItem("coins"))
      : 100;
} catch (error) {
  savedPets = null;
  savedCoins = 100;
  console.error(error);
}

game.pets = savedPets ? game.deserializePets(savedPets) : game.pets;
game.coins = savedCoins || 100;
