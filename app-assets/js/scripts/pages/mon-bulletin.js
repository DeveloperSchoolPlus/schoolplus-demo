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

var myIndex = 0;
var devoirsCount = 0;

firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        // console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        getUserInfo();
        getUserNotif();
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
  firebase.auth().signOut().then(function () {
    localStorage.removeItem('data');
    localStorage.removeItem('dataSubjects');
    location.href = "../../pages/fr/login.php";

  });
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
    // console.log(Object.keys($this));
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

    if (user.uid == 'ZC57kLf1XpUOXh9QJUNDKS2pMgg1') {
      //Zoé
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1');
    } else if (user.uid == 'BTJJml8emCUEPESMXP83TSuZb3T2') {
      //Sam
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1');
    } else if (user.uid == 'aK6z19BqqebTTVkh3aDZJCJhXmF3') {
      //Noé
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1');
    } else if (user.uid == 'yKjFJ4dQLsTQM9aaEf1DgqrToWM2') {
      //Thomas
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1');
    } else if (user.uid == 'wfsvR6T7NFO48NqI3VMyNAGgDIq1') {
      //Timéo
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1');
    } else if (user.uid == 'mvudqo88IDfKh80lf9mTxGUrnN23') {
      //TOTO 1EVOL
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1');
    } else {
      document.getElementById('virtualClass').setAttribute('href', '#');

    }

    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });

    if (doc.data().userCategory == 'student') {
      initBilan(doc.id);
      initCopiesCorrigees(doc.id);

    }
    else {
      initBilan(doc.data().linkedAccount);
      initCopiesCorrigees(doc.data().linkedAccount);

    }
    // initDevoirsRendus();
  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function showImplication() {

  var user = auth.currentUser;








  $('#modalImplication').modal();

}

function downloadSubject(subjectUrl) {

  firebase.storage().ref(subjectUrl).getDownloadURL().then(function (url) {
    window.open(url, '_blank');
  }).catch(function (err) {
    console.log("Error: ", err);
    alert("Erreur, le fichier n'a pas pu être téléchargé. Veuillez vérifier que le sujet est bien présent sur la plateforme.");
  })
}

function foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif) {

  console.log(matiere[indexOfFoo]);
  // console.log(chapitres);



  if (chapitres.length > 0) {
    if (index < chapitres.length) {
      console.log(chapitres[index] + " - " + matiere[indexOfFoo]);

      //Variables required to query firebase storage
      var nomMatiere = matiere[indexOfFoo];
      if (nomMatiere.indexOf(' ') >= 0) {
        // console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');

      var newNumeroChapitre = chapitres[index];
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        // console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      var fullName = userFirstName.substring(0, 1) + userLastName;
      /*  */
      //HERE

      if (notes[index] != undefined) {
        notes[index].forEach(function (elem) {
          if (elem.id == idUser) {
            console.log("La note : ", elem.note);
            if (isNaN(elem.note)) {
              if (elem.note == "NN") {
                console.log("La note est NN, on peut donc afficher et faire le calcul");
                document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note;
                indexHTML++;
                index++;
                foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
              } else {
                console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + userClasse + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'AF';
                  /* Devoirs non corriges */
                  var evalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + userClasse + '_' + newNumeroChapitre + ".pdf";
                  var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
                  var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + evalUrl + '">Voir le sujet</button></td></tr>';

                  var totalTable = table1 + table2;

                  document.getElementById('devoirsTable').innerHTML += totalTable;
                  document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px" id="' + sujetEvalUrl + '">' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</p></div>'
                  myIndex++;
                  devoirsCount++;
                  document.getElementById('devoirsCount').innerText = '(' + devoirsCount + ')';
                  /*  */
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                });
              }
            } else {
              console.log("La note est un nombre, on peut donc afficher, calculer et passer au prochain chapter");
              document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note;
              accumulMatiere += elem.note;
              effectifMatiere++;
              indexHTML++;
              index++;
              foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
            }
          }
        });
      }
      else {
        console.log("UNDEFINED FOR THIS CHAPTER");
        //The array doesn't exist yet, so we have to check if the subject has been posted. If so we check if student has posted his eval// If not it means there is no subject so we move on


        var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + userClasse + '_' + newNumeroChapitre + '.pdf';
        firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
          //The eval is present so we need to check student's eval
          console.log("Notes array is undefined + EVAL IS HERE so we gonna check if student's eval exists");

          var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + userClasse + "_" + newNumeroChapitre + ".pdf";

          firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
            //The subject is present + student's eval exist so we assume its ECC
            console.log("The subject is present + student's eval exist so we assume its ECC");
            document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          }).catch(function (err) {
            //The subject is present + student's eval doesn't exist so we assume its AF
            console.log("The subject is present + student's eval doesn't exist so we assume its AF");
            document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'AF';
            /* Devoirs non corriges */
            var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
            var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + sujetEvalUrl + '">Voir le sujet</button></td></tr>';

            var totalTable = table1 + table2;

            document.getElementById('devoirsTable').innerHTML += totalTable;
            document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px" id="' + sujetEvalUrl + '">' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</p></div>'
            myIndex++;
            devoirsCount++;
            document.getElementById('devoirsCount').innerText = '(' + devoirsCount + ')';
            /*  */
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          });


        }).catch(function (err) {
          //the eval is not present we can pass
          console.log("Notes array is undefined + the eval hasn't been posted so NO EVAL we pass");
          index++;
          foo2(matiere, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
        });

      }





      ////////////////////////////////////////////////////////////////////////
      // var nomMatiere = matiere[indexOfFoo];
      // if (nomMatiere.indexOf(' ') >= 0) {
      //   // console.log("true");
      //   nomMatiere = nomMatiere.replace(/\s+/g, '-');
      // }
      // nomMatiere = nomMatiere.replace('é', 'e');
      // nomMatiere = nomMatiere.replace('è', 'e');

      // var newNumeroChapitre = chapitres[index];
      // if (newNumeroChapitre.indexOf(' ') >= 0) {
      //   // console.log("true");
      //   newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      // }

      // var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';
      // firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
      //   console.log("The eval for " + newNumeroChapitre + " of " + nomMatiere + " is present. We can set the note value on 'AF.'");
      //   //HERE THE EVAL IS PRESENT WE NEED TO CHECK IF STUDENT ALSO HAS IT.

      //   // console.log(userFirstName +" "+userLastName);
      //   var fullName = userFirstName.substring(0, 1) + userLastName;
      //   var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + $('select#selectClass').val() + "_" + newNumeroChapitre + ".pdf";
      //   console.log(pdfURL);

      //   firebase.storage().ref(pdfURL).getDownloadURL().then(function (studUrl) {
      //     //Student has uploaded eval so we can set note on ECC
      //     console.log("Student eval is present, we can check if he has the note");

      //     firestore.collection('users').doc(idAdmin).collection('classes').doc($('select#selectClass').val()).collection(matiere[indexOfFoo]).doc(chapitres[index]).get()
      //       .then(function (docNote) {

      //         if (docNote.data().notes == undefined) {
      //           console.log("There are no marks, we can set on ECC")
      //           //IndexHTML++
      //           document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
      //           indexHTML++
      //         }
      //         else {
      //           //The notes array exists, we can check for student's mark
      //           docNote.data().notes.forEach(function (elem) {
      //             if (elem.id == idUser) {
      //               console.log("THIS IS THE NOTE: " + elem.note);
      //               console.log("THIS IS THE TYPE ", typeof elem.note);
      //               console.log(isNaN(elem.note));
      //               //Here if the note is 'Nan' it means that student hasn't been corrected yet, so we can set on ECC
      //               if (isNaN(elem.note)) {
      //                 if (elem.note == "NN") {
      //                   console.log("The note is NN so we can print it");
      //                   //IndexHTML++
      //                   document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note
      //                   indexHTML++;
      //                 }
      //                 else {
      //                   console.log("The note is NaN, so we print ECC");
      //                   //IndexHTML++
      //                   document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
      //                   indexHTML++;
      //                 }
      //               }
      //               else {
      //                 console.log("The note is a number, so we print the note");
      //                 //IndexHTML++
      //                 document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note;
      //                 indexHTML++;
      //                 //MOYENNE ++
      //                 accumulMatiere += elem.note;
      //                 effectifMatiere++;
      //               }
      //             }
      //           });
      //         }
      //         index++;
      //         foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
      //       }).catch(function (err) {
      //         console.log("error :", err);
      //       });
      //   }).catch(function (err) {
      //     //Student hasn't uploaded eval yet so we set note on AF and pass
      //     console.log("Student eval isn't present we can set on 'AF'");
      //     //IndexHTML++
      //     document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'AF';
      //     indexHTML++;
      //     index++;
      //     foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
      //   });
      // }).catch(function (err) {
      //   console.log("The eval for " + newNumeroChapitre + " of " + nomMatiere + " is not present. We can move to next chapter.");
      //   index++;
      //   foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
      // });
      ////////////////////////////////////////////////////////////
    }
    else {
      console.log("done with chapters");
      //Check for implication marks and inclue them in the calculation
      firestore.collection('users').doc(idUser).get()
        .then(function (docUser) {

          var indexHTMLImplication = 1;

          docUser.data().matieres.forEach(function (elem) {
            if (elem.matiere == matiere[indexOfFoo]) {
              if (elem.notesImplication != undefined && elem.notesImplication.length > 0) {
                elem.notesImplication.forEach(function (elemImpli) {
                  if (elemImpli !== '') {
                    console.log("Note implication : ", elemImpli);
                    document.getElementById(matiere[indexOfFoo] + 'Impli' + indexHTMLImplication).innerText = elemImpli;
                    indexHTMLImplication++;
                    accumulMatiere += elemImpli;
                    effectifMatiere++;
                  }
                });
              }
            }

          });

          //PRINT THE MEAN
          if (effectifMatiere > 0) {
            var moyenneMatiere = accumulMatiere / effectifMatiere;
            moyenneMatiere = round(moyenneMatiere, 1);
            document.getElementById(matiere[indexOfFoo] + 'Moyenne').innerText = moyenneMatiere;
            //Send the mean into the generalMean that will be calculated at the end of callbacks
            generalAccumul += moyenneMatiere;
            generalEffectif++;
          }

          indexOfFoo++;
          foo(matiere, idAdmin, idUser, userClasse, userFirstName, userLastName, indexOfFoo, 1, generalAccumul, generalEffectif);
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }
  }
  else {
    console.log("No chapter for ", matiere[indexOfFoo]);
    indexOfFoo++;
    foo(matiere, idAdmin, idUser, userClasse, userFirstName, userLastName, indexOfFoo, 1, generalAccumul, generalEffectif);
  }
}


