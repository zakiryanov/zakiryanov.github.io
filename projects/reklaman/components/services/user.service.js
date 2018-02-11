angular.module('app').factory("userService", function($http, Notification,countriesService) {
    var service = {};

    service.saveUser = function(newUser,cb){
        delete newUser.country;
        delete newUser.region;
        if(!newUser.city){
            Notification.error('Невозможно сохранить пользователя без города');
            return
        }
        newUser.city = newUser.city._id;
        window.history.back();
    	$http.put('/api/admin/user/save/'+newUser._id,newUser)
			.success(function(data){
                Notification.success('Пользователь сохранен')
				})
			.error(function(err){
				console.log(err);
			})
    }
  
    service.getUsers = function(data,cb){
        var query = "";
        var filtersCopy = angular.copy(data.filters);
        for(var key in filtersCopy){
            if(angular.isObject(filtersCopy[key]) && key!='amount' && !angular.isArray(filtersCopy[key])){
                filtersCopy[key] = filtersCopy[key].value;                       
            }
        }
        if(filtersCopy.hasOwnProperty('enable')) {
            if(filtersCopy.enable!==null)
            query = "?enable="+filtersCopy.enable;
            delete filtersCopy.enable
        }
        if(filtersCopy.countries.length>0) filtersCopy.city = countriesService.getCitiesIds(filtersCopy.countries);
        data.filters = filtersCopy;
        $http.post('/api/admin/user/getUsers'+query,data)
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }  

    service.getAudience = function(filters,cb){
        filters.ageFrom = filters.minAge;
        filters.ageTo = filters.maxAge;
        if(filters.countries.length>0) filters.city = countriesService.getCitiesIds(filters.countries);
        $http.post('/api/admin/user/getUsers',{filters:filters,search:'',from:0,limit:100})
            .success(function(data){
                    cb(data.amount);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getCounters = function(cb){
    	$http.get('/api/admin/user/getCount')
			.success(function(total_amount){
               $http.get('/api/admin/user/getCount?enable=true')
                   .success(function(enable_amount){
                        $http.get('/api/userWithdraw/admin/count')
                           .success(function(withdraw_amount){
                                cb({enable_amount:enable_amount,total_amount:total_amount,withdraw_amount:withdraw_amount});
                             })
                          .error(function(err){
                            console.log(err);
                        })
                    })
                   .error(function(err){
                    console.log(err);
                    })
				})
			.error(function(err){
				console.log(err);
			})
    }
    
   
    service.getUser = function(id,cb){
        $http.get('/api/admin/user/getUser/'+id)
            .success(function(data){
                if(data.result==0) {
                    Notification.error('Такого пользователя не существует');
                    window.history.back();
                }
                else cb(data.data);
                })
            .error(function(err){
                console.log(err);
            })
    }
   
    service.getWithdrawsStatuses = function(cb){
        $http.get('jsons/withdraw_status.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getWithdraws = function(data,userId,cb){
        var status = data.filters.status?data.filters.status.id:'';
        var start = data.filters.start?new Date(data.filters.start).getTime():'';
        var end = data.filters.end?new Date(data.filters.end).getTime():'';
        $http.post('/api/userWithdraw/admin/'+userId+'?status='+status+'&start='+start+'&end='+end,data)
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getWithdrawInfo = function(id,cb){
        $http.get('/api/userWithdraw/admin/get/'+id)
            .success(function(data){
                    cb(data.data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.changeWithdrawsStatus = function(which,arr){
        which = which=='accept'?'SendMoney':'Cancel';
        $http.post('/api/userWithdraw/admin/bulk'+which,{withdraws:arr})
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.changeWithdrawStatus = function(which,withdraw_id){
        which = which=='accept'?'finish/':'cancel/';
        $http.post('/api/userWithdraw/admin/'+which+withdraw_id)
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getQuestions = function(data,cb){
        $http.post('/api/admin/userTicket',data)
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getQuestionsCounter = function(cb){
        $http.get('/api/admin/userTicket/newTicketsCnt')
            .success(function(data){
                cb(data.count);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.recheckResult = function(id){
    	$http.post('/api/userWithdraw/admin/recheckResult/'+id)
			.success(function(data){
                console.log('data',data);
				})
			.error(function(err){
				console.log(err);
			})
    }

		
    return service;
  })    
