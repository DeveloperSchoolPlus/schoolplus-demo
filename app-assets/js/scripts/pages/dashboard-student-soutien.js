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
// const showActivities = document.getElementById('showActivities');
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
const chapitreNumber = document.getElementById('chapitreNumberValue');
const chapNumber = document.getElementById('chapterNumber');
const chapitreName = document.getElementById('chapitreName');
const expectedSkills = document.getElementById('expectedSkills');
const challenges = document.getElementById('challenges');




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


      var teachersName = [];
      var teachersId = [];

      firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', doc.data().instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (docTeacher) {

            teachersName.push(docTeacher.data().firstName + ' ' + docTeacher.data().lastName);
            teachersId.push(docTeacher.id);

          });

          firestore.collection('users').doc(doc.data().idAdmin).get()
            .then(function (docAdmin) {

              teachersName.push(docAdmin.data().firstName + ' ' + docAdmin.data().lastName);
              teachersId.push(docAdmin.id); //

              console.log(teachersName);
              initCalendar(doc.data().userCategory, doc.data().idAdmin, doc.data().matieres, doc.data().instituteName, teachersName, teachersId);


            }).catch(function (err) {
              console.log("Error: ", err);
            });


        }).catch(function (err) {
          console.log("Error: ", err);
        });



      if (doc.data().userCategory == 'student' || doc.data().userCategory == 'teacher') {
        $('#modalMessage').modal();
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
  firebase.auth().signOut();
  location.href = "../../pages/fr/login.php";
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
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });


    setUserInterface(doc.data().userCategory, doc.data().soutien, doc.data().instituteName);

    if (doc.data().userCategory == "admin") {
      document.getElementById('adminSection').style = "display:block;";
      adminSectionClick.style = "display:block;";
      document.getElementById("teacherSection").style = "display: block;";

      firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', doc.data().instituteName).where('soutien', '==', true).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (docUsers) {
            // console.log(docUsers.data().firstName + " " + docUsers.data().lastName);
            document.getElementById('selectStudent').innerHTML += '<option value="' + docUsers.id + '">' + docUsers.data().firstName + " " + docUsers.data().lastName + '</option>';
          });
        }).catch(function (err) {
          console.log("Error : ", err);
        });

      firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', doc.data().instituteName).where('soutien', '==', true).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (docTeacher) {
            if (docTeacher.id != 'cVdmeheFOMS7hUbFL5k3bTTvVWD3') {
              document.getElementById('selectTeacher').innerHTML += '<option value="' + docTeacher.id + '">' + docTeacher.data().firstName + " " + docTeacher.data().lastName + '</option>';

            }
          });
        }).catch(function (err) {
          console.log("Error :", err);
        })

      document.getElementById("activitiesClick").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Cours" id="newEventTypeClick" required>Cours</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="Contrôle" required>Contrôle</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="Interrogation orale" required>Interrogation orale</label></fieldset>'
    } else if (doc.data().userCategory == "student") {
      document.getElementById("activitiesClick").innerHTML = '<fieldset class="right-radio"><label><input type="radio" name="newEventType" value="competition" id="newEventType" required>Compétition sport</label></fieldset><fieldset class="right-radio"><label><input type="radio" name="newEventType" value="entrainement" required>Entraînement sport</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="perso" required>Personnel</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="culturelle" required>Activité culturelle (concert, musée...)</label></fieldset><fieldset class="right-radio disabled"><label><input type="radio" name="newEventType" value="artistique" required>Activité artistique (danse, musique...)</label></fieldset>'
    }
  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });
}

$('select#selectModifyStudent').on('change', function () {
  document.getElementById('selectModifyMatiere').innerHTML = '';
  firestore.collection('users').doc($('select#selectModifyStudent').val()).get()
    .then(function (docStudent) {
      docStudent.data().matieres.forEach(function (elem) {
        // console.log(elem.matiere);
        document.getElementById('selectModifyMatiere').innerHTML += '<option value="' + elem.matiere + '" >' + elem.matiere + '</option>';
      });
    }).catch(function (err) {
      console.log("Error : ", err);
    });
});

$('select#selectStudent').on('change', function () {
  selectedMatiere.innerHTML = "";
  firestore.collection('users').doc($('select#selectStudent').val()).get()
    .then(function (docUser) {
      docUser.data().matieres.forEach(function (elem) {
        console.log("Matières: ", elem.matiere);
        document.getElementById('selectMatiere').innerHTML += '<option value="' + elem.matiere + '">' + elem.matiere + '</option>';
      });
    }).catch(function (err) {
      console.log("Error : ", err);
    });
});

function setUserInterface(userCategory, soutien, instituteName) {
  // console.log("set user interface");
  var user = auth.currentUser;

  if (userCategory == "student") {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    if (user.uid == "ZC57kLf1XpUOXh9QJUNDKS2pMgg1") {
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    } else {
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    }
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleve-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    navMenu.innerHTML += '          <li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
    rightMenu.innerHTML = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
    // navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-map-signs"></i><span data-i18n="nav.dash.main">Orientation</span></a></li>';
  } else if (userCategory == "teacher") {
    if (soutien == undefined) {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      navMenu.innerHTML += '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Planning+</span></a></li>';
    }
    else {
      var nav1 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      var nav2bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';
      var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
      var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
      var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
      var nav6 = '</ul></li>';
      var nav7 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
      var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      var nav9 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
      var nav10 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
      var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';

      navMenu.innerHTML = nav1 + nav2 +nav2bis+ nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

    }
    rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
    rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
    rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

    setTeachersVirtualClasses(instituteName);
    /*  navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bulletins</span></a></li>'; */
  } else if (userCategory == "admin") {
    // if (instituteCategory == "college" || instituteCategory == "lycee") {
    var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Plannings</span></a></li>';
    var nav2 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Matières</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-classes.php?target=createSubject" class="dropdown-item"><span data-i18n="nav.dash.main">Créer une matière</span></a></li></ul></li>';
        var nav3 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li></ul></li>';
    var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav4bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

    var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li><li data-menu=""><a href="planning+.php" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
    var nav6 = '</ul></li>';
    var nav7 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
    var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
    var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

    navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 +nav4bis + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

    var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
    var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
    var right3 = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
    var right4 = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs - Soutien</a>';

    rightMenu.innerHTML = right1 + right2 + right3 + right4;
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
      console.log(Object.keys($this));
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

function initModifyStudentSelection(instituteName, attendees, matiere) {
  var user = auth.currentUser;
  document.getElementById('selectModifyStudent').innerHTML = '';

  firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', instituteName).where('soutien', '==', true).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docStudent) {
        document.getElementById('selectModifyStudent').innerHTML += '<option value="' + docStudent.id + '" >' + docStudent.data().firstName + ' ' + docStudent.data().lastName + '</option>';
      });

      $('select#selectModifyStudent').val(attendees);
      console.log($('select#selectModifyStudent').val());

      firestore.collection('users').doc(attendees).get()
        .then(function (docAttendee) {
          docAttendee.data().matieres.forEach(function (elem) {
            document.getElementById('selectModifyMatiere').innerHTML += '<option value="' + elem.matiere + '" >' + elem.matiere + '</option>';
          });
          $('select#selectModifyMatiere').val(matiere);
          initChapters();
        }).catch(function (err) {
          console.log("Error :", err);
        });

    }).catch(function (err) {
      console.log("Error: ", err);
    });


}

//This function is called to generate student list based on teacher-user when a class is selected AND the switch is toggled
function initStudentSelection(teacherId, classValue, instituteName) {
  /* selectStudent.innerHTML = "";
  selectedStudent.innerHTML =""; */
  console.log("iam generating");
  document.getElementById('selectStudent').selectize.clearOptions();
  document.getElementById('selectModifyStudent').selectize.clearOptions();
  var $select2 = $('select#selectModifyStudent').selectize();
  var control2 = $select2[0].selectize;
  // control2.clear();
  var $select = $('select#selectStudent').selectize();
  var control = $select[0].selectize;
  control.clear();
  // Case 1: No class is selected, we display all student of the teacher

  firestore.collection('users').where("instituteName", "==", instituteName).where("userCategory", "==", "student").where("soutien", "==", true).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {

        console.log(control);
        document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + " " + doc.data().lastName });
        document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + " " + doc.data().lastName });
        control.clear();
        // control2.clear();
        // selectStudentClick.innerHTML += "<option value='" + doc.data().id+ "'>" + doc.data().firstName + " " + doc.data().lastName + "</option>";

      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
  // Case 2: a specific class is selected, we display students of the class

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


$('#btnMessage').on('click', function () {
  $('#modalMessage').modal();

});

function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function initChapters() {
  var user = auth.currentUser;

  console.log("Entering init chapters");
  var totalTime = 0;
  var chapterCount = 0;
  var chapterDuration = 0;
  var currentChapter = 0;
  const yearStartDate = 1567411200; //02/09/2019 à 08:00
  const yearEndDate = 1594929600; //16/07/2020 à 20:00
  const yearDuration = 21427200; //8 months
  const nbOfWeeks = 32; // taken on the 2019-2020 school calendar

  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block '><div class='card-header border'><h4 class='card-title text-xs-center'>"

  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width=33%' style='text-align: center' class='danger time'><th width=33%' style='text-align: center'>";
  var sponshtml4 = "</th><th width=33%' style='text-align: center' class='danger time'>";

  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Cours, méthodes</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p><h6 class=' card-title text-bold-600'>Exercices</h4><p class='card-text text-xs-left'>";



  var sponshtml7 = "</p><p> </p><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'>";
  var sponshtml8 = "</span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress";
  var sponshtml9 = "'></progress></div></div><p> </p><div class='table-responsive' style='overflow-x:hidden;'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml10 = "' type='button'  id='";

  var sponshtml11 = "' onclick='modifyChapter(";
  var sponshtml12 = ");'>Modifier</button></div></th><th width='50%' style='text-align: center'";
  var sponshtml13 = "'><button class='btn bg-school-plus btn-min-width text-bold-600'type='button' id='";
  var sponshtml14 = "' onclick='toDoList(\"";
  var sponshtml15 = "\");'>Ajouter le suivi</button></th>";
  var sponshtml16 = "</tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";

  var numberOfChapter = 0;

  firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).get()
    .then(function (querySnapshot2) {
      chapterCount = querySnapshot2.size;
      querySnapshot2.forEach(function (doc2) {
        if (doc2.id == "duration") {
          chapterDuration = Math.trunc(doc2.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
          totalTime = doc2.data().timeDone;
        }
        else if (doc2.data().numeroChapitre != undefined) {
          if (doc2.id != 'duration') {
            html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
              + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + "doc2.id" + sponshtml10 + doc2.data().numeroChapitre + sponshtml11 + '"' + doc2.data().numeroChapitre + '"' + sponshtml12 + sponshtml13 + doc2.data().numeroChapitre + sponshtml14 + doc2.data().numeroChapitre + sponshtml15 + sponshtml16;

            addElement('basicContainer', 'div', html);
            numberOfChapter++;
          }

        }

        // update progress bar
        if (chapterDuration != 0) {
          /*  if (totalTime != 0 && totalTime != null) {
             currentChapter = Math.trunc(totalTime / chapterDuration) + 1;
             currentProgress = ((totalTime - (currentChapter - 1)*chapterDuration) / chapterDuration)*100;
             
             var progressBars = document.getElementsByTagName('progress');
             var completion = document.getElementsByClassName('completion');
             var closingButtons = document.getElementsByClassName('btn-closing');
             for (var i=0; i<progressBars.length; i++) {
               if (i < currentChapter - 1) {
                 progressBars[i].value = 100;
                 progressBars[i].className = "progress progress-md progress-success progress";
                 completion[i].innerHTML = "100%";
                 closingButtons[i].removeAttribute('disabled');
                 closingButtons[i].setAttribute('enabled', '');
               }
               else if (i == currentChapter - 1) {
                 progressBars[i].value = currentProgress;
                 completion[i].innerHTML = Math.trunc(currentProgress) + "%";
                 closingButtons[i].removeAttribute('disabled');
                 closingButtons[i].setAttribute('enabled', '');
               }
               else
               completion[i].innerHTML = "0%";
             }
           } */
        }
        // update remaining time
        if (chapterDuration != 0)
          chapterCount--;

        //var chapterNormalDuration = (yearEndDate - yearStartDate - 6696000) / (chapterCount); // get chapter normal duration in s
        var chapterNormalDuration = yearDuration / chapterCount;
        var timeElapsed = Date.now() / 1000 - yearStartDate;
        var classCurrentChapter = Math.trunc(timeElapsed / chapterNormalDuration);
        var durationRemaining = Math.trunc((chapterNormalDuration * (classCurrentChapter + 1) - timeElapsed) / (60 * 60 * 24));
        var deadlines = document.getElementsByClassName('time');
        /* for (var j=0; j<deadlines.length; j++) {
          if (j < classCurrentChapter) {
            deadlines[j].className = "success time";
            deadlines[j].innerHTML = "Terminé"
          }
          else if (j == classCurrentChapter) {
            if (durationRemaining > 1) 
            deadlines[j].innerHTML = durationRemaining + "j restants";
            else if (durationRemaining == 1)
            deadlines[j].innerHTML = durationRemaining + "j restant";
            else
            deadlines[j].innerHTML = "Aujourd'hui";
          }
          else {
            deadlines[j].innerHTML = "A venir";
            deadlines[j].className = "warning time";
          }
        } */
      });
      console.log(numberOfChapter);
      if (numberOfChapter > 0) {
        document.getElementById('chapterMessage').style.display = "none";


        // document.getElementById('modalModifyEvent').scrollTop = 1000;

      }
      else {
        document.getElementById('chapterMessage').style.display = "block";
      }
    }).catch(function (err) {
      console.log("Error :", err);
    });

}

$('#modalModifyChapter').on('hidden.bs.modal', function () {

  $('#modalModifyEvent').modal();
  /* console.log("hey");
  document.getElementById('modalModifyEvent').scrollTop = 1000;
  document.getElementById('modalModifyEvent').scrollTop = 1000;
  document.getElementById('modalModifyEvent').scrollTop = 1400; */

  setTimeout(function () { document.getElementById('modalModifyEvent').scrollTop = document.getElementById('modifyScrollPos').innerText; }, 500);
});

$('#modalToDoList').on('hidden.bs.modal', function () {

  $('#modalModifyEvent').modal();
  /* console.log("hey");
  document.getElementById('modalModifyEvent').scrollTop = 1000;
  document.getElementById('modalModifyEvent').scrollTop = 1000;
  document.getElementById('modalModifyEvent').scrollTop = 1400; */

  setTimeout(function () { document.getElementById('modalModifyEvent').scrollTop = document.getElementById('todoScrollPos').innerText; }, 500);
});

$("#modalToDoList").on("shown.bs.modal", function () {
  $("body").addClass("modal-open");
});

//GOOD
$('#formChapitre').submit(function (ev) {

  ev.preventDefault();

  var user = auth.currentUser;
  // console.log($('select#selectModifyStudent').val());
  if (modifyChapitreNumber.value != modifyTitle.innerText) {
    //D'abord vérifier que le nouveau numéro de chapitre n'est pas déjà utilisé

    firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyChapitreNumber.value).get()
      .then(function (doc) {
        if (doc.exists) {
          //If it already exists we display error message
          document.getElementById('error-message').style.display = "block";

        }
        else {
          //If it doesn't exist yet we get tobemodified chapter doc, get all the values and write data into new document with new chapitre number
          firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyTitle.innerText).get()
            .then(function (doc) {
              firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyChapitreNumber.value)
                .set({
                  numeroChapitre: modifyChapitreNumber.value,
                  nomChapitre: modifyChapitreName.value,
                  challenges: modifyChallenges.value,
                  competences: modifyExpectedSkills.value,
                  cours: doc.data().cours,
                  exercices: doc.data().exercices
                }).then(function () {
                  //Then we delete previous doc
                  firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyTitle.innerText).delete();
                  //We regenerate chapters
                  document.getElementById('basicContainer').innerHTML = "";
                  initChapters();
                  //We close the modal
                  $("#modalModifyChapter").modal("hide");
                }).catch(function (err) {
                  console.log("Error writing new doc :", err);
                })
            }).catch(function (err) {
              console.log("Error :", err);
            });
        }
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
  else {
    firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyChapitreNumber.value)
      .update({
        // numeroChapitre: modifyChapitreNumber.value,
        nomChapitre: modifyChapitreName.value,
        competences: modifyExpectedSkills.value,
        challenges: modifyChallenges.value
        // endDate: modifyEndDate.value,
        // cours: '',
        // exercices: ''
      }).then(function () {
        document.getElementById('basicContainer').innerHTML = "";
        initChapters();
        $("#modalModifyChapter").modal("hide");
      })
      .catch(function (err) {
        console.log("Error : ", err);
      });
  }


  console.log("Form validé");


  //TODO
});

