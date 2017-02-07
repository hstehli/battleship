import React, { Component } from 'react';
import './App.css';
import Bateau from './Bateau.js';
import Tir from './Tire.js';

import { TypeCase } from './Case.js';

import { RadarGrille, FlotteGrille } from './Grille.js';


class App extends Component {
  constructor() {
    super();
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
      enPlacement: false,
      pionsBateaux: [5,4,3,3,2,2], // n = longueur bateau
      bateauCourant: null,
      casesFlotte: [],
      casesRadar: []
    }
    //// test
    
    /// 
  }

  afficherBateauCourant() {
    if(this.state.enPlacement) {
      return <Bateau {...this.state.bateauCourant} />
    }
  }
  
  tirer() {
    //ajoute tire
  }
    selectionnerBateau(pion, id){
      var bateauCourant = {x:5, y:5, orientation: "horizontale", longueur: pion, pionId:id };
        this.setState({
            enPlacement : true,
            bateauCourant: bateauCourant
        });
    }
  
    boiteABateaux() {
      var self = this;
      return this.state.pionsBateaux.map(function(pion, index) {
          return (<div key={index} className={'bateau bateau-'+pion} onClick={()=>self.selectionnerBateau(pion,index)}>  <span>x0</span> </div>);
      })
    }
    
    
    componentDidMount() {
      let casesFlotte=[], casesRadar=[];
    for(let i=0;i<10;i++) {
      casesFlotte[i]=[];
      casesRadar[i]=[];
      for(let j=0;j<10;j++) {
        casesFlotte[i][j] = { type: TypeCase.MER };
        casesRadar[i][j] = { type: TypeCase.MER };
      }
    }
    this.setState({casesFlotte:casesFlotte, casesRadar:casesRadar});
        document.addEventListener('keyup', this.deplacements.bind(this))
    }

    deplacements(e) {
      var bateauCourant = this.state.bateauCourant;
        if(e.which == 37 && bateauCourant.x > 0) { 
             bateauCourant.x--; //gauche
        }
        if(e.which == 38 && bateauCourant.y > 0 ) { 
             bateauCourant.y--; //haut
        }
        if(e.which == 39){ 
            if(bateauCourant.x<10-(bateauCourant.orientation == 'horizontale'?bateauCourant.longueur:1))
             bateauCourant.x++; //droite
        }
        if(e.which == 40) { //bas
          if(bateauCourant.y<10-(bateauCourant.orientation == 'verticale'?bateauCourant.longueur:1))
             bateauCourant.y++;
        }
        if(e.which == 32) { //espace
             if(bateauCourant.orientation == 'horizontale'){
               bateauCourant.orientation = 'verticale';
               if(bateauCourant.y > 10 - bateauCourant.longueur)
                 bateauCourant.y = (10 - bateauCourant.longueur);
             }
          else
            bateauCourant.orientation = 'horizontale';
            if(bateauCourant.x > 10 - bateauCourant.longueur)
                 bateauCourant.x = (10 - bateauCourant.longueur);
        }
        /*-- ici ---*/
        this.setState({bateauCourant : bateauCourant})
        
        if(e.which == 13) {
          let pionsBateaux = this.state.pionsBateaux;
          pionsBateaux.splice(bateauCourant.pionId, 1);

          let casesFlotte = this.state.casesFlotte;
          for(let i=0;i<bateauCourant.longueur;i++) {
            if(bateauCourant.orientation === 'horizontale')
              casesFlotte[bateauCourant.x+i][bateauCourant.y] = {type:TypeCase.BATEAU};
            else
              casesFlotte[bateauCourant.x][bateauCourant.y+i] = {type:TypeCase.BATEAU};
          }

          this.setState({enPlacement : false, casesFlotte:casesFlotte, pionsBateaux:pionsBateaux})
        }
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
          {this.boiteABateaux()}
        </div>
        {/* NOTATION: Je pense qu'il serait plus pertinent de créer deux composants :
        le premier FlotteGrille, et le deuxième RadarGrille, et que chacun des deux rende une Grille avec certaines données, mais comme ca chacun a une logique séparée (sur l'un, on place les bateaux, alors que sur l'autre on tire.*/}
        <FlotteGrille cases={this.state.casesFlotte}>
                {this.afficherBateauCourant()}
        </FlotteGrille>
        <RadarGrille cases={this.state.casesRadar}>
        </RadarGrille >
      </div>
    );
  }
}

export default App;
