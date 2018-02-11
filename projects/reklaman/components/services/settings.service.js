angular.module('app')
.factory("settingsService", function($http) {
    var service = {};

        // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 


    service.getRoutes = function(cb){
    	//method - (get)
    	//api - '/api/routes
    	$http.get('jsons/routes.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }

    service.sendCustomRequest = function(route,cb){
   //  	$http({
   //  			method: route.method,
   //              url: route.api
   //  		})
			// .success(function(data){
			// 		cb(data);
			// 	})
			// .error(function(err){
			// 	console.log(err);
			// })

			$http.get('jsons/routes.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }
		

    service.getSettings = function(data,cb){
    	//mehtod - post
    	//api - /api/settings/
    	//data - {from:number,limit:number,search:string}
			$http.get('jsons/settings.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }


    service.updateSetting = function(setting){
    	//mehtod - put
    	//api - /api/setting
    	//data - {setting:setting}
			$http.put('/api/setting',{setting:setting})
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }
		
    return service;
  })

  // <div class="dropdown">		
		// 								<button ng-click="country.checked=!country.checked" class="country_name" >
		// 									{{country.name}}
		// 									<img ng-if="country.regions.length>0" src="assets/images/angle-bottom.png" alt="v">
		// 								</button>
		// 								<ul   class="dropdown-menu" style="display:{{country.checked?'block':'none'}}">
		// 									<li  ng-repeat="region in country.regions">
		// 										<input class="checkbox-custom" ng-class="{'active':region.checked}" type="checkbox">
		// 										<label ng-click="vm.addCountry(region)" >{{region.name}}</label>
		// 										<ul ng-show="region.checked">
		// 											<li ng-repeat="city in region.cities" >
		// 												<input class="checkbox-custom" ng-class="{'active':city.checked}" type="checkbox">
		// 												<label ng-click="vm.addCountry(city)" >{{city.name}}</label>
		// 											</li>
		// 										</ul>
		// 									</li>
		// 								</ul>
		// 							</div>	    

	// <ul ng-show="country.checked" ng-repeat="region in country.regions" ng-init="region.checked=false">
	// 									<li class="bold" ng-click="region.checked=!region.checked">
	// 										{{region.name}}	
	// 									</li>
	// 									<li>
	// 										{{12}}
	// 									</li>
	// 									<li>
	// 										<div ng-if="region.isManaging">
	// 											<span class="added green">Добавлена</span>
	// 											<button ng-click="vm.removeFromManaging(region)" class="btn-gray"><i class="fa fa-close"></i></button>
	// 										</div>
	// 										<button ng-click="vm.addToManaging(region)" ng-if="!region.isManaging" class="btn-gray add"><i class="fa fa-plus"></i></button>
	// 									</li>
	// 								</ul>