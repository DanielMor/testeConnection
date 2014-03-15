var canvas = document.getElementById('myCanvas');

var c = canvas.getContext('2d');

var players = new Array();



function draw(){
	c.clearRect(0,0,canvas.width, canvas.height);
	c.fillStyle = "#FFFAFA";
	c.fillRect(0,0,canvas.width, canvas.height);
	drawText();
	drawPlayers();
	
	c.strokeRect(0,0,canvas.width, canvas.height);
	requestAnimFrame(draw);
}

function drawPlayers(){
	if(players.length > 0){
		var pInGame = 0;
		var pInQueue = 0;
		for(var i = 0; i < players.length;i++){
			c.fillStyle=players[i].cor;
			if(players[i].status == "inGame"){	
				c.fillRect(canvas.width/4 + pInGame*30,canvas.height*0.5 + 5,25,25);
				pInGame++;
			}
			if(players[i].status == "inQueue"){
				c.fillRect(canvas.width/4 + pInQueue*30, canvas.height*0.7 + 5,25,25);
				pInQueue++;
			}	
		}
	}
}

function drawText () {
	c.fillStyle = "#000000";
	
	c.fillText("Jogadores em Jogo", canvas.width*0.45, canvas.height*0.5);
	c.fillText("Jogadores em Espera", canvas.width*0.45, canvas.height*0.7);
}

//eventos socket
var socket = io.connect('http://localhost');

//para o servidor o tipo de cliente
socket.emit('newEcra');

//recebe o array de todos os jogadores
socket.on('updatePlayers', function (data) {
    players = data.players;
});

//recebe um novo jogador
socket.on('newPlayer', function (data) {
	console.log("novo player : "+data.player.id);
	players.push(data.player);
});

//actualiza o estado de jogador
socket.on('changeStatus', function (data) {
	   for (var i = 0; i < players.length; i++) {
	   		if(players[i].id == data.id){
	   			players[i].status = data.status;
	   		}
	   };
});

//elemina um jogador do array
socket.on('deletePlayer', function (data) {
	console.log("delete "+data.id);
	for (var i = 0; i < players.length; i++) {
		if(players[i].id == data.id){
			players.splice(i,1);
		}
	};
	
});

draw();