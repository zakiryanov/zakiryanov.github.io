angular.module('myApp').factory('authService', function ($q, $http,$state,$localStorage) {

            // return available functions for use in the controllers
            return ({
                isLoggedIn: isLoggedIn,
                login: login,
                logout: logout,
                signup: signup
            });

            function isLoggedIn() {
                $http.post('/auth/api/status')
                    .success(function (data) {
                        if(!data.status) $state.go('login');
                    })
                    // handle error
                    .error(function (err) {
                        console.log(err);
                    });
            }

            function login(name, password, myCallback) {
                $http.post("/auth/api/login",{name:name,password:password})
                    .success(function(response){
                        if(response=='Unauthorized') return;
                        myCallback(true);
                    })
                    .error(function(err){
                         myCallback(false);
                        console.log(err);
                    });   
            }

            function logout() {
                $http.post("auth/api/logout")
                    .success(function(response){
                    })
                    .error(function(err){
                        console.log(err);
                    });
                
            }

            function signup(name, password) {
                $http.post("/auth/api/signup",{name:name,password:password})
                    .success(function(response){
                        console.log(response);
                       conosoe.log("registered");
                    })
                    .error(function(err){
                        console.log(err);
                    });
            }

        });
