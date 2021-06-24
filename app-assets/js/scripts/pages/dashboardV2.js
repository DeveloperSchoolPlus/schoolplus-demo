// firebaseConfig for SchoolPlus Prod

var firebaseConfig = {

  apiKey: "AIzaSyDyC4t8wIotI9PFDVd5AACXUaw3y60h7Wk",

  authDomain: "schoolplus-prod.firebaseapp.com",

  databaseURL: "https://schoolplus-prod.firebaseio.com",

  projectId: "schoolplus-prod",

  storageBucket: "schoolplus-prod.appspot.com",

  messagingSenderId: "991751441024",

  appId: "1:991751441024:web:bd135bd34e706797"

};

// firebaseConfig for SchoolPlus Dev
// var firebaseConfig = {
//   apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
//   authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
//   databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
//   projectId: "schoolplus-dev-e8a2d",
//   storageBucket: "schoolplus-dev-e8a2d.appspot.com",
//   messagingSenderId: "330523876306",
//   appId: "1:330523876306:web:cbdcee87b7e3e007"
// };
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

const settings = {/* your settings... */ timestampsInSnapshots: true };

firestore.settings(settings);

const auth = firebase.auth();



//HTML VARIABLES

const username = document.getElementById('username');

const profilPicUser = document.getElementById('profilepic');

const userFirstName = document.getElementById('firstname');

const userLastName = document.getElementById('lastname');

const userPhone = document.getElementById('phoneNumber');

const userEmail = document.getElementById('email');

const modalUserPic = document.getElementById('modalUserPic');

const modalUserName = document.getElementById('modalUserName');

const modalUserCategory = document.getElementById('modalUserCategory');

const navMenu = document.getElementById('main-menu-navigation');

const rightMenu = document.getElementById('rightMenu');

const linkMesCours = document.getElementById('linkMesCours');
const linkCalendar = document.getElementById('linkCalendar');
const linkBilan = document.getElementById('linkBilan');
const linkPlanningExtra = document.getElementById('linkPlanningExtra');
const linkContact = document.getElementById('linkContact');

var myIndex = 0;
var devoirsCount = 0;

// $('#carouselExampleSlidesOnly').carousel({
//   interval: 500
// });

// $(document).ready(function() {
//   //Set the carousel options
//   $('.autoplay').slick({
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 1000,
//   });
// });


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

        // setUserNavBAr(doc.data().userCategory);
        // $('#modalDevoirsAF').modal();


        getUserInfo();

        // getUserNotif();

        initUserDashboard(doc.data().userCategory);

        // initUserCards();

        // initBilan(user.uid);


        setUserInterface(doc.data().userCategory);



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
  localStorage.removeItem('data');
  localStorage.removeItem('dataSubjects');

  firebase.auth().signOut().then(function () {
    location.href = "../../pages/fr/login.php";

  });

  // if (language == "english")

  // location.href = "../../pages/en/login.php";

  // else


});

function initUserDashboard(userCategory) {
  console.log("init dashboard");
  console.log(userCategory);
  switch (userCategory) {
    case 'admin':
      document.getElementById('adminDashboard').style.display = 'block';
      document.getElementById('formateurDashboard').style.display = 'none';
      document.getElementById('auteurDashboard').style.display = 'none';
      document.getElementById('studentDashboard').style.display = 'none';
      break;
    case 'teacher':
      console.log("formateur dashboard");
      document.getElementById('adminDashboard').style.display = 'none';
      document.getElementById('formateurDashboard').style.display = 'block';
      document.getElementById('auteurDashboard').style.display = 'none';
      document.getElementById('studentDashboard').style.display = 'none';
      break;
    case 'author':
      console.log("auteur dashboard");
      document.getElementById('adminDashboard').style.display = 'none';
      document.getElementById('formateurDashboard').style.display = 'none';
      document.getElementById('auteurDashboard').style.display = 'block';
      document.getElementById('studentDashboard').style.display = 'none';
      break;
    case 'student':
      console.log("apprenant dashboard");
      document.getElementById('adminDashboard').style.display = 'none';
      document.getElementById('formateurDashboard').style.display = 'none';
      document.getElementById('auteurDashboard').style.display = 'none';
      document.getElementById('studentDashboard').style.display = 'block';
      break;

  }

}

