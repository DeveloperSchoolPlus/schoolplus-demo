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

//HTML VARIABLES
const username = document.getElementById('username');

const profilPicUser = document.getElementById('profilepic');
const tabMatieres = document.getElementById('tabMatieres');
const navMenu = document.getElementById('main-menu-navigation');
const selectedClass = document.getElementById('selectClass');
const selectedMatiere = document.getElementById('selectMatiere');


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
        setUserInterface(doc.data().soutien, doc.data().instituteName);
        getUserNotif();
        setUserLists();
        initDevoirsNonCorriges(doc.data().instituteName, doc.data().matieres, doc.data().idAdmin, doc.data().classe);
        initSelectMatiere();
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

function initSelectMatiere() {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (docTeacher) {
      docTeacher.data().matieres.forEach(function (elem) {
        console.log("HERE");
        console.log(elem);
        selectedMatiere.selectize.addOption({ value: elem, text: elem });
        var $select = $('select#selectMatiere').selectize();
        var control = $select[0].selectize;
        control.clear();
        //
        // document.getElementById('selectCorrectionMatiere').selectize.addOption({value: elem, text: elem});
        // var $select2 = $('select#selectCorrectionMatiere').selectize();
        // var control2 = $select2[0].selectize;
        // control2.clear();

      });
      document.getElementById('selectCorrectionMatiere').selectize.addOption({value: 'all', text: 'Toutes les matières'});

    }).catch(function (err) {
      console.log("Error :", err);
    });
}



function setUserLists() {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (docTeacher) {
      if (docTeacher.data().classe != undefined) {
        docTeacher.data().classe.forEach(function (elem) {
          document.getElementById('selectClass').selectize.addOption({ value: elem, text: elem });
          var $select = $('select#selectClass').selectize();
          var control = $select[0].selectize;
          control.clear();
        });
      }
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

$('select#selectClass').on('change', function () {

  var user = auth.currentUser;
  document.getElementById('selectStudent').selectize.clearOptions();
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      firestore.collection('users').where("userCategory", "==", "student").where("instituteName", "==", docUser.data().instituteName).where("classe", "==", $('select#selectClass').val()).get()
        .then(function (querySnapshot) {

          querySnapshot.forEach(function (doc) {

            if(!docUser.data().dev && docUser.data().dev != undefined)
            {
              if(!docUser.data().testAccounts.includes(doc.id))
              {
                document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
                var $select2 = $('select#selectStudent').selectize();
                var control2 = $select2[0].selectize;
                control2.clear();
              }
            }
            else
            {
              document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
              var $select2 = $('select#selectStudent').selectize();
              var control2 = $select2[0].selectize;
              control2.clear();
            }
            
          });
        }).catch(function (err) {
          console.log("Error :", err);
        });

    }).catch(function (err) {
      console.log("Error :", err);
    });


});

$('select#selectStudent').on('change', function () {
  document.getElementById('tableBilan').innerHTML = '';
  document.getElementById('tableImplication').innerHTML = '';
  document.getElementById('generalMean').innerText='';

  if($('select#selectStudent').val()!= '')
  {
    initBilan($('select#selectStudent').val());
  }
});

$('select#selectMatiere').on('change', function () {
  document.getElementById('tableImpli').innerHTML = '';
  initImplication($('select#selectMatiere').val());
  $('#submitBtn').removeAttr('disabled');
});
function checkThisMark(note, domId, docId, userId, matiere, numeroChapitre) {


  firestore.collection('users').doc(userId).get()
  .then(function(docUser) {
    
    var fullName = docUser.data().firstName.substring(0, 1)+docUser.data().lastName;
    var nomMatiere = matiere;
    if(nomMatiere.indexOf(' ') >= 0)
    {
      nomMatiere = nomMatiere.replace(/\s+/g, '-');
    }
    nomMatiere = nomMatiere.replace('é', 'e');
    nomMatiere = nomMatiere.replace('è', 'e');
    var newNumeroChapitre = numeroChapitre;
    if(newNumeroChapitre.indexOf(' ') >= 0)
    {
      newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
    }
    var pdfURL = "devoirs_ecrits/"+docUser.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+docUser.data().classe+"_"+newNumeroChapitre+".pdf";
    console.log(pdfURL);
    //Now that we built the url we can start downloading the file
    firebase.storage().ref(pdfURL).getDownloadURL().then(function(url) {
      document.getElementById(domId).innerText = 'ECC';
    }).catch(function(err) {
      console.log("Error :", err);
      document.getElementById(domId).innerText = 'AF';
    });

  }).catch(function(err) {
    console.log("Error :" ,err);
  });
}

