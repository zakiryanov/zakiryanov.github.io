angular.module('admin_panel').controller('userUpdateCtrl',function(myService,userService,countriesService,$stateParams) {
	
	var vm = this;
	vm.countries = [];
	vm.lists=[];

	vm.limit = 25;
	vm.beginIndex = 0;

	countriesService.getCountries({},function(data){
		vm.countries = data;
	})

	myService.getListOptions(function(data){
		vm.lists = data;
	});	

	getUser();	
	
	function getUser(){
		userService.getUser($stateParams.id,function(data){
			vm.user = data;
		});	
	}

	vm.saveUser = function(){
		userService.saveUser(vm.user);
		window.history.back()
	}
	

	vm.changeUserInfo = function(which,newVal){
		vm.user[which] = newVal;
		if(which=='country') {
			vm.user.region = vm.user.country.regions?vm.user.country.regions[0]:{id:"0",name:"Без региона"};
			vm.user.city = vm.user.region.cities?vm.user.region.cities[0]:{id:"0",name:"Без города"};
		}
		else if(which=='region') vm.user.city = vm.user.region.cities?vm.user.region.cities[0]:{id:"0",name:"Без города"};
	}

})