function downloadSubject(subjectUrl) {

  firebase.storage().ref(subjectUrl).getDownloadURL().then(function (url) {
    window.open(url, '_blank');
  }).catch(function (err) {
    console.log("Error: ", err);
    alert("Erreur, le fichier n'a pas pu être téléchargé. Veuillez vérifier que le sujet est bien présent sur la plateforme.");
  })
}

//Fonction permettant de générer les liens dans les cards du dashboard
function setUserLinks(userCategory) {

 /*  switch (userCategory) {
    case 'student':
      document.getElementById('linkMesCoursStud').href = 'planning.php';
      document.getElementById('linkPlanningExtraStud').href = 'select-modules.php';
      linkBilan.href = 'mon-bulletin.php';
      linkPlanningExtra.href = 'mon-planning-extra.php';
      linkContact.href = 'mes-profs.php';
      break;
    case 'parent':
      linkMesCours.href = 'mes-cours-eleveV2.php';
      linkCalendar.href = '#';
      linkBilan.href = 'mon-bulletin.php';
      linkPlanningExtra.href = 'mon-planning-extra.php';
      linkContact.href = 'mes-profs.php';
      break;
    case 'teacher':
      linkMesCours.href = 'contenu-cours.php';
      linkCalendar.href = 'dashboard-soutien.php';
      linkBilan.href = 'bilan-soutien.php';
      linkContact.href = 'mes-eleves.php';
      linkPlanningExtra.href = 'create-formation.php';

      break;
    //case 'admin':
    //linkMesCours.href = 'contenu-cours-soutien.php';
    //linkCalendar.href = 'dashboard-soutien.php';
    //linkBilan.href = 'bilan-soutien.php';
    //linkPlanningExtra.href = 'dashboard-soutien.php';
    //linkContact.href = 'mon-bulletin-soutien.php';
    //break;
  } */

}


function foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif) {

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
                // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = elem.note;
                indexHTML++;
                index++;
                foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
              } else {
                console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + userClasse + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  /* ICI */
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
                  console.log(matiere[indexOfFoo] + " - " + chapitres[index]);
                  /* Devoirs non corriges */
                  var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + userClasse + '_' + newNumeroChapitre + '.pdf';
                  var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
                  var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + sujetEvalUrl + '">Voir le sujet</button></td></tr>';

                  var totalTable = table1 + table2;


                  document.getElementById('devoirsTable').innerHTML += totalTable;
                  document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px" id="' + sujetEvalUrl + '">' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</p></div>'
                  myIndex++;
                  devoirsCount++;
                  document.getElementById('devoirsCount').innerText = '(' + devoirsCount + ')';
                  console.log("myIndex Value : ", myIndex);
                  /*  */
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                });
              }
            } else {
              console.log("La note est un nombre, on peut donc afficher, calculer et passer au prochain chapter");
              // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = elem.note;
              accumulMatiere += elem.note;
              effectifMatiere++;
              indexHTML++;
              index++;
              foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
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
            // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          }).catch(function (err) {
            //The subject is present + student's eval doesn't exist so we assume its AF
            console.log("The subject is present + student's eval doesn't exist so we assume its AF");
            /* ICI */
            console.log(matiere[indexOfFoo] + " - " + chapitres[index]);
            /* Devoirs non corriges */
            var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
            var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + sujetEvalUrl + '">Voir le sujet</button></td></tr>';

            var totalTable = table1 + table2;

            document.getElementById('devoirsTable').innerHTML += totalTable;
            document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px" id="' + sujetEvalUrl + '">' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</p></div>'
            myIndex++;
            devoirsCount++;
            document.getElementById('devoirsCount').innerText = '(' + devoirsCount + ')';
            console.log("myIndex Value : ", myIndex);
            /*  */
            // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          });


        }).catch(function (err) {
          //the eval is not present we can pass
          console.log("Notes array is undefined + the eval hasn't been posted so NO EVAL we pass");
          index++;
          foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
        });

      }
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
                    // document.getElementById(matiere[indexOfFoo] + 'Impli' + indexHTMLImplication).innerText = elemImpli;
                    indexHTMLImplication++;
                    accumulMatiere += elemImpli;
                    effectifMatiere++;
                  }
                });
              }
            }

          });



          indexOfFoo++;
          foo(matiere, idAdmin, idUser, userFirstName, userLastName, userClasse, indexOfFoo, 1, generalAccumul, generalEffectif);
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }
  }
  else {
    console.log("No chapter for ", matiere[indexOfFoo]);
    indexOfFoo++;
    foo(matiere, idAdmin, idUser, userFirstName, userLastName, userClasse, indexOfFoo, 1, generalAccumul, generalEffectif);
  }
}


