angular.module('admin_panel').controller('usersCtrl',function(userService,myService,countriesService) {
	
	var vm = this;
	vm.isVisible = true;	
	vm.limit = 25;
	vm.beginIndex =0;
	vm.filters = {};
	vm.amount=0;
	vm.selectedCountryCount=0;
	vm.countries=[];
	vm.users=[];
	vm.searchText = "";
	vm.filters = {countries:[]}
	getUsers();

	myService.getListOptions(function(data){
		vm.lists = data;
	});

	countriesService.getCountries(function(data){
		vm.countries = data;
	})

	userService.getCounters(function(data) {
		vm.total_amount = data.total_amount;
		vm.enable_amount = data.enable_amount;
		vm.withdraw_amount = data.withdraw_amount;
	})

	
	function getUsers(){
		userService.getUsers({filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
			if(vm.beginIndex==0) vm.users = [];
			vm.users = vm.users.concat(data.data);
			vm.amount = data.amount;
		});	
	}	
	

	vm.clearFilters = function(){
		vm.filters = {zones:{countries:[],regions:[],cities:[]}};
		vm.selectAllZones();
	}

	vm.addToFilter = function(key,val){
		console.log(key,val);
		vm.filters[key]=val;
	}

	vm.selectAllZones = function() {
		vm.filters = {countries:[]};
		vm.showCountries=false;
		vm.selectedCountryCount=0;
	}
	
	vm.addCountry = function(place) {
		vm.filters.countries = [];
		place.checked=!place.checked;
		vm.selectedCountryCount=0;
		vm.countries.forEach(function(country,i) {
			if(country.checked){
				vm.selectedCountryCount++;
				var countryCopy = angular.copy(country);
				countryCopy.regionsSelected = [];
				vm.filters.countries.push(countryCopy);
				if(!country.regions) return;
				country.regions.forEach(function(region,j) {
					if(region.checked){
						vm.selectedCountryCount++;
						var regionCopy = angular.copy(region);
						regionCopy.citiesSelected = [];
						countryCopy.regionsSelected.push(regionCopy)
						if(!region.cities) return;
						region.cities.forEach(function(city) {
							if(city.checked) {
									vm.selectedCountryCount++;
									regionCopy.citiesSelected.push(city._id)
							}							
						})
					}
				})
			}
		})
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
		vm.beginIndex=vm.users.length;				
		getUsers();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})