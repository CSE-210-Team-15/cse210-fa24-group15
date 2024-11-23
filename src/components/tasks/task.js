// Task object to store task information. Can't handle pausing of timer right now.
class Task {
    constructor(name, estTime, difficulty, column) {
      this.name = name;
      this.estTime = estTime; // should be in milliseconds
      this.timeSpent = 0;
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
    input.querySelector('#time').inputmask.unmaskedvalue().trim() ||
    'No time set';
    let difficultyText;
    if (input.querySelector('#difficulty').value !== 'select') {
    difficultyText = input.querySelector('#difficulty').value;
    } else {
    difficultyText = 'No difficulty set';
    }
    // Create a task element with extracted values
    const columnElement = event.target.closest('.column');
    const columnName = columnElement.querySelector('h3').textContent.trim();

    const hours = parseInt(timeText.slice(0, 2), 10);
    const seconds = parseInt(timeText.slice(2), 10);
    const timeInMilliseconds = hours * 60 * 60 * 1000 + seconds * 60 * 1000;

    const task = createTask(
    nameText,
    timeInMilliseconds,
    difficultyText,
    columnName,
    false
    );
    input.replaceWith(task);
};

// Helper function to convert milliseconds to "59h 59m" format
const convertMillisecondsToTime = (milliseconds) => {
    const totalMinutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };
  
const createTask = (
    nameText,
    timeText,
    difficultyText,
    columnName,
    isPopulate
) => {
    if (!isPopulate) {
    const newTask = new Task(nameText, timeText, difficultyText, columnName);
    const tasks = loadTasks();
    tasks.push(newTask);
    saveTasks(tasks);
    }

    const formattedTime = convertMillisecondsToTime(timeText);

    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.innerHTML = `
    <div style = "display: flex; flex-direction: column; margin: 2px">
    <div id="name" style = "font-weight:bolder;">${nameText}</div>
    <div>Est.Time:<span id="time">${formattedTime}</span></div>
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
    <input type="text" class="task-input" id="time" value="${timeText}" placeholder="HH:MM" data-placeholder="Estimated Time">
    <select class="task-input" id="difficulty">
    <option value="select" ${difficultyText.toLowerCase() === 'select difficulty' ? 'selected' : ''}>Select Difficulty</option>
    <option value="easy" ${difficultyText.toLowerCase() === 'easy' ? 'selected' : ''}>Easy</option>
    <option value="medium" ${difficultyText.toLowerCase() === 'medium' ? 'selected' : ''}>Medium</option>
    <option value="hard" ${difficultyText.toLowerCase() === 'hard' ? 'selected' : ''}>Hard</option>
    </select>
    <button id = "createButton">Create</button>
    `;
    const createButton = input.querySelector('#createButton');
    // createButton.addEventListener('click', () => handleBlur({ target: input }));
    createButton.addEventListener('click', () => {
    const nameInput = input.querySelector('#name');
    const timeInput = input.querySelector('#time');
    const difficultySelect = input.querySelector('#difficulty');

    const nameText = nameInput.textContent.trim();
    const timeText = timeInput.value.trim();
    const difficultyText = difficultySelect.value;

    if (!nameText || !timeText || difficultyText === 'select') {
        alert('Please fill all the fields.');
        return;
    }
    handleBlur({ target: input });
    });

    // Apply input mask to the time input field
    $(input)
    .find('#time')
    .inputmask('99:59', {
        placeholder: 'HH:MM',
        insertMode: false,
        showMaskOnHover: false,
        definitions: {
        5: {
            validator: '[0-5]',
            cardinality: 1,
        },
        },
    });

    return input;
};