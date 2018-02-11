angular.module('lk_reklamodatel').controller('myBalanceCtrl',function($localStorage,reklamodatelService) {
	
	var vm = this;
	vm.showModalOne = false;
	vm.showModalTwo = false;	
	vm.company = $localStorage.company;
	vm.newBilling = 0;

	reklamodatelService.getCompany(vm.company.id,function(data) {
		vm.company = data;
	})

	reklamodatelService.getBillings(vm.company.id,function(data) {
		vm.billings = data;
	})

	vm.pay = function () {
		//some logic
	}

	vm.goToCreateBilling = function() {
		if(vm.newBilling<=0 || typeof vm.newBilling!=='number') return;
		vm.showModalOne = false;
		vm.showModalTwo = true;
	}

	vm.createBilling = function() {
		vm.showModalTwo = false;
		//some logic
	}
	vm.prevent = function(e) {
			e.stopPropagation();
	}

	

})