function foo(matieres, idAdmin, idUser, userClasse, userFirstName, userLastName, index, indexHTML, generalAccumul, generalEffectif) {

  // console.log(matieres);
  var chapitres = [];
  var notes = []

  if (index < matieres.length) {
    // console.log(matieres[index]);

    firestore.collection('users').doc(idAdmin).collection('classes').doc(userClasse).collection(matieres[index]).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (docChapters) {
          if (docChapters.id != 'duration' && docChapters.id != 'Chapitre 1') {
            chapitres.push(docChapters.id);
            notes.push(docChapters.data().notes);
          }
        });
        foo2(matieres, chapitres, notes, idAdmin, idUser, userClasse, userFirstName, userLastName, 0, index, indexHTML, 0, 0, generalAccumul, generalEffectif);
      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    //Now we calculate and print the generalMean if effectifGeneral > 0
    if (generalEffectif > 0) {
      var moyenneGenerale = generalAccumul / generalEffectif;
      moyenneGenerale = round(moyenneGenerale, 1);
      document.getElementById('generalMean').innerText = moyenneGenerale + '/20';
    }
    document.getElementById('messageBulletin').style.display = 'none';
    document.getElementById('messageBulletin2').style.display = 'block';

    // $('#selectClass')[0].selectize.enable();
    // $('#selectStudent')[0].selectize.enable();
    console.log("done");
    // initCarousel(myIndex);
    // saveGlobalData();
  }
}

