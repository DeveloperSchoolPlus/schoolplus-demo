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
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
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

$('body[data-open="hover"] .dropdown').on('mouseenter', function(){
  if (!($(this).hasClass('open'))) {
    $(this).addClass('open');
  }else{
    $(this).removeClass('open');
  }
}).on('mouseleave', function(event){
  $(this).removeClass('open');
});
var menuType = $('body').data('menu');
$('body[data-open="hover"] .dropdown a').on('click', function(e){
  
  
  if(menuType == 'horizontal-menu' || menuType == 'horizontal-top-icon-menu'){
    var $this = $(this);
    console.log(Object.keys($this));
    if($this.hasClass('dropdown-toggle')){
      return false;
    }
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
    if(user.uid == 'ZC57kLf1XpUOXh9QJUNDKS2pMgg1')
    {
      document.getElementById('virtualClass').setAttribute('href', 'https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1');
    } else {
      document.getElementById('virtualClass').setAttribute('href', '#');
      
    }
    
    // manuelLink.setAttribute("href", doc.data().manuel);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    
    
    console.log(doc.data().classe);
    for(var i = 0; i<doc.data().matieres.length; i++)
    {
      selectedMatiere.selectize.addOption({value: doc.data().matieres[i].matiere, text:doc.data().matieres[i].matiere});
      var  $select = $('select#selectMatiere').selectize();
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


$('#btnPDFCours').on('click', function() {
  
  if ($(window).width() < 1280) {
    if(sectionPDFCours2.style.display == "none")
    {
      sectionPDFCours2.style.display = "block";
    }
    else if(sectionPDFCours2.style.display == "block")
    {
      
      sectionPDFCours2.style.display ="none";
    }
    
    
  } else {
    if(sectionPDFCours.style.display == "none")
    {
      sectionPDFCours.style.display = "block";
    }
    else if(sectionPDFCours.style.display == "block")
    {
      
      sectionPDFCours.style.display ="none";
    }
  }
  
  
  
  
});

$('#btnPDFExercices').on('click', function() {
  
  if($(window).width() < 1280)
  {
    if(sectionPDFExercices2.style.display == "none")
    {
      sectionPDFExercices2.style.display = "block";
    }
    else if(sectionPDFExercices2.style.display == "block")
    {
      
      sectionPDFExercices2.style.display ="none";
    }
  }
  else 
  {
    if(sectionPDFExercices.style.display == "none")
    {
      sectionPDFExercices.style.display = "block";
    }
    else if(sectionPDFExercices.style.display == "block")
    {
      
      sectionPDFExercices.style.display ="none";
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


$('select#selectMatiere').on('change', function() {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(function(doc) {
    document.getElementById('basicContainer').innerHTML ="";
    initChapters();
  }).catch(function(err) {
    console.log("Error : ", err);
  });
  
});

function initChapters() {
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
  
  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"
  
  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time'>";
  
  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Cours, méthodes</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p><h6 class=' card-title text-bold-600'>Exercices</h4><p class='card-text text-xs-left'>";
  
  var sponshtml7 = "</p><p> </p><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'>";
  var sponshtml8 = "</span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress";
  var sponshtml9 = "'></progress></div></div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='33%' style='text-align: center'></th><th width='33%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml10 = "' type='button'  id='";
  
  var sponshtml11 = "' onclick='toDoList(\"";
  var sponshtml12 = "\")';>Mon travail à faire</button></div></th><th width='33%' style='text-align: center'>";
  var sponshtml13 = "</th></tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";
  
  // init chapters HTML for display 
  
    
      firestore.collection('users').doc(user.uid).collection($('select#selectMatiere').val()).get()
      .then(function(querySnapshot2) {
        chapterCount = querySnapshot2.size;
        querySnapshot2.forEach(function(doc2) {
          if (doc2.id == "duration") {
            chapterDuration = Math.round(doc2.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
          }
          else {
            
            if(doc2.data().numeroChapitre != undefined)
            {
              if(doc2.id != 'duration')
              {
                html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
                + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + "doc2.id" + sponshtml10 +doc2.data().numeroChapitre +  sponshtml11 +doc2.data().numeroChapitre + sponshtml12  + sponshtml13 ;
                addElement('basicContainer', 'div', html);
              }
            }
            
          }
        });
        // update progress bar
        if (chapterDuration != 0) {
         /*  firestore.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.data().matieres != null) {
              for(var i = 0; i<doc.data().matieres.length; i++) {
                if (doc.data().matieres[i].matiere == $('select#selectMatiere').val())
                totalTime = doc.data().matieres[i].timeDone + doc.data().matieres[i].timeValidated;
              }
              if (totalTime != 0) {
                currentChapter = Math.trunc(totalTime / chapterDuration) + 1;
                currentProgress = ((totalTime - (currentChapter - 1)*chapterDuration) / chapterDuration)*100;
                
                var progressBars = document.getElementsByTagName('progress');
                var completion = document.getElementsByClassName('completion');
                console.log("comp: " + completion.length);
                for (var i=0; i<progressBars.length; i++) {
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
          }); */
        }
        // update remaining time
        if (chapterDuration != 0)
        chapterCount--;
        
        var chapterNormalDuration = yearDuration / chapterCount; // get chapter normal duration in s
        var timeElapsed = Date.now()/1000 - yearStartDate;
        var classCurrentChapter = Math.trunc(timeElapsed / chapterNormalDuration);
        var durationRemaining = Math.trunc((chapterNormalDuration*(classCurrentChapter + 1) - timeElapsed)/(60*60*24));
        var deadlines = document.getElementsByClassName('time');
        /* for (var j=0; j<deadlines.length; j++) {
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
      }).catch(function(err) {
        console.log("Error :", err);
      });
    
 
}


/* function modifyChapter(numeroChapitre) 
{
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");
  $("#modalModifyChapter").modal();
  
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', docUser.data().instituteName).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        firestore.collection('users').doc(doc.data().id).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
        .then(function(doc2) {
          modifyChapitreNumber.value= doc2.data().numeroChapitre;
          modifyChapitreName.value= doc2.data().nomChapitre;
          modifyExpectedSkills.value = doc2.data().competences;
          modifyChallenges.value= doc2.data().challenges ;
          modifyEndDate.value = doc2.data().endDate;
          
          
          
          
          
        }).catch(function(err) {
          console.log("Error :", err);
        });
      });
      
    }).catch(function(err) {
      console.log("Error :", err);
    });
    
    
  }).catch(function(err) {
    console.log("Error ", err);
  });
  
  
  
} */
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
  
  var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="coursToDoList" id="coursToDoList" class="form-control input-lg" value ="'+value+'" placeholder="Cours à lire et à synthétiser" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if(value == 'A venir')
  {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="'+name+'" value="sad" class="radio-smiley sad" disabled><input type="radio" name="'+name+'" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="'+name+'" value="happy" class="radio-smiley happy" disabled></input></div></fieldset>';
  } else 
  {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="'+name+'" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="'+name+'" value="neutral" class="radio-smiley neutral"><input type="radio" name="'+name+'" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  }
  
  var totalHTML = html1 + html2 + html3 + html4;
  
  addElement('coursContainer', 'fieldset', totalHTML);
  
}

function addDivExos (name, value) {
  
  var html1 = '<fieldset class="form-group position-relative has-icon-left"><div class="col-12 col-md-8" style="padding-left: 0px;">';
  var html2 = '<input type="text" name="exosToDoList" id="exosToDoList" class="form-control input-lg" value ="'+value+'" placeholder="Exercices auto-correctifs" tabindex="4">';
  var html3 = '<div class="form-control-position"><i class="fas fa-brain"></i></div><div class="help-block text-bold-600 danger font-small-3"></div></div>';
  if(value == 'A venir')
  {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="'+name+'" value="sad" class="radio-smiley sad" disabled><input type="radio" name="'+name+'" value="neutral" class="radio-smiley neutral" disabled><input type="radio" name="'+name+'" value="happy" class="radio-smiley happy"disabled></input></div></fieldset>';
    
  } else {
    var html4 = '<div class="col-6 col-md-4"><input type="radio" name="'+name+'" value="sad" class="radio-smiley sad" checked="checked"><input type="radio" name="'+name+'" value="neutral" class="radio-smiley neutral"><input type="radio" name="'+name+'" value="happy" class="radio-smiley happy"></input></div></fieldset>';
  }
  
  var totalHTML = html1 + html2 + html3 + html4;
  
  addElement('exosContainer', 'fieldset', totalHTML);
  
}

function handBackExams(numeroChapitre)
{
  var user = auth.currentUser;
  var pdfURL = '';
  var mp3URL = '';
  document.getElementById('writtenMessage').style.display = "none";
  document.getElementById('oralMessage').style.display = "none";
  document.getElementById('written-error-message').style.display ="none";
  document.getElementById('oral-error-message').style.display = "none";
  $('#uploadWritten').prop('disabled', false);
  $('#uploadOral').prop('disabled', false);

  console.log("handBackExams function is called");
  console.log(numeroChapitre);
  document.getElementById('uploadChapitreNumber').innerText = numeroChapitre;
  
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
  firestore.collection('users').doc(user.uid).get()
  .then(function(doc) {
    var newFirstName = doc.data().firstName.substring(0,1);
    var fullName = newFirstName+doc.data().lastName;

    pdfURL = "devoirs_ecrits/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".pdf";
    mp3URL = "devoirs_oraux/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".mp3";
    firebase.storage().ref(pdfURL).getDownloadURL().then(function(url) {
      document.getElementById('writtenMessage').style.display = "inline";
      document.getElementById('writtenLink').href = url;
      // document.getElementById('uploadWritten').setAttribute('disabled', '');
      $('#uploadWritten').prop('disabled', true);

    }).catch(function(err) {
      console.log("Error :",err);
    });

    firebase.storage().ref(mp3URL).getDownloadURL().then(function(url) {
      document.getElementById('oralMessage').style.display = "inline";
      document.getElementById('oralLink').href = url;
      $('#uploadOral').prop('disabled', true);
    }).catch(function(err) {
      console.log("Error : ", err);
    });

  }).catch(function(err) {
    console.log("Error :", err);
  });


  $('#modalHandBack').modal();
  
  
}

$('#uploadWritten').change(function() {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('written-error-message');
  errorMessage.style.display = "none";
  var thePDF = document.getElementById('uploadWritten').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if(nomMatiere.indexOf(' ') >= 0)
  {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText;
  if(newNumeroChapitre.indexOf(' ') >= 0)
  {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  console.log("NEW "+newNumeroChapitre);
  if(thePDF.type == 'application/pdf')
  {
    //Check the size of the file, what size ???
    if(thePDF.size <= 20000000)
    {
      console.log("Good, thepdf.size is :", thePDF.size);
      firestore.collection('users').doc(user.uid).get()
    .then(function(doc) {
      var newFirstName = doc.data().firstName.substring(0,1);
      var fullName = newFirstName+doc.data().lastName;
      console.log(fullName);
      var uploadTask = storageRef.child("devoirs_ecrits/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".pdf").put(thePDF);
      console.log("URL : "+"devoirs_ecrits/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
        document.getElementById('uploadWritten').setAttribute('disabled', '');
        document.getElementById('writtenImage').style.display = "inline";
        document.getElementById('writtenMessage').style.display = "none";
      }, function(error) {
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
      }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          if(downloadURL != '')
          {
            console.log('PDF was downloaded and message can be displayed');
            document.getElementById('writtenImage').style.display = "none";
            document.getElementById('writtenLink').href = downloadURL;
            document.getElementById('writtenMessage').style.display = "block";
          }
        });
        // document.getElementById('uploadWritten').removeAttribute('disabled');
        // document.getElementById('uploadWritten').setAttribute('enabled', '');
      });
    }).catch(function(err) {
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
  document.getElementById('uploadWritten').value ="";
});

$('#uploadOral').change(function() {
  console.log("new upload");
  var user = auth.currentUser;
  var errorMessage = document.getElementById('oral-error-message');
  errorMessage.style.display = "none";
  var theMP3 = document.getElementById('uploadOral').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if(nomMatiere.indexOf(' ') >= 0)
  {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('uploadChapitreNumber').innerText;
  if(newNumeroChapitre.indexOf(' ') >= 0)
  {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
 console.log("SIZE : " + theMP3.size);
  if(theMP3.type == 'audio/mp3')
  {
    console.log("GOOD3");
    //Check the size of the file, what size ???
    if(theMP3.size <= 20000000)
    {
      console.log("Good to upload, themp3.size is : " +theMP3.size);
      firestore.collection('users').doc(user.uid).get()
    .then(function(doc) {
      var newFirstName = doc.data().firstName.substring(0,1);
      var fullName = newFirstName+doc.data().lastName;
      console.log(fullName);
      var uploadTask = storageRef.child("devoirs_oraux/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".mp3").put(theMP3);
      console.log("URL : "+"devoirs_oraux/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
        document.getElementById('uploadOral').setAttribute('disabled', '');
        document.getElementById('oralImage').style.display = "inline";
        document.getElementById('oralMessage').style.display = "none";
      }, function(error) {
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
      }, function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          if(downloadURL != '')
          {
            console.log('PDF was downloaded and message can be displayed');
            document.getElementById('oralImage').style.display = "none";
            document.getElementById('oralLink').href = downloadURL;
            document.getElementById('oralMessage').style.display = "block";
          }
        });
        // document.getElementById('uploadOral').removeAttribute('disabled');
        // document.getElementById('uploadOral').setAttribute('enabled', '');
      });
    }).catch(function(err) {
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
  document.getElementById('uploadOral').value ="";
});

function toDoList(numeroChapitre) 
{
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
  var pdfCoursUrl = '';
  var pdfExercicesUrl ='';
  pdfCours.data='';
  pdfExos.data = '';
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    if(docUser.data().userCategory == "student")
    {
      // document.getElementById('login').innerText = docUser.data().loginManuel;
      // document.getElementById('mdp').innerText = docUser.data().mdpManuel;
    }
    
    
      
        firestore.collection('users').doc(user.uid).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
        .then(function(doc2) {
          // modifyChapitreNumber2.value= doc2.data().numeroChapitre;
          // modifyChapitreName2.value= doc2.data().nomChapitre;
          // modifyExpectedSkills2.value = doc2.data().competences;
          // modifyChallenges2.value= doc2.data().challenges ;
          // modifyEndDate2.value = doc2.data().endDate;
          // exercicesToDoList.value = doc2.data().exercices;
          // coursToDoList.value = doc2.data().cours;
          chapitreNumber.value = doc2.data().numeroChapitre;
          
          
          //SECTION COURS
          if (typeof doc2.data().cours == "object" &&  doc2.data().cours.length > 0)
          {
            console.log("The type of 'cours' is object, we good");
            if(typeof doc2.data().cours[0] == "object")
            {
              var indexCours = 0;
              doc2.data().cours.forEach(function(elem){
                console.log(typeof elem +" Look HERE");
                addDivCours("cours"+indexCours,elem.element);
                console.log("Elem: ", elem);
                console.log(indexCours+" !!!!!! ");
                indexCours++;
              });
            } else if(typeof doc2.data().cours[0] == "string")
            {
              doc2.data().cours.forEach(function(elem){
                addDivCours("cours"+doc2.data().cours.indexOf(elem),elem);
              });
              
            }
            
          } else if(typeof doc2.data().cours == "string" && doc2.data().cours != '') {
            console.log("This is an old version. 'cours' is a string"); 
            addDivCours("cours0",doc2.data().cours);
          } else {
            console.log("Nothing in DB, we present a cleared input");
            addDivCours("cours0", 'A venir');
            document.getElementById('coursToDoList').disabled = true;
            $('input[name="cours0"]').disabled = true;
          }
          
          // SECTION EXOS
          if (typeof doc2.data().exercices == "object" &&  doc2.data().exercices.length > 0)
          {
            console.log("The type of 'exercices' is object, we good");
            if(typeof doc2.data().exercices[0] == "object")
            {
              var indexExos = 0;
              doc2.data().exercices.forEach(function(elem){
                console.log(typeof elem +" Look HERE");
                addDivExos("exo"+indexExos,elem.element);
                indexExos++;
              });
            } else if(typeof doc2.data().exercices[0] == "string")
            {
              doc2.data().exercices.forEach(function(elem){
                addDivExos("exo"+doc2.data().exercices.indexOf(elem),elem);
              });
              
            }
            
          } else if(typeof doc2.data().exercices == "string" && doc2.data().exercices != '') {
            console.log("This is an old version. 'exercices' is a string"); 
            addDivExos("exo0",doc2.data().exercices);
          } else {
            console.log("Nothing in DB, we present a cleared input");
            addDivExos("exo0", 'A venir');
            document.getElementById('exosToDoList').disabled = true;
            $('input[name="exo0"]').disabled = true;
          }
          
          //We set corresponding smileys for each student
          for(var i = 0; i < doc2.data().cours.length; i++) 
          {
            for(var j = 0; j < doc2.data().cours[i].suivi.length; j++)
            {
              if(doc2.data().cours[i].suivi[j].studentId == user.uid)
              {
                document.querySelectorAll('input[name="cours'+i+'"]').forEach(function(elem) {
                  if(elem.value == doc2.data().cours[i].suivi[j].avancement)
                  {
                    elem.checked = "checked";
                  }
                });
              }
            }
          }
          for(var i = 0; i < doc2.data().exercices.length; i++) 
          {
            for(var j = 0; j < doc2.data().exercices[i].suivi.length; j++)
            {
              if(doc2.data().exercices[i].suivi[j].studentId == user.uid)
              {
                document.querySelectorAll('input[name="exo'+i+'"]').forEach(function(elem) {
                  if(elem.value == doc2.data().exercices[i].suivi[j].avancement)
                  {
                    elem.checked = "checked";
                  }
                });
              }
            }
          }
          
          console.log("Look down for smileysCoursToSet");
          console.log(smileysCoursToSet);
          
          var nomMatiere = $('select#selectMatiere').val();
          if(nomMatiere.indexOf(' ') >= 0)
          {
            console.log("true");
            nomMatiere = nomMatiere.replace(/\s+/g, '-');
          }
          
          nomMatiere = nomMatiere.replace('é', 'e');
          nomMatiere = nomMatiere.replace('è', 'e');
          console.log("ICI :"+ nomMatiere);
          
          var newNumeroChapitre = numeroChapitre;
          if(newNumeroChapitre.indexOf(' ') >= 0)
          {
            console.log("true");
            newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
          }
          
          pdfCoursUrl = 'fiches_cours/'+docUser.data().idAdmin+'_'+user.uid+'_'+nomMatiere+'_'+newNumeroChapitre+".pdf";
          pdfExercicesUrl = 'fiches_exos/'+docUser.data().idAdmin+'_'+user.uid+'_'+nomMatiere+'_'+newNumeroChapitre+".pdf";
          
          console.log("URL Cours :" + pdfCoursUrl);
          console.log("URL Exos :"+ pdfExercicesUrl);
          //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
          firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function(coursUrl) {
            console.log("CoursUrl --> "+ coursUrl);
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
          firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function(exosUrl) {
            console.log("ExosUrl -- > "+exosUrl);
            btnOpenPDFExercices.setAttribute("href", exosUrl);
            pdfExos.data = exosUrl;
            document.getElementById('divExos').style.display = "block";
            document.getElementById('exosError').style.display = "none";
          }).catch((err) => {
            console.log("Error :" + err);
            document.getElementById('divExos').style.display = "none";
            document.getElementById('exosError').style.display = "block";
          });

          var sujetEvalUrl = 'sujets_evaluations/'+docUser.data().idAdmin+'_'+user.uid+'_'+nomMatiere+'_'+newNumeroChapitre+'.pdf';
          firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function(url) {
            console.log("EVAL OK :"+url);
            document.getElementById('btnEval').setAttribute('href', url);
            document.getElementById('divEval').style.display = "block";
            document.getElementById('evalError').style.display ="none";

          }).catch(function(err) {
            console.log("Error :", err);
            //Display error message
            document.getElementById('divEval').style.display = "none";
            document.getElementById('evalError').style.display = "block";
          });

          var correctionUrl = 'exos_corriges/'+docUser.data().idAdmin+'_'+user.uid+'_'+nomMatiere+'_'+newNumeroChapitre+'.pdf';
          firebase.storage().ref(correctionUrl).getDownloadURL().then(function(url) {
            console.log("EVAL OK :"+url);
            document.getElementById('btnCorrection').setAttribute('href', url);
            document.getElementById('divCorrection').style.display = "block";
            document.getElementById('correctionError').style.display ="none";

          }).catch(function(err) {
            console.log("Error :", err);
            //Display error message
            document.getElementById('divCorrection').style.display = "none";
            document.getElementById('correctionError').style.display = "block";
          });
          
        }).catch(function(err) {
          console.log("Error :", err);
        });
      
      
    
    
    
  }).catch(function(err) {
    console.log("Error ", err);
  });
  
  
  
}

$('#formToDoList').submit(function(ev) {
  
  ev.preventDefault();
  var user = auth.currentUser;
  var valCours = [] ;
  var valExos = [] ;
  
  $('.radio-smiley:checked').each(function(i) {
    // console.log("LOOK HERE --> "+$(this).attr('name')+" "+$(this).val());
    
    if($(this).attr('name').includes("cours"))
    {
      console.log($(this).attr('name') + "has 'cours' in its name so we push it into valCours array");
      valCours.push($(this).val());
    }
    
    if($(this).attr('name').includes("exo"))
    {
      console.log($(this).attr('name') + "has 'exo' in its name so we push it into valExos array");
      valExos.push($(this).val());
    }    
  });
  
  console.log("End of collecting answers in Cours : "+ valCours.length +"-->"+valCours);
  console.log("End of collecting answers in Exos : "+ valExos.length +"-->"+valExos);

    //Query chapter document to check what we need to update
    firestore.collection('users').doc(user.uid).collection($('select#selectMatiere').val()).doc(chapitreNumber.value).get()
    .then(function(docChapter) {
      
      var coursToBePushed = docChapter.data().cours;
      var exosToBePushed = docChapter.data().exercices;
      console.log("Intialisation");
      console.log(coursToBePushed);
      
      if(valCours.length > 0)
      {
        for(var i = 0 ; i < coursToBePushed.length; i++)
        {
          for(var j = 0; j < coursToBePushed[i].suivi.length; j++) 
          {
            if(coursToBePushed[i].suivi[j].studentId == user.uid)
            {
              //We can change avancement
              coursToBePushed[i].suivi[j].avancement = valCours[i]
            }
          }
        }
        console.log("Look down for coursToBePushed");
        console.log(coursToBePushed);
        //Ok to push
        firestore.collection('users').doc(user.uid).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
        .update({ 
          cours: coursToBePushed
        }).then(function() {
          console.log("Updated");
        }).catch(function(err) {
          console.log("Error while updating");
        })
      }
      
      if(valExos.length > 0)
      {
        for(var i = 0; i < exosToBePushed.length; i++)
        {
          for(var j = 0; j < exosToBePushed[i].suivi.length; j++)
          {
            if(exosToBePushed[i].suivi[j].studentId == user.uid)
            {
              exosToBePushed[i].suivi[j].avancement = valExos[i];
            }
          }
        }
        
        console.log("Look down for exosToBePushed");
        console.log(exosToBePushed);
        //OK to push
        firestore.collection('users').doc(user.uid).collection($('select#selectMatiere').val()).doc(chapitreNumber.value)
        .update({ 
          exercices: exosToBePushed
        }).then(function() {
          console.log("Updated");
        }).catch(function(err) {
          console.log("Error while updating", err);
        })
      }
      
      
    }).catch(function(err) {
      console.log("Error :", err);
    });
  
  
  
  $("#modalToDoList").modal("hide");
  
  //TODO
});