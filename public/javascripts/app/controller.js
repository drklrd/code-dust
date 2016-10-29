'use strict';
angular.module('codeDust.controller', [])

	.controller('playgroundController',['$scope','$stateParams',function($scope,$stateParams){

		

		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/terminal");

		
		editor.setOptions({ fontSize: "15pt" });



		var socket = io.connect( { query: "playground=" + $stateParams.id });

		socket.on('connect',function(){
			socket.on('onTheGround_'+$stateParams.id,function(data){
				
				editor.setValue(data.code);
				if(data.options.language && data.options.language.mode){
					editor.getSession().setMode("ace/mode/"+data.options.language.mode);	
				}
				if(data.options.theme && data.options.theme.mode){
					editor.setTheme("ace/theme/"+data.options.theme.mode);	
				}
				
				
				applySelected('availableLanguages','language',data);
				applySelected('availableThemes','theme',data);
			})

			socket.on('totalPlayers_'+$stateParams.id,function(data){
				$scope.playground.totalPlayers = data;
				$scope.$apply();
			})

		})

		socket.on('dustedCode_'+$stateParams.id,function(data){
			editor.setValue(data.code);
			applySelected('availableLanguages','language',data);
			applySelected('availableThemes','theme',data);
			
		})

		var applySelected = function(type,property,data){
			if(data.options && data.options[property]){
				if(property === 'language'){
					editor.getSession().setMode("ace/mode/"+data.options.language.mode);
				}else if(property === 'theme'){
					editor.setTheme("ace/theme/"+data.options.theme.mode);
				}
				
				$scope.playground[type].forEach(function(available){
					if(available['mode'] === data.options[property]['mode']){
						$scope.playground[property] = data.options[property];
					}
				})
				
				$scope.$apply();
			}
		}
		



		$scope.playground = {};

		$scope.playground.availableLanguages = [
			{
				language : 'Javascript',
				mode : 'javascript'
			},
			{
				language : 'Python',
				mode : 'python'
			},
			{
				language : 'Ruby',
				mode : 'ruby'
			},
			{
				language : 'CSS',
				mode : 'css'
			},
			{
				language : 'PHP',
				mode : 'php'
			},
			{
				language : 'HTML',
				mode : 'html'
			},
			{
				language : 'Java',
				mode : 'java'
			},
			{
				language : 'Jade',
				mode : 'jade'
			}
		];

		$scope.playground.availableThemes = [
			{
				theme : 'Monokai',
				mode : 'monokai'
			},
			{
				theme : 'Terminal',
				mode : 'terminal'
			},
			{
				theme : 'Github',
				mode : 'github'
			},
			{
				theme : 'Cobalt',
				mode : 'cobalt'
			}
		];

		$scope.playground.theme= $scope.playground.availableThemes[1];

		$scope.writingCode = function(){
			
			socket.emit('codeDusting',{code:editor.getValue(),hash:$stateParams.id,options : {
				language : $scope.playground.language,
				theme : $scope.playground.theme
			}});
		}

		$scope.applyLanguage = function(language){
			if(language){
				editor.getSession().setMode("ace/mode/"+language.mode);
				$scope.writingCode();
			}
		}

		$scope.applyTheme = function(theme){
			if(theme){
				editor.setTheme("ace/theme/"+theme.mode);
				$scope.writingCode();
			}
		}

	}])
	.controller('landingController',['$scope','$state','md5',function($scope,$state,md5){
		$scope.landing={};
		$scope.goToPlayground = function(formValid){
			if(formValid){
				$state.go('playground',{id: md5.createHash(new Date().getTime()+$scope.landing.groundName)});
			}
			
		}
	}])
