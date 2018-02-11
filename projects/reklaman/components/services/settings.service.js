angular.module('app')
.factory("settingsService", function($http,Notification) {
    var service = {};

    service.getRoutes = function(cb){
    	$http.get('/api/admin/possibleRequests')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }

    service.sendCustomRequest = function(route,cb){
			$http.get('jsons/routes.json')
			.success(function(data){
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }
		

    service.getSettings = function(data,cb){ 
			$http.post('/api/admin/settings/',data)
			.success(function(data){
				console.log(data);
					cb(data);
				})
			.error(function(err){
				console.log(err);
			})
    }


    service.updateSetting = function(setting,cb){
			$http.put('/api/admin/settings/',setting)
			.success(function(data){
				if(data.result==1) {
					Notification.success("Изменения успешно сохранены")
					cb();
				}
				else Notification.error("Ошибка сохранения")

				})
			.error(function(err){
				console.log(err);
			})
    }
		
    return service;
  })
