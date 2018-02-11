angular.module('lk_reklamodatel').controller('companyCtrl',function(ticketService,$localStorage,bannerService) {
	var vm = this;
	vm.company = $localStorage.company;
	vm.showNotification = true;
	vm.showModal = false;


	bannerService.getBannersOfCompany({id:vm.company.id,from:0,limit:100,search:''},function(data) {
		vm.banners = data.banners;
	})

	ticketService.getCompanyTickets({id:vm.company.id,search:''},function(data) {
		vm.tickets = data;
	})

	vm.closeTicket = function(ticket) {
		vm.tickets.splice(vm.tickets.indexOf(ticket),1);
		ticketService.close(ticket.id);
	}

})