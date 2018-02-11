angular.module('app')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin_panel', {
                url: '/admin_panel',
                templateUrl: 'admin_panel/index.html'
            })
            .state('lk_reklamodatel', {
                url: '/lk_reklamodatel',
                templateUrl: 'lk_reklamodatel/index.html'
            });
        $urlRouterProvider.otherwise('/lk_reklamodatel/company');
    });
