import React, { Component } from 'react';
import { socketConnect } from 'socket.io-react';

class ConnectionForm extends Component {

    componentDidMount() {
        this.props.socket.on('start me',data=> {
            let me = this.props.me;
            me.connected = true;
            this.props.updatePlayer('me',me);
        });
        this.props.socket.on('start opponent', data=>{
            this.props.updatePlayer('opponent',{ name : data.name, connected : true });
        });
        this.props.socket.on('opponent disconnected', _=>{
            this.props.updatePlayer('opponent',{ name : "", connected : false });
        });
    }
    submit = (e) => {
        e.preventDefault();
        this.props.socket.emit('new player',this.props.me)
    }
    handleChange = (event) => {
        let me = this.props.me;
        me.name = event.target.value;
        this.props.updatePlayer('me',me);
    }
    textSection(text) {
        return <p>{text}</p>;
    }
    playerConnected(name) {
        return this.textSection(`${name} connecté`);
    }
    render() {
        let mySection;
        if(!this.props.me.connected) {
            mySection = 
            <div>
                <input type="text" placeholder="Nouveau joueur" onChange={this.handleChange} value={this.props.me.name}/>
                <button type="button" onClick={this.submit}>Jouer</button>
            </div>;
        }
        else {
            mySection = this.playerConnected(this.props.me.name);
        }

        let opponentSection;
        if(!this.props.opponent.connected) {
            opponentSection = this.textSection(`En attente de l'ennemi`);
        }
        else {
            opponentSection = this.playerConnected(this.props.opponent.name);
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