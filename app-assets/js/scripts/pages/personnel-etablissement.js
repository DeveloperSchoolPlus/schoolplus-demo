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
        getUserInfo();
        setUserInterface(doc.data().soutien);
        getUserNotif();
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
    
    
    // manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b id='userFirstName'>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    
    
  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });
  
}

function setUserInterface(soutien) {
  if(soutien == undefined)
    {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboard.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    navMenu.innerHTML += '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item "><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Planning+</span></a></li>';

    rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
    rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item active"><i class="fas fa-users"></i> Personnel établissement</a>';

    }
    else {
      var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
      var nav2bis = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li><li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li></ul></li>';

      var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
      var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
      var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
      var nav6 = '</ul></li>';
      
      var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
      var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
      
      var nav9 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
      var nav10 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
      var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
      
      
      
      
      
      navMenu.innerHTML = nav1+nav2+nav2bis+nav3+nav4+nav5+nav6+nav7+nav8+nav9+nav10+nav11;
      
      rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
      rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
      rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item active"><i class="fas fa-users"></i> Personnel établissement</a>';

    }

    $('body[data-open="hover"] .dropdown').on('mouseenter', function(){
      if (!($(this).hasClass('open'))) {
        $(this).addClass('open');
      }else{
        $(this).removeClass('open');
      }
    }).on('mouseleave', function(event){
      $(this).removeClass('open');
    });
    var menuType = $('body').data('menu');
    $('body[data-open="hover"] .dropdown a').on('click', function(e){
      
      
      if(menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu'){
        var $this = $(this);
        console.log(Object.keys($this));
        if($this.hasClass('dropdown-toggle')){
          return false;
        }
      }
    });
}



function initUserCards() {
  
  var user = auth.currentUser;
  
  document.getElementById('list-following').innerHTML = '';
  
  //First we query user's doc to get his class
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    if(docUser.data().userCategory == 'teacher')
    {
      //Now that we have the class we're gonna query every teacher belonging to the institution + in charge of the class
      
      firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', docUser.data().instituteName).get()
      .then(function(querySnapshot) {
        
        querySnapshot.forEach(function(docTeachers) {
          
          if(docTeachers.id != user.uid)
          {
            if(docTeachers.data().soutien != true)
            {
              const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
              const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#/" id="';// complete name
              const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
              const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
              const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn bg-school-plus mb-1 mr-1 text-bold-600" id="mail_'; //id
              const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
              const listFollowingHtml6 = '</div></div></div></div>';
              
              var totalHTML = listFollowingHtml1 +docTeachers.id+ listFollowingHtml2 +docTeachers.id + listFollowingHtml3 + docTeachers.data().firstName + " " + docTeachers.data().lastName +listFollowngHtml+'Professeur'+ listFollowingHtml4 +docTeachers.id+ listFollowingHtml5 +listFollowingHtml6
              document.getElementById('list-following').innerHTML += totalHTML;
            }
            
          }
          
          
        });
        
        firestore.collection('users').doc(docUser.data().idAdmin).get()
        .then(function(docAdmin) {
          
          const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
          const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#/" id="';// complete name
          const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
          const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
          const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn bg-school-plus mb-1 mr-1 text-bold-600" id="mail_'; //id
          const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
          const listFollowingHtml6 = '</div></div></div></div>';
          
          var totalHTML = listFollowingHtml1 +docAdmin.id+ listFollowingHtml2 +docAdmin.id + listFollowingHtml3 + docAdmin.data().firstName + " " + docAdmin.data().lastName +listFollowngHtml+"Chef d'établissement"+ listFollowingHtml4 +docAdmin.id+ listFollowingHtml5 + listFollowingHtml6
          document.getElementById('list-following').innerHTML += totalHTML;
          
          var avatars = document.getElementsByClassName('avatar-coach');
          var splitString;
          for (var i=0; i< avatars.length; i++) {
            splitString = avatars[i].id.split('_');
            // console.log(splitString);
            updatePictures(splitString[1]);
          }
          
        }).catch(function(err) {
          console.log("Error: ", err);
        });
        
        
        
      }).catch(function(err) {
        console.log("Error : ", err);
      });
    }
    
    
    
    
    
  }).catch(function(err) {
    console.log("Error :" ,err);
  });
  
  
}

