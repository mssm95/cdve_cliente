'use strict';

/**
 * @ngdoc service
 * @name coreService.coreRequest
 * @description
 * # coreRequest
 * Factory in the coreRequest.
 */
angular.module('coreService',[])
  .factory('coreRequest', function ($http) {
    // Service logic
    // ...
    //var path = "http://10.20.2.78:8081/v1/";
    var path = "http://10.20.0.254/core_api/v1/";
    // Public API here
    return {
      get: function (tabla,params) {
        return $http.get(path+tabla+"/?"+params);
      },
      post: function (tabla,elemento) {
        return $http.post(path+tabla,elemento);
      },
      put: function (tabla,id,elemento) {
        return $http.put(path+tabla+"/"+id,elemento);
      },
      delete: function (tabla,id) {
        return $http.delete(path+tabla+"/"+id);
      }
    };
  });
