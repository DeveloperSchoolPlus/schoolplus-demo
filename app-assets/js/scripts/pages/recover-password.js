// firebaseConfig for SchoolPlus Dev
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

function forgotPassword() {
	var errorMessage = document.getElementById("error-message");
	errorMessage.style.display = "none";
	var emailAddress = document.getElementById("adresse");
	var auth = firebase.auth();
	var language = document.getElementById("language").value;
	auth.sendPasswordResetEmail(emailAddress.value).then(function() {
		var theForm = document.getElementById("forgot-password");
		theForm.style.display = "none";
		var successMessage = document.getElementById("success-message");
		if (language == "english")
			successMessage.innerHTML = "An email has been sent to <b>" + emailAddress.value + "</b>, verify your junks folder.";
		else
			successMessage.innerHTML = "Un mail vous a été envoyé à <b>" + emailAddress.value + "</b>, vérifiez vos courriers indésirables.";
		var linkSent = document.getElementById("link-sent");
		linkSent.style.display = "block";
	}).catch(function(error) {

		errorMessage.style.display = "block";
	});
}