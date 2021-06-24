//DEV
var firebaseConfig = {
  apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
  authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
  databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
  projectId: "schoolplus-dev-e8a2d",
  storageBucket: "schoolplus-dev-e8a2d.appspot.com",
  messagingSenderId: "330523876306",
  appId: "1:330523876306:web:cbdcee87b7e3e007"
};
// //PROD
// var firebaseConfig = {
//   apiKey: "AIzaSyDyC4t8wIotI9PFDVd5AACXUaw3y60h7Wk",
//   authDomain: "schoolplus-prod.firebaseapp.com",
//   databaseURL: "https://schoolplus-prod.firebaseio.com",
//   projectId: "schoolplus-prod",
//   storageBucket: "schoolplus-prod.appspot.com",
//   messagingSenderId: "991751441024",
//   appId: "1:991751441024:web:bd135bd34e706797"
// };
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();

var secondaryApp = firebase.initializeApp(firebaseConfig, "Secondary");
/* secondaryApp.auth().createUserWithEmailAndPassword(em, pwd).then(function(firebaseUser) {
  console.log("User " + firebaseUser.uid + " created successfully!");
  //I don't know if the next statement is necessary 
  secondaryApp.auth().signOut();
}); */


//Initialize variables to get HTML elements
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const nomClasse = document.getElementById('nomClasse');
const selectedFiliere = document.getElementById('selectFiliere');
const selectedClass = document.getElementById('selectClass');
const selectedStudent = document.getElementById('selectStudent');
const selectedTeacher = document.getElementById('selectTeacher');
const matieresSection = document.getElementById('matieresSection');
const matieresSectionTeacher = document.getElementById('matieresSectionTeacher');
const listeMatieres = document.getElementById('listeMatieres');
// const navMenu = document.getElementById('main-menu-navigation');


const parameters = location.search.substring(1).split("&");
const temp = parameters[0].split("=");
const moduleValue = decodeURI(temp[1]);


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
    }
    console.log("IS DEV : ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });

    //Gérer le formulaire selon si CollegE/Lycée ou SoutienScolaire


  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });

}

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

