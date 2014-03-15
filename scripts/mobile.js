var socket = io.connect('http://localhost');

//para o servidor o tipo de cliente
socket.emit('newMobile');
var cor;
var status;
var id;

socket.on('setStatus', function (data) {
	cor = data.cor;
	status = data.status;
	id = data.id;
	setStatus();
	setCor();
	document.getElementById('textID').innerHTML = "Seu id: " + id;
});

socket.on('updateStatus', function (data) {
	status = data.status;
	setStatus();
});

function jogar () {
	socket.emit('ready', {id:id});
}

function setStatus(){
	switch(status){
		case "inGame":
			document.getElementById("inGame").style.display="block";
			document.getElementById("inQueue").style.display="none";
			document.getElementById("outGame").style.display="none";
			document.getElementById("button").style.display="none";
			break;
		case "inQueue":
			document.getElementById("inGame").style.display="none";
			document.getElementById("inQueue").style.display="block";
			document.getElementById("outGame").style.display="none";
			document.getElementById("button").style.display="block";
			break;
		case "outGame":
			document.getElementById("inGame").style.display="none";
			document.getElementById("inQueue").style.display="none";
			document.getElementById("outGame").style.display="block";
			break;
	}

}

function setCor(){
	var div = document.getElementById("cor");
	div.style.width = window.innerWidth;
	div.style.height = window.innerHeight;
	div.style.backgroundColor = cor;
}

