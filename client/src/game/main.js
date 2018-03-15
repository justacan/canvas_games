import InputHandler from './inputHandler'
import Map from './map';
import SpaceCraft from './spacecraft';
import Explosion from './explosion'
import PowerUp from './powerup';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const checkHit = (rect1, rect2) => {
  if (rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.height + rect1.y > rect2.y) {
    // console.log(rect1.x, rect2.x + rect2.width)
    console.log('HIT')
    return true

  }
    return false;
}

const updateBullets = (ctx, projectiles) => {
  projectiles.forEach(e => e.update(ctx))
}


export default class Game {
  constructor (canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.lastTime;
    this.inputHandler = new InputHandler(this)
    this.inputHandler.registerInput();
    this.projectilePool = [];
    this.powerUps = [];
    this.gameTime = 0;
    this.baddieFactory = SpaceCraft.BaddieFactory(this.projectilePool);
    this.spawnBounce = false;
    this.load();

  }

  checkOffScreen(obj, lock = false) {
    if (lock) {
      if (obj.x <= 0) obj.x = 0;
      if (obj.x >= this.canvas.width) obj.x = this.canvas.width;
      if (obj.y <= 0) obj.y = 0;
      if (obj.y >= this.canvas.height) obj.y = this.canvas.height;
      return false;
    }

    if (obj.x <= 0) return true;
    if (obj.x >= this.canvas.width) return true;
    if (obj.y <= 0) return true;
    if (obj.y >= this.canvas.height) return true;
    return false;

  }

  loadMore = () => {

  }

  mainLoop = () => {


    const currentTime = Date.now();
    this.delta = (currentTime - (this.lastTime || currentTime)) / 1000;
    this.gameTime += this.delta;

    // console.log(Math.ceil(this.gameTime), this.gameTime)
    // if (Math.round(this.gameTime)%2 === 0 && !this.spawnBounce) {
      // this.spawnBounce = true;
      // this.baddieFactory.create(getRandomInt(this.canvas.width), getRandomInt(this.canvas.height))
    // }
    // if (Math.round(this.gameTime)%2 !== 0) this.spawnBounce = false;

    let enemies = this.baddieFactory.baddies;

    // console.log(enemies)


    this.speed = 200;


    this.checkOffScreen(this.ship, true);

    // check crashing into enemies
    enemies.forEach(e => {
      checkHit(this.ship.hitbox, e.hitbox)
    })

    // check player bullets hitting enemies
    this.ship.projectiles.forEach((proj, i, a) => {
      if (this.checkOffScreen(proj)) {
        a.splice(i, 1);
        return;
      }
      enemies.forEach((e) => {
        if (checkHit(e.hitbox, proj)) {
          a.splice(i, 1);
          e.damage(proj.damage)
        }
      })
    })

    // powerup collision
    this.powerUps.forEach((e,i,a) => {
      if ( checkHit(this.ship.hitbox, e.hitbox) ) {
        a.splice(i, 1);
        this.ship.powerUp();
      }
    })

    // check if player hit
    this.projectilePool.forEach((e,i,a) => {
      if (this.checkOffScreen(e)) {
        a.splice(i, 1);
        return;
      }
      if (checkHit(this.ship.hitbox, e)) {
        let pos = Object.assign({}, {x: this.ship.x, y: this.ship.y})
        a.splice(i, 1);
        this.explosions.create(pos.x, pos.y)
        // console.log('wtfomgbbq')
      }
    })

    // remove the dead
    enemies.forEach((e,i,a) => {
      if (e.hp <= 0) {
        a.splice(i, 1);
        this.explosions.create(e.x, e.y, 2);
        //explode
      }
    })

    this.inputHandler.checkInput();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.map.render(this.ctx, this.delta)

    this.powerUps.forEach(e => e.render());

    updateBullets(this.ctx, this.ship.projectiles);
    this.ship.render(this.ctx, this.delta)

    enemies.forEach(e => {
      // e.doPlot(this.delta);
      // console.log(e)
      e.render(this.ctx, this.delta)
    });

    // this.baddieFactory.render(this.ctx, this.delta);

    this.explosions.render(this.ctx, this.delta);

    this.lastTime = currentTime;
    window.requestAnimationFrame(this.mainLoop);

  }

  load = async () => {
    this.explosions = Explosion();
    this.map = new Map(this.canvas.height);
    this.ship = SpaceCraft.Player(this.canvas.width/2, this.canvas.height - 50);

    await this.explosions.load();
    await this.map.drawMap();
    await this.ship.load('jet_fighter_sprite.png');
    await this.baddieFactory.loadAll();

    this.powerUps.push(PowerUp(this.canvas, this.ctx));

    this.baddieFactory.create(500, 500)
    this.baddieFactory.create(200, 300, 'gun_mine')
    this.baddieFactory.create(300, 300, 'gun_mine')
    this.baddieFactory.create(400, 300, 'gun_mine')
    this.baddieFactory.create(500, 300, 'gun_mine')


    // this.enemies = [
      // SpaceCraft.Baddie(100, 100, this.projectilePool),
      // SpaceCraft.Baddie(500, 500, this.projectilePool),
      // SpaceCraft.Baddie(500, 500, this.projectilePool),
      // SpaceCraft.Baddie(getRandomInt(this.canvas.width), getRandomInt(this.canvas.height), this.projectilePool),
      // SpaceCraft.Baddie(getRandomInt(this.canvas.width), -20, this.projectilePool),
    // ]

    //testing
    // for (let i = 0; i < 33; i++) {
    //   this.enemies.push(SpaceCraft.Baddie(getRandomInt(this.canvas.width), -15, this.projectilePool))
    // }
    // for (let e of this.enemies) {
    //   await e.load('alien3.png')
      //testing
      // e.registerPlot([{default: true}])
    // }
    // this.enemies[0].registerPlot([
    //   {x: 500, y: 500},
    //   {x: 500, y: 700},
    //   {delay: 2000},
    //   {x: 500, y: 100},
    //   {x: 500, y: 400},
    // ]);
    //
    // this.enemies[1].registerPlot([
    //   {x: 600, y: 500},
    //   {x: 400, y: 700},
    //   {x: 666, y: 66},
    //   {x: 34, y: 60},
    // ]);
    //
    // this.enemies[2].registerPlot([
    //   {x: 200, y: -50},
    //   {x: 200, y: 100, speed: 100},
    //   {delay: 500},
    //   {x: 200, y: 700}
    // ]);


    window.requestAnimationFrame(this.mainLoop);
  }
}