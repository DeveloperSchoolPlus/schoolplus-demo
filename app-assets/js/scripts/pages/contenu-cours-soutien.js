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

//HTML VARIABLES
const navMenu = document.getElementById('main-menu-navigation');

const selectedStudent = document.getElementById('selectStudent');
const selectedMatiere = document.getElementById('selectMatiere');
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const chapitreNumber = document.getElementById('chapitreNumberValue');
const chapNumber = document.getElementById('chapterNumber');
const chapitreName = document.getElementById('chapitreName');
const expectedSkills = document.getElementById('expectedSkills');
const challenges = document.getElementById('challenges');
// const endDate = document.getElementById('endDate');
const modifyChapitreNumber = document.getElementById('modifyChapitreNumber');
const modifyChapitreName = document.getElementById('modifyChapitreName');
const modifyExpectedSkills = document.getElementById('modifyExpectedSkills');
const modifyChallenges = document.getElementById('modifyChallenges');
const modifyTitle = document.getElementById('modifyTitle');
// const modifyEndDate = document.getElementById('modifyEndDate');




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
        getUserInfo();
        setUserInterface(doc.data().userCategory, doc.data().soutien);
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

//Log out manager
var hrefLogOut = document.getElementById("hrefLogOut");
hrefLogOut.addEventListener('click', e => {
  //alert('je veux d??co');
  firebase.auth().signOut();
  // if (language == "english")
  // location.href = "../../pages/en/login.php";
  // else
  location.href = "../../pages/fr/login.php";
});

//GOOD
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
    console.log("IS DEV: ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });

    //Fill the select of every student
    firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', doc.data().instituteName).where('soutien', '==', true).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (docUsers) {

          if (!doc.data().dev && doc.data().dev != undefined) {
            if (!doc.data().testAccounts.includes(docUsers.id)) {
              selectedStudent.selectize.addOption({ value: docUsers.id, text: docUsers.data().firstName + ' ' + docUsers.data().lastName });
              var $select = $('select#selectStudent').selectize();
              var control = $select[0].selectize;
              control.clear();
            }
          }
          else {
            selectedStudent.selectize.addOption({ value: docUsers.id, text: docUsers.data().firstName + ' ' + docUsers.data().lastName });
            var $select = $('select#selectStudent').selectize();
            var control = $select[0].selectize;
            control.clear();
          }


        });
      }).catch(function (err) {
        console.log("Error : ", err);
      });


  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

