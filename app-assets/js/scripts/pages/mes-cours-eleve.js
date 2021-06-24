// //DEV
// var firebaseConfig = {
// 	apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
// 	authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
// 	databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
// 	projectId: "schoolplus-dev-e8a2d",
// 	storageBucket: "schoolplus-dev-e8a2d.appspot.com",
// 	messagingSenderId: "330523876306",
// 	appId: "1:330523876306:web:cbdcee87b7e3e007"
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

//HTML VARIABLES
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const tabMatieres = document.getElementById('tabMatieres');
const selectedClass = document.getElementById('selectClass');
const selectedMatiere = document.getElementById('selectMatiere');
const modifyChapitreNumber = document.getElementById('modifyChapitreNumber');
const modifyChapitreName = document.getElementById('modifyChapitreName');
const modifyExpectedSkills = document.getElementById('modifyExpectedSkills');
const modifyChallenges = document.getElementById('modifyChallenges');
const modifyEndDate = document.getElementById('modifyEndDate');
const manuelLink = document.getElementById('manuelLink');

const modifyChapitreNumber2 = document.getElementById('modifyChapitreNumber2');
const modifyChapitreName2 = document.getElementById('modifyChapitreName2');
const coursToDoList = document.getElementById('coursToDoList');
const exercicesToDoList = document.getElementById('exercicesToDoList');
const modifyEndDate2 = document.getElementById('modifyEndDate2');

const chapitreNumber = document.getElementById('chapitreNumber');
const sectionPDFCours = document.getElementById('sectionPDFCours');
const sectionPDFCours2 = document.getElementById('sectionPDFCours2');
const sectionPDFExercices2 = document.getElementById('sectionPDFExercices2');
const btnOpenPDFCours = document.getElementById('btnOpenPDFCours');
const btnOpenPDFExercices = document.getElementById('btnOpenPDFExercices');

const sectionPDFExercices = document.getElementById('sectionPDFExercices');
const pdfCours = document.getElementById('pdfCours');
const pdfExos = document.getElementById('pdfExos');

const parameters = location.search.substring(1).split("&");
const temp = parameters[0].split("=");
const matiereValue = decodeURI(temp[1]);
var userLevel;

document.getElementById('subjectTitle').innerHTML = '<i class="fas fa-book"></i> ' + matiereValue;

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        userLevel = doc.data().classe;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');
        /* Group of functions for mail tool */
        var array = [];
        initFilteredStudentList(array);
        initMessageForm(doc.data().userCategory);
        initLevelList(doc.data().idAdmin);
        initTeacherList(doc.data().instituteName);
        initParentList(doc.data().instituteName);
        initAdminList(doc.data().instituteName);
        /* End of functions for mail tool */
        // getUserNotif();
        // getStoredData();

        // var todayDate = Date.now();
        // console.log(todayDate);
        // var tomorrowDate = 1594929600000;
        // // console.log((new Date(tomorrowDate)).getTime());

        // var DifferenceTime = tomorrowDate - todayDate;
        // console.log(DifferenceTime);

        // var DifferenceDays = DifferenceTime / (1000*3600*24);
        // console.log(DifferenceDays);
        if (doc.data().userCategory == 'student') {
          initChapters(doc.data().instituteName, doc.data().classe, doc.data().firstName, doc.data().lastName, matiereValue, user.uid);
        }
        else if (doc.data().userCategory == 'parent') {
          firestore.collection('users').doc(doc.data().linkedAccount).get()
            .then(function (docStud) {
              initChapters(docStud.data().instituteName, docStud.data().classe, docStud.data().firstName, docStud.data().lastName, matiereValue, docStud.id);

            }).catch(function (err) {
              console.log("Error : ", err);
            });
        }

        // setUserInterface(doc.data().userCategory);

        // setModificationList(doc.data().instituteName);
      } else {
        firebase.auth().signOut();
        location.href = "../../pages/fr/login.php";
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
  //alert('je veux déco');
  firebase.auth().signOut().then(function () {
    localStorage.removeItem('data');
    localStorage.removeItem('dataSubjects');
    location.href = "../../pages/fr/login.php";

  });
});

/* $('body[data-open="hover"] .dropdown').on('mouseenter', function () {
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
}); */

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
    }//ZC57kLf1XpUOXh9QJUNDKS2pMgg1

    // document.getElementById('virtualClass').setAttribute('href', '#');



    manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });



    console.log(doc.data().classe);
    /* for (var i = 0; i < doc.data().matieres.length; i++) {
      selectedMatiere.selectize.addOption({ value: doc.data().matieres[i].matiere, text: doc.data().matieres[i].matiere });
      var $select = $('select#selectMatiere').selectize();
      var control = $select[0].selectize;
      control.clear();
    } */

    /* 
    firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', doc.data().instituteName).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc2) {
        firestore.collection('users').doc(doc2.data().id).collection('classes').doc(doc.data().classe).get()
        .then(function(doc3) {
          for(var i = 0; i<doc3.data().matieres.length; i++)
          {
            
          }
        }).catch(function(err) {
          console.log("Error ",err);
        }); 
        
      });
    }).catch(function(err) {
      console.log("Error : ", err);
    }); */




  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

function setUserInterface(userCategory, soutien, userId, instituteName) {
  var navMenu = document.getElementById('main-menu-navigation')
  if (soutien == true) {
    //VERY IMPORTANT : we assume teacher won't be present in the "soutien" version, therefore this case will not be dealed with
    switch (userCategory) {
      case 'student':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard-soutien.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Réserver un cours de soutien</span></a></li><li data-menu="dropdown" class="dropdown nav-item" style="display: none;"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleve-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Suivi de mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        document.getElementById('virtualClass').setAttribute('href', '#');


        break;
      case 'admin':
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu=""><a href="create-classes.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Classes</span></a></li>';
        var nav3 = '<li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';
        var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        var nav6 = '</ul></li>';
        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu=""><a href="create-user-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;
        // var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        // var right3 = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        var right4 = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';

        rightMenu.innerHTML =/*  right1 + */ right2 +/*  right3 +  */right4;
        break;

      case 'teacher':
        /*  var nav1 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
         var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
         var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
         var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
         var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
         var nav6 = '</ul></li>'; */

        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion ESTIA</span></a>';
        var nav8 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboard-soutien.php" class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="contenu-cours-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Suivi des cours</span></a></li>';
        var nav10 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="bilan-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" ><i class="fab fa-chromecast"></i><span data-i18n="nav.dash.main">Salles de classe</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';
        var nav12 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" id="userVirtualRoom"target="_blank" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Rejoindre ma classe virtuelle</span></a></li>';
        navMenu.innerHTML =/*  nav1 + nav2 + nav3 + nav4 + nav5 + nav6 +  *//* nav7 + */ nav8 + nav9 + nav10 + nav11 + nav12;
        // rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        rightMenu.innerHTML = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

        setTeachersVirtualClasses(instituteName);


        break;

    }
  }
  else {
    switch (userCategory) {
      case 'student':
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="select-modules.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes modules</span></a></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning personel</span></a></li>';


   
        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5/*++ nav4bis + nav5 + nav6  nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';


        document.getElementById('rightMenu').innerHTML = right1;


        break;
      case 'parent':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php"  class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';


        document.getElementById('virtualClass').setAttribute('href', '#');
        break;
      case 'admin':
        console.log("here");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-user"></i><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Valider l\'inscription des utilisateurs</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Mes formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-formation.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Consulter, ajouter ou éditer</span></a></li><li data-menu=""><a href="mes-outils.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-outils-scratch.php"  class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Bibliothèque</span></a></li>';
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4bis + nav5 + nav6 /*+ nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Mes apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Mes organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3;
        break;
      case 'teacher':
        console.log("formateur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Mes formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-formation.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Consulter, ajouter ou éditer</span></a></li><li data-menu=""><a href="mes-outils.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-outils-scratch.php"  class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Bibliothèque</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5;

        rightMenu.innerHTML = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        // rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        // setTeachersVirtualClasses(instituteName);
        break;
      case 'author':
        console.log("auteur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        // var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Contenu pédagogique</span></a><ul class="dropdown-menu"><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Création de contenu</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Vidéos</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Texte</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Questionnaire</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Enregistrement</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Contenu créé</span></a></li></ul></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer une nouvelle formation</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Formations en cours</span></a></li></ul></li>';
        // var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2/*  + nav3 + nav4 + nav5 */;

        rightMenu.innerHTML = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';

        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        // rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';

        // setTeachersVirtualClasses(instituteName);
        break;

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
      console.log(Object.keys($this));
      if ($this.hasClass('dropdown-toggle')) {
        return false;
      }
    }
  });

  /* if(userCategory =="student")
  {
    console.log("hello");
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="teacher")
  {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="admin")
  {
    
    if(instituteCategory == "college" || instituteCategory == "lycee")
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-classes.php" class="nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Créer une classe</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="contenu-cours.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    } else if(instituteCategory == "soutien") 
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';
    }
    
  } */
}


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


function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function getSmileyValue(smileyValue) {

  switch (smileyValue) {
    case 'sad':
      return 0;
    case 'neutral':
      return 0.5;
    case 'happy':
      return 1;
  }

}

function setProgressBar(progressId, completionId, progressValue) {

  // console.log(progressId+ " /// "+somme+" /// "+effectif);

  // console.log(pourcentage+"%");
  console.log(progressId);
  console.log("PROGRESS VALUE: ", progressValue);

  if (!isNaN(progressValue)) {
    document.getElementById(progressId).value = progressValue;
    document.getElementById(completionId).innerHTML = progressValue + "%";

    if (progressValue == 100) {
      document.getElementById(progressId).className = 'progress progress-md progress-success progress';
    }
  }
  else {
    document.getElementById(progressId).value = 0;
    document.getElementById(completionId).innerHTML = 0 + "%";
  }


}

/* $('select#selectMatiere').on('change', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      document.getElementById('basicContainer').innerHTML = "";
      initChapters(doc.data().instituteName, doc.data().classe, doc.data().firstName, doc.data().lastName);
    }).catch(function (err) {
      console.log("Error : ", err);
    });

}); */

function downloadSubject(numeroChapitre, isOldChapter) {
  console.log(isOldChapter)
  var hasCreatedEval = false;
  var nomMatiere = matiereValue;
  if (nomMatiere.indexOf(' ') >= 0) {
    // console.log("true");
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  // console.log("ICI :" + nomMatiere);

  var newNumeroChapitre = numeroChapitre.trim();
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    // console.log("true");
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {

      if (doc.data().userCategory == 'student') {
        if (isOldChapter == 'true') {
          var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().idAdmin + '_' + nomMatiere + '_' + doc.data().classe + '_' + newNumeroChapitre + '.pdf';

        }
        else {
          var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().idAdmin + '_' + newNumeroChapitre + '.pdf';

        }
        // alert("Sujet url : "+sujetUrl);

        firebase.storage().ref(sujetUrl).getDownloadURL().then(function (url) {
          window.open(url, '_blank');
        }).catch(function (err) {

          console.log("Error: ", err);
          // alert("Erreur, le fichier n'a pas pu être téléchargé.");
          console.log("Le fichier n'a pas pu être téléchargé, nous devons donc tester sa présence dans les createdContent");

          console.log(numeroChapitre);
          firestore.collection('users').doc(doc.data().idAdmin).collection('classes').doc(doc.data().classe).collection(matiereValue).doc(numeroChapitre).get()
            .then(function (docChapter) {
              console.log("INSIDE");

              firestore.collection('users').doc(doc.data().idAdmin).collection('classes').doc(doc.data().classe).collection(matiereValue).doc(numeroChapitre).collection('uploadedFiles').get()
                .then(function (querySnapshot2) {
                  querySnapshot2.forEach(function (docUpload) {
                    var html1 = '<div class="col-12"><a href="';
                    var html2 = '" target="_blank"><h4>'
                    var html3 = '</h4></a></div>';
                    var tot = html1 + docUpload.data().urlStorage + html2 + docUpload.data().fileName + html3;
                    if (docUpload.data().category == 'eval') {
                      // document.getElementById('evalContainer').innerHTML += tot;
                      document.getElementById('showContentEval' + newNumeroChapitre).innerHTML += tot;

                      document.getElementById('showContentEval' + newNumeroChapitre).style.display = 'block';
                      hasCreatedEval = true;
                    }
                    else if (docUpload.data().category == 'eval2') {
                      // document.getElementById('eval2Container').innerHTML += tot;
                      document.getElementById('showContentEval' + newNumeroChapitre).innerHTML += tot;

                      document.getElementById('showContentEval' + newNumeroChapitre).style.display = 'block';
                      hasCreatedEval = true;
                    }
                  });
                }).catch(function (err) {
                  console.log("Error :", err);
                });

              if (docChapter.data().createdContent != undefined) {
                console.log('it isnt undefined')
                docChapter.data().createdContent.forEach(function (elem) {
                  console.log(elem.contentType);
                  if (elem.contentType == 'evaluation') {
                    console.log("there is an eval we can display");
                    //HERE FILL IN THE HTML + DISPLAY
                    /* header */
                    var html1 = '<div id="heading';
                    var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                    var html3 = '" aria-expanded="false" aria-controls="accordion';
                    var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                    /* title here */
                    var html4bis = '</a></div>';

                    /* body */
                    var html5 = '<div id="accordion';
                    var html6 = '" role="tabpanel" aria-labelledby="heading';
                    var html7 = '" class="collapse" style="">';
                    var html8 = '<div class="card-content"><div class="card-body">';
                    /* text here */
                    var html9 = '</div></div></div>'

                    var total = html1 + newNumeroChapitre + html2 + newNumeroChapitre + html3 + newNumeroChapitre + html4 + elem.title + html4bis + html5 + newNumeroChapitre + html6 + newNumeroChapitre + html7 + html8 + elem.content + html9
                    document.getElementById('showContentEval' + newNumeroChapitre).innerHTML = total;

                    document.getElementById('showContentEval' + newNumeroChapitre).style.display = 'block';
                    hasCreatedEval = true;
                  }
                })

                if (!hasCreatedEval) {
                  alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
                }
              }
              else {
                alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
              }
            }).catch(function (err) {
              console.log("Error: ", err);
            });


        });
      }
      else if (doc.data().userCategory == 'parent') {

        firestore.collection('users').doc(doc.data().linkedAccount).get()
          .then(function (docStud) {
            if (isOldChapter == 'true') {
              var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + docStud.data().idAdmin + '_' + nomMatiere + '_' + docStud.data().classe + '_' + newNumeroChapitre + '.pdf';

            }
            else {
              var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + docStud.data().idAdmin + '_' + newNumeroChapitre + '.pdf';

            }
            // alert("Sujet url : "+sujetUrl);

            firebase.storage().ref(sujetUrl).getDownloadURL().then(function (url) {
              window.open(url, '_blank');
            }).catch(function (err) {
              console.log("Error: ", err);
              // alert("Erreur, le fichier n'a pas pu être téléchargé.");
              console.log("Le fichier n'a pas pu être téléchargé, nous devons donc tester sa présence dans les createdContent");

              console.log(numeroChapitre);
              firestore.collection('users').doc(docStud.data().idAdmin).collection('classes').doc(docStud.data().classe).collection(matiereValue).doc(numeroChapitre).get()
                .then(function (docChapter) {
                  console.log("INSIDE");
                  if (docChapter.data().createdContent != undefined) {
                    console.log('it isnt undefined')
                    docChapter.data().createdContent.forEach(function (elem) {
                      console.log(elem.contentType);
                      if (elem.contentType == 'evaluation') {
                        console.log("there is an eval we can display");
                        //HERE FILL IN THE HTML + DISPLAY
                        /* header */
                        var html1 = '<div id="heading';
                        var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                        var html3 = '" aria-expanded="false" aria-controls="accordion';
                        var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                        /* title here */
                        var html4bis = '</a></div>';

                        /* body */
                        var html5 = '<div id="accordion';
                        var html6 = '" role="tabpanel" aria-labelledby="heading';
                        var html7 = '" class="collapse" style="">';
                        var html8 = '<div class="card-content"><div class="card-body">';
                        /* text here */
                        var html9 = '</div></div></div>'

                        var total = html1 + newNumeroChapitre + html2 + newNumeroChapitre + html3 + newNumeroChapitre + html4 + elem.title + html4bis + html5 + newNumeroChapitre + html6 + newNumeroChapitre + html7 + html8 + elem.content + html9
                        document.getElementById('showContentEval' + newNumeroChapitre).innerHTML = total;

                        document.getElementById('showContentEval' + newNumeroChapitre).style.display = 'block';
                        hasCreatedEval = true;
                      }
                    })
                    if (!hasCreatedEval) {
                      alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
                    }
                  }
                  else {
                    alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
                  }
                }).catch(function (err) {
                  console.log("Error: ", err);
                });


            });
          }).catch(function (err) {
            console.log("Error: ", err);
          });


      }



    }).catch(function (err) {
      console.log("Error: ", err);
    });


}