// Add a realtime listener for Firebase Authentification
firebase.auth().onAuthStateChanged(firebaseUser => {
  if (firebaseUser) {

    var user = auth.currentUser;
    var query = firestore.collection("users").doc(user.uid);
    query.get().then(function (doc) {
      if (doc.exists) {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;
        console.log("Hello " + userFirstName + " " + userLastName + "\n" + user.uid);
        setPageModules(moduleValue);
        initClassList();
        initAffectTeacherList();
        initClassSelection();
        initStudentSelection();
        getUserInfo();
        getUserNotif();
        initClassCreation();
        setModifyClassList();
        setModifyTeacherList(doc.data().instituteName);


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

function initClassList() {
  var user = auth.currentUser;
  document.getElementById('classList').innerHTML = '';
  firestore.collection('users').doc(user.uid).collection('classesHackschooling').get()
    .then(function (querySnapshot) {

      if (querySnapshot.size == 0) {
        console.log('case 1');
        document.getElementById('classList').innerHTML = "<p>Aucune classe n'a encore été ajoutée à l'établissement.</p>"
      }
      else {
        console.log("case 2");
        querySnapshot.forEach(function (doc) {

          document.getElementById('classList').innerHTML += "<p>" + doc.id + "</p>";

          document.getElementById('selectClassTeacher').selectize.addOption({ value: doc.id, text: doc.id });
          var $select = $('select#selectClassTeacher').selectize();
          var control = $select[0].selectize;
          control.clear();

        });
      }




    }).catch(function (err) {
      console.log("Error: ", err);
    })




}
function clearAffectTeacher() {

  var $select = $('select#selectAffectTeacher').selectize();
  var control = $select[0].selectize;
  control.clear();

  var $select2 = $('select#selectClassTeacher').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();


  // $('select#selectAffectTeacher').val('');
  // $('select#selectClassTeacher').val('');
}

$('#affectTeacher').on('click', function () {

  if ($('select#selectAffectTeacher').val() != '' && $('select#selectClassTeacher').val() != '') {


    firestore.collection('users').doc($('select#selectAffectTeacher').val()).update({
      realClasses: $('select#selectClassTeacher').val()
    }).then(function () {
      console.log("Document updated.");
      swal({
        title: "Affectation validée !",
        type: "success",
        text: "Les classes " + $('select#selectClassTeacher').val() + " ont bien été affectées à " + $('select#selectAffectTeacher').text(),
        showCancelButton: false,
        closeOnConfirm: true

      },
        function (isConfirm) {
          if (isConfirm) {
            clearAffectTeacher();

          }
        });
    }).catch(function (err) {
      console.log("Error: ", err);
    });

  }
  else {
    alert('Attention, toutes les informartions requises n\'ont pas été complétées.');
  }


});

$('select#selectAffectTeacher').on('change', function () {

  if ($('select#selectAffectTeacher').val() != '') {
    firestore.collection('users').doc($('select#selectAffectTeacher').val()).get()
      .then(function (docTeacher) {

        if (docTeacher.data().realClasses != undefined && docTeacher.data().realClasses.length > 0) {
          var $select2 = $('select#selectClassTeacher').selectize();
          var control2 = $select2[0].selectize;
          control2.setValue(docTeacher.data().realClasses);
          /* var array = [];
          docTeacher.data().realClasses.forEach(function (elem) {
            array.push(elem);
            
            $('select#selectClassTeacher').val(array);
  
          }); */

        }
        else {
          console.log("Teacher has no class yet");
          var $select2 = $('select#selectClassTeacher').selectize();
          var control2 = $select2[0].selectize;
          control2.setValue('');
        }

      }).catch(function (err) {
        console.log("Error:", err);
      });
  }



});


function clearCreateStudentForm() {

  // var $select = $('select#selectCreateClass').selectize();
  // var control = $select[0].selectize;
  // control.clear();

  var $select2 = $('select#selectFiliere').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();

  document.getElementById('userFirstName').value = '';
  document.getElementById('userLastName').value = '';
  document.getElementById('userEmail').value = '';
  document.getElementById('userFirstName').value = '';
  document.getElementById('password').value = '';
  document.getElementById('password_confirmation').value = '';


  document.getElementById('selectExistingStudent').selectize.clearOptions();
  document.getElementById('selectSpe').selectize.clearOptions();
  document.getElementById('selectOpt').selectize.clearOptions();


}


$('select#selectCreateClass').on('change', function () {
  var user = auth.currentUser
  document.getElementById('pendingStudents').innerHTML = '';
  document.getElementById('listStudent').innerHTML = '';
  lookForWaitingStudents();

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
    .then(function (doc) {

      if (doc.data().students.length > 0) {
        doc.data().students.forEach(function (elem) {

          document.getElementById('listStudent').innerHTML += '<p>' + elem.firstName + ' ' + elem.lastName + '</p>';

        });
      }
      else {
        document.getElementById('listStudent').innerHTML = "<p>Aucun élève n'a encore été ajouté à cette classe.</p>";

      }

    }).catch(function (err) {
      console.log("error: ", err);
    });
});

function lookForWaitingStudents() {
  // alert('e');
  document.getElementById('pendingStudents').innerHTML = '';

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
    .then(function (docClasse) {

      var studentsOfClass = docClasse.data().students;
      // alert('f');

      if (studentsOfClass.length == 0) {
        console.log("Equals 0");
        firestore.collection('users').where('instituteName', '==', 'Hackschooling Institute').where('userCategory', '==', 'student').where('realClasse', '==', $('select#selectCreateClass').val()).get()
          .then(function (querySnapshot) {

            if (querySnapshot.size == 0) {
              // alert('e');
              document.getElementById('pendingStudents').innerHTML = "<p>Aucun élève en attente d'affectation à la classe sélectionnée.</p>";
            }
            else {
              // alert('a');
              querySnapshot.forEach(function (doc) {


                console.log(doc.data().firstName + ' ' + doc.data().lastName);
                document.getElementById('pendingStudents').innerHTML += "<p name='pendingStudent' id='" + doc.data().id + "'>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";



              });
            }
            // alert('g');

          }).catch(function (er) {
            console.log("error : ", er);
          });
      }
      else {
        var studentsToDisplay = [];
        firestore.collection('users').where('instituteName', '==', 'Hackschooling Institute').where('userCategory', '==', 'student').where('realClasse', '==', $('select#selectCreateClass').val()).get()
          .then(function (querySnapshot) {
            var printErrorMessage = true;
            // alert('g');
            querySnapshot.forEach(function (doc) {

              var isAlreadyPresent = false;

              studentsOfClass.forEach(function (elem) {

                if (doc.id == elem.id) {
                  isAlreadyPresent = true;
                }



              });

              if (!isAlreadyPresent) {
                document.getElementById('pendingStudents').innerHTML += "<p name='pendingStudent' id='" + doc.data().id + "'>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";
                printErrorMessage = false;

              }


              // console.log(doc.data().firstName + ' ' + doc.data().lastName);
              // document.getElementById('pendingStudents').innerHTML += "<p>" + doc.data().firstName + ' ' + doc.data().lastName + "</p>";




            });

            if (printErrorMessage) {
              document.getElementById('pendingStudents').innerHTML = "<p>Aucun élève en attente d'affectation à la classe sélectionnée.</p>";

            }
          }).catch(function (er) {
            console.log("error : ", er);
          });
      }




    }).catch(function (err) {
      console.log("Error: ", err);
    });

}

$('#updateClass').on('click', function () {

  var user = auth.currentUser;
  if ($('select#selectCreateClass').val() != '') {

    firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
      .then(function (docClasse) {


        var studentsArray = docClasse.data().students;

        var myArray = [];


        var pendingStudentsIds = document.getElementsByName('pendingStudent');
        pendingStudentsIds.forEach(function (elem) {

          myArray.push(elem.id);



        });

        updateClass(myArray, studentsArray, 0);

        // console.log(myArray);

      }).catch(function (err) {
        console.log("Error: ", err);
      });



  }
  else {
    alert('Veuillez sélectionner une classe pour la mettre à jour.');
  }

});

function updateClass(arrayIds, arrayExistingClass, index) {
  var user = auth.currentUser;
  if (index < arrayIds.length) {
    firestore.collection('users').doc(arrayIds[index]).get()
      .then(function (docStudent) {
        if (docStudent.data().firstName != 'Jean5') {
          var studentSubjects = [];

          docStudent.data().matieres.forEach(function (elem) {
            studentSubjects.push(elem.matiere);
          });

          var toPush = { id: docStudent.id, firstName: docStudent.data().firstName, lastName: docStudent.data().lastName, matieres: studentSubjects, level: docStudent.data().classe }

          arrayExistingClass.push(toPush);
          index++;

          updateClass(arrayIds, arrayExistingClass, index);
        }
        else {
          index++;

          updateClass(arrayIds, arrayExistingClass, index);
        }


      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    console.log(arrayExistingClass);
    lookForWaitingStudents();
    firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).set({
      students: arrayExistingClass
    },
      {
        merge: true
      }).then(function () {
        firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc($('select#selectCreateClass').val()).get()
          .then(function (doc) {

            document.getElementById('listStudent').innerHTML = '';

            if (doc.data().students.length > 0) {
              doc.data().students.forEach(function (elem) {

                document.getElementById('listStudent').innerHTML += '<p>' + elem.firstName + ' ' + elem.lastName + '</p>';

              });
            }
            else {
              document.getElementById('listStudent').innerHTML = "<p>Aucun élève n'a encore été ajouté à cette classe.</p>";

            }

          }).catch(function (err) {
            console.log("error: ", err);
          });
        swal({
          title: "Classe " + $('select#selectCreateClass').val() + "mise à jour",
          closeOnConfirm: true,
          type: 'success'
        });
        console.log("Done");
      }).catch(function (err) {
        console.log("Error updating doc", err);
      });
  }
}

function initAffectTeacherList() {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
    .then(function (docAdmin) {

      firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', docAdmin.data().instituteName).get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            document.getElementById('selectAffectTeacher').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            var $select = $('select#selectAffectTeacher').selectize();
            var control = $select[0].selectize;
            control.clear();
          });
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

$('#createStudent').on('click', function () {
  var user = auth.currentUser;
  var newEmail = document.getElementById('userEmail');
  var newPassword = document.getElementById('password');

  var radioValue = $('[name="radio"]:checked');
  console.log(radioValue.val());

  if (radioValue.val() == 'hasNoAccount') {
    if ($('select#selectCreateClass').val() != '' && document.getElementById('userFirstName').value != '' && document.getElementById('userLastName').value != '' && $('select#selectFiliere').val() != '') {
      if (newEmail.checkValidity() && newPassword.checkValidity()) {
        secondaryApp.auth().createUserWithEmailAndPassword(newEmail.value, newPassword.value).then(function (firebaseUser) {
          console.log("User " + firebase.auth(secondaryApp).currentUser.uid + " created successfully!");
          //I don't know if the next statement is necessary

          var newClass = $('select#selectCreateClass').val();
          var level = '';
          switch ($('select#selectFiliere').val()) {
            case '6ème':
              level = '6ème';
              break;
            case '5ème':
              level = '5ème';
              break;
            case '4ème':
              level = '4ème';
              break;
            case '3ème':
              level = '3EVOL';
              break;
            case 'Seconde générale et technologique':
              level = '2EVOL';
              break;
            case 'Première générale':
              level = '1EVOL';
              break;
            case 'Terminale générale':
              level = 'TS_EVOL';
              break;
            case 'Première STMG':
              level = '1STMG_EVOL';
              break;
            case 'Terminale STMG':
              level = 'TSTMG_EVOL';
              break;
            case 'Terminale Pro Commerce':
              level = 'Terminale Pro Commerce';
              break;
          }
          var newFiliere = $('select#selectFiliere').val();
          var matieres = [];

          $.ajax({
            type: 'GET',
            url: '../../assets/json/matieresList.json'
          }).then(function (data) {
            data.filieres.forEach(function (elem) {

              if (elem.nomFiliere == $('select#selectFiliere').val()) {
                elem.matieresGen.forEach(function (elemSubject) {
                  matieres.push({ matiere: elemSubject, timeDone: 0, timeValidated: 0, totalTime: 0 });
                });
              }

            });

            $('select#selectSpe').val().forEach(function (elem) {

              matieres.push({ matiere: elem, timeDone: 0, timeValidated: 0, totalTime: 0 });
            });

            $('select#selectOpt').val().forEach(function (elem) {
              matieres.push({ matiere: elem, timeDone: 0, timeValidated: 0, totalTime: 0 });
            });


            firestore.collection('users').doc(firebase.auth(secondaryApp).currentUser.uid).set({
              id: firebase.auth(secondaryApp).currentUser.uid,
              email: firebase.auth(secondaryApp).currentUser.email,
              firstName: document.getElementById('userFirstName').value,
              lastName: document.getElementById('userLastName').value,
              userCategory: 'student',
              tel: '',
              classe: level,
              realClasse: newClass,
              instituteName: 'Hackschooling Institute',
              instituteCategory: 'lycee',
              idAdmin: user.uid,
              manuel: '',
              loginManuel: '',
              mdpManuel: '',
              notifications: [],
              newNotif: 0,
              matieres: matieres,
              filiere: newFiliere
            }).then(function () {
              console.log("Document created");
              secondaryApp.auth().signOut();
              lookForWaitingStudents();
              clearCreateStudentForm();

              firestore.collection('users').doc(user.uid).collection('classes').doc(level).get()
                .then(function (docLevel) {

                  if (docLevel.exists) {
                    var arrayToPush = docLevel.data().matieres;
                    var arrayToPushBis = docLevel.data().matieres;
                    var collectionToCreate = [];


                    matieres.forEach(function (elem) {
                      if (!docLevel.data().matieres.includes(elem.matiere)) {
                        arrayToPush.push(elem.matiere);
                        collectionToCreate.push(elem.matiere);
                      }
                    });

                    if (arrayToPush != arrayToPushBis) {
                      firestore.collection('users').doc(user.uid).collection('classes').doc(level).update({
                        matieres: arrayToPush
                      }).then(function () {
                        collectionToCreate.forEach(function (elem) {
                          firestore.collection('users').doc(user.uid).collection('classes').doc(level).collection(elem).doc('duration').set({
                            duration: 0
                          }).then(function () {
                            console.log("DONE");
                          }).catch(function (err) {
                            console.log("Error :", err);
                          });
                        });
                      }).catch(function (err) {
                        console.log("Error: ", err);
                      });
                    }
                  }
                  else {
                    var arrayToPush = [];
                    matieres.forEach(function (elem) {
                      arrayToPush.push(elem.matiere);
                    });

                    firestore.collection('users').doc(user.uid).collection('classes').doc(level).set({
                      matieres: arrayToPush
                    }).then(function () {

                      arrayToPush.forEach(function (elemSubject) {
                        firestore.collection('users').doc(user.uid).collection('classes').doc(level).collection(elemSubject).doc('duration').set({
                          duration: 0
                        }).then(function () {
                          console.log("Document created for subject :: ", elemSubject);
                        }).catch(function (err) {
                          console.log("Error: ", err);
                        });

                      });

                    }).catch(function (err) {
                      console.log("Error: ", err);
                    });
                  }



                }).catch(function (err) {
                  console.log("Error: ", err);
                });

            }).catch(function (err) {
              console.log("Error creating the doc: ", err);
            });

          });




        });
      }
      else {
        alert("Attention, l'email ou le mot de passe est invalide.");
      }
    }
    else {
      alert("Attention, toutes les informations requises n'ont pas été complétées.")
    }
  }
  else if (radioValue.val() == 'hasAccount') {
    if ($('select#selectCreateClass').val() != '' && $('select#selectExistingStudent').val() != '' && $('select#selectFiliere').val() != '') {


      var newClass = $('select#selectCreateClass').val();
      var level = '';
      switch ($('select#selectFiliere').val()) {
        case '6ème':
          level = '6ème';
          break;
        case '5ème':
          level = '5ème';
          break;
        case '4ème':
          level = '4ème';
          break;
        case '3ème':
          level = '3EVOL';
          break;
        case 'Seconde générale et technologique':
          level = '2GEVOL';
          break;
        case 'Première générale':
          level = '1EVOL';
          break;
        case 'Terminale générale':
          level = 'TS_EVOL';
          break;
        case 'Première STMG':
          level = '1STMG_EVOL';
          break;
        case 'Terminale STMG':
          level = 'TSTMG_EVOL';
          break;
      }
      var newFiliere = $('select#selectFiliere').val();
      var matieres = [];

      $.ajax({
        type: 'GET',
        url: '../../assets/json/matieresList.json'
      }).then(function (data) {
        data.filieres.forEach(function (elem) {

          if (elem.nomFiliere == $('select#selectFiliere').val()) {
            elem.matieresGen.forEach(function (elemSubject) {
              matieres.push({ matiere: elemSubject, timeDone: 0, timeValidated: 0, totalTime: 0 });
            });
          }

        });

        $('select#selectSpe').val().forEach(function (elem) {

          matieres.push({ matiere: elem, timeDone: 0, timeValidated: 0, totalTime: 0 });
        });

        $('select#selectOpt').val().forEach(function (elem) {
          matieres.push({ matiere: elem, timeDone: 0, timeValidated: 0, totalTime: 0 });
        });


        firestore.collection('users').doc($('select#selectExistingStudent').val()).update({
          classe: level,
          realClasse: newClass,
          matieres: matieres,
          filiere: newFiliere
        }).then(function () {
          console.log("Document created");
          initStudentSelection();
          lookForWaitingStudents();
          clearCreateStudentForm();

          firestore.collection('users').doc(user.uid).collection('classes').doc(level).get()
            .then(function (docLevel) {

              if (docLevel.exists) {
                var arrayToPush = docLevel.data().matieres;
                var arrayToPushBis = docLevel.data().matieres;
                var collectionToCreate = [];


                matieres.forEach(function (elem) {
                  if (!docLevel.data().matieres.includes(elem.matiere)) {
                    arrayToPush.push(elem.matiere);
                    collectionToCreate.push(elem.matiere);
                  }
                });

                if (arrayToPush != arrayToPushBis) {
                  firestore.collection('users').doc(user.uid).collection('classes').doc(level).update({
                    matieres: arrayToPush
                  }).then(function () {
                    collectionToCreate.forEach(function (elem) {
                      firestore.collection('users').doc(user.uid).collection('classes').doc(level).collection(elem).doc('duration').set({
                        duration: 0
                      }).then(function () {
                        console.log("DONE");
                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                    });
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });
                }
              }
              else {
                var arrayToPush = [];
                matieres.forEach(function (elem) {
                  arrayToPush.push(elem.matiere);
                });

                firestore.collection('users').doc(user.uid).collection('classes').doc(level).set({
                  matieres: arrayToPush
                }).then(function () {

                  arrayToPush.forEach(function (elemSubject) {
                    firestore.collection('users').doc(user.uid).collection('classes').doc(level).collection(elemSubject).doc('duration').set({
                      duration: 0
                    }).then(function () {
                      console.log("Document created for subject :: ", elemSubject);
                    }).catch(function (err) {
                      console.log("Error: ", err);
                    });

                  });

                }).catch(function (err) {
                  console.log("Error: ", err);
                });
              }



            }).catch(function (err) {
              console.log("Error: ", err);
            });

        }).catch(function (err) {
          console.log("Error creating the doc: ", err);
        });

      });






    }
    else {
      alert("Attention, toutes les informations requises n'ont pas été complétées.")
    }
  }




});

$('#btnCreateClass').on('click', function () {
  var user = auth.currentUser;
  if (document.getElementById('createClassName').value != '') {
    //Do

    firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc(document.getElementById('createClassName').value).get()
      .then(function (doc) {

        if (doc.exists) {
          alert('Attention, cette classe existe déjà.');
        }
        else {
          firestore.collection('users').doc(user.uid).collection('classesHackschooling').doc(document.getElementById('createClassName').value)
            .set({
              nomClasse: document.getElementById('createClassName').value,
              students: []
            }).then(function () {
              console.log("Class has been created.");
              document.getElementById('createClassName').value = '';
              initClassList();
              initClassSelection();
            }).catch(function (err) {
              console.log("Error: ", err);
            });
        }

      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    alert('Veuillez renseigner un nom de classe.');
  }
});

function initClassSelection() {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).collection('classesHackschooling').get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        document.getElementById('selectCreateClass').selectize.addOption({ value: doc.id, text: doc.id })
        var $select = $('select#selectCreateClass').selectize();
        var control = $select[0].selectize;
        control.clear();


      });
    }).catch(function (err) {
      console.log("Error: ", err);
    });

}

function setForm(value) {
  if (value == '1') {
    document.getElementById('existingStudentForm').style.display = 'block';
    document.getElementById('newStudentForm').style.display = 'none';
  }
  else if (value == '2') {
    document.getElementById('existingStudentForm').style.display = 'none';
    document.getElementById('newStudentForm').style.display = 'block';
  }
}


function setPageModules(moduleValue) {
  switch (moduleValue) {
    case 'addClass':
      document.getElementById('classCreation').style.display = "block";
      document.getElementById('studentModification').style.display = 'none';
      document.getElementById('teacherModification').style.display = 'none';
      document.getElementById('createSubject').style.display = 'none';
      document.getElementById('affectStudent').style.display = 'none';
      document.getElementById('teacherAffectation').style.display = 'none';



      break;
    case 'subjectStudent':
      document.getElementById('classCreation').style.display = "none";
      document.getElementById('studentModification').style.display = 'block';
      document.getElementById('teacherModification').style.display = 'none';
      document.getElementById('createSubject').style.display = 'none';
      document.getElementById('affectStudent').style.display = 'none';
      document.getElementById('teacherAffectation').style.display = 'none';



      break;
    case 'subjectTeacher':
      document.getElementById('classCreation').style.display = "none";
      document.getElementById('studentModification').style.display = 'none';
      document.getElementById('teacherModification').style.display = 'block';
      document.getElementById('createSubject').style.display = 'none';
      document.getElementById('affectStudent').style.display = 'none';
      document.getElementById('teacherAffectation').style.display = 'none';



      break;
    case 'createSubject':
      document.getElementById('classCreation').style.display = "none";
      document.getElementById('studentModification').style.display = 'none';
      document.getElementById('teacherModification').style.display = 'none';
      document.getElementById('createSubject').style.display = 'block';
      document.getElementById('affectStudent').style.display = 'none';
      document.getElementById('teacherAffectation').style.display = 'none';


      initFiliereSelect();
      break;
    case 'affectStudent':
      document.getElementById('classCreation').style.display = "none";
      document.getElementById('studentModification').style.display = 'none';
      document.getElementById('teacherModification').style.display = 'none';
      document.getElementById('createSubject').style.display = 'none';
      document.getElementById('affectStudent').style.display = 'block';
      document.getElementById('teacherAffectation').style.display = 'none';


      break;
    case 'affectTeacher':
      document.getElementById('classCreation').style.display = "none";
      document.getElementById('studentModification').style.display = 'none';
      document.getElementById('teacherModification').style.display = 'none';
      document.getElementById('createSubject').style.display = 'none';
      document.getElementById('affectStudent').style.display = 'none';
      document.getElementById('teacherAffectation').style.display = 'block';


  }
}

function initStudentSelection() {
  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get().then(function (docAdmin) {


    firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', docAdmin.data().instituteName).get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (docStudent) {
          if (docStudent.data().soutien != true) {
            if (docStudent.data().realClasse == undefined) {
              console.log(docStudent.data().firstName + ' ' + docStudent.data().lastName);
              document.getElementById('selectExistingStudent').selectize.addOption({ value: docStudent.id, text: docStudent.data().firstName + ' ' + docStudent.data().lastName });
              var $select = $('select#selectExistingStudent').selectize();
              var control = $select[0].selectize;
              control.clear();
            }
          }
        })
      }).catch(function (err) {
        console.log("Error : ", err);
      })



  }).catch(function (err) {
    console.log("Error: ", err);
  });

}

function initFiliereSelect() {
  var arrayOfSubject = [];
  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {
    data.filieres.forEach(function (elem) {
      console.log(elem.nomFiliere);
      if (elem.nomFiliere != 'total') {
        document.getElementById('selectModifyFiliere').selectize.addOption({ value: elem.nomFiliere, text: elem.nomFiliere })
        var $select = $('select#selectModifyFiliere').selectize();
        var control = $select[0].selectize;
        control.clear();

      }

    });

    console.log(arrayOfSubject);




  });
}

$('#createSubjectForm').on('submit', function (ev) {
  ev.preventDefault()
  console.log('SUBMITTED');

  /* Test écriture json */
  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {

    var myArray = data;
    console.log(myArray);

    myArray.filieres.forEach(function (elem) {
      if (elem.nomFiliere == 'total') {
        elem.matieresGen.push(document.getElementById('subjectName').value);
      }
      else if (elem.nomFiliere == $('select#selectModifyFiliere').val()) {
        elem.matieresSpe.push(document.getElementById('subjectName').value);
      }
    });

    console.log(myArray);
    $.ajax({
      type: "POST",
      url: "Writejson.php",
      data: {
        json: JSON.stringify(myArray)
      }
    }).then(function () {
      document.getElementById('subjectName').value = '';

    });
  });





  /*  */

});

$('select#selectClass').on('change', function () {

  matieresSection.innerHTML = '';
  console.log("Changed");
  var user = auth.currentUser;
  selectedStudent.selectize.clearOptions();
  var $select = $('select#selectStudent').selectize();
  var control = $select[0].selectize;
  control.clear();

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {


      firestore.collection('users').where("classe", "==", $('select#selectClass').val()).where("userCategory", "==", "student").get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {

            if (!docUser.data().dev) {
              if (!docUser.data().testAccounts.includes(doc.id)) {
                selectedStudent.selectize.addOption({ value: doc.data().id, text: doc.data().firstName + " " + doc.data().lastName });
                control.clear();
              }
            }
            else {
              selectedStudent.selectize.addOption({ value: doc.data().id, text: doc.data().firstName + " " + doc.data().lastName });
              control.clear();
            }


          });
        }).catch(function (err) {
          console.log("Error :", err);
        });
      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
        .then(function (doc) {
          //Now we go into json
          $.ajax({
            type: 'GET',
            url: '../../assets/json/matieresList.json'
          }).then(function (data) {
            // alert("ICI");
            data.filieres.forEach(function (elem) {
              if (elem.nomFiliere == doc.data().filiere) {
                // alert("HEY");
                elem.matieresGen.forEach(function (elemSubject) {
                  matieresSection.innerHTML += '<div class="checkbox"><input type="checkbox"name="matieresStudent" val="' + elemSubject + '"  id="' + elemSubject + '_Student" class="switchery"><label for="' + elemSubject + '"> &nbsp' + elemSubject + '</label></div>';
                });
                elem.matieresSpe.forEach(function (elemSubject) {
                  matieresSection.innerHTML += '<div class="checkbox"><input type="checkbox"name="matieresStudent" val="' + elemSubject + '"  id="' + elemSubject + '_Student" class="switchery"><label for="' + elemSubject + '"> &nbsp' + elemSubject + '</label></div>';
                });
                var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresStudent"]'));
                elems.forEach(function (html) {
                  var switchery = new Switchery(html);
                });
              }

            });

            // for (var i = 0; i < data.filieres[0].matieres.length; i++) {
            //   // console.log(data.filieres[0].matieres[i]);
            //   matieresSection.innerHTML += "<div class='checkbox'><input type='checkbox'name='matieresStudent' val='" + data.filieres[0].matieres[i] + "'  id='" + data.filieres[0].matieres[i] + "_Student' class='switchery'><label for='" + data.filieres[0].matieres[i] + "'> &nbsp" + data.filieres[0].matieres[i] + "</label></div>";
            // }
            // var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresStudent"]'));
            // elems.forEach(function (html) {
            //   var switchery = new Switchery(html);
            // });
          });
          //We then check every matieres already present in class document    
        }).catch(function (err) {
          console.log("Error :", err);
        });



    }).catch(function (err) {
      console.log("Error: ", err);
    });




});

