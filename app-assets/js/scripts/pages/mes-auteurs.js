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

//HTML VARIABLES
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const userFirstName = document.getElementById('firstname');
const userLastName = document.getElementById('lastname');
const userPhone = document.getElementById('phoneNumber');
const userEmail = document.getElementById('email');
const modalUserPic = document.getElementById('modalUserPic');
const modalUserName = document.getElementById('modalUserName');
const modalUserCategory = document.getElementById('modalUserCategory');
const navMenu = document.getElementById('main-menu-navigation');
const rightMenu = document.getElementById('rightMenu');

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');
        getUserInfo();
        // getUserNotif();
        initUserCards();
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
  firebase.auth().signOut();
  // if (language == "english")
  // location.href = "../../pages/en/login.php";
  // else
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
    }//ZC57kLf1XpUOXh9QJUNDKS2pMgg1

    console.log("IS DEV : ", doc.data().dev);
    // manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b id='userFirstName'>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });



  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

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

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="mes-cours-eleveV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Catalogue des formations</span></a></li><li data-menu=""><a href="mes-cours-eleveV3.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
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


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3;


        break;
      case 'parent':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php"  class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';


        document.getElementById('virtualClass').setAttribute('href', '#');
        break;
      case 'admin':
        console.log("here");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-user"></i><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-userV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="modify-userV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="modify-group.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes groupes d\'utilisateurs</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Mes formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-formation.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Consulter, ajouter ou éditer</span></a></li><li data-menu=""><a href="mes-outils.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-outils-scratch.php"  class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Bibliothèque</span></a></li>';
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 +  nav4bis + nav5 + nav6 /*+ nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Mes apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Mes organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3 ;
        break;
      case 'teacher':
        console.log("formateur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
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
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
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
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="teacher")
  {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="admin")
  {
    
    if(instituteCategory == "college" || instituteCategory == "lycee")
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-classes.php" class="nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Créer une classe</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="contenu-cours.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    } else if(instituteCategory == "soutien") 
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';
    }
    
  } */
}


