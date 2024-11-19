## Sprint 1 Retrospective:

### Sprint Goal:

The primary objective of this sprint was to develop a functional kanban board application and create an automated development pipeline. The goal was to implement a CICD pipeline having stages like: Code development, linting, automated documentation, unit testing, deployment.

### What we implemented:

### Status of the Pipeline

- Development (Local)
  - Make a small change or add a feature.
- Linting and coding styling
  - Enabled ESLint for linting and Prettier for code styling on our local editor (via IDE setting and extension). Can run scripts for linting and formatting before committing the code
  - Enabled pre-commit checks for consistent linting and formatting through Husky.
- Documentation
  - Generate a folder based on JSDoc comments
  - Display detailed information about function/method
- Environment Separation (dev vs prod)
  - dev vs prod branching
  - PR and merge staging
- Unit Testing (local vs dev vs prod) (Automated Test, Jest)
  - Automated testing when code is pushed to Github, using workflow
  - Shows result in Github Actions section after push
- Deployment
  - The decision is made based on the pros and cons of different servers and platforms.
  - Automated deployment pipeline with Firebase on GitHub

### What went well:

1. Foundation for Automation
2. Scalable Codebase
3. Effective Collaboration
4. Test Coverage for Core Features

### What Could be Improved:

1. Incomplete Automation
2. Limited Case-Specific Testing
3. Documentation Depth
4. Performance and Optimization Testing

### Action Items for next Sprint:

1. Expand Automation
2. Enhance Documentation
3. Complete automated pipeline

### Conclusion:

The sprint laid a solid foundation for both CICD processes and application functionality. Moving forward, we plan to expand test coverage with more edge cases, implement comprehensive testing.
