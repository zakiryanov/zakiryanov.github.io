angular.module('admin_panel').controller('ticketsCtrl',function(myService,reklamodatelService,userService,$stateParams) {
	
	var vm = this;
	
	vm.limit = 25;
	vm.beginIndex=0;
	vm.amount=0;
	vm.searchText = '';
	vm.questions=[];
	vm.isCompany  = $stateParams.which=='company'?true:false;
	getQuestions();

	function getQuestions(){
		var service = vm.isCompany?reklamodatelService:userService;
		service.getQuestions({from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
			if(vm.beginIndex==0) vm.questions = [];
			vm.questions = vm.questions.concat(data.data);		
			vm.amount = data.amount;
		});
	}	

	vm.search = function() {
		myService.search(function() {
			vm.beginIndex=0;
			getQuestions();
		});
	}

	vm.getNewData = function(){
		if(vm.questions.length>=vm.amount) return;
		vm.beginIndex=vm.questions.length;
		getQuestions();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})