//GOOD
function modifyChapter(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");
  $("#modalModifyChapter").modal();

  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
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

function setUserInterface(userCategory, soutien) {
  // console.log("set user interface");
  var user = auth.currentUser;

  if (userCategory == "teacher") {
    if (soutien == undefined) {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">No??</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Tim??o</span></a></li></ul></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      navMenu.innerHTML += '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Planning+</span></a></li>';

    }
    else {
      var nav1 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      var nav2bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

      var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
      var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
      var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
      var nav6 = '</ul></li>';

      var nav7 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
      var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';

      var nav9 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
      var nav10 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
      var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">No??</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Tim??o</span></a></li></ul></li>';





      navMenu.innerHTML = nav1 + nav2 +nav2bis+ nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;
      rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves</a>';
      rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves - Soutien</a>';
      rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel ??tablissement</a>';


    }

    /*  navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bulletins</span></a></li>'; */
  } else if (userCategory == "admin") {

    // if (instituteCategory == "college" || instituteCategory == "lycee") {

    var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Plannings</span></a></li>';
    var nav2 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Mati??res</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-classes.php?target=createSubject" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er une mati??re</span></a></li></ul></li>';
    var nav3 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li></ul></li>';
    var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav4bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils p??dagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Cr??er un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

    var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li><li data-menu=""><a href="planning+.php" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
    var nav6 = '</ul></li>';

    var nav7 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
    var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des mati??res - ??l??ves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
    var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item active"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

    navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 +nav4bis+ nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

    var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves</a>';
    var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes ??l??ves - Soutien</a>';
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

//GOOD
$('select#selectStudent').on('change', function () {

  var user = auth.currentUser;
  selectedMatiere.selectize.clearOptions();
  if ($('select#selectStudent').val() != '') {
    firestore.collection('users').doc($('select#selectStudent').val()).get()
      .then(function (docUser) {

        docUser.data().matieres.forEach(function (elem) {
          selectedMatiere.selectize.addOption({ value: elem.matiere, text: elem.matiere });
          var $select = $('select#selectMatiere').selectize();
          var control = $select[0].selectize;
          control.clear();
        });

      }).catch(function (err) {
        console.log("Error : ", err);
      });
  }


});

//GOOD
$('#btnAddChapter').on('click', function () {
  var user = auth.currentUser;
  console.log("HEY LOOK HERE ", chapitreNumber.value);
  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
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
  function clearAddChapter() {
    chapitreNumber.value = "";
    chapitreName.value = "";
    expectedSkills.value = "";
    challenges.value = "";
    // endDate.value = "";
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

//GOOD
$('select#selectMatiere').on('change', function () {
  document.getElementById('basicContainer').innerHTML = "";
  if ($('select#selectMatiere').val() != '') {
    initChapters();
  }
});

//GOOD
function initChapters() {
  var user = auth.currentUser;

  console.log("Entering init chapters");
  var totalTime = 0;
  var chapterCount = 0;
  var chapterDuration = 0;
  var currentChapter = 0;
  const yearStartDate = 1567411200; //02/09/2019 ?? 08:00
  const yearEndDate = 1594929600; //16/07/2020 ?? 20:00
  const yearDuration = 21427200; //8 months
  const nbOfWeeks = 32; // taken on the 2019-2020 school calendar

  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"

  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time'>";

  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Cours, m??thodes</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p><h6 class=' card-title text-bold-600'>Exercices</h4><p class='card-text text-xs-left'>";



  var sponshtml7 = "</p><p> </p><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'>";
  var sponshtml8 = "</span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress";
  var sponshtml9 = "'></progress></div></div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='33%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml10 = "' type='button'  id='";

  var sponshtml11 = "' onclick='modifyChapter(";
  var sponshtml12 = ")'>Modifier</button></div></th><th width='33%' style='text-align: center'";
  var sponshtml13 = "'><button class='btn bg-school-plus btn-min-width text-bold-600'type='button' id='";
  var sponshtml14 = "' onclick='toDoList(\"";
  var sponshtml15 = "\");'>Ajouter le suivi</button></th><th style='text-align: center' width='33%'><button class='btn btn-info btn-min-width text-bold-600 btn-closing' type='button' id='close%";
  var sponshtml16 = "' onclick='closeChapter(\"";
  var sponshtml17 = "\");' disabled=''>Cl??turer chapitre</button></th></tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";


  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).get()
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
              + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + "doc2.id" + sponshtml10 + doc2.data().numeroChapitre + sponshtml11 + '"' + doc2.data().numeroChapitre + '"' + sponshtml12 + sponshtml13 + doc2.data().numeroChapitre + sponshtml14 + doc2.data().numeroChapitre + sponshtml15 + doc2.data().numeroChapitre + sponshtml16 + doc2.data().numeroChapitre + sponshtml17;

            addElement('basicContainer', 'div', html);
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
            deadlines[j].innerHTML = "Termin??"
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
    }).catch(function (err) {
      console.log("Error :", err);
    });

}

//GOOD
$('#formChapitre').submit(function (ev) {

  ev.preventDefault();

  var user = auth.currentUser;

  if (modifyChapitreNumber.value != modifyTitle.innerText) {
    //D'abord v??rifier que le nouveau num??ro de chapitre n'est pas d??j?? utilis??

    firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value).get()
      .then(function (doc) {
        if (doc.exists) {
          //If it already exists we display error message
          document.getElementById('error-message').style.display = "block";

        }
        else {
          //If it doesn't exist yet we get tobemodified chapter doc, get all the values and write data into new document with new chapitre number
          firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyTitle.innerText).get()
            .then(function (doc) {
              firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value)
                .set({
                  numeroChapitre: modifyChapitreNumber.value,
                  nomChapitre: modifyChapitreName.value,
                  challenges: modifyChallenges.value,
                  competences: modifyExpectedSkills.value,
                  cours: doc.data().cours,
                  exercices: doc.data().exercices
                }).then(function () {
                  //Then we delete previous doc
                  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyTitle.innerText).delete();
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
    firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value)
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


  console.log("Form valid??");


  //TODO
});

$('#modifyChapitreNumber').on('change', function () {

  if (document.getElementById('error-message').style.display == "block") {
    document.getElementById('error-message').style.display = "none";
  }

});

//GOOD
$('#btnDeleteChapter').on('click', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value).delete();
  console.log("Chapter deleted");
  document.getElementById('basicContainer').innerHTML = "";
  initChapters();
  $("#modalModifyChapter").modal("hide");
});

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


  $("#modalToDoList").modal();
  var pdfCoursUrl = '';
  var pdfExercicesUrl = '';

  var pdfCours = document.getElementById('pdfCours');
  pdfCours.data = '';
  var pdfExos = document.getElementById('pdfExos');
  pdfExos.data = '';
  // pdfExos.data = '';




  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
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



      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('??', 'e');
      nomMatiere = nomMatiere.replace('??', 'e');
      // console.log("ICI :"+ nomMatiere);


      var newNumeroChapitre = numeroChapitre;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      // alert(newNumeroChapitre);


      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {

          if (docUser.data().userCategory == 'teacher') {
            pdfCoursUrl = 'fiches_cours/' + docUser.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
            pdfExercicesUrl = 'fiches_exos/' + docUser.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";

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

            var sujetEvalUrl = 'sujets_evaluations/' + docUser.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
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

            var correctionExosUrl = 'exos_corriges/' + docUser.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
            firebase.storage().ref(correctionExosUrl).getDownloadURL().then(function (url) {
              console.log("corrig?? LNK " + url);
              document.getElementById('correctionLink').href = url;
              document.getElementById('correctionPresent').style.display = 'block';
              document.getElementById('correctionNoPresent').style.display = 'none';

            }).catch(function (err) {
              console.log("Error :", err);
              document.getElementById('correctionPresent').style.display = 'none';
              document.getElementById('correctionNoPresent').style.display = 'block';
            });
          }
          else {
            pdfCoursUrl = 'fiches_cours/' + user.uid + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
            pdfExercicesUrl = 'fiches_exos/' + user.uid + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";

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

            var sujetEvalUrl = 'sujets_evaluations/' + user.uid + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
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

            var correctionExosUrl = 'exos_corriges/' + user.uid + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
            firebase.storage().ref(correctionExosUrl).getDownloadURL().then(function (url) {
              console.log("corrig?? LNK " + url);
              document.getElementById('correctionLink').href = url;
              document.getElementById('correctionPresent').style.display = 'block';
              document.getElementById('correctionNoPresent').style.display = 'none';

            }).catch(function (err) {
              console.log("Error :", err);
              document.getElementById('correctionPresent').style.display = 'none';
              document.getElementById('correctionNoPresent').style.display = 'block';
            });
          }



        }).catch(function (err) {
          console.log("Error :", err);
        });





    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function addDivCours(text, namesArray, smileysArray) {
  // console.log("LOOOK HERE"+$('#coursContainer > fieldset').length);

  if (text == "" || text == undefined) {
    // console.log("case elpty");
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><input type="text" name="coursToDoList" value=""class="form-control input-lg" placeholder="Cours ?? lire et ?? synth??tiser" tabindex="4"><div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
  }
  else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><input type="text" name="coursToDoList" value="' + text + '" class="form-control input-lg" placeholder="Cours ?? lire et ?? synth??tiser" tabindex="4"><div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div>';
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
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('??', 'e');
      nomMatiere = nomMatiere.replace('??', 'e');
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
          var fileUrl = 'fiches_cours/' + doc.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'block';
            swal({
              title: "La fiche de cours a bien ??t?? supprim??e.",
              type: "success",
              html: true
            });

          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un probl??me est survenu, veuillez r??essayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });



    } else {
      swal("Annulation", "La fiche de cours n'a pas ??t?? supprim??e.", "error");
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
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('??', 'e');
      nomMatiere = nomMatiere.replace('??', 'e');
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
          var fileUrl = 'fiches_exos/' + doc.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFExercices').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosError').style.display = 'block';
            swal({
              title: "La fiche d'exercices a bien ??t?? supprim??e.",
              type: "success",
              html: true
            });

          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un probl??me est survenu, veuillez r??essayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });



    } else {
      swal("Annulation", "La fiche d'exercice n'a pas ??t?? supprim??e.", "error");
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
      firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapNumber.innerText).get()
        .then(function (docAdmin) {

          //COURS SECTION
          if (typeof docAdmin.data().cours == "string" || typeof docAdmin.data().cours == "object" && typeof docAdmin.data().cours[0] == "string" || typeof docAdmin.data().cours == "object" && docAdmin.data().cours.length < 1) {
            console.log("Cours is a string or object followed by a string or empty object, we can initialise");
            //We query selected student and check if he has the considered subject
            firestore.collection('users').doc($('select#selectStudent').val()).get()
              .then(function (doc) {

                //Now we prepare the suiviArray with name and ids of students + avancement set on sad
                //For each student we have to check if they have the selected matiere.
                doc.data().matieres.forEach(function (elem) {
                  if (elem.matiere == $('select#selectMatiere').val()) {
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
                firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapNumber.innerText)
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
            firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapNumber.innerText)
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
            firestore.collection('users').doc($('select#selectStudent').val()).get()
              .then(function (doc) {

                //Now we prepare the suiviExosArray with name and ids of students + avancement set on sad
                //For each student we have to check if they have the selected matiere.
                doc.data().matieres.forEach(function (elem) {
                  if (elem.matiere == $('select#selectMatiere').val()) {
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
                firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapNumber.innerText)
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
            firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).doc(chapNumber.innerText)
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



  console.log("Form valid??");
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



  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('??', 'e');
  nomMatiere = nomMatiere.replace('??', 'e');
  var newNumeroChapitre = chapNumber.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {

    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  if (thePDF.type == 'application/pdf') {

    //METTRE UNE LIMITE SUR LA TAILLE DE FICHIER? 

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().userCategory == 'teacher') {
          var uploadTask = storageRef.child("fiches_cours/" + docUser.data().idAdmin + "_" + $('select#selectStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
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
          var uploadTask = storageRef.child("fiches_cours/" + user.uid + "_" + $('select#selectStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
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



  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('??', 'e');
  nomMatiere = nomMatiere.replace('??', 'e');
  var newNumeroChapitre = chapNumber.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {

    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  if (thePDF.type == 'application/pdf') {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        if (docUser.data().userCategory == 'teacher') {
          var uploadTask = storageRef.child("fiches_exos/" + docUser.data().idAdmin + "_" + $('select#selectStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
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
          var uploadTask = storageRef.child("fiches_exos/" + user.uid + "_" + $('select#selectStudent').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
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

/* $('#upload-eval').change(function() {
  
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-eval').files[0];
  var storageRef = firebase.storage().ref();
  
  var nomMatiere = $('select#selectMatiere').val();
  if(nomMatiere.indexOf(' ') >= 0)
  {
    
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  
  nomMatiere = nomMatiere.replace('??', 'e');
  nomMatiere = nomMatiere.replace('??', 'e');
  var newNumeroChapitre = chapNumber.innerText;
  if(newNumeroChapitre.indexOf(' ') >= 0)
  {
    
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  // alert(newNumeroChapitre);
  
  if(theFile.type == 'application/pdf')
  {
    
    
    var uploadTask = storageRef.child('sujets_evaluations/'+user.uid+'_'+$('select#selectStudent').val()+'_'+nomMatiere+'_'+newNumeroChapitre+'.pdf').put(theFile);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
      document.getElementById('upload-eval').setAttribute('disabled', '');
      document.getElementById('loadingImg').style.display ='inline';
      document.getElementById('evalPresent').style.display = 'none';
      document.getElementById('evalNoPresent').style.display ='none';
    }, function(error) {
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
    }, function() {
      uploadTask.snapshot.ref.getDownloadURL().then(function(url) {
        document.getElementById('loadingImg').style.display ='none';
        document.getElementById('evalLink').href = url;
        document.getElementById('evalNoPresent').style.display = 'none';
        document.getElementById('evalPresent').style.display = 'block';
        
         // put a notif to the user
         var newNotif = {
          date:  Math.floor(Date.now() / 1000),
          icon: "icon-mail icon-bg-circle bg-cyan",
          viewed: false,
          title: {en: "New message", fr: "Nouvelle ??valuation"},
          description: {en: '<b>' + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + 'la' + '</i>) to answer the message.', fr: 'Une nouvelle <b>??valuation</b> a ??t?? ajout??e pour le <b>'+document.getElementById('chapterNumber').innerText+'</b> en <b>'+$('select#selectMatiere').val()+'</b>. Rendez-vous sur la page <i>Mes cours</i>pour la t??l??charger.'},
          url: "#"
        }

        firestore.collection('users').doc($('select#selectStudent').val()).update({
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
        
      });
      //Attributes
      document.getElementById('upload-eval').removeAttribute('disabled');
      document.getElementById('upload-eval').setAttribute('enabled', '');
      document.getElementById('upload-eval').value = '';
    });
    
    
    
    
  }
  
  
  
  
}); */
$('#upload-correction').change(function () {

  var user = auth.currentUser;
  var theFile = document.getElementById('upload-correction').files[0];
  var storageRef = firebase.storage().ref();

  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {

    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('??', 'e');
  nomMatiere = nomMatiere.replace('??', 'e');
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
          var uploadTask = storageRef.child('exos_corriges/' + docUser.data().idAdmin + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
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
          var uploadTask = storageRef.child('exos_corriges/' + user.uid + '_' + $('select#selectStudent').val() + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
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

function closeChapter(chapter) {
  $("#modalClosing").modal();
  var user = auth.currentUser;
  var submitButton = document.getElementById('submit-closing');
  // var theStudent = document.getElementById('studentNameClosing');
  // theStudent.innerText = $('select#selectStudent').val();
  var theTitle = document.getElementById('modalTitleClosing');
  theTitle.innerHTML = $('select#selectMatiere').val() + " - Cl??turer le " + chapter;
  // var instituteName = document.getElementById('instituteName');
  var studentsList = document.getElementById('studentsList');
  studentsList.style.display = "";
  studentsList.innerHTML = "";
  // var idAdmin = document.getElementById('idAdmin').innerHTML;

  const studentsListHtml0 = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title text-bold-600">Pour toute la classe</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><input type="checkbox" id="wholeClass" class="switchery switchery-wholeclass"></div></div></fieldset><span class="hidden" id="closingChapterNumber">' + chapter + '</span><br>';
  const studentsListHtml1 = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title">';
  const studentsListHtml2 = '</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><input type="checkbox" id="';
  const studentsListHtml3 = '" class="switchery switchery-students"></div></div></fieldset>';

  const studentsListHtml0bis = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title text-bold-600">Pour toute la classe</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><div class="help-block text-bold-600 text-success font-small-3"><i class="far fa-check-circle"></i> Chapitre termin??.</div></div></div></fieldset><span class="hidden" id="closingChapterNumber">' + chapter + '</span><br>';
  const studentsListHtml2bis = '</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><div class="help-block text-bold-600 text-success font-small-3"><i class="far fa-check-circle"></i> Chapitre termin??.</div></div></fieldset>';

  var studentsListHtml = "";

  var chapterCounter = 0;
  var chapterDuration = 0;
  var selectedChapter = 0;
  var missingTime = 0;
  var currentTime = 0;
  var hasStudentNotDone = false;
  var timeDone = 0;
  var currentChapter = 0;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).get()
        .then(function (querySnapshot2) {
          chapterCount = querySnapshot2.size;
          querySnapshot2.forEach(function (doc) {
            chapterCounter++;
            if (doc.id == "duration") {
              chapterDuration = Math.trunc(doc.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
              timeDone = doc.data().timeDone;
            }
            else {
              if (doc.data().numeroChapitre == chapter) {
                selectedChapter = chapterCounter;
              }
            }
          });
          goalDuration = chapterDuration * selectedChapter;

          firestore.collection('users').doc($('select#selectStudent').val()).get()
            .then(function (doc) {

              if (doc.data().matieres != null) {
                for (var j = 0; j < doc.data().matieres.length; j++) {
                  if (doc.data().matieres[j].matiere == $('select#selectMatiere').val()) {
                    currentTime = doc.data().matieres[j].timeDone + doc.data().matieres[j].timeValidated;
                    missingTime = goalDuration - currentTime;
                    currentChapter = Math.trunc(currentTime / chapterDuration) + 1;
                    if (missingTime >= chapterDuration)
                      currentProgress = 0;
                    else
                      currentProgress = ((currentTime - (currentChapter - 1) * chapterDuration) / chapterDuration) * 100;
                    if (missingTime >= 1) {
                      hasStudentNotDone = true;
                      studentsListHtml += studentsListHtml1 + doc.data().firstName + ' ' + doc.data().lastName + ' (' + Math.trunc(currentProgress) + '%) ' + studentsListHtml2 + doc.id + studentsListHtml3;
                    }
                    else
                      studentsListHtml += studentsListHtml1 + doc.data().firstName + ' ' + doc.data().lastName + studentsListHtml2bis;
                    break;
                  }
                }
              }


              if (!hasStudentNotDone && goalDuration <= timeDone) {
                studentsList.innerHTML = studentsListHtml0bis + studentsListHtml;
                var loadingPicture = document.getElementById('loading-picture');
                loadingPicture.style.display = "none";
              }
              else {
                studentsList.innerHTML = studentsListHtml0 + studentsListHtml;
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                  var switchery = new Switchery(html, { size: 'medium' });
                });

                var changeCheckbox = document.querySelector('.switchery-wholeclass');

                changeCheckbox.onchange = function () {
                  if (changeCheckbox.checked) {
                    var students = document.getElementsByClassName('switchery-students');

                    for (var i = 0; i < students.length; i++) {
                      if (!students[i].checked)
                        students[i].click();
                    }
                  }
                };

                submitButton.removeAttribute('disabled');
                submitButton.setAttribute('enabled', '');
                var loadingPicture = document.getElementById('loading-picture');
                loadingPicture.style.display = "none";
              }
            })
            .catch((err) => {
              console.log("error getting students " + err);
            });
        })
        .catch((err) => {
          console.log("Error getting subject: " + err);
        });

    }).catch(function (err) {
      console.log("Error : ", err);;
    })


}

function closeChapterCallback(studentsCounter, goalDuration) {
  if (studentsCounter >= 1) {
    var studentId = 0;
    var myStudent = 0;
    var nbStudents = 0;
    var missingTime = 0;
    var currentTime = 0;
    var subjectArray = [];

    var students = document.getElementsByClassName('switchery-students');
    for (var i = 0; i < students.length; i++) {
      if (students[i].checked) {
        nbStudents++;
        if (nbStudents == studentsCounter)
          studentId = students[i].id;
      }
    }
    firestore.collection('users').doc(studentId).get()
      .then((doc) => {
        if (doc.data().matieres != null) {
          subjectArray = doc.data().matieres;

          for (var j = 0; j < subjectArray.length; j++) {
            if (subjectArray[j].matiere == $('select#selectMatiere').val()) {
              currentTime = subjectArray[j].timeDone + subjectArray[j].timeValidated;
              missingTime = goalDuration - currentTime;
              if (missingTime >= 1)
                subjectArray[j].timeValidated += missingTime;
              break;
            }
          }
          if (missingTime >= 0) {
            firestore.collection('users').doc(studentId).update({
              matieres: subjectArray
            })
              .then(() => {
                closeChapterCallback(studentsCounter - 1, goalDuration);
              })
              .catch((err) => {
                console.log("Error updating the student: " + err);
              });
          }
          else {
            closeChapterCallback(studentsCounter - 1, goalDuration);
            $("#modalClosing").modal("hide");
          }
        }
      })
      .catch((err) => {
        console.log("Error getting the student: " + err);
      });
  }
  else {

    $("#modalClosing").modal("hide");
  }
};

$('#formClosing').submit(function (ev) {
  ev.preventDefault();
  var user = auth.currentUser;
  var submitButton = document.getElementById('submit-closing');
  submitButton.removeAttribute('enabled');
  submitButton.setAttribute('disabled', '');
  var studentsList = document.getElementById('studentsList');
  studentsList.style.display = "none";
  var loadingPicture = document.getElementById('loading-picture');
  loadingPicture.style.display = "";
  // var instituteName = document.getElementById('instituteName').innerHTML;
  // var idAdmin = document.getElementById('idAdmin').innerHTML;
  var chapterNumber = document.getElementById('closingChapterNumber').innerHTML;
  var chapter = 0;
  var chapterCounter = 0;
  var selectedChapter = 0;
  var goalDuration = 0;
  var nbStudents = 0;
  var timeDone = 0;

  firestore.collection('users').doc($('select#selectStudent').val()).collection($('select#selectMatiere').val()).get()
    .then(function (querySnapshot2) {
      chapterCount = querySnapshot2.size;
      querySnapshot2.forEach(function (doc) {
        chapterCounter++;
        if (doc.id == "duration") {
          chapterDuration = Math.trunc(doc.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
          timeDone = doc.data().timeDone;
        }
        else {
          if (doc.data().numeroChapitre == chapterNumber) {
            selectedChapter = chapterCounter;
          }
        }
      });
      goalDuration = chapterDuration * selectedChapter;

      var students = document.getElementsByClassName('switchery-students');

      for (var i = 0; i < students.length; i++) {
        if (students[i].checked) {
          nbStudents++;

        }
      }

      var wholeClass = document.getElementById('wholeClass');
      if (wholeClass.checked && goalDuration > timeDone) {
        // update the duration document corresponding to the subject so that it reaches 100% if wholeClass is checked
        firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc('duration').update({
          timeDone: goalDuration
        })
          .then(() => {
            var progressBars = document.getElementsByTagName('progress');
            var completion = document.getElementsByClassName('completion');
            var closingButtons = document.getElementsByClassName('btn-closing');
            progressBars[selectedChapter - 1].value = 100;
            progressBars[selectedChapter - 1].className = "progress progress-md progress-success progress";
            completion[selectedChapter - 1].innerHTML = "100%";
            if (closingButtons[selectedChapter] != null) {
              closingButtons[selectedChapter].removeAttribute('disabled');
              closingButtons[selectedChapter].setAttribute('enabled', '');
            }
            closeChapterCallback(nbStudents, goalDuration);
          })
          .catch((err) => {
            console.log("Error updating the global duration: " + err);
          });
      }
      else
        closeChapterCallback(nbStudents, goalDuration);
    })
    .catch((err) => {
      console.log("Error getting the chapters " + err);
    });
});