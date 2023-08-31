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
  let rotationSpeed = 0;
  let distanceFromCenterX = 0; // Declare distanceFromCenterX here

  function updateHighScores() {
    highScores.sort((a, b) => b - a);
    highScores.length = Math.min(highScores.length, 10);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    scoreListElement.innerHTML = highScores.map(s => `<li>${s}</li>`).join("");
  }

  function drawBall() {
    const image = new Image();
    image.src = "https://shinjuku1.github.io/SoccerBall.png";

    ctx.save();
    ctx.translate(ballX, ballY);
    ctx.rotate(rotationSpeed);
    ctx.drawImage(image, -ballRadius, -ballRadius, ballRadius * 2, ballRadius * 2);
    ctx.restore();
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

    dy += 0.2;
    ballX += dx;
    ballY += dy;
    rotationSpeed += -0.05 * (distanceFromCenterX / ballRadius); // Varies based on distance from center
    requestAnimationFrame(gameLoop);
  }

  canvas.addEventListener("mousedown", function (e) {
    const x = e.clientX - canvas.getBoundingClientRect().left;
    const y = e.clientY - canvas.getBoundingClientRect().top;

    distanceFromCenterX = x - ballX; // Calculate distance here

    if (Math.sqrt((x - ballX) ** 2 + (y - ballY) ** 2) < ballRadius) {
      const rotationFactor = 0.001;
      rotationSpeed += -distanceFromCenterX * rotationFactor; // Adjusted rotation speed

      dx = -(distanceFromCenterX * 0.05);
      dy = -10;

      gameStarted = true;
      score++;
      scoreElement.textContent = "Score: " + score;
    }
  });

  const storedHighScores = localStorage.getItem('highScores');
  if (storedHighScores) {
    highScores.push(...JSON.parse(storedHighScores));
  }
  updateHighScores();

  gameLoop();
});
