//firebaseConfig for SchoolPlus Dev
var firebaseConfig = {
  apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
  authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
  databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
  projectId: "schoolplus-dev-e8a2d",
  storageBucket: "schoolplus-dev-e8a2d.appspot.com",
  messagingSenderId: "330523876306",
  appId: "1:330523876306:web:cbdcee87b7e3e007"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();

//Initialize variables to get HTML elements
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const connectLabel = document.getElementById('connectLabel');
const navMenu = document.getElementById('main-menu-navigation');

function getUserInfo()
{
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var userName = "";
  
  //Display user's profile picture and username
  query.get().then(function(doc) {
    if(doc.data().firstName = "" || doc.data().firstName == null)
    {
      userName = user.email
      
      if(userName.includes('@'))
      {
        var splitUserName = userName.split('@');
        userName = splitUserName[0];
      }
    } else{
      
      userName = doc.data().firstName;
      
    }
    
    setUserInterface(doc.data().userCategory);
    
    username.innerHTML = "<b>" + userName + "</b>";
    
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    //Check what category is user and display associated info
    var userCategory = doc.data().userCategory;
    
    switch(userCategory)
    {
      case 'student': 
      connectLabel.innerText = "Connecte-toi à un de tes professeurs";
      break;
      case 'teacher':
      connectLabel.innerText = "Connectez-vous à l'un de vos élèves";
      break;
    }
    
  }).catch(function(err) {
    console.log('Error displaying user info: ', err);
  });
  
}

function setUserInterface(userCategory) {
  
  if(userCategory =="student")
  {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard.php" class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleve.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    // navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-map-signs"></i><span data-i18n="nav.dash.main">Orientation</span></a></li>';
  } else if(userCategory =="teacher")
  {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard.php" class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item active"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    /*  navMenu.innerHTML +='<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bulletins</span></a></li>'; */
  }
}

/*global window, Sketchpad, WebSocket, Colorpalette, alert*/
var primaryServer = "wss://" + (window.location.hostname || "localhost") + ":8067/",
secondaryServer = "wss://public.server.sketchpad.pro:8067/";

function splitScreen(wsA, wsB,tokenId) {
  "use strict";
  console.log("Inintializing splitScreen", wsA); 
  var user = auth.currentUser.uid;
  
  
  var sketchpadA = new Sketchpad({
    containerEl: document.getElementById("sketchpadA"),
    token: window.location.hash || "#"+tokenId,
    ws: wsA,
    createPageConfig: {sid: "#1page_token"}
  });
  sketchpadA.setTool("pen");
  
  var sketchpadB = new Sketchpad({
    containerEl: document.getElementById("sketchpadB"),
    token: window.location.hash || "#"+tokenId,
    ws: wsB,
    createPageConfig: {sid: "#1page_token"}
  });
  sketchpadB.setTool("highlighter");
  
  //objects visible in developer console
  window.sketchpadA = sketchpadA;
  window.sketchpadB = sketchpadB;
  
}
function connectToServer(wsServerAddress,userId, onSuccessCallback, onErrorCallback) {
  "use strict";
  var tokenId = userId;
  var wsA = new WebSocket(wsServerAddress);
  var wsB = new WebSocket(wsServerAddress);
  function onError(e) {
    wsA.removeEventListener("error", onError);
    wsB.removeEventListener("error", onError);
    onErrorCallback(e);
  }
  
  function onOpen() {
    if (wsA.readyState === 1 && wsB.readyState === 1) {
      wsA.removeEventListener("error", onError);
      wsB.removeEventListener("error", onError);
      onSuccessCallback(wsA, wsB, userId);
    }
  }
  wsA.addEventListener("open", onOpen);
  wsB.addEventListener("open", onOpen);
  wsA.addEventListener("error", onError);
  wsB.addEventListener("error", onError);
}

function initSketchpad(idd) {
  "use strict";
  
  connectToServer(primaryServer,idd, splitScreen, function () {
    console.log("Primary server fail, trying secondary server...", secondaryServer);
    connectToServer(secondaryServer,idd, splitScreen, function () {
      alert("Connection fail.\n\nFollow instructions from: \nhttp://developers.sketchpad.pro\n \nto setup your own sketchpad server.");
    });
  });
  
  window.addEventListener("hashchange", function () {
    window.location.reload();//reconnect on room name in hash change
  });
  
}
/* 
function initSelectSketchpad(userCategory)
{
  var user = auth.currentUser;
  
  
  var select = document.getElementById("selectSketchpad");
  var query = firestore.collection('users');
  
  switch(userCategory)
  {
    case 'student':
    query = query.where('userCategory', '==', 'teacher');
    break;
    case 'teacher':
    query = query.where('userCategory', '==', 'student');
  }
  
  query.get()
  .then(function(querySnapshot){
    querySnapshot.forEach(function(doc) {
      
      if(doc.data().id != user.uid)
      {
        select.innerHTML +="<option value='"+doc.data().id+"'>"+doc.data().firstName+" "+doc.data().lastName+"</option>";
        
      }
    });
    
    
    
  }).catch(function(err) {
    console.log("Error : ", err);
  });
  //////
  
  
  /////
} */


$("#formSketchpad").submit(function(ev) {
  ev.preventDefault();
  initSketchpad($('#selectSketchpad').val());
});

// Add a realtime listener for Firebase Authentification
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
        // initSelectSketchpad(doc.data().userCategory);
        initSketchpad(user.uid);
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

