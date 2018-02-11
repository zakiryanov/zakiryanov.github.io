angular.module('admin_panel').controller('userWithdrawsCtrl',function(userService,$stateParams) {
	
	var vm = this;

	vm.limit = 25;
	vm.beginIndex =0;
	vm.amount=0;
	vm.withdrawsStatuses=[];
	vm.withdraws=[];
	vm.filters = {};
	vm.allSelected = false;
	vm.searchText = "";
	vm.user_id = $stateParams.id;
	var timeout;

	getWithdraws();

	userService.getWithdrawsStatuses(function(data){
		vm.withdrawsStatuses = data;
	})
	
	function getWithdraws(){
		if(vm.user_id){
			userService.getUserWithdraws({filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
				if(vm.beginIndex==0) vm.withdraws = [];
				vm.withdraws = vm.withdraws.concat(data.withdraws);
				vm.amount = data.amount;
			});	
		}else{
			userService.getWithdraws({filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},function(data){
				if(vm.beginIndex==0) vm.withdraws = [];
				vm.withdraws = vm.withdraws.concat(data.withdraws);
				vm.amount = data.amount;
			});	
		}		
	}

	vm.selectAll = function(){
		if(vm.allSelected){
			vm.allSelected=false;
			for(var i=0;i<vm.withdraws.length;i++){
				vm.withdraws[i].checked = false;
			}
		}else{
			vm.allSelected=true;
			for(var i=0;i<vm.withdraws.length;i++){
				vm.withdraws[i].checked = true;
			}
		} 
	}

	vm.changeStatus  = function(withdraw,which){
		if(which=='accept') withdraw.status = {id:2,name:"Завершено"};
		else withdraw.status ={id:3,name:"Отклонено"};
		userService.changeWithdraw(withdraw);
	}

	vm.changeStatuses = function(which){
		vm.withdraws.forEach(function(i){
			if(i.checked) vm.changeStatus(i,which);			
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
		if (timeout) {  
			clearTimeout(timeout);
		}
		timeout = setTimeout(function() {
			vm.filter();
		}, 200);
	}	

	vm.getNewData = function(){
		if(vm.withdraws.length>=vm.amount) return;
		vm.beginIndex=vm.withdraws.length+1;				
		getWithdraws();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})