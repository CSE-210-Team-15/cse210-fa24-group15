const modal = document.querySelector('.confirm-modal');
const columnsContainer = document.querySelector('.columns');
const columns = columnsContainer.querySelectorAll('.column');

let currentTask = null;
let tasks = [];

//* classes

// Task object to store task information. Can't handle pausing of timer right now.
class Task {
  constructor(name, estTime, difficulty) {
    this.name = name;
    this.estTime = estTime; // should be in milliseconds
    this.startTime = new Date();
    this.remainingTime = estTime;
    this.difficulty = difficulty;
    // might need column number
  }

  getRemainingTime() {
    const currentTime = new Date();
    this.remainingTime = this.estTime - (currentTime - this.startTime);
    return this.remainingTime;
  }

  toJSON() {
    return {
      name: this.name,
      estTime: this.estTime,
      startTime: this.startTime.toISOString(),
      remainingTime: this.remainingTime,
      difficulty: this.difficulty,
    };
  }

  static fromJSON(json) {
    const task = Object.assign(new Task(), json);
    task.startTime = new Date(json.startTime);
    return task;
  }
}

//* functions

/**
 * Handles the dragover event to allow dragging and dropping tasks.
 *
 * This function prevents the default dragover behavior, identifies the dragged task,
 * and determines where to place it within the target list or relative to other tasks.
 *
 * @param {DragEvent} event - The dragover event triggered by dragging an element.
 *
 * @returns {void}
 *
 * The function performs the following actions:
 * 1. Prevents the default behavior to allow dropping.
 * 2. Identifies the currently dragged task using the ".dragging" class.
 * 3. Finds the closest droppable target (either a `.task` or `.tasks` container).
 * 4. If the target is a `.tasks` container:
 *    - Appends the dragged task if the container is empty.
 *    - Appends the dragged task after the last task if the cursor is below it.
 * 5. If the target is a `.task` element:
 *    - Inserts the dragged task before or after the target based on cursor position.
 */
const handleDragover = (event) => {
  event.preventDefault(); // allow drop

  const draggedTask = document.querySelector('.dragging');
  const target = event.target.closest('.task, .tasks');

  const sourceColumn = draggedTask
    .closest('.column')
    .querySelector('h3')
    .textContent.trim();
  const targetColumn = target
    .closest('.column')
    .querySelector('h3')
    .textContent.trim();

  if (
    (sourceColumn === 'In Progress' && targetColumn === 'To Do') || // Block In Progress to To Do
    (sourceColumn === 'Done' &&
      (targetColumn === 'To Do' || targetColumn === 'In Progress')) // Block Done to To Do or In Progress
  ) {
    return; // Prevent drop specifically in these cases
  }

  if (!target || target === draggedTask) {
    return;
  }

  if (target.classList.contains('tasks')) {
    // target is the tasks element
    const lastTask = target.lastElementChild;
    if (!lastTask) {
      // tasks is empty
      target.appendChild(draggedTask);
    } else {
      const { bottom } = lastTask.getBoundingClientRect();
      event.clientY > bottom && target.appendChild(draggedTask);
    }
  } else {
    // target is another
    const { top, height } = target.getBoundingClientRect();
    const distance = top + height / 2;

    if (event.clientY < distance) {
      target.before(draggedTask);
    } else {
      target.after(draggedTask);
    }
  }
};

const handleDrop = (event) => {
  event.preventDefault();
};

const handleDragend = (event) => {
  event.target.classList.remove('dragging');
};

const handleDragstart = (event) => {
  event.dataTransfer.effectsAllowed = 'move';
  event.dataTransfer.setData('text/plain', '');
  requestAnimationFrame(() => event.target.classList.add('dragging'));
};

const handleDelete = (event) => {
  currentTask = event.target.closest('.task');

  // show preview
  modal.querySelector('.preview').innerText = currentTask.innerText.substring(
    0,
    100
  );

  modal.showModal();
};

