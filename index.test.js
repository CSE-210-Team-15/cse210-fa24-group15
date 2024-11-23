/* globals describe, beforeEach, require, expect, it */ 
const { saveTasks } = require('./script');
// script.test.js

describe("DOM manipulation tests", () => {
    let modal, columnsContainer, columns;
  
    beforeEach(() => {
      // Mocking the DOM elements to simulate the HTML structure
      document.body.innerHTML = `
        <div class="confirm-modal"></div>
        <div class="columns">
          <div class="column"></div>
          <div class="column"></div>
        </div>
      `;
  
      // Now select the elements as you normally would
      modal = document.querySelector('.confirm-modal');
      columnsContainer = document.querySelector('.columns');
      columns = columnsContainer.querySelectorAll('.column');
    });
  
    it("should correctly query the elements", () => {
      // Perform any assertions or actions on modal, columnsContainer, or columns
      expect(modal).not.toBeNull(); // Modal should be in the DOM
      expect(columns.length).toBe(2); // There should be 2 column elements
    });
  });
  

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    },
  };
})();

global.localStorage = localStorageMock;

// Mock the `toJSON` method for task objects
class Task {
  constructor({ name, estTime, startTime, remainingTime, difficulty }) {
    this.name = name;
    this.estTime = estTime;
    this.startTime = new Date(startTime);
    this.remainingTime = remainingTime;
    this.difficulty = difficulty;
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
}

describe("saveTasks", () => {
  it("should save tasks to localStorage in JSON format", () => {
    const tasks = [
      new Task({
        name: "hi",
        estTime: "12",
        startTime: "2024-11-23T20:59:21.977Z",
        remainingTime: "12",
        difficulty: "easy",
      }),
    ];

    // Call the saveTasks function
    saveTasks(tasks);

    // Check that localStorage contains the serialized tasks
    const savedData = localStorage.getItem("tasks");
    expect(savedData).toBe(
      JSON.stringify([
        {
          name: "hi",
          estTime: "12",
          startTime: "2024-11-23T20:59:21.977Z",
          remainingTime: "12",
          difficulty: "easy",
        },
      ])
    );
  });
});
