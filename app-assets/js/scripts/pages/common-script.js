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

var myIndex = 0;
var devoirsCount = 0;


function getStoredData() {
  var data =localStorage.getItem('data');
  var user = auth.currentUser;
  if(data == null)
  {
    initBilan(user.uid);
  }
  else
  {
    initSlider(data);
  }
  // console.log(data);
}

function initSlider(data) {
  console.log(data);

  document.getElementById('evalSliderHeader').style.display = 'none';
  document.getElementById('evalSlider').style.display = 'block';
  document.getElementById('evalSliderHeader2').style.display = 'block';

  var count = 0;
  var numberToDisplay = 0;
  var arr = data.split(',');
  for(var i = 0; i<arr.length; i++) {
    document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">'+arr[i]+'</p></div>';
    count++;
  }
  document.getElementById('devoirsCount').innerText = '('+arr.length+')';

  if(arr.length>2) 
  {
    numberToDisplay = 3;
  }
  else if(arr.length == 0)
  {
    document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">Vous n\'avez aucun devoir en attente.</p></div>';
    numberToDisplay = 1;
  }
  else
  {
    numberToDisplay = arr.length;
  }
  $('.autoplay').slick({
    slidesToShow: numberToDisplay,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1000,
  });

  
}

function foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif) {

  console.log(matiere[indexOfFoo]);
  // console.log(chapitres);
  var isPresent = false;


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
      console.log("1");
      if (notes[index] != undefined) {
        console.log("2");
        notes[index].forEach(function (elem) {
          console.log("3");
          if (elem.id == idUser) {
            isPresent = true;
            console.log("La note : ", elem.note);
            if (isNaN(elem.note)) {
              if (elem.note == "NN") {
                console.log("La note est NN, on peut donc afficher et faire le calcul");
                // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = elem.note;
                indexHTML++;
                index++;
                foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
              } else {
                console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + userClasse + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  /* ICI */
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
                  console.log(matiere[indexOfFoo] + " - " + chapitres[index]);
                  /* Devoirs non corriges */
                  var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + userClasse + '_' + newNumeroChapitre + '.pdf';
                  var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
                  var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="'+sujetEvalUrl+'">Voir le sujet</button></td></tr>';

                  var totalTable = table1 + table2;


                  // document.getElementById('devoirsTable').innerHTML += totalTable;
                  document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">'+matiere[indexOfFoo] + ' - ' + chapitres[index]+'</p></div>'
                  myIndex++;
                  devoirsCount++;
                  document.getElementById('devoirsCount').innerText = '('+devoirsCount+')';
                  console.log("myIndex Value : ",myIndex);
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
          } else {
            console.log("4");
            
          }
        });
        if(!isPresent) {
          console.log("La note n'est pas NN, c'est donc NaN ce qui signifie que l'éval est là mais on sait pas si AF ou ECC, on doit donc checker la copie de l'élève");
                var pdfURL = "devoirs_ecrits/" + idAdmin + "_" + fullName + "_" + nomMatiere + "_" + userClasse + "_" + newNumeroChapitre + ".pdf";

                firebase.storage().ref(pdfURL).getDownloadURL().then(function (url2) {
                  //The subject is present + student's eval exist so we assume its ECC
                  console.log("the note is NaN + The subject is present + student's eval exist so we assume its ECC");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'ECC';
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                }).catch(function (err) {
                  //The subject is present + student's eval doesn't exist so we assume its AF
                  /* ICI */
                  console.log("The note is NaN +The subject is present + student's eval doesn't exist so we assume its AF");
                  // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
                  console.log(matiere[indexOfFoo] + " - " + chapitres[index]);
                  /* Devoirs non corriges */
                  var sujetEvalUrl = 'sujets_evaluations/' + idAdmin + '_' + nomMatiere + '_' + userClasse + '_' + newNumeroChapitre + '.pdf';
                  var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
                  var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="'+sujetEvalUrl+'">Voir le sujet</button></td></tr>';

                  var totalTable = table1 + table2;


                  // document.getElementById('devoirsTable').innerHTML += totalTable;
                  document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">'+matiere[indexOfFoo] + ' - ' + chapitres[index]+'</p></div>'
                  myIndex++;
                  devoirsCount++;
                  document.getElementById('devoirsCount').innerText = '('+devoirsCount+')';
                  console.log("myIndex Value : ",myIndex);
                  /*  */
                  indexHTML++;
                  index++;
                  foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName, userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

                });
        }
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
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          }).catch(function (err) {
            //The subject is present + student's eval doesn't exist so we assume its AF
            console.log("The subject is present + student's eval doesn't exist so we assume its AF");
            /* ICI */
            console.log(matiere[indexOfFoo]+" - "+chapitres[index]);
            /* Devoirs non corriges */
            var table1 = '<tr><td>' + matiere[indexOfFoo] + ' - ' + chapitres[index] + '</td>';
            var table2 = '<td><button type="button" class="btn bg-school-plus btn-min-width text-bold-600"  style="display:block;margin-left:auto;margin-right:auto;" onclick="downloadSubject(this.id)" id="'+sujetEvalUrl+'">Voir le sujet</button></td></tr>';

            var totalTable = table1 + table2;

            // document.getElementById('devoirsTable').innerHTML += totalTable;
            document.getElementById('evalSlider').innerHTML += '<div><p name="slickElement" style="margin-bottom:0px">'+matiere[indexOfFoo] + ' - ' + chapitres[index]+'</p></div>'
            myIndex++;
            devoirsCount++;
            document.getElementById('devoirsCount').innerText = '('+devoirsCount+')';
            console.log("myIndex Value : ",myIndex);
            /*  */
            // document.getElementById(matiere[indexOfFoo]+'Note'+indexHTML).innerText = 'AF';
            indexHTML++;
            index++;
            foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);

          });


        }).catch(function (err) {
          //the eval is not present we can pass
          console.log("Notes array is undefined + the eval hasn't been posted so NO EVAL we pass");
          index++;
          foo2(matiere, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexOfFoo, indexHTML, accumulMatiere, effectifMatiere, generalAccumul, generalEffectif);
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
          foo(matiere, idAdmin, idUser, userFirstName, userLastName,userClasse, indexOfFoo, 1, generalAccumul, generalEffectif);
        }).catch(function (err) {
          console.log("Error: ", err);
        });


    }
  }
  else {
    console.log("No chapter for ", matiere[indexOfFoo]);
    indexOfFoo++;
    foo(matiere, idAdmin, idUser, userFirstName, userLastName,userClasse, indexOfFoo, 1, generalAccumul, generalEffectif);
  }
}


