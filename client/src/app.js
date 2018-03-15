
import Game from './game/main';

class Canvas extends React.Component {

  componentDidMount() {
    let canvas = document.getElementById('tutorial');
    let ctx = canvas.getContext('2d');
    let game = new Game(canvas, ctx);

  }

  render() {
    return (
      <div>
        <canvas
          id="tutorial"
          width="800"
          height="600"
          style={{
            backgroundColor: 'black',
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 'auto',
            marginRight: 'auto',
            display: 'block'
          }}
        />
      </div>
    )
  }
}

export default class App extends React.Component {

  render() {
    return (
      <div className="container">
        <div style={{paddingTop: "50px"}}>
          <Canvas />
        </div>
      </div>
    );
  }
}