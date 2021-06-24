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



//For nav bar
var profilePicUser = document.getElementById('profilepic');
var hrefLogOut = document.getElementById('hrefLogOut');

//-----------------------

var language = getLanguage();
const userame = document.getElementById('username');
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
    getUserInfoNotif();
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

function formatDelay(timeFrom) {
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

// WARNING: not the same function than in other .js
function getUserInfoNotif() {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var userName = "";
  var profilePicUser = document.getElementById("profilepic");

  var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumberIn = document.getElementById('notifNumberIn');
  const notifConst0 = '<a href="';
  const notifConst1 = '" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var notReadNumber = 0;

  var areas = document.getElementById('areas');

  // display user profile picture and username
  query.get().then(function(doc) {
    setUserInterface(doc.data().userCategory, doc.data().soutien);
    if (doc.data().firstName = "" || doc.data().firstName == null) {
      userName = user.email
      if (userName.includes('@')) {
        var splitUserName = userName.split('@');
        userName = splitUserName[0];
      }
    } else {
      userName = doc.data().firstName;
    }//ZC57kLf1XpUOXh9QJUNDKS2pMgg1
    
    username.innerHTML = "<b>" + userName + "</b>";
    // if no url is set: display BTW logo
    if (doc.data().avatarUrl == "" || doc.data().avatarUrl == null)
      profilePicUser.src = "../../app-assets/images/logo/no_avatar.png";
    else
      profilepic.src = doc.data().avatarUrl;


    // display notifications
    if (doc.data().notifications.length == 0) {
      var errorMessage1 = document.getElementById("error-message1");
      errorMessage1.style.display = "block";
      var errorMessage2 = document.getElementById("error-message2");
      errorMessage2.style.display = "block";
    }
    else {
      for (var i=doc.data().notifications.length - 1; i >= 0  && (doc.data().notifications.length - i) < 8; i--) {
        if (!doc.data().notifications[i].viewed)
          notifHTML += notifConst0 + "javascript:void(0)" + notifConst1bis;
        else
          notifHTML += notifConst0 + doc.data().notifications[i].url + notifConst1;

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

      listNotif(doc);
    }
  });
}


// set that the new notifications has been viewed by the user in firebase
$('#notifLink').click(() => {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
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
  var query = firestore.collection('users').doc(user.uid);
  var notifNumberIn = document.getElementById('notifNumberIn');
  var containerNameTop = "";
  var containerNameTable = "";
  var notifContainerTop;
  var notifContainerTable;

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

          containerNameTable = "td-notif" + results.notifications[i].date;
          notifContainerTable = document.getElementById(containerNameTable);
          notifContainerTable.style.background = "";
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

// list all notifications in the page
function listNotif(doc) {
  var notifHTML = "";
  var notifTable = document.getElementById('tbody-notifications');
  var url = "";

  const notifConst1 = '<tr id="tr-notif';
  const notifConst2 = '"><td class="list-group-item notif" style="padding: 0.5rem 1rem;" id="td-notif';
  const notifConst2bis = '"><td class="list-group-item notif" style="background: #e5f7f8; padding: 0.5rem 1rem;" id="td-notif';
  const notifConst3 = '"><div class="media"><div class="media-left valign-middle"><i class="';
  const notifConst4 = '"></i></div><div class="media-body" style="text-align:left; padding-left: 10px;"><a href="';
  const notifConst5 = '" id="a-notif';
  const notifConst6 = '" onclick="clearNotif(this.id)"><h6 class="media-heading">';
  const notifConst7 = '</h6><p class="notification-text font-small-3 text-muted">';
  const notifConst8 = '</p><small><time class="media-meta text-muted">';
  const notifConst9 = '</time></small></a></div><div class="media-right valign-middle"><button class="btn btn-outline-danger remove-item-btn text-bold-600" id="btn-notif';
  const notifConst10 = '" onclick="removeNotif(this.id)"><i class="fas fa-times"></i></button></div></div></td>';

  for (var i=doc.data().notifications.length - 1; i >= 0; i--) {

  notifHTML += notifConst1 + doc.data().notifications[i].date;

  if (!doc.data().notifications[i].viewed) {
    notifHTML += notifConst2bis;
    url = "javascript:void(0)";
  }
  else {
    notifHTML += notifConst2;
    url = doc.data().notifications[i].url;
  }

  if (language == "english")
    notifHTML += doc.data().notifications[i].date + notifConst3 + doc.data().notifications[i].icon + notifConst4 + url + notifConst5 + doc.data().notifications[i].date + notifConst6 + doc.data().notifications[i].title.en + notifConst7 + doc.data().notifications[i].description.en + notifConst8 + formatDelay(doc.data().notifications[i].date) + notifConst9 + doc.data().notifications[i].date + notifConst10;
  else
    notifHTML += doc.data().notifications[i].date + notifConst3 + doc.data().notifications[i].icon + notifConst4 + url + notifConst5 + doc.data().notifications[i].date + notifConst6 + doc.data().notifications[i].title.fr + notifConst7 + doc.data().notifications[i].description.fr + notifConst8 + formatDelay(doc.data().notifications[i].date) + notifConst9 + doc.data().notifications[i].date + notifConst10;
  }
  notifTable.innerHTML = notifHTML;
}


// set that a precise notification has been viewed by the user
// WARNING: different than in other .js because have to modifiy 2 elements onclick
function clearNotif(notifId) {
  var notifNumber = notifId.split('f');
  var containerName = "notif" + notifNumber[1];
  var notifContainer = document.getElementById(containerName);
  var containerListName = "td-notif" + notifNumber[1];
  var notifContainerList = document.getElementById(containerListName);
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumberIn = document.getElementById('notifNumberIn');
  var notifIndex = -1;
  var notReadNumber = 0;

  if (notifContainerList.style.background != "" && notifContainerList.style.background != null)
  {
    var user = auth.currentUser;
    var query = firestore.collection('users').doc(user.uid);


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
      if (notifIndex != -1)
      {
        results.notifications[notifIndex].viewed = true;
        results.newNotif = 0;

        if (notifContainer != null)
          notifContainer.style.background = "";

        notifContainerList.style.background = "";
        notifNumberTop.innerHTML = "";
        // decrement to take into account the reading
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

        query.update(results).then(function() {
          location.href = doc.data().notifications[notifIndex].url;
        })
        .catch(function(error) {
          console.error("Error creating session: ", error);
        });;

      }
    })
    .catch(function(error) {
      console.error("Error creating session: ", error);
    });
  }
}

// set that a precise notification has been viewed by the user
function removeNotif(notifId) {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var notifNumber = notifId.split('f');
  var theContainer = "tr-notif" + notifNumber[1];
  var overallContainerList = document.getElementById('tbody-notifications');
  var notifContainerList = document.getElementById(theContainer);
  var overallContainerTop = document.getElementById('notifications');
  var theContainerTop = "notif" + notifNumber[1];
  var notifContainerTop = document.getElementById(theContainerTop);
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
    if (notifIndex != -1) {
      results.notifications.splice(notifIndex, 1);
      query.update(results);

      var garbage1 = overallContainerList.removeChild(notifContainerList);

      if (notifContainerTop != null)
        var garbage2 = overallContainerTop.removeChild(notifContainerTop);

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

      var newOverallContainerList = document.getElementById('tbody-notifications');
      if (doc.data().notifications.length == 1) {
        var errorMessage1 = document.getElementById("error-message1");
        errorMessage1.style.display = "block";
        var errorMessage2 = document.getElementById("error-message2");
        errorMessage2.style.display = "block";
      }
    }
  })
  .catch(function(error) {
    console.error("Error creating session: ", error);
  });

}