function initUserCards() {

  var user = auth.currentUser;

  document.getElementById('list-following').innerHTML = '';

  //First we query user's doc to get his class
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      if (docUser.data().userCategory == 'student') {
        //Now that we have the class we're gonna query every teacher belonging to the institution + in charge of the class

        firestore.collection('users').where('userCategory', '==', 'author').where('instituteName', '==', docUser.data().instituteName).get()
          .then(function (querySnapshot) {

            querySnapshot.forEach(function (docTeachers) {

              // if(docTeachers.data().soutien != true)
              // {
              const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
              const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#" id="';// complete name
              const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
              const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
              const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn color-blue mb-1 mr-1 text-bold-600" id="mail_'; //id
              const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
              const listFollowingHtml6 = '</div></div></div></div>';

              var totalHTML = listFollowingHtml1 + docTeachers.id + listFollowingHtml2 + docTeachers.id + listFollowingHtml3 + docTeachers.data().firstName + " " + docTeachers.data().lastName + listFollowngHtml + 'Auteur' + listFollowingHtml4 + docTeachers.id + listFollowingHtml5 + listFollowingHtml6
              document.getElementById('list-following').innerHTML += totalHTML;
              // }

            });



            var avatars = document.getElementsByClassName('avatar-coach');
            var splitString;
            for (var i = 0; i < avatars.length; i++) {
              splitString = avatars[i].id.split('_');
              // console.log(splitString);
              updatePictures(splitString[1]);
            }

          }).catch(function (err) {
            console.log("Error: ", err);
          });
      }
      else if (docUser.data().userCategory == 'admin' || docUser.data().userCategory == 'author' || docUser.data().userCategory == 'teacher') {
        //Now that we have the class we're gonna query every teacher belonging to the institution + in charge of the class

        firestore.collection('users').where('userCategory', '==', 'author').where('instituteName', '==', docUser.data().instituteName).get()
          .then(function (querySnapshot) {

            querySnapshot.forEach(function (docTeachers) {

              // if(docTeachers.data().soutien != true)
              // {
              const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
              const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#" id="';// complete name
              const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
              const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
              const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn color-blue mb-1 mr-1 text-bold-600" id="mail_'; //id
              const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
              const listFollowingHtml6 = '</div></div></div></div>';

              var totalHTML = listFollowingHtml1 + docTeachers.id + listFollowingHtml2 + docTeachers.id + listFollowingHtml3 + docTeachers.data().firstName + " " + docTeachers.data().lastName + listFollowngHtml + 'Auteur' + listFollowingHtml4 + docTeachers.id + listFollowingHtml5 + listFollowingHtml6
              document.getElementById('list-following').innerHTML += totalHTML;
              // }
              var userCreationDate = 'inconnue';
              var userLastConnexionDate = 'inconnue';

              /* USER TABLE */
              if (docTeachers.data().logInfo != undefined) {
                console.log(getDateTime(docTeachers.data().logInfo.creationDate.seconds));
                userCreationDate = getDateTime(docTeachers.data().logInfo.creationDate.seconds);
                if (docTeachers.data().logInfo.lastConnexion != undefined && docTeachers.data().logInfo.lastConnexion !='') {
                  userLastConnexionDate = getDateTime(docTeachers.data().logInfo.lastConnexion.seconds)

                }
              }

              var createdContentCount = 0;
              if (docTeachers.data().createdContent != undefined ) {
                if(docTeachers.data().createdContent.length > 0)
                {
                  createdContentCount = docTeachers.data().createdContent.length;

                }
              }

            
              



              const table1 = '<tr rowspan="2"><td style="padding-left: 0.1%; padding-right: 0.1%;">' + docTeachers.data().lastName + '</td>';
              const table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;">' + docTeachers.data().firstName + '</td>';
              const table3 = '<td style="padding-left: 0.1%; padding-right: 0.1%;">' + docTeachers.data().email + '</td>';
              const table4 = '<td style="padding-left: 0.1%; padding-right: 0.1%;">' + docTeachers.data().tel + '</td>';
              const table5 = '<td style="padding-left: 0.1%; padding-right: 0.1%;">' + userCreationDate + '</td>';

              const table6 = '<td style="padding-left: 0.1%; padding-right: 0.1%;">' + userLastConnexionDate + '</td>';
              const table7 = '<td style="padding-left: 0.1%; padding-right: 0.1%;"><a href="#!" onClick="getCreatedContent(\''+docTeachers.id+'\')">' + createdContentCount + '</a></td>';


              const table8 = '<td style="padding-left: 0.1%; padding-right: 0.1%;"><button class="btn color-blue text-bold-600" name="mail_' + docTeachers.id + '" onclick="sendMail(this.name)"><i class="fas fa-envelope"></i> Contacter</button> </td></tr>'

              /* END USER TABLE */

              var totalDetailHTML = table1 + table2 + table3 + table4 + table5 + table6 + table7 +table8;
              document.getElementById('tableUser').innerHTML += totalDetailHTML;

            });



            var avatars = document.getElementsByClassName('avatar-coach');
            var splitString;
            for (var i = 0; i < avatars.length; i++) {
              splitString = avatars[i].id.split('_');
              // console.log(splitString);
              updatePictures(splitString[1]);
            }

          }).catch(function (err) {
            console.log("Error: ", err);
          });

      }




    }).catch(function (err) {
      console.log("Error :", err);
    });


}

