// //PROD
var firebaseConfig = {
  apiKey: "AIzaSyDyC4t8wIotI9PFDVd5AACXUaw3y60h7Wk",
  authDomain: "schoolplus-prod.firebaseapp.com",
  databaseURL: "https://schoolplus-prod.firebaseio.com",
  projectId: "schoolplus-prod",
  storageBucket: "schoolplus-prod.appspot.com",
  messagingSenderId: "991751441024",
  appId: "1:991751441024:web:bd135bd34e706797"
};
// // DEV
// var firebaseConfig = {
//   apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
//   authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
//   databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
//   projectId: "schoolplus-dev-e8a2d",
//   storageBucket: "schoolplus-dev-e8a2d.appspot.com",
//   messagingSenderId: "330523876306",
//   appId: "1:330523876306:web:cbdcee87b7e3e007"
// };

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
const selectedRealClasse = document.getElementById("selectedRealClasse");
const selectedStudent = document.getElementById("selectStudent");
const selectedRecur = document.getElementById('selectRecur');
const className = document.getElementById('className');
const showMatiere = document.getElementById('showMatiere');
const showActivities = document.getElementById('showActivities');
const showDescription = document.getElementById('showDescription');
const showClassName = document.getElementById('showClassName');
const showRealClasse = document.getElementById('showRealClasse');
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
const selectModifyRealClasse = document.getElementById('selectModifyRealClasse');
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
const selectedRealClasseClick = document.getElementById('selectRealClasseClick');
const selectedStudentClick = document.getElementById('selectStudentClick');
const selectedRecurClick = document.getElementById('selectRecurClick');
const selectedColorClick = document.getElementById('selectColorClick');
const attendeesTeacher = document.getElementById('attendeesTeacher');
const attendeesAdmin = document.getElementById('attendeesAdmin');

// const parameters = location.search.substring(1).split("&");
// const temp = parameters[0].split("=");
// const classValue = decodeURI(temp[1]);

var classValue;
const instituteLevels = ['6??me', '5??me', '4??me', '3EVOL', '2EVOL', '1EVOL', '1STMG_EVOL', 'T_EVOL', 'TSTMG_EVOL', 'Terminale Pro Commerce'];

