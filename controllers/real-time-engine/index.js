'use strict';
var socketIO = require('socket.io');

var playGroundContent = {};
var players = {};


module.exports = (router,server)=>{

	var io = socketIO(server);

	io.set('transports', ['xhr-polling']);
	io.set('polling duration', 10);

	io.on('connection',(socket)=>{
		


		socket.on('codeDusting',(data)=>{

			playGroundContent[data.hash] = {
				code : data.code,
				options : data.options
			}
			
			socket.broadcast.emit('dustedCode_'+data.hash,data);
		});


		if(players[socket.request._query['playground']] === undefined) {
			players[socket.request._query['playground']] = [socket];
		}else{
			if(players[socket.request._query['playground']].indexOf(socket) === -1){
				players[socket.request._query['playground']].push(socket);
			}
		}

		if(playGroundContent[socket.request._query['playground']] !== undefined){
			socket.emit('onTheGround_'+socket.request._query['playground'],playGroundContent[socket.request._query['playground']])
		}


		var broadCastTotalPlayers = ()=>{
			io.emit('totalPlayers_'+socket.request._query['playground'],players[socket.request._query['playground']].length);
		}

		broadCastTotalPlayers();		

		socket.on('disconnect',()=>{
			if(players[socket.request._query['playground']].indexOf(socket) !== -1){
				players[socket.request._query['playground']].splice(players[socket.request._query['playground']].indexOf(socket,1));
				broadCastTotalPlayers();
			}
		});


		
	})

}