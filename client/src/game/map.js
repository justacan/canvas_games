export default class Map {
    constructor(cameraHeight) {
      this.cameraHeight = cameraHeight;
      this.canvas = document.createElement("canvas")
      this.canvas.id = "test";
      this.canvas.width = 0
      this.canvas.height = 0
      this.ctx = this.canvas.getContext('2d');
      // document.getElementsByTagName('body')[ 0 ].appendChild(this.canvas);
      this.y = 0;
      this.images = []
    }


    loadImage(src) {
        return new Promise((resolve, reject) => {
            // console.log(src)
            let img = new Image()
            img.src = `/maps/${src}`;
            img.onload = () => resolve(img);
        })
    }

    drawMap() {
      const maps = [
        {name: 'clouds_map.png', times: 3}
      ];

      const mapChain = [];

      maps.map(e => {
        for (let i = 0; i < e.times ; i++) {
          mapChain.push(e.name)
        }
      })

      return new Promise((resolve, reject) => {
        // load
        return Promise.all(
          mapChain.map(e => this.loadImage(e))
        )
        .then((images) => {
          this.images = images
          this.canvas.width = 1024;
          images.forEach(e => this.canvas.height += e.height)
        })
        .then(() => {
          // console.log(this.images)
          let offset = 0;
          this.images.forEach((e, i) => {
            this.ctx.drawImage(e, 0, offset);
            offset += e.height - 1
          })
        })
        .then(() => {
          this.y = this.canvas.height - this.cameraHeight;
          return resolve();
        })
      })
    }

    render(ctx, delta) {
      this.y -= Math.round(delta * 30);
      // console.log(this.y)
      const x = 0;
      const width = 1024;
      const height = 768;
      // void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
      ctx.drawImage(this.canvas, x, this.y, width, height, 0, 0, width, height);
    }


}

// class Map {
//   constructor(ctx, cameraHeight) {
//     this.x = 0;
//     this.y = 0;
//     this.cameraHeight = cameraHeight;
//     this.ctx = ctx;
//     this.image;
//     this.framecount = 0;
//   }
//
//   load = async (place) => {
//     this.image = await loadImage('clouds_map.png');
//
//     this.y = -((this.image.height * place) - this.cameraHeight - 1);
//     console.log(place, this.image.height, this.cameraHeight, this.y)
//   }
//
//   render = (delta) => {
//     const x = 0;
//
//     this.y += Math.round(delta * 30);
//
//
//     // this.y += delta
//     // console.log(this.y)
//     this.ctx.drawImage(this.image, x, this.y)
//     return this.y
//   }
// }