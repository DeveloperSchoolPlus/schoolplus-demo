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
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const tabMatieres = document.getElementById('tabMatieres');
const selectedClass = document.getElementById('selectClass');
const selectedMatiere = document.getElementById('selectMatiere');
const navMenu = document.getElementById('main-menu-navigation');



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
        setStudentList(doc.data().instituteName);
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
    console.log("IS DEV: ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });

    // initBilan();

  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}
function setUserInterface(userCategory, soutien) {
  // console.log("set user interface");
  var user = auth.currentUser;

  if (userCategory == "teacher") {
    if (soutien == undefined) {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
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
      var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';





      navMenu.innerHTML = nav1 + nav2 +nav2bis+ nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

      rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
      rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
      rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

    }

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
    var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
    var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item active"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

    navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 +nav4bis+ nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

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
function setStudentList(instituteName) {

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      firestore.collection('users').where("userCategory", "==", "student").where("instituteName", "==", instituteName).where("soutien", "==", true).get()
        .then(function (querySnapshot) {
          //Then we build the selectStudent with every student of the institution
          querySnapshot.forEach(function (doc) {

            if (!docUser.data().dev && docUser.data().dev != undefined) {
              if (!docUser.data().testAccounts.includes(doc.id)) {
                document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
                var $select2 = $('select#selectStudent').selectize();
                // console.log(doc.data().firstName+' '+doc.data().lastName);
                var control2 = $select2[0].selectize;
                control2.clear();
              }
            }
            else {
              document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
              var $select2 = $('select#selectStudent').selectize();
              // console.log(doc.data().firstName+' '+doc.data().lastName);
              var control2 = $select2[0].selectize;
              control2.clear();
            }
          });
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}



$('select#selectStudent').on('change', function () {

  initBilan($('select#selectStudent').val());

});

function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function checkEventTimetamp(eventTimeStamp) {

  // console.log(new Date());
  // console.log(new Date(eventTimeStamp).getMonth());

  if (Date.now() - eventTimeStamp > 0) {
    //The event already passed we can count it
    return true;
  }
  else {
    return false;
  }

}

function getMonthLabel(number) {

  switch (number) {
    case 0:
      return 'Janvier';
    case 1:
      return 'Février';
    case 2:
      return 'Mars';
    case 3:
      return 'Avril';
    case 4:
      return 'Mai';
    case 5:
      return 'Juin';
    case 6:
      return 'Juillet';
    case 7:
      return 'Août';
    case 8:
      return 'Septembre';
    case 9:
      return 'Octobre';
    case 10:
      return 'Novembre';
    case 11:
      return 'Décembre';
  }
}


function initBilan(idUser) {

  var user = auth.currentUser;
  document.getElementById('tableBilan').innerHTML = '';
  firestore.collection('users').doc(idUser).get()
    .then(function (docUser) {

      docUser.data().matieres.forEach(function (elem) {

        var chapterCount = 0;
        var activityCount = 0;

        firestore.collection('users').doc(idUser).collection(elem.matiere).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (docChapter) {
              if (docChapter.id != 'duration') {
                chapterCount++;
              }
            });

            firestore.collection('activities').where('idUser', '==', $('select#selectStudent').val()).where('title', '==', elem.matiere).get()
              .then(function (querySnapshot2) {
                var index = 0;
                var lastMonth = 0;
                querySnapshot2.forEach(function (doc2) {

                  //Need to check if the event has already passed

                  // console.log(doc2.data().title);
                  // console.log(doc2.data().endDate);

                  if (index == 0) {
                    console.log("1st month: ", new Date(doc2.data().endDate).getMonth());
                    lastMonth = new Date(doc2.data().endDate).getMonth();
                    console.log(getMonthLabel(lastMonth));
                  }
                  else {
                    if (new Date(doc2.data().endDate).getMonth() != lastMonth) {
                      console.log("new Month :", new Date(doc2.data().endDate).getMonth());
                      lastMonth = new Date(doc2.data().endDate).getMonth();
                      console.log(getMonthLabel(lastMonth));
                    }
                  }

                  if (checkEventTimetamp(doc2.data().endDate)) {
                    activityCount++;
                  }
                  index++;
                });

                // console.log("Chapter Count : ", chapterCount);
                // console.log("Activity Count : ", activityCount);

                var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + elem.matiere + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + elem.matiere + 'Note1">' + chapterCount + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note2">' + activityCount + '</td><tr> ';
                var table = table1;

                document.getElementById('tableBilan').innerHTML += table;
              }).catch(function (err) {
                console.log("Error : ", err);
              });
          }).catch(function (err) {
            console.log("Error : ", err);
          });



      });

      var moyenneGenerale = 0;
      var totalGeneral = 0;
      var nbGenerale = 0;





    }).catch(function (err) {
      console.log('Error :', err);
    });

}



