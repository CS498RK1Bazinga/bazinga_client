var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('CommonData', function($http, $window){
    var data = "";
    var baseUrl = $window.sessionStorage.baseurl;
    return{
        // send promise
        getUsers : function(){
            return $http.get(baseUrl+'/api/users');
        },
        getTasks : function(taskId){
            return $http.get(baseUrl+'/api/tasks'+taskId);
        }
    }
});

mp4Services.factory('Users', function($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    return {
        addUser : function(data) {
            return $http.post(baseUrl+'/api/users', data);
        },
        deleteUser : function(userId) {
            return $http.delete(baseUrl+'/api/users/'+userId);
        },
        getUser : function(userId) {
            return $http.get(baseUrl+'/api/users/'+userId);
        },
        updateUser : function(userId, data) {
          return $http.put(baseUrl+'/api/users/'+userId, data);
        }
    }
});

mp4Services.factory('Tasks', function($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    return {
         getPendingTasks : function(userId) {
           return $http.get(baseUrl+"/api/tasks?where={'assignedUser':'" + userId + "','completed':false}");
         },
         getCompletedTasks : function(userId) {
           return $http.get(baseUrl+"/api/tasks?where={'assignedUser':'" + userId + "','completed':true}");
         },
         updateTask : function(taskId, data) {
           return $http.put(baseUrl+'/api/tasks/'+taskId, data);
         },
         deleteTask: function(taskId) {
           return $http.delete(baseUrl+'/api/tasks/'+taskId);
         },
         getTask: function(taskId) {
           return $http.get(baseUrl+'/api/tasks/'+taskId);
         },
         addTask: function(data) {
            return $http.post(baseUrl+'/api/tasks/',data);
         }
    }
});
