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

  checkInput(thing) {

    let {pressedKeys} = this;

    if (pressedKeys['FIRE']) {
      thing.fire();
    } else {
      thing.fireReset();
    }

    if (pressedKeys[ 'RIGHT' ]) {
      thing.changeAngle(-1)
    } else if (pressedKeys['LEFT']) {
      thing.changeAngle(1)
    }
    if (pressedKeys[ 'UP' ]) {
      thing.changePower(1);
    } else if (pressedKeys['DOWN']) {
      thing.changePower(-1);
    }

  }

}