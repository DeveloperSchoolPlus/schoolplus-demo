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

// Get Elements
const adresse = document.getElementById("adresse");
const password = document.getElementById("password");
const btnRegister = document.getElementById('btnRegister');
const lastname = document.getElementById('lastname');
const phoneNumber = document.getElementById('phoneNumber');
const firstname = document.getElementById('firstname');
const verifyEmail = document.getElementById('verifyEmail');
const classe = document.getElementById('classe');


// Declare variables
var clickedSignUp = false;


function doNothing(){
};

//GOOD
function checkUserInvitation(userEmail) {
	firestore.collection('users_temp').doc(userEmail).get()
	.then(function(doc) {
		if(doc.exists)
		{
			lastname.value = doc.data().lastName;
			firstname.value = doc.data().firstName;
			// adresse.value = doc.data().email;
			btnRegister.disabled = false;

			if(document.getElementById('error-message-1').style.display=="block")
			{
				document.getElementById('error-message-1').style.display = 'none';
			}
		} else {
			document.getElementById('error-message-1').style.display = 'block';
		}
	}).catch(function(err) {
		console.log('Error :', err);
	});
}

//GOOD
$('#btnVerifyEmail').click(function() {
	if(verifyEmail.value != "") {
		checkUserInvitation(verifyEmail.value);
	}
});

//When Sign Up form is submitted
$("#signup-form").submit(function(ev) {
	var errorMessage1 = document.getElementById("error-message-1");
	var errorMessage2 = document.getElementById("error-message-2");
	var errorMessage3 = document.getElementById("error-message-3");
	var firstName = document.getElementById("firstname");
	var lastName = document.getElementById("lastname");
	

	if (verifyEmail.checkValidity() && password.checkValidity() && firstName.checkValidity() && lastName.checkValidity())
	{
		ev.preventDefault();

		clickedSignUp = true;
		var user = auth.currentUser;
		errorMessage1.style.display = "none";
		errorMessage2.style.display = "none";
		setTimeout(doNothing(),5000);
		// Sign in
		const promise = auth.createUserWithEmailAndPassword(verifyEmail.value, password.value);
		promise.catch(e =>  {
			if (e.code == "auth/weak-password")
			errorMessage2.style.display = "block";
		});
	} else
	{
		if (errorMessage1.style.display == "block")
		errorMessage1.style.display = "none";
		if (errorMessage2.style.display == "block")
		errorMessage2.style.display = "none";
		// if (errorMessage3.style.display = "block")
		// errorMessage3.style.display = "none";
	}
});

//Seems to be good, need some tests
// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {	
	if(firebaseUser) 
	{
		var user = auth.currentUser;
		var newQuery = firestore.collection('users').doc(user.uid);
		var queryTemp = firestore.collection('users_temp').doc(verifyEmail.value);
		//Aller vérifier si le futur doc n'existe pas déjà
		//Ouvrir le doc temp pour récupérer les infos
		//Créer le doc final et mettre les infos nécessaire
		//Supprimer le doc temp
		//Rediriger vers le dashboard		
		newQuery.get()
		.then(function(newDoc) {
			if(!newDoc.exists && clickedSignUp)
			{
				var firstName = document.getElementById("firstname").value;
				var lastName = document.getElementById("lastname").value;
				queryTemp.get()
				.then(function(docTemp) {
					if(docTemp.data().userCategory == 'student')
					{
						newQuery.set({
							id: user.uid,
							email: user.email,
							tel: phoneNumber.value,
							firstName: firstName,
							matieres: [],
							lastName: lastName,
							soutien: true,
							userCategory: docTemp.data().userCategory,
							instituteName : docTemp.data().instituteName,
							idAdmin: docTemp.data().idAdmin,
							notifications: [],
							newNotif: 0
						}).then(function() {
							console.log("Document successfully written.");
							queryTemp.delete();
							window.location.href = '../../pages/fr/dashboard-soutien.php';
						}).catch(function(err) {
							console.log("Error while writing new Document : ", err);
						});
					}
					else 
					{
						newQuery.set({
							id: user.uid,
							email: user.email,
							firstName: firstName,
							lastName: lastName,
							soutien: true,
							userCategory: docTemp.data().userCategory,
							instituteName : docTemp.data().instituteName,
							idAdmin: docTemp.data().idAdmin,
							notifications: [],
							newNotif: 0
						}).then(function() {
							console.log("Document successfully written.");
							queryTemp.delete();
							window.location.href = '../../pages/fr/dashboard-soutien.php';
						}).catch(function(err) {
							console.log("Error while writing new Document : ", err);
						});
					}			
				}).catch(function(err) {
					console.log("Error : ", err);
				});
			}
		}).catch(function(err) {
			console.log("Error : ", err);
		});	
	} else {
		console.log("no user logged in");
	}
});