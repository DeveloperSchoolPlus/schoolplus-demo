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

//HTML VARIABLES
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const tabMatieres = document.getElementById('tabMatieres');
const selectedClass = document.getElementById('selectClass');
const selectedMatiere = document.getElementById('selectMatiere');
const modifyChapitreNumber = document.getElementById('modifyChapitreNumber');
const modifyChapitreName = document.getElementById('modifyChapitreName');
const modifyExpectedSkills = document.getElementById('modifyExpectedSkills');
const modifyChallenges = document.getElementById('modifyChallenges');
const modifyEndDate = document.getElementById('modifyEndDate');
const manuelLink = document.getElementById('manuelLink');

const modifyChapitreNumber2 = document.getElementById('modifyChapitreNumber2');
const modifyChapitreName2 = document.getElementById('modifyChapitreName2');
const coursToDoList = document.getElementById('coursToDoList');
const exercicesToDoList = document.getElementById('exercicesToDoList');
const modifyEndDate2 = document.getElementById('modifyEndDate2');

const chapitreNumber = document.getElementById('chapitreNumber');
const sectionPDFCours = document.getElementById('sectionPDFCours');
const sectionPDFCours2 = document.getElementById('sectionPDFCours2');
const sectionPDFExercices2 = document.getElementById('sectionPDFExercices2');
const btnOpenPDFCours = document.getElementById('btnOpenPDFCours');
const btnOpenPDFExercices = document.getElementById('btnOpenPDFExercices');

const sectionPDFExercices = document.getElementById('sectionPDFExercices');
const pdfCours = document.getElementById('pdfCours');
const pdfExos = document.getElementById('pdfExos');

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        getUserNotif();
        // setUserInterface(doc.data().userCategory);

        // setModificationList(doc.data().instituteName);
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

$('body[data-open="hover"] .dropdown').on('mouseenter', function () {
  if (!($(this).hasClass('open'))) {
    $(this).addClass('open');
  } else {
    $(this).removeClass('open');
  }
}).on('mouseleave', function (event) {
  $(this).removeClass('open');
});
var menuType = $('body').data('menu');
$('body[data-open="hover"] .dropdown a').on('click', function (e) {


  if (menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu') {
    var $this = $(this);
    console.log(Object.keys($this));
    if ($this.hasClass('dropdown-toggle')) {
      return false;
    }
  }
});

function getUserInfo() {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var userName = "";

  //Display user's profile picture and username
  query.get().then(function (doc) {
    if (doc.data().firstName = "" || doc.data().firstName == null) {
      userName = user.email
      if (userName.includes('@')) {
        var splitUserName = userName.split('@');
        userName = splitUserName[0];
      }
    } else {

      userName = doc.data().firstName;
    }//ZC57kLf1XpUOXh9QJUNDKS2pMgg1

    document.getElementById('virtualClass').setAttribute('href', '#');



    manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });



    console.log(doc.data().classe);
    for (var i = 0; i < doc.data().matieres.length; i++) {
      selectedMatiere.selectize.addOption({ value: doc.data().matieres[i].matiere, text: doc.data().matieres[i].matiere });
      var $select = $('select#selectMatiere').selectize();
      var control = $select[0].selectize;
      control.clear();
    }

    /* 
    firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', doc.data().instituteName).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc2) {
        firestore.collection('users').doc(doc2.data().id).collection('classes').doc(doc.data().classe).get()
        .then(function(doc3) {
          for(var i = 0; i<doc3.data().matieres.length; i++)
          {
            
          }
        }).catch(function(err) {
          console.log("Error ",err);
        }); 
        
      });
    }).catch(function(err) {
      console.log("Error : ", err);
    }); */




  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}


$('#btnPDFCours').on('click', function () {

  if ($(window).width() < 1280) {
    if (sectionPDFCours2.style.display == "none") {
      sectionPDFCours2.style.display = "block";
    }
    else if (sectionPDFCours2.style.display == "block") {

      sectionPDFCours2.style.display = "none";
    }


  } else {
    if (sectionPDFCours.style.display == "none") {
      sectionPDFCours.style.display = "block";
    }
    else if (sectionPDFCours.style.display == "block") {

      sectionPDFCours.style.display = "none";
    }
  }




});

$('#btnPDFExercices').on('click', function () {

  if ($(window).width() < 1280) {
    if (sectionPDFExercices2.style.display == "none") {
      sectionPDFExercices2.style.display = "block";
    }
    else if (sectionPDFExercices2.style.display == "block") {

      sectionPDFExercices2.style.display = "none";
    }
  }
  else {
    if (sectionPDFExercices.style.display == "none") {
      sectionPDFExercices.style.display = "block";
    }
    else if (sectionPDFExercices.style.display == "block") {

      sectionPDFExercices.style.display = "none";
    }
  }


});


function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function getSmileyValue(smileyValue) {

  switch (smileyValue) {
    case 'sad':
      return 0;
    case 'neutral':
      return 0.5;
    case 'happy':
      return 1;
  }

}

function setProgressBar(progressId, completionId, progressValue) {

  // console.log(progressId+ " /// "+somme+" /// "+effectif);

  // console.log(pourcentage+"%");
  console.log(progressId);
  console.log("PROGRESS VALUE: ", progressValue);

  if (!isNaN(progressValue)) {
    document.getElementById(progressId).value = progressValue;
    document.getElementById(completionId).innerHTML = progressValue + "%";

    if (progressValue == 100) {
      document.getElementById(progressId).className = 'progress progress-md progress-success progress';
    }
  }
  else {
    document.getElementById(progressId).value = 0;
    document.getElementById(completionId).innerHTML = 0 + "%";
  }


}

function checkEvalPresenceOneTime(progressId, completionId, url, somme, effectif) {

  var Psmileys = (somme / effectif) * 100;
  var Ptotal = (Psmileys * 90) / 100;

  if (Ptotal == 90) {
    firebase.storage().ref(url).getDownloadURL().then(function (thisUrl) {
      // console.log("CoursUrl --> " + thisUrl);
      //Eval is present
      Ptotal = Ptotal + 10;
      //SEND TO PROGRESS BAR
      setProgressBar(progressId, completionId, round(Ptotal, 1));
    }).catch((err) => {
      //Eval is not present
      //SEND TO PROGRESS BAR
      setProgressBar(progressId, completionId, round(Ptotal, 1));
      // index++;
      // checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);
    });
  }
  else {
    setProgressBar(progressId, completionId, round(Ptotal, 1));
  }

}

function checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index) {

  /* if(index < progressIds.length)
  {
    firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (thisUrl) {
      // console.log("CoursUrl --> " + thisUrl);
      //Eval is present
      arraySomme[index]++;
      arrayEffectif[index]++;
      setProgressBar(progressIds[index], completionIds[index], arraySomme[index], arrayEffectif[index]);
      index++;
      checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);

    }).catch((err) => {
      //Eval is not present
      arrayEffectif[index]++;
      setProgressBar(progressIds[index], completionIds[index],arraySomme[index], arrayEffectif[index]);
      index++;
      checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);
    });
    
  }
  else
  {
    return;
  } */


  if (index < progressIds.length) {
    var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
    var Ptotal = (Psmileys * 90) / 100;

    if (Ptotal == 90) {
      //WE need to check for evaluation
      firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (thisUrl) {
        // console.log("CoursUrl --> " + thisUrl);
        //Eval is present
        Ptotal = Ptotal + 10;
        //SEND TO PROGRESS BAR
        setProgressBar(progressIds[index], completionIds[index], Math.trunc(Ptotal));
        index++;
        checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);
      }).catch((err) => {
        //Eval is not present
        //SEND TO PROGRESS BAR
        setProgressBar(progressIds[index], completionIds[index], Math.trunc(Ptotal));
        index++;
        checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);
      });
    }
    else {
      //All smileys aren't green we can directly print progression
      //SEND TO PROGRESS BAR
      setProgressBar(progressIds[index], completionIds[index], Math.trunc(Ptotal));
      index++;
      checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, index);
    }

  }
  else {
    return;
  }

}

//Function used to display the "Déposer un devoir" button on the chapter card
function checkSubjectPresenceCallback(urlArray, btnIdArray, index) {

  firebase.storage().ref(urlArray[index]).getDownloadURL().then(function (thisUrl) {
    //Do nothing
    index++
    checkSubjectPresenceCallback(urlArray, btnIdArray, index);
  }).catch((err) => {
    //Hide button
    document.getElementById(btnIdArray[index]).style.display = 'none';
    console.log(btnIdArray[index]);
    index++
    checkSubjectPresenceCallback(urlArray, btnIdArray, index)

  });

}


$('select#selectMatiere').on('change', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      document.getElementById('basicContainer').innerHTML = "";
      initChapters(doc.data().instituteName, doc.data().classe, doc.data().firstName, doc.data().lastName);
    }).catch(function (err) {
      console.log("Error : ", err);
    });

});

