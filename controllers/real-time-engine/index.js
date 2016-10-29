'use strict';
var socketIO = require('socket.io');

module.exports = (router,server)=>{

	var io = socketIO(server);

	io.on('connection',(socket)=>{
		

		socket.on('codeDusting',(data)=>{
			
			socket.broadcast.emit('dustedCode',data);
		})
	})

}