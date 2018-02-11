angular.module('admin_panel').controller('reklamodateliCtrl',function($localStorage,$state,$stateParams,myService,reklamodatelService) {
	
	var vm = this;

	vm.limit = 25;
	vm.beginIndex =0;
	vm.companies = [];
	vm.searchText = "";
	vm.payment_id = $stateParams.id;


	getCompanies();

	function getCompanies(){
		reklamodatelService.getCompanies({from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
			if(vm.beginIndex==0) vm.companies = [];
			vm.companies = vm.companies.concat(data.companies);
			vm.amount = data.amount;
		})
	}

	vm.authorizeAsCompany = function(id){
		reklamodatelService.authorizeAsCompany(id,function(company){
			$localStorage.company = company;
			$state.go('company')
		})
	}


		vm.total_amount = 243;


	reklamodatelService.getBannersOnModerationCount(function(data) {
		vm.bannersOnModeration = data.data;
	})

	reklamodatelService.getRegistrationsRequestsCount(function(data) {
		vm.registrationsRequests = data.data;
	})

	vm.getNewData = function(){
		if(vm.companies.length>=vm.amount) return;
		vm.beginIndex=vm.companies.length;				
		getCompanies();
	}

	vm.search = function(){
		myService.search(function() {
			vm.beginIndex = 0;
			getCompanies();
		})
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})