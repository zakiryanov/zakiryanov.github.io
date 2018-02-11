angular.module('app').factory("userService", function($http) {
    var service = {};

        // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 


    service.saveUser = function(newUser,cb){
    	//method - (put)
    	//api - /api/user
    	//data - {user:newUser}
    	$http.put('/api/user', {user:newUser})
			.success(function(data){
				})
			.error(function(err){
				console.log(err);
			})
    }
		
  
    service.getUsers = function(data,cb){
        //method - (post)
        //api - '/api/users
        //data - {filters:{zones:{countries:[],regions:[],cities:[]},age_from:number,age_to:number,balance_from:number,balance_to:number,gender:{},status:{},user_status:{}},from:number,limit:number}
        // limit and from optional,means get all data
        $http.get('jsons/users.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getCounters = function(cb){
    	//method - (get)
    	//api - '/api/user/counters
    	$http.get('jsons/user_counters.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }
   
    service.getUser = function(id,cb){
        //method - (get)
        //api - '/api/user/:id
        //parameter - id
        $http.get('jsons/user.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }
   
    service.getWithdrawsStatuses = function(cb){
        //method - (get)
        //api - '/api/withdrawsStatuses
        $http.get('jsons/withdraw_status.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getWithdraws = function(data,cb){
        //method - (post)
        //api - '/api/withdraws
        //data -  {filters:filters,from:number,limit:number,search:string}
        $http.get('jsons/withdraws.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getUserWithdraws = function(data,cb){
        //method - (post)
        //api - '/api/withdraws/:id
        //data -  {filters:filters,from:number,limit:number,search:string}
        $http.get('jsons/user_withdraws.json')
            .success(function(data){
                    cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.changeWithdraw = function(withdraw){
        //method - (put)
        //api - '/api/withdraws
        //data -  {withdraw:obj}
        $http.post('/api/withdraws')
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.getQuestions = function(data,cb){
    	//method - (post)
    	//api - '/api/user/questions
        //data -   {from:number,limit:number,search:string}
    	$http.get('jsons/user_questions.json')
			.success(function(data){
                cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }

		
    return service;
  })    
