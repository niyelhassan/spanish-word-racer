let words = []; // Array to store the words
let currentWord = null; // The current word to match
let recentWords = []; // Array to keep track of recent words
let obstacleCount = 0; // Counter for obstacles
const maxRecentWords = 5; // Maximum number of recent words to track
let wordsLoaded = false; // Flag to indicate if words have been loaded

class HomeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HomeScene' });
        this.isPopupVisible = false; // Flag to track popup state
    }

    preload() {
        // Load images and scripts
        this.load.image('startButton', 'images/start.png');
        this.load.image('instructionsButton', 'images/instructions.png');
        this.load.image('background', 'images/road.png');
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        console.log("HomeScene created");

        // Add the moving road background
        this.background = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, 0, 0, 'background');
        this.background.setScale(window.innerWidth / this.background.width, 1);

        // Add the dark overlay
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        this.overlay.fillRect(0, 0, window.innerWidth, window.innerHeight);

        WebFont.load({
            google: {
                families: ['Chakra Petch']
            },
            active: () => {
                // Add the title text
                const titleText = this.add.text(window.innerWidth / 2, window.innerHeight / 2 - 200, 'Spanish Word Racer', {
                    fontFamily: '"Chakra Petch"',
                    fontSize: '100px',
                    fill: '#fff',
                    resolution: 15,
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                titleText.alpha = 0;

                // Add and configure the start button
                this.startButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2 + 50, 'startButton').setScale(0.5).setInteractive();
                this.startButton.setOrigin(0.5);
                this.startButton.alpha = 0;

                // Add and configure the instructions button
                this.instructionsButton = this.add.sprite(window.innerWidth / 2, window.innerHeight / 2 + 200, 'instructionsButton').setScale(0.5).setInteractive();
                this.instructionsButton.setScale(0.2);
                this.instructionsButton.setOrigin(0.5);
                this.instructionsButton.alpha = 0;

                // Fade in the title text
                this.tweens.add({
                    targets: titleText,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2'
                });

                // Fade in the start button with a slight delay
                this.tweens.add({
                    targets: this.startButton,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    delay: 500
                });

                // Fade in the instructions button with a slight delay
                this.tweens.add({
                    targets: this.instructionsButton,
                    alpha: 1,
                    duration: 1000,
                    ease: 'Power2',
                    delay: 1000
                });

                // Start the game when the start button is pressed
                this.startButton.on('pointerdown', () => {
                    if (!this.isPopupVisible) {
                        console.log("Start button pressed");
                        this.cameras.main.fadeOut(100, 0, 0, 0);
                        this.cameras.main.on('camerafadeoutcomplete', () => {
                            this.scene.start('GameScene');
                        });
                    }
                });

                // Show instructions when the instructions button is pressed
                this.instructionsButton.on('pointerdown', () => {
                    if (!this.isPopupVisible) {
                        this.showInstructionsPopup();
                    }
                });
            }
        });
    }

    showInstructionsPopup() {
        this.isPopupVisible = true; // Set the flag to true

        // Create a solid color background for the popup
        const popupWidth = 1000;
        const popupHeight = 600;
        const popupX = (window.innerWidth - popupWidth) / 2;
        const popupY = (window.innerHeight - popupHeight) / 2;

        const popupBackground = this.add.graphics();
        popupBackground.fillStyle(0x333333, 1); // Dark grey color
        popupBackground.fillRect(popupX, popupY, popupWidth, popupHeight);

        const instructionsText = "Welcome to Spanish Word Racer!\n\n\nInstructions:\n1. Use the arrow keys to navigate your car.\n\n2. Collect the Spanish words that match the question displayed at the top of the screen.\n\n3. Avoid collecting any other Spanish words.\n\n4. Enhance your Spanish vocabulary and concepts as you race.\n\n\nGood luck and have fun!";

        const textStyle = {
            fontFamily: '"Chakra Petch"',
            fontSize: '32px',
            fill: '#fff',
            align: 'center',
            wordWrap: { width: popupWidth * 0.9 },
            resolution: 10,
            fontStyle: 'bold'
        };

        const instructionsLabel = this.add.text(window.innerWidth / 2, window.innerHeight / 2, instructionsText, textStyle).setOrigin(0.5);

        const closeButton = this.add.graphics();
        const closeButtonSize = 20;
        closeButton.lineStyle(4, 0xff0000);
        closeButton.moveTo(popupX + popupWidth - closeButtonSize - 20, popupY + closeButtonSize + 20);
        closeButton.lineTo(popupX + popupWidth - 20, popupY + 20);
        closeButton.moveTo(popupX + popupWidth - closeButtonSize - 20, popupY + 20);
        closeButton.lineTo(popupX + popupWidth - 20, popupY + closeButtonSize + 20);
        closeButton.strokePath();

        // Create an invisible area around the popup to close it
        const outsideArea = this.add.zone(0, 0, window.innerWidth, window.innerHeight);
        outsideArea.setOrigin(0);
        outsideArea.setInteractive();
        outsideArea.on('pointerdown', () => {
            if (this.isPopupVisible) {
                this.closePopup(popupBackground, instructionsLabel, closeButton, outsideArea);
            }
        });
    }

    closePopup(popupBackground, instructionsLabel, closeButton, outsideArea) {
        popupBackground.destroy();
        instructionsLabel.destroy();
        closeButton.destroy();
        outsideArea.destroy();
        this.isPopupVisible = false; // Reset the flag to false
    }

    update() {
        // Make the road move
        this.background.tilePositionY -= 5;
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        console.log("GameScene preload");
        // Load assets
        this.load.json('words', 'question-answer.json');
        this.load.image('background', 'images/road.png');
        this.load.image('car', 'images/car.png');
    }

    create() {
        console.log("GameScene create");

        // Load words from JSON file
        this.words = this.cache.json.get('words');
        this.wordsLoaded = true;

        // Add the moving road background
        this.background = this.add.tileSprite(window.innerWidth / 2, window.innerHeight / 2, 0, 0, 'background');
        this.background.setScale(window.innerWidth / this.background.width, 1);

        // Add the car sprite
        this.car = this.physics.add.sprite(window.innerWidth / 2, window.innerHeight - 150, 'car');
        this.car.setCollideWorldBounds(true);
        this.car.setScale(window.innerWidth / 160 / 13);

        // Create a group for obstacles
        this.obstacles = this.physics.add.group();

        // Set up cursor keys for input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Add collision detection between the car and obstacles
        this.physics.add.collider(this.car, this.obstacles, this.hitObstacle, null, this);

        // Add text for displaying the current question
        this.questionTextBackground = this.add.graphics();
        this.questionText = this.add.text(window.innerWidth / 2, 50, '', { fontSize: '50px', fill: '#fff', fontStyle: 'bold', wordWrap: { width: window.innerWidth - 40 }, fontFamily: '"Chakra Petch"', resolution: 10 });
        this.questionText.setOrigin(0.5);

        // Initialize score and high score
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;

        // Add graphics and text for displaying the score
        this.scoreBackground = this.add.graphics();
        this.scoreBackground.fillStyle(0x000000, 0.7);
        this.scoreBackground.fillRoundedRect(5, 5, 150, 50, 10);
        this.scoreText = this.add.text(10, 10, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff', fontFamily: '"Chakra Petch"', resolution: 10, fontStyle: 'bold' });

        // Initialize recent words and obstacle count
        this.recentWords = [];
        this.maxRecentWords = 5;
        this.obstacleCount = 0;

        // Set the first random word and start the obstacle timer
        this.setRandomWord();
        this.setRandomObstacleTimer();

        // Fade in the scene
        this.cameras.main.fadeIn(500, 0, 0, 0);

        this.isGameOver = false;
    }

    update() {
        if (this.isGameOver) {
            return;
        }

        // Make the road move
        this.background.tilePositionY -= 5;

        // Move the car left or right based on input
        if (this.cursors.left.isDown && this.car.x > window.innerWidth * 0.2) {
            this.car.setVelocityX(-300);
        } else if (this.cursors.right.isDown && this.car.x < window.innerWidth - window.innerWidth * 0.2) {
            this.car.setVelocityX(300);
        } else {
            this.car.setVelocityX(0);
        }

        // Move the obstacles downward
        Phaser.Actions.IncY(this.obstacles.getChildren(), 5);

        // Remove obstacles that go off screen
        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle.y > window.innerHeight) {
                obstacle.destroy();
            }
        });
    }

    addObstacle() {
        if (!this.wordsLoaded) return;

        // Set random position for the obstacle
        const x = Phaser.Math.Between(window.innerWidth * 0.2, window.innerWidth - window.innerWidth * 0.3);
        let text;

        // Set the text for the obstacle
        if (this.obstacleCount % 5 === 0 && this.obstacleCount > 0) {
            text = this.currentWord.answer;
        } else {
            const possibleWords = this.words.map(word => word.answer);
            const availableWords = possibleWords.filter(word => word !== this.currentWord.answer && !this.recentWords.some(recent => recent.answer === word));
            text = Phaser.Utils.Array.GetRandom(availableWords);

            let chosenWord = this.words.find(word => word.answer === text);
            if (chosenWord) {
                this.recentWords.push(chosenWord);
                if (this.recentWords.length > this.maxRecentWords) {
                    this.recentWords.shift();
                }
            }
        }

        // Add the obstacle text
        const obstacleText = this.add.text(0, 0, text, { fontSize: '32px', fill: '#FF2929', fontStyle: 'bold', fontFamily: '"Chakra Petch"'});
        const obstacleWidth = obstacleText.width;
        const obstacleHeight = obstacleText.height;

        // Add the obstacle background
        const obstacleBackground = this.add.graphics();
        obstacleBackground.fillStyle(0x000000, 0.5);
        obstacleBackground.fillRoundedRect(-10, -10, obstacleWidth + 20, obstacleHeight + 20, 10);
        obstacleText.setDepth(1);

        // Create a container for the obstacle
        const obstacleContainer = this.add.container(x, 0, [obstacleBackground, obstacleText]);
        this.physics.world.enable(obstacleContainer);

        // Set the size and velocity of the obstacle
        const shrinkFactor = 0.8;
        const body = obstacleContainer.body;
        body.setSize((obstacleWidth + 20) * shrinkFactor, (obstacleHeight + 20) * shrinkFactor);
        body.setVelocityY(200);
        body.setImmovable(true);

        // Set the offset for the obstacle body
        const offsetX = ((obstacleWidth + 20) - (obstacleWidth + 20) * shrinkFactor) / 2;
        const offsetY = ((obstacleHeight + 20) - (obstacleHeight + 20) * shrinkFactor) / 2;
        body.setOffset(-10 + offsetX, -5 + offsetY);

        // Add the obstacle to the group
        this.obstacles.add(obstacleContainer);

        // Increment the obstacle count
        this.obstacleCount++;

        // Set the timer for the next obstacle
        this.setRandomObstacleTimer();
    }

    setRandomWord() {
        // Get a random word from the available words
        let availableWords = this.words.filter(word => !this.recentWords.includes(word));
        this.currentWord = Phaser.Utils.Array.GetRandom(availableWords);

        // Set the question text
        this.questionText.setText(this.currentWord.question);

        const maxWidth = window.innerWidth - 40;
        const wordsArray = this.currentWord.question.split(' ');
        let tempLine = '';
        let finalText = '';

        // Wrap the text to fit within the specified width
        wordsArray.forEach(word => {
            const testLine = tempLine + word + ' ';
            const testText = this.add.text(0, 0, testLine, { fontSize: '50px', fontStyle: 'bold' });
            if (testText.width > maxWidth) {
                finalText += tempLine + '\n';
                tempLine = word + ' ';
            } else {
                tempLine = testLine;
            }
            testText.destroy();
        });

        finalText += tempLine;
        finalText = finalText.substring(0, finalText.length - 1);
        this.questionText.setText(finalText);

        // Set the background for the question text
        const textWidth = this.questionText.width;
        const textHeight = this.questionText.height;
        const textY = 50 + textHeight / 2;

        this.questionTextBackground.clear();
        this.questionTextBackground.fillStyle(0x000000, 0.7);
        this.questionTextBackground.fillRoundedRect(window.innerWidth / 2 - textWidth / 2 - 10, textY - textHeight / 2 - 10, textWidth + 20, textHeight + 20, 20);

        this.questionText.setY(textY);
        this.questionText.setDepth(1);

        // Add the current word to the recent words list
        this.recentWords.push(this.currentWord);
        if (this.recentWords.length > this.maxRecentWords) {
            this.recentWords.shift();
        }
    }

    setRandomObstacleTimer() {
        // Set a random delay for the next obstacle
        const delay = Phaser.Math.Between(500, 1500);
        this.time.addEvent({
            delay: delay,
            callback: this.addObstacle,
            callbackScope: this
        });
    }

    hitObstacle(car, obstacle) {
        const obstacleText = obstacle.list[1];
        if (obstacleText.text === this.currentWord.answer) {
            obstacle.destroy();
            this.setRandomWord();
            this.updateScore();
        } else {
            this.gameOver();
        }
    }

    updateScore() {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    gameOver() {
        this.isGameOver = true;
        this.physics.pause();
        this.time.removeAllEvents();
        this.car.setVisible(false);
        this.obstacles.clear(true, true);

        this.questionText.setVisible(false);
        this.questionTextBackground.clear();

        this.scoreText.setVisible(false);
        this.scoreBackground.clear();

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }

        // Create the game over overlay
        this.overlay = this.add.graphics();
        this.overlay.fillStyle(0x000000, 1);
        this.overlay.fillRect(0, 0, window.innerWidth, window.innerHeight);
        this.overlay.alpha = 0;

        // Fade in the game over overlay
        this.tweens.add({
            targets: this.overlay,
            alpha: 0.8,
            duration: 500,
            ease: 'Cubic.easeIn'
        });

        // Move the background and show the game over text
        this.tweens.add({
            targets: this.background,
            tilePositionY: '-=1500',
            duration: 1500,
            ease: 'quad.out',
            onComplete: () => {
                this.showGameOverText();
            }
        });
    }

    showGameOverText() {
        const centerX = window.innerWidth / 2;

        // Calculate the total height of the game over text elements
        const gameOverHeight = 100;
        const correctAnswerHeight = 50;
        const highScoreHeight = 50;
        const startOverHeight = 50;
        const verticalSpacing = 30;
        const totalHeight = gameOverHeight + correctAnswerHeight + highScoreHeight + startOverHeight + 3 * verticalSpacing;
        const startY = (window.innerHeight - totalHeight) / 2;

        // Add and configure the game over text elements
        const gameOverText = this.add.text(centerX, startY, 'Game Over', {
            fontSize: '100px', fill: '#FF2929', fontFamily: '"Chakra Petch"', resolution: 10, fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        const correctAnswerText = this.add.text(centerX, startY + gameOverHeight + verticalSpacing - 40, `Correct Answer: ${this.currentWord.answer}`, {
            fontSize: '50px', fill: '#00ff8a', fontFamily: '"Chakra Petch"', resolution: 10, fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        const highScoreText = this.add.text(centerX, startY + gameOverHeight + correctAnswerHeight + 2 * verticalSpacing, `High Score: ${this.highScore}`, {
            fontSize: '50px', fill: '#1ad1ff', fontFamily: '"Chakra Petch"', resolution: 10, fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        const startOverButton = this.add.text(centerX, startY + gameOverHeight + correctAnswerHeight + highScoreHeight + 3 * verticalSpacing, 'Play again', {
            fontSize: '50px', fill: '#1ad1ff', fontFamily: '"Chakra Petch"', resolution: 10, fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setInteractive();

        // Restart the game when the start over button is pressed
        startOverButton.on('pointerdown', () => {
            this.scene.restart();
        });

        // Change the button color on hover
        startOverButton.on('pointerover', () => {
            startOverButton.setStyle({ fill: '#fff' });
        });

        startOverButton.on('pointerout', () => {
            startOverButton.setStyle({ fill: '#1ad1ff' });
        });

        // Fade in the game over text elements
        this.tweens.add({
            targets: gameOverText,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: correctAnswerText,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            delay: 250
        });

        this.tweens.add({
            targets: highScoreText,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            delay: 500
        });

        this.tweens.add({
            targets: startOverButton,
            alpha: 1,
            duration: 500,
            ease: 'Power2',
            delay: 750
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false, // Enable debug to see collision boxes
        }
    },
    scene: [HomeScene, GameScene]
};

// Initialize the game
const game = new Phaser.Game(config);
