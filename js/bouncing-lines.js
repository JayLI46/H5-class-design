// bouncing-lines.js - 彩色折线撞击反弹动画（支持跟随滚动）
(function() {
    // ===== 默认配置 =====
    const CONFIG = {
        lineCount: 100,
        pointsPerLine: 4,
        lineWidth: 2.5,
        speedMin: 0.8,
        speedMax: 2.5,
        colorPalette: [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24',
            '#FF9FF3', '#54A0FF', '#5F27CD', '#FF9F43',
            '#00D2D3', '#1DD1A1', '#F368E0', '#FFC312'
        ],
        bgColor: 'transparent',
        strokeAlpha: 0.9,
        followScroll: true,          // 新增：是否跟随滚动
    };

    if (window.bouncingLinesConfig) {
        Object.assign(CONFIG, window.bouncingLinesConfig);
    }

    // ===== 创建 Canvas 并注入样式 =====
    const canvas = document.createElement('canvas');
    canvas.id = 'bouncingLinesCanvas';
    document.body.prepend(canvas);

    const style = document.createElement('style');
    style.textContent = `
        #bouncingLinesCanvas {
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
            margin: 0;
            min-height: 100vh; /* 确保 body 高度足够展示滚动 */
        }
        /* 可选：为了演示滚动，可以给 body 加一些高度，但由用户自己控制 */
    `;
    document.head.appendChild(style);

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;

    // 文档尺寸（用于坐标边界）
    let docW = document.documentElement.scrollWidth || document.body.scrollWidth || W;
    let docH = document.documentElement.scrollHeight || document.body.scrollHeight || H;

    // ===== 工具函数 =====
    function randomColor() {
        return CONFIG.colorPalette[Math.floor(Math.random() * CONFIG.colorPalette.length)];
    }

    // ===== 折线类（坐标使用文档坐标系） =====
    class BouncingLine {
        constructor() {
            const pointCount = Math.max(2, CONFIG.pointsPerLine || 4);
            this.offsets = [];
            for (let i = 0; i < pointCount; i++) {
                this.offsets.push({
                    x: (Math.random() - 0.5) * 120,
                    y: (Math.random() - 0.5) * 120
                });
            }
            // 中心点位置：基于文档尺寸随机
            this.x = Math.random() * docW;
            this.y = Math.random() * docH;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (CONFIG.speedMax - CONFIG.speedMin) + CONFIG.speedMin;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = randomColor();
            this.lineWidth = CONFIG.lineWidth * (0.8 + Math.random() * 0.4);
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // 边界反弹（基于文档尺寸）
            if (this.x < 0 || this.x > docW) {
                this.vx *= -1;
                this.x = Math.max(0, Math.min(docW, this.x));
            }
            if (this.y < 0 || this.y > docH) {
                this.vy *= -1;
                this.y = Math.max(0, Math.min(docH, this.y));
            }
        }

        draw(ctx, scrollX, scrollY) {
            ctx.save();
            // 应用滚动偏移（跟随滚动）
            ctx.translate(this.x - scrollX, this.y - scrollY);
            ctx.beginPath();
            const first = this.offsets[0];
            ctx.moveTo(first.x, first.y);
            for (let i = 1; i < this.offsets.length; i++) {
                ctx.lineTo(this.offsets[i].x, this.offsets[i].y);
            }
            ctx.closePath(); // 可以保留闭合，但我觉得开放更好看，你可以自行注释
            ctx.strokeStyle = this.color;
            ctx.globalAlpha = CONFIG.strokeAlpha || 0.9;
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.stroke();
            ctx.restore();
        }
    }

    // ===== 初始化所有折线 =====
    let lines = [];
    function initLines() {
        lines = [];
        for (let i = 0; i < CONFIG.lineCount; i++) {
            lines.push(new BouncingLine());
        }
    }

    // ===== 更新文档尺寸 =====
    function updateDocSize() {
        docW = document.documentElement.scrollWidth || document.body.scrollWidth || window.innerWidth;
        docH = document.documentElement.scrollHeight || document.body.scrollHeight || window.innerHeight;
        // 确保尺寸至少为视口大小
        docW = Math.max(docW, window.innerWidth);
        docH = Math.max(docH, window.innerHeight);
    }

    // ===== 窗口自适应 =====
    window.addEventListener('resize', () => {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        updateDocSize();
        // 将超出边界的折线拉回
        lines.forEach(line => {
            line.x = Math.max(0, Math.min(docW, line.x));
            line.y = Math.max(0, Math.min(docH, line.y));
        });
    });

    // ===== 滚动事件（仅用于更新文档尺寸，重绘由动画循环负责） =====
    window.addEventListener('scroll', () => {
        updateDocSize();
    });

    // ===== 动画循环 =====
    function animate() {
        ctx.clearRect(0, 0, W, H);

        // 获取滚动偏移
        const scrollX = CONFIG.followScroll ? window.scrollX : 0;
        const scrollY = CONFIG.followScroll ? window.scrollY : 0;

        lines.forEach(line => {
            line.update();
            line.draw(ctx, scrollX, scrollY);
        });

        requestAnimationFrame(animate);
    }

    // ===== 启动 =====
    // 确保文档尺寸正确
    updateDocSize();
    // 设置 canvas 尺寸为视口大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    W = canvas.width;
    H = canvas.height;

    initLines();
    animate();

})();