function downloadCorrection(numeroChapitre, isOldChapter) {
  console.log(isOldChapter);
  var nomMatiere = matiereValue;
  if (nomMatiere.indexOf(' ') >= 0) {
    // console.log("true");
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  // console.log("ICI :" + nomMatiere);

  var newNumeroChapitre = numeroChapitre.trim();
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    // console.log("true");
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      if (docUser.data().userCategory == 'student') {
        if (isOldChapter == 'true') {
          var sujetCorrectionUrl = 'sujets_corriges/' + docUser.data().instituteName + '/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';
          firebase.storage().ref(sujetCorrectionUrl).getDownloadURL().then(function (url) {
            window.open(url, '_blank');
          }).catch(function (err) {
            console.log("Error: ", err);
            alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
          });
        }
        else {
          var sujetCorrectionUrl = 'sujets_corriges/' + docUser.data().instituteName + '/' + docUser.data().idAdmin + '_' + newNumeroChapitre + '.pdf';
          firebase.storage().ref(sujetCorrectionUrl).getDownloadURL().then(function (url) {
            window.open(url, '_blank');
          }).catch(function (err) {
            console.log("Error: ", err);
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(numeroChapitre).collection('uploadedFiles').get()
              .then(function (querySnapshot2) {
                querySnapshot2.forEach(function (docUpload) {
                  var html1 = '<div class="col-12"><a href="';
                  var html2 = '" target="_blank"><h4>'
                  var html3 = '</h4></a></div>';
                  var tot = html1 + docUpload.data().urlStorage + html2 + docUpload.data().fileName + html3;
                  if (docUpload.data().category == 'corrigesEval') {
                    // document.getElementById('evalCorrectionError2').style.display ='none'
                    document.getElementById('corrigesEvalContainer').innerHTML += tot;

                    window.open(docUpload.data().urlStorage, '_blank');

                  }
                });
              }).catch(function (err) {
                console.log("Error :", err);
              });
          });
        }
        //

      }
      else if (docUser.data().userCategory == 'parent') {

        firestore.collection('users').doc(docUser.data().linkedAccount).get()
          .then(function (docStud) {

            if (isOldChapter == 'true') {
              var sujetCorrectionUrl = 'sujets_corriges/' + docStud.data().instituteName + '/' + docStud.data().idAdmin + '_' + nomMatiere + '_' + docStud.data().classe + '_' + newNumeroChapitre + '.pdf';

            }
            else {
              var sujetCorrectionUrl = 'sujets_corriges/' + docStud.data().instituteName + '/' + docStud.data().idAdmin + '_' + newNumeroChapitre + '.pdf';

            }
            //
            firebase.storage().ref(sujetCorrectionUrl).getDownloadURL().then(function (url) {
              window.open(url, '_blank');
            }).catch(function (err) {
              console.log("Error: ", err);
              alert("Une erreur est survenue. Le fichier n'a pas pu être téléchargé ou n'est pas présent sur la plateforme.");
            });

          }).catch(function (err) {
            console.log("Error: ", err);
          });

      }
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

function selectOtherSubject() {
  window.location.href = "../../pages/fr/select-modules.php";
}

function initChapters(instituteName, classe, firstName, lastName, subject, ID) {
  var user = auth.currentUser;
  console.log(subject);
  var totalTime = 0;
  var chapterCount = 0;
  var chapterDuration = 0;
  var currentChapter = 0;
  const yearStartDate = 1599033600; //02/09/2020 à 08:00
  const yearEndDate = 1626465600; //16/07/20 à 20:00
  const yearDuration = 21427200; //8 months
  const nbOfWeeks = 32; // taken on the 2019-2020 school calendar
  var currentProgress = 0;

  var blabla = [];


  var progressIds = [];
  var completionIds = [];
  var arrayUrls = [];
  var arraySomme = [];
  var arrayEffectif = [];

  var arraySubjectUrls = [];
  var arrayBtnIds = [];
  var arrayBtnCorrection = [];
  var arrayEvalUnlocked = [];
  var arrayEvalLink = [];
  var arrayBtnShowIds = [];
  var arrayNotes = [];
  var arrayChapters = [];

  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"

  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive' style='display: none;'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time' id='remainingTime_";

  var sponshtml5 = "'></th></tr></table></div><h6 class='card-title text-bold-600'>Compétences attendues</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p>";

  var sponshtml7 = "<p> </p><h6 class='card-title text-bold-600'>Progression</h6><p> </p><div style='text-align:center;'><div class='help-block text-bold-600 danger font-small-3'  text-align:center' id='messageCalcul";
  var sponshtml8 = "'>Calcul de la progression en cours...</div></div><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'id='";
  var sponshtml9 = "'></span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress' ";
  var sponshtml10 = "></progress></div><div class='table-responsive'><table style='width:100%;text-align: center;'><tr><td style='width:33%;'><h6 class='card-title' style='float: left;'>0%: Thème à faire</h6></td><td style='width:33%;'><h6 class='card-title'>90%: Acquis d'apprentissage</h6></td><td style='width:33%;'><h6 class='card-title' style='float: right;'>100%: Acquis d'apprentissage et évalué</h6></td></tr></table></div></div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='25%' style='text-align: center'><button class='btn bg-cyan btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml11 = "' type='button'  name='";

  var sponshtml12 = "' onclick='toDoList(\"";
  var sponshtml13 = "\")'; id='btnCoursExos";
  var sponshtml14 = "' disabled>Accéder aux ressources</button></div></th><th width ='25%' style='text-align:center;'>";
  var sponshtml15 = "<button type='button' class='btn bg-cyan btn-min-width text-bold-600'  style='display:none;' id='";
  var sponshtml16 = "'onClick='downloadSubject(\"";
  var sponshtml17 = "\",\"";
  var sponshtml17bis = "\")'>Voir l'évaluation</button></th><th width ='25%' style='text-align:center;'><button type='button'  disabled class='btn bg-cyan btn-min-width text-bold-600'  style='display:none;' id='";
  var sponshtmlA = "'onClick='downloadCorrection(\"";
  var sponshtmlAbis = "\",\"";
  var sponshtmlB = "\")'>Voir la correction</button></th><th width='25%' style='text-align: center'><button type='button' style='display:none;' class='btn bg-cyan btn-min-width text-bold-600' onClick='handBackExams(\"";

  var sponshtml18 = "\")'id='";
  var sponshtml19 = "'>Déposer un devoir</button></th></tr></table></div><div class='card collapse-icon accordion-icon-rotate' style='display:none;' id='showContentEval";
  var sponshtml20 = "'></div></div></div></div></div>";





  var html = "";

  // init chapters HTML for display 
  firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        firestore.collection('users').doc(doc.data().id).collection('classes').doc(classe).collection(subject).orderBy("order", "asc").get()
          .then(function (querySnapshot2) {
            chapterCount = querySnapshot2.size;
            querySnapshot2.forEach(function (doc2) {
              if (doc2.id == "duration") {
                chapterDuration = Math.round(doc2.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
              }
              else {

                if (doc2.data().numeroChapitre != undefined || doc2.data().authorId != undefined) {
                  if (doc2.id != 'duration') {
                    // console.log("NUMERO CHAPITRE :", doc2.data().numeroChapitre);
                    //Here I need to compute my progression

                    var somme = 0;
                    var effectif = 0;

                    var checkForEval = true;

                    // console.log("COURS LENGTH :", doc2.data().cours.length);


                    if (doc2.data().createdContent != undefined) {
                      if (doc2.data().createdContent.length > 0) {
                        doc2.data().createdContent.forEach(function (elemContent) {
                          if (elemContent.contentType != 'evaluation') {
                            if (elemContent.suivi != undefined) {
                              //Meaning every content except eval
                              var isPres = false;
                              elemContent.suivi.forEach(function (elemSuivi) {
                                if (elemSuivi.studentId == ID) {
                                  isPres = true;
                                  // alert("heyre");
                                  if (getSmileyValue(elemSuivi.avancement) == 0) {
                                    checkForEval = false;
                                  }
                                  somme += getSmileyValue(elemSuivi.avancement);
                                  effectif++;

                                  console.log("DOC ID: ", doc2.id);
                                  console.log("SOMME : ", somme);
                                  console.log("EFFECTIF : ", effectif);
                                }
                              });
                              // if(isPres)
                            }
                          }

                        });
                      }
                    }
                    /* test */
                    firestore.collection('users').doc(doc.data().id).collection('classes').doc(classe).collection(matiereValue).doc(doc2.id).collection('createdContent').get()
                      .then(function (querySnapshot3) {
                        if (querySnapshot3.size > 0) {
                          querySnapshot3.forEach(function (docContent) {
                            docContent.data().suivi.forEach(function (elem) {
                              if (elem.studentId == ID) {
                                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                                console.log(doc2.data().numeroChapitre);
                                console.log(docContent.data().title);
                                console.log(elem.avancement);
                                somme += (getSmileyValue(elem.avancement));
                                blabla.push(docContent.data().title + '  // ' + elem.avancement);
                                effectif++;
                              }
                            });
                          })
                        }

                      }).catch(function (err) {
                        console.log("Error: ", err);
                      })


                    arrayChapters.push(doc2.id);



                    var nomMatiere = subject;
                    if (nomMatiere.indexOf(' ') >= 0) {
                      // console.log("true");
                      nomMatiere = nomMatiere.replace(/\s+/g, '-');
                    }

                    nomMatiere = nomMatiere.replace('é', 'e');
                    nomMatiere = nomMatiere.replace('è', 'e');
                    // console.log("ICI :" + nomMatiere);

                    var newNumeroChapitre = doc2.id.trim();
                    if (newNumeroChapitre.indexOf(' ') >= 0) {
                      // console.log("true");
                      newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                    }

                    //
                    var newFirstName = firstName.substring(0, 1);
                    var fullName = newFirstName + lastName;
                    // console.log(fullName);

                    /* POSER LA CONDITION OLD ICI */

                    if (doc2.data().oldChapter) {
                      var evalUrl = "devoirs_ecrits/" + doc.data().instituteName + "/" + doc.data().id + "_" + fullName + "_" + nomMatiere + "_" + classe + "_" + newNumeroChapitre + ".pdf"
                      var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + "/" + doc.data().id + '_' + nomMatiere + '_' + classe + '_' + newNumeroChapitre + '.pdf';

                      console.log("THIS IS BLABLA ARRAY FOR CHAPTER :" + doc2.id);
                      console.log(blabla);

                      //Student eval
                      progressIds.push('progress' + newNumeroChapitre);
                      completionIds.push('completion' + newNumeroChapitre);
                      arrayUrls.push(evalUrl);
                      arraySomme.push(somme);
                      arrayEffectif.push(effectif);

                      //Eval subject
                      arraySubjectUrls.push(sujetUrl);
                      arrayBtnIds.push('btn' + newNumeroChapitre);
                      arrayBtnShowIds.push('show' + newNumeroChapitre);
                      arrayBtnCorrection.push('showCorrection' + newNumeroChapitre);

                      //Eval Unlocked
                      arrayEvalUnlocked.push(doc2.data().evalUnlocked);

                      //Notes
                      arrayNotes.push(doc2.data().notes);


                      html = sponshtml1 + doc2.data().title + sponshtml3 + doc2.id + sponshtml4 + newNumeroChapitre + sponshtml5 + doc2.data().competences + sponshtml6
                        + sponshtml7 + newNumeroChapitre + sponshtml8 + "completion" + newNumeroChapitre + sponshtml9 + "id='progress" + newNumeroChapitre + "'" + sponshtml10 + "doc2.id" + sponshtml11 + doc2.id + sponshtml12 + doc2.id + sponshtml13 + newNumeroChapitre + sponshtml14 + sponshtml15 + 'show' + newNumeroChapitre/* doc2.id */ + sponshtml16 + doc2.id + sponshtml17 + true + sponshtml17bis + 'showCorrection' + newNumeroChapitre + sponshtmlA + doc2.id + sponshtmlAbis + true + sponshtmlB + doc2.id + sponshtml18 + 'btn' + newNumeroChapitre + sponshtml19 + newNumeroChapitre + sponshtml20;
                      addElement('basicContainer', 'div', html);
                    }
                    else {
                      var evalUrl = "devoirs_ecrits/" + doc.data().instituteName + "/" + doc.data().id + "_" + fullName + "_" + nomMatiere + "_" + classe + "_" + newNumeroChapitre + ".pdf"
                      var sujetUrl = 'sujets_evaluations/' + doc.data().instituteName + "/" + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                      console.log("THIS IS BLABLA ARRAY FOR CHAPTER :" + doc2.id);
                      console.log(blabla);

                      //Student eval
                      progressIds.push('progress' + newNumeroChapitre);
                      completionIds.push('completion' + newNumeroChapitre);
                      arrayUrls.push(evalUrl);
                      arraySomme.push(somme);
                      arrayEffectif.push(effectif);

                      //Eval subject
                      arraySubjectUrls.push(sujetUrl);
                      arrayBtnIds.push('btn' + newNumeroChapitre);
                      arrayBtnShowIds.push('show' + newNumeroChapitre);
                      arrayBtnCorrection.push('showCorrection' + newNumeroChapitre);

                      //Eval Unlocked
                      arrayEvalUnlocked.push(doc2.data().evalUnlocked);

                      //Notes
                      arrayNotes.push(doc2.data().notes);


                      html = sponshtml1 + doc2.data().title + sponshtml3 + doc2.id + sponshtml4 + newNumeroChapitre + sponshtml5 + doc2.data().competences + sponshtml6
                        + "" + sponshtml7 + newNumeroChapitre + sponshtml8 + "completion" + newNumeroChapitre + sponshtml9 + "id='progress" + newNumeroChapitre + "'" + sponshtml10 + "doc2.id" + sponshtml11 + doc2.id + sponshtml12 + doc2.id + sponshtml13 + newNumeroChapitre + sponshtml14 + sponshtml15 + 'show' + newNumeroChapitre/* doc2.id */ + sponshtml16 + doc2.id + sponshtml17 + false + sponshtml17bis + 'showCorrection' + newNumeroChapitre + sponshtmlA + doc2.id + sponshtmlAbis + false + sponshtmlB + doc2.id + sponshtml18 + 'btn' + newNumeroChapitre + sponshtml19 + newNumeroChapitre + sponshtml20;
                      addElement('basicContainer', 'div', html);
                    }


                    /* FIN CONDITION OLD */

                  }
                }

              }
            });



            var arrayForDuration = [];
            console.log(progressIds);
            var progressJsonArray = [];
            getProgressionFromJson(ID, doc.data().id, subject, classe, arrayChapters, progressJsonArray, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, 0);
            // computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, 0);

            // checkSubjectPresenceCallback(arraySubjectUrls, arrayBtnIds, 0);
            // checkEvalPresenceCallback(arrayForDuration,progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, 0);
            // update progress bar

            // update remaining time
            if (chapterDuration != 0)
              chapterCount--;

            var chapterNormalDuration = yearDuration / chapterCount; // get chapter normal duration in s
            var timeElapsed = Date.now() / 1000 - yearStartDate;
            var classCurrentChapter = Math.trunc(timeElapsed / chapterNormalDuration);
            var durationRemaining = Math.trunc((chapterNormalDuration * (classCurrentChapter + 1) - timeElapsed) / (60 * 60 * 24));

          }).catch(function (err) {
            console.log("Error :", err);
          });
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function getProgressionFromJson(ID, IDAdmin, subject, classe, arrayChapters, progressJsonArray, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index) {
  if (index < progressIds.length) {
    console.log(arrayChapters);
    firestore.collection('users').doc(IDAdmin).collection('classes').doc(classe).collection(subject).doc(arrayChapters[index]).collection('createdContent').get()
      .then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(function (docContent) {
            docContent.data().suivi.forEach(function (elem) {
              if (elem.studentId == ID) {
                console.log(arrayChapters[index]);
                console.log(docContent.data().title);
                console.log(elem.avancement);
                arraySomme[index] += (getSmileyValue(elem.avancement));
                arrayEffectif[index]++;
              }
            });
          });
          index++;
          getProgressionFromJson(ID, IDAdmin, subject, classe, arrayChapters, progressJsonArray, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
        }
        else {
          console.log("No created content from Json");
          index++;
          getProgressionFromJson(ID, IDAdmin, subject, classe, arrayChapters, progressJsonArray, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);

        }
      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    console.log("done looking for json content");
    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, 0);
  }
}

function computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index) {

  // console.log(progressIds);
  // console.log(completionIds);
  // console.log(arrayUrls);
  // console.log(arraySomme);
  // console.log(arrayEffectif);
  // console.log(arraySubjectUrls);
  // console.log(arrayBtnIds);
  var user = auth.currentUser;

  if (index < progressIds.length) {
    // console.log(progressIds[index]);
    // console.log(arrayNotes);
    // console.log("HEY");
    // console.log(progressIds[index].substr(8));


    if (arrayNotes[index] != undefined) {
      //L'array note existe
      console.log("L'array note existe, je vais checker la valeur de la note.");
      var studentIsPresent = false;
      var theNote;
      arrayNotes[index].forEach(function (elem) {
        if (elem.id == ID) {
          studentIsPresent = true;
          theNote = elem.note
        }
      });

      if (studentIsPresent) {
        if (isNaN(theNote)) {
          console.log("La note n'est pas un nombre, je check si note == NaN ou note == NN");
          if (theNote == "NN") {
            console.log("La note est NN, je peux mettre la progression à 100% et afficher les boutons. Je dois checker la présence du sujet d'évaluation pour activer/désactiver le bouton.");
            setProgressBar(progressIds[index], completionIds[index], 100);
            arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 100 });
            firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
              console.log("Le sujet d'évaluation est présent, nous pouvons alors afficher et activer les boutons.");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
              document.getElementById(arrayBtnCorrection[index]).disabled = false;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function (err) {
              console.log("Le sujet d'évaluation n'est pas présent, nous pouvons alors afficher mais désactiver les boutons.");
              //update: tous les chapitres ont une eval normalement. Il se peut que l'éval soit donnée à la main et donc pas présente sur la plateforme
              //Dans ce cas on affiche quand même le bouton, clickable, et si l'user clique on affiche un message d'erreur comme quoi il n'est pas présent
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
              document.getElementById(arrayBtnCorrection[index]).disabled = false;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            });
          } else {
            console.log("La note est NaN. Ce qui signifie que l'élève n'a pas été noté. Nous devons alors reprendre la procédure en commençant par checker la présence de l'évaluation de l'étudiant.");
            firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
              console.log("L'évaluation de l'élève est présente, elle avait déjà été uploadée. Nous pouvons alors mettre la progression à 100% et checker la présence du sujet pour afficher et activer/désactiver les boutons.");
              setProgressBar(progressIds[index], completionIds[index], 100);
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 100 });
              firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                console.log("En plus que l'évaluation est présente, le sujet est présent, nous pouvons donc afficher et activer les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                document.getElementById(arrayBtnCorrection[index]).disabled = false;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              }).catch(function (err) {
                console.log("L'évaluation est présente mais le sujet ne l'est pas. Nous affichons donc le bouton sans l'activer.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                document.getElementById(arrayBtnCorrection[index]).disabled = false;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              });
            }).catch(function (err) {
              console.log("L'évaluation de l'élève n'est pas présente, nous devons donc checker si l'évaluation a été débloquée par le professeur dans un premier temps(i.e. un sujet est forcément présent)");
              if (arrayEvalUnlocked[index] == true) {

                firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                  console.log("Le sujet est là, on affiche le bouton");
                  console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé // UPDATE : plus maintenant car on peut débloquer le dépot de ddevoir pour n'importe quel chapitre. Nous devons don checker si le sujet est là pour la télécharger");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                  // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
                  console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
                  if (arrayEffectif[index] == 0) {
                    console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
                    //
                    index++;
                    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                  } else {
                    console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
                    var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                    var Ptotal = (Psmileys * 90) / 100;
                    console.log("Ptotal = ", Ptotal + " %");
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                    //
                    index++;
                    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                  }
                }).catch(function (err) {
                  console.log("Le sujet n'est pas là, on cache le bouton");
                  //update: tous les chapitres ont une eval normalement. Il se peut que l'éval soit donnée à la main et donc pas présente sur la plateforme
                  //Dans ce cas on affiche quand même le bouton, clickable, et si l'user clique on affiche un message d'erreur comme quoi il n'est pas présent
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                  // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
                  console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
                  if (arrayEffectif[index] == 0) {
                    console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
                    //
                    index++;
                    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                  } else {
                    console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
                    var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                    var Ptotal = (Psmileys * 90) / 100;
                    console.log("Ptotal = ", Ptotal + " %");
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                    //
                    index++;
                    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                  }
                })



              } else {
                console.log("L'évaluation n'a pas été débloquée, nous devons donc calculer la progression avant de pouvoir checker la présence du sujet et d'afficher les boutons correspondants.");
                console.log("Mais avant de calculer la progression, nous devons vérifier qu'il y a une TODO liste.");

                if (arrayEffectif[index] == 0) {
                  console.log("Il n'y a pas de TODO liste. La progression est donc à 0% et nous n'affichons pas les boutons car l'évaluation qu'elle soit présente ou pas, n'a pas été débloquée ni par le professeur, ni par l'élève.");
                  setProgressBar(progressIds[index], completionIds[index], 0);
                  arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
                  document.getElementById(arrayBtnIds[index]).style.display = "none";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                  document.getElementById(arrayBtnCorrection[index]).style.display = "none";

                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  index++;
                  computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                } else {
                  console.log("Il y a une TODO liste. Nous pouvons donc calculer la progression et déterminer si l'élève a débloqué son sujet.");
                  var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                  var Ptotal = (Psmileys * 90) / 100;
                  console.log("Ptotal = ", Ptotal + " %");

                  if (Ptotal == 90) {
                    console.log("La progression est égale à 90%, nous pouvons donc considérer que l'élève a débloqué lui-même son évaluation. Nous pouvons alors checker la présence du sujet.");
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                    firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                      console.log("La progression étant égale à 90% et le sujet étant présent, nous pouvons afficher et activer les boutons.");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                      // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                      //
                      index++;
                      computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                    }).catch(function (err) {
                      console.log("La progression est bien égale à 90% mais le sujet n'est pas là, nous n'affichons donc pas les boutons.");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                      // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                      document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                    });
                  } else if (Ptotal < 90) {
                    console.log("La progression est inférieure à 90%, nous pouvons donc simplement afficher la progression de l'élève sans afficher les boutons.");
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                    arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                    document.getElementById(arrayBtnIds[index]).style.display = "none";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                    document.getElementById(arrayBtnCorrection[index]).style.display = "none";

                    document.getElementById('showContentEval' + progressIds[index].substr(8)).style.display = 'none';
                    document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                  }
                }



              }
            });
          }
        } else {
          console.log("La note est présente et c'est un nombre. Nous pouvons donc mettre la progression à 100% et aller checker la présente du sujet pour afficher et activer/désactiver les boutons.");
          setProgressBar(progressIds[index], completionIds[index], 100);
          arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 100 });
          firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
            console.log("En plus que la note soit présente, le sujet l'est aussi, nous pouvons donc afficher les boutons et les activer.");
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            //
            index++;
            computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
          }).catch(function (err) {
            console.log("La note est présente mais pas le sujet, nous pouvons afficher les boutons mais les désactiver.");
            //see update
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            //
            index++;
            computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
          });
        }
      }
      else {
        console.log("Les notes n'ont pas encore été définies. Nous devons checker si l'évaluation de l'élève avait déjà été postée.");
        firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
          console.log("L'évaluation de l'élève est présente, nous pouvons mettre sa progression à 100% et checker la présence du sujet afin d'afficher et d'activer / désactiver les boutons.");
          setProgressBar(progressIds[index], completionIds[index], 100);
          arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 100 });
          firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
            console.log("L'évaluation de l'élève est présente ainsi que le sujet, nous pouvons alors afficher les boutons et les activer.");
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            //
            index++;
            computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
          }).catch(function (err) {
            console.log("L'évaluation de l'élève est présente mais pas le sujet, nous pouvons donc afficher les boutons et les désactiver.");
            //see update
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            //
            index++;
            computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
          });
        }).catch(function (err) {
          console.log("L'évaluation de l'élève n'est pas présente. Nous devons alors checker si l'évaluation a été débloquée avant de passer à la progression.");
          if (arrayEvalUnlocked[index] == true) {

            firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
              console.log("Sujet Présent");
              console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé. /// VOIR UPDATE");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
              // document.getElementById(arrayBtnCorrection[index]).disabled = false;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
              console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
              if (arrayEffectif[index] == 0) {
                console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
                setProgressBar(progressIds[index], completionIds[index], 0);
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              } else {
                console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
                var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                var Ptotal = (Psmileys * 90) / 100;
                console.log("Ptotal = ", Ptotal + " %");
                setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              }
            }).catch(function (err) {
              console.log("Sujet non présent");
              console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé. /// VOIR UPDATE");
              //see update
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
              // document.getElementById(arrayBtnCorrection[index]).disabled = false;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
              console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
              if (arrayEffectif[index] == 0) {
                console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
                setProgressBar(progressIds[index], completionIds[index], 0);
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              } else {
                console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
                var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                var Ptotal = (Psmileys * 90) / 100;
                console.log("Ptotal = ", Ptotal + " %");
                setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              }
            });



          } else {
            console.log("L'évaluation n'a pas été débloquée, nous devons donc calculer la progression avant de pouvoir checker la présence du sujet et d'afficher les boutons correspondants.");
            console.log("Mais avant de calculer la progression, nous devons vérifier qu'il y a une TODO liste.");
            console.log
            if (arrayEffectif[index] == 0) {
              console.log("Il n'y a pas de TODO liste. La progression est donc à 0% et nous n'affichons pas les boutons car l'évaluation qu'elle soit présente ou pas, n'a pas été débloquée ni par le professeur, ni par l'élève.");
              setProgressBar(progressIds[index], completionIds[index], 0);
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
              document.getElementById(arrayBtnIds[index]).style.display = "none";
              document.getElementById(arrayBtnShowIds[index]).style.display = "none";
              document.getElementById(arrayBtnCorrection[index]).style.display = "none";
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            } else {
              console.log("Il y a une TODO liste. Nous pouvons donc calculer la progression et déterminer si l'élève a débloqué son sujet.");
              var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
              var Ptotal = (Psmileys * 90) / 100;
              console.log("Ptotal = ", Ptotal + " %");

              if (Ptotal == 90) {
                console.log("La progression est égale à 90%, nous pouvons donc considérer que l'élève a débloqué lui-même son évaluation. Nous pouvons alors checker la présence du sujet.");
                setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                  console.log("La progression étant égale à 90% et le sujet étant présent, nous pouvons afficher et activer les boutons.");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                  // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  //
                  index++;
                  computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                }).catch(function (err) {
                  console.log("La progression est bien égale à 90% mais le sujet n'est pas là, nous n'affichons donc pas les boutons.");
                  console.log("Le sujet uploadé n'est pas là, nous devons vérifier si le sujet a été créé ou non.");
                  //see pdate
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                  // document.getElementById(arrayBtnCorrection[index]).disabled = false;

                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  index++;
                  computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
                });
              } else if (Ptotal < 90) {
                console.log("La progression est inférieure à 90%, nous pouvons donc simplement afficher la progression de l'élève sans afficher les boutons.");
                setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
                document.getElementById(arrayBtnIds[index]).style.display = "none";
                document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                document.getElementById(arrayBtnCorrection[index]).style.display = "none";
                document.getElementById('showContentEval' + progressIds[index].substr(8)).style.display = 'none';

                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              }
            }
          }
        });
      }
    } else {
      //L'array note n'existe pas
      console.log("Les notes n'ont pas encore été définies. Nous devons checker si l'évaluation de l'élève avait déjà été postée.");
      firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
        console.log("L'évaluation de l'élève est présente, nous pouvons mettre sa progression à 100% et checker la présence du sujet afin d'afficher et d'activer / désactiver les boutons.");
        setProgressBar(progressIds[index], completionIds[index], 100);
        arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 100 });
        firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
          console.log("L'évaluation de l'élève est présente ainsi que le sujet, nous pouvons alors afficher les boutons et les activer.");
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = false;
          document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
          document.getElementById(arrayBtnCorrection[index]).disabled = false;
          document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
          //
          index++;
          computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
        }).catch(function (err) {
          console.log("L'évaluation de l'élève est présente mais pas le sujet, nous pouvons donc afficher les boutons et les désactiver.");
          //see update
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = false;
          document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
          document.getElementById(arrayBtnCorrection[index]).disabled = false;
          document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
          //
          index++;
          computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
        });
      }).catch(function (err) {
        console.log("L'évaluation de l'élève n'est pas présente. Nous devons alors checker si l'évaluation a été débloquée avant de passer à la progression.");
        if (arrayEvalUnlocked[index] == true) {

          firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
            console.log("Sujet Présent");
            console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé. /// VOIR UPDATE");
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            // document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
            console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
            if (arrayEffectif[index] == 0) {
              console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
              setProgressBar(progressIds[index], completionIds[index], 0);
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            } else {
              console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
              var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
              var Ptotal = (Psmileys * 90) / 100;
              console.log("Ptotal = ", Ptotal + " %");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            }
          }).catch(function (err) {
            console.log("Sujet non présent");
            console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé. /// VOIR UPDATE");
            //see update
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
            // document.getElementById(arrayBtnCorrection[index]).disabled = false;
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
            console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
            if (arrayEffectif[index] == 0) {
              console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
              setProgressBar(progressIds[index], completionIds[index], 0);
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            } else {
              console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
              var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
              var Ptotal = (Psmileys * 90) / 100;
              console.log("Ptotal = ", Ptotal + " %");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
              //
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            }
          });



        } else {
          console.log("L'évaluation n'a pas été débloquée, nous devons donc calculer la progression avant de pouvoir checker la présence du sujet et d'afficher les boutons correspondants.");
          console.log("Mais avant de calculer la progression, nous devons vérifier qu'il y a une TODO liste.");
          console.log
          if (arrayEffectif[index] == 0) {
            console.log("Il n'y a pas de TODO liste. La progression est donc à 0% et nous n'affichons pas les boutons car l'évaluation qu'elle soit présente ou pas, n'a pas été débloquée ni par le professeur, ni par l'élève.");
            setProgressBar(progressIds[index], completionIds[index], 0);
            arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: 0 });
            document.getElementById(arrayBtnIds[index]).style.display = "none";
            document.getElementById(arrayBtnShowIds[index]).style.display = "none";
            document.getElementById(arrayBtnCorrection[index]).style.display = "none";
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            index++;
            computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
          } else {
            console.log("Il y a une TODO liste. Nous pouvons donc calculer la progression et déterminer si l'élève a débloqué son sujet.");
            var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
            var Ptotal = (Psmileys * 90) / 100;
            console.log("Ptotal = ", Ptotal + " %");

            if (Ptotal == 90) {
              console.log("La progression est égale à 90%, nous pouvons donc considérer que l'élève a débloqué lui-même son évaluation. Nous pouvons alors checker la présence du sujet.");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
              firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                console.log("La progression étant égale à 90% et le sujet étant présent, nous pouvons afficher et activer les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                // document.getElementById(arrayBtnCorrection[index]).disabled = false;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              }).catch(function (err) {
                console.log("La progression est bien égale à 90% mais le sujet n'est pas là, nous n'affichons donc pas les boutons.");
                console.log("Le sujet uploadé n'est pas là, nous devons vérifier si le sujet a été créé ou non.");
                //see pdate
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById(arrayBtnCorrection[index]).style.display = "inline";
                // document.getElementById(arrayBtnCorrection[index]).disabled = false;

                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                index++;
                computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
              });
            } else if (Ptotal < 90) {
              console.log("La progression est inférieure à 90%, nous pouvons donc simplement afficher la progression de l'élève sans afficher les boutons.");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
              arrayForDuration.push({ chapterNumber: progressIds[index].substr(8), prog: round(Ptotal, 1) });
              document.getElementById(arrayBtnIds[index]).style.display = "none";
              document.getElementById(arrayBtnShowIds[index]).style.display = "none";
              document.getElementById(arrayBtnCorrection[index]).style.display = "none";
              document.getElementById('showContentEval' + progressIds[index].substr(8)).style.display = 'none';

              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(ID, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, index);
            }
          }
        }
      });
    }
  }
  else {
    // computeRemainingTime(arrayForDuration);
  }
}