//GOOD
$('#btnDeleteChapter').on('click', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(modifyChapitreNumber.value).delete();
  console.log("Chapter deleted");
  document.getElementById('basicContainer').innerHTML = "";
  initChapters();
  $("#modalModifyChapter").modal("hide");
});

//GOOD
$('#btnAddChapter').on('click', function () {
  var user = auth.currentUser;
  console.log("HEY LOOK HERE ", chapitreNumber.value);
  firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapitreNumber.value)
    .set({
      numeroChapitre: chapitreNumber.value,
      nomChapitre: chapitreName.value,
      competences: expectedSkills.value,
      challenges: challenges.value,
      // endDate: endDate.value,
      cours: '',
      exercices: '',
      authorChapitre: user.uid
    }).then(function () {
      clearAddChapter();
      document.getElementById('basicContainer').innerHTML = "";
      initChapters();
    }).catch(function (err) {
      console.log("Error : ", err);
    });

  //GOOD



});

$('#btnPDFCours').on('click', function () {

  if ($(window).width() < 1280) {
    if (sectionPDFCours2.style.display == "none") {
      sectionPDFCours2.style.display = "block";
    }
    else if (sectionPDFCours2.style.display == "block") {

      sectionPDFCours2.style.display = "none";
    }


  } else {
    if (sectionPDFCours.style.display == "none") {
      sectionPDFCours.style.display = "block";
    }
    else if (sectionPDFCours.style.display == "block") {

      sectionPDFCours.style.display = "none";
    }
  }




});

$('#btnPDFExercices').on('click', function () {

  if ($(window).width() < 1280) {
    if (sectionPDFExercices2.style.display == "none") {
      sectionPDFExercices2.style.display = "block";
    }
    else if (sectionPDFExercices2.style.display == "block") {

      sectionPDFExercices2.style.display = "none";
    }
  }
  else {
    if (sectionPDFExercices.style.display == "none") {
      sectionPDFExercices.style.display = "block";
    }
    else if (sectionPDFExercices.style.display == "block") {

      sectionPDFExercices.style.display = "none";
    }
  }


});

$('#btnDeleteCours').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer la fiche de cours ?",

    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = $('select#selectModifyMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);

      var newNumeroChapitre = chapNumber.innerText;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }

      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);

      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var fileUrl = 'fiches_cours/' + doc.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'block';
            swal({
              title: "La fiche de cours a bien été supprimée.",
              type: "success",
              html: true
            });

          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });



    } else {
      swal("Annulation", "La fiche de cours n'a pas été supprimée.", "error");
    }
  });

});

$('#btnDeleteExo').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer la fiche d'exercices ?",

    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = $('select#selectModifyMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);

      var newNumeroChapitre = chapNumber.innerText;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }

      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);

      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var fileUrl = 'fiches_exos/' + doc.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFExercices').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosError').style.display = 'block';
            swal({
              title: "La fiche d'exercices a bien été supprimée.",
              type: "success",
              html: true
            });

          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });



    } else {
      swal("Annulation", "La fiche d'exercice n'a pas été supprimée.", "error");
    }
  });

});

$('#formToDoList').submit(function (ev) {

  ev.preventDefault();

  var user = auth.currentUser;
  var valCours = [];
  var valExos = [];
  var suiviCoursArray = [];
  var suiviExosArray = [];
  var tempCoursArray = [];
  var tempExosArray = [];
  var hasSubject = false;
  //We store value of inputs into valCours[]
  $('input[name="coursToDoList"]').each(function (i) {
    if ($(this).val() != '') {
      valCours[i] = $(this).val();
    }
    // console.log("VAL :" +$(this).val());
  });
  $('input[name="exercicesToDoList"]').each(function (i) {
    if ($(this).val() != '') {
      valExos[i] = $(this).val();
    }
    // console.log("VAL :" +$(this).val());
  });
  console.log("Look down for valCours");
  console.log(valCours);
  console.log("Look down for valExos");
  console.log(valExos);


  //We query userdoc to get idAdmin
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      //We query considered chapter document
      firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapNumber.innerText).get()
        .then(function (docAdmin) {

          //COURS SECTION
          if (typeof docAdmin.data().cours == "string" || typeof docAdmin.data().cours == "object" && typeof docAdmin.data().cours[0] == "string" || typeof docAdmin.data().cours == "object" && docAdmin.data().cours.length < 1) {
            console.log("Cours is a string or object followed by a string or empty object, we can initialise");
            //We query selected student and check if he has the considered subject
            firestore.collection('users').doc($('select#selectModifyStudent').val()).get()
              .then(function (doc) {

                //Now we prepare the suiviArray with name and ids of students + avancement set on sad
                //For each student we have to check if they have the selected matiere.
                doc.data().matieres.forEach(function (elem) {
                  if (elem.matiere == $('select#selectModifyMatiere').val()) {
                    hasSubject = true;
                  }
                });
                if (hasSubject) {
                  suiviCoursArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "sad" })
                  hasSubject = false;
                }

                console.log("Look down");
                console.log(suiviCoursArray);
                //We fill tempCoursarray with inputs values + suiviCoursArray
                valCours.forEach(function (elem) {
                  tempCoursArray.push({ element: elem, suivi: suiviCoursArray });
                });
                console.log("Look Down");
                console.log(tempCoursArray);
                //We can push into db
                firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapNumber.innerText)
                  .set({
                    cours: tempCoursArray
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("Array written into DB");
                    }).catch(function (err) {
                      console.log("Error : ", err);
                    });
              }).catch(function (err) {
                console.log("Error: ", err);
              });
          } else if (typeof docAdmin.data().cours == "object" && docAdmin.data().cours.length > 0) {
            console.log("object with map, we check for replacement");
            var previousCoursLabels = [];
            var coursToBePushed = [];
            docAdmin.data().cours.forEach(function (elem) {
              previousCoursLabels.push(elem.element);
              coursToBePushed.push(elem);
            });
            console.log("Look down for peviousCoursLabels array");
            console.log(previousCoursLabels);
            console.log("Look down for coursToBePushed array :");
            console.log(coursToBePushed);
            docAdmin.data().cours[0].suivi.forEach(function (elem) {
              suiviCoursArray.push({ avancement: "sad", studentId: elem.studentId, studentName: elem.studentName });
            });
            console.log("Look down for suiviCoursArray");
            console.log(suiviCoursArray);
            // Case 1 : check if a value has been added --> initialise new array index
            if (valCours.length > previousCoursLabels.length) {
              console.log("Entering case 1");
              valCours.forEach(function (elem) {
                if (!previousCoursLabels.includes(elem)) {
                  coursToBePushed.push({ element: elem, suivi: suiviCoursArray });
                }
              });
            }
            //Case 2 : check if a value has been removed
            if (valCours.length < previousCoursLabels.length) {
              console.log("Entering case 2");
              coursToBePushed.forEach(function (elem) {
                if (!valCours.includes(elem.element)) {
                  coursToBePushed = coursToBePushed.filter(function (value) {
                    return value !== elem;
                  });
                }
              });
            }
            //Case 3 : we check if values have been replaced
            if (valCours.length == previousCoursLabels.length) {
              console.log("Entering case 3");
              valCours.forEach(function (elem) {
                if (!previousCoursLabels.includes(elem)) {
                  coursToBePushed.push({ element: elem, suivi: suiviCoursArray });
                }
              });
              coursToBePushed.forEach(function (elem) {
                if (!valCours.includes(elem.element)) {
                  coursToBePushed = coursToBePushed.filter(function (value) {
                    return value !== elem;
                  });
                }
              });
            }
            console.log("Look down for updated coursToBePushed");
            console.log(coursToBePushed);

            //Good to push
            firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapNumber.innerText)
              .set({
                cours: coursToBePushed
              },
                {
                  merge: true
                }).then(function () {
                  console.log("Array written into DB");
                }).catch(function (err) {
                  console.log("Error : ", err);
                });


          }
          //FIN SECTION COURS

          //SECTION EXOS
          if (typeof docAdmin.data().exercices == "string" || typeof docAdmin.data().exercices == "object" && typeof docAdmin.data().exercices[0] == "string" || typeof docAdmin.data().exercices == "object" && docAdmin.data().exercices.length < 1) {
            console.log("Cours is a string or object followed by a string or empty object, we can initialise");
            //We query selected student and check if he has the considered subject
            firestore.collection('users').doc($('select#selectModifyStudent').val()).get()
              .then(function (doc) {

                //Now we prepare the suiviExosArray with name and ids of students + avancement set on sad
                //For each student we have to check if they have the selected matiere.
                doc.data().matieres.forEach(function (elem) {
                  if (elem.matiere == $('select#selectModifyMatiere').val()) {
                    hasSubject = true;
                  }
                });
                if (hasSubject) {
                  suiviExosArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "sad" })
                  hasSubject = false;
                }

                console.log("Look down");
                console.log(suiviExosArray);
                //We fill tempCoursarray with inputs values + suiviExosArray
                valExos.forEach(function (elem) {
                  tempExosArray.push({ element: elem, suivi: suiviExosArray });
                });
                console.log("Look Down");
                console.log(tempExosArray);
                //We can push into db
                firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapNumber.innerText)
                  .set({
                    exercices: tempExosArray
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("Array written into DB");
                    }).catch(function (err) {
                      console.log("Error : ", err);
                    });
              }).catch(function (err) {
                console.log("Error: ", err);
              });
          } else if (typeof docAdmin.data().exercices == "object" && docAdmin.data().exercices.length > 0) {
            console.log("object with map, we check for replacement");
            var previousExosLabels = [];
            var exosToBePushed = [];
            docAdmin.data().exercices.forEach(function (elem) {
              previousExosLabels.push(elem.element);
              exosToBePushed.push(elem);
            });
            console.log("Look down for peviousExosLabels array");
            console.log(previousExosLabels);
            console.log("Look down for exosToBePushed array :");
            console.log(exosToBePushed);
            docAdmin.data().exercices[0].suivi.forEach(function (elem) {
              suiviExosArray.push({ avancement: "sad", studentId: elem.studentId, studentName: elem.studentName });
            });
            console.log("Look down for suiviExosArray");
            console.log(suiviExosArray);
            // Case 1 : check if a value has been added --> initialise new array index
            if (valExos.length > previousExosLabels.length) {
              console.log("Entering case 1");
              valExos.forEach(function (elem) {
                if (!previousExosLabels.includes(elem)) {
                  exosToBePushed.push({ element: elem, suivi: suiviExosArray });
                }
              });
            }
            //Case 2 : check if a value has been removed
            if (valExos.length < previousExosLabels.length) {
              console.log("Entering case 2");
              exosToBePushed.forEach(function (elem) {
                if (!valExos.includes(elem.element)) {
                  exosToBePushed = exosToBePushed.filter(function (value) {
                    return value !== elem;
                  });
                }
              });
            }
            //Case 3 : we check if values have been replaced
            if (valExos.length == previousExosLabels.length) {
              console.log("Entering case 3");
              valExos.forEach(function (elem) {
                if (!previousExosLabels.includes(elem)) {
                  exosToBePushed.push({ element: elem, suivi: suiviExosArray });
                }
              });
              exosToBePushed.forEach(function (elem) {
                if (!valExos.includes(elem.element)) {
                  exosToBePushed = exosToBePushed.filter(function (value) {
                    return value !== elem;
                  });
                }
              });
            }
            console.log("Look down for updated exosToBePushed");
            console.log(exosToBePushed);

            //Good to push
            firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(chapNumber.innerText)
              .set({
                exercices: exosToBePushed
              },
                {
                  merge: true
                }).then(function () {
                  console.log("Array written into DB");
                }).catch(function (err) {
                  console.log("Error : ", err);
                });


          }

          //FIN SECTION EXOS



        }).catch(function (err) {
          console.log("Error : ", err);
        });




    }).catch(function (err) {
      console.log("Error: ", err);
    });



  console.log("Form validé");
  $("#modalToDoList").modal("hide");

  //TODO
});

$('#upload-cours').change(function () {
  var user = auth.currentUser;
  var errorMessage = document.getElementById('error-message');
  var thePDF = document.getElementById('upload-cours').files[0];
  var storageRef = firebase.storage().ref();
  var uploadCoursButton = document.getElementById('upload-cours');
  var queryUser = firestore.collection('users').doc(user.uid);
  //var uploadTask = storageRef.child('fiches_cours/')
  console.log("Entering upload function");
  errorMessage.style.display = "none";



  var nomMatiere = $('select#selectModifyMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = chapNumber.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {

    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  if (thePDF.type == 'application/pdf') {

    //METTRE UNE LIMITE SUR LA TAILLE DE FICHIER? 

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().userCategory == 'teacher') {
          var uploadTask = storageRef.child("fiches_cours/" + docUser.data().idAdmin + "_" + $('select#selectModifyStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
          console.log("URL : " + uploadTask);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            uploadCoursButton.setAttribute('disabled', '');
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'none';
            document.getElementById('coursLoading').style.display = 'inline';
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //console.log('File available at', downloadURL);
                pdfCours.data = downloadURL;
                $('#upload-cours').val('');
                document.getElementById('coursLoading').style.display = 'none';
                document.getElementById('coursError').style.display = 'none';
                document.getElementById('btnPDFCours').style.display = 'block';
                document.getElementById('btnDeleteCours').style.display = 'block';


              });
              uploadCoursButton.removeAttribute('disabled');
              uploadCoursButton.setAttribute('enabled', '');
            });
        }
        else {
          var uploadTask = storageRef.child("fiches_cours/" + user.uid + "_" + $('select#selectModifyStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
          console.log("URL : " + uploadTask);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            uploadCoursButton.setAttribute('disabled', '');
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'none';
            document.getElementById('coursLoading').style.display = 'inline';
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //console.log('File available at', downloadURL);
                pdfCours.data = downloadURL;
                $('#upload-cours').val('');
                document.getElementById('coursLoading').style.display = 'none';
                document.getElementById('coursError').style.display = 'none';
                document.getElementById('btnPDFCours').style.display = 'block';
                document.getElementById('btnDeleteCours').style.display = 'block';


              });
              uploadCoursButton.removeAttribute('disabled');
              uploadCoursButton.setAttribute('enabled', '');
            });
        }


      }).catch(function (err) {
        console.log("Error: ", err);
      });







  }






});

$('#upload-exos').change(function () {
  var user = auth.currentUser;
  var errorMessage2 = document.getElementById('error-message2');
  var thePDF = document.getElementById('upload-exos').files[0];
  var storageRef = firebase.storage().ref();
  var uploadExosButton = document.getElementById('upload-exos');
  var queryUser = firestore.collection('users').doc(user.uid);
  //var uploadTask = storageRef.child('fiches_cours/')
  console.log("Entering upload function");
  errorMessage2.style.display = "none";



  var nomMatiere = $('select#selectModifyMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = chapNumber.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {

    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  if (thePDF.type == 'application/pdf') {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().userCategory == 'teacher') {
          var uploadTask = storageRef.child("fiches_exos/" + docUser.data().idAdmin + "_" + $('select#selectModifyStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
          console.log("URL : " + uploadTask);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            uploadExosButton.setAttribute('disabled', '');
            document.getElementById('exosError').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosLoading').style.display = 'block';

          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //console.log('File available at', downloadURL);
                pdfExos.data = downloadURL;
                $('#upload-exos').val('');
                document.getElementById('exosLoading').style.display = 'none';
                document.getElementById('exosError').style.display = 'none';
                document.getElementById('btnPDFExercices').style.display = 'block';
                document.getElementById('btnDeleteExo').style.display = 'block';

              });
              uploadExosButton.removeAttribute('disabled');
              uploadExosButton.setAttribute('enabled', '');
            });
        }
        else {
          var uploadTask = storageRef.child("fiches_exos/" + user.uid + "_" + $('select#selectModifyStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
          console.log("URL : " + uploadTask);

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            uploadExosButton.setAttribute('disabled', '');
            document.getElementById('exosError').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosLoading').style.display = 'block';

          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          },
            function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //console.log('File available at', downloadURL);
                pdfExos.data = downloadURL;
                $('#upload-exos').val('');
                document.getElementById('exosLoading').style.display = 'none';
                document.getElementById('exosError').style.display = 'none';
                document.getElementById('btnPDFExercices').style.display = 'block';
                document.getElementById('btnDeleteExo').style.display = 'block';

              });
              uploadExosButton.removeAttribute('disabled');
              uploadExosButton.setAttribute('enabled', '');
            });
        }

      }).catch(function (err) {
        console.log("Error :", err);
      });

    //METTRE UNE LIMITE SUR LA TAILLE DE FICHIER? 



  }






});

