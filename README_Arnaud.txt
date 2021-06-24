• Pour passer de firebase DEV à PROD, modifier l'entête des fichiers suivants:
- mychallenges.js
- edit-profile.js
- historique.js
- user-profile.js
- dashboard-map.js
- rewards.js
- login.js
- register.js
- recover-password.js

• Pour mettre à jour l'email envoyé avec un code de réduction, aller dans le dossier php et ouvrir le fichier send_form_email.php

• Actions complémentaires à faire depuis localhost:
- ajouter un challenge
- ajouter une récompense
- ajouter des coupons de réductions

• Config pour utiliser les 2 bdd firebase
    // config for firebase prod
    apiKey: "AIzaSyAIQ0DZRLbO2RyH6iyXN2q_X24ODFF4AMI",
    authDomain: "by-the-wave.firebaseapp.com",
    databaseURL: "https://by-the-wave.firebaseio.com",
    projectId: "by-the-wave",
    storageBucket: "by-the-wave.appspot.com",
    messagingSenderId: "739026378925"
	
    //config for firebase dev
    apiKey: "AIzaSyDp43DD9L-b6g2XHxedW17lP4DryRMG9OY",
    authDomain: "by-the-wave-dev.firebaseapp.com",
    databaseURL: "https://by-the-wave-dev.firebaseio.com",
    projectId: "by-the-wave-dev",
    storageBucket: "by-the-wave-dev.appspot.com",
    messagingSenderId: "1058165690835"

• Fonctions complémentaires à faire depuis localhost:
- ajouter un challenge

// add a challenge on firebase

function addChallengeOnFirebase() {
    var query = firestore.collection("challenges").add({
        challengeDesc : {en: "Perfect your moves with the Ride+ Connect and coach's advice to reach a total of at least 15 golden rides (level 6)", fr: "Perfectionne tes mouvements avec le Ride+ Connect et les conseils du coach pour obtenir un total d'au moins 15 rides d'or (niveau 6)"},
        challengeId : "0001",
        challengeName : "Golden street",
        challengeRecap : {en: "15 golden rides", fr: "15 rides d'or"},
        endDate : 1546297199,
        objective : 6,
        partnerName : "myPartner",
        reward: 10,
        rewardDescription : {en: "", fr: ""},
        sport: "skate",
        startDate: 1538863199,
        type: "basic",
        users: [],
        waveCount: 15
    })
    .then(function(docRef) {
        console.log('Document created with ID: ', docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

- ajouter une récompense
// /!\ image size must be 740x526 (resize with https://www.photoresizer.com/)
function addRewardOnFirebase() {
    var query = firestore.collection("rewards").add({
        availableCodes: ["Ride+"],
		code: "same",
        endDate: 1559339999,
        imgLink: "rewards/unleashwake.jpg",
		partnerName: "Unleashed Wake Magazine",
        price: 15,
        retrievedCodes: {},
        rewardDesc: {en: "15% discount on all products of the online store", fr: "-15% sur tous les produits de la boutique en ligne"},
        startDate: 1538863199,
        type: ["ocean"],
        website: "https://unleashedwakemag.com/"
    })
    .then(function(docRef) {
        console.log('Document created with ID: ', docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
}

- ajouter des coupons de réductions
function addDiscountCodeToReward(rewardId) {
    var query = firestore.collection("rewards").doc(rewardId);
    query.update({
        availableCodes : firebase.firestore.FieldValue.arrayUnion("")
    });
}

// add a track on firebase
function addTrack()
{
	var query = firestore.collection('sessions').doc('VfN8Ly6MabRkUq5TAVi66gQEgLt2_1543919207000');

	query.update({
		//retrievedCodes: firebase.firestore.FieldValue.arrayUnion({userEmail: user.email, discountCode: doc2.data().availableCodes[0]})
		//waves: firebase.firestore.FieldValue.arrayUnion({position: "coucou"})
		waves: firebase.firestore.FieldValue.arrayUnion({direction: "left", distance: 904, duration: 112, level: 5, moments: [{position: new firebase.firestore.GeoPoint(45.4460382,6.8964012),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4460721,6.8964441),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4460946,6.8965085),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4461135,6.8966104),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4461323,6.8967069),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4461774,6.8968196),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4462075,6.8969269),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4462790,6.8969430),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4463769,6.8969161),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4464371,6.8968303),type:"Z"},{position: new firebase.firestore.GeoPoint(45.4465237,6.8967874),type:"Z"}], position: new firebase.firestore.GeoPoint(45.4460382,6.8964012), speed: 38, toDelete: false})
	});
}


