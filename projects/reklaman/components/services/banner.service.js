angular.module('app')
.factory("bannerService", function($http) {
    var service = {};

    // FROM AND LIMIT CAN BE NULL. THAT MEANS GET ALL DATA (FROM BEGIN TO END) 


    service.getBannersOfCompany = function(data,cb){
        //method - (post)
        //api - '/api/banners/
        //data -   {id:id,from:number,limit:number,search:string}
        $http.get('jsons/reklamodatel_banners.json')
            .success(function(data){
                data.banners.forEach(function(i){
                    i.checked = false;
                })
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }


    service.getBanner = function(id,cb){
        //method - (get)
        //api - '/api/banner/:id
        $http.get('jsons/banner.json')
            .success(function(data){
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }

    service.getGraph = function(id,from,to,cb){
        //method - (get)
        //api - '/api/banner/:id/graph
        //data - {from:number,to:to}
        $http.get('jsons/banner_graph.json')
            .success(function(data){
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }

    service.getDiagram = function(id,which,type,cb){
        //method - (get)
        //api - '/api/banner/:id/diagram
        //data - {which:which,type:type}
        //which can be 'likes','gender','age','cities'
        //type can be 'transitions' or 'impressions'
        $http.get('jsons/statistics_'+which+'.json')
            .success(function(data){
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }

    service.getStatuses = function(cb){
        //method - (get)
        //api - '/api/banner/statuses
        $http.get('jsons/banner_statuses.json')
            .success(function(data){
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }

    service.getBannersOnModeration = function(data,cb){
        //method - (post)
        //api - '/api/banners/on_moderation
        //data -  {from:number,limit:number,search:string}
        $http.get('jsons/banners_on_moderation.json')
            .success(function(data){
                data.banners.forEach(function(i){
                    i.checked = false;
                })
                cb(data);
             })
            .error(function(err){
                console.log(err);
            })
    }

    service.update = function(bannersToUpdate){
       //method - (put)
        //api - /api/banners/
        //data -   {bannersToUpdate:array}
        $http.put('/api/banners/',{bannersToUpdate:bannersToUpdate})
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
        }

    service.delete = function(bannersToRemove){
        //method - (delete)
        //api - '/api/banners/
        //data - array of deleted banners {bannersToRemove:bannersToRemove}

        $http.delete('/api/banners/',{bannersToRemove:bannersToRemove})
            .success(function(data){
                cb(data);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.copy = function(bannersToCopy,cb){
        //method - (post)
        //api - '/api/banners/copy
        //data -   {bannersToCopy:array}
        //response - newBanners array
        $http.get('jsons/newCopiedBanners.json')
            .success(function(newBanners){
                cb(newBanners);
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.saveAsDraft = function(banner){
        //method - (put)
        //api - '/api/banners/asDraft
        //data -   {banner:obj}
        //banner.photo in base64 format
        $http.put('/api/banners/asDraft',{banner:banner})
            .success(function(newBanners){
               
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.sendToModeration = function(banner){
        //method - (put)
        //api - '/api/banner/toModeration
        //data -   {banner:obj}
        //banner.photo in base64 format
        $http.put('/api/banner/toModeration',{banner:banner})
            .success(function(newBanners){
               
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.saveAsDraftNew = function(creator_id,banner){
        //method - (post)
        //api - '/api/banners/asDraft
        //data -   {creator_id:id,banner:obj}
        //banner.photo in base64 format
        $http.post('/api/banners/asDraft',{creator_id:creator_id,banner:banner})
            .success(function(newBanners){
               
                })
            .error(function(err){
                console.log(err);
            })
    }

    service.sendToModerationNew = function(creator_id,banner){
        //method - (post)
        //api - '/api/banner/toModeration
        //data -   {creator_id:id,banner:obj}
        //banner.photo in base64 format
        $http.post('/api/banner/toModeration',{creator_id:creator_id,banner:banner})
            .success(function(newBanners){               
                })
            .error(function(err){
                console.log(err);
            })
    }
		
    return service;
  })    
