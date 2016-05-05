var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('EventDetailController', ['$scope', '$http','$routeParams' , '$window','Events','Users', function($scope, $http,$routeParams, $window,Events,Users) {
  $scope.data = "";
  $scope.user = {};
  $scope.eid = $routeParams.id;
  $scope.id = $routeParams.id;
  $scope.hid = "";
  console.log($routeParams.id);

  $scope.event = {};
  Events.getEvent($routeParams.id).success(function(data){
      console.log(data.data._id);
      console.log(data.data._id === $routeParams.id);
      $scope.event = data.data;
      Users.getUser($scope.event.hostId).success(function(data){
      $scope.user = data.data.local;
      console.log($scope.user);
      $scope.hid = data.data._id;

       });


  });
  // console.log($scope.hid);
 



        //   $scope.map = new google.maps.Map(document.getElementById('map'), {
        //   center: {lat: 40.10195230000001, lng: -88.22716149999997},
        //   // (40.10195230000001, -88.22716149999997)
        //   zoom: 13
        // });
 // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  //Tasks.getSpecific($routeParams.id).success(function(usr,detail){$scope.task = usr.data;});
}]);

mp4Controllers.controller('NewsFeedController', ['$scope', 'Events', function($scope, Events) {
  
   $scope.events = {};
   $scope.showOption = "where={'completed':false}";
   $scope.order = "1";
   $scope.sortBy = "time"
   $scope.tasksLength = 0;
   Events.getEvent(("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10"))
     .success(function(data){
       console.log("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10");
       $scope.events = data.data;
       console.log($scope.events.length);
   });

  
}]);

//user list
mp4Controllers.controller('UserController', ['$scope', 'CommonData', 'Users', 'Tasks', function($scope, CommonData, Users, Tasks) {
   $scope.users = {};
   CommonData.getUsers()
      .success(function(data) {
        $scope.users = data.data;
      });

   $scope.deleteUser = function(index){
     // update task to be unassigned
     for(var i = 0; i < $scope.users[index].pendingTasks.length; i++) {
       Tasks.getTask($scope.users[index].pendingTasks[i])
          .success(function (data) {
            data.data.assignedUser = "";
            data.data.assignedUserName = "unassigned";
            Tasks.updateTask(data.data._id, data.data)
              .error(function (err) {
                console.log("Fail to update tasks with deleted user" + err);
              });
          }).error(function(err) {
              console.log("fail to get user's pending tasks" + err);
          });
     }

     Users.deleteUser($scope.users[index]._id)
        .success(function(data) {
          $scope.users.splice(index,1);
        })
        .error(function(err) {
          console.log(err);
        });
   }
}]);

// add user
mp4Controllers.controller('AddUserController', ['$scope', '$window', '$routeParams', 'Users'  , function($scope, $window, $routeParams, Users) {
   $scope.data = {};
   $scope.addUser = function(){
     $scope.data.dateCreated = new Date().getTime();
    // console.log($scope.data);
     Users.addUser($scope.data)
      .success(function(data) {
       $scope.data = {};
       $scope.errorMessage = "";
       $scope.successMessage = "User " + data.data.name + " has been added!";
       //$window.location.replace('#/users');
     })
      .error(function(err) {
        $scope.successMessage = "";
        $scope.errorMessage = err.message;
        if(err)
          console.log($scope.error);
      });
   };
}]);
/*
  $scope.setData = function(){
    CommonData.setData($scope.data);
    $scope.displayText = "Data set"

  };
*/

// add user
mp4Controllers.controller('EditUserController', ['$scope', '$window', '$routeParams', '$http', function($scope, $window, $routeParams, $http) {
   /* Get user data passportjs */
  $scope.profile = false;
   
  $http.get('/profile').success(function(data) {
    console.log(data);
    if(!data.error) {
      $scope.profile = true;
      $scope.user = data.user;
    }
   });

}]);

