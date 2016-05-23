module.exports = function($scope, $location){
    var vm = this; 
    var location = $location.search();          
    console.log(location);
        
     swal({
        title: 'Logged in!',
        text: 'Your username is ' + location.username,
        type: 'success'
        }).then(function(){
              vm.redirect();   
        });
     
     vm.redirect = function(){
       localStorage.setItem("login", JSON.stringify(location));  
       $location.url($location.path('/'));
       $scope.$apply();
     };
};