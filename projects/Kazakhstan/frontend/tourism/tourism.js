angular.module('myApp').controller('tourismCtrl',function (vmService,$location,$anchorScroll,$scope,$http,$state,$localStorage,$document) {
	var vm = this;
	vm.query = '';
	vm.cards = [];
	vm.currentActiveCard = -1;
	vmService.init(vm,$scope,'tourism',func,func);

	function func(){
		vm.cards = vm.currentText.section_2.cards;
	}

	vm.makeCardActive = function(cardIndex) {
		if((cardIndex+1)%3==0){
			temp = vm.cards[cardIndex-1];
			vm.cards[cardIndex-1] = vm.cards[cardIndex];
			vm.cards[cardIndex] = temp;
			cardIndex--;
		}
		if(cardIndex==vm.currentActiveCard) vm.currentActiveCard=-1;
		else vm.currentActiveCard=cardIndex;
	}

	vm.readMore = function(query){
		vm.query = query;
		vm.submitQuery();
	}
});
