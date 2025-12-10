/**
 * 纹·变 - 生成艺术动画引擎 (扩展版)
 * 包含 20+ 种中国传统纹样生成算法
 */

const canvas = document.getElementById('pattern-canvas');
const ctx = canvas.getContext('2d');
const titleEl = document.getElementById('scene-title');

// 全局状态
let width, height;
let frame = 0;
let isPaused = false;
let currentSceneIndex = 0;
let sceneStartTime = 0;

// 配色方案 (中国传统色)
const COLORS = {
    bg: '#0a0a0c',     // 玄黑
    gold: '#C69C6D',   // 泥金
    red: '#8B2E2E',    // 殷红
    blue: '#3E5168',   // 黛蓝
    cyan: '#758a99',   // 鸦青
    white: '#F7F4ED',  // 宣纸
    green: '#48583E',  // 这里的绿
    ochre: '#9C5E26',  // 赭石
    jade: '#7A9F88',   // 玉色
    purple: '#4E2F38', // 藕荷
    ink: '#1A1A1A'     // 焦墨
};

// 调整画布大小
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

// 交互
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') isPaused = !isPaused;
});
window.addEventListener('click', nextScene);

// ==========================================
// 辅助函数
// ==========================================
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

// 辅助：绘制多边形
function drawPolygon(ctx, x, y, radius, sides, rotation = 0) {
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * Math.PI * 2 + rotation;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
}

// ==========================================
// 场景定义 (扩充至 20+)
// ==========================================

