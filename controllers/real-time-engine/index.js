'use strict';
var socketIO = require('socket.io');

var playGroundContent = {};


module.exports = (router,server)=>{

	var io = socketIO(server);

	io.on('connection',(socket)=>{
		


		socket.on('codeDusting',(data)=>{

			playGroundContent[data.hash] = data.code;
			
			socket.broadcast.emit('dustedCode_'+data.hash,data);
		});

		if(playGroundContent[socket.request._query['playground']] !== undefined){
			socket.emit('onTheGround_'+socket.request._query['playground'],playGroundContent[socket.request._query['playground']])
		}

		
	})

}