'use strict';
angular.module('codeDust.controller', [])
	.controller('playgroundController',['$scope',function($scope){

		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/terminal");
		editor.getSession().setMode("ace/mode/javascript");
		editor.setOptions({ fontSize: "15pt" });

		var socket = io.connect();

		socket.on('dustedCode',function(data){
			editor.setValue(data);
		})

		$scope.playground = {};

		$scope.writingCode = function(){
			
			socket.emit('codeDusting',editor.getValue());
		}
	}])
