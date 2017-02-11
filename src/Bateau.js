import React, { Component } from 'react';
import Case from './Case.js';

console.log('test');

function Bateau (props){
    var rects = [];
    for(var i=0; i< props.longueur; i++ ){
      if(props.orientation == "horizontale")
        rects[i] = <Case x={props.x+i} y={props.y} classe="selectionne"/>;
      else
        rects[i] = <Case x={props.x} y={props.y+i} classe="selectionne"/>;
    }
    return(
      <g>{rects}</g>
    );
}
export default Bateau;
