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
const storage = firebase.storage();

const settings = {
  /* your settings... */
  timestampsInSnapshots: true
};
firestore.settings(settings);
const auth = firebase.auth();



//For nav bar
var profilePicUser = document.getElementById('profilepic');
var userName = document.getElementById('username');
var hrefLogOut = document.getElementById('hrefLogOut');

//-----------------------

// var language = getLanguage();
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const navMenu = document.getElementById('main-menu-navigation');

function getLanguage() {
  var flag = window.location.href.split('/');
  if (flag[(flag.length - 2)] == "en")
  return "english";
  else
  return "french";
}


// Add a realtime listener for Firebase Authentification
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    var user = auth.currentUser;
    getUserInfo();
    // getUserNotif();
    // real time listener to detect a change in the database (notifications)
    /*firestore.collection('surfclub_users').doc(user.uid).onSnapshot(function(doc) {
      addNotifFromDb(doc);
    });*/
  } else {
    console.log('not logged in');
    location.href = "login.php";
  }
});

//Log out event
hrefLogOut.addEventListener('click', e => {
  //alert('je veux déco');
  firebase.auth().signOut();
  location.href = "login.php";
});

// $('body[data-open="hover"] .dropdown').on('mouseenter', function(){
//   if (!($(this).hasClass('open'))) {
//     $(this).addClass('open');
//   }else{
//     $(this).removeClass('open');
//   }
// }).on('mouseleave', function(event){
//   $(this).removeClass('open');
// });
// var menuType = $('body').data('menu');
// $('body[data-open="hover"] .dropdown a').on('click', function(e){
  
  
//   if(menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu'){
//     var $this = $(this);
//     console.log(Object.keys($this));
//     if($this.hasClass('dropdown-toggle')){
//       return false;
//     }
//   }
// });