$('#upload-correction').change(function () {

  var user = auth.currentUser;
  var theFile = document.getElementById('upload-correction').files[0];
  var storageRef = firebase.storage().ref();

  var nomMatiere = $('select#selectModifyMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterNumber').innerText;
  // alert(newNumeroChapitre);
  if (newNumeroChapitre.indexOf(' ') >= 0) {

    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  // alert('HEY :', newNumeroChapitre);

  if (theFile.type == 'application/pdf') {
    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().userCategory == 'teacher') {
          var uploadTask = storageRef.child('exos_corriges/' + docUser.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            document.getElementById('upload-correction').setAttribute('disabled', '');
            document.getElementById('loadingImgCorrection').style.display = 'inline';
            document.getElementById('correctionPresent').style.display = 'none';
            document.getElementById('correctionNoPresent').style.display = 'none';
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
              document.getElementById('loadingImgCorrection').style.display = 'none';
              document.getElementById('correctionLink').href = url;
              document.getElementById('correctionNoPresent').style.display = 'none';
              document.getElementById('correctionPresent').style.display = 'block';




            });
            //Attributes
            document.getElementById('upload-correction').removeAttribute('disabled');
            document.getElementById('upload-correction').setAttribute('enabled', '');
            document.getElementById('upload-correction').value = '';
          });
        }
        else {
          var uploadTask = storageRef.child('exos_corriges/' + user.uid + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            document.getElementById('upload-correction').setAttribute('disabled', '');
            document.getElementById('loadingImgCorrection').style.display = 'inline';
            document.getElementById('correctionPresent').style.display = 'none';
            document.getElementById('correctionNoPresent').style.display = 'none';
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
              document.getElementById('loadingImgCorrection').style.display = 'none';
              document.getElementById('correctionLink').href = url;
              document.getElementById('correctionNoPresent').style.display = 'none';
              document.getElementById('correctionPresent').style.display = 'block';




            });
            //Attributes
            document.getElementById('upload-correction').removeAttribute('disabled');
            document.getElementById('upload-correction').setAttribute('enabled', '');
            document.getElementById('upload-correction').value = '';
          });
        }




      }).catch(function (err) {
        console.log("Error :", err);
      });


  }




});

function clearAddChapter() {
  chapitreNumber.value = "";
  chapitreName.value = "";
  expectedSkills.value = "";
  challenges.value = "";
  // endDate.value = "";
}

//GOOD
function modifyChapter(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");

  // console.log($('#modalModifyEvent').getOwnPropertyNames());

  console.log($('#modalModifyEvent').scrollTop());
  document.getElementById('modifyScrollPos').innerText = $('#modalModifyEvent').scrollTop();
  console.log(document.getElementById('modifyScrollPos').innerText);
  /*   document.getElementById('modalModifyEvent').style.marginLeft = "-50%";
    document.getElementById('modalModifyChapter').style.marginLeft = "50%"; */

  $('#modalModifyEvent').modal('hide');

  $("#modalModifyChapter").modal();



  firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(numeroChapitre).get()
    .then(function (doc) {
      modifyTitle.innerText = doc.data().numeroChapitre;
      modifyChapitreNumber.value = doc.data().numeroChapitre;
      modifyChapitreName.value = doc.data().nomChapitre;
      modifyExpectedSkills.value = doc.data().competences;
      modifyChallenges.value = doc.data().challenges;
      // modifyEndDate.value = doc.data().endDate;
    }).catch(function (err) {
      console.log("Error : ", err);
    });

}

function toDoList(numeroChapitre) {
  var user = auth.currentUser;
  // console.log(numeroChapitre);
  // console.log("Modal open");
  document.getElementById('coursContainer').innerHTML = "";
  document.getElementById('exosContainer').innerHTML = "";
  document.getElementById('evalPresent').style.display = 'none';
  document.getElementById('evalNoPresent').style.display = 'none';
  document.getElementById('btnDeleteCours').style.display = 'none';
  document.getElementById('btnDeleteExo').style.display = 'none';
  // document.getElementById('sectionPDFCours').style.display = 'none';
  // document.getElementById('sectionPDFExercices').style.display ='none';

  document.getElementById('todoScrollPos').innerText = $('#modalModifyEvent').scrollTop();
  console.log(document.getElementById('todoScrollPos').innerText);
  $('#modalModifyEvent').modal('hide');

  $("#modalToDoList").modal();
  var pdfCoursUrl = '';
  var pdfExercicesUrl = '';

  var pdfCours = document.getElementById('pdfCours');
  pdfCours.data = '';
  var pdfExos = document.getElementById('pdfExos');
  pdfExos.data = '';
  // pdfExos.data = '';


  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      firestore.collection('users').doc($('select#selectModifyStudent').val()).collection($('select#selectModifyMatiere').val()).doc(numeroChapitre).get()
        .then(function (doc2) {
          // modifyChapitreNumber2.value= doc2.data().numeroChapitre;
          // modifyChapitreName2.value= doc2.data().nomChapitre;
          // modifyExpectedSkills2.value = doc2.data().competences;
          // modifyChallenges2.value= doc2.data().challenges ;
          // modifyEndDate2.value = doc2.data().endDate;
          // exercicesToDoList.value = doc2.data().exercices,
          // coursToDoList.value = doc2.data().cours,  //TO CHANGE HERE
          chapNumber.innerText = doc2.data().numeroChapitre;
          // document.getElementById('login').innerText = '';
          // document.getElementById('mdp').innerText = '';
          // console.log(typeof doc2.data().cours);


          var coursStudentNames = [];
          var coursStudentSmileys = [];
          //SECTION COURS
          if (typeof doc2.data().cours == "object" && doc2.data().cours.length > 0) {
            console.log("The type of 'cours' is object, we good");
            if (typeof doc2.data().cours[0] == "object") {

              doc2.data().cours.forEach(function (elem) {

                elem.suivi.forEach(function (elem2) {
                  coursStudentNames.push(elem2.studentName);
                  coursStudentSmileys.push(elem2.avancement);
                });

                console.log("Cours Student Names Array ==> " + coursStudentNames);
                console.log("Cours Student Smileys Array ==> " + coursStudentSmileys);
                addDivCours(elem.element, coursStudentNames, coursStudentSmileys);
                coursStudentNames = [];
                coursStudentSmileys = [];
              });
            } else if (typeof doc2.data().cours[0] == "string") {
              doc2.data().cours.forEach(function (elem) {
                addDivCours(elem, coursStudentNames, coursStudentSmileys);
              });

            }

          } else if (typeof doc2.data().cours == "string" && doc2.data().cours != '') {
            console.log("This is an old version. 'cours' is a string");
            addDivCours(doc2.data().cours, coursStudentNames, coursStudentSmileys);
          } else {
            console.log("Nothing in DB, we present a cleared input");
            addDivCours('', coursStudentNames, coursStudentSmileys);
          }

          var exoStudentNames = [];
          var exoStudentSmileys = [];

          // SECTION EXOS
          if (typeof doc2.data().exercices == "object" && doc2.data().exercices.length > 0) {
            console.log("The type of 'exercices' is object, we good");
            if (typeof doc2.data().exercices[0] == "object") {

              doc2.data().exercices.forEach(function (elem) {
                elem.suivi.forEach(function (elem2) {
                  exoStudentNames.push(elem2.studentName);
                  exoStudentSmileys.push(elem2.avancement);
                });

                console.log("exo Student Names Array ==> " + exoStudentNames);
                console.log("exo Student Smileys Array ==> " + exoStudentSmileys);
                addDivExos(elem.element, exoStudentNames, exoStudentSmileys);
                exoStudentNames = [];
                exoStudentSmileys = [];
              });
            } else if (typeof doc2.data().exercices[0] == "string") {
              doc2.data().exercices.forEach(function (elem) {
                addDivExos(elem, exoStudentNames, exoStudentSmileys);
              });

            }

          } else if (typeof doc2.data().exercices == "string" && doc2.data().exercices != '') {
            console.log("This is an old version. 'exercices' is a string");
            addDivExos(doc2.data().exercices, exoStudentNames, exoStudentSmileys);
          } else {
            console.log("Nothing in DB, we present a cleared input");
            addDivExos('', exoStudentNames, exoStudentSmileys);
          }



          var nomMatiere = $('select#selectModifyMatiere').val();
          if (nomMatiere.indexOf(' ') >= 0) {
            console.log("true");
            nomMatiere = nomMatiere.replace(/\s+/g, '-');
          }

          nomMatiere = nomMatiere.replace('é', 'e');
          nomMatiere = nomMatiere.replace('è', 'e');
          // console.log("ICI :"+ nomMatiere);


          var newNumeroChapitre = numeroChapitre;
          if (newNumeroChapitre.indexOf(' ') >= 0) {
            console.log("true");
            newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
          }
          // alert(newNumeroChapitre);



          pdfCoursUrl = 'fiches_cours/' + docUser.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          pdfExercicesUrl = 'fiches_exos/' + docUser.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";

          // console.log("URL Cours :" + pdfCoursUrl);
          // console.log("URL Exos :"+ pdfExercicesUrl);
          //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
          console.log("About to download all urls");
          firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
            console.log("CoursUrl --> " + coursUrl);
            btnOpenPDFCours.setAttribute("href", coursUrl);
            pdfCours.data = coursUrl;
            coursError.style.display = "none";
            btnPDFCours.style.display = "block";
            document.getElementById('btnDeleteCours').style.display = 'block';

          }).catch((err) => {
            console.log("Error :" + err);
            coursError.style.display = "block";
            btnPDFCours.style.display = "none";
          });
          // var pdfExercicesUrl = 'fiches_exos/NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
          firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
            console.log("ExosUrl -- > " + exosUrl);
            btnOpenPDFExercices.setAttribute("href", exosUrl);
            pdfExos.data = exosUrl;
            exosError.style.display = "none";
            btnPDFExercices.style.display = "block";
            document.getElementById('btnDeleteExo').style.display = 'block';

          }).catch((err) => {
            console.log("Error :" + err);
            exosError.style.display = "block";
            btnPDFExercices.style.display = "none";
          });

          var sujetEvalUrl = 'sujets_evaluations/' + docUser.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
          firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
            console.log("EVAL LNK " + url);
            document.getElementById('evalLink').href = url;
            document.getElementById('evalPresent').style.display = 'block';
            document.getElementById('evalNoPresent').style.display = 'none';

          }).catch(function (err) {
            console.log("Error :", err);
            document.getElementById('evalPresent').style.display = 'none';
            document.getElementById('evalNoPresent').style.display = 'block';
          });

          var correctionExosUrl = 'exos_corriges/' + docUser.data().idAdmin + '_' + $('select#selectModifyStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
          firebase.storage().ref(correctionExosUrl).getDownloadURL().then(function (url) {
            console.log("corrigé LNK " + url);
            document.getElementById('correctionLink').href = url;
            document.getElementById('correctionPresent').style.display = 'block';
            document.getElementById('correctionNoPresent').style.display = 'none';

          }).catch(function (err) {
            console.log("Error :", err);
            document.getElementById('correctionPresent').style.display = 'none';
            document.getElementById('correctionNoPresent').style.display = 'block';
          });

        }).catch(function (err) {
          console.log("Error :", err);
        });
    }).catch(function (err) {
      console.log("err: ", err);
    });





}
function addDivCours(text, namesArray, smileysArray) {
  // console.log("LOOOK HERE"+$('#coursContainer > fieldset').length);

  if (text == "" || text == undefined) {
    // console.log("case elpty");
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><input type="text" name="coursToDoList" value=""class="form-control input-lg" placeholder="Cours à lire et à synthétiser" tabindex="4"><div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
  }
  else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><input type="text" name="coursToDoList" value="' + text + '" class="form-control input-lg" placeholder="Cours à lire et à synthétiser" tabindex="4"><div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
  }
  if ($('#coursContainer > fieldset').length == 0) {
    var html2 = '<div style="float: right;">';
  }
  else {
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" name="btnDelete" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button>';

  }

  var html3 = ' <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addDivCours(\'\',[],[])" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div><p class="card-title">Exemple: 1-5, 8, 11-13</p>';

  if (namesArray.length == 0 && smileysArray.length == 0) {
    var html4 = '</fieldset>';

    var totalHTML = html1 + html2 + html3 + html4;
  } else {

    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';

    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p style="margin-bottom: 0;">' + lastName + '</p></div>';
    }

    var html5 = '</div></fieldset>';
    var totalHTML = html1 + html2 + html3 + html4 + html5;

  }
  addElement('coursContainer', 'fieldset', totalHTML);
}

function addDivExos(text, namesArray, smileysArray) {
  if (text == "" || text == undefined) {
    var html1 = '  <fieldset class="form-group position-relative has-icon-left"><input type="text" name="exercicesToDoList" value="" class="form-control input-lg" placeholder="Exercices" tabindex="4"><div class="form-control-position"><i class="fas fa-trophy"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
  }
  else {
    var html1 = '  <fieldset class="form-group position-relative has-icon-left"><input type="text" name="exercicesToDoList" value="' + text + '" class="form-control input-lg" placeholder="Exercices" tabindex="4"><div class="form-control-position"><i class="fas fa-trophy"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
  }

  if ($('#exosContainer > fieldset').length == 0) {
    var html2 = '<div style="float: right;">';

  }
  else {
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button>';

  }

  var html3 = ' <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addDivExos(\'\',[], [])" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div><p class="card-title">Exemple: 1-5 p25, 8 p28, 11-13 p35</p>';

  if (namesArray.length == 0 && smileysArray.length == 0) {
    var html4 = '</fieldset>';

    var totalHTML = html1 + html2 + html3 + html4;
  } else {

    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';

    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p>' + lastName + '<p></div>';
    }

    var html5 = '</div></fieldset>';
    var totalHTML = html1 + html2 + html3 + html4 + html5;

  }
  addElement('exosContainer', 'fieldset', totalHTML);
}

function deleteDiv(button) {
  var parent = button.parentNode;
  var grand_father = parent.parentNode;
  var great_grand_father = grand_father.parentNode;
  great_grand_father.removeChild(grand_father);
}

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

