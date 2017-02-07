import React, { Component } from 'react';
import Case from './Case.js'
import App from './App.js'


function Grille(props) {
    var rects=[];

    for(var i=0;i<props.cases.length;i++) {
        rects[i] = [];
        for(var j=0;j<props.cases[i].length;j++) {
            rects[i][j] = <Case x={i} y={j} {...props.cases[i][j]} noBg={props.noBg} />;
        }
    }
    return (
        <svg className="grille" height="400" width="400">
        {rects}
        {props.children}
        </svg>
    );
}

export class FlotteGrille extends Component {
  render() {
    return (<Grille {...this.props} noBg={false} />);
  }
}

export class RadarGrille extends Component {
  render() {
    return (<Grille {...this.props} noBg={true}/>);
  }
}


