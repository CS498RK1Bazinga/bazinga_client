var mp4Controllers = angular.module('mp4Controllers', []);

mp4Controllers.controller('EventDetailController', ['$scope', '$http','$rootScope','$routeParams' , '$window','Events','Users', function($scope, $http,$rootScope,$routeParams, $window,Events,Users) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
  $scope.data = "";
  $scope.user = {};
  $scope.eid = $routeParams.id;
  $scope.id = $routeParams.id;
  $scope.hid = "";
  console.log($routeParams.id);

  $scope.event = {};
  $scope.attendents=[];
  Events.getEvent($routeParams.id).success(function(data){
      console.log(data.data._id);
      console.log(data.data._id === $routeParams.id);
      $scope.event = data.data;
      Users.getUser($scope.event.hostId).success(function(data){
      $scope.user = data.data.local;
      console.log($scope.user);
      $scope.hid = data.data._id;
      $scope.event.time = dateFormat($scope.event.time);
      $scope.event.hour = timeFormat($scope.event.hour);
       });

      for (var i = 0; i < $scope.event.attending.length; i++) {
      Users.getUser($scope.event.attending[i]).success(function(data){
          $scope.attendents.push(data.data.local.name);
      });

      // if(!$scope.event.attending){
      //   $scope.attendents = '';
      // }
      // $scope.event.attending[i]
  }

  });

  $scope.remove = function(eid){
      console.log(eid);
      //remove the event from users 
      //remove from host user
      //remove the event

      for (var i = 0; i < $scope.event.attending.length; i++) {
      Users.getUser($scope.event.attending[i]).success(function(data){
          data.data.local.attending.splice(eid,1);
          Users.updateUser(data.data._id,data.data).success(function(d1){
              console.log('removed from list');
          });
      });
    }

      Users.getUser($rootScope.curr_user._id).success(function(data){
            data.data.local.hosting.splice(eid,1);
            console.log('removed from host');
      });

      Events.deleteEvent(eid).success(function(d1){
          console.log("event removed");
      });

  }

  // console.log($scope.hid);




        //   $scope.map = new google.maps.Map(document.getElementById('map'), {
        //   center: {lat: 40.10195230000001, lng: -88.22716149999997},
        //   // (40.10195230000001, -88.22716149999997)
        //   zoom: 13
        // });
 // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  //Tasks.getSpecific($routeParams.id).success(function(usr,detail){$scope.task = usr.data;});
}]);

mp4Controllers.controller('EditEventController', ['$scope', '$http','$rootScope','$routeParams' ,'$window','Events','Users', function($scope, $http,$rootScope,$routeParams, $window,Events,Users) {
  $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
  console.log('edit event' + $routeParams.eventId);
  // console.log($scope.data.hour);
  $scope.data = {};

  Events.getEvent($routeParams.eventId).success(function(data){
    $scope.data = data.data;
        console.log($scope.data);

    $scope.data.time = new Date($scope.data.time);
    $scope.data.hour = new Date($scope.data.hour);
    $scope.data.maximumLimit = parseInt($scope.data.maximumLimit);
    // var str = $scope.data.hour.split(":");
    // var str_1 = str[2].substr(2,3);
    // console.log('hour'+str[0]);
    // var hourHand = 0;
    // console.log("str1==" + str_1);
    // if(str_1 === " PM"){
      // hourHand = parseInt(str[0]) + 12;
    // }else{
      // hourHand = parseInt(str[0]);
    // }
    // $scope.data.hourl = new Date($scope.data.time.getYear(),$scope.data.time.getMonth(),$scope.data.time.getDate(),hourHand,str[1],str[2].substr(0,2));

  });


  $scope.editEvent = function(){
    console.log($scope.data);
    // var lmt = $scope.data.maximumLimit;
    // console.log(lmt);
    // var c = $scope.data.hourl.getHours() + " "+$scope.data.hourl.getMinutes();
    // console.log(c);
    var b = $scope.data;

      Events.updateEvent($routeParams.eventId,b).success(function(dat1a){
            console.log('updated');
            console.log(dat1a);
      });
  };
}]);

