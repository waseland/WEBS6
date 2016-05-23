module.exports = function() {
	return function (tiles, player) {
		var filtered = [];
		for (var i = 0; i < tiles.length; i++) {
			if (tiles[i].hasOwnProperty('match') && tiles[i].match.foundBy == player._id) {
	        	filtered.push(tiles[i]);
	    	} 
	    }
    	return filtered; 
	}
} 