function downloadSubject(numeroChapitre) {

  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    // console.log("true");
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }

  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  // console.log("ICI :" + nomMatiere);

  var newNumeroChapitre = numeroChapitre;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    // console.log("true");
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      var sujetUrl = 'sujets_evaluations/' + doc.data().idAdmin + '_' + nomMatiere + '_' + doc.data().classe + '_' + newNumeroChapitre + '.pdf';
      // alert("Sujet url : "+sujetUrl);

      firebase.storage().ref(sujetUrl).getDownloadURL().then(function (url) {
        window.open(url, '_blank');
      }).catch(function (err) {
        console.log("Error: ", err);
        alert("Erreur, le fichier n'a pas pu être téléchargé.");
      })

    }).catch(function (err) {
      console.log("Error: ", err);
    });


}

function initChapters(instituteName, classe, firstName, lastName) {
  var user = auth.currentUser;

  var totalTime = 0;
  var chapterCount = 0;
  var chapterDuration = 0;
  var currentChapter = 0;
  const yearStartDate = 1567411200; //02/09/2019 à 08:00
  const yearEndDate = 1594929600; //16/07/2019 à 20:00
  const yearDuration = 21427200; //8 months
  const nbOfWeeks = 32; // taken on the 2019-2020 school calendar
  var currentProgress = 0;



  var progressIds = [];
  var completionIds = [];
  var arrayUrls = [];
  var arraySomme = [];
  var arrayEffectif = [];

  var arraySubjectUrls = [];
  var arrayBtnIds = [];
  var arrayEvalUnlocked = [];
  var arrayEvalLink = [];
  var arrayBtnShowIds = [];
  var arrayNotes = [];

  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"

  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time'>";

  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Compétences attendues</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p><h6 class=' card-title text-bold-600'>Les challenges</h4><p class='card-text text-xs-left'>";

  var sponshtml7 = "</p><p> </p><h6 class='card-title text-bold-600'>Acquis d'apprentissage évalué: 100%</h6><p> </p><div style='text-align:center;'><div class='help-block text-bold-600 danger font-small-3'  text-align:center' id='messageCalcul";
  var sponshtml8 = "'>Calcul de la progression en cours...</div></div><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'id='";
  var sponshtml9 = "'></span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress' ";
  var sponshtml10 = "></progress></div></div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='33%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml11 = "' type='button'  name='";

  var sponshtml12 = "' onclick='toDoList(\"";
  var sponshtml13 = "\")'; id='btnCoursExos";
  var sponshtml14 = "' disabled>Cours / Exercices</button></div></th><th width ='33%' style='text-align:center;'>";
  var sponshtml15 = "<button type='button' class='btn bg-school-plus btn-min-width text-bold-600'  style='display:none;' id='";
  var sponshtml16 = "'onClick='downloadSubject(\"";
  var sponshtml17 = "\")'>Voir l'évaluation</button></th><th width='33%' style='text-align: center'><button type='button' style='display:none;' class='btn bg-school-plus btn-min-width text-bold-600' onClick='handBackExams(\"";
  var sponshtml18 = "\")'id='";
  var sponshtml19 = "'>Déposer un devoir</button></th></tr></table></div></div></div></div></div>";

  // <th width='33%' style='text-align: center'><button type='button' style='display:none;' class='btn bg-school-plus btn-min-width text-bold-600' onClick='handBackExams(\"";
  // var sponshtml13 = "\")'id='";
  // var sponshtml14 = "'>Déposer un devoir</button></th><th width ='33%' style='text-align:center;'><button type='button' class='btn bg-school-plus btn-min-width text-bold-600' id='";
  // var sponshtml15 = "'>Voir l'évaluation</button></th></tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";

  // init chapters HTML for display 
  firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        firestore.collection('users').doc(doc.data().id).collection('classes').doc(classe).collection($('select#selectMatiere').val()).get()
          .then(function (querySnapshot2) {
            chapterCount = querySnapshot2.size;
            querySnapshot2.forEach(function (doc2) {
              if (doc2.id == "duration") {
                chapterDuration = Math.round(doc2.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
              }
              else {

                if (doc2.data().numeroChapitre != undefined) {
                  if (doc2.id != 'duration') {
                    // console.log("NUMERO CHAPITRE :", doc2.data().numeroChapitre);
                    //Here I need to compute my progression

                    var somme = 0;
                    var effectif = 0;

                    var checkForEval = true;

                    // console.log("COURS LENGTH :", doc2.data().cours.length);

                    if (doc2.data().cours.length > 0) {
                      doc2.data().cours.forEach(function (elemCours) {

                        elemCours.suivi.forEach(function (elemSuivi) {

                          if (elemSuivi.studentId == user.uid) {
                            if (getSmileyValue(elemSuivi.avancement) == 0) {
                              checkForEval = false;
                            }
                            somme += getSmileyValue(elemSuivi.avancement);
                            effectif++;
                            // console.log("Chapitre : "+doc2.data().numeroChapitre+"// "+ "Somme : ", somme);
                          }

                        });
                      });
                    }
                    // console.log("EXO LENGTH :", doc2.data().exercices.length);


                    if (doc2.data().exercices.length > 0) {
                      doc2.data().exercices.forEach(function (elemExos) {
                        elemExos.suivi.forEach(function (elemSuivi) {
                          if (elemSuivi.studentId == user.uid) {
                            if (getSmileyValue(elemSuivi.avancement) == 0) {
                              checkForEval = false;
                            }
                            somme += getSmileyValue(elemSuivi.avancement);
                            effectif++;
                          }
                        })
                      })
                    }

                    // console.log("CHECK FOR EVAL: ", checkForEval);


                    var nomMatiere = $('select#selectMatiere').val();
                    if (nomMatiere.indexOf(' ') >= 0) {
                      // console.log("true");
                      nomMatiere = nomMatiere.replace(/\s+/g, '-');
                    }

                    nomMatiere = nomMatiere.replace('é', 'e');
                    nomMatiere = nomMatiere.replace('è', 'e');
                    // console.log("ICI :" + nomMatiere);

                    var newNumeroChapitre = doc2.data().numeroChapitre;
                    if (newNumeroChapitre.indexOf(' ') >= 0) {
                      // console.log("true");
                      newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                    }

                    //
                    var newFirstName = firstName.substring(0, 1);
                    var fullName = newFirstName + lastName;
                    // console.log(fullName);

                    var evalUrl = "devoirs_ecrits/" + doc.data().id + "_" + fullName + "_" + nomMatiere + "_" + classe + "_" + newNumeroChapitre + ".pdf"
                    var sujetUrl = 'sujets_evaluations/' + doc.data().id + '_' + nomMatiere + '_' + classe + '_' + newNumeroChapitre + '.pdf';


                    //Student eval
                    progressIds.push('progress' + newNumeroChapitre);
                    completionIds.push('completion' + newNumeroChapitre);
                    arrayUrls.push(evalUrl);
                    arraySomme.push(somme);
                    arrayEffectif.push(effectif);

                    //Eval subject
                    arraySubjectUrls.push(sujetUrl);
                    arrayBtnIds.push('btn' + newNumeroChapitre);
                    arrayBtnShowIds.push('show' + newNumeroChapitre);

                    //Eval Unlocked
                    arrayEvalUnlocked.push(doc2.data().evalUnlocked);

                    //Notes
                    arrayNotes.push(doc2.data().notes);


                    // console.log(evalUrl);
                    /*   firebase.storage().ref(evalUrl).getDownloadURL().then(function (thisUrl) {
                        console.log("CoursUrl --> " + thisUrl);
                        
                        somme++
                        effectif++
  
                        console.log("Chapitre : " + doc2.data().numeroChapitre + "// " + "Somme : ", somme + "// Effectif", effectif);
  
  
                      html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
                        + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + "doc2.id" + sponshtml10 + doc2.data().numeroChapitre + sponshtml11 + doc2.data().numeroChapitre + sponshtml12 + doc2.data().numeroChapitre + sponshtml13;
                      addElement('basicContainer', 'div', html);
  
                      }).catch((err) => {
  
                        console.log("ERROR: ", err);
                        effectif++;
  
                        console.log("Chapitre : " + doc2.data().numeroChapitre + "// " + "Somme : ", somme + "// Effectif", effectif);
  
  
                      html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
                        + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + "doc2.id" + sponshtml10 + doc2.data().numeroChapitre + sponshtml11 + doc2.data().numeroChapitre + sponshtml12 + doc2.data().numeroChapitre + sponshtml13;
                      addElement('basicContainer', 'div', html);
                      }); */

                    html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
                      + doc2.data().challenges + sponshtml7 + newNumeroChapitre + sponshtml8 + "completion" + newNumeroChapitre + sponshtml9 + "id='progress" + newNumeroChapitre + "'" + sponshtml10 + "doc2.id" + sponshtml11 + doc2.data().numeroChapitre + sponshtml12 + doc2.data().numeroChapitre + sponshtml13 + newNumeroChapitre + sponshtml14 + sponshtml15 + 'show' + newNumeroChapitre/* doc2.data().numeroChapitre */ + sponshtml16 + doc2.data().numeroChapitre + sponshtml17 + doc2.data().numeroChapitre + sponshtml18 + 'btn' + newNumeroChapitre + sponshtml19;
                    addElement('basicContainer', 'div', html);


                  }
                }

              }
            });
            // console.log("PROGRESS IDS: ");
            // console.log(progressIds);
            // console.log("COMPLETION IDS: ");
            // console.log(completionIds);
            // console.log("ARRAY URLS: ");
            // console.log(arrayUrls);
            // console.log("ARRAY SOMME: ")
            // console.log(arraySomme);
            // console.log("ARRAY EFFECTIF: ");
            // console.log(arrayEffectif);
            // console.log("ARRAY SUBJECT URLS: ");
            // console.log(arraySubjectUrls);
            // console.log("ARRAY BTN IDS :");
            // console.log(arrayBtnIds);
            // console.log(arrayEvalUnlocked);
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, 0);
            // checkSubjectPresenceCallback(arraySubjectUrls, arrayBtnIds, 0);
            // checkEvalPresenceCallback(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, 0);
            // update progress bar
            /*   if (chapterDuration != 0) {
                firestore.collection('users').doc(user.uid).get().then((doc) => {
                  if (doc.data().matieres != null) {
                    for (var i = 0; i < doc.data().matieres.length; i++) {
                      if (doc.data().matieres[i].matiere == $('select#selectMatiere').val())
                        totalTime = doc.data().matieres[i].timeDone + doc.data().matieres[i].timeValidated;
                    }
                    if (totalTime != 0) {
                      currentChapter = Math.trunc(totalTime / chapterDuration) + 1;
                      currentProgress = ((totalTime - (currentChapter - 1) * chapterDuration) / chapterDuration) * 100;
  
                      var progressBars = document.getElementsByTagName('progress');
                      var completion = document.getElementsByClassName('completion');
                      console.log("comp: " + completion.length);
                      for (var i = 0; i < progressBars.length; i++) {
                        if (i < currentChapter - 1) {
                          progressBars[i].value = 100;
                          progressBars[i].className = "progress progress-md progress-success progress";
                          completion[i].innerHTML = "100%";
                        }
                        else if (i == currentChapter - 1) {
                          progressBars[i].value = currentProgress;
                          completion[i].innerHTML = Math.trunc(currentProgress) + "%";
                        }
                        else
                          completion[i].innerHTML = "0%";
                      }
                    }
                  }
                });
              } */
            // update remaining time
            if (chapterDuration != 0)
              chapterCount--;

            var chapterNormalDuration = yearDuration / chapterCount; // get chapter normal duration in s
            var timeElapsed = Date.now() / 1000 - yearStartDate;
            var classCurrentChapter = Math.trunc(timeElapsed / chapterNormalDuration);
            var durationRemaining = Math.trunc((chapterNormalDuration * (classCurrentChapter + 1) - timeElapsed) / (60 * 60 * 24));
            /* var deadlines = document.getElementsByClassName('time');
            for (var j=0; j<deadlines.length; j++) {
              if (j < classCurrentChapter) {
                deadlines[j].className = "success time";
                deadlines[j].innerHTML = "Terminé"
              }
              else if (j == classCurrentChapter) {
                if (durationRemaining > 1) 
                deadlines[j].innerHTML = durationRemaining + "j restants";
                else if (durationRemaining == 1)
                deadlines[j].innerHTML = durationRemaining + "j restant";
                else
                deadlines[j].innerHTML = "Aujourd'hui";
              }
              else {
                deadlines[j].innerHTML = "A venir";
                deadlines[j].className = "warning time";
              }
            } */
          }).catch(function (err) {
            console.log("Error :", err);
          });
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index) {

  // console.log(progressIds);
  // console.log(completionIds);
  // console.log(arrayUrls);
  // console.log(arraySomme);
  // console.log(arrayEffectif);
  // console.log(arraySubjectUrls);
  // console.log(arrayBtnIds);
  var user = auth.currentUser;

  if (index < progressIds.length) {
    console.log(progressIds[index]);
    console.log(arrayNotes);
    console.log("HEY");
    console.log(progressIds[index].substr(8));


    if (arrayNotes[index] != undefined) {
      //L'array note existe
      console.log("L'array note existe, je vais checker la valeur de la note.");
      arrayNotes[index].forEach(function (elem) {
        if (elem.id == user.uid) {
          if (isNaN(elem.note)) {
            console.log("La note n'est pas un nombre, je check si note == NaN ou note == NN");
            if (elem.note == "NN") {
              console.log("La note est NN, je peux mettre la progression à 100% et afficher les boutons. Je dois checker la présence du sujet d'évaluation pour activer/désactiver le bouton.");
              setProgressBar(progressIds[index], completionIds[index], 100);
              firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                console.log("Le sujet d'évaluation est présent, nous pouvons alors afficher et activer les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              }).catch(function (err) {
                console.log("Le sujet d'évaluation n'est pas présent, nous pouvons alors afficher mais désactiver les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = true;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              });
            } else {
              console.log("La note est NaN. Ce qui signifie que l'élève n'a pas été noté. Nous devons alors reprendre la procédure en commençant par checker la présence de l'évaluation de l'étudiant.");
              firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
                console.log("L'évaluation de l'élève est présente, elle avait déjà été uploadée. Nous pouvons alors mettre la progression à 100% et checker la présence du sujet pour afficher et activer/désactiver les boutons.");
                setProgressBar(progressIds[index], completionIds[index], 100);
                firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                  console.log("En plus que l'évaluation est présente, le sujet est présent, nous pouvons donc afficher et activer les boutons.");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  //
                  index++;
                  computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                }).catch(function (err) {
                  console.log("L'évaluation est présente mais le sujet ne l'est pas. Nous affichons donc le bouton sans l'activer.");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = true;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  //
                  index++;
                  computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                });
              }).catch(function (err) {
                console.log("L'évaluation de l'élève n'est pas présente, nous devons donc checker si l'évaluation a été débloquée par le professeur dans un premier temps(i.e. un sujet est forcément présent)");
                if (arrayEvalUnlocked[index] == true) {
                  console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé.");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                  document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                  console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
                  console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
                  if (arrayEffectif[index] == 0) {
                    console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    //
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  } else {
                    console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
                    var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                    var Ptotal = (Psmileys * 90) / 100;
                    console.log("Ptotal = ", Ptotal + " %");
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                    //
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  }
                } else {
                  console.log("L'évaluation n'a pas été débloquée, nous devons donc calculer la progression avant de pouvoir checker la présence du sujet et d'afficher les boutons correspondants.");
                  console.log("Mais avant de calculer la progression, nous devons vérifier qu'il y a une TODO liste.");

                  if (arrayEffectif[index] == 0) {
                    console.log("Il n'y a pas de TODO liste. La progression est donc à 0% et nous n'affichons pas les boutons car l'évaluation qu'elle soit présente ou pas, n'a pas été débloquée ni par le professeur, ni par l'élève.");
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    document.getElementById(arrayBtnIds[index]).style.display = "none";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                    document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  } else {
                    console.log("Il y a une TODO liste. Nous pouvons donc calculer la progression et déterminer si l'élève a débloqué son sujet.");
                    var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                    var Ptotal = (Psmileys * 90) / 100;
                    console.log("Ptotal = ", Ptotal + " %");

                    if (Ptotal == 90) {
                      console.log("La progression est égale à 90%, nous pouvons donc considérer que l'élève a débloqué lui-même son évaluation. Nous pouvons alors checker la présence du sujet.");
                      setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                      firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                        console.log("La progression étant égale à 90% et le sujet étant présent, nous pouvons afficher et activer les boutons.");
                        document.getElementById(arrayBtnIds[index]).style.display = "inline";
                        document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                        document.getElementById(arrayBtnIds[index]).disabled = false;
                        document.getElementById(arrayBtnShowIds[index]).disabled = false;
                        document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                        document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                        //
                        index++;
                        computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                      }).catch(function (err) {
                        console.log("La progression est bien égale à 90% mais le sujet n'est pas là, nous n'affichons donc pas les boutons.");
                        document.getElementById(arrayBtnIds[index]).style.display = "none";
                        document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                        document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                        document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                        index++;
                        computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                      });
                    } else if (Ptotal < 90) {
                      console.log("La progression est inférieure à 90%, nous pouvons donc simplement afficher la progression de l'élève sans afficher les boutons.");
                      setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                      document.getElementById(arrayBtnIds[index]).style.display = "none";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                      document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    }
                  }



                }
              });
            }
          } else {
            console.log("La note est présente et c'est un nombre. Nous pouvons donc mettre la progression à 100% et aller checker la présente du sujet pour afficher et activer/désactiver les boutons.");
            setProgressBar(progressIds[index], completionIds[index], 100);
            firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
              console.log("En plus que la note soit présente, le sujet l'est aussi, nous pouvons donc afficher les boutons et les activer.");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              //
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function (err) {
              console.log("La note est présente mais pas le sujet, nous pouvons afficher les boutons mais les désactiver.");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = true;
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              //
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            });
          }
        }
      });
    } else {
      //L'array note n'existe pas
      console.log("Les notes n'ont pas encore été définies. Nous devons checker si l'évaluation de l'élève avait déjà été postée.");
      firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
        console.log("L'évaluation de l'élève est présente, nous pouvons mettre sa progression à 100% et checker la présence du sujet afin d'afficher et d'activer / désactiver les boutons.");
        setProgressBar(progressIds[index], completionIds[index], 100);
        firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
          console.log("L'évaluation de l'élève est présente ainsi que le sujet, nous pouvons alors afficher les boutons et les activer.");
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = false;
          document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
          //
          index++;
          computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
        }).catch(function (err) {
          console.log("L'évaluation de l'élève est présente mais pas le sujet, nous pouvons donc afficher les boutons et les désactiver.");
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = true;
          document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
          //
          index++;
          computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
        });
      }).catch(function (err) {
        console.log("L'évaluation de l'élève n'est pas présente. Nous devons alors checker si l'évaluation a été débloquée avant de passer à la progression.");
        if (arrayEvalUnlocked[index] == true) {
          console.log("L'évaluation a été débloquée, nous pouvons alors afficher les boutons et les activer car évaluation débloquée = sujet déposé.");
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = false;
          document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
          console.log("Les boutons ayant été activés nous pouvons calculer sa progression.");
          console.log("Avant de calculer les smileys, checkons d'abord si il y a une TODO liste.");
          if (arrayEffectif[index] == 0) {
            console.log("Il n'y a pas de TODO liste. Comme nous avons auparavant checké si il n'y avait pas de note ni d'évaluation de l'élève, nous pouvons admettre que sa progression est à 0%.");
            setProgressBar(progressIds[index], completionIds[index], 0);
            //
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          } else {
            console.log("Il y a une TODO liste. Nous pouvons donc calculer la somme des smileys et l'afficher.");
            var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
            var Ptotal = (Psmileys * 90) / 100;
            console.log("Ptotal = ", Ptotal + " %");
            setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
            //
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          }
        } else {
          console.log("L'évaluation n'a pas été débloquée, nous devons donc calculer la progression avant de pouvoir checker la présence du sujet et d'afficher les boutons correspondants.");
          console.log("Mais avant de calculer la progression, nous devons vérifier qu'il y a une TODO liste.");

          if (arrayEffectif[index] == 0) {
            console.log("Il n'y a pas de TODO liste. La progression est donc à 0% et nous n'affichons pas les boutons car l'évaluation qu'elle soit présente ou pas, n'a pas été débloquée ni par le professeur, ni par l'élève.");
            setProgressBar(progressIds[index], completionIds[index], 0);
            document.getElementById(arrayBtnIds[index]).style.display = "none";
            document.getElementById(arrayBtnShowIds[index]).style.display = "none";
            document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          } else {
            console.log("Il y a une TODO liste. Nous pouvons donc calculer la progression et déterminer si l'élève a débloqué son sujet.");
            var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
            var Ptotal = (Psmileys * 90) / 100;
            console.log("Ptotal = ", Ptotal + " %");

            if (Ptotal == 90) {
              console.log("La progression est égale à 90%, nous pouvons donc considérer que l'élève a débloqué lui-même son évaluation. Nous pouvons alors checker la présence du sujet.");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
              firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                console.log("La progression étant égale à 90% et le sujet étant présent, nous pouvons afficher et activer les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                //
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              }).catch(function (err) {
                console.log("La progression est bien égale à 90% mais le sujet n'est pas là, nous n'affichons donc pas les boutons.");
                document.getElementById(arrayBtnIds[index]).style.display = "none";
                document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              });
            } else if (Ptotal < 90) {
              console.log("La progression est inférieure à 90%, nous pouvons donc simplement afficher la progression de l'élève sans afficher les boutons.");
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
              document.getElementById(arrayBtnIds[index]).style.display = "none";
              document.getElementById(arrayBtnShowIds[index]).style.display = "none";
              document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }
          }
        }
      });
    }

    /* if(arrayNotes[index] != undefined)
    {
      arrayNotes[index].forEach(function(elem) {
        if(elem.id == user.uid)
        {
          console.log("1");
          if(isNaN(elem.note))
          {
            console.log("2");
            if(elem.note == "NN")
            {
              console.log("3");
              //Ok pour la note on met a 100% et on va chercher le sujet
              setProgressBar(progressIds[index], completionIds[index], 100);
              
              firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function(url) {
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = false;

                // document.getElementById
                document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              }).catch(function(err ){
                console.log("Error: ", err);
                //A finir
                document.getElementById(arrayBtnIds[index]).style.display = "inline";
                document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                document.getElementById(arrayBtnIds[index]).disabled = false;
                document.getElementById(arrayBtnShowIds[index]).disabled = true;
                document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                index++;
                computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
              });
            }
            else
            {
              console.log("4");
              //Pas ok, ici je colle tout le reste
              if (arrayEffectif[index] == 0) {
                //There is no TODO LIST yet so we assume progression is 0%
                console.log("There is no TODO LIST yet so we won't look for any evaluation and assume progression is 0%");
                //Set progression on 0%
          
                //Display message 
                //Check if the eval is unlocked: If so we display button, if not we hide it
                if (arrayEvalUnlocked[index] == true) {
                  console.log("Eval unlocked");
                  document.getElementById(arrayBtnIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                  document.getElementById(arrayBtnIds[index]).disabled = false;
                  document.getElementById(arrayBtnShowIds[index]).disabled = false;
                  console.log("Actually, the eval has been unlocked for this chapter so we display buttons.")
                  console.log("Since the evaluation has been unlocked, we need to check for student's eval. If present we set prog on 100%, If not we set Prog on current value.");
                  firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
                    //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
                    console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
                    document.getElementById(arrayBtnIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnIds[index]).disabled = false;
                    document.getElementById(arrayBtnShowIds[index]).disabled = false;
                    //PRINT PROG 100%
                    setProgressBar(progressIds[index], completionIds[index], 100);
                    document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  }).catch(function (err) {
                    //STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS
                    console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS");
                    document.getElementById(arrayBtnIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnIds[index]).disabled = false;
                    document.getElementById(arrayBtnShowIds[index]).disabled = false;
                    //PRINT PROG
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  });
                }
                else {
                  console.log("Eval locked");
                  //We need to check if student eval is here so we can set prog on 100. 
                  firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function(url) {

                    setProgressBar(progressIds[index], completionIds[index], 100);

                    firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (url) {
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;

                      // document.getElementById
                      document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    }).catch(function (err) {
                      console.log("Error: ", err);
                      //A finir
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = true;
                      document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    });

                  }).catch(function (err) {
                    setProgressBar(progressIds[index], completionIds[index], 0);
                    document.getElementById(arrayBtnIds[index]).style.display = "none";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                    document.getElementById('btnCoursExos' + progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul' + progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  });

                  
                }
          
              } else {
                //There is a TODO LIST so we can compute the progression and perform action according to the value
                console.log("There is a TODO LIST so we can compute the progression and perform action according to the value");
                var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
                var Ptotal = (Psmileys * 90) / 100;
          
                console.log("Ptotal = ", Ptotal + " %");
          
                if (Ptotal < 90) {
                  //Ptotal is < 90, it means that the todo list isn't completed. So we just print the progress and don't look for any eval.
                  console.log("Ptotal is < 90, it means that the todo list isn't completed. So we just print the progress and don't look for any eval.");
                  //SET PROGRESSION
          
                  //Display Message
                  if (arrayEvalUnlocked[index] == true) {
                    console.log("Eval unlocked");
                    document.getElementById(arrayBtnIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnIds[index]).disabled = false;
                    document.getElementById(arrayBtnShowIds[index]).disabled = false;
                    console.log("Actually, the eval has been unlocked for this chapter so we display buttons.")
                    console.log("Since the evaluation has been unlocked, we need to check for student's eval. If present we set prog on 100%, If not we set Prog on current value.");
                    firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
                      //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
                      console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      //PRINT PROG 100%
                      setProgressBar(progressIds[index], completionIds[index], 100);
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    }).catch(function (err) {
                      //STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS
                      console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      //PRINT PROG
                      setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    });
                  }
                  else {
                    console.log("Eval locked");
                    //Maybe the student was at 100% and made a mistake by changing one of the smileys. We still have to check for his evaluation so we can force to 100%
                    firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
                      setProgressBar(progressIds[index], completionIds[index], 100);
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    }).catch(function (err) {
                      setProgressBar(progressIds[index], completionIds[index], round(Ptotal, 1));
                      document.getElementById(arrayBtnIds[index]).style.display = "none";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    });
                  }
                } else {
                  //Ptotal is equal to 90, it means that the TODO LIST is complete, so we need to check if the EVAL is present.
                  console.log("Ptotal is equal to 90, it means that the TODO LIST is complete, so we need to check if the EVAL is present.");
                  firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (thisUrl) {
                    //The subject is here therefore we can look for Student eval. Furthermore we can display buttons
                    console.log("The subject is here therefore we can look for Student eval. Furthermore we can display buttons");
                    //DISPLAY BUTTONS
                    document.getElementById(arrayBtnIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                    document.getElementById(arrayBtnIds[index]).disabled = false;
                    document.getElementById(arrayBtnShowIds[index]).disabled = false;
                    //CHECK FOR STUDENT EVAL
                    firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
                      //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
                      console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      //PRINT PROG 100%
                      setProgressBar(progressIds[index], completionIds[index], 100);
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    }).catch(function (err) {
                      //STUDENT EVAL IS NOT HERE SO WE CAN PRINT 90% AND DISPLAY BUTTONS
                      console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT 90% AND DISPLAY BUTTONS");
                      document.getElementById(arrayBtnIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
                      document.getElementById(arrayBtnIds[index]).disabled = false;
                      document.getElementById(arrayBtnShowIds[index]).disabled = false;
                      //PRINT PROG
                      setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
                      document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                      document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                      index++;
                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                    });
                  }).catch((err) => {
                    //The subject isn't here so we can print progression and pass to other chapter
                    console.log("The subject isn't here so we can print progression and pass to other chapter");
                    //DISPLAY MESSAZGE
                    //HIDE BUTTONS
                    document.getElementById(arrayBtnIds[index]).style.display = "none";
                    document.getElementById(arrayBtnShowIds[index]).style.display = "none";
                    //SET PROGRESSION
                    setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
                    document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
                    document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
                    index++;
                    computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
                  });
                }
              }
            }
          }
          else
          {
            console.log("5");
            //La note est un nombre on met a 100 et on va chercher l'éval
            //Ok pour la note on met a 100% et on va chercher le sujet
            setProgressBar(progressIds[index], completionIds[index], 100);
              
            firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function(url) {
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function(err ){
              console.log("Error: ", err);
              //A finir
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = true;
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            });
          }
        }
      });

    } else
    {
      if (arrayEffectif[index] == 0) {
        //There is no TODO LIST yet so we assume progression is 0%
        console.log("There is no TODO LIST yet so we won't look for any evaluation and assume progression is 0%");
        //Set progression on 0%
  
        //Display message 
        //Check if the eval is unlocked: If so we display button, if not we hide it
        if (arrayEvalUnlocked[index] == true) {
          document.getElementById(arrayBtnIds[index]).style.display = "inline";
          document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
          document.getElementById(arrayBtnIds[index]).disabled = false;
          document.getElementById(arrayBtnShowIds[index]).disabled = false;
          console.log("Actually, the eval has been unlocked for this chapter so we display buttons.")
          console.log("Since the evaluation has been unlocked, we need to check for student's eval. If present we set prog on 100%, If not we set Prog on current value.");
          firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
            //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
            console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            //PRINT PROG 100%
            setProgressBar(progressIds[index], completionIds[index], 100);
            document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          }).catch(function (err) {
            //STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS
            console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS");
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            //PRINT PROG
            setProgressBar(progressIds[index], completionIds[index], 0);
            document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          });
        }
        else {
          setProgressBar(progressIds[index], completionIds[index], 0);
          document.getElementById(arrayBtnIds[index]).style.display = "none";
          document.getElementById(arrayBtnShowIds[index]).style.display = "none";
          document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
          document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
          index++;
          computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
        }
  
      } else {
        //There is a TODO LIST so we can compute the progression and perform action according to the value
        console.log("There is a TODO LIST so we can compute the progression and perform action according to the value");
        var Psmileys = (arraySomme[index] / arrayEffectif[index]) * 100;
        var Ptotal = (Psmileys * 90) / 100;
  
        console.log("Ptotal = ", Ptotal + " %");
  
        if (Ptotal < 90) {
          //Ptotal is < 90, it means that the todo list isn't completed. So we just print the progress and don't look for any eval.
          console.log("Ptotal is < 90, it means that the todo list isn't completed. So we just print the progress and don't look for any eval.");
          //SET PROGRESSION
  
          //Display Message
          if (arrayEvalUnlocked[index] == true) {
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            console.log("Actually, the eval has been unlocked for this chapter so we display buttons.")
            console.log("Since the evaluation has been unlocked, we need to check for student's eval. If present we set prog on 100%, If not we set Prog on current value.");
            firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
              //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
              console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              //PRINT PROG 100%
              setProgressBar(progressIds[index], completionIds[index], 100);
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function (err) {
              //STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS
              console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT CURRENT PROG% AND DISPLAY BUTTONS");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              //PRINT PROG
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            });
          }
          else {
            //Maybe the student was at 100% and made a mistake by changing one of the smileys. We still have to check for his evaluation so we can force to 100%
            firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function(url) {
              setProgressBar(progressIds[index], completionIds[index], 100);
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function(err) {
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
              document.getElementById(arrayBtnIds[index]).style.display = "none";
              document.getElementById(arrayBtnShowIds[index]).style.display = "none";
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            });
            
          }
        } else {
          //Ptotal is equal to 90, it means that the TODO LIST is complete, so we need to check if the EVAL is present.
          console.log("Ptotal is equal to 90, it means that the TODO LIST is complete, so we need to check if the EVAL is present.");
          firebase.storage().ref(arraySubjectUrls[index]).getDownloadURL().then(function (thisUrl) {
            //The subject is here therefore we can look for Student eval. Furthermore we can display buttons
            console.log("The subject is here therefore we can look for Student eval. Furthermore we can display buttons");
            //DISPLAY BUTTONS
            document.getElementById(arrayBtnIds[index]).style.display = "inline";
            document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
            document.getElementById(arrayBtnIds[index]).disabled = false;
            document.getElementById(arrayBtnShowIds[index]).disabled = false;
            //CHECK FOR STUDENT EVAL
            firebase.storage().ref(arrayUrls[index]).getDownloadURL().then(function (url) {
              //STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS
              console.log("STUDENT EVAL IS HERE SO WE CAN PRINT 100% AND DISPLAY BUTTONS");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              //PRINT PROG 100%
              setProgressBar(progressIds[index], completionIds[index], 100);
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            }).catch(function (err) {
              //STUDENT EVAL IS NOT HERE SO WE CAN PRINT 90% AND DISPLAY BUTTONS
              console.log("STUDENT EVAL IS NOT HERE SO WE CAN PRINT 90% AND DISPLAY BUTTONS");
              document.getElementById(arrayBtnIds[index]).style.display = "inline";
              document.getElementById(arrayBtnShowIds[index]).style.display = "inline";
              document.getElementById(arrayBtnIds[index]).disabled = false;
              document.getElementById(arrayBtnShowIds[index]).disabled = false;
              //PRINT PROG
              setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
              document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
              document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
              index++;
              computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
            });
          }).catch((err) => {
            //The subject isn't here so we can print progression and pass to other chapter
            console.log("The subject isn't here so we can print progression and pass to other chapter");
            //DISPLAY MESSAZGE
            //HIDE BUTTONS
            document.getElementById(arrayBtnIds[index]).style.display = "none";
            document.getElementById(arrayBtnShowIds[index]).style.display = "none";
            //SET PROGRESSION
            setProgressBar(progressIds[index], completionIds[index], round(Ptotal,1));
            document.getElementById('btnCoursExos'+progressIds[index].substr(8)).removeAttribute('disabled');
            document.getElementById('messageCalcul'+progressIds[index].substr(8)).style.display = 'none';
            index++;
            computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, index);
          });
        }
  
  
      }
    } */






  }

}


