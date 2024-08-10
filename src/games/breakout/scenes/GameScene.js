import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.bricks;
    this.paddle;
    this.ball;
    this.customBounds;
    this.score = 0; // Initialize the score
    this.highestScore = 0; // Initialize the highest score
    this.scoreText; // Variable to hold the score text
    this.highestScoreText; // Variable to hold the highest score text
    this.lives = 2; // Initialize the number of lives
    this.lifeImages = []; // Array to store life images
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0);

    // Set up world bounds but disable collision on the bottom as before
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Custom bounds (box) settings
    const boxX = 270;
    const boxY = 150;
    const boxWidth = 480;
    const boxHeight = 600;

    // Create an invisible box using physics bodies
    this.customBounds = this.physics.add.staticGroup();

    // Create individual walls for the box
    this.customBounds
      .create(boxX, boxY, null)
      .setSize(boxWidth, 10)
      .setVisible(false); // Top
    this.customBounds
      .create(boxX - boxWidth / 2, boxY + boxHeight / 2, null)
      .setSize(10, boxHeight)
      .setVisible(false); // Left
    this.customBounds
      .create(boxX + boxWidth / 2, boxY + boxHeight / 2, null)
      .setSize(10, boxHeight)
      .setVisible(false); // Right

    // Create the static group
    this.bricks = this.physics.add.staticGroup({
      key: "assets",
      frame: ["blue1", "red1", "green1", "yellow1", "silver1", "purple1"],
      frameQuantity: 10,
      gridAlign: {
        width: 10,
        height: 6,
        cellWidth: 32,
        cellHeight: 16,
        x: 100,
        y: 200,
      },
    });

    // Define custom sizes for each frame
    const frameDimensions = {
      blue1: { width: 32, height: 16 },
      red1: { width: 32, height: 16 },
      green1: { width: 32, height: 16 },
      yellow1: { width: 32, height: 16 },
      silver1: { width: 32, height: 16 },
      purple1: { width: 32, height: 16 },
    };

    // Adjust the size and position of each frame
    this.bricks.children.iterate(function (brick) {
      const frameKey = brick.frame.name;
      const { width, height } = frameDimensions[frameKey];

      // Set the display size of the brick
      brick.displayWidth = width;
      brick.displayHeight = height;

      // Adjust the position if necessary
      brick.setOrigin(0.5, 0.5); // Optional: set origin to center
    });

    // Ball setup
    this.ball = this.physics.add
      .image(300, 605, "assets", "ball1")
      .setCollideWorldBounds(false) // Disable world bounds collision
      .setBounce(1)
      .setDisplaySize(15, 15); // Set the width and height of the ball
    this.ball.setData("onPaddle", true);

    // Paddle setup
    this.paddle = this.physics.add
      .image(300, 640, "assets", "paddle1")
      .setDisplaySize(80, 20) // Set the width and height of the paddle
      .setImmovable();

    // Colliders
    this.physics.add.collider(
      this.ball,
      this.bricks,
      this.hitBrick,
      null,
      this
    );
    this.physics.add.collider(
      this.ball,
      this.paddle,
      this.hitPaddle,
      null,
      this
    );
    this.physics.add.collider(this.ball, this.customBounds); // Collide with the custom bounds

    // Input handlers
    this.input.on(
      "pointermove",
      function (pointer) {
        this.paddle.x = Phaser.Math.Clamp(
          pointer.x,
          boxX - boxWidth / 2 + this.paddle.width / 2,
          boxX + boxWidth / 2 - this.paddle.width / 2
        );

        if (this.ball.getData("onPaddle")) {
          this.ball.x = this.paddle.x;
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      function (pointer) {
        if (this.ball.getData("onPaddle")) {
          this.ball.setVelocity(-75, -300);
          this.ball.setData("onPaddle", false);
        }
      },
      this
    );

    // Create and display the score text
    this.scoreText = this.add.text(84, 48, '0', {
      fontSize: '20px',
      fill: '#fff'
    });

    // Create and display the highest score text
    this.highestScoreText = this.add.text(140, 84, '0', {
      fontSize: '14px',
      fill: '#fff'
    });

    // Initialize the life images
    this.updateLivesDisplay();
  }

  hitBrick(ball, brick) {
    brick.disableBody(true, true);

    // Increase score when a brick is hit
    this.updateScore(10);

    if (this.bricks.countActive() === 0) {
      this.resetLevel();
    }
  }

  updateScore(amount) {
    this.score += amount;
    this.scoreText.setText(this.score);

    // Update the highest score if the current score is higher
    if (this.score > this.highestScore) {
      this.highestScore = this.score;
      this.highestScoreText.setText(this.highestScore);
    }
  }

  resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, 605);
    this.ball.setData("onPaddle", true);
  }

  resetLevel() {
    this.resetBall();

    this.bricks.children.each((brick) => {
      brick.enableBody(false, 0, 0, true, true);
    });
  }

  hitPaddle(ball, paddle) {
    let diff = 0;

    if (ball.x < paddle.x) {
      diff = paddle.x - ball.x;
      ball.setVelocityX(-10 * diff);
    } else if (ball.x > paddle.x) {
      diff = ball.x - paddle.x;
      ball.setVelocityX(10 * diff);
    } else {
      ball.setVelocityX(2 + Math.random() * 8);
    }
  }

  update() {
    if (this.ball.y > 800) {
      this.lives--; // Decrease lives when ball falls off screen
      this.updateLivesDisplay();

      if (this.lives <= 0) {
        this.gameOver(); // End the game if no lives are left
      } else {
        this.resetBall(); // Reset the ball position
      }
    }
  }

  updateLivesDisplay() {
    // Clear existing life images
    if (this.lifeImages.length > 0) {
      this.lifeImages.forEach(lifeImage => lifeImage.destroy());
      this.lifeImages = [];
    }

    // Create new life images
    const startX = 84;
    const startY = 700;
    const spacing = 30;
    for (let i = 0; i < this.lives; i++) {
      const lifeImage = this.add.image(startX + i * spacing, startY, "assets", "paddle1");
      lifeImage.setDisplaySize(30, 10);
      lifeImage.setAngle(-45); // Tilt the image
      this.lifeImages.push(lifeImage);
    }
  }

  gameOver() {
    // Reset the score and restart the level
    this.score = 0;
    this.highestScore = Math.max(this.highestScore, this.score);
    this.scoreText.setText(this.score);
    this.highestScoreText.setText(this.highestScore);

    // Reset lives and update display
    this.lives = 3;
    this.updateLivesDisplay();

    // Restart the level
    this.resetLevel();
  }
}

export default GameScene;
