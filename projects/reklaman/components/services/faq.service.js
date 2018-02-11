angular.module('app')
.factory("faqService", function($http) {
    var service = {};


    service.getAnswers = function(cb){
        //method - (get)
        //api - /api/answers
        $http.get('jsons/answers.json')
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.createQuestion = function(questionText,company_id){
        //method - (post)
        //api - /api/question
        //data - {questionText:questionText,company_id:company_id}
        $http.post('/api/question',{questionText:questionText,company_id:company_id})
            .success(function(data){
                })
            .error(function(err){
                console.log(err);
            })
    }


    return service;
  })    
