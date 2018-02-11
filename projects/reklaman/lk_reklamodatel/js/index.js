angular.module('lk_reklamodatel')
.controller('mainLkCtrl',function($localStorage,reklamodatelService,ticketService) {
	var vm = this;
	vm.compressed=false;
	vm.activeItem=1;
	vm.newMessages=0;

	//data from signin/signup
	vm.company = {
					"id":1,
					"name":"Kentucky Fried Chicken",
					"photo":"assets/images/kfc.png",
					"email":"anuarbekzakirianov97@gmail.com",
					"phone":"+7 ( 856 ) 035 - 52- 57",
					"registrated_at":"2017-05-15 19:34",
					"balance":27000,
					"legacy_address":"Россиия, Татарстан, Набережные Челны, ул. Усманова, дом 33",
					"mail_address":"Россиия, Татарстан, Набережные Челны, ул. Усманова, дом 33",
					"iin":"1650535912",
					"kpp":"16503359124546",
					status:{id:12,name:"Пользователь"}
				};
	
	$localStorage.company = vm.company;
	ticketService.getCompanyTickets(vm.company.id,function(data) {
		data.forEach(function(ticket) {
			vm.newMessages+=ticket.new_messages;
		})
	})


})