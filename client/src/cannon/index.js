import InputHandler from './inputHandler';

const radians = (degrees) => -(degrees * Math.PI / 180);
const degrees = (radians) => 180 * radians / Math.PI

var currentTime, lastTime, delta;

const balls = [];
const explosions = [];
const gravity = -9.8;

let tanks = [];

const findPos = (index, width = 25) => {
  let y = Math.floor(index / width)
  let x = index % width
  return {x, y}
}

let findId = (pos, width) => {
  let i = pos.x + width * pos.y;
  return {
    red: i * 4,
    green: i * 4 + 1,
    blue: i * 4 + 2,
    alpha: i * 4 + 3,
  }
}

const findSpawn = (x) => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  let platformWidth = 25;
  let platformHeight = 10;


  for (let y = 0; y < canvas.height; y++) {
    let p = findId({x, y}, canvas.width);
    if (imgData.data[ p.alpha ] > 0) {
      ctx.fillStyle = '#006000';
      ctx.fillRect(x - platformWidth / 2, y - platformHeight / 2 , platformWidth, platformHeight)
      ctx.clearRect(x - platformWidth / 2, y - platformHeight / 2 - platformHeight, platformWidth, platformHeight)
      return y - (platformHeight + 2) / 2
    }
  }
  return false;
}


const Terrain = () => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  const context = ctx;
  ctx.clearRect(0,0,canvas.width, canvas.height)
  // parameters - change to your liking
  var STEP_MAX = 2.5;
  var STEP_CHANGE = 1.0;
  var HEIGHT_MAX = canvas.height;

  // starting conditions
  var height = Math.random() * HEIGHT_MAX;
  var slope = (Math.random() * STEP_MAX) * 2 - STEP_MAX;

  // creating the landscape
  for (var x = 0; x < canvas.width; x++) {
    // change height and slope
    height += slope;
    slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE;

    // clip height and slope to maximum
    if (slope > STEP_MAX) { slope = STEP_MAX };
    if (slope < -STEP_MAX) { slope = -STEP_MAX };

    if (height > HEIGHT_MAX) {
      height = HEIGHT_MAX;
      slope *= -1;
    }
    if (height <= 0 + (HEIGHT_MAX * .25)) {
      height = 0 + (HEIGHT_MAX * .25);
      slope *= -1;
    }

    // draw column
    context.beginPath();
    context.moveTo(x, HEIGHT_MAX);
    context.lineTo(x, height);
    ctx.strokeStyle = "green"
    context.stroke();
  }
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  console.log("Start")

  // for (let i = 0; i < imgData.data.length / 4; i++) {
  //   let red = i * 4;
  //   let green = i * 4 + 1;
  //   let blue = i * 4 + 2;
  //   let alpha = i * 4 + 3
  //
  //   if (imgData.data[alpha] > 0) imgData.data[red] = 200
  //   // ctx.putImageData(imgData,0,0,canvas.width,canvas.height)
  // }

  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.putImageData(imgData, 0, 0);
  console.log("Done")
}


const checkTerrain = (x, y) => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let p = findId({x: Math.floor(x), y: Math.floor(y)}, canvas.width);
  return (imgData.data[p.green] > 0)
}


const checkHit = (circle, rect) => {
  let DeltaX = circle.pos.X - Math.max(rect.x, Math.min(circle.pos.X, rect.x + rect.width));
  let DeltaY = circle.pos.Y - Math.max(rect.y, Math.min(circle.pos.Y, rect.y + rect.height));
  let hit = (DeltaX * DeltaX + DeltaY * DeltaY) < (circle.r * circle.r);
  console.log('Hit:', hit)
  return hit;
}



const removeTerrain = () => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  console.log('Remove')
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  // let ex = explosions[0];

  for (let i = 0; i < imgData.data.length / 4; i++) {
      let red = i * 4;
      let green = i * 4 + 1;
      let blue = i * 4 + 2;
      let alpha = i * 4 + 3

      // console.log(imgData.data[red])
      if (imgData.data[red] > 0) {
        // console.log("red")
        imgData.data[alpha] = 0
      }
  }
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.putImageData(imgData,0,0)
  // settleTerrain();
  // settleTerrain();
  // settleTerrain();

  // for (let y = 0; y < canvas.height; y++) {
  //   for (let x = 0; x < canvas.width; x++) {
  //     let res = test({x: ex.pos.X, y: ex.pos.Y}, ex.r, {x,y});
  //       if (res) {
  //         let p = findId({x, y}, canvas.width);
  //         imgData.data[p.alpha] = 0;
  //
  //         ctx.putImageData(imgData, 0, 0);
  //       }
  //     // if (res) console.log(res)
  //   }
  // }

}

