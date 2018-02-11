angular.module('admin_panel').controller('companyAccountCtrl',function(Notification,$stateParams,$localStorage,reklamodatelService,$localStorage,$state,$stateParams) {
	
	var vm = this;
	var empty = [{name:'name',title:'название компаниии'},
	{name:'email',title:'E-mail'},
	{name:'phone',title:'номер телефона'}];
	vm.company = {payerInfo:{}};
	vm.company_id = $stateParams.id;

	
	if(vm.company_id){
		reklamodatelService.getCompany(vm.company_id,function(data) {
			vm.company = data;
		})
	}

	vm.update = function(){
		if(checkPassword()) return;
		if(haveEmptyFields()) return;
		if(!validateEmail(vm.company.email)){
			Notification.error({title:"Ошибка",message:"E-mail введен не правильно"})
			return;
		}
		vm.company.password = vm.password;
		if(!vm.company_id) reklamodatelService.create(vm.file,vm.company);
		else reklamodatelService.update(vm.file,vm.company);
	}

	function haveEmptyFields(){
		for(var i=0;i<empty.length;i++){
			var val = vm.company[empty[i].name];
			if(val==undefined || val==null || val==""){
				Notification.error({title:"Ошибка",message:"Поле '"+empty[i].title+"' не должно быть пустым"})
				return true;
			}
		}
		return false;		
	}

	function validateEmail(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	function checkPassword(){
		if(vm.password!=vm.password2){
			Notification.error({title:"Ошибка",message:"Пароли не совпадают !"})
			return true;
		}
		vm.company.password=vm.password;
		return false;
	}

})