function initBilan(idUser) {

  // $('#selectClass')[0].selectize.disable();
  // $('#selectStudent')[0].selectize.disable();


  // document.getElementById('selectStudent').disabled = true;
  document.getElementById('messageBulletin').style.display = 'block';
  document.getElementById('messageBulletin2').style.display = 'none';

  var user = auth.currentUser;

  var myArray = [];

  firestore.collection('users').doc(idUser).get()
    .then(function (docUser) {

      docUser.data().matieres.forEach(function (elem) {

        var table1 = '<tr rowspan="2"><td style="padding-left: 0.1%; padding-right: 0.1%;">' + elem.matiere + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + elem.matiere + 'Note1"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note2"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note3"></td> ';
        var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note4"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note5"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note6"></td>';
        var table3 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note7"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note8"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note9"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note10"></td>';
        var table4 = '<td  style="padding-left: 0.1%; padding-right: 0.1%; color: red;"id="' + elem.matiere + 'Moyenne"></td></tr>';

        var table = table1 + table2 + table3 + table4;


        var tableImpli1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + elem.matiere + '</td>';
        var tableImpli2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Impli1"></td>';
        var tableImpli3 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Impli2"></td>';
        var tableImpli4 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Impli3"></td>';
        var tableImpli5 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Impli4"></td>';
        var tableImpli6 = '</tr>';

        var tableImpli = tableImpli1 + tableImpli2 + tableImpli3 + tableImpli4 + tableImpli5 + tableImpli6;

        document.getElementById('tableBilan').innerHTML += table;
        document.getElementById('tableImplication').innerHTML += tableImpli;

        if (elem.notesImplication != undefined) {
          // console.log("Matière: "+elem.matiere + " Note implication: ", elem.notesImplication);
        }


        myArray.push(elem.matiere);
      });

      foo(myArray, docUser.data().idAdmin, docUser.id, docUser.data().classe, docUser.data().firstName, docUser.data().lastName, 0, 1, 0, 0);

      var moyenneGenerale = 0;
      var totalGeneral = 0;
      var nbGenerale = 0;

      var arr = [];




    }).catch(function (err) {
      console.log('Error :', err);
    });

}

// function initBilan() {

//   var user = auth.currentUser;

//   firestore.collection('users').doc(user.uid).get()
//     .then(function (docUser) {

//       docUser.data().matieres.forEach(function (elem) {

//         var table1 = '<tr rowspan="2"><td style="padding-left: 0.1%; padding-right: 0.1%;">' + elem.matiere + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + elem.matiere + 'Note1"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note2"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note3"></td> ';
//         var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note4"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note5"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note6"></td>';
//         var table3 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note7"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note8"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note9"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="' + elem.matiere + 'Note10"></td>';
//         var table4 = '<td  style="padding-left: 0.1%; padding-right: 0.1%; color: red;"id="' + elem.matiere + 'Moyenne"></td></tr>';

//         var table = table1 + table2 + table3 + table4;


//         var tableImpli1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">'+elem.matiere+'</td>';
//         var tableImpli2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="'+elem.matiere+'Impli1"></td>';
//         var tableImpli3 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="'+elem.matiere+'Impli2"></td>';
//         var tableImpli4 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="'+elem.matiere+'Impli3"></td>';
//         var tableImpli5 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" id="'+elem.matiere+'Impli4"></td>';
//         var tableImpli6 = '</tr>';

//         var tableImpli = tableImpli1 + tableImpli2 + tableImpli3 + tableImpli4 + tableImpli5 + tableImpli6;

//         document.getElementById('tableBilan').innerHTML += table;
//         document.getElementById('tableImplication').innerHTML += tableImpli;

//         if (elem.notesImplication != undefined) {
//           // console.log("Matière: "+elem.matiere + " Note implication: ", elem.notesImplication);
//         }
//       });

//       var moyenneGenerale = 0;
//       var totalGeneral = 0;
//       var nbGenerale = 0;

//       docUser.data().matieres.forEach(function (elem) {

//         firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
//           .then(function (querySnapshot) {

//             var index = 1;
//             var totalMatiere = 0;
//             var nbMoyenne = 0;

