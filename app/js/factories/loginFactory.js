module.exports = function() {

    var loginFactory = {};

    loginFactory.isLoggedIn = function(){
        if(window.localStorage.getItem("login")){
        var login =  JSON.parse(window.localStorage.getItem("login"));
        var email = login.username;
        var token = login.token;
            if(email && token){
                return true;
            } 
        }else {
            return false;
        }
    };

    loginFactory.getEmail = function(){
        var login =  JSON.parse(window.localStorage.getItem("login"));
        return login.username;
    };

    loginFactory.getToken = function(){
        var login =  JSON.parse(window.localStorage.getItem("login"));
        return login.token;
    };

    return loginFactory;
};