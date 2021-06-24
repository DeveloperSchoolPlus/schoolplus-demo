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

// Get Elements
const adresse = document.getElementById("adresse");
const password = document.getElementById("password");
const checkbox = document.getElementById("remember-me");

// Declare variables
var clickedSignUp = false;


function doNothing(){
};

//When Sign Up form is submitted
$("#signup-form").submit(function(ev) {
	var errorMessage1 = document.getElementById("error-message-1");
	var errorMessage2 = document.getElementById("error-message-2");
	var errorMessage3 = document.getElementById("error-message-3");
	var firstName = document.getElementById("firstname");
	var lastName = document.getElementById("lastname");
	
	if (adresse.checkValidity() && password.checkValidity() && firstName.checkValidity() && lastName.checkValidity() && checkbox.checkValidity())
	{
		clickedSignUp = true;
		var user = auth.currentUser;
		ev.preventDefault();
		errorMessage1.style.display = "none";
		errorMessage2.style.display = "none";
		setTimeout(doNothing(),5000);
		// Sign in
		const promise = auth.createUserWithEmailAndPassword(adresse.value, password.value);
		promise.catch(e =>  {
			if (e.code == "auth/weak-password")
			errorMessage2.style.display = "block";
			else if (e.code == "auth/email-already-in-use")
			{
				// try to login the user to see if he already has an account on Ride+
			/* 	const promise2 = auth.signInWithEmailAndPassword(adresse.value, password.value);
				promise2.catch(e =>  {
					// case 2: email and password does not match --> indicate to the user that this email is already used with another password: reset the password and do the registration again with the new password
					errorMessage3.style.display = "block";
					console.log("Error3: ", e.message);
				}); */
			}
			else {
				console.log('Error: ', e.message);
			}
		});
	} else
	{
		if (errorMessage1.style.display == "block")
		errorMessage1.style.display = "none";
		if (errorMessage2.style.display == "block")
		errorMessage2.style.display = "none";
		if (errorMessage3.style.display = "block")
		errorMessage3.style.display = "none";
	}
});


// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
	
	if(firebaseUser) 
	{
		console.log(firebaseUser);
		var user = auth.currentUser;
		var currentUrl = window.location.href.split('/');
		var query = firestore.collection("users").doc(user.uid);
		var errorMessage1 = document.getElementById("error-message-1");
		
		// onAuthStateChanged can be triggered without signing up first => We have to manage the different cases
		query.get().then(function(doc) {
			
			if(!doc.exists && clickedSignUp)
			{
				console.log('Case 3: User signed up but does not have an account');
				//We collect form's data
				var firstName = document.getElementById("firstname").value;
        var lastName = document.getElementById("lastname").value;
        var instituteName = document.getElementById("instituteName").value;
        // var instituteType = do²cument.getElementById("instituteType").value;
				// var newUserCategory = $("input[name='userCategory']:checked").val();
				
				

				//Then we use previously collected data to create corresponding document in Firebase
				query.set({
					id: user.uid,
					email: user.email,
					firstName: firstName,
          lastName: lastName,
          instituteName: instituteName,
          instituteCategory: 'lycee',
					userCategory: "admin",
					notifications:[],
					newNotif: 0
				}).then(function() {

          //if institute category == soutien scolaire 
          //DO 
          // else if == college || lycee
					//DO
					location.href="../../pages/fr/dashboardV2.php";

					
				}).catch(function(error) {
					console.log("Error creating user: ", error);
				});
				console.log("data should be written now");

				
				//location.href="../../pages/fr/dashboard.php";
			}
			else {
				//Log out the user so he can sign up
				console.log("user should be logged out");
				firebase.auth().signOut();
				console.log("user is now logged");
			}
			
		});
		
		
		
	} else {
		console.log("no user logged in");
	}
	
	
	
	
});