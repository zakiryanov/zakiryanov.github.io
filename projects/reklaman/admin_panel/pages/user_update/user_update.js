angular.module('admin_panel').controller('userUpdateCtrl',function($filter,myService,userService,countriesService,$stateParams) {
	
	var vm = this;
	vm.countries = [];
	vm.lists=[];
	vm.limit = 25;
	vm.beginIndex = 0;

	myService.getListOptions(function(data){
		vm.lists = data;
	});	

	getUser();	
	
	function getUser(){
		userService.getUser($stateParams.id,function(data){
			vm.user = data;
			countriesService.getCountries(function(data){
				vm.countries = data;
				vm.userCity = vm.user.city;
				vm.countries.forEach(function(country){
					if(vm.user.city.country==country._id){
						vm.user.country = country;
						if(!vm.user.country.regions) return;
						vm.user.country.regions.forEach(function(region){
							if(vm.user.city.region==region._id) vm.user.region = region; 
						})
					}
				})
			})
		});	
	}

	vm.saveUser = function(){
		userService.saveUser(vm.user);
	}
	

	vm.changeUserInfo = function(which,newVal){
		vm.user[which] = newVal;
		console.log('user',vm.user)
		if(which=='country') {
			vm.user.region = vm.user.country.regions?vm.user.country.regions[0]:{id:"0",name:"Без региона"};
			vm.user.city = vm.user.region.cities?vm.user.region.cities[0]:{id:"0",name:"Без города"};
		}
		else if(which=='region') vm.user.city = vm.user.region.cities?vm.user.region.cities[0]:{id:"0",name:"Без города"};
	}

})