function computeRemainingTime(arrayForDuration) {

  // console.log(arrayForDuration);
  const yearEndDate = 1626458400000; //16/07/2020 à 20:00
  var todayDate = Date.now();

  var DifferenceTime = yearEndDate - todayDate;
  // console.log("DIFFERENCE TIME --> ", DifferenceTime);
  var DifferenceDays = DifferenceTime / (1000 * 3600 * 24);
  DifferenceDays = Math.trunc(DifferenceDays);

  // console.log(DifferenceDays);
  // console.log(Math.trunc(DifferenceDays));

  var temp = document.getElementsByClassName('progress');


  var numberTotalChapter = temp.length;
  var numberCompletedChapter = 0;
  var numberChapterInProgress = 0;
  var arrayCompletedChapter = [];
  var arrayChapterInProgress = [];
  var arrayOther = [];
  // console.log(numberTotalChapter);

  var mainArray = [];

  // console.log(temp);
  // console.log(temp.length);



  for (var i = 0; i < temp.length; i++) {
    // console.log(temp[i].id);
    // console.log(temp[i].id.substr(8));
    // console.log(temp[i].value);

    mainArray.push({ chapterNumber: temp[i].id.substr(8), prog: temp[i].value });
  }

  mainArray.forEach(function (elem) {
    // console.log(elem.chapterNumber);
    if (elem.prog == 100) {
      numberCompletedChapter++;
      arrayCompletedChapter.push(elem.chapterNumber);
    }
    else if (elem.prog > 0 && elem.prog < 100) {
      numberChapterInProgress++;
      arrayChapterInProgress.push(elem.chapterNumber)
    }
    else if (elem.prog == 0) {
      arrayOther.push(elem.chapterNumber);
    }
  });

  // console.log("Number of completed chapters : ", numberCompletedChapter);
  // console.log("number of chapter in progress : ", numberChapterInProgress);

  // console.log(arrayCompletedChapter);
  // console.log(arrayChapterInProgress);
  // console.log(arrayOther);

  var totalRemainingTime = DifferenceDays / (numberTotalChapter - numberCompletedChapter);
  // totalRemainingTime = Math.trunc(totalRemainingTime);
  totalRemainingTime = round(totalRemainingTime, 1)
  console.log("Total Remaining Time: ", totalRemainingTime);
  console.log("Total Remaining Time: ", round(totalRemainingTime, 1));

  var multiplcator = 1;
  mainArray.forEach(function (elem) {
    if (elem.prog == 100) {
      document.getElementById('remainingTime_' + elem.chapterNumber).innerHTML = 'Terminé';
    }
    else {
      if (DifferenceDays <= 0) {
        document.getElementById('remainingTime_' + elem.chapterNumber).innerHTML = '0j restant';
      }
      else if (elem.prog == 0) {
        document.getElementById('remainingTime_' + elem.chapterNumber).innerHTML = 'A venir';

      }
      else if (elem.prog > 0 && elem.prog < 100) {
        var dividedRemainingTime = totalRemainingTime / numberChapterInProgress;
        // console.log(dividedRemainingTime);
        var newRemainingTime = dividedRemainingTime * multiplcator;
        newRemainingTime = round(newRemainingTime, 1);
        // console.log("New Remaining time of chapter without rounding"+elem.chapterNumber+" = "+newRemainingTime);
        // console.log("New Remaining time of chapter with rounding" + elem.chapterNumber + " = " + newRemainingTime);
        multiplcator++;
        if (newRemainingTime <= 1) {
          document.getElementById('remainingTime_' + elem.chapterNumber).innerHTML = newRemainingTime + 'j restant';
        }
        else {
          document.getElementById('remainingTime_' + elem.chapterNumber).innerHTML = newRemainingTime + 'j restants';
        }
      }
    }

  });
}


