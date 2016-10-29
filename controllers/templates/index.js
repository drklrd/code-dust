'use strict';
module.exports = (router)=>{

	router.get('/',(req,res)=>{
		res.render('code-dust/layout')
	})

	router.get('/templates/playground',(req,res)=>{
		res.render('code-dust/playground');
	})
}