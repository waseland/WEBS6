module.exports = function(gamesFactory, idGame) {
	this.gamesFactory = gamesFactory;
	this.id = idGame;
	this.players;
	this.tiles;
	this.state;
	this.freeTiles = [];
	this.processing = false;
	
	var self = this
	
	this.gamesFactory.getGame(this.id, function(game){
		self.players = game.players;
		self.state = game.state;
	});

	this.gamesFactory.getTiles(this.id, function(tiles){
		self.tiles = tiles;
	});

    this.checkPlayerInGame = function(player_id, callBack) {
    	this.gamesFactory.getGame(self.id, function(game){
			self.players = game.players;
			for (var i = 0; i < self.players.length; i++) {
		    	if (self.players[i]._id == player_id) {
		    		callBack(true);
		    		return;
		    	}
		    }
	    	callBack(false);
		});
    }

	this.checkMove = function(tile, tile2) {
		if (((tile.tile.matchesWholeSuit || tile2.tile.machtesWholeSuit) && tile.tile.suit == tile2.tile.suit) ||
			(tile.tile.name == tile2.tile.name && tile.tile.suit == tile2.tile.suit)) {
			return true;
		}
		return false
	};
	
	this.checkTileFreedom = function(tile) {
		var leftFree = this.checkTileSide(tile, 'left');
		var rightFree = this.checkTileSide(tile, 'right');
		var topFree = true;
		for (var x = tile.xPos -1; x <= tile.xPos +1; x++) {
			for (var y = tile.yPos -1; y <= tile.yPos +1; y++) {
				for(var i = 0; i < this.tiles.length; i++){
					if(this.tiles[i].xPos == x && this.tiles[i].yPos == y && 
					   this.tiles[i].zPos == tile.zPos + 1 && !this.isMatched(this.tiles[i])){
						topFree = false;
					}
				}
			}
		}
		return (leftFree || rightFree) && topFree ? true : false
	}

	this.isMatched = function(tile){
		return tile.hasOwnProperty("match")
	}
	
	this.checkTileSide = function(tile, side){
		var free = true;
		var xCoord;
		side == 'right' ? xCoord = tile.xPos + 2 : xCoord = tile.xPos - 2;
		var yCoord1 = tile.yPos - 1;
		var yCoord2 = tile.yPos;
		var yCoord3 = tile.yPos + 1;
		for(var x = 0; x < this.tiles.length; x++){
			if(this.tiles[x].xPos == xCoord){
				if(!this.isMatched(this.tiles[x])){
					switch(this.tiles[x].yPos){
					case(yCoord1):
					case(yCoord2):
					case(yCoord3):
						if(this.tiles[x].zPos == tile.zPos){
							free = false
							
						}
						break;
					}
				}
			}
		}
		return free;
	}

	this.addMatch = function(tile1, tile2){
		self.processing = true;
		self.gamesFactory.addMatch(self.id, tile1._id, tile2._id);
	}

	this.setTilesMatched = function(matchedTiles) {
		var matchedTile1 = matchedTiles[0];
		var matchedTile2 = matchedTiles[1];

		for (var i = 0; i < self.tiles.length; i++) {
			if (self.tiles[i].tile._id == matchedTile1.tile) {
				self.tiles[i].match = matchedTile1.match;
			} else if (self.tiles[i].tile._id == matchedTile2.tile) {
				self.tiles[i].match = matchedTile2.match;
			}
		}
		self.processing = false;
	}

	this.getWinners = function() {
		var scores = [];
		for (var i = 0; i < self.players.length; i++) {

			var score = 0;
			for (var j = 0; j < self.tiles.length; j++) {
				if (self.tiles[j].hasOwnProperty("match") && 
					self.tiles[j].match.foundBy == self.players[i]._id) {
					
					score++;
				}
			}

			scores.push({
				player: self.players[i],
				score: score
			});
		}

		scores.sort(sortByScore);

		var winners = [];
		for (var i = 0; i < scores.length; i++) {
			if (scores[0].score == scores[i].score) {
				winners.push(scores[i].player);
			}
		}

		return winners;
	}

	function sortByScore(a, b) {
		if (a.score > b.score)
	    	return -1;
	  	if (a.score < b.score)
	    	return 1;
	  	return 0;
	}
	
	/*this.matchesLeft = function(){
		for(var x = 0; x < this.tiles.length; x++){
			if(this.checkTileFreedom(this.tiles[x])){
				this.freeTiles.push(this.tiles[x]);
			}
		}
		if(this.freeTiles.length == 0){
			return false;
		} else {
			for(var jip = 0; jip < this.freeTiles.length; jip++){
				for(var erik = jip + 1; erik < this.freeTiles.length; erik++){
					if(this.freeTiles[jip].name == this.freeTiles[erik].name && this.freeTiles[jip].suit == this.freeTiles[erik].suit){
						return true;
					}
				}
			}
		}
		return false;
	}*/
}