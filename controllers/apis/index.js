'use strict';
var fs = require('fs');
var appRootPath = require('app-root-path');
module.exports = (router)=>{

	router.post('/api/playground/create',function(req,res){
		var hashedGround = req.body.hashedGround;

		fs.readFile(__dirname+'/../../models/playgrounds.json', 'utf8',function(err,data){
			var playGrounds = JSON.parse(data);
			playGrounds.playgrounds.push(hashedGround);
			
			fs.writeFile(__dirname+'/../../models/playgrounds.json', JSON.stringify(playGrounds), 'utf8', function(err,resp){
				res.json({
					success : 1
				})
			});
			
		})
	})

	router.get('/audio/list',function(req,res){
		fs.readdir(appRootPath+'/recordings',function(err,files){
			if(err) {
				return res.json({
					success : 0,
					error : 1,
					message : err
				})
			}
			return res.json({
				success : 1,
				files
			})
		})

	});

	router.get('/audio',function(req,res){
		res.sendFile(appRootPath+'/recordings/test.wav');
	})
}