/**
 * Created by Zenairo on 12/11/2015.
 */
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var world = require('./js/server_world');
var THREE = require('three');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.use('/images', require('express').static(__dirname + "/images"));
app.use('/models', require('express').static(__dirname + "/models"));
app.use('/js', require('express').static(__dirname + "/js"));

io.on('connection', function(socket){
    console.log("User connected.");
    var id = socket.id;

    world.addPlayer(id);

    var player = world.playerForId(id);

    console.log(player.color + " set.");
    console.log("Connected: " + world.players.length);

    socket.emit('setPlayerColor', player.color);
    socket.emit('setTurn', world.getTurn());

    if(world.getBoards() == -1 && player.color == 'White')
        socket.emit('askBoardLevel', world.getBoards());
    else if (world.getBoards() != -1)
        socket.emit('giveClientBoardLevel', world.getBoards());

    socket.on('giveServerBoardLevel', function(boards){
        world.setBoards(boards);
        world.newGame();
        io.emit('setTurn', world.getTurn());
        io.emit('giveClientBoardLevel', world.getBoards());
    });

    socket.on('requestPieceLocations', function(){
        for(var i = 0; i < world.ServerPieceLocations.length; i++){
            socket.emit('placePiece', world.ServerPieceLocations[i]);
        }
    });

    socket.on('requestOrigin', function(piece){
        socket.emit('giveOrigin', world.pieceOriginByIndex(piece));
    });

    socket.on('requestMoves', function(){
        io.emit('giveMoves', world.getMoveList());
    });

    socket.on('updateModelPosition', function(piece){
        socket.broadcast.emit('updateModelPosition', piece);
    });

    socket.on('commitMove', function(piece){
        var removeMe = world.movePiece(piece);
        if(removeMe)
            io.emit('removePiece', removeMe);
        io.emit('setTurn', world.getTurn());
    });

    socket.on('clearMoveTiles', function(){
        io.emit('clearMoveTiles');
    });

    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });

    socket.on('disconnect', function(){
        console.log("User disconnected.");
        io.emit('removeOtherPlayer', player);
        world.removePlayer( player );
        console.log("Connected: " + world.players.length);
    });

});

var port = process.env.OPENSHIFT_NODEJS_PORT || 4545;
var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

http.listen(port, ip_address, function(){
    console.log( "Listening on " + ip_address + ", server_port " + port );
});