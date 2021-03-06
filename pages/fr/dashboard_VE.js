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
// //DEV
// var firebaseConfig = {
//     apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
//     authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
//     databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
//     projectId: "schoolplus-dev-e8a2d",
//     storageBucket: "schoolplus-dev-e8a2d.appspot.com",
//     messagingSenderId: "330523876306",
//     appId: "1:330523876306:web:cbdcee87b7e3e007"
//   };
  firebase.initializeApp(firebaseConfig);
  
  const firestore = firebase.firestore();
  
  const settings = {/* your settings... */ timestampsInSnapshots: true };
  
  firestore.settings(settings);
  
  const auth = firebase.auth();
  const secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
  
  
  
  var idAdmin;
  var instituteName;
  
  
  firebase.auth().onAuthStateChanged(firebaseUser => {
  
    if (firebaseUser) {
      // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      var user = auth.currentUser;
      var query = firestore.collection("users").doc(user.uid);
      query.get().then(function (doc) {
        if (doc.exists) {
  
         
  
          idAdmin = doc.data().idAdmin;
          instituteName = doc.data().instituteName;
  
        //   getFormations();
        //   getGroupes();
        //   getStudents();
 
        } else {
          firebase.auth().signOut();
          location.href = "login.php";
        }
      });
    } else {
      firebase.auth().signOut();
      location.href = "login.php";
    }
  
  });
  
  //Log out manager
  var hrefLogOut = document.getElementById("hrefLogOut");
  hrefLogOut.addEventListener('click', e => {
    //alert('je veux déco');
    firebase.auth().signOut().then(function () {
      localStorage.removeItem('data');
      localStorage.removeItem('dataSubjects');
      location.href = "login.php";
  
    });
  });
  
  $('#linkMesCours').attr('href','select-modules.php')
  $('#linkCalendar').attr('href','planning.php')
  $('#linkBilan').attr('href','#')
  $('#linkMesFormations').attr('href','create-formation.php')
  $('#linkPlanninExtra').attr('href','#')
  $('#linkBiblio').attr('href','mes-outils-scratch.php')
  
  $('#ajout_users').attr('href','create-userV2.php')
  $('#edit_users').attr('href','modify-userV2.php')
  $('#view_users').attr('href','modify-group.php')

  $('#view_formations').attr('href','create-formation.php')
  $('#tools_formations').attr('href','mes-outils.php')