function foo(matieres, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexHTML, generalAccumul, generalEffectif) {

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
        foo2(matieres, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, 0, index, indexHTML, 0, 0, generalAccumul, generalEffectif);
      }).catch(function (err) {
        console.log("Error: ", err);
      });
  }
  else {
    //Now we calculate and print the generalMean if effectifGeneral > 0

    // document.getElementById('messageBulletin').style.display = 'none';
    // document.getElementById('messageBulletin2').style.display = 'block';

    // $('#selectClass')[0].selectize.enable();
    // $('#selectStudent')[0].selectize.enable();
    document.getElementById('loadingDevoirsAF').style.display = 'none';
    document.getElementById('messageLoading').style.display = 'none';
    document.getElementById('messageGood').style.display = 'block';

    console.log("done");
    initCarousel(myIndex);
    saveGlobalData();


  }
}

function saveGlobalData() {
  var arr = [];
  var arrSubjects = [];
  document.getElementsByName('slickElement').forEach(function (elem) {
    // console.log(elem);
    console.log(elem.id);
    console.log(elem.innerText);
    if (!arr.includes(elem.innerText)) {
      arr.push(elem.innerText);
    }
    if (!arrSubjects.includes(elem.id)) {
      console.log('WHAT WAS PUSHED :', elem.id);
      if (elem.id != ('')) {
        arrSubjects.push(elem.id);
      }
    }
  });
  console.log(arr);
  arr.sort();
  arrSubjects.sort();
  console.log(arr);
  console.log(arrSubjects);
  localStorage.setItem('data', arr);
  localStorage.setItem('dataSubjects', arrSubjects);

  // test();
}


function initCarousel(index) {
  //Set the carousel options

  document.getElementById('evalSliderHeader').style.display = 'none';
  document.getElementById('evalSlider').style.display = 'block';
  document.getElementById('evalSliderHeader2').style.display = 'block';


  var numberToDisplay = 0;
  if (devoirsCount > 2) {
    numberToDisplay = 3;
  }
  else if (devoirsCount == 0) {
    document.getElementById('evalSlider').innerHTML = '<div><p name="slickElement" style="margin-bottom:0px">Vous n\'avez aucun devoir en attente.</p></div>';
    numberToDisplay = 1;
  }
  else {
    numberToDisplay = devoirsCount;
  }

  $('.autoplay').slick({
    slidesToShow: numberToDisplay,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  });
  console.log(index);
}

function initBilan(idUser) {

  var data = localStorage.getItem('data');
  var dataSubjects = localStorage.getItem('dataSubjects');
  // console.log(dataSubjects);

  console.log("DATA : ", data);
  console.log("DATASUBJECTS: ", dataSubjects);

  if (data == null || dataSubjects == null) {
    console.log("Both data and dataSubjects are empty. We call initBilan and other functions");


    document.getElementById('loadingDevoirsAF').style.display = 'block';
    document.getElementById('messageLoading').style.display = 'block';
    document.getElementById('messageGood').style.display = 'none';

    // $('#selectClass')[0].selectize.disable();
    // $('#selectStudent')[0].selectize.disable();


    // document.getElementById('selectStudent').disabled = true;
    // document.getElementById('messageBulletin').style.display = 'block';
    // document.getElementById('messageBulletin2').style.display = 'none';

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

          // document.getElementById('tableBilan').innerHTML += table;
          // document.getElementById('tableImplication').innerHTML += tableImpli;

          if (elem.notesImplication != undefined) {
            // console.log("Matière: "+elem.matiere + " Note implication: ", elem.notesImplication);
          }


          myArray.push(elem.matiere);
        });

        foo(myArray, docUser.data().idAdmin, docUser.id, docUser.data().firstName, docUser.data().lastName, docUser.data().classe, 0, 1, 0, 0);

        var moyenneGenerale = 0;
        var totalGeneral = 0;
        var nbGenerale = 0;

        var arr = [];

      }).catch(function (err) {
        console.log('Error :', err);
      });
  } else {
    console.log("One of the localStorage variable is not empty");
    // alert('not empty');
    initSliderAndTable(data, dataSubjects);
  }
}

