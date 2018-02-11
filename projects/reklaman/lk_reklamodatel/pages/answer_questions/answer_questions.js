angular.module('lk_reklamodatel').controller('answerQuestionsCtrl',function($localStorage,$location,$anchorScroll,faqService) {
	
	var vm = this;
	vm.showModal = false;
	vm.questionText='';
	vm.limit = 4;
	vm.company = $localStorage.company
	
	 vm.gotoAnchor = function(x) {
      var newHash = 'anchor' + x;
      if ($location.hash() !== newHash) {
        $location.hash('anchor' + x);
      } else {
        $anchorScroll();
      }
    };
	
	faqService.getAnswers(function (data) {
		vm.answers = data;
	})

	vm.createQuestion = function() {
		if(vm.questionText=='') return;
		faqService.createQuestion(vm.questionText,vm.company.id);
		vm.questionText=''
		vm.showModal = false;
	}

})
