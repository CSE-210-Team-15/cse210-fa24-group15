import Game from './petBlock/Game.js';

let game = new Game();

let savedPets = JSON.parse(localStorage.getItem('pets'));
if (savedPets) {
  game.pets = game.deserializePets(savedPets) || game.pets;
}
console.log(game);
game.coins = JSON.parse(localStorage.getItem('coins')) || 100;

// For testing, hardcode to 100
// game.coins = 100;

function updateCoinCount() {
  const coinCountMain = document.getElementById('shopButton');
  //const coinCountShop = document.getElementById('coinCount');
  const coinCountShop = document.getElementById('coinCount');
  coinCountMain.textContent = game.coins;
  coinCountShop.textContent = game.coins;
  localStorage.setItem('coins', JSON.stringify(game.coins));
  localStorage.setItem('pets', JSON.stringify(game.serializePets()));
  console.log('Pet Set: ', game.serializePets());
}

function addPetUI() {
  const pets = document.getElementById('petsdiv');
  pets.innerHTML = '';
  Object.values(game.pets).forEach((petData) => {
    const pet = petData[0]; // Access the Pet instance
    const imageUrl = petData[1]; // Access the pet image URL

    if (pet.bought) {
      const img = document.createElement('img');
      img.classList.add('pet');
      img.src = imageUrl;
      pets.appendChild(img);
    }
  });
}

function renderShop() {
  // let savedPets = JSON.parse(localStorage.getItem('pets'))
  // if (savedPets) {
  //   game.pets = game.deserializePets(savedPets);
  // }
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
          addPetUI();
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
        // localStorage.setItem('pets', JSON.stringify(game.serializePets()));
        console.log(`Bought ${pet.name}, remaining coins: ${game.coins}`);
        updateCoinCount();
        renderShop(); // Refresh the shop after buying
        addPetUI(); // Show the pet immediately after buying
      } else {
        alert('Not enough coins to buy this pet.');
      }
    });
  });
  //localStorage.setItem('pets', JSON.stringify(game.serializePets()));
}

document.addEventListener('DOMContentLoaded', async () => {
  // localStorage.setItem('pets', JSON.stringify(game.serializePets()));
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

  // game.coins = JSON.parse(
  // localStorage.getItem('coins')) || 100;
  // let savedPets = JSON.parse(localStorage.getItem('pets'))
  // if (savedPets) {
  //   game.pets = game.deserializePets(savedPets);
  // }

  updateCoinCount();
  // Show popup on button click
  shopButton.addEventListener('click', () => {
    popup.style.display = 'flex';
    renderShop();
  });

  // Call addPetUI to display pets after reload
  addPetUI();

  // Close popup on close button click
  popup.addEventListener('click', (event) => {
    if (!popupContentBox.contains(event.target)) {
      popup.style.display = 'none';
    }
  });
});
