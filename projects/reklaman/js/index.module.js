var myApp = angular.module('app', ['ui-notification','angular-img-cropper','ngFileUpload','720kb.datepicker','ui.router','ngStorage','mgcrea.ngStrap','ngCookies','admin_panel','lk_reklamodatel'])
myApp.config(function(NotificationProvider) {
	NotificationProvider.setOptions({
		delay: 2500,
		startTop: 10,
		startRight: 10,
		verticalSpacing: 10,
		horizontalSpacing: 10,
		positionX: 'right',
		positionY: 'top',
		replaceMessage: false
	});
}).config(function($httpProvider) {
	$httpProvider.interceptors.push(function($q, $localStorage,$cookies) {
		return {
			'request': function(config) {
				config.headers['authorization'] = $localStorage.token;
				return config;
			}
		};
	});
});;