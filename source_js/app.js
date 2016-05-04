var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider) {

  //================================================
  // Check if the user is connected
  //================================================
  var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
    // Initialize a new promise
    var deferred = $q.defer();

    // Make an AJAX call to check if the user is logged in
    $http.get('/loggedin').success(function(user){
      // Authenticated
      if (user !== '0')
        /*$timeout(deferred.resolve, 0);*/
        deferred.resolve();

      // Not Authenticated
      else {
        $rootScope.message = 'You need to log in.';
        //$timeout(function(){deferred.reject();}, 0);
        deferred.reject();
        $location.url('/login');
      }
    });

    return deferred.promise;
  };
  //================================================
  
  //================================================
  // Add an interceptor for AJAX errors
  //================================================
  $httpProvider.interceptors.push(function($q, $location) {
    return {
      response: function(response) {
        // do something on success
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $location.url('/login');
        return $q.reject(response);
      }
    };
  });
  //================================================

  $routeProvider.
    when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UserController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  when('/editUser/:userId', {
    templateUrl: './partials/editUser.html',
    controller: 'EditUserController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  when('/users/:userId', {
    templateUrl: './partials/profile.html',
    controller: 'ProfileController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  when('/tasks', {
    templateUrl: './partials/tasks.html',
    controller: 'TaskController'
  }).
  when('/tasks/add', {
    templateUrl: './partials/addTask.html',
    controller: 'TaskController'
  }).
  when('/tasks/:taskId', {
   templateUrl: 'partials/taskDetail.html',
   controller: 'TaskDetailController'
  }).
  when('/editTask/:taskId', {
  templateUrl: 'partials/editTask.html',
  controller: 'EditTaskController'
  }).
  when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  }).
  when('/signup', {
    templateUrl: 'partials/signup.html',
    controller: 'SignUpController'
  }).
  when('/newsFeed', {
    templateUrl: 'partials/newsFeed.html',
    controller: 'NewsFeedController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  when('/events/:eventId', {
    templateUrl: 'partials/eventDetail.html',
    controller: 'EventDetailController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  when('/event',{
    templateUrl: 'partials/addEvent.html',
    controller: 'AddEventController',
    resolve: {
       loggedin: checkLoggedin
    }
  }).
  otherwise({
    redirectTo: '/login'
  });


}]).run(function($rootScope, $http){
  $rootScope.message = '';

  // Logout function is available in any pages
  $rootScope.logout = function(){
    $rootScope.message = 'Logged out.';
    $http.post('/logout');
  };
});



