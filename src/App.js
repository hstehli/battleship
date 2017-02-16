import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

import './App.css';

import Bateau from './Bateau';
import { TypeCase } from './Case';
import { RadarGrille, FlotteGrille } from './Grille';

// NOTATION: C'est pas mal, tout ce que vous avez réussi à faire finalement !
// Attention cependant à ESLINT (vous avez 16 warnings quand on lance npm start)
import ConnectionForm from './ConnectionForm';

// NOTATION: Quand je joue, si j'arrive à toucher le bateau de l'ennemi, le jeu est bloqué
// De ce que j'ai remarqué le problème est que this.state.phase est bloqué à "pending" dans ce cas
// BUG#1

// NOTATION: C'est un peu dommage qu'il y ait autant de code dans App, ca en devient assez dur à suivre.
// Je pense que vous manquez de sous-composants
class App extends Component {
  constructor() {
    super();
    this.state = {
      enPlacement: false,
      pionsBateaux: [5,4,3,3,2,2], // n = longueur bateau
      bateauCourant: null,
      casesFlotte: [],
      casesRadar: [],
      joueurs : {
        me : {name:"", connected:false},
        opponent : {name:"", connected:false}
      },
      phase : "",
      message : "Choisissez un nom et jouez"
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

    let mask = (c) => c===32 || (c>=37 && c<=40);
    window.addEventListener('keydown', (e)=>{
      if(mask(e.which))
        e.preventDefault()
    });
    window.addEventListener('keyup', this.deplacements.bind(this));

    this.props.socket.on('new phase', phase => {
      console.log(`Nouvelle phase : ${phase}`);
      switch(phase) {
        case 'position-ships': this.setState({message:'Positionnez vos bateaux'}); break;
        case 'player-me': this.setState({message:'A vous!'}); break;
        case 'player-opponent': this.setState({message:"L'ennemi va tirer !"}); break;
        case 'finished': this.setState({message:"C'est fini"}); break;
      }
      this.setState({phase:phase});
    });

    this.props.socket.on('missile result', data => {
      console.log('MISSILE RESULTS', data);
      let casesRadar = this.state.casesRadar;
      casesRadar[data.x][data.y] = {type:data.touche?TypeCase.BATEAU:TypeCase.MER, tire:true};
      this.setState({casesRadar:casesRadar});
    });

    this.props.socket.on('receive missile', data => {
      let casesFlotte = this.state.casesFlotte;
      casesFlotte[data.x][data.y].tire = true;
      this.setState({casesFlotte:casesFlotte});
    });

    this.props.socket.on('winner', _ => {alert('vous avez gagné !')});
    this.props.socket.on('looser', _ => {alert('vous avez perdu !')});
  }

  afficherBateauCourant() {
    if(this.state.enPlacement) {
      return <Bateau {...this.state.bateauCourant} />
    }
  }

  selectionnerBateau(pion, id) {
    if(!this.state.players.me.connected)
      return;
    var bateauCourant = {x:5, y:5, orientation: "horizontale", longueur: pion, id: id };

    this.setState({
        enPlacement : true,
        bateauCourant: bateauCourant
    });
  }

<<<<<<< HEAD
=======
  // NOTATION: Boite a Bateaux pourrait être un composant séparé
>>>>>>> 6a4e7f8d01c24c10c89cf847112d6ae0e0e4ba5c
  boiteABateaux() {
    var self = this;

    return this.state.pionsBateaux.map(function(pion, index) {
        return (<div key={index} className={'bateau bateau-'+pion} onClick={()=>self.selectionnerBateau(pion,index)}></div>);
    })
  }

  deplacements(e) {
    var bateauCourant = this.state.bateauCourant;
// NOTATION: Je pense que des constantes
// KEY_LEFT = 37, KEY_UP = 38, auraient étaient plus simple sans avoir à mettre de commentaire
// Aussi, au lieu d'avoir un tas de else if, je préfère les return early
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
    // bas
    else if(e.which === 40) {
      if(bateauCourant.y<10-(bateauCourant.orientation === 'verticale'?bateauCourant.longueur:1))
        bateauCourant.y++;
    }
    // espace
    else if(e.which === 32) {
      if(bateauCourant.orientation === 'horizontale'){
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
    // enter
    else if(e.which === 13 && this.state.bateauCourant) {
      let casesFlotte = this.state.casesFlotte;
      let cur = bateauCourant;

      for(let i=0;i<cur.longueur;i++) {
        let x = (cur.orientation === 'horizontale') ? cur.x+i : cur.x;
        let y = (cur.orientation === 'verticale') ? cur.y+i : cur.y;

        casesFlotte[x][y].type = TypeCase.BATEAU;
      }
      let pionsBateaux = this.state.pionsBateaux;
      pionsBateaux.splice(bateauCourant.id, 1);
      if(pionsBateaux.length === 0) {
        this.props.socket.emit('finish to set', this.state.casesFlotte);
        this.setState({message: "En attente du placement de l'ennemi"});
      }

      this.setState({enPlacement : false, casesFlotte:casesFlotte, pionsBateaux:pionsBateaux})
    }

    // On actualise la position du bateau dans le  state
    this.setState({bateauCourant:bateauCourant});
  }

  radarClic = (caseX,caseY) => {
    if(this.state.phase === "player-me") {
      this.props.socket.emit('launch missile',{x:caseX, y:caseY});
      this.setState({phase:'pending'});
    }
  }

  render() {
    return (
      <div className="App">
        <ConnectionForm
        me={this.state.joueurs.me} opponent={this.state.joueurs.opponent}
        updatePlayer={(prop,player)=>{
          let players = this.state.joueurs;
          players[prop] = player;
          this.setState({players: players});
        }}/>
        <div className="bateaux">
          {this.boiteABateaux()}
        </div>
        <FlotteGrille cases={this.state.casesFlotte}>
          {this.afficherBateauCourant()}
        </FlotteGrille>
        <RadarGrille cases={this.state.casesRadar} caseClic={this.radarClic} >
        </RadarGrille >
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default socketConnect(App);