function initSliderAndTable(data, dataSubjects) {
  // console.log(data);
  // console.log(dataSubjects);

  document.getElementById('evalSliderHeader').style.display = 'none';
  document.getElementById('evalSlider').style.display = 'block';
  document.getElementById('evalSliderHeader2').style.display = 'block';

  var count = 0;
  var numberToDisplay = 0;
  var arr = data.split(',');
  var arrSubj = dataSubjects.split(',');

  //Build the slider + Build the table
  for (var i = 0; i < arr.length; i++) {
    document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">' + arr[i] + '</p></div>';
    count++;
    var table1 = '<tr><td>' + arr[i] + '</td>';
    var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="' + arrSubj[i] + '">Voir le sujet</button></td></tr>';

    var totalTable = table1 + table2;
    document.getElementById('devoirsTable').innerHTML += totalTable;

  }
  document.getElementById('devoirsCount').innerText = '(' + arr.length + ')';

  //Conditions to set the number of slide to display at the same time
  if (arr.length > 2) {
    numberToDisplay = 3;
  }
  else if (arr.length == 0) {
    document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">Vous n\'avez aucun devoir en attente.</p></div>';
    numberToDisplay = 1;
  }
  else {
    numberToDisplay = arr.length;
  }
  //End

  //Slider Init
  $('.autoplay').slick({
    slidesToShow: numberToDisplay,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  });
  //End

}

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

    setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');
    setUserLinks(doc.data().userCategory);


    if (doc.data().firstName = "" || doc.data().firstName == null) {

      userName = user.email

      if (userName.includes('@')) {

        var splitUserName = userName.split('@');

        userName = splitUserName[0];

      }

    } else {

      userName = doc.data().firstName;

    }//ZC57kLf1XpUOXh9QJUNDKS2pMgg1





    // manuelLink.setAttribute("href", doc.data().manuel);

    username.innerHTML = "<b id='userFirstName'>" + userName + "</b>";

    var childName = 'profile_pictures/' + user.uid;

    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {

      profilPicUser.src = avatarUrl;

    }).catch((err) => {

      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";

    });







  }).catch(function (err) {

    console.log('Error displaying user info: ', err);

  });



}

function openModal(modal) {
  $('#'+modal).modal();
}

