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
  BRICK_GRID_WIDTH: 3,
  BRICK_GRID_HEIGHT: 2,
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
  ROUND_TEXT_X: 430,
  ROUND_TEXT_Y: 48,
  ROUND_TEXT_FONT_SIZE: "20px",
  ROUND_TEXT_COLOR: "#fff",

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

const BASE_ROUND_CONFIG = [
  {
    round: 1,
    ballVelocityX: -300,
    ballVelocityY: -300,
    brickConfig: {
      width: 5,
      height: 4,
      startX: 200,
      startY: 200,
      cellWidth: 32,
      cellHeight: 16,
      frames: ["blue1", "red1"],
      frameQuantity: 10
    },
  },
  {
    round: 2,
    ballVelocityX: -500,
    ballVelocityY: -500,
    brickConfig: {
      width: 5,
      height: 3,
      startX: 80,
      startY: 180,
      cellWidth: 32,
      cellHeight: 16,
      frames: ["yellow1", "silver1", "purple1"],
      frameQuantity: 5
    },
  },
];

const generateBrickGrid = (config) => {
  const { width, height, frames, frameQuantity } = config.brickConfig;

  const totalCells = width * height;
  const totalFrames = frames.length * frameQuantity;
  const totalNulls = totalCells - totalFrames;

  // Create an array containing the frames and null values
  const elements = [
    ...frames.flatMap(frame => Array(frameQuantity).fill(frame)),
    ...Array(totalNulls).fill(null),
  ];

  // Shuffle the elements array
  for (let i = elements.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [elements[i], elements[j]] = [elements[j], elements[i]];
  }

  // Convert the shuffled array into a 2D grid
  const grid = [];
  for (let i = 0; i < height; i++) {
    grid.push(elements.slice(i * width, (i + 1) * width));
  }

  return grid;
};


export const ROUND_CONFIG = BASE_ROUND_CONFIG.map(config => ({
  ...config,
  brickGrid: generateBrickGrid(config),
}));