function modifyChapter(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");
  $("#modalModifyChapter").modal();


  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docUser.data().instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            firestore.collection('users').doc(doc.data().id).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
              .then(function (doc2) {
                modifyChapitreNumber.value = doc2.data().numeroChapitre;
                modifyChapitreName.value = doc2.data().nomChapitre;
                modifyExpectedSkills.value = doc2.data().competences;
                modifyChallenges.value = doc2.data().challenges;
                modifyEndDate.value = doc2.data().endDate;





              }).catch(function (err) {
                console.log("Error :", err);
              });
          });

        }).catch(function (err) {
          console.log("Error :", err);
        });


    }).catch(function (err) {
      console.log("Error ", err);
    });



}
/* 
$('#formChapitre').submit(function(ev) {
  
  ev.preventDefault();
  
  var user = auth.currentUser;
  
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docUser.data().instituteName).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        firestore.collection('users').doc(doc.data().id).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value)
        .update({
          //numeroChapitre: modifyChapitreNumber.value,
          nomChapitre: modifyChapitreName.value,
          competences: modifyExpectedSkills.value,
          challenges: modifyChallenges.value,
          endDate: modifyEndDate.value
        }).then(function(){
          document.getElementById('basicContainer').innerHTML ="";
          initChapters(docUser.data().instituteName);
        }).catch(function(err) {
          console.log("Error : ", err);
        });
      });
      
    }).catch(function(err) {
      console.log("Error :", err);
    });
    
    
  }).catch(function(err) {
    console.log("Error ", err);
  });
  
  console.log("Form validé");
  $("#modalModifyChapter").modal("hide");
  
  //TODO
});

*/