//task list
mp4Controllers.controller('TaskController', ['$scope', 'CommonData', 'Users', 'Tasks', function($scope, CommonData, Users, Tasks) {
   $scope.tasks = {};
   $scope.showOption = "where={'completed':false}";
   $scope.order = "1";
   $scope.sortBy = "dateCreated"
   $scope.tasksLength = 0;
   CommonData.getTasks("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10")
     .success(function(data){
       console.log("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10");
       $scope.tasks = data.data;
       for (var i = 0; i < $scope.tasks.length; i++) {
         $scope.tasks[i].deadline = dateFormat($scope.tasks[i].deadline);
       }
   });

   $scope.deleteTask = function(index){
     // If a task is deleted, it should be deleted from the `pendingTasks` array of the user it was assigned to
     if($scope.tasks[index].assignedUser) {
       Users.getUser($scope.tasks[index].assignedUser)
          .success(function(data) {
             var user = data.data;
             for (var i = 0; i < user.pendingTasks.length; i++) {
               if($scope.tasks[index]._id === user.pendingTasks[i])
                  user.pendingTasks.splice(i, 1);
             }
             Users.updateUser(user._id, user)
                .success(function(data) {
                  console.log("successfully update user");
                })
                .error(function(err){
                  console.log("fail to update user");
                });
           })
           .error(function(err) {
               console.log("fail to get user");
           });
     }

     Tasks.deleteTask($scope.tasks[index]._id)
        .success(function() {
          $scope.tasks = {};
          $scope.tasksLength -= 1;
          console.log("delete" + $scope.tasksLength);
          CommonData.getTasks("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10")
            .success(function(data){
              $scope.tasks = data.data;
              for (var i = 0; i < $scope.tasks.length; i++) {
                $scope.tasks[i].deadline = dateFormat($scope.tasks[i].deadline);
              }
          });
        })
        .error(function(err) {
          console.log("fail to delete task");
        });
   };

   $scope.skip = 0;
   $scope.prev = function() {
     $scope.skip -= 10;
     if($scope.skip < 0)
        $scope.skip = 0;
   };
   $scope.next = function() {
     if($scope.tasks.length == 10) {
        $scope.skip += 10;
      }
   };

   $scope.nextFlag = function() {
     if($scope.tasksLength > ($scope.skip + 10))
       return false;
     else
       return true;
   };

     $scope.$watchGroup(['sortBy','showOption','order','skip'], function (newVal, oldVal) {
            CommonData.getTasks("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10")
              .success(function(data){
                // get taskLength
                CommonData.getTasks("?" + $scope.showOption)
                 .success(function(data) {
                   $scope.tasksLength = data.data.length;
                 });

                $scope.tasks = data.data;
                for (var i = 0; i < $scope.tasks.length; i++) {
                  $scope.tasks[i].deadline = dateFormat($scope.tasks[i].deadline);
                }
            });
    }, true);
}]);

mp4Controllers.controller('AddTaskController', ['$scope', '$window', '$routeParams', 'CommonData', 'Users' , 'Tasks', function($scope, $window, $routeParams, CommonData, Users, Tasks) {

$scope.data = {};
$scope.assignedUser = "";
$scope.users = {};
CommonData.getUsers()
  .success(function(data){
    $scope.users = data.data;
});

$scope.addTask = function(){
  console.log($scope.data.deadline);
    //$scope.data.deadline = Date.parse($scope.data.deadline);
    $scope.data.completed = false;
    if($scope.assignedUser) {
      $scope.data.assignedUser = $scope.users[$scope.assignedUser]._id;
      $scope.data.assignedUserName = $scope.users[$scope.assignedUser].name;
    }

    Tasks.addTask($scope.data)
        .success(function(data){
        $scope.errorMessage = "";
        $scope.successMessage = "Task " + data.data.name + " has been added!";
        if($scope.assignedUser) {
            $scope.data = {};
            $scope.users[$scope.assignedUser].pendingTasks.push(data.data._id);

            Users.updateUser($scope.users[$scope.assignedUser]._id,$scope.users[$scope.assignedUser])
                .success(function(data){
                    console.log("task added sucesssfully");
                }).error(function(err){
                if(err)
                    console.log("fail to update user " + err);
            });
      }
    }).error(function(err){
        if(err) {
          $scope.errorMessage = err.message;
          $scope.successMessage = "";
          console.log("fail to add task"+err);
        }
    });

};
}]);

// task details
mp4Controllers.controller('TaskDetailController', ['$scope', '$routeParams' ,'Tasks', function($scope, $routeParams, Tasks) {
    $scope.task = {};

    Tasks.getTask($routeParams.taskId)
      .success(function(data){
        $scope.task = data.data;
        $scope.task.deadline = dateFormat($scope.task.deadline);
        $scope.task.dateCreated = dateFormat($scope.task.dateCreated);

    }).error(function(err){
        if(err)
            console.log(err);
    });

}]);

//user details
mp4Controllers.controller('ProfileController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
  /* Check if logged in */
 

  /* Get user data passportjs */
  $scope.profile = false;
   
  $http.get('/profile').success(function(data) {
    console.log(data);
    if(!data.error) {
      $scope.profile = true;
      $scope.user = data.user;
    }
   });

   //$scope.id = $routeParams.userId;
   
}]);