// function called when the user has a notification and is on the app
// WARNING: not the same than other files because have to add in 2 locations
function addNotifFromDb(doc) {
  var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  const notifConst1 = '<a href="javascript:void(0)" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '<a href="javascript:void(0)" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var currentHtml = notifList.innerHTML;
  var notifNb = doc.data().notifications.length - 1;

  var notifTableHTML = "";
  var notifTable = document.getElementById('tbody-notifications')
  const notifConstTable1 = '<tr id="tr-notif';
  const notifConstTable2 = '"><td class="list-group-item notif" style=": 0.5rem 1rem;"id="td-notif';
  const notifConstTable2bis = '"><td class="list-group-item notif" style="background: #e5f7f8; padding: 0.5rem 1rem;" id="td-notif';
  const notifConstTable3 = '"><div class="media"><div class="media-left valign-middle"><i class="';
  const notifConstTable4 = '"></i></div><div class="media-body" style="text-align:left; padding-left: 10px;"><a href="javascript:void(0)" id="a-notif';
  const notifConstTable5 = '" onclick="clearNotif(this.id)"><h6 class="media-heading">';
  const notifConstTable6 = '</h6><p class="notification-text font-small-3 text-muted">';
  const notifConstTable7 = '</p><small><time class="media-meta text-muted">';
  const notifConstTable8 = '</time></small></a></div><div class="media-right valign-middle"><button class="btn btn-outline-danger remove-item-btn text-bold-600" id="btn-notif';
  const notifConstTable9 = '" onclick="removeNotif(this.id)"><i class="fas fa-times"></i></button></div></div></td>';
  var currentTableHtml = notifTable.innerHTML;

  var notReadNumber = 0;

  if (doc.data().newNotif > 0 && notifNumberTop.innerHTML != doc.data().newNotif) {
    var errorMessage = document.getElementById("error-message1");
    errorMessage.style.display = "none";
    var errorMessage = document.getElementById("error-message2");
    errorMessage.style.display = "none";

    notifTableHTML += notifConstTable1 + doc.data().notifications[notifNb].date;

    if (!doc.data().notifications[notifNb].viewed)
    {
      notifHTML += notifConst1bis;
      notifTableHTML += notifConstTable2bis;
    }
    else
    {
      notifHTML += notifConst1;
      notifTableHTML += notifConstTable2;
    }

    if (language == "english")
    {
      notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.en + notifConst4 + doc.data().notifications[notifNb].description.en + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;

      notifTableHTML += doc.data().notifications[notifNb].date + notifConstTable3 + doc.data().notifications[notifNb].icon + notifConstTable4 + doc.data().notifications[notifNb].date + notifConstTable5 + doc.data().notifications[notifNb].title.en + notifConstTable6 + doc.data().notifications[notifNb].description.en + notifConstTable7 + formatDelay(doc.data().notifications[notifNb].date) + notifConstTable8 + doc.data().notifications[notifNb].date + notifConstTable9;
    }
    else
    {
      notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.fr + notifConst4 + doc.data().notifications[notifNb].description.fr + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;

      notifTableHTML += doc.data().notifications[notifNb].date + notifConstTable3 + doc.data().notifications[notifNb].icon + notifConstTable4 + doc.data().notifications[notifNb].date + notifConstTable5 + doc.data().notifications[notifNb].title.fr + notifConstTable6 + doc.data().notifications[notifNb].description.fr + notifConstTable7 + formatDelay(doc.data().notifications[notifNb].date) + notifConstTable8 + doc.data().notifications[notifNb].date + notifConstTable9;
    }

    if (doc.data().newNotif > 0)
      notifNumberTop.innerHTML = doc.data().newNotif;

    notifList.innerHTML = notifHTML + currentHtml;
    notifTable.innerHTML = notifTableHTML + currentTableHtml;

    for (var i=0; i<doc.data().notifications.length;i++) {
      if (doc.data().notifications[i].viewed == false)
        notReadNumber++;
    }
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
  }
}



function setUserInterface(userCategory, soutien) {
  if(userCategory == 'admin')
  {
    document.getElementById('adminSection').style.display = 'block';
    document.getElementById('rightMenuAdmin').style.display = 'block';
  }
  else if(userCategory == 'teacher')
  {
    if(soutien)
    {
      document.getElementById('teacherSoutienSection').style.display = 'block';
      document.getElementById('rightMenuSoutienTeacher').style.display = 'block';
      
    }
    else {
      document.getElementById('teacherSection').style.display = 'block';
      document.getElementById('rightMenuTeacher').style.display = 'block';
      
    }
  }
  else if(userCategory == 'student')
  {
    if(soutien)
    {
      document.getElementById('studentSoutienSection').style.display = 'block';
      document.getElementById('rightMenuSoutienStudent').style.display = 'block';
      
    }
    else {
      console.log("hey");
      document.getElementById('studentSection').style.display = 'block';
      document.getElementById('rightMenuStudent').style.display = 'block';
      
    }
  }
}