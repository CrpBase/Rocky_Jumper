window.addEventListener('DOMContentLoaded', (event) => {
    // Імпортуємо функції з іншого файлу
    import submitScore, { loadLeaderboard } from './firebase_leaderboard.js';

    // Оголошуємо змінні, які будуть використовуватись у всій грі
    let canvas, ctx;
    let doodle, platforms, score, isGameOver, enemies;
    let keys = { left: false, right: false };
    let velocityX = 0;
    const acceleration = 0.4;
    const maxSpeed = 3.5;

    // Створюємо аудіо-об'єкти для звуків у грі
    const olgSound = new Audio('assets/olg.mp3');
    const jumpSound = new Audio('assets/jump.mp3');
    const springSound = new Audio('assets/spring.mp3');
    const music = new Audio('assets/music.mp3');
    const loseSound = new Audio('assets/ooh.mp3');
    music.loop = true; // Музика буде грати по колу

    // Створюємо зображення для пружини та стрибка
    const springImg = new Image();
    springImg.src = 'assets/spr.png';
    const jumpImg = new Image();
    jumpImg.src = 'assets/jp.png';

    // Коли сторінка завантажилась, перевіряємо, чи є збережене ім'я гравця
    window.addEventListener('load', () => {
        const savedName = localStorage.getItem('playerName');
        if (!savedName) {
            document.getElementById('namePrompt').style.display = 'flex';
        } else {
            document.getElementById('menu').style.display = 'block';
        }
    });

    // Обробник для кнопки збереження імені
    document.getElementById('saveNameBtn').addEventListener('click', () => {
        const input = document.getElementById('playerNameInput').value.trim();
        if (input) {
            localStorage.setItem('playerName', input);
            document.getElementById('namePrompt').style.display = 'none';
            document.getElementById('menu').style.display = 'block';
        }
    });
    
    // Ініціалізація гри
    function init() {
        canvas = document.getElementById('gameCanvas');
        ctx = canvas.getContext('2d');
        score = 0;
        isGameOver = false;
        platforms = [];
        enemies = [];
        
        // Створюємо персонажа
        doodle = {
            x: 200, y: 500, width: 40, height: 40,
            vy: 0, gravity: 0.2, jump: -10,
            img: new Image(),
            isSpringJump: false
        };
        doodle.img.src = 'assets/doodle.png';
        
        // Створюємо першу платформу
        platforms.push({ x: 175, y: 550, width: 60, height: 15, type: 'static' });
        
        // Генеруємо інші платформи
        let lastY = 550;
        for (let i = 0; i < 9; i++) {
            lastY -= Math.random() * 60 + 60;
            platforms.push({
                x: Math.random() * (canvas.width - 60),
                y: lastY,
                width: 60, height: 15,
                type: Math.random() > 0.9 ? 'moving' : 'static',
                speed: Math.random() > 0.5 ? 1 : -1
            });
        }

        // Запускаємо ігровий цикл
        requestAnimationFrame(update);
    }

    // Головний ігровий цикл
    function update() {
        if (isGameOver) {
            // Екран кінця гри
            music.pause();
            loseSound.play();
            document.getElementById('game').style.display = 'none';
            document.getElementById('gameOver').style.display = 'block';
            document.getElementById('finalScore').innerText = `Your score: ${score}`;
            const playerName = localStorage.getItem('playerName') || 'Anonymous';
            submitScore(playerName, score);
            return;
        }

        // Оновлюємо стан гри
        handleKeys();
        doodle.vy += doodle.gravity;
        doodle.y += doodle.vy;
        doodle.x += velocityX;

        // Перевірка виходу за межі екрану
        if (doodle.x > canvas.width) doodle.x = -doodle.width;
        if (doodle.x + doodle.width < 0) doodle.x = canvas.width;
        
        // Камера слідує за гравцем
        if (doodle.y < canvas.height / 2) {
            const delta = (canvas.height / 2) - doodle.y;
            doodle.y = canvas.height / 2;
            platforms.forEach(p => p.y += delta);
            enemies.forEach(e => e.y += delta);
            score += Math.floor(delta);
        }

        // Перевірка зіткнень
        checkCollisions();
        
        // Очищення та малювання
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlatforms();
        drawDoodle();
        drawEnemies();

        // Генерація нових об'єктів
        generatePlatforms();
        generateEnemies();

        // Оновлення лічильника очок
        document.getElementById('scoreCounter').innerText = `Score: ${score}`;

        if (doodle.y > canvas.height) {
            isGameOver = true;
        }
        
        requestAnimationFrame(update);
    }
    
    // Інші функції гри...
    function handleKeys() {
        if (keys.left) velocityX = Math.max(velocityX - acceleration, -maxSpeed);
        else if (keys.right) velocityX = Math.min(velocityX + acceleration, maxSpeed);
        else velocityX *= 0.9; // Гальмування
    }

    function checkCollisions() {
        // ... (код перевірки зіткнень)
    }
    
    function drawDoodle() {
        // ... (код малювання персонажа)
    }

    function drawPlatforms() {
        // ... (код малювання платформ)
    }
    
    function drawEnemies() {
        // ... (код малювання ворогів)
    }

    function generatePlatforms() {
        // ... (код генерації платформ)
    }
    
    function generateEnemies() {
        // ... (код генерації ворогів)
    }

    // Обробники кнопок
    document.getElementById('startBtn').addEventListener('click', () => {
        document.getElementById('menu').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        init();
        music.play();
    });

    document.getElementById('leaderboardBtn').addEventListener('click', () => {
        loadLeaderboard();
    });
    
    document.getElementById('restartBtn').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('game').style.display = 'block';
        init();
        music.play();
    });

    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('menu').style.display = 'block';
    });
    
    // Обробники клавіатури
    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') keys.left = true;
        if (e.key === 'ArrowRight') keys.right = true;
    });

    window.addEventListener('keyup', e => {
        if (e.key === 'ArrowLeft') keys.left = false;
        if (e.key === 'ArrowRight') keys.right = false;
    });

    // Функція для авто-масштабування
    (function setupAutoScale() {
        const canvas = document.getElementById('gameCanvas');
        const stage = document.getElementById('stage');
        if (!canvas || !stage) return;
        const baseW = 400, baseH = 600;

        function rescale() {
            const stageW = stage.offsetWidth;
            const stageH = stage.offsetHeight;
            canvas.style.width = `${stageW}px`;
            canvas.style.height = `${stageH}px`;
        }
        
        window.addEventListener('resize', rescale);
        setTimeout(rescale, 0); 
    })();
});



