angular.module('admin_panel').controller('settingsCtrl',function($scope,apiDoc, myService,countriesService,settingsService) {
	
	var vm = this;
	
	vm.modal_limit = 5;
	vm.modal_beginIndex =0;
	vm.limit = 25;
	vm.beginIndex=0;
	vm.amount=0;
	vm.countries=[];
	vm.settings=[];
	vm.currentRoute = {};
	vm.activeButton  = "";
	vm.searchModal = "";
	vm.searchModalCities="";
	vm.searchText = "";
	vm.editingSetting = {};

	apiDoc.init($scope);

	settingsService.getRoutes(function(data){
		vm.routes = data;
		vm.currentRoute = data[0];
	})

	getVkCountries();
	getSettings();

	countriesService.getAllCountries(function(data){
		vm.managing_countries = data.data;		
	});

	function getVkCountries(){
		countriesService.getVkCountries(function(data){
			if(vm.modal_beginIndex==0) vm.countries = [];
			vm.countries = vm.countries.concat(data.data);		
		});
	}
	

	function getSettings(){
		settingsService.getSettings({from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
			if(vm.beginIndex==0) vm.settings = [];
			vm.settings = vm.settings.concat(data.data);					
			vm.amount = data.amount;
		});
	}

	vm.search = function() {
		myService.search(function() {
			vm.beginIndex=0;
			getSettings();
		});
	}

	function openChildList(zone){
		if(!zone.exist) return false;
		zone.checked=!zone.checked;
		if(!zone.checked) return false;
		zone.childrenLoading = true;
		return true
	}

	vm.getRegionsByVkCountry = function(country) {
		if(!openChildList(country)) return
		countriesService.getRegionsByVkCountry(country.vk_id,function(regions){
			country.regions = regions;
			country.childrenLoading = false;
		})
	}

	vm.getVkCities = function(region,country_vk_id){
		openChildList(region)
		countriesService.getVkCities(region.vk_id,country_vk_id,function(cities){
			region.cities = cities;
			region.childrenLoading = false;
		})
	}

	vm.showUpdatingModal = function(setting){
		vm.showSettingsModal = true;
		vm.editingSetting = angular.copy(setting);
	}

	vm.updateSetting = function(){
		vm.showSettingsModal=false;
		settingsService.updateSetting(vm.editingSetting,function(){
				vm.settings.forEach(function(setting,i){
					if(setting._id == vm.editingSetting._id) vm.settings[i] = vm.editingSetting
				})
		});
	}

	vm.changeZoneStatus = function(which){
		vm.activeButton = which;
		vm.managing_countries.forEach(function(zone){
			zone.enable = which=='block'?false:true;
		});
		countriesService.changeStatus(which=='block'?false:true);
	}

	vm.addCountryToManaging = function(country){
		countriesService.addToManaging(country,'country',function(newCountry) {
			country.exist = true;
			vm.managing_countries.push(newCountry);
		});		
	}

	vm.addRegionToManaging = function(region,country_vk_id){
		vm.managing_countries.forEach(function(country,i) {
			if(country.vk_id==country_vk_id){		
				region.country = country._id;
				countriesService.addToManaging(region,'region',function(newRegion) {
					region.exist = true;
					vm.managing_countries[i].regions.push(newRegion);
				});
			}
		})
	}

	vm.addCityToManaging = function(city,region_vk_id,country_vk_id){
		vm.managing_countries.forEach(function(country){
			if(country.vk_id == country_vk_id){
				city.country = country._id;
				country.regions.forEach(function(region){
					if(region.vk_id == region_vk_id){
						city.region = region._id;
					}
				})
			}
		})
		countriesService.addToManaging(city,'city',function(newCity) {
			city.exist = true;
		});
	}

	vm.removeFromManaging = function(zone,which,country_vk_id){
		switch(which){
			case 'country':
			zone.regions = [];
			zone.exist = false;
			vm.managing_countries.forEach(function(country,i) {
				if(country.vk_id==zone.vk_id) vm.managing_countries.splice(i,1);
			})
			break;
			case 'region':
			zone.cities = [];
			vm.managing_countries.forEach(function(country,i) {
				if(country.vk_id==country_vk_id) {	
					country.regions.forEach(function(region,i){
						if(region.vk_id==zone.vk_id) country.regions.splice(i,1);
					})
				}
			})
			break;						
		}
		zone.exist = false;
		zone.checked = false;
		countriesService.removeFromManaging(zone.vk_id,which);
	}

	vm.changeRoute = function(route){
		$scope.selectedRequest=route;
		$scope.changeRoute($scope);
	}


	vm.getNewData = function(){
		if(vm.settings.length>=vm.amount) return;
		vm.beginIndex=vm.settings.length;
		getSettings();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})