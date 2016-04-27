var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/users', {
    templateUrl: 'partials/users.html',
    controller: 'UserController'
  }).
  when('/users/add', {
    templateUrl: './partials/addUser.html',
    controller: 'AddUserController'
  }).
  when('/editUser/:userId', {
    templateUrl: './partials/editUser.html',
    controller: 'EditUserController'
  }).
  when('/users/:userId', {
    templateUrl: './partials/profile.html',
    controller: 'ProfileController'
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
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
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
    controller: 'NewsFeedController'
  }).
  when('/event/:id',{
    templateUrl: 'partials/eventDetail.html',
    controller: 'EventDetailController'
  }).
  otherwise({
    redirectTo: '/login'
  });
}]);
