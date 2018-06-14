import { createCanvas, Image } from "canvas";
import { initializeObniz } from "./wrapper/Obniz";

const gifFrames = require("gif-frames");

async function main() {
  const obniz = await initializeObniz("1849-4311")
  const canvas = createCanvas(128, 64);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    let x = 0;
    setInterval(async () => {
      const frame = await gifFrames({
        url: "./image.gif",
        frames: x,
        outputType: "png",
      });
      const image = frame[0].getImage();
      const binary = image.data;
      const width = image.width;
      const height = image.height;
      for (let x = 0; x < 128; x++) {
        for (let y = 0; y < 64; y++) {
          const r = binary[((40 + y) * width + (20 + x)) * 4];
          const g = binary[((40 + y) * width + (20 + x)) * 4 + 1];
          const b = binary[((40 + y) * width + (20 + x)) * 4 + 2];
          const color = (r + g + b) / 3 > 128 ? "white" : "black";
          ctx.fillStyle = color;
          // console.log(color);
          ctx.fillRect(x, y, 1, 1);
        }
      }
      x = (x + 1) % 100;
      obniz.display.draw(ctx);
    }, 1000/10);
  }
}

main();
