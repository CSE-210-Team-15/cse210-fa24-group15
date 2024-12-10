import game from '../../../gameManager.js';

// For testing, hardcode to 100
// game.coins = 100;

export function updateCoinCount() {
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

    // Pet HP system
    const currentTime = Date.now();
    const petTimestamp = new Date(pet.timestamp).getTime();
    // test for 5 seconds
    const timeDifferenceInHours = Math.floor(
      (currentTime - petTimestamp) / (1000 * 60 * 12)
    );
    // Deduct HP based on the time difference (e.g., 1 HP per hour)
    if (pet.bought === 1 && timeDifferenceInHours > 0) {
      console.log(`Pet dropped ${timeDifferenceInHours} HP`);
      // Pet dies when hp goes below 0
      if (!pet.changeHp(-timeDifferenceInHours)) {
        alert(`Your pet ${pet.name} has died from starving`);
        pet.bought = 0;
        addPetUI();
      }
      pet.timestamp = Date.now(); // Update the timestamp to current time
      localStorage.setItem('pets', JSON.stringify(game.serializePets()));
    }

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
          pet.timestamp = Date.now();
          console.log(
            `Fed ${pet.name}, new HP: ${pet.hp}, remaining coins: ${game.coins}, timestamp: ${pet.timestamp}`
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
        pet.timestamp = Date.now();
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
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
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
    console.log('Clicked element:', event.target);
    if (!popupContentBox.contains(event.target)) {
      console.log('Click detected outside popupContentBox');
      popup.style.display = 'none';
    }
  });
});
}