
require('angular/angular.min');
require('./angular-material.min')
require('angular-ui-router/release/angular-ui-router.min');
require('sweetalert2/dist/sweetalert2.min');

require('bootstrap/dist/js/bootstrap.min');
// Create your app
var app = angular.module("advjavascript", ["ui.router"]);
var HttpInjector = require('./factories/httpInjector');
app.factory('HttpInjector', HttpInjector);

//Factories 
var urlFactory = require("./factories/urlFactory");
var loginFactory = require("./factories/loginFactory");
var gamesFactory = require("./factories/gamesFactory");

app.factory("urlFactory", urlFactory);
app.factory("gamesFactory", gamesFactory);
app.factory("loginFactory", loginFactory);

//Controllers
var listController = require('./controllers/listcontroller.js');
var authController = require('./controllers/authcontroller.js');
var gamesController = require("./controllers/gamescontroller.js");
var gameController = require("./controllers/gamecontroller.js");

app.controller('ListController', listController);  
app.controller('AuthController', authController); 
app.controller("GamesController", gamesController);
app.controller("GameController", gameController)

//Filters
var tileNotMatchedFilter = require("./filters/tileNotMatchedFilter");
var tileMatchedByPlayerFilter = require("./filters/tileMatchedByPlayerFilter");

app.filter("tileNotMatched", tileNotMatchedFilter);
app.filter("tileMatchedByPlayer", tileMatchedByPlayerFilter);


app.config(function($stateProvider, $httpProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');
  $stateProvider
  .state('/', {
    url: '/',
    templateUrl: 'pages/home.html',  
    controller: 'ListController',
    controllerAs: 'list'
  })
    .state('home', {
      url: "/games",
      templateUrl: "pages/games.html",
      controller: "GamesController as gamesController",
      resolve: {
        retreivedGames: function(gamesFactory, $q){
          setProgressBar("Loading games", 30);
          var deferred = $q.defer();

          gamesFactory.getGames(100, setProgressBar, function(games){
            setProgressBar("Loading games", 100);
            deferred.resolve(games);
          })

          return deferred.promise;
        }
      }
    })
  
   
  .state('home.opengames', {
      templateUrl: "pages/directives/gamesViews/opengames.html",
    })
    .state('home.playinggames', {
      url: "/playing",
      templateUrl: "pages/directives/gamesViews/playinggames.html"
    })
    .state('home.myplayinggames', {
      url: "/myplaying",
      templateUrl: "pages/directives/gamesViews/myplayinggames.html"
    })
    .state('home.ownedgames', {
      url: "/owned",
      templateUrl: "pages/directives/gamesViews/ownedgames.html",
    }) 
    .state('game', {
      url: "/game?id",
      templateUrl: "pages/game.html",
      controller: "GameController as gameController"
    })
    .state('game.gameboard', {
      url: "/gameboard",
      templateUrl: "pages/directives/gameViews/gameboard.html"
    })
    .state('game.players', {
      url: "/players",
      templateUrl: "pages/directives/gameViews/players.html"
    })
    .state('auth', {
      url: "/auth",
      controller: authController,
      controllerAs: 'auth'
    });
});
  
app.config(['$httpProvider', function ($httpProvider)
{
  $httpProvider.interceptors.push('HttpInjector');
}]);

 
app.directive('game', function() {
  return {
    restrict: 'E',
    templateUrl: 'pages/directives/gamesViews/game.html',
  }
});

app.directive('creategame', function() {
  return {
    restrict: 'E',
    templateUrl: 'pages/directives/gamesViews/creategame.html',
  }
});

app.directive('tile', function() {
	return {
		restrict: 'E',
		templateUrl: 'pages/directives/tile.html',
		controller: function($scope) {
		},
		link: function(scope, element, attrs) {
		}
	}
});


function setProgressBar(task, number){
    $("#loadingTask").html(task)
    $('.progress-bar').css('width', number+'%').attr('aria-valuenow', number);
}
