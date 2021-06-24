
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
const storage = firebase.storage();




// Get Elements
const adresse = document.getElementById("adresse");
const password = document.getElementById("password");
const btnLogIn = document.getElementById("btnLogIn");

const btnLogOut = document.getElementById("btnLogOut");
const btnGoEdit = document.getElementById("btnGoEdit");
const btnGetIDs = document.getElementById("btnGetIDs");
const btnAlert = document.getElementById('btnAlert');
const textToDisplay = document.getElementById("textToDisplay");

//Declare variables
var myData;
var connected;


//Get language
var language = getLanguage();

function doNothing() {
};

function getLanguage() {
	var flag = window.location.href.split('/');
	if (flag[(flag.length - 2)] == "en")
		return "english";
	else
		return "french";
}


$("#login-form").submit(function (ev) {
	var errorMessage = document.getElementById("error-message");
	document.getElementById('formDiv').style.display = "none";
	document.getElementById('loadingGIF').style.display = "block";
	if (adresse.checkValidity() && password.checkValidity())   //
	{
		ev.preventDefault();		//Pour ^pas que la fenêtre s'actualise quand on submit
		errorMessage.style.display = "none";
		setTimeout(doNothing(), 5000); // ?????
		// submit

		const promise = auth.signInWithEmailAndPassword(adresse.value, password.value);
		promise.catch(e => {
			var errorMessage = document.getElementById("error-message");
			errorMessage.style.display = "block";
			document.getElementById('formDiv').style.display = "block";
			document.getElementById('loadingGIF').style.display = "none";
		});
	} else if (errorMessage.style.display == "block")
		errorMessage.style.display = "none";
});

function redirectLogin(soutien, userCategory) {  
	if(soutien != true) {
		if(userCategory == 'student' || userCategory == 'parent') {
			location.href = "../../pages/fr/dashboard_VE.php";
		}
		else {
			location.href = "../../pages/fr/dashboard_VE.php";
		}
	}
	else {

		if(userCategory == 'student') {
			location.href = "../../pages/fr/dashboard_VE.php";
		}
		else {
			location.href = "../../pages/fr/dashboard_VE.php";
		}
	}
}

// Add a realtime listener
firebase.auth().onAuthStateChanged(firebaseUser => {
	if (firebaseUser) {
		var user = auth.currentUser;
		var query = firestore.collection("users").doc(user.uid);
		var errorMessage = document.getElementById("error-message");
		// firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
		query.get().then(function (doc) {
		var	instituteName = document.getElementById('instituteName').getAttribute('name');
		console.log(instituteName)
		console.log(doc.data().instituteName);

			if (doc.exists && doc.data().instituteName == instituteName) {

				query.update({
					logInfo: {creationDate: doc.data().logInfo.creationDate, lastConnexion: new Date(Date.now())}
				}).then(function() {
					document.cookie = "userRole =" + doc.data().userCategory;
					document.cookie = "userName = " + doc.data().firstName + " " + doc.data().lastName;
					var childName = 'profile_pictures/' + user.uid;
					firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
						document.cookie = "userPictureUrl = " + avatarUrl;
						redirectLogin(doc.data().soutien, doc.data().userCategory)
					}).catch((err) => {
						// profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
						document.cookie = "userPictureUrl = ../../app-assets/images/logo/no_avatar.png";
						redirectLogin(doc.data().soutien, doc.data().userCategory)


					});
				}).catch(function(err) {
					console.log("Error :" ,err);
				});

				

			/* 	if(doc.data().userCategory == 'student')
				{
					location.href = "../../pages/fr/dashboard_VE.php";
				}
				else
				{
					location.href =
				} */
				
			}
			else {
				firebase.auth().signOut();
				errorMessage.style.display = "block";
			}
		});
	} else {
		console.log('not logged in');
		document.getElementById('loadingGIF').style.display = "none";
		document.getElementById('formDiv').style.display = "block";


	}
});