function addDivCours(name, value) {

  //Used for previous version with inputs
  /* var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="coursToDoList" id="coursToDoList" class="form-control input-lg" value ="' + value + '" placeholder="Cours à lire et à synthétiser" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if (value == 'A venir') {
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></fieldset>';
  } else {
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  } */

  //This new version includes textAngular
  if (value == 'A venir') {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div><div class="col-12 col-md-8" style="padding-left: 0px;">';
    var html2 = '<input type="text" name="coursToDoList" id="coursToDoList" class="form-control input-lg" value ="' + value + '" disabled tabindex="4">';
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></div></fieldset><hr>';
  } else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left "><div><div class="col-12 col-md-8 angularTextClass" style="padding-left: 0px;">';
    var html2 = value;
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></div></fieldset><hr>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('coursContainer', 'fieldset', totalHTML);

}

function addDivPlanTravail(name, value, type) {

  console.log("type : ", type);

  //This new version includes textAngular
  if (value == 'A venir') {
    var html1 = '<h5 style="margin-bottom: 1rem;">' + type + '</h5><fieldset class="form-group position-relative has-icon-left"><div><div class="col-12 col-md-8" style="padding-left: 0px;">';
    var html2 = '<input type="text" name="planToDoList" id="planToDoList" class="form-control input-lg" value ="' + value + '" disabled tabindex="4">';
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></div></fieldset><hr>';
  } else {
    var html1 = '<h5 style="margin-bottom: 1rem;">' + type + '</h5><fieldset class="form-group position-relative has-icon-left "><div><div class="col-12 col-md-8 angularTextClass" style="padding-left: 0px;">';
    var html2 = value;
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></div></fieldset><hr>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('planContainer', 'fieldset', totalHTML);

}


function addDivExos(name, value) {

  /* var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="exosToDoList" id="exosToDoList" class="form-control input-lg" value ="' + value + '" placeholder="Exercices auto-correctifs" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if (value == 'A venir') {
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"disabled></input></div></fieldset>';

  } else {
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('exosContainer', 'fieldset', totalHTML); */

  if (value == 'A venir') {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div><div class="col-12 col-md-8" style="padding-left: 0px;">';
    var html2 = '<input type="text" name="exosToDoList" id="exosToDoList" class="form-control input-lg" value ="' + value + '" disabled tabindex="4">';
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></div></fieldset><hr>';
  } else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left "><div><div class="col-12 col-md-8 angularTextClass" style="padding-left: 0px;">';
    var html2 = value;
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4" style="text-align:center;"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></div></fieldset><hr>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('exosContainer', 'fieldset', totalHTML);

}

function handBackExams(numeroChapitre) {

  console.log(userLevel);
  console.log(matiereValue);
  console.log(Date.now());
  var isAllowed = true;
  if (numeroChapitre == 'BAC BLANC')/* && Date.now() > 1616752043000 */ {

    if (userLevel == 'T_EVOL') {
      if (matiereValue == 'Philosophie' && Date.now() > 1617016500000) { //ok
        isAllowed = false;
      }
      else if (matiereValue == 'Histoire-géographie' && Date.now() > 1617117300000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Enseignement scientifique' && Date.now() > 1617210900000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Anglais' && Date.now() > 1617201900000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Espagnol' && Date.now() > 1617124500000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'HGGSP' && Date.now() > 1617362100000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'SES - Spé' && Date.now() > 1617297300000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Mathématiques - Spé' && Date.now() > 1617297300000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Physique-chimie - Spé' && Date.now() > 1617360300000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Arts plastiques - Spé' && Date.now() > 1617360300000) //ok
      {
        isAllowed = false;
      }
    }
    else if (userLevel == 'TSTMG_EVOL') {
      if (matiereValue == 'Philosophie' && Date.now() > 1617016500000) { //ok
        isAllowed = false;
      }
      else if (matiereValue == 'Histoire-géographie' && Date.now() > 1617117300000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Anglais' && Date.now() > 1617201900000) //ok    
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Espagnol' && Date.now() > 1617124500000) //ok
      {
        isAllowed = false;
      }
      else if (matiereValue == 'Mathématiques' && Date.now() > 1617210900000) //ok
      {
        isAllowed = false;
      }
    }


  }

  if (isAllowed) {
    var user = auth.currentUser;
    var pdfURL = '';
    var mp3URL = '';
    document.getElementById('writtenMessage').style.display = "none";
    document.getElementById('oralMessage').style.display = "none";
    document.getElementById('written-error-message').style.display = "none";
    document.getElementById('oral-error-message').style.display = "none";
    $('#uploadWritten').prop('disabled', false);
    $('#uploadOral').prop('disabled', false);

    console.log("handBackExams function is called");
    console.log(numeroChapitre);
    document.getElementById('uploadChapitreNumber').innerText = numeroChapitre;

    var nomMatiere = matiereValue;
    if (nomMatiere.indexOf(' ') >= 0) {
      nomMatiere = nomMatiere.replace(/\s+/g, '-');
    }
    nomMatiere = nomMatiere.replace('é', 'e');
    nomMatiere = nomMatiere.replace('è', 'e');
    var newNumeroChapitre = numeroChapitre.trim();
    if (newNumeroChapitre.indexOf(' ') >= 0) {
      newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
    }
    firestore.collection('users').doc(user.uid).get()
      .then(function (doc) {



        var newFirstName = doc.data().firstName.substring(0, 1);
        var fullName = newFirstName + doc.data().lastName;

        pdfURL = "devoirs_ecrits/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".pdf";
        mp3URL = "devoirs_oraux/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".mp3";
        firebase.storage().ref(pdfURL).getDownloadURL().then(function (url) {
          document.getElementById('writtenMessage').style.display = "inline";
          document.getElementById('writtenLink').href = url;
          // document.getElementById('uploadWritten').setAttribute('disabled', '');
          $('#uploadWritten').prop('disabled', true);

        }).catch(function (err) {
          console.log("Error :", err);
        });

        firebase.storage().ref(mp3URL).getDownloadURL().then(function (url) {
          document.getElementById('oralMessage').style.display = "inline";
          document.getElementById('oralLink').href = url;
          $('#uploadOral').prop('disabled', true);
        }).catch(function (err) {
          console.log("Error : ", err);
        });


      }).catch(function (err) {
        console.log("Error :", err);
      });

    $('#modalHandBack').modal();
  }
  else {
    alert('Le délai de dépôt est dépassé.');
  }




}

$('#uploadWritten').change(function () {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('written-error-message');
  errorMessage.style.display = "none";
  var thePDF = document.getElementById('uploadWritten').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = matiereValue;
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText.trim();
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  console.log("NEW " + newNumeroChapitre);
  if (thePDF.type == 'application/pdf') {
    //Check the size of the file, what size ???
    if (thePDF.size <= 30000000) {
      console.log("Good, thepdf.size is :", thePDF.size);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {

          if (doc.data().userCategory == 'student') {
            var newFirstName = doc.data().firstName.substring(0, 1);
            var fullName = newFirstName + doc.data().lastName;
            console.log(fullName);
            var uploadTask = storageRef.child("devoirs_ecrits/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".pdf").put(thePDF);
            console.log("URL : " + "devoirs_ecrits/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
              document.getElementById('uploadWritten').setAttribute('disabled', '');
              document.getElementById('writtenImage').style.display = "inline";
              document.getElementById('writtenMessage').style.display = "none";
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
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                if (downloadURL != '') {


                  setProgressBar('progress' + newNumeroChapitre, 'completion' + newNumeroChapitre, 100);
                  document.getElementById("showCorrection" + newNumeroChapitre).style.display = "inline";
                  document.getElementById("showCorrection" + newNumeroChapitre).disabled = false;

                  var temp = document.getElementsByClassName('progress');
                  console.log(temp);
                  console.log(temp.length);

                  var arrayForDuration = [];

                  for (var i = 0; i < temp.length; i++) {
                    console.log(temp[i].id);
                    console.log(temp[i].id.substr(8));
                    console.log(temp[i].value);

                    arrayForDuration.push({ chapterNumber: temp[i].id.substr(8), prog: temp[i].value });
                  }

                  //Function commented because bug
                  // computeRemainingTime(arrayForDuration);
                  // temp.forEach(function(elem) {
                  //   console.log("PROGRESS :; ", elem.value +" --- "+ newNumeroChapitre);
                  // })

                  console.log('PDF was downloaded and message can be displayed');
                  document.getElementById('writtenImage').style.display = "none";
                  document.getElementById('writtenLink').href = downloadURL;
                  document.getElementById('writtenMessage').style.display = "block";

                  // put a notif to the user
                  var newNotif = {
                    date: Math.floor(Date.now() / 1000),
                    icon: "icon-mail icon-bg-circle bg-cyan",
                    viewed: false,
                    title: { en: "New message", fr: "Copie déposée" },
                    description: { en: '<b>' + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + 'la' + '</i>) to answer the message.', fr: ' <b>' + doc.data().firstName + ' ' + doc.data().lastName + '</b> a déposé une copie pour l\'évaluation du <b>' + document.getElementById('uploadChapitreNumber').innerText + '</b> en <b>' + matiereValue + '</b>. Rendez-vous sur la page <i>Devoirs</i>pour la télécharger.' },
                    url: "#"
                  }

                  firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', doc.data().instituteName).where('classe', 'array-contains', doc.data().classe).get()
                    .then(function (querySnapshot) {
                      querySnapshot.forEach(function (docTeachers) {

                        if (docTeachers.data().matieres.includes(matiereValue)) {
                          firestore.collection('users').doc(docTeachers.data().id).update({
                            notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
                            newNotif: firebase.firestore.FieldValue.increment(1)
                          })
                            .then(() => {
                              setTimeout(() => {
                                console.log("Good");
                              }, 500);
                            })
                            .catch(err => {
                              console.log('Error updating the recipient: ' + err);
                            });
                        }

                        // console.log(docTeachers.data().firstName);

                      });
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });






                }
              });
              // document.getElementById('uploadWritten').removeAttribute('disabled');
              // document.getElementById('uploadWritten').setAttribute('enabled', '');
            });
          }
          else {
            alert('Attention, un parent ne peut pas déposer de devoir.');
          }



        }).catch(function (err) {
          console.log("Error :", err);
        });
    } else {
      errorMessage.innerHTML = "Attention, la taille du fichier ne doit pas excéder 20Mo.";
      errorMessage.style.display = "block";
    }

  } else {
    errorMessage.innerHTML = "Attention, le fichier doit être un .pdf";
    errorMessage.style.display = "block";
  }


  document.getElementById('uploadWritten').value = "";
});