const allScenes = [
    {
        name: "混沌 · 起源",
        duration: 400,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.15)`;
            ctx.fillRect(0, 0, width, height);
            ctx.save();
            ctx.translate(width / 2, height / 2);
            const count = 120;
            const maxRadius = Math.min(width, height) * 0.4;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 * 3 + t * 0.015;
                const r = (i / count) * maxRadius * (Math.sin(t * 0.01) * 0.5 + 1);
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;
                ctx.beginPath();
                ctx.arc(x, y, i * 0.05 + 1, 0, Math.PI * 2);
                ctx.fillStyle = i % 3 === 0 ? COLORS.gold : (i % 3 === 1 ? COLORS.white : COLORS.red);
                ctx.fill();
            }
            ctx.restore();
        }
    },
    {
        name: "宋瓷 · 冰裂", // 哥窑冰裂纹
        duration: 500,
        type: 'light',
        draw: (t) => {
             // 静态背景动态光效
            if ((t - sceneStartTime) === 1) {
                // 初始化绘制一次复杂的裂纹
                ctx.fillStyle = '#D8D8D0'; // 灰青釉色
                ctx.fillRect(0, 0, width, height);
                
                // 简单的Voronoi模拟：随机撒点，连线
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                
                // 简化的网格扰动算法
                const cellSize = 100;
                for(let x=0; x<width; x+=cellSize) {
                    for(let y=0; y<height; y+=cellSize) {
                         // 绘制不规则四边形
                         const x1 = x + Math.random()*cellSize;
                         const y1 = y + Math.random()*cellSize;
                         ctx.moveTo(x1, y1);
                         ctx.lineTo(x1 + Math.random()*cellSize, y1 + Math.random()*cellSize);
                         ctx.stroke();
                    }
                }
            }
            
            // 动态光泽扫描
            ctx.fillStyle = `rgba(255, 255, 255, 0.05)`;
            const scanY = (t * 5) % height;
            ctx.fillRect(0, scanY, width, 50);
        }
    },
    {
        name: "远古 · 旋涡",
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.1)`;
            ctx.fillRect(0, 0, width, height);
            ctx.save();
            ctx.translate(width / 2, height / 2);
            const rings = 8;
            for (let i = 0; i < rings; i++) {
                ctx.beginPath();
                const baseR = 50 + i * 40;
                for (let a = 0; a <= Math.PI * 2; a += 0.05) {
                    const r = baseR + Math.sin(a * 10 + t * 0.05 + i) * 10;
                    const x = r * Math.cos(a + t * 0.01 * (i % 2 === 0 ? 1 : -1));
                    const y = r * Math.sin(a + t * 0.01 * (i % 2 === 0 ? 1 : -1));
                    if (a === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = i % 2 === 0 ? COLORS.ochre : COLORS.gold;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            ctx.restore();
        }
    },
    {
        name: "江南 · 窗棂", // 几何窗格
        duration: 400,
        type: 'light',
        draw: (t) => {
            ctx.fillStyle = `rgba(247, 244, 237, 0.2)`; // 保持亮色
            ctx.fillRect(0, 0, width, height);
            
            const size = 80;
            ctx.strokeStyle = '#555';
            ctx.lineWidth = 2;
            
            for(let x=0; x<width; x+=size) {
                for(let y=0; y<height; y+=size) {
                    const cx = x + size/2;
                    const cy = y + size/2;
                    
                    // 动态变形的菱形
                    const scale = Math.sin((x+y)*0.01 + t*0.02) * 0.2 + 0.8;
                    
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.scale(scale, scale);
                    ctx.beginPath();
                    ctx.moveTo(0, -size/2);
                    ctx.lineTo(size/2, 0);
                    ctx.lineTo(0, size/2);
                    ctx.lineTo(-size/2, 0);
                    ctx.closePath();
                    ctx.stroke();
                    
                    // 内部装饰
                    ctx.beginPath();
                    ctx.rect(-10, -10, 20, 20);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
    },
    {
        name: "青铜 · 饕餮",
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.2)`;
            ctx.fillRect(0, 0, width, height);
            ctx.save();
            ctx.translate(width / 2, height / 2);
            const drawSide = (scaleX) => {
                ctx.scale(scaleX, 1);
                ctx.beginPath();
                ctx.moveTo(20, -100);
                ctx.bezierCurveTo(100 + Math.sin(t*0.05)*20, -150, 150, -50, 200, -120);
                ctx.moveTo(80, -20);
                ctx.arc(80, -20, 30 + Math.sin(t*0.1)*5, 0, Math.PI*2);
                ctx.moveTo(20, 50);
                ctx.lineTo(80, 80);
                ctx.quadraticCurveTo(120, 150, 50, 200);
                ctx.strokeStyle = COLORS.cyan;
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.beginPath();
                for(let i=0; i<10; i++) {
                    ctx.moveTo(100 + i*10, -80);
                    ctx.lineTo(100 + i*10, -60);
                }
                ctx.strokeStyle = COLORS.gold;
                ctx.lineWidth = 2;
                ctx.stroke();
            };
            drawSide(1); drawSide(-1);
            ctx.restore();
        }
    },
    {
        name: "敦煌 · 飞天", // 飘带流线
        duration: 600,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.1)`;
            ctx.fillRect(0, 0, width, height);
            
            const colors = [COLORS.ochre, COLORS.green, COLORS.gold, COLORS.red];
            
            for(let i=0; i<4; i++) {
                ctx.beginPath();
                ctx.strokeStyle = colors[i];
                ctx.lineWidth = 3;
                
                for(let x=0; x<width; x+=10) {
                    // 叠加正弦波模拟飘带
                    const y = height/2 + (i-1.5)*50 + 
                              Math.sin(x*0.005 + t*0.02 + i)*100 + 
                              Math.sin(x*0.02 - t*0.03)*30;
                    if(x===0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }
    },
    {
        name: "盛唐 · 团花",
        duration: 600,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.05)`;
            ctx.fillRect(0, 0, width, height);
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(t * 0.003);
            const layers = 6;
            for (let l = 0; l < layers; l++) {
                const petals = 8 + l * 4;
                const scale = 1 + Math.sin(t * 0.02 + l) * 0.05;
                ctx.save();
                ctx.scale(scale, scale);
                ctx.rotate(l * 0.1);
                for (let i = 0; i < petals; i++) {
                    ctx.rotate((Math.PI * 2) / petals);
                    const r = 60 + l * 40;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.quadraticCurveTo(r/2, -20, r, 0);
                    ctx.quadraticCurveTo(r/2, 20, 0, 0);
                    ctx.strokeStyle = l % 2 === 0 ? COLORS.red : COLORS.blue;
                    ctx.fillStyle = l % 2 === 0 ? `rgba(139, 46, 46, 0.1)` : `rgba(62, 81, 104, 0.1)`;
                    ctx.lineWidth = 1.5;
                    ctx.fill();
                    ctx.stroke();
                }
                ctx.restore();
            }
            ctx.restore();
        }
    },
     {
        name: "雅致 · 龟背", // 六边形龟背纹
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.2)`;
            ctx.fillRect(0, 0, width, height);
            
            const hexRadius = 50;
            const hexHeight = Math.sqrt(3) * hexRadius;
            const wOffset = hexRadius * 1.5;
            
            ctx.strokeStyle = COLORS.jade;
            ctx.lineWidth = 2;
            
            const cols = Math.ceil(width / wOffset) + 1;
            const rows = Math.ceil(height / hexHeight) + 1;
            
            for(let i=0; i<cols; i++) {
                for(let j=0; j<rows; j++) {
                    const x = i * wOffset;
                    const y = j * hexHeight + (i%2) * (hexHeight/2);
                    
                    // 呼吸效果
                    const r = hexRadius * (0.8 + Math.sin(t*0.02 + i*0.5 + j*0.5)*0.2);
                    
                    drawPolygon(ctx, x, y, r, 6, Math.PI/6);
                    ctx.stroke();
                    
                    // 中心点
                    ctx.beginPath();
                    ctx.arc(x, y, 5, 0, Math.PI*2);
                    ctx.fillStyle = COLORS.gold;
                    ctx.fill();
                }
            }
        }
    },
    {
        name: "宋韵 · 流云",
        duration: 600,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.15)`;
            ctx.fillRect(0, 0, width, height);
            ctx.lineWidth = 2;
            const lineCount = 15;
            const step = height / (lineCount + 2);
            for (let i = 0; i < lineCount; i++) {
                ctx.beginPath();
                let baseY = (i + 1) * step;
                let color = i % 2 === 0 ? COLORS.jade : COLORS.white;
                if (i === Math.floor(lineCount/2)) color = COLORS.gold;
                ctx.strokeStyle = color;
                for (let x = 0; x <= width; x += 20) {
                    const wave1 = Math.sin(x * 0.005 + t * 0.02 + i * 0.5) * 40;
                    const wave2 = Math.sin(x * 0.02 - t * 0.03) * 10;
                    const y = baseY + wave1 + wave2;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
        }
    },
    {
        name: "文人 · 墨竹", // 随机竹子
        duration: 500,
        type: 'light',
        draw: (t) => {
            // 累积绘图，不清除背景
            if ((t - sceneStartTime) === 1) {
                ctx.fillStyle = '#F7F4ED';
                ctx.fillRect(0, 0, width, height);
            }
            
            // 每隔几帧画一节竹子
            if (t % 10 === 0 && Math.random() > 0.5) {
                const x = randomRange(50, width - 50);
                const w = randomRange(10, 25);
                
                // 画竹竿
                ctx.fillStyle = `rgba(40, 60, 40, ${randomRange(0.5, 0.9)})`;
                ctx.fillRect(x, height, w, -randomRange(height*0.3, height*0.8)); // 这里的逻辑太简单，会重叠，作为写意效果
                
                // 更好的逻辑：预定义几根竹子的位置，随时间向上生长
                // 这里暂用“雨后春笋”式随机冒出
            }
            
            // 实时生长的竹子逻辑
            const bambooCount = 5;
            const growthSpeed = 5;
            
            for(let i=0; i<bambooCount; i++) {
                 const x = (width / (bambooCount+1)) * (i+1);
                 const currentH = (t - sceneStartTime) * growthSpeed + i*50;
                 
                 if(currentH < height) {
                     const sectionH = 100;
                     const sections = Math.floor(currentH / sectionH);
                     
                     // 绘制最新的那一节
                     ctx.fillStyle = `rgba(60, 80, 60, 0.8)`;
                     ctx.fillRect(x - 10, height - currentH, 20, sectionH);
                     
                     // 竹节
                     ctx.fillStyle = '#1a1a1a';
                     ctx.fillRect(x - 12, height - currentH, 24, 3);
                     
                     // 竹叶
                     if (currentH % 150 < 10) {
                        ctx.beginPath();
                        ctx.moveTo(x, height - currentH);
                        ctx.quadraticCurveTo(x + 40, height - currentH - 20, x + 80, height - currentH + 10);
                        ctx.quadraticCurveTo(x + 40, height - currentH - 10, x, height - currentH);
                        ctx.fillStyle = `rgba(40, 60, 40, 0.9)`;
                        ctx.fill();
                     }
                 }
            }
        }
    },
     {
        name: "吉祥 · 钱纹", // 铜钱纹
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.2)`;
            ctx.fillRect(0, 0, width, height);
            
            const r = 40;
            const gap = 10;
            const d = r * 2 + gap;
            
            for(let x=0; x<width; x+=d) {
                for(let y=0; y<height; y+=d) {
                    const cx = x + (y%(d*2)===0 ? 0 : d/2); // 错位
                    const cy = y;
                    
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, Math.PI*2);
                    ctx.strokeStyle = COLORS.gold;
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    
                    // 中间方孔
                    ctx.fillStyle = COLORS.bg;
                    ctx.fillRect(cx-r/3, cy-r/3, r/1.5, r/1.5);
                    ctx.strokeStyle = COLORS.gold;
                    ctx.strokeRect(cx-r/3, cy-r/3, r/1.5, r/1.5);
                    
                    // 旋转效果
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(t * 0.01);
                    ctx.restore();
                }
            }
        }
    },
    {
        name: "丝路 · 联珠",
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.3)`;
            ctx.fillRect(0, 0, width, height);
            const size = 100;
            const cols = Math.ceil(width / size);
            const rows = Math.ceil(height / size);
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const cx = i * size + size/2;
                    const cy = j * size + size/2;
                    const beadCount = 12;
                    const radius = 35;
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(t * 0.01 + (i+j)*0.5);
                    for(let k=0; k<beadCount; k++) {
                        const angle = (k/beadCount) * Math.PI * 2;
                        const bx = Math.cos(angle) * radius;
                        const by = Math.sin(angle) * radius;
                        ctx.beginPath();
                        ctx.arc(bx, by, 3, 0, Math.PI*2);
                        ctx.fillStyle = COLORS.white;
                        ctx.fill();
                    }
                    ctx.fillStyle = (i+j)%2===0 ? COLORS.blue : COLORS.red;
                    ctx.beginPath();
                    ctx.arc(0, 0, 15 + Math.sin(t*0.05)*5, 0, Math.PI*2);
                    ctx.fill();
                    ctx.restore();
                }
            }
        }
    },
    {
        name: "明清 · 回纹",
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.2)`;
            ctx.fillRect(0, 0, width, height);
            const cellSize = 60;
            const cols = Math.ceil(width / cellSize);
            const rows = Math.ceil(height / cellSize);
            ctx.save();
            ctx.strokeStyle = COLORS.gold;
            ctx.lineWidth = 2;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * cellSize;
                    const y = j * cellSize;
                    const phase = (i + j) * 0.2 + t * 0.02;
                    const size = (Math.sin(phase) * 0.5 + 0.5) * cellSize * 0.8;
                    const offset = (cellSize - size) / 2;
                    ctx.strokeRect(x + offset, y + offset, size, size);
                    if (size > 15) {
                        ctx.strokeRect(x + offset + 6, y + offset + 6, size - 12, size - 12);
                    }
                }
            }
            ctx.restore();
        }
    },
    {
        name: "锦绣 · 缠枝",
        duration: 600,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.05)`;
            ctx.fillRect(0, 0, width, height);
            const amplitude = 80;
            const frequency = 0.01;
            const speed = 2;
            for(let i=0; i<3; i++) {
                const yOffset = height/2 + (i-1)*150;
                const headX = (frame * speed + i * 100) % (width + 200) - 100;
                const headY = yOffset + Math.sin(headX * frequency) * amplitude;
                ctx.beginPath();
                ctx.arc(headX, headY, 5, 0, Math.PI*2);
                ctx.fillStyle = COLORS.green;
                ctx.fill();
                if (frame % 10 === 0) {
                     ctx.save();
                     ctx.translate(headX, headY);
                     ctx.rotate(Math.sin(headX * 0.01));
                     ctx.beginPath();
                     ctx.ellipse(0, 0, 15, 5, 0, 0, Math.PI*2);
                     ctx.fillStyle = (frame % 20 === 0) ? COLORS.red : COLORS.green;
                     ctx.fill();
                     ctx.restore();
                }
            }
        }
    },
    {
        name: "自然 · 生长",
        duration: 600,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.4)`;
            ctx.fillRect(0, 0, width, height);
            const drawBranch = (startX, startY, len, angle, depth) => {
                if (depth <= 0) return;
                ctx.save();
                ctx.translate(startX, startY);
                ctx.rotate(angle * Math.PI / 180);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, -len);
                ctx.strokeStyle = depth > 3 ? COLORS.ochre : COLORS.jade;
                ctx.lineWidth = depth * 0.8;
                ctx.stroke();
                ctx.restore();
                const endX = startX + len * Math.sin(angle * Math.PI / 180);
                const endY = startY - len * Math.cos(angle * Math.PI / 180);
                const swing = Math.sin(t * 0.02 + depth * 0.5) * (10 - depth);
                drawBranch(endX, endY, len * 0.75, angle - 25 + swing, depth - 1);
                drawBranch(endX, endY, len * 0.75, angle + 25 + swing, depth - 1);
            }
            drawBranch(width/2, height, height * 0.22, 0, 9);
        }
    },
    {
        name: "祥瑞 · 鳞纹", // 鱼鳞/龙鳞
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(10, 10, 12, 0.2)`;
            ctx.fillRect(0, 0, width, height);
            
            const r = 30;
            const rows = Math.ceil(height / (r));
            const cols = Math.ceil(width / (r * 2));
            
            ctx.lineWidth = 2;
            
            for(let y=0; y<rows; y++) {
                for(let x=0; x<cols; x++) {
                    const cx = x * r * 2 + (y%2) * r;
                    const cy = y * r;
                    
                    // 波动
                    const offset = Math.sin(x*0.5 + t*0.05 + y*0.2) * 5;
                    
                    ctx.beginPath();
                    ctx.arc(cx, cy - offset, r, 0, Math.PI, false); // 半圆
                    ctx.strokeStyle = (x+y)%3===0 ? COLORS.gold : COLORS.cyan;
                    ctx.stroke();
                }
            }
        }
    },
    {
        name: "水墨 · 晕染",
        duration: 400,
        type: 'light',
        draw: (t) => {
            ctx.fillStyle = `rgba(247, 244, 237, 0.02)`;
            ctx.fillRect(0, 0, width, height);
            if (Math.random() > 0.8) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const r = Math.random() * 30 + 10;
                ctx.beginPath();
                ctx.arc(x, y, r, 0, Math.PI*2);
                ctx.fillStyle = `rgba(10, 10, 12, ${Math.random() * 0.3})`;
                ctx.fill();
            }
            const radius = (t % 200) * 2;
            ctx.beginPath();
            ctx.arc(width/2, height/2, radius, 0, Math.PI*2);
            ctx.strokeStyle = `rgba(10, 10, 12, 0.05)`;
            ctx.lineWidth = 20;
            ctx.stroke();
        }
    },
    {
        name: "织锦 · 菱格",
        duration: 500,
        type: 'dark',
        draw: (t) => {
            ctx.fillStyle = `rgba(62, 81, 104, 0.2)`; // 蓝底
            ctx.fillRect(0, 0, width, height);
            
            const size = 60;
            ctx.strokeStyle = COLORS.gold;
            ctx.lineWidth = 1;
            
            for(let x=0; x<width; x+=size) {
                for(let y=0; y<height; y+=size) {
                    ctx.strokeRect(x, y, size, size);
                    
                    // 内部X形
                    if((x+y)%120 === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x, y); ctx.lineTo(x+size, y+size);
                        ctx.moveTo(x+size, y); ctx.lineTo(x, y+size);
                        ctx.stroke();
                    }
                    
                    // 动态闪烁点
                    if(Math.sin(t*0.05 + x*0.1) > 0.5) {
                        ctx.fillStyle = COLORS.white;
                        ctx.fillRect(x+size/2-2, y+size/2-2, 4, 4);
                    }
                }
            }
        }
    }
];

// 随机打乱场景顺序
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 初始化场景列表 (混沌·起源 始终放第一个，其他随机)
const startScene = allScenes.find(s => s.name === "混沌 · 起源");
const otherScenes = shuffleArray(allScenes.filter(s => s.name !== "混沌 · 起源"));
const scenes = [startScene, ...otherScenes];


// ==========================================
// 动画循环
// ==========================================

function loop() {
    if (!isPaused) {
        frame++;
        
        try {
            const currentScene = scenes[currentSceneIndex];
            const sceneTime = frame - sceneStartTime;

            currentScene.draw(frame);

            // 标题控制
            if (sceneTime === 10) {
                titleEl.textContent = currentScene.name;
                titleEl.classList.add('visible');
                
                // 根据场景类型切换文字颜色
                if (currentScene.type === 'light') {
                     titleEl.style.color = COLORS.bg;
                     titleEl.style.textShadow = 'none';
                } else {
                     titleEl.style.color = COLORS.white;
                     titleEl.style.textShadow = '0 0 20px rgba(224, 216, 192, 0.3)';
                }
            }
            if (sceneTime > currentScene.duration - 50) {
                titleEl.classList.remove('visible');
            }

            if (sceneTime > currentScene.duration) {
                nextScene();
            }
        } catch (e) {
            console.error("Scene rendering error:", e);
            nextScene();
        }
    }

    requestAnimationFrame(loop);
}

function nextScene() {
    currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
    sceneStartTime = frame;
    
    // 重置画布
    const nextS = scenes[currentSceneIndex];
    if (nextS.type === 'light') {
        ctx.fillStyle = COLORS.white;
    } else {
        ctx.fillStyle = COLORS.bg;
    }
    ctx.fillRect(0, 0, width, height);
}

// 启动
loop();
