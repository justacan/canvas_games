// import ImgSrc from './maps/characters.png'
const data = require('./maps/characters.json')

// console.log(data)

function hexToRgb(hex){
  var c;
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c= hex.substring(1).split('');
    if(c.length== 3){
      c= [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c= '0x'+c.join('');
    return {
      r: (c>>16)&255,
      g: (c>>8)&255,
      b: c&255
    }
  }
  throw new Error('Bad Hex');
}

export default class Char {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.canvas.width = data.imagewidth;
      this.canvas.height = data.imageheight;
      this.ctx = this.canvas.getContext('2d');
      this.ctx.mozImageSmoothingEnabled = false;
      this.ctx.webkitImageSmoothingEnabled = false;
      this.ctx.msImageSmoothingEnabled = false;
      this.ctx.imageSmoothingEnabled = false;
      // document.getElementsByTagName('body')[0].appendChild(this.canvas);
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });
    }

    load() {
      return new Promise((resolve, reject) => {
        this.loadImage('/maps/characters.png')
        .then((image) => {
          this.ctx.drawImage(image, 0, 0);
          let imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
          // console.log(imgData)
          const trans = hexToRgb(data.transparentcolor);
          console.log(trans)
          console.log(imgData.data[0], imgData.data[1], imgData.data[2])
          for (let i = 0; i < imgData.data.length / 4; i++) {
            let red = i * 4;
            let green = i * 4 + 1;
            let blue = i * 4 + 2;
            let alpha = i * 4 + 3
            if ( imgData.data[red] === trans.r && imgData.data[green] === trans.g && imgData.data[blue] === trans.b ) {
              imgData.data[alpha] = 0;
            }
          }
              this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height)
              this.ctx.putImageData(imgData, 0, 0);
              return resolve();
          })

      });

    }

    findTile(id) {
        let y = Math.floor((id) / data.columns)
        let x = (id) % data.columns
        return {x, y}
    }
}