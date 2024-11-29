# Project Link

https://cse210team15.web.app

# Contribution Guide

Welcome to the project! This guide will walk you through setting up the development environment and the processes required for contributing effectively.

## Prerequisites

1. **Node.js and npm**  
   Ensure you have [Node.js] installed.

2. **Linting and Formatting**
   Install these extensions (VS Code)
   - ESLint
   - Prettier

## Getting Started

1. Clone the Repository
   Copy code

   ```
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install Dependencies
   Run the following command to install all required dependencies:

   ```
   npm install
   ```

3. Set up Husky for precommit hooks

# Development Workflow

1. Linting and Formatting

- To check linting errors:

  ```
  npm run lint
  ```

- To format the code:
  ```
  npm run format
  ```

2. Testing

   ```
   npm test
   ```

3. Pre-commit Hooks:

   Husky ensures that linting and formatting rules are enforced before commits. If changes fail these checks, they will need to be fixed before committing.
