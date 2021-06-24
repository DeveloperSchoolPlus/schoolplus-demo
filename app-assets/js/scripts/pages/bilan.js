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
        setUserInteface(doc.data().instituteName);
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
    console.log("Is Dev : ", doc.data().dev);
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

function setUserInteface(instituteName) {

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).collection('classes').get()
    .then(function (querySnapshot) {

      //First we build the selectClass with all classes of the institution
      querySnapshot.forEach(function (doc) {
        document.getElementById('selectClass').selectize.addOption({ value: doc.data().nomClasse, text: doc.data().nomClasse });
        document.getElementById('selectCorrectionClasse').selectize.addOption({ value: doc.data().nomClasse, text: doc.data().nomClasse });

        var $select = $('select#selectClass').selectize();
        var $select2 = $('select#selectCorrectionClasse').selectize();

        var control = $select[0].selectize;
        var control2 = $select2[0].selectize;

        control.clear();
        control2.clear();
      });

    }).catch(function (err) {
      console.log("Error: ", err);
    });

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {


      firestore.collection('users').where("userCategory", "==", "student").where("instituteName", "==", instituteName).get()
        .then(function (querySnapshot) {

          //Then we build the selectStudent with every student of the institution
          querySnapshot.forEach(function (doc) {

            if (!docUser.data().dev) {
              if (!docUser.data().testAccounts.includes(doc.id)) {
                document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
                var $select2 = $('select#selectStudent').selectize();
                var control2 = $select2[0].selectize;
                control2.clear();
              }
            }
            else {
              document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
              var $select2 = $('select#selectStudent').selectize();
              var control2 = $select2[0].selectize;
              control2.clear();
            }
          });
        }).catch(function (err) {
          console.log("Error : ", err);
        });





    }).catch(function (err) {
      console.log("Error :", err);
    });


}

$('select#selectCorrectionClasse').on('change', function () {
  console.log($('select#selectCorrectionClasse').val());
  var user = auth.currentUser;
  document.getElementById('devoirsTable').innerHTML = '';
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      initDevoirsNonCorriges(docUser.data().instituteName, $('select#selectCorrectionClasse').val());
    }).catch(function (err) {
      console.log("Erorr: ", err);
    });

});

function initDevoirsNonCorriges(instituteName, classe) {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).collection('classes').doc(classe).get()
    .then(function (docClasse) {

      docClasse.data().matieres.forEach(function (elem) {
        //For Each subject of the selected class
        console.log(elem);

        var nomMatiere = elem;
        if (nomMatiere.indexOf(' ') >= 0) {
          // console.log("true");
          nomMatiere = nomMatiere.replace(/\s+/g, '-');
        }

        nomMatiere = nomMatiere.replace('é', 'e');
        nomMatiere = nomMatiere.replace('è', 'e');
        firestore.collection('users').doc(user.uid).collection('classes').doc(classe).collection(elem).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (docChapter) {
              //For Each chapter of the current subject
              if (docChapter.id != 'duration' && docChapter.id != 'Chapitre 1') {
                console.log(docChapter.id);
                var newNumeroChapitre = docChapter.data().numeroChapitre;
                if (newNumeroChapitre.indexOf(' ') >= 0) {
                  // console.log("true");
                  newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
                }

                firestore.collection('users').where('instituteName', '==', instituteName).where('userCategory', '==', 'student').where('classe', '==', docClasse.id).get()
                  .then(function (querySnapshot2) {
                    querySnapshot2.forEach(function (docStudent) {
                      //For Each student of the class
                      var fullName = docStudent.data().firstName.substring(0, 1);
                      fullName = fullName + docStudent.data().lastName;
                      var studentEvalUrl = 'devoirs_ecrits/' + user.uid + '_' + fullName + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';
                      var subjectUrl = 'sujets_evaluations/' + user.uid + '_' + nomMatiere + '_' + docStudent.data().classe + '_' + newNumeroChapitre + '.pdf';

                      firebase.storage().ref(studentEvalUrl).getDownloadURL().then(function (url) {
                        //Student eval is present we need to check for the mark
                        if (docChapter.data().notes != undefined) {
                          //The note array is present we need to check if there is a mark for the student
                          docChapter.data().notes.forEach(function (elemNote) {
                            if (elemNote.id == docStudent.id) {
                              if (isNaN(elemNote.note)) {
                                if (elemNote.note != 'NN') {
                                  //The note is NaN meaning there's no mark, so we PRINT
                                  var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
                                  var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600" id="' + subjectUrl + '" onclick="downloadSubject(this.id)">Voir le sujet</button></td>';
                                  var table3 = '<td><a target="_blank" href="' + url + '"><button type="button" class="btn bg-school-plus btn-min-width text-bold-600">Voir la copie</button></a></td></tr>';

                                  var totalTable = table1 + table2 + table3;

                                  document.getElementById('devoirsTable').innerHTML += totalTable;
                                }
                              }
                            }
                          });
                        }
                        else {
                          //The note array is not present meaning that its not corrected so PRINT
                          var table1 = '<tr><td>' + docStudent.data().firstName + ' ' + docStudent.data().lastName + ' - ' + elem + ' - ' + docChapter.data().numeroChapitre + '</td>';
                          var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600" id="' + subjectUrl + '" onclick="downloadSubject(this.id)">Voir le sujet</button></td>';
                          var table3 = '<td><a target="_blank" href="' + url + '"><button type="button" class="btn bg-school-plus btn-min-width text-bold-600">Voir la copie</button></a></td></tr>';

                          var totalTable = table1 + table2 + table3;

                          document.getElementById('devoirsTable').innerHTML += totalTable;
                        }
                      }).catch(function (err) {
                        //Student eval isn't present we can pass
                      });
                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });

              }
            });
          }).catch(function (err) {
            console.log("Error: ", err);
          });

      });

    }).catch(function (err) {
      console.log("Error: ", err);
    });

}

