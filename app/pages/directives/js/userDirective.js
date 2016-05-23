module.exports = function(){
  	return {
		restrict: 'E',
		templateUrl: 'views/directives/user.html',
		
		// PersonDirective.js
		scope: {
			user: '=?',
			onSelect: '=?'
		},
		controller: function($scope, $state){
			var self = this;

			$scope.user = window.localStorage.getItem("email");
			$scope.isLoggedIn = function(){
				if($scope.user){
					return true;
				} else {
					return false
				}
			}

			$scope.logOut = function(){
				window.localStorage.removeItem("email")
				$state.go('login');
			}
		},
		
		// PersonDirective.js
		link: function(scope, element, attrs){
			scope.toLogin = function(){
				if(scope.onSelect){
					scope.onSelect();
				}
			};
		}
	};
}