angular.module('lk_reklamodatel')
.controller('mainLkCtrl',function($http,$localStorage,$cookies,reklamodatelService,ticketService) {
	var vm = this;
	vm.compressed=false;
	vm.activeItem=1;
	vm.newMessages=0;

		vm.authorize = function(){
			reklamodatelService.authorize({company: {
				email: 'amabilis@gmail.com',
				password: 'qwe'
			}}
			,function(data){
				$localStorage.token = data.token;
				$http.defaults.headers.common.Authorization = data.token;
				$cookies.put('authToken',data.token,{ path: '/'});
				location.reload();
			})
		} 

		reklamodatelService.getCompanyByCompany(function(data){
			vm.company = data;
			$localStorage.company = vm.company;
		})

		ticketService.getCompanyNewTicketsCount(function(data) {
				vm.newMessages = data;
		})
})