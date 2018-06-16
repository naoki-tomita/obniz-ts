import { createCanvas, Image } from "canvas";
import { initializeObniz } from "./wrapper/Obniz";
import { config } from "dotenv";

const gifFrames = require("gif-frames");

config();

async function main() {
  const obniz = await initializeObniz(process.env.OBNIZ_SERIAL_ID as string);
  const canvas = createCanvas(128, 64);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const arr: any[] = [];
    for (let i = 0; i < 100; i++) {
      const frame = await gifFrames({
        url: "./image.gif",
        frames: i,
        outputType: "png",
      });
      arr.push(frame[0].getImage());
    }
    let x = 0;
    setInterval(async () => {
      const image = arr[x];
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
      x = (x + 1) % arr.length;
      obniz.display.draw(ctx);
    }, 1000/10);
  }
}

main();
