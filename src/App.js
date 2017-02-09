import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

import './App.css';

import Bateau from './Bateau';
import { TypeCase } from './Case';
import { RadarGrille, FlotteGrille } from './Grille';

import ConnectionForm from './ConnectionForm';


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
      bateauCourant: {x:5, y:5, orientation: "horizontale", longueur: 0},
      casesFlotte: [],
      casesRadar: [],
      joueurs : {
        me : {name:"", connected:false},
        opponent : {name:"", connected:false}
      }
    }
  }

  componentDidMount() {
    let casesFlotte=[], casesRadar=[];
    for(let i=0;i<10;i++) {
      casesFlotte[i]=[];
      casesRadar[i]=[];
      for(let j=0;j<10;j++) {
        casesFlotte[i][j] = { type: TypeCase.MER, tire:false };
        casesRadar[i][j] = { type: TypeCase.MER, tire:false };
      }
    }
    this.setState({casesFlotte:casesFlotte, casesRadar:casesRadar});

    let mask = (c) => c==32 || (c>=37 && c<=40);
    window.addEventListener('keydown', (e)=>{
      if(mask(e.which))
        e.preventDefault()
    });
    window.addEventListener('keyup', this.deplacements.bind(this));
  }

  afficherBateauCourant() {
    if(this.state.enPlacement) {
      return <Bateau {...this.state.bateauCourant} />
    }
  }

  selectionnerBateau(pion, id) {
    var bateauCourant = {x:5, y:5, orientation: "horizontale", longueur: pion };
    let pionsBateaux = this.state.pionsBateaux;

    pionsBateaux.splice(id, 1);

    this.setState({
        enPlacement : true,
        bateauCourant: bateauCourant,
        pionsBateaux:pionsBateaux
    });
  }
  
  boiteABateaux() {
    var self = this;
    
    return this.state.pionsBateaux.map(function(pion, index) {
        return (<div key={index} className={'bateau bateau-'+pion} onClick={()=>self.selectionnerBateau(pion,index)}></div>);
    })
  }

  deplacements(e) {
    var bateauCourant = this.state.bateauCourant;
    if(e.which == 37 && bateauCourant.x > 0) { 
      bateauCourant.x--; //gauche
    }
    else if(e.which == 38 && bateauCourant.y > 0 ) { 
      bateauCourant.y--; //haut
    }
    else if(e.which == 39){ 
      if(bateauCourant.x<10-(bateauCourant.orientation == 'horizontale'?bateauCourant.longueur:1))
        bateauCourant.x++; //droite
    }
    else if(e.which == 40) { //bas
      if(bateauCourant.y<10-(bateauCourant.orientation == 'verticale'?bateauCourant.longueur:1))
        bateauCourant.y++;
    }
    else if(e.which == 32) { //espace
      if(bateauCourant.orientation == 'horizontale'){
        bateauCourant.orientation = 'verticale';
        if(bateauCourant.y > 10 - bateauCourant.longueur)
          bateauCourant.y = (10 - bateauCourant.longueur);
      }
      else {
        bateauCourant.orientation = 'horizontale';
        if(bateauCourant.x > 10 - bateauCourant.longueur) {
          bateauCourant.x = (10 - bateauCourant.longueur);
        }
      }
    }
    else if(e.which == 13) { // PRESS ENTER
      let casesFlotte = this.state.casesFlotte;
      let cur = bateauCourant;

      for(let i=0;i<cur.longueur;i++) {
        let x = (cur.orientation === 'horizontale') ? cur.x+i : cur.x;
        let y = (cur.orientation === 'verticale') ? cur.y+i : cur.y;

        casesFlotte[x][y].type = TypeCase.BATEAU;
      }
      if(this.state.pionsBateaux.length == 0)
        this.props.socket.emit('finish to set', this.state.casesFlotte);

      this.setState({enPlacement : false, casesFlotte:casesFlotte})
    }
    
    // On actualise la position du bateau dans le  state
    this.setState({bateauCourant:bateauCourant});
  }

  radarClic = (caseX,caseY) => {
    console.log('radarClic');
    let casesRadar = this.state.casesRadar;
    casesRadar[caseX][caseY].tire = true;

    this.setState({casesRadar:casesRadar})
    console.log(this.state.casesRadar);
  }

  render() {
    return (
      <div className="App">
        
        <ConnectionForm />
        <div className="bateaux">
          {this.boiteABateaux()}
        </div>
        <FlotteGrille cases={this.state.casesFlotte}>
          {this.afficherBateauCourant()}
        </FlotteGrille>
        <RadarGrille cases={this.state.casesRadar} caseClic={this.radarClic}>
        </RadarGrille >
      </div>
    );
  }
}

export default socketConnect(App);
