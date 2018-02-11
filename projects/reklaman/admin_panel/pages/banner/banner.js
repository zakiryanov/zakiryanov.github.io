angular.module('lk_reklamodatel').controller('apBannerCtrl',function(reklamodatelService,Notification,bannerService,countriesService,myService,userService,$state,$stateParams) {
	
	var vm = this;
	vm.showModal = false;
	vm.cropper = {};
	vm.cropper.sourceImage = null;
	if(!$stateParams.banner && !$stateParams.company) window.history.back()
	vm.company_id = $stateParams.company;
	vm.banner_id = $stateParams.banner;
	vm.countries = [];
	vm.filters = {countries:[]};
	vm.showCountries=false;
	vm.selectedCountryCount=0;
	vm.audienceCount=0;
	vm.pathToBannerImages = '../banner_images/';
	vm.banner  = {};
	vm.banner.showPeriods =	[
	{"name":"Понедельник","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Вторник","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Среда","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Четверг","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Пятница","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Суббота","checked":true,"from":new Date(),"to":new Date()},
	{"name":"Воскресенье","checked":true,"from":new Date(),"to":new Date()}
	];
	vm.banner.gender = null;
	vm.bannerFields = {
				'name':'название баннера',
				'photo':'фотография для баннера',
				'link':"ссылка",
				'showCost':'стоимость показа',
				'minAge':'минимальный возраст аудитории',
				'maxAge':'максимальный  возраст аудитории',
				'showsLimit':'общий лимит показов',
				'maxUserShows':'лимит показов одному пользователю',
				'startShowAt':'начало даты трансляции баннера',
				'endShowAt':'конец даты трансляции баннера',
				'timeTargetCity':'город часового пояса'
	};
	if(vm.banner_id) delete vm.bannerFields.photo;

	if(vm.company_id) {
		reklamodatelService.getCompany(vm.company_id,function(data){});
			countriesService.getCountries(function(data){
				vm.countries = data;
			})
	}
	else getBanner();
	function getBanner(){
		bannerService.getBanner($stateParams.banner,function(data){
			vm.banner = data;
			vm.filters = {minAge:vm.banner.minAge,maxAge:vm.banner.maxAge,city:vm.banner.cities,countries:[],gender:vm.banner.gender}
			getAudience();
			countriesService.getCountries(function(data){
				vm.countries = data;
				var bannerCities = [];
				var bannerCountries = [];
				var bannerRegions = [];
				vm.banner.cities.forEach(function(city){
					bannerCities.push(city._id);
					if(bannerCountries.indexOf(city.country)==-1) bannerCountries.push(city.country)
					if(bannerRegions.indexOf(city.region)==-1) bannerRegions.push(city.region)
				})
				vm.countries.forEach(function(loadedCountry){
					bannerCountries.forEach(function(bannerCountry){
						if(loadedCountry._id==bannerCountry){
							loadedCountry.checked = true;
							vm.selectedCountryCount++;
							loadedCountry.regions.forEach(function(loadedRegion){
								bannerRegions.forEach(function(bannerRegion){
									if(loadedRegion._id==bannerRegion){
										vm.selectedCountryCount++;
										loadedRegion.checked = true;
										loadedRegion.cities.forEach(function(loadedCity){
											bannerCities.forEach(function(bannerCity){
												if(loadedCity._id==bannerCity){
													loadedCity.checked = true;
													vm.selectedCountryCount++;
												}
											})
										})
									}
								})
							})
						} 
					})
				})
			})
		});	
	}

	function getAudience() {
		userService.getAudience(vm.filters,function(data){
			vm.audienceCount = data;
		});			
	}	

	countriesService.getCities(function(data){
		vm.cities = data;
	})

	bannerService.getStatuses(function(data){
		vm.statuses = data;
	});	

	vm.changeInfo = function(which,newVal,updateAudienceCounter){
		vm.banner[which] = newVal;
		console.log(vm.banner)
		console.log(updateAudienceCounter)
		if(updateAudienceCounter){
			vm.filters[which]=newVal;
			getAudience();	
		}
	}


	vm.setDayChecked = function(bool) {
		vm.banner.showPeriods.forEach(function(day) {
			day.checked = bool;
		})
	}

	vm.selectAllZones = function() {
		vm.filters = {countries:[]};
		vm.showCountries=false;
		vm.selectedCountryCount=0;
		getAudience();
	}

	vm.addCountry = function(place) {
		vm.filters.countries = [];
		place.checked=!place.checked;
		vm.selectedCountryCount=0;
		vm.countries.forEach(function(country,i) {
			if(country.checked){
				vm.selectedCountryCount++;
				var countryCopy = angular.copy(country);
				countryCopy.regionsSelected = [];
				vm.filters.countries.push(countryCopy);
				if(!country.regions) return;
				country.regions.forEach(function(region,j) {
					if(region.checked){
						vm.selectedCountryCount++;
						var regionCopy = angular.copy(region);
						regionCopy.citiesSelected = [];
						countryCopy.regionsSelected.push(regionCopy)
						if(!region.cities) return;
						region.cities.forEach(function(city) {
							if(city.checked) {
									vm.selectedCountryCount++;
									regionCopy.citiesSelected.push(city._id)
							}							
						})
					}
				})
			}
		})
		getAudience();
	}

	function allFieldsFilled(){
		for(var key in vm.bannerFields){
			if(!vm.banner[key] || vm.banner[key]=="" || vm.banner[key]==null){
				Notification.error({title:"Ошибка в поле '"+vm.bannerFields[key]+"'",message:'Поле не должно быть пустым'});
				return false;
			}
		}
		return true;
	}

	vm.save = function() {
		if(!allFieldsFilled()) return;
		vm.banner.countries = vm.filters.countries;
		if(vm.banner.countries.length==0){

			vm.banner.cities = [];
			console.log('cities')
			vm.cities.forEach(function(city){
				vm.banner.cities.push(city._id);
			})
		}
		vm.banner.company = vm.company_id?vm.company_id:vm.banner.company;
		if(vm.banner.photo) var file = myService.dataURItoBlob(vm.banner.photo);
		else file = {}
		bannerService.save(file,vm.banner,vm.company_id?'create':'edit');
		
	}

	vm.saveAsDraft = function(){
		vm.banner.company = vm.company_id;
		if(vm.banner.photo) var file = dataURItoBlob(vm.banner.photo);
		else file = {}
		bannerService.saveAsDraftNew(file,vm.banner);
		$state.go('reklamodateli')
	}

})