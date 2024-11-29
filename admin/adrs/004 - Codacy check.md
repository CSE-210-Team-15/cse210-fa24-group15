## Context and Problem Statement

Which platform to use to check for code quality?

## Considered Options

- Codacy
- SonarQube
- CodeClimate

## Decision Outcome

**Codacy** was selected as the code quality checking tool.

## Pros and Cons of the Options

### Codacy

**Pros:**

- Supports a wide range of programming languages, making it versatile for multi-language projects.
- Seamlessly integrates with popular CI/CD tools like Jenkins, GitHub Actions, and GitLab CI.
- Easy to set up and use with an intuitive interface.

**Cons:**

- Some advanced features, like team management and priority settings, are available only in paid plans.
- Slight learning curve for customizing rules for niche frameworks.

### SonarQube

**Pros:**

- Deep integration with Azure DevOps, GitHub, and Bitbucket pipelines.
- Strong support for open-source projects with free usage for public repositories.

**Cons:**

- Requires more configuration effort for private repositories or custom rules.
- UI can feel overwhelming for smaller teams or straightforward projects.

### CodeClimate

**Pros:**

- Focuses on maintainability with detailed issue reports and velocity tracking.
- Offers developer-centric insights, like trends in code quality over time.
- Simplified configuration for monorepo support.

**Cons:**

- Limited support for some languages compared to Codacy or SonarCloud.
- Advanced analytics and detailed metrics locked behind enterprise pricing.