/* function initBilan(idUser) {

  var user = auth.currentUser;

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
      });

      var moyenneGenerale = 0;
      var totalGeneral = 0;
      var nbGenerale = 0;

      docUser.data().matieres.forEach(function (elem) {

        firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
          .then(function (querySnapshot) {

            var index = 1;
            var totalMatiere = 0;
            var nbMoyenne = 0;

            querySnapshot.forEach(function (doc) {

              if (doc.id != 'duration') {

                if (doc.data().notes != undefined) {
                  if (doc.data().notes.length > 0) {
                    doc.data().notes.forEach(function (elemNote) {

                      if (elemNote.id == idUser) {
                        // console.log("Look Here, about to write in cell : "+elem.matiere+"Note"+index);
                        document.getElementById(elem.matiere + "Note" + index).innerText = elemNote.note;
                        index++;
                        // console.log(isNaN('NN'));
                        if (!isNaN(elemNote.note)) {
                          // console.log("+ ",elemNote.note);
                          totalMatiere += elemNote.note;
                          // console.log("totalmatiere: ", totalMatiere);
                          nbMoyenne++;
                          // console.log("nbMoyenne :", nbMoyenne)

                        }
                        else if (elemNote.note == 'NN') {
                          // nbMoyenne++;
                        } else if(isNaN(elemNote.note))
                        {
                          console.log(elem.matiere+"Note"+(index-1));
                          console.log(elem.note);

                          checkThisMark(elemNote.note, elem.matiere+"Note"+(index-1), doc.id, idUser, elem.matiere, doc.data().numeroChapitre);

                        }
                      }
                    });
                  }
                }
              }
            });
            // console.log("Matière :"+elem.matiere+" // totalMatiere: "+ totalMatiere+ " // nbTotal: "+ nbMoyenne);

            if (nbMoyenne > 0) {
              console.log("Case 1 : ", elem.matiere);

              //Good jusqu'ici

              if (elem.notesImplication != undefined) {
                var totalImplication = 0;
                var nbImplication = 0;
                var indexImpli = 1
                // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
                elem.notesImplication.forEach(function (elemNoteImpli) {


                  if (elemNoteImpli != '' || elemNoteImpli === 0) {
                    document.getElementById(elem.matiere + "Impli" + indexImpli).innerText = elemNoteImpli;
                    indexImpli++;
                    totalImplication += elemNoteImpli;
                    nbImplication++;
                    totalMatiere += elemNoteImpli;
                    nbMoyenne++;
                  }

                });

                var moyenneImpli = totalImplication / nbImplication;
                console.log("Moyenne Implication: ", round(moyenneImpli, 1));
                // document.getElementById(elem.matiere+"MoyenneImpli").innerText = round(moyenneImpli, 1);

              }

              var moyenne = totalMatiere / nbMoyenne;
              document.getElementById(elem.matiere + "Moyenne").innerText = round(moyenne, 1);

              console.log("Moyenne de la matière :", round(moyenne, 1));

              moyenneGenerale += moyenne;
              nbGenerale++;

              console.log("Total Général :", round(moyenneGenerale, 1));
              console.log("NbGénéral: ", nbGenerale);
              document.getElementById("generalMean").innerText = round(moyenneGenerale / nbGenerale, 1) + "/20";

            }
            else {
              console.log("Case 2 :", elem.matiere);
              if (elem.notesImplication != undefined) {
                var totalImplication = 0;
                var nbImplication = 0;
                var indexImpli = 1
                // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
                elem.notesImplication.forEach(function (elemNoteImpli) {

                  if (elemNoteImpli != '' || elemNoteImpli === 0) {
                    console.log("hey");
                    document.getElementById(elem.matiere + "Impli" + indexImpli).innerText = elemNoteImpli;
                    indexImpli++;
                    totalImplication += elemNoteImpli;
                    nbImplication++;
                    // totalMatiere += elemNoteImpli;
                    // nbMoyenne++;
                  }

                });
                if (nbImplication > 0) {

                  var moyenneImpli = totalImplication / nbImplication;
                  document.getElementById(elem.matiere + "Moyenne").innerText = round(moyenneImpli, 1);
                  moyenneGenerale += moyenneImpli;
                  nbGenerale++;
                }
                // console.log("Moyenne de la matière :", round(moyenneImpli, 1));
                console.log("Total Général :", round(moyenneGenerale, 1));
                console.log("NbGénéral: ", nbGenerale);
                document.getElementById("generalMean").innerText = round(moyenneGenerale / nbGenerale, 1) + "/20";
              }
            }
          }).catch(function (err) {
            console.log("Error :", err);
          });
      });
    }).catch(function (err) {
      console.log('Error :', err);
    });
} */

function showImplication() {
  $('#modalImplication').modal();
}

function foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif) {

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
                document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = elem.note;
                indexHTML++;
                index++;
                foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
              } else {
                console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + $('select#selectClass').val() + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                });
              }
            } else {
              console.log("La note est un nombre, on peut donc afficher, calculer et passer au prochain chapter");
              document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = elem.note;
              accumulMatiere += elem.note;
              effectifMatiere++;
              indexHTML++;
              index++;
              foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
            }
          }
        });
      }
      else {
        console.log("UNDEFINED FOR THIS CHAPTER");
        //The array doesn't exist yet, so we have to check if the subject has been posted. If so we check if student has posted his eval// If not it means there is no subject so we move on


        var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';
        firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
          //The eval is present so we need to check student's eval
          console.log("Notes array is undefined + EVAL IS HERE so we gonna check if student's eval exists");

          var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + $('select#selectClass').val() + "_" + newNumeroChapitre + ".pdf";

          firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
            //The subject is present + student's eval exist so we assume its ECC
            console.log("The subject is present + student's eval exist so we assume its ECC");
            document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          }).catch(function (err) {
            //The subject is present + student's eval doesn't exist so we assume its AF
            console.log("The subject is present + student's eval doesn't exist so we assume its AF");
            document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          });


        }).catch(function (err) {
          //the eval is not present we can pass
          console.log("Notes array is undefined + the eval hasn't been posted so NO EVAL we pass");
          index++;
          foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
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
          foo(matiere, idAdmin, idUser, userFirstName, userLastName, indexOfFoo, 1, generalAccumul, generalEffectif);
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }
  }
  else {
    console.log("No chapter for ", matiere[indexOfFoo]);
    indexOfFoo++;
    foo(matiere, idAdmin, idUser, userFirstName, userLastName, indexOfFoo, 1, generalAccumul, generalEffectif);
  }
}


function foo(matieres, idAdmin, idUser, userFirstName, userLastName, index, indexHTML, generalAccumul, generalEffectif) {

  // console.log(matieres);
  var chapitres = [];
  var notes = []

  if (index < matieres.length) {
    // console.log(matieres[index]);

    firestore.collection('users').doc(idAdmin).collection('classes').doc($('select#selectClass').val()).collection(matieres[index]).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (docChapters) {
          if (docChapters.id != 'duration' && docChapters.id != 'Chapitre 1') {
            chapitres.push(docChapters.id);
            notes.push(docChapters.data().notes);
          }
        });
        foo2(matieres, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, 0, index, indexHTML, 0, 0, generalAccumul, generalEffectif);
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

    $('#selectClass')[0].selectize.enable();
    $('#selectStudent')[0].selectize.enable();
    console.log("done");
  }
}