function downloadSubject(subjectUrl) {

  firebase.storage().ref(subjectUrl).getDownloadURL().then(function (url) {
    window.open(url, '_blank');
  }).catch(function (err) {
    console.log("Error: ", err);
    alert("Erreur, le fichier n'a pas pu être téléchargé. Veuillez vérifier que le sujet est bien présent sur la plateforme.");
  })
}

$('select#selectClass').on('change', function () {

  var user = auth.currentUser;
  document.getElementById('selectStudent').selectize.clearOptions();
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      firestore.collection('users').where("userCategory", "==", "student").where("instituteName", "==", docUser.data().instituteName).where("classe", "==", $('select#selectClass').val()).get()
        .then(function (querySnapshot) {

          querySnapshot.forEach(function (doc) {

            if (!docUser.data().dev) {
              if (!docUser.data().testAccounts.includes(doc.id)) {
                document.getElementById('selectStudent').selectize.addOption({ value: doc.data().id, text: doc.data().firstName + ' ' + doc.data().lastName });
                var $select2 = $('select#selectStudent').selectize();
                var control2 = $select2[0].selectize;
                control2.clear();
              }
            }
            else {
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
  document.getElementById('generalMean').innerText = '';
  if ($('select#selectStudent').val() != '') {
    initBilan($('select#selectStudent').val());
  }
  // 

});



function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

/* function showCorrectedCopies(numeroChapitre)
{
  var user = auth.currentUser;
  document.getElementById('okBtn').style.display = 'none';
  document.getElementById('submitBtn').style.display = 'inline';
  document.getElementById('hiddenChapterNumber').innerText = numeroChapitre;
  document.getElementById('modalTitle').innerText = "Devoirs - "+numeroChapitre;
  document.getElementById('modalClass').innerText = $('select#selectClass').val();
  var tableHeader = "<tr><th width='40%' style='text-align: left !important;'>Nom et prénom de l'élève</th><th width='20%'>Sujet corrigé</th><th width='20%'>Note</th><th width='20%'></th></tr>";
  document.getElementById('tableDevoirs').innerHTML = tableHeader
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    firestore.collection('users').where("instituteName", "==", docUser.data().instituteName).where("userCategory", "==", "student").where("classe", "==", $('select#selectClass').val()).get()
    .then(function(querySnapshot) {
      
      querySnapshot.forEach(function(doc) {
        console.log(doc.data().firstName+" "+doc.data().lastName);
        //We build an auxiliary array to contain matieres labels
        var matieresArray = [];
        doc.data().matieres.forEach(function(elem) {
          matieresArray.push(elem.matiere);
        });
        //Now we can check if selected matiere is included in matieresArray. If so, we can download pdf & mp3 for considered student
        if(matieresArray.includes($('select#selectMatiere').val()))
        {
          //We build html first and then we fill hrefs
          var table1 = "<tr><td width='40%' style='vertical-align: middle;'>"+doc.data().firstName+" "+doc.data().lastName+"</td>";
          var table3 = "<td  width='20%' style='text-align: center;vertical-align: middle;' ><input id='"+doc.data().id+"Note' name='inputNote' style=' width:50px ; margin-left:auto; margin-right: auto; text-align: center;'  class='text-center form-control' value=''></td>";
          var table2 = "<td width='20%' style='text-align: center;vertical-align: middle;'id='"+doc.data().id+"WrittenTd'><p class='card-title' id='"+doc.data().id+"ErrorMessage' style='display: none;margin-bottom: 0px;'>Aucun sujet corrigé déposé.</p><img id='loading"+doc.data().id+"' style='display: none;' src='../../app-assets/images/loading.gif'><a href='' id='"+doc.data().id+"WrittenLink' target='_blank'><button id='"+doc.data().id+"Btn' class='btn bg-school-plus btn-min-width text-bold-600' style='display: none;' type='button'>Télécharger</button></a></td>";
          var table4 = '<td style="text-align: center;vertical-align: middle;" width="20%"id="'+doc.data().id+'OralTd" ><span  class="btn btn-success fileinput-button mr-1" ><span>Uploader la copie corrigée</span><input type="file" onchange="uploadCorrectedCopies(this.id,\''+numeroChapitre+'\')" id="'+doc.data().id+'" name="files[]" accept="application/pdf"></span></td></tr>';
          var totalTable = table1 + table2 + table3 + table4;
          
          document.getElementById('tableDevoirs').innerHTML += totalTable;
          
          var fullName = doc.data().firstName.substring(0, 1)+doc.data().lastName;
          var nomMatiere = $('select#selectMatiere').val();
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
          
          var fileUrl = "devoirs_corriges/"+docUser.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".pdf";
          console.log("File URL to be queried ==> "+ fileUrl);
          
          firebase.storage().ref(fileUrl).getDownloadURL().then(function(url) {
            console.log("File url ==> "+ url)
            document.getElementById(doc.data().id+"WrittenLink").href = url;
            document.getElementById("loading"+doc.data().id).style.display = "none";
            document.getElementById(doc.data().id+"ErrorMessage").style.display = 'none';
            document.getElementById(doc.data().id+"Btn").style.display = "block";
            
          }).catch(function(err) {
            console.log("Error: ", err);
            document.getElementById("loading"+doc.data().id).style.display = 'none';
            document.getElementById(doc.data().id+"Btn").style.display = "none";
            document.getElementById(doc.data().id+"ErrorMessage").style.display = 'block';
          });
        }
      });
    }).catch(function(err) {
      console.log("Error :", err);
    });
    
    firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
    .then(function(docChapter) {
      if(docChapter.data().notes != undefined)
      {
        docChapter.data().notes.forEach(function(elem) {
          if(!Number.isNaN(elem.note))
          {
            document.getElementById(elem.id+"Note").value = elem.note;
          }
        });
      } else {
        console.log("undefined");
      }
      
    }).catch(function(err) {
      console.log("Error :", err);
    });
    
  }).catch(function(err) {
    console.log("Error :", err);
  });
  $('#modalDevoirs').modal();
  
} */

function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

function showImplication() {
  $('#modalImplication').modal();
}


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

function checkEval(note, domId, docId, userId, matiere, numeroChapitre) {
  console.log("Entering CheckEVAL for : ", matiere + "   " + numeroChapitre);
  var user = auth.currentUser;
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

      var sujetEvalUrl = 'sujets_evaluations/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';
      // console.log(pdfURL);
      //Now that we built the url we can start downloading the file

      firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url1) {
        //The subject is present, we now need to check if the student did it. If so we print ECC if not we print AF
        console.log("CHECK EVAL, THE EVAL SUBJECT IS PRESENT FOR : ", matiere + "    " + numeroChapitre);
        firebase.storage().ref(pdfURL).getDownloadURL().then(function (url) {
          console.log("CHECK EVAL, THE EVAL OF STUDENT IS PRESENT FOR : ", matiere + "    " + numeroChapitre);

          document.getElementById(domId).innerText = 'ECC';
        }).catch(function (err) {
          console.log("CHECK EVAL, THE EVAL OF STUDENT IS NOT PRESENT FOR : ", matiere + "    " + numeroChapitre);

          console.log("Error :", err);
          document.getElementById(domId).innerText = 'AF';
        });

      }).catch(function (err) {
        //The subject is'nt present we can pass on that one
        console.log("CHECK EVAL : THE SUBJECT ISN T PRESENT WE CAN PASS");
      });



      /*  firebase.storage().ref(pdfURL).getDownloadURL().then(function(url) {
         document.getElementById(domId).innerText = 'ECC';
       }).catch(function(err) {
         console.log("Error :", err);
         document.getElementById(domId).innerText = 'AF';
       }); */

    }).catch(function (err) {
      console.log("Error :", err);
    });


}


//FONCTIONS EN LIEN AVEC LE BULLETIN
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
                document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note;
                indexHTML++;
                index++;
                foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
              } else {
                console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + $('select#selectClass').val() + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'AF';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                });
              }
            } else {
              console.log("La note est un nombre, on peut donc afficher, calculer et passer au prochain chapter");
              document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = elem.note;
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
            document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'ECC';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          }).catch(function (err) {
            //The subject is present + student's eval doesn't exist so we assume its AF
            console.log("The subject is present + student's eval doesn't exist so we assume its AF");
            document.getElementById(matiere[indexOfFoo] + 'Note' + indexHTML).innerText = 'AF';
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
//FIN FONCTIONS EN LIEN AVEC LE BULLETIN

function checkEvalRecursive(matiereArray, chapitreArray, index) {

  var user = auth.currentUser;
  var sujetEvalUrl = 'sujets_evaluations/' + user.uid + '_' + matiereArray[index] + '_' + $('select#selectClass').val() + '_' + chapitreArray[index] + '.pdf';

  console.log(index);
  console.log(matiereArray);
  console.log(matiereArray.length);



  if (index < matiereArray.length) {
    firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
      // console.log("EVAL LNK " + url);
      console.log("The eval for " + chapitreArray[index] + " of " + matiereArray[index] + " is present. We can set the note value on 'AF.'");
      index++;
      checkEvalRecursive(matiereArray, chapitreArray, index);
    }).catch(function (err) {
      // console.log("Error :", err);
      console.log("The eval for " + chapitreArray[index] + " of " + matiereArray[index] + " is not present. We can move to next chapter.");
      index++;
      checkEvalRecursive(matiereArray, chapitreArray, index);
    });
  }
  else {
    console.log("Done");
  }




}

//Ancienne version, à laisser commentée
// function initBilan(idUser) {

//   var user = auth.currentUser;

//   firestore.collection('users').doc(idUser).get()
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

//                       if (elemNote.id == idUser) {
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
//                         else if(isNaN(elem.note))
//                         {
//                           console.log(elem.matiere+"Note"+(index-1));
//                           console.log(elem.note);

//                           checkThisMark(elem.note, elem.matiere+"Note"+(index-1), doc.id, idUser, elem.matiere, doc.data().numeroChapitre);

//                         }
//                       }
//                     });
//                   }
//                 }
//                 else
//                 {
//                   //We need to check if the eval has been updated. If no, we do nothing
//                   //If so we check if the student has uploaded his sheet. If so we print 'ECC' if no we print 'AF'
//                   // checkThisMark('', elem.matiere+'Note'+(index-1),'', idUser, elem.matiere, doc.data().numeroChapitre);
//                   index++;
//                   console.log("NOTE IS UNDEFINED FOR : ", elem.matiere+'  '+doc.data().numeroChapitre);
//                   checkEval('', elem.matiere+'Note'+(index-1), '', idUser, elem.matiere, doc.data().numeroChapitre);
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



