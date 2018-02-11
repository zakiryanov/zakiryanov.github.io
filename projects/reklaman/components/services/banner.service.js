angular.module('app')
.factory("bannerService", function($http,Upload,countriesService,Notification,$filter,$state,userService) {
    var service = {};

    function isResultZero(data){
        if(data.result==0) {
           Notification.error(data.msg);
           window.history.back();
           return true;
       }
       return false;
   }

   function getAudienceCount(banner){
        var citiesIds = [];
        banner.cities.forEach(function(city){
            citiesIds.push(city._id);
        })
        userService.getAudience({ minAge:banner.minAge,maxAge:banner.maxAge,city:citiesIds,countries:[],gender:banner.gender},function(data){
            banner.audienceCount = data;
        });
    }

service.getBanners = function(data,cb){
    var url = data.id?'/api/company/'+data.id+'/banners':'/api/company/get/NewStatusBanners';
    $http.post(url,data)
    .success(function(data){
        if(isResultZero(data)) return
            data.data.forEach(function(banner){
                banner.checked = false;
                banner.genderText = banner.forMale?(banner.forFemale?'Любой':'Мужской'):'Женский';
                banner.gender = banner.forMale?(banner.forFemale?null:'male'):'female';                
                banner.audienceCount = getAudienceCount(banner);
            })
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.getBannersByCompany = function(data,cb){
    $http.post('/api/companyInt/banners',data)
    .success(function(data){  
    if(isResultZero(data)) return 
    cb(data.data);
    })
    .error(function(err){
        console.log(err);
    })
}

function prepareShowPeriodsAfterLoaded(showPeriods){
    showPeriods.forEach(function(day){
        if(day.checked=='false') day.checked=false;
        else day.checked = true;
    })
    return showPeriods;
}

function prepareBannerAfterLoaded (banner){
    banner.audienceCount = getAudienceCount(banner);
    banner.genderText = banner.forMale?(banner.forFemale?'Любой':'Мужской'):'Женский';
    banner.gender = banner.forMale?(banner.forFemale?null:'male'):'female'; 
    banner.showPeriods = prepareShowPeriodsAfterLoaded(banner.showPeriods);
    banner.startShowAt = $filter('date')(banner.startShowAt,'yyyy-MM-dd')
    banner.endShowAt = $filter('date')(banner.endShowAt,'yyyy-MM-dd');
    return banner;
}

service.getBanner = function(id,cb){
    $http.get('/api/company/banners/'+id)
    .success(function(data){
        if(isResultZero(data)) return;
        var banner = data.data;
        banner = prepareBannerAfterLoaded(banner);
        cb(banner);     

    })
    .error(function(err){
        console.log(err);
    })
}

service.getGraph = function(id,from,to,cb){
    var start = (new Date(from)).getTime();
    var end = (new Date(to)).getTime();
    $http.get('/api/companyInt/showsStat?start='+start+'&end='+end+'&'+id+'=1')
    .success(function(data){
        console.log('getGraph',data);
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.getDiagram = function(id,which,type,from,to,cb){
    var start = (new Date(from)).getTime();
    var end = (new Date(to)).getTime();
    $http.get('/api/companyInt/genderChartStat?start='+start+'&end='+end+'&'+id+'=1')
    .success(function(data){
        console.log('diagram',data);
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.getStatuses = function(cb){
    $http.get('/api/company/banners/statuses')
    .success(function(data){
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.update = function(bannersToUpdate){
    $http.put('/api/banners/',{bannersToUpdate:bannersToUpdate})
    .success(function(data){
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.changeStatus = function(banner){
    $http.post('/api/company/'+banner.company+"/banners/changeStatus/"+banner._id,{statusName:banner.statusName})
    .success(function(data){
    })
    .error(function(err){
        console.log(err);
    })  
}

service.delete = function(bannersToRemove){
    $http.delete('/api/banners/',{bannersToRemove:bannersToRemove})
    .success(function(data){
        cb(data);
    })
    .error(function(err){
        console.log(err);
    })
}

service.copy = function(bannersToCopy,cb){
    $http.get('jsons/newCopiedBanners.json')
    .success(function(newBanners){
        cb(newBanners);
    })
    .error(function(err){
        console.log(err);
    })
}

service.saveAsDraft = function(banner){
    $http.put('/api/banners/asDraft',{banner:banner})
    .success(function(newBanners){

    })
    .error(function(err){
        console.log(err);
    })
}

service.sendToModeration = function(banner){
    $http.put('/api/banner/toModeration',{banner:banner})
    .success(function(newBanners){

    })
    .error(function(err){
        console.log(err);
    })
}

service.saveAsDraftNew = function(file,data){
    console.log('send banner',data);
    Upload.upload({
        url: '/api/company/'+data.company+'/banners/new',
        data: {file:file,data:data}
    }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
    }, function (resp) {
        console.log('Error status: ' + resp.status);
    }, function (evt) {
    });
}

function checkGender (banner){
    banner.forMale = false;
    banner.forFemale = false;
    if(banner.gender=="male") banner.forMale = true;
    if(banner.gender=="female") banner.forFemale = true;
    if(banner.gender==null){
        banner.forMale = true;
        banner.forFemale = true;
    }
    return banner;
}

function prepareBannerToSend (banner){
    banner = checkGender(banner);
    banner.showPeriods = prepareShowPeriods(banner.showPeriods);
    if(banner.countries.length>0) banner.cities = countriesService.getCitiesIds(banner.countries);
    banner.startShowAt = new Date(banner.startShowAt);
    banner.endShowAt = new Date(banner.endShowAt);
    banner.timeTargetCity = banner.timeTargetCity._id;
    delete banner.photo;
    delete banner.gender;
    delete banner.countries;
    return banner;
}

function prepareShowPeriods(showPeriods){
    showPeriods.forEach(function(day){
        delete day.$$hashKey
    })
    return showPeriods;
}

service.save = function(file,banner,action){
    var url = '/api/company/' + banner.company + '/banners/' + (banner['_id'] ? 'edit/' + banner['_id'] : 'new');
    console.log('url',url);
    banner = prepareBannerToSend(banner);
    Upload.upload({
        url:url,
        data: {file:file,data:banner}
    }).then(function (resp) {
        Notification.success('Баннер сохранен')
        $state.go('banners',{id:banner.company},{reload: true})
    }, function (resp) {
       Notification.error('Ошибка при создании баннера');
   }, function (evt) {
   });
}

return service;
})    
