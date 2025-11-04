ParaBank Automation Testing Project

This repository contains an end-to-end (E2E) test automation framework for the [ParaBank demo application](https://parabank.parasoft.com/). It is built using Playwright, JavaScript, and the Page Object Model (POM) design pattern.

✨ Features

* Page Object Model (POM): Tests are organized using POM for clean, maintainable, and reusable code.
* Data-Driven: Test data for login and bill pay is externalized into JSON files (in the `/data` folder).
* CI/CD Integration: Includes a GitHub Actions workflow (`.github/workflows/playwright.yml`) that automatically runs tests on every push and pull request.
* Reporting: Integrated with Allure for detailed and interactive test reports.
* Authentication: Uses Playwright's global setup (`global-setup.js`) to log in once and save the authentication state, speeding up test execution.

🧪 Automated Test Scenarios

This framework covers the following key user flows:

* User Registration
* Login and Logout
* Bill Payment
* Fund Transfer
* Open New Account

🛠️ Tech Stack

* Framework: [Playwright](https://playwright.dev/)
* Language: JavaScript
* Reporting: [Allure Report](https://allure.qatools.com/)
* CI/CD: [GitHub Actions](https://github.com/features/actions)

🚀 How to Run Locally

# Prerequisites

* [Node.js](https://nodejs.org/en/) (v18 or higher)
* Git

# 1. Setup

1.  Clone the repository:
    ```bash
    git clone [https://github.com/piyushmr45/parabank-automation-testing.git](https://github.com/piyushmr45/parabank-automation-testing.git)
    cd parabank-automation-testing
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Install Playwright browsers:
    ```bash
    npx playwright install
    ```

4.  Set up environment variables:
    This project uses a `.env` file for sensitive data like login credentials. Create your own `.env` file in the project root.
    ```
    # .env file
    USER_NAME="your_username"
    USER_PASSWORD="your_password"
    ```

# 2. Running Tests

You can run the tests using several commands:

* Run all tests (headless):
    ```bash
    npx playwright test
    ```

* Run all tests (headed mode):
    ```bash
    npx playwright test --headed
    ```

* Run a specific test file:
    ```bash
    npx playwright test tests/parabank-cv.spec.js
    ```

* Open Playwright UI Mode:
    ```bash
    npx playwright test --ui
    ```

# 3. View Allure Report

After running the tests, you can generate and view the Allure report.

1.  Run tests & generate results:
    (The `npx playwright test` command will automatically create the `allure-results` directory)

2.  Generate the HTML report:
    ```bash
    npx allure generate allure-results --clean -o allure-report
    ```

3.  Open the report in your browser:
    ```bash
    npx allure open allure-report
    ```

# workflow-badge (GitHub Actions)

The CI workflow is automatically triggered on every `push` and `pull_request` to the `main` branch. You can view the test runs, logs, and artifacts (including the Allure report) under the "Actions" tab of this repository.
