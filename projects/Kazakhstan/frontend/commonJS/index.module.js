angular.module('myApp', ['ngAnimate','duScroll','ui.router','ngStorage','rzModule','slickCarousel'])
.run(function($localStorage) {
	$localStorage.currentLang = $localStorage.currentLang?$localStorage.currentLang:'eng';
})

