angular.module('lk_reklamodatel').controller('lkBannerCreateCtrl',function($scope,$localStorage,bannerService,countriesService,myService,userService,$state,$stateParams) {
	
	var vm = this;

	vm.showModal = false;
	vm.cropper = {};
	vm.cropper.sourceImage = null;
	vm.creator_id = $localStorage.company.id;

	vm.countries = [];
	vm.lists=[];
	vm.gender={};
	vm.banner = {"display_days":
	[
	{"id":0,"name":"Понедельник","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":1,"name":"Вторник","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":2,"name":"Среда","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":3,"name":"Четверг","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":4,"name":"Пятница","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":5,"name":"Суббота","checked":true,"from":Date.now(),"to":Date.now()},
	{"id":6,"name":"Воскресенье","checked":true,"from":Date.now(),"to":Date.now()}
	]};
	vm.showCountries=false;
	vm.selectedCountryCount=0;
	vm.filters = {zones:{countries:[],regions:[],cities:[]}};
	vm.audienceCount=0;
	vm.company = $localStorage.company;

	myService.getListOptions(function(data){
		vm.gender = data.gender;
	})

	countriesService.getCities({},function(data){
		vm.cities = data;
	})

	bannerService.getStatuses(function(data){
		vm.statuses = data;
	});	

	function getAudience() {
		userService.getUsers({filters:vm.filters},function(data){
			vm.audienceCount = data.amount;
		});			
	}	
	
	countriesService.getCountries({},function(data){
		vm.countries = data;
		vm.countries.forEach(function(country) {
			country.checked = false;
			if(!country.retions)  return;
			country.regions.forEach(function(region){
				region.checked=false
				if(!region.citites) return;
				region.cities.forEach(function(city) {
					city.checked = false;
				})							
			})
		})	
	})



	vm.saveBanner = function(){
		bannerService.saveBanner(vm.banner);
		$state.go('reklamodatel_banners');
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
		bannerService.sendToModerationNew(vm.creator_id, vm.banner);
		window.history.back();
	}

	vm.saveAsDraft = function(){
		bannerService.saveAsDraftNew(vm.creator_id,vm.banner);
		window.history.back();
	}

})