import React, { Component } from 'react';
import './App.css';

import { RadarGrille, FlotteGrille } from './Grille.js';


class App extends Component {
  constructor() {
    super();

    var cases=[];
    for(var i=0;i<10;i++) {
      cases[i] = [];
      for(var j=0;j<10;j++)
        cases[i][j] = {};
    }
	// NOTATION: Je pense que par ici, il faudrait rajouter un état de jeu :
	// NOTATION: par exemple,
	// NOTATION: phase: "position-ships" || "player-me" || "player-opponent" || "finished"
	// NOTATION: Je pense qu'il faudra aussi stocker tous les coups joués, par exemple :
	// plays: {
	//	  me: [{x: 3, y:1, result: "miss"}, {x: 2, y:3, result: "hit"}],
	//	  opponent: [{x: 6, y:2, result: "miss"}, {x: 4, y:7, result: "miss"}],
	// }
	// Et ce serait seulement ces données qui transiteraient sur le réseau.
	// De manière générale, avant de coder, je vous conseille de vous mettre d'accord
	// sur l'ensemble des données de votre modèle, comme ca vous pouvez chacun travailler
	// sur une partie des fonctionnalités sans trop vous marcher sur les pieds.
    this.state = {
      cases: cases,
      bateauPlace: false,
      bateauCourant: {
        x:5, y:5, orientation: "horizontale"
      }
    }
  }
  afficherBateau() {
    /*if(bateauPlace) {
      return <Bateau />
    }*/
  }
  // selectionner bateau(param) { setState({bateauCourant{x:5,y:5,longueur:param,orientation:"horizontale"})
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
        {/* Afficher une div par bateau, avec style associé + onclick=selectionnerBateaux(2) */}
          
        </div>
        {/* NOTATION: Je pense qu'il serait plus pertinent de créer deux composants :
        le premier FlotteGrille, et le deuxième RadarGrille, et que chacun des deux rende une Grille avec certaines données, mais comme ca chacun a une logique séparée (sur l'un, on place les bateaux, alors que sur l'autre on tire.*/}
        <FlotteGrille {...this.state}>
          {this.afficherBateau()}
        </FlotteGrille>
        <RadarGrille {...this.state}/>
      </div>
    );
  }
}

export default App;
