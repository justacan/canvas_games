import React, { Component } from 'react';
import './bootstrap/css/bootstrap.min.css'



class Canvas extends Component {

  componentDidMount() {
    const canvas = document.getElementById('main_canvas');
    const ctx = canvas.getContext('2d');

    new Game(canvas, ctx)
  }

  render() {
    return (
      <canvas
        id="main_canvas"
        style={{backgroundColor: "black"}}
        width="200"
        height="200" />
    )
  }
}


class App extends Component {
  render() {
    return (
      {/*<div className="App">*/}
        {/*<div className="container-fluid">*/}
          {/*<div className="row">*/}
            {/*<div className="col-sm-12">*/}
              {/*<Canvas/>*/}
            {/*</div>*/}
          {/*</div>*/}
        {/*</div>*/}
      // </div>
    );
  }
}

export default App;
