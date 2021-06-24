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
// 	apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
// 	authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
// 	databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
// 	projectId: "schoolplus-dev-e8a2d",
// 	storageBucket: "schoolplus-dev-e8a2d.appspot.com",
// 	messagingSenderId: "330523876306",
// 	appId: "1:330523876306:web:cbdcee87b7e3e007"
// };
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();
const storageRef = firebase.storage().ref();



// const user = auth.currentUser;
var idAdmin;
var instituteName;


firebase.auth().onAuthStateChanged(firebaseUser => {

	if (firebaseUser) {
		// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
		var user = auth.currentUser;
		var query = firestore.collection("users").doc(user.uid);
		query.get().then(function (doc) {
			if (doc.exists) {

				// document.getElementById('myBreadcumb').innerHTML = '<li class="breadcrumb-item"><a href="mes-outils.php">Editer un contenu</a></li>';
				// document.getElementById('myBreadcumb').innerHTML += '<li class="breadcrumb-item"><a href="#">'+formation+'</a></li>';
				// document.getElementById('myBreadcumb').innerHTML += '<li class="breadcrumb-item"><a href="#">'+module+'</a></li>';
				// document.getElementById('myBreadcumb').innerHTML += '<li class="breadcrumb-item active"><a href="#" id="breadcumbTitle"></a></li>';



				idAdmin = doc.data().idAdmin;
				instituteName = doc.data().instituteName;

				/* Get User Info */

				//Name
				var userFirstName = doc.data().firstName;
				var userLastName = doc.data().lastName;

				document.getElementById('userName').innerText = userFirstName + ' ' + userLastName;

				//Profile picture
				var childName = 'profile_pictures/' + user.uid;
				firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
					document.getElementById('profilePic').src = avatarUrl;
				}).catch((err) => {
					document.getElementById('profilePic').src = "../../app-assets/images/logo/no_avatar.png";
				});

				checkLink(chapterId);
				
				initPDF();
				getContent();
				setContent(doc.data().idAdmin, chapterId);
				updateUserLastCreatedContent(chapterId, doc.data().lastCreatedContent);

				//Here we need to update user lastContentCreated since he's editing it.


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