$('select#selectFiliere').on('change', function () {
  console.log("GOOD TO INIT");
  initSubjectSelection();
});

function initSubjectSelection() {
  // listeMatieres.innerHTML = '';

  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {
    data.filieres.forEach(function (elem) {
      if (elem.nomFiliere == $('select#selectFiliere').val()) {
        elem.matieresGen.forEach(function (elemSubject) {
          // listeMatieres.innerHTML += '<div class="checkbox"><input type="checkbox"name="matieresListe" val="' + elemSubject + '"  id="' + elemSubject + '_Student" class="switchery"><label for="' + elemSubject + '"> &nbsp' + elemSubject + '</label></div>';

        });

        elem.matieresSpe.forEach(function (elemSubject) {
          document.getElementById('selectSpe').selectize.addOption({ value: elemSubject, text: elemSubject });
        });
        elem.matieresOpt.forEach(function (elemSubject) {
          document.getElementById('selectOpt').selectize.addOption({ value: elemSubject, text: elemSubject });
        });
        // var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresListe"]'));
        // elems.forEach(function (html) {
        //   var switchery = new Switchery(html);
        //   html.click();
        // });
      }

    });
  });
}

function initClassCreation() {
  // $.ajax({
  //   type: 'GET',
  //   url: '../../assets/json/filieres.json'
  // }).then(function (data) {
  //   data.filieres[0].matieres.forEach(function (elem) {

  //     listeMatieres.innerHTML += "<div class='checkbox'><input type='checkbox'name='matieresListe' val='" + elem + "'  id='" + elem + "_Student' class='switchery'><label for='" + elem + "'> &nbsp" + elem + "</label></div>";
  //   });
  //   var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresListe"]'));
  //   elems.forEach(function (html) {
  //     var switchery = new Switchery(html);
  //   });
  // });

  var arrayOfSubject = [];
  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {
    data.filieres.forEach(function (elem) {
      console.log(elem.nomFiliere);
      if (elem.nomFiliere != 'total') {
        document.getElementById('selectFiliere').selectize.addOption({ value: elem.nomFiliere, text: elem.nomFiliere })
        var $select = $('select#selectFiliere').selectize();
        var control = $select[0].selectize;
        control.clear();

        for (var i = 0; i < elem.matieresGen.length; i++) {
          if (!arrayOfSubject.includes(elem.matieresGen[i])) {
            arrayOfSubject.push(elem.matieresGen[i]);
          }
        }
        for (var j = 0; j < elem.matieresSpe.length; j++) {
          if (!arrayOfSubject.includes(elem.matieresSpe[j])) {
            arrayOfSubject.push(elem.matieresSpe[j]);
          }
        }
        for (var k = 0; k < elem.matieresOpt.length; k++) {
          if (!arrayOfSubject.includes(elem.matieresOpt[k])) {
            arrayOfSubject.push(elem.matieresOpt[k]);
          }
        }
        // alert('d');
      }

      console.log(arrayOfSubject);

    });
  });
}


