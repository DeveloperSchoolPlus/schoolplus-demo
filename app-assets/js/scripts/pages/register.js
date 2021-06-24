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

function checkUserInvitation(userEmail) {
	
	firestore.collection('users_temp').doc(userEmail).get()
	.then(function(doc) {
		if(doc.exists)
		{
			lastname.value = doc.data().lastName;
			firstname.value = doc.data().firstName;
			// adresse.value = doc.data().email;
			btnRegister.disabled = false;
			if(doc.data().instituteCategory == "college" || doc.data().instituteCategory == "lycee")
			{
				/* if(doc.data().userCategory == "student")
				{
					document.getElementById('classSection').style.display ="block";
					classe.value = doc.data().classe;
				} else if (doc.data().userCategory =="teacher")
				{
					document.getElementById('classSection').style.display ="block";
					classe.value = doc.data().classe;
				} */
				document.getElementById('classSection').style.display ="block";
				classe.value = doc.data().classe;
				console.log( doc.data().classe);
				
			}
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

$('#btnVerifyEmail').click(function() {
	
	if(verifyEmail.value != "") {
		checkUserInvitation(verifyEmail.value);
	}
});

function createUser() {
	var categoryUser = "";
	firestore.collection('users_temp'.where('email', '==', verifyEmail.value)).get()
	.then(function(querySnapshot) {
		querySnapshot.forEach(function(doc){
			categoryUser = doc.data().userCategory;
		}).then(function() {
			
		})
	})
}

//When Sign Up form is submitted
$("#signup-form").submit(function(ev) {
	var errorMessage1 = document.getElementById("error-message-1");
	var errorMessage2 = document.getElementById("error-message-2");
	var errorMessage3 = document.getElementById("error-message-3");
	var firstName = document.getElementById("firstname");
	var lastName = document.getElementById("lastname");
	console.log("ici");
	if (verifyEmail.checkValidity() && password.checkValidity() && firstName.checkValidity() && lastName.checkValidity())
	{
		console.log("la");
		clickedSignUp = true;
		var user = auth.currentUser;
		ev.preventDefault();
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
		var queryTemp = firestore.collection('users_temp').doc(verifyEmail.value);
		// var errorMessage1 = document.getElementById("error-message-1");
		
		console.log("EMAIL", user.email);
		
		
		/* queryTemp.get().then(function(doc) {
			
			console.log('1ST QUERY', doc.data().userCategory);
			query.get().then(function(doc2) {
				
				console.log('SECOND QUERY', doc.data().userCategory);
			}).catch(function(err) {
				console.log("Error 2nd query:", err);
			});
			
		}).catch(function(err) {
			console.log("Error 1st query: ", err);
		}); */
		
		
		// onAuthStateChanged can be triggered without signing up first => We have to manage the different cases
		query.get().then(function(doc) {
			
			if(!doc.exists && clickedSignUp)
			{
				console.log('Case 3: User signed up but does not have an account');
				//We collect form's data
				var firstName = document.getElementById("firstname").value;
				var lastName = document.getElementById("lastname").value;
				// var newUserCategory = $("input[name='userCategory']:checked").val();
				
				queryTemp.get()
				.then(function(doc2) {
					// alert('hey');
					// alert(doc2.data().userCategory);
					
					if(doc2.data().instituteCategory == "lycee" || doc2.data().instituteCategory == "college")
					{
						if(doc2.data().userCategory =="student")
						{
							query.set({
								id: user.uid,
								email: user.email,
								firstName: firstName,
								lastName: lastName,
								userCategory: doc2.data().userCategory,
								tel: phoneNumber.value,
								avatarUrl: "",
								classe : doc2.data().classe,
								instituteName : doc2.data().instituteName,
								instituteCategory : doc2.data().instituteCategory,
								idAdmin: doc2.data().idAdmin,
								manuel: '',
								loginManuel: '',
								mdpManuel: '',
								notifications: [],
								newNotif: 0,
								matieres: doc2.data().matieres
							}).then(function() {
								queryTemp.delete();
								location.href="../../pages/fr/dashboardV2.php";
							}).catch(function(error) {
								console.log("Error creating user: ", error);
							});
						} else if(doc2.data().userCategory =="teacher")
						{
							query.set({
								id: user.uid,
								email: user.email,
								firstName: firstName,
								lastName: lastName,
								userCategory: doc2.data().userCategory,
								avatarUrl: "",
								classe : doc2.data().classe,
								tel: phoneNumber.value,
								matieres:doc2.data().matieres,
								instituteName : doc2.data().instituteName,
								instituteCategory : doc2.data().instituteCategory,
								idAdmin: doc2.data().idAdmin,
								notifications: [],
								newNotif: 0
							}).then(function() {
								queryTemp.delete();
								location.href="../../pages/fr/dashboard.php";
							}).catch(function(error) {
								console.log("Error creating user: ", error);
							});
						}
						
					} else if(doc2.data().instituteCategory == "soutien")
					{
						query.set({
							id: user.uid,
							email: user.email,
							firstName: firstName,
							lastName: lastName,
							userCategory: doc2.data().userCategory,
							avatarUrl: "",
							instituteName : doc2.data().instituteName,
							instituteCategory : doc2.data().instituteCategory,
							idAdmin: doc2.data().idAdmin,
							notifications: [],
							newNotif: 0

						}).then(function() {
							queryTemp.delete();
							location.href="../../pages/fr/dashboard.php";
						}).catch(function(error) {
							console.log("Error creating user: ", error);
						});
						
					}
					
					
					
				}).catch(function(err) {
					console.log("error :", err);
				})
				
				//Then we use previously collected data to create corresponding document in Firebase
				
				console.log("data should be written now");
				
				
				//location.href="../../pages/fr/dashboard.php";
			}
			else {
				//Log out the user so he can sign up
				console.log("user should be logged out");
				firebase.auth().signOut();
				console.log("user is now logged out");
			}
			
		});
		
		
		
	} else {
		console.log("no user logged in");
	}
	
	
	
	
});