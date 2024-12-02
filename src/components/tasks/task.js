let modal = null;
let columnsContainer = null;
let columns = null;
let currentTask = null;

//* functions

/**
 * Handles the dragover event to allow dragging and dropping tasks.
 *
 * This function prevents default dragover behavior, identifies the dragged task,
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

  updateTaskState(draggedTask, sourceColumn, targetColumn);
  updateTaskColumn(draggedTask, targetColumn);
};

/**
 * Perform the appropriate action(s) when dragging a task to
 * a different column
 *
 * To Do -> In Progress: render buttons, auto start timer
 * In Progress -> Done: render buttons, auto stop timer
 *
 * @param {HTMLElement} task       DOM task element
 * @param {string}      sourceColumn source column name
 * @param {string}      targetColumn target column name
 */
const updateTaskState = (task, sourceColumn, targetColumn) => {
  const timerButton = task.querySelector('[data-timer]');

  // if source = todo and target = in progress, start timer and render play/pause button
  if (sourceColumn === 'To Do' && targetColumn === 'In Progress') {
    renderTaskButtons(task, targetColumn);
    timerButton.click();
  }

  // if source = in progress and target = done, stop timer and hide edit and play/pause
  if (sourceColumn === 'In Progress' && targetColumn === 'Done') {
    renderTaskButtons(task, targetColumn);
    // only stop timer if it's currently active
    if (timerButton.querySelector('i').classList.contains('bi-stop-circle')) {
      timerButton.click();
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
  document.querySelector('.confirm-modal').querySelector('.preview').innerText =
    currentTask.innerText.substring(0, 100);

  document.querySelector('.confirm-modal').showModal();
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
};

// Updates task column in local storage
const updateTaskColumn = (taskElement, newColumn) => {
  const tasks = loadTasks();
  const taskName = taskElement.querySelector('#name').textContent;

  const task = tasks.find((t) => t.name === taskName);
  if (task) {
    task.column = newColumn;
    // taskElement.dataset.column = newColumn;
    saveTasks(tasks);
  }
};

// Function to populate tasks from local storage on page load
const populateTasksFromStorage = () => {
  const tasks = loadTasks();
  const columnMap = {
    'To Do': columns[0],
    'In Progress': columns[1],
    Done: columns[2],
  };

  // Clear existing tasks from all columns
  columns.forEach((column) => {
    const tasksContainer = column.querySelector('.tasks');
    tasksContainer.innerHTML = '';
  });

  // Populate tasks into their respective columns
  tasks.forEach((task) => {
    const column = columnMap[task.column];
    if (column) {
      const taskElement = createTask(
        task.name,
        task.estTime,
        task.difficulty,
        task.column,
        true
      );
      column.querySelector('.tasks').appendChild(taskElement);
    }
  });
};

//* event listeners
document.addEventListener('DOMContentLoaded', () => {
  modal = document.querySelector('.confirm-modal');
  columnsContainer = document.querySelector('.columns');
  columns = columnsContainer.querySelectorAll('.column');
  observeTaskChanges();
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
    // confirm deletion
    modal.addEventListener('submit', () => {
      if (currentTask) {
        deleteTaskFromLocalStorage(currentTask); // Call the function to delete from local storage
        currentTask.remove(); // Remove the task from the DOM
      }
    });

    // cancel deletion
    modal
      .querySelector('#cancel')
      .addEventListener('click', () => modal.close());

    // clear current task
    modal.addEventListener('close', () => (currentTask = null));
  });
  populateTasksFromStorage();
});

// Task object to store task information
class Task {
  constructor(name, estTime, difficulty, column) {
    this.name = name;
    this.estTime = estTime; // should be in minutes
    this.timeSpent = 0; // will be in minutes
    this.difficulty = difficulty;
    this.column = column;
  }

  toJSON() {
    return {
      name: this.name,
      estTime: this.estTime,
      timeSpent: this.timeSpent,
      difficulty: this.difficulty,
      column: this.column,
    };
  }

  static fromJSON(json) {
    const task = Object.assign(new Task(), json);
    return task;
  }
}

