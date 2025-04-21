// Wait for the HTML document to be fully loaded before running script
document.addEventListener('DOMContentLoaded', function() {

    // --- Getting references to important HTML elements  ---
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');

    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const nextBtn = document.getElementById('next-btn');

    // Adding reference to the form and the incorrect answers list
    const configForm = document.getElementById('config-form');
    const incorrectAnswersListEl = document.getElementById('incorrect-answers-list'); // Added

    const questionTextEl = document.getElementById('question-text');
    const answerOptionsEl = document.getElementById('answer-options');
    const feedbackEl = document.getElementById('feedback');
    const scoreEl = document.getElementById('score');

    // --- Quiz variables (use let for variables that change) ---
    let questions = []; // To store questions from API
    let currentQuestionIndex = 0; // Track which question we are on
    let score = 0; // Track the user's score
    let incorrectAnswers = []; // <<<<<< ADDED: Array to store incorrect answers info

    // --- Helper Functions ---

    /**
     * Shows the specified screen (by ID) and hides all others using CSS classes.
     * @param {string} screenId - The ID of the HTML element representing the screen to show.
     */
    function showScreen(screenId) {
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.toggle('active', screen.id === screenId);
        });
    }

    // <<<<<< ADDED: Function to build API URL from the form >>>>>>
    /**
     * Builds the API URL based on user configuration form.
     * @returns {string} The complete URL for the Open Trivia DB API request.
     */
    function buildApiUrl() {
        const API_BASE = 'https://opentdb.com/api.php';
        const formData = new FormData(configForm); // Read data from the form
        const params = new URLSearchParams();

        // Get number of questions, default to 10 if invalid or not provided
        let amount = parseInt(formData.get('amount')) || 10;
        params.append('amount', Math.max(1, Math.min(amount, 50))); // Ensure amount is valid

        // Append other optional parameters if they have a value
        ['category', 'difficulty', 'type'].forEach(key => {
            const value = formData.get(key);
            if (value) { // Only add if a selection was made (value is not "")
                params.append(key, value);
            }
        });

        return `${API_BASE}?${params.toString()}`; // Combine base URL with parameters
    }


    // --- Event Listeners ---

    // 1. When the Start Button is clicked
    startBtn.addEventListener('click', function() {
        console.log("Start button clicked");
        // Reset score, index, and incorrect answers list for a new game
        score = 0;
        currentQuestionIndex = 0;
        incorrectAnswers = []; // <<<<<< ADDED: Clear previous incorrect answers
        feedbackEl.textContent = '';
        feedbackEl.className = '';

        // Fetch questions from the API - NOW USES buildApiUrl()
        const apiUrl = buildApiUrl(); // <<<<<< CHANGED: Get URL dynamically

        console.log("Fetching questions from:", apiUrl);

        // Optional: Show loading indicator
        showScreen('loading'); // Assuming you have a loading screen element

        fetch(apiUrl)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then(function(data) {
                console.log("Data received:", data);
                if (data.response_code !== 0) {
                     // Handle API-specific errors (e.g., no questions for criteria)
                    let errorMsg = "Could not retrieve questions.";
                    if (data.response_code === 1) errorMsg = "Not enough questions found for your criteria. Please try different options.";
                    if (data.response_code === 2) errorMsg = "Invalid parameter in request.";
                    throw new Error(errorMsg); // Throw specific error
                }

                questions = data.results;

                // Check if questions array is empty even on success (response_code 0 but no results)
                 if (!questions || questions.length === 0) {
                     throw new Error("No questions returned for the selected criteria, even though the API call succeeded.");
                 }


                questions.forEach(function(q) {
                    q.question = decodeEntities(q.question);
                    q.correct_answer = decodeEntities(q.correct_answer);
                    q.incorrect_answers = q.incorrect_answers.map(decodeEntities);
                });

                showScreen('quiz-screen');
                displayCurrentQuestion();
            })
            .catch(function(error) {
                console.error('Error fetching questions:', error);
                 // Display error more prominently
                 showScreen('error-screen'); // Assuming you have an error screen
                 const errorMessageEl = document.getElementById('error-message'); // Assuming error screen has this
                 if (errorMessageEl) errorMessageEl.textContent = `Failed to load questions: ${error.message}. Please check your selections and try again.`;
                 else alert('Error loading questions: ' + error.message + '. Please try again.'); // Fallback alert
            });
    });

    // 2. When the Restart Button is clicked
    restartBtn.addEventListener('click', function() {
        console.log("Restart button clicked");
        questions = [];
        feedbackEl.textContent = '';
        feedbackEl.className = '';
        answerOptionsEl.innerHTML = '';
        nextBtn.style.display = 'none';
        incorrectAnswers = []; // Clear incorrect answers too
        incorrectAnswersListEl.innerHTML = ''; // Clear the list display

        showScreen('start-screen');
    });

     // 3. When the Next Question Button is clicked
     nextBtn.addEventListener('click', function() {
        console.log("Next button clicked");
        currentQuestionIndex++;
        displayCurrentQuestion();
    });

     // 4. Optional: Add listener for the Try Again button on error screen
     const tryAgainBtn = document.getElementById('try-again-btn'); // Assuming you have this button
     if(tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            showScreen('start-screen'); // Go back to start screen to reconfigure/retry
        });
     }


    // --- More Helper Functions ---

    // Function to display the current question and answers
    function displayCurrentQuestion() {
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }
        const currentQuestion = questions[currentQuestionIndex];
        questionTextEl.textContent = currentQuestion.question;
        answerOptionsEl.innerHTML = '';
        feedbackEl.textContent = '';
        feedbackEl.className = '';
        nextBtn.style.display = 'none';

        let answers = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        shuffleArray(answers);

        answers.forEach(function(answer) {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('answer-btn');
            button.addEventListener('click', function(event) {
                handleAnswerSelection(event.target);
            });
            answerOptionsEl.appendChild(button);
        });
    }

    // Function to handle when an answer button is clicked
    function handleAnswerSelection(clickedButton) {
        const selectedAnswer = clickedButton.textContent;
        // Need currentQuestion accessible here
        const currentQuestion = questions[currentQuestionIndex];
        const correctAnswer = currentQuestion.correct_answer;

        const allButtons = answerOptionsEl.querySelectorAll('.answer-btn');
        allButtons.forEach(function(btn) {
            btn.disabled = true;
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct-answer');
            }
        });

        feedbackEl.classList.remove('correct-feedback', 'incorrect-feedback');
        if (selectedAnswer === correctAnswer) {
            score++;
            feedbackEl.textContent = "Correct!";
            feedbackEl.classList.add('correct-feedback');
        } else {
            feedbackEl.textContent = "Incorrect. The correct answer was: " + correctAnswer;
            feedbackEl.classList.add('incorrect-feedback');
            clickedButton.classList.add('incorrect-answer');

            // <<<<<< ADDED: Record the incorrect answer >>>>>>
            incorrectAnswers.push({
                question: currentQuestion.question,
                yourAnswer: selectedAnswer,
                correctAnswer: correctAnswer
            });
        }

        if (currentQuestionIndex < questions.length - 1) {
            nextBtn.style.display = 'block';
        } else {
            setTimeout(showResults, 1200);
        }
    }

    // Function to show the final results screen
    function showResults() {
        console.log("Showing results");
        showScreen('results-screen');
        scoreEl.textContent = 'Quiz Complete! Your score: ' + score + ' out of ' + questions.length;

        // <<<<<< ADDED: Display incorrect answers review >>>>>>
        incorrectAnswersListEl.innerHTML = ''; // Clear previous list
        if (incorrectAnswers.length === 0) {
            incorrectAnswersListEl.innerHTML = '<li>Congratulations! You answered all questions correctly!</li>';
        } else {
            incorrectAnswers.forEach(item => {
                const li = document.createElement('li');
                // Use innerHTML for simple formatting
                li.innerHTML = `
                    <p><strong>Question:</strong> ${item.question}</p>
                    <p><em>Your Answer:</em> ${item.yourAnswer}</p>
                    <p><strong>Correct Answer:</strong> ${item.correctAnswer}</p>
                `;
                incorrectAnswersListEl.appendChild(li);
            });
        }
         //<<<<<< END Added section
    }

    // Utility function to shuffle an array (Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Utility function to decode HTML entities
    function decodeEntities(encodedString) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = encodedString;
        return textArea.value;
    }

    // --- Initial Setup ---
    // Use the showScreen function to ensure only the start screen is visible initially
    showScreen('start-screen');

}); // End of DOMContentLoaded