import React, { Component } from 'react';
import Case from './Case.js';

console.log('test'); 

function Bateau (props){
    var rects = [];
    for(var i=0; i< props.longueur; i++ ){
        rects[i] = <Case x={props.x*40} y={props.y*40} />
    }
    return(  
    );
}
export default Bateau;