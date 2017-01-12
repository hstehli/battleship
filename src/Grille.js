import React, { Component } from 'react';
import Case from './Case.js'

class Grille extends Component {
  constructor() {
    super();
  }
  render() {
    var rects=[]
    for(var i=0;i<10;i++) {
        rects[i] = [];
        for(var j=0;j<10;j++) {
            rects[i][j] = <Case x={i} y={j} />;
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

export default Grille;