angular.module('admin_panel').controller('bannersCtrl',function($state,reklamodatelService,myService,bannerService,$stateParams,userService) {
	
	var vm = this;

	vm.limit = 5;
	vm.beginIndex =0;
	vm.amount=0;
	vm.banners=[];
	vm.allSelected = false;
	vm.isButtonsActive=0;
	vm.searchText = "";
	vm.company_id = $stateParams.id?$stateParams.id:undefined;

	getBanners();
	getStatistics()

	function getBanners(){
		var data = vm.company_id?{id:vm.company_id,from:vm.beginIndex,limit:vm.limit,search:vm.searchText}:{from:vm.beginIndex,limit:vm.limit,search:vm.searchText};
		bannerService.getBanners(data,function (data){
			if(vm.beginIndex==0) vm.banners = [];
			vm.banners = vm.banners.concat(data.data);
			vm.amount = data.amount;
		});
	}

	function getStatistics(){
		reklamodatelService.getStatistics(function(data){
			vm.statistics = data;
		})
	}

	vm.goToCompanyBanners = function (company_id) {
		$state.go('banners',{id:company_id});
	}

	vm.check = function(banner,e) {
		e.preventDefault();
		banner.checked = !banner.checked;
		if(banner.checked) vm.isButtonsActive+=1;
		else vm.isButtonsActive-=1;
		console.log(vm.isButtonsActive)
		if(vm.isButtonsActive==0) vm.allSelected = false;
		else if(vm.isButtonsActive==vm.banners.length) vm.allSelected = true;
	}

	vm.selectAll = function(bool){
		vm.allSelected=bool;
		if(vm.allSelected) vm.isButtonsActive = vm.banners.length;
		else vm.isButtonsActive = 0;
		for(var i=0;i<vm.banners.length;i++){
			vm.banners[i].checked = bool;
		}
	}

	vm.copy  = function(banner){
		if(vm.isButtonsActive==0) return;
		var bannersToCopy = [];
		for(var i=0;i<vm.banners.length;i++){
			if(vm.banners[i].checked){
				bannerToCopy = angular.copy(vm.banners[i]);
				bannerToCopy.name = bannerToCopy.name + "- Копия";
				bannerToCopy.checked = false;
				bannersToCopy.push(bannerToCopy);
			}
		}
		bannerService.copy(bannersToCopy,function(newBanners) {
			for(var i=0;i<newBanners.length;i++){
				vm.banners.unshift(newBanners[i]);
			}

		});
	}

	vm.changeStatus = function(banner,status,statusName,statusText){
		banner.statusName = statusName;
		banner.status = status;
		banner.statusText = statusText;
		if(statusName=='deleted') vm.banners.splice(vm.banners.indexOf(banner),1);	
		bannerService.changeStatus(banner)
	}

	vm.changeStatuses = function(status,statusName,statusText){
		if(vm.isButtonsActive==0) return;
		for(var i=0;i<vm.banners.length;i++){
			if(vm.banners[i].checked){
				vm.changeStatus(vm.banners[i],status,statusName,statusText)
			}
		}
	}

	vm.changeAcceptingStatus = function(banner,bool) {
		banner.accepted=bool;
		vm.banners.splice(vm.banners.indexOf(banner),1);
		if(banner.checked) vm.isButtonsActive-=1;
		if(vm.isButtonsActive==0) vm.allSelected = false;
		bannerService.update([banner]);
	}

	vm.search = function () {
		myService.search(function() {
			vm.beginIndex = 0;
			getBanners();
		});		
	}

	vm.getNewData = function(){
		if(vm.banners.length>=vm.amount) return;
		vm.beginIndex=vm.banners.length;				
		getBanners();
	}
	
	vm.changeLimit = function(newLimit){
		vm.limit = newLimit;			
	}	
})