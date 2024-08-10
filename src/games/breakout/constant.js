// Constants.js

export const GAME_CONFIG = {
  WIDTH: 540,
  HEIGHT: 750,
  
  // World & Custom Bounds
  BOX_X: 270,
  BOX_Y: 150,
  BOX_WIDTH: 480,
  BOX_HEIGHT: 600,

  // Ball Configuration
  BALL_START_X: 300,
  BALL_START_Y: 605,
  BALL_WIDTH: 15,
  BALL_HEIGHT: 15,
  BALL_VELOCITY_X: -75,
  BALL_VELOCITY_Y: -300,

  // Paddle Configuration
  PADDLE_START_X: 300,
  PADDLE_START_Y: 640,
  PADDLE_WIDTH: 80,
  PADDLE_HEIGHT: 20,

  // Bricks Configuration
  BRICK_WIDTH: 32,
  BRICK_HEIGHT: 16,
  BRICK_GRID_WIDTH: 10,
  BRICK_GRID_HEIGHT: 6,
  BRICK_CELL_WIDTH: 32,
  BRICK_CELL_HEIGHT: 16,
  BRICK_GRID_START_X: 100,
  BRICK_GRID_START_Y: 200,

  // UI Configuration
  SCORE_TEXT_X: 84,
  SCORE_TEXT_Y: 48,
  SCORE_TEXT_FONT_SIZE: "20px",
  SCORE_TEXT_COLOR: "#fff",
  HIGHEST_SCORE_TEXT_X: 140,
  HIGHEST_SCORE_TEXT_Y: 84,
  HIGHEST_SCORE_TEXT_FONT_SIZE: "14px",
  HIGHEST_SCORE_TEXT_COLOR: "#fff",

  // Lives Display Configuration
  LIVES_START_X: 84,
  LIVES_START_Y: 700,
  LIVES_SPACING: 30,
  LIFE_IMAGE_WIDTH: 30,
  LIFE_IMAGE_HEIGHT: 10,
  LIFE_IMAGE_ANGLE: -45,
};

export const FRAME_DIMENSIONS = {
  blue1: { width: 32, height: 16 },
  red1: { width: 32, height: 16 },
  green1: { width: 32, height: 16 },
  yellow1: { width: 32, height: 16 },
  silver1: { width: 32, height: 16 },
  purple1: { width: 32, height: 16 },
};