//             querySnapshot.forEach(function (doc) {

//               if (doc.id != 'duration') {

//                 if (doc.data().notes != undefined) {
//                   if (doc.data().notes.length > 0) {
//                     doc.data().notes.forEach(function (elemNote) {

//                       if (elemNote.id == user.uid) {
//                         // console.log("Look Here, about to write in cell : "+elem.matiere+"Note"+index);
//                         document.getElementById(elem.matiere + "Note" + index).innerText = elemNote.note;
//                         index++;
//                         // console.log(isNaN('NN'));
//                         if (!isNaN(elemNote.note)) {
//                           // console.log("+ ",elemNote.note);
//                           totalMatiere += elemNote.note;
//                           // console.log("totalmatiere: ", totalMatiere);
//                           nbMoyenne++;
//                           // console.log("nbMoyenne :", nbMoyenne)

//                         }
//                         else if(elemNote.note == 'NN')
//                         {
//                           // nbMoyenne++;
//                         }
//                         else if(isNaN(elemNote.note))
//                         {
//                           console.log(elem.matiere+"Note"+(index-1));
//                           console.log(elemNote.note);

//                           checkThisMark(elemNote.note, elem.matiere+"Note"+(index-1), doc.id, user.uid, elem.matiere, doc.data().numeroChapitre);

//                         }
//                       }
//                     });
//                   }
//                 }
//               }
//             });
//             // console.log("Matière :"+elem.matiere+" // totalMatiere: "+ totalMatiere+ " // nbTotal: "+ nbMoyenne);

//             if (nbMoyenne > 0) {
//               console.log("Case 1 : ", elem.matiere);

//               //Good jusqu'ici

//               if (elem.notesImplication != undefined) {
//                 var totalImplication = 0;
//                 var nbImplication = 0;
//                 var indexImpli = 1
//                 // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
//                 elem.notesImplication.forEach(function (elemNoteImpli) {


//                   if (elemNoteImpli != '' || elemNoteImpli === 0) {
//                     document.getElementById(elem.matiere+"Impli"+indexImpli).innerText = elemNoteImpli;
//                     indexImpli++;
//                     totalImplication += elemNoteImpli;
//                     nbImplication++;
//                     totalMatiere += elemNoteImpli;
//                     nbMoyenne++;
//                   }

//                 });

//                 var moyenneImpli = totalImplication/nbImplication;
//                 console.log("Moyenne Implication: ", round(moyenneImpli, 1));
//                 // document.getElementById(elem.matiere+"MoyenneImpli").innerText = round(moyenneImpli, 1);

//               }

//               var moyenne = totalMatiere / nbMoyenne;
//               document.getElementById(elem.matiere + "Moyenne").innerText = round(moyenne, 1);

//               console.log("Moyenne de la matière :", round(moyenne, 1));

//               moyenneGenerale+= moyenne;
//               nbGenerale++;

//               console.log("Total Général :", round(moyenneGenerale,1));
//               console.log("NbGénéral: ", nbGenerale);
//               document.getElementById("generalMean").innerText = round(moyenneGenerale/nbGenerale, 1) + "/20";


//            /*    if(nbImplication>0)
//               {

//               var moyenneImpli = totalImplication/nbImplication;
//               console.log("Matiere: ", elem.matiere+" // Total Impli: ", totalImplication+ " // nbImpli: ", nbImplication+ " // Moyenne Impli: ", moyenneImpli);
//               document.getElementById(elem.matiere+"MoyenneImpli").innerText = round(moyenneImpli, 1);
//               totalGeneral = moyenne + moyenneImpli;
//               moyenneGenerale = totalGeneral / 2;
//               document.getElementById("generalMean").innerText = round(moyenneGenerale, 1) + "/20";
//               }
//               else {

//               } */



//               // console.log("TOTAL GENERAL :", totalGeneral);
//               // console.log("NBGENERAL :" ,nbGenerale);

//             }
//             else{
//               console.log("Case 2 :", elem.matiere);
//               if (elem.notesImplication != undefined) {
//                 var totalImplication = 0;
//                 var nbImplication = 0;
//                 var indexImpli = 1
//                 // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
//                 elem.notesImplication.forEach(function (elemNoteImpli) {

