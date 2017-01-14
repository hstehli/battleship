import React, { Component } from 'react';

function Case(props) {
	// NOTATION: Je pense qu'il manque un fill="white" stroke="black"
	// NOTATION: (Chez moi, tout s'affiche en noir)
    return (
        <rect width="40" height="40" x={40*props.x} y={40*props.y} className={props.type} />
    );
}

export default Case;
