import React, { Component } from 'react';
import Case from './Case.js'


class Grille extends Component {

  render() {
    var rects=[];
    //console.log(props);
    for(var i=0;i<this.props.cases.length;i++) {
        rects[i] = [];
        for(var j=0;j<this.props.cases[i].length;j++) {
            rects[i][j] = <Case x={i} y={j} {...this.props.cases[i][j]} {...this.props} />;
        }
    }
    return (
        <svg className="grille" height="400" width="400">
        {rects}
        {this.props.children}
        </svg>
    );
  }
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