function getUserInfo() {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  
  var currentEmail = document.getElementById('current-email');
  currentEmail.value = user.email;
  
  /*var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumberIn = document.getElementById('notifNumberIn');
  const notifConst1 = '<a href="javascript:void(0)" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '<a href="javascript:void(0)" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var notReadNumber = 0;*/
  
  // display user profile picture and username
  query.get().then(function(doc) {
    
    userName.innerHTML = "<b>" + doc.data().firstName + "</b>";
    
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');
    
    /*  if(doc.data().soutien == true)
    {
      document.querySelector('#btnAccueil').setAttribute("onclick", "location.href='dashboard-soutien.php'");
    }
    else
    {
      document.querySelector('#btnAccueil').setAttribute("onclick", "location.href='#'");
      
    } */
    // display notifications
    /*if (doc.data().notifications.length == 0) {
      var errorMessage1 = document.getElementById("error-message1");
      errorMessage1.style.display = "block";
    }
    else {
      for (var i=doc.data().notifications.length - 1; i >= 0  && (doc.data().notifications.length - i) < 8; i--) {
        
        if (!doc.data().notifications[i].viewed)
        notifHTML += notifConst1bis;
        else
        notifHTML += notifConst1;
        
        if (language == "english")
        notifHTML += doc.data().notifications[i].date + notifConst2 + doc.data().notifications[i].icon + notifConst3 + doc.data().notifications[i].title.en + notifConst4 + doc.data().notifications[i].description.en + notifConst5 + formatDelay(doc.data().notifications[i].date) + notifConst6;
        else
        notifHTML += doc.data().notifications[i].date + notifConst2 + doc.data().notifications[i].icon + notifConst3 + doc.data().notifications[i].title.fr + notifConst4 + doc.data().notifications[i].description.fr + notifConst5 + formatDelay(doc.data().notifications[i].date) + notifConst6;
      }
      
      for (var j=0; j<doc.data().notifications.length; j++) {
        if (doc.data().notifications[j].viewed == false)
        notReadNumber++;
      }
      
      if (doc.data().newNotif > 0)
      notifNumberTop.innerHTML = doc.data().newNotif;
      
      if (notReadNumber > 0)
      {
        if (language == "english")
        notifNumberIn.innerHTML = notReadNumber + " unread"
        else {
          if (notReadNumber == 1)
          notifNumberIn.innerHTML = "1 non lue";
          else
          notifNumberIn.innerHTML = notReadNumber + " non lues";
        }
      }
      notifList.innerHTML = notifHTML;
    }*/
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


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3;
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
/*function formatDelay(timeFrom) {
  var todayDate = Math.trunc(new Date().getTime()/1000);
  var theDelay = todayDate - timeFrom;
  var formatedDelay = "";
  var theDelayTrunc = 0;
  if (theDelay <= 0)
  return "";
  else {
    if (theDelay >= 31536000) {
      theDelayTrunc = Math.trunc(theDelay / 31536000);
      if (language == "english")
      {
        if (theDelayTrunc == 1)
        formatedDelay = "One year ago";
        else
        formatedDelay = theDelayTrunc + " years ago";
      }
      else
      {
        if (theDelayTrunc == 1)
        formatedDelay = "Il y a un an";
        else
        formatedDelay = "Il y a " +  theDelayTrunc + " ans";
      }
    } else if (theDelay >= 604800) {
      theDelayTrunc = Math.trunc(theDelay / 604800);
      if (language == "english")
      {
        if (theDelayTrunc == 1)
        formatedDelay = "One week ago";
        else
        formatedDelay = theDelayTrunc + " weeks ago";
      }
      else
      {
        if (theDelayTrunc == 1)
        formatedDelay = "Il y a une semaine";
        else
        formatedDelay = "Il y a " +  theDelayTrunc + " semaines";
      }
    } else if (theDelay >= 86400) {
      theDelayTrunc = Math.trunc(theDelay / 86400);
      if (language == "english")
      {
        if (theDelayTrunc == 1)
        formatedDelay = "One day ago";
        else
        formatedDelay = theDelayTrunc + " days ago";
      }
      else
      {
        if (theDelayTrunc == 1)
        formatedDelay = "Il y a un jour";
        else
        formatedDelay = "Il y a " +  theDelayTrunc + " jours";
      }
    } else if (theDelay >= 3600) {
      theDelayTrunc = Math.trunc(theDelay / 3600);
      if (language == "english")
      {
        if (theDelayTrunc == 1)
        formatedDelay = "One hour ago";
        else
        formatedDelay = theDelayTrunc + " hours ago";
      }
      else
      {
        if (theDelayTrunc == 1)
        formatedDelay = "Il y a une heure";
        else
        formatedDelay = "Il y a " +  theDelayTrunc + " heures";
      }
    } else if (theDelay >= 60) {
      theDelayTrunc = Math.trunc(theDelay / 60);
      if (language == "english")
      {
        if (theDelayTrunc == 1)
        formatedDelay = "One minute ago";
        else
        formatedDelay = theDelayTrunc + " minutes ago";
      }
      else
      {
        if (theDelayTrunc == 1)
        formatedDelay = "Il y a une minute";
        else
        formatedDelay = "Il y a " +  theDelayTrunc + " minutes";
      }
    } else {
      if (language == "english")
      formatedDelay = "Just now";
      else
      formatedDelay = "Il y a un instant";
    }
  }
  return formatedDelay;
}




// set that the new notifications has been viewed by the user in firebase
$('#notifLink').click(() => {
  var user = auth.currentUser;
  var query = firestore.collection('surfclub_users').doc(user.uid);
  var notifNumberTop = document.getElementById('notifNumberTop');
  
  if (notifNumberTop.innerHTML != "")
  {
    query.update({
      newNotif: 0
    });
    notifNumberTop.innerHTML = "";
  }
});

// mark all notifications as read
$('#notif-clearall').click(() => {
  var user = auth.currentUser;
  var query = firestore.collection('surfclub_users').doc(user.uid);
  var notifNumberIn = document.getElementById('notifNumberIn');
  var containerNameTop = "";
  var notifContainerTop;
  
  if (notifNumberIn.innerHTML != "" && notifNumberIn.innerHTML != null)
  {
    query.get().then((doc) => {
      var results = doc.data();
      for (var i=0; i<results.notifications.length; i++) {
        if (doc.data().notifications[i].viewed == false)
        {
          results.notifications[i].viewed = true;
          
          containerNameTop = "notif" + results.notifications[i].date;
          notifContainerTop = document.getElementById(containerNameTop);
          if (notifContainerTop != null)
          notifContainerTop.style.background = "";
        }
      }
      query.update(results);
      notifNumberIn.innerHTML = "";
    })
    .catch(function(error) {
      console.error("Error creating session: ", error);
    });
  }
});

// set that a precise notification has been viewed by the user
function clearNotif(notifId) {
  var notifContainer = document.getElementById(notifId);
  var notifNumberTop = document.getElementById('notifNumberTop');
  
  if (notifContainer.style.background != "" && notifContainer.style.background != null)
  {
    var user = auth.currentUser;
    var query = firestore.collection('surfclub_users').doc(user.uid);
    var notifNumber = notifId.split('f');
    var notifNumberIn = document.getElementById('notifNumberIn');
    var notifIndex = -1;
    var notReadNumber = 0;
    
    // not possible yet to modify only an element of a map located in an array --> have to update all the file
    query.get().then((doc) => {
      var results = doc.data();
      for (var i=0; i<results.notifications.length; i++) {
        if (results.notifications[i].date ==  notifNumber[1] && notifIndex == -1) {
          notifIndex = i;
        }
        if (results.notifications[i].viewed == false)
        notReadNumber++;
      }
      results.notifications[notifIndex].viewed = true;
      notifContainer.style.background = "";
      
      notReadNumber--;
      if (notReadNumber > 0)
      {
        if (language == "english")
        notifNumberIn.innerHTML = notReadNumber + " unread"
        else {
          if (notReadNumber == 1)
          notifNumberIn.innerHTML = "1 non lue";
          else
          notifNumberIn.innerHTML = notReadNumber + " non lues";
        }
      }
      else
      notifNumberIn.innerHTML = "";
      
      if (notifNumberTop.innerHTML != "" && notifNumberTop.innerHTML != null)
      {
        notifNumberTop.innerHTML = "";
        results.newNotif = 0;
      }
      
      query.update(results).then(function() {
        location.href = doc.data().notifications[notifIndex].url;
      })
      .catch(function(error) {
        console.error("Error updating notification: ", error);
      });
    })
    .catch(function(error) {
      console.error("Error getting notifications: ", error);
    });
  }
}

// function called when the user has a notification and is on the app
function addNotifFromDb(doc) {
  var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumber = 0;
  const notifConst1 = '<a href="javascript:void(0)" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '<a href="javascript:void(0)" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var currentHtml = notifList.innerHTML;
  var notifNb = doc.data().notifications.length - 1;
  
  if (doc.data().newNotif > 0 && notifNumberTop.innerHTML != doc.data().newNotif) {
    
    if (!doc.data().notifications[notifNb].viewed)
    {
      notifNumber++;
      notifHTML += notifConst1bis;
    }
    else
    notifHTML += notifConst1;
    
    if (language == "english")
    notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.en + notifConst4 + doc.data().notifications[notifNb].description.en + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;
    else
    notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.fr + notifConst4 + doc.data().notifications[notifNb].description.fr + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;
    
    if (doc.data().newNotif > 0)
    notifNumberTop.innerHTML = doc.data().newNotif;
    
    notifList.innerHTML = notifHTML + currentHtml;
    
  }
}*/

$('#password-form').submit((ev) => {
  var user = auth.currentUser;
  ev.preventDefault();
  
  var currentPassword = document.getElementById('current-password');
  var newPassword = document.getElementById('new-password');
  var confirmPassword = document.getElementById('password_confirmation');
  var errorMessage1 = document.getElementById('error-message2');
  var errorMessage2 = document.getElementById('error-message1');
  errorMessage1.style.display = "none";
  errorMessage2.style.display = "none";
  
  if (currentPassword.checkValidity() && newPassword.checkValidity() && confirmPassword.checkValidity())
  {
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);
    
    setTimeout(() => {
      user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
        if (newPassword.value == confirmPassword.value) {
          user.updatePassword(newPassword.value).then(function() {
            swal({
              title: "Mot de passe mis à jour",
              type:"success",
              html:true
            });
            currentPassword.value = "";
            newPassword.value = "";
            confirmPassword.value = "";
          }).catch(function(error) {
            errorMessage1.innerHTML = "Une erreur est survenue, veuillez réessayer plus tard.";
            errorMessage1.style.display = "block";
          });
          
        }
        else {
          errorMessage1.innerHTML = "Confirmez votre nouveau mot de passe.";
          errorMessage1.style.display = "block";
        }
      }).catch((error) => {
        errorMessage1.innerHTML = "Mot de passe actuel invalide.";
        errorMessage1.style.display = "block";
      }); 
    }, 1000);
    return false;
  }
});

