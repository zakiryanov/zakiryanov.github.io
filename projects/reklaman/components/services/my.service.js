angular.module('app')
.factory("myService", function($http) {
	var service = {};
	var timeout ;
	var ping = 500;

	service.authorizeAsAdmin = function(data,cb){
    	$http.post('/api/admin/login',data)
    	.success(function(data){
    		cb(data);
    	})
    	.error(function(err){
    		console.log(err);
    	})
    }

    service.dataURItoBlob = function (dataURI) {
        var binary = atob(dataURI.split(',')[1]);
        var array = [];
        for(var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    }

    service.search = function (cb) {
    	if (timeout) {  
    		clearTimeout(timeout);
    	}
    	timeout = setTimeout(function() {
    		cb();
    	}, ping);    	
    }

    service.getAdmin = function(cb) {
        $http.get('/api/company/getAdmin')
        .success(function(data){
            cb(data.data[0]);
        })
        .error(function(err){
            console.log(err);
        })
    }
    
    service.getListOptions = function(cb){
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
