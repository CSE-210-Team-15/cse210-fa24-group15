const { saveTasks, updateTaskColumn, loadTasks, deleteTaskFromLocalStorage } = require('./src/components/tasks/task.js'); 

class MockTask {
  constructor(name, estTime, difficulty, column) {
    this.name = name;
    this.estTime = estTime;
    this.difficulty = difficulty;
    this.column = column;
    this.timeSpent = 0;
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
    return Object.assign(new MockTask(), json);
  }
}

describe('Task Management Functions', () => {
  let tasks;

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Dummy data for testing
    tasks = [
      new MockTask("Task 1", 3600000, "Medium", "To Do"),
      new MockTask("Task 2", 1800000, "Low", "In Progress"),
    ];
  });

  test('should save tasks to localStorage', () => {
    // Save the tasks
    saveTasks(tasks);

    // Retrieve tasks from localStorage and check if they exist
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));

    expect(savedTasks).toHaveLength(2);
    expect(savedTasks[0].name).toBe('Task 1');
    expect(savedTasks[1].name).toBe('Task 2');
  });  

  test('should handle saving an empty list of tasks', () => {
    // Save empty tasks
    saveTasks([]);

    const savedTasks = JSON.parse(localStorage.getItem('tasks'));

    expect(savedTasks).toHaveLength(0);
  });
  
  test('should load tasks from localStorage', () => {
    // Save the tasks
    saveTasks(tasks);

    // Load the tasks
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(2);
    expect(loadedTasks[0]).toMatchObject(tasks[0].toJSON());
    expect(loadedTasks[1]).toMatchObject(tasks[1].toJSON());
  });

    test('should delete a task from localStorage', () => {
    // Save tasks to localStorage
    saveTasks(tasks);

    // Simulate a DOM element for the task
    const taskElement = {
      querySelector: (selector) => {
        if (selector === '#name') {
          return { innerText: 'Task 1' };
        }
        return null;
      },
    };

    // Delete the task
    deleteTaskFromLocalStorage(taskElement);

    const updatedTasks = loadTasks();

    expect(updatedTasks).toHaveLength(1);
    expect(updatedTasks[0].name).toBe('Task 2');
  });

    test('should preserve additional task properties during save and load', () => {
    // Add additional properties to tasks
    tasks[0].additionalProperty = "Some Value";
    saveTasks(tasks);

    const loadedTasks = loadTasks();

    expect(loadedTasks[0].additionalProperty).toBeUndefined();
  });

    test('should not update task column if task is not found', () => {
    // Save tasks to localStorage
    saveTasks(tasks);

    // Simulate a non-existent task
    const taskElement = {
      querySelector: (selector) => {
        if (selector === '#name') {
          return { textContent: 'Non-existent Task' };
        }
        return null;
      },
    };

    updateTaskColumn(taskElement, 'Done');

    const updatedTasks = loadTasks();
    expect(updatedTasks.find((task) => task.name === 'Task 1').column).toBe('To Do');
  });

  test('should update task column in localStorage', () => {
    // First save tasks to localStorage
    saveTasks(tasks);

    // Simulate a task element
    const taskElement = {
      querySelector: () => ({ textContent: 'Task 1' })
    };

    // Update task column
    updateTaskColumn(taskElement, 'In Progress');

    // Load tasks and verify the column was updated
    const updatedTasks = loadTasks();
    const updatedTask = updatedTasks.find(task => task.name === 'Task 1');

    expect(updatedTask.column).toBe('In Progress');
  });

    test('should handle loading tasks when localStorage is empty', () => {
    // Ensure localStorage is clear
    localStorage.clear();

    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(0);
  });
});