function foo(matieres, idAdmin, idUser, userFirstName, userLastName,userClasse, index, indexHTML, generalAccumul, generalEffectif) {
// alert('foo');
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
        foo2(matieres, chapitres, notes, idAdmin, idUser, userFirstName, userLastName,userClasse, 0, index, indexHTML, 0, 0, generalAccumul, generalEffectif);
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
  //   document.getElementById('loadingDevoirsAF').style.display = 'none';
  //   document.getElementById('messageLoading').style.display = 'none';
  // document.getElementById('messageGood').style.display = 'block';

    console.log("done");
    initCarousel(myIndex);
    saveGlobalData();

 
  }
}

function saveGlobalData() {
  var arr = [];
  var arrSubjects = [];
  document.getElementsByName('slickElement').forEach(function(elem) {
    // console.log(elem);
    console.log(elem.id);
    console.log(elem.innerText);
    if(!arr.includes(elem.innerText))
    {
      arr.push(elem.innerText);
    }
    if(!arrSubjects.includes(elem.id))
    {
      console.log('WHAT WAS PUSHED :', elem.id);
      if(elem.id !=(''))
      {
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
  if(devoirsCount>2)
  {
    numberToDisplay = 3;
  }
  else if(devoirsCount == 0)
  {
    document.getElementById('evalSlider').innerHTML = '<div><p name="slickElement" style="margin-bottom:0px">Vous n\'avez aucun devoir en attente.</p></div>';
    numberToDisplay = 1;
  }
  else
  {
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
// alert('hey');
  // document.getElementById('loadingDevoirsAF').style.display = 'block';
  // document.getElementById('messageLoading').style.display = 'block';
  // document.getElementById('messageGood').style.display = 'none';

  // $('#selectClass')[0].selectize.disable();
  // $('#selectStudent')[0].selectize.disable();


  // document.getElementById('selectStudent').disabled = true;
  // document.getElementById('messageBulletin').style.display = 'block';
  // document.getElementById('messageBulletin2').style.display = 'none';

  console.log(idUser);
  var myArray = [];

  firestore.collection('users').doc(idUser).get()
    .then(function (docUser) {

      docUser.data().matieres.forEach(function (elem) {

      
        myArray.push(elem.matiere);
      });
      // alert('hey2');
      foo(myArray, docUser.data().idAdmin, docUser.id, docUser.data().firstName, docUser.data().lastName, docUser.data().classe, 0, 1, 0, 0);

      var moyenneGenerale = 0;
      var totalGeneral = 0;
      var nbGenerale = 0;

      var arr = [];

    }).catch(function (err) {
      console.log('Error :', err);
    });

}

function getLanguage() {
  var flag = window.location.href.split('/');
  if (flag[(flag.length - 2)] == "en")
    return "english";
  else
    return "french";
}

const language = getLanguage();

// format english (mm/dd/yyyy) or format french (dd/mm/yyyy)
function getDateFormated(date, format) {
  var now = date.toLocaleString(); //          '20/5/2018'
  var splitedString = now.split('/'); //         20  '/'  5 '/' 2018
  //var year = splitedString[2].split('0');		//  2018 --> 18 pour le calcul
  var month = parseFloat(splitedString[1]); // 5+1 = 6
  if (month < 10)
    month = '0' + month.toString(); //06
  else
    month = month.toString();
  var day = parseFloat(splitedString[0]);

  if (day < 10)
    day = '0' + day.toString();
  else
    day = day.toString();
  splitedString[0] = day;
  splitedString[1] = month;
  if (format == "english")
    var finaldate = splitedString[1] + '/' + splitedString[0] + '/' + splitedString[2].slice(0, 5);
  else
    var finaldate = splitedString[0] + '/' + splitedString[1] + '/' + splitedString[2].slice(0, 5);

  return finaldate;
}


/* function setMainLink(userCategory, soutien) {

  if(userCategory == "student")
  {
    if(soutien)
    {
      document.getElementById('mainNavLink').href = "dashboard-soutien.php";
    }
  }
  else
  {
    document.getElementById('mainNavLink').href = "dashboard.php";
  }

} */

function getUserNotif() {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var username = "";


  var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumberIn = document.getElementById('notifNumberIn');
  const notifConst0 = '<a href="';
  const notifConst1 = '" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted" style="line-height: 15px">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var notReadNumber = 0;

  // display user profile picture and username
  query.get().then(function (doc) {

    // display notifications
    if (doc.data().notifications.length == 0) {
      var errorMessage1 = document.getElementById("error-message1");
      errorMessage1.style.display = "block";
    }
    else {
      for (var i = doc.data().notifications.length - 1; i >= 0 && (doc.data().notifications.length - i) < 8; i--) {
        if (!doc.data().notifications[i].viewed)
          notifHTML += notifConst0 + "javascript:void(0)" + notifConst1bis;
        else
          notifHTML += notifConst0 + doc.data().notifications[i].url + notifConst1;

        if (language == "english")
          notifHTML += doc.data().notifications[i].date + notifConst2 + doc.data().notifications[i].icon + notifConst3 + doc.data().notifications[i].title.en + notifConst4 + doc.data().notifications[i].description.en + notifConst5 + formatDelay(doc.data().notifications[i].date) + notifConst6;
        else
          notifHTML += doc.data().notifications[i].date + notifConst2 + doc.data().notifications[i].icon + notifConst3 + doc.data().notifications[i].title.fr + notifConst4 + doc.data().notifications[i].description.fr + notifConst5 + formatDelay(doc.data().notifications[i].date) + notifConst6;
          // console.log(formatDelay(doc.data().notifications[i].date));
        }

      if (doc.data().newNotif > 0)
        notifNumberTop.innerHTML = doc.data().newNotif;

      notifList.innerHTML = notifHTML;

      for (var j = 0; j < doc.data().notifications.length; j++) {
        if (doc.data().notifications[j].viewed == false)
          notReadNumber++;
      }

      if (notReadNumber > 0) {
        if (language == "english")
          notifNumberIn.innerHTML = notReadNumber + " unread"
        else {
          if (notReadNumber == 1)
            notifNumberIn.innerHTML = "1 non lue";
          else
            notifNumberIn.innerHTML = notReadNumber + " non lues";
        }
      }
    }
  });
}

function checkStudentToDoList() {
  var user = auth.currentUser;
  var queryUser = firestore.collection('users').doc(user.uid);
  //

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

                      if(docChapter.data().cours != '')
                      {
                        mainLoopCours:
                        for(var i = 0; i<docChapter.data().cours.length; i++)
                        {
                          for(var j = 0; j<docChapter.data().cours[i].suivi.length; j++)
                          {
                            if(user.uid == docChapter.data().cours[i].suivi[j].studentId)
                            {
                              if(docChapter.data().cours[i].suivi[j].avancement != 'happy')
                              {
                                isCoursComplete = false;
                                break mainLoopCours;
                              }
                            }
                          }
                        }
                      }
                      if(docChapter.data().exercices != '')
                      {
                        mainLoopExos:
                        for(var i = 0; i<docChapter.data().exercices.length; i++)
                        {
                          for(var j = 0; j<docChapter.data().exercices[i].suivi.length; j++)
                          {
                            if(user.uid == docChapter.data().exercices[i].suivi[j].studentId)
                            {
                              if(docChapter.data().exercices[i].suivi[j].avancement != 'happy')
                              {
                                isExosComplete = false;
                                break mainLoopExos;
                              }   
                            }
                          }
                        }
                      }

                      if(!isCoursComplete || !isExosComplete || !isCoursComplete && !isExosComplete)
                      {
                        console.log("Todolist is not complete for : ", elem.matiere + " " + docChapter.id+ " YOU should notify student");
                      }
                      else {
                        console.log("Todolist is COMPLETE for : ", elem.matiere + " " + docChapter.id);                      }

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
      });
    }).catch(function (err) {
      console.log("Error getting user's document: ", err);
    });
}

// START: group of functions related to notifications
// set that the new notifications has been viewed by the user in firebase
function formatDelay(timeFrom) {
  var todayDate = Math.trunc(new Date().getTime() / 1000);
  var theDelay = todayDate - timeFrom;
  var formatedDelay = "";
  var theDelayTrunc = 0;
  if (theDelay <= 0)
    return "";
  else {
    if (theDelay >= 31536000) {
      theDelayTrunc = Math.trunc(theDelay / 31536000);
      if (language == "english") {
        if (theDelayTrunc == 1)
          formatedDelay = "One year ago";
        else
          formatedDelay = theDelayTrunc + " years ago";
      }
      else {
        if (theDelayTrunc == 1)
          formatedDelay = "Il y a un an";
        else
          formatedDelay = "Il y a " + theDelayTrunc + " ans";
      }
    } else if (theDelay >= 604800) {
      theDelayTrunc = Math.trunc(theDelay / 604800);
      if (language == "english") {
        if (theDelayTrunc == 1)
          formatedDelay = "One week ago";
        else
          formatedDelay = theDelayTrunc + " weeks ago";
      }
      else {
        if (theDelayTrunc == 1)
          formatedDelay = "Il y a une semaine";
        else
          formatedDelay = "Il y a " + theDelayTrunc + " semaines";
      }
    } else if (theDelay >= 86400) {
      theDelayTrunc = Math.trunc(theDelay / 86400);
      if (language == "english") {
        if (theDelayTrunc == 1)
          formatedDelay = "One day ago";
        else
          formatedDelay = theDelayTrunc + " days ago";
      }
      else {
        if (theDelayTrunc == 1)
          formatedDelay = "Il y a un jour";
        else
          formatedDelay = "Il y a " + theDelayTrunc + " jours";
      }
    } else if (theDelay >= 3600) {
      theDelayTrunc = Math.trunc(theDelay / 3600);
      if (language == "english") {
        if (theDelayTrunc == 1)
          formatedDelay = "One hour ago";
        else
          formatedDelay = theDelayTrunc + " hours ago";
      }
      else {
        if (theDelayTrunc == 1)
          formatedDelay = "Il y a une heure";
        else
          formatedDelay = "Il y a " + theDelayTrunc + " heures";
      }
    } else if (theDelay >= 60) {
      theDelayTrunc = Math.trunc(theDelay / 60);
      if (language == "english") {
        if (theDelayTrunc == 1)
          formatedDelay = "One minute ago";
        else
          formatedDelay = theDelayTrunc + " minutes ago";
      }
      else {
        if (theDelayTrunc == 1)
          formatedDelay = "Il y a une minute";
        else
          formatedDelay = "Il y a " + theDelayTrunc + " minutes";
      }
    } else {
      if (language == "english")
        formatedDelay = "Just now";
      else
        formatedDelay = "Il y a un instant";
    }
  }
  return formatedDelay;
}

$('#notifLink').click(() => {
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var notifNumberTop = document.getElementById('notifNumberTop');

  if (notifNumberTop.innerHTML != "") {
    query.update({
      newNotif: 0
    });
    notifNumberTop.innerHTML = "";
  }
});

// mark all notifications as read
$('#notif-clearall').click(() => {
  console.log('clear all');
  var user = auth.currentUser;
  var query = firestore.collection('users').doc(user.uid);
  var notifNumberIn = document.getElementById('notifNumberIn');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var containerNameTop = "";
  var notifContainerTop;

  if (notifNumberIn.innerHTML != "" && notifNumberIn.innerHTML != null) {
    console.log("ok");
    query.get().then((doc) => {
      var results = doc.data();
      for (var i = 0; i < results.notifications.length; i++) {
        if (doc.data().notifications[i].viewed == false) {
          results.notifications[i].viewed = true;

          containerNameTop = "notif" + results.notifications[i].date;
          notifContainerTop = document.getElementById(containerNameTop);
          if (notifContainerTop != null)
            notifContainerTop.style.background = "";
        }
      }
      console.log("should clear pastille");
      query.update(results);
      notifNumberIn.innerHTML = "";
      notifNumberTop.innerHTML = '';
    })
      .catch(function (error) {
        console.error("Error creating session: ", error);
      });
  }
});

// set that a precise notification has been viewed by the user
function clearNotif(notifId) {
  console.log('clearnotif');
  var notifContainer = document.getElementById(notifId);
  var notifNumberTop = document.getElementById('notifNumberTop');

  if (notifContainer.style.background != "" && notifContainer.style.background != null) {
    var user = auth.currentUser;
    var query = firestore.collection('users').doc(user.uid);
    var notifNumber = notifId.split('f');
    var notifNumberIn = document.getElementById('notifNumberIn');
    var notifIndex = -1;
    var notReadNumber = 0;

    // not possible yet to modify only an element of a map located in an array --> have to update all the file
    query.get().then((doc) => {
      console.log("Bonjour");
      var results = doc.data();
      for (var i = 0; i < results.notifications.length; i++) {
        if (results.notifications[i].date == notifNumber[1] && notifIndex == -1) {
          notifIndex = i;
        }
        if (results.notifications[i].viewed == false)
          notReadNumber++;
      }
      results.notifications[notifIndex].viewed = true;
      notifContainer.style.background = "";

      notReadNumber--;
      if (notReadNumber > 0) {
        if (language == "english")
          notifNumberIn.innerHTML = notReadNumber + " unread"
        else {
          if (notReadNumber == 1)
            notifNumberIn.innerHTML = "1 non lue";
          else
            notifNumberIn.innerHTML = notReadNumber + " non lues";
        }
      }
      else
        notifNumberIn.innerHTML = "";

      if (notifNumberTop.innerHTML != "" && notifNumberTop.innerHTML != null) {
        notifNumberTop.innerHTML = "";
        results.newNotif = 0;
      }
      console.log("coucou");
      query.update(results).then(function () {
        location.href = doc.data().notifications[notifIndex].url;
      })
        .catch(function (error) {
          console.error("Error updating notification: ", error);
        });
    })
      .catch(function (error) {
        console.error("Error getting notifications: ", error);
      });
    return false;
  }
}

// function called when the user has a notification and is on the app
function addNotifFromDb(doc) {
  var notifHTML = "";
  var notifList = document.getElementById('notifications');
  var notifNumberTop = document.getElementById('notifNumberTop');
  var notifNumber = 0;
  const notifConst0 = '<a href="';
  const notifConst1 = '" class="list-group-item" id="notif'; //id if already notified
  const notifConst1bis = '" class="list-group-item" style="background:#e5f7f8;" id="notif'; //id
  const notifConst2 = '" onclick="clearNotif(this.id)"><div class="media"><div class="media-left valign-middle"><i class="'; //icon
  const notifConst3 = '"></i></div><div class="media-body"><h6 class="media-heading">'; //title
  const notifConst4 = '</h6><p class="notification-text font-small-3 text-muted">'; // description
  const notifConst5 = '</p><small><time class="media-meta text-muted">'; //time ago
  const notifConst6 = '</time></small></div></div></a>';
  var currentHtml = notifList.innerHTML;
  var notifNb = doc.data().notifications.length - 1;

  if (doc.data().newNotif > 0 && notifNumberTop.innerHTML != doc.data().newNotif) {
    //notifHTML += notifConst0 + doc.data().notifications[notifNb].url;
    notifHTML += notifConst0 + "#";
    if (!doc.data().notifications[notifNb].viewed) {
      notifNumber++;
      notifHTML += notifConst1bis;
    }
    else
      notifHTML += notifConst1;

    if (language == "english")
      notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.en + notifConst4 + doc.data().notifications[notifNb].description.en + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;
    else
      notifHTML += doc.data().notifications[notifNb].date + notifConst2 + doc.data().notifications[notifNb].icon + notifConst3 + doc.data().notifications[notifNb].title.fr + notifConst4 + doc.data().notifications[notifNb].description.fr + notifConst5 + formatDelay(doc.data().notifications[notifNb].date) + notifConst6;

    if (doc.data().newNotif > 0)
      notifNumberTop.innerHTML = doc.data().newNotif;

    notifList.innerHTML = notifHTML + currentHtml;

  }
}
// END: group of functions related to notifications




