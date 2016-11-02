'use strict';
angular.module('codeDust.controller', [])

.controller('playgroundController', ['$scope', '$stateParams', 'toaster', '$window', function($scope, $stateParams, toaster, $window) {

		var editor = ace.edit("editor");
		editor.setTheme("ace/theme/terminal");


		editor.setOptions({
			fontSize: "15pt"
		});

		editor.focus();

		editor.$blockScrolling = Infinity;


		
		var welcomeCoder = function(){
			var welcomeText = `Hello there ! Welcome to Code Dust. Here you can write code and share with others. 
				You can select language and theme as well.

				Happy coding and code sharing ! :) 

				This message will disappear shortly  ........................................
			`;
			var letters = '';
			var interval = setInterval(function(){
				if (letters.length < welcomeText.length) { 
				      letters = letters + welcomeText[letters.length];
				      editor.setValue(letters,1);
				   }
				   else {
				   	  	editor.setValue('',1); 
				      	clearInterval(interval);

				   }
				},50);
		}
		
		if($stateParams.welcomeCoder){
			welcomeCoder();
		}

		var socket = io.connect({
			query: "playground=" + $stateParams.id
		});

		socket.on('connect', function() {
			socket.on('onTheGround_' + $stateParams.id, function(data) {

				editor.setValue(data.code,1);
				if (data.options.language && data.options.language.mode) {
					editor.getSession().setMode("ace/mode/" + data.options.language.mode);
				}
				if (data.options.theme && data.options.theme.mode) {
					editor.setTheme("ace/theme/" + data.options.theme.mode);
				}

				// positionCursor();


				applySelected('availableLanguages', 'language', data);
				applySelected('availableThemes', 'theme', data);
			})

			socket.on('totalPlayers_' + $stateParams.id, function(data) {
				$scope.playground.totalPlayers = data;
				$scope.$apply();
			})

		})

		socket.on('dustedCode_' + $stateParams.id, function(data) {
			editor.setValue(data.code,1);
			applySelected('availableLanguages', 'language', data);
			applySelected('availableThemes', 'theme', data);
			// positionCursor();

		})

		var applySelected = function(type, property, data) {
			if (data.options && data.options[property]) {
				if (property === 'language') {

					editor.getSession().setMode("ace/mode/" + data.options.language.mode);
				} else if (property === 'theme') {
					editor.setTheme("ace/theme/" + data.options.theme.mode);
				}

				$scope.playground[type].forEach(function(available, index) {
					if (available['mode'] === data.options[property]['mode']) {
						if (!$scope.playground[property] || $scope.playground[property]['mode'] !== data.options[property]['mode']) {
							toaster.show(property + ' has been changed to ' + data.options[property]['mode']);
						}
						$scope.playground[property] = $scope.playground[type][index];


					}
				})

				$scope.$apply();
			}
		}



		$scope.playground = {};

		$scope.playground.availableLanguages = [{
			language: 'Javascript',
			mode: 'javascript'
		}, {
			language: 'Python',
			mode: 'python'
		}, {
			language: 'Ruby',
			mode: 'ruby'
		}, {
			language: 'CSS',
			mode: 'css'
		}, {
			language: 'PHP',
			mode: 'php'
		}, {
			language: 'HTML',
			mode: 'html'
		}, {
			language: 'Java',
			mode: 'java'
		}, {
			language: 'Jade',
			mode: 'jade'
		}, {
			language: 'JSON',
			mode: 'json'
		}, {
			language: 'Less',
			mode: 'less'
		}, {
			language: 'Sass',
			mode: 'sass'
		}, {
			language: 'SCSS',
			mode: 'scss'
		}, {
			language: 'Matlab',
			mode: 'matlab'
		}, {
			language: 'MySQL',
			mode: 'mysql'
		}, {
			language: 'Typescript',
			mode: 'typescript'
		}];

		$scope.playground.availableThemes = [{
				theme: 'Monokai',
				mode: 'monokai'
			}, {
				theme: 'Terminal',
				mode: 'terminal'
			}, {
				theme: 'Github',
				mode: 'github'
			}, {
				theme: 'Cobalt',
				mode: 'cobalt'
			}, {
				theme: 'Ambiance',
				mode: 'ambiance'
			}, {
				theme: 'Chaos',
				mode: 'chaos'
			}, {
				theme: 'Chrome',
				mode: 'chrome'
			}, {
				theme: 'Clouds',
				mode: 'clouds'
			}, {
				theme: 'Dawn',
				mode: 'dawn'
			}, {
				theme: 'Twilight',
				mode: 'twilight'
			}

		];

		$scope.playground.theme = $scope.playground.availableThemes[1];

		

		// var positionCursor = function(){
		// 	var activeLine = angular.element('.ace_active-line');
		// 	activeLine.append('<span style="margin-left:95%" > here</span>')
		// 	// var cursor = document.getElementById('cursorposition');
		// 	// cursor.style.position='absolute';
		// 	// var yPos = editor.getCursorPosition().row* activeLine.height();
		// 	// if((yPos) <document.getElementById('editor').offsetHeight){
		// 	// 	cursor.style.top = yPos+'px';
		// 	// }
			
		// 	// cursor.style.left = "73%";
		// }

		// positionCursor();
		
		$scope.writingCode = function() {

			socket.emit('codeDusting', {
				code: editor.getValue(),
				hash: $stateParams.id,
				options: {
					language: $scope.playground.language,
					theme: $scope.playground.theme
				}
			});
			
			// positionCursor();
		}

		$scope.applyLanguage = function(language) {
			if (language) {
				editor.getSession().setMode("ace/mode/" + language.mode);
				toaster.show('language has been changed to ' + language.mode);
				$scope.writingCode();
			}
		}

		$scope.applyTheme = function(theme) {
			if (theme) {
				editor.setTheme("ace/theme/" + theme.mode);
				toaster.show('theme has been changed to ' + theme.mode);
				$scope.writingCode();
			}
		}


		$scope.copyToClipboard = function(copy) {
			var copyElement = copy === 'url' ? $window.location.href : editor.getValue();
			angular.element('<textarea/>')
				.css({
					'opacity': '0',
					'position': 'fixed'
				})
				.text(copyElement)
				.appendTo(angular.element($window.document.body))
				.select()
				.each(function() {
					document.execCommand('copy')
				})
				.remove();
			toaster.show(copy === 'url' ? 'link has been copied to your clipboard !' : 'code has been copied to your clipboard !')
		}

		$scope.supportedFileTypes = {
			'js' : 'javascript',
			'py' : 'python',
			'css' : 'css',
			'html' : 'html',
			'php' : 'php',
			'json' : 'json',
			'jade' : 'jade',

		};

		$scope.fileChanged = function(element){
			$scope.$apply(function(scope) {
			        var file = element.files[0];
			        var extension = file.name.split('.')[1];
			        if($scope.supportedFileTypes[extension]){
			        	var reader = new FileReader();
			        	editor.setValue("LOADING FILE ...",1);
			        	reader.onload = function(e) {
			        		editor.setValue($scope.supportedFileTypes[extension]+" file detected. Applying " +$scope.supportedFileTypes[extension] +" mode... ",1);
			        		
			        	   	setTimeout(function(){

		        	   			var value = atob(e.target.result.split(',')[1]);
		        	   		   	editor.setValue(value,1);
		        	   		   	$scope.writingCode();
		        	   		   	editor.getSession().setMode("ace/mode/" + $scope.supportedFileTypes[extension] );
		        	   		   	
		        	   		   	var fileLanguage = $scope.playground.availableLanguages.find(function(language,index) {
		        	   		   		language.mappingIndex = index;
		        	   		   		return language.mode === $scope.supportedFileTypes[extension];
		        	   		   	});

			        	   		$scope.applyLanguage(fileLanguage);
			        	   		$scope.playground.language = $scope.playground.availableLanguages[fileLanguage.mappingIndex] ;
			        	   		$scope.$apply();
			        	   		$scope.writingCode();

			        	   	},3000);

			        	   
			        	};
			        	reader.readAsDataURL(file);
			        }else{
			        	toaster.show(' File type not supported !');
			        }
			        
			    });

		}


	}])
	.controller('landingController', ['$scope', '$state', 'md5','$http', function($scope, $state, md5,$http) {
		$scope.landing = {};
		$scope.goToPlayground = function(formValid) {
			if (formValid) {
				var hashedGround = md5.createHash(new Date().getTime() + $scope.landing.groundName);
				$http
					.post('/api/playground/create',{hashedGround:hashedGround})
					.success(function(response){
						if(response && response.success){
							
							$state.go('playground', {
								id: hashedGround,
								welcomeCoder : true
							});
						}
					})
				
			}

		}
	}])