function getCreatedContent(idUser) {
  document.getElementById('listContent').innerHTML = '';
  firestore.collection('users').doc(idUser).get()
    .then(function (docUser) {

      document.getElementById('contentTitle').innerHTML = ' Contenu créé par '+docUser.data().firstName+ ' '+docUser.data().lastName;

      if (docUser.data().createdContent != undefined ) {
        
        if(docUser.data().createdContent.length >0 )
        {
          document.getElementById('noContent').style.display ='none';
        document.getElementById('listContent').style.display ='block';
        var indexOfContentCours =0;

        docUser.data().createdContent.forEach(function(elem) {
          
          var query = firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(elem.queryLink[0]).collection(elem.queryLink[1]).doc(elem.queryLink[2]);
          
          query.get()
          .then(function(doc) {

            doc.data().createdContent.forEach(function(elemContent) {
              if(elemContent.contentId == elem.idContent)
              {
                console.log("OK :");
                console.log(elemContent.title);
                //Build html 
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
              var html9 = '</div></div></div>';

              var contentCategory = '';
              if (elemContent.contentType == 'cours') {
                console.log("1");
                contentCategory = ' - Fiche théorique';
              }
              else if (elemContent.contentType == 'exercices') {
                console.log("2");

                contentCategory = ' - Fiche d\'activité';
              }
              else if (elemContent.contentType == 'evaluationF') {
                console.log("3");

                contentCategory = ' - Evaluation formative';
              }
              else if (elemContent.contentType == 'evaluationC') {
                console.log("3");

                contentCategory = ' - Evaluation certificative';
              }
              console.log(contentCategory);

              var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elemContent.title + contentCategory + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elemContent.content + html9;
              document.getElementById('listContent').innerHTML += total;
              indexOfContentCours++;
                
              }
            });

          }).catch(function(err) {
            console.log("Error :", err);
          });


        });

        $('#modalDisplayContent').modal();
        }

      }
      else {
        document.getElementById('noContent').style.display ='block';
        document.getElementById('listContent').style.display ='none';
      }


    }).catch(function (err) {
      console.log("error: ", err);
    })
}

function changeVue(vue) {
  switch (vue) {
    case 'detail':
      document.getElementById('vueGlobal').style.display = 'none';
      document.getElementById('btnGlobal').style.display = 'block';
      document.getElementById('btnDetail').style.display = 'none';

      document.getElementById('vueDetail').style.display = 'block';
      break;
    case 'global':
      document.getElementById('vueGlobal').style.display = 'block';
      document.getElementById('btnGlobal').style.display = 'none';
      document.getElementById('btnDetail').style.display = 'block';

      document.getElementById('vueDetail').style.display = 'none';
      break;
  }
}

function getDateTime(startTime) {
  startTime = startTime.toString();
  startTime = startTime + '000';
  startTime = parseInt(startTime, 10);
  var start = new Date(startTime);
  console.log(startTime);
  var year = start.getFullYear();
  var month = start.getMonth() + 1;
  var day = start.getDate();
  var startHour = start.getHours();
  var startMinute = start.getMinutes();
  var startSecond = start.getSeconds();

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

  var dateTime = day + '/' + month + '/' + year + ' ' + startHour + ':' + startMinute + ':' + startSecond;
  return dateTime;
}

function updatePictures(userId) {

  var avatarId = "avatar_" + userId;
  childName = 'profile_pictures/' + userId;
  firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
    var avatars = document.getElementById(avatarId);
    avatars.setAttribute("src", avatarUrl);
  }).catch((err) => {
  });

}

function displayUserInfo(userId) {

  var user = auth.currentUser;

  modalUserPic.src = "../../app-assets/images/logo/no_avatar.png"
  userFirstName.value = '';
  userLastName.value = '';
  userPhone.value = '';
  userEmail.value = '';
  modalUserName.innerText = '';
  modalUserCategory.innerText = '';

  firestore.collection('users').doc(userId).get()
    .then(function (docUser) {

      modalUserName.innerText = docUser.data().firstName + " " + docUser.data().lastName;
      userFirstName.value = docUser.data().firstName;
      userLastName.value = docUser.data().lastName;
      if (docUser.data().tel != undefined && docUser.data().tel != null) {
        userPhone.value = docUser.data().tel;
      }
      else {
        userPhone.value = '';
      }
      userEmail.value = docUser.data().email;

      switch (docUser.data().userCategory) {
        case 'student':
          modalUserCategory.innerText = 'Élève';
          break;
        case 'teacher':
          modalUserCategory.innerText = 'Formateur';
          break;

        case 'author':
          modalUserCategory.innerText = "Auteur";
          break;
      }

      modalUserPic.src = document.getElementById('avatar_' + userId).src;


      $('#modalDisplayUser').modal();
    }).catch(function (err) {
      console.log("Error : ", err);
    });


}

