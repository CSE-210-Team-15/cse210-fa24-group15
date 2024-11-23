const modal = document.querySelector('.confirm-modal');
const columnsContainer = document.querySelector('.columns');
const columns = columnsContainer.querySelectorAll('.column');

let currentTask = null;

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

  updateTaskColumn(draggedTask, targetColumn);
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
document.addEventListener('DOMContentLoaded', populateTasksFromStorage);

// dragover and drop
tasksElements = columnsContainer.querySelectorAll('.tasks');
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