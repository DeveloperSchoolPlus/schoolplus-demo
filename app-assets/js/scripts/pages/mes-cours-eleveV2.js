//DEV
var firebaseConfig = {
  apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
  authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
  databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
  projectId: "schoolplus-dev-e8a2d",
  storageBucket: "schoolplus-dev-e8a2d.appspot.com",
  messagingSenderId: "330523876306",
  appId: "1:330523876306:web:cbdcee87b7e3e007"
};
// //PROD
// var firebaseConfig = {
//   apiKey: "AIzaSyDyC4t8wIotI9PFDVd5AACXUaw3y60h7Wk",
//   authDomain: "schoolplus-prod.firebaseapp.com",
//   databaseURL: "https://schoolplus-prod.firebaseio.com",
//   projectId: "schoolplus-prod",
//   storageBucket: "schoolplus-prod.appspot.com",
//   messagingSenderId: "991751441024",
//   appId: "1:991751441024:web:bd135bd34e706797"
// };
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();

//HTML VARIABLES
const navMenu = document.getElementById('main-menu-navigation');
const rightMenu = document.getElementById('rightMenu');

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

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');

        getUserNotif();
        // getStoredData();
        // document.getElementById('studentBlock').style.display = 'block';

        if (doc.data().userCategory == 'student') {
          var arraySubject = [];
          firestore.collection('users').doc(doc.data().idAdmin).collection('classes').get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (docFormation) {
                arraySubject.push({ matiere: docFormation.id, test: '' });
              });

              var studentArray = [];
              doc.data().matieres.forEach(function (elem) {
                studentArray.push(elem.matiere);
              });
              initUserSubjects(arraySubject, studentArray);

            }).catch(function (err) {
              console.log("Error: ", err);
            })
        }
        else if (doc.data().userCategory == 'parent') {
          firestore.collection('users').doc(doc.data().linkedAccount).get()
            .then(function (docStud) {
              initUserSubjects(docStud.data().matieres);
            }).catch(function (err) {
              console.log("Error: ", err);
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

function setUserInterface(userCategory, soutien, userId, instituteName) {

  if (soutien == true) {
    //VERY IMPORTANT : we assume teacher won't be present in the "soutien" version, therefore this case will not be dealed with
    switch (userCategory) {
      case 'student':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard-soutien.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Réserver un cours de soutien</span></a></li><li data-menu="dropdown" class="dropdown nav-item" style="display: none;"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleve-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Suivi de mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        // document.getElementById('virtualClass').setAttribute('href', '#');


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
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="mes-cours-eleveV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Catalogue des formations</span></a></li><li data-menu=""><a href="mes-cours-eleveV3.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning personel</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5/*++ nav4bis + nav5 + nav6  nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3 + right4;


        break;
      case 'parent':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php"  class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';


        document.getElementById('virtualClass').setAttribute('href', '#');
        break;
      case 'admin':
        console.log("here");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-user"></i><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Valider l\'inscription des utilisateurs</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Créer une évaluation</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Formative</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Certificative</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav4bis + nav5 + nav6 /*+ nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Mes apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Mes organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3 + right4;
        break;
      case 'teacher':
        console.log("formateur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Créer une évaluation</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Formative</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Certificative</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5;

        rightMenu.innerHTML = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        // setTeachersVirtualClasses(instituteName);
        break;
      case 'author':
        console.log("auteur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        // var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Contenu pédagogique</span></a><ul class="dropdown-menu"><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Création de contenu</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Vidéos</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Texte</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Questionnaire</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Enregistrement</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Contenu créé</span></a></li></ul></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer une nouvelle formation</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Formations en cours</span></a></li></ul></li>';
        // var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2/*  + nav3 + nav4 + nav5 */;

        rightMenu.innerHTML = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';

        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';

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



function checkImg(link) {
  // console.log("link ", link);
  $.get(link)
    .done(function (data) {
      console.log('file is ready !');
      console.log(link)
      // console.log(data);
      return true
    }).fail(function () {
      console.log(link);
      console.log('Oups ! file not found ...');
      // return false;
    })
  // var tester=new Image()
  // var newLink = 'hey';
  // tester.onload=function(newLink) {
  //   console.log(tester.src);
  //   newLink = tester.src
  //   return newLink;

  // }
  // tester.onerror=function() {
  //   console.log(tester.src);
  //   newLink = 'ABC';
  // }
  // return newLink;
  // tester.src=link;
  // return true;
  // console.log(link);
}

function formationInscription(formationName) {
  swal({
    title: "Demande d'inscription",
    text: "Souhaitez-vous vous inscrire à la formation " + formationName + " ?",
    type: "info",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#3BAFDA",
    confirmButtonText: "Confirmer l'inscription",
    cancelButtonText: "Annuler",
    closeOnConfirm: true
    // closeOnCancel: true
  }, function (isConfirm) {
    if (isConfirm) {
      console.log("GOOD");
      var user = auth.currentUser;
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {

          var tempArray = [];
          if (docUser.data().matieres == undefined) {
            tempArray.push({ matiere: formationName, timeDone: 0, timeValidated: 0 });
          }
          else {
            tempArray = docUser.data().matieres;
            console.log(tempArray);
            tempArray.push({ matiere: formationName, timeDone: 0, timeValidated: 0 });
          }

          firestore.collection('users').doc(user.uid).update({
            matieres: tempArray
          }).then(function () {
            console.log("USER DOCUMENT UPDATED NOW GO TO CREATED CONTENT");


            // var suiviElementToPush = [];
            // suiviElementToPush.push({avancement: 'sad', studentClasse:'', studentId: user.uid, studentLevel: '', studentName: docUser.data().firstName+' '+docUser.data().lastName});

            // firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(formationName).get()
            // .then(function(docFormation) {
            //   docFormation.data().matieres.forEach(function(elem) {




            //   });
            // }).catch(function(err) {
            //   console.log("error: ", err);
            // })


            swal({
              title: "Inscription validée",
              // text: "Les matières ont bien été ajoutées au professeur.",
              type: "success",
              html: true,
              showCancelButton: false,
              /* confirmButtonColor: "#ffde59",
              confirmButtonText: "Ajouter un utilisateur", */
              /* cancelButtonColor:"#ffde59",
              cancelButtonText: "Fermer", */
              closeOnConfirm: true,
              closeOnCancel: true
            }, function (isConfirm) {
              if (isConfirm) {
                console.log("validated");
                // RE init formation that student does'nt have
                var arraySubject = [];

                firestore.collection('users').doc(user.uid).get()
                  .then(function (docUser2) {
                    firestore.collection('users').doc(docUser2.data().idAdmin).collection('classes').get()
                      .then(function (querySnapshot) {
                        querySnapshot.forEach(function (docFormation) {
                          arraySubject.push({ matiere: docFormation.id, test: '' });
                        });

                        var studentArray = [];
                        docUser2.data().matieres.forEach(function (elem) {
                          studentArray.push(elem.matiere);
                        });
                        initUserSubjects(arraySubject, studentArray);

                      }).catch(function (err) {
                        console.log("Error: ", err);
                      })
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });

              }
            });




          }).catch(function (err) {
            console.log("Error: ", err);
          })

        }).catch(function (err) {
          console.log("Error: ", err);
        });
    }
  });
}

function initUserSubjects(arraySubjects, arraySubjectStudent) {

  document.getElementById('cardContainer').innerHTML = '';

  var htmlElement1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div><div class="card" style="border-color: black; border-width: medium;"><a onClick="formationInscription(\'';
  //Lien
  var htmlElement2 = '\')"  ><div class="text-xs-center"><div class="card-block">';
  var htmlElement3 = '<img src="';
  var htmlElement4 = '" class="avatar-coach height-150 width-150" alt="Subject avatar"></div><div class="card-block"><h6><a  onClick="formationInscription(\'';
  //Lien 
  var htmlElement5 = '\')" >';
  //Nom matière
  var htmlElement6 = '</a></h6></div></div></div></a></div></div>';


  console.log(arraySubjectStudent);


  arraySubjects.forEach(function (elem) {


    if (!arraySubjectStudent.includes(elem.matiere)) {
      console.log(elem.matiere);

      var nomMatiere = elem.matiere;
      if (nomMatiere.indexOf(' ') >= 0) {
        // console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      var regex1 = /é/gi;
      var regex2 = /è/gi;
      nomMatiere = nomMatiere.replace(regex1, 'e');
      nomMatiere = nomMatiere.replace(regex2, 'e');
      console.log(nomMatiere);
      // console.log(checkImg('../../app-assets/images/logo/'+nomMatiere+'.png'));
      var link = '../../app-assets/images/logo/' + nomMatiere + '.png';
      $.get(link)
        .done(function (data) {
          console.log('file is ready !');
          console.log(link)
          // console.log(data);
          document.getElementById('cardContainer').innerHTML += htmlElement1 + elem.matiere + htmlElement2 + htmlElement3 + link + htmlElement4 + elem.matiere + htmlElement5 + elem.matiere + htmlElement6;
        }).fail(function () {
          console.log(link);
          console.log('Oups ! file not found ...');
          document.getElementById('cardContainer').innerHTML += htmlElement1 + elem.matiere + htmlElement2 + htmlElement3 + '../../app-assets/images/logo/mescours.png' + htmlElement4 + elem.matiere + htmlElement5 + elem.matiere + htmlElement6;

          // return false;
        })
    }



  });

}

function initUserSubjects2(arraySubjects) {

  document.getElementById('cardContainer').innerHTML = '';

  var htmlElement1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div><div class="card" style="border-color: black; border-width: medium;"><a href="';
  //Lien
  var htmlElement2 = '" ><div class="text-xs-center"><div class="card-block">';
  var htmlElement3 = '<img src="';
  var htmlElement4 = '" class="avatar-coach height-150 width-150" alt="Subject avatar"></div><div class="card-block"><h6><a  href="';
  //Lien 
  var htmlElement5 = '">';
  //Nom matière
  var htmlElement6 = '</a></h6></div></div></div></a></div></div>';





  arraySubjects.forEach(function (elem) {
    console.log(elem.matiere);

    var nomMatiere = elem.matiere;
    if (nomMatiere.indexOf(' ') >= 0) {
      // console.log("true");
      nomMatiere = nomMatiere.replace(/\s+/g, '-');
    }
    var regex1 = /é/gi;
    var regex2 = /è/gi;
    nomMatiere = nomMatiere.replace(regex1, 'e');
    nomMatiere = nomMatiere.replace(regex2, 'e');
    console.log(nomMatiere);
    // console.log(checkImg('../../app-assets/images/logo/'+nomMatiere+'.png'));
    var link = '../../app-assets/images/logo/' + nomMatiere + '.png';
    $.get(link)
      .done(function (data) {
        console.log('file is ready !');
        console.log(link)
        // console.log(data);
        document.getElementById('cardContainer').innerHTML += htmlElement1 + "../../pages/fr/mes-cours-eleve.php?subject=" + elem.matiere + htmlElement2 + htmlElement3 + link + htmlElement4 + "../../pages/fr/mes-cours-eleve.php?subject=" + elem.matiere + htmlElement5 + elem.matiere + htmlElement6;
      }).fail(function () {
        console.log(link);
        console.log('Oups ! file not found ...');
        document.getElementById('cardContainer').innerHTML += htmlElement1 + "../../pages/fr/mes-cours-eleve.php?subject=" + elem.matiere + htmlElement2 + htmlElement3 + '../../app-assets/images/logo/mescours.png' + htmlElement4 + "../../pages/fr/mes-cours-eleve.php?subject=" + elem.matiere + htmlElement5 + elem.matiere + htmlElement6;

        // return false;
      })

  });

}

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



    // manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });



    /*  console.log(doc.data().classe);
     for (var i = 0; i < doc.data().matieres.length; i++) {
       selectedMatiere.selectize.addOption({ value: doc.data().matieres[i].matiere, text: doc.data().matieres[i].matiere });
       var $select = $('select#selectMatiere').selectize();
       var control = $select[0].selectize;
       control.clear();
     }
  */
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

function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}