//                   if (elemNoteImpli != '' || elemNoteImpli === 0) {
//                     console.log("hey");
//                     document.getElementById(elem.matiere+"Impli"+indexImpli).innerText = elemNoteImpli;
//                     indexImpli++;
//                     totalImplication += elemNoteImpli;
//                     nbImplication++;
//                     // totalMatiere += elemNoteImpli;
//                     // nbMoyenne++;
//                   }

//                 });
//                 if(nbImplication >0)
//                 {

//                   var moyenneImpli = totalImplication/nbImplication;
//                 document.getElementById(elem.matiere+"Moyenne").innerText = round(moyenneImpli, 1);
//                 moyenneGenerale+= moyenneImpli;
//                 nbGenerale++;
//                 }

//                 // console.log("Moyenne de la matière :", round(moyenneImpli, 1));
//                 console.log("Total Général :", round(moyenneGenerale, 1));

//                 console.log("NbGénéral: ", nbGenerale);

//                 document.getElementById("generalMean").innerText = round(moyenneGenerale/nbGenerale, 1) + "/20";

//               }


//               // document.getElementById("generalMean").innerText = round(moyenneImpli, 1) + "/20";
//             }

//           }).catch(function (err) {
//             console.log("Error :", err);
//           });

//       });


//       // console.log("totalGeneral = ", moyenneGenerale + " // Nb Général =", nbGenerale+ " // Moyenne Générale = ", moyenneGenerale/nbGenerale);


//     }).catch(function (err) {
//       console.log('Error :', err);
//     });

// }

