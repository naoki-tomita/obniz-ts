import { Observable } from "../models/Observable";

const OrgObniz = require("obniz");

interface Display {
  clear(): void;
  qr(data: string, correction?: "L" | "M" | "Q" | "H"): void;
  raw(raw: number): void;
  draw(context: CanvasRenderingContext2D): void;
}

export class Obniz extends Observable {
  obniz: any;
  constructor(id: string) {
    super();
    this.obniz = new OrgObniz(id);
    this.obniz.onconnect = () => {

    };
  }

  get display(): Display {
    return this.obniz.display;
  }
}
