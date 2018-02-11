angular.module('myApp')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('glavnaya', {
                url: '/glavnaya',
                templateUrl: 'glavnaya/glavnaya.html',
                controller:'glavnayaCtrl',
                controllerAs:'vm'
            })
            .state('tourism', {
                url: '/tourism',
                templateUrl: 'tourism/tourism.html',
                controller:'tourismCtrl',
                controllerAs:'vm'
            })
            .state('culture', {
                url: '/culture',
                templateUrl: 'culture/culture.html',
                controller:'cultureCtrl',
                controllerAs:'vm'
            })
            .state('about', {
                url: '/about',
                templateUrl: 'about/about.html',
                controller:'aboutCtrl',
                controllerAs:'vm'
            })
            .state('president', {
                url: '/president',
                templateUrl: 'president/president.html',
                controller:'presidentCtrl',
                controllerAs:'vm'
            })
            .state('timeline', {
                url: '/timeline',
                templateUrl: 'timeline/timeline.html',
                controller:'timelineCtrl',
                controllerAs:'vm'
            })
        $urlRouterProvider.otherwise('/glavnaya');
    });
