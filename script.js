document.addEventListener('DOMContentLoaded', () => {
    const car = document.getElementById('car');
    const road = document.getElementById('road');
    const gameContainer = document.querySelector('.game-container');
    const gameOverScreen = document.getElementById('game-over');
    const winScreen = document.getElementById('win');
    const restartButton = document.getElementById('restart-button');
    const restartWinButton = document.getElementById('restart-win-button');

    let carX = car.offsetLeft;
    let gamePaused = false;
    let obstacleIntervalId;
    let winTimeoutId;

    document.addEventListener('keydown', (e) => {
        if (gamePaused) return;

        switch (e.key) {
            case 'a': // Move car left
                carX -= 10;
                if (carX < 0) carX = 0;
                break;
            case 'd': // Move car right
                carX += 10;
                if (carX > 350) carX = 350; // 400 (container width) - 50 (car width)
                break;
            case 'w': // Move road down
                road.style.animation = 'moveRoadDown 1s linear infinite';
                break;
            case 's': // Move road up
                road.style.animation = 'moveRoadUp 1s linear infinite';
                break;
        }
        car.style.left = `${carX}px`;
    });

    document.addEventListener('keyup', (e) => {
        if (gamePaused) return;

        if (e.key === 'w' || e.key === 's') {
            road.style.animation = '';
        }
    });

    function createObstacle() {
        if (gamePaused) return;

        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.left = `${Math.floor(Math.random() * 350)}px`;
        obstacle.style.top = '0px';
        gameContainer.appendChild(obstacle);
        moveObstacle(obstacle);
    }

    function moveObstacle(obstacle) {
        let obstacleY = 0;
        const obstacleInterval = setInterval(() => {
            if (gamePaused) {
                clearInterval(obstacleInterval);
                return;
            }

            obstacleY += 5;
            obstacle.style.top = `${obstacleY}px`;

            if (obstacleY > 600) {
                clearInterval(obstacleInterval);
                gameContainer.removeChild(obstacle);
            }

            const carRect = car.getBoundingClientRect();
            const obstacleRect = obstacle.getBoundingClientRect();

            if (carRect.left < obstacleRect.left + obstacleRect.width &&
                carRect.left + carRect.width > obstacleRect.left &&
                carRect.top < obstacleRect.top + obstacleRect.height &&
                carRect.top + carRect.height > obstacleRect.top) {
                clearInterval(obstacleInterval);
                gameOver();
            }
        }, 50);
    }

    function gameOver() {
        gamePaused = true;
        clearInterval(obstacleIntervalId);
        clearTimeout(winTimeoutId);
        gameOverScreen.style.display = 'flex';
    }

    function win() {
        gamePaused = true;
        clearInterval(obstacleIntervalId);
        winScreen.style.display = 'flex';
    }

    restartButton.addEventListener('click', () => {
        location.reload();
    });

    restartWinButton.addEventListener('click', () => {
        location.reload();
    });

    obstacleIntervalId = setInterval(createObstacle, 2000);
    winTimeoutId = setTimeout(win, 60000);
});