$('#email-form').submit((ev) => {
  var user = auth.currentUser;
  ev.preventDefault();
  
  var currentEmail = document.getElementById('current-email');
  var newEmail = document.getElementById('new-email');
  var password = document.getElementById('password');
  var query = firestore.collection("users").doc(user.uid);
  
  var errorMessage3 = document.getElementById('error-message3');
  var errorMessage4 = document.getElementById('error-message4');
  errorMessage3.style.display = "none";
  errorMessage4.style.display = "none";
  
  if (newEmail.checkValidity() && password.checkValidity())
  {
    const credential = firebase.auth.EmailAuthProvider.credential(user.email, password.value);
    
    setTimeout(() => {
      user.reauthenticateAndRetrieveDataWithCredential(credential).then(() => {
        user.updateEmail(newEmail.value).then(function() {
          query.update({
            email: newEmail.value
          }).then(() => {
            if (language == "english")
            swal({
              title: "Email address updated",
              type:"success",
              html:true
            });
            else
            swal({
              title: "Adresse mail mise à jour",
              type:"success",
              html:true
            });
          });
          currentEmail.value = newEmail.value;
          password.value = "";
          newEmail.value = "";
        }).catch(function(error) {
          swal({
            title: error.message,
            type:"error",
            html:true
          });
        });
        
      }).catch((error) => {
        if (language == "english")
        errorMessage3.innerHTML = "Invalid password";
        else
        errorMessage3.innerHTML = "Mot de passe actuel incorret.";
        errorMessage3.style.display = "block";
        password.value = "";
      }); 
    }, 1000);
    return false;
  }
});

