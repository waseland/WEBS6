module.exports = function($scope, $location, $timeout, gamesFactory, retreivedGames, $state, loginFactory) {
	this.sockets = [];
	this.login = loginFactory.getUser();
	this.user = {
		_id: this.login.username,
		id: this.login.username
	};
	
	this.activeTab = "open"
	this.confirmButtonColor = "#337ab7"

	this.gameType = "Shanghai";
	this.minPlayers = 2;
	this.maxPlayers = 32;

	this.games = retreivedGames;
	this.creatingGame = false	

	var progressBarToAdd = '<div id="progressBarToRemove" class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div></div>'
	var self = this;
	var stop;

	this.showGame = function(game) {
		console.log("Go to game! " + game._id);
		$state.go('game', {id: game._id});
	}

	this.hasPlayer = function(game, user){
		for(var x = 0; x < game.players.length; x++){
			if(game.players[x]._id === user._id){
				return true
			}
		}
		return false
	}	
	
	this.createGame = function() {
		var minPlayers = this.minPlayers;
		var maxPlayers = this.maxPlayers;
		if(minPlayers != "" && maxPlayers != "" && minPlayers > 0 && minPlayers < 33 && maxPlayers > 1 && maxPlayers < 33 && maxPlayers > minPlayers){
			$("#addProgressBarHere").append(progressBarToAdd)
			self.creatingGame = true
			gamesFactory.createGame(this.gameType, minPlayers, maxPlayers, function(newGame){
				self.games.push(newGame);
				self.joinSocket(newGame);
				$("#progressBarToRemove").remove()
				swal({ title: "Game created!", text: "The game is added to 'My games'", type: "success", confirmButtonText: "Cool!", 
					confirmButtonColor: self.confirmButtonColor
				}, function(){
						self.creatingGame = false
						self.goToOwnedGames();
				});
			});
		} else {
			$("#alertToRemove").remove()
			$("#createGame").append('<div id="alertToRemove" class="alert alert-danger myAlert" role="alert">De game voldoet niet aan een van deze eisen: </br> minPlayers != undefined && maxPlayers != undefined && minPlayers > 0 && minPlayers < 32 && maxPlayers > 1 && maxPlayers < 33 && maxPlayers > minPlayers</div>')
			$(".myAlert").dequeue();
			$(".myAlert").css("opacity", 0);
			$(".myAlert").clearQueue();
			$(".myAlert").stop(true, true);
			if(angular.isDefined(stop)){
				$timeout.cancel(stop);
            	stop = undefined;
			}
			$(".myAlert").animate({
			    opacity: 1,
			}, 1000, function() {
			    stop = $timeout(function(){
					$( ".myAlert" ).animate({
						opacity: 0,
					}, 4000, function() {
						$("#alertToRemove").remove()
					});
				}, 4000);
			});
		}
	};

	this.joinGame = function(game) {
		if(game){
			swal({   
			title: "Joining game!",   
			text: progressBarToAdd,   
			html: true,
			showConfirmButton: false });

			gamesFactory.joinGame(game._id, function(data){
				for (var i in self.games) {
			     if (self.games[i]._id == data._id) {
			        self.games[i] = data;
			        break;
			     }
			   }
				swal.close();
				window.setTimeout(function(){
					swal({ title: game.createdBy.name + "'s game joined!", allowOutsideClick: true,  text: "You have successfully joined " +  game.createdBy.name + "'s game!'", 
						type: "success", 
						confirmButtonText: "Cool!", 
						confirmButtonColor: self.confirmButtonColor});
				}, 400)
			});
		}
	};

	this.startGame = function(game) {
		
		swal({   
			title: "Starting game!",   
			text: progressBarToAdd,   
			html: true,
			showConfirmButton: false });

		gamesFactory.startGame(game._id, function(data){
			for (var i in self.games) {
		     	if (self.games[i]._id == game._id) {
		        	self.games[i].state = "playing";
		        	break;
		     	}
		   	}
			swal.close();
			window.setTimeout(function(){
				swal({   
					title: "Game started!",   
					text: "You have successfully started your game!",   
					type: "success",   
					showCancelButton: true,   
					confirmButtonColor: self.confirmButtonColor,   
					confirmButtonText: "Go to game!",   
					cancelButtonText: "Cool!",  
					allowOutsideClick: true,  
					closeOnConfirm: true,   
					closeOnCancel: true }).then(function(isConfirm){   
						if (isConfirm) {     
							for (var i in self.games) {
						     	if (self.games[i]._id == game._id) {
						        	self.showGame(self.games[i])
						        	break;
						     	}
						   	} 
						}
					});
			}, 400)
		});
	};

	this.isOwnedGame = function(game){
		if(this.user._id == game.createdBy._id){
			console.log("found one: " + game + " and " + game.createdBy._id)
			return true;
		} else {
			var found = false;
			for(var i = 0; i < game.players.length; i++) {
			    if (game.players[i]._id == this.user._id) {
			        found = true;
			        break;
			    }
			}
			return found;
		}
	}

	this.joinSockets = function(){
		for(var x = 0; x < self.games.length; x++){
			self.joinSocket(self.games[x]);
		}
	}

	this.joinSocket = function(game){
		var socket = io.connect("http://mahjongmayhem.herokuapp.com?gameId=" + game._id, {'force new connection': true });
		socket["game"] = game;
		socket.on("playerJoined", function(player) {
			if(player._id != self.user._id){
				socket.game.players.push({_id: player._id, id: player._id, name: player.name, __v: player.__v })
				if(self.isOwnedGame(socket.game)){
					swal.close();
					$scope.$apply();
					window.setTimeout(function(){
						swal({  
						title: player.name + " joined!",  
						text: player.name + " has just joined your " + socket.game.gameTemplate._id + " game!",  
						timer: 2000, showConfirmButton: false });
					}, 400)
				};
			}
		});
		socket.on("start", function(){
			if(socket.game.createdBy._id != self.user._id && self.isOwnedGame(socket.game)){
				socket.game.state = "playing"
				swal.close();
				$scope.$apply();
				window.setTimeout(function(){
						swal({   
						title: "Game started!",   
						text: socket.game.createdBy.name + " just started a " + socket.game.gameTemplate._id + " game!",      
						showCancelButton: true,   
						confirmButtonColor: self.confirmButtonColor,   
						confirmButtonText: "Go to game!",   
						cancelButtonText: "Cool!",  
						allowOutsideClick: true,  
						closeOnConfirm: true,   
						closeOnCancel: true }, function(isConfirm){   
							if (isConfirm) {     
								self.showGame(socket.game);
							}
						});
				}, 400)
			}
		});
		self.sockets.push(socket);
	}

	this.isSelfCreatedGame = function(game){
		return this.user._id == game.createdBy._id;
	}

	this.goToOwnedGames = function(){
		this.activeTab = 'owned'
        //$location.path( "/game").search({id: game._id});
		$state.go('home.ownedgames');
	}

	this.goToOpenGames = function(){
		this.activeTab = 'open'
         //$location.path( "/open");
		$state.go('home.opengames');
	}

	this.goToPlayingGames = function(){
		this.activeTab = 'playing'
         //$location.path( "/game").search({id: game._id});
		//$state.go('home.playinggames');
	}

	this.goToMyPlayingGames = function(){
		this.activeTab = 'myplaying'
         //$location.path( "/game").search({id: game._id});
		$state.go('home.myplayinggames')
	}

	this.changeSelect = function(gameType){
		this.gameType = gameType;
		$("#selectGameType").html(this.gameType);
	}

	self.notifyUserClicked = function(){
		console.log("Nofity user clicked")
	};
	$state.go('home.opengames');

}