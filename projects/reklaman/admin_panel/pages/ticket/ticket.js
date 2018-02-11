angular.module('admin_panel').controller('ticketCtrl',function($localStorage,ticketService,$stateParams) {
	
	var vm = this;
	vm.limit =3 ;
	vm.messageText = "";
	vm.admin = $localStorage.admin;
	vm.isShowMore = true;

	ticketService.getStatuses(function(data) {
		vm.statuses = data;
	})

	ticketService.getTicket(vm.admin.id,$stateParams.id,function(data) {
		vm.ticket = data;
	})

	vm.save = function() {
		ticketService.update(vm.ticket);
	}

	vm.createMessage = function() {
		if(vm.messageText=="") return;	
		var message = {from:vm.admin,to:$stateParams.id,text:vm.messageText,created_at:Date.now()};
		vm.ticket.messages.unshift(message);
		vm.messageText = "";
		ticketService.createMessage(vm.ticket.id,message);
	}

	vm.back = function() {
		window.history.back()
	}

})