// can we edit the date in edit task?
mp4Controllers.controller('EditTaskController', ['$scope', '$routeParams' ,'Tasks', 'CommonData', function($scope, $routeParams, Tasks, CommonData) {
    $scope.task = {};
    $scope.users = {};
    $scope.userIndex = 0;
    $scope.task.deadline;
    Tasks.getTask($routeParams.taskId)
      .success(function(data){
        $scope.task = data.data;
        $scope.task.deadline = dateFormat($scope.task.deadline);
      })
      .error(function(err){
        console.log(err);
    });

    CommonData.getUsers()
      .success(function(data){
        $scope.users = data.data;
        var user;
        var index;
        for (var i = 0; i < $scope.users.length; i++) {
          if($scope.users[i]._id === $scope.task.assignedUser) {
             index = i;
             user = $scope.users[i];
          }
        }
        $scope.users.splice(index, 1);
        $scope.users.unshift(user);
    });

    $scope.updateEditTask = function(){
      if($scope.userIndex) {
        $scope.task.assignedUser = $scope.users[$scope.userIndex]._id;
        $scope.task.assignedUserName = $scope.users[$scope.userIndex].name;
      }

        Tasks.updateTask($routeParams.taskId, $scope.task)
        .success(function(data){
            $scope.errorMessage = "";
            $scope.successMessage = "Task has been edited!";

        })
        .error(function(err){
            if(err) {
              $scope.errorMessage = err.message;
              $scope.successMessage = "";
            }
        });
    };

}]);


mp4Controllers.controller('LoginController', ['$scope', '$rootScope', '$http', '$location', function($scope, $rootScope, $http, $location) {

    $scope.user = {};

    $scope.login = function(){
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password,
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Authentication successful!';
          console.log($rootScope.message);
          $location.url('/users/123');
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Authentication failed.';
          $location.url('/login');
        });
    };

}]);


mp4Controllers.controller('SignUpController', ['$scope', '$http', '$rootScope', '$location', function($scope, $http, $rootScope, $location) {

    $scope.user = {};
    
    $scope.signup = function(){
        $http.post('/signup', {
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          phoneNumber: $scope.user.phoneNumber,
          gender: $scope.user.gender
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Signup successful!';
          console.log($rootScope.message);
          $location.url('/users/123');
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Signup failed.';
          $location.url('/signup');
        });
    };

}]);

mp4Controllers.controller('AddEventController', ['$scope', '$window', '$routeParams','Users','Events','$http', function($scope, $window, $routeParams,Users, Events,$http) {
$scope.data = {};

// $scope.verified = true;
// 
// function showView(userLoggedIn){
//   if(!userLoggedIn){
//     $scope.verified = false;
//   }else{
//     $scope.verified = true;
//   }
// }

$http.get('/profile').success(function(data) {
      // console.log(data);
      if(!data.error) {
        $scope.profile = true;
        sessionStorage.setItem("name",data.user.local.name);
        sessionStorage.setItem("uid",data.user._id);

        // $window.sessionStorage.setItem('user',data.user.local);
         // = data.user.local;
        // console.log(data.user.local);
        // console.log($window.sessionStorage.getItem('user').email);
      }
      });

// showView(sessionStorage.getItem("name"));

console.log('global');
console.log('name: '+sessionStorage.getItem("name"));
console.log('id: '+sessionStorage.getItem("uid"));
$scope.uname = sessionStorage.getItem("name");

// console.log($window.sessionStorage.user);
// $scope.user = $window.sessionStorage.user;


$scope.foodStyles = 'American';

$scope.addEvent = function(){

    var newData = {
      name: $scope.data.name,
      time: $scope.data.date.toLocaleDateString(),
      hour: $scope.data.time.toLocaleTimeString(),
      place: $scope.data.place,
      description: $scope.data.description,
      host: sessionStorage.getItem("name"),
      hostId: sessionStorage.getItem("uid"),
      attending: [],
      maximumLimit: $scope.data.limit,
      completed: false,
      foodstyle: $scope.foodStyles,
      occassion: $scope.data.occasion
    }

    console.log(newData);

    Events.addEvent(newData)
        .success(function(data){
        $scope.errorMessage = "";
        $scope.successMessage = "Event " + data.data.name + " has been added!";
      //   if($scope.assignedUser) {
      //       $scope.data = {};
      //       $scope.users[$scope.assignedUser].pendingTasks.push(data.data._id);
      //       Users.updateUser($scope.users[$scope.assignedUser]._id,$scope.users[$scope.assignedUser])
      //           .success(function(data){
      //               console.log("task added sucesssfully");
      //           }).error(function(err){
      //           if(err)
      //               console.log("fail to update user " + err);
      //       });
      // }
    }).error(function(err){
        if(err) {
          $scope.errorMessage = err.message;
          $scope.successMessage = "";
          console.log("fail to add Event"+err);
        }
    });

};
}]);