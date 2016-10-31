'use strict';
var socketIO = require('socket.io');
var fs =require('fs');
// var playGroundContent = {};
var playGroundContent = JSON.parse(fs.readFileSync(__dirname+'/../../models/playgrounddata.json', 'utf8'));
var players = {};
// var backupTimeInvertal = 1000 * 30;

// setInterval(function(){
// 	fs.writeFile(__dirname+'/../../models/playgrounddata.json', JSON.stringify(playGroundContent), 'utf8', function(err,res){
// 	});
// },backupTimeInvertal);

module.exports = (router,server)=>{

	var io = socketIO(server);

	io.on('connection',(socket)=>{
		


		socket.on('codeDusting',(data)=>{
			playGroundContent[data.hash] = {
				code : data.code,
				options : data.options
			}
			fs.writeFile(__dirname+'/../../models/playgrounddata.json', JSON.stringify(playGroundContent), 'utf8', function(err,res){
				delete playGroundContent[data.hash];
				socket.broadcast.emit('dustedCode_'+data.hash,data);
			});
			
		});


		if(players[socket.request._query['playground']] === undefined) {
			players[socket.request._query['playground']] = [socket];
		}else{
			if(players[socket.request._query['playground']].indexOf(socket) === -1){
				players[socket.request._query['playground']].push(socket);
			}
		}

		fs.readFile(__dirname+'/../../models/playgrounddata.json', 'utf8',function(err,data){
			playGroundContent = JSON.parse(data);
			if(playGroundContent[socket.request._query['playground']] !== undefined){
				socket.emit('onTheGround_'+socket.request._query['playground'],playGroundContent[socket.request._query['playground']]);
			}

			
		})
		

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