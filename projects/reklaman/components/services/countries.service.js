angular.module('app')
.factory("countriesService", function($http,Notification) {
  var service = {};

  function err(err){
   console.log(err);
   Notification.error({title:"Ошибка",message:"Возможно потеряно соединение с интернетом"})
 }

 service.getAllCountries = function(cb){
   $http.get('/api/countries?withDisable=1')
   .success(function(data){
    console.log('data',data);
    cb(data);
  })
   .error(function(err){
    console.log(err);
  })
 }

 service.getCitiesIds = function(countries){
  var citiesIds = []
  countries.forEach(function(country){
    if(country.regionsSelected.length==0)  citiesIds = citiesIds.concat(country.cities);
    else {
      country.regionsSelected.forEach(function(region){
        if(region.citiesSelected.length==0){
         region.cities.forEach(function(city){
          citiesIds.push(city._id);
        })
       }else citiesIds = citiesIds.concat(region.citiesSelected); 
     })
    }
  })
  return citiesIds;
}

service.getCountries = function(cb){
 $http.get('/api/countries')
 .success(function(data){
  data.data.forEach(function(country) {
    country.checked = false;
    if(!country.regions)  return;
    country.regions.forEach(function(region){
      region.checked = false
      if(!region.citites) return;
      region.cities.forEach(function(city) {
        city.checked = false;
      })              
    })
  })  
  cb(data.data);
})
 .error(err)
}

service.getVkCountries = function(cb){
 $http.get('/api/geography/getVkCountries')
 .success(function(data){
  console.log('vk',data);
  cb(data);
})
 .error(err)
}

service.getCities = function(cb){
  $http.get('/api/cities')
  .success(function(data){
   cb(data.data);
 })
  .error(err)
}


service.getManagingZones = function(cb){
  $http.get('jsons/managing_countries.json')
  .success(function(data){
   cb(data);
 })
  .error(err)
}

service.addToManaging = function(zone,which,cb){
  var zoneName = which=='country'?'Country':(which=='region'?'Region':'City')
  $http.post('/api/geography/add'+zoneName,zone)
  .success(function(data){
    if(data.result==2) Notification.primary(data.msg)
      else  cb(data.data);
  })
  .error(err)
}

service.getRegionsByVkCountry = function(vk_id,cb){
  $http.get('/api/geography/getRegionsByVkCountry/'+vk_id)
  .success(function(data){
    console.log(data);
    cb(data.data);
  })
  .error(err)
}

service.getVkCities = function(region_vk_id,country_vk_id,cb){
  $http.get('/api/geography/getVkCities/'+country_vk_id+"/"+region_vk_id)
  .success(function(data){
    cb(data.data);
  })
  .error(err)
}

service.removeFromManaging = function(vk_id,which){
  var zoneName = which=='country'?'Country':(which=='region'?'Region':'City')
  $http.delete('/api/geography/remove'+zoneName+"/"+vk_id)
  .success(function(data){
  })
  .error(err)
}

service.changeStatus = function(enable){
  $http.put('/api/geography/changeAllCountriesAct',{enable:enable})
  .success(function(data){
    Notification.primary('Статус изменен')
  })
  .error(err)
}


return service;
})    
