angular.module('app')
.factory('loader', function loader($http,$q,$timeout,$location,$cookies, helpers, $rootScope) {
  loader.setAuthToken = function(token, setCookie) {
    $http.defaults.headers.common.Authorization = token;
    if (setCookie) {
      if (!token) {
        $cookies.remove('authToken');
      }
      else {
        $cookies.put('authToken', token);
      }
      $rootScope.authToken = token;
    }
    console.log('Auth token set');
  };
  loader.checkLostSession = function (result) {
    if (result && result.error == 'relogin') {
      $location.path('/login');
    }
  };

  loader.get = function (path, cb, skipCheckLostSession) {
    if (typeof cb == 'boolean') {
      skipCheckLostSession = cb;
      cb = null;
    }
    return $http.get(path).success(function (data) {
      if (!skipCheckLostSession) {
        loader.checkLostSession(data);
      }
      if (cb) { cb(data);}
      return data;
    })
    .error(function (data) {
      loader.checkLostSession(data);
      console.log('Error loading data :(');
      if (cb) { cb(data);}
    });
  };

  loader.post = function (route, sendData, cb) {
    if (typeof cb != 'function') {
      cb = function () {
      };
    }
    var deferred = $q.defer();
    if (typeof sendData == 'object') {
      var data = helpers.cloneObj(sendData);
    }
    else {
      data = sendData;
    }
    $http.post(route, data, { timeout: deferred.promise })
    .then(function(result){
      var resData = result.data;
      loader.checkLostSession(resData);
      console.log(resData);
      cb(resData);
    }, function(reject) {
      loader.checkLostSession(reject.data);
      console.log('Error in post request', reject.status);
      cb({status: reject.status, data: reject.data});
    });

    $timeout(function() {
          deferred.resolve(); // this aborts the request after 25 sec!
        }, 25000);
  };

  return {
    get: loader.get,
    post: loader.post,
    setAuthToken: loader.setAuthToken,
  }
})
.factory('helpers', function($rootScope ) {
  var helpers = {
    cloneObj: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    objDotPreparation: function(obj, is, value) {
      if (typeof is == 'string')
        return helpers.objDotPreparation(obj,is.split('.'), value);
      else if (is.length==1 && value!==undefined)
        return obj[is[0]] = value;
      else if (is.length==0)
        return obj;
      else {
        if (typeof obj[is[0]] == 'undefined') obj[is[0]] = {};
        return helpers.objDotPreparation(obj[is[0]], is.slice(1), value);
      }
    },
    base64ToBlob: function(base64Data, contentType) {
      contentType = contentType || '';
      var sliceSize = 1024;
      var byteCharacters = atob(base64Data);
      var bytesLength = byteCharacters.length;
      var slicesCount = Math.ceil(bytesLength / sliceSize);
      var byteArrays = new Array(slicesCount);

      for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0 ; offset < end; ++i, ++offset) {
          bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
      }
      return new Blob(byteArrays, { type: contentType });
    },

    initSlider: function($scope, id, selectId, sett) {
      var el = $( id );
      if (el.length == 0) {
        setTimeout(function() {
          helpers.initSlider($scope, id, selectId, sett);
          return;
        }, 300);
      }
      $( id ).slider({
        range: sett.range,
        min: sett.min,
        max: sett.max,
        values: sett.values,
        step:sett.step,
        slide: function( event, ui ) {
          $( selectId ).val( ui.values[ 0 ] + " - " + ui.values[ 1 ] );
          if(sett.ageType){
            $scope.banner.minAge = ui.values[ 0 ];
            $scope.banner.maxAge = ui.values[ 1 ];
          }
        }
      });
      $( selectId ).val( $( id ).slider( "values", 0 ) +
        " - " + $( id ).slider( "values", 1 ) );
      if(sett.ageType){
        $scope.banner.minAge = $( id ).slider( "values", 0 );
        $scope.banner.maxAge = $( id ).slider( "values", 1 );
      }

    }

  };
  return helpers;
})
.factory('apiDoc', function (loader, helpers) {
  var apiDoc = {
    init: function ($scope) {
      $scope.mainDataTemp = '[{bannerId: \'\' , created: ' + Date.now() + '}]';
      $scope.selectedRequest = null;
      $scope.body = {};
      $scope.hello = 'hello';
      $scope.params = {};
      $scope.query = {};
      $scope.inProcess = false;
      $scope.run = function () {
        apiDoc.run($scope);
      };
      $scope.changeRoute = function () {
        apiDoc.changeRoute($scope);
      };
      $scope.addLikesObj = function () {
        $scope.bodyArrOfObjects.push({bannerId: '', flag: ''});
      };
    },

    changeRoute: function ($scope) {
      if ($scope.mainData) {
        delete $scope.mainData;
      }
      $scope.body = {};
      $scope.params = {};
      console.log($scope.selectedRequest)
      if ($scope.selectedRequest.bodyArrOfObjects) {
        if($scope.selectedRequest.bodyArrOfObjects.indexOf('image') != -1){
          $scope.saveImage = true;
        }
        $scope.bodyArrOfObjects = [{bannerId: '', flag: ''}];
      }
      if ($scope.selectedRequest.mainData) {
        $scope.mainData = $scope.selectedRequest.mainData;
        $scope.mainData.data = $scope.mainDataTemp;
      }
      apiDoc.getUsers($scope.selectedRequest.type, $scope);
      $scope.result = null;
      $scope.inProcess = false;
    },

    getUsers: function (type, $scope) {
      if (type == 'user') {
        loader.get('/api/admin/user/getUsers').success(function (data) {
          $scope.users = data.data;
        });
      }
    },

    run: function ($scope) {
      delete $scope.saveImage;
      var requestInfo = $scope.selectedRequest;
      if ($scope.inProcess) {
        return;
      }
      $scope.inProcess = true;
      $scope.result = 'Request in process';
      var route = requestInfo.route;
      if (requestInfo.params) {
        for (var i = 0; i < requestInfo.params.length; i++) {
          route = route.replace(':' + requestInfo.params[i], $scope.params[requestInfo.params[i]] || null);
        }
      }
      if (requestInfo.query) {
        for (var i = 0; i < requestInfo.query.length; i++) {
          var symbol = (route.indexOf('?') == -1) ? '?' : '&';
          if ($scope.body[requestInfo.query[i]]) {
            route = route + symbol + requestInfo.query[i] + '=' + $scope.body[requestInfo.query[i]];
          }
        }
      }
      if ($scope.adminUserId) {
        var symbol = (route.indexOf('?') == -1) ? '?' : '&';
        route = route + symbol + 'adminUserId' + '=' + $scope.adminUserId;
      }
      if (requestInfo.method == 'post') {
        var dataToSend = {};
        if ($scope.mainData) {
          if ($scope.mainData.data) {
            try {
              dataToSend = eval($scope.mainData.data);
            } catch (err) {
              dataToSend = {};
            }
          } else {
            dataToSend = {};
          }
        } else if ($scope.selectedRequest.bodyArrOfObjects) {
          $scope.bodyArrOfObjects.forEach(function (el, i, arr) {
            if (!el.bannerId || !el.flag) {
              arr.splice(i, 1);
            }
          });
          dataToSend = $scope.bodyArrOfObjects;
        } else {
          for (var key in $scope.body) {
            if (key.indexOf('.') != -1) {
              helpers.objDotPreparation(dataToSend, key, $scope.body[key]);
            }
            else {
              dataToSend[key] = $scope.body[key];
            }
          }
        }
        loader.post(route, dataToSend, function (data) {
          $scope.result = data;
          $scope.inProcess = false;
        });
      }
      else {
        loader.get(route, function (data) {
          $scope.result = data;
          $scope.inProcess = false;
        });
      }

    }

  };
  return apiDoc;
});