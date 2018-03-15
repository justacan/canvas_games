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


const canLoad = (state) => {
  return {
    render: (canvas, ctx) => {
      ctx.drawImage(state.canvas)
    },
    load: () => {
      let {canvas, ctx} = state;
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
        if (height < 0) {
          height = 0;
          slope *= -1;
        }

        // draw column
        ctx.beginPath();
        ctx.moveTo(x, HEIGHT_MAX);
        ctx.lineTo(x, height);
        ctx.strokeStyle = "green"
        ctx.stroke();
      }
      let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0,0,canvas.width, canvas.height)
      ctx.putImageData(imgData, 0, 0);
    }
  }



}


const checkTerrain = (x, y) => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');

  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let p = findId({x: Math.floor(x), y: Math.floor(y)}, canvas.width);
  return (imgData.data[p.green] > 0)
}

function test(center, radius, position) {
  let offset = {
    x: center.x - position.x,
    y: center.y - position.y
  };

  let d = Math.sqrt(offset.x^2 + offset.y^2);

  return d <= radius;
}

const settleTerrain = () => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      let p = findId({x,y}, canvas.width)
      let ps = [
        findId({x,y: y + 1}, canvas.width),
        findId({x: x - 1,y: y}, canvas.width),
        findId({x: x + 1,y: y}, canvas.width),
      ]

      let failed = false;

      ps.forEach(e => {
        if (typeof imgData.data[e.alpha] === 'undefined') failed = true;
        if (imgData.data[e.alpha] > 0) failed = true;
      })

      if (failed) continue;

      imgData.data[p.alpha] = 0
    }
  }
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.putImageData(imgData,0,0)
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

const Main = (width, height) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext('2d');
  canvas.width = width
  canvas.height = height
  let state = {
    canvas, ctx
  }
  return Object.assign(state, canLoad(state), canRender(state))
}

export default Main();