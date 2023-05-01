import Stats from "stats.js";
import { init, dots, step, add } from "./model";

const fps = new Stats();
fps.dom.style.position = "absolute";
fps.dom.style.top = "5px";
fps.dom.style.left = "5px";
fps.showPanel(0);
document.body.appendChild(fps.dom);

const ms = new Stats();
ms.showPanel(1);
ms.dom.style.position = "absolute";
ms.dom.style.top = "5px";
ms.dom.style.left = "90px";
document.body.appendChild(ms.dom);

const W: number = 800;
const H: number = 800;
let ctx: CanvasRenderingContext2D;

/**
 * Draw a dot
 */
function drawDot(x: number, y: number, r: number, color: string) {
  ctx.lineWidth = 1;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
}

/**
 * Render scene
 */
function render(now: DOMHighResTimeStamp) {
  fps.begin();
  ctx.clearRect(0, 0, W, H);
  for (const dot of dots) {
    const { x, y, r, color } = dot.getState();
    drawDot(x, y, r, color);
  }

  ms.begin();
  step(now);
  ms.end();

  fps.end();
  requestAnimationFrame(render);
}

/**
 * Entry point
 */
function main() {
  const canvas = document.querySelector("#canvas")! as HTMLCanvasElement;
  const _ctx = canvas.getContext("2d");
  if (_ctx === null) {
    console.error("Failed to get 2d context");
    return;
  }

  ctx = _ctx;

  canvas.addEventListener("mousedown", function () {
    add({ w: W, h: H, r: 5 });
  });

  init({ w: W, h: H, r: 5 });
  requestAnimationFrame(render);
}

main();
