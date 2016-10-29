'use strict';
module.exports = (router)=>{

	router.get('/',(req,res)=>{
		res.render('code-dust/layout')
	});

	router.get('/templates/playground',(req,res)=>{
		res.render('code-dust/playground');
	});

	router.get('/templates/landing',(req,res)=>{
		res.render('code-dust/landing');
	});
}