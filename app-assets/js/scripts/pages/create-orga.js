// //DEV
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
var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");


const parameters = location.search.substring(1).split("&");
const temp = parameters[0].split("=");
const moduleValue = decodeURI(temp[1]);

//Initialize variables to get HTML elements
const navMenu = document.getElementById('main-menu-navigation');
const rightMenu = document.getElementById('rightMenu');
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const btnValidateForm = document.getElementById('btnValidateForm');
const createUserForm = document.getElementById('createUserForm');
const selectedClass = document.getElementById('selectClass');
const selectedClassTeacher = document.getElementById('selectClassTeacher');
const selectedModifyUser = document.getElementById('selectModifyUser');
const selectedModifyType = document.getElementById('selectModifyType');
const selectedModifyClass = document.getElementById('selectModifyClass');
const selectedModifyClassTeacher = document.getElementById('selectModifyClassTeacher');
const modifyAdresse = document.getElementById('modifyAdresse');
const modifyLastName = document.getElementById('modifyLastName');
const modifyFirstName = document.getElementById('modifyFirstName');
const collegeLyceeModifySection = document.getElementById('collegeLyceeModifySection');
const collegeLyceeModifySectionTeacher = document.getElementById('collegeLyceeModifySectionTeacher');

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



function setUserInterface(userCategory, soutien, userId, instituteName) {

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
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Catalogue des formations</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations en cours</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations réalisées</span></a></li></ul></li>';
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
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu=""><a href="modify-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
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
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item  "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu=""><a href="modify-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
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
    setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');
    //Gérer le formulaire selon si CollegE/Lycée ou SoutienScolaire
    if (doc.data().instituteCategory == "lycee" || doc.data().instituteCategory == "college") {
      // document.getElementById('collegeLyceeSection').style.display = "block";

      // firestore.collection('users').doc(user.uid).collection('classes').get()
      //   .then(function (querySnapshot) {
      //     querySnapshot.forEach(function (doc2) {
      //       selectedClass.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
      //       // selectedClass.selectize.addItem(doc2.data().nomClasse);
      //       selectedClassTeacher.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
      //       // selectedClassTeacher.selectize.addItem(doc2.data().nomClasse);
      //       var $select = $('select#selectClass').selectize();
      //       var control = $select[0].selectize;
      //       control.clear();
      //       var $select2 = $('select#selectClassTeacher').selectize();
      //       var control2 = $select2[0].selectize;
      //       control2.clear();

      //       console.log(doc2.data().nomClasse);
      //     });
      //   }).catch(function (err) {
      //     console.log("error : ", err);
      //   });
    } else if (doc.data().instituteCategory == "soutien") {
      //document.getElementById('collegeLycee')
    }


  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

//Log out manager
var hrefLogOut = document.getElementById("hrefLogOut");
hrefLogOut.addEventListener('click', e => {
  //alert('je veux déco');
  firebase.auth().signOut();
  // if (language == "english")
  // location.href = "../../pages/en/login.php";
  // else
  location.href = "../../pages/fr/login.php";
});

// Add a realtime listener for Firebase Authentification
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {

        setPageModules(moduleValue);

        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        // initClassSelection();
        // initParentSelection();
        // initTeacherSelection();
        // initClassCreation();
        // initStudentSelection();
        getUserNotif();
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

$('select#selectFiliere').on('change', function () {
  console.log("GOOD TO INIT");
  initSubjectSelection();
});

$('select#modifySelectFiliere').on('change', function () {
  console.log("GOOD TO INIT");
  initSubjectSelection();
});

$('select#selectCreateClass').on('change', function () {
  var user = auth.currentUser
  document.getElementById('pendingStudents').innerHTML = '';
  document.getElementById('listStudent').innerHTML = '';
  lookForWaitingStudents();

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
    .then(function (doc) {

      if (doc.data().students.length > 0) {
        doc.data().students.forEach(function (elem) {

          document.getElementById('listStudent').innerHTML += '<p>' + elem.firstName + ' ' + elem.lastName + '</p>';

        });
      }
      else {
        document.getElementById('listStudent').innerHTML = "<p>Aucun élève n'a encore été ajouté à cette classe.</p>";

      }

    }).catch(function (err) {
      console.log("error: ", err);
    });
});

$('select#selectModifyStudent').on('change', function () {

  var user = auth.currentUser;

  firestore.collection('users').doc($('select#selectModifyStudent').val()).get()
    .then(function (docUser) {
      console.log(docUser.data().realClasse);
      var $select = $('select#selectModifyClass').selectize();
      var selectize = $select[0].selectize;
      selectize.setValue(docUser.data().realClasse);

      document.getElementById('modifyStudentFirstName').value = docUser.data().firstName;
      document.getElementById('modifyStudentLastName').value = docUser.data().lastName;

      var $select2 = $('select#modifySelectFiliere').selectize();
      var selectize2 = $select2[0].selectize;



      switch (docUser.data().classe) {
        case '2EVOL':
          selectize2.setValue('Seconde générale et technologique');
          break;
        case '1EVOL':
          selectize2.setValue('Première générale');
          break;
        case '3EVOL':
          selectize2.setValue('3ème');
          break;
        case 'T_EVOL':
          selectize2.setValue('Terminale générale');
          break;
        case '1STMG_EVOL':
          selectize2.setValue('Première STMG');
          break;
        case 'TSTMG_EVOL':
          selectize2.setValue('Terminale STMG');
          break;
        case 'Terminale Pro Commerce':
          selectize2.setValue('Terminale Pro Commerce');
          break;
        case '6ème':
          selectize2.setValue('6ème');
          break;
        case '5ème':
          selectize2.setValue('5ème');
          break;
        case '4ème':
          selectize2.setValue('4ème');
          break;
      }

      var $select3 = $('select#modifySelectSpe').selectize();
      var selectize3 = $select3[0].selectize;
      // var $select4 = $('select#modifySelectOpt').selectize();
      // var selectize4 = $select4[0].selectize;


      var array = []
      docUser.data().matieres.forEach(function (elem) {
        array.push(elem.matiere);
        // selectize3.setValue(elem.matiere);
        // selectize4.setValue(elem.matiere);
        if (elem.matiere == 'Dual Diploma') {
          document.getElementById('radioModifyDual1').checked = true;
          document.getElementById('radioModifyDual2').checked = false;

        }
        else {
          document.getElementById('radioModifyDual1').checked = false;
          document.getElementById('radioModifyDual2').checked = true;


        }
      });

      var arraySpe = [];
      var arrayOpt = [];

      $.ajax({
        type: 'GET',
        url: '../../assets/json/matieresList.json'
      }).then(function (data) {
        data.filieres.forEach(function (elemFil) {
          if (elemFil.nomFiliere == $('select#modifySelectFiliere').val()) {
            array.forEach(function (subj) {
              if (elemFil.matieresSpe.includes(subj)) {
                arraySpe.push(subj);
              }
              // else if (elemFil.matieresOpt.includes(subj)) {
              //   arrayOpt.push(subj);
              // }


            });
            // console.log(arrayOpt);
            console.log(arraySpe);
            selectize3.setValue(arraySpe);
            // selectize4.setValue(arrayOpt);
          }
        });
      }).catch(function (err) {
        console.log("Error: ", err);
      });



      // console.log(arraySpe);
      // console.log(arrayOpt);


    }).catch(function (err) {
      console.log("Error: ", err);
    });


});

function clearModifyStudentForm() {


  var $select2 = $('select#selectModifyClass').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();
  // $('select#selectModifyClass').val('');

  var $select3 = $('select#modifySelectFiliere').selectize();
  var control3 = $select3[0].selectize;
  control3.clear();
  $('#modifyStudentFirstName').val('');
  $('#modifyStudentLastName').val('');

  document.getElementById('modifySelectSpe').selectize.clearOptions();
  // document.getElementById('modifySelectOpt').selectize.clearOptions();

  document.getElementById('radioModifyDual1').checked = false;
  document.getElementById('radioModifyDual2').checked = false; 




  // var $select = $('select#selectModifyStudent').selectize();
  // var control = $select[0].selectize;

  // close();
  // setTimeout(function(){ control.clear(); }, 6000);
  // 
  initStudentSelection();

}
function clearModifyParentForm() {

  $('#modifyParentFirstName').val('');
  $('#modifyParentLastName').val('');

  var $select = $('select#selectModifyParentStudent').selectize();
  var control = $select[0].selectize;
  control.clear();
}

$('#btnModifyParent').on('click', function () {

  if ($('select#selectModifyParent').val() != '' && $('select#selectModifyParentStudent').val() != '' && $('#modifyParentLastName').val() != '' && $('#modifyParentFirstName').val() != '') {
    firestore.collection('users').doc($('select#selectModifyParent').val()).update({
      firstName: $('#modifyParentFirstName').val(),
      lastName: $('#modifyParentLastName').val(),
      linkedAccount: $('select#selectModifyParentStudent').val()
    }).then(function () {
      clearModifyParentForm();
      console.log("parent doc updated");
    }).catch(function (err) {
      console.log("Error: ", err);
    });
  }

});

$('#btnModifyStudent').on('click', function () {

  var user = auth.currentUser;
  var studentCurrentSubj = [];
  var studentNewSubj = [];

  var newLevel = ''

  switch ($('select#modifySelectFiliere').val()) {
    case '6ème':
      newLevel = '6ème';
      break;
    case '5ème':
      newLevel = '5ème';
      break;
    case '4ème':
      newLevel = '4ème';
      break;
    case '3ème':
      newLevel = '3EVOL';
      break;
    case 'Seconde générale et technologique':
      newLevel = '2EVOL';
      break;
    case 'Première générale':
      newLevel = '1EVOL';
      break;
    case 'Terminale générale':
      newLevel = 'T_EVOL';
      break;
    case 'Première STMG':
      newLevel = '1STMG_EVOL';
      break;
    case 'Terminale STMG':
      newLevel = 'TSTMG_EVOL';
      break;
    case 'Terminale Pro Commerce':
      newLevel = 'Terminale Pro Commerce';
      break;
  }

  firestore.collection('users').doc($('select#selectModifyStudent').val()).get()
    .then(function (docUser) {


      if ($('select#selectModifyStudent').val() != '' && $('select#selectModifyClass').val() != '' && $('#modifyStudentFirstName').val() != '' && $('#modifyStudentLastName').val() != '' && $('select#modifySelectFiliere').val() != '') {

        docUser.data().matieres.forEach(function (elem) {
          studentCurrentSubj.push(elem.matiere);
        });

        var arrayDB = docUser.data().matieres;

        // console.log(studentCurrentSubj);
        $.ajax({
          type: 'GET',
          url: '../../assets/json/matieresList.json'
        }).then(function (data) {

          data.filieres.forEach(function (elemFil) {
            if (elemFil.nomFiliere == $('select#modifySelectFiliere').val()) {
              elemFil.matieresGen.forEach(function (subj) {
                studentNewSubj.push(subj);
              });
            }
          })

          $('select#modifySelectSpe').val().forEach(function (elem) {
            studentNewSubj.push(elem);
          });

          if ($('input[name=radioModifyDualDiploma]:checked').val() == 'yes') {
            console.log("YES DUAL DIPLOMA");
            studentNewSubj.push('Dual Diploma');
          }
          else {
            console.log("NO DUAL DIPLOMA");
          }

          // $('select#modifySelectOpt').val().forEach(function (elem) {
          //   studentNewSubj.push(elem);
          // });
          console.log("THIS IS OLD ARRAY")
          console.log(studentCurrentSubj);
          console.log("THIS IS NEW ARRAY");
          console.log(studentNewSubj);

          //L'array est good, maintenant on va enlever ce qui est déjà présent et push le reste.


          if (studentNewSubj.length > arrayDB.length) //Case 1 : We add 1 or more fields
          {
            studentNewSubj.forEach(function (elem) {
              if (!studentCurrentSubj.includes(elem)) {
                arrayDB.push({ matiere: elem, timeDone: 0, timeValidated: 0 });
              }
            });
          }
          else if (studentNewSubj.length < arrayDB.length) //Case 2 : We remove 1 or more fields
          {
            arrayDB.forEach(function (elem) {
              if (!studentNewSubj.includes(elem.matiere)) {
                arrayDB = arrayDB.filter(function (value) {
                  return value !== elem;
                });
              }
            });

          }
          else if (studentNewSubj.length == arrayDB.length) // Case 3 : We might have replaced 1 or more fields with another/others
          {
            studentNewSubj.forEach(function (elem) {
              if (!studentCurrentSubj.includes(elem)) {
                arrayDB.push({ matiere: elem, timeDone: 0, timeValidated: 0 });
              }
            });

            arrayDB.forEach(function (elem) {
              if (!studentNewSubj.includes(elem.matiere)) {
                arrayDB = arrayDB.filter(function (value) {
                  return value !== elem;
                });
              }
            });

          }
          console.log("DONE");
          console.log(arrayDB);

          //Checker si la classe a changé
          if ($('select#selectModifyClass').val() != docUser.data().realClasse) {
            //La classe a changé, on doit supprimer l'élève de l'ancienne classe puis le rajouter dans la nouvelle

            firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc(docUser.data().realClasse).get()
              .then(function (docClasse) {


                var arrayFromClass = [];
                arrayFromClass = docClasse.data().students;
                console.log("ICI");
                console.log(arrayFromClass);
                var newArrayClass = [];
                arrayFromClass.forEach(function (elem) {
                  if (elem.id != $('select#selectModifyStudent').val()) {
                    newArrayClass.push(elem);
                  }
                });

                console.log(newArrayClass);

                //Good to push

                firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc(docUser.data().realClasse).update({
                  students: newArrayClass
                }).then(function () {
                  console.log("classe updated");
                  //Now we need to write it into the new class

                  firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc($('select#selectModifyClass').val()).get()
                    .then(function (docClasse2) {
                      var arrayFromClass2 = docClasse2.data().students;
                      arrayFromClass2.push({ firstName: docUser.data().firstName, lastName: docUser.data().lastName, id: docUser.id, level: newLevel, matieres: studentNewSubj });
                      firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc($('select#selectModifyClass').val()).update({
                        students: arrayFromClass2
                      }).then(function () {
                        console.log('New doc updated');

                        //Now we can change the user doc
                        firestore.collection('users').doc($('select#selectModifyStudent').val()).update({
                          classe: newLevel,
                          matieres: arrayDB,
                          realClasse: $('select#selectModifyClass').val(),
                          firstName: document.getElementById('modifyStudentFirstName').value,
                          lastName: document.getElementById('modifyStudentLastName').value,
                          filiere: $('select#modifySelectFiliere').val()
                        }).then(function () {
                          console.log("user updated");
                          firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).get()
                            .then(function (docLevel) {
                              console.log("about");
                              if (docLevel.exists) {
                                var arrayToPush = docLevel.data().matieres;
                                var arrayToPushBis = docLevel.data().matieres;
                                var collectionToCreate = [];


                                arrayDB.forEach(function (elem) {
                                  if (!docLevel.data().matieres.includes(elem.matiere)) {
                                    arrayToPush.push(elem.matiere);
                                    collectionToCreate.push(elem.matiere);
                                  }
                                });

                                if (arrayToPush != arrayToPushBis) {
                                  firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).update({
                                    matieres: arrayToPush
                                  }).then(function () {
                                    if (collectionToCreate.length > 0) {
                                      collectionToCreate.forEach(function (elem) {
                                        firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).collection(elem).doc('duration').set({
                                          duration: 0
                                        }).then(function () {
                                          clearModifyStudentForm();
                                          console.log("DONE");
                                        }).catch(function (err) {
                                          console.log("Error :", err);
                                        });
                                      });
                                    }
                                    else {
                                      clearModifyStudentForm();
                                    }

                                  }).catch(function (err) {
                                    console.log("Error: ", err);
                                  });
                                }
                                else {
                                  clearModifyStudentForm();
                                }
                              }
                              else {
                                var arrayToPush = [];
                                arrayDB.forEach(function (elem) {
                                  arrayToPush.push(elem.matiere);
                                });

                                firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).set({
                                  matieres: arrayToPush,
                                  filiere: newLevel,
                                  nomClasse: newLevel
                                }).then(function () {

                                  arrayToPush.forEach(function (elemSubject) {
                                    firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).collection(elemSubject).doc('duration').set({
                                      duration: 0
                                    }).then(function () {
                                      console.log("Document created for subject :: ", elemSubject);
                                      console.log("DONEEEE");
                                      clearModifyStudentForm();
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
                        }).catch(function (err) {
                          console.log("Error: ", err);
                        });


                      }).catch(function (err) {
                        console.log("Error: ", err);
                      })


                    }).catch(function (err) {
                      console.log("error: ", err);
                    })


                }).catch(function (err) {
                  console.log("error :", err);
                })


              });


          }
          else {
            //On met a jour le doc classe avec les nouvelles matières
            //On met a jour le doc utilisateur

            firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc(docUser.data().realClasse).get()
              .then(function (docClasse) {

                var arrayFromClass = docClasse.data().students;
                arrayFromClass.forEach(function (elem) {
                  if (elem.id == $('select#selectModifyStudent').val()) {
                    elem.matieres = studentNewSubj;
                  }
                });

                firestore.collection('users').doc(docUser.data().idAdmin).collection('classesHackschooling').doc(docUser.data().realClasse).update({
                  students: arrayFromClass
                }).then(function () {
                  firestore.collection('users').doc($('select#selectModifyStudent').val()).update({
                    classe: newLevel,
                    matieres: arrayDB,
                    realClasse: $('select#selectModifyClass').val(),
                    firstName: document.getElementById('modifyStudentFirstName').value,
                    lastName: document.getElementById('modifyStudentLastName').value,
                    filiere: $('select#modifySelectFiliere').val()
                  }).then(function () {
                    console.log("DONEEEE");
                    // /*  */clearModifyStudentForm();
                    firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).get()
                      .then(function (docLevel) {
                        console.log("inside");
                        if (docLevel.exists) {
                          console.log("case exists");
                          var arrayToPush = docLevel.data().matieres;
                          var arrayToPushBis = docLevel.data().matieres;
                          var collectionToCreate = [];


                          arrayDB.forEach(function (elem) {
                            if (!docLevel.data().matieres.includes(elem.matiere)) {
                              arrayToPush.push(elem.matiere);
                              collectionToCreate.push(elem.matiere);
                            }
                          });

                          if (arrayToPush != arrayToPushBis) {
                            console.log("case3)");
                            firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).update({
                              matieres: arrayToPush
                            }).then(function () {
                              console.log("case3Bis");

                              var index = 0
                              console.log("COLLECTION TO CREATE LENGTH" + " " + collectionToCreate.length);
                              if (collectionToCreate.length > 0) {
                                collectionToCreate.forEach(function (elem) {
                                  firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).collection(elem).doc('duration').set({
                                    duration: 0
                                  }).then(function () {
                                    console.log("DONEDONEDONEDONE");
                                    clearModifyStudentForm();


                                  }).catch(function (err) {
                                    console.log("Error :", err);
                                  });
                                });
                              }
                              else {
                                console.log("Case 3bisbis");
                                clearModifyStudentForm();

                              }



                            }).catch(function (err) {
                              console.log("ErrorRrR: ", err);
                            });
                          }
                          else {
                            console.log("case4");
                            clearModifyStudentForm();

                          }
                        }
                        else {
                          console.log("no exists");
                          var arrayToPush = [];
                          arrayDB.forEach(function (elem) {
                            arrayToPush.push(elem.matiere);
                          });

                          firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).set({
                            matieres: arrayToPush
                          }).then(function () {

                            arrayToPush.forEach(function (elemSubject) {
                              firestore.collection('users').doc(user.uid).collection('classes').doc(newLevel).collection(elemSubject).doc('duration').set({
                                duration: 0
                              }).then(function () {
                                console.log("Document created for subject :: ", elemSubject);
                                console.log("DONEEEE");
                                clearModifyStudentForm();
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
                    /*  */
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });


                }).catch(function (err) {
                  console.log("Error: ", err);
                });


              }).catch(function (err) {
                console.log("Error: ", err);
              })

          }

        }).catch(function (err) {
          console.log("Error: '", err);
        })


      }
      else {
        alert('Attention, toutes les informations requises n\'ont pas été complétées');
      }


    }).catch(function (err) {
      console.log("Error: ", err);
    });


});


$('#createTeacher').on('click', function () {
  var user = auth.currentUser;

  var newEmail = document.getElementById('teacherEmail');
  var newPassword = document.getElementById('teacherPassword');

  if ($('#teacherFirstName').val() != '' && $('#teacherLastName').val() != '' && $('#teacherEmail').val() != '' && $('#teacherPassword').val() != '' && $('#teacher_password_confirmation').val() != ''  ) {
    if (newEmail.checkValidity() && newPassword.checkValidity()) {
      if( $('#teacherPassword').val() == $('#teacher_password_confirmation').val()) {
        secondaryApp.auth().createUserWithEmailAndPassword(newEmail.value, newPassword.value).then(function (firebaseUser) {

          console.log("User : " + firebase.auth(secondaryApp).currentUser.uid + " created successfully!");
  
  
  
  
  
          firestore.collection('users').doc(firebase.auth(secondaryApp).currentUser.uid).set({
            id: firebase.auth(secondaryApp).currentUser.uid,
            email: firebase.auth(secondaryApp).currentUser.email,
            firstName: document.getElementById('teacherFirstName').value,
            lastName: document.getElementById('teacherLastName').value,
            userCategory: 'teacher',
            tel: '',
            
            instituteName: 'FFVoile',
            instituteCategory: 'lycee',
            idAdmin: user.uid,
            virtualRoom: '',
            notifications: [],
            newNotif: 0
            
          }).then(function () {
            console.log("Done");
            secondaryApp.auth().signOut();

            swal({
              type:'success',
              title: 'Compte créé !',
              text: 'Un espace formateur a bien été créé pour ' +document.getElementById('teacherFirstName').value + ' '+ document.getElementById('teacherLastName').value,
              closeOnConfirm: true
            }, function(isConfirm) {
              if(isConfirm) 
              {
                clearCreateTeacherForm();
              }
            });
  
          }).catch(function (err) {
            console.log("Error: ", err);
          })
  
  
  
        }).catch(function (err) {
          console.log("Error :", err);
        });
      }
      else
      {
        alert("Attention, les mots de passe ne sont pas identiques.");
      }
      
    }
  }
  else {
    alert('Attention, toutes les informations requises n\'ont pas été complétées et/ou les mots de passe ne sont pas identiques.');
  }



});

function clearCreateTeacherForm() {
  document.getElementById('teacherFirstName').value = '';
  document.getElementById('teacherLastName').value = '';
  document.getElementById('teacherEmail').value = '';
  document.getElementById('teacherPassword').value = '';
  document.getElementById('teacher_password_confirmation').value = '';





}

function lookForWaitingStudents() {
  // alert('e');
  document.getElementById('pendingStudents').innerHTML = '';

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
    .then(function (docClasse) {

      var studentsOfClass = docClasse.data().students;
      // alert('f');

      if (studentsOfClass.length == 0) {
        console.log("Equals 0");
        firestore.collection('users').where('instituteName', '==', 'Hackschooling Institute').where('userCategory', '==', 'student').where('realClasse', '==', $('select#selectCreateClass').val()).get()
          .then(function (querySnapshot) {

            if (querySnapshot.size == 0) {
              // alert('e');
              document.getElementById('pendingStudents').innerHTML = "<p>Aucun élève en attente d'affectation à la classe sélectionnée.</p>";
            }
            else {
              // alert('a');
              querySnapshot.forEach(function (doc) {


                console.log(doc.data().firstName + ' ' + doc.data().lastName);
                document.getElementById('pendingStudents').innerHTML += "<p name='pendingStudent' id='" + doc.data().id + "'>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";



              });
            }
            // alert('g');

          }).catch(function (er) {
            console.log("error : ", er);
          });
      }
      else {
        var studentsToDisplay = [];
        firestore.collection('users').where('instituteName', '==', 'Hackschooling Institute').where('userCategory', '==', 'student').where('realClasse', '==', $('select#selectCreateClass').val()).get()
          .then(function (querySnapshot) {
            var printErrorMessage = true;
            // alert('g');
            querySnapshot.forEach(function (doc) {

              var isAlreadyPresent = false;

              studentsOfClass.forEach(function (elem) {

                if (doc.id == elem.id) {
                  isAlreadyPresent = true;
                }



              });

              if (!isAlreadyPresent) {
                document.getElementById('pendingStudents').innerHTML += "<p name='pendingStudent' id='" + doc.data().id + "'>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";
                printErrorMessage = false;

              }


              // console.log(doc.data().firstName + ' ' + doc.data().lastName);
              // document.getElementById('pendingStudents').innerHTML += "<p>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";




            });

            if (printErrorMessage) {
              document.getElementById('pendingStudents').innerHTML = "<p>Aucun élève en attente d'affectation à la classe sélectionnée.</p>";

            }
          }).catch(function (er) {
            console.log("error : ", er);
          });
      }




    }).catch(function (err) {
      console.log("Error: ", err);
    });

}
function clearCreateStudentForm() {

 
  

  document.getElementById('userFirstName').value = '';
  document.getElementById('userLastName').value = '';
  document.getElementById('studentEmail').value = '';
  document.getElementById('userFirstName').value = '';
  document.getElementById('studentPassword').value = '';
  document.getElementById('student_password_confirmation').value = '';


  


}

function isOneChecked() {
  // All <input> tags...
  var chx = document.getElementsByName('radioDualDiploma');
  for (var i = 0; i < chx.length; i++) {
    // If you have more than one radio group, also check the name attribute
    // for the one you want as in && chx[i].name == 'choose'
    // Return true from the function on first match of a checked item
    if (chx[i].type == 'radio' && chx[i].checked) {
      return true;
    }
  }
  // End of the loop, return false
  return false;
}
$('#addStudent').on('click', function () {
  var user = auth.currentUser;
  var newEmail = document.getElementById('studentEmail');
  var newPassword = document.getElementById('studentPassword');



  if (  document.getElementById('userFirstName').value != '' && document.getElementById('userLastName').value != '' ) {
    if (newEmail.checkValidity() && newPassword.checkValidity()) {
      if (newPassword.value == document.getElementById('student_password_confirmation').value) {
        
          console.log("ok");
          secondaryApp.auth().createUserWithEmailAndPassword(newEmail.value, newPassword.value).then(function (firebaseUser) {
            console.log("User " + firebase.auth(secondaryApp).currentUser.uid + " created successfully!");
            //I don't know if the next statement is necessary



              firestore.collection('users').doc(firebase.auth(secondaryApp).currentUser.uid).set({
                id: firebase.auth(secondaryApp).currentUser.uid,
                email: firebase.auth(secondaryApp).currentUser.email,
                firstName: document.getElementById('userFirstName').value,
                lastName: document.getElementById('userLastName').value,
                userCategory: 'student',
                tel: '',
                
                instituteName: 'FFVoile',
                instituteCategory: 'lycee',
                idAdmin: user.uid,
                
                notifications: [],
                newNotif: 0
              }).then(function () {
                console.log("Document created");
                secondaryApp.auth().signOut();
                // lookForWaitingStudents();
                // clearCreateStudentForm();
                swal({
                  type:'success',
                  title: 'Compte créé !',
                  text: 'Un espace apprenant a bien été créé pour ' +document.getElementById('userFirstName').value + ' '+ document.getElementById('userLastName').value,
                  closeOnConfirm: true
                }, function(isConfirm) {
                  if(isConfirm) 
                  {
                    clearCreateStudentForm();
                  }
                });
               

              }).catch(function (err) {
                console.log("Error creating the doc: ", err);
              });

            




          });
        
       

      }
      else {
        alert('Attention, les mots de passe ne sont pas identiques.');
      }

    }
    else {
      alert("Attention, l'email ou le mot de passe est invalide.");
    }
  }
  else {
    alert("Attention, toutes les informations requises n'ont pas été complétées.")
  }






});


$('#updateClass').on('click', function () {

  var user = auth.currentUser;
  if ($('select#selectCreateClass').val() != '') {

    firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
      .then(function (docClasse) {


        var studentsArray = docClasse.data().students;

        var myArray = [];


        var pendingStudentsIds = document.getElementsByName('pendingStudent');
        pendingStudentsIds.forEach(function (elem) {

          myArray.push(elem.id);



        });

        updateClass(myArray, studentsArray, 0);

        // console.log(myArray);

      }).catch(function (err) {
        console.log("Error: ", err);
      });



  }
  else {
    alert('Veuillez sélectionner une classe pour la mettre à jour.');
  }

});

function updateClass(arrayIds, arrayExistingClass, index) {
  var user = auth.currentUser;
  if (index < arrayIds.length) {
    firestore.collection('users').doc(arrayIds[index]).get()
      .then(function (docStudent) {
        if (docStudent.data().firstName != 'Jean5') {
          var studentSubjects = [];

          docStudent.data().matieres.forEach(function (elem) {
            studentSubjects.push(elem.matiere);
          });

          var toPush = { id: docStudent.id, firstName: docStudent.data().firstName, lastName: docStudent.data().lastName, matieres: studentSubjects, level: docStudent.data().classe }

          arrayExistingClass.push(toPush);
          index++;

          updateClass(arrayIds, arrayExistingClass, index);
        }
        else {
          index++;

          updateClass(arrayIds, arrayExistingClass, index);
        }


      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    console.log(arrayExistingClass);
    lookForWaitingStudents();
    firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).set({
      students: arrayExistingClass
    },
      {
        merge: true
      }).then(function () {
        firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
          .then(function (doc) {

            document.getElementById('listStudent').innerHTML = '';

            if (doc.data().students.length > 0) {
              doc.data().students.forEach(function (elem) {

                document.getElementById('listStudent').innerHTML += '<p>' + elem.firstName + ' ' + elem.lastName + '</p>';

              });
            }
            else {
              document.getElementById('listStudent').innerHTML = "<p>Aucun élève n'a encore été ajouté à cette classe.</p>";

            }

          }).catch(function (err) {
            console.log("error: ", err);
          });
        swal({
          title: "Classe " + $('select#selectCreateClass').val() + " mise à jour",
          closeOnConfirm: true,
          type: 'success'
        });
        console.log("Done");
      }).catch(function (err) {
        console.log("Error updating doc", err);
      });
  }
}

function initSubjectSelection() {
  // listeMatieres.innerHTML = '';
  document.getElementById('hiddenSubjects').innerHTML = '';
  document.getElementById('selectSpe').selectize.clearOptions();
  // document.getElementById('selectOpt').selectize.clearOptions();

  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {
    var arraySubjGen = [];
    var arraySubjSpe = [];
    data.filieres.forEach(function (elem) {
      if (elem.nomFiliere == $('select#selectFiliere').val()) {
        elem.matieresGen.forEach(function (elemSubject) {
          // listeMatieres.innerHTML += '<div class="checkbox"><input type="checkbox"name="matieresListe" val="' + elemSubject + '"  id="' + elemSubject + '_Student" class="switchery"><label for="' + elemSubject + '"> &nbsp' + elemSubject + '</label></div>';

        });

        elem.matieresSpe.forEach(function (elemSubject) {
          document.getElementById('selectSpe').selectize.addOption({ value: elemSubject, text: elemSubject });

        });
        // elem.matieresOpt.forEach(function (elemSubject) {
        //   document.getElementById('selectOpt').selectize.addOption({ value: elemSubject, text: elemSubject });

        // });

        // var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresListe"]'));
        // elems.forEach(function (html) {
        //   var switchery = new Switchery(html);
        //   html.click();
        // });
      }
      if (elem.nomFiliere == $('select#modifySelectFiliere').val()) {
        elem.matieresGen.forEach(function (elemSubject) {
          // listeMatieres.innerHTML += '<div class="checkbox"><input type="checkbox"name="matieresListe" val="' + elemSubject + '"  id="' + elemSubject + '_Student" class="switchery"><label for="' + elemSubject + '"> &nbsp' + elemSubject + '</label></div>';

        });

        elem.matieresSpe.forEach(function (elemSubject) {
          document.getElementById('modifySelectSpe').selectize.addOption({ value: elemSubject, text: elemSubject });
          document.getElementById('hiddenSubjects').innerHTML += '<div name="hiddenSpe" id="' + elemSubject + '"></div>';

        });
        // elem.matieresOpt.forEach(function (elemSubject) {
        //   document.getElementById('modifySelectOpt').selectize.addOption({ value: elemSubject, text: elemSubject });
        //   document.getElementById('hiddenSubjects').innerHTML += '<div name="hiddenOpt" id="' + elemSubject + '"></div>';

        // });
        // var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresListe"]'));
        // elems.forEach(function (html) {
        //   var switchery = new Switchery(html);
        //   html.click();
        // });
      }

      if (elem.nomFiliere != 'total') {
        elem.matieresGen.forEach(function (subjGen) {
          if (!arraySubjGen.includes(subjGen)) {
            arraySubjGen.push(subjGen);
          }
        });
        elem.matieresSpe.forEach(function (subjSpe) {
          if (!arraySubjSpe.includes(subjSpe)) {
            arraySubjSpe.push(subjSpe);
          }
        });


      }

    });

    console.log("ARRAY GENERAL");
    console.log(arraySubjGen);
    console.log("ARRAY SPE");
    console.log(arraySubjSpe);
  });
}

function initStudentSelection() {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get().then(function (docAdmin) {

    firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', 'Hackschooling Institute').get()
      .then(function (querySnapshot) {

        querySnapshot.forEach(function (doc) {
          if (doc.data().soutien != true) {
            document.getElementById('selectStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            var $select = $('select#selectStudent').selectize();
            var control = $select[0].selectize;
            control.clear();

            document.getElementById('selectModifyStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            var $select2 = $('select#selectModifyStudent').selectize();
            var control2 = $select2[0].selectize;
            control2.clear();

            document.getElementById('selectModifyParentStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            var $select2 = $('select#selectModifyParentStudent').selectize();
            var control2 = $select2[0].selectize;
            control2.clear();

          }
        });



      }).catch(function (err) {
        console.log("Error: ", err);
      });

  }).catch(function (err) {
    console.log("Error :", err);
  })

}

function setPageModules(moduleValue) {
  switch (moduleValue) {
    case 'ligue':
      document.getElementById('addUser').style.display = "block";
      document.getElementById('modifyUser').style.display = 'none';
      break;
      case 'cd':
        document.getElementById('addUser').style.display = "block";
        document.getElementById('modifyUser').style.display = 'none';
        break;
        case 'of':
      document.getElementById('addUser').style.display = "block";
      document.getElementById('modifyUser').style.display = 'none';
      break;
      case 'club':
      document.getElementById('addUser').style.display = "block";
      document.getElementById('modifyUser').style.display = 'none';
      break;
      case 'autre':
      document.getElementById('addUser').style.display = "block";
      document.getElementById('modifyUser').style.display = 'none';
      break;
  }
}

$('select#selectType').on('change', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      if (doc.data().instituteCategory == "college" || doc.data().instituteCategory == "lycee") {
        if ($('select#selectType').val() == "teacher") {
          document.getElementById('collegeLyceeSection').style.display = "none";
          document.getElementById('collegeLyceeSectionTeacher').style.display = "block";

        } else if ($('select#selectType').val() == "student") {
          document.getElementById('collegeLyceeSection').style.display = "block";
          document.getElementById('collegeLyceeSectionTeacher').style.display = "none";

        }
        /* console.log(selectedClass.className);
        console.log(selectedClass.getAttribute("multiple")); */
      }


    }).catch(function (err) {
      console.log("Error : ", err);
    });


});

$('#addOrga').on('click', function() {

  var user = auth.currentUser;

  console.log($('input[name="radio"]:checked').val());

  if($('#orgaName').val() != '') 
  {
    firestore.collection('users').doc(user.uid).collection('organisations').doc($('#orgaName').val()).set({
      orgaName: $('#orgaName').val(),
      orgaType: $('input[name="radio"]:checked').val(),
    }).then(function() {
      console.log("OK");
      swal({
        type:"success",
        title:"Organisation ajoutée",
        text: "L'organisation "+$('#orgaName').val()+ " a bien été ajoutée.",
        showCancelButton: false,
        closeOnConfirm: true
      }, function(isConfirm) {
        if(isConfirm)
        {
          $('#orgaName').val('');
        }
      });
    }).catch(function(err) {
      console.log("Error: " ,err);
    });
  }
  else
  {
    alert('Attention, veuillez rentrer un nom d\'organisation');
  }

});

function setCreationForm(value) {


  if (value == 'ligue') {
    document.getElementById('divCreateStudent').style.display = 'block';
    document.getElementById('divCreateParent').style.display = 'none';
    document.getElementById('divCreateTeacher').style.display = 'none';
  }
  else if (value == 'cd') {
    document.getElementById('divCreateStudent').style.display = 'block';
    document.getElementById('divCreateParent').style.display = 'none';
    document.getElementById('divCreateTeacher').style.display = 'none';
  }
  else if (value == 'of') {
    document.getElementById('divCreateStudent').style.display = 'block';
    document.getElementById('divCreateParent').style.display = 'none';
    document.getElementById('divCreateTeacher').style.display = 'none';
  }
  else if (value == 'club') {
    document.getElementById('divCreateStudent').style.display = 'block';
    document.getElementById('divCreateParent').style.display = 'none';
    document.getElementById('divCreateTeacher').style.display = 'none';
  }
  else if (value == 'autre') {
    document.getElementById('divCreateStudent').style.display = 'block';
    document.getElementById('divCreateParent').style.display = 'none';
    document.getElementById('divCreateTeacher').style.display = 'none';
  }

}

$('#createAuthor').on('click', function () {

  var user = auth.currentUser;
  var newEmail = document.getElementById('authorEmail');
  var newPassword = document.getElementById('password');

  if ($('#authorLastName').val() != '' && $('#authorFirstName').val() != '' && $('#authorEmail').val() != '' && $('#password').val() != '' && $('#password_confirmation').val() != '' ) {
    if (newEmail.checkValidity() && newPassword.checkValidity()) {

      if (newPassword.value == document.getElementById('password_confirmation').value) {
        secondaryApp.auth().createUserWithEmailAndPassword(newEmail.value, newPassword.value).then(function (firebaseUser) {
          console.log("User : " + firebase.auth(secondaryApp).currentUser.uid + " created successfully!");


          firestore.collection('users').doc(firebase.auth(secondaryApp).currentUser.uid).set({
            id: firebase.auth(secondaryApp).currentUser.uid,
            email: firebase.auth(secondaryApp).currentUser.email,
            firstName: document.getElementById('authorFirstName').value,
            lastName: document.getElementById('authorLastName').value,
            userCategory: 'author',
            tel: '',
            instituteName: 'FFVoile',
            instituteCategory: 'lycee',
            idAdmin: user.uid,
            
            notifications : [],
            newNotif: 0
          }).then(() => {
            console.log("Document created.")
            secondaryApp.auth().signOut();
            swal({
              type:'success',
              title: 'Compte créé !',
              text: 'Un espace auteur a bien été créé pour ' +document.getElementById('authorFirstName').value + ' '+ document.getElementById('authorLastName').value,
              closeOnConfirm: true
            }, function(isConfirm) {
              if(isConfirm) 
              {
                clearParentCreationForm();
              }
            });
          }).catch(err => {
            console.log("Error: ", err);
          });

        });
      }
      else {
        alert('Attention, les deux mots de passe ne sont pas identiques.');
      }



    }
    else {
      alert("Attention, l'email ou le mot de passe est invalide.");
    }
  }
  else {
    alert('Attention, toutes les informations nécessaires n\'ont pas été complétées');
  }


});

function clearParentCreationForm() {
  document.getElementById('authorLastName').value = '';
  document.getElementById('authorFirstName').value = '';
  document.getElementById('authorEmail').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password_confirmation').value = '';




}

function addNewUser(instituteCategory, newUserCategory, newUserEmail, newUserFirstName, newUserLastName, instituteName) {
  var user = auth.currentUser;


  if (instituteCategory == "soutien") {

    console.log("Institute category :" + instituteCategory + "\n" + "New user category :" + newUserCategory + "\n" + "New user email: " + newUserEmail + "\n" + "New user First Name : " + newUserFirstName + "\n" + "New user Last name : " + newUserLastName);
    firestore.collection('users_temp').doc(newUserEmail)
      .set({    //, newUserCategory, newUserEmail, newUserFirstName, newUserLastName
        userCategory: newUserCategory,
        firstName: newUserFirstName,
        lastName: newUserLastName,
        email: newUserEmail,
        instituteCategory: instituteCategory,
        instituteName: instituteName,
        idAdmin: user.uid
      }).then(function () {
        // console.log("New id : "+ docRef.id);
        clearCreationForm();

      }).catch(function (err) {
        console.log("Error creating new doc ", err)
      });

  } else if (instituteCategory == "college" || instituteCategory == "lycee") {
    if (newUserCategory == "student") {

      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
        .then(function (docClasse) {
          //We need to query the class the student has been affected to so we can affect him all the subjects

          var arrayMatiere = [];
          docClasse.data().matieres.forEach(function (elem) {
            arrayMatiere.push({ matiere: elem, timeDone: 0, timeValidated: 0 })
          });
          console.log($('select#selectClass').val());

          firestore.collection('users_temp').doc(newUserEmail)
            .set({    //, newUserCategory, newUserEmail, newUserFirstName, newUserLastName
              userCategory: newUserCategory,
              firstName: newUserFirstName,
              lastName: newUserLastName,
              email: newUserEmail,
              instituteCategory: instituteCategory,
              classe: $('select#selectClass').val(),
              instituteName: instituteName,
              idAdmin: user.uid,
              matieres: arrayMatiere
            }).then(function (docRef) {
              // console.log("New id : "+ docRef.id);
              clearCreationForm();

            }).catch(function (err) {
              console.log("Error creating new doc ", err)
            });
        }).catch(function (err) {
          console.log("Error: ", err);
        })


    } else if (newUserCategory == "teacher") {
      firestore.collection('users_temp').doc(newUserEmail)
        .set({
          userCategory: newUserCategory,
          firstName: newUserFirstName,
          lastName: newUserLastName,
          email: newUserEmail,
          instituteCategory: instituteCategory,
          matieres: $('select#selectMatiereTeacher').val(),
          classe: $('select#selectClassTeacher').val(),
          instituteName: instituteName,
          idAdmin: user.uid
        }).then(function (docRef) {
          // console.log("New id : "+ docRef.id);
          clearCreationForm();

        }).catch(function (err) {
          console.log("Error creating new doc ", err)
        });
    }

  }
  // console.log($('select#selectClassTeacher').val());

}

function setModificationList(instituteName) {

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      firestore.collection('users_temp').where('instituteName', '==', instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            if (doc.exists) {

              if (doc.data().soutien != true || doc.data().userCategory == 'teacher') {

                if (!docUser.data().dev) {
                  if (!docUser.data().testAccounts.includes(doc.id)) {
                    selectedModifyUser.selectize.addOption({ value: doc.data().email, text: doc.data().firstName + " " + doc.data().lastName });
                    // selectedModifyUser.selectize.addItem(doc.data().email);
                    var $select = $('select#selectModifyUser').selectize();
                    var control = $select[0].selectize;
                    control.clear();
                  }
                }
                else {
                  selectedModifyUser.selectize.addOption({ value: doc.data().email, text: doc.data().firstName + " " + doc.data().lastName });
                  // selectedModifyUser.selectize.addItem(doc.data().email);
                  var $select = $('select#selectModifyUser').selectize();
                  var control = $select[0].selectize;
                  control.clear();
                }

              }
            }

          });
        }).catch(function (err) {
          console.log("Error : ", err);
        });

      firestore.collection('users').where('instituteName', '==', instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc2) {
            if (doc2.exists) {
              if (doc2.data().userCategory != "admin") {
                if (doc2.data().soutien != true || doc2.data().userCategory == 'teacher') {
                  if (!docUser.data().dev) {
                    if (!docUser.data().testAccounts.includes(doc2.id)) {
                      selectedModifyUser.selectize.addOption({ value: doc2.data().email, text: doc2.data().firstName + " " + doc2.data().lastName });
                      // selectedModifyUser.selectize.addItem(doc.data().email);
                      var $select = $('select#selectModifyUser').selectize();
                      var control = $select[0].selectize;
                      control.clear();
                    }
                  }
                  else {
                    selectedModifyUser.selectize.addOption({ value: doc2.data().email, text: doc2.data().firstName + " " + doc2.data().lastName });
                    // selectedModifyUser.selectize.addItem(doc.data().email);
                    var $select = $('select#selectModifyUser').selectize();
                    var control = $select[0].selectize;
                    control.clear();
                  }

                }
              }
            }
          });
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

function setModifyForm(value) {
  switch (value) {
    case 'student':
      document.getElementById('divModifyStudent').style.display = 'block';
      document.getElementById('divModifyTeacher').style.display = 'none';
      document.getElementById('divModifyParent').style.display = 'none';


      break;
    case 'teacher':
      document.getElementById('divModifyStudent').style.display = 'none';
      document.getElementById('divModifyTeacher').style.display = 'block';
      document.getElementById('divModifyParent').style.display = 'none';
      break;
    case 'parent':
      document.getElementById('divModifyStudent').style.display = 'none';
      document.getElementById('divModifyTeacher').style.display = 'none';
      document.getElementById('divModifyParent').style.display = 'block';
      break;
  }
}



$('select#selectModifyParent').on('change', function () {

  firestore.collection('users').doc($('select#selectModifyParent').val()).get()
    .then(function (doc) {

      console.log(doc.data().linkedAccount);
      var $select = $('select#selectModifyParentStudent').selectize();
      var control = $select[0].selectize;
      control.setValue(doc.data().linkedAccount);

      $('#modifyParentFirstName').val(doc.data().firstName);
      $('#modifyParentLastName').val(doc.data().lastName);



    }).catch(function (err) {
      console.log("Error: ", err);
    });

});

function initParentSelection() {
  var user = auth.currentUser;

  firestore.collection('users').where('userCategory', '==', 'parent').where('instituteName', '==', 'Hackschooling Institute').get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        document.getElementById('selectModifyParent').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
      });
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

$('#btnModifyTeacher').on('click', function () {

  if ($('select#selectModifyTeacher').val() != '' && $('#teacherModifyFirstName').val() != '' && $('#teacherModifyLastName').val() != '' && $('select#selectModifyTeacherSubject').val() != '' && $('select#selectModifyTeacherClass').val() != '') {
    firestore.collection('users').doc($('select#selectModifyTeacher').val()).update({
      firstName: document.getElementById('teacherModifyFirstName').value,
      lastName: document.getElementById('teacherModifyLastName').value,
      matieres: $('select#selectModifyTeacherSubject').val(),
      realClasses: $('select#selectModifyTeacherClass').val()

    }).then(function () {
      console.log("Document teacher updated");
      clearModifyTeacherForm();
    }).catch(function (err) {
      console.log("Error: ", err);
    });
  }



});

function clearModifyTeacherForm() {
  // document.getElementById('selectModifyTeacherClass').selectize.clearOptions();
  // document.getElementById('selectModifyTeacherSubject').selectize.clearOptions();
  document.getElementById('teacherModifyFirstName').value = '';
  document.getElementById('teacherModifyLastName').value = '';
  var $select = $('select#selectModifyTeacherClass').selectize();
  var control = $select[0].selectize;
  control.clear();
  var $select2 = $('select#selectModifyTeacherSubject').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();
  // initTeacherSelection();




}

$('select#selectModifyTeacher').on('change', function () {

  firestore.collection('users').doc($('select#selectModifyTeacher').val()).get()
    .then(function (doc) {
      document.getElementById('teacherModifyFirstName').value = doc.data().firstName;
      document.getElementById('teacherModifyLastName').value = doc.data().lastName;

      var $select = $('select#selectModifyTeacherSubject').selectize();
      var control = $select[0].selectize;
      control.setValue(doc.data().matieres);
      var $select2 = $('select#selectModifyTeacherClass').selectize();
      var control2 = $select2[0].selectize;
      control2.setValue(doc.data().realClasses);
      // $('select#selectModifyTeacherSubject').val(doc.data().matieres);
      // $('select#selectModifyTeacherClass').val(doc.data().realClasses);

    }).catch(function (err) {
      console.log("Error: ", err);
    });

});

function initTeacherSelection() {
  var user = auth.currentUser;
  console.log('a');
  firestore.collection('users').doc(user.uid).get()
    .then(function (docAdmin) {
      firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', docAdmin.data().instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            document.getElementById('selectModifyTeacher').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            var $select = $('select#selectModifyTeacher').selectize();
            var control = $select[0].selectize;
            control.clear();
          })
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

function initClassCreation() {
  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (dat) {
    // alert('HEYYY');
    console.log("INSIDE JSON");
    dat.filieres.forEach(function (elem) {
      console.log(elem.nomFiliere);
      if (elem.nomFiliere != 'total') {
        // console.log('dzdzdz');
        document.getElementById('selectFiliere').selectize.addOption({ value: elem.nomFiliere, text: elem.nomFiliere })
        var $select = $('select#selectFiliere').selectize();
        var control = $select[0].selectize;
        control.clear();

        document.getElementById('modifySelectFiliere').selectize.addOption({ value: elem.nomFiliere, text: elem.nomFiliere })
        var $select2 = $('select#modifySelectFiliere').selectize();
        var control2 = $select2[0].selectize;
        control2.clear();



        for (var i = 0; i < elem.matieresGen.length; i++) {
          if (!arrayOfSubject.includes(elem.matieresGen[i])) {
            arrayOfSubject.push(elem.matieresGen[i]);
          }
        }
        for (var j = 0; j < elem.matieresSpe.length; j++) {
          if (!arrayOfSubject.includes(elem.matieresSpe[j])) {
            arrayOfSubject.push(elem.matieresSpe[j]);
          }
        }
        // for (var k = 0; k < elem.matieresOpt.length; k++) {
        //   if (!arrayOfSubject.includes(elem.matieresOpt[k])) {
        //     arrayOfSubject.push(elem.matieresOpt[k]);
        //   }
        // }
        // alert('d');
      }
      else {
        elem.matieresGen.forEach(function (elemSubject) {
          document.getElementById('selectTeacherSubject').selectize.addOption({ value: elemSubject, text: elemSubject });
          var $select2 = $('select#selectTeacherSubject').selectize();
          var control2 = $select2[0].selectize;
          control2.clear();

          document.getElementById('selectModifyTeacherSubject').selectize.addOption({ value: elemSubject, text: elemSubject });
          var $select3 = $('select#selectModifyTeacherSubject').selectize();
          var control3 = $select3[0].selectize;
          control3.clear();
        });
      }

      console.log(arrayOfSubject);

    });
  });
  // $.ajax({
  //   type: 'GET',
  //   url: '../../assets/json/filieres.json'
  // }).then(function (data) {
  //   alert('HEY4);,')
  //   data.filieres[0].matieres.forEach(function (elem) {

  //     listeMatieres.innerHTML += "<div class='checkbox'><input type='checkbox'name='matieresListe' val='" + elem + "'  id='" + elem + "_Student' class='switchery'><label for='" + elem + "'> &nbsp" + elem + "</label></div>";
  //   });
  //   var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresListe"]'));
  //   elems.forEach(function (html) {
  //     var switchery = new Switchery(html);
  //   });
  // });
console.log("init class creation")
  var arrayOfSubject = [];
  
}

function initClassSelection() {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        document.getElementById('selectCreateClass').selectize.addOption({ value: doc.id, text: doc.id })
        var $select = $('select#selectCreateClass').selectize();
        var control = $select[0].selectize;
        control.clear();

        document.getElementById('selectTeacherClass').selectize.addOption({ value: doc.id, text: doc.id })
        var $select = $('select#selectTeacherClass').selectize();
        var control = $select[0].selectize;
        control.clear();


        document.getElementById('selectModifyClass').selectize.addOption({ value: doc.id, text: doc.id })
        var $select3 = $('select#selectModifyClass').selectize();
        var control3 = $select3[0].selectize;
        control3.clear();


        document.getElementById('selectModifyTeacherClass').selectize.addOption({ value: doc.id, text: doc.id })
        var $select4 = $('select#selectModifyTeacherClass').selectize();
        var control4 = $select4[0].selectize;
        control4.clear();


      });
    }).catch(function (err) {
      console.log("Error: ", err);
    });

}

function clearCreationForm() {
  document.getElementById('createLastName').value = "";
  document.getElementById('createFirstName').value = "";
  document.getElementById('createAdresse').value = "";
  var $select = $('select#selectType').selectize();
  var control = $select[0].selectize;
  control.clear();
  var $select2 = $('select#selectClass').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();
  var $select3 = $('select#selectClassTeacher').selectize();
  var control3 = $select3[0].selectize;
  control3.clear();
}

function clearModifyForm() {
  modifyAdresse.value = "";
  modifyFirstName.value = "";
  modifyLastName.value = "";
  var $select = $('select#selectModifyType').selectize();
  var control = $select[0].selectize;
  control.clear();
  var $select2 = $('select#selectModifyClass').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();
  var $select3 = $('select#selectModifyClassTeacher').selectize();
  var control3 = $select3[0].selectize;
  control3.clear();
  var $select4 = $('select#selectModifyUser').selectize();
  var control4 = $select4[0].selectize;
  control4.clear();

}

$('select#selectModifyType').on('change', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      if (doc.data().instituteCategory == "college" || doc.data().instituteCategory == "lycee") {

        if ($('select#selectModifyType').val() == "teacher") {
          document.getElementById('collegeLyceeModifySection').style.display = "none";
          document.getElementById('collegeLyceeModifySectionTeacher').style.display = "block";
          firestore.collection('users').doc(user.uid).collection('classes').get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc2) {

                selectedModifyClass.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
                // selectedModifyClass.selectize.addItem(doc2.data().nomClasse);
                selectedModifyClassTeacher.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
                // selectedModifyClassTeacher.selectize.addItem(doc2.data().nomClasse);

                firestore.collection('users_temp').where("email", "==", $('select#selectModifyUser').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (document) {
                      if (document.exists) {
                        /*  var  $select = $('select#selectModifyClass').selectize();
                        var control = $select[0].selectize;
                        control.setValue(document.data().classe) */
                        var $select2 = $('select#selectModifyClassTeacher').selectize();
                        var control2 = $select2[0].selectize;
                        control2.setValue(document.data().classe);
                      }
                    });

                  }).catch(function (err) {
                    console.log("error :", err);
                  });

                firestore.collection('users').where("email", "==", $('select#selectModifyUser').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (document2) {
                      if (document2.exists) {
                        console.log("HERE :", document2.data().classe);
                        /* var  $select = $('select#selectModifyClass').selectize();
                        var control = $select[0].selectize;
                        control.setValue(document2.data().classe) */
                        var $select2 = $('select#selectModifyClassTeacher').selectize();
                        var control2 = $select2[0].selectize;
                        control2.setValue(document2.data().classe);
                      }
                    });

                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });
                /* var  $select = $('select#selectModifyClass').selectize();
                var control = $select[0].selectize;
                control.setValue(doc2.data().nomClasse)
                var  $select2 = $('select#selectModifyClassTeacher').selectize();
                var control2 = $select2[0].selectize;
                control2.setValue(doc2.data().nomClasse); */

                console.log(doc2.data().nomClasse);
              });
            }).catch(function (err) {
              console.log("error : ", err);
            });


        } else if ($('select#selectModifyType').val() == "student") {
          document.getElementById('collegeLyceeModifySection').style.display = "block";
          document.getElementById('collegeLyceeModifySectionTeacher').style.display = "none";
          firestore.collection('users').doc(user.uid).collection('classes').get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc2) {

                selectedModifyClass.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
                // selectedModifyClass.selectize.addItem(doc2.data().nomClasse);
                /*  selectedModifyClassTeacher.selectize.addOption({value: doc2.data().nomClasse, text:doc2.data().nomClasse});
                selectedModifyClassTeacher.selectize.addItem(doc2.data().nomClasse); */

                firestore.collection('users_temp').where("email", "==", $('select#selectModifyUser').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (document) {
                      if (document.exists) {
                        var $select = $('select#selectModifyClass').selectize();
                        var control = $select[0].selectize;
                        control.setValue(document.data().classe)
                        // var  $select2 = $('select#selectModifyClassTeacher').selectize();
                        // var control2 = $select2[0].selectize;
                        // control2.setValue(document.data().classe);
                      }
                    });

                  }).catch(function (err) {
                    console.log("error :", err);
                  });

                firestore.collection('users').where("email", "==", $('select#selectModifyUser').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (document2) {
                      if (document2.exists) {
                        console.log("HERE :", document2.data().classe);
                        var $select = $('select#selectModifyClass').selectize();
                        var control = $select[0].selectize;
                        control.setValue(document2.data().classe)
                        /* var  $select2 = $('select#selectModifyClassTeacher').selectize();
                        var control2 = $select2[0].selectize;
                        control2.setValue(document2.data().classe); */
                      }
                    });

                  }).catch(function (err) {
                    console.log("Error : ", err);
                  });
                /* var  $select = $('select#selectModifyClass').selectize();
                var control = $select[0].selectize;
                control.setValue(doc2.data().nomClasse)
                var  $select2 = $('select#selectModifyClassTeacher').selectize();
                var control2 = $select2[0].selectize;
                control2.setValue(doc2.data().nomClasse); */

                console.log(doc2.data().nomClasse);
              });
            }).catch(function (err) {
              console.log("error : ", err);
            });

        }

      }
    }).catch(function (err) {
      console.log("Error : ", err);
    });

  /* console.log(selectedClass.className);
  console.log(selectedClass.getAttribute("multiple")); */

});