// Helper function to convert seconds to HH:MM:SS format
const formatTimeHHMMSS = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const createTask = (
  nameText,
  timeInSeconds,
  difficultyText,
  columnName,
  isPopulate
) => {
  let newTask;
  if (isPopulate) {
    const tasks = loadTasks();
    newTask = tasks.find((t) => t.name === nameText);
  } else {
    newTask = new Task(nameText, timeInSeconds, difficultyText, columnName);
    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);
  }

  const task = document.createElement('div');
  task.className = 'task';
  task.draggable = true;
  task.innerHTML = `<div style="display: flex; flex-direction: column; margin: 2px">
        <div id="name" style="font-weight: bolder;">${nameText}</div>
        <div class="time-tracking">
            Actual Time/Estimated Time: <span id="time-spent">${formatTimeHHMMSS(newTask.timeSpent)}</span> / 
            <span id="estimated-time">${formatTimeHHMMSS(timeInSeconds)}</span>
        </div>
        <div id="difficulty">Difficulty: ${difficultyText}</div>
        <menu>
            <button data-edit><i class="bi bi-pencil-square"></i></button>
            <button data-delete><i class="bi bi-trash"></i></button>
            <button data-timer><i class="bi bi-play-circle"></i></button>
        </menu>
    </div>`;

  task.addEventListener('dragstart', handleDragstart);
  task.addEventListener('dragend', handleDragend);

  // Add timer functionality
  const timerButton = task.querySelector('[data-timer]');
  let timerInterval;
  let isTimerRunning = false;

  timerButton.addEventListener('click', () => {
    if (!isTimerRunning) {
      // Start timer
      isTimerRunning = true;
      timerButton
        .querySelector('i')
        .classList.replace('bi-play-circle', 'bi-stop-circle');

      timerInterval = setInterval(() => {
        const tasks = loadTasks();
        const taskData = tasks.find((t) => t.name === nameText);
        if (taskData) {
          taskData.timeSpent += 1; // Add 1 second
          const timeSpentElement = task.querySelector('#time-spent');
          timeSpentElement.textContent = formatTimeHHMMSS(taskData.timeSpent);
          saveTasks(tasks);
        }
      }, 1000); // Update every second
    } else {
      // Stop timer
      isTimerRunning = false;
      timerButton
        .querySelector('i')
        .classList.replace('bi-stop-circle', 'bi-play-circle');
      clearInterval(timerInterval);
    }
  });

  // render buttons based on column
  renderTaskButtons(task, columnName);
  return task;
};

/**
 * Renders appropriate buttons on tasks based on the column
 * they are under
 *
 * To Do: no play/pause button
 * Done: no edit and no play/pause button
 *
 * @param {HTMLElement} task       DOM task element
 * @param {string}      columnName column name
 */
const renderTaskButtons = (task, columnName) => {
  const timerButton = task.querySelector('[data-timer]');
  const editButton = task.querySelector('[data-edit]');

  switch (columnName) {
    case 'To Do':
      timerButton.style.display = 'none';
      editButton.style.display = 'block';
      break;
    case 'In Progress':
      timerButton.style.display = 'block';
      editButton.style.display = 'block';
      break;
    case 'Done':
      timerButton.style.display = 'none';
      editButton.style.display = 'none';
      break;
    default:
      timerButton.style.display = 'block';
      editButton.style.display = 'block';
  }
};

const handleEdit = (event) => {
  const task = event.target.closest('.task');

  // Extract current values from task
  const nameText = task.querySelector('#name').innerText;
  const hours = task.querySelector('#timeHour');
  const minutes = task.querySelector('#timeMin');
  const difficultyText = task.querySelector('#difficulty').innerText;

  // Create editable input fields with current values
  deleteTaskFromLocalStorage(task);
  const input = createTaskInput(nameText, hours, minutes, difficultyText);
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
  let difficultyText;
  if (input.querySelector('#difficulty').value !== 'select') {
    difficultyText = input.querySelector('#difficulty').value;
  } else {
    difficultyText = 'No difficulty set';
  }
  // Create a task element with extracted values
  const columnElement = event.target.closest('.column');
  const columnName = columnElement.querySelector('h3').textContent.trim();

  const hours = input.querySelector('#timeHour').value;
  const minutes = input.querySelector('#timeMin').value;
  const totalSeconds = hours * 3600 + minutes * 60;

  const task = createTask(
    nameText,
    totalSeconds,
    difficultyText,
    columnName,
    false
  );
  input.replaceWith(task);
};

const createTaskInput = (
  nameText = '',
  timeHour = '',
  timeMin = '',
  difficultyText = ''
) => {
  const input = document.createElement('div');
  input.className = 'task-Container';

  input.innerHTML = `<div class="task-input" id="name" contenteditable="true" data-placeholder="Task name">${nameText}</div>
    <div class="task-row">
    Estimated Time: 
    <input type="number" class="task-input" id="timeHour" value="${timeHour}" placeholder="Hours" data-placeholder="Estimated Time" min="0" max=99>
    <input type="number" class="task-input" id="timeMin" value="${timeMin}" placeholder="Minutes" data-placeholder="Estimated Time" min="0" max="59">
    </div>
    <div class="task-row">
    Difficulty: 
    <select class="task-input" id="difficulty">
    <option value="select" ${difficultyText.toLowerCase() === 'select difficulty' ? 'selected' : ''}>Select Difficulty</option>
    <option value="easy" ${difficultyText.toLowerCase() === 'easy' ? 'selected' : ''}>Easy</option>
    <option value="medium" ${difficultyText.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
    <option value="hard" ${difficultyText.toLowerCase() === 'hard' ? 'selected' : ''}>Hard</option>
    </select>
    <button id = "createButton">Create</button>
    </div>
    `;
  const createButton = input.querySelector('#createButton');
  createButton.addEventListener('click', () => {
    const nameInput = input.querySelector('#name');
    const timeHourInput = input.querySelector('#timeHour').value;
    const timeMinInput = input.querySelector('#timeMin').value;
    const difficultySelect = input.querySelector('#difficulty');

    const nameText = nameInput.textContent.trim();
    const difficultyText = difficultySelect.value;

    if (
      !nameText ||
      !timeHourInput ||
      !timeMinInput ||
      difficultyText === 'select'
    ) {
      alert('Please fill all the fields.');
      return;
    }
    handleBlur({ target: input });
  });

  return input;
};
