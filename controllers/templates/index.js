'use strict';
var fs = require('fs');
module.exports = (router)=>{

	router.get('/',(req,res)=>{
		res.render('code-dust/layout')
	});

	router.get('/templates/playground/:id',(req,res)=>{
		var playgroundID = req.params.id;
		fs.readFile(__dirname+'/../../models/playgrounds.json', 'utf8',function(err,data){
			var playGrounds = JSON.parse(data).playgrounds;
			console.log('lolwa',playGrounds,playgroundID);
			if(playGrounds && playGrounds.length){
				if(playGrounds.indexOf((playgroundID)) !== -1){
					res.render('code-dust/playground');
				}else{
					res.render('code-dust/error');
				}
			}else{
				res.render('code-dust/error');
			}
			
		})

	});

	router.get('/templates/landing',(req,res)=>{
		res.render('code-dust/landing');
	});

}