function initBilan(idUser) {

  $('#selectClass')[0].selectize.disable();
  $('#selectStudent')[0].selectize.disable();


  document.getElementById('selectStudent').disabled = true;
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

      foo(myArray, docUser.data().idAdmin, docUser.id, docUser.data().firstName, docUser.data().lastName, 0, 1, 0, 0);

      var moyenneGenerale = 0;
      var totalGeneral = 0;
      var nbGenerale = 0;

      var arr = [];


      // docUser.data().matieres.forEach(function (elem) {

      //   firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
      //     .then(function (querySnapshot) {

      //       var index = 1;
      //       var totalMatiere = 0;
      //       var nbMoyenne = 0;
      //       var chapitreArray = [];
      //       var matiereArray = [];
      //       var arrayLength = 0;
      //       querySnapshot.forEach(function (doc) {

      //         /* if (doc.id != 'duration') {

      //           if (doc.data().notes != undefined) {
      //             if (doc.data().notes.length > 0) {
      //               doc.data().notes.forEach(function (elemNote) {

      //                 if (elemNote.id == idUser) {
      //                   // console.log("Look Here, about to write in cell : "+elem.matiere+"Note"+index);
      //                   document.getElementById(elem.matiere + "Note" + index).innerText = elemNote.note;
      //                   index++;
      //                   // console.log(isNaN('NN'));
      //                   if (!isNaN(elemNote.note)) {
      //                     // console.log("+ ",elemNote.note);
      //                     totalMatiere += elemNote.note;
      //                     // console.log("totalmatiere: ", totalMatiere);
      //                     nbMoyenne++;
      //                     // console.log("nbMoyenne :", nbMoyenne)

      //                   }
      //                   else if(elemNote.note == 'NN')
      //                   {
      //                     // nbMoyenne++;
      //                   }
      //                   else if(isNaN(elem.note))
      //                   {
      //                     console.log(elem.matiere+"Note"+(index-1));
      //                     console.log(elem.note);

      //                     checkThisMark(elem.note, elem.matiere+"Note"+(index-1), doc.id, idUser, elem.matiere, doc.data().numeroChapitre);

      //                   }
      //                 }
      //               });
      //             }
      //           }
      //           else
      //           {
      //             //We need to check if the eval has been updated. If no, we do nothing
      //             //If so we check if the student has uploaded his sheet. If so we print 'ECC' if no we print 'AF'
      //             // checkThisMark('', elem.matiere+'Note'+(index-1),'', idUser, elem.matiere, doc.data().numeroChapitre);
      //             index++;
      //             console.log("NOTE IS UNDEFINED FOR : ", elem.matiere+'  '+doc.data().numeroChapitre);
      //             checkEval('', elem.matiere+'Note'+(index-1), '', idUser, elem.matiere, doc.data().numeroChapitre);
      //           }
      //         } */

      //         if (doc.id != 'duration' && doc.id != 'Chapitre 1') {

      //           // console.log(doc.id+ ' // '+elem.matiere);
      //           //Je dois créer l'url pour checker si le sujet est présent
      //           var nomMatiere = elem.matiere;
      //           if (nomMatiere.indexOf(' ') >= 0) {
      //             // console.log("true");
      //             nomMatiere = nomMatiere.replace(/\s+/g, '-');
      //           }
      //           nomMatiere = nomMatiere.replace('é', 'e');
      //           nomMatiere = nomMatiere.replace('è', 'e');

      //           var newNumeroChapitre = doc.data().numeroChapitre;
      //           if (newNumeroChapitre.indexOf(' ') >= 0) {
      //             // console.log("true");
      //             newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      //           }
      //           // console.log(newNumeroChapitre);


      //           chapitreArray.push(newNumeroChapitre);
      //           matiereArray.push(elem.matiere);
      //           arrayLength++;

      //           var sujetEvalUrl = 'sujets_evaluations/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';


      //           // console.log(sujetEvalUrl);

      //           /* firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
      //             // console.log("EVAL LNK " + url);
      //             console.log("The eval for "+newNumeroChapitre+" of "+elem.matiere+" is present. We can set the note value on 'AF.'");
      //           }).catch(function (err) {
      //             // console.log("Error :", err);
      //             console.log("The eval for "+newNumeroChapitre+" of "+elem.matiere+" is not present. We can move to next chapter.");

      //           }); */




      //         }






      //       });

      //       arr = matiereArray;
      //       // console.log("Matière :"+elem.matiere+" // totalMatiere: "+ totalMatiere+ " // nbTotal: "+ nbMoyenne);

      //       if (nbMoyenne > 0) {
      //         console.log("Case 1 : ", elem.matiere);

      //         //Good jusqu'ici

      //         if (elem.notesImplication != undefined) {
      //           var totalImplication = 0;
      //           var nbImplication = 0;
      //           var indexImpli = 1
      //           // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
      //           elem.notesImplication.forEach(function (elemNoteImpli) {


      //             if (elemNoteImpli != '' || elemNoteImpli === 0) {
      //               document.getElementById(elem.matiere + "Impli" + indexImpli).innerText = elemNoteImpli;
      //               indexImpli++;
      //               totalImplication += elemNoteImpli;
      //               nbImplication++;
      //               totalMatiere += elemNoteImpli;
      //               nbMoyenne++;
      //             }

      //           });

      //           var moyenneImpli = totalImplication / nbImplication;
      //           console.log("Moyenne Implication: ", round(moyenneImpli, 1));
      //           // document.getElementById(elem.matiere+"MoyenneImpli").innerText = round(moyenneImpli, 1);

      //         }

      //         var moyenne = totalMatiere / nbMoyenne;
      //         document.getElementById(elem.matiere + "Moyenne").innerText = round(moyenne, 1);

      //         console.log("Moyenne de la matière :", round(moyenne, 1));

      //         moyenneGenerale += moyenne;
      //         nbGenerale++;

      //         console.log("Total Général :", round(moyenneGenerale, 1));
      //         console.log("NbGénéral: ", nbGenerale);
      //         document.getElementById("generalMean").innerText = round(moyenneGenerale / nbGenerale, 1) + "/20";


      //         /*    if(nbImplication>0)
      //            {

      //            var moyenneImpli = totalImplication/nbImplication;
      //            console.log("Matiere: ", elem.matiere+" // Total Impli: ", totalImplication+ " // nbImpli: ", nbImplication+ " // Moyenne Impli: ", moyenneImpli);
      //            document.getElementById(elem.matiere+"MoyenneImpli").innerText = round(moyenneImpli, 1);
      //            totalGeneral = moyenne + moyenneImpli;
      //            moyenneGenerale = totalGeneral / 2;
      //            document.getElementById("generalMean").innerText = round(moyenneGenerale, 1) + "/20";
      //            }
      //            else {

      //            } */



      //         // console.log("TOTAL GENERAL :", totalGeneral);
      //         // console.log("NBGENERAL :" ,nbGenerale);

      //       }
      //       else {
      //         // console.log("Case 2 :", elem.matiere);
      //         if (elem.notesImplication != undefined) {
      //           var totalImplication = 0;
      //           var nbImplication = 0;
      //           var indexImpli = 1
      //           // console.log("Matière : ", elem.matiere + " Notes implication: ", elem.notesImplication);
      //           elem.notesImplication.forEach(function (elemNoteImpli) {

      //             if (elemNoteImpli != '' || elemNoteImpli === 0) {
      //               // console.log("hey");
      //               document.getElementById(elem.matiere + "Impli" + indexImpli).innerText = elemNoteImpli;
      //               indexImpli++;
      //               totalImplication += elemNoteImpli;
      //               nbImplication++;
      //               // totalMatiere += elemNoteImpli;
      //               // nbMoyenne++;
      //             }

      //           });
      //           if (nbImplication > 0) {

      //             var moyenneImpli = totalImplication / nbImplication;
      //             document.getElementById(elem.matiere + "Moyenne").innerText = round(moyenneImpli, 1);
      //             moyenneGenerale += moyenneImpli;
      //             nbGenerale++;
      //           }

      //           // console.log("Moyenne de la matière :", round(moyenneImpli, 1));
      //           // console.log("Total Général :", round(moyenneGenerale, 1));

      //           // console.log("NbGénéral: ", nbGenerale);

      //           document.getElementById("generalMean").innerText = round(moyenneGenerale / nbGenerale, 1) + "/20";

      //         }


      //         // document.getElementById("generalMean").innerText = round(moyenneImpli, 1) + "/20";
      //       }

      //      /*  console.log(elem.matiere);

      //       console.log(matiereArray);
      //       console.log(chapitreArray);
      //       console.log(matiereArray.length);
      //       console.log(arrayLength); */

      //       // checkEvalRecursive(matiereArray, chapitreArray,0);

      //     }).catch(function (err) {
      //       console.log("Error :", err);
      //     });

      // });

      // console.log(arr);



      // console.log("totalGeneral = ", moyenneGenerale + " // Nb Général =", nbGenerale+ " // Moyenne Générale = ", moyenneGenerale/nbGenerale);


    }).catch(function (err) {
      console.log('Error :', err);
    });

}


