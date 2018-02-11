angular.module('myApp').controller('presidentCtrl',function (vmService,$scope,$http,$state,$localStorage,$document,$location,$anchorScroll) {
	var vm = this;
	vm.isShowVideo = false;
	vm.slides = [1,2,3];
	vmService.init(vm,$scope,'president');
});
