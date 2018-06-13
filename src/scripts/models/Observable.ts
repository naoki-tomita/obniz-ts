export class Observable {
  fnOn: {
    [key: string]: Array<(...ev: any[]) => void>;
  }
  fnOnce: {
    [key: string]: Array<(...ev: any[]) => void>;
  }

  constructor() {
    this.fnOn = {};
    this.fnOnce = {};
  }

  on(type: string, fn: (...ev: any[]) => void) {
    this.fnOn[type] = this.fnOn[type] || [];
    this.fnOn[type].push(fn);
  }

  once(type: string, fn: (...ev: any[]) => void) {
    this.fnOnce[type] = this.fnOnce[type] || [];
    this.fnOnce[type].push(fn);
  }

  trigger(type: string, ...params: any[]) {
    this.fnOn[type].forEach(f => f(...params));
    this.fnOnce[type].forEach(f => f(...params));
    delete this.fnOnce[type];
  }
}