function setUserInterface(userCategory, soutien, userId, instituteName) {

  if (soutien == true) {
    //VERY IMPORTANT : we assume teacher won't be present in the "soutien" version, therefore this case will not be dealed with
    switch (userCategory) {
      case 'student':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard-soutien.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Réserver un cours de soutien</span></a></li><li data-menu="dropdown" class="dropdown nav-item" style="display: none;"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleve-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Suivi de mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        document.getElementById('virtualClass').setAttribute('href', '#');


        break;
      case 'admin':
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu=""><a href="create-classes.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Classes</span></a></li>';
        var nav3 = '<li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';
        var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        var nav6 = '</ul></li>';
        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu=""><a href="create-user-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';
        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;
        // var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        // var right3 = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';
        var right4 = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';

        rightMenu.innerHTML =/*  right1 + */ right2 +/*  right3 +  */right4;
        break;

      case 'teacher':
        /*  var nav1 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
         var nav2 = '<li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
         var nav3 = '<li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
         var nav4 = '<li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>';
         var nav5 = '<li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';
         var nav6 = '</ul></li>'; */

        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion ESTIA</span></a>';
        var nav8 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboard-soutien.php" class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="contenu-cours-soutien.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Suivi des cours</span></a></li>';
        var nav10 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="bilan-soutien.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
        var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" ><i class="fab fa-chromecast"></i><span data-i18n="nav.dash.main">Salles de classe</span></a><ul class="dropdown-menu" id="virtualClassList"></ul></li>';
        var nav12 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" id="userVirtualRoom"target="_blank" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Rejoindre ma classe virtuelle</span></a></li>';
        navMenu.innerHTML =/*  nav1 + nav2 + nav3 + nav4 + nav5 + nav6 +  *//* nav7 + */ nav8 + nav9 + nav10 + nav11 + nav12;
        // rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        rightMenu.innerHTML = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
        rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

        setTeachersVirtualClasses(instituteName);


        break;

    }
  }
  else {
    switch (userCategory) {
      case 'student':
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="select-modules.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes modules</span></a></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning personel</span></a></li>';


   
        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5/*++ nav4bis + nav5 + nav6  nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';


        document.getElementById('rightMenu').innerHTML = right1;


        break;
      case 'parent':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php"  class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';


        document.getElementById('virtualClass').setAttribute('href', '#');
        break;
      case 'admin':
        console.log("here");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-user"></i><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-userV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="modify-userV2.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="modify-group.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes groupes d\'utilisateurs</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Mes formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-formation.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Consulter, ajouter ou éditer</span></a></li><li data-menu=""><a href="mes-outils.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-outils-scratch.php"  class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Bibliothèque</span></a></li>';
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 +  nav4bis + nav5 + nav6 /*+ nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Mes apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Mes organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3;
        break;
      case 'teacher':
        console.log("formateur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="planning.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Mes formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-formation.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Consulter, ajouter ou éditer</span></a></li><li data-menu=""><a href="mes-outils.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-outils-scratch.php"  class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Bibliothèque</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5;

        rightMenu.innerHTML = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        // rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        // setTeachersVirtualClasses(instituteName);
        break;
      case 'author':
        console.log("auteur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        // var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Contenu pédagogique</span></a><ul class="dropdown-menu"><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Création de contenu</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Vidéos</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Texte</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Questionnaire</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Enregistrement</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Contenu créé</span></a></li></ul></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer une nouvelle formation</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Formations en cours</span></a></li></ul></li>';
        // var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2/*  + nav3 + nav4 + nav5 */;

        rightMenu.innerHTML = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';

        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        // rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';

        // setTeachersVirtualClasses(instituteName);
        break;

    }
  }


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

  /* if(userCategory =="student")
  {
    console.log("hello");
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="teacher")
  {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="classe-virtuelle.php" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
  } else if(userCategory =="admin")
  {
    
    if(instituteCategory == "college" || instituteCategory == "lycee")
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-classes.php" class="nav-link"><i class="fas fa-graduation-cap"></i><span data-i18n="nav.dash.main">Créer une classe</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="contenu-cours.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
    } else if(instituteCategory == "soutien") 
    {
      navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="create-user.php" class="nav-link"><i class="fas fa-user-plus"></i><span data-i18n="nav.dash.main">Ajouter des utilisateurs</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';
    }
    
  } */
}



