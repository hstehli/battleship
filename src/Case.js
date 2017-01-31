import React, { Component } from 'react';

function Case(props) {
    return (
        <rect width="40" height="40" x={40*props.x} y={40*props.y} className={props.classe} />
    );
}

export default Case;
