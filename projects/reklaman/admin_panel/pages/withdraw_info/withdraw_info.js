angular.module('admin_panel').controller('withdrawInfoCtrl',function(userService,$stateParams) {
	
	var vm = this;
	
	userService.getWithdrawInfo($stateParams.id,function(data){
		vm.withdraw = data;
	})

	vm.sendRequestToYandex = function(){
			userService.recheckResult($stateParams.id);
			vm.confirm=false;			
	}
	
})