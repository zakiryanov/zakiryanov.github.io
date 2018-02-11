angular.module('admin_panel')
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('reklamodateli', {
                url: '/reklamodateli',
                templateUrl: 'admin_panel/pages/reklamodateli/reklamodateli.html',
                controller:'reklamodateliCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('payments', {
                url: '/payments/:id',
                templateUrl: 'admin_panel/pages/payments/payments.html',
                controller:'paymentsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'admin_panel/pages/users/users.html',
                controller:'usersCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('user_update', {
                url: '/user_update/:id',
                templateUrl: 'admin_panel/pages/user_update/user_update.html',
                controller:'userUpdateCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('user_withdraws', {
                url: '/user_withdraws/:id',
                templateUrl: 'admin_panel/pages/user_withdraws/user_withdraws.html',
                controller:'userWithdrawsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('withdraw_info', {
                url: '/withdraw_info/:id',
                templateUrl: 'admin_panel/pages/withdraw_info/withdraw_info.html',
                controller:'withdrawInfoCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'admin_panel/pages/settings/settings.html',
                controller:'settingsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('tickets', {
                url: '/tickets?which',
                templateUrl: 'admin_panel/pages/tickets/tickets.html',
                controller:'ticketsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('banners', {
                url: '/banners/:id',
                templateUrl: 'admin_panel/pages/banners/banners.html',
                controller:'bannersCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('registrations_requests', {
                url: '/registrations_requests',
                templateUrl: 'admin_panel/pages/registrations_requests/registrations_requests.html',
                controller:'registrationsRequestsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('banner_update', {
                url: '/banner_update/:id',
                templateUrl: 'admin_panel/pages/banner_update/banner_update.html',
                controller:'bannerUpdateCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('ap_banner_info', {
                url: '/banner_info/:id',
                templateUrl: 'admin_panel/pages/banner_info/banner_info.html',
                controller:'apBannerInfoCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('ap_banner', {
                url: '/banner/?company&banner',
                templateUrl: 'admin_panel/pages/banner/banner.html',
                controller:'apBannerCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('ticket', {
                url: '/ticket?which&id&isTicketId',
                templateUrl: 'admin_panel/pages/ticket/ticket.html',
                controller:'ticketCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('mass_notifications', {
                url: '/mass_notifications/:which',
                templateUrl: 'admin_panel/pages/mass_notifications/mass_notifications.html',
                controller:'massNotificationsCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            })
            .state('company_account', {
                url: '/company_account/:id',
                templateUrl: 'admin_panel/pages/company_account/company_account.html',
                controller:'companyAccountCtrl',
                controllerAs:'vm',
                parent:'admin_panel'
            });
    });
