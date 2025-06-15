const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 600;

let bird = { x: 50, y: 250, width: 20, height: 20, gravity: 0.4, lift: -6, velocity: 0  };
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;

document.addEventListener("keydown", () => {
    if (!gameOver) {
        bird.velocity = bird.lift;
    } else {
        resetGame();
    }
});

function resetGame() {
    bird.y = 250;
    bird.velocity =  0;
    pipes = [];
    score = 0;
    gameOver = false;
}

function update() {
    if (gameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver = true;
    }

    if (frame % 75 === 0) {
        let gap = 100;
        let topHeight = Math.random() * (canvas.height / 2);
        pipes.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap, width:  40  });
    }

    pipes.forEach(pipe => {
        pipe.x -= 2.5;
        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
        }

        if (
            bird.x < pipe.x + pipe.width &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.top || bird.y + bird.height > pipe.bottom)
        ) {
            gameOver = true;
        }
    });

    frame++;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = "yellow";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    ctx.fillStyle = "green";
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 20);

    if (gameOver) {
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over!", 120, 250);
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
  