function createRecurringEventsSoutien(userID, instituteName, userCategory, description, color, startEventArray, endEventArray, matiere, attendeesID, teacherID, attendeesName, index, groupID, startRecur, endRecur, calendar) {

  // console.log("CALENDAR: ", calendar);
  console.log("STARTEVENTARRAY LENGTH: ", startEvent.length);
  console.log("INDEX: ", index);
  var user = auth.currentUser;
  if (index < startEventArray.length) {
    // console.log("LOOK HERE: ", startEventArray[index]);
    // console.log("LOOK", index);
    var query = firestore.collection('activities').doc(userID + "_" + startEventArray[index] + "_" + attendeesID + "_" + matiere);
    query.set({
      idUser: userID,
      eventColor: color,
      startDate: startEventArray[index],
      endDate: endEventArray[index],
      id: userID + "_" + startEventArray[index] + "_" + attendeesID + "_" + matiere,
      title: matiere,
      editable: true,
      description: description,
      activityDone: false,
      attendees: attendeesID,
      attendeesName: attendeesName,
      teacherID: teacherID,
      groupID: groupID,
      startRecur: startRecur,
      endRecur: endRecur,
      soutien: true

    }).then(function () {
      console.log("Admin's activity created.");
      displayEvent(attendeesName + " - " + matiere, startEventArray[index], endEventArray[index], userID + "_" + startEventArray[index] + "_" + attendeesID + "_" + matiere, color, true, calendar);
      /*   calendar.addEvent({
          title: attendeesName+" - "+matiere,
          start: startEventArray[index],
          end: endEventArray[index],
          id: userID + "_" + startEventArray[index] + "_" + attendeesID + "_" + matiere,
          color: color,
          editable: true
        }); */
      //Write data for each student of a class OR for a specific student
      if (userCategory == "teacher") {
      } else if (userCategory == "admin") {

        console.log("Document added for teacher");
        //A specific student is selected --> we create his activity
        firestore.collection('activities').doc(attendeesID + "_" + startEventArray[index] + "_" + user.uid + "_" + matiere)
          .set({
            idUser: attendeesID,
            eventColor: color,
            startDate: startEventArray[index],
            endDate: endEventArray[index],
            id: attendeesID + "_" + startEventArray[index] + "_" + user.uid + "_" + matiere,
            title: matiere,
            editable: false, //Student should not edit event programmed by teacher
            description: description,
            activityDone: false,
            teacherID: teacherID,
            groupID: groupID,
            startRecur: startRecur,
            endRecur: endRecur,
            soutien: true

          }).then(function () {
            console.log("Activity successfully written for student :" + selectedStudent.value + "_");

            //END 
            index++;
            createRecurringEventsSoutien(userID, instituteName, userCategory, description, color, startEventArray, endEventArray, matiere, attendeesID, teacherID, attendeesName, index, groupID, startRecur, endRecur, calendar);
          }).catch(function (err) {
            console.log("Error :", err);
          });


      }
    }).catch(function (err) {
      console.log("Error while writing data into DB :", err);
    });
  } else if (index >= startEventArray.length) {
    // document.getElementById('calendar').innerHTML = '';
    document.getElementById('loadingGIF').style.display = 'none';
    document.getElementById('modifyLoadingGIF').style.display = 'none';
    document.getElementById('modifyModalBody').style.display = 'block';

    document.getElementById('addModalBody').style.display = 'block';
    $("#modalAddEvent").modal("hide"); //Hide modal
    $('#modalModifyEvent').modal('hide');
    console.log("re-initializing calendar");
    return;
    // initCalendar(userCategory, instituteName);
  }
}

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