function enableSave() {
  $('#submitBtn').removeAttr('disabled');
}

function setUserInterface(soutien, instituteName) {
  // console.log("set user interface");




  if (soutien == undefined) {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboard.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    // navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item active"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Planning+</span></a></li>';

    rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
    rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

  }
  else {
    var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="dashboard.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
    var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
    var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
    var nav6 = '</ul></li>';

    var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
    var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';

    var nav9 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    var nav10 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
    var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';




    navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;

    rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
    rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
    rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

  }
  setTeachersVirtualClasses(instituteName);

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

}

function setTeachersVirtualClasses(instituteName) {
    
  console.log(instituteName);
  var user=auth.currentUser;

  firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', instituteName).get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(docTeacher) {
      console.log(docTeacher.data().firstName +" "+docTeacher.data().lastName+"_"+docTeacher.id);
      if(docTeacher.id != 'cVdmeheFOMS7hUbFL5k3bTTvVWD3')
      {
        if(docTeacher.id != user.uid)
        {
          document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="'+docTeacher.data().virtualRoom+'"  class="dropdown-item"><span data-i18n="nav.dash.main">'+docTeacher.data().firstName + ' ' +docTeacher.data().lastName+'</span></a></li>';
        }
        else
        {
          document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="'+docTeacher.data().virtualRoom+'"  class="dropdown-item"><span data-i18n="nav.dash.main">Ma classe virtuelle</span></a></li>';

        }
      }
    });
  }).catch(function(err) {
    console.log("Error :" ,err);
  });

}

function initImplication(matiere) {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docTeacher) {
      docTeacher.data().classe.forEach(function (elemClasse) {

        firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', docTeacher.data().instituteName).where('classe', '==', elemClasse).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (docStudent) {

           
              if(!docTeacher.data().dev && docTeacher.data().dev != undefined)
              {
                if(!docTeacher.data().testAccounts.includes(docStudent.id))
                {
                  docStudent.data().matieres.forEach(function (elem) {
                    if (elem.matiere == matiere) {
                      console.log(docStudent.data().firstName + ' ' + docStudent.data().lastName);
                      // console.log("Notes :", elem.notesImplication);
    
                      if (elem.notesImplication != undefined) {
                        var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + docStudent.data().lastName + ' ' + docStudent.data().firstName + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + docStudent.id + 'Classe">' + docStudent.data().classe + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note1" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[0] + '"></td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note2" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[1] + '"></td> ';
                        var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note3" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[2] + '"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note4" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[3] + '"></td></tr>';
                      }
                      else {
                        var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + docStudent.data().lastName + ' ' + docStudent.data().firstName + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + docStudent.id + 'Classe">' + docStudent.data().classe + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note1" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note2" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td> ';
                        var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note3" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td><td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note4" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td></tr>';
                      }
    
                      var table = table1 + table2;
                      document.getElementById('tableImpli').innerHTML += table;
                    }
                  });
                }
              }
              else
              {
                docStudent.data().matieres.forEach(function (elem) {
                  if (elem.matiere == matiere) {
                    console.log(docStudent.data().firstName + ' ' + docStudent.data().lastName);
                    // console.log("Notes :", elem.notesImplication);
  
                    if (elem.notesImplication != undefined) {
                      var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + docStudent.data().lastName + ' ' + docStudent.data().firstName + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + docStudent.id + 'Classe">' + docStudent.data().classe + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note1" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[0] + '"></td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note2" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[1] + '"></td> ';
                      var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note3" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[2] + '"></td><td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note4" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value="' + elem.notesImplication[3] + '"></td></tr>';
                    }
                    else {
                      var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">' + docStudent.data().lastName + ' ' + docStudent.data().firstName + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="' + docStudent.id + 'Classe">' + docStudent.data().classe + '</td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note1" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td><td style="padding-left: 0.1%; padding-right: 0.1%;"><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note2" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td> ';
                      var table2 = '<td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note3" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td><td style="padding-left: 0.1%; padding-right: 0.1%;" ><input type="text" onchange="enableSave()" id="' + docStudent.id + 'Note4" name="inputNote" style=" width:50px ; margin-left:auto; margin-right: auto; text-align: center;"  class="text-center form-control" value=""></td></tr>';
                    }
  
                    var table = table1 + table2;
                    document.getElementById('tableImpli').innerHTML += table;
                  }
                });
              }



            });
          }).catch(function (err) {
            console.log("Error: ", err);
          })


      });

    }).catch(function (err) {
      console.log("Error: ", err);
    });

}

