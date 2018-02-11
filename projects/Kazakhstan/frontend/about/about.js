angular.module('myApp').controller('aboutCtrl',function (vmService,$location,$anchorScroll,$scope,$http,$state,$localStorage,$document) {
	var vm = this;
	vm.isShowVideo = false;
	vmService.init(vm,$scope,'about');
});
