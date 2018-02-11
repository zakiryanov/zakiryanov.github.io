angular.module('myApp').controller('rootCtrl',function ($state,$scope,$localStorage,$http,$rootScope) {
	var vm = this;	

	vm.timelineData = {};
	vm.langs = {'eng':'English','kaz':'Қазақ'}
	vm.currentLang = $localStorage.currentLang;
	vm.isShowMenu = false;
	vm.langsTexts = [];
	vm.currentYear = (new Date()).getFullYear();
	vm.openTimelineInfo = false

	$scope.$on("isTimelineActive", function(e,bool){
		vm.isTimelineActive = bool;
	});

	$scope.$on("openTimelineInfo", function(e){
		vm.openTimelineInfo = true;
	});

	vm.closeTimelineInfo = function(){
		vm.openTimelineInfo = false;
		$scope.$broadcast('closeTimeLineInfo',{})
	}

	$http.get('commonJS/index.json')
	.success(function(data) {
		vm.langsTexts = data;
		vm.currentText = vm.langsTexts[vm.currentLang];
	})
	.error(function(err) {
		console.log(err)
	})

	vm.changeLang = function(name) {
		vm.currentLang = name;
		vm.currentText = vm.langsTexts[vm.currentLang];
		$localStorage.currentLang = name;
		$scope.$parent.$broadcast('changeLang',name);
	}

	vm.changeState = function(state){
		vm.isShowMenu = false;
		$state.go(state)
	}

	$rootScope.$on('$stateChangeStart', 
		function(event, toState, toParams, fromState, fromParams){ 
			if(toState.name!=fromState.name) $('.loader-bg').show();
		})
});
