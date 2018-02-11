angular.module('app')
.factory("reklamodatelService", function($http,Upload,$localStorage,Notification) {
    var service = {};

// PAYMENTS

    service.getPayments = function(data,cb){
        $http.post('/api/payment/',data)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getPaymentsTotalSum = function(companyId,cb){
        var companyId = companyId?companyId+"/":"";
        $http.get('/api/payment/'+companyId+'totalSum/')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getPaymentsOfCompany = function(id,data,cb){
        $http.post('/api/payment/'+id+"/",data)
        .success(function(data){
            console.log('data',data);
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.acceptPayment = function(id){
        $http.post('/api/payment/accept/'+id)
        .success(function(data){
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.declinePayment = function(id){
        $http.post('/api/payment/decline/'+id)
        .success(function(data){
        })
        .error(function(err){
            console.log(err);
        })
    }

      service.getPaymentsStatuses = function(cb){
        $http.get('/api/payment/statuses')
        .success(function(data){
            cb(data.data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    // PAYMENTS END 

    service.authorize = function(company,cb){
        $http.post('/api/companyInt/login',company)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }


    service.getQuestionsCounter = function(cb){
        $http.get('/api/admin/companyTicket/newTicketsCnt')
        .success(function(data){
            cb(data.count);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getQuestions = function(data,cb){
        $http.post('/api/admin/companyTicket/',data)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    function setLikesAndViews(data){
        var bannerLikes= {};
        data.likes.forEach(function(el){
            bannerLikes[el._id] = el.likes;
        });
        data.bannerLikes = bannerLikes;
        var bannerSaves= {};
        data.saves.forEach(function(el){
            bannerSaves[el._id] = el.saves;
        });
        data.bannerSaves = bannerSaves;
    }

    function  getCompanyTotalOutlay(data){
        var totalOutlay = 0;
        var bannerTransfer = {};
        data.bannersInfo.forEach(function(el){
            totalOutlay += el.companyTransfer;
            bannerTransfer[el._id] = Math.round(el.companyTransfer*100)/100;
        });
        data.totalOutlay = Math.round(totalOutlay*100)/100;
        data.bannerTtarnsfer = bannerTransfer;
        var bannerShowCnt={};
        data.bannersShows.forEach(function(el){
            bannerShowCnt[el._id] = el.shows;
        });
        data.bannerShowCnt = bannerShowCnt;
    }

    service.getStatistics = function(cb){
        $http.get('/api/companyInt/statistics')
        .success(function(data){
            setLikesAndViews(data.data)
            getCompanyTotalOutlay(data.data)
            cb(data.data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getCompanies = function(data,cb){
        $http.post('/api/company/',data)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getCompany = function(id,cb){
        $http.get('/api/company/'+id)
        .success(function(data){
            if(data.result==0){
                Notification.error('Компании с таким id не существует');
                window.history.back();
                return;
            }
            cb(data.data[0]);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getCompanyByCompany = function(cb){
        $http.get('/api/companyInt/main')
        .success(function(data){
            if(data.result==0){
                Notification.error('Компании с таким id не существует');
                window.history.back();
                return;
            }
            cb(data.data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getTotalAmount = function(cb){
        $http.get('/api/company/count/')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }
    service.getRegistrationsRequestsCount = function(cb){
        $http.get('/api/admin/newCompanyRequests/count')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getBannersOnModerationCount = function(cb){
        $http.get('/api/company/get/NewStatusBanners/count')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getBillings = function(id,cb){
        $http.get('jsons/billings.json')
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.getRequests = function(data,cb){
        $http.post('/api/admin/newCompanyRequests',data)
        .success(function(data){
            cb(data);
        })
        .error(function(err){
            console.log(err);
        })
    }


    service.declineRequest = function(company){
        console.log(company)
        $http.delete('/api/admin/newCompanyRequests/del/'+company._id)
        .success(function(){
            Notification.primary('Завяка на создание компании отклонена')
        })
        .error(function(err){
           Notification.error('Произошла ошибка')
            console.log(err);
        })
       }

       service.acceptRequest = function(company){
         $http.post('/api/admin/newCompanyRequests/registerCompany/'+company._id)
         .success(function(data){
            if(data.result) Notification.success(data.msg)
                else Notification.error(data.msg)
            })
         .error(function(err){
           Notification.error('Произошла ошибка')
            console.log(err);
        })
       }

       service.authorizeAsCompany = function(id,cb){
        $http.get('jsons/authorize_as_company.json')
        .success(function(company){
            cb(company);
        })
        .error(function(err){
            console.log(err);
        })
    }

    service.create = function(file,company) {
        Upload.upload({
            url: '/api/company/new',
            data: {file:file,company:company}
        }).then(function (resp) {
         console.log('Success ', resp.data);
         if(resp.data.result==0) Notification.error({title:resp.data.msg,message:resp.data.error.errors.email.message})
            else Notification.success({title:resp.data.msg})
        }, function (resp) {
            Notification.error({title:'Ошибка сохранения'});
        }, function (evt) {
        });
    }

    service.update = function(file,company) {
        Upload.upload({
            url: '/api/company/'+company._id,
            data: {file:file,company:company}
        }).then(function (resp) {
            if(resp.data.result==0) Notification.error({title:'Ошибка',message:resp.data.msg})
                else Notification.success({title:resp.data.msg})
            }, function (resp) {
                Notification.error({title:'Ошибка сохранения'});
            }, function (evt) {
            });
    }

    return service;
})    