$('#submitBtn').on('click', function () {

  var index = 0;
  var arrayNotes = [];

  $('#submitBtn').attr('disabled', '');

  $('input[name="inputNote"]').each(function () {

    if ($(this).val() != '') {
      var note = parseFloat($(this).val());
    } else {
      var note = $(this).val();
    }

    arrayNotes.push(note);
    index++;
    console.log("index: ", index);

    if (index == 4) {

      var arrayToPush = arrayNotes;

      console.log("indexGood: ", index);
      console.log("Good");

      firestore.collection('users').doc($(this).attr('id').substring(0, $(this).attr('id').length - 5)).get()
        .then(function (doc) {
          console.log(doc.id);
          // console.log(doc.data().matieres);
          var arrayFromDB = doc.data().matieres;
          arrayFromDB.forEach(function (elemFromDB) {
            if (elemFromDB.matiere == $('select#selectMatiere').val()) {
              arrayFromDB[arrayFromDB.indexOf(elemFromDB)].notesImplication = arrayToPush;
              console.log(arrayFromDB);

              //UPDATE DATABASE
              firestore.collection('users').doc(doc.id)
                .update({
                  matieres: arrayFromDB
                }).then(function () {
                  console.log("Document succesfully updated for :", doc.id);
                }).catch(function (err) {
                  console.log("Error : ", err);
                });
            }
          });
        }).catch(function (err) {
          console.log("ERrr", err);
        });
      index = 0;
      arrayNotes = [];
    }
  });
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
    console.log("IS DEV : ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });

    // initBilan();

  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

function initDevoirsNonCorriges(instituteName, arrayMatieres, idAdmin, arrayClasses) {

  firestore.collection('users').doc(idAdmin).collection('classes').get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(docClasse) {
      //For each class
      if(arrayClasses.includes(docClasse.id))
      {
        console.log(docClasse.id);
        //For each class of the teacher
        arrayMatieres.forEach(function(elem) {
          //For each subject of the teacher
          console.log(elem);

          var nomMatiere = elem;
          if (nomMatiere.indexOf(' ') >= 0) {
            // console.log("true");
            nomMatiere = nomMatiere.replace(/\s+/g, '-');
          }

          nomMatiere = nomMatiere.replace('é', 'e');
          nomMatiere = nomMatiere.replace('è', 'e');

          firestore.collection('users').doc(idAdmin).collection('classes').doc(docClasse.id).collection(elem).get()
          .then(function(querySnapshot2) {

            querySnapshot2.forEach(function(docChapter) {
              //For each chapter of the subject
              if(docChapter.id != 'duration' && docChapter.id != 'Chapitre 1')
              {
                console.log(docChapter.id);
                var newNumeroChapitre = docChapter.data().numeroChapitre;
                if (newNumeroChapitre.indexOf(' ') >= 0) {
                  // console.log("true");
                  newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                }

                firestore.collection('users').where('instituteName', '==', instituteName).where('userCategory', '==', 'student').where('classe','==',docClasse.id).get()
                .then(function(querySnapshot3) {
                  querySnapshot3.forEach(function(docStudent) {
                    //For Every student of the class

                    var fullName = docStudent.data().firstName.substring(0, 1);
                    fullName = fullName + docStudent.data().lastName;

                    var studentEvalUrl = 'devoirs_ecrits/'+idAdmin+'_'+fullName+'_'+nomMatiere+'_'+docStudent.data().classe+'_'+newNumeroChapitre+'.pdf';
                    var subjectUrl = 'sujets_evaluations/'+idAdmin+'_'+nomMatiere+'_'+docStudent.data().classe+'_'+newNumeroChapitre+'.pdf';
                    firebase.storage().ref(studentEvalUrl).getDownloadURL().then(function(url) {
                      //Student eval is present we need to check for the mark
                      if(docChapter.data().notes != undefined)
                      {
                        //The note array is present we need to check if there is a mark for the student
                        docChapter.data().notes.forEach(function(elemNote) {
                          if(elemNote.id == docStudent.id)
                          {
                            if(isNaN(elemNote.note))
                            {
                             if(elemNote.note != 'NN')
                             {
                               //The note is NaN meaning there's no mark, so we PRINT
                               var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
                               var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600" id="'+subjectUrl+'" onclick="downloadSubject(this.id)">Voir le sujet</button></td>';
                               var table3 = '<td><a target="_blank" href="'+url+'"><button type="button" class="btn bg-school-plus btn-min-width text-bold-600">Voir la copie</button></a></td></tr>';

                               var totalTable = table1 + table2 + table3;

                               document.getElementById('devoirsTable').innerHTML += totalTable;
                             } 
                            }
                          }
                        });
                      }
                      else
                      {
                        //The note array is not present meaning that its not corrected so PRINT
                        var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
                        var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600" id="' + subjectUrl + '" onclick="downloadSubject(this.id)">Voir le sujet</button></td>';
                        var table3 = '<td><a target="_blank" href="' + url + '"><button type="button" class="btn bg-school-plus btn-min-width text-bold-600">Voir la copie</button></a></td></tr>';

                        var totalTable = table1 + table2 + table3;

                        document.getElementById('devoirsTable').innerHTML += totalTable;
                      }
                    }).catch(function(err) {
                      //Student eval isn't present we can pass
                    });

                  });
                }).catch(function(err) {
                  console.log("Error: ", err);
                });

              }



            });

          }).catch(function(err) {
            console.log("Error: ", err);
          });

        });
      }

    });
  }).catch(function(err) {
    console.log("Error: ", err);
  });
}