mp4Controllers.controller('NewsFeedController', ['$scope', '$window','$rootScope', 'Events','Users', function($scope, $window, $rootScope, Events, Users) {
   $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
   $scope.events = {};
  // $scope.showOption = "where={}";
   $scope.order = "1";
   $scope.sortBy = "name";
   $scope.events = {};

   Events.getEvent(("?sort={" + $scope.sortBy + ":" + $scope.order + "}"+"&skip=" +$scope.skip+"&limit=10"))
     .success(function(data){
       $scope.events = data.data;
       for (var i = 0; i < $scope.events.length; i++) {

          $scope.events[i].time = dateFormat($scope.events[i].time);
          if($scope.events[i].hour){
                      $scope.events[i].hours = timeFormat($scope.events[i].hour);
          }
            // initialize attending
           if($scope.events[i].attending.indexOf($rootScope.curr_user._id) === -1) {
              $scope.events[i].isActive = true;
              $scope.events[i].rsvpText = "RSVP"
           }
           else {
              $scope.events[i].isActive = false;
              $scope.events[i].rsvpText = "Cancel";
          }
       }

   });

   $scope.rsvpUser = function(uid,eid) {

     //update the event.attending[] to include the uid.
     //update the user's attending [] to include eid

     Events.getEvent(eid).success(function(data){
           if(data.data.attending.indexOf(uid) === -1){
              data.data.attending.push(uid);
           }else {
             data.data.attending.splice(data.data.attending.indexOf(uid), 1);
           }
             Events.updateEvent(eid,data.data).success(function(data_0){
               Events.getEvent(("?sort={" + $scope.sortBy + ":" + $scope.order + "}"+"&skip=" +$scope.skip+"&limit=10"))
                 .success(function(data){
                   $scope.events = data.data;
                   for (var i = 0; i < $scope.events.length; i++) {
                        // initialize attending
                       $scope.events[i].time = dateFormat($scope.events[i].time);
                       if($scope.events[i].attending.indexOf($rootScope.curr_user._id) === -1) {
                          $scope.events[i].isActive = true;
                          $scope.events[i].rsvpText = "RSVP"
                       }
                       else {
                          $scope.events[i].isActive = false;
                          $scope.events[i].rsvpText = "Cancel";
                      }

                   }
               });
             });

     });


     Users.getUser(uid).success(function(data){
        if(data.data.local.attending.indexOf(eid) === -1){
            data.data.local.attending.push(eid);
        } else {
          data.data.local.attending.splice(data.data.local.attending.indexOf(eid), 1);
        }
            Users.updateUser(uid,data.data.local).success(function(data_0){
                  console.log("Updated user's attending []");
            });
     });

   }


   $scope.toggleActive = function(index) {
     console.log($scope.events[index]);
       $scope.events[index].isActive = !$scope.events[index].isActive;
       if($scope.events[index].isActive)
         $scope.events[index].rsvpText = "RSVP";
       else
         $scope.events[index].rsvpText = "Cancel";
  };
  //
  $scope.$watchGroup(['sortBy','showOption','order','skip'], function (newVal, oldVal) {
       Events.getEvent("?sort={" + $scope.sortBy + ":" + $scope.order + "}&" + $scope.showOption +"&skip=" +$scope.skip+"&limit=10")
         .success(function(data){
           $scope.events = data.data;
           for (var i = 0; i < $scope.events.length; i++) {
                // initialize attending
               $scope.events[i].time = dateFormat($scope.events[i].time);
               if($scope.events[i].attending.indexOf($rootScope.curr_user._id) === -1) {
                  $scope.events[i].isActive = true;
                  $scope.events[i].rsvpText = "RSVP"
               }
               else {
                  $scope.events[i].isActive = false;
                  $scope.events[i].rsvpText = "Cancel";
              }

           }

       });
     }, true);


}]);

//user list
mp4Controllers.controller('UserController', ['$scope', '$rootScope', '$window', 'Users', function($scope, $rootScope, $window, Users) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
   $scope.users = {};

   $scope.predicate = 'name';

   Users.getAllUsers().success(function(users) {
      console.log(users.data);
      $scope.users = users.data;
   }).error(function(err) {
    if (err)
      console.log("error");
   });

   $scope.follow = function(userID){
          Users.getUser($rootScope.curr_user._id).success(function(data){
          data.data.local.following.push(userID);
          Users.updateUser($rootScope.curr_user._id, data.data.local).success(function(data_0){
                console.log("Updated user's friends []");
          });
     });
    }
}]);