const handleEdit = (event) => {
  const task = event.target.closest('.task');

  // Extract current values from task
  const nameText = task.querySelector('#name').innerText;
  const timeText = task.querySelector('#time').innerText;
  const difficultyText = task.querySelector('#difficulty').innerText;

  // Create editable input fields with current values
  deleteTaskFromLocalStorage(task);
  const input = createTaskInput(nameText, timeText, difficultyText);
  task.replaceWith(input);
  input.querySelector('#name').focus();

  // Move cursor to the end of the task name field
  const selection = window.getSelection();
  const nameField = input.querySelector('#name');
  const range = document.createRange();
  range.selectNodeContents(nameField);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
};

const handleBlur = (event) => {
  const input = event.target.closest('.task-Container');

  // Extract values from each field
  const nameText = input.querySelector('#name').innerText.trim() || 'Untitled';
  const timeText =
    input.querySelector('#time').innerText.trim() || 'No time set';
  let difficultyText;
  if (input.querySelector('#difficulty').value !== 'select') {
    difficultyText = input.querySelector('#difficulty').value;
  } else {
    difficultyText = 'No difficulty set';
  }
  // Create a task element with extracted values
  const task = createTask(nameText, timeText, difficultyText);
  input.replaceWith(task);
};

const handleAdd = (event) => {
  const tasksEl = event.target.closest('.column').lastElementChild;
  const input = createTaskInput();
  tasksEl.appendChild(input);
  input.focus();
};

const updateTaskCount = (column) => {
  const colTasks = column.querySelector('.tasks').children;
  const taskCount = colTasks.length;
  column.querySelector('.column-title h3').dataset.tasks = taskCount;
};

const observeTaskChanges = () => {
  for (const column of columns) {
    const observer = new MutationObserver(() => updateTaskCount(column));
    observer.observe(column.querySelector('.tasks'), { childList: true });
  }
};

observeTaskChanges();

/*
estimated time formatting: hh:mm
*/
const createTask = (nameText, timeText, difficultyText) => {
  const newTask = new Task(nameText, timeText, difficultyText);
  tasks = loadTasks();
  tasks.push(newTask);
  saveTasks(tasks);

  const task = document.createElement('div');
  task.className = 'task';
  task.draggable = true;
  task.innerHTML = `
  <div style = "display: flex; flex-direction: column; margin: 2px">
    <div id="name" style = "font-weight:bolder;">${nameText}</div>
    <div>Est.Time:<span id="time">${timeText}</span></div>
    <div id="difficulty">Difficulty: ${difficultyText}</div>
    <menu>
      <button data-edit><i class="bi bi-pencil-square"></i></button>
      <button data-delete><i class="bi bi-trash"></i></button>
    </menu>
  </div>`;
  task.addEventListener('dragstart', handleDragstart);
  task.addEventListener('dragend', handleDragend);
  return task;
};

/*
estimated time formatting: hh:mm
*/
const createTaskInput = (nameText = '', timeText = '', difficultyText = '') => {
  const input = document.createElement('div');
  input.className = 'task-Container';

  input.innerHTML = `
  <div class="task-input" id="name" contenteditable="true" data-placeholder="Task name">${nameText}</div>
  <div class="task-input" id="time"contenteditable="true" data-placeholder="Estimated Time">${timeText}</div>
  <select class="task-input" id="difficulty">
    <option value="select" ${difficultyText.toLowerCase() === 'select difficulty' ? 'selected' : ''}>Select Difficulty</option>
    <option value="easy" ${difficultyText.toLowerCase() === 'easy' ? 'selected' : ''}>Easy</option>
    <option value="medium" ${difficultyText.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
    <option value="hard" ${difficultyText.toLowerCase() === 'hard' ? 'selected' : ''}>Hard</option>
  </select>
  <button id = "createButton">Create</button>
  `;
  const createButton = input.querySelector('#createButton');
  createButton.addEventListener('click', () => handleBlur({ target: input }));
  return input;
};

