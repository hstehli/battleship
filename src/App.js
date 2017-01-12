import React, { Component } from 'react';
import './App.css';

import Grille from './Grille.js';

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
      cases: cases,
      bateau: {
        x:5, y:5, orientation: "horizontale"
      }
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
        <Grille type="flotte" {...this.state}>
          {this.afficherBateau()}
        </Grille>
        <Grille type="radar"/>
      </div>
    );
  }
}

export default App;