function sendMail(userId) {

  var splitString = userId.split('_');
  var IDUser = splitString[1];
  var textSwalStorage = document.getElementById("textSwal");

  $('#modalMessage').modal();

  firestore.collection('users').doc(IDUser).get()
    .then(function (docUser) {
      var $select = $('select#selectRecipientCategory').selectize();
      var control = $select[0].selectize;
      control.setValue(docUser.data().userCategory);

      setTimeout(function () {


        var $select2 = $('select#selectMailRecipient').selectize();
        var control2 = $select2[0].selectize;
        control2.setValue(IDUser);
      }, 700);

    }).catch(function (err) {
      console.log("Error :", err);
    });
  // var splitString = userId.split('_');
  // var textSwalStorage = document.getElementById("textSwal");
  // // console.log(userId+ ' /// '+splitString[1]);
  // // pop-up to give some explanations
  // firestore.collection('users').doc(splitString[1]).get()
  //   .then(doc => {

  //     document.getElementById('form-firstnameto1').value = doc.data().firstName;
  //     document.getElementById('form-recipient1').value = doc.data().email;
  //     document.getElementById('form-firstnamefrom1').value = document.getElementById('userFirstName').innerText;
  //     swal({
  //       title: "Envoyer un mail à " + doc.data().firstName + " " + doc.data().lastName,
  //       text: "<textarea id='contactMessage' class='form-control'  rows='4' maxlength='1000' placeholder='Entrez votre message ici'></textarea>",
  //       html: true,
  //       showCancelButton: true
  //     }, function () {
  //       var theMessage = document.getElementById('contactMessage').value;
  //       if (theMessage == '' || theMessage == null || theMessage.length > 1000) {
  //         setTimeout(() => {
  //           swal({
  //             title: "Message vide",
  //             text: "Vous ne pouvez pas envoyer de message vide.",
  //             type: "error",
  //             html: true
  //           });
  //         }, 1000);
  //       }
  //       else {
  //         var user = auth.currentUser;
  //         document.getElementById('form-message1').value = theMessage;
  //         document.getElementById('form-sender1').value = user.email;

  //         //uncomment to send email, add the discount code to the message
  //         document.getElementById('sendMailForm').submit();

  //         // put a notif to the user
  //         var newNotif = {
  //           date: Math.floor(Date.now() / 1000),
  //           icon: "icon-mail icon-bg-circle bg-cyan",
  //           viewed: false,
  //           title: { en: "New message", fr: "Nouveau message" },
  //           description: { en: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + doc.data().email + '</i>) to answer the message.', fr: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> vous a envoyé un message. Allez sur la boîte mail associée à votre compte (<i>' + doc.data().email + '</i>) pour lui répondre.' },
  //           url: "#"
  //         }

  //         firestore.collection('users').doc(splitString[1]).update({
  //           notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
  //           newNotif: firebase.firestore.FieldValue.increment(1)
  //         })
  //           .then(() => {
  //             setTimeout(() => {
  //               swal({
  //                 title: "Message envoyé",
  //                 text: "Votre mail a bien été envoyé à <b>" + doc.data().firstName + " " + doc.data().lastName + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte School+",
  //                 type: "success",
  //                 html: true
  //               });
  //             }, 500);
  //           })
  //           .catch(err => {
  //             console.log('Error updating the recipient: ' + err);
  //           });


         
  //       }
  //     });

  //   })
  //   .catch(err => {
  //     console.log("Error getting the recipient: " + err);
  //   });
}