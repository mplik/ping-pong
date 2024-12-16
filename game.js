const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let playerScore = 0;
let gameRunning = false;
let balls = [{ x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2 }];

const player = {
  x: 10,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  dy: 0
};

const computer = {
  x: canvas.width - 20,
  y: canvas.height / 2 - 40,
  width: 10,
  height: 80,
  speed: 2
};

const startButton = document.getElementById('startGame');
const addBallButton = document.getElementById('addBall');
const scoreDisplay = document.getElementById('score');

startButton.addEventListener('click', () => {
  if (!gameRunning) {
    gameRunning = true;
    gameLoop();
  }
});

addBallButton.addEventListener('click', () => {
  if (gameRunning) {
    balls.push({ x: canvas.width / 2, y: canvas.height / 2, dx: 2, dy: 2 });
  }
});

function resetBall(ball) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = Math.random() > 0.5 ? 2 : -2;
  ball.dy = Math.random() > 0.5 ? 2 : -2;
}

function drawPaddle(x, y, width, height) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, width, height);
}

function drawBall(ball) {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.closePath();
}

function movePlayer() {
  player.y += player.dy;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

function moveComputer() {
  const ball = balls[0];  // Sterujemy ruchem komputera na podstawie pierwszej piłki
  if (ball.y < computer.y + computer.height / 2) {
    computer.y -= computer.speed;
  } else if (ball.y > computer.y + computer.height / 2) {
    computer.y += computer.speed;
  }
}

function moveBall(ball) {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Odbicie od górnej i dolnej krawędzi
  if (ball.y + 10 > canvas.height || ball.y - 10 < 0) {
    ball.dy *= -1;
  }

  // Odbicie od gracza
  if (
    ball.x - 10 < player.x + player.width &&
    ball.y > player.y &&
    ball.y < player.y + player.height
  ) {
    ball.dx *= -1;
  }

  // Odbicie od komputera
  if (
    ball.x + 10 > computer.x &&
    ball.y > computer.y &&
    ball.y < computer.y + computer.height
  ) {
    ball.dx *= -1;
  }

  // Punkt dla komputera
  if (ball.x - 10 < 0) {
    resetBall(ball);
  }

  // Punkt dla gracza
  if (ball.x + 10 > canvas.width) {
    playerScore++;
    scoreDisplay.textContent = playerScore;
    resetBall(ball);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPaddle(player.x, player.y, player.width, player.height);
  drawPaddle(computer.x, computer.y, computer.width, computer.height);

  balls.forEach(drawBall);
}

function update() {
  movePlayer();
  moveComputer();
  balls.forEach(moveBall);
}

function gameLoop() {
  if (gameRunning) {
    draw();
    update();
    requestAnimationFrame(gameLoop);
  }
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    player.dy = -4;
  } else if (e.key === 'ArrowDown') {
    player.dy = 4;
  }
});

window.addEventListener('keyup', () => {
  player.dy = 0;
});
const bounceSound = document.getElementById('bounceSound');
bounceSound.play();
