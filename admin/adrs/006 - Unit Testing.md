## Context and Problem Statement

Which software to use for making unit tests

## Considered Options

- Jest
- Node Test Runner
- Mocha
- Cypress

## Decision Outcome

Jest - Rejected

Switched to Node Test Runner because part of the team is using Common JS (CJS) and Part of the team is using ES modules (ESM). Jest doesn't support ES modules well, and it is easier to switch to ES modules for the code using Common JS than the other way around. Node Test Runner is a built in testing solution for Node JS. It is easy to use and no installation required.

##### Usage

- For testing: node --test
- For Coverage Report: node --test --experimental-test-coverage

## Pros and Cons of the Options

### Jest

##### Pros

- Easy to learn
- Easy to setup

##### Cons

- Bad support for ES Modules

### Node Test Runner

##### Pros

- Easy to learn and setup
- Supports ES Modules

##### Cons

- New to the industry

### Mocha

##### Pros

- Supports both back end and front end testing
- Supports Node JS debugger

##### Cons

- Not as easy to use as Jest or Test Runner

### Cypress

##### Pros

- No setup required
- Run on browser, with interactive interface

##### Cons:

- Best for React usage, but this project is not using React
