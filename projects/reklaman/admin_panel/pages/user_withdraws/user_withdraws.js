angular.module('admin_panel').controller('userWithdrawsCtrl',function(myService,userService,$stateParams,Notification) {
	
	var vm = this;

	vm.limit = 25;
	vm.beginIndex =0;
	vm.amount=0;
	vm.withdrawsStatuses=[];
	vm.withdraws=[];
	vm.filters = {};
	vm.allSelected = false;
	vm.searchText = "";
	vm.user_id = $stateParams.id?$stateParams.id:'';
	getWithdraws();

	userService.getWithdrawsStatuses(function(data){
		vm.withdrawsStatuses = data;
	})

		
	
	
	function getWithdraws(){
		userService.getWithdraws({filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},vm.user_id,function (data){
				if(vm.beginIndex==0) vm.withdraws = [];
				vm.withdraws = vm.withdraws.concat(data.data);
				vm.amount = data.amount;
		});	
	}

	vm.selectAll = function(){
			vm.allSelected=!vm.allSelected;
			for(var i=0;i<vm.withdraws.length;i++){
				vm.withdraws[i].checked = vm.allSelected;
			}	
	}

	vm.changeStatus  = function(withdraw,which){
		var i ;
		if(which=='accept') i = 1;
		else i =2;
		withdraw.status = vm.withdrawsStatuses[i].id;
		withdraw.statusName = vm.withdrawsStatuses[i].statusName;
		withdraw.statusText = vm.withdrawsStatuses[i].name;
		userService.changeWithdrawStatus(which,withdraw._id);
	}

	vm.changeStatuses = function(which){
		withdrawsId = [];
		vm.withdraws.forEach(function(i){
			if(i.checked) withdrawsId.push(i._id);			
		});
		if(withdrawsId.length==0) Notification.primary('Выберите выводы средств для подтверждения!')
		else userService.changeWithdrawsStatus(which,withdrawsId);
	}

	vm.getWithdrawInfo = function(id){
		vm.showModal = true;
		userService.getWithdrawInfo(id,function(data){
			console.log('data',data);
		});
	}

	vm.addToFilter = function(key,val){
		if(key) vm.filters[key] = val;
		vm.filter();	
	}

	vm.filter = function() {
		vm.beginIndex=0;
		getWithdraws();	
	}

	vm.search = function(){
		myService.search(vm.filter)
	}	

	vm.getNewData = function(){
		if(vm.withdraws.length>=vm.amount) return;
		vm.beginIndex=vm.withdraws.length;				
		getWithdraws();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})