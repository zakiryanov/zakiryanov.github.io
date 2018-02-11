angular.module('myApp').factory('vmService', function ($location,$anchorScroll, $http,$state,$localStorage) {

	var service = {}	

	function hideLoader(){
		function getBgUrl(el) {
			var bg = "";
    if (el.currentStyle) { // IE
    	bg = el.currentStyle.backgroundImage;
    } else if (document.defaultView && document.defaultView.getComputedStyle) { // Firefox
    	bg = document.defaultView.getComputedStyle(el, "").backgroundImage;
    } else { // try and get inline style
    	bg = el.style.backgroundImage;
    }
    return bg.replace(/url\(['"]?(.*?)['"]?\)/i, "$1");
  }

  var image = document.createElement('img');
  image.src = getBgUrl(document.getElementById('main-bg'));
  image.onload = function () {
  	$('.loader-bg').animate({
  		opacity: 0,
	  	}, 400, function() {
	    $(this).hide().css('opacity',1)
	  });
  	$('.wow').removeClass('animated');
  	$('.wow').removeAttr('style');
  	new WOW().init();
  };
}

service.init = function(vm,$scope,pageName,changeLangCb,httpCb){

	vm.currentLang = $localStorage.currentLang;
	$location.hash('anchor');
	$anchorScroll();

	vm.submitQuery = function () {
		window.open('http://google.com/search?q='+vm.query)
	}

	vm.openLink = function(link) {
		window.open(link,'_blank')
	}

	$scope.$on('changeLang',function(event, data) {
		vm.currentLang = data;
		vm.currentText = vm.langsTexts[vm.currentLang];
		if(changeLangCb) changeLangCb();
	});

	$http.get(pageName+'/'+pageName+'.json')
	.success(function(data) {
		vm.langsTexts = data;
		vm.currentText = vm.langsTexts[vm.currentLang];
		hideLoader()
		if(httpCb) httpCb();
	})
	.error(function(err) {
		console.log(err)
	})
}

return service;

});
