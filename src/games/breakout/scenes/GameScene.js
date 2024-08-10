import Phaser from "phaser";
import { GAME_CONFIG, FRAME_DIMENSIONS, ROUND_CONFIG } from "../constant";

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
    this.currentRound = 1; // Initialize the current round
    this.totalRounds = ROUND_CONFIG.length; // Define the total number of rounds
    this.roundText; // Variable to hold the round text
  }
  
  create() {
    this.add.image(0, 0, "background").setOrigin(0);

    // Set up world bounds but disable collision on the bottom as before
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Create an invisible box using physics bodies
    this.customBounds = this.physics.add.staticGroup();

    // Create individual walls for the box
    this.customBounds
      .create(GAME_CONFIG.BOX_X, GAME_CONFIG.BOX_Y, null)
      .setSize(GAME_CONFIG.BOX_WIDTH, 10)
      .setVisible(false); // Top

    this.customBounds
      .create(
        GAME_CONFIG.BOX_X - GAME_CONFIG.BOX_WIDTH / 2,
        GAME_CONFIG.BOX_Y + GAME_CONFIG.BOX_HEIGHT / 2,
        null
      )
      .setSize(10, GAME_CONFIG.BOX_HEIGHT)
      .setVisible(false); // Left

    this.customBounds
      .create(
        GAME_CONFIG.BOX_X + GAME_CONFIG.BOX_WIDTH / 2,
        GAME_CONFIG.BOX_Y + GAME_CONFIG.BOX_HEIGHT / 2,
        null
      )
      .setSize(10, GAME_CONFIG.BOX_HEIGHT)
      .setVisible(false); // Right

    this.loadRoundConfig();

    // Ball setup
    this.ball = this.physics.add
      .image(
        GAME_CONFIG.BALL_START_X,
        GAME_CONFIG.BALL_START_Y,
        "assets",
        "ball1"
      )
      .setCollideWorldBounds(false) // Disable world bounds collision
      .setBounce(1)
      .setDisplaySize(GAME_CONFIG.BALL_WIDTH, GAME_CONFIG.BALL_HEIGHT); // Set the width and height of the ball
    this.ball.setData("onPaddle", true);

    // Paddle setup
    this.paddle = this.physics.add
      .image(
        GAME_CONFIG.PADDLE_START_X,
        GAME_CONFIG.PADDLE_START_Y,
        "assets",
        "paddle1"
      )
      .setDisplaySize(GAME_CONFIG.PADDLE_WIDTH, GAME_CONFIG.PADDLE_HEIGHT) // Set the width and height of the paddle
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
    this.physics.add.collider(this.ball, this.customBounds);

    // Input handlers
    this.input.on(
      "pointermove",
      function (pointer) {
        this.paddle.x = Phaser.Math.Clamp(
          pointer.x,
          GAME_CONFIG.BOX_X - GAME_CONFIG.BOX_WIDTH / 2 + this.paddle.width / 2,
          GAME_CONFIG.BOX_X + GAME_CONFIG.BOX_WIDTH / 2 - this.paddle.width / 2
        );

        if (this.ball.getData("onPaddle")) {
          this.ball.x = this.paddle.x;
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      function () {
        if (this.ball.getData("onPaddle")) {
          this.ball.setVelocity(
            this.roundConfig.ballVelocityX,
            this.roundConfig.ballVelocityY
          );
          this.ball.setData("onPaddle", false);
        }
      },
      this
    );

    // Create and display the score text
    this.scoreText = this.add.text(
      GAME_CONFIG.SCORE_TEXT_X,
      GAME_CONFIG.SCORE_TEXT_Y,
      "0",
      {
        fontSize: GAME_CONFIG.SCORE_TEXT_FONT_SIZE,
        fill: GAME_CONFIG.SCORE_TEXT_COLOR,
      }
    );

    // Create and display the highest score text
    this.highestScoreText = this.add.text(
      GAME_CONFIG.HIGHEST_SCORE_TEXT_X,
      GAME_CONFIG.HIGHEST_SCORE_TEXT_Y,
      "0",
      {
        fontSize: GAME_CONFIG.HIGHEST_SCORE_TEXT_FONT_SIZE,
        fill: GAME_CONFIG.HIGHEST_SCORE_TEXT_COLOR,
      }
    );

    // Create and display the round text
    this.roundText = this.add.text(
      GAME_CONFIG.ROUND_TEXT_X,
      GAME_CONFIG.ROUND_TEXT_Y,
      `${this.currentRound}/${this.totalRounds}`,
      {
        fontSize: GAME_CONFIG.ROUND_TEXT_FONT_SIZE,
        fill: GAME_CONFIG.ROUND_TEXT_COLOR,
      }
    );

    // Initialize the life images
    this.updateLivesDisplay();
  }

  loadRoundConfig() {
    // Load the configuration for the current round
    this.roundConfig = ROUND_CONFIG[this.currentRound - 1];

    // Create the bricks with round-specific configuration
    this.createBricks(this.roundConfig.brickConfig, this.roundConfig.brickGrid);
    if (this.ball && this.bricks)
      this.physics.add.collider(
        this.ball,
        this.bricks,
        this.hitBrick,
        null,
        this
      );
  }
  createBricks(brickConfig, bricksGrid) {
    // Create the static group for bricks
    this.bricks = this.physics.add.staticGroup();
  
    // Define the grid align configuration
    const gridAlignConfig = {
      width: brickConfig.width, // Number of bricks per row
      height: brickConfig.height, // Number of rows
      cellWidth: brickConfig.cellWidth, // Width of each cell
      cellHeight: brickConfig.cellHeight, // Height of each cell
      x: brickConfig.startX, // X position of the grid start
      y: brickConfig.startY, // Y position of the grid start
    };
  
    // Iterate over each row and column to create bricks
    for (let row = 0; row < brickConfig.height; row++) {
      for (let col = 0; col < brickConfig.width; col++) {
        // Calculate the x and y position for each brick
        const x = gridAlignConfig.x + col * gridAlignConfig.cellWidth;
        const y = gridAlignConfig.y + row * gridAlignConfig.cellHeight;
  
        // Get the frame key from the bricksGrid configuration
        const frameKey = bricksGrid[row][col];
        
        if(frameKey) {
        // Create a new brick and set its position
        this.bricks.create(x, y, "assets", frameKey)
          .setOrigin(0.5, 0.5) // Center the origin of the brick
          .setSize(brickConfig.cellWidth, brickConfig.cellHeight) // Set the size of the brick
          .setDisplaySize(brickConfig.cellWidth, brickConfig.cellHeight); // Ensure the brick displays at the correct size
        }
      }
    }
  
    // Optionally adjust the size and position of each frame if needed
    this.bricks.children.iterate(function (brick) {
      const frameKey = brick.frame.name;
      const { width, height } = FRAME_DIMENSIONS[frameKey];
      brick.displayWidth = width;
      brick.displayHeight = height;
    });
  }
  
  

  hitBrick(ball, brick) {
    brick.disableBody(true, true);

    // Increase score when a brick is hit
    this.updateScore(10);

    if (this.bricks.countActive() === 0) {
      if (this.currentRound < this.totalRounds) {
        this.nextRound();
      } else {
        this.gameOver();
      }
    }
  }

  nextRound() {
    this.currentRound++;
    this.roundText.setText(`${this.currentRound}/${this.totalRounds}`);
    this.resetLevel();
  }

  updateScore(amount) {
    this.score += amount;
    this.scoreText.setText(this.score);

    if (this.score > this.highestScore) {
      this.highestScore = this.score;
      this.highestScoreText.setText(this.highestScore);
    }
  }

  resetBall() {
    this.ball.setVelocity(0);
    this.ball.setPosition(this.paddle.x, GAME_CONFIG.BALL_START_Y);
    this.ball.setData("onPaddle", true);
  }

  resetLevel() {
    this.resetBall();

    // Reload the round configuration
    this.loadRoundConfig();
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
      this.lives--; // Decrease lives when the ball falls off the screen
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
      this.lifeImages.forEach((lifeImage) => lifeImage.destroy());
      this.lifeImages = [];
    }

    // Create new life images
    for (let i = 0; i < this.lives; i++) {
      const lifeImage = this.add.image(
        GAME_CONFIG.LIVES_START_X + i * GAME_CONFIG.LIVES_SPACING,
        GAME_CONFIG.LIVES_START_Y,
        "assets",
        "paddle1"
      );
      lifeImage.setDisplaySize(
        GAME_CONFIG.LIFE_IMAGE_WIDTH,
        GAME_CONFIG.LIFE_IMAGE_HEIGHT
      );
      lifeImage.setAngle(GAME_CONFIG.LIFE_IMAGE_ANGLE); // Tilt the image
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
    this.lives = 2;
    this.updateLivesDisplay();

    this.currentRound = 1; // Reset to the first round
    this.roundText.setText(`${this.currentRound}/${this.totalRounds}`);

    // Restart the level
    this.resetLevel();
  }
}

export default GameScene;
