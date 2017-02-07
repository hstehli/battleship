var socketData = {};

var lastId = 0;
io.on('connection', function(socket) {
    if(lastId==2) {
        socket.emit('full');
        return;
    }
    
    socketData[socket.id] = {
        setup:false,
        id:lastId
    };
    let playerData = socketData[socket.id];
    lastId++;

    socket.on('finish to set',function(data) {
        playerData.setup = true;
        playerData.set = data.set;
        socket.broadcast.emit('finished to set');
    });

    socket.on('launch missile',function(missile) {
        let finished = (function() {
            for(var i=0;i<data.set.length;i++) 
                for(var j=0;j<data.set.length;j++) 
                    if((data.set[i][j] & flag.BATEAU) && !(data.set[i][j] & flag.TOUCHE)) 
                        return false;
            return true;
        })();
        
        if(finished) {
            socket.broadcast.emit('receive missile',{
                x:missile.x, y:missile.y
            });
        }
        else {
            socket.emit('winner');
            socket.broadcast.emit('looser');
        }
    });
});