// Function to save tasks to local storage
const saveTasks = (tasks) => {
  const tasksJSON = tasks.map((task) => task.toJSON());
  localStorage.setItem('tasks', JSON.stringify(tasksJSON));
};

// Function to load tasks from local storage
const loadTasks = () => {
  const tasksJSON = JSON.parse(localStorage.getItem('tasks') || '[]');
  return tasksJSON.map(Task.fromJSON);
};

const deleteTaskFromLocalStorage = (task) => {
  // Load tasks from local storage
  const tasksJSON = JSON.parse(localStorage.getItem('tasks') || '[]');

  // Find index of the task to be deleted
  const taskIndex = tasksJSON.findIndex(
    (storedTask) => storedTask.name === task.querySelector('#name').innerText
  );

  // Remove task from array
  if (taskIndex !== -1) {
    tasksJSON.splice(taskIndex, 1);
    // Save updated array back to local storage
    localStorage.setItem('tasks', JSON.stringify(tasksJSON));
  }

  // Load tasks from local storage and print
  tasks = loadTasks();
};

//* event listeners

// dragover and drop
let tasksElements = columnsContainer.querySelectorAll('.tasks');
for (const tasksEl of tasksElements) {
  tasksEl.addEventListener('dragover', handleDragover);
  tasksEl.addEventListener('drop', handleDrop);
}

// add, edit and delete task
columnsContainer.addEventListener('click', (event) => {
  if (event.target.closest('button[data-add]')) {
    handleAdd(event);
  } else if (event.target.closest('button[data-edit]')) {
    handleEdit(event);
  } else if (event.target.closest('button[data-delete]')) {
    handleDelete(event);
  }
});

// confirm deletion
modal.addEventListener('submit', () => {
  if (currentTask) {
    deleteTaskFromLocalStorage(currentTask); // Call the function to delete from local storage
    currentTask.remove(); // Remove the task from the DOM
  }
});

// cancel deletion
modal.querySelector('#cancel').addEventListener('click', () => modal.close());

// clear current task
modal.addEventListener('close', () => (currentTask = null));

//* placeholder tasks

// let tasks = [
//   [
//     "Gather inspiration for layout ideas 🖌️",
//     "Research Color Palette 🖍️",
//     "Brand and Logo Design 🎨",
//   ],
//   [
//     "Optimize Image Assets 🏞️",
//     "Cross-Browser Testing 🌐",
//     "Integrate Livechat 💬",
//   ],
//   [
//     "Set Up Custom Domain 🌍",
//     "Deploy Website 🚀",
//     "Fix Bugs 🛠️",
//     "Team Meeting 📅",
//   ],
//   [
//     "Write Report 📊",
//     "Code Review 💻",
//     "Implement Billing and Subscription 💰",
//   ],
// ];

// tasks.forEach((col, idx) => {
//   for (const item of col) {
//     columns[idx].querySelector(".tasks").appendChild(createTask(item));
//   }
// });

//shopScript:

import Game from './petBlock/Game.js';
import Pet from './petBlock/Pet.js';

// Function to generate a random price for pets
function getRandomPrice(min = 10, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Function to create a list of random pets
function generateRandomPets(numPets = 5) {
  const petNames = ['Dog', 'Cat', 'Horse', 'Rabbit', 'Parrot', 'Hamster', 'Fish', 'Turtle'];
  const pets = {};

  for (let i = 0; i < numPets; i++) {
    const name = petNames[i]
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
}

function renderShop() {
  console.log(game.pets)
  const popup = document.querySelector('.shop-popup');
  popup.style.display = 'flex';
  const owned = document.getElementById("owned");
  const shop = document.getElementById("shop");

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
        if (pet.hp >= 100){
          alert("this pet is at full health")
        } else {
          game.changeCoins(-pet.feedprice); // Deduct coins
          pet.changeHp(10); // Change HP by a fixed amount (e.g., 10)
          console.log(`Fed ${pet.name}, new HP: ${pet.hp}, remaining coins: ${game.coins}`);
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
  const coins = document.getElementById("coins")
  updateCoinCount()
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
