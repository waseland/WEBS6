module.exports = function($http, urlFactory) {

    var urlBase = '/games';
    var gamesFactory = {};

    gamesFactory.timeout = function(callBack){
        window.setTimeout(function(){
            callBack();
        }, 5000)
    }

    gamesFactory.getGames = function (numberOfGames, setProgressBar, callBack) {
        setProgressBar("Loading games", 50);
        return $http.get(urlFactory + urlBase + "?pageSize=" + numberOfGames).
        success(function(data, status, headers, config){
        	callBack(data);
        }).error(function(data, status, headers, config){
        	console.log(data);
        });
    };

    gamesFactory.createGame = function (templateName, minPlayers, maxPlayers, callBack) {
        return $http.post(urlFactory + urlBase, {templateName: templateName,  minPlayers: minPlayers, maxPlayers: maxPlayers}).
        success(function(data, status, headers, config){
        	callBack(data);
        }).error(function(data, status, headers, config){
        	console.log(data);
        });
    };

    gamesFactory.startGame = function(game_id, callBack){
        return $http.post(urlFactory + urlBase + "/" + game_id + "/start").
        success(function(data, status, headers, config){
            callBack(data);
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }

    gamesFactory.joinGame = function(game_id, callBack){
        return $http.post(urlFactory + urlBase + "/" + game_id + "/Players").
        success(function(data, status, headers, config){
            callBack(data);
        }).error(function(data, status, headers, config){
            console.log(data);
        });
    }

    gamesFactory.getGame = function (id, callBack) {
        return $http.get(urlFactory + urlBase + '/' + id).
        success(function(data, status, headers, config) {
            callBack(data);
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
    };

    gamesFactory.getTiles = function (id, callBack) {
        return $http.get(urlFactory + urlBase + '/' + id + '/Tiles').
		success(function(data, status, headers, config) { 
			callBack(data);
		}).
		error(function(data, status, headers, config){
			console.log(data);
		});
    };

    gamesFactory.addMatch = function (idGame, idTile1, idTile2) {
        return $http.post(urlFactory + urlBase + '/' + idGame + '/Tiles/matches', {tile1Id: idTile1, tile2Id: idTile2}).
        error(function(data, status, headers, config){
            console.log(data);
        });
    };

    gamesFactory.testSockets = function (idGame) {
        return $http.get("https://mahjongmayhem.herokuapp.com/test/" + idGame + "/match").
        success(function(data, status, headers, config) {
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
    };
	
    return gamesFactory;
};