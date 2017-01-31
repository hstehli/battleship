import React, { Component } from 'react';
import Case from './Case.js'

function Grille(props) {
    var rects=[]
    for(var i=0;i<10;i++) {
        rects[i] = [];
        for(var j=0;j<10;j++) {
            rects[i][j] = <Case x={i} y={j} classe="caseMer" />;
        }
    }
    return (
        <svg className="grille" height="400" width="400">
        {rects}
        {props.children}
        </svg>
    );
}

export class RadarGrille extends Component {
  render() {
    return (<Grille {...this.props}/>);
  }
}

export class FlotteGrille extends Component {
  render() {
    return (<Grille {...this.props}/>);
  }
}