$('select#selectModifyUser').on('change', function () {

  console.log($('select#selectModifyUser').val())
  if ($('select#selectModifyUser').val() != "") {
    // console.log($('select#selectModifyUser').val());
    firestore.collection('users_temp').doc($('select#selectModifyUser').val()).get()
      .then(function (doc) {
        if (doc.exists) {
          modifyFirstName.value = doc.data().firstName;
          modifyLastName.value = doc.data().lastName;
          var $select = $('select#selectModifyType').selectize();  // This initializes the selectize control
          var selectize = $select[0].selectize;
          selectize.setValue(doc.data().userCategory);
          modifyAdresse.value = doc.data().email;
        } else {
          console.log("The document isn't in temp collection, you should check into users");
          firestore.collection('users').where("email", "==", $('select#selectModifyUser').val()).get()
            .then(function (querySnapshot) {

              querySnapshot.forEach(function (doc2) {
                if (doc2.exists) {
                  console.log("THE DOCU EXISTS");
                  modifyFirstName.value = doc2.data().firstName;
                  modifyLastName.value = doc2.data().lastName;
                  var $select = $('select#selectModifyType').selectize();  // This initializes the selectize control
                  var selectize = $select[0].selectize;
                  selectize.setValue(doc2.data().userCategory);
                  modifyAdresse.value = doc2.data().email;
                } else {
                  console.log("IT DOSNT EXIST");
                }
              });
            }).catch(function (err) {
              console.log("Error :", err);
            });
        }
      }).catch(function (err) {
        console.log("Error : ", err);
      });
  }


  $('select#selectModifyType').on('change', function () {

  });


});

