export default class InputHandler {
  constructor(game) {

    this.game = game;
    this.pressedKeys = {};


  }

  registerInput() {
    addEventListener( 'keydown',
        e => this.keyHandler(e.keyCode, true, e) );
    addEventListener( 'keyup',
        e => this.keyHandler(e.keyCode, false, e) );
  }

  keyHandler(keyCode, set, e) {

    const map = {
      37: "LEFT",
      38: "UP",
      39: "RIGHT",
      40: "DOWN",
      32: "FIRE"
    }

    if (!map[ keyCode ]) return false;
    e.preventDefault();

    const dir = map[ keyCode ];
    this.pressedKeys[ dir ] = set;
  }

  checkInput() {

    const { delta, ship, } = this.game;
    const { pressedKeys } = this;

    if (pressedKeys['FIRE']) {
        ship.fire();
    }

    if (pressedKeys[ 'RIGHT' ]) {
      ship.applyVelX(delta * ship.speed)
    } else if (pressedKeys['LEFT']) {
      ship.applyVelX(-(delta * ship.speed))
    }
    if (pressedKeys[ 'UP' ]) {
      ship.applyVelY(-(delta * ship.speed))
    } else if (pressedKeys['DOWN']) {
      ship.applyVelY(delta * ship.speed)
    }

  }

}