function updatePictures(userId) {
  
  var avatarId = "avatar_" + userId;
  childName = 'profile_pictures/' + userId;
  firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
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
  .then(function(docUser) {
    
    modalUserName.innerText = docUser.data().firstName + " " + docUser.data().lastName;
    userFirstName.value = docUser.data().firstName;
    userLastName.value = docUser.data().lastName;
    if(docUser.data().tel != undefined && docUser.data().tel != null)
    {
      userPhone.value = docUser.data().tel;
    }
    else
    {
      userPhone.value = '';
    }
    userEmail.value = docUser.data().email;
    
    switch(docUser.data().userCategory) {
      case 'student':
      modalUserCategory.innerText = 'Élève';
      break;
      case 'teacher':
      modalUserCategory.innerText = 'Professeur';
      break;
      case 'admin':
      modalUserCategory.innerText = "Chef d'établissement";
      break;
    }
    
    modalUserPic.src = document.getElementById('avatar_'+userId).src;    
    
    
    $('#modalDisplayUser').modal();
  }).catch(function(err) {
    console.log("Error : ", err);
  });
  
  
}

function sendMail(userId) {
  
  var splitString = userId.split('_');
  var textSwalStorage = document.getElementById("textSwal");
  // console.log(userId+ ' /// '+splitString[1]);
  // pop-up to give some explanations
  firestore.collection('users').doc(splitString[1]).get()
  .then(doc => {
    
    document.getElementById('form-firstnameto1').value = doc.data().firstName;
    document.getElementById('form-recipient1').value = doc.data().email;
    document.getElementById('form-firstnamefrom1').value = document.getElementById('userFirstName').innerText;
    swal({
      title: "Envoyer un mail à " + doc.data().firstName + " " + doc.data().lastName,
      text: "<textarea id='contactMessage' class='form-control'  rows='4' maxlength='1000' placeholder='Entrez votre message ici'></textarea>",
      html: true,
      showCancelButton: true
    }, function() {
      var theMessage = document.getElementById('contactMessage').value;
      if (theMessage == '' || theMessage == null || theMessage.length > 1000) {
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
        document.getElementById('form-message1').value = theMessage;
        document.getElementById('form-sender1').value = user.email;
        
        //uncomment to send email, add the discount code to the message
        document.getElementById('sendMailForm').submit();
        
        // put a notif to the user
        var newNotif = {
          date:  Math.floor(Date.now() / 1000),
          icon: "icon-mail icon-bg-circle bg-cyan",
          viewed: false,
          title: {en: "New message", fr: "Nouveau message"},
          description: {en: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + doc.data().email + '</i>) to answer the message.', fr: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> vous a envoyé un message. Allez sur la boîte mail associée à votre compte (<i>' + doc.data().email + '</i>) pour lui répondre.'},
          url: "#"
        }
        
        firestore.collection('users').doc(splitString[1]).update({
          notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
          newNotif: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
          setTimeout(() => {
            swal({
              title: "Message envoyé",
              text: "Votre mail a bien été envoyé à <b>" + doc.data().firstName + " " + doc.data().lastName + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte School+",              
              type: "success",
              html: true
            });
          }, 500);
        })
        .catch(err => {
          console.log('Error updating the recipient: ' + err);
        });
        
        /*  // put a notif to the user
        var newNotif = {
          date:  Math.floor(Date.now() / 1000),
          icon: "icon-mail icon-bg-circle bg-cyan",
          viewed: false,
          title: {en: "New message", fr: "Nouveau message"},
          description: {en: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + doc.data().email + '</i>) to answer the message.', fr: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> vous a envoyé un message. Allez sur la boîte mail associée à votre compte (<i>' + doc.data().email + '</i>) pour lui répondre.'},
          url: "#"
        } */
        
        /*   firestore.collection('stact_users').doc(splitString[1]).update({
          notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
          newNotif: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
          setTimeout(() => {
            swal({
              title: "Message envoyé",
              text: "Votre mail a bien été envoyé à <b>" + doc.data().firstname + " " + doc.data().lastname + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte STACT x BYTHEWAVE.",
              type: "success",
              html: true
            });
          }, 500);
        })
        .catch(err => {
          console.log('Error updating the recipient: ' + err);
        }); */
      }
    });
    
  })
  .catch(err => {
    console.log("Error getting the recipient: " + err);
  });
}