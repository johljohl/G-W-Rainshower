const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 240; // Width based on the original image scale
canvas.height = 160; // Height based on the original image scale

let score = 0;
let lives = 3;
let gamePaused = false;
let raindrops = [];
let intervalId;

// Load the background image
const backgroundImage = new Image();
backgroundImage.src = "game_background.png"; // Path to the background image

canvas.width = backgroundImage.width = 320; // Set canvas width to match background image width
canvas.height = backgroundImage.height = 240; // Set canvas height to match background image height

// Define the laundry object
const laundry = {
  x: canvas.width / 2 - 15, // Center the laundry on the screen
  y: canvas.height - 30, // Position from the top
  width: 30,
  height: 10,
  speed: 10, // Speed at which the laundry moves
};

// Raindrop class to create new raindrops
class Raindrop {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = 0; // Start at the top of the canvas
    this.speed = 1; // Speed at which the raindrop falls
  }

  move() {
    this.y += this.speed;
  }

  draw() {
    ctx.font = "16px Arial"; // Set the font size and style for the emoji
    ctx.fillText("💧", this.x, this.y); // Draw the emoji at the raindrop's position
    ctx.fillStyle = "black";
  }

  // Check if the raindrop has hit the ground
  hitGround() {
    return this.y >= canvas.height;
  }

  // Collision detection between the raindrop and the laundry
  collidesWithLaundry() {
    const bottomOfRaindrop = this.y + 5; // +5 for the radius of the raindrop
    return (
      bottomOfRaindrop >= laundry.y &&
      bottomOfRaindrop <= laundry.y + laundry.height &&
      this.x >= laundry.x &&
      this.x <= laundry.x + laundry.width
    );
  }
}

// Function to start the game
function startGame() {
  if (!intervalId) {
    intervalId = setInterval(gameLoop, 16); // Approximately 60 FPS
  }
}

// Function to pause the game
function pauseGame() {
  clearInterval(intervalId);
  intervalId = null;
  setTimeout(startGame, 5000); // Pause for 5 seconds
}

// Function to update the game state
function updateGame() {
  if (Math.random() < 0.05) {
    raindrops.push(new Raindrop());
  }

  for (let i = raindrops.length - 1; i >= 0; i--) {
    raindrops[i].move();

    if (raindrops[i].collidesWithLaundry()) {
      // Raindrop hits the laundry, reduce lives
      lives--;
      raindrops.splice(i, 1);
      if (lives === 0) {
        // alert("Game Over! Your score: " + score);
        clearInterval(intervalId);
        return;
      }
    } else if (raindrops[i].hitGround()) {
      // Raindrop misses the laundry and hits the ground, increase the score
      score++;
      raindrops.splice(i, 1);
    }
  }
}

// Function to render the game
function renderGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  // Draw the laundry emoji
  ctx.font = "30px Arial"; // Set the font size larger for the emoji
  ctx.fillText("👕", laundry.x, laundry.y + laundry.height); // Adjust y position to align the emoji

  // Render raindrops
  raindrops.forEach((raindrop) => raindrop.draw());

  // Render score and lives
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, 20);
  ctx.fillText("Lives: " + lives, canvas.width - 70, 20);
}

// The main game loop
function gameLoop() {
  if (!gamePaused) {
    updateGame();
    renderGame();
  }
}

// Event listeners for keyboard input
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    laundry.x -= laundry.speed;
    if (laundry.x < 0) laundry.x = 0; // Prevent the laundry from moving off-screen to the left
  } else if (event.key === "ArrowRight") {
    laundry.x += laundry.speed;
    if (laundry.x + laundry.width > canvas.width) {
      laundry.x = canvas.width - laundry.width; // Prevent the laundry from moving off-screen to the right
    }
  }
});

// Start the game when the script loads
startGame();