$('#uploadOral').change(function () {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('oral-error-message');
  errorMessage.style.display = "none";
  var theMP3 = document.getElementById('uploadOral').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = matiereValue;
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText.trim();
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  console.log("SIZE : " + theMP3.size);
  console.log("TYPE: ", theMP3.type);
  if (theMP3.type == 'audio/mp3' || theMP3.type == 'audio/mpeg') {
    console.log("GOOD3");
    //Check the size of the file, what size ???
    if (theMP3.size <= 30000000) {
      console.log("Good to upload, themp3.size is : " + theMP3.size);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {


          if (doc.data().userCategory == 'student') {
            var newFirstName = doc.data().firstName.substring(0, 1);
            var fullName = newFirstName + doc.data().lastName;
            console.log(fullName);
            var uploadTask = storageRef.child("devoirs_oraux/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".mp3").put(theMP3);
            console.log("URL : " + "devoirs_oraux/" + doc.data().instituteName + '/' + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
              document.getElementById('uploadOral').setAttribute('disabled', '');
              document.getElementById('oralImage').style.display = "inline";
              document.getElementById('oralMessage').style.display = "none";
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
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                if (downloadURL != '') {
                  console.log('PDF was downloaded and message can be displayed');
                  document.getElementById('oralImage').style.display = "none";
                  document.getElementById('oralLink').href = downloadURL;
                  document.getElementById('oralMessage').style.display = "block";
                }
              });
              // document.getElementById('uploadOral').removeAttribute('disabled');
              // document.getElementById('uploadOral').setAttribute('enabled', '');
            });
          }
          else {
            alert('Attention, un parent ne peut pas déposer de devoir.');
          }


        }).catch(function (err) {
          console.log("Error :", err);
        });
    } else {
      errorMessage.innerHTML = "Attention, la taille du fichier ne doit pas excéder 20Mo.";
      errorMessage.style.display = "block";
    }

  } else {
    errorMessage.innerHTML = "Attention, le fichier doit être un .mp3";
    errorMessage.style.display = "block";
  }
  document.getElementById('uploadOral').value = "";
});

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

//To get existing content linked to chapter but from json
function getExistingContentFromJson(niveau, matiere, chapitre, indexOfContentCours, IDUser, arrayOrder, smileysFromArrayToCheck, isOldChapter) {
  console.log(smileysFromArrayToCheck);
  console.log(arrayOrder)
  console.log(IDUser);
  console.log("THIS IS GETEXISTINGCONTENTFROMJSON");

  var user = auth.currentUser;
  var arr = [];
  var arrSuivi = [];
  firestore.collection('users').doc(IDUser).get()
    .then(function (docUser) {
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(niveau).collection(matiere).doc(chapitre).collection('createdContent').get()
        .then(function (querySnapshot) {
          // console.log("SIZE : ", querySnapshot.size);
          if (querySnapshot.size > 0) {
            var smileysToCheck = [];
            //There is new content
            var customIndex = 0;
            querySnapshot.forEach(function (doc) {
              arr.push(doc.id);
              arrSuivi.push(doc.data().suivi)
              // console.log("FICHE DE : " + doc.data().contentType);
              // console.log("TITRE DE LA FICHE : " + doc.data().title);
              //Now we need to read the json and build html
              //First download the url of file


              var ref = "created_content/" + docUser.data().instituteName + '/' + doc.id;


              firebase.storage().ref(ref).getDownloadURL().then(function (contentUrl) {
                //We downloaded the url now we read the json
                $.ajax({
                  type: 'GET',
                  url: contentUrl
                }).then(function (data) {
                  //We have the data, now build the html
                  // console.log("data : ", data.content);
                  // console.log(byteLength(data.content))

                  //BUILD HTML HERE
                  if (doc.data().contentType == 'cours') {
                    var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                    var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                    var html3 = '" aria-expanded="false" aria-controls="accordion';
                    var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                    /* title here */
                    var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + doc.data().contentType + indexOfContentCours + '" value="sad" id="jsonsad' + doc.id + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + doc.data().contentType + indexOfContentCours + '" id="jsonneutral' + doc.id + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="jsonhappy' + doc.id + '" name="' + doc.data().contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                    /* body */
                    var html5 = '<div id="accordion';
                    var html6 = '" role="tabpanel" aria-labelledby="heading';
                    var html7 = '" class="collapse" style="">';
                    var html8 = '<div class="card-content"><div class="card-body">';
                    /* text here */
                    var html9 = '</div></div></div></div>'

                    document.getElementById('contentNoPresentCours').style.display = 'none';
                    document.getElementById('divContent1').style.display = 'block';
                    document.getElementById('coursError').style.display = 'none';
                    // thereIsCoursContent = true;

                    var obj = doc.data();
                    obj.content = data.content;
                    obj.origin = 'json';
                    arrayOrder.push(obj);
                    customIndex++;
                    // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + doc.data().title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + data.content + html9;
                    // document.getElementById('divContent1').innerHTML += total;
                    // console.log(indexOfContentCours);
                    indexOfContentCours++;
                    if (customIndex == querySnapshot.size) {
                      displayContentWithOrder(arrayOrder, arr, arrSuivi, IDUser, smileysFromArrayToCheck);

                    }
                    // myfunction(arr, arrSuivi, IDUser);

                  }
                  else if (doc.data().contentType == 'exercices') {
                    var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                    var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                    var html3 = '" aria-expanded="false" aria-controls="accordion';
                    var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                    /* title here */
                    var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + doc.data().contentType + indexOfContentCours + '" value="sad" id="jsonsad' + doc.id + '" class="radio-smiley sad" checked="checked"><input type="radio" id="jsonneutral' + doc.id + '" name="' + doc.data().contentType + indexOfContentCours + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="jsonhappy' + doc.id + '" name="' + doc.data().contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                    /* body */
                    var html5 = '<div id="accordion';
                    var html6 = '" role="tabpanel" aria-labelledby="heading';
                    var html7 = '" class="collapse" style="">';
                    var html8 = '<div class="card-content"><div class="card-body">';
                    /* text here */
                    var html9 = '</div></div></div></div>'
                    document.getElementById('contentNoPresentExercices').style.display = 'none';

                    document.getElementById('divContent2').style.display = 'block';
                    document.getElementById('exosError').style.display = 'none';

                    thereIsExoContent = true;

                    var obj = doc.data();
                    obj.origin = 'json';
                    obj.content = data.content;
                    arrayOrder.push(obj);
                    customIndex++;

                    // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + doc.data().title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + data.content + html9;
                    // document.getElementById('divContent2').innerHTML += total;
                    // console.log(indexOfContentCours);
                    indexOfContentCours++;
                    if (customIndex == querySnapshot.size) {
                      console.log(smileysToCheck);
                      displayContentWithOrder(arrayOrder, arr, arrSuivi, IDUser, smileysFromArrayToCheck);

                    }
                    // myfunction(arr, arrSuivi, IDUser);

                  }


                })
              }).catch(function (err) {
                console.log("Error: ", err);
              })

            })

          }
          else {
            //There is no new content
            console.log("NO NEW CONTENT");
            console.log(smileysToCheck)
            displayContentWithOrder(arrayOrder, arr, arrSuivi, IDUser, smileysFromArrayToCheck);

          }
        }).catch(function (err) {
          console.log("Error ", err);
        });
    }).catch(function (err) {
      console.log("error :", err);
    });
}

function displayContentWithOrder(arrayOrder, arr, arrSuivi, IDUser, smileysFromArrayToCheck) {
  console.log("displayContentWithOrder();");
  console.log("LOOK ER");
  console.log(smileysFromArrayToCheck);
  console.log(arrayOrder);
  // arrayOrder.sort();
  var indexOfContentCours = 0;

  arrayOrder.sort(function (x, y) {
    return x.timestampOfCreation - y.timestampOfCreation;
  })
  console.log(arrayOrder);

  arrayOrder.forEach(function (elem) {



    if (elem.contentType == 'cours') {
      // console.log("1");
      var html1 = '<div  style="padding-left: 0px;"><div id="heading';
      var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
      var html3 = '" aria-expanded="false" aria-controls="accordion';
      var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
      /* title here */
      if (elem.origin == 'json') {
        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="jsonsad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="jsonneutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="jsonhappy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

      }
      else {
        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="neutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

      }

      /* body */
      var html5 = '<div id="accordion';
      var html6 = '" role="tabpanel" aria-labelledby="heading';
      var html7 = '" class="collapse" style="">';
      var html8 = '<div class="card-content"><div class="card-body">';
      /* text here */
      var html9 = '</div></div></div></div>'
      var contentCategory = '';
      var destination = '';
      contentCategory = ' - Fiche théorique';
      destination = 'Cours';
      // document.getElementById('missingContentCours').style.display = 'none';
      var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
      document.getElementById('divContent1').innerHTML += total;
      indexOfContentCours++;
    }
    else if (elem.contentType == 'exercices') {
      // console.log("2");
      var html1 = '<div  style="padding-left: 0px;"><div id="heading';
      var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
      var html3 = '" aria-expanded="false" aria-controls="accordion';
      var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
      /* title here */
      if (elem.origin == 'json') {
        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="jsonsad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="jsonneutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="jsonhappy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

      }
      else {
        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="neutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

      }
      /* body */
      var html5 = '<div id="accordion';
      var html6 = '" role="tabpanel" aria-labelledby="heading';
      var html7 = '" class="collapse" style="">';
      var html8 = '<div class="card-content"><div class="card-body">';
      /* text here */
      var html9 = '</div></div></div></div>'
      contentCategory = ' - Fiche d\'activité';
      destination = 'Exercices';
      // document.getElementById('missingContentExercices').style.display = 'none';
      var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
      document.getElementById('divContent2').innerHTML += total;
      indexOfContentCours++;
    }
    else if (elem.contentType == 'evaluation') {
      // console.log("3");
      var html1 = '<div  style="padding-left: 0px;"><div id="heading';
      var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
      var html3 = '" aria-expanded="false" aria-controls="accordion';
      var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
      /* title here */
      var html4bis = '</a></div>';

      /* body */
      var html5 = '<div id="accordion';
      var html6 = '" role="tabpanel" aria-labelledby="heading';
      var html7 = '" class="collapse" style="">';
      var html8 = '<div class="card-content"><div class="card-body">';
      /* text here */
      var html9 = '</div></div></div></div>'
      contentCategory = ' - Evaluation';
      destination = 'Eval';
      // document.getElementById('missingContentEval').style.display = 'none';
      var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
      document.getElementById('divContent3').innerHTML += total;
      indexOfContentCours++;

    }

  })
  myfunction(arr, arrSuivi, IDUser);
  smileysFromArrayToCheck.forEach(function (elem) {
    document.getElementById(elem).checked = 'checked';
  });


}