function setModifyClassList() {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).collection('classes').get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        selectedClass.selectize.addOption({ value: doc.data().nomClasse, text: doc.data().nomClasse });
        var $select = $('select#selectClass').selectize();
        var control = $select[0].selectize;
        control.clear();
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function setModifyTeacherList(instituteName) {
  var user = auth.currentUser;
  firestore.collection('users').where("userCategory", "==", "teacher").where("instituteName", "==", instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        selectedTeacher.selectize.addOption({ value: doc.id, text: doc.data().firstName + " " + doc.data().lastName })
        var $select = $('select#selectTeacher').selectize();
        var control = $select[0].selectize;
        control.clear();
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function clearForm() {
  nomClasse.value = "";

  //clear select
  var $select = $('select#selectFiliere').selectize();
  var control = $select[0].selectize;
  control.clear();
  // end clear select
  $('input[name="matieresListe"]:checked').click();
}


$('select#selectStudent').on('change', function () {
  var user = auth.currentUser;
  console.log("HEY :" + $('select#selectStudent').val());
  /*  $('input[name="matieresStudent"]:checked').each(function(i) {
    var ids = $('input[name="matieresStudent"]:checked')[i].id;
    // $('input[name="matieresStudent"]:checked')[i].click();
    $("[id='"+ids+"']").click();
    
    console.log(ids);
    console.log("we clear the way");
    
  }); */
  $('input[name="matieresStudent"]:checked').click();
  if ($('select#selectStudent').val() != '') {
    firestore.collection('users').doc($('select#selectStudent').val()).get()
      .then(function (doc) {
        if (doc.data().matieres != null) {
          console.log("YOU CAN GENERATE FROM STUDENT MAP");
          for (var i = 0; i < doc.data().matieres.length; i++) {
            $('[id="' + doc.data().matieres[i].matiere + '_Student"]').click();
          }
        } else {
          firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
            .then(function (doc) {
              for (var i = 0; i < doc.data().matieres.length; i++) {
                // console.log("Matieres : ",doc.data().matieres[i]);
                console.log("generated from class");
                $('[id="' + doc.data().matieres[i] + '_Student"]').click();
                // document.getElementById(doc.data().matieres[i]).click();
              }
            }).catch(function (err) {
              console.log("Error :", err);
            });
        }
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
});


$('select#selectTeacher').on('change', function () {





  var user = auth.currentUser;
  matieresSectionTeacher.innerHTML = '';
  $.ajax({
    type: 'GET',
    url: '../../assets/json/matieresList.json'
  }).then(function (data) {
    data.filieres[0].matieresGen.forEach(function (elem) {
      matieresSectionTeacher.innerHTML += "<div class='checkbox'><input type='checkbox' val='" + elem + "' id='" + elem + "_Teacher' name='matieresTeacher' class='switchery'><label for='" + elem + "'> &nbsp" + elem + "</label></div>";
    });
    var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresTeacher"]'));
    elems.forEach(function (html) {
      var switchery = new Switchery(html);
    });
    console.log("Should enter loop");
    firestore.collection('users').doc($('select#selectTeacher').val()).get()
      .then(function (doc) {
        console.log("entered query");
        doc.data().matieres.forEach(function (elem) {
          console.log("HEY ", elem);
          $("[id='" + elem + "_Teacher']").click();
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  });
});
$('#modifyTeacherForm').submit(function (ev) {
  ev.preventDefault();
  var user = auth.currentUser;
  var val = [];
  var teacherMatieres = [];


  $('input[name="matieresTeacher"]:checked').each(function (i) {
    val[i] = $(this).attr('val');
    console.log("VAL :" + val[i]);
  });

  firestore.collection('users').doc($('select#selectTeacher').val())
    .set({
      matieres: val
    }, {
      merge: true
    }).catch(function (err) {
      console.log("Error :", err);
    });

  swal({
    title: "Modification terminée !",
    text: "Les matières ont bien été ajoutées au professeur.",
    type: "success",
    html: true,
    showCancelButton: false,
    /* confirmButtonColor: "#ffde59",
    confirmButtonText: "Ajouter un utilisateur", */
    /* cancelButtonColor:"#ffde59",
    cancelButtonText: "Fermer", */
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    if (isConfirm) {
      $('input[name="matieresTeacher"]:checked').click();
      var $select = $('select#selectTeacher').selectize();
      var control = $select[0].selectize;
      control.clear();
    }
  });

});

$('#modifyClassForm').submit(function (ev) {
  var user = auth.currentUser;
  ev.preventDefault();
  var val = [];
  var val2 = [];
  var matieresToBeAdded = [];
  var notExistingMatieres = [];
  var fbClassMatieres = [];
  var fbStudentMatieres = [];
  var fbStudentMatieresLabels = [];
  var collectionToCreate = [];
  var fbMatieres = []
  $('input[name="matieresStudent"]:checked').each(function (i) {
    val[i] = { matiere: $(this).attr('val'), timeDone: 0, timeValidated: 0 };
    val2[i] = $(this).attr('val');

  });

  firestore.collection('users').doc($('select#selectStudent').val()).get()
    .then(function (doc) {

      if (doc.data().matieres != undefined) {
        doc.data().matieres.forEach(function (elem) {
          fbStudentMatieres.push(elem); // We copy the array obtained from user doc to use it later
          fbStudentMatieresLabels.push(elem.matiere); //We copy all matieres labels to make the comparison easier
        });

        //We have to check for case 1, case 2 or case 3

        if (val2.length > fbStudentMatieres.length) //Case 1 : We add 1 or more fields
        {
          val2.forEach(function (elem) {
            if (!fbStudentMatieresLabels.includes(elem)) {
              fbStudentMatieres.push({ matiere: elem, timeDone: 0, timeValidated: 0 });
            }
          });
        }
        else if (val2.length < fbStudentMatieres.length) //Case 2 : We remove 1 or more fields
        {
          fbStudentMatieres.forEach(function (elem) {
            if (!val2.includes(elem.matiere)) {
              fbStudentMatieres = fbStudentMatieres.filter(function (value) {
                return value !== elem;
              });
            }
          });

        }
        else if (val2.length == fbStudentMatieres.length) // Case 3 : We might have replaced 1 or more fields with another/others
        {
          val2.forEach(function (elem) {
            if (!fbStudentMatieresLabels.includes(elem)) {
              fbStudentMatieres.push({ matiere: elem, timeDone: 0, timeValidated: 0 });
            }
          });

          fbStudentMatieres.forEach(function (elem) {
            if (!val2.includes(elem.matiere)) {
              fbStudentMatieres = fbStudentMatieres.filter(function (value) {
                return value !== elem;
              });
            }
          });

        }

        console.log(fbStudentMatieres);

        firestore.collection('users').doc($('select#selectStudent').val())
          .set({
            matieres: fbStudentMatieres
          },
            {
              merge: true
            }).then(function () {
              console.log("Class added on student's document");
            }).catch(function (err) {
              console.log("Error writing : ", err);
            });
      } else if (doc.data().matieres == undefined || doc.data().matieres == '') {
        console.log("doc doesn't exist yet");
        firestore.collection('users').doc($('select#selectStudent').val())
          .set({
            matieres: val
          },
            {
              merge: true
            }).then(function () {
              console.log("Student didn't have matiere array in his doc but now he does");
            }).catch(function (err) {
              console.log("Error :", err);
            });
      }


    }).catch(function (err) {
      console.log("Error :", err);
    });



  // ICI


  //Check in firebase is collection already exists

  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
    .then(function (doc) {
      fbClassMatieres = doc.data().matieres;
      val2.forEach(function (elem) {
        if (!fbClassMatieres.includes(elem)) {
          fbClassMatieres.push(elem);
          collectionToCreate.push(elem);
        }
      });
      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val())
        .update({
          matieres: fbClassMatieres
        }).catch(function (er) {
          console.log("Error while updating : ", er);
        });
      collectionToCreate.forEach(function (elem) {
        firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection(elem).doc('duration')
          .set({
            duration: 0
          }).then(function () {
            console.log("Collections created");
          }).catch(function (err) {
            console.log("Error : ", err);
          });
      });

      console.log("Look here NOW " + collectionToCreate);
    }).catch(function (err) {
      console.log("Error :", err);
    });


  /* 
  
  
  
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
  .then(function(doc) {
    
    fbMatieres = doc.data().matieres;
    // console.log(fbMatieres);
    
    for(var i = 0 ; i<val2.length; i++)
    {
      if(!doc.data().matieres.includes(val2[i]))
      {
        fbMatieres.push(val2[i]);
        notExistingMatieres.push(val2[i]);
      }
    }
    // fbMatieres.push(notExistingMatieres);
    
    console.log(notExistingMatieres);
    console.log(fbMatieres);
    
    firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val())
    .update({
      matieres: fbMatieres
      
    }).catch(function(err) {
      console.log("Error updating array :", err);
    });
    
    for(var i = 0; i<notExistingMatieres.length; i++)
    {
      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection(notExistingMatieres[i]).doc("duration")
      .set({
        nbOfHours : 0
      }).then(function() {
        
      });
    }
    
  }).catch(function(err) {
    console.log("Error: ", err);
  }); */


  //

  swal({
    title: "Modification terminée !",
    text: "Les matières ont bien été ajoutées à l'élève.",
    type: "success",
    html: true,
    showCancelButton: false,
    /* confirmButtonColor: "#ffde59",
    confirmButtonText: "Ajouter un utilisateur", */
    /* cancelButtonColor:"#ffde59",
    cancelButtonText: "Fermer", */
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    if (isConfirm) {
      $('input[name="matieresStudent"]:checked').click();
      var $select = $('select#selectStudent').selectize();
      var control = $select[0].selectize;
      control.clear();
    }
  });

  // console.log("ModifyClassForm submietted");
});

$('#createClassForm').submit(function (ev) {
  // console.log("////SUBMITTED");
  var user = auth.currentUser;
  ev.preventDefault();
  var val = [];

  $('input[name="matieresListe"]:checked').each(function (i) {
    val[i] = $(this).attr('val');
  });




  var query = firestore.collection('users').doc(user.uid).collection('classes').doc(nomClasse.value);
  query.set({
    nomClasse: nomClasse.value,
    filiere: $('select#selectFiliere').val(),
    matieres: val


  }).then(function () {
    for (var i = 0; i < val.length; i++) {
      console.log("AAAA");
      query.collection(val[i]).doc('duration').set({
        nbOfHours: 0
      });
    }
    console.log("Class added");
    clearForm();
    swal({
      title: "Classe bien ajoutée !",
      /* text: "En cas d'erreur sur les informations indiquées, vous pourrez toujours les modifier plus tard.", */
      type: "success",
      html: true,
      showCancelButton: true,
      confirmButtonColor: "#ffde59",
      confirmButtonText: "Ajouter un élève / professeur",
      cancelButtonText: "Rester sur cette page",
      closeOnConfirm: false,
      closeOnCancel: true
    }, function (isConfirm) {
      if (isConfirm) {
        window.location.href = "create-user.php?target=addUser";

      }
    });
  }).catch(function (err) {
    console.log("Error :", err);
  })

  console.log(selectedFiliere.value);
});


// $("input[name='newEventType']:checked").val()