const Tank = (x, y) => {

  let width = 20;
  let height = 5;
  let state = {
    x,
    y,
    angle: 0,
    power: 0,
    width,
    height,
    fireToggle: false,

    changeAngle: (value) => {
      state.angle += value;
      if (state.angle == 360 || state.angle == -360) state.angle = 0;
    },
    changePower: (value) => {
      state.power += value;
      if (state.power < 0) state.power = 0
    },
    fireReset: () => state.fireToggle = false,
    fire: () => {
      // if (state.fireToggle) return false;
      if (balls.length) return false;
      state.fireToggle = true;
      balls.push(ball(state.x, state.y, state.angle, state.power, ""))
    },
    renderBody: (canvas, ctx, r) => {
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.rect(state.x - width / 2, state.y - height / 2, state.width, state.height);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    renderTurret: (canvas, ctx) => {
      ctx.save();
      ctx.translate(state.x, state.y);
      ctx.rotate(radians(state.angle));
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.rect(0 - 1, 0 - 1, 10, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    },
    render: (canvas, ctx, myTurn) => {
      state.renderBody(canvas, ctx);
      state.renderTurret(canvas, ctx);
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.rect(state.x - .5, state.y - .5, 1, 1);
      ctx.stroke();
      ctx.closePath();
      ctx.font = "15px Arial";
      ctx.fillStyle = "red";
      // ctx.textAlign = "center";


      if (myTurn) {
        ctx.fillText(`${state.angle}\xB0`,state.x - 20 ,state.y - 50);
        ctx.fillText(`${state.power}`,state.x - 20,state.y - 35);
      }
    }
  }
  return Object.assign(state);
}

const Explosion = (X, Y, r = 10) => {
  let state = {
    pos: {
      X: X,
      Y: Y
    },
    r,
    render: () => {
      const canvas = document.getElementById('bg');
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.strokeStyle = 'red';
      ctx.arc(state.pos.X, state.pos.Y, state.r, 0, 2 * Math.PI);
      ctx.fillStyle = "rgb(255, 0, 0)";
      ctx.fill();
      ctx.closePath();
      return state;
    }
  }
  return Object.assign(state)
}

const ball = (x, y, angle, speed, type) => {
  let state = {
    type,
    pos: {
      X: x,
      Y: y
    },
    velocity: {
      X: Math.cos(radians(angle)) * speed,
      Y: Math.sin(radians(angle)) * speed
    },
    render: (canvas, ctx, r) => {
      let height = 2.5;
      let width = 5;

      ctx.save();

      ctx.strokeStyle = 'red';

      ctx.translate(state.pos.X, state.pos.Y);

      r = (state.velocity.X < 0) ? r + Math.PI : r

      ctx.rotate(r);

      ctx.beginPath();
      ctx.rect(0 - width / 2, 0 - height / 2, width, height);
      ctx.rect(0, 0, 1, 1);

      ctx.moveTo(width / 2, height / 2);
      ctx.lineTo(width / 2 + 10, 0);
      ctx.lineTo(width / 2, 0 - height / 2);
      // ctx.lineTo(height, width);

      ctx.closePath();
      ctx.stroke();
      // ctx.arc(state.pos.X, state.pos.Y, 10, 0, 2 * Math.PI);

      ctx.restore();
    }
  }
  return Object.assign(state);
};

const Game = (canvas, ctx) => {
  let state = {
    canvas, ctx,
    playerTurn: 0,
    inputHandler: new InputHandler(state),
    doReset: false,
    step: () => {
      let {canvas, ctx} = state;
      currentTime = Date.now();
      delta = (currentTime - (lastTime || currentTime)) / 1000;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      state.inputHandler.checkInput(tanks[state.playerTurn])

      balls.forEach((e, i, a) => {

        let r = Math.atan(e.velocity.Y / e.velocity.X)

        if (e.type === 'MIRV' && e.velocity.Y > 0) {

          let d = degrees(r);
          let s = Math.sqrt(Math.pow(e.velocity.Y, 2) + Math.pow(e.velocity.X, 2));

          for (let i = 0 ; i < 5 ; i++) {
            balls.push(
              ball(e.pos.X, e.pos.Y, -d, s * (1 + .05 * (i - 2)))
            )
          }

          a.splice(i, 1);
          return;
        }

        e.velocity.Y += gravity * -delta * 4;
        e.pos.Y += e.velocity.Y * delta * 4;
        e.pos.X += e.velocity.X * delta * 4;

        if (checkTerrain(e.pos.X, e.pos.Y)) {
          a.splice(i, 1);

          let exp = Explosion(e.pos.X, e.pos.Y).render();

          tanks.forEach((tank,i,a) => {
            if ( checkHit(exp, tank) ) {
              state.doReset = true;
            }
          })

          setTimeout(() => removeTerrain(), 500);
          state.playerTurn = (state.playerTurn === 0) ? 1 : 0
          return;
        }

        if (e.pos.Y >= canvas.height || e.pos.X <= 0 || e.pos.X >= canvas.width) {
          a.splice(i, 1);
          state.playerTurn = (state.playerTurn === 0) ? 1 : 0
          return;
        }

        e.render(canvas, ctx, r);
      });

      tanks.forEach((e,i,a) => {
        let myTurn = (i === state.playerTurn);
        e.render(canvas,ctx, myTurn);
      })

      lastTime = currentTime;

      if (state.doReset) {
        state.doReset = false;
        state.load();
        return;
      }
      requestAnimationFrame(state.step);
    },
    load: () => {
      state.inputHandler.registerInput();
      Terrain();
      tanks = [];
      tanks.push(Tank(55, findSpawn(55)));
      tanks.push(Tank(1300, findSpawn(1300)));
      requestAnimationFrame(state.step);
    }
  }
  return Object.assign(state)
}

export default Game;


