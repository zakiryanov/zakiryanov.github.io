angular.module('lk_reklamodatel').controller('accountSettingsCtrl',function($localStorage,reklamodatelService,$localStorage,$state,$stateParams) {
	
	var vm = this;
	vm.showError = false;
	
	reklamodatelService.getCompany($localStorage.company.id,function(data) {
		vm.company = data;
	})

	vm.update = function () {
		vm.showError = false;
		if(vm.password!=vm.password2){
			vm.showError = true;
			return;
		}
		vm.company.password=vm.password;
		reklamodatelService.update(vm.file,vm.company);
	}

	vm.updateTwo = function(){
		reklamodatelService.update({},vm.company);
	}

})
