const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load images
const enemyImg = new Image();
enemyImg.src = 'enemy.png';
const towerImg = new Image();
towerImg.src = 'tower.png';
const projectileImg = new Image();
projectileImg.src = 'projectile.png';

// Game objects
const enemy = {
    x: 0,
    y: canvas.height / 2,
    width: 50,
    height: 50,
    speed: 2
};

const tower = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 50,
    height: 50,
    attackRange: 100
};

const projectiles = [];

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw enemy
    ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);

    // Move enemy
    enemy.x += enemy.speed;
    if (enemy.x > canvas.width) {
        enemy.x = 0;
    }

    // Draw tower
    ctx.drawImage(towerImg, tower.x, tower.y, tower.width, tower.height);

    // Attack logic
    if (Math.abs(enemy.x - tower.x) < tower.attackRange) {
        projectiles.push({
            x: tower.x + tower.width / 2 - 5,
            y: tower.y + tower.height / 2 - 5,
            width: 10,
            height: 10,
            speed: 5,
            targetX: enemy.x,
            targetY: enemy.y
        });
    }

    // Update and draw projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        ctx.drawImage(projectileImg, projectile.x, projectile.y, projectile.width, projectile.height);

        const dx = projectile.targetX - projectile.x;
        const dy = projectile.targetY - projectile.y;
        const angle = Math.atan2(dy, dx);
        projectile.x += Math.cos(angle) * projectile.speed;
        projectile.y += Math.sin(angle) * projectile.speed;

        // Check for collision
        if (
            projectile.x < enemy.x + enemy.width &&
            projectile.x + projectile.width > enemy.x &&
            projectile.y < enemy.y + enemy.height &&
            projectile.y + projectile.height > enemy.y
        ) {
            projectiles.splice(i, 1); // Remove projectile on hit
            enemy.x = -enemy.width; // Move enemy out of the screen
        }
    }

    requestAnimationFrame(gameLoop);
}

enemyImg.onload = () => {
    towerImg.onload = () => {
        projectileImg.onload = () => {
            gameLoop();
        };
    };
};
