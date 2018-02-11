angular.module('lk_reklamodatel').controller('companyCtrl',function(reklamodatelService,ticketService,$localStorage,bannerService) {
	var vm = this;
	vm.company = $localStorage.company;
	vm.showNotification = true;
	vm.showModal = false;

	reklamodatelService.getStatistics(function(data){
			vm.statistics = data;
		})

	bannerService.getBannersByCompany({from:0,limit:null,search:''},function(data) {
		vm.banners = data;
	})

	ticketService.getCompanyTickets({search:''},function(data) {
		console.log('tickets',data);
		vm.tickets = data;
	})

	vm.closeTicket = function(ticket) {
		vm.tickets.splice(vm.tickets.indexOf(ticket),1);
		ticketService.close(ticket.id);
	}

})