function addDivCours(name, value) {

  //Used for previous version with inputs
  /* var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="coursToDoList" id="coursToDoList" class="form-control input-lg" value ="' + value + '" placeholder="Cours à lire et à synthétiser" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if (value == 'A venir') {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></fieldset>';
  } else {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  } */

  //This new version includes textAngular
  if (value == 'A venir') {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div><div class="col-12 col-md-8" style="padding-left: 0px;">';
    var html2 = '<input type="text" name="coursToDoList" id="coursToDoList" class="form-control input-lg" value ="' + value + '" disabled tabindex="4">';
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></div></fieldset><hr>';
  } else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left "><div><div class="col-12 col-md-8 angularTextClass" style="padding-left: 0px;">';
    var html2 = value;
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></div></fieldset><hr>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('coursContainer', 'fieldset', totalHTML);

}

function addDivExos(name, value) {

  /* var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="exosToDoList" id="exosToDoList" class="form-control input-lg" value ="' + value + '" placeholder="Exercices auto-correctifs" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if (value == 'A venir') {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"disabled></input></div></fieldset>';

  } else {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('exosContainer', 'fieldset', totalHTML); */

  if (value == 'A venir') {
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div><div class="col-12 col-md-8" style="padding-left: 0px;">';
    var html2 = '<input type="text" name="exosToDoList" id="exosToDoList" class="form-control input-lg" value ="' + value + '" disabled tabindex="4">';
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" disabled><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy" disabled></input></div></div></fieldset><hr>';
  } else {
    var html1 = '<fieldset class="form-group position-relative has-icon-left "><div><div class="col-12 col-md-8 angularTextClass" style="padding-left: 0px;">';
    var html2 = value;
    var html3 = '<div class="help-block text-bold-600 danger font-small-3"></div></div>';
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="' + name + '" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="' + name + '" value="neutral" class="radio-smiley neutral"><input type="radio" name="' + name + '" value="happy" class="radio-smiley happy"></input></div></div></fieldset><hr>';
  }

  var totalHTML = html1 + html2 + html3 + html4;

  addElement('exosContainer', 'fieldset', totalHTML);

}

