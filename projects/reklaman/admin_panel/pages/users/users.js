angular.module('admin_panel').controller('usersCtrl',function(userService,myService,countriesService) {
	
	var vm = this;
	vm.isVisible = true;	
	vm.limit = 25;
	vm.beginIndex =0;
	vm.filters = {zones:{countries:[],regions:[],cities:[]}};
	vm.amount=0;
	vm.selectedCountryCount=0;
	vm.countries=[];
	vm.users=[];

	getUsers();

	myService.getListOptions(function(data){
		vm.lists = data;
	});

	countriesService.getCountries({},function(data){
		vm.countries = data;
	})

	userService.getCounters(function(data) {
		vm.total_amount = data.total_amount;
		vm.withdraws = data.withdraws;
	})
	
	function getUsers(){
		userService.getUsers({filters:vm.filters,from:vm.beginIndex,limit:vm.limit},function(data){
			if(vm.beginIndex==0) vm.users = [];
			vm.users = vm.users.concat(data.users);
			vm.amount = data.amount;
		});	
	}	
	

	vm.clearFilters = function(){
		vm.filters = {zones:{countries:[],regions:[],cities:[]}};
		vm.selectAllZones();
	}

	vm.addToFilter = function(key,val){
		vm.filters[key]=val;
	}

	vm.selectAllZones = function() {
		vm.filters.zones = {countries:[],regions:[],cities:[]};
		vm.showCountries=false;
		vm.selectedCountryCount=0;
	}
	
	vm.addCountry = function(place) {
		place.checked=!place.checked;
		vm.selectedCountryCount=0;
		vm.filters = {zones:{countries:[],regions:[],cities:[]}};
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
	}

	vm.filter = function(){
		vm.showCountries = false;
		vm.beginIndex=0;
		getUsers();
	}

	vm.search = function() {
		myService.search(vm.filter);
	}	

	
	vm.getNewData = function(){
		if(vm.users.length>=vm.amount) return;
		vm.beginIndex=vm.users.length+1;				
		getUsers();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})