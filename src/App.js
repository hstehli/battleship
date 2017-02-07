import React, { Component } from 'react';
import './App.css';
import Bateau from './Bateau.js';
import Tir from './Tire.js';

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
      pionsBateaux: [{longueur: 5, quantite: 1},
                      {longueur: 4, quantite: 1},
                     {longueur: 3, quantite: 2},
                     {longueur: 2, quantite: 2}
                    ],
      bateauCourant: null,
      pionCourant : null,
      bateauPlaces: [],
      tirs: [{x:5, y:2, type:null}] /* type: touché, coulé, raté*/
    }
  }
  afficherBateauCourant() {
    if(this.state.bateauPlace) {
      return <Bateau {...this.state.bateauCourant} />
    }
  }
  
  afficherBateauPlaces() {
    var bateaux = [];
    for(var i=0; i< this.state.bateauPlaces.length; i++ ){
        bateaux[i] = <Bateau {...this.state.bateauPlaces[i]}/>;
    }
    return(
      <g>{bateaux}</g>
    );
  }
  
  afficherTirs() {
    var tirs = [];
    for(var i=0; i< this.state.tirs.length; i++ ){
        tirs[i] = <Tir {...this.state.tirs[i]}/>;
    }
    return(
      <g>{tirs}</g>
    )
  
  }
  
  tirer() {
    //ajoute tire
  }

    selectionnerBateau(pion){
      
      var bateauCourant = {x:5, y:5, orientation: "horizontale", longueur: pion.longueur};
        this.setState({
            bateauPlace : true,
            bateauCourant: bateauCourant,
            pionCourant: pion
        });
    }
  
    boiteABateaux() {
      var self = this;
      return this.state.pionsBateaux.map(function(pion, index) {
        if( pion.quantite === 0)
          return null;
        else
          return (<div key={index} className={'bateau bateau-'+pion.longueur} onClick={()=>self.selectionnerBateau(pion)}>  <span>x{pion.quantite}</span> </div>);
      })
    }
    
    
    componentDidMount() {
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
        
        if(e.which == 13){ //placement ok
          console.log('bateau placé');
          this.setState({bateauPlace : false})
          console.log(this.state.bateauPlaces);
          
          var bateauPlaces = this.state.bateauPlaces;
          bateauPlaces.push(bateauCourant);
          const pion = this.state.pionCourant;
          this.setState({ bateauPlaces: bateauPlaces });
          
          if(pion.quantite > 0)
            pion.quantite--;
          this.setState({ pionCourant : pion });
          
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
        <FlotteGrille {...this.state}>
                {this.afficherBateauCourant()}
                {this.afficherBateauPlaces()}
        </FlotteGrille>
        <RadarGrille {...this.state}>
          {this.afficherTirs()}
        </RadarGrille >
      </div>
    );
  }
}

export default App;