function handBackExams(numeroChapitre) {
  var user = auth.currentUser;
  var pdfURL = '';
  var mp3URL = '';
  document.getElementById('writtenMessage').style.display = "none";
  document.getElementById('oralMessage').style.display = "none";
  document.getElementById('written-error-message').style.display = "none";
  document.getElementById('oral-error-message').style.display = "none";
  $('#uploadWritten').prop('disabled', false);
  $('#uploadOral').prop('disabled', false);

  console.log("handBackExams function is called");
  console.log(numeroChapitre);
  document.getElementById('uploadChapitreNumber').innerText = numeroChapitre;

  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = numeroChapitre;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  firestore.collection('users').doc(user.uid).get()
    .then(function (doc) {
      var newFirstName = doc.data().firstName.substring(0, 1);
      var fullName = newFirstName + doc.data().lastName;

      pdfURL = "devoirs_ecrits/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".pdf";
      mp3URL = "devoirs_oraux/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".mp3";
      firebase.storage().ref(pdfURL).getDownloadURL().then(function (url) {
        document.getElementById('writtenMessage').style.display = "inline";
        document.getElementById('writtenLink').href = url;
        // document.getElementById('uploadWritten').setAttribute('disabled', '');
        $('#uploadWritten').prop('disabled', true);

      }).catch(function (err) {
        console.log("Error :", err);
      });

      firebase.storage().ref(mp3URL).getDownloadURL().then(function (url) {
        document.getElementById('oralMessage').style.display = "inline";
        document.getElementById('oralLink').href = url;
        $('#uploadOral').prop('disabled', true);
      }).catch(function (err) {
        console.log("Error : ", err);
      });

    }).catch(function (err) {
      console.log("Error :", err);
    });


  $('#modalHandBack').modal();


}

