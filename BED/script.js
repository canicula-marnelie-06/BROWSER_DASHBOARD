// Array of possible secret words
const words = ["apple", "blueberry", "guava", "orange", "kiwi"];

// Game variables
let secretWord = "";
let attemptsLeft = 5;
let gameOver = false;

// DOM elements
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const restartBtn = document.getElementById("restart-btn");
const feedbackDiv = document.getElementById("feedback");
const hintDiv = document.getElementById("hint");
const body = document.body;

// Function to initialize the game
function initializeGame() {
    // Select a random word from the array
    secretWord = words[Math.floor(Math.random() * words.length)];
    
    // Reset game state
    attemptsLeft = 5;
    gameOver = false;
    
    // Update hint (first letter of secret word) - always updated on restart
    hintDiv.textContent = `Hint: The word starts with '${secretWord.charAt(0).toUpperCase()}'.`;
    
    // Clear feedback and input
    feedbackDiv.textContent = "";
    guessInput.value = "";
    
    // Reset background color
    body.style.backgroundColor = "";
    
    // Log secret word to console for testing
    console.log("Secret word (for testing):", secretWord);
}

// Function to handle guess submission (modified to handle multiple guesses with dynamic secret word based on hint)
function submitGuess() {
    if (gameOver) return; // Prevent guesses after game over
    
    // Get and process user input (trim whitespace)
    let userInput = guessInput.value.trim();
    
    // Clear input field
    guessInput.value = "";
    
    // Check if input contains commas (indicating multiple guesses)
    if (userInput.includes(',')) {
        // Split into array of guesses
        let guessesArray = userInput.split(',').map(guess => guess.trim().toLowerCase()).filter(guess => guess !== "");
        
        // If no valid guesses, treat as empty
        if (guessesArray.length === 0) {
            feedbackDiv.textContent = "Please enter at least one valid guess.";
            return;
        }
        
        // Extract the hint letter from the current hint (e.g., 'O' from "Hint: The word starts with 'O'.")
        let hintLetter = hintDiv.textContent.split("'")[1].toUpperCase();
        
        // Find the secret word that starts with the hint letter
        secretWord = words.find(word => word.charAt(0).toUpperCase() === hintLetter) || words[0]; // Fallback to first word if not found
        
        // Update hint based on the new secret word
        hintDiv.textContent = `Hint: The word starts with '${secretWord.charAt(0).toUpperCase()}'.`;
        
        // Reset game state for batch processing
        attemptsLeft = 5;
        gameOver = false;
        feedbackDiv.textContent = "";
        body.style.backgroundColor = "";
        
        // Process each guess in the array silently (no UI updates until end)
        for (let userGuess of guessesArray) {
            if (gameOver) break; // Stop if game is over
            
            // Check if correct
            if (userGuess === secretWord) {
                feedbackDiv.textContent = "Congratulations! You guessed the secret word!";
                body.style.backgroundColor = "lightgreen";
                gameOver = true;
                break;
            }
            
            // Incorrect: decrement attempts
            attemptsLeft--;
            
            // Check if exhausted
            if (attemptsLeft === 0) {
                feedbackDiv.textContent = `Game over! The secret word was '${secretWord}'.`;
                body.style.backgroundColor = "lightcoral";
                gameOver = true;
            }
        }
        
        // Log the final state for testing
        console.log("Multiple guesses processed. Final feedback:", feedbackDiv.textContent);
        return;
    }
    
    // Single guess processing (original logic)
    let userGuess = userInput.toLowerCase();
    
    // Check if input is empty
    if (userGuess === "") {
        feedbackDiv.textContent = `Incorrect guess. You have ${attemptsLeft} attempts left. Try again!`;
        return;
    }
    
    // Check if guess is correct (case-insensitive)
    if (userGuess === secretWord) {
        feedbackDiv.textContent = "Congratulations! You guessed the secret word!";
        body.style.backgroundColor = "lightgreen"; // Win color
        gameOver = true;
        return;
    }
    
    // Incorrect guess: decrement attempts
    attemptsLeft--;
    
    // Check if attempts are exhausted
    if (attemptsLeft === 0) {
        feedbackDiv.textContent = `Game over! The secret word was '${secretWord}'.`;
        body.style.backgroundColor = "lightcoral"; // Loss color
        gameOver = true;
    } else {
        feedbackDiv.textContent = `Incorrect guess. You have ${attemptsLeft} attempts left. Try again!`;
    }
}

// Event listeners (unchanged)
submitBtn.addEventListener("click", submitGuess);
restartBtn.addEventListener("click", initializeGame);

// Allow Enter key to submit guess (unchanged)
guessInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});

// Initialize the game on page load (unchanged)
initializeGame();