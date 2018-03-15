const findPos = (index, width = 25) => {
  let y = Math.floor(index / width)
  let x = index % width
  return {x, y}
}

const canLoad = (state) => {
  return {
    loadImage: (src) => {
      return new Promise((resolve) => {
        let img = new Image()
        img.src = `/maps/${src}`;
        img.onload = () => {
          state.image = img;
          return resolve(img);
        }
      });
    },
    loadSheet: (file) => {
      return Axios.get(`/maps/${file}`)
      .then((response) => {
        state.data = response.data
      })
    },
    load: () => {
      return Promise.all([
        state.loadImage(state.imgSrc),
        state.loadSheet(state.sheetSrc)
      ]);
    }
  }
}

const canRender = (state) => {
  return {
    render: (ctx, delta) => {
      let {x, y ,image, frameIndex, data} = state;
      let {tilewidth, tileheight, columns, tilecount} = data;

      state.tickCount += 1;
      if (state.tickCount > state.ticksPerFrame) {
        state.tickCount = 0;
        state.frameIndex += 1;
      }

      let pos = findPos(frameIndex, columns);
      if (state.frameIndex >= tilecount) {
        state.frameIndex = 0;
        return false;
      }

      const spriteX = state.x - ((tilewidth * state.imageScale) / 2)
      const spriteY = state.y - ((tileheight * state.imageScale) / 2)
      const spriteWidth = tilewidth * state.imageScale;
      const spriteHeight = tileheight * state.imageScale;

      ctx.drawImage(image, pos.x * tilewidth, pos.y * tileheight, tilewidth, tileheight,
        spriteX, spriteY, spriteWidth, spriteHeight);
      return true
    }
  }
}

const Explosions = () => {
  let state = {
    explosions: [],
    image: null,
    imgSrc: 'exp2_0.png',
    sheetSrc: 'explosion.json',
    data: {},
    create: (x, y, imageScale = 1) => {
      state.explosions.push(Explosion(x, y, state.image, state.data, imageScale));
    },
    render: (ctx, delta) => {
      state.explosions.forEach((e,i,a) => {
        if (!e.render(ctx, delta)) a.splice(i, 1);
      })
    }

  }
  return Object.assign(state, canLoad(state))
}

const Explosion = (x, y, image, data, imageScale = 1) => {
  let state = {
    x,
    y,
    image: image,
    data: data,
    imageScale: imageScale,
    frameIndex: 0,
    tickCount: 0,
    ticksPerFrame: 3
  }
  return Object.assign(state, canRender(state))
}

export default Explosions;
