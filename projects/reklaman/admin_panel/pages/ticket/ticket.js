angular.module('admin_panel').controller('ticketCtrl',function($localStorage,ticketService,$stateParams) {
	
	var vm = this;
	vm.limit =3 ;
	vm.messageText = "";
	vm.admin = $localStorage.admin;
	vm.isShowMore = true;
	vm.isCompany = $stateParams.which=='company'?true:false;

	ticketService.getStatuses(function(data) {
		vm.statuses = data;
	})

	function callBack(data){
		vm.ticket = data.data;
	}

	if($stateParams.isTicketId == 'true')	ticketService.getTicket($stateParams.id,$stateParams.which,callBack)
	else	ticketService.getTicketWithoutTicketId($stateParams.id,$localStorage.admin._id,$stateParams.which,callBack)

	vm.changeTicketStatus = function(digit,name){
		vm.ticket.status = ""+digit;
		vm.ticket.statusText = name;
	}

	vm.save = function() {
		ticketService.update(vm.ticket,$stateParams.which);
	}

	vm.createMessage = function() {
		if(vm.messageText=="") return;	
		var message = {admin:vm.admin._id,text:vm.messageText};
		var comment = angular.copy(message);
		comment.admin = vm.admin;
		comment.created = Date.now();
		vm.ticket.comments.push(comment);
		vm.messageText = "";
		ticketService.createMessage(vm.ticket.id,message,$stateParams.which);
	}

	vm.back = function() {
		window.history.back()
	}
})