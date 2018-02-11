angular.module('admin_panel')
.controller('mainAdminCtrl',function($http,myService,$rootScope,$localStorage,myService,reklamodatelService,userService,$cookies) {
	
	var vm = this;
	vm.compressed=false;
	vm.activeItem=1;

	reklamodatelService.getQuestionsCounter(function(data){
		vm.companyQuestionsCounter = data;
	});

	userService.getQuestionsCounter(function(data){
		vm.userQuestionsCounter = data;
	});

	vm.authorizeAsAdmin = function(){
		myService.authorizeAsAdmin({company: {
			email: 'root@reklaman.ru',
			password: 'root'
		}}
		,function(data){
			$localStorage.token = data.token;
			$http.defaults.headers.common.Authorization = data.token;
			$cookies.put('authToken',data.token,{ path: '/'});
			location.reload();
		})
	} 

	myService.getAdmin(function(data){
		vm.admin = data;
		$localStorage.admin = vm.admin;
	})



})