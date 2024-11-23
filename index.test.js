const sum = require('./index'); // Only import the `sum` function from the main file.

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});