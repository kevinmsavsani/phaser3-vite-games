import Phaser from "phaser";

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.bricks;
    this.paddle;
    this.ball;
    this.customBounds;
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0);

    // Set up world bounds but disable collision on the bottom as before
    this.physics.world.setBoundsCollision(true, true, true, false);

    // Custom bounds (box) settings
    const boxX = 270;
    const boxY = 150;
    const boxWidth = 460;
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

    // Bricks setup
    this.bricks = this.physics.add.staticGroup({
      key: "assets",
      frame: ["blue1", "red1", "green1", "yellow1", "silver1", "purple1"],
      frameQuantity: 10,
      gridAlign: {
        width: 10,
        height: 6,
        cellWidth: 32,
        cellHeight: 16,
        x: 112,
        y: 200,
      },
    });

    // Ball setup
    this.ball = this.physics.add
      .image(300, 605, "assets", "ball1")
      .setCollideWorldBounds(false) // Disable world bounds collision
      .setBounce(1);
    this.ball.setData("onPaddle", true);

    // Paddle setup
    this.paddle = this.physics.add
      .image(300, 640, "assets", "paddle1")
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
  }

  hitBrick(ball, brick) {
    brick.disableBody(true, true);

    if (this.bricks.countActive() === 0) {
      this.resetLevel();
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
      this.resetBall();
    }
  }
}

export default GameScene;
