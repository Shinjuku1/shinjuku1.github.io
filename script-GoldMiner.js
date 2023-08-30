// Game variables
const board = [];
let score = 0;
let firstBlock = null;
let timeLeft = 60; // 60 seconds
let gameIsActive = false;

// Block types 
const EMPTY = 0;
const GOLD = 1;
const GEM = 2;
const ROCK = 3;

// Generate initial board
function generateBoard() {
  for (let row = 0; row < 10; row++) {
    board[row] = [];
    for (let col = 0; col < 10; col++) {
      const type = Math.floor(Math.random() * 3) + 1;
      board[row][col] = type;
      const block = document.createElement('div');
      block.classList.add('block');
      block.dataset.row = row;
      block.dataset.col = col;
      block.addEventListener('click', swapBlocks);
      document.getElementById('board').appendChild(block);
    }
  }
  updateBoard();
}

// Update board with animation
function updateBoard() {
  const blocks = document.querySelectorAll('.block');
  blocks.forEach((block, index) => {
    const row = Math.floor(index / 10);
    const col = index % 10;
    const type = board[row][col];
    
    // Update class
    block.className = 'block';
    if (type === GOLD) {
      block.classList.add('gold');
      block.textContent = '';
    } else if (type === GEM) {
      block.classList.add('gem');
      block.textContent = '';
    } else if (type === ROCK) {
      block.classList.add('rock');
      block.textContent = '';
    } else {
      block.textContent = '';
    }
    
    // Add transition for animation
    block.style.transition = 'all 0.3s ease-in-out';
  });
  
  // Update score
  document.getElementById('score').innerText = `Score: ${score}`;
}

// Swap two blocks
function swapBlocks(e) {
  const row = Number(e.target.dataset.row);
  const col = Number(e.target.dataset.col);
  
  if (!firstBlock) {
    firstBlock = { row, col };
    if (!gameIsActive) {
      gameIsActive = true;
      timeLeft = 60;
      timerInterval = setInterval(updateTimer, 1000);
    }
    return;
  }

  const row1 = firstBlock.row;
  const col1 = firstBlock.col;

  [board[row1][col1], board[row][col]] = [board[row][col], board[row1][col1]];

  findMatches(row1, col1, row, col);

  firstBlock = null;

  updateBoard();
}

// Find matches
function findMatches(row1, col1, row2, col2) {
  const toRemove = new Set();
  [ [row1, col1], [row2, col2] ].forEach(([row, col]) => {
    checkMatch(row, col, toRemove);
  });

  // Remove matches and shift down
  removeAndShift(toRemove);
}

// Check for matches from a specific block
function checkMatch(row, col, toRemove) {
  const type = board[row][col];
  if (type === EMPTY) return;

  const stack = [[row, col]];
  const visited = new Set();

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    const key = `${r}-${c}`;
    if (visited.has(key)) continue;
    visited.add(key);

    // Check neighbors
    [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < 10 && nc >= 0 && nc < 10 && board[nr][nc] === type) {
        stack.push([nr, nc]);
      }
    });
  }

  if (visited.size >= 3) {
    for (const key of visited) {
      toRemove.add(key);
    }
  }
}

// Remove and shift down
function removeAndShift(toRemove) {
  for (const key of toRemove) {
    const [row, col] = key.split('-').map(Number);
    if (board[row][col] === GOLD) score += 3;
    else if (board[row][col] === GEM) score += 2;
    else if (board[row][col] === ROCK) score += 1;
    board[row][col] = EMPTY;
  }
  
  // Shift down blocks to fill empty spaces
  for (let col = 0; col < 10; col++) {
    let emptyRow = -1; // Define emptyRow here
    for (let row = 9; row >= 0; row--) {
      if (board[row][col] === EMPTY) {
        emptyRow = row;  // Update emptyRow here
      } else if (emptyRow !== -1) {
        board[emptyRow][col] = board[row][col];
        board[row][col] = EMPTY;
        emptyRow--;
      }
    }
  }

  // Fill in new blocks from the top
  for (let col = 0; col < 10; col++) {
    for (let row = 0; row < 10; row++) {
      if (board[row][col] === EMPTY) {
        board[row][col] = Math.floor(Math.random() * 3) + 1; // Randomly fill it with GOLD, GEM, or ROCK
      }
    }
  }
  
  updateBoard();
}

// Countdown timer
let timerInterval = null;  // Declare timerInterval globally

function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `Time left: ${timeLeft}s`;
  timeLeft--;

  if (timeLeft < 0) {
    clearInterval(timerInterval);
    saveHighScore(score);
    alert("Time's up!");
    gameIsActive = false; // Reset the game state
  }
}

function resetGame() {
  // Clear existing board
  document.getElementById('board').innerHTML = '';
  
  // Reset the game board
  generateBoard();

  // Reset score
  score = 0;

  // Reset and stop the timer
  clearInterval(timerInterval);  // Clear the existing timer
  timeLeft = 60;  // Reset the time to its initial value
  document.getElementById('timer').textContent = `Time left: ${timeLeft}s`;  // Update the timer display

  // Reset the game active status
  gameIsActive = false;  // Make sure the game is not active until the first click

  // Reset highscores display
  displayHighscores();

  // Reset the board display
  updateBoard();  // You can call this to make sure the board and score are properly displayed
}

// Highscores
const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
const highscoreElement = document.getElementById("highscores");

function displayHighscores() {
  highscoreElement.innerHTML = "High Scores:<br>" + highscores.map(score => score).join('<br>');
}

function saveHighScore(newScore) {
  highscores.push(newScore);
  highscores.sort((a, b) => b - a);
  highscores.length = Math.min(highscores.length, 10); // Keep only top 10 scores
  localStorage.setItem("highscores", JSON.stringify(highscores));
  displayHighscores();
}

// Initialize highscores
displayHighscores();

// Initialize the game for the first time
resetGame();
