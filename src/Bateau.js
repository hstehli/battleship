import React, { Component } from 'react';
import Case from './Case.js';

console.log('test');

function Bateau (props){
    var rects = [];
	// NOTATION: Tu peux enlever le *40, car la multiplication par 40 est déjà
	// faite par le composant case
    for(var i=0; i< props.longueur; i++ ){
      if(props.orientation === "horizontale")
        rects[i] = <Case x={props.x+i} y={props.y} classe="selectionne"/>;
      else
        rects[i] = <Case x={props.x} y={props.y+i} classe="selectionne"/>;
    }
	// NOTATION: Ici, je pense qu'il suffirait de retourner <g>{rects}</g>
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g correspond grosso
	// modo aux div en HTML
    return(
      <g>{rects}</g>
    );
}
export default Bateau;
