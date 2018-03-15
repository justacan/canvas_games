let map = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 1, 1, 0, 0, 1],
  [1, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
]

class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.build()
    // this.drawTile(0, 0)
    // this.drawTile(1, 1)
  }

  build() {
    map.map((e, y) => {
      e.map((e, x) => {
        this.drawTile(x, y, e);
      })
    })
  }

  drawTile(x, y, fill) {

    x = x + (800 / 32 / 4);
    y = y + (600 / 32 / 4);

    const size = 32;
    x = x * size;
    y = y * size;

    this.ctx.fillStyle = (!fill) ? 'green' : 'rgb(200, 0, 0)';
    this.ctx.strokeStyle = 'yellow';
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(x, y, size, size);
    this.ctx.strokeRect(x, y, size, size);
  }
}





const startGame = (canvas, ctx) => {
  return new Game(canvas, ctx);
}

export default startGame;