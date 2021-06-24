// // firebaseConfig for SchoolPlus Dev
// var firebaseConfig = {
//   apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
//   authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
//   databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
//   projectId: "schoolplus-dev-e8a2d",
//   storageBucket: "schoolplus-dev-e8a2d.appspot.com",
//   messagingSenderId: "330523876306",
//   appId: "1:330523876306:web:cbdcee87b7e3e007"
// };
//PROD
var firebaseConfig = {
  apiKey: "AIzaSyDyC4t8wIotI9PFDVd5AACXUaw3y60h7Wk",
  authDomain: "schoolplus-prod.firebaseapp.com",
  databaseURL: "https://schoolplus-prod.firebaseio.com",
  projectId: "schoolplus-prod",
  storageBucket: "schoolplus-prod.appspot.com",
  messagingSenderId: "991751441024",
  appId: "1:991751441024:web:bd135bd34e706797"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();

//Initialize variables to get HTML elements
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
// const selectedClass = document.getElementById("selectClass");
// const selectedStudent = document.getElementById("selectStudent");
const navMenu = document.getElementById('main-menu-navigation');
const rightMenu = document.getElementById('rightMenu');
const selectedTeacher = document.getElementById('selectTeacher');
const selectedMatiere = document.getElementById('selectMatiere');
const selectedClass = document.getElementById("selectClass");
const selectedStudent = document.getElementById("selectStudent");
const selectedRecur = document.getElementById('selectRecur');
const className = document.getElementById('className');
const showMatiere = document.getElementById('showMatiere');
const showActivities = document.getElementById('showActivities');
const showDescription = document.getElementById('showDescription');
const showClassName = document.getElementById('showClassName');
const classNameTeacher = document.getElementById('classNameTeacher');
const modifyEventTitleTeacher = document.getElementById('modifyEventTitleTeacher');
const modifyEventDescriptionTeacher = document.getElementById('modifyEventDescriptionTeacher');
const modifyDateEvent = document.getElementById('modifyDateEvent');
const modifyStartEvent = document.getElementById('modifyStartEvent');
const modifyEndEvent = document.getElementById('modifyEndEvent');
const selectModifyMatiere = document.getElementById('selectModifyMatiere');
const selectModifyTeacher = document.getElementById('selectModifyTeacher');
const selectModifyStudent = document.getElementById('selectModifyStudent');
const selectModifyClass = document.getElementById('selectModifyClass');
const selectModifyRecur = document.getElementById('selectModifyRecur');
const modifyRecurrenceSection = document.getElementById('modifyRecurrenceSection');
const modifyEndRecur = document.getElementById('modifyEndRecur');
const modifyStartRecur = document.getElementById('modifyStartRecur');
const color = document.getElementById('selectColor');
const adminSection = document.getElementById('adminSection');
const adminSectionClick = document.getElementById('adminSectionClick');
const selectedTeacherClick = document.getElementById('selectTeacherClick');
const selectedMatiereClick = document.getElementById('selectMatiereClick');
const selectedClassClick = document.getElementById('selectClassClick');
const selectedStudentClick = document.getElementById('selectStudentClick');
const selectedRecurClick = document.getElementById('selectRecurClick');
const selectedColorClick = document.getElementById('selectColorClick');
const attendeesTeacher = document.getElementById('attendeesTeacher');
const attendeesAdmin = document.getElementById('attendeesAdmin');



document.addEventListener('DOMContentLoaded', function () {

  // Add a realtime listener for Firebase Authentification
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

      var user = auth.currentUser;
      var query = firestore.collection("users").doc(user.uid);
      query.get().then(function (doc) {

        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        getUserNotif();
        // getStoredData();

        if (doc.data().userCategory == 'student') {
          initCalendar(user.uid, doc.data().userCategory, doc.data().instituteName, doc.data().idAdmin, doc.data().firstName, doc.data().lastName, doc.data().classe);

        }
        else {

          initCalendar(doc.data().linkedAccount, doc.data().userCategory, doc.data().instituteName, doc.data().idAdmin, doc.data().firstName, doc.data().lastName, doc.data().classe);

        }


        /* 
        var notifications = [];
        var newNotif = 0;
        
        firestore.collection('users').get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc2) {
            firestore.collection('users').doc(doc2.id).set({
              notifications: notifications,
              newNotif: newNotif
            },
            {
              merge: true
            }).then(function() {
              console.log("good for : ", doc2.data().firstName + " "+doc2.data().lastName);
            }).catch(function(error) {
              console.log("Error: ", error);
            });
          });
        }).catch(function(err) {
          console.log("Error setting documents: ", err);
        }); */

      });
    } else {
      firebase.auth().signOut();
      location.href = "../../pages/fr/login.php";
    }
  });

  //Log out manager
  var hrefLogOut = document.getElementById("hrefLogOut");
  hrefLogOut.addEventListener('click', e => {
    //alert('je veux déco');
    firebase.auth().signOut().then(function () {
      localStorage.removeItem('data');
      localStorage.removeItem('dataSubjects');
      location.href = "../../pages/fr/login.php";

    });
  });

  function getUserInfo() {
    var user = auth.currentUser;
    var query = firestore.collection('users').doc(user.uid);
    var userName = "";




    //Display user's profile picture and username
    query.get().then(function (doc) {
      if (doc.data().firstName = "" || doc.data().firstName == null) {
        userName = user.email
        if (userName.includes('@')) {
          var splitUserName = userName.split('@');
          userName = splitUserName[0];
        }
      } else {
        userName = doc.data().firstName;
      }
      if (user.uid == 'ZC57kLf1XpUOXh9QJUNDKS2pMgg1') {
        //Zoé
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1');
      } else if (user.uid == 'BTJJml8emCUEPESMXP83TSuZb3T2') {
        //Sam
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1');
      } else if (user.uid == 'aK6z19BqqebTTVkh3aDZJCJhXmF3') {
        //Noé
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1');
      } else if (user.uid == 'yKjFJ4dQLsTQM9aaEf1DgqrToWM2') {
        //Thomas
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1');
      } else if (user.uid == 'wfsvR6T7NFO48NqI3VMyNAGgDIq1') {
        //Timéo
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1');
      } else if (user.uid == 'mvudqo88IDfKh80lf9mTxGUrnN23') {
        //TOTO 1EVOL
        document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1');
      } else {
        document.getElementById('virtualClass').setAttribute('href', '#');

      }
      username.innerHTML = "<b>" + userName + "</b>";
      var childName = 'profile_pictures/' + user.uid;
      firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
        profilPicUser.src = avatarUrl;
      }).catch((err) => {
        profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
      });

      ////TEST TIMESTAMP////
      /* var timestamp = 1566576000;
      var xx = new Date(timestamp*1000);
      
      
      
      console.log("DATE TEST : ",xx.getDay()); */
      ///////////////////

      setUserInterface(doc.data().userCategory, doc.data().instituteCategory);


      //Bloc used to delete event faster
      /* firestore.collection('activities').where("startDate", "==", 1568455200000).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          firestore.collection('activities').doc(doc.id).delete();
          console.log("doc id :" + doc.id + "deleted");
        });
      }).catch(function(err) {
        console.log("Error :r", err);
      }); */



    }).catch(function (err) {
      console.log('Error displaying user info: ', err);
    });

  }



  function setUserInterface(userCategory, instituteCategory) {
    // console.log("set user interface");
    var user = auth.currentUser;



    $('body[data-open="hover"] .dropdown').on('mouseenter', function () {
      if (!($(this).hasClass('open'))) {
        $(this).addClass('open');
      } else {
        $(this).removeClass('open');
      }
    }).on('mouseleave', function (event) {
      $(this).removeClass('open');
    });
    var menuType = $('body').data('menu');
    $('body[data-open="hover"] .dropdown a').on('click', function (e) {


      if (menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu') {
        var $this = $(this);
        console.log(Object.keys($this));
        if ($this.hasClass('dropdown-toggle')) {
          return false;
        }
      }
    });
  }

  function getDateTime(startTime, endTime) {
    var start = new Date(startTime);
    var end = new Date(endTime);
    var year = start.getFullYear();
    var month = start.getMonth() + 1;
    var day = start.getDate();
    var startHour = start.getHours();
    var startMinute = start.getMinutes();
    var startSecond = start.getSeconds();
    var endHour = end.getHours();
    var endMinute = end.getMinutes();
    var endSecond = end.getSeconds();
    if (month.toString().length == 1) {
      month = '0' + month;
    }
    if (day.toString().length == 1) {
      day = '0' + day;
    }
    if (startHour.toString().length == 1) {
      startHour = '0' + startHour;
    }
    if (startMinute.toString().length == 1) {
      startMinute = '0' + startMinute;
    }
    if (startSecond.toString().length == 1) {
      startSecond = '0' + startSecond;
    }
    if (endHour.toString().length == 1) {
      endHour = '0' + endHour;
    }
    if (endMinute.toString().length == 1) {
      endMinute = '0' + endMinute;
    }
    if (endSecond.toString().length == 1) {
      endSecond = '0' + endSecond;
    }
    var dateTime = day + '/' + month + '/' + year + ' ' + startHour + ':' + startMinute + ':' + startSecond + " - " + endHour + ':' + endMinute + ':' + endSecond;
    return dateTime;
  }

  function getTimeWithoutOffset(time) {
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var localISOTime = (new Date(time - tzoffset)).toISOString().slice(0, -1);

    return localISOTime;
  }

  $('#modifyStartEvent').on('change', function () {
    $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
    $('#modifyStartRecur').val($('#modifyStartEvent').val().slice(0, -6));

  });

  $('#modifyEndEvent').on('change', function () {

    $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));

  });

  $('#startEvent').on('change', function () {

    $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
    // console.log("TEST "+$('#startEvent').val().slice(0,-6));
    $('#startRecur').val($('#startEvent').val().slice(0, -6));

  });

  $('#endEvent').on('change', function () {

    $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));

  });

  $('select#selectColor').on('change', function () {
    // console.log("'" + color.value + "'");
    color.style.backgroundColor = color.value;  /* "'"+$('select#selectColor').val()+"'" */
  });

  $('select#selectRecur').on('change', function () {

    if ($('select#selectRecur').val() == "oui") {
      document.getElementById('recurrenceSection').style.display = "block";
    } else if ($('select#selectRecur').val() == "non") {
      document.getElementById('recurrenceSection').style.display = "none";
    }
  });

  $('#selectModifyRecur').on('change', function () {

    if ($('select#selectModifyRecur').val() == "oui") {
      document.getElementById('modifyRecurrenceSection').style.display = "block";
    } else if ($('select#selectModifyRecur').val() == "non") {
      document.getElementById('modifyRecurrenceSection').style.display = "none";
    }
  });




  //////////* -- CALENDAR -- *//////////

  function initCalendar(ID, userCategory, instituteName, idAdmin, firstName, lastName, studentClass) {
    var user = auth.currentUser;
    var calendarEl = document.getElementById('calendar'); // Refer to calendar html element
    var docRef = firestore.collection('activities').where("idUser", "==", ID).where('extrascolaire', '==', true);
    var events_array = [];


    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {

        if (doc.data().soutien != true) {
          events_array.push({
            title: doc.data().title,              //Populate events_array with data
            start: doc.data().startDate,
            end: doc.data().endDate,
            id: doc.data().id,
            startRecur: doc.data().startRecur,
            endRecur: doc.data().endRecur,
            classe: doc.data().classe,
            startTime: doc.data().startTime,
            endTime: doc.data().endTime,
            daysOfWeek: doc.data().daysOfWeek,
            tip: 'tip',
            color: doc.data().eventColor,
            editable: false
          });
        }
        // console.log(doc.id, "=>", doc.data().startDate);
      });

      $('#modalAddEvent').on('hidden.bs.modal', function () {  //Permet de clear les sélections effectuées par l'utilisateur lorsque celui-ci
        //console.log('modal fermé');                            //annule la création d'un événement en cliquant ailleurs / fermant le modal
        $("#formEvent").off();
      });

      $('#modalModifyEvent').on('hidden.bs.modal', function () {
        $('#formModifyEvent').off();
        $('#btnDeleteEvent').off();
      });

      $('#modalModifyTeacher').on('hidden.bs.modal', function () {
        // alert("fermé");
        $('#formModifyEventTeacher').off();
      });



      if ($(window).width() < 750) {
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: ['dayGrid', 'timeGrid', 'bootstrap', 'interaction', 'moment'], // List of used fullcalendar's plugins
          // defaultView: 'timeGridWeek',  //Default view set on Agenda view with times
          // firstDay: 1,  //Defines agenda's view first day on Monday

          header:
          {
            left: 'today prev,next',
            center: 'title',
            right: ''
          },

          buttonText: {
            today: "Aujourd'hui"
          },
          views: {
            timeGridFourDay: {
              type: 'timeGrid',
              duration: { days: 1 },
              buttonText: '1 day'
            }
          },
          defaultView: 'timeGridFourDay',
          minTime: "07:00:00",
          maxTime: "19:00:00",
          height: 'auto',
          locale: 'fr', //Defines calendar's lang
          timeZone: 'local', //Timezone set on local
          //eventOverlap: false,
          allDaySlot: false,
          weekends: true, // Afficher - cacher les weekends
          themeSystem: 'bootstrap', //Theme utilisé 

          events: events_array,
          selectable: true,
          unselectAuto: true,
          /* eventRender: function(info) {
            let tooltip = new Tooltip(info.el, {
              title: 'test',
              placement: 'right',
              trigger: 'hover',
              container: 'body',
            });
            console.log(tooltip);
          }, */

          select: function (info) {  //When a period is selected, this function is triggered

            document.getElementById("newEventTitle").value = '';
            $("#modalAddEvent").modal();

            // => '2015-01-26T06:40:36.181'

            $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
            $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
            $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
            $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()).slice(0, -13));

            $("#formEvent").submit(function (ev) {  //Once the form is submitted
              var newEventTitle = document.getElementById("newEventTitle").value;
              var newEventType = $("input[name='newEventType']:checked").val();
              var newEventDescription = document.getElementById("newEventDescription");
              var startEvent = Date.parse($('#startEvent').val());
              var endEvent = Date.parse($('#endEvent').val());
              var newColor;


              document.getElementById('loadingGIF').style.display = 'block';
              document.getElementById('addModalBody').style.display = 'none';

              ev.preventDefault();

              switch (newEventType) {
                case 'Personnel':
                  newColor = '#52a03a';
                  break;
                case 'Entraînement':
                  newColor = '#46a2da';
                  break;
                case 'Compétition':
                  newColor = 'red';
              }

              if ($('select#selectRecur').val() == "non") {
                //We write the activity for the concerned user only.
                firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + "extra")
                  .set({
                    idUser: user.uid,
                    typeActivity: newEventType,
                    eventColor: newColor,
                    startDate: startEvent,
                    endDate: endEvent,
                    id: user.uid + "_" + startEvent + "_" + "extra",
                    title: newEventTitle,
                    editable: true,
                    description: newEventDescription.value,
                    activityDone: false,
                    extrascolaire: true
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("The activity has been created.");

                      firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra")
                        .set({
                          idUser: idAdmin,
                          idStudent: user.uid,
                          classStudent: studentClass,
                          classStudent: studentClass,
                          firstName: firstName,
                          lastName: lastName,
                          typeActivity: newEventType,
                          eventColor: newColor,
                          startDate: startEvent,
                          endDate: endEvent,
                          id: idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra",
                          title: newEventTitle,
                          editable: true,
                          description: newEventDescription.value,
                          activityDone: false,
                          extrascolaire: true
                        },
                          {
                            merge: true
                          }).then(function () {

                            calendar.addEvent({
                              title: newEventTitle,
                              start: startEvent,
                              end: endEvent,
                              id: user.uid + "_" + startEvent + "_" + "extra",
                              color: newColor,
                              editable: true,
                              allDay: false,
                            });


                            document.getElementById('loadingGIF').style.display = 'none';
                            document.getElementById('addModalBody').style.display = 'block';
                            $("#modalAddEvent").modal("hide"); //Hide modal
                            newEventTitle = '';
                          }).catch(function (err) {
                            console.log("error :", err)
                          });


                    }).catch(function (err) {
                      console.log("Error while creating activity:", err);
                    });


              }
              else {
                var newDateRecur = new Date(startEvent);
                var recur = [newDateRecur.getDay()];
                var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
                startEventRecur = startEventRecur * 3600000;
                var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours();
                endEventRecur = endEventRecur * 3600000
                var startRecur = Date.parse($('#startRecur').val());
                var endRecur = Date.parse($('#endRecur').val());


                //We write the activity for the concerned user only.
                firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + "extra")
                  .set({
                    idUser: user.uid,
                    typeActivity: newEventType,
                    eventColor: newColor,
                    startDate: startEvent,
                    endDate: endEvent,
                    id: user.uid + "_" + startEvent + "_" + "extra",
                    startTime: startEventRecur, ///ICIII
                    endTime: endEventRecur,  ///ICIIII
                    startRecur: startRecur,
                    endRecur: endRecur,      //1576828800000  --> 20 Décembre 2019
                    title: newEventTitle,
                    editable: false,
                    description: newEventDescription.value,
                    activityDone: false,
                    daysOfWeek: recur,
                    extrascolaire: true
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("The activity has been created.");

                      firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra")
                        .set({
                          idUser: idAdmin,
                          idStudent: user.uid,
                          classStudent: studentClass,
                          classStudent: studentClass,
                          typeActivity: newEventType,
                          firstName: firstName,
                          lastName: lastName,
                          eventColor: newColor,
                          startDate: startEvent,
                          endDate: endEvent,
                          id: idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra",
                          startTime: startEventRecur, ///ICIII
                          endTime: endEventRecur,  ///ICIIII
                          startRecur: startRecur,
                          endRecur: endRecur,      //1576828800000  --> 20 Décembre 2019
                          title: newEventTitle,
                          editable: false,
                          description: newEventDescription.value,
                          activityDone: false,
                          daysOfWeek: recur,
                          extrascolaire: true

                        },
                          {
                            merge: true
                          }).then(function () {

                            calendar.addEvent({
                              title: newEventTitle,
                              start: startEvent,
                              end: endEvent,
                              startTime: startEventRecur,
                              endTime: endEventRecur,
                              startRecur: startRecur,
                              endRecur: endRecur,
                              id: user.uid + "_" + startEvent + "_" + "extra",
                              color: newColor,
                              editable: false,
                              allDay: false,
                              daysOfWeek: recur,
                            });


                            document.getElementById('loadingGIF').style.display = 'none';
                            document.getElementById('addModalBody').style.display = 'block';
                            $("#modalAddEvent").modal("hide"); //Hide modal
                            newEventTitle = '';
                          }).catch(function (err) {
                            console.log("Erorr :", err);
                          });

                    }).catch(function (err) {
                      console.log("Error while creating activity:", err);
                    });
              }





            });
          },

          /*  eventDrop: function (info) { //When an event is dragged on another day/time slot this function is triggered
            var newStartDate = info.event.start.getTime();
            var newEndDate = info.event.end.getTime();
            var arrayStudents = [];
            
            if (!confirm("Êtes-vous sûr de vouloir modifier cet événement ?")) {
              info.revert();
            } else {
              
              if (userCategory == "student") {
                firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).get()
                .then(function (doc) {
                  if (doc && doc.exists) {
                    var data = doc.data();
                    // var editableValue = false;
                    // if(data.teacherID == undefined || data.teacherID == "")
                    // {
                    //   editableValue = true;
                    // }
                    firestore.collection('activities').doc(user.uid + "_" + newStartDate).set({
                      idUser: user.uid,
                      typeActivity: data.typeActivity,
                      eventColor: data.eventColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: data.title,
                      editable: true,
                      description: data.description,
                      activityDone: false
                      
                    }).then(function () {
                      console.log("New document added");
                      
                      
                      firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).delete();
                    });
                  }
                }).catch(function (err) {
                  console.log("Error : ", err);
                });
              } else if (userCategory == "teacher") {
                firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).get()
                .then(function (doc) {
                  if (doc && doc.exists) {    //On récupère l'activité du prof
                  
                  var data = doc.data();
                  arrayStudents = data.students;
                  firestore.collection('activities').doc(user.uid + "_" + newStartDate).set({
                    idUser: user.uid,
                    typeActivity: data.typeActivity,
                    eventColor: data.eventColor,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    title: data.title,
                    editable: true,
                    description: data.description,
                    activityDone: false,
                    students: data.students
                    
                  }).then(function () {
                    console.log("New document added");
                    for (var i = 0; i < data.students.length; i++) {
                      
                      //  var studentData = doc.student.data();
                      
                      firestore.collection('activities').doc(data.students[i] + "_" + info.oldEvent.start.getTime()).delete();
                      firestore.collection('activities').doc(data.students[i] + "_" + newStartDate)
                      .set({
                        idUser: data.students[i],
                        typeActivity: data.typeActivity,
                        eventColor: data.eventColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: data.title,
                        editable: false, //Student should not edit event programmed by teacher
                        description: data.description,
                        activityDone: false,
                        teacherID: user.uid
                      }).then(function () {
                      }).catch(function (err) {
                        console.log("Error : ", err);
                      });
                    }
                    
                    firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).delete();
                  }).catch(function (err) {
                    console.log('Error :', err);
                  });
                }
              }).catch(function (err) {
                console.log("Error : ", err);
              });
            }
          }  //END IF ELSE
        }, */

          /*    eventResize: function (info) { //When an event is resized, this function is triggered
            var newEndDate = info.event.end.getTime();
            var query = firestore.collection('activities').doc(info.event.id);
            if (userCategory == "teacher") {
              query.get().then(function (doc) {
                query.set({
                  endDate: newEndDate,
                  endTime: info.event.end.getHours()*3600000
                }, {
                  merge: true
                }).then(function () {
                  console.log("modification terminée");
                  // for (var i = 0; i < doc.data().students.length; i++) {
                  //   firestore.collection('activities').doc(doc.data().students[i] + "_" + info.prevEvent.start.getTime())
                  //   .set({
                  //     endDate: newEndDate
                  //   },
                  //   {
                  //     merge: true
                  //   }).then(function () {
                  //     console.log("modification réalisée pour les élèves");
                  //   }).catch(function (err) {
                  //     console.log("Error : ", err);
                  //   })
                  // }
                  firestore.collection('activities').where("classe","==",doc.data().classe).where("startDate", "==", doc.data().startDate).get()
                  .then(function(querySnapshot) 
                  {
                    querySnapshot.forEach(function(doc) {
                      firestore.collection('activities').doc(doc.data().id)
                      .set({
                        endDate: newEndDate,
                        endTime: info.event.end.getHours()*3600000
                      }, {
                        merge: true
                      }).catch(function(err) {
                        console.log("Error: ",err);
                      });
                    });
                  }).catch(function(err) {
                    console.log("Error :", err);
                  });
                }).catch(function (er) {
                  console.log("Error : ", er);
                });
              });
            } else if(userCategory =="student")
            {
              query.set({
                endDate: newEndDate
              }, {
                merge: true
              }).then(function() {
                console.log("Resize student completed");
              }).catch(function(err) {
                console.log("Error :", err);
              });
            }
          }, */

          eventClick: function (info) {  //When an event is clicked this function is triggereda

            // console.log(info.event.id);
            console.log(info.event.start.getTime());
            var oldTitle = info.event.title;
            // var oldStartDate = info.event.start.getTime();
            var query = firestore.collection('activities').doc(info.event.id);

            query.get().then(function (doc) {

              var oldStartDate = doc.data().startDate;
              console.log("OldStartDate = ", oldStartDate);


              //ADMIN SECTION


              $('#modalModifyEvent').modal();

              var modifiedEventTitle = document.getElementById("modifyEventTitle");
              var modifiedEventDescription = document.getElementById("modifyEventDescription");


              modifiedEventDescription.value = "";

              $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
              $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
              $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
              $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startDate).slice(0, -13));

              //titre
              $('#modifyEventTitle').val(doc.data().title);

              //Generate list of students according to the seleced class and subject (also checks for specialty subjects)

              //We check whether the event is recurring or not. We set according inputs depending on the case
              if (doc.data().startRecur == undefined || doc.data().startRecur == '') {
                //Event is not recurrent, we don't display recurring section
                $('select#selectModifyRecur').val('non');
                document.getElementById('modifyRecurrenceSection').style.display = "none";

              } else {
                //Event is reccurent, we display recurring section along with setting the end recurring date
                $('select#selectModifyRecur').val('oui');
                document.getElementById('modifyRecurrenceSection').style.display = "block";
                $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)).slice(0, -13));
              }



              //We set description
              modifiedEventDescription.value = doc.data().description;

              //If description is empty we set placeholder
              if (info.event.description == undefined || info.event.description == "") {
                modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
              }

              //We check corresponding activity type
              $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
              // End filling up inputs

              $('#formModifyEvent').submit(function (eve) {

                eve.preventDefault();
                document.getElementById('modifyLoadingGIF').style.display = 'block';
                document.getElementById('modifyModalBody').style.display = 'none';
                var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                var newStartDate = Date.parse($('#modifyStartEvent').val());
                var newEndDate = Date.parse($('#modifyEndEvent').val());

                console.log("NewStartDate = ", newStartDate);
                if ($('select#selectModifyRecur').val() == "non") {
                  var newRecur = firebase.firestore.FieldValue.delete();
                  var modifyStartEventRecur = firebase.firestore.FieldValue.delete();
                  var modifyEndEventRecur = firebase.firestore.FieldValue.delete();
                  var modifyStartRecur = firebase.firestore.FieldValue.delete();
                  var modifyEndRecur = firebase.firestore.FieldValue.delete();
                }
                else {
                  var newDateRecur = new Date(newStartDate);
                  var newRecur = [newDateRecur.getDay()];
                  var modifyStartEventRecur = new Date(Date.parse($('#modifyStartEvent').val())).getHours();
                  modifyStartEventRecur = modifyStartEventRecur * 3600000;
                  var modifyEndEventRecur = new Date(Date.parse($('#modifyEndEvent').val())).getHours();
                  modifyEndEventRecur = modifyEndEventRecur * 3600000
                  var modifyStartRecur = Date.parse($('#modifyStartRecur').val());
                  var modifyEndRecur = Date.parse($('#modifyEndRecur').val());
                }

                var newColor;

                switch (modifiedEventType) {
                  case 'Personnel':
                    newColor = '#52a03a';
                    break;
                  case 'Entraînement':
                    newColor = '#46a2da';
                    break;
                  case 'Compétition':
                    newColor = 'red';
                }

                if (oldStartDate != newStartDate) {
                  //In this case we should recreate the event for each affected user and delete their old activity
                  console.log("Case 1: We need to delete/recreate.");

                  firestore.collection('activities').doc(user.uid + "_" + newStartDate + "_" + "extra")
                    .set({
                      idUser: user.uid,
                      typeActivity: modifiedEventType,
                      id: user.uid + "_" + newStartDate + "_" + "extra",
                      eventColor: newColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: $('#modifyEventTitle').val(),
                      editable: true,
                      description: modifiedEventDescription.value,
                      activityDone: false,
                      startTime: modifyStartEventRecur,
                      endTime: modifyEndEventRecur,
                      startRecur: modifyStartRecur,
                      endRecur: modifyEndRecur,
                      daysOfWeek: newRecur,
                      extrascolaire: true
                    },
                      {
                        merge: true
                      }).then(function () {
                        console.log("Modified");
                        console.log("main activity created, about to create admin's");

                        firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra")
                          .set({
                            idUser: idAdmin,
                            idStudent: user.uid,
                            classStudent: studentClass,
                            typeActivity: modifiedEventType,
                            id: idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra",
                            eventColor: newColor,
                            firstName: firstName,
                            lastName: lastName,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            title: $('#modifyEventTitle').val(),
                            editable: true,
                            description: modifiedEventDescription.value,
                            activityDone: false,
                            startTime: modifyStartEventRecur,
                            endTime: modifyEndEventRecur,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur,
                            daysOfWeek: newRecur,
                            extrascolaire: true
                          },
                            {
                              merge: true
                            }).then(function () {
                              console.log("Activity of admin should be good");
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('#modifyEventTitle').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + "extra",
                                  color: newColor,
                                  editable: false,
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('#modifyEventTitle').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + "extra",
                                  color: newColor,
                                  editable: false,
                                  allDay: false,
                                  startTime: modifyStartEventRecur,
                                  endTime: modifyEndEventRecur,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur,
                                  daysOfWeek: newRecur
                                });
                              }
                              firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + oldStartDate + "_" + "extra").delete();
                              query.delete();
                              console.log("Old event deleted");
                              console.log("diferent");
                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                              document.getElementById('modifyModalBody').style.display = 'block';
                              $('#modalModifyEvent').modal("hide");
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });




                      }).catch(function (err) {
                        console.log("Error :", err);
                      });

                }
                else {
                  //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                  console.log("Case 2: Update only.")
                  //I. Update admin's activity
                  query.update({
                    idUser: user.uid,
                    typeActivity: modifiedEventType,
                    id: user.uid + "_" + newStartDate + "_" + "extra",
                    eventColor: newColor,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    title: $('#modifyEventTitle').val(),
                    editable: true,
                    description: modifiedEventDescription.value,
                    activityDone: false,
                    startTime: modifyStartEventRecur,
                    endTime: modifyEndEventRecur,
                    startRecur: modifyStartRecur,
                    endRecur: modifyEndRecur,
                    daysOfWeek: newRecur,
                    extrascolaire: true
                  }).then(function () {
                    console.log("users's activity is now updated. About to update admin's")

                    firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra")
                      .update({
                        idUser: idAdmin,
                        idStudent: user.uid,
                        classStudent: studentClass,
                        typeActivity: modifiedEventType,
                        firstName: firstName,
                        lastName: lastName,
                        id: idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra",
                        eventColor: newColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: $('#modifyEventTitle').val(),
                        editable: true,
                        description: modifiedEventDescription.value,
                        activityDone: false,
                        startTime: modifyStartEventRecur,
                        endTime: modifyEndEventRecur,
                        startRecur: modifyStartRecur,
                        endRecur: modifyEndRecur,
                        daysOfWeek: newRecur,
                        extrascolaire: true
                      }).then(function () {
                        info.event.remove();
                        if ($('select#selectModifyRecur').val() == "non") {
                          calendar.addEvent({
                            title: $('#modifyEventTitle').val(),
                            start: newStartDate,
                            end: newEndDate,
                            description: modifiedEventDescription.value,
                            id: user.uid + "_" + newStartDate + "_" + "extra",
                            color: newColor,
                            editable: false,
                            allDay: false
                          });
                        }
                        else {
                          calendar.addEvent({
                            title: $('#modifyEventTitle').val(),
                            start: newStartDate,
                            end: newEndDate,
                            description: modifiedEventDescription.value,
                            id: user.uid + "_" + newStartDate + "_" + "extra",
                            color: newColor,
                            editable: false,
                            allDay: false,
                            startTime: modifyStartEventRecur,
                            endTime: modifyEndEventRecur,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur,
                            daysOfWeek: newRecur
                          });
                        }
                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                        document.getElementById('modifyModalBody').style.display = 'block';
                        $('#modalModifyEvent').modal("hide");


                      }).catch(function (err) {
                        console.log("Erorr :", err);;
                      })





                  }).catch(function (err) {
                    console.log("Error while updating admin's activity: ", err);
                  });







                }

              });


              $('#btnDeleteEvent').click(function () {

                if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                  console.log("no delete");
                } else {

                  firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + info.event.start.getTime() + "_" + "extra").delete();
                  console.log("Admin's actibity deleted, about to delete user's");
                  query.delete();
                  info.event.remove();
                  $("#modalModifyEvent").modal("hide"); //Hide modal
                }
              });

            }).catch(function (err) {
              console.log("Error :", err);
            });



          }
        });

      } else {
        var calendar = new FullCalendar.Calendar(calendarEl, {
          plugins: ['dayGrid', 'timeGrid', 'bootstrap', 'interaction', 'moment'], // List of used fullcalendar's plugins
          defaultView: 'timeGridWeek',  //Default view set on Agenda view with times
          firstDay: 1,  //Defines agenda's view first day on Monday

          header:
          {
            left: 'today prev,next',
            center: 'title',
            right: 'timeGridWeek timeGridDay'
          },
          buttonText: {
            today: "Aujourd'hui",
            day: "Jour",
            week: "Semaine"
          },
          customButtons:
          {
            addEventButton:
            {
              text: 'Ajouter un événement',
              click: function () {
                $('#modalAddEventClick').modal();
              }
            }
          },
          // slotDuration: '00:00:30',
          minTime: "07:00:00",
          maxTime: "19:00:00",
          slotDuration: "00:30:00",
          height: 'auto',
          locale: 'fr', //Defines calendar's lang
          timeZone: 'local', //Timezone set on local
          //eventOverlap: false,
          allDaySlot: false,
          weekends: true, // Afficher - cacher les weekends
          themeSystem: 'bootstrap', //Theme utilisé 

          events: events_array,
          selectable: true,
          unselectAuto: true,

          select: function (info) {  //When a period is selected, this function is triggered

            if (userCategory == 'student') {
              document.getElementById("newEventTitle").value = '';
              $("#modalAddEvent").modal();

              // => '2015-01-26T06:40:36.181'

              $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
              $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
              $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
              $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()).slice(0, -13));

              $("#formEvent").submit(function (ev) {  //Once the form is submitted
                var newEventTitle = document.getElementById("newEventTitle").value;
                var newEventType = $("input[name='newEventType']:checked").val();
                var newEventDescription = document.getElementById("newEventDescription");
                var startEvent = Date.parse($('#startEvent').val());
                var endEvent = Date.parse($('#endEvent').val());
                var newColor;


                document.getElementById('loadingGIF').style.display = 'block';
                document.getElementById('addModalBody').style.display = 'none';

                ev.preventDefault();

                switch (newEventType) {
                  case 'Personnel':
                    newColor = '#52a03a';
                    break;
                  case 'Entraînement':
                    newColor = '#46a2da';
                    break;
                  case 'Compétition':
                    newColor = 'red';
                }

                if ($('select#selectRecur').val() == "non") {
                  //We write the activity for the concerned user only.
                  firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + "extra")
                    .set({
                      idUser: user.uid,
                      typeActivity: newEventType,
                      eventColor: newColor,
                      startDate: startEvent,
                      endDate: endEvent,
                      id: user.uid + "_" + startEvent + "_" + "extra",
                      title: newEventTitle,
                      editable: true,
                      description: newEventDescription.value,
                      activityDone: false,
                      extrascolaire: true
                    },
                      {
                        merge: true
                      }).then(function () {
                        console.log("The activity has been created.");

                        firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra")
                          .set({
                            idUser: idAdmin,
                            idStudent: user.uid,
                            classStudent: studentClass,
                            classStudent: studentClass,
                            firstName: firstName,
                            lastName: lastName,
                            typeActivity: newEventType,
                            eventColor: newColor,
                            startDate: startEvent,
                            endDate: endEvent,
                            id: idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra",
                            title: newEventTitle,
                            editable: true,
                            description: newEventDescription.value,
                            activityDone: false,
                            extrascolaire: true
                          },
                            {
                              merge: true
                            }).then(function () {

                              calendar.addEvent({
                                title: newEventTitle,
                                start: startEvent,
                                end: endEvent,
                                id: user.uid + "_" + startEvent + "_" + "extra",
                                color: newColor,
                                editable: true,
                                allDay: false,
                              });


                              document.getElementById('loadingGIF').style.display = 'none';
                              document.getElementById('addModalBody').style.display = 'block';
                              $("#modalAddEvent").modal("hide"); //Hide modal
                              newEventTitle = '';
                            }).catch(function (err) {
                              console.log("error :", err)
                            });


                      }).catch(function (err) {
                        console.log("Error while creating activity:", err);
                      });


                }
                else {
                  var newDateRecur = new Date(startEvent);
                  var recur = [newDateRecur.getDay()];
                  var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
                  startEventRecur = startEventRecur * 3600000;
                  var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours();
                  endEventRecur = endEventRecur * 3600000
                  var startRecur = Date.parse($('#startRecur').val());
                  var endRecur = Date.parse($('#endRecur').val());


                  //We write the activity for the concerned user only.
                  firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + "extra")
                    .set({
                      idUser: user.uid,
                      typeActivity: newEventType,
                      eventColor: newColor,
                      startDate: startEvent,
                      endDate: endEvent,
                      id: user.uid + "_" + startEvent + "_" + "extra",
                      startTime: startEventRecur, ///ICIII
                      endTime: endEventRecur,  ///ICIIII
                      startRecur: startRecur,
                      endRecur: endRecur,      //1576828800000  --> 20 Décembre 2019
                      title: newEventTitle,
                      editable: false,
                      description: newEventDescription.value,
                      activityDone: false,
                      daysOfWeek: recur,
                      extrascolaire: true
                    },
                      {
                        merge: true
                      }).then(function () {
                        console.log("The activity has been created.");

                        firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra")
                          .set({
                            idUser: idAdmin,
                            idStudent: user.uid,
                            classStudent: studentClass,
                            classStudent: studentClass,
                            typeActivity: newEventType,
                            firstName: firstName,
                            lastName: lastName,
                            eventColor: newColor,
                            startDate: startEvent,
                            endDate: endEvent,
                            id: idAdmin + "_" + user.uid + "_" + startEvent + "_" + "extra",
                            startTime: startEventRecur, ///ICIII
                            endTime: endEventRecur,  ///ICIIII
                            startRecur: startRecur,
                            endRecur: endRecur,      //1576828800000  --> 20 Décembre 2019
                            title: newEventTitle,
                            editable: false,
                            description: newEventDescription.value,
                            activityDone: false,
                            daysOfWeek: recur,
                            extrascolaire: true

                          },
                            {
                              merge: true
                            }).then(function () {

                              calendar.addEvent({
                                title: newEventTitle,
                                start: startEvent,
                                end: endEvent,
                                startTime: startEventRecur,
                                endTime: endEventRecur,
                                startRecur: startRecur,
                                endRecur: endRecur,
                                id: user.uid + "_" + startEvent + "_" + "extra",
                                color: newColor,
                                editable: false,
                                allDay: false,
                                daysOfWeek: recur,
                              });


                              document.getElementById('loadingGIF').style.display = 'none';
                              document.getElementById('addModalBody').style.display = 'block';
                              $("#modalAddEvent").modal("hide"); //Hide modal
                              newEventTitle = '';
                            }).catch(function (err) {
                              console.log("Erorr :", err);
                            });

                      }).catch(function (err) {
                        console.log("Error while creating activity:", err);
                      });
                }





              });
            }



          },

          /*  eventDrop: function (info) { //When an event is dragged on another day/time slot this function is triggered
            var newStartDate = info.event.start.getTime();
            var newEndDate = info.event.end.getTime();
            var arrayStudents = [];
            
            if (!confirm("Êtes-vous sûr de vouloir modifier cet événement ?")) {
              info.revert();
            } else {
              
              if (userCategory == "student") {
                firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).get()
                .then(function (doc) {
                  if (doc && doc.exists) {
                    var data = doc.data();
                    // var editableValue = false;
                    // if(data.teacherID == undefined || data.teacherID == "")
                    // {
                    //   editableValue = true;
                    // }
                    firestore.collection('activities').doc(user.uid + "_" + newStartDate).set({
                      idUser: user.uid,
                      typeActivity: data.typeActivity,
                      eventColor: data.eventColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: data.title,
                      editable: true,
                      description: data.description,
                      activityDone: false
                      
                    }).then(function () {
                      console.log("New document added");
                      
                      
                      firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).delete();
                    });
                  }
                }).catch(function (err) {
                  console.log("Error : ", err);
                });
              } else if (userCategory == "teacher") {
                firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).get()
                .then(function (doc) {
                  if (doc && doc.exists) {    //On récupère l'activité du prof
                  
                  var data = doc.data();
                  arrayStudents = data.students;
                  firestore.collection('activities').doc(user.uid + "_" + newStartDate).set({
                    idUser: user.uid,
                    typeActivity: data.typeActivity,
                    eventColor: data.eventColor,
                    startDate: newStartDate,
                    endDate: newEndDate,
                    title: data.title,
                    editable: true,
                    description: data.description,
                    activityDone: false,
                    students: data.students
                    
                  }).then(function () {
                    console.log("New document added");
                    for (var i = 0; i < data.students.length; i++) {
                      
                      //  var studentData = doc.student.data();
                      
                      firestore.collection('activities').doc(data.students[i] + "_" + info.oldEvent.start.getTime()).delete();
                      firestore.collection('activities').doc(data.students[i] + "_" + newStartDate)
                      .set({
                        idUser: data.students[i],
                        typeActivity: data.typeActivity,
                        eventColor: data.eventColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: data.title,
                        editable: false, //Student should not edit event programmed by teacher
                        description: data.description,
                        activityDone: false,
                        teacherID: user.uid
                      }).then(function () {
                      }).catch(function (err) {
                        console.log("Error : ", err);
                      });
                    }
                    
                    firestore.collection('activities').doc(user.uid + "_" + info.oldEvent.start.getTime()).delete();
                  }).catch(function (err) {
                    console.log('Error :', err);
                  });
                }
              }).catch(function (err) {
                console.log("Error : ", err);
              });
            }
          }  //END IF ELSE
        }, */

          /*    eventResize: function (info) { //When an event is resized, this function is triggered
            var newEndDate = info.event.end.getTime();
            var query = firestore.collection('activities').doc(info.event.id);
            if (userCategory == "teacher") {
              query.get().then(function (doc) {
                query.set({
                  endDate: newEndDate,
                  endTime: info.event.end.getHours()*3600000
                }, {
                  merge: true
                }).then(function () {
                  console.log("modification terminée");
                  // for (var i = 0; i < doc.data().students.length; i++) {
                  //   firestore.collection('activities').doc(doc.data().students[i] + "_" + info.prevEvent.start.getTime())
                  //   .set({
                  //     endDate: newEndDate
                  //   },
                  //   {
                  //     merge: true
                  //   }).then(function () {
                  //     console.log("modification réalisée pour les élèves");
                  //   }).catch(function (err) {
                  //     console.log("Error : ", err);
                  //   })
                  // }
                  firestore.collection('activities').where("classe","==",doc.data().classe).where("startDate", "==", doc.data().startDate).get()
                  .then(function(querySnapshot) 
                  {
                    querySnapshot.forEach(function(doc) {
                      firestore.collection('activities').doc(doc.data().id)
                      .set({
                        endDate: newEndDate,
                        endTime: info.event.end.getHours()*3600000
                      }, {
                        merge: true
                      }).catch(function(err) {
                        console.log("Error: ",err);
                      });
                    });
                  }).catch(function(err) {
                    console.log("Error :", err);
                  });
                }).catch(function (er) {
                  console.log("Error : ", er);
                });
              });
            } else if(userCategory =="student")
            {
              query.set({
                endDate: newEndDate
              }, {
                merge: true
              }).then(function() {
                console.log("Resize student completed");
              }).catch(function(err) {
                console.log("Error :", err);
              });
            }
          }, */

          eventClick: function (info) {  //When an event is clicked this function is triggereda

            if (userCategory == 'student') {
              // console.log(info.event.id);
              console.log(info.event.start.getTime());
              var oldTitle = info.event.title;
              // var oldStartDate = info.event.start.getTime();
              var query = firestore.collection('activities').doc(info.event.id);

              query.get().then(function (doc) {

                var oldStartDate = doc.data().startDate;
                console.log("OldStartDate = ", oldStartDate);


                //ADMIN SECTION


                $('#modalModifyEvent').modal();

                var modifiedEventTitle = document.getElementById("modifyEventTitle");
                var modifiedEventDescription = document.getElementById("modifyEventDescription");


                modifiedEventDescription.value = "";

                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startDate).slice(0, -13));

                //titre
                $('#modifyEventTitle').val(doc.data().title);

                //Generate list of students according to the seleced class and subject (also checks for specialty subjects)

                //We check whether the event is recurring or not. We set according inputs depending on the case
                if (doc.data().startRecur == undefined || doc.data().startRecur == '') {
                  //Event is not recurrent, we don't display recurring section
                  $('select#selectModifyRecur').val('non');
                  document.getElementById('modifyRecurrenceSection').style.display = "none";

                } else {
                  //Event is reccurent, we display recurring section along with setting the end recurring date
                  $('select#selectModifyRecur').val('oui');
                  document.getElementById('modifyRecurrenceSection').style.display = "block";
                  $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)).slice(0, -13));
                }



                //We set description
                modifiedEventDescription.value = doc.data().description;

                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
                }

                //We check corresponding activity type
                $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs

                $('#formModifyEvent').submit(function (eve) {

                  eve.preventDefault();
                  document.getElementById('modifyLoadingGIF').style.display = 'block';
                  document.getElementById('modifyModalBody').style.display = 'none';
                  var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                  var newStartDate = Date.parse($('#modifyStartEvent').val());
                  var newEndDate = Date.parse($('#modifyEndEvent').val());

                  console.log("NewStartDate = ", newStartDate);
                  if ($('select#selectModifyRecur').val() == "non") {
                    var newRecur = firebase.firestore.FieldValue.delete();
                    var modifyStartEventRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndEventRecur = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();
                  }
                  else {
                    var newDateRecur = new Date(newStartDate);
                    var newRecur = [newDateRecur.getDay()];
                    var modifyStartEventRecur = new Date(Date.parse($('#modifyStartEvent').val())).getHours();
                    modifyStartEventRecur = modifyStartEventRecur * 3600000;
                    var modifyEndEventRecur = new Date(Date.parse($('#modifyEndEvent').val())).getHours();
                    modifyEndEventRecur = modifyEndEventRecur * 3600000
                    var modifyStartRecur = Date.parse($('#modifyStartRecur').val());
                    var modifyEndRecur = Date.parse($('#modifyEndRecur').val());
                  }

                  var newColor;

                  switch (modifiedEventType) {
                    case 'Personnel':
                      newColor = '#52a03a';
                      break;
                    case 'Entraînement':
                      newColor = '#46a2da';
                      break;
                    case 'Compétition':
                      newColor = 'red';
                  }

                  if (oldStartDate != newStartDate) {
                    //In this case we should recreate the event for each affected user and delete their old activity
                    console.log("Case 1: We need to delete/recreate.");

                    firestore.collection('activities').doc(user.uid + "_" + newStartDate + "_" + "extra")
                      .set({
                        idUser: user.uid,
                        typeActivity: modifiedEventType,
                        id: user.uid + "_" + newStartDate + "_" + "extra",
                        eventColor: newColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: $('#modifyEventTitle').val(),
                        editable: true,
                        description: modifiedEventDescription.value,
                        activityDone: false,
                        startTime: modifyStartEventRecur,
                        endTime: modifyEndEventRecur,
                        startRecur: modifyStartRecur,
                        endRecur: modifyEndRecur,
                        daysOfWeek: newRecur,
                        extrascolaire: true
                      },
                        {
                          merge: true
                        }).then(function () {
                          console.log("Modified");
                          console.log("main activity created, about to create admin's");

                          firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra")
                            .set({
                              idUser: idAdmin,
                              idStudent: user.uid,
                              classStudent: studentClass,
                              typeActivity: modifiedEventType,
                              id: idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra",
                              eventColor: newColor,
                              firstName: firstName,
                              lastName: lastName,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('#modifyEventTitle').val(),
                              editable: true,
                              description: modifiedEventDescription.value,
                              activityDone: false,
                              startTime: modifyStartEventRecur,
                              endTime: modifyEndEventRecur,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur,
                              daysOfWeek: newRecur,
                              extrascolaire: true
                            },
                              {
                                merge: true
                              }).then(function () {
                                console.log("Activity of admin should be good");
                                info.event.remove();
                                if ($('select#selectModifyRecur').val() == "non") {
                                  calendar.addEvent({
                                    title: $('#modifyEventTitle').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + "_" + newStartDate + "_" + "extra",
                                    color: newColor,
                                    editable: false,
                                    allDay: false
                                  });
                                }
                                else {
                                  calendar.addEvent({
                                    title: $('#modifyEventTitle').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + "_" + newStartDate + "_" + "extra",
                                    color: newColor,
                                    editable: false,
                                    allDay: false,
                                    startTime: modifyStartEventRecur,
                                    endTime: modifyEndEventRecur,
                                    startRecur: modifyStartRecur,
                                    endRecur: modifyEndRecur,
                                    daysOfWeek: newRecur
                                  });
                                }
                                firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + oldStartDate + "_" + "extra").delete();
                                query.delete();
                                console.log("Old event deleted");
                                console.log("diferent");
                                document.getElementById('modifyLoadingGIF').style.display = 'none';
                                document.getElementById('modifyModalBody').style.display = 'block';
                                $('#modalModifyEvent').modal("hide");
                              }).catch(function (err) {
                                console.log("Error :", err);
                              });




                        }).catch(function (err) {
                          console.log("Error :", err);
                        });

                  }
                  else {
                    //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                    console.log("Case 2: Update only.")
                    //I. Update admin's activity
                    query.update({
                      idUser: user.uid,
                      typeActivity: modifiedEventType,
                      id: user.uid + "_" + newStartDate + "_" + "extra",
                      eventColor: newColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: $('#modifyEventTitle').val(),
                      editable: true,
                      description: modifiedEventDescription.value,
                      activityDone: false,
                      startTime: modifyStartEventRecur,
                      endTime: modifyEndEventRecur,
                      startRecur: modifyStartRecur,
                      endRecur: modifyEndRecur,
                      daysOfWeek: newRecur,
                      extrascolaire: true
                    }).then(function () {
                      console.log("users's activity is now updated. About to update admin's")

                      firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra")
                        .update({
                          idUser: idAdmin,
                          idStudent: user.uid,
                          classStudent: studentClass,
                          typeActivity: modifiedEventType,
                          firstName: firstName,
                          lastName: lastName,
                          id: idAdmin + "_" + user.uid + "_" + newStartDate + "_" + "extra",
                          eventColor: newColor,
                          startDate: newStartDate,
                          endDate: newEndDate,
                          title: $('#modifyEventTitle').val(),
                          editable: true,
                          description: modifiedEventDescription.value,
                          activityDone: false,
                          startTime: modifyStartEventRecur,
                          endTime: modifyEndEventRecur,
                          startRecur: modifyStartRecur,
                          endRecur: modifyEndRecur,
                          daysOfWeek: newRecur,
                          extrascolaire: true
                        }).then(function () {
                          info.event.remove();
                          if ($('select#selectModifyRecur').val() == "non") {
                            calendar.addEvent({
                              title: $('#modifyEventTitle').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + "extra",
                              color: newColor,
                              editable: false,
                              allDay: false
                            });
                          }
                          else {
                            calendar.addEvent({
                              title: $('#modifyEventTitle').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + "extra",
                              color: newColor,
                              editable: false,
                              allDay: false,
                              startTime: modifyStartEventRecur,
                              endTime: modifyEndEventRecur,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur,
                              daysOfWeek: newRecur
                            });
                          }
                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                          document.getElementById('modifyModalBody').style.display = 'block';
                          $('#modalModifyEvent').modal("hide");


                        }).catch(function (err) {
                          console.log("Erorr :", err);;
                        })





                    }).catch(function (err) {
                      console.log("Error while updating admin's activity: ", err);
                    });







                  }

                });


                $('#btnDeleteEvent').click(function () {

                  if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    console.log("no delete");
                  } else {

                    firestore.collection('activities').doc(idAdmin + "_" + user.uid + "_" + info.event.start.getTime() + "_" + "extra").delete();
                    console.log("Admin's actibity deleted, about to delete user's");
                    query.delete();
                    info.event.remove();
                    $("#modalModifyEvent").modal("hide"); //Hide modal
                  }
                });

              }).catch(function (err) {
                console.log("Error :", err);
              });
            }





          }
        });
      }

      console.log(events_array);
      calendar.render();
    }).catch(function (err) {
      console.log("Error getting docs", err);
    });
  }


  //////////* -- END CALENDAR -- *//////////
  $('#appel-button').click(() => {
    var loadingPicture = document.getElementById('loading-picture');
    loadingPicture.style.display = "";
    var submitButton = document.getElementById('submit-appel');
    submitButton.removeAttribute('enabled');
    submitButton.setAttribute('disabled', '');
    var studentsListDiv = document.getElementById('studentsList');
    studentsList.innerHTML = "";
    studentsListDiv.style.display = '';
    var user = auth.currentUser;
    var appelButton = document.getElementById('appel-button');
    appelButton.setAttribute('disabled', '');
    var appelStatus = document.getElementById('appel-status');
    var splitString = appelButton.value.split('%');
    var eventDuration = (parseInt(splitString[4]) - parseInt(splitString[1])) / 3600000;
    var timeAdded = false;
    var totalTime = 0;
    var eventName = "";
    var eleveCounter = 0;
    const studentsListHtml1 = "<fieldset class='form-group floating-label-form-group'><fieldset class='right-radio'><div class='row'><div class='col-xl-5 col-md-5 col-sm-5'><label>";
    const studentsListHtml2 = "</label></div><div class='col-xl-2 col-md-2 col-sm-2' style='text-align: center'><input type='radio' name='appelEleve";
    const studentsListHtml3 = "' value='";
    const studentsListHtml4 = "%absent'></div><div class='col-xl-2 col-md-2 col-sm-2' style='text-align: center'><input type='radio' name='appelEleve";
    const studentsListHtml5 = "' value='";
    const studentsListHtml6 = "%nip'></div><div class='col-xl-2 col-md-2 col-sm-2' style='text-align: center'><input type='radio' name='appelEleve";
    const studentsListHtml7 = "' value='"
    const studentsListHtml8 = "%present' checked=''></div><div class='col-xl-1 col-md-1 col-sm-1'><p> </p></div></div></fieldset></fieldset>";
    var studentsListHtml = "";
    var studentsCounter = document.getElementById('studentsCounter');
    $("#modalModifyTeacher").modal("hide");

    $('#modalAppel').modal();
    var theClass = document.getElementById('classNameAppel');

    theClass.innerText = splitString[2];

    firestore.collection('activities').doc(splitString[0] + '_' + splitString[1] + '_' + splitString[2] + '_' + splitString[3]).get()
      .then((doc) => {
        if (doc.data().attendees[0] == "classe") {
          firestore.collection('users').doc(user.uid).get().then((doc2) => {
            firestore.collection('users').where("userCategory", '==', "student").where("instituteName", "==", doc2.data().instituteName).where("classe", "==", splitString[2]).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach((doc3) => {
                  eleveCounter++;
                  studentsListHtml = studentsListHtml1 + doc3.data().firstName + " " + doc3.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc3.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc3.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc3.id + "%" + splitString[3] + studentsListHtml8;
                  studentsListDiv.innerHTML += studentsListHtml;
                });
                studentsCounter.innerHTML = eleveCounter;
              }).catch((err) => {
                console.log("error getting the students: " + err);
              });
          }).catch((err) => {
            console.log("error getting the current user: " + err);
          });
        }
        else {
          for (var i = 0; i < doc.data().attendees.length; i++) {
            firestore.collection('users').doc(doc.data().attendees[i]).get().then((doc2) => {
              eleveCounter++
              studentsListHtml = studentsListHtml1 + doc2.data().firstName + " " + doc2.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc2.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc2.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc2.id + "%" + splitString[3] + studentsListHtml8;
              studentsListDiv.innerHTML += studentsListHtml;
            }).catch((err) => {
              console.log("error getting the student: " + err);
            });
          }
          studentsCounter.innerHTML = doc.data().attendees.length;
        }
        loadingPicture.style.display = "none";
        submitButton.removeAttribute('disabled');
        submitButton.setAttribute('enabled', '');
      });
    /*firestore.collection('users').doc(user.uid).get().then((doc) => { 
      firestore.collection('users').where("userCategory",'==',"student").where("instituteName","==", doc.data().instituteName).where("classe","==",splitString[2]).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach((doc2) => {
          var subjectArray = [];
          if (doc2.data().matieres != null) {
            subjectArray = doc2.data().matieres;
            for (var i=0; i<subjectArray.length; i++) {
              if (subjectArray[i].matiere == splitString[3]) {
                subjectArray[i].timeDone += eventDuration;
                totalTime = subjectArray[i].timeDone;
                timeAdded = true;
              }
            }
            if (!timeAdded)
            subjectArray.push({matiere: splitString[3], timeDone: eventDuration, timeValidated: 0});
          }
          else {
            subjectArray = [{matiere: splitString[3], timeDone: eventDuration, timeValidated: 0}];
          }
          
          firestore.collection('users').doc(doc2.data().id).update({
            matieres: subjectArray
          })
          .then(() => {
            firestore.collection('users').doc(doc2.data().idAdmin).collection("classes").doc(doc2.data().classe).collection(splitString[3]).doc("duration").get()
            .then((doc3) => {
              if (doc3.data().timeDone != null)
              totalTime = eventDuration;
              else
              totalTime =doc3.data().timeDone + eventDuration;
              firestore.collection('users').doc(doc2.data().idAdmin).collection("classes").doc(doc2.data().classe).collection(splitString[3]).doc("duration").update({
                timeDone: totalTime
              })
              .then(() => {
                firestore.collection('activities').doc(splitString[0] + '_' + splitString[1] + '_' + splitString[2] + '_' + splitString[3]).update({
                  appelDone: true
                })
                .then(() => {
                  appelButton.style.display = 'none';
                  appelStatus.style.display = '';
                  appelButton.removeAttribute('disabled');
                  appelButton.setAttribute('enabled', '');
                }).catch((err) => {
                  console.log("error updating the activity: " + err);
                });
              }).catch((err) => {
                console.log("error updating the subject: " + err);
              });
            }).catch((err) => {
              console.log("error getting the subject: " + err);
            });
          }).catch((err) => {
            console.log("error updating the student: " + err);
          });
        }).catch((err) => {
          console.log("error getting the student: " + err);
        });
      }).catch((err) => {
        console.log("error getting the students: " + err);
      });
    }).catch((err) => {
      console.log("error getting the current user: " + err);
    });*/
  });


  function appelCallback(studentsCounter, eventDuration) {
    var timeToAdd = 0;
    var timeAdded = false;
    var appelButton = document.getElementById('appel-button');
    var appelStatus = document.getElementById('appel-status');
    var splitString2 = appelButton.value.split('%');

    if (studentsCounter != 0) {
      var subjectArray = [];
      var theStudent = $("input[name='appelEleve" + (studentsCounter) + "']:checked").val();
      var splitString = theStudent.split('%');

      if (splitString[2] == "nip")
        timeToAdd = eventDuration / 2;
      else if (splitString[2] == "absent")
        timeToAdd = 0;
      else
        timeToAdd = eventDuration;

      firestore.collection('users').doc(splitString[0]).get().then((doc) => {

        if (doc.data().matieres != null) {
          subjectArray = doc.data().matieres;
          for (var j = 0; j < subjectArray.length; j++) {
            if (subjectArray[j].matiere == splitString[1]) {
              subjectArray[j].timeDone += timeToAdd;
              subjectArray[j].totalTime += eventDuration;
              timeAdded = true;
            }
          }
          if (!timeAdded)
            subjectArray.push({ matiere: splitString[1], timeDone: timeToAdd, timeValidated: 0, totalTime: eventDuration });
        }
        else {
          subjectArray = [{ matiere: splitString[1], timeDone: timeToAdd, timeValidated: 0, totalTime: eventDuration }];
        }
        firestore.collection('users').doc(splitString[0]).update({
          matieres: subjectArray
        })
          .then(() => {
            if (studentsCounter == 1) {
              firestore.collection('users').doc(doc.data().idAdmin).collection("classes").doc(doc.data().classe).collection(splitString[1]).doc("duration").update({
                timeDone: firebase.firestore.FieldValue.increment(eventDuration)
              })
                .then(() => {
                  firestore.collection('activities').doc(splitString2[0] + '_' + splitString2[1] + '_' + splitString2[2] + '_' + splitString2[3]).update({
                    appelDone: true
                  })
                    .then(() => {
                      studentsCounter--;
                      appelCallback(studentsCounter, eventDuration);
                    })
                    .catch((err) => {
                      console.log("error updating the activity: " + err);
                    });
                })
                .catch((err) => {
                  console.log("error updating the subject: " + err);
                });
            }
            else {
              studentsCounter--;
              appelCallback(studentsCounter, eventDuration);
            }
          }).catch((err) => {
            console.log("error updating the student: " + err);
          });
      })
        .catch((err) => {
          console.log("error getting the user: " + err);
        });
    } else {
      appelButton.style.display = 'none';
      appelStatus.style.display = '';
      appelButton.removeAttribute('disabled');
      appelButton.setAttribute('enabled', '');
      $("#modalAppel").modal("hide");

      $('#modalModifyTeacher').modal();

    }
  }


  $('#formAppel').submit(function (ev) {
    ev.preventDefault();
    var appelButton = document.getElementById('appel-button');
    var splitString2 = appelButton.value.split('%');
    var eventDuration = (parseInt(splitString2[4]) - parseInt(splitString2[1])) / 3600000;
    var studentsCounter = document.getElementById('studentsCounter').innerHTML;
    var theStudent;
    var splitString;
    var hasStudent = false;

    for (var i = 1; i <= studentsCounter; i++) {
      theStudent = $("input[name='appelEleve" + i + "']:checked").val();
      splitString = theStudent.split('%');
      if (splitString[2] != "absent") {
        hasStudent = true;
        break;
      }
    }

    if (hasStudent) {
      var loadingPicture = document.getElementById('loading-picture');
      loadingPicture.style.display = "";
      var studentsListDiv = document.getElementById('studentsList');
      studentsListDiv.style.display = 'none';
      var submitButton = document.getElementById('submit-appel');
      submitButton.removeAttribute('enabled');
      submitButton.setAttribute('disabled', '');

      appelCallback(studentsCounter, eventDuration);
    }
    else {
      firestore.collection('activities').doc(splitString2[0] + '_' + splitString2[1] + '_' + splitString2[2] + '_' + splitString2[3]).update({
        appelDone: true
      })
        .then(() => {
          var appelStatus = document.getElementById('appel-status');
          appelButton.style.display = 'none';
          appelStatus.style.display = '';
          appelButton.removeAttribute('disabled');
          appelButton.setAttribute('enabled', '');
          $("#modalAppel").modal("hide");

          $('#modalModifyTeacher').modal();
        })
    }
  });

});