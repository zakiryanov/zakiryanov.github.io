angular.module('lk_reklamodatel').controller('lkTicketCtrl',function($localStorage,ticketService,$stateParams) {
	
	var vm = this;
	vm.limit =3 ;
	vm.messageText = "";
	vm.company = $localStorage.company;

	ticketService.getStatuses(function(data) {
		vm.statuses = data;
	})

	ticketService.getTicketById($stateParams.id,vm.company.id,function(data) {
		vm.ticket = data;
		vm.admin = data.admin;
	})

	vm.save = function() {
		ticketService.update(vm.ticket);
	}

	vm.createMessage = function() {
		if(vm.messageText=="") return;	
		var message = {from:vm.company.id,to:vm.admin.id,text:vm.messageText};
		message.from.role = vm.company.status.name;
		message.created_at = Date.now();
		vm.ticket.messages.unshift(message);
		vm.messageText = "";
		ticketService.createMessage(vm.ticket.id,message);
	}

	vm.back = function() {
		window.history.back()
	}

})