function myfunction(arr, arrSuivi, IDUser) {
  // console.log(arr);
  // console.log(arrSuivi);
  //  alert('eee');
  for (var i = 0; i < arr.length; i++) {
    // console.log("HEY");
    for (var j = 0; j < arrSuivi[i].length; j++) {
      // console.log(IDUser);
      // console.log(arrSuivi[i][j]);
      if (arrSuivi[i][j].studentId == IDUser) {
        console.log('inside');
        document.getElementById('json' + arrSuivi[i][j].avancement + arr[i]).checked = 'checked';
      }
    }
    // arrSuivi[i].forEach(function(elem){
    //   console.log("HEY2");
    //   if(elem.studentId == IDUser)
    //   {
    //     console.log("ABOUT TO CHECK THIs :");
    //     console.log('json'+elem.avancement + arr[i]);
    //     document.getElementById('json'+elem.avancement + arr[i]).checked = 'checked';

    //   }
    // });
  }
}

function toDoList(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");
  document.getElementById('coursContainer').innerHTML = '';
  document.getElementById('exosContainer').innerHTML = '';
  document.getElementById('corrigesExosContainer').innerHTML = '';
  document.getElementById('corrigesEvalContainer').innerHTML = '';
  document.getElementById('evalContainer').innerHTML = '';
  document.getElementById('eval2Container').innerHTML = '';
  document.getElementById('sectionVideo').style.display = 'none';
  document.getElementById('sectionVideo2').style.display = 'none';

  



  document.getElementById('planContainer').innerHTML = "";

  document.getElementById('divEval').style.display = 'none';
  document.getElementById('divEvalPAP').style.display = 'none';

  document.getElementById('evalError').style.display = 'none';
  document.getElementById('divContent1').innerHTML = "";
  document.getElementById('divContent2').innerHTML = "";
  document.getElementById('divContent1').style.display = 'none';
  document.getElementById('divContent2').style.display = 'none';
  document.getElementById('divContent3').style.display = 'none';

  document.getElementById('divContent3').innerHTML = "";

  var thereIsCoursContent = false;
  var thereIsExoContent = false;


  var indexOfContentCours = 0;
  var indexOfContentExercices = 0;
  var indexOfContentEvaluation = 0;
  $("#modalToDoList").modal();

  var smileysCoursToSet = [];
  var smileysExosToSet = [];
  var smileysValues = [];
  var pdfCoursUrl = '';
  var pdfExercicesUrl = '';
  btnOpenPDFCours.setAttribute("href", '');
  btnOpenPDFExercices.setAttribute("href", '');

  pdfCours.data = 'a';
  pdfExos.data = 'a';

  var ID;
  var userClass;

  var arrayOrder = [];


  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      if (docUser.data().userCategory == "student") {
        document.getElementById('login').innerText = 'mon identifant';
        document.getElementById('mdp').innerText = 'mon mot de passe';


        firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docUser.data().instituteName).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              firestore.collection('users').doc(doc.data().id).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(numeroChapitre).get()
                .then(function (doc2) {
                  chapitreNumber.value = doc2.data().title;
                  chapitreNumber.setAttribute('name', doc2.id)
                  // alert(chapitreNumber.getAttribute('name'));
                  document.getElementById('isOld').value = doc2.data().oldChapter;
                  console.log(document.getElementById('isOld').value);
                  console.log("SmileysValues:")
                  console.log(smileysValues);
                  if (smileysValues.includes('neutral') || smileysValues.includes('sad')) {
                    console.log("All the values aren't happy");
                  }


                  /* Created content */

                  if (doc2.data().createdContent != undefined && doc2.data().createdContent.length > 0) {
                    console.log("CREATED CNTENT OK");
                    var smileysToCheck = [];

                    // document.getElementById('divContent1').style.display = 'block';
                    // document.getElementById('contentNoPresentEvaluation').style.display = 'none';

                    doc2.data().createdContent.forEach(function (elem) {




                      if (elem.contentType == 'cours') {

                        var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                        var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                        var html3 = '" aria-expanded="false" aria-controls="accordion';
                        var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                        /* title here */
                        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="neutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                        /* body */
                        var html5 = '<div id="accordion';
                        var html6 = '" role="tabpanel" aria-labelledby="heading';
                        var html7 = '" class="collapse" style="">';
                        var html8 = '<div class="card-content"><div class="card-body">';
                        /* text here */
                        var html9 = '</div></div></div></div>'

                        document.getElementById('contentNoPresentCours').style.display = 'none';
                        document.getElementById('divContent1').style.display = 'block';
                        document.getElementById('coursError').style.display = 'none';
                        thereIsCoursContent = true;

                        /*  */
                        elem.origin = 'array';
                        arrayOrder.push(elem);
                        /*  */

                        // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
                        // document.getElementById('divContent1').innerHTML += total;
                        indexOfContentCours++;
                      }
                      else if (elem.contentType == 'exercices') {

                        var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                        var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                        var html3 = '" aria-expanded="false" aria-controls="accordion';
                        var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                        /* title here */
                        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" id="neutral' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                        /* body */
                        var html5 = '<div id="accordion';
                        var html6 = '" role="tabpanel" aria-labelledby="heading';
                        var html7 = '" class="collapse" style="">';
                        var html8 = '<div class="card-content"><div class="card-body">';
                        /* text here */
                        var html9 = '</div></div></div></div>'
                        document.getElementById('contentNoPresentExercices').style.display = 'none';

                        document.getElementById('divContent2').style.display = 'block';
                        document.getElementById('exosError').style.display = 'none';

                        thereIsExoContent = true;

                        /*  */
                        elem.origin = 'array';
                        arrayOrder.push(elem);
                        /*  */
                        // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
                        // document.getElementById('divContent2').innerHTML += total;
                        indexOfContentCours++;
                      }
                      else if (elem.contentType == 'evaluation') {
                        /* header */
                        var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                        var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                        var html3 = '" aria-expanded="false" aria-controls="accordion';
                        var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                        /* title here */
                        var html4bis = '</a></div>';

                        /* body */
                        var html5 = '<div id="accordion';
                        var html6 = '" role="tabpanel" aria-labelledby="heading';
                        var html7 = '" class="collapse" style="">';
                        var html8 = '<div class="card-content"><div class="card-body">';
                        /* text here */
                        var html9 = '</div></div></div></div>'
                        document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                        document.getElementById('divContent3').style.display = 'block';
                        document.getElementById('divEval').style.display = "block";
                        document.getElementById('evalError').style.display = "none";


                        /*  */
                        elem.origin = 'array';
                        arrayOrder.push(elem);
                        /*  */

                        console.log("there is a created eval")
                        // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
                        // document.getElementById('divContent3').innerHTML += total;
                        indexOfContentCours++;
                        console.log("Evaluation");
                        //TODO
                      }

                      //Checker les smileys ici
                      if (elem.contentType != 'evaluation') {
                        elem.suivi.forEach(function (elemSuivi) {
                          if (elemSuivi.studentId == user.uid) {
                            console.log("should check the right smileys");
                            console.log(elemSuivi.avancement + elem.contentId);
                            //Alors je check le bon
                            smileysToCheck.push(elemSuivi.avancement + elem.contentId)
                            // document.getElementById(elemSuivi.avancement+elem.contentId).checked = 'checked';
                          }
                        });
                      }



                    });
                    // smileysToCheck.forEach(function (elem) {
                    //   document.getElementById(elem).checked = 'checked';
                    // });
                    // document.getElementById('neutral10e28b01-03fa-cf8e-1c2f-bf06555f2984').checked = 'checked';
                  }
                  else {
                    console.log("CREATED COntenT NO OK");
                    document.getElementById('divContent1').style.display = 'none';
                    document.getElementById('divContent2').style.display = 'none';
                    document.getElementById('divContent3').style.display = 'none';


                    // document.getElementById('contentNoPresentCours').style.display = 'block';
                    // document.getElementById('contentNoPresentExercices').style.display = 'block';

                    thereIsCoursContent = false;

                    thereIsExoContent = false;
                    // document.getElementById('contentNoPresentEvaluation').style.display = 'block';


                  }



                  getExistingContentFromJson(docUser.data().classe, matiereValue, numeroChapitre, indexOfContentCours, user.uid, arrayOrder, smileysToCheck, doc2.data().oldChapter);

                  var nomMatiere = matiereValue;
                  if (nomMatiere.indexOf(' ') >= 0) {
                    console.log("true");
                    nomMatiere = nomMatiere.replace(/\s+/g, '-');
                  }

                  nomMatiere = nomMatiere.replace('é', 'e');
                  nomMatiere = nomMatiere.replace('è', 'e');
                  console.log("ICI :" + nomMatiere);

                  var newNumeroChapitre = numeroChapitre.trim();
                  if (newNumeroChapitre.indexOf(' ') >= 0) {
                    console.log("true");
                    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                  }

                  if (doc2.data().oldChapter) {
                    pdfCoursUrl = 'fiches_cours/' + doc.data().instituteName + '/' + doc.data().id + '_' + docUser.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
                    pdfExercicesUrl = 'fiches_exos/' + doc.data().instituteName + '/' + doc.data().id + '_' + docUser.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";

                  }
                  else {
                    pdfCoursUrl = 'fiches_cours/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + ".pdf";
                    pdfExercicesUrl = 'fiches_exos/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + ".pdf";

                  }
                  //Video
                  var videoCoursUrl = 'videos/' + doc.data().instituteName + '/' + doc.data().idAdmin + '_' + newNumeroChapitre;
                  firebase.storage().ref(videoCoursUrl).getDownloadURL().then(function (downloadURL) {
                    //Video present
                    document.getElementById('videoContainer').innerHTML = '<video style="outline: none; border: none;" controls=""><source id="videoPlayer" src="' + downloadURL + '" type="video/mp4" playsinline="" preload="none"></video>'
                    // document.getElementById('videoPlayer').src = downloadURL;
                    // document.getElementById('uploadVideo').style.display = 'none';
                    document.getElementById('sectionVideo').style.display = '';

                  }).catch(function (err) {
                    //No Video
                    console.log("Error: ", err);
                  });
                  var videoExosUrl = 'videos/' + doc.data().instituteName + '/' + doc.data().idAdmin + '_' + newNumeroChapitre + '-2';
                  firebase.storage().ref(videoExosUrl).getDownloadURL().then(function (downloadURL) {
                    //Video present
                    firebase.storage().ref().child(videoExosUrl).getMetadata()
                      .then(function (meta) {
                        console.log(meta.contentType);
                      }).catch(function (err) {
                        console.log("Error :", err);
                      })
                    document.getElementById('videoContainer2').innerHTML = '<video style="outline: none; border: none;" controls=""><source id="videoPlayer2" src="' + downloadURL + '" type="video/mp4" playsinline="" preload="none"></video>'
                    // document.getElementById('videoPlayer').src = downloadURL;
                    // document.getElementById('uploadVideo2').style.display = 'none';
                    document.getElementById('sectionVideo2').style.display = '';
                
                  }).catch(function (err) {
                    //No Video
                    console.log("Error: ", err);
                  });

                  console.log("URL Cours :" + pdfCoursUrl);
                  console.log("URL Exos :" + pdfExercicesUrl);
                  //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                  firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
                    console.log("CoursUrl --> " + coursUrl);
                    btnOpenPDFCours.setAttribute("href", coursUrl);
                    pdfCours.data = coursUrl;
                    // $('#pdfCours').load(coursUrl);
                    document.getElementById('divCours').style.display = "block";
                    document.getElementById('coursError').style.display = "none";
                  }).catch((err) => {
                    console.log("Error :" + err);
                    //Check if there is cours content
                    if (!thereIsCoursContent) {
                      console.log("THERE ISNT COURS CONTENT");
                      document.getElementById('coursError').style.display = "block";

                    }
                    document.getElementById('divCours').style.display = "none";
                  });
                  // var pdfExercicesUrl = 'fiches_exos/NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                  firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
                    console.log("ExosUrl -- > " + exosUrl);
                    btnOpenPDFExercices.setAttribute("href", exosUrl);
                    pdfExos.data = exosUrl;
                    // $('#pdfExos').load(exosUrl);
                    document.getElementById('divExos').style.display = "block";
                    document.getElementById('exosError').style.display = "none";
                  }).catch((err) => {
                    console.log("Error :" + err);
                    //Check if there is exo content
                    if (!thereIsExoContent) {
                      document.getElementById('exosError').style.display = "block";

                    }
                    document.getElementById('divExos').style.display = "none";
                  });

                  console.log(document.getElementById('show' + newNumeroChapitre).style.display);
                  console.log(document.getElementById('show' + newNumeroChapitre).disabled);
                  if (document.getElementById('show' + newNumeroChapitre).style.display == 'inline') {
                    console.log("le sujet est présent alors on télécarge et on affiche");
                    //Update : now we need to check if the subject is uploaded or created

                    document.getElementById('evalError2').style.display = "none";
                    document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                    // if (document.getElementById('show' + newNumeroChapitre).disabled) {
                    //   document.getElementById('btnEval2').disabled = true;
                    // }
                    // else {

                    if (doc2.data().oldChapter) {
                      var sujetEvalUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';

                    }
                    else {
                      var sujetEvalUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                    }
                    firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
                      document.getElementById('divEval').style.display = "block";

                      document.getElementById('btnEval2').disabled = false;
                      document.getElementById('btnEval').href = url;

                    }).catch(function (err) {
                      console.log(err);
                      console.log("no subject?");
                      document.getElementById('divEval').style.display = "none";

                      //Check if it exists in created content. If not, specify that the subject isnt on the platform
                      if (doc2.data().createdContent != undefined) {

                        console.log("There is some created content for this chapter");
                        if (document.getElementById('divContent3').innerHTML == '') {
                          document.getElementById('evalError2').style.display = 'block';
                        }
                      }
                      else {
                        console.log("No content");
                        document.getElementById('evalError2').style.display = "block";

                      }

                    });

                    if (doc2.data().oldChapter) {
                      var sujetEvalUrlPAP = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '-b.pdf';

                    }
                    else {
                      var sujetEvalUrlPAP = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '-b.pdf';

                    }

                    firebase.storage().ref(sujetEvalUrlPAP).getDownloadURL().then(function (url) {
                      document.getElementById('divEvalPAP').style.display = "block";

                      document.getElementById('btnEval2PAP').disabled = false;
                      document.getElementById('btnEvalPAP').href = url;
                      document.getElementById('evalError2PAP').style.display = 'none';


                    }).catch(function (err) {
                      console.log(err);
                      console.log("no subject?");
                      document.getElementById('divEvalPAP').style.display = "none";

                      //Check if it exists in created content. If not, specify that the subject isnt on the platform
                      if (doc2.data().createdContent != undefined) {

                        console.log("There is some created content for this chapter");
                        if (document.getElementById('divContent3').innerHTML == '') {
                          document.getElementById('evalError2PAP').style.display = 'block';
                        }
                      }
                      else {
                        console.log("No content");
                        document.getElementById('evalError2PAP').style.display = "block";

                      }

                    });


                    // document.getElementById('btnEval2').disabled = false;
                    // document.getElementById('btnEval2').setAttribute('onclick', downloadSubject(doc2.data().numeroChapitre));
                    // }
                  }
                  else {
                    console.log("le sujet n'est pas là mais on doit checker si dépôt de devoir est activé pour choisir le message d'erreur")
                    if (document.getElementById('divContent3').innerHTML == '') {
                      //  document.getElementById('evalError2').style.display ='block';
                    }

                    if (document.getElementById('btn' + newNumeroChapitre).style.display == 'inline') {
                      console.log("Le dépôt est activé alors on spécifie que le sujet n'est pas là")
                      document.getElementById('divEval').style.display = "none";
                      document.getElementById('evalError').style.display = "none";
                      document.getElementById('evalError2').style.display = "block";

                    }
                    else {
                      console.log("Le dépôt n'est pas activé alors on met le message d'erreur sur la prog");
                      document.getElementById('divEval').style.display = "none";
                      document.getElementById('divContent3').style.display = 'none';
                      document.getElementById('evalError').style.display = "block";
                      document.getElementById('evalError2').style.display = "none";
                      document.getElementById('contentNoPresentEvaluation').style.display = 'none';


                    }


                  }

                  var newFirstName = docUser.data().firstName.substring(0, 1);
                  var fullName = newFirstName + docUser.data().lastName;
                  //Check if student handed back his eval


                  var devoirStudentUrl = 'devoirs_ecrits/' + docUser.data().instituteName + '/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';


                  firebase.storage().ref(devoirStudentUrl).getDownloadURL().then(function (url) {
                    //Student handed back his eval
                    //Check if correction present

                    if (doc2.data().oldChapter) {
                      var sujetEvalCorrigeUrl = 'sujets_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';

                    }
                    else {
                      var sujetEvalCorrigeUrl = 'sujets_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                    }
                    firebase.storage().ref(sujetEvalCorrigeUrl).getDownloadURL().then(function (url) {
                      //Correction present
                      document.getElementById('evalCorrectionError').style.display = 'none';
                      document.getElementById('evalCorrectionError2').style.display = 'none';
                      document.getElementById('divEvalCorrection').style.display = 'block';
                      document.getElementById('divEvalCorrectionCustom').style.display = 'block';

                      document.getElementById('btnEvalCorrection').href = url;
                    }).catch(function (err) {
                      //Correction no present
                      document.getElementById('evalCorrectionError').style.display = 'none';
                      // document.getElementById('evalCorrectionError2').style.display = 'block';

                      document.getElementById('divEvalCorrectionCustom').style.display = 'block';

                      document.getElementById('divEvalCorrection').style.display = 'none';
                      document.getElementById('btnEvalCorrection').href = '';
                    })

                  }).catch(function (err) {
                    console.log("Error: ", err);
                    //Student hasn't handed back his eval yet
                    //error message
                    document.getElementById('evalCorrectionError').style.display = 'block';
                    document.getElementById('evalCorrectionError2').style.display = 'none';
                    document.getElementById('divEvalCorrectionCustom').style.display = 'none';

                    document.getElementById('divEvalCorrection').style.display = 'none';
                    document.getElementById('btnEvalCorrection').href = '';
                  });




                  if (doc2.data().oldChapter) {
                    var correctionUrl = 'exos_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';

                  }
                  else {
                    var correctionUrl = 'exos_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                  }
                  firebase.storage().ref(correctionUrl).getDownloadURL().then(function (url) {
                    console.log("EVAL OK :" + url);
                    document.getElementById('btnCorrection').setAttribute('href', url);
                    document.getElementById('divCorrection').style.display = "block";
                    document.getElementById('correctionError').style.display = "none";

                  }).catch(function (err) {
                    console.log("Error :", err);
                    //Display error message
                    document.getElementById('divCorrection').style.display = "none";
                    document.getElementById('correctionError').style.display = "block";
                  });

                  firestore.collection('users').doc(doc.data().id).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(numeroChapitre).collection('uploadedFiles').get()
                    .then(function (querySnapshot2) {
                      querySnapshot2.forEach(function (docUpload) {
                        var html1 = '<div class="col-12"><a href="';
                        var html2 = '" target="_blank"><h4>'
                        var html3 = '</h4></a></div>';
                        var tot = html1 + docUpload.data().urlStorage + html2 + docUpload.data().fileName + html3;
                        if (docUpload.data().category == 'cours') {
                          document.getElementById('coursContainer').innerHTML += tot;
                        }
                        else if (docUpload.data().category == 'exos') {
                          document.getElementById('exosContainer').innerHTML += tot;

                        }
                        else if (docUpload.data().category == 'corrigesExos') {
                          document.getElementById('corrigesExosCustom').style.display = 'none'
                          document.getElementById('corrigesExosContainer').innerHTML += tot;


                        } else if (docUpload.data().category == 'corrigesEval') {
                          document.getElementById('evalCorrectionError2').style.display = 'none'
                          document.getElementById('corrigesEvalContainer').innerHTML += tot;


                        }
                        else if (docUpload.data().category == 'eval') {
                          document.getElementById('evalContainer').innerHTML += tot;

                        }
                        else if (docUpload.data().category == 'eval2') {
                          document.getElementById('eval2Container').innerHTML += tot;

                        }
                      });
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });

                }).catch(function (err) {
                  console.log("Error :", err);
                });
            });

          }).catch(function (err) {
            console.log("Error :", err);
          });

      }
      else {
        console.log("THIS I SPARENT");
        firestore.collection('users').doc(docUser.data().linkedAccount).get()
          .then(function (docStudent) {

            document.getElementById('login').innerText = docStudent.data().loginManuel;
            document.getElementById('mdp').innerText = docStudent.data().mdpManuel;
            manuelLink.setAttribute("href", docStudent.data().manuel);
            firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docStudent.data().instituteName).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  firestore.collection('users').doc(doc.data().id).collection('classes').doc(docStudent.data().classe).collection(matiereValue).doc(numeroChapitre).get()
                    .then(function (doc2) {
                      console.log("inside");
                      chapitreNumber.value = doc2.data().title;
                      chapitreNumber.setAttribute('name', doc2.id)
                      document.getElementById('isOld').value = doc2.data().oldChapter;
                      console.log(document.getElementById('isOld').value);
                      /* Created content */

                      console.log("SmileysValues:")
                      console.log(smileysValues);
                      if (smileysValues.includes('neutral') || smileysValues.includes('sad')) {
                        console.log("All the values aren't happy");
                      }

                      if (doc2.data().createdContent != undefined && doc2.data().createdContent.length > 0) {
                        console.log("CREATED CNTENT OK");
                        var smileysToCheck = [];
                        // document.getElementById('divContent1').style.display = 'block';
                        // document.getElementById('contentNoPresentEvaluation').style.display = 'none';

                        doc2.data().createdContent.forEach(function (elem) {




                          if (elem.contentType == 'cours') {

                            var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                            var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                            var html3 = '" aria-expanded="false" aria-controls="accordion';
                            var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                            /* title here */
                            var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" id="neutral' + elem.contentId + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                            /* body */
                            var html5 = '<div id="accordion';
                            var html6 = '" role="tabpanel" aria-labelledby="heading';
                            var html7 = '" class="collapse" style="">';
                            var html8 = '<div class="card-content"><div class="card-body">';
                            /* text here */
                            var html9 = '</div></div></div></div>'

                            document.getElementById('contentNoPresentCours').style.display = 'none';
                            document.getElementById('divContent1').style.display = 'block';
                            document.getElementById('coursError').style.display = 'none';
                            thereIsCoursContent = true;


                            /*  */
                            elem.origin = 'array';
                            arrayOrder.push(elem);
                            /*  */
                            indexOfContentCours++;
                          }
                          else if (elem.contentType == 'exercices') {

                            var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                            var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                            var html3 = '" aria-expanded="false" aria-controls="accordion';
                            var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                            /* title here */
                            var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right;"><input type="radio" name="' + elem.contentType + indexOfContentCours + '" value="sad" id="sad' + elem.contentId + '" class="radio-smiley sad" checked="checked"><input type="radio" id="neutral' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="neutral" class="radio-smiley neutral"><input type="radio" id="happy' + elem.contentId + '" name="' + elem.contentType + indexOfContentCours + '" value="happy" class="radio-smiley happy"></input></div></div>';

                            /* body */
                            var html5 = '<div id="accordion';
                            var html6 = '" role="tabpanel" aria-labelledby="heading';
                            var html7 = '" class="collapse" style="">';
                            var html8 = '<div class="card-content"><div class="card-body">';
                            /* text here */
                            var html9 = '</div></div></div></div>'
                            document.getElementById('contentNoPresentExercices').style.display = 'none';

                            document.getElementById('divContent2').style.display = 'block';
                            document.getElementById('exosError').style.display = 'none';

                            thereIsExoContent = true;

                            /*  */
                            elem.origin = 'array';
                            arrayOrder.push(elem);
                            /*  */
                            indexOfContentCours++;
                          }
                          else if (elem.contentType == 'evaluation') {
                            /* header */
                            var html1 = '<div  style="padding-left: 0px;"><div id="heading';
                            var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                            var html3 = '" aria-expanded="false" aria-controls="accordion';
                            var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                            /* title here */
                            var html4bis = '</a></div>';

                            /* body */
                            var html5 = '<div id="accordion';
                            var html6 = '" role="tabpanel" aria-labelledby="heading';
                            var html7 = '" class="collapse" style="">';
                            var html8 = '<div class="card-content"><div class="card-body">';
                            /* text here */
                            var html9 = '</div></div></div></div>'
                            document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                            document.getElementById('divContent3').style.display = 'block';
                            document.getElementById('divEval').style.display = "block";
                            document.getElementById('evalError').style.display = "none";


                            /*  */
                            elem.origin = 'array';
                            arrayOrder.push(elem);
                            /*  */
                            indexOfContentCours++;
                            console.log("Evaluation");
                            //TODO
                          }

                          //Checker les smileys ici
                          if (elem.contentType != 'evaluation') {
                            elem.suivi.forEach(function (elemSuivi) {
                              if (elemSuivi.studentId == docStudent.id) {
                                console.log("should check the right smileys");
                                console.log(elemSuivi.avancement + elem.contentId);
                                //Alors je check le bon
                                smileysToCheck.push(elemSuivi.avancement + elem.contentId)
                                // document.getElementById(elemSuivi.avancement+elem.contentId).checked = 'checked';
                              }
                            });
                          }



                        });
                        // smileysToCheck.forEach(function (elem) {
                        //   document.getElementById(elem).checked = 'checked';
                        // })
                      }
                      else {
                        console.log("CREATED COntenT NO OK");
                        document.getElementById('divContent1').style.display = 'none';
                        document.getElementById('divContent2').style.display = 'none';
                        document.getElementById('divContent3').style.display = 'none';


                        // document.getElementById('contentNoPresentCours').style.display = 'block';
                        // document.getElementById('contentNoPresentExercices').style.display = 'block';
                        // document.getElementById('contentNoPresentEvaluation').style.display = 'block';
                      }
                      getExistingContentFromJson(docStudent.data().classe, matiereValue, numeroChapitre, indexOfContentCours, docStudent.data().id, arrayOrder, smileysToCheck, doc2.data().oldChapter);

                      var nomMatiere = matiereValue;
                      if (nomMatiere.indexOf(' ') >= 0) {
                        console.log("true");
                        nomMatiere = nomMatiere.replace(/\s+/g, '-');
                      }

                      nomMatiere = nomMatiere.replace('é', 'e');
                      nomMatiere = nomMatiere.replace('è', 'e');
                      console.log("ICI :" + nomMatiere);

                      var newNumeroChapitre = numeroChapitre.trim();
                      if (newNumeroChapitre.indexOf(' ') >= 0) {
                        console.log("true");
                        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                      }

                      if (doc2.data().oldChapter) {
                        pdfCoursUrl = 'fiches_cours/' + doc.data().instituteName + '/' + doc.data().id + '_' + docStudent.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
                        pdfExercicesUrl = 'fiches_exos/' + doc.data().instituteName + '/' + doc.data().id + '_' + docStudent.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
                      }
                      else {
                        pdfCoursUrl = 'fiches_cours/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + ".pdf";
                        pdfExercicesUrl = 'fiches_exos/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + ".pdf";

                      }

                      console.log("URL Cours :" + pdfCoursUrl);
                      console.log("URL Exos :" + pdfExercicesUrl);
                      //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                      firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
                        console.log("CoursUrl --> " + coursUrl);
                        btnOpenPDFCours.setAttribute("href", coursUrl);
                        pdfCours.data = coursUrl;
                        document.getElementById('divCours').style.display = "block";
                        document.getElementById('coursError').style.display = "none";
                      }).catch((err) => {
                        console.log("Error :" + err);
                        document.getElementById('divCours').style.display = "none";
                        //Check if there is cours content
                        if (!thereIsCoursContent) {
                          console.log("THERE ISNT COURS CONTENT");
                          document.getElementById('coursError').style.display = "block";

                        }
                      });
                      // var pdfExercicesUrl = 'fiches_exos/NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                      firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
                        console.log("ExosUrl -- > " + exosUrl);
                        btnOpenPDFExercices.setAttribute("href", exosUrl);
                        pdfExos.data = exosUrl;
                        document.getElementById('divExos').style.display = "block";
                        document.getElementById('exosError').style.display = "none";
                      }).catch((err) => {
                        console.log("Error :" + err);
                        document.getElementById('divExos').style.display = "none";
                        //Check if there is exo content
                        if (!thereIsExoContent) {
                          document.getElementById('exosError').style.display = "block";

                        }
                      });

                      console.log(document.getElementById('show' + newNumeroChapitre).style.display);
                      console.log(document.getElementById('show' + newNumeroChapitre).disabled);
                      if (document.getElementById('show' + newNumeroChapitre).style.display == 'inline') {
                        console.log("le sujet est présent alors on télécarge et on affiche");

                        document.getElementById('evalError2').style.display = "none";
                        document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                        // if (document.getElementById('show' + newNumeroChapitre).disabled) {
                        //   document.getElementById('btnEval2').disabled = true;
                        // }
                        // else {

                        if (doc2.data().oldChapter) {
                          var sujetEvalUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                        }
                        else {
                          var sujetEvalUrl = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                        }
                        firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
                          document.getElementById('divEval').style.display = "block";

                          document.getElementById('btnEval2').disabled = false;
                          document.getElementById('btnEval').href = url;
                        }).catch(function (err) {
                          console.log(err);
                          console.log("no subject?");
                          document.getElementById('divEval').style.display = "none";

                          //Check if it exists in created content. If not, specify that the subject isnt on the platform
                          if (doc2.data().createdContent != undefined) {
                            console.log("There is some created content for this chapter");
                            if (document.getElementById('divContent3').innerHTML == '') {
                              document.getElementById('evalError2').style.display = 'block';
                            }
                          }
                          else {
                            console.log("No content");
                            document.getElementById('evalError2').style.display = "block";

                          }
                        });

                        if (doc2.data().oldChapter) {
                          var sujetEvalUrlPAP = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '-b.pdf';

                        }
                        else {
                          var sujetEvalUrlPAP = 'sujets_evaluations/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '-b.pdf';

                        }
                        firebase.storage().ref(sujetEvalUrlPAP).getDownloadURL().then(function (url) {
                          document.getElementById('divEvalPAP').style.display = "block";

                          document.getElementById('btnEval2PAP').disabled = false;
                          document.getElementById('btnEvalPAP').href = url;
                          document.getElementById('evalError2PAP').style.display = 'none';


                        }).catch(function (err) {
                          console.log(err);
                          console.log("no subject?");
                          document.getElementById('divEvalPAP').style.display = "none";

                          //Check if it exists in created content. If not, specify that the subject isnt on the platform
                          if (doc2.data().createdContent != undefined) {

                            console.log("There is some created content for this chapter");
                            if (document.getElementById('divContent3').innerHTML == '') {
                              document.getElementById('evalError2PAP').style.display = 'block';
                            }
                          }
                          else {
                            console.log("No content");
                            document.getElementById('evalError2PAP').style.display = "block";

                          }

                        });

                      }
                      else {
                        console.log("le sujet n'est pas là mais on doit checker si dépôt de devoir est activé pour choisir le message d'erreur")

                        if (document.getElementById('btn' + newNumeroChapitre).style.display == 'inline') {
                          console.log("Le dépôt est activé alors on spécifie que le sujet n'est pas là")
                          document.getElementById('divEval').style.display = "none";
                          document.getElementById('evalError').style.display = "none";
                          document.getElementById('evalError2').style.display = "block";

                        }
                        else {
                          console.log("Le dépôt n'est pas activé alors on met le message d'erreur sur la prog");
                          document.getElementById('divEval').style.display = "none";
                          document.getElementById('divContent3').style.display = 'none';
                          document.getElementById('evalError').style.display = "block";
                          document.getElementById('evalError2').style.display = "none";
                          document.getElementById('contentNoPresentEvaluation').style.display = 'none';


                        }


                      }

                      var newFirstName = docStudent.data().firstName.substring(0, 1);
                      var fullName = newFirstName + docStudent.data().lastName;
                      //Check if student handed back his eval
                      if (doc2.data().oldChapter) {
                        var devoirStudentUrl = 'devoirs_ecrits/' + doc.data().instituteName + '/' + docStudent.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                      }
                      else {
                        var devoirStudentUrl = 'devoirs_ecrits/' + docStudent.data().instituteName + '/' + docStudent.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                      }
                      firebase.storage().ref(devoirStudentUrl).getDownloadURL().then(function (url) {
                        //Student handed back his eval
                        //Check if correction present

                        if (doc2.data().oldChapter) {
                          var sujetEvalCorrigeUrl = 'sujets_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                        }
                        else {
                          var sujetEvalCorrigeUrl = 'sujets_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                        }
                        firebase.storage().ref(sujetEvalCorrigeUrl).getDownloadURL().then(function (url) {
                          //Correction present
                          document.getElementById('evalCorrectionError').style.display = 'none';
                          document.getElementById('evalCorrectionError2').style.display = 'none';
                          document.getElementById('divEvalCorrection').style.display = 'block';
                          document.getElementById('btnEvalCorrection').href = url;
                        }).catch(function (err) {
                          //Correction no present
                          document.getElementById('evalCorrectionError').style.display = 'none';
                          document.getElementById('evalCorrectionError2').style.display = 'block';
                          document.getElementById('divEvalCorrection').style.display = 'none';
                          document.getElementById('btnEvalCorrection').href = '';
                        })

                      }).catch(function (err) {
                        console.log("Error: ", err);
                        //Student hasn't handed back his eval yet
                        //error message
                        document.getElementById('evalCorrectionError').style.display = 'block';
                        document.getElementById('evalCorrectionError2').style.display = 'none';
                        document.getElementById('divEvalCorrection').style.display = 'none';
                        document.getElementById('btnEvalCorrection').href = '';
                      });

                      if (doc2.data().oldChapter) {
                        var correctionUrl = 'exos_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                      }
                      else {
                        var correctionUrl = 'exos_corriges/' + doc.data().instituteName + '/' + doc.data().id + '_' + newNumeroChapitre + '.pdf';

                      }
                      firebase.storage().ref(correctionUrl).getDownloadURL().then(function (url) {
                        console.log("EVAL OK :" + url);
                        document.getElementById('btnCorrection').setAttribute('href', url);
                        document.getElementById('divCorrection').style.display = "block";
                        document.getElementById('correctionError').style.display = "none";

                      }).catch(function (err) {
                        console.log("Error :", err);
                        //Display error message
                        document.getElementById('divCorrection').style.display = "none";
                        document.getElementById('correctionError').style.display = "block";
                      });

                    }).catch(function (err) {
                      console.log("Error :", err);
                    });
                });

              }).catch(function (err) {
                console.log("Error :", err);
              });
          }).catch(function (err) {
            console.log("Error: ", err);
          });
      }




    }).catch(function (err) {
      console.log("Error ", err);
    });



}

