// particle.js - 开箱即用的粒子动画库
(function() {
    // ===== 可配置默认参数 =====
    const CONFIG = {
        particleCount: 350,          // 粒子数量
        text: 'NanChang',            // 显示的文字
        fontSize: 35,                // 文字大小（px）
        fontFamily: 'Arial',         // 字体
        color: '#4fc3f7',            // 粒子颜色
        bgColor: 'transparent',          // 背景色
        idleTime: 100,              // 鼠标静止多久后显示文字（毫秒）
        particleSizeMin: 0.8,        // 粒子最小尺寸
        particleSizeMax: 1.8,        // 粒子最大尺寸
        speedMin: 0.02,              // 粒子移动速度最小值
        speedMax: 0.07,              // 粒子移动速度最大值
        textDensity: 3,              // 文字采样密度（数值越小点越多）
    };

    // 允许用户通过 window.particleConfig 覆盖配置
    if (window.particleConfig) {
        Object.assign(CONFIG, window.particleConfig);
    }

    // ===== 创建 canvas 并注入样式 =====
    const canvas = document.createElement('canvas');
    canvas.id = 'particleCanvas';
    document.body.prepend(canvas);   // 插入到 body 最前面

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        #particleCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: -1;
            pointer-events: none;
            background-color: ${CONFIG.bgColor};
        }
        body {
            position: relative;
            z-index: 1;
            color: #fff;   /* 默认文字颜色，可自行覆盖 */
        }
    `;
    document.head.appendChild(style);

    // ===== 核心逻辑 =====
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = [];
    let mouseX = W / 2;
    let mouseY = H / 2;
    let lastMouseMove = Date.now();
    let isTextMode = false;
    let textAnchorX = mouseX;
    let textAnchorY = mouseY;
    let textPoints = [];

    // 生成文字点阵
    function generateTextPoints() {
        const textCanvas = document.createElement('canvas');
        const textCtx = textCanvas.getContext('2d');
        const w = 220, h = 65;
        textCanvas.width = w;
        textCanvas.height = h;
        textCtx.fillStyle = '#fff';
        textCtx.font = `bold ${CONFIG.fontSize}px ${CONFIG.fontFamily}`;
        textCtx.textAlign = 'center';
        textCtx.textBaseline = 'middle';
        textCtx.fillText(CONFIG.text, w / 2, h / 2);

        const imageData = textCtx.getImageData(0, 0, w, h);
        const points = [];
        const density = CONFIG.textDensity;
        for (let y = 0; y < h; y += density) {
            for (let x = 0; x < w; x += density) {
                const index = (y * w + x) * 4;
                if (imageData.data[index + 3] > 128) {
                    points.push({
                        offsetX: x - w / 2,
                        offsetY: y - h / 2
                    });
                }
            }
        }
        return points;
    }

    function initParticles() {
        textPoints = generateTextPoints();
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                targetX: Math.random() * W,
                targetY: Math.random() * H,
                size: Math.random() * (CONFIG.particleSizeMax - CONFIG.particleSizeMin) + CONFIG.particleSizeMin,
                speed: Math.random() * (CONFIG.speedMax - CONFIG.speedMin) + CONFIG.speedMin,
                color: CONFIG.color
            });
        }
    }

    // 鼠标事件
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        lastMouseMove = Date.now();
        if (isTextMode) {
            isTextMode = false;
            particles.forEach(p => {
                p.targetX = mouseX + (Math.random() - 0.5) * 100;
                p.targetY = mouseY + (Math.random() - 0.5) * 100;
            });
        }
    });

    // 窗口自适应
    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    function animate() {
        ctx.clearRect(0, 0, W, H);
        const now = Date.now();

        if (now - lastMouseMove > CONFIG.idleTime && !isTextMode) {
            isTextMode = true;
            textAnchorX = mouseX;
            textAnchorY = mouseY;
            particles.forEach((p, i) => {
                const idx = i % textPoints.length;
                p.targetX = textAnchorX + textPoints[idx].offsetX;
                p.targetY = textAnchorY + textPoints[idx].offsetY;
            });
        }

        particles.forEach(p => {
            if (!isTextMode) {
                p.targetX = mouseX + (Math.random() - 0.5) * 150;
                p.targetY = mouseY + (Math.random() - 0.5) * 150;
            }
            p.x += (p.targetX - p.x) * p.speed;
            p.y += (p.targetY - p.y) * p.speed;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });

        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
})();