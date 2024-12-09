class Task {
  constructor(name, estTime, difficulty, column) {
    this.name = name;
    this.estTime = estTime;
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

// Mock localStorage for Node.js environment
const localStorage = {
  _store: {},
  getItem(key) {
    return this._store[key] || null;
  },
  setItem(key, value) {
    this._store[key] = value;
  },
  clear() {
    this._store = {};
  }
};

// Function to save tasks to local storage
const saveTasks = (tasks) => {
  const tasksJSON = tasks.map((task) => task.toJSON());
  localStorage.setItem('tasks', JSON.stringify(tasksJSON));
};

// Function to load tasks from local storage
// const loadTasks = () => {
//   const tasksJSON = JSON.parse(localStorage.getItem('tasks') || '[]');
//   return tasksJSON.map(Task.fromJSON);
// };
const loadTasks = () => {
  const tasksString = localStorage.getItem('tasks');
  const tasksJSON = tasksString ? JSON.parse(tasksString) : [];
  return tasksJSON.map(Task.fromJSON);
};

// Updates task column in local storage
const updateTaskColumn = (taskElement, newColumn) => {
  const tasks = loadTasks();
  const taskName = taskElement.querySelector('#name').textContent;

  const taskIndex = tasks.findIndex((t) => t.name === taskName);
  if (taskIndex !== -1) {
    tasks[taskIndex].column = newColumn;
    saveTasks(tasks);
  }
};

// Function to delete task from local storage
const deleteTaskFromLocalStorage = (taskElement) => {
  // Load tasks from local storage
  const tasks = loadTasks();

  // Find index of the task to be deleted
  const taskName = taskElement.querySelector('#name').innerText;
  const taskIndex = tasks.findIndex(
    (storedTask) => storedTask.name === taskName
  );

  // Remove task from array
  if (taskIndex !== -1) {
    tasks.splice(taskIndex, 1);
    // Save updated array back to local storage
    saveTasks(tasks);
  }
};

// Export the functions and Task class for testing
export {
  Task,
  saveTasks,
  updateTaskColumn,
  loadTasks,
  deleteTaskFromLocalStorage,
  localStorage
};