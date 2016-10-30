'use strict';
angular.module('codeDust.services',[])
	.service('toaster',[function(){
		this.show = function(message){
			var x = document.getElementById("snackbar");
			x.innerHTML = message;
			x.className = x.className.replace("show", "");
			x.className = "show";
			setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
		}
	}])

