angular.module('admin_panel').controller('bannerUpdateCtrl',function(Upload,bannerService,countriesService,myService,userService,$state,$stateParams) {
	
	var vm = this;
	vm.showModal = false;
	vm.cropper = {};
	vm.cropper.sourceImage = null;
	vm.countries = [];
	vm.lists=[];
	vm.gender={};
	vm.showCountries=false;
	vm.selectedCountryCount=0;
	vm.filters = {zones:{countries:[],regions:[],cities:[]}};
	vm.audienceCount=0;

	myService.getListOptions(function(data){
		vm.gender = data.gender;
	})

	countriesService.getCities({},function(data){
		vm.cities = data;
	})

	bannerService.getStatuses(function(data){
		vm.statuses = data;
	});	

	getBanner();


	function getAudience() {
		userService.getUsers({filters:vm.filters},function(data){
			vm.audienceCount = data.amount;
		});			
	}	
	
	function getBanner(){
		bannerService.getBanner($stateParams.id,function(data){
			vm.banner=data;
			vm.filters = {zones:vm.banner.zones,
							gender:vm.banner.gender,
							age_from:vm.banner.age_from,
							age_to:vm.banner.age_to
			};
			getAudience();

			countriesService.getCountries({},function(data){
				vm.countries = data;
				vm.countries.forEach(function(country) {
					if(vm.banner.zones.countries.indexOf(country.id)>-1) {
						country.checked=true;
						vm.selectedCountryCount++;
						if(!country.regions) return;
						country.regions.forEach(function(region){
							if(vm.banner.zones.regions.indexOf(region.id)>-1){
								region.checked=true;
								vm.selectedCountryCount++;
								if(!region.cities) return;
								region.cities.forEach(function(city) {
									if(vm.banner.zones.cities.indexOf(city.id)>-1) {
										city.checked = true;
										vm.selectedCountryCount++;
									}else city.checked = false
								})	
							}else {
								region.checked = false;
							}
						})
					}else {
						country.cheked=false;
					}
				})	
			})			
		});	

	}

	vm.changeInfo = function(which,newVal,updateAudienceCounter){
		vm.banner[which] = newVal;
		if(updateAudienceCounter){
			vm.filters[which]=newVal;
			getAudience();	
		}
	}


	vm.setDayChecked = function(bool) {
		vm.banner.display_days.forEach(function(day) {
			day.checked = bool;
		})
	}

	vm.selectAllZones = function() {
		vm.filters.zones = {countries:[],regions:[],cities:[]};
		vm.banner.zones ={countries:[],regions:[],cities:[]};
		vm.showCountries=false;
		vm.selectedCountryCount=0;
		getAudience();
	}
	
	vm.addCountry = function(place) {
		place.checked=!place.checked;
		vm.selectedCountryCount=0;
		vm.filters.zones = {countries:[],regions:[],cities:[]};
		vm.countries.forEach(function(country) {
			if(country.checked){
				vm.filters.zones.countries.push(country.id);
				if(!country.regions) return;
				country.regions.forEach(function(region) {
					if(region.checked){
						vm.filters.zones.regions.push(region.id);
						if(!region.cities) return;
						region.cities.forEach(function(city) {
							if(city.checked) vm.filters.zones.cities.push(city.id);							
						})
					}
				})
			}
		})
		vm.selectedCountryCount = vm.filters.zones.countries.length+vm.filters.zones.regions.length+vm.filters.zones.cities.length;
		vm.banner.zones = vm.filters.zones;
		getAudience();
	}

	vm.sendToModeration = function() {
		bannerService.sendToModeration(vm.banner);
		window.history.back();
	}

	vm.saveAsDraft = function(){
		bannerService.saveAsDraft(vm.banner);
		window.history.back();
	}

})