function checkThisMark(note, domId, docId, userId, matiere, numeroChapitre) {


  firestore.collection('users').doc(userId).get()
    .then(function (docUser) {

      var fullName = docUser.data().firstName.substring(0, 1) + docUser.data().lastName;
      var nomMatiere = matiere;
      if (nomMatiere.indexOf(' ') >= 0) {
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = numeroChapitre;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      var pdfURL = "devoirs_ecrits/" + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
      console.log(pdfURL);
      //Now that we built the url we can start downloading the file
      firebase.storage().ref(pdfURL).getDownloadURL().then(function (url) {
        document.getElementById(domId).innerText = 'ECC';
      }).catch(function (err) {
        console.log("Error :", err);
        document.getElementById(domId).innerText = 'AF';
      });

    }).catch(function (err) {
      console.log("Error :", err);
    });








}

// function initDevoirsRendus() {

//   var user = auth.currentUser;
//   // alert('ici');

//   firestore.collection('users').doc(user.uid).get()
//     .then(function (docUser) {

//       var fullName = docUser.data().firstName.substring(0, 1);
//       fullName = fullName + docUser.data().lastName;
//       // console.log(fullName);

//       docUser.data().matieres.forEach(function (elem) {

//         firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
//           .then(function (querySnapshot) {

//             var nomMatiere = elem.matiere;
//             if (nomMatiere.indexOf(' ') >= 0) {
//               // console.log("true");
//               nomMatiere = nomMatiere.replace(/\s+/g, '-');
//             }

//             nomMatiere = nomMatiere.replace('é', 'e');
//             nomMatiere = nomMatiere.replace('è', 'e');
//             // console.log("ICI :" + nomMatiere);
//             querySnapshot.forEach(function (doc) {

//               if (doc.id != 'duration' && doc.id != 'Chapitre 1') {
//                 var newNumeroChapitre = doc.data().numeroChapitre;
//                 if (newNumeroChapitre.indexOf(' ') >= 0) {
//                   // console.log("true");
//                   newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
//                 }
//                 // console.log(newNumeroChapitre);

//                 var evalUrl = 'sujets_evaluations/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + ".pdf";
//                 firebase.storage().ref(evalUrl).getDownloadURL().then(function (url) {
//                   //We now need to query students 
//                   var studentUrl = 'devoirs_ecrits/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docUser.data().classe + '_' + newNumeroChapitre + '.pdf';

//                   firebase.storage().ref(studentUrl).getDownloadURL().then(function (studUrl) {

//                   }).catch(function (error) {
//                     console.log("Error getting doc :", error);
//                     var table1 = '<tr><td>' + elem.matiere + ' - ' + doc.data().numeroChapitre + '</td>';
//                     var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + evalUrl + '">Voir le sujet</button></td></tr>';

//                     var totalTable = table1 + table2;

//                     document.getElementById('devoirsTable').innerHTML += totalTable;
//                   });
//                 }).catch(function (err) {
//                   console.log("Error getting doc : ", err);
//                 });
//               }
//             });
//           }).catch(function (err) {
//             console.log("Error : ", err);
//           });
//       });


//       /* firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).get()
//       .then(function(doc) {

//         if(doc.data().lastEvals != undefined)
//         {
//           var arrayMatieres = [];
//           docUser.data().matieres.forEach(function(elem) {
//             arrayMatieres.push(elem.matiere);
//           });

//           console.log(arrayMatieres);
//           doc.data().lastEvals.forEach(function(elem) {
//             if(arrayMatieres.includes(elem.matiere))
//             {

//               var nomMatiere = elem.matiere;
//               if(nomMatiere.indexOf(' ') >= 0)
//               {
//                 // console.log("true");
//                 nomMatiere = nomMatiere.replace(/\s+/g, '-');
//               }

//               nomMatiere = nomMatiere.replace('é', 'e');
//               nomMatiere = nomMatiere.replace('è', 'e');
//               // console.log("ICI :"+ nomMatiere);

//               var newNumeroChapitre = elem.numeroChapitre;
//               if(newNumeroChapitre.indexOf(' ') >= 0)
//               {
//                 // console.log("true");
//                 newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
//               }

//               var evalUrl = 'sujets_evaluations/'+docUser.data().idAdmin+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+".pdf";
//               // console.log(evalUrl);
//               firebase.storage().ref(evalUrl).getDownloadURL().then(function(fileUrl) {
//                 console.log("Eval"+elem.matiere+"-"+elem.numeroChapitre+ "is present");
//                 //Here we can build a row and check if student has already uploaded his eval

//                 var studentUrl = 'devoirs_ecrits/'+docUser.data().idAdmin+'_'+fullName+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+'.pdf';
//                 firebase.storage().ref(studentUrl).getDownloadURL().then(function(fileUrl) {
//                   //Here the student already has uploaded the eval.
//                   var table1 = '<tr><td>'+elem.matiere+' - '+elem.numeroChapitre+'</td>';
//                   var table2 = '<td><i class="fas fa-check"></i></td></tr>';

//                   var totalTable = table1 + table2;

//                   document.getElementById('devoirsTable').innerHTML += totalTable;

//                 }).catch((err) => {
//                   //Here the student hasn't uploaded the eval yet.
//                   var table1 = '<tr><td>'+elem.matiere+' - '+elem.numeroChapitre+'</td>';
//                   var table2 = '<td>NON</td></tr>';

//                   var totalTable = table1 + table2;

//                   document.getElementById('devoirsTable').innerHTML += totalTable;
//                 });

//               }).catch((err) => {
//                 console.log("Eval is NOT present");
//               });
//             }
//           });

//         }
//         else {
//           var table1 = '<tr><td>Aucun sujet</td>';
//           var table2 = '<td><i class="fas fa-times"></i></td></tr>';

//           var totalTable = table1 + table2;

//           document.getElementById('devoirsTable').innerHTML += totalTable;
//         }

//       }).catch(function(err) {
//         console.log("Error :", err);
//       }); */

//     }).catch(function (err) {
//       console.log("Error: ", err);
//     });


// }

function initCopiesCorrigees(idUser) {

  var user = auth.currentUser
  firestore.collection('users').doc(idUser).get()
    .then(function (docUser) {

      if (docUser.data().matieres != undefined) {
        var selectedMatiere = document.getElementById('selectMatiere');
        docUser.data().matieres.forEach(function (elem) {
          selectedMatiere.selectize.addOption({ value: elem.matiere, text: elem.matiere });
          var $select = $('select#selectMatiere').selectize();
          var control = $select[0].selectize;
          control.clear();
        });
      }

    }).catch(function (err) {
      console.log("Error : ", err);
    });

}

$('select#selectMatiere').on('change', function () {

  document.getElementById('corrigesTable').innerHTML = '';
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {


      if (docUser.data().userCategory == 'student') {
        var fullName = docUser.data().firstName.substring(0, 1) + docUser.data().lastName;
        var nomMatiere = $('select#selectMatiere').val();
        if (nomMatiere.indexOf(' ') >= 0) {
          nomMatiere = nomMatiere.replace(/\s+/g, '-');
        }
        nomMatiere = nomMatiere.replace('é', 'e');
        nomMatiere = nomMatiere.replace('è', 'e');

        firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).get()
          .then(function (querySnapshot) {

            querySnapshot.forEach(function (doc) {

              if (doc.id != 'duration' && doc.id != 'Chapitre 1') {
                //For every chapter different than 'duration', we check in storage if the corrected copy is present.
                //If so we display
                var newNumeroChapitre = doc.data().numeroChapitre;
                if (newNumeroChapitre.indexOf(' ') >= 0) {
                  newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                }
                var fileUrl = "devoirs_corriges/" + docUser.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docUser.data().classe + "_" + newNumeroChapitre + ".pdf";
                firebase.storage().ref(fileUrl).getDownloadURL().then(function (url) {
                  //The file is present, we display
                  var table1 = '<tr><td>' + doc.data().numeroChapitre + '</td>';
                  var table2 = '<td><a href="' + url + '" target="_blank"><button class="btn bg-school-plus btn-min-width text-bold-600" type="button">Télécharger</button></a></td></tr>';

                  var totalTable = table1 + table2;

                  document.getElementById('corrigesTable').innerHTML += totalTable;
                }).catch(function (err) {
                  console.log("Error : ", err);
                  //The file doesn't exists, we do nothing
                });
              }
            });
          }).catch(function (err) {
            console.log("Error : ", err);
          });
      }
      else {
        firestore.collection('users').doc(docUser.data().linkedAccount).get()
          .then(function (docStud) {
            var fullName = docStud.data().firstName.substring(0, 1) + docStud.data().lastName;
            var nomMatiere = $('select#selectMatiere').val();
            if (nomMatiere.indexOf(' ') >= 0) {
              nomMatiere = nomMatiere.replace(/\s+/g, '-');
            }
            nomMatiere = nomMatiere.replace('é', 'e');
            nomMatiere = nomMatiere.replace('è', 'e');

            firestore.collection('users').doc(docStud.data().idAdmin).collection('classes').doc(docStud.data().classe).collection($('select#selectMatiere').val()).get()
              .then(function (querySnapshot) {

                querySnapshot.forEach(function (doc) {

                  if (doc.id != 'duration' && doc.id != 'Chapitre 1') {
                    //For every chapter different than 'duration', we check in storage if the corrected copy is present.
                    //If so we display
                    var newNumeroChapitre = doc.data().numeroChapitre;
                    if (newNumeroChapitre.indexOf(' ') >= 0) {
                      newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                    }
                    var fileUrl = "devoirs_corriges/" + docStud.data().idAdmin + "_" + fullName + "_" + nomMatiere + "_" + docStud.data().classe + "_" + newNumeroChapitre + ".pdf";
                    firebase.storage().ref(fileUrl).getDownloadURL().then(function (url) {
                      //The file is present, we display
                      var table1 = '<tr><td>' + doc.data().numeroChapitre + '</td>';
                      var table2 = '<td><a href="' + url + '" target="_blank"><button class="btn bg-school-plus btn-min-width text-bold-600" type="button">Télécharger</button></a></td></tr>';

                      var totalTable = table1 + table2;

                      document.getElementById('corrigesTable').innerHTML += totalTable;
                    }).catch(function (err) {
                      console.log("Error : ", err);
                      //The file doesn't exists, we do nothing
                    });
                  }
                });
              }).catch(function (err) {
                console.log("Error : ", err);
              });
          }).catch(function (err) {
            console.log("Errorr : ", err);
          });
      }







    }).catch(function (err) {
      console.log("Error : ", err);
    });

});

