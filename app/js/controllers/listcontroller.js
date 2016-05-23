module.exports = function($scope, $stateParams, $location, $state){
    var vm = this;  
    vm.login = undefined;

    vm.logout = function(){
        localStorage.removeItem("login");
        $state.reload();
    }
    $scope.$on("$stateChangeSuccess", function(args){
        if(localStorage.getItem("login")){
            vm.login = JSON.parse(localStorage.getItem("login"));
        }
    });
    
    vm.goToGames = function(){
        $location.url("/games");
    };
};