// send to arnaud@bythewave.surf the message (feedback/bugs)
$('#contact-us').click(function() {
  var textSwalStorage = document.getElementById("textSwal");
  // pop-up to give some explanations
  if (language == "english") {
    swal({
      title: "Contact us",
      text: "<textarea id='contactMessage' class='form-control'  rows='4' maxlength='300' placeholder='Type your message here'></textarea>",
      html: true,
      showCancelButton: true
    }, function() {
      var theMessage = document.getElementById('contactMessage').value;
      if (theMessage == '' || theMessage == null || theMessage.length > 300) {
        swal({
          title: "No message",
          text: "You can not send an empty message.",
          type: "error",
          html: true
        });
      }
      else {
        var user = auth.currentUser;
        var theForm = document.getElementById('contactUsForm');
        var messageForm = document.getElementById('sender-message');
        var senderEmail = document.getElementById('sender-email');
        senderEmail.value = user.email;
        messageForm.value = theMessage;
        
        //uncomment to send email, add the discount code to the message
        theForm.submit();
        
        swal({
          title: "Message sent",
          text: "Your message has been sent.<br>Thank you for your feedback.",
          type: "success",
          html: true
        });
      }
    });
  } else {
    swal({
      title: "Contactez-nous",
      text: "<textarea id='contactMessage' class='form-control'  rows='4' maxlength='300' placeholder='Entrez votre message ici'></textarea>",
      html: true,
      showCancelButton: true
    }, function() {
      var theMessage = document.getElementById('contactMessage').value;
      if (theMessage == '' || theMessage == null || theMessage.length > 300) {
        setTimeout(() => {
          swal({
            title: "Message vide",
            text: "Vous ne pouvez pas envoyer de message vide.",
            type: "error",
            html: true
          });
        }, 1000);
      }
      else {
        var user = auth.currentUser;
        var theForm = document.getElementById('contactUsForm');
        var messageForm = document.getElementById('sender-message');
        var senderEmail = document.getElementById('sender-email');
        senderEmail.value = user.email;
        messageForm.value = theMessage;
        
        //uncomment to send email, add the discount code to the message
        theForm.submit();
        
        setTimeout(() => {
          swal({
            title: "Message envoyé",
            text: "Votre message a bien été envoyé, nous le traiterons au plus vite.<br>Merci de votre retour.",
            type: "success",
            html: true
          });
        }, 1000);
      }
    });
  }
});