// add user
mp4Controllers.controller('AddUserController', ['$scope', '$window', '$routeParams', 'Users'  , function($scope, $window, $routeParams, Users) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
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
mp4Controllers.controller('EditUserController', ['$scope', '$rootScope', '$window', '$routeParams', '$http', 'Users', function($scope, $rootScope, $window, $routeParams, $http, Users) {
   /* Get user data passportjs */
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);

   $scope.user = $rootScope.curr_user;

   $scope.name = $scope.user.local.name;
   $scope.email = $scope.user.local.email;
   $scope.phoneNumber = $scope.user.local.phoneNumber;
   $scope.gender = $scope.user.local.gender;
   $scope.edit_user = function(user) {
      $scope.editUser = {
        name: $scope.name,
        email: $scope.email,
        password: $scope.user.local.password,
        phoneNumber: $scope.phoneNumber,
        gender: $scope.gender,
        image: $scope.user.local.image,
        attending: $scope.user.local.attending,
        hosting: $scope.user.local.hosting,
        history: $scope.user.local.history,
        following: $scope.user.local.following
      };
      // console.log($scope.editUser);
      Users.updateUser($scope.user._id, $scope.editUser).success(function(data) {
        $rootScope.curr_user = data.data;
          $window.sessionStorage.setItem('curr_user', JSON.stringify(data.data));
        $scope.user = data.data;
        $scope.name = $scope.user.local.name;
          console.log($scope.name);
        $scope.email = $scope.user.local.email;
        $scope.phoneNumber = $scope.user.local.phoneNumber;
        $scope.gender = $scope.user.local.gender;

          $scope.message = "User edited!";
      }).error(function(err) {
          console.log("Couldn't edit user");
      });
   };


}]);

//task list
mp4Controllers.controller('TaskController', ['$scope', '$window','CommonData', 'Users', 'Tasks', function($scope, $window, CommonData, Users, Tasks) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);

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
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);

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
mp4Controllers.controller('TaskDetailController', ['$scope', '$window','$routeParams' ,'Tasks', function($scope, $window, $routeParams, Tasks) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
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

mp4Controllers.controller('ProfileController', ['$scope', '$window','$rootScope', '$routeParams', '$http', 'Users', function($scope, $window, $rootScope, $routeParams, $http, Users) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);

 Users.getUser($routeParams.userId).success(function(data) {

    $scope.user = data.data;
    }).error(function(err) {
      if (err)
        console.log(err);
 });

  /* Get user data passportjs */

   //$scope.id = $routeParams.userId;

}]);


// can we edit the date in edit task?
mp4Controllers.controller('EditTaskController', ['$scope', '$window','$routeParams' ,'Tasks', 'CommonData', function($scope, $window, $routeParams, Tasks, CommonData) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
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


mp4Controllers.controller('LoginController', ['$scope', '$window','$rootScope', '$http', '$location', function($scope, $window, $rootScope, $http, $location) {

    $scope.user = {};
    $rootScope.curr_user = '';

    $scope.login = function(){
        $http.post('/login', {
          email: $scope.user.email,
          password: $scope.user.password,
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Authentication successful!';

          $rootScope.curr_user = user;
            $window.sessionStorage.setItem('curr_user', JSON.stringify(user));
          $location.url('/users/'+user._id);
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Authentication failed.';
          $location.url('/login');
        });
    };

}]);


mp4Controllers.controller('SignUpController', ['$scope', '$window','$http', '$rootScope', '$location', function($scope, $window, $http, $rootScope, $location) {


    $scope.user = '';
    $rootScope.curr_user = '';
    $scope.signup = function(){
        $http.post('/signup', {
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password,
          phoneNumber: $scope.user.phoneNumber,
          gender: $scope.user.gender,
          image: "",
          attending: [],
          hosting: [],
          history: [],
          following: []
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.curr_user = user;
            $window.sessionStorage.setItem('curr_user', JSON.stringify(user));
          $location.url('/users/'+user._id);
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Signup failed.';
          $location.url('/signup');
        });
    };

}]);

mp4Controllers.controller('AddEventController', ['$scope', '$window', '$rootScope', '$routeParams','Users','Events','$http', function($scope, $window,$rootScope, $routeParams,Users, Events,$http) {
    $rootScope.curr_user = JSON.parse($window.sessionStorage.curr_user);
$scope.data = {};
$scope.foodStyles = 'American';

$scope.addEvent = function(){

	console.log($rootScope.curr_user.local.name);
	console.log($rootScope.curr_user._id);
    var newData = {
      name: $scope.data.name,
      time: $scope.data.date,
      hour: $scope.data.time,
      place: $scope.data.place,
      description: $scope.data.description,
      host: $rootScope.curr_user.local.name,
      hostId: $rootScope.curr_user._id,
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

        Users.getUser($rootScope.curr_user._id).success(function(data1){
            data1.data.local.hosting.push(data.data._id);
            Users.updateUser($rootScope.curr_user._id,data1.data.local).success(function(data2){
                console.log('updated to host events array');
            });
        });

    }).error(function(err){
        if(err) {
          $scope.errorMessage = err.message;
          $scope.successMessage = "";
          console.log("fail to add Event"+err);
        }
    });

};
}]);
