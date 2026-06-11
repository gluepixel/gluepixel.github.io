const year = document.querySelector("#year");
const header = document.querySelector(".site-header");
const canvas = document.querySelector("#signalCanvas");
const ctx = canvas.getContext("2d");

year.textContent = new Date().getFullYear();

const pointer = { x: 0, y: 0, active: false };
const nodes = [];
let width = 0;
let height = 0;
let animationFrame = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const nodeCount = Math.min(90, Math.max(38, Math.floor((width * height) / 18000)));
  nodes.length = 0;

  for (let index = 0; index < nodeCount; index += 1) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      size: Math.random() * 1.8 + 0.8
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < -20 || node.x > width + 20) node.vx *= -1;
    if (node.y < -20 || node.y > height + 20) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 150) {
        node.x -= dx * 0.002;
        node.y -= dy * 0.002;
      }
    }
  }

  for (let a = 0; a < nodes.length; a += 1) {
    for (let b = a + 1; b < nodes.length; b += 1) {
      const first = nodes[a];
      const second = nodes[b];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance < 120) {
        ctx.strokeStyle = `rgba(245, 241, 232, ${0.12 - distance / 1200})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        ctx.lineTo(second.x, second.y);
        ctx.stroke();
      }
    }
  }

  for (const node of nodes) {
    ctx.fillStyle = "rgba(240, 193, 91, 0.62)";
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
    ctx.fill();
  }

  animationFrame = requestAnimationFrame(draw);
}

function setHeaderState() {
  header.dataset.elevated = String(window.scrollY > 18);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});
window.addEventListener("pointerleave", () => {
  pointer.active = false;
});

resizeCanvas();
setHeaderState();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  draw();
} else {
  cancelAnimationFrame(animationFrame);
}
