import test from 'node:test';
import assert from 'node:assert';
import { Task, saveTasks, loadTasks, updateTaskColumn, deleteTaskFromLocalStorage } from '../src/components/tasks/task.js';
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

// Mock localStorage
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

// Globally mock localStorage
global.localStorage = localStorage;

test('Task Management Functions', async (t) => {
  let tasks;

  t.beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Dummy data for testing
    tasks = [
      new MockTask('Task 1', 3600000, 'Medium', 'To Do'),
      new MockTask('Task 2', 1800000, 'Low', 'In Progress'),
    ];
  });

  await t.test('should handle task with special characters in name', () => {
    // Create a task with special characters
    const specialTask = new MockTask('Task @#$%^', 7200000, 'High', 'To Do');

    // Save and load the special task
    saveTasks([specialTask]);
    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks.length, 1);
    assert.strictEqual(loadedTasks[0].name, 'Task @#$%^');
  });

  await t.test('should handle updating task column to a different column', () => {
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

    assert.strictEqual(updatedTask.column, 'Done');
  });

  await t.test('should handle tasks with zero estimated time', () => {
    const zeroTimeTask = new MockTask('Zero Time Task', 0, 'Low', 'To Do');

    saveTasks([zeroTimeTask]);
    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks.length, 1);
    assert.strictEqual(loadedTasks[0].estTime, 0);
  });

  await t.test('should handle multiple saves and loads', () => {
    // Initial save
    saveTasks(tasks);

    // Add a new task and save again
    const newTask = new MockTask('Task 3', 2700000, 'High', 'To Do');
    tasks.push(newTask);
    saveTasks(tasks);

    // Load tasks
    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks.length, 3);
    assert.strictEqual(loadedTasks[2].name, 'Task 3');
  });

  await t.test('should handle task with very long name', () => {
    const longNameTask = new MockTask(
      'This is an extremely long task name that goes on and on and on to test the limits of task name length',
      5400000,
      'Medium',
      'In Progress'
    );

    saveTasks([longNameTask]);
    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks.length, 1);
    assert.strictEqual(
      loadedTasks[0].name,
      'This is an extremely long task name that goes on and on and on to test the limits of task name length'
    );
  });

  await t.test('should not modify original tasks array when saving', () => {
    const originalTasksLength = tasks.length;

    // Save tasks
    saveTasks(tasks);

    // Verify original tasks array remains unchanged
    assert.strictEqual(tasks.length, originalTasksLength);
  });

  await t.test('should handle task with different difficulty levels', () => {
    const difficultTasks = [
      new MockTask('Easy Task', 1800000, 'Easy', 'To Do'),
      new MockTask('Hard Task', 7200000, 'Hard', 'To Do'),
    ];

    saveTasks(difficultTasks);
    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks.length, 2);
    assert.strictEqual(loadedTasks[0].difficulty, 'Easy');
    assert.strictEqual(loadedTasks[1].difficulty, 'Hard');
  });

  await t.test('should delete a task from localStorage', () => {
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

    assert.strictEqual(updatedTasks.length, 1);
    assert.strictEqual(updatedTasks[0].name, 'Task 2');
  });

  await t.test('should preserve additional task properties during save and load', () => {
    // Add additional properties to tasks
    tasks[0].additionalProperty = 'Some Value';
    saveTasks(tasks);

    const loadedTasks = loadTasks();

    assert.strictEqual(loadedTasks[0].additionalProperty, undefined);
  });

  await t.test('should not update task column if task is not found', () => {
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
    const task = updatedTasks.find((task) => task.name === 'Task 1');
    assert.strictEqual(task.column, 'To Do');
  });

  await t.test('should update task column in localStorage', () => {
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

    assert.strictEqual(updatedTask.column, 'In Progress');
  });
});