function doNothing() {
};

$('#btnValidateModifyForm').click(function () {
  var user = auth.currentUser;

  if ($('select#selectModifyUser').val() == "" || modifyFirstName.value == "" || modifyLastName.value == "" || $('select#selectModifyType').val() == "" || modifyAdresse.value == "") {
    alert("Vous avez oublié de remplir un ou plusieurs champs");
  } else {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().instituteCategory == "lycee" || docUser.data().instituteCategory == "college") {
          var classValue = "";

          if ($('select#selectModifyType').val() == "student") {
            var query = firestore.collection('users_temp').doc($('select#selectModifyUser').val());
            query.get()
              .then(function (doc) {
                if (doc.exists) {
                  console.log($('select#selectModifyType').val())

                  query.update({
                    firstName: modifyFirstName.value,
                    lastName: modifyLastName.value,
                    email: modifyAdresse.value,
                    classe: $('select#selectModifyClass').val(),
                    userCategory: $('select#selectModifyType').val()


                  }).then(function () {
                    clearModifyForm();
                    return;
                  });
                }
              }).catch(function (err) {
                console.log("Error : ", err);
              });

            var query2 = firestore.collection('users').where("email", "==", $('select#selectModifyUser').val());
            query2.get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc2) {
                  if (doc2.exists) {
                    /*  query2.doc2.update({
                      firstName: modifyFirstName.value,
                      lastName: modifyLastName.value,
                      email: modifyAdresse.value,
                      userCategory: $('select#selectModifyType').val()
                      
                    }); */

                    var query3 = firestore.collection('users').doc(doc2.data().id);
                    query3.update({
                      firstName: modifyFirstName.value,
                      lastName: modifyLastName.value,
                      email: modifyAdresse.value,
                      classe: $('select#selectModifyClass').val(),
                      userCategory: $('select#selectModifyType').val()

                    }).then(function () {
                      clearModifyForm();
                      return;
                    });
                  }
                });
              }).catch(function (err) {
                console.log("Error :", err);
              });

            // classValue = $('select#selectModifyClass').val();
          } else if ($('select#selectModifyType').val() == "teacher") {
            var query = firestore.collection('users_temp').doc($('select#selectModifyUser').val());
            query.get()
              .then(function (doc) {
                if (doc.exists) {
                  console.log($('select#selectModifyType').val())

                  query.update({
                    firstName: modifyFirstName.value,
                    lastName: modifyLastName.value,
                    email: modifyAdresse.value,
                    classe: $('select#selectModifyClassTeacher').val(),
                    userCategory: $('select#selectModifyType').val()


                  }).then(function () {
                    clearModifyForm();
                    return;
                  });
                }
              }).catch(function (err) {
                console.log("Error : ", err);
              });

            var query2 = firestore.collection('users').where("email", "==", $('select#selectModifyUser').val());
            query2.get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc2) {
                  if (doc2.exists) {
                    /*  query2.doc2.update({
                      firstName: modifyFirstName.value,
                      lastName: modifyLastName.value,
                      email: modifyAdresse.value,
                      userCategory: $('select#selectModifyType').val()
                      
                    }); */

                    var query3 = firestore.collection('users').doc(doc2.data().id);
                    query3.update({
                      firstName: modifyFirstName.value,
                      lastName: modifyLastName.value,
                      email: modifyAdresse.value,
                      classe: $('select#selectModifyClassTeacher').val(),
                      userCategory: $('select#selectModifyType').val()

                    }).then(function () {
                      clearModifyForm();
                      return;
                    });
                  }
                });
              }).catch(function (err) {
                console.log("Error :", err);
              });

            // classValue = $('select#selectModifyClassTeacher').val();
          }



        } else if (docUser.data().instituteCategory == "soutien") {

          var query = firestore.collection('users_temp').doc($('select#selectModifyUser').val());
          query.get()
            .then(function (doc) {
              if (doc.exists) {
                console.log($('select#selectModifyType').val())

                query.update({
                  firstName: modifyFirstName.value,
                  lastName: modifyLastName.value,
                  email: modifyAdresse.value,
                  userCategory: $('select#selectModifyType').val()


                }).then(function () {
                  clearModifyForm();
                  return;
                });
              }
            }).catch(function (err) {
              console.log("Error : ", err);
            });

          var query2 = firestore.collection('users').where("email", "==", $('select#selectModifyUser').val());
          query2.get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc2) {
                if (doc2.exists) {
                  /*  query2.doc2.update({
                    firstName: modifyFirstName.value,
                    lastName: modifyLastName.value,
                    email: modifyAdresse.value,
                    userCategory: $('select#selectModifyType').val()
                    
                  }); */

                  var query3 = firestore.collection('users').doc(doc2.data().id);
                  query3.update({
                    firstName: modifyFirstName.value,
                    lastName: modifyLastName.value,
                    email: modifyAdresse.value,
                    userCategory: $('select#selectModifyType').val()

                  }).then(function () {
                    clearModifyForm();
                    return;
                  });
                }
              });
            }).catch(function (err) {
              console.log("Error :", err);
            });

        } // END IF





      }).catch(function (err) {
        console.log("Error : ", err);
      });


    console.log("should clear the form");
    // setTimeout(doNothing(),5000);
    // clearModifyForm();
  }

});


