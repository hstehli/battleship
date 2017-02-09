import React, {Component } from 'react';

export const TypeCase = {
   MER:0x0, BATEAU:0x1
}

const ClasseType = {
    [TypeCase.MER]:"caseMer",
    [TypeCase.BATEAU]:"caseBateau",
}

class Case extends Component {
    onClick = () => {
        if(typeof this.props.caseClic == 'function')
            this.props.caseClic(this.props.x,this.props.y);
    }
    rect() {
        let className = this.props.noBg ? "caseRadar" : ClasseType[this.props.type];
        return <rect width="40" height="40" x={40*this.props.x} y={40*this.props.y} className={className} onClick={this.onClick} />;
    }
    ellipse() {
        if(this.props.tire) {
            let className = (this.props.type == TypeCase.MER)? "pionRate" : "pionTouche";
            return <ellipse rx="10" ry="10" cx={40*this.props.x+20} cy={40*this.props.y+20} className={className}/>;
        }
    }
    render() {
        return (
        <g>
            {this.rect()}
            {this.ellipse()}
        </g>);
    }
}

export default Case;
