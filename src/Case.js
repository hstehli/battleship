import React from 'react';

export const TypeCase = {
   MER:0x0, BATEAU:0x1, TIRE:0x2
}

const ClasseType = {
    [TypeCase.MER]:"caseMer",
    [TypeCase.BATEAU]:"caseBateau",
}

function Case(props) {
    let draw = () => {
        let className = props.noBg ? "caseRadar" : ClasseType[props.type];
        let rect = <rect width="40" height="40" x={40*props.x} y={40*props.y} className={className} />;
        let ellipse = () => {
            if(props.type & TypeCase.TIRE) {
                let className = this.props.type & TypeCase.MER? "pionRate" : "pionTouche";
                return <ellipse rx="20" ry="20" cx={40*props.x+20} cy={40*props.x+20} className={className}/>;
            }
        }
        return (
            <g>
                {rect}
                {ellipse()}
            </g>
        );
    }
    return (
        <g>
         {draw()}
        </g>
    );
}

export default Case;
