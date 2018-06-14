import { Observable } from "../models/Observable";

const OrgObniz = require("obniz");

interface Display {
  clear(): void;
  qr(data: string, correction?: "L" | "M" | "Q" | "H"): void;
  raw(raw: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export class Obniz extends Observable {
  private readonly obniz: any;
  private readonly initialized: Promise<{}>;
  constructor(id: string) {
    super();
    this.obniz = new OrgObniz(id);
    this.initialized = new Promise<{}>(resolve => {
      this.obniz.onconnect = () => {
        resolve();
      };
    });
  }

  async init() {
    return await this.initialized;
  }

  get display(): Display {
    return this.obniz.display;
  }
}
