angular.module('admin_panel').controller('massNotificationsCtrl',function($stateParams,myService,ticketService) {
	
	var vm = this;
	
	vm.limit = 25;
	vm.beginIndex=0;
	vm.amount=0;
	vm.questions=[];
	vm.searchText = "";
	vm.which = $stateParams.which;
	if(vm.which!=='company' && vm.which!=='user') window.history.back();

	getNotifications();

	function getNotifications(){
		ticketService.getNotifications({from:vm.beginIndex,limit:vm.limit,search:vm.searchText,which:vm.which},function(data){
			if(vm.beginIndex==0) vm.questions = [];
			vm.questions = vm.questions.concat(data.questions);
			vm.amount = data.amount
		});
	}

	vm.search = function () {
		myService.search(function() {
			vm.beginIndex = 0;
			getNotifications();
		});
	}

	vm.getNewData = function(){
		if(vm.questions.length>=vm.amount) return;
		vm.beginIndex = vm.questions.length+1;
		getNotifications();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})