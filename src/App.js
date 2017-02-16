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

  boiteABateaux() {
    var self = this;

    return this.state.pionsBateaux.map(function(pion, index) {
        return (<div key={index} className={'bateau bateau-'+pion} onClick={()=>self.selectionnerBateau(pion,index)}></div>);
    })
  }

  deplacements(e) {
    var bateauCourant = this.state.bateauCourant;
    // gauche
    if(e.which === 37 && bateauCourant.x > 0) {
      bateauCourant.x--;
    }
    // haut
    else if(e.which === 38 && bateauCourant.y > 0 ) {
      bateauCourant.y--;
    }
    // droite
    else if(e.which === 39){
      if(bateauCourant.x<10-(bateauCourant.orientation === 'horizontale'?bateauCourant.longueur:1))
        bateauCourant.x++;
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
