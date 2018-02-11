angular.module('admin_panel').controller('registrationsRequestsCtrl',function(reklamodatelService) {
	
	var vm = this;

	vm.limit = 25;
	vm.beginIndex =0;
	vm.amount=0;
	vm.requests=[];

	getRequests();

	
	function getRequests(){
		reklamodatelService.getRequests({from:vm.beginIndex,limit:vm.limit},function(data){
			vm.requests =vm.requests.length==0?data.requests:vm.requests.concat(data.requests);
			vm.amount = data.amount;
		});	
	}

	vm.delete = function(request){
		vm.requests.splice(vm.requests.indexOf(request),1);
		reklamodatelService.deleteFromRequests(request,false);
	}

	vm.add = function(request) {
		vm.requests.splice(vm.requests.indexOf(request),1);
		reklamodatelService.deleteFromRequests(request,true);

	}

	vm.read = function (request) {
		vm.requests.splice(vm.requests.indexOf(request),1);
		reklamodatelService.makeRead(request);
	}

	vm.getNewData = function(){
		if(vm.requests.length>=vm.amount) return;
		vm.beginIndex+=vm.requests.length+1;				
		getRequests();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})