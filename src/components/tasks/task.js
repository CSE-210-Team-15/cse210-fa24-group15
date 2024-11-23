// Task object to store task information. Can't handle pausing of timer right now.
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

// Helper function to convert minutes to HH:MM format
const formatTimeHHMM = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

const createTask = (
    nameText,
    timeInMinutes,
    difficultyText,
    columnName,
    isPopulate
) => {
    let newTask; 
    if(isPopulate){
        const tasks = loadTasks();
        newTask = tasks.find(t => t.name === nameText);
    }
    else {
        newTask = new Task(nameText, timeInMinutes, difficultyText, columnName);
        const tasks = loadTasks();
        tasks.push(newTask);
        saveTasks(tasks);
    }

    const task = document.createElement('div');
    task.className = 'task';
    task.draggable = true;
    task.innerHTML = `
    <div style="display: flex; flex-direction: column; margin: 2px">
        <div id="name" style="font-weight: bolder;">${nameText}</div>
        <div class="time-tracking">
            Time: <span id="time-spent">${formatTimeHHMM(newTask.timeSpent)}</span> / 
            <span id="estimated-time">${formatTimeHHMM(timeInMinutes)}</span>
        </div>
        <div id="difficulty">Difficulty: ${difficultyText}</div>
        <menu>
            <button data-edit><i class="bi bi-pencil-square"></i></button>
            <button data-delete><i class="bi bi-trash"></i></button>
            <button data-timer><i class="bi bi-play-circle""></i></button>
        </menu>
    </div>`;

    task.addEventListener('dragstart', handleDragstart);
    task.addEventListener('dragend', handleDragend);

    // Add timer functionality
    const timerButton = task.querySelector('[data-timer]');
    let timerInterval;
    let isTimerRunning = false;
    let secondsCount = 0;

    timerButton.addEventListener('click', () => {
        if (!isTimerRunning) {
            // Start timer
            isTimerRunning = true;
            timerButton.querySelector('i').classList.replace('bi-play-circle', 'bi-stop-circle');
            
            timerInterval = setInterval(() => {
                secondsCount++;
                if (secondsCount === 60) { // Only update after a full minute
                    const tasks = loadTasks();
                    const taskData = tasks.find(t => t.name === nameText);
                    if (taskData) {
                        taskData.timeSpent += 1; // Add 1 minute
                        const timeSpentElement = task.querySelector('#time-spent');
                        timeSpentElement.textContent = formatTimeHHMM(taskData.timeSpent);
                        saveTasks(tasks);
                    }
                    secondsCount = 0; // Reset seconds counter
                }
            }, 1000); // Still check every second, but only increment after 60 seconds
        } else {
            // Stop timer
            isTimerRunning = false;
            timerButton.querySelector('i').classList.replace('bi-stop-circle', 'bi-play-circle');
            clearInterval(timerInterval);
            secondsCount = 0; // Reset seconds counter when stopped
        }
    });

    return task;
};

const handleEdit = (event) => {
    const task = event.target.closest('.task');

    // Extract current values from task
    const nameText = task.querySelector('#name').innerText;
    const timeElement = task.querySelector('#estimated-time');
    const [hours, minutes] = timeElement.innerText.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const difficultyText = task.querySelector('#difficulty').innerText;

    // Create editable input fields with current values
    deleteTaskFromLocalStorage(task);
    const input = createTaskInput(nameText, `${hours}:${minutes}`, difficultyText);
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
    const minutes = parseInt(timeText.slice(2), 10);
    const totalMinutes = hours * 60 + minutes;

    const task = createTask(
    nameText,
    totalMinutes,
    difficultyText,
    columnName,
    false
    );
    input.replaceWith(task);
};
  

const createTaskInput = (nameText = '', timeText = '', difficultyText = '') => {
    const input = document.createElement('div');
    input.className = 'task-Container';

    input.innerHTML = `
    <div class="task-input" id="name" contenteditable="true" data-placeholder="Task name">${nameText}</div>
    <div class="task-row">
    Estimated Time: 
    <input type="text" class="task-input" id="time" value="${timeText}" placeholder="HH:MM" data-placeholder="Estimated Time">
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