function initModifyTeacherSelection(instituteName, teacherID) {
  firestore.collection('users').where('instituteName', '==', instituteName).where('userCategory', '==', 'teacher').where('soutien', '==', true).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docTeacher) {
        if (docTeacher.id != 'cVdmeheFOMS7hUbFL5k3bTTvVWD3') {
          document.getElementById('selectModifyTeacher').innerHTML += '<option value="' + docTeacher.id + '" >' + docTeacher.data().firstName + ' ' + docTeacher.data().lastName + '</option>';
        }
      });
      $('select#selectModifyTeacher').val(teacherID);
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function getTeacherName(id) {
  firestore.collection('users').doc(id).get()
    .then(function (docTeacher) {
      // console.log(docTeacher.data().firstName + ' ' +docTeacher.data().lastName);
      var Name = docTeacher.data().firstName + ' ' + docTeacher.data().lastName;
      return Name;
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}


//////////* -- CALENDAR -- *//////////

function initCalendar(userCategory, idAdmin, matieres, instituteName, teacherNameArray, teacherIdArray) {
  var user = auth.currentUser;
  console.log(teacherNameArray);
  var calendarEl = document.getElementById('calendar'); // Refer to calendar html element
  var events_array = [];

  if (userCategory == 'teacher') {
    var docRef = firestore.collection('activities').where("idUser", "==", idAdmin).where("soutien", "==", true);
  }
  else {
    var docRef = firestore.collection('activities').where("idUser", "==", user.uid).where("soutien", "==", true);
  }


  docRef.get().then(function (querySnapshot) {

    if (userCategory == 'teacher') {
      querySnapshot.forEach(function (doc) {

        var colorOfEvent = '';
        //Change color for college students
        if (doc.data().attendees.includes('xbGv5DaqQOZ5k0fnmqnjAh5PP493')) {
          //Diego
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('b1wruUPst5RpH9Mo41p23RJjkWD3')) {
          //Alexis
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('M6DUKhAYvdXy3wXgBZoa94raWMf1')) {
          //Mariana
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('ItIfziT0xuRyzRJYH1khsLRBISR2')) {
          //Sélim
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('w3urVbM08QMLFGo1YbsBqr5qnPo2')) {
          //Léon
          colorOfEvent = '#5FCBDA';
        } else {
          //Couleur de base
          colorOfEvent = doc.data().eventColor;
        }

        // console.log(doc.id, "=>", doc.data().startDate);
        if (doc.data().extrascolaire != true) {

          if (doc.data().instituteName == undefined) {
            if (matieres.includes(doc.data().title)) {
              events_array.push({
                title: doc.data().attendeesName + " - " + doc.data().title,              //Populate events_array with data
                start: doc.data().startDate,
                end: doc.data().endDate,
                id: doc.data().id,
                tip: 'tip',
                color: colorOfEvent,
                editable: doc.data().editable
              });
            }
          }



        }
      });
    }
    else if (userCategory == 'admin') {
      querySnapshot.forEach(function (doc) {
        // console.log(doc.id, "=>", doc.data().startDate);
        var colorOfEvent = '';
        //Change color for college students
        if (doc.data().attendees.includes('xbGv5DaqQOZ5k0fnmqnjAh5PP493')) {
          //Diego
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('b1wruUPst5RpH9Mo41p23RJjkWD3')) {
          //Alexis
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('M6DUKhAYvdXy3wXgBZoa94raWMf1')) {
          //Mariana
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('ItIfziT0xuRyzRJYH1khsLRBISR2')) {
          //Sélim
          colorOfEvent = '#5FCBDA';
        } else if (doc.data().attendees.includes('w3urVbM08QMLFGo1YbsBqr5qnPo2')) {
          //Léon
          colorOfEvent = '#5FCBDA';
        } else {
          //Couleur de base
          colorOfEvent = doc.data().eventColor;
        }
        if (doc.data().extrascolaire != true) {

          /* firestore.collection('users').doc(doc.data().teacherID).get()
          .then(function(docTeacher) { */

          // console.log(doc.data().teacherID);

          /* teacherArray.forEach(function(elem){
            console.log(elem);
          }); */

          // console.log(doc.data().teacherID);

          if (doc.data().instituteName == undefined) {
            var indice = teacherIdArray.indexOf(doc.data().teacherID);
            console.log(indice);

            events_array.push({
              title: doc.data().attendeesName + " - " + doc.data().title + " - " + teacherNameArray[indice],             //Populate events_array with data + " - " +docTeacher.data().firstName+" "+docTeacher.data().lastName
              start: doc.data().startDate,
              end: doc.data().endDate,
              id: doc.data().id,
              tip: 'tip',
              color: colorOfEvent,
              editable: doc.data().editable
            });

            /* }).catch(function(err) {
              console.log("Error : ",err);
            }); */
          }




        }
      });
    }
    else {
      querySnapshot.forEach(function (doc) {
        // console.log(doc.id, "=>", doc.data().startDate);
        if (doc.data().extrascolaire != true) {
          if (doc.data().instituteName == undefined) {
            events_array.push({
              title: doc.data().title,              //Populate events_array with data
              start: doc.data().startDate,
              end: doc.data().endDate,
              id: doc.data().id,
              tip: 'tip',
              color: doc.data().eventColor,
              editable: doc.data().editable
            });
          }


        }
      });
    }




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
        maxTime: "21:00:00",
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
          var studentArray = [];

          if (userCategory == "admin") {
            $("#modalAddEvent").modal(); //Display modal which contains Event Creation form
            $("input[value='Cours']").prop("checked", true);

          }

          //REvenir
          console.log(info.start.getTime());
          $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
          $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
          $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
          $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()));

          // console.log(Date.parse($('#endRecur').val()));
          console.log("hey ", getTimeWithoutOffset(info.start.getTime()));
          // $('#dateEvent').text(getDateTime(info.start.getTime(), info.end.getTime()));

          $("#formEvent").submit(function (ev) {  //Once the form is submitted
            var newEventTitle = document.getElementById("newEventTitle");
            // var newEventType = $("input[name='newEventType']:checked").val();
            var newEventDescription = document.getElementById("newEventDescription");
            // var selectedClass = document.getElementById("selectClass");
            var selectedStudent = document.getElementById("selectStudent");
            var startEvent = Date.parse($('#startEvent').val());
            var endEvent = Date.parse($('#endEvent').val());
            var e = document.getElementById("selectStudent");
            var attendeesName = e.options[e.selectedIndex].text;

            /*  var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
             var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours(); */
            /* var startRecur = Date.parse($('#startRecur').val());
            var endRecur = Date.parse($('#endRecur').val()); */
            var newColor;

            document.getElementById('loadingGIF').style.display = 'block';
            document.getElementById('addModalBody').style.display = 'none';

            ev.preventDefault();

            if (document.getElementById('selectStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
              newColor = '#5FCBDA';
            }
            else {
              newColor = 'red';
            }

            // console.log("LOOK HERE :" + $('select#selectStudent').val().length)
            /* $('select#selectStudent').val().forEach(function(elem) {
              console.log("NEW ELEMENT : ", elem);
            }); */

            var recur = new Date(startEvent);   //// ICIIIIIIIIIII

            // If the event isn't recurrent
            if ($('select#selectRecur').val() == "non") {
              //Write data into Firebase user

              console.log("START EVENT: ", startEvent);
              console.log('END EVENT: ', endEvent);

              var query = firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val());
              query.set({
                idUser: user.uid,
                // typeActivity: newEventType,
                id: user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val(),
                eventColor: newColor,
                startDate: startEvent,
                endDate: endEvent,
                // startTime: '',
                // endTime: '',
                // daysOfWeek: '',
                title: $('select#selectMatiere').val(),     // Here we save studentValue as TITLE and subject as ATTENdees
                editable: true,                             // so attendees' name can directly be displayed on admin/teacher's 
                description: newEventDescription.value,     // calendar
                attendees: $('select#selectStudent').val(),
                attendeesName: attendeesName,
                activityDone: false,
                teacherID: $('select#selectTeacher').val(),
                soutien: true
                // daysOfWeek: [recur.getDay()]

              }).then(function () {
                console.log("Admin's activity created.");
                calendar.addEvent({
                  title: attendeesName + " - " + $('select#selectMatiere').val(),
                  start: startEvent,
                  end: endEvent,
                  id: user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val(),
                  // startTime: info.start.getHours()*3600000,
                  // endTime: endEventRecur*3600000,
                  color: newColor,
                  editable: true,
                  allDay: false
                  // daysOfWeek: [recur.getDay()]

                });
                //Write data for each student of a class OR for a specific student
                if (userCategory == "teacher") {


                } else if (userCategory == "admin") {

                  /*  //Create activity for selected teacher
                  firestore.collection('activities').doc($('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val())
                  .set({
                    idUser: $('select#selectTeacher').val(),
                    typeActivity: newEventType,
                    eventColor: newColor,
                    id: $('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val(),
                    startDate: startEvent,
                    endDate: endEvent,
                    title: $('select#selectMatiere').val(),
                    editable: false, //Student should not edit event programmed by teacher
                    description: newEventDescription.value,
                    classe: $('select#selectClass').val(),
                    attendees: $('select#selectStudent').val(),
                    activityDone: false,
                    teacherID: $('select#selectTeacher').val()
                    
                  }).then(function () {
                    console.log("Document added for teacher");
                  }).catch(function (err) {
                    console.log("Error ", err);
                  }); */

                  //No need to create teacher activity for the moment


                  //We create activity for selected student


                  firestore.collection('activities').doc($('select#selectStudent').val() + "_" + startEvent + "_" + user.uid + "_" + $('select#selectMatiere').val())
                    .set({
                      idUser: $('select#selectStudent').val(),
                      // typeActivity: newEventType,
                      eventColor: newColor,
                      startDate: startEvent,
                      endDate: endEvent,
                      id: $('select#selectStudent').val() + "_" + startEvent + "_" + user.uid + "_" + $('select#selectMatiere').val(),
                      title: $('select#selectMatiere').val(),
                      editable: false, //Student should not edit event programmed by teacher
                      description: newEventDescription.value,
                      activityDone: false,
                      soutien: true,
                      teacherID: $('select#selectTeacher').val()
                    }).then(function () {
                      console.log("Document added for students");
                      document.getElementById('loadingGIF').style.display = 'none';
                      document.getElementById('addModalBody').style.display = 'block';
                      $("#modalAddEvent").modal("hide"); //Hide modal
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });
                }
              }).catch(function (err) {
                console.log("Error while writing data into DB :", err);
              });

              //If the event is recurrent
            } else if ($('select#selectRecur').val() == "oui") {
              // $('#startRecur').val($('#startEvent').val().slice(0,-6));
              // $('#startRecur').val('2019-08-26');

              var startRecur = startEvent / 1000;
              var endRecur = (Date.parse($('#endRecur').val())) / 1000;
              console.log('Start Recur : ', startRecur);
              console.log('EndRecur :', endRecur);

              console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))

              var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);

              var startArray = [];
              var endArray = [];


              for (var i = 0; i < eventCoef; i++) {
                if (i != 0) {
                  var newStart = new Date(startEvent);
                  startEvent = newStart.setDate(newStart.getDate() + 7);

                  var newEnd = new Date(endEvent);
                  endEvent = newEnd.setDate(newEnd.getDate() + 7);
                }
                console.log("Start n°" + i + " : ", startEvent);
                console.log("End n°" + i + " : ", endEvent);

                startArray.push(startEvent);
                endArray.push(endEvent);

              }

              //CREATE EVENTS
              createRecurringEventsSoutien(user.uid, instituteName, userCategory, newEventDescription.value, newColor, startArray, endArray, $('select#selectMatiere').val(), $('select#selectStudent').val(), $('select#selectTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


            }
            // console.log("New event :" + "\n" + "Title : " + newEventTitle.value + "\n" + "Start : " + info.start.getTime() + "\n" + "End : " + info.end.getTime() + "\n" + "Type: " + newEventType + "\n" + "Description : " + newEventDescription.value);
          });
        },



        eventClick: function (info) {  //When an event is clicked this function is triggereda

          document.getElementById('modifyStartEvent').disabled = false;
          document.getElementById('modifyEndEvent').disabled = false;
          document.getElementById('selectModifyStudent').disabled = false;

          document.getElementById('selectModifyRecur').disabled = false;
          document.getElementById('modifyStartRecur').disabled = false;
          document.getElementById('modifyEndRecur').disabled = false;
          document.getElementById('selectModifyTeacher').innerHTML = '';

          document.getElementById('btnVirtualRoom').setAttribute('disabled', true);
          document.getElementById('btnVirtualRoomTeacher').setAttribute('disabled', true);


          // console.log(info.event.id);
          document.getElementById('basicContainer').innerHTML = "";


          var oldStartDate = info.event.start.getTime();
          console.log(info.event.id);
          var query = firestore.collection('activities').doc(info.event.id);

          query.get().then(function (doc) {
            console.log(doc.data().id);
            if (doc.data().editable != true) {
              // alert("Vous ne pouvez pas modifier ou supprimer cet événement");

              firestore.collection('users').doc(doc.data().idUser).get()
                .then(function (doc2) {

                  if (doc2.data().userCategory == "student") {
                    $('#modalShowEvent').modal();
                    showMatiere.value = doc.data().title;
                    // showActivities.value = doc.data().typeActivity;
                    showDescription.value = doc.data().description;

                    firestore.collection('users').doc(doc.data().teacherID).get()
                      .then(function (docTeacher) {

                        document.getElementById('linkVirtualRoom').href = docTeacher.data().virtualRoom;
                        document.getElementById('btnVirtualRoom').removeAttribute('disabled');

                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                    // showClassName.innerText = doc.data().classe;

                  } else if (doc2.data().userCategory == "teacher") {
                    $('#modalModifyTeacher').modal();
                    // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true);
                    modifyEventDescriptionTeacher.value = doc.data().description;
                    modifyEventTitleTeacher.value = doc.data().title;
                    classNameTeacher.innerText = doc.data().classe;
                    attendeesTeacher.innerHTML = '';
                    if (!doc.data().attendees.includes("classe")) {
                      doc.data().attendees.forEach(function (elem) {
                        firestore.collection('users').doc(elem).get()
                          .then(function (doc) {
                            attendeesTeacher.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                          }).catch(function (err) {
                            console.log("Error :", err);
                          });
                      });
                    }
                    // Arnaud pour faire l'appel
                    var buttonValue = doc.data().idUser + '%' + doc.data().startDate + '%' + doc.data().classe + '%' + doc.data().title + '%' + doc.data().endDate;
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
                      ev.preventDefault();
                      // var modifiedEventType = $("input[name='modifyEventTypeTeacher']:checked").val();
                      // console.log(modifiedEventType);




                      query.set({
                        // title: modifyEventTitleTeacher.value,
                        description: modifyEventDescriptionTeacher.value,
                        /*  typeActivity: modifiedEventType,
                   eventColor: modifiedEventColor */
                      }, {
                        merge: true
                      }).then(function () {

                        //Modify Admin and students activities

                        firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
                          .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                              console.log(doc.data().id);
                              firestore.collection('activities').doc(doc.data().id)
                                .set({
                                  // title: modifyEventTitleTeacher.value,
                                  description: modifyEventDescriptionTeacher.value
                                  // typeActivity: modifiedEventType
                                  // eventColor: modifiedEventColor
                                }, {
                                  merge: true
                                }).catch(function (err) {
                                  console.log("Error: ", err);
                                });
                            });
                          }).catch(function (err) {
                            console.log("Error :", err);
                          });
                      }).catch(function (err) {
                        console.log("Error: ", err);
                      });


                      info.event.setProp('title', modifyEventTitleTeacher.value);
                      info.event.setProp('description', modifyEventDescriptionTeacher.value);
                      /* info.event.setProp('backgroundColor', modifiedEventColor);
                      info.event.setProp('borderColor', modifiedEventColor); */


                      $("#modalModifyTeacher").modal("hide");

                    });








                  }

                }).catch(function (err) {
                  console.log("Error : ", err);
                });



            } else {

              //ADMIN SECTION

              if (userCategory == 'teacher') {

                firestore.collection('users').doc(doc.data().teacherID).get()
                  .then(function (docTeacher) {
                    document.getElementById('linkVirtualRoomTeacher').href = docTeacher.data().virtualRoom;
                    document.getElementById('btnVirtualRoomTeacher').removeAttribute('disabled');
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });

                document.getElementById('modifyStartEvent').disabled = true;
                document.getElementById('modifyEndEvent').disabled = true;
                document.getElementById('selectModifyStudent').disabled = true;

                document.getElementById('selectModifyRecur').disabled = true;
                document.getElementById('modifyStartRecur').disabled = true;
                document.getElementById('modifyEndRecur').disabled = true;






                var oldTitle = doc.data().title;
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
                // className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                // selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';


                firestore.collection('users').doc(doc.data().attendees).get()
                  .then(function (docAttendees) {
                    attendeesAdmin.innerHTML += '<p>' + docAttendees.data().firstName + ' ' + docAttendees.data().lastName + '</p>'
                    initModifyStudentSelection(docAttendees.data().instituteName, docAttendees.id, doc.data().title);
                    initModifyTeacherSelection(docAttendees.data().instituteName, doc.data().teacherID);
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });





                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startDate).slice(0, -13));



                //We check whether the event is recurring or not. We set according inputs depending on the case
                if (doc.data().startRecur == undefined || doc.data().startRecur == '') {
                  //Event is not recurrent, we don't display recurring section
                  $('select#selectModifyRecur').val('non');
                  document.getElementById('modifyRecurrenceSection').style.display = "none";

                } else {
                  //Event is reccurent, we display recurring section along with setting the end recurring date
                  $('select#selectModifyRecur').val('oui');
                  document.getElementById('modifyRecurrenceSection').style.display = "block";
                  $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                  $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                }



                //We set description
                modifiedEventDescription.value = doc.data().description;

                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
                }

                //We check corresponding activity type
                // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs
                // console.log($('select#selectModifyStudent').val());

                // initChapters();
                ////////////////////////////////////////////////////////////////////////////

                firestore.collection('users').doc(user.uid).get()
                  .then(function (docTeacher) {

                    $('#formModifyEvent').submit(function (eve) {

                      eve.preventDefault();

                      document.getElementById('modifyLoadingGIF').style.display = 'block';
                      document.getElementById('modifyModalBody').style.display = 'none';

                      // var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                      var newStartDate = Date.parse($('#modifyStartEvent').val());
                      var newEndDate = Date.parse($('#modifyEndEvent').val());

                      var e = document.getElementById("selectModifyStudent");
                      var attendeesName = e.options[e.selectedIndex].text;

                      if ($('select#selectModifyRecur').val() == "non") {
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                          newColor = '#5FCBDA';
                        }
                        else {
                          newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {
                          firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (docActivity) {
                                console.log("other activities with same id " + docActivity.id);
                                if (docActivity.data().startDate != doc.data().startDate) {
                                  console.log(docActivity.id + ' to be deleted');
                                  console.log(calendar.getEventById(docActivity.id));
                                  if (docActivity.data().idUser == docTeacher.data().idAdmin) {
                                    calendar.getEventById(docActivity.id).remove();

                                  }
                                  firestore.collection('activities').doc(docActivity.id).delete();

                                }
                              });

                              if (doc.data().title != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                                //In this case we should recreate the event for each affected user and delete their old activity




                                console.log("Case 1: We need to delete/recreate.");
                                // I. We deal with Admin's activity
                                firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                                  .set({
                                    idUser: docTeacher.data().idAdmin,
                                    // typeActivity: modifiedEventType,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    eventColor: newColor,
                                    startDate: newStartDate,
                                    endDate: newEndDate,
                                    title: $('select#selectModifyMatiere').val(),
                                    editable: true,
                                    soutien: true,
                                    description: modifiedEventDescription.value,
                                    attendees: $('select#selectModifyStudent').val(),
                                    activityDone: false,
                                    teacherID: $('select#selectModifyTeacher').val(),
                                    attendeesName: attendeesName,
                                    groupID: modifyGroupID,

                                    startRecur: modifyStartRecur,
                                    endRecur: modifyEndRecur
                                  },
                                    {
                                      merge: true
                                    }).then(function () {
                                      console.log("Admin's activity updated.");
                                      info.event.remove();
                                      calendar.addEvent({
                                        title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                        start: newStartDate,
                                        end: newEndDate,
                                        description: modifiedEventDescription.value,
                                        id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                        color: newColor,
                                        editable: true,
                                        allDay: false
                                      });


                                      //III. Now we deal with student's activity.

                                      //First we need to delete old activities using oldAttendees.

                                      firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                      //Now that we deleted students' old activities we can start creating new ones.


                                      firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                        .set({
                                          idUser: $('select#selectModifyStudent').val(),
                                          // typeActivity: modifiedEventType,
                                          id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                          eventColor: newColor,
                                          startDate: newStartDate,
                                          endDate: newEndDate,
                                          title: $('select#selectModifyMatiere').val(),
                                          editable: false,
                                          soutien: true,
                                          description: modifiedEventDescription.value,
                                          attendees: $('select#selectModifyStudent').val(),
                                          activityDone: false,
                                          teacherID: $('select#selectModifyTeacher').val(),
                                          groupID: modifyGroupID,

                                          startRecur: modifyStartRecur,
                                          endRecur: modifyEndRecur
                                        },
                                          {
                                            merge: true
                                          }).then(function () {
                                            query.delete();

                                            console.log("Old admin's event deleted");
                                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                                            document.getElementById('modifyModalBody').style.display = 'block';
                                            $('#modalModifyEvent').modal("hide");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });

                                    }).catch(function (err) {
                                      console.log("Error while creating new event for Admin :", err);
                                    });
                              }
                              else {
                                //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                                console.log("Case 2: Update only.")
                                //I. Update admin's activity
                                query.update({
                                  idUser: docTeacher.data().idAdmin,
                                  // typeActivity: modifiedEventType,
                                  id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: true,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  attendeesName: attendeesName,
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Admin's activity is now updated.")
                                  info.event.remove();

                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });




                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .update({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    }).then(function () {
                                      console.log("Student document updated.");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }).catch(function (err) {
                                  console.log("Error while updating admin's activity: ", err);
                                });
                              }


                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                        else {
                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: docTeacher.data().idAdmin,
                                // typeActivity: modifiedEventType,
                                id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.



                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();
                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: docTeacher.data().idAdmin,
                              // typeActivity: modifiedEventType,
                              id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),

                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }
                        }



                      }
                      else {
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        swal({
                          title: "Attention !",
                          text: "Cet événément fait partie d'une récurrence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette dernière de la récurrence existante.",
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
                            if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                              newColor = '#5FCBDA';
                            }
                            else {
                              newColor = 'red';
                            }

                            if (doc.data().groupID != undefined) {
                              //EVENT IS PART OF A RECURRENCE
                              if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                                //In this case we should recreate the event for each affected user and delete their old activity




                                console.log("Case 1: We need to delete/recreate.");
                                // I. We deal with Admin's activity
                                firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                                  .set({
                                    idUser: docTeacher.data().idAdmin,
                                    // typeActivity: modifiedEventType,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    eventColor: newColor,
                                    startDate: newStartDate,
                                    endDate: newEndDate,
                                    title: $('select#selectModifyMatiere').val(),
                                    editable: true,
                                    soutien: true,
                                    description: modifiedEventDescription.value,
                                    attendees: $('select#selectModifyStudent').val(),
                                    activityDone: false,
                                    teacherID: $('select#selectModifyTeacher').val(),
                                    attendeesName: attendeesName,
                                    groupID: modifyGroupID,

                                    startRecur: modifyStartRecur,
                                    endRecur: modifyEndRecur
                                  },
                                    {
                                      merge: true
                                    }).then(function () {
                                      console.log("Admin's activity updated.");
                                      info.event.remove();
                                      calendar.addEvent({
                                        title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                        start: newStartDate,
                                        end: newEndDate,
                                        description: modifiedEventDescription.value,
                                        id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                        color: newColor,
                                        editable: true,
                                        allDay: false
                                      });


                                      //III. Now we deal with student's activity.

                                      //First we need to delete old activities using oldAttendees.

                                      firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                      //Now that we deleted students' old activities we can start creating new ones.



                                      firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                        .set({
                                          idUser: $('select#selectModifyStudent').val(),
                                          // typeActivity: modifiedEventType,
                                          id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                          eventColor: newColor,
                                          startDate: newStartDate,
                                          endDate: newEndDate,
                                          title: $('select#selectModifyMatiere').val(),
                                          editable: false,
                                          soutien: true,
                                          description: modifiedEventDescription.value,
                                          attendees: $('select#selectModifyStudent').val(),
                                          activityDone: false,
                                          teacherID: $('select#selectModifyTeacher').val(),
                                          groupID: modifyGroupID,

                                          startRecur: modifyStartRecur,
                                          endRecur: modifyEndRecur
                                        },
                                          {
                                            merge: true
                                          }).then(function () {
                                            query.delete();
                                            console.log("Old admin's event deleted");
                                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                                            document.getElementById('modifyModalBody').style.display = 'block';
                                            $('#modalModifyEvent').modal("hide");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });

                                    }).catch(function (err) {
                                      console.log("Error while creating new event for Admin :", err);
                                    });
                              }
                              else {
                                //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                                console.log("Case 2: Update only.")
                                //I. Update admin's activity
                                query.update({
                                  idUser: docTeacher.data().idAdmin,
                                  // typeActivity: modifiedEventType,
                                  id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: true,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  attendeesName: attendeesName,
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Admin's activity is now updated.")
                                  info.event.remove();

                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });




                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .update({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    }).then(function () {
                                      console.log("Student document updated.");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }).catch(function (err) {
                                  console.log("Error while updating admin's activity: ", err);
                                });
                              }
                            }
                            else {
                              //EVENT IS SINGULAR
                              firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                              query.delete();
                              console.log("Delete");
                              //We first delete old event.
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
                                console.log("Start n°" + i + " : ", newStartDate);
                                console.log("End n°" + i + " : ", newEndDate);

                                startArray.push(newStartDate);
                                endArray.push(newEndDate);

                              }

                              createRecurringEventsSoutien(docTeacher.data().idAdmin, instituteName, userCategory, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


                            }
                          }
                          else {
                            console.log("Modification annulée.");
                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                            document.getElementById('modifyModalBody').style.display = 'block';
                          }
                        });



                      }




                    });

                    //GOOD
                    // $('#btnDeleteEvent').click(function () {

                    //   console.log("dzd");
                    //   if (doc.data().groupID != undefined) {



                    //     if (!confirm("Attention cet événement fait partie d'une récurrence. Souhaitez-vous également supprimer les autres événements de la récurrence ?")) {
                    //       if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    //         console.log("no delete");
                    //       } else {
                    //         /* query.delete()
                    //         .then(function()
                    //         { */
                    //         // Then we delete activities docs for each student
                    //         /*  if(userCategory == "teacher")
                    //         {
                    //           for(var i = 0; i<doc.data().students.length; i++)
                    //           {
                    //             firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                    //           }
                    //         } */

                    //         if (userCategory == "admin" || userCategory == 'teacher') {
                    //           firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                    //           query.delete();
                    //         }
                    //         /* }); */
                    //         info.event.remove();
                    //         console.log("Delete");
                    //         $("#modalModifyEvent").modal("hide");

                    //       }
                    //     }
                    //     else {
                    //       console.log("here");
                    //       firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                    //         .then(function (querySnapshot) {
                    //           querySnapshot.forEach(function (docActivity) {
                    //             firestore.collection('activities').doc(docActivity.id).delete();
                    //             if (docActivity.data().idUser == docTeacher.data().idAdmin) {
                    //               calendar.getEventById(docActivity.id).remove();
                    //             }
                    //           });
                    //           $("#modalModifyEvent").modal("hide");

                    //         }).catch(function (err) {
                    //           console.log("Error: ", err);
                    //         });
                    //     }
                    //   }
                    //   else {
                    //     if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    //       console.log("no delete");
                    //     } else {
                    //       if (userCategory == "admin" || userCategory == 'teacher') {
                    //         firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                    //         query.delete();
                    //         console.log("Delete");
                    //       }
                    //       /* }); */
                    //       info.event.remove();
                    //       $('#modalModifyEvent').modal('hide');
                    //       console.log("Delete");
                    //     }
                    //   }





                    // });

                    //GOOD
                    $('#btnDeleteEvent').click(function () {


                      if (doc.data().groupID != undefined) {
                        // alert('la');
                        swal({
                          title: "Attention !",
                          text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                            console.log("oui je veux supprimer cet événement seulement");

                            firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                            query.delete();

                            /* }); */
                            info.event.remove();
                            console.log("Delete");
                            $("#modalModifyEvent").modal("hide");

                          }
                          else {
                            console.log("non je ne veux rien supprimer");
                          }
                        });
                      }


                      else {

                        swal({
                          title: "Attention !",
                          text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                            console.log("oui je veux supprimer cet événement seulement");

                            firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                            query.delete();

                            /* }); */
                            info.event.remove();
                            console.log("Delete");
                            $("#modalModifyEvent").modal("hide");

                          }
                          else {
                            console.log("non je ne veux rien supprimer");
                          }
                        });
                      }





                    });
                    ////////////////////////////////////////////////////////////////////////////

                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });


              }
              else {

                document.getElementById('btnVirtualRoomTeacher').style.display = 'none';

                var oldTitle = doc.data().title;
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
                // className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                // selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';


                firestore.collection('users').doc(doc.data().attendees).get()
                  .then(function (docAttendees) {
                    attendeesAdmin.innerHTML += '<p>' + docAttendees.data().firstName + ' ' + docAttendees.data().lastName + '</p>';
                    initModifyStudentSelection(docAttendees.data().instituteName, docAttendees.id, doc.data().title);
                    initModifyTeacherSelection(docAttendees.data().instituteName, doc.data().teacherID);
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });

                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                // $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startRecur));



                //We check whether the event is recurring or not. We set according inputs depending on the case
                if (doc.data().groupID == undefined || doc.data().groupID == '') {
                  //Event is not recurrent, we don't display recurring section
                  $('select#selectModifyRecur').val('non');
                  document.getElementById('modifyRecurrenceSection').style.display = "none";
                  document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                  document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                  document.getElementById('selectModifyRecur').setAttribute('disabled', true);

                } else {
                  $('select#selectModifyRecur').val('oui');
                  document.getElementById('modifyRecurrenceSection').style.display = "block";
                  $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                  $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                  document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                  document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                  document.getElementById('selectModifyRecur').setAttribute('disabled', true);



                }



                //We set description
                modifiedEventDescription.value = doc.data().description;

                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
                }

                //We check corresponding activity type
                // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs
                // console.log($('select#selectModifyStudent').val());

                // initChapters();

                $('#formModifyEvent').submit(function (eve) {

                  eve.preventDefault();

                  document.getElementById('modifyLoadingGIF').style.display = 'block';
                  document.getElementById('modifyModalBody').style.display = 'none';

                  // var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                  var newStartDate = Date.parse($('#modifyStartEvent').val());
                  var newEndDate = Date.parse($('#modifyEndEvent').val());

                  var e = document.getElementById("selectModifyStudent");
                  var attendeesName = e.options[e.selectedIndex].text;



                  if ($('select#selectModifyRecur').val() == "non") {
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();
                    var newColor;

                    if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                      newColor = '#5FCBDA';
                    }
                    else {
                      newColor = 'red';
                    }

                    if (doc.data().groupID != undefined) {
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

                          if (doc.data().title != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                // typeActivity: modifiedEventType,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName,
                                groupID: modifyGroupID,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.


                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();

                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              // typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName,
                              groupID: modifyGroupID,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }


                        }).catch(function (err) {
                          console.log("Error :", err);
                        });
                    }
                    else {
                      if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                        //In this case we should recreate the event for each affected user and delete their old activity




                        console.log("Case 1: We need to delete/recreate.");
                        // I. We deal with Admin's activity
                        firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                          .set({
                            idUser: user.uid,
                            // typeActivity: modifiedEventType,
                            id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                            eventColor: newColor,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            title: $('select#selectModifyMatiere').val(),
                            editable: true,
                            soutien: true,
                            description: modifiedEventDescription.value,
                            attendees: $('select#selectModifyStudent').val(),
                            activityDone: false,
                            teacherID: $('select#selectModifyTeacher').val(),
                            attendeesName: attendeesName
                          },
                            {
                              merge: true
                            }).then(function () {
                              console.log("Admin's activity updated.");
                              info.event.remove();
                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });


                              //III. Now we deal with student's activity.

                              //First we need to delete old activities using oldAttendees.

                              firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                              //Now that we deleted students' old activities we can start creating new ones.



                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .set({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),

                                },
                                  {
                                    merge: true
                                  }).then(function () {
                                    query.delete();
                                    console.log("Old admin's event deleted");
                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });

                            }).catch(function (err) {
                              console.log("Error while creating new event for Admin :", err);
                            });
                      }
                      else {
                        //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                        console.log("Case 2: Update only.")
                        //I. Update admin's activity
                        query.update({
                          idUser: user.uid,
                          // typeActivity: modifiedEventType,
                          id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                          eventColor: newColor,
                          startDate: newStartDate,
                          endDate: newEndDate,
                          title: $('select#selectModifyMatiere').val(),
                          editable: true,
                          soutien: true,
                          description: modifiedEventDescription.value,
                          attendees: $('select#selectModifyStudent').val(),
                          activityDone: false,
                          teacherID: $('select#selectModifyTeacher').val(),
                          attendeesName: attendeesName
                        }).then(function () {
                          console.log("Admin's activity is now updated.")
                          info.event.remove();

                          calendar.addEvent({
                            title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                            start: newStartDate,
                            end: newEndDate,
                            description: modifiedEventDescription.value,
                            id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                            color: newColor,
                            editable: true,
                            allDay: false
                          });




                          firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                            .update({
                              idUser: $('select#selectModifyStudent').val(),
                              // typeActivity: modifiedEventType,
                              id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: false,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),

                            }).then(function () {
                              console.log("Student document updated.");
                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                              document.getElementById('modifyModalBody').style.display = 'block';
                              $('#modalModifyEvent').modal("hide");
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }).catch(function (err) {
                          console.log("Error while updating admin's activity: ", err);
                        });
                      }
                    }



                  }
                  else {

                    swal({
                      title: "Attention !",
                      text: "Cet événément fait partie d'une récurrence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette dernière de la récurrence existante.",
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
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                          newColor = '#5FCBDA';
                        }
                        else {
                          newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {
                          //EVENT IS PART OF A RECURRENCE
                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                // typeActivity: modifiedEventType,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName,
                                groupID: modifyGroupID,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.



                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();
                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              // typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName,
                              groupID: modifyGroupID,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }
                        }
                        else {
                          //EVENT IS SINGULAR
                          firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                          query.delete();
                          console.log("Delete");
                          //We first delete old event.
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
                            console.log("Start n°" + i + " : ", newStartDate);
                            console.log("End n°" + i + " : ", newEndDate);

                            startArray.push(newStartDate);
                            endArray.push(newEndDate);

                          }

                          createRecurringEventsSoutien(user.uid, instituteName, userCategory, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


                        }
                      }
                      else {
                        console.log("modif annulée");
                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                        document.getElementById('modifyModalBody').style.display = 'block';
                      }
                    });



                  }




                });

                //GOOD
                $('#btnDeleteEvent').click(function () {


                  if (doc.data().groupID != undefined) {
                    // alert('la');
                    swal({
                      title: "Attention !",
                      text: "Cet événément fait partie d'une récurrence. Souhaitez-vous également supprimer les autres événéments à venir de la récurrence ?",
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
                        console.log("oui je veux supprimer les événements récurrents.");
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
                        console.log("non je ne veux pas supprimer toutes les récurrences alors");

                        setTimeout(function () {
                          swal({
                            title: "Attention !",
                            text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                              console.log("oui je veux supprimer cet événement seulement");
                              if (userCategory == "admin") {
                                firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                                query.delete();
                              }
                              /* }); */
                              info.event.remove();
                              console.log("Delete");
                              $("#modalModifyEvent").modal("hide");

                            }
                            else {
                              console.log("non je ne veux rien supprimer");
                            }
                          });
                        }, 300);

                      }
                    });
                    // if (!confirm("Attention cet événement fait partie d'une récurrence. Souhaitez-vous également supprimer les autres événements de la récurrence ?")) {
                    // if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    //   console.log("no delete");
                    // } else {
                    //   /* query.delete()
                    //   .then(function()
                    //   { */
                    //   // Then we delete activities docs for each student
                    //   /*  if(userCategory == "teacher")
                    //   {
                    //     for(var i = 0; i<doc.data().students.length; i++)
                    //     {
                    //       firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                    //     }
                    //   } */

                    //   if (userCategory == "admin") {
                    //     firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                    //     query.delete();
                    //   }
                    //   /* }); */
                    //   info.event.remove();
                    //   console.log("Delete");
                    //   $("#modalModifyEvent").modal("hide");

                    // }
                    // }
                    // else {
                    //   console.log("here");
                    //   firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                    //     .then(function (querySnapshot) {
                    //       querySnapshot.forEach(function (docActivity) {
                    //         firestore.collection('activities').doc(docActivity.id).delete();
                    //         if (docActivity.data().idUser == user.uid) {
                    //           calendar.getEventById(docActivity.id).remove();
                    //         }
                    //       });
                    //       $("#modalModifyEvent").modal("hide");

                    //     }).catch(function (err) {
                    //       console.log("Error: ", err);
                    //     });
                    // }
                  }


                  else {

                    swal({
                      title: "Attention !",
                      text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                        console.log("oui je veux supprimer cet événement seulement");
                        if (userCategory == "admin") {
                          firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                          query.delete();
                        }
                        /* }); */
                        info.event.remove();
                        console.log("Delete");
                        $("#modalModifyEvent").modal("hide");

                      }
                      else {
                        console.log("non je ne veux rien supprimer");
                      }
                    });
                  }





                });

                /* $('#btnDeleteEvent').click(function () {
 
                  if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    console.log("no delete");
                  } else {
 
 
                    if (userCategory == "admin") {
                    
                      firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                      query.delete();
                      info.event.remove();
                      console.log("Delete");
                    }
                    
 
                  }
                  $("#modalModifyEvent").modal("hide");
                }); */
              }


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
            text: 'Ajouter un événement',
            click: function () {
              $('#modalAddEventClick').modal();
            }
          }
        },
        // slotDuration: '00:00:30',
        minTime: "07:00:00",
        maxTime: "21:00:00",
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
          var studentArray = [];

          if (userCategory == "admin") {
            $("#modalAddEvent").modal(); //Display modal which contains Event Creation form
            $("input[value='Cours']").prop("checked", true);

          }

          //REvenir
          console.log(info.start.getTime());
          $('#startEvent').val(getTimeWithoutOffset(info.start.getTime()));
          $('#endEvent').val(getTimeWithoutOffset(info.end.getTime()));
          $('#dateEvent').text(getDateTime(Date.parse($('#startEvent').val()), Date.parse($('#endEvent').val())));
          $('#startRecur').val(getTimeWithoutOffset(info.start.getTime()));

          // console.log(Date.parse($('#endRecur').val()));
          console.log("hey ", getTimeWithoutOffset(info.start.getTime()));
          // $('#dateEvent').text(getDateTime(info.start.getTime(), info.end.getTime()));

          $("#formEvent").submit(function (ev) {  //Once the form is submitted
            var newEventTitle = document.getElementById("newEventTitle");
            // var newEventType = $("input[name='newEventType']:checked").val();
            var newEventDescription = document.getElementById("newEventDescription");
            // var selectedClass = document.getElementById("selectClass");
            var selectedStudent = document.getElementById("selectStudent");
            var startEvent = Date.parse($('#startEvent').val());
            var endEvent = Date.parse($('#endEvent').val());
            var e = document.getElementById("selectStudent");
            var attendeesName = e.options[e.selectedIndex].text;

            /*  var startEventRecur = new Date(Date.parse($('#startEvent').val())).getHours();
             var endEventRecur = new Date(Date.parse($('#endEvent').val())).getHours(); */
            /* var startRecur = Date.parse($('#startRecur').val());
            var endRecur = Date.parse($('#endRecur').val()); */
            var newColor;

            document.getElementById('loadingGIF').style.display = 'block';
            document.getElementById('addModalBody').style.display = 'none';

            ev.preventDefault();


            if (document.getElementById('selectStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
              newColor = '#5FCBDA';
            }
            else if (document.getElementById('selectStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
              newColor = '#5FCBDA';
            }
            else {
              newColor = 'red';
            }

            // console.log("LOOK HERE :" + $('select#selectStudent').val().length)
            /* $('select#selectStudent').val().forEach(function(elem) {
              console.log("NEW ELEMENT : ", elem);
            }); */

            var recur = new Date(startEvent);   //// ICIIIIIIIIIII

            // If the event isn't recurrent
            if ($('select#selectRecur').val() == "non") {
              //Write data into Firebase user

              console.log("START EVENT: ", startEvent);
              console.log('END EVENT: ', endEvent);

              var query = firestore.collection('activities').doc(user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val());
              query.set({
                idUser: user.uid,
                // typeActivity: newEventType,
                id: user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val(),
                eventColor: newColor,
                startDate: startEvent,
                endDate: endEvent,
                // startTime: '',
                // endTime: '',
                // daysOfWeek: '',
                title: $('select#selectMatiere').val(),     // Here we save studentValue as TITLE and subject as ATTENdees
                editable: true,                             // so attendees' name can directly be displayed on admin/teacher's 
                description: newEventDescription.value,     // calendar
                attendees: $('select#selectStudent').val(),
                attendeesName: attendeesName,
                activityDone: false,
                teacherID: $('select#selectTeacher').val(),
                soutien: true
                // daysOfWeek: [recur.getDay()]

              }).then(function () {
                console.log("Admin's activity created.");
                calendar.addEvent({
                  title: attendeesName + " - " + $('select#selectMatiere').val(),
                  start: startEvent,
                  end: endEvent,
                  id: user.uid + "_" + startEvent + "_" + $('select#selectStudent').val() + "_" + $('select#selectMatiere').val(),
                  // startTime: info.start.getHours()*3600000,
                  // endTime: endEventRecur*3600000,
                  color: newColor,
                  editable: true,
                  allDay: false
                  // daysOfWeek: [recur.getDay()]

                });
                //Write data for each student of a class OR for a specific student
                if (userCategory == "teacher") {


                } else if (userCategory == "admin") {

                  /*  //Create activity for selected teacher
                  firestore.collection('activities').doc($('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val())
                  .set({
                    idUser: $('select#selectTeacher').val(),
                    typeActivity: newEventType,
                    eventColor: newColor,
                    id: $('select#selectTeacher').val() + "_" + startEvent + "_" + $('select#selectClass').val() + "_" + $('select#selectMatiere').val(),
                    startDate: startEvent,
                    endDate: endEvent,
                    title: $('select#selectMatiere').val(),
                    editable: false, //Student should not edit event programmed by teacher
                    description: newEventDescription.value,
                    classe: $('select#selectClass').val(),
                    attendees: $('select#selectStudent').val(),
                    activityDone: false,
                    teacherID: $('select#selectTeacher').val()
                    
                  }).then(function () {
                    console.log("Document added for teacher");
                  }).catch(function (err) {
                    console.log("Error ", err);
                  }); */

                  //No need to create teacher activity for the moment


                  //We create activity for selected student


                  firestore.collection('activities').doc($('select#selectStudent').val() + "_" + startEvent + "_" + user.uid + "_" + $('select#selectMatiere').val())
                    .set({
                      idUser: $('select#selectStudent').val(),
                      // typeActivity: newEventType,
                      eventColor: newColor,
                      startDate: startEvent,
                      endDate: endEvent,
                      id: $('select#selectStudent').val() + "_" + startEvent + "_" + user.uid + "_" + $('select#selectMatiere').val(),
                      title: $('select#selectMatiere').val(),
                      editable: false, //Student should not edit event programmed by teacher
                      description: newEventDescription.value,
                      activityDone: false,
                      soutien: true,
                      teacherID: $('select#selectTeacher').val()
                    }).then(function () {
                      console.log("Document added for students");
                      document.getElementById('loadingGIF').style.display = 'none';
                      document.getElementById('addModalBody').style.display = 'block';
                      $("#modalAddEvent").modal("hide"); //Hide modal
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });
                }
              }).catch(function (err) {
                console.log("Error while writing data into DB :", err);
              });

              //If the event is recurrent
            } else if ($('select#selectRecur').val() == "oui") {
              // $('#startRecur').val($('#startEvent').val().slice(0,-6));
              // $('#startRecur').val('2019-08-26');

              var startRecur = startEvent / 1000;
              var endRecur = (Date.parse($('#endRecur').val())) / 1000;
              console.log('Start Recur : ', startRecur);
              console.log('EndRecur :', endRecur);

              console.log(Math.round((((endRecur - startRecur) / 86400) / 7) + 1))

              var eventCoef = Math.round((((endRecur - startRecur) / 86400) / 7) + 1);

              var startArray = [];
              var endArray = [];


              for (var i = 0; i < eventCoef; i++) {
                if (i != 0) {
                  var newStart = new Date(startEvent);
                  startEvent = newStart.setDate(newStart.getDate() + 7);

                  var newEnd = new Date(endEvent);
                  endEvent = newEnd.setDate(newEnd.getDate() + 7);
                }
                console.log("Start n°" + i + " : ", startEvent);
                console.log("End n°" + i + " : ", endEvent);

                startArray.push(startEvent);
                endArray.push(endEvent);

              }

              //CREATE EVENTS
              createRecurringEventsSoutien(user.uid, instituteName, userCategory, newEventDescription.value, newColor, startArray, endArray, $('select#selectMatiere').val(), $('select#selectStudent').val(), $('select#selectTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


            }
            // console.log("New event :" + "\n" + "Title : " + newEventTitle.value + "\n" + "Start : " + info.start.getTime() + "\n" + "End : " + info.end.getTime() + "\n" + "Type: " + newEventType + "\n" + "Description : " + newEventDescription.value);
          });
        },



        eventClick: function (info) {  //When an event is clicked this function is triggereda

          document.getElementById('modifyStartEvent').disabled = false;
          document.getElementById('modifyEndEvent').disabled = false;
          document.getElementById('selectModifyStudent').disabled = false;

          document.getElementById('selectModifyRecur').disabled = false;
          document.getElementById('modifyStartRecur').disabled = false;
          document.getElementById('modifyEndRecur').disabled = false;
          document.getElementById('selectModifyTeacher').innerHTML = '';

          document.getElementById('btnVirtualRoom').setAttribute('disabled', true);
          document.getElementById('btnVirtualRoomTeacher').setAttribute('disabled', true);


          // console.log(info.event.id);
          document.getElementById('basicContainer').innerHTML = "";


          var oldStartDate = info.event.start.getTime();
          console.log(info.event.id);
          var query = firestore.collection('activities').doc(info.event.id);

          query.get().then(function (doc) {
            console.log(doc.data().id);
            if (doc.data().editable != true) {
              // alert("Vous ne pouvez pas modifier ou supprimer cet événement");

              firestore.collection('users').doc(doc.data().idUser).get()
                .then(function (doc2) {

                  if (doc2.data().userCategory == "student") {
                    $('#modalShowEvent').modal();
                    showMatiere.value = doc.data().title;
                    // showActivities.value = doc.data().typeActivity;
                    showDescription.value = doc.data().description;

                    firestore.collection('users').doc(doc.data().teacherID).get()
                      .then(function (docTeacher) {

                        document.getElementById('linkVirtualRoom').href = docTeacher.data().virtualRoom;
                        document.getElementById('btnVirtualRoom').removeAttribute('disabled');

                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                    // showClassName.innerText = doc.data().classe;

                  } else if (doc2.data().userCategory == "teacher") {
                    $('#modalModifyTeacher').modal();
                    // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true);
                    modifyEventDescriptionTeacher.value = doc.data().description;
                    modifyEventTitleTeacher.value = doc.data().title;
                    classNameTeacher.innerText = doc.data().classe;
                    attendeesTeacher.innerHTML = '';
                    if (!doc.data().attendees.includes("classe")) {
                      doc.data().attendees.forEach(function (elem) {
                        firestore.collection('users').doc(elem).get()
                          .then(function (doc) {
                            attendeesTeacher.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
                          }).catch(function (err) {
                            console.log("Error :", err);
                          });
                      });
                    }
                    // Arnaud pour faire l'appel
                    var buttonValue = doc.data().idUser + '%' + doc.data().startDate + '%' + doc.data().classe + '%' + doc.data().title + '%' + doc.data().endDate;
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
                      ev.preventDefault();
                      // var modifiedEventType = $("input[name='modifyEventTypeTeacher']:checked").val();
                      // console.log(modifiedEventType);




                      query.set({
                        // title: modifyEventTitleTeacher.value,
                        description: modifyEventDescriptionTeacher.value,
                        /*  typeActivity: modifiedEventType,
                   eventColor: modifiedEventColor */
                      }, {
                        merge: true
                      }).then(function () {

                        //Modify Admin and students activities

                        firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
                          .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                              console.log(doc.data().id);
                              firestore.collection('activities').doc(doc.data().id)
                                .set({
                                  // title: modifyEventTitleTeacher.value,
                                  description: modifyEventDescriptionTeacher.value
                                  // typeActivity: modifiedEventType
                                  // eventColor: modifiedEventColor
                                }, {
                                  merge: true
                                }).catch(function (err) {
                                  console.log("Error: ", err);
                                });
                            });
                          }).catch(function (err) {
                            console.log("Error :", err);
                          });
                      }).catch(function (err) {
                        console.log("Error: ", err);
                      });


                      info.event.setProp('title', modifyEventTitleTeacher.value);
                      info.event.setProp('description', modifyEventDescriptionTeacher.value);
                      /* info.event.setProp('backgroundColor', modifiedEventColor);
                      info.event.setProp('borderColor', modifiedEventColor); */


                      $("#modalModifyTeacher").modal("hide");

                    });








                  }

                }).catch(function (err) {
                  console.log("Error : ", err);
                });



            } else {

              //ADMIN SECTION

              if (userCategory == 'teacher') {

                firestore.collection('users').doc(doc.data().teacherID).get()
                  .then(function (docTeacher) {
                    document.getElementById('linkVirtualRoomTeacher').href = docTeacher.data().virtualRoom;
                    document.getElementById('btnVirtualRoomTeacher').removeAttribute('disabled');
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });

                document.getElementById('modifyStartEvent').disabled = true;
                document.getElementById('modifyEndEvent').disabled = true;
                document.getElementById('selectModifyStudent').disabled = true;

                document.getElementById('selectModifyRecur').disabled = true;
                document.getElementById('modifyStartRecur').disabled = true;
                document.getElementById('modifyEndRecur').disabled = true;






                var oldTitle = doc.data().title;
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
                // className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                // selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';


                firestore.collection('users').doc(doc.data().attendees).get()
                  .then(function (docAttendees) {
                    attendeesAdmin.innerHTML += '<p>' + docAttendees.data().firstName + ' ' + docAttendees.data().lastName + '</p>'
                    initModifyStudentSelection(docAttendees.data().instituteName, docAttendees.id, doc.data().title);
                    initModifyTeacherSelection(docAttendees.data().instituteName, doc.data().teacherID);
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });





                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startDate).slice(0, -13));



                //We check whether the event is recurring or not. We set according inputs depending on the case
                if (doc.data().startRecur == undefined || doc.data().startRecur == '') {
                  //Event is not recurrent, we don't display recurring section
                  $('select#selectModifyRecur').val('non');
                  document.getElementById('modifyRecurrenceSection').style.display = "none";

                } else {
                  //Event is reccurent, we display recurring section along with setting the end recurring date
                  $('select#selectModifyRecur').val('oui');
                  document.getElementById('modifyRecurrenceSection').style.display = "block";
                  $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                  $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                }



                //We set description
                modifiedEventDescription.value = doc.data().description;

                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
                }

                //We check corresponding activity type
                // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs
                // console.log($('select#selectModifyStudent').val());

                // initChapters();
                ////////////////////////////////////////////////////////////////////////////

                firestore.collection('users').doc(user.uid).get()
                  .then(function (docTeacher) {

                    $('#formModifyEvent').submit(function (eve) {

                      eve.preventDefault();

                      document.getElementById('modifyLoadingGIF').style.display = 'block';
                      document.getElementById('modifyModalBody').style.display = 'none';

                      // var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                      var newStartDate = Date.parse($('#modifyStartEvent').val());
                      var newEndDate = Date.parse($('#modifyEndEvent').val());

                      var e = document.getElementById("selectModifyStudent");
                      var attendeesName = e.options[e.selectedIndex].text;

                      if ($('select#selectModifyRecur').val() == "non") {
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                          newColor = '#5FCBDA';
                        }
                        else {
                          newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {
                          firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                            .then(function (querySnapshot) {
                              querySnapshot.forEach(function (docActivity) {
                                console.log("other activities with same id " + docActivity.id);
                                if (docActivity.data().startDate != doc.data().startDate) {
                                  console.log(docActivity.id + ' to be deleted');
                                  console.log(calendar.getEventById(docActivity.id));
                                  if (docActivity.data().idUser == docTeacher.data().idAdmin) {
                                    calendar.getEventById(docActivity.id).remove();

                                  }
                                  firestore.collection('activities').doc(docActivity.id).delete();

                                }
                              });

                              if (doc.data().title != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                                //In this case we should recreate the event for each affected user and delete their old activity




                                console.log("Case 1: We need to delete/recreate.");
                                // I. We deal with Admin's activity
                                firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                                  .set({
                                    idUser: docTeacher.data().idAdmin,
                                    // typeActivity: modifiedEventType,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    eventColor: newColor,
                                    startDate: newStartDate,
                                    endDate: newEndDate,
                                    title: $('select#selectModifyMatiere').val(),
                                    editable: true,
                                    soutien: true,
                                    description: modifiedEventDescription.value,
                                    attendees: $('select#selectModifyStudent').val(),
                                    activityDone: false,
                                    teacherID: $('select#selectModifyTeacher').val(),
                                    attendeesName: attendeesName,
                                    groupID: modifyGroupID,

                                    startRecur: modifyStartRecur,
                                    endRecur: modifyEndRecur
                                  },
                                    {
                                      merge: true
                                    }).then(function () {
                                      console.log("Admin's activity updated.");
                                      info.event.remove();
                                      calendar.addEvent({
                                        title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                        start: newStartDate,
                                        end: newEndDate,
                                        description: modifiedEventDescription.value,
                                        id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                        color: newColor,
                                        editable: true,
                                        allDay: false
                                      });


                                      //III. Now we deal with student's activity.

                                      //First we need to delete old activities using oldAttendees.

                                      firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                      //Now that we deleted students' old activities we can start creating new ones.


                                      firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                        .set({
                                          idUser: $('select#selectModifyStudent').val(),
                                          // typeActivity: modifiedEventType,
                                          id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                          eventColor: newColor,
                                          startDate: newStartDate,
                                          endDate: newEndDate,
                                          title: $('select#selectModifyMatiere').val(),
                                          editable: false,
                                          soutien: true,
                                          description: modifiedEventDescription.value,
                                          attendees: $('select#selectModifyStudent').val(),
                                          activityDone: false,
                                          teacherID: $('select#selectModifyTeacher').val(),
                                          groupID: modifyGroupID,

                                          startRecur: modifyStartRecur,
                                          endRecur: modifyEndRecur
                                        },
                                          {
                                            merge: true
                                          }).then(function () {
                                            query.delete();

                                            console.log("Old admin's event deleted");
                                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                                            document.getElementById('modifyModalBody').style.display = 'block';
                                            $('#modalModifyEvent').modal("hide");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });

                                    }).catch(function (err) {
                                      console.log("Error while creating new event for Admin :", err);
                                    });
                              }
                              else {
                                //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                                console.log("Case 2: Update only.")
                                //I. Update admin's activity
                                query.update({
                                  idUser: docTeacher.data().idAdmin,
                                  // typeActivity: modifiedEventType,
                                  id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: true,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  attendeesName: attendeesName,
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Admin's activity is now updated.")
                                  info.event.remove();

                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });




                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .update({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    }).then(function () {
                                      console.log("Student document updated.");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }).catch(function (err) {
                                  console.log("Error while updating admin's activity: ", err);
                                });
                              }


                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }
                        else {
                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: docTeacher.data().idAdmin,
                                // typeActivity: modifiedEventType,
                                id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.



                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),

                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();
                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: docTeacher.data().idAdmin,
                              // typeActivity: modifiedEventType,
                              id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),

                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }
                        }



                      }
                      else {
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        swal({
                          title: "Attention !",
                          text: "Cet événément fait partie d'une récurrence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette dernière de la récurrence existante.",
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
                            if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                              newColor = '#5FCBDA';
                            }
                            else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                              newColor = '#5FCBDA';
                            }
                            else {
                              newColor = 'red';
                            }

                            if (doc.data().groupID != undefined) {
                              //EVENT IS PART OF A RECURRENCE
                              if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                                //In this case we should recreate the event for each affected user and delete their old activity




                                console.log("Case 1: We need to delete/recreate.");
                                // I. We deal with Admin's activity
                                firestore.collection('activities').doc(docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                                  .set({
                                    idUser: docTeacher.data().idAdmin,
                                    // typeActivity: modifiedEventType,
                                    id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    eventColor: newColor,
                                    startDate: newStartDate,
                                    endDate: newEndDate,
                                    title: $('select#selectModifyMatiere').val(),
                                    editable: true,
                                    soutien: true,
                                    description: modifiedEventDescription.value,
                                    attendees: $('select#selectModifyStudent').val(),
                                    activityDone: false,
                                    teacherID: $('select#selectModifyTeacher').val(),
                                    attendeesName: attendeesName,
                                    groupID: modifyGroupID,

                                    startRecur: modifyStartRecur,
                                    endRecur: modifyEndRecur
                                  },
                                    {
                                      merge: true
                                    }).then(function () {
                                      console.log("Admin's activity updated.");
                                      info.event.remove();
                                      calendar.addEvent({
                                        title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                        start: newStartDate,
                                        end: newEndDate,
                                        description: modifiedEventDescription.value,
                                        id: docTeacher.data().idAdmin + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                        color: newColor,
                                        editable: true,
                                        allDay: false
                                      });


                                      //III. Now we deal with student's activity.

                                      //First we need to delete old activities using oldAttendees.

                                      firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();

                                      //Now that we deleted students' old activities we can start creating new ones.



                                      firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                        .set({
                                          idUser: $('select#selectModifyStudent').val(),
                                          // typeActivity: modifiedEventType,
                                          id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                          eventColor: newColor,
                                          startDate: newStartDate,
                                          endDate: newEndDate,
                                          title: $('select#selectModifyMatiere').val(),
                                          editable: false,
                                          soutien: true,
                                          description: modifiedEventDescription.value,
                                          attendees: $('select#selectModifyStudent').val(),
                                          activityDone: false,
                                          teacherID: $('select#selectModifyTeacher').val(),
                                          groupID: modifyGroupID,

                                          startRecur: modifyStartRecur,
                                          endRecur: modifyEndRecur
                                        },
                                          {
                                            merge: true
                                          }).then(function () {
                                            query.delete();
                                            console.log("Old admin's event deleted");
                                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                                            document.getElementById('modifyModalBody').style.display = 'block';
                                            $('#modalModifyEvent').modal("hide");
                                          }).catch(function (err) {
                                            console.log("Error :", err);
                                          });

                                    }).catch(function (err) {
                                      console.log("Error while creating new event for Admin :", err);
                                    });
                              }
                              else {
                                //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                                console.log("Case 2: Update only.")
                                //I. Update admin's activity
                                query.update({
                                  idUser: docTeacher.data().idAdmin,
                                  // typeActivity: modifiedEventType,
                                  id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: true,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  attendeesName: attendeesName,
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Admin's activity is now updated.")
                                  info.event.remove();

                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: docTeacher.data().idAdmin + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });




                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val())
                                    .update({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + docTeacher.data().idAdmin + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    }).then(function () {
                                      console.log("Student document updated.");
                                      document.getElementById('modifyLoadingGIF').style.display = 'none';
                                      document.getElementById('modifyModalBody').style.display = 'block';
                                      $('#modalModifyEvent').modal("hide");
                                    }).catch(function (err) {
                                      console.log("Error :", err);
                                    });
                                }).catch(function (err) {
                                  console.log("Error while updating admin's activity: ", err);
                                });
                              }
                            }
                            else {
                              //EVENT IS SINGULAR
                              firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                              query.delete();
                              console.log("Delete");
                              //We first delete old event.
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
                                console.log("Start n°" + i + " : ", newStartDate);
                                console.log("End n°" + i + " : ", newEndDate);

                                startArray.push(newStartDate);
                                endArray.push(newEndDate);

                              }

                              createRecurringEventsSoutien(docTeacher.data().idAdmin, instituteName, userCategory, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


                            }
                          }
                          else {
                            console.log("Modification annulée.");
                            document.getElementById('modifyLoadingGIF').style.display = 'none';
                            document.getElementById('modifyModalBody').style.display = 'block';
                          }
                        });



                      }




                    });

                    //GOOD
                    // $('#btnDeleteEvent').click(function () {

                    //   console.log("dzd");
                    //   if (doc.data().groupID != undefined) {



                    //     if (!confirm("Attention cet événement fait partie d'une récurrence. Souhaitez-vous également supprimer les autres événements de la récurrence ?")) {
                    //       if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    //         console.log("no delete");
                    //       } else {
                    //         /* query.delete()
                    //         .then(function()
                    //         { */
                    //         // Then we delete activities docs for each student
                    //         /*  if(userCategory == "teacher")
                    //         {
                    //           for(var i = 0; i<doc.data().students.length; i++)
                    //           {
                    //             firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
                    //           }
                    //         } */

                    //         if (userCategory == "admin" || userCategory == 'teacher') {
                    //           firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                    //           query.delete();
                    //         }
                    //         /* }); */
                    //         info.event.remove();
                    //         console.log("Delete");
                    //         $("#modalModifyEvent").modal("hide");

                    //       }
                    //     }
                    //     else {
                    //       console.log("here");
                    //       firestore.collection('activities').where('groupID', '==', doc.data().groupID).get()
                    //         .then(function (querySnapshot) {
                    //           querySnapshot.forEach(function (docActivity) {
                    //             firestore.collection('activities').doc(docActivity.id).delete();
                    //             if (docActivity.data().idUser == docTeacher.data().idAdmin) {
                    //               calendar.getEventById(docActivity.id).remove();
                    //             }
                    //           });
                    //           $("#modalModifyEvent").modal("hide");

                    //         }).catch(function (err) {
                    //           console.log("Error: ", err);
                    //         });
                    //     }
                    //   }
                    //   else {
                    //     if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    //       console.log("no delete");
                    //     } else {
                    //       if (userCategory == "admin" || userCategory == 'teacher') {
                    //         firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                    //         query.delete();
                    //         console.log("Delete");
                    //       }
                    //       /* }); */
                    //       info.event.remove();
                    //       $('#modalModifyEvent').modal('hide');
                    //       console.log("Delete");
                    //     }
                    //   }





                    // });

                    //GOOD
                    $('#btnDeleteEvent').click(function () {


                      if (doc.data().groupID != undefined) {
                        // alert('la');
                        swal({
                          title: "Attention !",
                          text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                            console.log("oui je veux supprimer cet événement seulement");

                            firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                            query.delete();

                            /* }); */
                            info.event.remove();
                            console.log("Delete");
                            $("#modalModifyEvent").modal("hide");

                          }
                          else {
                            console.log("non je ne veux rien supprimer");
                          }
                        });
                      }


                      else {

                        swal({
                          title: "Attention !",
                          text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                            console.log("oui je veux supprimer cet événement seulement");

                            firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + docTeacher.data().idAdmin + "_" + doc.data().title).delete();
                            query.delete();

                            /* }); */
                            info.event.remove();
                            console.log("Delete");
                            $("#modalModifyEvent").modal("hide");

                          }
                          else {
                            console.log("non je ne veux rien supprimer");
                          }
                        });
                      }





                    });
                    ////////////////////////////////////////////////////////////////////////////

                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });


              }
              else {

                document.getElementById('btnVirtualRoomTeacher').style.display = 'none';

                var oldTitle = doc.data().title;
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
                // className.innerText = doc.data().classe;
                attendeesAdmin.innerHTML = '';
                selectModifyMatiere.innerHTML = '';
                // selectModifyClass.innerHTML = '';
                selectModifyStudent.innerHTML = '';


                firestore.collection('users').doc(doc.data().attendees).get()
                  .then(function (docAttendees) {
                    attendeesAdmin.innerHTML += '<p>' + docAttendees.data().firstName + ' ' + docAttendees.data().lastName + '</p>';
                    initModifyStudentSelection(docAttendees.data().instituteName, docAttendees.id, doc.data().title);
                    initModifyTeacherSelection(docAttendees.data().instituteName, doc.data().teacherID);
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });

                //Setting time inputs
                // modifiedEventTitle.value = info.event.title;
                $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
                $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
                $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
                // $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startRecur));



                //We check whether the event is recurring or not. We set according inputs depending on the case
                if (doc.data().groupID == undefined || doc.data().groupID == '') {
                  //Event is not recurrent, we don't display recurring section
                  $('select#selectModifyRecur').val('non');
                  document.getElementById('modifyRecurrenceSection').style.display = "none";
                  document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                  document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                  document.getElementById('selectModifyRecur').setAttribute('disabled', true);

                } else {
                  $('select#selectModifyRecur').val('oui');
                  document.getElementById('modifyRecurrenceSection').style.display = "block";
                  $('#modifyStartRecur').val(getTimeWithoutOffset(new Date(doc.data().startRecur)));
                  $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)));
                  document.getElementById('modifyStartRecur').setAttribute('disabled', true);
                  document.getElementById('modifyEndRecur').setAttribute('disabled', true);
                  document.getElementById('selectModifyRecur').setAttribute('disabled', true);



                }



                //We set description
                modifiedEventDescription.value = doc.data().description;

                //If description is empty we set placeholder
                if (info.event.description == undefined || info.event.description == "") {
                  modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
                }

                //We check corresponding activity type
                // $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
                // End filling up inputs
                // console.log($('select#selectModifyStudent').val());

                // initChapters();

                $('#formModifyEvent').submit(function (eve) {

                  eve.preventDefault();

                  document.getElementById('modifyLoadingGIF').style.display = 'block';
                  document.getElementById('modifyModalBody').style.display = 'none';

                  // var modifiedEventType = $("input[name='modifyEventType']:checked").val();
                  var newStartDate = Date.parse($('#modifyStartEvent').val());
                  var newEndDate = Date.parse($('#modifyEndEvent').val());

                  var e = document.getElementById("selectModifyStudent");
                  var attendeesName = e.options[e.selectedIndex].text;



                  if ($('select#selectModifyRecur').val() == "non") {
                    var modifyGroupID = firebase.firestore.FieldValue.delete();
                    var modifyStartRecur = firebase.firestore.FieldValue.delete();
                    var modifyEndRecur = firebase.firestore.FieldValue.delete();
                    var newColor;

                    if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                      newColor = '#5FCBDA';
                    }
                    else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                      newColor = '#5FCBDA';
                    }
                    else {
                      newColor = 'red';
                    }

                    if (doc.data().groupID != undefined) {
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

                          if (doc.data().title != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                // typeActivity: modifiedEventType,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName,
                                groupID: modifyGroupID,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.


                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();

                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              // typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName,
                              groupID: modifyGroupID,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }


                        }).catch(function (err) {
                          console.log("Error :", err);
                        });
                    }
                    else {
                      if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                        //In this case we should recreate the event for each affected user and delete their old activity




                        console.log("Case 1: We need to delete/recreate.");
                        // I. We deal with Admin's activity
                        firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                          .set({
                            idUser: user.uid,
                            // typeActivity: modifiedEventType,
                            id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                            eventColor: newColor,
                            startDate: newStartDate,
                            endDate: newEndDate,
                            title: $('select#selectModifyMatiere').val(),
                            editable: true,
                            soutien: true,
                            description: modifiedEventDescription.value,
                            attendees: $('select#selectModifyStudent').val(),
                            activityDone: false,
                            teacherID: $('select#selectModifyTeacher').val(),
                            attendeesName: attendeesName
                          },
                            {
                              merge: true
                            }).then(function () {
                              console.log("Admin's activity updated.");
                              info.event.remove();
                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });


                              //III. Now we deal with student's activity.

                              //First we need to delete old activities using oldAttendees.

                              firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                              //Now that we deleted students' old activities we can start creating new ones.



                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .set({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),

                                },
                                  {
                                    merge: true
                                  }).then(function () {
                                    query.delete();
                                    console.log("Old admin's event deleted");
                                    document.getElementById('modifyLoadingGIF').style.display = 'none';
                                    document.getElementById('modifyModalBody').style.display = 'block';
                                    $('#modalModifyEvent').modal("hide");
                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });

                            }).catch(function (err) {
                              console.log("Error while creating new event for Admin :", err);
                            });
                      }
                      else {
                        //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                        console.log("Case 2: Update only.")
                        //I. Update admin's activity
                        query.update({
                          idUser: user.uid,
                          // typeActivity: modifiedEventType,
                          id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                          eventColor: newColor,
                          startDate: newStartDate,
                          endDate: newEndDate,
                          title: $('select#selectModifyMatiere').val(),
                          editable: true,
                          soutien: true,
                          description: modifiedEventDescription.value,
                          attendees: $('select#selectModifyStudent').val(),
                          activityDone: false,
                          teacherID: $('select#selectModifyTeacher').val(),
                          attendeesName: attendeesName
                        }).then(function () {
                          console.log("Admin's activity is now updated.")
                          info.event.remove();

                          calendar.addEvent({
                            title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                            start: newStartDate,
                            end: newEndDate,
                            description: modifiedEventDescription.value,
                            id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                            color: newColor,
                            editable: true,
                            allDay: false
                          });




                          firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                            .update({
                              idUser: $('select#selectModifyStudent').val(),
                              // typeActivity: modifiedEventType,
                              id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: false,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),

                            }).then(function () {
                              console.log("Student document updated.");
                              document.getElementById('modifyLoadingGIF').style.display = 'none';
                              document.getElementById('modifyModalBody').style.display = 'block';
                              $('#modalModifyEvent').modal("hide");
                            }).catch(function (err) {
                              console.log("Error :", err);
                            });
                        }).catch(function (err) {
                          console.log("Error while updating admin's activity: ", err);
                        });
                      }
                    }



                  }
                  else {

                    swal({
                      title: "Attention !",
                      text: "Cet événément fait partie d'une récurrence. La modification ne s'appliquera que sur cette occurence seulement et sortira cette dernière de la récurrence existante.",
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
                        var modifyGroupID = firebase.firestore.FieldValue.delete();
                        var modifyStartRecur = firebase.firestore.FieldValue.delete();
                        var modifyEndRecur = firebase.firestore.FieldValue.delete();
                        var newColor;

                        if (document.getElementById('selectModifyStudent').value == 'xbGv5DaqQOZ5k0fnmqnjAh5PP493') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'b1wruUPst5RpH9Mo41p23RJjkWD3') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'M6DUKhAYvdXy3wXgBZoa94raWMf1') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'ItIfziT0xuRyzRJYH1khsLRBISR2') {
                          newColor = '#5FCBDA';
                        }
                        else if (document.getElementById('selectModifyStudent').value == 'w3urVbM08QMLFGo1YbsBqr5qnPo2') {
                          newColor = '#5FCBDA';
                        }
                        else {
                          newColor = 'red';
                        }

                        if (doc.data().groupID != undefined) {
                          //EVENT IS PART OF A RECURRENCE
                          if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldAttendees != $('select#selectModifyStudent').val()) {
                            //In this case we should recreate the event for each affected user and delete their old activity




                            console.log("Case 1: We need to delete/recreate.");
                            // I. We deal with Admin's activity
                            firestore.collection('activities').doc(user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val())
                              .set({
                                idUser: user.uid,
                                // typeActivity: modifiedEventType,
                                id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                eventColor: newColor,
                                startDate: newStartDate,
                                endDate: newEndDate,
                                title: $('select#selectModifyMatiere').val(),
                                editable: true,
                                soutien: true,
                                description: modifiedEventDescription.value,
                                attendees: $('select#selectModifyStudent').val(),
                                activityDone: false,
                                teacherID: $('select#selectModifyTeacher').val(),
                                attendeesName: attendeesName,
                                groupID: modifyGroupID,

                                startRecur: modifyStartRecur,
                                endRecur: modifyEndRecur
                              },
                                {
                                  merge: true
                                }).then(function () {
                                  console.log("Admin's activity updated.");
                                  info.event.remove();
                                  calendar.addEvent({
                                    title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                    start: newStartDate,
                                    end: newEndDate,
                                    description: modifiedEventDescription.value,
                                    id: user.uid + '_' + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                    color: newColor,
                                    editable: true,
                                    allDay: false
                                  });


                                  //III. Now we deal with student's activity.

                                  //First we need to delete old activities using oldAttendees.

                                  firestore.collection('activities').doc(oldAttendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();

                                  //Now that we deleted students' old activities we can start creating new ones.



                                  firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                    .set({
                                      idUser: $('select#selectModifyStudent').val(),
                                      // typeActivity: modifiedEventType,
                                      id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                      eventColor: newColor,
                                      startDate: newStartDate,
                                      endDate: newEndDate,
                                      title: $('select#selectModifyMatiere').val(),
                                      editable: false,
                                      soutien: true,
                                      description: modifiedEventDescription.value,
                                      attendees: $('select#selectModifyStudent').val(),
                                      activityDone: false,
                                      teacherID: $('select#selectModifyTeacher').val(),
                                      groupID: modifyGroupID,

                                      startRecur: modifyStartRecur,
                                      endRecur: modifyEndRecur
                                    },
                                      {
                                        merge: true
                                      }).then(function () {
                                        query.delete();
                                        console.log("Old admin's event deleted");
                                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                                        document.getElementById('modifyModalBody').style.display = 'block';
                                        $('#modalModifyEvent').modal("hide");
                                      }).catch(function (err) {
                                        console.log("Error :", err);
                                      });

                                }).catch(function (err) {
                                  console.log("Error while creating new event for Admin :", err);
                                });
                          }
                          else {
                            //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
                            console.log("Case 2: Update only.")
                            //I. Update admin's activity
                            query.update({
                              idUser: user.uid,
                              // typeActivity: modifiedEventType,
                              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                              eventColor: newColor,
                              startDate: newStartDate,
                              endDate: newEndDate,
                              title: $('select#selectModifyMatiere').val(),
                              editable: true,
                              soutien: true,
                              description: modifiedEventDescription.value,
                              attendees: $('select#selectModifyStudent').val(),
                              activityDone: false,
                              teacherID: $('select#selectModifyTeacher').val(),
                              attendeesName: attendeesName,
                              groupID: modifyGroupID,

                              startRecur: modifyStartRecur,
                              endRecur: modifyEndRecur
                            }).then(function () {
                              console.log("Admin's activity is now updated.")
                              info.event.remove();

                              calendar.addEvent({
                                title: attendeesName + " - " + $('select#selectModifyMatiere').val(),
                                start: newStartDate,
                                end: newEndDate,
                                description: modifiedEventDescription.value,
                                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyStudent').val() + "_" + $('select#selectModifyMatiere').val(),
                                color: newColor,
                                editable: true,
                                allDay: false
                              });




                              firestore.collection('activities').doc($('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val())
                                .update({
                                  idUser: $('select#selectModifyStudent').val(),
                                  // typeActivity: modifiedEventType,
                                  id: $('select#selectModifyStudent').val() + "_" + newStartDate + "_" + user.uid + "_" + $('select#selectModifyMatiere').val(),
                                  eventColor: newColor,
                                  startDate: newStartDate,
                                  endDate: newEndDate,
                                  title: $('select#selectModifyMatiere').val(),
                                  editable: false,
                                  soutien: true,
                                  description: modifiedEventDescription.value,
                                  attendees: $('select#selectModifyStudent').val(),
                                  activityDone: false,
                                  teacherID: $('select#selectModifyTeacher').val(),
                                  groupID: modifyGroupID,

                                  startRecur: modifyStartRecur,
                                  endRecur: modifyEndRecur
                                }).then(function () {
                                  console.log("Student document updated.");
                                  document.getElementById('modifyLoadingGIF').style.display = 'none';
                                  document.getElementById('modifyModalBody').style.display = 'block';
                                  $('#modalModifyEvent').modal("hide");
                                }).catch(function (err) {
                                  console.log("Error :", err);
                                });
                            }).catch(function (err) {
                              console.log("Error while updating admin's activity: ", err);
                            });
                          }
                        }
                        else {
                          //EVENT IS SINGULAR
                          firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                          query.delete();
                          console.log("Delete");
                          //We first delete old event.
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
                            console.log("Start n°" + i + " : ", newStartDate);
                            console.log("End n°" + i + " : ", newEndDate);

                            startArray.push(newStartDate);
                            endArray.push(newEndDate);

                          }

                          createRecurringEventsSoutien(user.uid, instituteName, userCategory, modifiedEventDescription.value, newColor, startArray, endArray, $('select#selectModifyMatiere').val(), $('select#selectModifyStudent').val(), $('select#selectModifyTeacher').val(), attendeesName, 0, uniqueID(), startRecur * 1000, endRecur * 1000, calendar);


                        }
                      }
                      else {
                        console.log("modif annulée");
                        document.getElementById('modifyLoadingGIF').style.display = 'none';
                        document.getElementById('modifyModalBody').style.display = 'block';
                      }
                    });



                  }




                });

                //GOOD
                $('#btnDeleteEvent').click(function () {


                  if (doc.data().groupID != undefined) {
                    // alert('la');
                    swal({
                      title: "Attention !",
                      text: "Cet événément fait partie d'une récurrence. Souhaitez-vous également supprimer les autres événéments à venir de la récurrence ?",
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
                        console.log("oui je veux supprimer les événements récurrents.");
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
                        console.log("non je ne veux pas supprimer toutes les récurrences alors");

                        setTimeout(function () {
                          swal({
                            title: "Attention !",
                            text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                              console.log("oui je veux supprimer cet événement seulement");
                              if (userCategory == "admin") {
                                firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                                query.delete();
                              }
                              /* }); */
                              info.event.remove();
                              console.log("Delete");
                              $("#modalModifyEvent").modal("hide");

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
                      text: "Êtes-vous sûr de vouloir supprimer cet événement?",
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
                        console.log("oui je veux supprimer cet événement seulement");
                        if (userCategory == "admin") {
                          firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                          query.delete();
                        }
                        /* }); */
                        info.event.remove();
                        console.log("Delete");
                        $("#modalModifyEvent").modal("hide");

                      }
                      else {
                        console.log("non je ne veux rien supprimer");
                      }
                    });
                  }





                });

                /* $('#btnDeleteEvent').click(function () {
 
                  if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
                    console.log("no delete");
                  } else {
 
 
                    if (userCategory == "admin") {
                    
                      firestore.collection('activities').doc(doc.data().attendees + "_" + doc.data().startDate + "_" + user.uid + "_" + doc.data().title).delete();
                      query.delete();
                      info.event.remove();
                      console.log("Delete");
                    }
                    
 
                  }
                  $("#modalModifyEvent").modal("hide");
                }); */
              }


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