$('#uploadWritten').change(function () {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('written-error-message');
  errorMessage.style.display = "none";
  var thePDF = document.getElementById('uploadWritten').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  console.log("NEW " + newNumeroChapitre);
  if (thePDF.type == 'application/pdf') {
    //Check the size of the file, what size ???
    if (thePDF.size <= 20000000) {
      console.log("Good, thepdf.size is :", thePDF.size);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var newFirstName = doc.data().firstName.substring(0, 1);
          var fullName = newFirstName + doc.data().lastName;
          console.log(fullName);
          var uploadTask = storageRef.child("devoirs_ecrits/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".pdf").put(thePDF);
          console.log("URL : " + "devoirs_ecrits/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            document.getElementById('uploadWritten').setAttribute('disabled', '');
            document.getElementById('writtenImage').style.display = "inline";
            document.getElementById('writtenMessage').style.display = "none";
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;
              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              if (downloadURL != '') {

                //Here we can actualise the progressBar
                //But we need to count smileys of this chapter

                /*  firestore.collection('users').doc(doc.data().idAdmin).collection('classes').doc(doc.data().classe).collection($('select#selectMatiere').val()).doc(document.getElementById('uploadChapitreNumber').innerText).get()
                   .then(function (docChapter) {
 
                     var somme = 0;
                     var effectif = 0;
 
                     if (docChapter.data().cours.length > 0) {
                       docChapter.data().cours.forEach(function (elemCours) {
                         elemCours.suivi.forEach(function (elemSuivi) {
                           if (elemSuivi.studentId == user.uid) {
                             somme += getSmileyValue(elemSuivi.avancement);
                             effectif++;
                             // console.log("Chapitre : "+doc2.data().numeroChapitre+"// "+ "Somme : ", somme);
                           }
                         });
                       });
                     }
 
                     if (docChapter.data().exercices.length > 0) {
                       docChapter.data().exercices.forEach(function (elemExos) {
                         elemExos.suivi.forEach(function (elemSuivi) {
                           if (elemSuivi.studentId == user.uid) {
                             somme += getSmileyValue(elemSuivi.avancement);
                             effectif++;
                           }
                         });
                       });
                     }
 
                     if (somme == effectif) {
                       setProgressBar('progress' + newNumeroChapitre, 'completion' + newNumeroChapitre, 100);
                     }
 
 
                   }).catch(function (err) {
                     console.log("Error: ", err);
                   }); */
                setProgressBar('progress' + newNumeroChapitre, 'completion' + newNumeroChapitre, 100);



                console.log('PDF was downloaded and message can be displayed');
                document.getElementById('writtenImage').style.display = "none";
                document.getElementById('writtenLink').href = downloadURL;
                document.getElementById('writtenMessage').style.display = "block";

                // put a notif to the user
                var newNotif = {
                  date: Math.floor(Date.now() / 1000),
                  icon: "icon-mail icon-bg-circle bg-cyan",
                  viewed: false,
                  title: { en: "New message", fr: "Copie déposée" },
                  description: { en: '<b>' + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + 'la' + '</i>) to answer the message.', fr: ' <b>' + doc.data().firstName + ' ' + doc.data().lastName + '</b> a déposé une copie pour l\'évaluation du <b>' + document.getElementById('uploadChapitreNumber').innerText + '</b> en <b>' + $('select#selectMatiere').val() + '</b>. Rendez-vous sur la page <i>Devoirs</i>pour la télécharger.' },
                  url: "#"
                }

                firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', doc.data().instituteName).where('classe', 'array-contains', doc.data().classe).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (docTeachers) {

                      if (docTeachers.data().matieres.includes($('select#selectMatiere').val())) {
                        firestore.collection('users').doc(docTeachers.data().id).update({
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
                          });
                      }

                      // console.log(docTeachers.data().firstName);

                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });






              }
            });
            // document.getElementById('uploadWritten').removeAttribute('disabled');
            // document.getElementById('uploadWritten').setAttribute('enabled', '');
          });
        }).catch(function (err) {
          console.log("Error :", err);
        });
    } else {
      errorMessage.innerHTML = "Attention, la taille du fichier ne doit pas excéder 20Mo.";
      errorMessage.style.display = "block";
    }

  } else {
    errorMessage.innerHTML = "Attention, le fichier doit être un .pdf";
    errorMessage.style.display = "block";
  }


  document.getElementById('uploadWritten').value = "";
});