function hey() {
  alert('hey');
}

function downloadSubject(subjectUrl) {

      firebase.storage().ref(subjectUrl).getDownloadURL().then(function (url) {
        window.open(url, '_blank');
      }).catch(function (err) {
        console.log("Error: ", err);
        alert("Erreur, le fichier n'a pas pu être téléchargé. Veuillez vérifier que le sujet est bien présent sur la plateforme.");
      })
}

// function initDevoirsNonCorriges() {

//   var user = auth.currentUser

//   //First we query user to get idAdmin and teacher's subjects/classes
//   firestore.collection('users').doc(user.uid).get()
//     .then(function (docUser) {

//       firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').get()
//         .then(function (querySnapshot) {
//           //For Each class
//           querySnapshot.forEach(function (docClasse) {
//             //For each subject of the teacher
//             docUser.data().matieres.forEach(function (elem) {

//               var nomMatiere = elem;
//               if (nomMatiere.indexOf(' ') >= 0) {
//                 // console.log("true");
//                 nomMatiere = nomMatiere.replace(/\s+/g, '-');
//               }

//               nomMatiere = nomMatiere.replace('é', 'e');
//               nomMatiere = nomMatiere.replace('è', 'e');
//               // console.log("ICI :"+ nomMatiere);

//               firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docClasse.id).collection(elem).get()
//                 .then(function (querySnapshot2) {
//                   //For each chapter present in the considered subject
//                   querySnapshot2.forEach(function (docChapter) {

//                     if (docChapter.id != 'duration' && docChapter.id != 'Chapitre 1') {
//                       var newNumeroChapitre = docChapter.data().numeroChapitre;
//                       if (newNumeroChapitre.indexOf(' ') >= 0) {
//                         // console.log("true");
//                         newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
//                       }
//                       // console.log(newNumeroChapitre);


//                       var evalUrl = 'sujets_evaluations/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + docClasse.id + '_' + newNumeroChapitre + ".pdf";
//                       firebase.storage().ref(evalUrl).getDownloadURL().then(function (url) {
//                         //Now we need to check for every student of the class, who has his own corrected copy

//                         firestore.collection('users').where('instituteName', '==', docUser.data().instituteName).where('userCategory', '==', 'student').where('classe', '==', docClasse.id).get()
//                           .then(function (querySnapshot3) {

//                             querySnapshot3.forEach(function (docStudent) {


//                               if (!docUser.data().dev && docUser.data().dev != undefined) {
//                                 if (!docUser.data().testAccounts.includes(docStudent.id)) {
//                                   var fullName = docStudent.data().firstName.substring(0, 1);
//                                   fullName = fullName + docStudent.data().lastName;
//                                   /* TODO : First check if the student has already handbacked his eval. IF so we can check whether it has been corrected or not */

//                                   var studentEval = 'devoirs_ecrits/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';
//                                   firebase.storage().ref(studentEval).getDownloadURL().then(function (studentUrl) {

//                                     //Student has already uploaded his eval, we can check if the correction is available
//                                     var corrigeUrl = 'devoirs_corriges/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';
//                                     firebase.storage().ref(corrigeUrl).getDownloadURL().then(function (corrUrl) {
//                                       //Copry is corrected.
//                                       console.log("PRESENT: ", docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf');
//                                     }).catch(function (err) {
//                                       // console.log("error :", err);
//                                       var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
//                                       var table2 = '<td>NON</td></tr>';

//                                       var totalTable = table1 + table2;

//                                       document.getElementById('devoirsTable').innerHTML += totalTable;
//                                     });

//                                   }).catch(function (err) {
//                                     // console.log("Er")
//                                   });
//                                 }
//                               }
//                               else {
//                                 var fullName = docStudent.data().firstName.substring(0, 1);
//                                 fullName = fullName + docStudent.data().lastName;
//                                 /* TODO : First check if the student has already handbacked his eval. IF so we can check whether it has been corrected or not */

//                                 var studentEval = 'devoirs_ecrits/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';
//                                 firebase.storage().ref(studentEval).getDownloadURL().then(function (studentUrl) {

//                                   //Student has already uploaded his eval, we can check if the correction is available
//                                   var corrigeUrl = 'devoirs_corriges/' + docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';
//                                   firebase.storage().ref(corrigeUrl).getDownloadURL().then(function (corrUrl) {
//                                     //Copry is corrected.
//                                     console.log("PRESENT: ", docUser.data().idAdmin + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf');
//                                   }).catch(function (err) {
//                                     // console.log("error :", err);
//                                     var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
//                                     var table2 = '<td>NON</td></tr>';

