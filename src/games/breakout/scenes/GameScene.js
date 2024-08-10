import Phaser from "phaser";
import { GAME_CONFIG, FRAME_DIMENSIONS } from "../constant";

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
    this.totalRounds = 2; // Define the total number of rounds
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
      .create(GAME_CONFIG.BOX_X - GAME_CONFIG.BOX_WIDTH / 2, GAME_CONFIG.BOX_Y + GAME_CONFIG.BOX_HEIGHT / 2, null)
      .setSize(10, GAME_CONFIG.BOX_HEIGHT)
      .setVisible(false); // Left

    this.customBounds
      .create(GAME_CONFIG.BOX_X + GAME_CONFIG.BOX_WIDTH / 2, GAME_CONFIG.BOX_Y + GAME_CONFIG.BOX_HEIGHT / 2, null)
      .setSize(10, GAME_CONFIG.BOX_HEIGHT)
      .setVisible(false); // Right

    this.createBricks();

    // Ball setup
    this.ball = this.physics.add
      .image(GAME_CONFIG.BALL_START_X, GAME_CONFIG.BALL_START_Y, "assets", "ball1")
      .setCollideWorldBounds(false) // Disable world bounds collision
      .setBounce(1)
      .setDisplaySize(GAME_CONFIG.BALL_WIDTH, GAME_CONFIG.BALL_HEIGHT); // Set the width and height of the ball
    this.ball.setData("onPaddle", true);

    // Paddle setup
    this.paddle = this.physics.add
      .image(GAME_CONFIG.PADDLE_START_X, GAME_CONFIG.PADDLE_START_Y, "assets", "paddle1")
      .setDisplaySize(GAME_CONFIG.PADDLE_WIDTH, GAME_CONFIG.PADDLE_HEIGHT) // Set the width and height of the paddle
      .setImmovable();

    // Colliders
     this.physics.add.collider(this.ball, this.bricks, this.hitBrick, null, this);
    this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);
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
      function (pointer) {
        if (this.ball.getData("onPaddle")) {
          this.ball.setVelocity(GAME_CONFIG.BALL_VELOCITY_X, GAME_CONFIG.BALL_VELOCITY_Y);
          this.ball.setData("onPaddle", false);
        }
      },
      this
    );

    // Create and display the score text
    this.scoreText = this.add.text(GAME_CONFIG.SCORE_TEXT_X, GAME_CONFIG.SCORE_TEXT_Y, "0", {
      fontSize: GAME_CONFIG.SCORE_TEXT_FONT_SIZE,
      fill: GAME_CONFIG.SCORE_TEXT_COLOR,
    });

    // Create and display the highest score text
    this.highestScoreText = this.add.text(GAME_CONFIG.HIGHEST_SCORE_TEXT_X, GAME_CONFIG.HIGHEST_SCORE_TEXT_Y, "0", {
      fontSize: GAME_CONFIG.HIGHEST_SCORE_TEXT_FONT_SIZE,
      fill: GAME_CONFIG.HIGHEST_SCORE_TEXT_COLOR,
    });

    // Create and display the round text
    this.roundText = this.add.text(GAME_CONFIG.ROUND_TEXT_X, GAME_CONFIG.ROUND_TEXT_Y, `${this.currentRound}/${this.totalRounds}`, {
      fontSize: GAME_CONFIG.ROUND_TEXT_FONT_SIZE,
      fill: GAME_CONFIG.ROUND_TEXT_COLOR,
    });

    // Initialize the life images
    this.updateLivesDisplay();
  }

  createBricks() {
    // Create the static group for bricks
    this.bricks = this.physics.add.staticGroup({
      key: "assets",
      frame: ["blue1", "red1", "green1", "yellow1", "silver1", "purple1"],
      frameQuantity: 1,
      gridAlign: {
        width: GAME_CONFIG.BRICK_GRID_WIDTH,
        height: GAME_CONFIG.BRICK_GRID_HEIGHT,
        cellWidth: GAME_CONFIG.BRICK_CELL_WIDTH,
        cellHeight: GAME_CONFIG.BRICK_CELL_HEIGHT,
        x: GAME_CONFIG.BRICK_GRID_START_X,
        y: GAME_CONFIG.BRICK_GRID_START_Y,
      },
    });

    // Adjust the size and position of each frame
    this.bricks.children.iterate(function (brick) {
      const frameKey = brick.frame.name;
      const { width, height } = FRAME_DIMENSIONS[frameKey];
      brick.displayWidth = width;
      brick.displayHeight = height;
      brick.setOrigin(0.5, 0.5); // Optional: set origin to center
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
      lifeImage.setDisplaySize(GAME_CONFIG.LIFE_IMAGE_WIDTH, GAME_CONFIG.LIFE_IMAGE_HEIGHT);
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

    this.currentRound = 1; // Reset to first round
    this.roundText.setText(`${this.currentRound}/${this.totalRounds}`);

    // Restart the level
    this.resetLevel();
  }
}

export default GameScene;
