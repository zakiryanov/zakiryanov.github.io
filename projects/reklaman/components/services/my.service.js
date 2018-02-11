angular.module('app')
.factory("myService", function($http) {
    var service = {};
    var timeout ;
    var ping = 400;

    service.getQuestionsCounter = function(cb){
    	//(get)'/api/questions_counter
    	 $http.get('jsons/questions_counter.json')
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    }

    service.search = function (cb) {
		 if (timeout) {  
		    clearTimeout(timeout);
		  }
		  timeout = setTimeout(function() {
		     cb();
		  }, ping);
		
	}
    
    service.getListOptions = function(cb){
    	//method - (get)
    	//api - '/api/user_list_options
    	$http.get('jsons/user_list_options.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }		
		
    return service;
  })    
