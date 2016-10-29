'use strict';
angular.module('codeDust.controller', [])
	.controller('playgroundController',['$scope','$stateParams',function($scope,$stateParams){

		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/terminal");
		editor.getSession().setMode("ace/mode/javascript");
		editor.setOptions({ fontSize: "15pt" });

		var socket = io.connect( { query: "playground=" + $stateParams.id });

		socket.on('connect',function(){
			socket.on('onTheGround_'+$stateParams.id,function(data){
				editor.setValue(data);
			})

		})

		socket.on('dustedCode_'+$stateParams.id,function(data){
			editor.setValue(data.code);
		})

		
		



		$scope.playground = {};

		$scope.writingCode = function(){
			
			socket.emit('codeDusting',{code:editor.getValue(),hash:$stateParams.id});
		}
	}])
	.controller('landingController',['$scope','$state','md5',function($scope,$state,md5){
		$scope.landing={};
		$scope.goToPlayground = function(){
			$state.go('playground',{id: md5.createHash(new Date().getTime()+$scope.landing.groundName)});
		}
	}])
