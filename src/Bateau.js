import React, { Component } from 'react';
import Case from './Case.js';

console.log('test');

function Bateau (props){
    var rects = [];
	// NOTATION: Tu peux enlever le *40, car la multiplication par 40 est déjà
	// faite par le composant case
    for(var i=0; i< props.longueur; i++ ){
        rects[i] = <Case x={props.x*40} y={props.y*40} />
    }
	// NOTATION: Ici, je pense qu'il suffirait de retourner <g>{rects}</g>
	// https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g correspond grosso
	// modo aux div en HTML
    return(
    );
}
export default Bateau;