$('#btnValidateForm').click(function () {
  var user = auth.currentUser;
  var createFirstName = document.getElementById('createFirstName').value;
  var createLastName = document.getElementById('createLastName').value;
  var selectType = document.getElementById('selectType').value;
  var createEmail = document.getElementById('createAdresse');
  // var createClasse = document.getElementById('createClasse').value;

  if (createFirstName == "" || createLastName == "" || selectType == "" || createEmail.value == "") {
    alert('Vous avez oublié de remplir un champ');
  } else {

    if (createEmail.checkValidity()) {
      console.log("1st setp");
      //ev.preventDefault();
      swal({
        title: "Ajouter un nouvel utilisateur ?",
        text: "En cas d'erreur sur les informations indiquées, vous pourrez toujours les modifier plus tard.",
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
          firestore.collection('users').doc(user.uid).get()
            .then(function (doc) {
              addNewUser(doc.data().instituteCategory, selectType, createEmail.value, createFirstName, createLastName, doc.data().instituteName);
              createUserForm.submit();

            }).catch(function (err) {
              console.log("error : ", err);
            })
          swal({
            title: "Un nouvel utilisateur a été ajouté",
            text: "Un email contenant le lien d'inscription a été envoyé à l'adresse <i>" + createEmail.value + "</i>",
            type: "success",
            html: true
          });

        } else {
          swal("Annulation", "L'utilisateur n'a pas été ajouté", "error");
        }
      });
    }// end if
    else {
      alert("mail not valid");


    }
  }


});