angular.module('myApp').controller('mainCtrl',['$http','$scope',function ($http,$scope) {
	var vm = this;
	vm.months = ['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'];
	vm.ticketTypes = ['авиабилеты','ж/д билеты','отели'];
	vm.tabs = ['В одну сторону','В обе стороны','Сложный маршрут'];
	vm.currentTicketType = vm.currentTab = 0;
	vm.cities = [{name:'Алматы',code:'ALA'},{name:'Стамбул',code:'IST'},{name:'Астана',code:'TSE'},{name:'Костанай',code:'KSN'},{name:'Москва',code:'MOW'}]
	vm.cityFrom = vm.cities[0];
	vm.cityTo = vm.cities[1];
	vm.mainData = {};
	vm.peopleCount = '';
	vm.peoples = [1,2,3,4,5,6,7];
	vm.date1 = ''
	vm.date2 = ''

	vm.searchTickets = function(){
		$http.get("http://test.santufei.com/api/v1/content/directions?city_a="+vm.cityFrom.code+"&city_b="+vm.cityTo.code)
		.then(function(response) {
			vm.directions = response.data.directions[0]
			console.log(vm.directions);
			vm.oneWayFirstColumn = vm.directions.oneway_histories.slice(0,5)
			vm.oneWaySecondColumn = vm.directions.oneway_histories.slice(5)
			vm.roundTripFirstColumn = vm.directions.roundtrip_histories.slice(0,5)
			vm.roundTripSecondColumn = vm.directions.roundtrip_histories.slice(5)
			vm.airlines = vm.directions.airlines
		},function(err){
			console.log('err',err)
		});
	}

	vm.priceConvertion = function(val){
		return String(val).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
	}

	vm.timeConversion = function(duration) {
		return (duration/60).toFixed(0)+'ч '+(duration%60)+"м"
	}

	vm.stopsFormat = function(stops){
		return stops?stops+' пересадка':'без пересадок'
	}

	vm.trunkName = function(name){
		return name.length>15?name.slice(0,12)+"...":name;
	}

	vm.choosePeople = function(){
		if(!vm.peopleCount) vm.peopleCount=0;
		vm.peopleCount += 1;
	}

	$(function() {
		$('#datepicker').daterangepicker({
			opens: 'center',
			autoUpdateInput: false,
		}, function(start, end, label) {
			vm.date1 = start.format('YYYY-MM-DD');
			if(vm.currentTab==1)	vm.date2 = end.format('YYYY-MM-DD');
			else vm.date2 = ''
				console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
			$scope.$apply()
		});

		$('.toggle').click(function() {
				$('#navbarCollapse').toggle('fast');
		})
	});

	vm.searchTickets()

	
}]);