// maybe add max distance and max speed?
function updateRankings() {
	var query = firestore.collection("users");
	var query2 = firestore.collection("users_rankings");
	var query3 = firestore.collection("sessions");
	var nbRidesSurf = 0;
	var nbRidesSnow = 0;
	var nbRidesSkate = 0;
	var username = "";
	var avatarurl = "";
	var lastSess = 0;
	var totalUsers = 0;
	var toModify = false;
	var preId = "";

	query.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			totalUsers++;
			query2.doc(doc.id).get().then(function(doc2) {
				if (doc2.exists)
				{
					nbRidesSnow = doc2.data().goldenRidesSnow;
					nbRidesSkate = doc2.data().goldenRidesSkate;
					nbRidesSurf = doc2.data().goldenRidesSurf;
					query3.where("userId", "==", doc.id).get().then((querySnapshot3) => {
						querySnapshot3.forEach((doc3) => {
							if (doc3.data().startedAt.seconds > doc2.data().lastSession)
							{
								toModify = true;
								for (var i=0; i<doc3.data().waves.length; i++)
								{
									if (doc3.data().waves[i].level == 6)
									{
										if (doc3.data().sport == "snow")
											nbRidesSnow++;
										else if (doc3.data().sport == "skate")
											nbRidesSkate++;
										else
											nbRidesSurf++;
									}
								}
								lastSess = doc3.data().startedAt.seconds;
							}
						});
						
						if (doc.data().name != doc2.data().name)
							username = doc.data().name;
						else
							username = doc2.data().name;
						
						if (username.includes('@'))
						{
							var splitUsername = username.split('@');
							username = splitUsername[0];
						}
						
						if (toModify)
						{	
							query2.doc(doc.id).update({
								avatarUrl: doc.data().avatarUrl,
								name: username,
								lastSession: lastSess,
								goldenRidesSurf: nbRidesSurf, 
								goldenRidesSkate: nbRidesSkate,
								goldenRidesSnow: nbRidesSnow
							});
						}
						
						toModify = false;
					});
				}
				else
				{	
					query3.where("userId", "==", doc.id).get().then((querySnapshot3) => {
						querySnapshot3.forEach((doc3) => {
							if (preId == "")
								preId = doc.id;
							else if (preId != doc.id)
							{
								nbRidesSnow = 0;
								nbRidesSkate = 0;
								nbRidesSurf = 0;
								preId = doc.id;
							}
							
							if (doc3.data().startedAt.seconds >= 1493596799)
							{
								for (var i=0; i<doc3.data().waves.length; i++)
								{
									if (doc3.data().waves[i].level == 6)
									{
										if (doc3.data().sport == "snow")
											nbRidesSnow++;
										else if (doc3.data().sport == "skate")
											nbRidesSkate++;
										else
											nbRidesSurf++;
									}
								}
								lastSess = doc3.data().startedAt.seconds;
							}
						});
						
						if (doc.data().name == "" || doc.data().name == null)
							username = "AnonymousUser" + Math.trunc(Math.random()*10000);
						else
							username = doc.data().name;
						
						if (username.includes('@'))
						{
							var splitUsername = username.split('@');
							username = splitUsername[0];
						}
						
						// as user does not exit, create it and update data
						query2.doc(doc.id).set({
							avatarUrl: doc.data().avatarUrl,
							name: username,
							lastSession: lastSess,
							goldenRidesSurf: nbRidesSurf, 
							goldenRidesSkate: nbRidesSkate,
							goldenRidesSnow: nbRidesSnow
						});
					
						console.log("id: " + doc.id);
						console.log("1: " + nbRidesSnow);
						console.log("2: " + nbRidesSkate);
						console.log("3: " + nbRidesSurf);
					});
				}
			});
		});
		query2.doc("stats").update({
			nbUsers: totalUsers
		});
	});
}