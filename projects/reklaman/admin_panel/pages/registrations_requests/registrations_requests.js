angular.module('admin_panel').controller('registrationsRequestsCtrl',function(reklamodatelService) {
	
	var vm = this;

	vm.limit = 25;
	vm.beginIndex =0;
	vm.amount=0;
	vm.requests=[];

	getRequests();

	
	function getRequests(){
		reklamodatelService.getRequests({from:vm.beginIndex,limit:vm.limit},function(data){
			vm.requests =vm.beginIndex==0?data.data:vm.requests.concat(data.data);
			vm.amount = data.amount;
		});	
	}

	vm.delete = function(request){
		vm.requests.splice(vm.requests.indexOf(request),1);
		reklamodatelService.declineRequest(request);
		vm.amount--;
	}

	vm.add = function(request) {
		vm.requests.splice(vm.requests.indexOf(request),1);
		reklamodatelService.acceptRequest(request);
		vm.amount--;
	}

	vm.getNewData = function(){
		if(vm.requests.length>=vm.amount) return;
		vm.beginIndex=vm.requests.length;				
		getRequests();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})