function checkStudentToDoList() {
	var user = auth.currentUser;
	var queryUser = firestore.collection('users').doc(user.uid);
	//
	var notifArray = [];
	var notifArrayBis = [];
	//
	queryUser.get()
		.then(function (docUser) {

			docUser.data().matieres.forEach(function (elem) {
				var totalTime = 0;
				var chapterCount = 0;
				var chapterDuration = 0;
				var currentChapter = 0;
				firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
					.then(function (querySnapshot) {
						chapterCount = querySnapshot.size;
						querySnapshot.forEach(function (docChapter) {
							// console.log(querySnapshot);
							if (docChapter.id == 'duration') {
								chapterDuration = Math.round(docChapter.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
							}
						});
						console.log(elem.matiere);
						if (chapterDuration != 0) {
							totalTime = elem.timeDone + elem.timeValidated;
							if (totalTime != 0) {
								currentChapter = Math.trunc(totalTime / chapterDuration) + 1;
								console.log("CURRENT CHAPTER's INDEX OF STUDENT : ", currentChapter - 1);
								//Here we just obtained the index of the current chapter
								//What we have to do next is to query the concerned chapter and check the todolist for the current student.
								// console.log("Chapitre number : ", querySnapshot.docs[currentChapter - 1].id);
								var chapterNumber = querySnapshot.docs[currentChapter - 1].id;
								console.log("//////");
								if (chapterNumber != 'duration' && chapterNumber != 'Chapitre 1') {
									//
									firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).doc(chapterNumber).get()
										.then(function (docChapter) {
											console.log("LOOK RIGHT HERE");
											console.log("Matière :", elem.matiere);
											console.log("Numero Chapitre: ", docChapter.id);
											console.log("Nom Chapitre: ", docChapter.data().nomChapitre);
											console.log("//////");

											var isCoursComplete = true;
											var isExosComplete = true;

											if (docChapter.data().cours != '') {
												mainLoopCours:
												for (var i = 0; i < docChapter.data().cours.length; i++) {
													for (var j = 0; j < docChapter.data().cours[i].suivi.length; j++) {
														if (user.uid == docChapter.data().cours[i].suivi[j].studentId) {
															if (docChapter.data().cours[i].suivi[j].avancement != 'happy') {
																isCoursComplete = false;
																break mainLoopCours;
															}
														}
													}
												}
											}
											if (docChapter.data().exercices != '') {
												mainLoopExos:
												for (var i = 0; i < docChapter.data().exercices.length; i++) {
													for (var j = 0; j < docChapter.data().exercices[i].suivi.length; j++) {
														if (user.uid == docChapter.data().exercices[i].suivi[j].studentId) {
															if (docChapter.data().exercices[i].suivi[j].avancement != 'happy') {
																isExosComplete = false;
																break mainLoopExos;
															}
														}
													}
												}
											}

											if (!isCoursComplete || !isExosComplete || !isCoursComplete && !isExosComplete) {
												console.log("Todolist is not complete for : ", elem.matiere + " " + docChapter.id + " YOU should notify student");
												//Here we need to prepare the notif and check whether it already exists in database.
												//If it already exists we need to compare the dates
												//If the difference is > timeConstrait, the notification should be renewed
												//If the difference is still < timeConstraint, nothing happens.

												var newNotif = {
													date: Math.floor(Date.now() / 1000),
													icon: "icon-mail icon-bg-circle bg-cyan",
													viewed: false,
													title: { en: "New message", fr: "Chapitre à compléter" },
													description: { en: '<b>' + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + 'la' + '</i>) to answer the message.', fr: "Attention, tu n'as toujours pas complété la <b>TODO liste</b> du <b>" + docChapter.id + "</b> en <b>" + elem.matiere + "</b>. Pense bien à sélectionner le smiley vert pour indiquer qu'un élément de cours ou d'exercices a bien été fait et compris." },
													url: "#"
												}

												notifArray.push(newNotif);
												notifArrayBis = notifArray;

												console.log(notifArray);
												/* queryUser.update({
													notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
													newNotif: firebase.firestore.FieldValue.increment(1)
												})
													.then(() => {
														setTimeout(() => {
															console.log("Good");
														}, 500);

													})
													.catch(err => {
														console.log('Error updating the recipient: ' + err);
													}); */
											}
											else {
												console.log("Todolist is COMPLETE for : ", elem.matiere + " " + docChapter.id);
											}

											//Now that we accessed to the chapter's doc, we need to check todolists
											//Whether "course" or "exercices" section is uncompleted, we need to notify the student


										}).catch(function (err) {
											console.log("Error getting chapter's document: ", err);
										});
									//
								}
							}
						}
					}).catch(function (err) {
						console.log("Error getting chapters: ", err);
					});
					console.log(elem.matiere);
			});
			console.log(notifArrayBis);
			console.log("about to redirect");
			// location.href = redirection;
		}).catch(function (err) {
			console.log("Error getting user's document: ", err);
		});
}


//})();