$('#uploadOral').change(function () {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('oral-error-message');
  errorMessage.style.display = "none";
  var theMP3 = document.getElementById('uploadOral').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  console.log("SIZE : " + theMP3.size);
  if (theMP3.type == 'audio/mp3') {
    console.log("GOOD3");
    //Check the size of the file, what size ???
    if (theMP3.size <= 20000000) {
      console.log("Good to upload, themp3.size is : " + theMP3.size);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var newFirstName = doc.data().firstName.substring(0, 1);
          var fullName = newFirstName + doc.data().lastName;
          console.log(fullName);
          var uploadTask = storageRef.child("devoirs_oraux/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre + ".mp3").put(theMP3);
          console.log("URL : " + "devoirs_oraux/" + doc.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + doc.data().classe + "_" + newNumeroChapitre);
          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            document.getElementById('uploadOral').setAttribute('disabled', '');
            document.getElementById('oralImage').style.display = "inline";
            document.getElementById('oralMessage').style.display = "none";
          }, function (error) {
            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;
              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');
                break;
              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }
          }, function () {
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              if (downloadURL != '') {
                console.log('PDF was downloaded and message can be displayed');
                document.getElementById('oralImage').style.display = "none";
                document.getElementById('oralLink').href = downloadURL;
                document.getElementById('oralMessage').style.display = "block";
              }
            });
            // document.getElementById('uploadOral').removeAttribute('disabled');
            // document.getElementById('uploadOral').setAttribute('enabled', '');
          });
        }).catch(function (err) {
          console.log("Error :", err);
        });
    } else {
      errorMessage.innerHTML = "Attention, la taille du fichier ne doit pas excéder 20Mo.";
      errorMessage.style.display = "block";
    }

  } else {
    errorMessage.innerHTML = "Attention, le fichier doit être un .mp3";
    errorMessage.style.display = "block";
  }
  document.getElementById('uploadOral').value = "";
});

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function toDoList(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");
  document.getElementById('coursContainer').innerHTML = '';
  document.getElementById('exosContainer').innerHTML = '';
  document.getElementById('divEval').style.display = 'none';
  document.getElementById('evalError').style.display = 'none';
  $("#modalToDoList").modal();

  var smileysCoursToSet = [];
  var smileysExosToSet = [];
  var smileysValues = [];
  var pdfCoursUrl = '';
  var pdfExercicesUrl = '';
  pdfCours.data = '';
  pdfExos.data = '';

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      if (docUser.data().userCategory == "student") {
        document.getElementById('login').innerText = docUser.data().loginManuel;
        document.getElementById('mdp').innerText = docUser.data().mdpManuel;
      }

      firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docUser.data().instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            firestore.collection('users').doc(doc.data().id).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
              .then(function (doc2) {
                // modifyChapitreNumber2.value= doc2.data().numeroChapitre;
                // modifyChapitreName2.value= doc2.data().nomChapitre;
                // modifyExpectedSkills2.value = doc2.data().competences;
                // modifyChallenges2.value= doc2.data().challenges ;
                // modifyEndDate2.value = doc2.data().endDate;
                // exercicesToDoList.value = doc2.data().exercices;
                // coursToDoList.value = doc2.data().cours;
                chapitreNumber.value = doc2.data().numeroChapitre;


                //SECTION COURS
                if (typeof doc2.data().cours == "object" && doc2.data().cours.length > 0) {
                  console.log("The type of 'cours' is object, we good");
                  if (typeof doc2.data().cours[0] == "object") {
                    var indexCours = 0;
                    doc2.data().cours.forEach(function (elem) {
                      console.log(typeof elem + " Look HERE");
                      addDivCours("cours" + indexCours, elem.element);
                      console.log("Elem: ", elem);
                      console.log(indexCours + " !!!!!! ");
                      indexCours++;
                    });
                  } else if (typeof doc2.data().cours[0] == "string") {
                    doc2.data().cours.forEach(function (elem) {
                      addDivCours("cours" + doc2.data().cours.indexOf(elem), elem);
                    });

                  }

                } else if (typeof doc2.data().cours == "string" && doc2.data().cours != '') {
                  console.log("This is an old version. 'cours' is a string");
                  addDivCours("cours0", doc2.data().cours);
                } else {
                  console.log("Nothing in DB, we present a cleared input");
                  addDivCours("cours0", 'A venir');
                  document.getElementById('coursToDoList').disabled = true;
                  $('input[name="cours0"]').disabled = true;
                }

                // SECTION EXOS
                if (typeof doc2.data().exercices == "object" && doc2.data().exercices.length > 0) {
                  console.log("The type of 'exercices' is object, we good");
                  if (typeof doc2.data().exercices[0] == "object") {
                    var indexExos = 0;
                    doc2.data().exercices.forEach(function (elem) {
                      console.log(typeof elem + " Look HERE");
                      addDivExos("exo" + indexExos, elem.element);
                      indexExos++;
                    });
                  } else if (typeof doc2.data().exercices[0] == "string") {
                    doc2.data().exercices.forEach(function (elem) {
                      addDivExos("exo" + doc2.data().exercices.indexOf(elem), elem);
                    });

                  }

                } else if (typeof doc2.data().exercices == "string" && doc2.data().exercices != '') {
                  console.log("This is an old version. 'exercices' is a string");
                  addDivExos("exo0", doc2.data().exercices);
                } else {
                  console.log("Nothing in DB, we present a cleared input");
                  addDivExos("exo0", 'A venir');
                  document.getElementById('exosToDoList').disabled = true;
                  $('input[name="exo0"]').disabled = true;
                }

                //We set corresponding smileys for each student
                for (var i = 0; i < doc2.data().cours.length; i++) {
                  for (var j = 0; j < doc2.data().cours[i].suivi.length; j++) {
                    if (doc2.data().cours[i].suivi[j].studentId == user.uid) {
                      document.querySelectorAll('input[name="cours' + i + '"]').forEach(function (elem) {
                        if (elem.value == doc2.data().cours[i].suivi[j].avancement) {
                          console.log(doc2.data().cours[i].suivi[j].avancement);
                          smileysValues.push(doc2.data().cours[i].suivi[j].avancement);
                          elem.checked = "checked";
                        }
                      });
                    }
                  }
                }
                for (var i = 0; i < doc2.data().exercices.length; i++) {
                  for (var j = 0; j < doc2.data().exercices[i].suivi.length; j++) {
                    if (doc2.data().exercices[i].suivi[j].studentId == user.uid) {
                      document.querySelectorAll('input[name="exo' + i + '"]').forEach(function (elem) {
                        if (elem.value == doc2.data().exercices[i].suivi[j].avancement) {
                          console.log(doc2.data().exercices[i].suivi[j].avancement);
                          smileysValues.push(doc2.data().exercices[i].suivi[j].avancement);
                          elem.checked = "checked";
                        }
                      });
                    }
                  }
                }

                // console.log("Look down for smileysCoursToSet");
                // console.log(smileysCoursToSet);

                console.log("SmileysValues:")
                console.log(smileysValues);
                if (smileysValues.includes('neutral') || smileysValues.includes('sad')) {
                  console.log("All the values aren't happy");
                }

                var nomMatiere = $('select#selectMatiere').val();
                if (nomMatiere.indexOf(' ') >= 0) {
                  console.log("true");
                  nomMatiere = nomMatiere.replace(/\s+/g, '-');
                }

                nomMatiere = nomMatiere.replace('é', 'e');
                nomMatiere = nomMatiere.replace('è', 'e');
                console.log("ICI :" + nomMatiere);

                var newNumeroChapitre = numeroChapitre;
                if (newNumeroChapitre.indexOf(' ') >= 0) {
                  console.log("true");
                  newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                }

                pdfCoursUrl = 'fiches_cours/' + doc.data().id + '_' + docUser.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
                pdfExercicesUrl = 'fiches_exos/' + doc.data().id + '_' + docUser.data().classe + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";

                console.log("URL Cours :" + pdfCoursUrl);
                console.log("URL Exos :" + pdfExercicesUrl);
                //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
                  console.log("CoursUrl --> " + coursUrl);
                  btnOpenPDFCours.setAttribute("href", coursUrl);
                  pdfCours.data = coursUrl;
                  document.getElementById('divCours').style.display = "block";
                  document.getElementById('coursError').style.display = "none";
                }).catch((err) => {
                  console.log("Error :" + err);
                  document.getElementById('divCours').style.display = "none";
                  document.getElementById('coursError').style.display = "block";
                });
                // var pdfExercicesUrl = 'fiches_exos/NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
                firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
                  console.log("ExosUrl -- > " + exosUrl);
                  btnOpenPDFExercices.setAttribute("href", exosUrl);
                  pdfExos.data = exosUrl;
                  document.getElementById('divExos').style.display = "block";
                  document.getElementById('exosError').style.display = "none";
                }).catch((err) => {
                  console.log("Error :" + err);
                  document.getElementById('divExos').style.display = "none";
                  document.getElementById('exosError').style.display = "block";
                });

                console.log(document.getElementById('show' + newNumeroChapitre).style.display);
                console.log(document.getElementById('show' + newNumeroChapitre).disabled);
                if (document.getElementById('show' + newNumeroChapitre).style.display == 'inline') {
                  document.getElementById('divEval').style.display = "block";
                  document.getElementById('evalError').style.display = "none";
                  if (document.getElementById('show' + newNumeroChapitre).disabled) {
                    document.getElementById('btnEval2').disabled = true;
                  }
                  else {
                    var sujetEvalUrl = 'sujets_evaluations/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';
                    firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
                      document.getElementById('btnEval2').disabled = false;
                      document.getElementById('btnEval').href = url;
                    }).catch(function (err) {
                      console.log(err);
                      console.log("no subject?");
                    });
                    // document.getElementById('btnEval2').disabled = false;
                    // document.getElementById('btnEval2').setAttribute('onclick', downloadSubject(doc2.data().numeroChapitre));
                  }
                }
                else {
                  document.getElementById('divEval').style.display = "none";
                  document.getElementById('evalError').style.display = "block";
                }

                /* if (doc2.data().evalUnlocked == true) {
                  console.log("UNO");
                  var sujetEvalUrl = 'sujets_evaluations/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';
                  firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
                    console.log("EVAL OK :" + url);
                    document.getElementById('btnEval').setAttribute('href', url);
                    document.getElementById('divEval').style.display = "block";
                    document.getElementById('evalError').style.display = "none";

                  }).catch(function (err) {
                    console.log("Error :", err);
                    //Display error message
                    document.getElementById('divEval').style.display = "none";
                    document.getElementById('evalError').style.display = "block";
                  });
                }
                else {
                  console.log("DOS");
                  if (smileysValues.includes("neutral") || smileysValues.includes("sad")) {
                    //Display error message
                    document.getElementById('divEval').style.display = "none";
                    document.getElementById('evalError').style.display = "block";
                  }
                  else if(!smileysValues.includes("neutral") && !smileysValues.includes("sad") && smileysValues.includes("happy")){
                    console.log("case");
                    var sujetEvalUrl = 'sujets_evaluations/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';
                    firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
                      console.log("EVAL OK :" + url);
                      document.getElementById('btnEval').setAttribute('href', url);
                      document.getElementById('divEval').style.display = "block";
                      document.getElementById('evalError').style.display = "none";

                    }).catch(function (err) {
                      console.log("Error :", err);
                      //Display error message
                      document.getElementById('divEval').style.display = "none";
                      document.getElementById('evalError').style.display = "block";
                    });
                  }
                  else if(smileysValues.length == 0) {
                    console.log("last case");
                    //Display error message
                    document.getElementById('divEval').style.display = "none";
                    document.getElementById('evalError').style.display = "block";

                  }
                } */


                var correctionUrl = 'exos_corriges/' + doc.data().id + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';
                firebase.storage().ref(correctionUrl).getDownloadURL().then(function (url) {
                  console.log("EVAL OK :" + url);
                  document.getElementById('btnCorrection').setAttribute('href', url);
                  document.getElementById('divCorrection').style.display = "block";
                  document.getElementById('correctionError').style.display = "none";

                }).catch(function (err) {
                  console.log("Error :", err);
                  //Display error message
                  document.getElementById('divCorrection').style.display = "none";
                  document.getElementById('correctionError').style.display = "block";
                });

              }).catch(function (err) {
                console.log("Error :", err);
              });
          });

        }).catch(function (err) {
          console.log("Error :", err);
        });


    }).catch(function (err) {
      console.log("Error ", err);
    });



}

