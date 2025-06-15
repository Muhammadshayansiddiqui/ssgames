const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const tileSize = 40;
const cols = canvas.width / tileSize;
const rows = canvas.height / tileSize;

let level = 1;
const player = { x: 0, y: 0, speed: 1 };
const exit = { x: cols - 1, y: rows - 1 };

let walls = [];
let enemies = [];
// let powerUps = [];

startNewLevel();

document.addEventListener("keydown", movePlayer);

function startNewLevel() {
    walls = [];
    enemies = [];
    powerUps = [];
    player.x = 0;
    player.y = 0;
    generateMaze();
    generateEnemies(2 + level); // Increase enemies each level
    generatePowerUps(1 + Math.floor(level / 2)); // More power-ups in higher levels
    drawGame();
}

function generateMaze() {
    for (let i = 0; i < cols * rows * (0.2 + level * 0.05); i++) { // Increase wall density
        walls.push({
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        });
    }
}

function generateEnemies(count) {
    for (let i = 0; i < count; i++) {
        let enemy;
        do {
            enemy = { 
                x: Math.floor(Math.random() * cols), 
                y: Math.floor(Math.random() * rows),
                direction: Math.random() > 0.5 ? 1 : -1
            };
        } while (isWall(enemy.x, enemy.y) || (enemy.x === 0 && enemy.y === 0));
        
        enemies.push(enemy);
    }
}

function generatePowerUps(count) {
    for (let i = 0; i < count; i++) {
        let powerUp;
        do {
            powerUp = { 
                x: Math.floor(Math.random() * cols), 
                y: Math.floor(Math.random() * rows)
            };
        } while (isWall(powerUp.x, powerUp.y) || (powerUp.x === 0 && powerUp.y === 0));
        
        powerUps.push(powerUp);
    }
}

function movePlayer(event) {
    let newX = player.x;
    let newY = player.y;

    if (event.key === "ArrowUp") newY -= player.speed;
    if (event.key === "ArrowDown") newY += player.speed;
    if (event.key === "ArrowLeft") newX -= player.speed;
    if (event.key === "ArrowRight") newX += player.speed;

    if (!isWall(newX, newY) && newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        player.x = newX;
        player.y = newY;
    }

    checkCollisions();
    drawGame();
}

function isWall(x, y) {
    return walls.some(wall => wall.x === x && wall.y === y);
}

function checkCollisions() {
    enemies.forEach(enemy => {
        if (player.x === enemy.x && player.y === enemy.y) {
            alert("You were caught by an enemy! Try again.");
            level = 1;
            startNewLevel();
        }
    });

    powerUps.forEach((powerUp, index) => {
        if (player.x === powerUp.x && player.y === powerUp.y) {
            powerUps.splice(index, 1);
            player.speed = 2;
            setTimeout(() => { player.speed = 1; }, 3000);
        }
    });

    if (player.x === exit.x && player.y === exit.y) {
        alert(`Level ${level} completed! Starting level ${level + 1}...`);
        level++;
        startNewLevel();
    }
}

function moveEnemies() {
    enemies.forEach(enemy => {
        let newX = enemy.x + (Math.random() > 0.5 ? enemy.direction : 0);
        let newY = enemy.y + (Math.random() > 0.5 ? enemy.direction : 0);

        if (!isWall(newX, newY) && newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
            enemy.x = newX;
            enemy.y = newY;
        } else {
            enemy.direction *= -1;
        }
    });

    checkCollisions();
    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "gray";
    walls.forEach(wall => {
        ctx.fillRect(wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = "green";
    ctx.fillRect(exit.x * tileSize, exit.y * tileSize, tileSize, tileSize);

    ctx.fillStyle = "yellow";
    powerUps.forEach(powerUp => {
        ctx.fillRect(powerUp.x * tileSize, powerUp.y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x * tileSize, enemy.y * tileSize, tileSize, tileSize);
    });

    ctx.fillStyle = "blue";
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
}

setInterval(moveEnemies, 1000);
drawGame();