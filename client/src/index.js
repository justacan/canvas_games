import './style.css';
import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import SpaceShooterGame from './game/main'
import CannonGame from './cannon';



class SpaceShooter extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('fg');
    const ctx = canvas.getContext('2d');
    new SpaceShooterGame(canvas, ctx);

  }
  render() {
    return (
      <div>
        <canvas width={1024} height={768} id='fg' style={{background: 'black'}}></canvas>
      </div>
    )
  }
}

class Cannon extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('fg');
    const ctx = canvas.getContext('2d');
    CannonGame(canvas, ctx).load();
  }
  render() {
    return (
      <div>
          <canvas width={1440} height={900} id='fg'
            style={{position: 'absolute',left: 0,top: 0,zIndex: 1}}/>
          <canvas width={1440} height={900} id='bg'
            style={{position: 'absolute',left: 0,top: 0,zIndex: 0}}/>
        </div>
    )
  }
}

class Test extends React.Component {
  componentDidMount() {
    const canvas = document.getElementById('bg');
    const ctx = canvas.getContext('2d');
    const context = ctx;
    // const width = 512;
    // const height = 200;

    // canvas.width = 1300;
    // canvas.height = 500;

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
      context.beginPath();
      context.moveTo(x, HEIGHT_MAX);
      context.lineTo(x, height);
      ctx.strokeStyle = "green"
      context.stroke();
    }

  }

  render() {
    return (
      <div>
        <canvas width={1024} height={768} id='bg' style={{background: 'white'}}></canvas>
      </div>
    )
  }
}


const Routes = () => (
  <BrowserRouter>
    <div>
      <Route path='/' exact component={SpaceShooter}/>
      <Route path='/cannon' exact component={Cannon}/>
      <Route path='/test' exact component={Test}/>
    </div>
  </BrowserRouter>
)


class App extends React.Component {
  constructor() {
    super()
  }
  render() {
    return (
      <Routes/>
    )

  }
}

ReactDOM.render(<App />, document.getElementById('app'))