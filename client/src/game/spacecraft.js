
const findPos = (index, width = 25) => {
  let y = Math.floor(index / width)
  let x = index % width
  return {x, y}
}

// Abstracts


class Bullet {
  constructor(x, y, reverse = false) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
    this.vx = 0;
    this.vy = 0;
    this.speed = 30;
    this.damage = 25;
    this.reverse = reverse;
  }

  update(ctx, delta) {
    if (this.reverse) {
      this.y += this.speed;
    } else {
      this.y -= this.speed;
    }
    ctx.beginPath();

    // ctx.lineWidth = 5;

    let radius = 4;

    ctx.strokeStyle = '';
    ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
    // ctx.fillStyle = 'green';

    ctx.fillStyle='red';

    ctx.fill();
    // ctx.rect(this.x -4, this.y -4, 8, 8);
    // ctx.stroke();
  }
}



const canLoad = (state) => {
  return {
    load: (src) => {
      return new Promise((resolve) => {
        let img = new Image()
        img.src = `/maps/${src}`;
        img.onload = () => {
          state.image = img;
          return resolve(img);
        }
      });
    }
  }
}

const canShoot = (state) => {
  return {
    projectiles: [],
    tickCount: 0,
    power: 2,
    lastFire: Date.now(),
    powerUp: () => state.power = 11,
    fire: () => {
      if (Date.now() - state.lastFire < 100) return;
        // if (Date.now() <= state.lastFire + (250 / state.power)) return;
      state.lastFire = Date.now();

      state.projectiles.push(new Bullet(state.x -10, state.y));
      state.projectiles.push(new Bullet(state.x +10, state.y));
      state.projectiles.push(new Bullet(state.x -10, state.y - 20));
      state.projectiles.push(new Bullet(state.x +10, state.y - 20));

      if (state.power > 2) {
        state.projectiles.push(new Bullet(state.x -25, state.y));
        state.projectiles.push(new Bullet(state.x +25, state.y));
        state.projectiles.push(new Bullet(state.x -25, state.y - 20));
        state.projectiles.push(new Bullet(state.x +25, state.y - 20));
      }

    }
  }
}

const canRender = (state, hitboxModifier = .5) => {
  return {
    hitboxModifier,
    hitbox: {
    },
    render: (ctx, delta) => {

      let { hitbox, hitboxModifier } = state;

      let width = state.image.width * state.imageScale;
      let height = state.image.height * state.imageScale;

      state.hitbox = {
        x: state.x - ((width * hitboxModifier) / 2),
        y: state.y - ((height * hitboxModifier) / 2),
        width: width * hitboxModifier,
        height: height * hitboxModifier,
      }

      if (state.onSpawn) {
        state.onSpawn(ctx);
        ctx.beginPath();
        ctx.strokeStyle ='red';
        ctx.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        ctx.rect(state.x, state.y, 1, 1);
        ctx.stroke();
        return;
      }

      const spriteX = state.x - (width / 2)
      const spriteY = state.y - (height / 2)

      ctx.drawImage(state.image, spriteX, spriteY, width, height)
      ctx.beginPath();
      ctx.strokeStyle ='red';
      ctx.rect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
      ctx.rect(state.x, state.y, 1, 1);
      ctx.stroke();
    }
  }
}

const canMove = (state) => {
  return {
    applyVelX: (x) => {
      state.x += x;
    },
    applyVelY : (y) => {
      state.y += y;
    }
  }
}

const canBeDamaged = (state, hp) => {
  return {
    hp,
    damage: (damage) => {
      state.hp -= damage;
      // console.log(state.hp);
    }
  }
}

// Concrete

const Player = (x = 0, y = 0) => {
  let state = {
    x, y,
    vx: 0, vy: 0,
    speed: 350,
    image: null,
    imageScale: 1,
  }
  return Object.assign(
    state,
    canLoad(state),
    canShoot(state),
    canRender(state, .5),
    canMove(state),
    canBeDamaged(state, 100)
  );

}

const AiShoot = (state) => {
  return {
    fire: (power = 1) => {
      for (let i = 0; i < power; i++) {
        state.projectilePool.push(new Bullet(state.x - 10, state.y - i * 32, true))
        state.projectilePool.push(new Bullet(state.x + 10, state.y - i * 32, true))
      }
    }
  }

}

const canPlot = (state) => {
  return {
    plot: [],
    plotDelay: null,
    plotIndex: 0,
    registerPlot: plot => {

      if (plot.length > 0 && plot[0].default) {
        // console.log('here')
        state.plot = [{x: state.x.valueOf(), y: 5000}]
        console.log(state.plot)
      } else {
        state.plot = plot
      }
    },
    doPlot: (delta) => {

      // console.log(state.plot)
      if (state.plot.length === 0 || state.plotIndex === -1) return;
      let p = state.plot[state.plotIndex];

      const speed = state.speed * delta;

      const vx = (p.x > state.x) ? speed : -speed;
      const vy = (p.y > state.y) ? speed : -speed;

      // console.log('>', vx, vy)
      // console.log('>', state.x, state.y);
      // console.log('>', p.x, p.y);

      if (p.delay) {
        if (state.plotDelay) return;
        state.plotDelay = setTimeout(() => {
          state.plotDelay = null;
          state.plotIndex++;
          return;
        }, p.delay)
      }

      // console.log('>>', (vy <= 0))
      const arrivedX = (vx <= 0) ? (Math.floor(state.x) <= p.x) : (Math.floor(state.x) >= p.x);
      const arrivedY = (vy < 0) ? (Math.floor(state.y) <= p.y) : (Math.floor(state.x) >= p.y);

      // console.log(arrivedX)
      // console.log(arrivedY)

      if (arrivedX && arrivedY) {

        if (state.plotIndex+1 >= state.plot.length) {
          state.plotIndex = -1;
          return;
        }
        state.plotIndex++


      } else {
        // console.log("MOVING")
        if ( p.x && !arrivedX) state.x += vx;
        if ( p.y && !arrivedY) state.y += vy;
      }

    }

  }
}

