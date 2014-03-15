var express = require('express')
    , app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server);

server.listen(80);

app.use(express.static(__dirname + '/'));

//path para os jogadores
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/player.html');
});

//path para o ecra publico
app.get('/jogo', function (req, res) {
  res.sendfile(__dirname + '/testeConnect.html');
});

function Player (socketId,id) {
  this.socketId = socketId;
  this.id = id;
  this.cor;
  this.status;
}
var id = 0;
var cores = ["#FFA500", "#FF00FF", "#00FF00", "#F4A460",
  "#0000CD", "#FFFF00", "#87CEFA", "#696969", "#4F4F4F",
  "#CFCFCF", "#FF0000", "#551A8B"];

var players = new Array();//array de todos os clientes mobile
var inGame = new Array();//array de clientes em jogo
var ecraID;//socketID do ecra publico


io.sockets.on('connection', function (socket) {

  
  //cliente mobile
  socket.on('newMobile', function (data) {
        var cor;
        var newPlayer = new Player(socket.id, id);
        if(players.length >= cores.length){//caso todas as cores forem distruibuidas o jogador fica fora do jogo
            newPlayer.cor = "#0F0F0F0";
            newPlayer.status = "outGame";
            socket.emit('setStatus', {cor:"#0F0F0F0", status:"outGame", id:id});
        }else{
            cor = getRandomCor();
            newPlayer.status = "inQueue";
            newPlayer.cor = cores[cor];
            if(ecraID)
                io.sockets.socket(ecraID).emit('newPlayer', {player:newPlayer});//envia para o ecra publico
            socket.emit('setStatus', {cor:cores[cor], status:"inQueue", id:id});//envia para o cliente mobile
        }    
        players.push(newPlayer);
        id++;
  });

  //cliente ecra publico
  socket.on('newEcra', function (data) {
        ecraID = socket.id;//guarda apenas o ultimo ecra publico
        socket.emit('updatePlayers', {players:players});//envia os jogadores para o ecra publico
  });

  socket.on('ready', function(data){//alterar o estado do cliente mobile
    if(inGame.length < 6){//6 -> Max de Jogadores InGame
        inGame.push(data.id);
        changePlayer(data.id, "inGame");
        io.sockets.socket(ecraID).emit('changeStatus', {id:data.id, status:"inGame"});
        socket.emit('updateStatus', {status:"inGame"});
    }
  });

  //disconnect de um cliente mobile/ecra
  socket.on('disconnect', function (data) {
  
    var auxID;
     for (var i = 0; i < players.length; i++) {
         if(players[i].socketId == socket.id){
            auxID = players[i].id;
            players.splice(i, 1);
         }
     };
     for (var i = 0; i < inGame.length; i++) {
         if(inGame[i] == auxID)
            inGame.splice(i, 1);
     };
     if(socket.id != ecraID)//se este cliente nao for o ecra publico elimina no ecra o cliente mobile
        io.sockets.socket(ecraID).emit('deletePlayer', {id:auxID});
     else
        ecraID = undefined;//se for o ecra publico altera o id para null
    
  });
});

function getRandomCor () {
    var cor = Math.floor(Math.random()*cores.length);
    
    while(existCor(cor)){
        cor = Math.floor(Math.random()*cores.length);
    }
    return cor;
}

function existCor(cor){
    for (var i = 0; i < players.length; i++) {
        if(players[i].cor == cores[cor])
            return true;
    }
    return false;
}

function changePlayer (id, status) {
    for (var i = 0; i < players.length; i++) {
        if(players[i].id == id){
            players[i].status = status;
        }
    };
}