function setUserNavBAr(userCategory) {



  var user = auth.currentUser;

  /* if (user.uid == "ZC57kLf1XpUOXh9QJUNDKS2pMgg1") {
          //Zoé
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
  
        } else if(user.uid == "BTJJml8emCUEPESMXP83TSuZb3T2" ) { //
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
  
        } else if(user.uid == "aK6z19BqqebTTVkh3aDZJCJhXmF3") { //NOé
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
  
        } else if(user.uid == "yKjFJ4dQLsTQM9aaEf1DgqrToWM2") { //THOMAS
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
  
        } else if(user.uid == "wfsvR6T7NFO48NqI3VMyNAGgDIq1") { //TIMéO
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
        } else if(user.uid == "mvudqo88IDfKh80lf9mTxGUrnN23") { //TOTO1EVOL
          navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
  
        } else { */

  if (userCategory == 'student') {

    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li>';

    if (user.uid == "ZC57kLf1XpUOXh9QJUNDKS2pMgg1") {
      //Zoé
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';

    } else if (user.uid == "BTJJml8emCUEPESMXP83TSuZb3T2") {
      //SAM
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    } else if (user.uid == "aK6z19BqqebTTVkh3aDZJCJhXmF3") {
      //Noé
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';

    } else if (user.uid == "yKjFJ4dQLsTQM9aaEf1DgqrToWM2") {
      //Thomas
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    } else if (user.uid == "wfsvR6T7NFO48NqI3VMyNAGgDIq1") {
      //Timéo
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';
    } else if (user.uid == "mvudqo88IDfKh80lf9mTxGUrnN23") {
      //TOTO 1EVOL
      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';

    } else {

      navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>';



    }

    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';

    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';

    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';



    rightMenu.innerHTML = '<a href="#" class="dropdown-item" style="background:whitesmoke"><i class="fas fa-users"></i> Mes profs</a>';



  }

  else if (userCategory == 'admin') {

    var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';

    var nav2 = '<li data-menu=""><a href="create-classes.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Classes</span></a></li>';

    var nav3 = '<li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';

    var nav4 = '<li data-menu=""><a href="contenu-cours.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';

    var nav5 = '<li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li><li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>';

    var nav6 = '</ul></li>';



    var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';

    var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';

    var nav9 = '<li data-menu=""><a href="create-user-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Gestions utilisateurs</span></a></li>';

    var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';

    var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';



    navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5 + nav6 + nav7 + nav8 + nav9 + nav10 + nav11;



    var right1 = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';

    var right2 = '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';

    var right3 = '<a href="#" class="dropdown-item" style="background:whitesmoke"><i class="fas fa-users"></i> Mes profs</a>';

    var right4 = '<a href="mes-profs-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs - Soutien</a>';



    rightMenu.innerHTML = right1 + right2 + right3 + right4;

  }



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





function initUserCards() {



  var user = auth.currentUser;







  //First we query user's doc to get his class

  firestore.collection('users').doc(user.uid).get()

    .then(function (docUser) {



      if (docUser.data().userCategory == 'student') {

        //Now that we have the class we're gonna query every teacher belonging to the institution + in charge of the class



        // firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', docUser.data().instituteName).where('classe', 'array-contains', docUser.data().classe).get()
        // 
        //       .then(function(querySnapshot) {
        // 
        //         
        // 
        //         querySnapshot.forEach(function(docTeachers) {
        // 
        //           
        // 
        //           const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
        // 
        //           const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#/" id="';// complete name
        // 
        //           const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
        // 
        //           const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
        // 
        //           const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn bg-school-plus mb-1 mr-1 text-bold-600" id="mail_'; //id
        // 
        //           const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
        // 
        //           const listFollowingHtml6 = '</div></div></div></div>';
        // 
        //           
        // 
        //           var totalHTML = listFollowingHtml1 +docTeachers.id+ listFollowingHtml2 +docTeachers.id + listFollowingHtml3 + docTeachers.data().firstName + " " + docTeachers.data().lastName +listFollowngHtml+'Professeur'+ listFollowingHtml4 +docTeachers.id+ listFollowingHtml5 + listFollowingHtml6
        // 
        //           document.getElementById('list-following').innerHTML += totalHTML;
        // 
        //         });



        /*     firestore.collection('users').doc(docUser.data().idAdmin).get()
    
            .then(function(docAdmin) {
    
              
    
              const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id
    
              const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#" id="';// complete name
    
              const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location
    
              const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';
    
              const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn bg-school-plus mb-1 mr-1 text-bold-600" id="mail_'; //id
    
              const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id
    
              const listFollowingHtml6 = '</div></div></div></div>';
    
              
    
              var totalHTML = listFollowingHtml1 +docAdmin.id+ listFollowingHtml2 +docAdmin.id + listFollowingHtml3 + docAdmin.data().firstName + " " + docAdmin.data().lastName +listFollowngHtml+"Chef d'établissement"+ listFollowingHtml4 +docAdmin.id+ listFollowingHtml5 + listFollowingHtml6
    
              document.getElementById('list-following').innerHTML += totalHTML;
    
              
    
              var avatars = document.getElementsByClassName('avatar-coach');
    
              var splitString;
    
              for (var i=0; i< avatars.length; i++) {
    
                splitString = avatars[i].id.split('_');
    
                // console.log(splitString);
    
                updatePictures(splitString[1]);
    
              }
    
              
    
            }).catch(function(err) {
    
              console.log("Error: ", err);
    
            }); */







        /* }).catch(function(err) {
  
          console.log("Error : ", err);
  
        }); */

      }

      else if (docUser.data().userCategory == 'admin') {
        document.getElementById('list-following').innerHTML = '';
        //Now that we have the class we're gonna query every teacher belonging to the institution + in charge of the class



        firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', docUser.data().instituteName).get()

          .then(function (querySnapshot) {



            querySnapshot.forEach(function (docTeachers) {



              if (docTeachers.data().soutien != true) {

                const listFollowingHtml1 = '<div class="col-xl-4 col-md-6 col-xs-12"><div class="card"><div class="text-xs-center"><div class="card-block"><img id="avatar_'; //id

                const listFollowingHtml2 = '" src="../../app-assets/images/logo/no_avatar.png" class="avatar-coach rounded-circle height-150 width-150" alt="User avatar"></div><div class="card-block"><h4 class="card-title"><a href="#" id="';// complete name

                const listFollowingHtml3 = '" onclick="displayUserInfo(this.id)">'; // location

                const listFollowngHtml = '</a></h4><h6 class="card-subtitle text-muted">';

                const listFollowingHtml4 = '</h6></div><div class="text-xs-center"><button style="margin-left: 1rem;"class="btn bg-school-plus mb-1 mr-1 text-bold-600" id="mail_'; //id

                const listFollowingHtml5 = '" onclick="sendMail(this.id)" ><i class="fas fa-envelope"></i> Contacter</button>'; //id

                const listFollowingHtml6 = '</div></div></div></div>';



                var totalHTML = listFollowingHtml1 + docTeachers.id + listFollowingHtml2 + docTeachers.id + listFollowingHtml3 + docTeachers.data().firstName + " " + docTeachers.data().lastName + listFollowngHtml + 'Professeur' + listFollowingHtml4 + docTeachers.id + listFollowingHtml5 + listFollowingHtml6

                document.getElementById('list-following').innerHTML += totalHTML;

              }



            });







            var avatars = document.getElementsByClassName('avatar-coach');

            var splitString;

            for (var i = 0; i < avatars.length; i++) {

              splitString = avatars[i].id.split('_');

              // console.log(splitString);

              updatePictures(splitString[1]);

            }



          }).catch(function (err) {

            console.log("Error: ", err);

          });



      }









    }).catch(function (err) {

      console.log("Error :", err);

    });





}



function updatePictures(userId) {



  var avatarId = "avatar_" + userId;

  childName = 'profile_pictures/' + userId;

  firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {

    var avatars = document.getElementById(avatarId);

    avatars.setAttribute("src", avatarUrl);

  }).catch((err) => {

  });



}



