angular.module('myApp').controller('cultureCtrl',function (vmService,$location,$scope,$http,$state,$localStorage,$document,$anchorScroll) {
	var vm = this;
	vm.sects = [1,2,3,4,5];
	vmService.init(vm,$scope,'culture');
});
