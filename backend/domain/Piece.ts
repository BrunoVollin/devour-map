export default class Piece {
  constructor(readonly id: string | null, private x: number, private y: number) {}

  setXY(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}
