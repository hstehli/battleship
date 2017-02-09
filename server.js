var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3001,()=>{console.log('listen on port 3001')});

class Player {
    constructor(socket) {
        this.phase = "position-ships";
        this.socket = socket;
        this.name = "";
        //this.shipsGrid = [];
        this.shotsGrid = new Array(10);
        for(var i=0;i<10;i++)
            this.shotsGrid[i] = new Array(10);
        
    }
    changePhase(newPhase) {
        this.phase = newPhase;
        this.socket.emit('new phase', this.phase);
    }
}

var players = new Array(2);

var lastId=0;
io.on('connection', function(socket) {
    if(lastId==2) {
        socket.emit('full');
        return;
    }
    
    console.log(`Nouvelle connexion (id : ${lastId+1})`);

    var me, opponent = players[1-lastId];

    if(opponent) {
        socket.emit('start opponent', {name:opponent.name});
    }

    socket.on('new player', function(player) {
        players[lastId] = new Player(socket);
        me = players[lastId];
        me.name = player.name;

        console.log(
        `Nouveau joueur connecté:
        -> id = ${lastId+1}
        -> name = ${me.name}`);

        socket.emit('start me',{id:lastId});
        socket.broadcast.emit('start opponent', {name:me.name});
        lastId++;
    });

    socket.on('finish to set',function(grid) {
        me.shipsGrid = grid;
        if(players.every(p=>p.shipsGrid)) {
            players[0].changePhase('player-me');
            players[1].changePhase('player-opponent');
        }
        else
            opponent.socket.emit('finished to set');
    });

    socket.on('launch missile',function(missile) {
        me.shotsGrid[missile.x][missile.y] = true;
        let finished = (function() {
            for(var i=0;i<opponent.shipsGrid.length;i++)
                for(var j=0;j<opponent.shipsGrid[i].length;j++) 
                    if((opponent.shipsGrid[i][j].type == 1) && !(me.shotsGrid[i][j]))
                        return false;
            return true;
        })();
        
        if(!finished) {
            opponent.socket.emit('receive missile',{
                x:missile.x, y:missile.y
            });
        }
        else {
            me.socket.emit('winner');
            opponent.socket.emit('looser');
        }
    });

    socket.on('disconnect', function() {
        let pindex = players.findIndex(p => p && p.socket.id === socket.id);
        pindex<0 || delete players[pindex];
        console.log(players[pindex]);
        if(opponent) {
            opponent.socket.emit('opponent disconnected');
        }
        if(players[1]) {
            players.shift();
            players.push(null);
            lastId=1;
        }
    });
});