$('#formToDoList').submit(function (ev) {

  console.log("TO DO LIST FORM HAS BEEN SUBMITTED");

  ev.preventDefault();
  var user = auth.currentUser;
  var valCours = [];
  var valExos = [];
  var valPlan = [];
  var valSmileysValues = [];
  var valSmileysIds = [];
  var valSmileysValuesJson = [];
  var valSmileysIdsJson = [];

  var somme = 0;
  var effectif = 0;

  $('.radio-smiley:checked').each(function (i) {
    // console.log("LOOK HERE --> "+$(this).attr('name')+" "+$(this).val());

    if ($(this).attr('name').includes("cours") || $(this).attr('name').includes("exercices")) {

      if ($(this).attr('id').includes('json')) {
        console.log("OKOK")

        if ($(this).val() == 'sad') {
          valSmileysValuesJson.push($(this).val());
          valSmileysIdsJson.push($(this).attr('id').substr(7));

        }
        else if ($(this).val() == 'neutral') {
          valSmileysValuesJson.push($(this).val());
          valSmileysIdsJson.push($(this).attr('id').substr(11));
        }
        else if ($(this).val() == 'happy') {
          valSmileysValuesJson.push($(this).val());
          valSmileysIdsJson.push($(this).attr('id').substr(9));
        }

      }
      else {
        valSmileysValues.push($(this).val());
        valSmileysIds.push($(this).attr('id'));

      }
      somme += getSmileyValue($(this).val());
      effectif++;
    }

  });


  console.log("VAL SMILEYS VALUES ");
  console.log(valSmileysValues);
  console.log("VAL SMILEYS IDS");
  console.log(valSmileysIds);
  console.log("VAL SMILEYS VALUES JSON");
  console.log(valSmileysValuesJson);
  console.log("VAL SMILEYS IDS JSON");
  console.log(valSmileysIdsJson);


  console.log("SOMME: ", somme + " /// EFFECTIF: ", effectif);

  //Query user to access admin id
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      if (docUser.data().userCategory == 'student') {

        console.log("USER IS A STUDENT");

        var newNumeroChapitre = chapitreNumber.getAttribute('name').trim();
        if (newNumeroChapitre.indexOf(' ') >= 0) {
          // console.log("true");
          newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
        }
        var progressId = "progress" + newNumeroChapitre;
        var completionId = "completion" + newNumeroChapitre;
        var newFirstName = docUser.data().firstName.substring(0, 1);
        var fullName = newFirstName + docUser.data().lastName;
        var nomMatiere = matiereValue;
        if (nomMatiere.indexOf(' ') >= 0) {
          // console.log("true");
          nomMatiere = nomMatiere.replace(/\s+/g, '-');
        }

        nomMatiere = nomMatiere.replace('é', 'e');
        nomMatiere = nomMatiere.replace('è', 'e');

        var evalUrl = "devoirs_ecrits/" + docUser.data().instituteName + '/' + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf"
        // console.log("EVALURL : ", evalUrl);
        // console.log("DDZDZDZDZ: ", somme+" /// "+ effectif);
        //Here we should update progress
        // checkEvalPresenceOneTime(progressId, completionId, evalUrl, somme, effectif);


        console.log("End of collecting answers in Cours : " + valCours.length + "-->" + valCours);
        console.log("End of collecting answers in Exos : " + valExos.length + "-->" + valExos);
        // console.log("End of collecting answers in PLan : " + valPlan.length + "-->" + valPlan);

        console.log(valSmileysIds);
        console.log(valSmileysValues);
        firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(chapitreNumber.getAttribute('name')).get()
          .then(function (docChapter) {
            console.log("query");
            if (docChapter.data().createdContent != undefined) {
              var existingCreatedContent = docChapter.data().createdContent;

            }
            else {
              var existingCreatedContent = []
            }
            console.log("EXISTING");
            console.log(existingCreatedContent);

            for (var i = 0; i < valSmileysIds.length; i++) {
              console.log("AAAA");
              console.log(existingCreatedContent.length);
              for (var j = 0; j < existingCreatedContent.length; j++) {

                if (valSmileysIds[i].includes(existingCreatedContent[j].contentId)) {
                  console.log('INSIDE THE RIGHT ELEMENT ', j);
                  var isPresent = false;
                  existingCreatedContent[j].suivi.forEach(function (elemSuivi) {
                    if (elemSuivi.studentId == user.uid) {
                      console.log("RIGHT USER");
                      console.log(valSmileysValues[i]);
                      elemSuivi.avancement = valSmileysValues[i];
                      isPresent = true;
                    }
                  });
                  if (!isPresent) {
                    if (docUser.data().soutien != true) {
                      existingCreatedContent[j].suivi.push({ avancement: valSmileysValues[i], studentId: docUser.id, studentClasse: docUser.data().realClasse, studentLevel: docUser.data().classe, studentName: docUser.data().firstName + ' ' + docUser.data().lastName });
                    }
                    else {
                      existingCreatedContent[j].suivi.push({ avancement: valSmileysValues[i], studentId: docUser.id, studentClasse: 'soutien', studentLevel: docUser.data().classe, studentName: docUser.data().firstName + ' ' + docUser.data().lastName });

                    }
                  }
                }
              }
            }

            if (existingCreatedContent == undefined) {
              existingCreatedContent = [];
            }
            console.log(docUser.data().classe);
            console.log(matiereValue);
            console.log(chapitreNumber.getAttribute('name'));
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(chapitreNumber.getAttribute('name'))
              .update({
                createdContent: existingCreatedContent
              }).then(function () {
                console.log("Document UPDATED");

                //Now check if we need to update smileys in JSON documents.
                if (valSmileysIdsJson.length > 0 && valSmileysValuesJson.length > 0) {
                  console.log("!Not here")
                  console.log(valSmileysIdsJson.length);
                  console.log(valSmileysValuesJson.length);
                  updateSuiviJson(valSmileysIdsJson, valSmileysValuesJson, 0, docUser.id, chapitreNumber.getAttribute('name'));



                }


                var newFirstName = docUser.data().firstName.substring(0, 1);
                var fullName = newFirstName + docUser.data().lastName;
                var evalUrl = "devoirs_ecrits/" + docUser.data().instituteName + '/' + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                var sujetUrl = "sujets_evaluations/" + docUser.data().instituteName + '/' + docUser.data().idAdmin + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                var progressIds = ['progress' + newNumeroChapitre];
                var completionIds = ['completion' + newNumeroChapitre];
                var arrayUrls = [evalUrl];
                var arraySomme = [somme];
                var arrayEffectif = [effectif];
                var arraySubjectUrls = [sujetUrl];
                var arrayBtnIds = ['btn' + newNumeroChapitre];
                var arrayBtnShowIds = ['show' + newNumeroChapitre];
                var arrayBtnCorrection = ['showCorrection' + newNumeroChapitre];
                var arrayEvalUnlocked = [docChapter.data().evalUnlocked];
                var arrayNotes = [docChapter.data().notes];
                var arrayForDuration = [];
                computeStudentProgression(user.uid, arrayForDuration, progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayBtnCorrection, arrayNotes, arrayEvalUnlocked, 0);

              }).catch(function (err) {
                console.log("Error: ", err);
              });


          }).catch(function (err) {
            console.log("Error: ", err);
          });

      }




    }).catch(function (err) {
      console.log("Error :", err);
    });


  $("#modalToDoList").modal("hide");

  //TODO
});

