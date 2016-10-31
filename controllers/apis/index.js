'use strict';
var fs = require('fs');
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
}