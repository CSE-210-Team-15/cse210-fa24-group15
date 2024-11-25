## Attendence

- Joey
- Soumya
- Matthew
- Yuan
- Gavin
- Sakshi
- Kuber
- Steve (remote)
- Li

## Accomplishments

### Overview

This week we accomplished implementing some UI elements for the gamified aspect
of our product. We also began work on the time tracking of tasks, including allowing
users to estimate time that a task will take. We also began implementation of a ticking
timer for tasks in progress (which can be freely paused/resumed). Additionally, We finalized
our designs created wireframes for all screens in our application.

For the game aspect, we gathered image and gif assets for virtual pets, and rendered them
onscreen with a short animation when users hover over them. There is an option to
hide them. We also finished implementation of the pet shop UI according to our wireframes.

For the task tracking system. We added a feature allowing users to give an estimation of how
long a task will take to complete upon creation. We also implemented a live timer attached to each
task that can be paused and resumed by the user.

We also improved our CI/CD pipeline based on work done on the previous sprint. We added
linting and formatting checks as GitHub actions that require checks to pass before a pull request
can be approved. We also finalized our automated deployment via Firebase. Lastly, we added
Codacy to automate code quality checking as part of the pre-merge checks on GitHub.

### Individual Notes

- Joey: Gathered pet assets, added pet animation, refactored code into components
- Matthew: Implemented fetching from localstorage on refresh, timer functionality on tasks, play/pause
  creation
- Yuan: Added pet object representing a pet and its status, game object that tracks pets available and coins,
wrote test cases for game and pet objects  
- Steve: Implemented pet shop and pet management UI
- Gavin: Added pet object representing a pet and its status, game object that tracks pets available and coins, implemented automated deployment, code quality checker, and release versioning
  Firebase
- Soumya: Implemented pet rendering, automated linting and formatting on GitHub side, some testing,
created wireframes for our application
- Sakshi: Improving test coverage and wrote test cases
- Kuber: Worked on task entry for estimated time, help with automated linting
- Li: Worked on pet object representing a pet and its status  

## Spillover

We plan to dedicate some resources next sprint to cleaning up and refactoring a part of our codebase for better testability. We had some issues writing unit tests and integration tests for the task manager portion of our app this sprint, due to the code not being modular enough, thus we have decided to address some of these issues early this sprint for better modularity and testability.
