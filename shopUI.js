import Game from './petBlock/Game.js';
import Pet from './petBlock/Pet.js';

// Function to generate a random price for pets
function getRandomPrice(min = 10, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to create a list of random pets
function generateRandomPets(numPets = 5) {
  const petNames = [
    'Dog',
    'Cat',
    'Horse',
    'Rabbit',
    'Parrot',
    'Hamster',
    'Fish',
    'Turtle',
  ];
  const pets = {};

  for (let i = 0; i < numPets; i++) {
    const name = petNames[i];
    const price = getRandomPrice();
    pets[name] = [new Pet(name, price), 'https://via.placeholder.com/100'];
  }

  return pets;
}
const game = new Game();
game.pets = generateRandomPets();

function updateCoinCount() {
  const coinCountMain = document.getElementById('shopButton');
  const coinCountShop = document.getElementById('coinCount');
  coinCountMain.textContent = game.coins;
  coinCountShop.textContent = game.coins;
  localStorage.setItem('coins', JSON.stringify(game.coins));
}

function renderShop() {
  console.log(game.pets);
  const popup = document.querySelector('.shop-popup');
  popup.style.display = 'flex';
  const owned = document.getElementById('owned');
  const shop = document.getElementById('shop');

  // Clear previous content
  owned.innerHTML = '';
  shop.innerHTML = '';

  // Loop through game.pets for owned pets (bought === true)
  Object.values(game.pets).forEach((petData) => {
    const pet = petData[0]; // Access the Pet instance
    const imageUrl = petData[1]; // Access the pet image URL

    if (pet.bought) {
      const petHTML = `
        <div class="pet-item" data-index="${pet.name}">
          <img src="${imageUrl}" alt="${pet.name}">
          <div class="pet-status">
            <span>${pet.name}</span>
            <span>HP: ${pet.hp}</span>
          </div>
          <div class="price-button">
            <span>Feed</span>
            <span>$${pet.feedprice}</span>
          </div>
        </div>
      `;
      owned.innerHTML += petHTML;
    }
  });

  // Add event listener for feed button in owned pets
  owned.querySelectorAll('.pet-item').forEach((petElement) => {
    const index = petElement.getAttribute('data-index');
    const feedButton = petElement.querySelector('.price-button');

    feedButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const pet = game.pets[index][0]; // Access the Pet instance
      if (game.coins >= pet.feedprice) {
        if (pet.hp >= 100) {
          alert('this pet is at full health');
        } else {
          game.changeCoins(-pet.feedprice); // Deduct coins
          pet.changeHp(10); // Change HP by a fixed amount (e.g., 10)
          console.log(
            `Fed ${pet.name}, new HP: ${pet.hp}, remaining coins: ${game.coins}`
          );
          updateCoinCount();
          renderShop();
        }
      } else {
        alert('Not enough coins to feed this pet.');
      }
    });
  });

  // Loop through game.pets for shop pets (bought === false)
  Object.values(game.pets).forEach((petData) => {
    const pet = petData[0]; // Access the Pet instance
    const imageUrl = petData[1]; // Access the pet image URL

    if (!pet.bought) {
      const petHTML = `
        <div class="pet-item" data-index="${pet.name}">
          <img src="${imageUrl}" alt="${pet.name}">
          <div class="price-button">
            <span>${pet.name}</span>
            <span>$${pet.price}</span>
          </div>
        </div>
      `;
      shop.innerHTML += petHTML;
    }
  });

  // Add event listener for buy button in shop pets
  shop.querySelectorAll('.pet-item').forEach((petElement) => {
    const index = petElement.getAttribute('data-index');
    const buyButton = petElement.querySelector('.price-button');

    buyButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const pet = game.pets[index][0]; // Access the Pet instance
      if (game.coins >= pet.price) {
        game.buyPet(pet.name); // Mark the pet as bought
        localStorage.setItem('pets', JSON.stringify(game.pets));
        console.log(`Bought ${pet.name}, remaining coins: ${game.coins}`);
        updateCoinCount();
        renderShop(); // Refresh the shop after buying
      } else {
        alert('Not enough coins to buy this pet.');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load the shop popup HTML
  const response = await fetch('shop.html');
  const html = await response.text();

  // Create a container for the popup
  const template = document.createElement('template');
  template.innerHTML = html;
  document.body.appendChild(template.content.cloneNode(true));

  const popup = document.querySelector('.shop-popup');
  const popupContentBox = document.querySelector('.shop-popup-content');
  popup.style.display = 'none';
  const shopButton = document.getElementById('shopButton');
  const tasksJSON = JSON.parse(localStorage.getItem('tasks') || '[]');
  const coins = JSON.parse(
    localStorage.getItem('coins') || document.getElementById('coins')
  );
  // const coins = document.getElementById('coins');
  updateCoinCount();
  // Show popup on button click
  shopButton.addEventListener('click', () => {
    popup.style.display = 'flex';
    renderShop();
  });

  // Close popup on close button click
  popup.addEventListener('click', (event) => {
    if (!popupContentBox.contains(event.target)) {
      popup.style.display = 'none';
    }
  });
});
