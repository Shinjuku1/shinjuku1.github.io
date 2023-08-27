document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let dx = 0;
    let dy = 0;
    const ballRadius = 50;
    let score = 0;
    let gameStarted = false;
    const scoreElement = document.getElementById("score");
    const highScores = [];
    const scoreListElement = document.getElementById("scoreList");
  
    function updateHighScores() {
        highScores.sort((a, b) => b - a);
        highScores.length = Math.min(highScores.length, 10);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        scoreListElement.innerHTML = highScores.map(s => `<li>${s}</li>`).join("");
      }
  
    function drawBall() {
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  
    function resetGame() {
        highScores.push(score);
        updateHighScores();
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      dx = 0;
      dy = 0;
      score = 0;
      gameStarted = false;
      scoreElement.textContent = "Score: " + score;
    }
  
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        drawBall();
      
        if (!gameStarted) {
          requestAnimationFrame(gameLoop);
          return;
        }
      
        if (ballY + dy > canvas.height - ballRadius) {
          resetGame();
        }
      
        if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
          dx = -dx;
        }
      
        // Adjust the falling speed by changing the dy value
        dy += 0.2; // Increase this value for faster falling, decrease for slower falling
      
        ballX += dx;
        ballY += dy;
        requestAnimationFrame(gameLoop);
      }
  
    canvas.addEventListener("mousedown", function (e) {
      const x = e.clientX - canvas.getBoundingClientRect().left;
      const y = e.clientY - canvas.getBoundingClientRect().top;
  
      if (Math.sqrt((x - ballX) ** 2 + (y - ballY) ** 2) < ballRadius) {
        dx = (x - ballX) / 10;
        dy = -10;
        gameStarted = true;
        score++;
        scoreElement.textContent = "Score: " + score;
      }
    });
  
  // Initialize high scores from local storage if available
    const storedHighScores = localStorage.getItem('highScores');
    if (storedHighScores) {
    highScores.push(...JSON.parse(storedHighScores));
  }
  updateHighScores();
  
    // Start the game loop
    gameLoop();
  });
  
