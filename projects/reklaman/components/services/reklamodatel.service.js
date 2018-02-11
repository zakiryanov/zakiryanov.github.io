angular.module('app')
.factory("reklamodatelService", function($http,Upload) {
    var service = {};

    // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 

    service.getPayments = function(data,cb){
        //method - (post)
        //api - /api/payments
        //data - {filters:{dateFrom:date,dateTo:date},from:number,limit:number,search:string}
        $http.get('jsons/payments.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.acceptPayment = function(payment,isAccepted){
        //method - (post)
        //api - /api/payments/changeAcceptedStatus
        //data - {payment:obj,isAccepted:boolean}
        $http.post('/api/payments/changeAcceptedStatus')
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getQuestions = function(from,limit,cb){
        //method - (post)
        //api - '/api/company/questions
        //data -   {from:number,limit:number}
        $http.get('jsons/reklamodatel_questions.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }


    service.getCompanies = function(data,cb){
        //method - (post)
        //api - /api/companies
        //data - {from:number,limit:number,search:string}
                $http.get('jsons/companies.json')
                .success(function(data){
                    console.log('data',data)
                    cb(data);
                })
                .error(function(err){
                    console.log(err);
                })
    }

    service.getCompany = function(id,cb){
        //method - (get)
        //api - /api/company/:id
        //params - compamy id
                $http.get('jsons/company.json')
                .success(function(data){
                    cb(data);
                })
                .error(function(err){
                    console.log(err);
                })
    }

    service.getCounters = function(cb){
        //method - (get)
        //api - /api/company/counters
                $http.get('jsons/companies_counters.json')
                .success(function(data){
                    cb(data);
                })
                .error(function(err){
                    console.log(err);
                })
    }

    service.getBannersOnModerationCount = function(cb){
        cb({data:54})
    }

    service.getRegistrationsRequestsCount = function(cb){
        cb({data:26})
    }

    service.getBillings = function(id,cb){
        //method - (get)
        //api - /api/company/:id/billings
        //params - compamy id
                $http.get('jsons/billings.json')
                .success(function(data){
                    cb(data);
                })
                .error(function(err){
                    console.log(err);
                })
    }

    service.getRequests = function(data,cb){
        //method - (post)
        //api - '/api/company/requests
        //data -   {from:number,limit:number}
        $http.get('jsons/reklamodatel_requests.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }


    service.deleteFromRequests = function(company,addToCompaniesList){
        //method - (post)
        //api - '/api/banners/deleteFromRequests
        //data -   {company:object,addToCompaniesList:boolean}
        $http.post('/api/company/removeFromRequests',{company:company,addToCompaniesList:addToCompaniesList})
            .success(function(newBanners){
                cb(newBanners);
                })
            .error(function(err){
                console.log(err);
            })
    }


    service.makeRead = function(company){
        //method - (post)
        //api - '/api/banners/makeRead
        //data -   {company:object}
        $http.post('/api/company/removeFromRequests',{company:company})
            .success(function(newBanners){
                cb(newBanners);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.update = function(file,company) {
        //api - '/api/company
        //data -   {file:file,banner:banner}
        //if no new photo 'file' will be {} 
       Upload.upload({
            url: '/api/company/update',
            data: {file:file,company:company}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
        });
    }
		
    return service;
  })    
