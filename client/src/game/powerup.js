

const drawBall = (state) => {
  return {
    drawBall: () => {
      let {ctx, ballRadius, x, y} = state;
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "purple";
      ctx.fill();
      ctx.fillStyle = "red";
      ctx.font = "15px Arial";
      ctx.fillText("P",x - ballRadius * .3,y + ballRadius * .4);
      ctx.closePath();
      state.hitbox = {
        x: x - ballRadius,
        y: y - ballRadius,
        width: ballRadius * 2,
        height: ballRadius * 2
      }
      // ctx.beginPath();
      // ctx.rect(x - ballRadius, y - ballRadius, ballRadius * 2, ballRadius * 2);
      // ctx.strokeStyle = "red";
      // ctx.stroke();
      // ctx.closePath();
    }
  }

}

const render = (state) => {

  return {
    render: () => {
      let {drawBall, x, y, dx, dy, canvas, ballRadius} = state;

      drawBall();

      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        state.dx = -dx;
      }
      if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        state.dy = -dy;
      }

      state.x += dx;
      state.y += dy;
    }
  }
}


const PowerUp = (canvas, ctx) => {
  let x = canvas.width / 2;
  let y = canvas.height /2
  let ballRadius = 15
  let state = {
    canvas, ctx,
    x: x,
    y: y,
    dx: -2, dy: -2,
    ballRadius: ballRadius,
    hitbox: {
      x: x - ballRadius,
      y: y - ballRadius,
      width: ballRadius * 2,
      height: ballRadius * 2
    }
  }
  return Object.assign(state,drawBall(state), render(state))
}

export default PowerUp;