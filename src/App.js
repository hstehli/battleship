import React, { Component } from 'react';
import './App.css';


class Grille extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <canvas id="myCanvas" width="400" height="400">
      </canvas>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    var cases=[];
    for(var i=0;i<10;i++) {
      cases[i] = [];
      for(var j=0;j<10;j++)
        cases[i][j] = {};
    }
    this.state = {
      cases: cases
    }
  }
  afficherBateau() {
    /*if(bateauSelectionne) {
      return <Bateau />
    }*/
  }
  render() {
    return (
      <div className="App">
        <form>
          <div>
            <input type="text" placeholder="joueur 1"/>
            <button>Jouer</button>
          </div>
          <div>
            <input type="text" placeholder="joueur 2"/>
            <button>Jouer</button>
          </div>
        </form>
        <div className="bateaux">
        </div>
        <Grille type="radar"/>
        <Grille type="flotte"/>
        {this.afficherBateau()}
      </div>
    );
  }
}

export default App;
