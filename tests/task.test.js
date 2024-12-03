const {
  saveTasks,
  updateTaskColumn,
  loadTasks,
  deleteTaskFromLocalStorage,
} = require('../src/components/tasks/task.js');

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
      new MockTask('Task 1', 3600000, 'Medium', 'To Do'),
      new MockTask('Task 2', 1800000, 'Low', 'In Progress'),
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

  test('should handle task with special characters in name', () => {
    // Create a task with special characters
    const specialTask = new MockTask('Task @#$%^', 7200000, 'High', 'To Do');

    // Save and load the special task
    saveTasks([specialTask]);
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(1);
    expect(loadedTasks[0].name).toBe('Task @#$%^');
  });

  test('should handle updating task column to a different column', () => {
    // Save tasks to localStorage
    saveTasks(tasks);

    const taskElement = {
      querySelector: () => ({ textContent: 'Task 1' }),
    };

    // Update task from 'To Do' to 'Done'
    updateTaskColumn(taskElement, 'Done');

    // Load tasks and verify the column was updated
    const updatedTasks = loadTasks();
    const updatedTask = updatedTasks.find((task) => task.name === 'Task 1');

    expect(updatedTask.column).toBe('Done');
  });

  test('should handle tasks with zero estimated time', () => {
    const zeroTimeTask = new MockTask('Zero Time Task', 0, 'Low', 'To Do');

    saveTasks([zeroTimeTask]);
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(1);
    expect(loadedTasks[0].estTime).toBe(0);
  });

  test('should handle multiple saves and loads', () => {
    // Initial save
    saveTasks(tasks);

    // Add a new task and save again
    const newTask = new MockTask('Task 3', 2700000, 'High', 'To Do');
    tasks.push(newTask);
    saveTasks(tasks);

    // Load tasks
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(3);
    expect(loadedTasks[2].name).toBe('Task 3');
  });

  test('should handle task with very long name', () => {
    const longNameTask = new MockTask(
      'This is an extremely long task name that goes on and on and on to test the limits of task name length',
      5400000,
      'Medium',
      'In Progress'
    );

    saveTasks([longNameTask]);
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(1);
    expect(loadedTasks[0].name).toBe(
      'This is an extremely long task name that goes on and on and on to test the limits of task name length'
    );
  });

  test('should not modify original tasks array when saving', () => {
    const originalTasksLength = tasks.length;

    // Save tasks
    saveTasks(tasks);

    // Verify original tasks array remains unchanged
    expect(tasks).toHaveLength(originalTasksLength);
  });

  test('should handle task with different difficulty levels', () => {
    const difficultTasks = [
      new MockTask('Easy Task', 1800000, 'Easy', 'To Do'),
      new MockTask('Hard Task', 7200000, 'Hard', 'To Do'),
    ];

    saveTasks(difficultTasks);
    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(2);
    expect(loadedTasks[0].difficulty).toBe('Easy');
    expect(loadedTasks[1].difficulty).toBe('Hard');
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
    tasks[0].additionalProperty = 'Some Value';
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
    expect(updatedTasks.find((task) => task.name === 'Task 1').column).toBe(
      'To Do'
    );
  });

  test('should update task column in localStorage', () => {
    // First save tasks to localStorage
    saveTasks(tasks);

    // Simulate a task element
    const taskElement = {
      querySelector: () => ({ textContent: 'Task 1' }),
    };

    // Update task column
    updateTaskColumn(taskElement, 'In Progress');

    // Load tasks and verify the column was updated
    const updatedTasks = loadTasks();
    const updatedTask = updatedTasks.find((task) => task.name === 'Task 1');

    expect(updatedTask.column).toBe('In Progress');
  });

  test('should handle loading tasks when localStorage is empty', () => {
    // Ensure localStorage is clear
    localStorage.clear();

    const loadedTasks = loadTasks();

    expect(loadedTasks).toHaveLength(0);
  });
});