const Baddie = (x = 0, y = 0) => {
  let state = {
    x, y,
    vx: 0, vy: 0,
    speed: 20,
    image: null,
    imageScale: .5,
    shotDelay: 60,
    tickCount: 0,
    // projectilePool,
    register: (projectilePool, image) => {
      state.projectilePool = projectilePool
      state.image = image;
    }
  }
  return Object.assign(
    state,
    // canLoad(state, .5),
    AiShoot(state),
    canRender(state, .5),
    canMove(state),
    canPlot(state),
    canBeDamaged(state, 100)
  );

}

const BaddieFactory = (projectilePool) => {
  let state = {
    baddies: [],
    projectilePool,
    images: {},
    create: (x, y, type = 'baddie') => {

      let b;
      switch (type) {
        case 'gun_mine':
          b = gunMine(x, y);
          b.register(
            state.projectilePool,
            state.images['gun_mine_opening']
          );
          break;
        case 'baddie':
        default:
          b = Baddie(x, y);
          b.register(
            state.projectilePool,
            state.images['alien3']
          );
          break;
      }

      state.baddies.push(b);
    },
    render: (ctx, delta) => {
      state.baddies.forEach(e => e.render(ctx, delta))
    },
    loadAll: () => {
      return new Promise((resolve, reject) => {
        Promise.all([state.load('alien3.png'), state.load('gun_mine_opening.png')])
        .then(([alien3, gun_mine_opening]) => {
          state.images['alien3'] = alien3;
          state.images['gun_mine_opening'] = gun_mine_opening;
          return resolve()
        })
      })
    }
  }
  return Object.assign(state, canLoad(state))

}

const gunMine = (x, y) => {
  let state = {
    x, y,
    vx: 0, vy: 0,
    speed: 20,
    image: null,
    imageScale: .5,
    shotDelay: 60,
    tickCount: 0,
    // projectilePool,
    register: (projectilePool, image) => {
      state.projectilePool = projectilePool
      state.image = image;
    },
    tileData: {
      "columns":8,
      "image":"gun_mine_opening.png",
      "imageheight":128,
      "imagewidth":1024,
      "margin":0,
      "name":"gun_mine_opening",
      "spacing":0,
      "tilecount":8,
      "tileheight":128,
      "tilewidth":128,
      "type":"tileset"
    },
    spawn: {
      frameIndex: 0,
      tickCount: 0,
      ticksPerFrame: 4
    },
    phase: 'closed',
    spawnedAt: Date.now(),
    onSpawn: (ctx) => {
      let {x, y ,image} = state;
      let {tilewidth, tileheight, columns, tilecount} = state.tileData;

      let pos = pos = findPos(state.spawn.frameIndex, columns);

      if (state.spawn.frameIndex >= tilecount) {
        state.phase = 'open';
      }

      if (Date.now() - state.spawnedAt < 1000) {
        state.spawn.tickCount = 0
        state.spawn.frameIndex = 0
        pos = findPos(state.spawn.frameIndex, columns);
      } else if (state.phase === 'open') {
        state.spawn.tickCount = 0
        state.spawn.frameIndex = tilecount - 1
        pos = findPos(state.spawn.frameIndex, columns);
      } else {
        state.spawn.tickCount += 1;
        if (state.spawn.tickCount > state.spawn.ticksPerFrame) {
          state.spawn.tickCount = 0;
          state.spawn.frameIndex += 1;
        }
      }

      const spriteX = 0 - ((tilewidth * state.imageScale) / 2)
      const spriteY = 0 - ((tileheight * state.imageScale) / 2)
      const spriteWidth = tilewidth * state.imageScale;
      const spriteHeight = tileheight * state.imageScale;
      let TO_RADIANS = Math.PI/180;
      ctx.save()
      ctx.translate(x,y);
      ctx.rotate(90 * TO_RADIANS);
      ctx.drawImage(image, pos.x * tilewidth, pos.y * tileheight, tilewidth, tileheight,
        spriteX, spriteY, spriteWidth, spriteHeight);
      ctx.restore();
      return true
    }

  }
  return Object.assign(
    state,
    // canLoad(state, .5),
    AiShoot(state),
    canRender(state, .5),
    canMove(state),
    canPlot(state),
    canBeDamaged(state, 100)
  );
}




export default {
  Player,
  Baddie,
  BaddieFactory
}



