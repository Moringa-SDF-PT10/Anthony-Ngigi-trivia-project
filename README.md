# Anthony-Ngigi-trivia-project

# Trivia Quiz SPA

## Project Description

This is a Single Page Application (SPA) that presents an interactive trivia quiz to the user. Questions are fetched dynamically from the [Open Trivia Database API](https://opentdb.com/) based on user-selected criteria. The user answers questions one by one, receives immediate feedback, and sees their final score and a review of incorrect answers at the end.

This project fulfills the requirements for the Moringa School Phase 1 Project, demonstrating proficiency in HTML, CSS, and JavaScript, including asynchronous programming (`fetch`), DOM manipulation, event handling, and API interaction.

## Features

*   **Configurable Quiz:** Allows users to select the number of questions, category, difficulty, and question type (multiple choice/true-false) before starting.
*   **Dynamic Question Fetching:** Retrieves questions from the Open Trivia DB API based on user configuration.
*   **Single Page Application:** All interactions happen on a single HTML page without reloads.
*   **Interactive Gameplay:**
    *   Starts the quiz upon clicking "Start Quiz".
    *   Displays one question at a time.
    *   Requires clicking a "Next Question" button to advance after answering.
    *   Provides immediate visual feedback (Correct/Incorrect) upon answering.
    *   Highlights the correct answer after selection.
*   **Score Tracking:** Keeps track of the user's score throughout the quiz.
*   **Results Screen:**
    *   Displays the user's final score (e.g., "7 out of 10").
    *   Provides a review section listing the questions answered incorrectly, showing the user's answer and the correct answer.
*   **Restart Option:** Allows the user to restart the quiz, returning to the configuration screen.
*   **Error Handling:** Basic handling for API errors (e.g., no questions found for criteria) and network issues.
*   **(Potential/Optional) Hover Effects:** Answer choices may have visual feedback on mouse hover.

*(Note: Per-question timers and total time tracking are potential bonus features not currently implemented in this version.)*

## Technologies Used

*   HTML5
*   CSS3 (including CSS classes for styling feedback and managing screen visibility)
*   JavaScript (ES6+)
    *   `fetch` API for asynchronous requests to OpenTDB
    *   DOM Manipulation (getting elements, changing text, adding/removing elements)
    *   Event Listeners (`click`, `DOMContentLoaded`)
    *   `FormData` and `URLSearchParams` for handling form data and building API URLs
    *   Array Methods (`forEach`, `map`, spread syntax `...`) for data handling

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:Moringa-SDF-PT10/Anthony-Ngigi-trivia-project.git
    ```
    *(Replace with your actual repository URL)*
2.  **Navigate to the project directory:**
    ```bash
    cd yourfirstname-yourlastname-trivia-project
    ```
3.  **Open `index.html`:**
    Simply open the `index.html` file in your web browser. No complex build steps or local server is required for basic functionality. Using a tool like VS Code's Live Server extension can be helpful during development for automatic reloading.

## How to Play

1.  Open the `index.html` file or navigate to the deployed GitHub Pages link.
2.  On the start screen, adjust the quiz settings (number of questions, category, difficulty, type) using the form elements.
3.  Click the "Start Quiz" button.
4.  The application will load the questions and display the first one.
5.  Read the question and click on the button corresponding to your chosen answer.
6.  You'll see immediate feedback (Correct/Incorrect), and the correct answer will be highlighted.
7.  If it's not the last question, click the "Next Question" button to proceed.
8.  Repeat steps 5-7 for all questions.
9.  Once all questions are answered, the Results screen will appear.
10. Review your final score and the list of any questions you answered incorrectly.
11. Click "Restart Quiz" to return to the start screen and play again.

## Deployment

This project is intended to be deployed using GitHub Pages from the `gh-pages` branch.

**Live Link:** https://moringa-sdf-pt10.github.io/Anthony-Ngigi-trivia-project/

## Author

*   Your Name - [Optional: Link to your GitHub Profile]