$('#formToDoList').submit(function (ev) {

  ev.preventDefault();
  var user = auth.currentUser;
  var valCours = [];
  var valExos = [];

  var somme = 0;
  var effectif = 0;

  $('.radio-smiley:checked').each(function (i) {
    // console.log("LOOK HERE --> "+$(this).attr('name')+" "+$(this).val());

    if ($(this).attr('name').includes("cours")) {
      // console.log($(this).attr('name') + "has 'cours' in its name so we push it into valCours array");
      valCours.push($(this).val());
      console.log($(this).val())
      somme += getSmileyValue($(this).val());
      effectif++;
    }

    if ($(this).attr('name').includes("exo")) {
      // console.log($(this).attr('name') + "has 'exo' in its name so we push it into valExos array");
      valExos.push($(this).val());
      console.log($(this).val())
      somme += getSmileyValue($(this).val());
      effectif++;
    }
  });

  console.log("SOMME: ", somme + " /// EFFECTIF: ", effectif);

  //Query user to access admin id
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      var newNumeroChapitre = chapitreNumber.value;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        // console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      var progressId = "progress" + newNumeroChapitre;
      var completionId = "completion" + newNumeroChapitre;
      var newFirstName = docUser.data().firstName.substring(0, 1);
      var fullName = newFirstName + docUser.data().lastName;
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        // console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }

      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');

      var evalUrl = "devoirs_ecrits/" + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf"
      // console.log("EVALURL : ", evalUrl);
      // console.log("DDZDZDZDZ: ", somme+" /// "+ effectif);
      //Here we should update progress
      // checkEvalPresenceOneTime(progressId, completionId, evalUrl, somme, effectif);


      console.log("End of collecting answers in Cours : " + valCours.length + "-->" + valCours);
      console.log("End of collecting answers in Exos : " + valExos.length + "-->" + valExos);

      //Query chapter document to check what we need to update
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).doc(chapitreNumber.value).get()
        .then(function (docChapter) {

          var coursToBePushed = docChapter.data().cours;
          var exosToBePushed = docChapter.data().exercices;
          console.log("Intialisation");
          console.log(coursToBePushed);

          if (valCours.length > 0) {
            for (var i = 0; i < coursToBePushed.length; i++) {
              for (var j = 0; j < coursToBePushed[i].suivi.length; j++) {
                if (coursToBePushed[i].suivi[j].studentId == user.uid) {
                  //We can change avancement
                  coursToBePushed[i].suivi[j].avancement = valCours[i]
                }
              }
            }
            console.log("Look down for coursToBePushed");
            console.log(coursToBePushed);
            //Ok to push
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
              .update({
                cours: coursToBePushed
              }).then(function () {
                console.log("Updated");
                if (valExos.length > 0) {
                  for (var i = 0; i < exosToBePushed.length; i++) {
                    for (var j = 0; j < exosToBePushed[i].suivi.length; j++) {
                      if (exosToBePushed[i].suivi[j].studentId == user.uid) {
                        exosToBePushed[i].suivi[j].avancement = valExos[i];
                      }
                    }
                  }

                  console.log("Look down for exosToBePushed");
                  console.log(exosToBePushed);
                  //OK to push
                  firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
                    .update({
                      exercices: exosToBePushed
                    }).then(function () {
                      console.log("Updated");
                      //Here re compute progression
                      if (coursToBePushed.length > 0) {
                        coursToBePushed.forEach(function (elemCours) {
                          elemCours.suivi.forEach(function (elemSuivi) {
                            if (elemSuivi.studentId == user.uid) {
                              if (getSmileyValue(elemSuivi.avancement == 0)) {
                                checkForEval = false;
                              }
                              somme += getSmileyValue(elemSuivi.avancement);
                              effectif++;
                            }
                          })
                        })
                      }

                      if (exosToBePushed.length > 0) {
                        exosToBePushed.forEach(function (elemExos) {
                          elemExos.suivi.forEach(function (elemSuivi) {
                            if (elemSuivi.studentId == user.uid) {
                              if (getSmileyValue(elemSuivi.avancement == 0)) {
                                checkForEval = false;
                              }
                              somme += getSmileyValue(elemSuivi.avancement);
                              effectif++;
                            }
                          });
                        });
                      }

                      var newFirstName = docUser.data().firstName.substring(0, 1);
                      var fullName = newFirstName + docUser.data().lastName;
                      var evalUrl = "devoirs_ecrits/" + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                      var sujetUrl = "sujets_evaluations/" + docUser.data().idAdmin + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                      var progressIds = ['progress' + newNumeroChapitre];
                      var completionIds = ['completion' + newNumeroChapitre];
                      var arrayUrls = [evalUrl];
                      var arraySomme = [somme];
                      var arrayEffectif = [effectif];
                      var arraySubjectUrls = [sujetUrl];
                      var arrayBtnIds = ['btn' + newNumeroChapitre];
                      var arrayBtnShowIds = ['show' + newNumeroChapitre];
                      var arrayEvalUnlocked = [docChapter.data().evalUnlocked];
                      var arrayNotes = [docChapter.data().notes];

                      computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, 0);

                    }).catch(function (err) {
                      console.log("Error while updating", err);
                    })
                }
              }).catch(function (err) {
                console.log("Error while updating");
              })
          }
          else {
            if (valExos.length > 0) {
              for (var i = 0; i < exosToBePushed.length; i++) {
                for (var j = 0; j < exosToBePushed[i].suivi.length; j++) {
                  if (exosToBePushed[i].suivi[j].studentId == user.uid) {
                    exosToBePushed[i].suivi[j].avancement = valExos[i];
                  }
                }
              }

              console.log("Look down for exosToBePushed");
              console.log(exosToBePushed);
              //OK to push
              firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
                .update({
                  exercices: exosToBePushed
                }).then(function () {
                  console.log("Updated");
                  if (coursToBePushed.length > 0) {
                    coursToBePushed.forEach(function (elemCours) {
                      elemCours.suivi.forEach(function (elemSuivi) {
                        if (elemSuivi.studentId == user.uid) {
                          if (getSmileyValue(elemSuivi.avancement == 0)) {
                            checkForEval = false;
                          }
                          somme += getSmileyValue(elemSuivi.avancement);
                          effectif++;
                        }
                      })
                    })
                  }

                  if (exosToBePushed.length > 0) {
                    exosToBePushed.forEach(function (elemExos) {
                      elemExos.suivi.forEach(function (elemSuivi) {
                        if (elemSuivi.studentId == user.uid) {
                          if (getSmileyValue(elemSuivi.avancement == 0)) {
                            checkForEval = false;
                          }
                          somme += getSmileyValue(elemSuivi.avancement);
                          effectif++;
                        }
                      });
                    });
                  }

                  var newFirstName = docUser.data().firstName.substring(0, 1);
                  var fullName = newFirstName + docUser.data().lastName;
                  var evalUrl = "devoirs_ecrits/" + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                  var sujetUrl = "sujets_evaluations/" + docUser.data().idAdmin + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                  var progressIds = ['progress' + newNumeroChapitre];
                  var completionIds = ['completion' + newNumeroChapitre];
                  var arrayUrls = [evalUrl];
                  var arraySomme = [somme];
                  var arrayEffectif = [effectif];
                  var arraySubjectUrls = [sujetUrl];
                  var arrayBtnIds = ['btn' + newNumeroChapitre];
                  var arrayBtnShowIds = ['show' + newNumeroChapitre];
                  var arrayEvalUnlocked = [docChapter.data().evalUnlocked];
                  var arrayNotes = [docChapter.data().notes];

                  computeStudentProgression(progressIds, completionIds, arrayUrls, arraySomme, arrayEffectif, arraySubjectUrls, arrayBtnIds, arrayBtnShowIds, arrayNotes, arrayEvalUnlocked, 0);
                  //Here re compute progression
                }).catch(function (err) {
                  console.log("Error while updating", err);
                })
            }
          }




        }).catch(function (err) {
          console.log("Error :", err);
        });
    }).catch(function (err) {
      console.log("Error :", err);
    });


  $("#modalToDoList").modal("hide");

  //TODO
});