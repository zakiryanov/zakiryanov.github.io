angular.module('admin_panel').controller('paymentsCtrl',function($stateParams,myService,reklamodatelService) {
	
	var vm = this;
	vm.limit = 25;
	vm.beginIndex = 0;
	vm.searchText = "";
	vm.filters = {};
	vm.payments = [];	
	vm.totalSum = 0;
	vm.sort = {'created':-1}
	vm.company_id = $stateParams.id;

	function callBack(data){
				if(vm.beginIndex==0) vm.payments = [];
				vm.payments = vm.payments.concat(data.data);			
				vm.amount = data.amount;
	}

	function getPayments(){
		if(!vm.company_id)	reklamodatelService.getPayments({sort:vm.sort,filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},callBack)
		else	reklamodatelService.getPaymentsOfCompany(vm.company_id,{sort:vm.sort,filters:vm.filters,from:vm.beginIndex,limit:vm.limit,search:vm.searchText},callBack)
	}

	getPayments()

	reklamodatelService.getPaymentsTotalSum(vm.company_id,function(data){
		vm.totalSum = data[0].totalSum
	})

	reklamodatelService.getPaymentsStatuses(function(data){
		vm.statuses = data;
	})

	vm.getNewData = function(){
		if(vm.payments.length>=vm.amount) return;
		vm.beginIndex	=vm.payments.length;				
		getPayments();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}

	vm.acceptPayment = function(payment,bool){
		if(bool){
			reklamodatelService.acceptPayment(payment.id);
			payment.completedAt = Date.now();
			payment.status=1;
		}else{
			reklamodatelService.declinePayment(payment.id);
			vm.payments.splice(vm.payments.indexOf(payment),1);
			vm.amount--;
		}		
	}

	vm.changeSort = function(value){
		if(vm.sort.hasOwnProperty(value)) vm.sort[value] *= -1;
		else {
			vm.sort = {};
			vm.sort[value] = -1;
		}		
		vm.filter();
	}
	
	vm.filter = function(){
		vm.beginIndex=0;
		getPayments();
	}

	vm.search = function () {
		myService.search(vm.filter)		
	}
})