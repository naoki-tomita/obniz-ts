import { createCanvas } from "canvas";
import { Obniz } from "./Wrapper/Obniz";

async function main() {
  const obniz = new Obniz("1849-4311");
  await obniz.init();
  const canvas = createCanvas(128, 64);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(90, 90);
    ctx.stroke();
    obniz.display.draw(ctx);
  }
}

main();
