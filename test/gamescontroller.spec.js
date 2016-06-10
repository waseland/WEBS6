describe("GamesController", function() {
	
    var gamesController;
	var loginFactory;
	var gamesFactory;
	var httpBackend;
	var scope;
	var hasPlayer1;
	var hasPlayer2;
	
	// initialize the app
	beforeEach(module('advjavascript'));

	// Inject the modules and get them in global variables
	beforeEach(inject(function($rootScope, $controller, $httpBackend, $injector){
		// The scope for the controller
		scope = $rootScope.$new();
		// Get the service which will be injected
		loginFactory = $injector.get('loginFactory');
		// For mocking the backend
		httpBackend = $httpBackend;

		// // Stubbing with sinon
		loginFactory.getUser = sinon.stub();
		loginFactory.getUser.returns({
			username: "MartijnSmulders"
		});
		
		//ng-init="init()" 
		
		// This is the controller we're going to test
		gamesController = $controller('GamesController', { $scope: scope , retreivedGames: []});
		
		gamesController.games[0] = {
			_id: "575abf5c19c12511003e5f70", 
			createdBy: {
				_id:"m.smulders@pretenddocent.avans.nl",
				name:"Martijn Smulders"	
			}, 
			createdOn: "2016-06-10T13:23:40.786Z", 
			gameTemplate: {
				_id:"Shanghai",
				id:"Shanghai"
			},
			id:"575abf5c19c12511003e5f70",
			maxPlayers:8,
			minPlayers:2,
			players:[
				{
					_id:"m.smulders@pretenddocent.avans.nl",
					name:"Martijn Smulders"
				},
				{
					_id:"bralmer.h@student.avans.nl",
					name:"Bralmer Hendroot"	
				}
			],
			state:"open"
		};
		
		hasPlayer1 = gamesController.hasPlayer(gamesController.games[0], {_id:"bralmer.h@student.avans.nl"});
		hasPlayer2 = gamesController.hasPlayer(gamesController.games[0], {_id:"bralmoord.h@student.avans.nl"});
		
		gamesController.goToOpenGames();
	}));
    
    it('gamesController is not null', function(){
        expect(gamesController).to.not.be.undefined;
    });
    
    it('gamesController to have create a game', function(){
        expect(gamesController).to.have.property('games');
        expect(gamesController.games.length).to.equal(1);
    });
	
	it('gamesController to have player1', function(){
        expect(hasPlayer1).to.equal(true);
    });
	
	it('gamesController to have player2', function(){
        expect(hasPlayer2).to.equal(false);
    });
	
	it('gamesController to be active at tab open', function(){
        expect(gamesController.activeTab).to.equal("open");
    });
});