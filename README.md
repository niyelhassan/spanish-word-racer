# Spanish Word Racer

Spanish Word Racer is an educational game designed to help players enhance their Spanish vocabulary while navigating a car through a virtual road. The game requires players to collect the correct Spanish words corresponding to the questions displayed, avoiding incorrect words to maintain their score.

## Content

**Vocab** (93 words): Lección 1, 2, and 3 of "Descubre 2" 

**Concepts** (60 questions; 10 for each):
- Por vs Para
- Relative pronouns
- Imperfect tense verbs
- Indefinite and negative words
- Comparisons
- Superlatives

## Features

- **Interactive Gameplay**: Navigate a car using arrow keys to collect words.
- **Educational**: Enhance your Spanish vocabulary and concepts while having fun.
- **Responsive Design**: Adapts to different screen sizes.
- **Persistent Score**: High scores are saved locally in the browser.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/spanish-word-racer.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd spanish-word-racer
   ```
3. **Open `index.html` in your browser**:
   ```bash
   open index.html
   ```

## Usage

### Home Screen

- **Start Button**: Begins the game.
- **Instructions Button**: Displays game instructions.

### Game Screen

- **Arrow Keys**: Use the left and right arrow keys to move the car.
- **Collect Words**: Collect the correct Spanish words that match the question displayed at the top of the screen.
- **Avoid Incorrect Words**: Avoid collecting words that do not match the question.
- **Score**: Your score increases as you collect correct words.

### Game Over Screen

- **Play Again Button**: Restarts the game.

## Project Structure

- `index.html`: The main HTML file.
- `main.js`: Contains the game logic using the Phaser framework.
- `images/`: Directory containing images and other assets used in the game.
  - `start.png`: Start button image.
  - `instructions.png`: Instructions button image.
  - `road.png`: Background image of the road.
  - `car.png`: Car sprite.
- `question-answer.json`: Contains the Spanish words and their corresponding English translations.

## Code Overview

### HomeScene

The `HomeScene` class is responsible for the home screen, where players can start the game or view instructions.

### GameScene

The `GameScene` class handles the main gameplay. It includes methods for:

- Loading assets (`preload`)
- Creating game objects (`create`)
- Updating game state (`update`)
- Adding obstacles (`addObstacle`)
- Setting random words (`setRandomWord`)
- Handling collisions (`hitObstacle`)
- Managing the score (`updateScore`)
- Handling game over state (`gameOver`)
- Displaying game over text (`showGameOverText`)

## Dependencies

- [Phaser 3](https://phaser.io/): A fast, free, and fun open source framework for Canvas and WebGL powered browser games.
- [WebFont Loader](https://github.com/typekit/webfontloader): A JavaScript library that gives you more control over font loading.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