function displayUserInfo(userId) {



  var user = auth.currentUser;



  modalUserPic.src = "../../app-assets/images/logo/no_avatar.png"

  userFirstName.value = '';

  userLastName.value = '';

  userPhone.value = '';

  userEmail.value = '';

  modalUserName.innerText = '';

  modalUserCategory.innerText = '';



  firestore.collection('users').doc(userId).get()

    .then(function (docUser) {



      modalUserName.innerText = docUser.data().firstName + " " + docUser.data().lastName;

      userFirstName.value = docUser.data().firstName;

      userLastName.value = docUser.data().lastName;

      if (docUser.data().tel != undefined && docUser.data().tel != null) {

        userPhone.value = docUser.data().tel;

      }

      else {

        userPhone.value = '';

      }

      userEmail.value = docUser.data().email;



      switch (docUser.data().userCategory) {

        case 'student':

          modalUserCategory.innerText = 'Élève';

          break;

        case 'teacher':

          modalUserCategory.innerText = 'Professeur';

          break;

        case 'admin':

          modalUserCategory.innerText = "Chef d'établissement";

          break;

      }



      modalUserPic.src = document.getElementById('avatar_' + userId).src;





      $('#modalDisplayUser').modal();

    }).catch(function (err) {

      console.log("Error : ", err);

    });





}



