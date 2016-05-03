var mp4Services = angular.module('mp4Services', []);

mp4Services.factory('Users', function($http, $window) {
    var baseUrl = $window.sessionStorage.baseurl;
    return {
        getAllUsers : function() {
            return $http.get(baseUrl+'/api/users');
        },
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

mp4Services.factory('Events', function($http, $window) {
    // var baseUrl = $window.sessionStorage.baseurl;
    var baseUrl = 'http://localhost:4000';
    return {
        getAllEvents : function() {
            return $http.get(baseUrl+"/api/events");
        },
        getEventsByHost : function(userId) {
            return $http.get(baseUrl+"/api/events?where={'host':'" + userId + "}");
        },
        /*
        *****Maybe not needed since we can just filter these out through the front-end...might be easier****

         getAttendingEvents : function(userId) {
           return $http.get(baseUrl+"/api/events?where={'assignedUser':'" + userId + "','completed':false}");
         },
        getEventsHistory : function(userId) {
            return $http.get(baseUrl+"/api/events?where={'assignedUser':'" + userId + "','completed':true}");
        },*/
         updateEvent : function(eventId, data) {
           return $http.put(baseUrl+'/api/events/'+ eventId, data);
         },
         deleteEvent: function(eventId) {
           return $http.delete(baseUrl+'/api/events/'+eventId);
         },
         getEvent: function(eventId) {
           return $http.get(baseUrl+'/api/events/'+eventId);
         },
         addEvent: function(data) {
            return $http.post(baseUrl+'/api/events/',data);
         }
    }
});
