import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

class ConnectionForm extends Component {
    constructor(props) {
        super(props);

        this.state= {
            me : {name:"", connected:false},
            opponent : {name:"", connected:false}
        }
        //this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        this.props.socket.on('start me',data=> {
            let me = this.state.me;
            me.connected = true;
            this.setState({me:me});
        });
        this.props.socket.on('start opponent', data=>{
            this.setState({opponent: { name : data.name, connected : true }});
        });
        this.props.socket.on('opponent disconnected', _=>{
            this.setState({opponent:{ name: "", connected: false}});
        });
    }
    submit = (e) => {
        e.preventDefault();
        this.props.socket.emit('new player',{
            name: this.state.me.name
        })
    }
    handleChange = (event) => {
        let me = this.state.me;
        me.name = event.target.value;
        this.setState({me:me});
    }
    textSection(text) {
        return <p>{text}</p>;
    }
    playerConnected(name) {
        return this.textSection(`${name} connecté`);
    }
    render() {
        let mySection;
        if(!this.state.me.connected) {
            mySection = 
            <div>
                <input type="text" placeholder="Nouveau joueur" onChange={this.handleChange} value={this.state.me.name}/>
                <button type="button" onClick={this.submit}>Jouer</button>
            </div>;
        }
        else {
            mySection = this.playerConnected(this.state.me.name);
        }

        let opponentSection;
        if(!this.state.opponent.connected) {
            opponentSection = this.textSection(`En attente de l'ennemi`);
        }
        else {
            opponentSection = this.playerConnected(this.state.opponent.name);
        }
        return (
            <div>
                <form onSubmit={this.submit}>
                    {mySection}
                </form>
                {opponentSection}
            </div>
        );
    }
}

export default socketConnect(ConnectionForm);