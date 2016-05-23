module.exports = function() {
	return function (tiles) {
		var filtered = [];
		if (tiles != null) {
			for (var i = 0; i < tiles.length; i++) {
		    	if (!tiles[i].hasOwnProperty('match')) {
		        	filtered.push(tiles[i]);
		    	} 
		    }
		}
    	return filtered;
	}
} 