module.exports = function($scope, $state, gamesFactory, $stateParams) {
	var self = this;
	this.activeTab = "gameboard";
	var Game = require("./../models/game");
	this.game = new Game(gamesFactory, $stateParams["id"]);
	var socket = io("http://mahjongmayhem.herokuapp.com?gameId=" + this.game.id, { 'force new connection' : true });
	
	socket.on("match", function(matchedTiles) {
		self.game.setTilesMatched(matchedTiles);
		$scope.$apply();
	}); 

	socket.on("end", function(matchedTiles) {
		self.game.state = "finished";
		var text = "The winner(s):";
		var winners = self.game.getWinners();
		for (var i = 0; i < winners.length; i++) {
			text = text + " " + winners[i].name;
			if (i != winners.length-1) {
				text = text + ",";
			}
		}
		swal({  
			title: "Game finished!",  
			text: text,  
			showConfirmButton: true
		}, function() {
			self.goToPlayers();
		});
	});
	
	var eventTile1 = null;
	var tile1 = null;
	
	this.tileselect = function(event, selectedTile){
		console.log("test " + "Event: " + event + " Tile: " + selectedTile);
		console.log("clicked Tile: " + selectedTile);
		// Als de tegel niet vrij is, dan doe niks
		if (this.game.state == "finished" || !this.game.checkTileFreedom(selectedTile)) {
			return;
		}

		// Voegt blauw gloed toe
		$(event.target).addClass('isSelected');
		
		if (tile1 == null) {
			eventTile1 = event;
			tile1 = selectedTile;
		} 
		else {
			var targetTile1 = eventTile1.target;
			var targetTile2 = event.target;

			// Haalt blauwe gloed weg
			$(targetTile1).removeClass('isSelected');
			$(targetTile2).removeClass('isSelected');

			if (selectedTile != tile1) {
				if (this.game.checkMove(tile1, selectedTile)) {
					$(targetTile1).remove();
					$(targetTile2).remove();
					this.game.addMatch(tile1, selectedTile);
				}
				else {					
					// Voegt rode gloed toe
					$(targetTile1).addClass('noMatch');
					$(targetTile2).addClass('noMatch');

					// Haalt rode gloed weg
					setTimeout(function() {
						$(targetTile1).removeClass('noMatch');
						$(targetTile2).removeClass('noMatch');
					}, 800);
				}
			}

			eventTile1 = null;
			tile1 = null;
		}
	};

	this.game.checkPlayerInGame(window.localStorage.getItem("email"), function(playerIsInGame) {
		if(!playerIsInGame){
			self.selectTile = function(event, selectedTile) {};
		}
	});		

	this.goBackToGames = function() {
		$state.go('home');
	}

	this.goToGameboard = function() {
		this.activeTab = 'gameboard';
		$state.go('game.gameboard');
	}

	this.goToPlayers = function() {
		this.activeTab = 'players';
		$state.go('game.players')
	}
	
	$state.go('game.gameboard');

}