//                                     var totalTable = table1 + table2;

//                                     document.getElementById('devoirsTable').innerHTML += totalTable;
//                                   });

//                                 }).catch(function (err) {
//                                   // console.log("Er")
//                                 });
//                               }








//                             });

//                           }).catch(function (err) {
//                             console.log("Error :", err);
//                           });

//                         // console.log("Eval is present  ", evalUrl);
//                       }).catch(function (err) {
//                         // console.log("Error :", err);
//                         //DO HERE

//                       });

//                     }


//                   });

//                 }).catch(function (err) {
//                   console.log("Error :", err);
//                 });

//             });


//           });

//         }).catch(function (err) {
//           console.log("Error :", err);
//         });
//     }).catch(function (err) {
//       console.log("Error : ", err);
//     });
// }



/* function initDevoirsNonCorriges(instituteName,matiere, idAdmin, classeArray, index1) {

  // console.log(matiere);
  var arrayChapter = [];
  var arrayFirstNames = [];
  var arrayLastNames = [];
  var arrayStudentIds = [];
  var arrayFullNamesForEval = [];
  
  console.log(classeArray);
  
  console.log(index1)

  if(index1 < classeArray.length)
  {
    // console.log("eh");
    firestore.collection('users').where('instituteName', '==', instituteName).where('classe', '==',classeArray[index1]).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(docStudent) {
        var fullName = docStudent.data().firstName.substring(0,1)+docStudent.data().lastName;
        arrayFullNamesForEval.push(fullName);
        arrayStudentIds.push(docStudent.id);
      });
      initDevoirsNoncorrigesCallback(instituteName,matiere, idAdmin, classeArray, arrayFullNamesForEval,arrayStudentIds, index1,0)
    }).catch(function(err) {
      console.log("Error: ", err);
    });
  }
  else
  {
    console.log("Done.");
  }

}
function initDevoirsNoncorrigesCallback(instituteName,matiere, idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, index1, index2) {

  var chapterArray = [];
  var notesArray = [];
  console.log(index2);
  if(index2 < matiere.length)
  {
    // console.log("ici");
    firestore.collection('users').doc(idAdmin).collection('classes').doc(classeArray[index1]).collection(matiere[index2]).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(docChapter) {
        if(docChapter.id != 'duration' && docChapter.id != 'Chapitre 1')
        {
          console.log(classeArray[index1]);
          console.log(docChapter.id)
          chapterArray.push(docChapter.id);
          notesArray.push(docChapter.data().notes);
        }   
      });
      initDevoirsNoncorrigesCallback2(instituteName,matiere, idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, 0);      
    }).catch(function(err) {
      console.log("Error: " ,err);
    });
  }
  else
  {
    // console.log("la");
    index1++;
    initDevoirsNonCorriges(instituteName,matiere, idAdmin, classeArray, index1);
  }

}

function initDevoirsNoncorrigesCallback2(instituteName, matiere, idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, index3) {

  console.log("INDEX 3 : ", index3);
  if(index3 < chapterArray.length)
  {
    // console.log(chapterArray);
    // console.log(notesArray[index3]);

    if(notesArray[index3] != undefined)
    {
      //Check the note
      notesArray[index3].forEach(function(elem) {
        if(isNaN(elem.note))
        {
          if(elem.note == 'NN')
          {
            //The note is here and is NN we pass
            index3++;
            initDevoirsNoncorrigesCallback2(instituteName, matiere,idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, index3);        
          }
          else
          {
            //The note is NaN we need to check for student eval
            //Variables required to query firebase storage
            var nomMatiere = matiere[index2];
            if (nomMatiere.indexOf(' ') >= 0) {
              // console.log("true");
              nomMatiere = nomMatiere.replace(/\s+/g, '-');
            }
            nomMatiere = nomMatiere.replace('é', 'e');
            nomMatiere = nomMatiere.replace('è', 'e');

            var newNumeroChapitre = chapterArray[index3];

            console.log(chapterArray[index3]);
            console.log(index3);
            if (newNumeroChapitre.indexOf(' ') >= 0) {
              // console.log("true");
              newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
            }
            var indexToLookFor = arrayStudentIds.indexOf(elem.id);
            var name = arrayFullNamesForEval[indexToLookFor];
            // console.log(name);
            index3++;
            initDevoirsNoncorrigesCallback2(instituteName,matiere,idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, index3);      
  
          }
        }
        else
        {
          //The note is here and is a number we pass
          index3++;
          initDevoirsNoncorrigesCallback2(instituteName,matiere,idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, index3);      
        }
      });
    }
    else
    {
      //Check subject
      index3++;
      initDevoirsNoncorrigesCallback2(instituteName,matiere,idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, chapterArray, notesArray, index1, index2, index3);      

    }

  }
  else
  {
    // console.log('up');
    index2++;
    initDevoirsNoncorrigesCallback(instituteName, matiere, idAdmin, classeArray,arrayFullNamesForEval,arrayStudentIds, index1, index2);
  }
} */

  



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







