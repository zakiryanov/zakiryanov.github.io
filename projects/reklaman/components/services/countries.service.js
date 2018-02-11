angular.module('app')
.factory("countriesService", function($http) {
    var service = {};


    // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 

    service.getCountries = function(data,cb){
    	//(post)'/api/countries
    	//data - {from:number,limit:number,search:string}
    	    	 $http.get('jsons/countries.json')
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    	}

    service.getCities = function(data,cb){
    	//(post)'/api/countries
    	//data - {from:number,limit:number}
    	
    	 $http.get('jsons/cities.json')
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    	}
    
    
    service.getManagingZones = function(cb){
    	//(get)'/api/managing_zones
    	 $http.get('jsons/managing_countries.json')
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    }

    service.addToManaging = function(id,which){
    	//change 'isManaging' status to 'true'
    	//(post)'/api/managing_zones/:id/:which
    	//params - country id, which
    	//which can be 'country', 'region' or 'city'	
    	 $http.post('/api/managing_zones/'+id+"/"+which)
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    }

    service.removeFromManaging = function(id,which){
    	//change 'isManaging' status to 'false'
    	//(post)'/api/managing_zones/:id/:which
    	//params - country id, which
    	//which can be 'country', 'region' or 'city'	
    	 $http.post('/api/managing_zones/'+id+"/"+which)
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    }

    service.changeStatus = function(which){
    	//(put)'/api/coutries/:which
    	//params - to which status	
    	 $http.put('/api/managing_countries/'+which)
				.success(function(data){
					cb(data);
				})
				.error(function(err){
					console.log(err);
				})
    }

		
    return service;
  })    