document.addEventListener('DOMContentLoaded', function () {

  // Add a realtime listener for Firebase Authentification
  firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
      // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);

      var user = auth.currentUser;
      var query = firestore.collection("users").doc(user.uid);
      query.get().then(function (doc) {



        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        getUserNotif();
        /* Group of functions for mail tool */
        var array = [];
        // initFilteredStudentList(array);
        // initMessageForm(doc.data().userCategory);
        // initLevelList(doc.data().idAdmin);
        // initTeacherList(doc.data().instituteName);
        // initParentList(doc.data().instituteName);
        // initAdminList(doc.data().instituteName);
        /* End of functions for mail tool */
        if (doc.data().userCategory == 'student') {
          // getStoredData();
          // document.getElementById('studentBlock').style.display = 'block';
          initCalendar(doc.data().userCategory, doc.data().instituteName, doc.data().realClasse, '');
        } else if (doc.data().userCategory == 'admin') {
          document.getElementById('planningSelection').style.display = 'block';
          // initCalendar(doc.data().userCategory, doc.data().instituteName, doc.data().realClasse, '');

        }
        else if (doc.data().userCategory == 'parent') {
          firestore.collection('users').doc(doc.data().linkedAccount).get()
            .then(function (docStud) {
              initCalendar('parent', docStud.data().instituteName, docStud.data().realClasse, docStud.id);
            }).catch(function (err) {
              console.log("Error: ", err);
            })
        }
        else if (doc.data().userCategory == 'teacher') {
          initCalendar(doc.data().userCategory, doc.data().instituteName, doc.data().realClasse, '');

        }
        if (doc.data().userCategory == 'student' || doc.data().userCategory == 'parent') {
          $('#modalTuto').modal();
        }






      });
    } else {
      firebase.auth().signOut();
      location.href = "../../pages/fr/login.php";
    }
  });



  //Log out manager
  var hrefLogOut = document.getElementById("hrefLogOut");
  hrefLogOut.addEventListener('click', e => {
    //alert('je veux d??co');
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
      console.log("IS DEV : ", doc.data().dev);
      username.innerHTML = "<b>" + userName + "</b>";
      var childName = 'profile_pictures/' + user.uid;
      firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
        profilPicUser.src = avatarUrl;
      }).catch((err) => {
        profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
      });

      var realClassesArray = [];

      firestore.collection('users').doc(doc.data().idAdmin).collection('classesHackschooling').get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            realClassesArray.push(doc.data().nomClasse);
          });
          // setUserInterface(doc.data().userCategory, doc.data().instituteCategory, doc.data().soutien, doc.data().instituteName, realClassesArray);

        }).catch(function (err) {
          console.log("error: ", err);
        });


      // console.log('_' + Math.random().toString(36).substr(2, 9));


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

      if (doc.data().userCategory == "teacher") {
        document.getElementById("teacherSection").style = "display: block;";

        var docRef = firestore.collection('users').doc(user.uid);
        selectedClass.innerHTML = "<option value=''></option>";

        docRef.get()
          .then(function (doc2) {
            console.log("THIS IS HERE");
            for (var i = 0; i < doc2.data().classe.length; i++) {
              selectedClass.innerHTML += "<option value='" + doc2.data().classe[i] + "'>" + doc2.data().classe[i] + "</option>";
            }
          }).catch(function (err) {
            console.log("Error ", err);
          });


        document.getElementById("activities").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Cours" id="newEventType" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Contr??le" required>Contr??le</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="Oral" required>Interrogation orale</label></fieldset>'
        document.getElementById("modifyActivitiesTeacher").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="modifyEventTypeTeacher" value="Cours" id="modifyEventTypeTeacher" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="modifyEventTypeTeacher" value="Contr??le" required>Contr??le</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="modifyEventTypeTeacher" value="Interrogation orale" required>Interrogation orale</label></fieldset>'

        // END TEACHER SECTION
      } else if (doc.data().userCategory == "admin") {
        document.getElementById('adminSection').style = "display:block;";
        adminSectionClick.style = "display:block;";
        document.getElementById("teacherSection").style = "display: block;";




        // initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts);
        // var docRef = firestore.collection('users').doc(user.uid);
        selectedClass.innerHTML = "<option value=''></option>";

        instituteLevels.forEach(function (elem) {
          selectedClass.innerHTML += "<option value='" + elem + "'>" + elem + "</option>";

        });




        document.getElementById("activities").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Cours" id="newEventType" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Contr??le" required>Contr??le</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="Interrogation orale" required>Interrogation orale</label></fieldset>'
        document.getElementById("activitiesClick").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Cours" id="newEventType" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Contr??le" required>Contr??le</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="Interrogation orale" required>Interrogation orale</label></fieldset>'
        document.getElementById("modifyActivities").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="modifyEventType" value="Cours" id="modifyEventType" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="modifyEventType" value="Contr??le" required>Contr??le</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="modifyEventType" value="Interrogation orale" required>Interrogation orale</label></fieldset>'

      } else if (doc.data().userCategory == "student" || doc.data().userCategory == "parent") {
        // adminSection.style="dispaly: none;";
        document.getElementById("activities").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="competition" id="newEventType" required>Comp??tition sport</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="entrainement" required>Entra??nement sport</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="perso" required>Personnel</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="culturelle" required>Activit?? culturelle (concert, mus??e...)</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="artistique" required>Activit?? artistique (danse, musique...)</label></fieldset>'
        document.getElementById("activitiesClick").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="competition" id="newEventType" required>Comp??tition sport</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="entrainement" required>Entra??nement sport</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="perso" required>Personnel</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="culturelle" required>Activit?? culturelle (concert, mus??e...)</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="artistique" required>Activit?? artistique (danse, musique...)</label></fieldset>'
        document.getElementById("modifyActivities").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="modifyEventType" value="competition" id="modifyEventType">Comp??tition sport</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="modifyEventType" value="entrainement">Entra??nement sport </label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="modifyEventType" value="perso">Personnel</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="modifyEventType" value="culturelle">Activit?? culturelle (concert, mus??e...)</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="modifyEventType" value="artistique">Activit?? artistique (danse, musique...)</label></fieldset>'
      }

    }).catch(function (err) {
      console.log('Error displaying user info: ', err);
    });

  }

  function initTeacherSelection(instituteName, classValue) {
    console.log("INIT TEACHER SELECTION");
    selectedTeacher.innerHTML = '<option value="" selected="selected" disabled>Choisissez un professeur</option>';
    firestore.collection('users').where("userCategory", "==", "teacher").where("instituteName", "==", instituteName).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log(doc.id);
          // console.log("HERE" + doc.data().firstName);
          /* selectedTeacher.selectize.addOption({value: doc.id, text:doc.data().firstName+" "+doc.data().lastName});
          var  $select = $('select#selectTeacher').selectize();
          var control = $select[0].selectize;
          control.clear(); */
          selectedTeacher.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
          selectModifyTeacher.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
          selectedTeacherClick.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";

        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }

  $('#evol1').on('click', function () {
    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        document.getElementById('evol1').style = "border-color:black;border-width: thick;width: 100% ;";
        document.getElementById('evol2').style = "width: 100% ;";
        // document.getElementById('evol3').style = "width: 100% ;";
        // document.getElementById('evol4').style = "width: 100% ;background-color: #EEBF42;";
        // document.getElementById('evol5').style = "width: 100% ;";

        classValue = 'Formation plateforme';
        initCalendar(doc.data().userCategory, doc.data().instituteName, classValue, '');
        initTeacherSelection(doc.data().instituteName, classValue);
        initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);
      }).catch(function (err) {
        console.log("Error:", err);
      });


  });
  $('#evol2').on('click', function () {
    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        document.getElementById('evol1').style = "width: 100% ;";
        document.getElementById('evol2').style = "border-color:black;border-width: thick;width: 100% ;";
        // document.getElementById('evol3').style = "width: 100% ;";
        // document.getElementById('evol4').style = "width: 100% ;background-color: #EEBF42;";
        // document.getElementById('evol5').style = "width: 100% ;";
        classValue = 'Prepasport 2021 Session 1';
        initCalendar(doc.data().userCategory, doc.data().instituteName, classValue, '');
        initTeacherSelection(doc.data().instituteName, classValue);
        initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);

      }).catch(function (err) {
        console.log("Error:", err);
      });



  });
  $('#evol3').on('click', function () {
    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        document.getElementById('evol1').style = "width: 100% ;";
        document.getElementById('evol2').style = "width: 100% ;";
        document.getElementById('evol3').style = "border-color:black;border-width: thick;width: 100% ;";
        document.getElementById('evol4').style = "width: 100% ;background-color: #EEBF42;";
        document.getElementById('evol5').style = "width: 100% ;";
        classValue = 'EVOL3';
        initCalendar(doc.data().userCategory, doc.data().instituteName, classValue, '');
        initTeacherSelection(doc.data().instituteName, classValue);
        initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);

      }).catch(function (err) {
        console.log("Error:", err);
      });



  });
  $('#evol4').on('click', function () {
    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        document.getElementById('evol1').style = "width: 100% ;";
        document.getElementById('evol2').style = "width: 100% ;";
        document.getElementById('evol3').style = "width: 100% ;";
        document.getElementById('evol4').style = "border-color:black;border-width: thick;width: 100% ;background-color: #EEBF42;";
        document.getElementById('evol5').style = "width: 100% ;";
        classValue = 'EVOL4';
        initCalendar(doc.data().userCategory, doc.data().instituteName, classValue, '');
        initTeacherSelection(doc.data().instituteName, classValue);
        initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);

      }).catch(function (err) {
        console.log("Error:", err);
      });


  });
  $('#evol5').on('click', function () {
    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        document.getElementById('evol1').style = "width: 100% ;";
        document.getElementById('evol2').style = "width: 100% ;";
        document.getElementById('evol3').style = "width: 100% ;";
        document.getElementById('evol4').style = "width: 100% ;background-color: #EEBF42;";
        document.getElementById('evol5').style = "border-color:black;border-width: thick;width: 100% ;";
        classValue = 'EVOL5';
        initCalendar(doc.data().userCategory, doc.data().instituteName, classValue, '');
        initTeacherSelection(doc.data().instituteName, classValue);
        initStudentSelection("", "", doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);

      }).catch(function (err) {
        console.log("Error:", err);
      });



  });

  $('#btnTuto').on('click', function () {
    $('#modalTuto').modal();

  });

  $('#myButton').on('click', function () {
    // alert('good');

    var addNumbers = firebase.functions().httpsCallable('addNumbers');
    addNumbers({ firstNumber: 10, secondNumber: 10 }).then(function (result) {
      console.log(result.data.operationResult)
    }).catch(function (error) {
      console.log(error);
    });
    // var sayHello = firebase.functions().httpsCallable('sayHello');
    // sayHello().then(function(result) {
    //   alert(result.data.message);
    // }).catch(function(err) {
    //   console.log("Error: ", err);
    // });

    // var copyCollection = firebase.functions().httpsCallable('copyCollection');
    // copyCollection({srcCollectionName: 'messages', destCollectionName: 'messages_2019'}).then(function(result) {
    //   console.log("COPY DONE");
    // }).catch(function(err) {
    //   console.log("Error: ", err);
    // });
    // copyCollection('messages', 'messages_2019').then(() => console.log('copy complete')).catch(error => console.log('copy failed. ' + error));


  });




  //Used to generate a unique ID in order to group recurring events.
  function uniqueID() {
    function chr4() {
      return Math.random().toString(16).slice(-4);
    }
    return chr4() + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() + chr4() + chr4();
  }

  $('select#selectModifyTeacher').on('change', function () {
    selectModifyMatiere.innerHTML = '';
    console.log("HEY");
    selectModifyClass.innerHTML = "<option value=''></option>";
    firestore.collection('users').where("id", "==", $('select#selectModifyTeacher').val()).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          for (var i = 0; i < doc.data().matieres.length; i++) {
            selectModifyMatiere.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
          }

          for (var j = 0; j < doc.data().classe.length; j++) {
            selectModifyClass.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
          }
        })
      }).catch(function (err) {
        console.log("Error :", err);
      });
  });

  $('select#selectTeacher').on('change', function () {
    // alert( $('select#selectTeacher').val())
    selectedMatiere.innerHTML = "";
    selectedClass.innerHTML = "<option value=''></option>";
    firestore.collection('users').doc($('select#selectTeacher').val()).get()
      .then(function (doc) {
        
          for (var i = 0; i < doc.data().matieres.length; i++) {
            selectedMatiere.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
          }

          for (var j = 0; j < doc.data().classe.length; j++) {
            selectedClass.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
          }
       
      }).catch(function (err) {
        console.log("Error :", err);
      });

  });

  $('select#selectTeacherClick').on('change', function () {

    selectedMatiereClick.innerHTML = "";
    selectedClassClick.innerHTML = "<option value=''></option>";
    firestore.collection('users').where("id", "==", $('select#selectTeacherClick').val()).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          for (var i = 0; i < doc.data().matieres.length; i++) {
            selectedMatiereClick.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
          }

          for (var j = 0; j < doc.data().classe.length; j++) {
            selectedClassClick.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
          }
        })
      }).catch(function (err) {
        console.log("Error :", err);
      });

  });

  function setUserInterface(userCategory, instituteCategory, soutien, instituteName, classesArray) {
    // console.log("set user interface");
    var user = auth.currentUser;
    console.log(classesArray)

    if (userCategory == "student" || userCategory == "parent") {

      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li>';
      navMenu.innerHTML += '<li style="display:none;" data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li><div><button style="float:right;"class="btn bg-school-plus btn-min-width text-bold-600 mt-1" onclick="sendMailToGroup()" name="" value="" id="btnMailGroup"><i class="fas fa-envelope"></i> Envoyer un message</button></div>';

      rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
      // navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-map-signs"></i><span data-i18n="nav.dash.main">Orientation</span></a></li>';
    } else if (userCategory == "teacher") {

      if (soutien == undefined) {
        //ICI
        //navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">No??</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Tim??o</span></a></li></ul></li>';
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
        navMenu.innerHTML += '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li></ul></li>';

        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Planning+</span></a></li><div><button style="float:right;"class="btn bg-school-plus btn-min-width text-bold-600 mt-1" onclick="sendMailToGroup()" name="" value="" id="btnMailGroup"><i class="fas fa-envelope"></i> Envoyer un message</button></div>';

        rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves</a>';
        rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel ??tablissement</a>';
      }
      else {
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
        var nav2bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li></ul></li>';

        var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
        var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
        var nav6 = '</ul></li>';

        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav9 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav10 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
        var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li><div><button style="float:right;"class="btn bg-school-plus btn-min-width text-bold-600 mt-1" onclick="sendMailToGroup()" name="" value="" id="btnMailGroup"><i class="fas fa-envelope"></i> Envoyer un message</button></div>';

        navMenu.innerHTML = nav1 + nav2 + nav2bis + nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

        rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves</a>';
        rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves - Soutien</a>';
        rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel ??tablissement</a>';
      }

      setTeachersVirtualClasses(instituteName);
      /*  navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bulletins</span></a></li>'; */
    } else if (userCategory == "admin") {

      if (instituteCategory == "college" || instituteCategory == "lycee") {

        var plannings = '';
        // classesArray.forEach(function (elem) {
        //   plannings += '<li data-menu=""><a href="dashboard.php?target=' + elem + '" class="dropdown-item"><span data-i18n="nav.dash.main">' + elem + '</span></a></li>'
        // })
        //ICI
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Plannings</span></a></li>';
        var nav2 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Mati??res</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-classes.php?target=createSubject" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er une mati??re</span></a></li></ul></li>';
        var nav3 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li></ul></li>';
        var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav4bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li></ul></li>';

        var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li><li data-menu=""><a href="planning+.php" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
        var nav6 = '</ul></li>';

        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des mati??res - ??l??ves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li><div><button style="float:right;"class="btn bg-school-plus btn-min-width text-bold-600 mt-1" onclick="sendMailToGroup()" name="" value="" id="btnMailGroup"><i class="fas fa-envelope"></i> Envoyer un message</button></div>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav4bis + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

        var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves</a>';
        var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves - Soutien</a>';
        var right3 = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        var right4 = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs - Soutien</a>';

        rightMenu.innerHTML = right1 + right2 + right3 + right4;

      } else if (instituteCategory == "soutien") {
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li>';
        navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';
      }
    }

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
        // console.log(Object.keys($this));
        if ($this.hasClass('dropdown-toggle')) {
          return false;
        }
      }
    });
  }

  function setTeachersVirtualClasses(instituteName) {

    var user = auth.currentUser;

    firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', instituteName).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (docTeacher) {
          if (docTeacher.id != 'cVdmeheFOMS7hUbFL5k3bTTvVWD3') {
            if (docTeacher.id != user.uid) {
              document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="' + docTeacher.data().virtualRoom + '"  class="dropdown-item"><span data-i18n="nav.dash.main">' + docTeacher.data().firstName + ' ' + docTeacher.data().lastName + '</span></a></li>';
            }
            else {
              document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="' + docTeacher.data().virtualRoom + '"  class="dropdown-item"><span data-i18n="nav.dash.main">Ma classe virtuelle</span></a></li>';
            }
          }
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });

  }

  function initModifyStudentSelection(level, instituteName, attendees) {
    document.getElementById('selectModifyStudent').selectize.clearOptions();
    var $select = $('select#selectModifyStudent').selectize();
    var control = $select[0].selectize;
    control.clear();

    var user = auth.currentUser;

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {


        if (level == "") {
          firestore.collection('users').where("instituteName", "==", instituteName).where("userCategory", "==", "student").where('realClasse', '==', classValue).get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {
                if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                  document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });
                  control.clear();
                }
              });
            }).catch(function (err) {
              console.log("Error :", err);
            });
          // Case 2: a specific class is selected, we display students of the class
        } else {
          document.getElementById('selectStudent').selectize.addOption({ value: 'classe', text: 'Tout le groupe' });
          document.getElementById('selectModifyStudent').selectize.addOption({ value: 'classe', text: 'Tout le groupe' });
          control.clear();
          // control2.clear();

          firestore.collection('users').where("classe", "==", level).where('realClasse', '==', classValue).where("userCategory", "==", "student").get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {

                if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {

                  // console.log(doc.id);
                  selectModifyStudent.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
                  document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });

                  var selectOptions = [];
                  attendees.forEach(function (elem) {
                    selectOptions.push(elem);
                  });
                  control.setValue(selectOptions, false);
                }

                // control2.setValue('classe', false);
                // selectStudentClick.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";

              });
            }).catch(function (err) {
              console.log("Error :", err);
            });

          //END else
        }

      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }

  //This function is called to generate student list based on teacher-user when a class is selected AND the switch is toggled
  function initStudentSelection(teacherId, level, instituteName, isDev, testAccounts, classValue) {
    /* selectStudent.innerHTML = "";
    selectedStudent.innerHTML =""; */
    document.getElementById('selectStudent').selectize.clearOptions();
    document.getElementById('selectModifyStudent').selectize.clearOptions();
    var $select2 = $('select#selectModifyStudent').selectize();
    var control2 = $select2[0].selectize;
    // control2.clear();
    var $select = $('select#selectStudent').selectize();
    var control = $select[0].selectize;
    control.clear();
    // Case 1: No class is selected, we display all student of the teacher
    console.log("initStudentSelection");
    if (level == "") {
      console.log("case 1");
      console.log(classValue);
      firestore.collection('users').where("instituteName", "==", instituteName).where("userCategory", "==", "student").where('classe', '==', classValue).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.data().soutien != true) {

              if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {

                document.getElementById('selectStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });
                document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });
                control.clear();
              }
              // control2.clear();
              // selectStudentClick.innerHTML += "<option value='" + doc.id+ "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
            }
          });
        }).catch(function (err) {
          console.log("Error :", err);
        });
      // Case 2: a specific class is selected, we display students of the class
    } else {
      console.log("case 2");
      document.getElementById('selectStudent').selectize.addOption({ value: 'classe', text: 'Tout le groupe' });
      document.getElementById('selectModifyStudent').selectize.addOption({ value: 'classe', text: 'Tout le groupe' });
      control.clear();
      // control2.clear();
      console.log(classValue)
      firestore.collection('users').where("classe", "==", classValue).where("userCategory", "==", "student").get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {

            console.log(doc.id);

            // if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {

              selectStudent.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
              selectModifyStudent.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";
              document.getElementById('selectStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });
              document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName });

              control.setValue('classe', false);
              control2.setValue('classe', false);
            // }
            // control2.setValue('classe', false);
            // selectStudentClick.innerHTML += "<option value='" + doc.id + "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";

          });
        }).catch(function (err) {
          console.log("Error :", err);
        });
      //END else
    }
  }

  $('select#selectStudent').on('change', function () {
    console.log("Look Here : ", $('select#selectStudent').val()[0]);
  });

  // Event listener on Classes list
  $('#selectClass').on("change", function () {
    var user = auth.currentUser;
    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        initStudentSelection(user.uid, $('select#selectClass').val(), doc.data().instituteName, doc.data().dev, doc.data().testAccounts, document.getElementById('adminPlanningTitle').innerText);
        // console.log($('select#selectClass').val());
      }).catch(function (err) {
        console.log("Error :", err);
      });

  });

  $('#selectModifyClass').on('change', function () {
    var user = auth.currentUser;
    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        initStudentSelection(user.uid, $('select#selectModifyClass').val(), doc.data().instituteName, doc.data().dev, doc.data().testAccounts, document.getElementById('adminPlanningTitle').innerText);
        // console.log($('select#selectModifyClass').val());
      }).catch(function (err) {
        console.log("Error :", err);
      });
  });

  // Event listener on Classes list
  $('#selectClassClick').on("change", function () {
    var user = auth.currentUser;
    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {
        initStudentSelection(user.uid, $('select#selectClassClick').val(), doc.data().instituteName, doc.data().dev, doc.data().testAccounts, classValue);
        console.log($('select#selectClassClick').val());
      }).catch(function (err) {
        console.log("Error :", err);
      });

  });

  // Event listener on switch button --> Disable/enable student list
  /* $('#switchery').on('change', function() {
    var user = auth.currentUser;
    var isChecked = this.checked;
    var selectStudent = document.getElementById("selectStudent");
    var fieldSelectStudent = document.getElementById("fieldSelectStudent");
    
    if(isChecked) {
      selectStudent.disabled = false;
      initStudentSelection(user.uid);
      fieldSelectStudent.style="display: block;"
      
      console.log("You can now display student list");
    } else if (!isChecked)
    {
      selectStudent.disabled = true;
      fieldSelectStudent.style="display: none;"
      
      console.log("You should now disable student list");
    }
  }); */

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
    console.log($('#modifyStartEvent').val().slice(0, -6));
    // $('#modifyStartRecur').val($('#modifyStartEvent').val());
    // getTimeWithoutOffset(new Date(doc.data().startRecur))
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

  function displayEvent(title, start, end, id, color, editable, calendar) {

    calendar.addEvent({
      title: title,
      start: start,
      end: end,
      id: id,
      color: color,
      editable: editable
    });
  }

  function createRecurringEvents(userID, instituteName, userCategory, eventType, description, color, startEventArray, endEventArray, classe, matiere, attendeesID, teacherID, index, groupID, startRecur, endRecur, calendar) {
    // console.log("CALENDAR: ", calendar);
    console.log("STARTEVENTARAY.LENGTH: ", startEventArray.length);
    console.log("INDEX: ", index);
    if (index < startEventArray.length) {
      // console.log("LOOK HERE: ", startEventArray[index]);
      // console.log("LOOK", index);
      var query = firestore.collection('activities').doc(userID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere);
      query.set({
        idUser: userID,
        typeActivity: eventType,
        eventColor: color,
        startDate: startEventArray[index],
        endDate: endEventArray[index],
        id: userID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere,
        title: matiere,
        editable: true,
        description: description,
        activityDone: false,
        classe: classe,
        attendees: attendeesID,
        teacherID: teacherID,
        groupID: groupID,
        startRecur: startRecur,
        endRecur: endRecur,
        realClasse: classValue

      }).then(function () {
        console.log("Admin's activity created.");
        displayEvent(matiere, startEventArray[index], endEventArray[index], userID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere, color, true, calendar);
        /*  calendar.addEvent({
           title: matiere,
           start: startEventArray[index],
           end: endEventArray[index],
           id: userID + "_" + startEventArray[index] + "_" + classe + "_" + matiere,
           color: color,
           editable: true,
         }); */
        //Write data for each student of a class OR for a specific student
        if (userCategory == "teacher") {
        } else if (userCategory == "admin") {
          //Create activity for teacher
          // alert('CREATING FOR TEACHER ');
          firestore.collection('activities').doc(teacherID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere)
            .set({
              idUser: teacherID,
              typeActivity: eventType,
              eventColor: color,
              id: teacherID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere,
              startDate: startEventArray[index],
              endDate: endEventArray[index],
              title: matiere,
              editable: false, //Student should not edit event programmed by teacher
              description: description,
              classe: classe,
              attendees: attendeesID,
              activityDone: false,
              teacherID: teacherID,
              groupID: groupID,
              startRecur: startRecur,
              endRecur: endRecur,
              realClasse: classValue

            }).then(function () {
              console.log("Document added for teacher");
              if (attendeesID.includes("classe") && attendeesID.length == 1) {

                //The whole class is selected

                firestore.collection('users').where("userCategory", '==', "student").where("instituteName", "==", instituteName).where("classe", "==", classe).where('realClasse', '==', classValue).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                      firestore.collection('activities').doc(doc.id + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere)
                        .set({
                          idUser: doc.id,
                          typeActivity: eventType,
                          eventColor: color,
                          startDate: startEventArray[index],
                          endDate: endEventArray[index],
                          id: doc.id + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere,
                          title: matiere,
                          editable: false, //Student should not edit event programmed by teacher
                          description: description,
                          activityDone: false,
                          classe: classe,
                          teacherID: teacherID,
                          groupID: groupID,
                          startRecur: startRecur,
                          endRecur: endRecur,
                          realClasse: classValue

                        }).then(function () {
                          console.log("Document added for students");

                          //END 
                        }).catch(function (err) {
                          console.log("Error :", err);
                          let typeError = "";
                          messageError = String(err);
                          typeError = "Line 1049" + err;

                          var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement r??ccurent d'un des ??tudiants. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                          alertSwal(title, typeError);
                        });
                    });
                    index++;
                    createRecurringEvents(userID, instituteName, userCategory, eventType, description, color, startEventArray, endEventArray, classe, matiere, attendeesID, teacherID, index, groupID, startRecur, endRecur, calendar);

                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
              } else if (!attendeesID.includes("classe") && attendeesID.length == 1) {
                //A specific student is selected --> we create his activity
                firestore.collection('activities').doc(attendeesID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere)
                  .set({
                    idUser: attendeesID[0],
                    typeActivity: eventType,
                    eventColor: color,
                    startDate: startEventArray[index],
                    endDate: endEventArray[index],
                    id: attendeesID + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere,
                    title: matiere,
                    editable: false, //Student should not edit event programmed by teacher
                    description: description,
                    activityDone: false,
                    classe: classe,
                    teacherID: teacherID,
                    groupID: groupID,
                    startRecur: startRecur,
                    endRecur: endRecur,
                    realClasse: classValue

                  }).then(function () {
                    console.log("Activity successfully written for student :" + selectedStudent.value + "_");

                    index++;
                    createRecurringEvents(userID, instituteName, userCategory, eventType, description, color, startEventArray, endEventArray, classe, matiere, attendeesID, teacherID, index, groupID, startRecur, endRecur, calendar);
                  }).catch(function (err) {
                    console.log("Error :", err);
                    let typeError = "";
                    messageError = String(err);
                    typeError = "Line 1091" + err;

                    var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement r??ccurent de l'??tudiant. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                    alertSwal(title, typeError);
                  });
              } else if (!attendeesID.includes("classe") && attendeesID.length > 1) {
                //A group of student is selected, but not the whole class
                attendeesID.forEach(function (elem) {
                  firestore.collection('activities').doc(elem + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere)
                    .set({
                      idUser: elem,
                      typeActivity: eventType,
                      eventColor: color,
                      startDate: startEventArray[index],
                      endDate: endEventArray[index],
                      id: elem + "_" + startEventArray[index] + "_" + classe + "_" + classValue + "_" + matiere,
                      title: matiere,
                      editable: false, //Student should not edit event programmed by teacher
                      description: description,
                      activityDone: false,
                      classe: classe,
                      teacherID: teacherID,
                      groupID: groupID,
                      startRecur: startRecur,
                      endRecur: endRecur,
                      realClasse: classValue

                    }).then(function () {
                      console.log("Activity successfully written for student :" + selectedStudent.value + "_");

                      //END
                    }).catch(function (err) {
                      console.log("Error :", err);
                      let typeError = "";
                      messageError = String(err);
                      typeError = "Line 1126" + err;

                      var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement r??ccurent d'un des ??tudiants. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                      alertSwal(title, typeError);
                    });
                });
                index++;
                createRecurringEvents(userID, instituteName, userCategory, eventType, description, color, startEventArray, endEventArray, classe, matiere, attendeesID, teacherID, index, groupID, startRecur, endRecur, calendar);

              }
            }).catch(function (err) {
              console.log("Error ", err);
              let typeError = "";
              messageError = String(err);
              typeError = "Line 1140" + err;

              var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement r??ccurent du Professeur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
              alertSwal(title, typeError);
            });
        }
      }).catch(function (err) {
        console.log("Error while writing data into DB :", err);
        let typeError = "";
        messageError = String(err);
        typeError = "Line 1150" + err;

        var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement r??ccurent de l'Administrateur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
        alertSwal(title, typeError);
      });
    } else if (index == startEventArray.length) {
      // document.getElementById('calendar').innerHTML = '';
      console.log("re-initializing calendar");
      document.getElementById('loadingGIF').style.display = 'none';
      document.getElementById('modifyLoadingGIF').style.display = 'none';
      document.getElementById('modifyModalBody').style.display = 'block';

      document.getElementById('addModalBody').style.display = 'block';
      $("#modalAddEvent").modal("hide"); //Hide modal
      $('#modalModifyEvent').modal('hide');
      return;

    }
  }
  function getTimeToDisplay(time) {
    if (time.toString().length == 1) {
      return "0" + time + ":00:00";
    }
    else if (time.toString().length == 2) {
      return time + ":00:00";
    }
  }
  //////////* -- CALENDAR -- *//////////

  function initCalendar(userCategory, instituteName, classValue, idStud) {
    var user = auth.currentUser;
    console.log("idStud" + idStud);

    document.getElementById('calendar').innerHTML = '';

    var calendarEl = document.getElementById('calendar'); // Refer to calendar html element
    var docRef = firestore.collection('activities').where("idUser", "==", user.uid);
    if (userCategory == 'admin') {
      docRef = firestore.collection('activities').where("idUser", "==", user.uid).where('realClasse', '==', classValue);
      console.log("CLASS VALUE : ", classValue);
      document.getElementById('adminPlanningTitle').style.display = 'block';



      document.getElementById('adminPlanningTitle').innerText = classValue;
      document.getElementById('modalTitle').innerText = "Ajouter un ??v??nenement - " + classValue;
    }
    else if (userCategory == 'parent') {
      console.log("good");
      docRef = firestore.collection('activities').where("idUser", "==", idStud);
    }
    var events_array = [];
    // console.log(docRef);

    var offset = new Date().getTimezoneOffset();
    console.log("OFFSET : ", offset);
    var t = Intl.DateTimeFormat().resolvedOptions().timeZone;


    var calendarMinTime = 6 - (offset / 60);
    var calendarMaxTime = 18 - (offset / 60);
    console.log("MinTime to display :", Math.floor(calendarMinTime));
    console.log("MaxTime to display :", Math.floor(calendarMaxTime));

    calendarMinTime = Math.floor(calendarMinTime);
    calendarMaxTime = Math.floor(calendarMaxTime);

    console.log("Length of minTime: ", calendarMinTime.toString().length);
    console.log("Length of maxTime", calendarMaxTime.toString().length);

    var minTimeToDisplay = getTimeToDisplay(calendarMinTime);
    console.log("minTimeToDisplay: " + minTimeToDisplay);
    var maxTimeToDisplay = getTimeToDisplay(calendarMaxTime);
    console.log("maxTimeToDisplay: " + maxTimeToDisplay);

    console.log(t);


    docRef.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {

        if (doc.data().soutien != true) {
          if (doc.data().extrascolaire != true) {

            if (userCategory == 'teacher') {
              events_array.push({
                title: doc.data().title + ' - ' + doc.data().classe + ' - ' + doc.data().realClasse,              //Populate events_array with data
                start: doc.data().startDate,
                end: doc.data().endDate,
                id: doc.id,
                classe: doc.data().classe,
                tip: 'tip',
                color: doc.data().eventColor,
                editable: doc.data().editable
              });
            }
            else {
              events_array.push({
                title: doc.data().title,              //Populate events_array with data
                start: doc.data().startDate,
                end: doc.data().endDate,
                id: doc.id,
                classe: doc.data().classe,
                tip: 'tip',
                color: doc.data().eventColor,
                editable: doc.data().editable
              });
            }



          }

        }
        // console.log(doc.id, "=>", doc.data().startDate);
      });

      $('#modalAddEvent').on('hidden.bs.modal', function () {  //Permet de clear les s??lections effectu??es par l'utilisateur lorsque celui-ci
        //console.log('modal ferm??');                            //annule la cr??ation d'un ??v??nement en cliquant ailleurs / fermant le modal
        $("#formEvent").off();
      });

      $('#modalModifyEvent').on('hidden.bs.modal', function () {
        $('#formModifyEvent').off();
        $('#btnDeleteEvent').off();
      });

      $('#modalModifyTeacher').on('hidden.bs.modal', function () {
        // alert("ferm??");
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
          minTime: minTimeToDisplay,
          maxTime: maxTimeToDisplay,
          /* minTime: "07:00:00",
          maxTime: "19:00:00", */
          slotDuration: "00:30:00",
          height: 'auto',
          locale: 'fr', //Defines calendar's lang
          timeZone: 'local', //Timezone set on local
          //eventOverlap: false,
          allDaySlot: false,
          weekends: true, // Afficher - cacher les weekends
          themeSystem: 'bootstrap', //Theme utilis?? 

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
            // alert(classValue);
            if (userCategory == "admin") {
              $("#modalAddEvent").modal(); //Display modal which contains Event Creation form
              $("input[value='Cours']").prop("checked", true);
            }

            $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
            $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
            $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
            $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()));

            console.log("Start Recur = ", new Date(Date.parse(getTimeWithoutOffset(info.start.getTime()))).getHours());
            console.log("End Recur = ", new Date(Date.parse(getTimeWithoutOffset(info.end.getTime()))).getMinutes());

            $("#formEvent").submit(function (ev) {  //Once the form is submitted
              var studentArray = [];
              var newEventTitle = document.getElementById("newEventTitle");
              var newEventType = $("input[name='newEventType']:checked").val();
              var newEventDescription = document.getElementById("newEventDescription");
              var selectedClass = document.getElementById("selectClass");
              var selectedStudent = document.getElementById("selectStudent");
              var startEvent = Date.parse($('#startEvent').val());
              var endEvent = Date.parse($('#endEvent').val());
              var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
              if (new Date(Date.parse($('#startEvent').val())).getMinutes() == 30) {
                startEventRecur = startEventRecur + 0.5;
              }
              var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours();
              if (new Date(Date.parse($('#endEvent').val())).getMinutes() == 30) {
                endEventRecur = endEventRecur + 0.5;
              }
              var newColor;

              document.getElementById('loadingGIF').style.display = 'block';
              document.getElementById('addModalBody').style.display = 'none';
              ev.preventDefault();

              switch ($('select#selectClass').val()) {
                case '1EVOL':
                  newColor = '#D55828';
                  break;
                case '3EVOL':
                  newColor = '#EEBF42';
                  break;
                case 'TS_EVOL':
                  newColor = '#003399';
                  break;
                case 'T_EVOL':
                  newColor = '#003399';
                  break;
                case '2EVOL':
                  newColor = '#52A03A';
                  break;
                case '1STMG_EVOL':
                  newColor = '#FFCC99';
                  break;
                case 'TSTMG_EVOL':
                  newColor = '#46A2DA';
                  break;
                case '6??me':
                  newColor = '#AD97C1';
                  break;
                case '5??me':
                  newColor = '#0CC19E';
                  break;
                case '4??me':
                  newColor = '#F2647B';
                  break;
                case 'Terminale Pro Commerce':
                  newColor = '#6666CC';
                  break;
                default:
                  newColor = 'red';
              }

              // If the event isn't recurrent
              if ($('select#selectRecur').val() == "non") {
                //Write data into Firebase user
                var query = firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val());
                query.set({
                  idUser: user.uid,
                  typeActivity: newEventType,
                  id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                  eventColor: newColor,
                  startDate: startEvent,
                  endDate: endEvent,
                  title: $('select#selectMatiere').val(),
                  editable: true,
                  description: newEventDescription.value,
                  classe: $('select#selectClass').val(),
                  attendees: $('select#selectStudent').val(),
                  activityDone: false,
                  teacherID: $('select#selectTeacher').val(),
                  realClasse: classValue
                }).then(function () {
                  console.log("Admin's activity added.");
                  calendar.addEvent({
                    title: $('select#selectMatiere').val(),
                    start: startEvent,
                    end: endEvent,
                    id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                    color: newColor,
                    editable: true,
                    classe: $('select#selectClass').val(),
                    allDay: false
                  });
                  //Write data for each student of a class OR for a specific student
                  if (userCategory == "admin") {
                    //Create activity for selected teacher
                    firestore.collection('activities').doc($('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                      .set({
                        idUser: $('select#selectTeacher').val(),
                        typeActivity: newEventType,
                        eventColor: newColor,
                        id: $('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                        startDate: startEvent,
                        endDate: endEvent,
                        title: $('select#selectMatiere').val(),
                        editable: false, //Student should not edit event programmed by teacher
                        description: newEventDescription.value,
                        classe: $('select#selectClass').val(),
                        attendees: $('select#selectStudent').val(),
                        activityDone: false,
                        teacherID: $('select#selectTeacher').val(),
                        realClasse: classValue
                      }).then(function () {
                        console.log("Document added for teacher");
                        if ($('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length == 1) {
                          //The whole class is selected
                          firestore.collection('users').where("userCategory", '==', "student").where("instituteName", "==", instituteName).where("classe", "==", $('select#selectClass').val()).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (doc) {
                                firestore.collection('activities').doc(doc.id + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                                  .set({
                                    idUser: doc.id,
                                    typeActivity: newEventType,
                                    eventColor: newColor,
                                    startDate: startEvent,
                                    endDate: endEvent,
                                    id: doc.id + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                                    title: $('select#selectMatiere').val(),
                                    editable: false, //Student should not edit event programmed by teacher
                                    description: newEventDescription.value,
                                    activityDone: false,
                                    classe: $('select#selectClass').val(),
                                    teacherID: $('select#selectTeacher').val(),
                                    realClasse: classValue
                                  }).then(function () {
                                    console.log("Document added for students");
                                    document.getElementById('loadingGIF').style.display = 'none';
                                    document.getElementById('addModalBody').style.display = 'block';
                                    $("#modalAddEvent").modal("hide"); //Hide modal
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                    let typeError = "";
                                    messageError = String(err);
                                    typeError = "Line 4116" + err;

                                    var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement d'un des ??tudiants'. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                    alertSwal(title, typeError);
                                  });
                              });
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        } else if (!$('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length == 1) {
                          //A specific student is selected --> we create his activity
                          firestore.collection('activities').doc($('select#selectStudent').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                            .set({
                              idUser: $('select#selectStudent').val()[0],
                              typeActivity: newEventType,
                              eventColor: newColor,
                              startDate: startEvent,
                              endDate: endEvent,
                              id: $('select#selectStudent').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                              title: $('select#selectMatiere').val(),
                              editable: false, //Student should not edit event programmed by teacher
                              description: newEventDescription.value,
                              activityDone: false,
                              classe: $('select#selectClass').val(),
                              teacherID: $('select#selectTeacher').val(),
                              realClasse: classValue
                            }).then(function () {
                              console.log("Activity successfully written for student :" + selectedStudent.value + "_");
                              document.getElementById('loadingGIF').style.display = 'none';
                              document.getElementById('addModalBody').style.display = 'block';
                              $("#modalAddEvent").modal("hide"); //Hide modal
                            }).catch(function (err) {
                              console.log("Error :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = "Line 4151" + err;

                              var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement de l'??tudiant. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                        } else if (!$('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length > 1) {
                          //A group of student is selected, but not the whole class
                          $('select#selectStudent').val().forEach(function (elem) {
                            firestore.collection('activities').doc(elem + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                              .set({
                                idUser: elem,
                                typeActivity: newEventType,
                                eventColor: newColor,
                                startDate: startEvent,
                                endDate: endEvent,
                                id: elem + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                                title: $('select#selectMatiere').val(),
                                editable: false, //Student should not edit event programmed by teacher
                                description: newEventDescription.value,
                                activityDone: false,
                                classe: $('select#selectClass').val(),
                                teacherID: $('select#selectTeacher').val(),
                                realClasse: classValue
                              }).then(function () {
                                console.log("Activity successfully written for student :" + selectedStudent.value + "_");
                                document.getElementById('loadingGIF').style.display = 'none';
                                document.getElementById('addModalBody').style.display = 'block';
                                $("#modalAddEvent").modal("hide"); //Hide modal
                              }).catch(function (err) {
                                console.log("Error :", err);
                                let typeError = "";
                                messageError = String(err);
                                typeError = "Line 4183" + err;

                                var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement d'un des ??tudiants. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                alertSwal(title, typeError);
                              });
                          });
                        }
                      }).catch(function (err) {
                        console.log("Error ", err);
                        let typeError = "";
                        messageError = String(err);
                        typeError = "Line 4194" + err;

                        var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement du Professeur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                        alertSwal(title, typeError);
                      });
                  }
                }).catch(function (err) {
                  console.log("Error while writing data into DB :", err);
                  let typeError = "";
                  messageError = String(err);
                  typeError = "Line 4204" + err;

                  var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement de l'Administrateur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                  alertSwal(title, typeError);
                });
                //If the event is recurrent
              } else if ($('select#selectRecur').val() == "oui") {
                var startRecur = startEvent / 1000;
                var endRecur = (Date.parse($('#endRecur').val())) / 1000;
                var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);
                var startArray = [];
                var endArray = [];

                console.log('Start Recur : ', startRecur);
                console.log('EndRecur :', endRecur);
                console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))

                for (var i = 0; i < eventCoef; i++) {
                  if (i != 0) {
                    var newStart = new Date(startEvent);
                    startEvent = newStart.setDate(newStart.getDate() + 7);

                    var newEnd = new Date(endEvent);
                    endEvent = newEnd.setDate(newEnd.getDate() + 7);
                  }
                  console.log("Start n??" + i + " : ", startEvent);
                  console.log("End n??" + i + " : ", endEvent);

                  // displayEvent($('select#selectMatiere').val(), startEvent, endEvent, user.uid+"_"+startEvent+"_"+$('select#selectClass').val()+"_"+$('select#selectMatiere').val(), newColor, true, calendar);
                  /*  calendar.addEvent({
                     title: $('select#selectMatiere').val(),
                     start: startEvent,
                     end: endEvent,
                     color: newColor,
                     id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val()
                   }); */
                  startArray.push(startEvent);
                  endArray.push(endEvent);
                }
                createRecurringEvents(user.uid, instituteName, userCategory, newEventType, newEventDescription.value, newColor, startArray, endArray, $('select#selectClass').val(), $('select#selectMatiere').val(), $('select#selectStudent').val(), $('select#selectTeacher').val(), 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);
              }
            });
          },

          eventClick: function (info) {  //When an event is clicked this function is triggereda
            // alert(info.event.id);
            document.getElementById('btnVirtualRoom').setAttribute('disabled', true);
            document.getElementById('btnVirtualRoomTeacher').setAttribute('disabled', true);
            document.getElementById('btnVirtualRoomAdmin').setAttribute('disabled', true);

            var oldTitle = info.event.title;
            var oldStartDate = info.event.start.getTime();
            var query = firestore.collection('activities').doc(info.event.id);
            query.get().then(function (doc) {
              console.log(doc.id);
              if (doc.data().editable != true) {
                // alert("Vous ne pouvez pas modifier ou supprimer cet ??v??nement");
                firestore.collection('users').doc(doc.idUser).get()
                  .then(function (doc2) {
                    if (doc2.data().userCategory == "student") {
                      $('#modalShowEvent').modal();
                      showMatiere.value = doc.data().title;
                      showActivities.value = doc.data().typeActivity;
                      showDescription.value = doc.data().description;
                      showClassName.innerText = doc.data().classe;

                      firestore.collection('users').doc(doc.data().teacherID).get()
                        .then(function (docTeacher) {
                          document.getElementById('linkVirtualRoom').href = docTeacher.data().virtualRoom;
                          document.getElementById('btnVirtualRoom').removeAttribute('disabled');
                        }).catch(function (err) {
                          console.log("Error : ", err);
                        });

                    } else if (doc2.data().userCategory == "teacher") {

                      oldTitle = doc.data().title;

                      firestore.collection('users').doc(user.uid).get()
                        .then(function (docTeacher) {
                          document.getElementById('linkVirtualRoomTeacher').href = docTeacher.data().virtualRoom;
                          document.getElementById('btnVirtualRoomTeacher').removeAttribute('disabled');
                        }).catch(function (err) {
                          console.log("Error :", err);
                        });


                      var modifyGroupID = firebase.firestore.FieldValue.delete();
                      var modifyStartRecur = firebase.firestore.FieldValue.delete();
                      var modifyEndRecur = firebase.firestore.FieldValue.delete();

                      $('#modalModifyTeacher').modal();
                      $("input[value='" + doc.data().typeActivity + "']").prop("checked", true);
                      modifyEventDescriptionTeacher.value = doc.data().description;
                      modifyEventTitleTeacher.value = doc.data().title;
                      classNameTeacher.innerText = doc.data().classe;
                      realClasseName.innerText = doc.data().realClasse;

                      attendeesTeacher.innerHTML = '';
                      if (!doc.data().attendees.includes("classe")) {
                        doc.data().attendees.forEach(function (elem) {
                          firestore.collection('users').doc(elem).get()
                            .then(function (doc) {
                              if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                                attendeesTeacher.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                              }

                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        });
                      }
                      // Arnaud pour faire l'appel
                      var buttonValue = doc.idUser + '%' + doc.data().startDate + '%' + doc.data().classe + '%' + doc.data().title + '%' + doc.data().endDate;
                      var appelButton = document.getElementById('appel-button');
                      appelButton.removeAttribute('disabled');
                      appelButton.setAttribute('enabled', '');
                      var appelStatus = document.getElementById('appel-status');
                      if (doc.data().startDate <= Date.now()) {
                        if (doc.data().appelDone == null || !doc.data().appelDone) {
                          appelButton.value = buttonValue;
                          appelButton.style.display = '';
                          appelStatus.style.display = 'none';
                        }
                        else {
                          appelButton.style.display = 'none';
                          appelStatus.style.display = '';
                        }
                      }
                      else {
                        appelButton.style.display = '';
                        appelButton.setAttribute('disabled', '');
                        appelStatus.style.display = 'none';
                      }
                      // end Arnaud
                      $('#formModifyEventTeacher').submit(function (ev) {
                        console.log("FORM TEACHER SUBMITTED");
                        ev.preventDefault();
                        var modifiedEventType = $("input[name='modifyEventTypeTeacher']:checked").val();
                        console.log(modifiedEventType);
                        document.getElementById('modifyLoadingGIFTeacher').style.display = 'block';
                        document.getElementById('modifyModalBodyTeacher').style.display = 'none';
                        if (doc.data().groupID == undefined || doc.data().groupID == '') {
                          //NO RECURRENCE


                          console.log(doc.id);
                          query.set({
                            // title: modifyEventTitleTeacher.value,
                            description: modifyEventDescriptionTeacher.value,
                            typeActivity: modifiedEventType,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur,
                            groupID: modifyGroupID
                          }, {
                            merge: true
                          }).then(function () {
                            console.log("DONE FOR TEACHER");
                            console.log("CLASSE VALUE : ", doc.data().realClasse);
                            console.log("LEVEL VALUE : ", doc.data().classe);
                            console.log("START DATE :", doc.data().startDate);
                            console.log("OLD TITLE : ", oldTitle);
                            //Modify Admin and students activities
                            firestore.collection('activities').where("classe", "==", doc.data().classe).where('realClasse', '==', doc.data().realClasse).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
                              .then(function (querySnapshot) {
                                console.log("INSIDE THE QUERY");
                                querySnapshot.forEach(function (doc2) {
                                  console.log(doc2.data().id);
                                  firestore.collection('activities').doc(doc2.data().id)
                                    .set({
                                      // title: modifyEventTitleTeacher.value,
                                      description: modifyEventDescriptionTeacher.value,
                                      typeActivity: modifiedEventType,
                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur,
                                      groupID: modifyGroupID
                                      // eventColor: modifiedEventColor
                                    }, {
                                      merge: true
                                    }).catch(function (err) {
                                      console.log("Error: ", err);
                                      let typeError = "";
                                      messageError = String(err);
                                      typeError = "Line 4387" + err;

                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                      alertSwal(title, typeError);
                                    });
                                });
                                info.event.setProp('title', doc.data().title + ' - ' + doc.data().classe + ' - ' + doc.data().realClasse);
                                info.event.setProp('description', modifyEventDescriptionTeacher.value);
                                document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                $("#modalModifyTeacher").modal("hide");
                              }).catch(function (err) {
                                console.log("Error :", err);
                              });
                          }).catch(function (err) {
                            console.log("Error: ", err);
                            let typeError = "";
                            messageError = String(err);
                            typeError = "Line 4399" + err;

                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                            alertSwal(title, typeError);
                          });
                        }
                        else {
                          //RECURRENCE
                          //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                          console.log("Case 2: Update only.")
                          //I. Update admin's activity
                          query.update({
                            typeActivity: modifiedEventType,
                            description: modifyEventDescriptionTeacher.value,
                            groupID: modifyGroupID,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur

                          }).then(function () {
                            console.log("Admin's activity is now updated.")
                            info.event.remove();


                            calendar.addEvent({
                              title: doc.data().title + ' - ' + doc.data().classe + ' - ' + doc.data().realClasse,
                              start: doc.data().startDate,
                              end: doc.data().endDate,
                              description: modifyEventDescriptionTeacher.value,
                              id: user.uid + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                              color: doc.data().eventColor,
                              editable: true,
                              classe: doc.data().classe,
                              allDay: false,

                            });

                            //II. Now we can deal with admin's activity.

                            //Here we don't need to check whether the teacher has changed or not.
                            //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                            //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                            //This case is managed above, so here we just have to update teacher's activity.

                            firestore.collection('activities').doc(doc2.data().idAdmin + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                              .update({

                                typeActivity: modifiedEventType,
                                description: modifyEventDescriptionTeacher.value,
                                groupID: modifyGroupID,
                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              }).then(function () {
                                console.log("admins activity is now updated.")
                                // //III. Finally we can deal with students' activities

                                /* HEREEEEE */
                                //First let's check if new attendees already have their activities in order to update them.
                                if (doc.data().attendees.includes('classe')) {
                                  //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                  //If activity exists: we update / if activity doesn't exist: we create.
                                  firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', doc.data().classe).where('realClasse', '==', doc.data().realClasse).get()
                                    .then(function (querySnapshot) {
                                      querySnapshot.forEach(function (docStudent) {
                                        firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title).get()
                                          .then(function (doc) {
                                            if (doc.exists) {
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                                .update({
                                                  typeActivity: modifiedEventType,
                                                  description: modifyEventDescriptionTeacher.value,
                                                  groupID: modifyGroupID,
                                                  startRecur: modifyStartRecur,
                                                  endRecur: modifyEndRecur
                                                }).then(function () {
                                                  console.log("Student's document updated.");
                                                }).catch(function (err) {
                                                  console.log("Error while updating student's doc :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = "Line 4484" + err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                })
                                            }
                                            else {
                                              //ICI
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                                .set({
                                                  idUser: docStudent.data().id,
                                                  typeActivity: modifiedEventType,
                                                  id: docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                                                  eventColor: doc.data().eventColor,
                                                  startDate: doc.data().startDate,
                                                  endDate: doc.data().endDate,
                                                  title: doc.data().title,
                                                  editable: false,
                                                  description: modifyEventDescriptionTeacher.value,
                                                  classe: doc.data().classe,
                                                  attendees: doc.data().attendees,
                                                  activityDone: false,
                                                  teacherID: doc.data().teacherID,
                                                  groupID: modifyGroupID,
                                                  realClasse: doc.data().realClasse,
                                                  startRecur: modifyStartRecur,
                                                  endRecur: modifyEndRecur
                                                },
                                                  {
                                                    merge: true
                                                  }).then(function () {
                                                    console.log("Activity created for student.");
                                                  }).catch(function (err) {
                                                    console.log("Error :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = "Line 4519" + err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  });
                                            }
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });
                                      });

                                      document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                      document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                      console.log("MODAL MODIFY TEACHER ABOUT TO CLOSE");
                                      $('#modalModifyTeacher').modal("hide");

                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }
                                else {
                                  //A specific or several student are selected. We repeat the same process.
                                  //For every student we check whether the activity already exists or not.
                                  doc.data().attendees.forEach(function (elem) {
                                    firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title).get()
                                      .then(function (doc) {
                                        if (doc.exists) {
                                          firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                            .update({
                                              typeActivity: modifiedEventType,
                                              description: modifyEventDescriptionTeacher.value,
                                              groupID: modifyGroupID,
                                              startRecur: modifyStartRecur,
                                              endRecur: modifyEndRecur
                                            }).then(function () {
                                              console.log("Student's activity updated.");
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = "Line 4559" + err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                        }
                                        else {
                                          firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                            .set({
                                              //ICI
                                              idUser: elem,
                                              typeActivity: modifiedEventType,
                                              id: elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                                              eventColor: doc.data().eventColor,
                                              startDate: doc.data().startDate,
                                              endDate: doc.data().endDate,
                                              title: doc.data().title,
                                              editable: false,
                                              description: modifyEventDescriptionTeacher.value,
                                              classe: doc.data().classe,
                                              attendees: doc.data().attendees,
                                              activityDone: false,
                                              teacherID: doc.data().teacherID,
                                              groupID: modifyGroupID,
                                              realClasse: doc.data().realClasse,
                                              startRecur: modifyStartRecur,
                                              endRecur: modifyEndRecur
                                            },
                                              {
                                                merge: true
                                              }).then(function () {
                                                console.log("Activity created for student.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = "Line 4596" + err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                        }
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  });
                                  document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                  document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                  console.log("MODAL MODIFY TEACHER ABOUT TO CLOSE");
                                  $('#modalModifyTeacher').modal("hide");
                                }
                                /* FIN HEREEEEE */

                              }).catch(function (err) {
                                console.log("Error :", err);
                                let typeError = "";
                                messageError = String(err);
                                typeError = "Line 4593" + err;

                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                alertSwal(title, typeError);
                              });


                          }).catch(function (err) {
                            console.log("Error while updating admin's activity: ", err);
                            let typeError = "";
                            messageError = String(err);
                            typeError = "Line 4598" + err;

                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                            alertSwal(title, typeError);
                          });
                        }
                      });
                    }
                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });
              } else {

                //ADMIN SECTION

                firestore.collection('users').doc(doc.data().teacherID).get()
                  .then(function (docTeacher) {
                    document.getElementById('linkVirtualRoomAdmin').href = docTeacher.data().virtualRoom;
                    document.getElementById('btnVirtualRoomAdmin').removeAttribute('disabled');
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });

                var oldClass = doc.data().classe;
                var oldAttendees = doc.data().attendees;
                var oldTeacher = doc.data().teacherID;
                // console.log("oldtitle :", oldTitle);
                // console.log("OldStartDate :", oldStartDate);
                // console.log("oldClass :", oldClass);
                $('#modalModifyEvent').modal();

                var modifiedEventTitle = document.getElementById("modifyEventTitle");
                var modifiedEventDescription = document.getElementById("modifyEventDescription");

                // Once the modal is opened we clear all text areas
                // modifiedEventTitle.value = "";   
                modifiedEventDescription.value = "";
                className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';

                //For each inputs we set their values according to user's activity data
                //Creation of attendees' list
                if (!doc.data().attendees.includes("classe")) {
                  doc.data().attendees.forEach(function (elem) {
                    firestore.collection('users').doc(elem).get()
                      .then(function (doc) {
                        if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                          attendeesAdmin.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                        }

                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                  });
                }
                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                // $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startRecur).slice(0, -13));
                $('select#selectModifyTeacher').val(doc.data().teacherID);

                firestore.collection('users').where("id", "==", $('select#selectModifyTeacher').val()).get()
                  .then(function (querySnapshot) {

                    querySnapshot.forEach(function (doc) {
                      //We create the list of subjects according to teacher's profile
                      for (var i = 0; i < doc.data().matieres.length; i++) {
                        selectModifyMatiere.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
                      }
                      //We create the list of classes according to teacher's profile
                      for (var j = 0; j < doc.data().classe.length; j++) {
                        selectModifyClass.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
                      }
                    });
                    //We then set these select with the according value
                    $('select#selectModifyClass').val(doc.data().classe);
                    $('select#selectModifyMatiere').val(doc.data().title);
                    //Generate list of students according to the seleced class and subject (also checks for specialty subjects)
                    initModifyStudentSelection($('select#selectModifyClass').val(), doc.data().instituteName, doc.data().attendees);
                    if (doc.data().groupID == undefined || doc.data().groupID == '') {
                      //Event is not recurrent, we don't display recurring section
                      $('select#selectModifyRecur').val('non');
                      document.getElementById('modifyRecurrenceSection').style.display = "none";
                      document.getElementById('selectModifyTeacher').removeAttribute('disabled');
                      document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                      document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                      document.getElementById('selectModifyRecur').setAttribute('disabled', true);

                    } else {
                      $('select#selectModifyRecur').val('oui');
                      document.getElementById('modifyRecurrenceSection').style.display = "block";
                      $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                      $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                      document.getElementById('selectModifyTeacher').setAttribute('disabled', true);
                      document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                      document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                      document.getElementById('selectModifyRecur').setAttribute('disabled', true);



                    }
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                //We set description
                modifiedEventDescription.value = doc.data().description;
                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "D??crivez l'??v??nement...";  // We set placeholders
                }
                //We check corresponding activity type
                $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs


                //FORMULAIRE
                $('#formModifyEvent').submit(function (eve) {

                  eve.preventDefault();
                  document.getElementById('modifyLoadingGIF').style.display = 'block';
                  document.getElementById('modifyModalBody').style.display = 'none';
                  var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                  var newStartDate = Date.parse($('#modifyStartEvent').val());
                  var newEndDate = Date.parse($('#modifyEndEvent').val());

                  if ($('select#selectModifyRecur').val() == 'non') {
                    //CHECK IF RECURRENCE
                    //IF SO WE NEED TO DELETED ALL RECURRENCES
                    //IF NOT WE PROCEED NORMALLY
                    console.log("I AM IN THE CASE WHERE THERE IS NOT RECURRENCE'");
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();
                    var newColor;

                    switch ($('select#selectModifyClass').val()) {
                      case '1EVOL':
                        newColor = '#D55828';
                        break;
                      case '3EVOL':
                        newColor = '#EEBF42';
                        break;
                      case 'TS_EVOL':
                        newColor = '#003399';
                        break;
                      case 'T_EVOL':
                        newColor = '#003399';
                        break;
                      case '2EVOL':
                        newColor = '#52A03A';
                        break;
                      case '1STMG_EVOL':
                        newColor = '#FFCC99';
                        break;
                      case 'TSTMG_EVOL':
                        newColor = '#46A2DA';
                        break;
                      case '6??me':
                        newColor = '#AD97C1';
                        break;
                      case '5??me':
                        newColor = '#0CC19E';
                        break;
                      case '4??me':
                        newColor = '#F2647B';
                        break;
                      case 'Terminale Pro Commerce':
                        newColor = '#6666CC';
                        break;
                      default:
                        newColor = 'red';
                    }

                    if (doc.data().groupID != undefined) {
                      console.log("I AM IN THE CASE WHERE THERE IS A RECURRENCE BELONGING")
                      //IS PART OF RECURRENCE -- > DELETE ALL OTHER EVENTS EXCEPT FROM THIS ONE (admin + teacher + attendees)
                      firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach(function (docActivity) {
                            console.log("other activities with same id " + docActivity.id);
                            if (docActivity.data().startDate != doc.data().startDate) {
                              console.log(docActivity.id + ' to be deleted');
                              console.log(calendar.getEventById(docActivity.id));
                              if (docActivity.data().idUser == user.uid) {
                                calendar.getEventById(docActivity.id).remove();

                              }
                              firestore.collection('activities').doc(docActivity.id).delete();

                            }
                          });

                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity
                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                typeActivity: modifiedEventType,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                description: modifiedEventDescription.value,
                                classe: $('select#selectModifyClass').val(),
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                groupID: modifyGroupID,
                                realClasse: classValue,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur

                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activty updated");
                                  info.event.remove();
                                  if ($('select#selectModifyRecur').val() == "non") {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false
                                    });
                                  }
                                  else {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false


                                    });
                                  }


                                  //II. Now we deal with teacher's activity

                                  firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyTeacher').val(),
                                      typeActivity: modifiedEventType,
                                      id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      description: modifiedEventDescription.value,
                                      classe: $('select#selectModifyClass').val(),
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,
                                      realClasse: classValue,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        console.log("Teacher's new activity created. About to delete the old one");
                                        firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                        console.log("Teacher's old activity deleted.");

                                        //III. Now we deal with student's activity.

                                        //First we need to delete old activities using oldAttendees.
                                        if (oldAttendees.includes('classe')) {

                                          //Here we need to query every student of the class.
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                              });
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          //Here we browse oldAttendees and delete activity for each element.

                                          oldAttendees.forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }

                                        //Now that we deleted students' old activities we can start creating new ones.

                                        if ($('select#selectModifyStudent').val() == 'classe') {
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,

                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur

                                                  },
                                                    {
                                                      merge: true
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              });
                                              query.delete();
                                              console.log("Old admin's event deleted");
                                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                                              document.getElementById('modifyModalBody').style.display = 'block';
                                              $('#modalModifyEvent').modal("hide");

                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          $('select#selectModifyStudent').val().forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,

                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");
                                        }
                                      }).catch(function (err) {
                                        console.log("Error while creating teacher's new activity :", err);
                                        let typeError = "";
                                        messageError = String(err);
                                        typeError = err;

                                        var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                        alertSwal(title, typeError);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });





                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur

                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false,

                                });
                              }
                              //II. Now we can deal with teacher's activity.

                              //Here we don't need to check whether the teacher has changed or not.
                              //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                              //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                              //This case is managed above, so here we just have to update teacher's activity.

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Teacher's activity is now updated.")
                                  //III. Finally we can deal with students' activities

                                  //First let's check if new attendees already have their activities in order to update them.
                                  if ($('select#selectModifyStudent').val() == 'classe') {
                                    //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                    //If activity exists: we update / if activity doesn't exist: we create.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                            .then(function (doc) {
                                              if (doc.exists) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .update({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  }).then(function () {
                                                    console.log("Student's document updated.");
                                                  }).catch(function (err) {
                                                    console.log("Error while updating student's doc :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  })
                                              }
                                              else {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  },
                                                    {
                                                      merge: true
                                                    }).then(function () {
                                                      console.log("Activity created for student.");
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              }
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        });

                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");

                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }
                                  else {
                                    //A specific or several student are selected. We repeat the same process.
                                    //For every student we check whether the activity already exists or not.
                                    $('select#selectModifyStudent').val().forEach(function (elem) {
                                      firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's activity updated.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                          }
                                          else {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                    //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                    //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                              .then(function (doc) {
                                                if (doc.exists) {
                                                  firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                                }
                                              }).catch(function (err) {
                                                console.log("Error: ", err);
                                              });
                                          }
                                        });
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }


                                }).catch(function (err) {
                                  console.log("Error :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });


                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                          }


                        }).catch(function (err) {
                          console.log("Error :", err);
                        });
                    }
                    else {
                      //ISNT PART OF RECURRENCE --> PROCEED AS USUAL
                      console.log("The event isn't part of a recurrence, we should proceed as usual");
                      if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                        //In this case we should recreate the event for each affected user and delete their old activity
                        console.log("Case 1: We need to delete/recreate.");
                        // I. We deal with Admin's activity
                        firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                          .set({
                            idUser: user.uid,
                            typeActivity: modifiedEventType,
                            id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                            eventColor: newColor,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            title: $('select#selectModifyMatiere').val(),
                            editable: true,
                            description: modifiedEventDescription.value,
                            classe: $('select#selectModifyClass').val(),
                            attendees: $('select#selectModifyStudent').val(),
                            activityDone: false,
                            teacherID: $('select#selectModifyTeacher').val(),
                            groupID: modifyGroupID,
                            realClasse: classValue,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur

                          },
                            {
                              merge: true
                            }).then(function () {
                              console.log("Admin's activty updated");
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false


                                });
                              }


                              //II. Now we deal with teacher's activity

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .set({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur

                                },
                                  {
                                    merge: true
                                  }).then(function () {
                                    console.log("Teacher's new activity created. About to delete the old one");
                                    firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                    console.log("Teacher's old activity deleted.");

                                    //III. Now we deal with student's activity.

                                    //First we need to delete old activities using oldAttendees.
                                    if (oldAttendees.includes('classe')) {

                                      //Here we need to query every student of the class.
                                      firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                        .then(function (querySnapshot) {
                                          querySnapshot.forEach(function (docStudent) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    }
                                    else {
                                      //Here we browse oldAttendees and delete activity for each element.

                                      oldAttendees.forEach(function (elem) {
                                        firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                      });
                                    }

                                    //Now that we deleted students' old activities we can start creating new ones.

                                    if ($('select#selectModifyStudent').val() == 'classe') {
                                      firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                        .then(function (querySnapshot) {
                                          querySnapshot.forEach(function (docStudent) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");

                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    }
                                    else {
                                      $('select#selectModifyStudent').val().forEach(function (elem) {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .set({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur

                                          },
                                            {
                                              merge: true
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                      });
                                      query.delete();
                                      console.log("Old admin's event deleted");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }
                                  }).catch(function (err) {
                                    console.log("Error while creating teacher's new activity :", err);
                                    let typeError = "";
                                    messageError = String(err);
                                    typeError = err;

                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                    alertSwal(title, typeError);
                                  });

                            }).catch(function (err) {
                              console.log("Error while creating new event for Admin :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });





                      }
                      else {
                        //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                        console.log("Case 2: Update only.")
                        //I. Update admin's activity
                        query.update({
                          idUser: user.uid,
                          typeActivity: modifiedEventType,
                          id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                          eventColor: newColor,
                          startDate: newStartDate,
                          endDate: newEndDate,
                          title: $('select#selectModifyMatiere').val(),
                          editable: true,
                          description: modifiedEventDescription.value,
                          classe: $('select#selectModifyClass').val(),
                          attendees: $('select#selectModifyStudent').val(),
                          activityDone: false,
                          teacherID: $('select#selectModifyTeacher').val(),
                          groupID: modifyGroupID,
                          realClasse: classValue,
                          startRecur: modifyStartRecur,
                          endRecur: modifyEndRecur

                        }).then(function () {
                          console.log("Admin's activity is now updated.")
                          info.event.remove();
                          if ($('select#selectModifyRecur').val() == "non") {
                            calendar.addEvent({
                              title: $('select#selectModifyMatiere').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              color: newColor,
                              editable: true,
                              classe: $('select#selectModifyClass').val(),
                              allDay: false
                            });
                          }
                          else {
                            calendar.addEvent({
                              title: $('select#selectModifyMatiere').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              color: newColor,
                              editable: true,
                              classe: $('select#selectModifyClass').val(),
                              allDay: false,

                            });
                          }
                          //II. Now we can deal with teacher's activity.

                          //Here we don't need to check whether the teacher has changed or not.
                          //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                          //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                          //This case is managed above, so here we just have to update teacher's activity.

                          firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                            .update({
                              idUser: $('select#selectModifyTeacher').val(),
                              typeActivity: modifiedEventType,
                              id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: false,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Teacher's activity is now updated.")
                              //III. Finally we can deal with students' activities

                              //First let's check if new attendees already have their activities in order to update them.
                              if ($('select#selectModifyStudent').val() == 'classe') {
                                //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                //If activity exists: we update / if activity doesn't exist: we create.
                                firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (docStudent) {
                                      firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's document updated.");
                                              }).catch(function (err) {
                                                console.log("Error while updating student's doc :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              })
                                          }
                                          else {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");

                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }
                              else {
                                //A specific or several student are selected. We repeat the same process.
                                //For every student we check whether the activity already exists or not.
                                $('select#selectModifyStudent').val().forEach(function (elem) {
                                  firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                    .then(function (doc) {
                                      if (doc.exists) {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .update({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur
                                          }).then(function () {
                                            console.log("Student's activity updated.");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                            let typeError = "";
                                            messageError = String(err);
                                            typeError = err;

                                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                            alertSwal(title, typeError);
                                          });
                                      }
                                      else {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .set({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur
                                          },
                                            {
                                              merge: true
                                            }).then(function () {
                                              console.log("Activity created for student.");
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                      }
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                });

                                //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (docStudent) {
                                      if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                        firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                          .then(function (doc) {
                                            if (doc.exists) {
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                            }
                                          }).catch(function (err) {
                                            console.log("Error: ", err);
                                          });
                                      }
                                    });
                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }


                            }).catch(function (err) {
                              console.log("Error :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });


                        }).catch(function (err) {
                          console.log("Error while updating admin's activity: ", err);
                          let typeError = "";
                          messageError = String(err);
                          typeError = err;

                          var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                          alertSwal(title, typeError);
                        });
                      }
                    }

                  }
                  else if ($('select#selectModifyRecur').val() == 'oui') {
                    //CHECK IF RECURRENCE
                    //IF NOT WE CREATE ALL OTHER EVENTS
                    //IF SO
                    console.log("The event wants to be recurrent");
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();

                    swal({
                      title: "Attention !",
                      text: "Cet ??v??n??ment fait partie d'une r??currence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette derni??re de la r??currence existante.",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "#3BAFDA",
                      confirmButtonText: "J'ai compris et je confirme la modification",
                      cancelButtonText: "Annuler",
                      closeOnConfirm: true

                      // closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {





                        var newColor;

                        switch ($('select#selectModifyClass').val()) {
                          case '1EVOL':
                            newColor = '#D55828';
                            break;
                          case '3EVOL':
                            newColor = '#EEBF42';
                            break;
                          case 'TS_EVOL':
                            newColor = '#003399';
                            break;
                          case 'T_EVOL':
                            newColor = '#003399';
                            break;
                          case '2EVOL':
                            newColor = '#52A03A';
                            break;
                          case '1STMG_EVOL':
                            newColor = '#FFCC99';
                            break;
                          case 'TSTMG_EVOL':
                            newColor = '#46A2DA';
                            break;
                          case '6??me':
                            newColor = '#AD97C1';
                            break;
                          case '5??me':
                            newColor = '#0CC19E';
                            break;
                          case '4??me':
                            newColor = '#F2647B';
                            break;
                          case 'Terminale Pro Commerce':
                            newColor = '#6666CC';
                            break;
                          default:
                            newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {

                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity
                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                typeActivity: modifiedEventType,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                description: modifiedEventDescription.value,
                                classe: $('select#selectModifyClass').val(),
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                groupID: modifyGroupID,
                                realClasse: classValue,
                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur

                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activty updated");
                                  info.event.remove();
                                  if ($('select#selectModifyRecur').val() == "non") {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false
                                    });
                                  }
                                  else {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false


                                    });
                                  }


                                  //II. Now we deal with teacher's activity

                                  firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyTeacher').val(),
                                      typeActivity: modifiedEventType,
                                      id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      description: modifiedEventDescription.value,
                                      classe: $('select#selectModifyClass').val(),
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,
                                      realClasse: classValue,
                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        console.log("Teacher's new activity created. About to delete the old one");
                                        firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                        console.log("Teacher's old activity deleted.");

                                        //III. Now we deal with student's activity.

                                        //First we need to delete old activities using oldAttendees.
                                        if (oldAttendees.includes('classe')) {

                                          //Here we need to query every student of the class.
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                              });
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          //Here we browse oldAttendees and delete activity for each element.

                                          oldAttendees.forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }

                                        //Now that we deleted students' old activities we can start creating new ones.

                                        if ($('select#selectModifyStudent').val() == 'classe') {
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur

                                                  },
                                                    {
                                                      merge: true
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              });
                                              query.delete();
                                              console.log("Old admin's event deleted");
                                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                                              document.getElementById('modifyModalBody').style.display = 'block';
                                              $('#modalModifyEvent').modal("hide");

                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          $('select#selectModifyStudent').val().forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");
                                        }
                                      }).catch(function (err) {
                                        console.log("Error while creating teacher's new activity :", err);
                                        let typeError = "";
                                        messageError = String(err);
                                        typeError = err;

                                        var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                        alertSwal(title, typeError);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });





                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur

                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false,

                                });
                              }
                              //II. Now we can deal with teacher's activity.

                              //Here we don't need to check whether the teacher has changed or not.
                              //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                              //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                              //This case is managed above, so here we just have to update teacher's activity.

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Teacher's activity is now updated.")
                                  //III. Finally we can deal with students' activities

                                  //First let's check if new attendees already have their activities in order to update them.
                                  if ($('select#selectModifyStudent').val() == 'classe') {
                                    //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                    //If activity exists: we update / if activity doesn't exist: we create.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                            .then(function (doc) {
                                              if (doc.exists) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .update({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  }).then(function () {
                                                    console.log("Student's document updated.");
                                                  }).catch(function (err) {
                                                    console.log("Error while updating student's doc :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  })
                                              }
                                              else {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  },
                                                    {
                                                      merge: true
                                                    }).then(function () {
                                                      console.log("Activity created for student.");
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              }
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        });

                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");

                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }
                                  else {
                                    //A specific or several student are selected. We repeat the same process.
                                    //For every student we check whether the activity already exists or not.
                                    $('select#selectModifyStudent').val().forEach(function (elem) {
                                      firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's activity updated.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                          }
                                          else {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                    //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                    //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                              .then(function (doc) {
                                                if (doc.exists) {
                                                  firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                                }
                                              }).catch(function (err) {
                                                console.log("Error: ", err);
                                              });
                                          }
                                        });
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }


                                }).catch(function (err) {
                                  console.log("Error :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });


                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                          }


                        }
                        else {
                          console.log("the event isn't part of a recurrence, we delte old event and recreate new ones");
                          firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (docActivityToDelete) {
                                console.log()
                                firestore.collection('activities').doc(docActivityToDelete.data().id).delete();
                              });
                              query.delete();
                              info.event.remove();

                              //ADD EVENTS
                              var startRecur = newStartDate / 1000;
                              var endRecur = (Date.parse($('#modifyEndRecur').val())) / 1000;

                              console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))
                              var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);

                              var startArray = [];
                              var endArray = [];
                              for (var i = 0; i < eventCoef; i++) {
                                if (i != 0) {
                                  var newStart = new Date(newStartDate);
                                  newStartDate = newStart.setDate(newStart.getDate() + 7);

                                  var newEnd = new Date(newEndDate);
                                  newEndDate = newEnd.setDate(newEnd.getDate() + 7);



                                }
                                console.log("Start n??" + i + " : ", newStartDate);
                                console.log("End n??" + i + " : ", newEndDate);

                                // displayEvent($('select#selectModifyMatiere').val(), newStartDate, newEndDate, user.uid+"_"+newStartDate+"_"+$('select#selectModifyClass').val()+"_"+$('select#selectModifyMatiere').val(), newColor, true, calendar);


                                startArray.push(newStartDate);
                                endArray.push(newEndDate);

                              }
                              createRecurringEvents(user.uid, instituteName, userCategory, modifiedEventType, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyClass').val(), $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), 0, uniqueID(), startRecur * 1000, endRecur * 1000, this.calendar);

                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                      }
                      else {
                        console.log("Modification annul??e.");
                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                        document.getElementById('modifyModalBody').style.display = 'block';
                      }
                    });



                  }



                });
                //GOOD
                $('#btnDeleteEvent').click(function () {


                  // if (doc.data().groupID != undefined) {
                  //   if (!confirm("Attention cet ??v??nement fait partie d'une r??currence. Souhaitez-vous ??galement supprimer les autres ??v??nements de la r??currence ?")) {
                  //     if (!confirm("??tes-vous s??r de vouloir supprimer cet ??v??nement?")) {
                  //       console.log("no delete");
                  //     } else {
                  //       /* query.delete()
                  //       .then(function()
                  //       { */
                  //       // Then we delete activities docs for each student
                  //       /*  if(userCategory == "teacher")
                  //       {
                  //         for(var i = 0; i<doc.data().students.length; i++)
                  //         {
                  //           firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                  //         }
                  //       } */

                  //       if (userCategory == "admin") {
                  //         firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).get()
                  //           .then(function (querySnapshot) {
                  //             querySnapshot.forEach(function (doc) {
                  //               console.log()
                  //               firestore.collection('activities').doc(doc.id).delete();
                  //             });
                  //             query.delete();
                  //             $("#modalModifyEvent").modal("hide");
                  //           }).catch(function (err) {
                  //             console.log("Error :", err);
                  //           });
                  //       }
                  //       /* }); */
                  //       info.event.remove();
                  //       console.log("Delete");
                  //     }
                  //   }
                  //   else {
                  //     console.log("here");
                  //     firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                  //       .then(function (querySnapshot) {
                  //         querySnapshot.forEach(function (docActivity) {
                  //           firestore.collection('activities').doc(docActivity.id).delete();
                  //           if (docActivity.data().idUser == user.uid) {
                  //             calendar.getEventById(docActivity.id).remove();
                  //           }
                  //         });
                  //         $("#modalModifyEvent").modal("hide");

                  //       }).catch(function (err) {
                  //         console.log("Error: ", err);
                  //       });
                  //   }
                  // }
                  // else {
                  //   if (!confirm("??tes-vous s??r de vouloir supprimer cet ??v??nement?")) {
                  //     console.log("no delete");
                  //   } else {
                  //     /* query.delete()
                  //     .then(function()
                  //     { */
                  //     // Then we delete activities docs for each student
                  //     /*  if(userCategory == "teacher")
                  //     {
                  //       for(var i = 0; i<doc.data().students.length; i++)
                  //       {
                  //         firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                  //       }
                  //     } */

                  //     if (userCategory == "admin") {
                  //       firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).get()
                  //         .then(function (querySnapshot) {
                  //           querySnapshot.forEach(function (doc) {
                  //             console.log()
                  //             firestore.collection('activities').doc(doc.id).delete();
                  //           });
                  //           query.delete();
                  //           $("#modalModifyEvent").modal("hide");
                  //         }).catch(function (err) {
                  //           console.log("Error :", err);
                  //         });
                  //     }
                  //     /* }); */
                  //     info.event.remove();
                  //     console.log("Delete");
                  //   }
                  // }

                  if (doc.data().groupID != undefined) {
                    // alert('la');
                    swal({
                      title: "Attention !",
                      text: "Cet ??v??n??ment fait partie d'une r??currence. Souhaitez-vous ??galement supprimer les autres ??v??n??ments ?? venir de la r??currence ?",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "green",
                      confirmButtonText: "Oui",
                      cancelButtonColor: "blue",
                      cancelButtonText: "Non",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {
                        console.log("oui je veux supprimer les ??v??nements r??currents.");
                        console.log("here");
                        firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                          .then(function (querySnapshot) {
                            querySnapshot.forEach(function (docActivity) {

                              if (docActivity.data().startDate >= doc.data().startDate) {
                                firestore.collection('activities').doc(docActivity.id).delete();
                                if (docActivity.data().idUser == user.uid) {
                                  calendar.getEventById(docActivity.id).remove();
                                }
                              }



                            });
                            $("#modalModifyEvent").modal("hide");

                          }).catch(function (err) {
                            console.log("Error: ", err);
                          });
                      }
                      else {
                        console.log("non je ne veux pas supprimer toutes les r??currences alors");

                        setTimeout(function () {
                          swal({
                            title: "Attention !",
                            text: "??tes-vous s??r de vouloir supprimer cet ??v??nement?",
                            type: "warning",
                            html: true,
                            showCancelButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Oui",
                            cancelButtonColor: "blue",
                            cancelButtonText: "Non",
                            closeOnConfirm: true,
                            closeOnCancel: true
                          }, function (isConfirm) {
                            if (isConfirm) {
                              console.log("oui je veux supprimer cet ??v??nement seulement");
                              if (userCategory == "admin") {
                                firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {
                                      console.log()
                                      firestore.collection('activities').doc(doc.id).delete();
                                    });
                                    query.delete();
                                    info.event.remove();
                                    console.log("Delete");
                                    $("#modalModifyEvent").modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }
                              /* }); */


                            }
                            else {
                              console.log("non je ne veux rien supprimer");
                            }
                          });
                        }, 300);

                      }
                    });

                  }


                  else {

                    swal({
                      title: "Attention !",
                      text: "??tes-vous s??r de vouloir supprimer cet ??v??nement?",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "green",
                      confirmButtonText: "Oui",
                      cancelButtonColor: "blue",
                      cancelButtonText: "Non",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {
                        console.log("oui je veux supprimer cet ??v??nement seulement");
                        if (userCategory == "admin") {
                          firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (doc) {
                                console.log()
                                firestore.collection('activities').doc(doc.id).delete();
                              });
                              query.delete();
                              info.event.remove();
                              console.log("Delete");
                              $("#modalModifyEvent").modal("hide");
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                        /* }); */


                      }
                      else {
                        console.log("non je ne veux rien supprimer");
                      }
                    });
                  }



                });
              }
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
              text: 'Ajouter un ??v??nement',
              click: function () {
                $('#modalAddEventClick').modal();
              }
            }
          },
          // slotDuration: '00:00:30',
          minTime: minTimeToDisplay,
          maxTime: maxTimeToDisplay,
          /* minTime: "07:00:00",
          maxTime: "19:00:00", */
          slotDuration: "00:30:00",
          height: 'auto',
          locale: 'fr', //Defines calendar's lang
          timeZone: 'local', //Timezone set on local
          //eventOverlap: false,
          allDaySlot: false,
          weekends: true, // Afficher - cacher les weekends
          themeSystem: 'bootstrap', //Theme utilis?? 

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
          dateClick: function (arg) {
            console.log(arg.date.toUTCString()); // use *UTC* methods on the native Date Object
            // will output something like 'Sat, 01 Sep 2018 00:00:00 GMT'
          },

          select: function (info) {  //When a period is selected, this function is triggered
            // alert(classValue);
            if (userCategory == "admin") {
              $("#modalAddEvent").modal(); //Display modal which contains Event Creation form
              $("input[value='Cours']").prop("checked", true);
            }

            $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
            $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
            $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
            $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()));

            console.log("Start Recur = ", new Date(Date.parse(getTimeWithoutOffset(info.start.getTime()))).getHours());
            console.log("End Recur = ", new Date(Date.parse(getTimeWithoutOffset(info.end.getTime()))).getMinutes());

            $("#formEvent").submit(function (ev) {  //Once the form is submitted
              var studentArray = [];
              var newEventTitle = document.getElementById("newEventTitle");
              var newEventType = $("input[name='newEventType']:checked").val();
              var newEventDescription = document.getElementById("newEventDescription");
              var selectedClass = document.getElementById("selectClass");
              var selectedStudent = document.getElementById("selectStudent");
              var startEvent = Date.parse($('#startEvent').val());
              var endEvent = Date.parse($('#endEvent').val());
              var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
              if (new Date(Date.parse($('#startEvent').val())).getMinutes() == 30) {
                startEventRecur = startEventRecur + 0.5;
              }
              var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours();
              if (new Date(Date.parse($('#endEvent').val())).getMinutes() == 30) {
                endEventRecur = endEventRecur + 0.5;
              }
              var newColor;

              document.getElementById('loadingGIF').style.display = 'block';
              document.getElementById('addModalBody').style.display = 'none';
              ev.preventDefault();

              switch ($('select#selectClass').val()) {
                case '1EVOL':
                  newColor = '#D55828';
                  break;
                case '3EVOL':
                  newColor = '#EEBF42';
                  break;
                case 'TS_EVOL':
                  newColor = '#003399';
                  break;
                case 'T_EVOL':
                  newColor = '#003399';
                  break;
                case '2EVOL':
                  newColor = '#52A03A';
                  break;
                case '1STMG_EVOL':
                  newColor = '#FFCC99';
                  break;
                case 'TSTMG_EVOL':
                  newColor = '#46A2DA';
                  break;
                case '6??me':
                  newColor = '#AD97C1';
                  break;
                case '5??me':
                  newColor = '#0CC19E';
                  break;
                case '4??me':
                  newColor = '#F2647B';
                  break;
                case 'Terminale Pro Commerce':
                  newColor = '#6666CC';
                  break;
                default:
                  newColor = 'red';
              }

              // If the event isn't recurrent
              if ($('select#selectRecur').val() == "non") {
                //Write data into Firebase user
                var query = firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val());
                query.set({
                  idUser: user.uid,
                  typeActivity: newEventType,
                  id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                  eventColor: newColor,
                  startDate: startEvent,
                  endDate: endEvent,
                  title: $('select#selectMatiere').val(),
                  editable: true,
                  description: newEventDescription.value,
                  classe: $('select#selectClass').val(),
                  attendees: $('select#selectStudent').val(),
                  activityDone: false,
                  teacherID: $('select#selectTeacher').val(),
                  realClasse: classValue
                }).then(function () {
                  console.log("Admin's activity added.");
                  calendar.addEvent({
                    title: $('select#selectMatiere').val(),
                    start: startEvent,
                    end: endEvent,
                    id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                    color: newColor,
                    editable: true,
                    classe: $('select#selectClass').val(),
                    allDay: false
                  });
                  //Write data for each student of a class OR for a specific student
                  if (userCategory == "admin") {
                    //Create activity for selected teacher
                    firestore.collection('activities').doc($('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                      .set({
                        idUser: $('select#selectTeacher').val(),
                        typeActivity: newEventType,
                        eventColor: newColor,
                        id: $('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                        startDate: startEvent,
                        endDate: endEvent,
                        title: $('select#selectMatiere').val(),
                        editable: false, //Student should not edit event programmed by teacher
                        description: newEventDescription.value,
                        classe: $('select#selectClass').val(),
                        attendees: $('select#selectStudent').val(),
                        activityDone: false,
                        teacherID: $('select#selectTeacher').val(),
                        realClasse: classValue
                      }).then(function () {
                        console.log("Document added for teacher");
                        if ($('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length == 1) {
                          //The whole class is selected
                          firestore.collection('users').where("userCategory", '==', "student").where("instituteName", "==", instituteName).where("classe", "==", $('select#selectClass').val()).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (doc) {
                                firestore.collection('activities').doc(doc.id + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                                  .set({
                                    idUser: doc.id,
                                    typeActivity: newEventType,
                                    eventColor: newColor,
                                    startDate: startEvent,
                                    endDate: endEvent,
                                    id: doc.id + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                                    title: $('select#selectMatiere').val(),
                                    editable: false, //Student should not edit event programmed by teacher
                                    description: newEventDescription.value,
                                    activityDone: false,
                                    classe: $('select#selectClass').val(),
                                    teacherID: $('select#selectTeacher').val(),
                                    realClasse: classValue
                                  }).then(function () {
                                    console.log("Document added for students");
                                    document.getElementById('loadingGIF').style.display = 'none';
                                    document.getElementById('addModalBody').style.display = 'block';
                                    $("#modalAddEvent").modal("hide"); //Hide modal
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                    let typeError = "";
                                    messageError = String(err);
                                    typeError = "Line 4116" + err;

                                    var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement d'un des ??tudiants'. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                    alertSwal(title, typeError);
                                  });
                              });
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        } else if (!$('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length == 1) {
                          //A specific student is selected --> we create his activity
                          firestore.collection('activities').doc($('select#selectStudent').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                            .set({
                              idUser: $('select#selectStudent').val()[0],
                              typeActivity: newEventType,
                              eventColor: newColor,
                              startDate: startEvent,
                              endDate: endEvent,
                              id: $('select#selectStudent').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                              title: $('select#selectMatiere').val(),
                              editable: false, //Student should not edit event programmed by teacher
                              description: newEventDescription.value,
                              activityDone: false,
                              classe: $('select#selectClass').val(),
                              teacherID: $('select#selectTeacher').val(),
                              realClasse: classValue
                            }).then(function () {
                              console.log("Activity successfully written for student :" + selectedStudent.value + "_");
                              document.getElementById('loadingGIF').style.display = 'none';
                              document.getElementById('addModalBody').style.display = 'block';
                              $("#modalAddEvent").modal("hide"); //Hide modal
                            }).catch(function (err) {
                              console.log("Error :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = "Line 4151" + err;

                              var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement de l'??tudiant. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                        } else if (!$('select#selectStudent').val().includes("classe") && $('select#selectStudent').val().length > 1) {
                          //A group of student is selected, but not the whole class
                          $('select#selectStudent').val().forEach(function (elem) {
                            firestore.collection('activities').doc(elem + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val())
                              .set({
                                idUser: elem,
                                typeActivity: newEventType,
                                eventColor: newColor,
                                startDate: startEvent,
                                endDate: endEvent,
                                id: elem + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + classValue + "_" + $('select#selectMatiere').val(),
                                title: $('select#selectMatiere').val(),
                                editable: false, //Student should not edit event programmed by teacher
                                description: newEventDescription.value,
                                activityDone: false,
                                classe: $('select#selectClass').val(),
                                teacherID: $('select#selectTeacher').val(),
                                realClasse: classValue
                              }).then(function () {
                                console.log("Activity successfully written for student :" + selectedStudent.value + "_");
                                document.getElementById('loadingGIF').style.display = 'none';
                                document.getElementById('addModalBody').style.display = 'block';
                                $("#modalAddEvent").modal("hide"); //Hide modal
                              }).catch(function (err) {
                                console.log("Error :", err);
                                let typeError = "";
                                messageError = String(err);
                                typeError = "Line 4183" + err;

                                var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement d'un des ??tudiants. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                alertSwal(title, typeError);
                              });
                          });
                        }
                      }).catch(function (err) {
                        console.log("Error ", err);
                        let typeError = "";
                        messageError = String(err);
                        typeError = "Line 4194" + err;

                        var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement du Professeur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                        alertSwal(title, typeError);
                      });
                  }
                }).catch(function (err) {
                  console.log("Error while writing data into DB :", err);
                  let typeError = "";
                  messageError = String(err);
                  typeError = "Line 4204" + err;

                  var title = "Une erreur est survenue lors de la cr??ation de l'??v??nement de l'Administrateur. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                  alertSwal(title, typeError);
                });
                //If the event is recurrent
              } else if ($('select#selectRecur').val() == "oui") {
                var startRecur = startEvent / 1000;
                var endRecur = (Date.parse($('#endRecur').val())) / 1000;
                var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);
                var startArray = [];
                var endArray = [];

                console.log('Start Recur : ', startRecur);
                console.log('EndRecur :', endRecur);
                console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))

                for (var i = 0; i < eventCoef; i++) {
                  if (i != 0) {
                    var newStart = new Date(startEvent);
                    startEvent = newStart.setDate(newStart.getDate() + 7);

                    var newEnd = new Date(endEvent);
                    endEvent = newEnd.setDate(newEnd.getDate() + 7);
                  }
                  console.log("Start n??" + i + " : ", startEvent);
                  console.log("End n??" + i + " : ", endEvent);

                  // displayEvent($('select#selectMatiere').val(), startEvent, endEvent, user.uid+"_"+startEvent+"_"+$('select#selectClass').val()+"_"+$('select#selectMatiere').val(), newColor, true, calendar);
                  /*  calendar.addEvent({
                     title: $('select#selectMatiere').val(),
                     start: startEvent,
                     end: endEvent,
                     color: newColor,
                     id: user.uid + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val()
                   }); */
                  startArray.push(startEvent);
                  endArray.push(endEvent);
                }
                createRecurringEvents(user.uid, instituteName, userCategory, newEventType, newEventDescription.value, newColor, startArray, endArray, $('select#selectClass').val(), $('select#selectMatiere').val(), $('select#selectStudent').val(), $('select#selectTeacher').val(), 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);
              }
            });
          },

          eventClick: function (info) {  //When an event is clicked this function is triggereda
            // alert(info.event.id);
            document.getElementById('btnVirtualRoom').setAttribute('disabled', true);
            document.getElementById('btnVirtualRoomTeacher').setAttribute('disabled', true);
            document.getElementById('btnVirtualRoomAdmin').setAttribute('disabled', true);

            var oldTitle = info.event.title;
            var oldStartDate = info.event.start.getTime();
            var query = firestore.collection('activities').doc(info.event.id);
            query.get().then(function (doc) {
              console.log(doc.id);
              if (doc.data().editable != true) {
                // alert("Vous ne pouvez pas modifier ou supprimer cet ??v??nement");
                firestore.collection('users').doc(doc.idUser).get()
                  .then(function (doc2) {
                    if (doc2.data().userCategory == "student") {
                      $('#modalShowEvent').modal();
                      showMatiere.value = doc.data().title;
                      showActivities.value = doc.data().typeActivity;
                      showDescription.value = doc.data().description;
                      showClassName.innerText = doc.data().classe;

                      firestore.collection('users').doc(doc.data().teacherID).get()
                        .then(function (docTeacher) {
                          document.getElementById('linkVirtualRoom').href = docTeacher.data().virtualRoom;
                          document.getElementById('btnVirtualRoom').removeAttribute('disabled');
                        }).catch(function (err) {
                          console.log("Error : ", err);
                        });

                    } else if (doc2.data().userCategory == "teacher") {

                      oldTitle = doc.data().title;

                      firestore.collection('users').doc(user.uid).get()
                        .then(function (docTeacher) {
                          document.getElementById('linkVirtualRoomTeacher').href = docTeacher.data().virtualRoom;
                          document.getElementById('btnVirtualRoomTeacher').removeAttribute('disabled');
                        }).catch(function (err) {
                          console.log("Error :", err);
                        });


                      var modifyGroupID = firebase.firestore.FieldValue.delete();
                      var modifyStartRecur = firebase.firestore.FieldValue.delete();
                      var modifyEndRecur = firebase.firestore.FieldValue.delete();

                      $('#modalModifyTeacher').modal();
                      $("input[value='" + doc.data().typeActivity + "']").prop("checked", true);
                      modifyEventDescriptionTeacher.value = doc.data().description;
                      modifyEventTitleTeacher.value = doc.data().title;
                      classNameTeacher.innerText = doc.data().classe;
                      realClasseName.innerText = doc.data().realClasse;

                      attendeesTeacher.innerHTML = '';
                      if (!doc.data().attendees.includes("classe")) {
                        doc.data().attendees.forEach(function (elem) {
                          firestore.collection('users').doc(elem).get()
                            .then(function (doc) {
                              if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                                attendeesTeacher.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                              }

                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        });
                      }
                      // Arnaud pour faire l'appel
                      var buttonValue = doc.idUser + '%' + doc.data().startDate + '%' + doc.data().classe + '%' + doc.data().title + '%' + doc.data().endDate;
                      var appelButton = document.getElementById('appel-button');
                      appelButton.removeAttribute('disabled');
                      appelButton.setAttribute('enabled', '');
                      var appelStatus = document.getElementById('appel-status');
                      if (doc.data().startDate <= Date.now()) {
                        if (doc.data().appelDone == null || !doc.data().appelDone) {
                          appelButton.value = buttonValue;
                          appelButton.style.display = '';
                          appelStatus.style.display = 'none';
                        }
                        else {
                          appelButton.style.display = 'none';
                          appelStatus.style.display = '';
                        }
                      }
                      else {
                        appelButton.style.display = '';
                        appelButton.setAttribute('disabled', '');
                        appelStatus.style.display = 'none';
                      }
                      // end Arnaud
                      $('#formModifyEventTeacher').submit(function (ev) {
                        console.log("FORM TEACHER SUBMITTED");
                        ev.preventDefault();
                        var modifiedEventType = $("input[name='modifyEventTypeTeacher']:checked").val();
                        console.log(modifiedEventType);
                        document.getElementById('modifyLoadingGIFTeacher').style.display = 'block';
                        document.getElementById('modifyModalBodyTeacher').style.display = 'none';
                        if (doc.data().groupID == undefined || doc.data().groupID == '') {
                          //NO RECURRENCE


                          console.log(doc.id);
                          query.set({
                            // title: modifyEventTitleTeacher.value,
                            description: modifyEventDescriptionTeacher.value,
                            typeActivity: modifiedEventType,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur,
                            groupID: modifyGroupID
                          }, {
                            merge: true
                          }).then(function () {
                            console.log("DONE FOR TEACHER");
                            console.log("CLASSE VALUE : ", doc.data().realClasse);
                            console.log("LEVEL VALUE : ", doc.data().classe);
                            console.log("START DATE :", doc.data().startDate);
                            console.log("OLD TITLE : ", oldTitle);
                            //Modify Admin and students activities
                            firestore.collection('activities').where("classe", "==", doc.data().classe).where('realClasse', '==', doc.data().realClasse).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
                              .then(function (querySnapshot) {
                                console.log("INSIDE THE QUERY");
                                querySnapshot.forEach(function (doc2) {
                                  console.log(doc2.data().id);
                                  firestore.collection('activities').doc(doc2.data().id)
                                    .set({
                                      // title: modifyEventTitleTeacher.value,
                                      description: modifyEventDescriptionTeacher.value,
                                      typeActivity: modifiedEventType,
                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur,
                                      groupID: modifyGroupID
                                      // eventColor: modifiedEventColor
                                    }, {
                                      merge: true
                                    }).catch(function (err) {
                                      console.log("Error: ", err);
                                      let typeError = "";
                                      messageError = String(err);
                                      typeError = "Line 4387" + err;

                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                      alertSwal(title, typeError);
                                    });
                                });
                                info.event.setProp('title', doc.data().title + ' - ' + doc.data().classe + ' - ' + doc.data().realClasse);
                                info.event.setProp('description', modifyEventDescriptionTeacher.value);
                                document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                $("#modalModifyTeacher").modal("hide");
                              }).catch(function (err) {
                                console.log("Error :", err);
                              });
                          }).catch(function (err) {
                            console.log("Error: ", err);
                            let typeError = "";
                            messageError = String(err);
                            typeError = "Line 4399" + err;

                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                            alertSwal(title, typeError);
                          });
                        }
                        else {
                          //RECURRENCE
                          //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                          console.log("Case 2: Update only.")
                          //I. Update admin's activity
                          query.update({
                            typeActivity: modifiedEventType,
                            description: modifyEventDescriptionTeacher.value,
                            groupID: modifyGroupID,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur

                          }).then(function () {
                            console.log("Admin's activity is now updated.")
                            info.event.remove();


                            calendar.addEvent({
                              title: doc.data().title + ' - ' + doc.data().classe + ' - ' + doc.data().realClasse,
                              start: doc.data().startDate,
                              end: doc.data().endDate,
                              description: modifyEventDescriptionTeacher.value,
                              id: user.uid + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                              color: doc.data().eventColor,
                              editable: true,
                              classe: doc.data().classe,
                              allDay: false,

                            });

                            //II. Now we can deal with admin's activity.

                            //Here we don't need to check whether the teacher has changed or not.
                            //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                            //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                            //This case is managed above, so here we just have to update teacher's activity.

                            firestore.collection('activities').doc(doc2.data().idAdmin + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                              .update({

                                typeActivity: modifiedEventType,
                                description: modifyEventDescriptionTeacher.value,
                                groupID: modifyGroupID,
                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              }).then(function () {
                                console.log("admins activity is now updated.")
                                // //III. Finally we can deal with students' activities

                                /* HEREEEEE */
                                //First let's check if new attendees already have their activities in order to update them.
                                if (doc.data().attendees.includes('classe')) {
                                  //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                  //If activity exists: we update / if activity doesn't exist: we create.
                                  firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', doc.data().classe).where('realClasse', '==', doc.data().realClasse).get()
                                    .then(function (querySnapshot) {
                                      querySnapshot.forEach(function (docStudent) {
                                        firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title).get()
                                          .then(function (doc) {
                                            if (doc.exists) {
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                                .update({
                                                  typeActivity: modifiedEventType,
                                                  description: modifyEventDescriptionTeacher.value,
                                                  groupID: modifyGroupID,
                                                  startRecur: modifyStartRecur,
                                                  endRecur: modifyEndRecur
                                                }).then(function () {
                                                  console.log("Student's document updated.");
                                                }).catch(function (err) {
                                                  console.log("Error while updating student's doc :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = "Line 4484" + err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                })
                                            }
                                            else {
                                              //ICI
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                                .set({
                                                  idUser: docStudent.data().id,
                                                  typeActivity: modifiedEventType,
                                                  id: docStudent.data().id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                                                  eventColor: doc.data().eventColor,
                                                  startDate: doc.data().startDate,
                                                  endDate: doc.data().endDate,
                                                  title: doc.data().title,
                                                  editable: false,
                                                  description: modifyEventDescriptionTeacher.value,
                                                  classe: doc.data().classe,
                                                  attendees: doc.data().attendees,
                                                  activityDone: false,
                                                  teacherID: doc.data().teacherID,
                                                  groupID: modifyGroupID,
                                                  realClasse: doc.data().realClasse,
                                                  startRecur: modifyStartRecur,
                                                  endRecur: modifyEndRecur
                                                },
                                                  {
                                                    merge: true
                                                  }).then(function () {
                                                    console.log("Activity created for student.");
                                                  }).catch(function (err) {
                                                    console.log("Error :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = "Line 4519" + err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  });
                                            }
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });
                                      });

                                      document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                      document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                      console.log("MODAL MODIFY TEACHER ABOUT TO CLOSE");
                                      $('#modalModifyTeacher').modal("hide");

                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }
                                else {
                                  //A specific or several student are selected. We repeat the same process.
                                  //For every student we check whether the activity already exists or not.
                                  doc.data().attendees.forEach(function (elem) {
                                    firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title).get()
                                      .then(function (doc) {
                                        if (doc.exists) {
                                          firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                            .update({
                                              typeActivity: modifiedEventType,
                                              description: modifyEventDescriptionTeacher.value,
                                              groupID: modifyGroupID,
                                              startRecur: modifyStartRecur,
                                              endRecur: modifyEndRecur
                                            }).then(function () {
                                              console.log("Student's activity updated.");
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = "Line 4559" + err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                        }
                                        else {
                                          firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title)
                                            .set({
                                              //ICI
                                              idUser: elem,
                                              typeActivity: modifiedEventType,
                                              id: elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().realClasse + "_" + doc.data().title,
                                              eventColor: doc.data().eventColor,
                                              startDate: doc.data().startDate,
                                              endDate: doc.data().endDate,
                                              title: doc.data().title,
                                              editable: false,
                                              description: modifyEventDescriptionTeacher.value,
                                              classe: doc.data().classe,
                                              attendees: doc.data().attendees,
                                              activityDone: false,
                                              teacherID: doc.data().teacherID,
                                              groupID: modifyGroupID,
                                              realClasse: doc.data().realClasse,
                                              startRecur: modifyStartRecur,
                                              endRecur: modifyEndRecur
                                            },
                                              {
                                                merge: true
                                              }).then(function () {
                                                console.log("Activity created for student.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = "Line 4596" + err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                        }
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  });
                                  document.getElementById('modifyLoadingGIFTeacher').style.display = 'none';
                                  document.getElementById('modifyModalBodyTeacher').style.display = 'block';
                                  console.log("MODAL MODIFY TEACHER ABOUT TO CLOSE");
                                  $('#modalModifyTeacher').modal("hide");
                                }
                                /* FIN HEREEEEE */

                              }).catch(function (err) {
                                console.log("Error :", err);
                                let typeError = "";
                                messageError = String(err);
                                typeError = "Line 4593" + err;

                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                alertSwal(title, typeError);
                              });


                          }).catch(function (err) {
                            console.log("Error while updating admin's activity: ", err);
                            let typeError = "";
                            messageError = String(err);
                            typeError = "Line 4598" + err;

                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                            alertSwal(title, typeError);
                          });
                        }
                      });
                    }
                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });
              } else {

                //ADMIN SECTION

                firestore.collection('users').doc(doc.data().teacherID).get()
                  .then(function (docTeacher) {
                    document.getElementById('linkVirtualRoomAdmin').href = docTeacher.data().virtualRoom;
                    document.getElementById('btnVirtualRoomAdmin').removeAttribute('disabled');
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });

                var oldClass = doc.data().classe;
                var oldAttendees = doc.data().attendees;
                var oldTeacher = doc.data().teacherID;
                // console.log("oldtitle :", oldTitle);
                // console.log("OldStartDate :", oldStartDate);
                // console.log("oldClass :", oldClass);
                $('#modalModifyEvent').modal();

                var modifiedEventTitle = document.getElementById("modifyEventTitle");
                var modifiedEventDescription = document.getElementById("modifyEventDescription");

                // Once the modal is opened we clear all text areas
                // modifiedEventTitle.value = "";   
                modifiedEventDescription.value = "";
                className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';

                //For each inputs we set their values according to user's activity data
                //Creation of attendees' list
                if (!doc.data().attendees.includes("classe")) {
                  doc.data().attendees.forEach(function (elem) {
                    firestore.collection('users').doc(elem).get()
                      .then(function (doc) {
                        if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                          attendeesAdmin.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                        }

                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                  });
                }
                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                // $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startRecur).slice(0, -13));
                $('select#selectModifyTeacher').val(doc.data().teacherID);

                firestore.collection('users').where("id", "==", $('select#selectModifyTeacher').val()).get()
                  .then(function (querySnapshot) {

                    querySnapshot.forEach(function (doc) {
                      //We create the list of subjects according to teacher's profile
                      for (var i = 0; i < doc.data().matieres.length; i++) {
                        selectModifyMatiere.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
                      }
                      //We create the list of classes according to teacher's profile
                      for (var j = 0; j < doc.data().classe.length; j++) {
                        selectModifyClass.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
                      }
                    });
                    //We then set these select with the according value
                    $('select#selectModifyClass').val(doc.data().classe);
                    $('select#selectModifyMatiere').val(doc.data().title);
                    //Generate list of students according to the seleced class and subject (also checks for specialty subjects)
                    initModifyStudentSelection($('select#selectModifyClass').val(), doc.data().instituteName, doc.data().attendees);
                    if (doc.data().groupID == undefined || doc.data().groupID == '') {
                      //Event is not recurrent, we don't display recurring section
                      $('select#selectModifyRecur').val('non');
                      document.getElementById('modifyRecurrenceSection').style.display = "none";
                      document.getElementById('selectModifyTeacher').removeAttribute('disabled');
                      document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                      document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                      document.getElementById('selectModifyRecur').setAttribute('disabled', true);

                    } else {
                      $('select#selectModifyRecur').val('oui');
                      document.getElementById('modifyRecurrenceSection').style.display = "block";
                      $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                      $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                      document.getElementById('selectModifyTeacher').setAttribute('disabled', true);
                      document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                      document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                      document.getElementById('selectModifyRecur').setAttribute('disabled', true);



                    }
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                //We set description
                modifiedEventDescription.value = doc.data().description;
                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "D??crivez l'??v??nement...";  // We set placeholders
                }
                //We check corresponding activity type
                $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs


                //FORMULAIRE
                $('#formModifyEvent').submit(function (eve) {

                  eve.preventDefault();
                  document.getElementById('modifyLoadingGIF').style.display = 'block';
                  document.getElementById('modifyModalBody').style.display = 'none';
                  var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                  var newStartDate = Date.parse($('#modifyStartEvent').val());
                  var newEndDate = Date.parse($('#modifyEndEvent').val());

                  if ($('select#selectModifyRecur').val() == 'non') {
                    //CHECK IF RECURRENCE
                    //IF SO WE NEED TO DELETED ALL RECURRENCES
                    //IF NOT WE PROCEED NORMALLY
                    console.log("I AM IN THE CASE WHERE THERE IS NOT RECURRENCE'");
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();
                    var newColor;

                    switch ($('select#selectModifyClass').val()) {
                      case '1EVOL':
                        newColor = '#D55828';
                        break;
                      case '3EVOL':
                        newColor = '#EEBF42';
                        break;
                      case 'TS_EVOL':
                        newColor = '#003399';
                        break;
                      case 'T_EVOL':
                        newColor = '#003399';
                        break;
                      case '2EVOL':
                        newColor = '#52A03A';
                        break;
                      case '1STMG_EVOL':
                        newColor = '#FFCC99';
                        break;
                      case 'TSTMG_EVOL':
                        newColor = '#46A2DA';
                        break;
                      case '6??me':
                        newColor = '#AD97C1';
                        break;
                      case '5??me':
                        newColor = '#0CC19E';
                        break;
                      case '4??me':
                        newColor = '#F2647B';
                        break;
                      case 'Terminale Pro Commerce':
                        newColor = '#6666CC';
                        break;
                      default:
                        newColor = 'red';
                    }

                    if (doc.data().groupID != undefined) {
                      console.log("I AM IN THE CASE WHERE THERE IS A RECURRENCE BELONGING")
                      //IS PART OF RECURRENCE -- > DELETE ALL OTHER EVENTS EXCEPT FROM THIS ONE (admin + teacher + attendees)
                      firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                        .then(function (querySnapshot) {
                          querySnapshot.forEach(function (docActivity) {
                            console.log("other activities with same id " + docActivity.id);
                            if (docActivity.data().startDate != doc.data().startDate) {
                              console.log(docActivity.id + ' to be deleted');
                              console.log(calendar.getEventById(docActivity.id));
                              if (docActivity.data().idUser == user.uid) {
                                calendar.getEventById(docActivity.id).remove();

                              }
                              firestore.collection('activities').doc(docActivity.id).delete();

                            }
                          });

                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity
                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                typeActivity: modifiedEventType,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                description: modifiedEventDescription.value,
                                classe: $('select#selectModifyClass').val(),
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                groupID: modifyGroupID,
                                realClasse: classValue,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur

                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activty updated");
                                  info.event.remove();
                                  if ($('select#selectModifyRecur').val() == "non") {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false
                                    });
                                  }
                                  else {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false


                                    });
                                  }


                                  //II. Now we deal with teacher's activity

                                  firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyTeacher').val(),
                                      typeActivity: modifiedEventType,
                                      id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      description: modifiedEventDescription.value,
                                      classe: $('select#selectModifyClass').val(),
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,
                                      realClasse: classValue,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        console.log("Teacher's new activity created. About to delete the old one");
                                        firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                        console.log("Teacher's old activity deleted.");

                                        //III. Now we deal with student's activity.

                                        //First we need to delete old activities using oldAttendees.
                                        if (oldAttendees.includes('classe')) {

                                          //Here we need to query every student of the class.
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                              });
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          //Here we browse oldAttendees and delete activity for each element.

                                          oldAttendees.forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }

                                        //Now that we deleted students' old activities we can start creating new ones.

                                        if ($('select#selectModifyStudent').val() == 'classe') {
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,

                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur

                                                  },
                                                    {
                                                      merge: true
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              });
                                              query.delete();
                                              console.log("Old admin's event deleted");
                                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                                              document.getElementById('modifyModalBody').style.display = 'block';
                                              $('#modalModifyEvent').modal("hide");

                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          $('select#selectModifyStudent').val().forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,

                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");
                                        }
                                      }).catch(function (err) {
                                        console.log("Error while creating teacher's new activity :", err);
                                        let typeError = "";
                                        messageError = String(err);
                                        typeError = err;

                                        var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                        alertSwal(title, typeError);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });





                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur

                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false,

                                });
                              }
                              //II. Now we can deal with teacher's activity.

                              //Here we don't need to check whether the teacher has changed or not.
                              //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                              //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                              //This case is managed above, so here we just have to update teacher's activity.

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Teacher's activity is now updated.")
                                  //III. Finally we can deal with students' activities

                                  //First let's check if new attendees already have their activities in order to update them.
                                  if ($('select#selectModifyStudent').val() == 'classe') {
                                    //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                    //If activity exists: we update / if activity doesn't exist: we create.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                            .then(function (doc) {
                                              if (doc.exists) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .update({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  }).then(function () {
                                                    console.log("Student's document updated.");
                                                  }).catch(function (err) {
                                                    console.log("Error while updating student's doc :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  })
                                              }
                                              else {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  },
                                                    {
                                                      merge: true
                                                    }).then(function () {
                                                      console.log("Activity created for student.");
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              }
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        });

                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");

                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }
                                  else {
                                    //A specific or several student are selected. We repeat the same process.
                                    //For every student we check whether the activity already exists or not.
                                    $('select#selectModifyStudent').val().forEach(function (elem) {
                                      firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's activity updated.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                          }
                                          else {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                    //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                    //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                              .then(function (doc) {
                                                if (doc.exists) {
                                                  firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                                }
                                              }).catch(function (err) {
                                                console.log("Error: ", err);
                                              });
                                          }
                                        });
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }


                                }).catch(function (err) {
                                  console.log("Error :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });


                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                          }


                        }).catch(function (err) {
                          console.log("Error :", err);
                        });
                    }
                    else {
                      //ISNT PART OF RECURRENCE --> PROCEED AS USUAL
                      console.log("The event isn't part of a recurrence, we should proceed as usual");
                      if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                        //In this case we should recreate the event for each affected user and delete their old activity
                        console.log("Case 1: We need to delete/recreate.");
                        // I. We deal with Admin's activity
                        firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                          .set({
                            idUser: user.uid,
                            typeActivity: modifiedEventType,
                            id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                            eventColor: newColor,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            title: $('select#selectModifyMatiere').val(),
                            editable: true,
                            description: modifiedEventDescription.value,
                            classe: $('select#selectModifyClass').val(),
                            attendees: $('select#selectModifyStudent').val(),
                            activityDone: false,
                            teacherID: $('select#selectModifyTeacher').val(),
                            groupID: modifyGroupID,
                            realClasse: classValue,
                            startRecur: modifyStartRecur,
                            endRecur: modifyEndRecur

                          },
                            {
                              merge: true
                            }).then(function () {
                              console.log("Admin's activty updated");
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false


                                });
                              }


                              //II. Now we deal with teacher's activity

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .set({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur

                                },
                                  {
                                    merge: true
                                  }).then(function () {
                                    console.log("Teacher's new activity created. About to delete the old one");
                                    firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                    console.log("Teacher's old activity deleted.");

                                    //III. Now we deal with student's activity.

                                    //First we need to delete old activities using oldAttendees.
                                    if (oldAttendees.includes('classe')) {

                                      //Here we need to query every student of the class.
                                      firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                        .then(function (querySnapshot) {
                                          querySnapshot.forEach(function (docStudent) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    }
                                    else {
                                      //Here we browse oldAttendees and delete activity for each element.

                                      oldAttendees.forEach(function (elem) {
                                        firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                      });
                                    }

                                    //Now that we deleted students' old activities we can start creating new ones.

                                    if ($('select#selectModifyStudent').val() == 'classe') {
                                      firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                        .then(function (querySnapshot) {
                                          querySnapshot.forEach(function (docStudent) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");

                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    }
                                    else {
                                      $('select#selectModifyStudent').val().forEach(function (elem) {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .set({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur

                                          },
                                            {
                                              merge: true
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                      });
                                      query.delete();
                                      console.log("Old admin's event deleted");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }
                                  }).catch(function (err) {
                                    console.log("Error while creating teacher's new activity :", err);
                                    let typeError = "";
                                    messageError = String(err);
                                    typeError = err;

                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                    alertSwal(title, typeError);
                                  });

                            }).catch(function (err) {
                              console.log("Error while creating new event for Admin :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });





                      }
                      else {
                        //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                        console.log("Case 2: Update only.")
                        //I. Update admin's activity
                        query.update({
                          idUser: user.uid,
                          typeActivity: modifiedEventType,
                          id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                          eventColor: newColor,
                          startDate: newStartDate,
                          endDate: newEndDate,
                          title: $('select#selectModifyMatiere').val(),
                          editable: true,
                          description: modifiedEventDescription.value,
                          classe: $('select#selectModifyClass').val(),
                          attendees: $('select#selectModifyStudent').val(),
                          activityDone: false,
                          teacherID: $('select#selectModifyTeacher').val(),
                          groupID: modifyGroupID,
                          realClasse: classValue,
                          startRecur: modifyStartRecur,
                          endRecur: modifyEndRecur

                        }).then(function () {
                          console.log("Admin's activity is now updated.")
                          info.event.remove();
                          if ($('select#selectModifyRecur').val() == "non") {
                            calendar.addEvent({
                              title: $('select#selectModifyMatiere').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              color: newColor,
                              editable: true,
                              classe: $('select#selectModifyClass').val(),
                              allDay: false
                            });
                          }
                          else {
                            calendar.addEvent({
                              title: $('select#selectModifyMatiere').val(),
                              start: newStartDate,
                              end: newEndDate,
                              description: modifiedEventDescription.value,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              color: newColor,
                              editable: true,
                              classe: $('select#selectModifyClass').val(),
                              allDay: false,

                            });
                          }
                          //II. Now we can deal with teacher's activity.

                          //Here we don't need to check whether the teacher has changed or not.
                          //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                          //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                          //This case is managed above, so here we just have to update teacher's activity.

                          firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                            .update({
                              idUser: $('select#selectModifyTeacher').val(),
                              typeActivity: modifiedEventType,
                              id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: false,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Teacher's activity is now updated.")
                              //III. Finally we can deal with students' activities

                              //First let's check if new attendees already have their activities in order to update them.
                              if ($('select#selectModifyStudent').val() == 'classe') {
                                //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                //If activity exists: we update / if activity doesn't exist: we create.
                                firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (docStudent) {
                                      firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's document updated.");
                                              }).catch(function (err) {
                                                console.log("Error while updating student's doc :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              })
                                          }
                                          else {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: docStudent.data().id,
                                                typeActivity: modifiedEventType,
                                                id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");

                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }
                              else {
                                //A specific or several student are selected. We repeat the same process.
                                //For every student we check whether the activity already exists or not.
                                $('select#selectModifyStudent').val().forEach(function (elem) {
                                  firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                    .then(function (doc) {
                                      if (doc.exists) {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .update({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur
                                          }).then(function () {
                                            console.log("Student's activity updated.");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                            let typeError = "";
                                            messageError = String(err);
                                            typeError = err;

                                            var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                            alertSwal(title, typeError);
                                          });
                                      }
                                      else {
                                        firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                          .set({
                                            idUser: elem,
                                            typeActivity: modifiedEventType,
                                            id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                            eventColor: newColor,
                                            startDate: newStartDate,
                                            endDate: newEndDate,
                                            title: $('select#selectModifyMatiere').val(),
                                            editable: false,
                                            description: modifiedEventDescription.value,
                                            classe: $('select#selectModifyClass').val(),
                                            attendees: $('select#selectModifyStudent').val(),
                                            activityDone: false,
                                            teacherID: $('select#selectModifyTeacher').val(),
                                            groupID: modifyGroupID,
                                            realClasse: classValue,
                                            startRecur: modifyStartRecur,
                                            endRecur: modifyEndRecur
                                          },
                                            {
                                              merge: true
                                            }).then(function () {
                                              console.log("Activity created for student.");
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                              let typeError = "";
                                              messageError = String(err);
                                              typeError = err;

                                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                              alertSwal(title, typeError);
                                            });
                                      }
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                });

                                //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (docStudent) {
                                      if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                        firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                          .then(function (doc) {
                                            if (doc.exists) {
                                              firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                            }
                                          }).catch(function (err) {
                                            console.log("Error: ", err);
                                          });
                                      }
                                    });
                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }


                            }).catch(function (err) {
                              console.log("Error :", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });


                        }).catch(function (err) {
                          console.log("Error while updating admin's activity: ", err);
                          let typeError = "";
                          messageError = String(err);
                          typeError = err;

                          var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                          alertSwal(title, typeError);
                        });
                      }
                    }

                  }
                  else if ($('select#selectModifyRecur').val() == 'oui') {
                    //CHECK IF RECURRENCE
                    //IF NOT WE CREATE ALL OTHER EVENTS
                    //IF SO
                    console.log("The event wants to be recurrent");
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();

                    swal({
                      title: "Attention !",
                      text: "Cet ??v??n??ment fait partie d'une r??currence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette derni??re de la r??currence existante.",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "#3BAFDA",
                      confirmButtonText: "J'ai compris et je confirme la modification",
                      cancelButtonText: "Annuler",
                      closeOnConfirm: true

                      // closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {





                        var newColor;

                        switch ($('select#selectModifyClass').val()) {
                          case '1EVOL':
                            newColor = '#D55828';
                            break;
                          case '3EVOL':
                            newColor = '#EEBF42';
                            break;
                          case 'TS_EVOL':
                            newColor = '#003399';
                            break;
                          case 'T_EVOL':
                            newColor = '#003399';
                            break;
                          case '2EVOL':
                            newColor = '#52A03A';
                            break;
                          case '1STMG_EVOL':
                            newColor = '#FFCC99';
                            break;
                          case 'TSTMG_EVOL':
                            newColor = '#46A2DA';
                            break;
                          case '6??me':
                            newColor = '#AD97C1';
                            break;
                          case '5??me':
                            newColor = '#0CC19E';
                            break;
                          case '4??me':
                            newColor = '#F2647B';
                            break;
                          case 'Terminale Pro Commerce':
                            newColor = '#6666CC';
                            break;
                          default:
                            newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {

                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity
                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                typeActivity: modifiedEventType,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                description: modifiedEventDescription.value,
                                classe: $('select#selectModifyClass').val(),
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                groupID: modifyGroupID,
                                realClasse: classValue,
                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur

                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activty updated");
                                  info.event.remove();
                                  if ($('select#selectModifyRecur').val() == "non") {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false
                                    });
                                  }
                                  else {
                                    calendar.addEvent({
                                      title: $('select#selectModifyMatiere').val(),
                                      start: newStartDate,
                                      end: newEndDate,
                                      description: modifiedEventDescription.value,
                                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      color: newColor,
                                      editable: true,
                                      classe: $('select#selectModifyClass').val(),
                                      allDay: false


                                    });
                                  }


                                  //II. Now we deal with teacher's activity

                                  firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyTeacher').val(),
                                      typeActivity: modifiedEventType,
                                      id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      description: modifiedEventDescription.value,
                                      classe: $('select#selectModifyClass').val(),
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,
                                      realClasse: classValue,
                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        console.log("Teacher's new activity created. About to delete the old one");
                                        firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                        console.log("Teacher's old activity deleted.");

                                        //III. Now we deal with student's activity.

                                        //First we need to delete old activities using oldAttendees.
                                        if (oldAttendees.includes('classe')) {

                                          //Here we need to query every student of the class.
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', oldClass).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                              });
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          //Here we browse oldAttendees and delete activity for each element.

                                          oldAttendees.forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + oldClass + "_" + classValue + "_" + doc.data().title).delete();
                                          });
                                        }

                                        //Now that we deleted students' old activities we can start creating new ones.

                                        if ($('select#selectModifyStudent').val() == 'classe') {
                                          firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                            .then(function (querySnapshot) {
                                              querySnapshot.forEach(function (docStudent) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur

                                                  },
                                                    {
                                                      merge: true
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              });
                                              query.delete();
                                              console.log("Old admin's event deleted");
                                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                                              document.getElementById('modifyModalBody').style.display = 'block';
                                              $('#modalModifyEvent').modal("hide");

                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        }
                                        else {
                                          $('select#selectModifyStudent').val().forEach(function (elem) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur

                                              },
                                                {
                                                  merge: true
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          });
                                          query.delete();
                                          console.log("Old admin's event deleted");
                                          document.getElementById('modifyLoadingGIF').style.display = 'none';
                                          document.getElementById('modifyModalBody').style.display = 'block';
                                          $('#modalModifyEvent').modal("hide");
                                        }
                                      }).catch(function (err) {
                                        console.log("Error while creating teacher's new activity :", err);
                                        let typeError = "";
                                        messageError = String(err);
                                        typeError = err;

                                        var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                        alertSwal(title, typeError);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });





                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              description: modifiedEventDescription.value,
                              classe: $('select#selectModifyClass').val(),
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              groupID: modifyGroupID,
                              realClasse: classValue,
                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur

                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();
                              if ($('select#selectModifyRecur').val() == "non") {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false
                                });
                              }
                              else {
                                calendar.addEvent({
                                  title: $('select#selectModifyMatiere').val(),
                                  start: newStartDate,
                                  end: newEndDate,
                                  description: modifiedEventDescription.value,
                                  id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  color: newColor,
                                  editable: true,
                                  classe: $('select#selectModifyClass').val(),
                                  allDay: false,

                                });
                              }
                              //II. Now we can deal with teacher's activity.

                              //Here we don't need to check whether the teacher has changed or not.
                              //Since each teacher is assigned with specific subjects, changing a teacher leads in changing the subject.
                              //Therefore if we change the subject we're in the case where the activity needs to be deleted and re created.
                              //This case is managed above, so here we just have to update teacher's activity.

                              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyTeacher').val(),
                                  typeActivity: modifiedEventType,
                                  id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  description: modifiedEventDescription.value,
                                  classe: $('select#selectModifyClass').val(),
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,
                                  realClasse: classValue,
                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Teacher's activity is now updated.")
                                  //III. Finally we can deal with students' activities

                                  //First let's check if new attendees already have their activities in order to update them.
                                  if ($('select#selectModifyStudent').val() == 'classe') {
                                    //If the whole class is selected, we have to browse every student of this class and check whether the activity already exists or not.
                                    //If activity exists: we update / if activity doesn't exist: we create.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                            .then(function (doc) {
                                              if (doc.exists) {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .update({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  }).then(function () {
                                                    console.log("Student's document updated.");
                                                  }).catch(function (err) {
                                                    console.log("Error while updating student's doc :", err);
                                                    let typeError = "";
                                                    messageError = String(err);
                                                    typeError = err;

                                                    var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                    alertSwal(title, typeError);
                                                  })
                                              }
                                              else {
                                                firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                                  .set({
                                                    idUser: docStudent.data().id,
                                                    typeActivity: modifiedEventType,
                                                    id: docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                    eventColor: newColor,
                                                    startDate: newStartDate,
                                                    endDate: newEndDate,
                                                    title: $('select#selectModifyMatiere').val(),
                                                    editable: false,
                                                    description: modifiedEventDescription.value,
                                                    classe: $('select#selectModifyClass').val(),
                                                    attendees: $('select#selectModifyStudent').val(),
                                                    activityDone: false,
                                                    teacherID: $('select#selectModifyTeacher').val(),
                                                    groupID: modifyGroupID,
                                                    realClasse: classValue,
                                                    startRecur: modifyStartRecur,
                                                    endRecur: modifyEndRecur
                                                  },
                                                    {
                                                      merge: true
                                                    }).then(function () {
                                                      console.log("Activity created for student.");
                                                    }).catch(function (err) {
                                                      console.log("Error :", err);
                                                      let typeError = "";
                                                      messageError = String(err);
                                                      typeError = err;

                                                      var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                      alertSwal(title, typeError);
                                                    });
                                              }
                                            }).catch(function (err) {
                                              console.log("Error :", err);
                                            });
                                        });

                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");

                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }
                                  else {
                                    //A specific or several student are selected. We repeat the same process.
                                    //For every student we check whether the activity already exists or not.
                                    $('select#selectModifyStudent').val().forEach(function (elem) {
                                      firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                        .then(function (doc) {
                                          if (doc.exists) {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .update({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              }).then(function () {
                                                console.log("Student's activity updated.");
                                              }).catch(function (err) {
                                                console.log("Error :", err);
                                                let typeError = "";
                                                messageError = String(err);
                                                typeError = err;

                                                var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                alertSwal(title, typeError);
                                              });
                                          }
                                          else {
                                            firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val())
                                              .set({
                                                idUser: elem,
                                                typeActivity: modifiedEventType,
                                                id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val(),
                                                eventColor: newColor,
                                                startDate: newStartDate,
                                                endDate: newEndDate,
                                                title: $('select#selectModifyMatiere').val(),
                                                editable: false,
                                                description: modifiedEventDescription.value,
                                                classe: $('select#selectModifyClass').val(),
                                                attendees: $('select#selectModifyStudent').val(),
                                                activityDone: false,
                                                teacherID: $('select#selectModifyTeacher').val(),
                                                groupID: modifyGroupID,
                                                realClasse: classValue,
                                                startRecur: modifyStartRecur,
                                                endRecur: modifyEndRecur
                                              },
                                                {
                                                  merge: true
                                                }).then(function () {
                                                  console.log("Activity created for student.");
                                                }).catch(function (err) {
                                                  console.log("Error :", err);
                                                  let typeError = "";
                                                  messageError = String(err);
                                                  typeError = err;

                                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                                  alertSwal(title, typeError);
                                                });
                                          }
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                    });

                                    //Now that we updated/created activities for new attendees, we need to delete activities for students that have been removed of the selection.
                                    //To do so we query all student belonging to the selected class. For each student we check if they're included in the new attendees selection.
                                    //If they aren't(meaning that they have been removed or they didn't have activity) we check if they had an activity doc. If so we delete it.
                                    firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectModifyClass').val()).where('realClasse', '==', classValue).get()
                                      .then(function (querySnapshot) {
                                        querySnapshot.forEach(function (docStudent) {
                                          if (!$('select#selectModifyStudent').val().includes(docStudent.data().id)) {
                                            firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).get()
                                              .then(function (doc) {
                                                if (doc.exists) {
                                                  firestore.collection('activities').doc(docStudent.data().id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + classValue + "_" + $('select#selectModifyMatiere').val()).delete();
                                                }
                                              }).catch(function (err) {
                                                console.log("Error: ", err);
                                              });
                                          }
                                        });
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });
                                  }


                                }).catch(function (err) {
                                  console.log("Error :", err);
                                  let typeError = "";
                                  messageError = String(err);
                                  typeError = err;

                                  var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                                  alertSwal(title, typeError);
                                });


                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                              let typeError = "";
                              messageError = String(err);
                              typeError = err;

                              var title = "Une erreur est survenue lors de la modification de l'??v??nement. Veuillez recommencer. Si le probl??me persiste, vous pouvez contacter le service technique de la plateforme.";
                              alertSwal(title, typeError);
                            });
                          }


                        }
                        else {
                          console.log("the event isn't part of a recurrence, we delte old event and recreate new ones");
                          firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (docActivityToDelete) {
                                console.log()
                                firestore.collection('activities').doc(docActivityToDelete.data().id).delete();
                              });
                              query.delete();
                              info.event.remove();

                              //ADD EVENTS
                              var startRecur = newStartDate / 1000;
                              var endRecur = (Date.parse($('#modifyEndRecur').val())) / 1000;

                              console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))
                              var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);

                              var startArray = [];
                              var endArray = [];
                              for (var i = 0; i < eventCoef; i++) {
                                if (i != 0) {
                                  var newStart = new Date(newStartDate);
                                  newStartDate = newStart.setDate(newStart.getDate() + 7);

                                  var newEnd = new Date(newEndDate);
                                  newEndDate = newEnd.setDate(newEnd.getDate() + 7);



                                }
                                console.log("Start n??" + i + " : ", newStartDate);
                                console.log("End n??" + i + " : ", newEndDate);

                                // displayEvent($('select#selectModifyMatiere').val(), newStartDate, newEndDate, user.uid+"_"+newStartDate+"_"+$('select#selectModifyClass').val()+"_"+$('select#selectModifyMatiere').val(), newColor, true, calendar);


                                startArray.push(newStartDate);
                                endArray.push(newEndDate);

                              }
                              createRecurringEvents(user.uid, instituteName, userCategory, modifiedEventType, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyClass').val(), $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), 0, uniqueID(), startRecur * 1000, endRecur * 1000, this.calendar);

                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                      }
                      else {
                        console.log("Modification annul??e.");
                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                        document.getElementById('modifyModalBody').style.display = 'block';
                      }
                    });



                  }



                });
                //GOOD
                $('#btnDeleteEvent').click(function () {


                  // if (doc.data().groupID != undefined) {
                  //   if (!confirm("Attention cet ??v??nement fait partie d'une r??currence. Souhaitez-vous ??galement supprimer les autres ??v??nements de la r??currence ?")) {
                  //     if (!confirm("??tes-vous s??r de vouloir supprimer cet ??v??nement?")) {
                  //       console.log("no delete");
                  //     } else {
                  //       /* query.delete()
                  //       .then(function()
                  //       { */
                  //       // Then we delete activities docs for each student
                  //       /*  if(userCategory == "teacher")
                  //       {
                  //         for(var i = 0; i<doc.data().students.length; i++)
                  //         {
                  //           firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                  //         }
                  //       } */

                  //       if (userCategory == "admin") {
                  //         firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).get()
                  //           .then(function (querySnapshot) {
                  //             querySnapshot.forEach(function (doc) {
                  //               console.log()
                  //               firestore.collection('activities').doc(doc.id).delete();
                  //             });
                  //             query.delete();
                  //             $("#modalModifyEvent").modal("hide");
                  //           }).catch(function (err) {
                  //             console.log("Error :", err);
                  //           });
                  //       }
                  //       /* }); */
                  //       info.event.remove();
                  //       console.log("Delete");
                  //     }
                  //   }
                  //   else {
                  //     console.log("here");
                  //     firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                  //       .then(function (querySnapshot) {
                  //         querySnapshot.forEach(function (docActivity) {
                  //           firestore.collection('activities').doc(docActivity.id).delete();
                  //           if (docActivity.data().idUser == user.uid) {
                  //             calendar.getEventById(docActivity.id).remove();
                  //           }
                  //         });
                  //         $("#modalModifyEvent").modal("hide");

                  //       }).catch(function (err) {
                  //         console.log("Error: ", err);
                  //       });
                  //   }
                  // }
                  // else {
                  //   if (!confirm("??tes-vous s??r de vouloir supprimer cet ??v??nement?")) {
                  //     console.log("no delete");
                  //   } else {
                  //     /* query.delete()
                  //     .then(function()
                  //     { */
                  //     // Then we delete activities docs for each student
                  //     /*  if(userCategory == "teacher")
                  //     {
                  //       for(var i = 0; i<doc.data().students.length; i++)
                  //       {
                  //         firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                  //       }
                  //     } */

                  //     if (userCategory == "admin") {
                  //       firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).get()
                  //         .then(function (querySnapshot) {
                  //           querySnapshot.forEach(function (doc) {
                  //             console.log()
                  //             firestore.collection('activities').doc(doc.id).delete();
                  //           });
                  //           query.delete();
                  //           $("#modalModifyEvent").modal("hide");
                  //         }).catch(function (err) {
                  //           console.log("Error :", err);
                  //         });
                  //     }
                  //     /* }); */
                  //     info.event.remove();
                  //     console.log("Delete");
                  //   }
                  // }

                  if (doc.data().groupID != undefined) {
                    // alert('la');
                    swal({
                      title: "Attention !",
                      text: "Cet ??v??n??ment fait partie d'une r??currence. Souhaitez-vous ??galement supprimer les autres ??v??n??ments ?? venir de la r??currence ?",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "green",
                      confirmButtonText: "Oui",
                      cancelButtonColor: "blue",
                      cancelButtonText: "Non",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {
                        console.log("oui je veux supprimer les ??v??nements r??currents.");
                        console.log("here");
                        firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                          .then(function (querySnapshot) {
                            querySnapshot.forEach(function (docActivity) {

                              if (docActivity.data().startDate >= doc.data().startDate) {
                                firestore.collection('activities').doc(docActivity.id).delete();
                                if (docActivity.data().idUser == user.uid) {
                                  calendar.getEventById(docActivity.id).remove();
                                }
                              }



                            });
                            $("#modalModifyEvent").modal("hide");

                          }).catch(function (err) {
                            console.log("Error: ", err);
                          });
                      }
                      else {
                        console.log("non je ne veux pas supprimer toutes les r??currences alors");

                        setTimeout(function () {
                          swal({
                            title: "Attention !",
                            text: "??tes-vous s??r de vouloir supprimer cet ??v??nement?",
                            type: "warning",
                            html: true,
                            showCancelButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "Oui",
                            cancelButtonColor: "blue",
                            cancelButtonText: "Non",
                            closeOnConfirm: true,
                            closeOnCancel: true
                          }, function (isConfirm) {
                            if (isConfirm) {
                              console.log("oui je veux supprimer cet ??v??nement seulement");
                              if (userCategory == "admin") {
                                firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                                  .then(function (querySnapshot) {
                                    querySnapshot.forEach(function (doc) {
                                      console.log()
                                      firestore.collection('activities').doc(doc.id).delete();
                                    });
                                    query.delete();
                                    info.event.remove();
                                    console.log("Delete");
                                    $("#modalModifyEvent").modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                              }
                              /* }); */


                            }
                            else {
                              console.log("non je ne veux rien supprimer");
                            }
                          });
                        }, 300);

                      }
                    });

                  }


                  else {

                    swal({
                      title: "Attention !",
                      text: "??tes-vous s??r de vouloir supprimer cet ??v??nement?",
                      type: "warning",
                      html: true,
                      showCancelButton: true,
                      confirmButtonColor: "green",
                      confirmButtonText: "Oui",
                      cancelButtonColor: "blue",
                      cancelButtonText: "Non",
                      closeOnConfirm: true,
                      closeOnCancel: true
                    }, function (isConfirm) {
                      if (isConfirm) {
                        console.log("oui je veux supprimer cet ??v??nement seulement");
                        if (userCategory == "admin") {
                          firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).where('realClasse', '==', classValue).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (doc) {
                                console.log()
                                firestore.collection('activities').doc(doc.id).delete();
                              });
                              query.delete();
                              info.event.remove();
                              console.log("Delete");
                              $("#modalModifyEvent").modal("hide");
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                        /* }); */


                      }
                      else {
                        console.log("non je ne veux rien supprimer");
                      }
                    });
                  }



                });
              }
            }).catch(function (err) {
              console.log("Error :", err);
            });
          }
        });
      }
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

                  if (!doc2.data().dev && doc2.data().dev != undefined) {
                    if (!doc2.data().testAccounts.includes(doc3.id)) {
                      eleveCounter++;
                      studentsListHtml = studentsListHtml1 + doc3.data().firstName + " " + doc3.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc3.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc3.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc3.id + "%" + splitString[3] + studentsListHtml8;
                      studentsListDiv.innerHTML += studentsListHtml;
                    }
                  }
                  else {
                    eleveCounter++;
                    studentsListHtml = studentsListHtml1 + doc3.data().firstName + " " + doc3.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc3.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc3.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc3.id + "%" + splitString[3] + studentsListHtml8;
                    studentsListDiv.innerHTML += studentsListHtml;
                  }


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
          firestore.collection('users').doc(user.uid).get()
            .then(function (docUser) {

              for (var i = 0; i < doc.data().attendees.length; i++) {
                firestore.collection('users').doc(doc.data().attendees[i]).get().then((doc2) => {

                  if (!docUser.data().dev && docUser.data().dev != undefined) {
                    if (!docUser.data().testAccounts.includes(doc2.id)) {
                      eleveCounter++
                      studentsListHtml = studentsListHtml1 + doc2.data().firstName + " " + doc2.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc2.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc2.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc2.id + "%" + splitString[3] + studentsListHtml8;
                      studentsListDiv.innerHTML += studentsListHtml;
                    }
                  }
                  else {
                    eleveCounter++
                    studentsListHtml = studentsListHtml1 + doc2.data().firstName + " " + doc2.data().lastName + studentsListHtml2 + eleveCounter + studentsListHtml3 + doc2.id + "%" + splitString[3] + studentsListHtml4 + eleveCounter + studentsListHtml5 + doc2.id + "%" + splitString[3] + studentsListHtml6 + eleveCounter + studentsListHtml7 + doc2.id + "%" + splitString[3] + studentsListHtml8;
                    studentsListDiv.innerHTML += studentsListHtml;
                  }


                }).catch((err) => {
                  console.log("error getting the student: " + err);
                });
              }
              studentsCounter.innerHTML = doc.data().attendees.length;

            })
            .catch(function (err) {
              console.log("Error :", err);
            });



        }
        loadingPicture.style.display = "none";
        submitButton.removeAttribute('disabled');
        submitButton.setAttribute('enabled', '');
      });

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