function sendMail(userId) {



  var splitString = userId.split('_');

  var textSwalStorage = document.getElementById("textSwal");

  // console.log(userId+ ' /// '+splitString[1]);

  // pop-up to give some explanations

  firestore.collection('users').doc(splitString[1]).get()

    .then(doc => {



      document.getElementById('form-firstnameto1').value = doc.data().firstName;

      document.getElementById('form-recipient1').value = doc.data().email;

      document.getElementById('form-firstnamefrom1').value = document.getElementById('userFirstName').innerText;

      swal({

        title: "Envoyer un mail à " + doc.data().firstName + " " + doc.data().lastName,

        text: "<textarea id='contactMessage' class='form-control'  rows='4' maxlength='300' placeholder='Entrez votre message ici'></textarea>",

        html: true,

        showCancelButton: true

      }, function () {

        var theMessage = document.getElementById('contactMessage').value;

        if (theMessage == '' || theMessage == null || theMessage.length > 300) {

          setTimeout(() => {

            swal({

              title: "Message vide",

              text: "Vous ne pouvez pas envoyer de message vide.",

              type: "error",

              html: true

            });

          }, 1000);

        }

        else {

          var user = auth.currentUser;

          document.getElementById('form-message1').value = theMessage;

          document.getElementById('form-sender1').value = user.email;



          //uncomment to send email, add the discount code to the message

          document.getElementById('sendMailForm').submit();



          // put a notif to the user

          var newNotif = {

            date: Math.floor(Date.now() / 1000),

            icon: "icon-mail icon-bg-circle bg-cyan",

            viewed: false,

            title: { en: "New message", fr: "Nouveau message" },

            description: { en: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + doc.data().email + '</i>) to answer the message.', fr: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> vous a envoyé un message. Allez sur la boîte mail associée à votre compte (<i>' + doc.data().email + '</i>) pour lui répondre.' },

            url: "#"

          }



          firestore.collection('users').doc(splitString[1]).update({

            notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),

            newNotif: firebase.firestore.FieldValue.increment(1)

          })

            .then(() => {

              setTimeout(() => {

                swal({

                  title: "Message envoyé",

                  text: "Votre mail a bien été envoyé à <b>" + doc.data().firstName + " " + doc.data().lastName + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte School+",

                  type: "success",

                  html: true

                });

              }, 500);

            })

            .catch(err => {

              console.log('Error updating the recipient: ' + err);

            });





          /* text: "Votre mail a bien été envoyé à <b>" + doc.data().firstName + " " + doc.data().lastName + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte School+", */

          /*  // put a notif to the user
  
          var newNotif = {
  
            date:  Math.floor(Date.now() / 1000),
  
            icon: "icon-mail icon-bg-circle bg-cyan",
  
            viewed: false,
  
            title: {en: "New message", fr: "Nouveau message"},
  
            description: {en: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + doc.data().email + '</i>) to answer the message.', fr: '<b>' + document.getElementById('form-firstnamefrom1').value + '</b> vous a envoyé un message. Allez sur la boîte mail associée à votre compte (<i>' + doc.data().email + '</i>) pour lui répondre.'},
  
            url: "#"
  
          } */



          /*   firestore.collection('stact_users').doc(splitString[1]).update({
  
            notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
  
            newNotif: firebase.firestore.FieldValue.increment(1)
  
          })
  
          .then(() => {
  
            setTimeout(() => {
  
              swal({
  
                title: "Message envoyé",
  
                text: "Votre mail a bien été envoyé à <b>" + doc.data().firstname + " " + doc.data().lastname + "</b>. Il vous répondra directement sur l'adresse mail associée à votre compte STACT x BYTHEWAVE.",
  
                type: "success",
  
                html: true
  
              });
  
            }, 500);
  
          })
  
          .catch(err => {
  
            console.log('Error updating the recipient: ' + err);
  
          }); */

        }

      });



    })

    .catch(err => {

      console.log("Error getting the recipient: " + err);

    });

}