function updateSuiviJson(arrayIds, arrayValues, index, idUser, numeroChapitre) {

  console.log(arrayIds);
  console.log(arrayValues);

  if (index < arrayIds.length) {
    firestore.collection('users').doc(idUser).get()
      .then(function (docUser) {


        console.log(docUser.data().idAdmin);
        console.log()
        firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(numeroChapitre).collection('createdContent').doc(arrayIds[index]).get()
          .then(function (docContent) {

            if (docContent.data().suivi != undefined) {
              var existingSuivi = docContent.data().suivi;
              var isPresent = false;
              existingSuivi.forEach(function (elem) {

                if (elem.studentId == idUser) {
                  isPresent = true;
                  elem.avancement = arrayValues[index];
                }

              });
            }
            else {
              var existingSuivi = []
              isPresent = false;
            }


            if (!isPresent) {
              existingSuivi.push({ avancement: arrayValues[index], studentId: idUser, studentLevel: docUser.data().classe, studentName: docUser.data().firstName + ' ' + docUser.data().lastName });
            }
            console.log(existingSuivi)
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(matiereValue).doc(numeroChapitre).collection('createdContent').doc(arrayIds[index])
              .update({
                suivi: existingSuivi
              }).then(function () {
                console.log("HERE")
                index++;
                updateSuiviJson(arrayIds, arrayValues, index, idUser, numeroChapitre);
              }).catch(function (err) {
                console.log("Eror: ", err);
              });



          }).catch(function (err) {
            console.log("Error :", err);
          });


      }).catch(function (err) {
        console.log("Error :", err);
      })
  }
  else {
    console.log("THIS IS DONE WE SHOULD RECOMPUTE THE PROG HERE");
  }

}