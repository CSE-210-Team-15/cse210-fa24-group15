/**
 * @fileoverview Dummy show/hide logic
 */
const toggleButton = document.getElementById('toggleButton');
const pets = document.getElementById('petsdiv');

toggleButton.addEventListener('click', () => {
  if (pets.style.display === 'none' || pets.style.display === '') {
    pets.style.display = 'block';
    toggleButton.textContent = 'Hide Pets';
  } else {
    pets.style.display = 'none';
    toggleButton.textContent = 'Show Pets';
  }
});
