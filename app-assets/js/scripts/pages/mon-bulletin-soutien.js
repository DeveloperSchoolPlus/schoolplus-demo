// firebaseConfig for SchoolPlus Dev
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
    
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    initBilan();
    // initDevoirsRendus();
    // initCopiesCorrigees()
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

function initBilan() {
  
  var user = auth.currentUser;
  document.getElementById('tableBilan').innerHTML = '';
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    docUser.data().matieres.forEach(function(elem) {
      
      var chapterCount = 0;
      var activityCount = 0;
      
      firestore.collection('users').doc(user.uid).collection(elem.matiere).get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(docChapter) {
          if(docChapter.id != 'duration')
          {
            chapterCount ++;
          }
        });
        
        firestore.collection('activities').where('idUser','==',user.uid).where('title', '==', elem.matiere).get()
        .then(function(querySnapshot2) {
          querySnapshot2.forEach(function(doc2) {
            activityCount++;
          });
          
          console.log("Chapter Count : ", chapterCount);
          console.log("Activity Count : ", activityCount);
          
          var table1 = '<tr><td style="padding-left: 0.1%; padding-right: 0.1%;">'+elem.matiere+'</td><td style="padding-left: 0.1%; padding-right: 0.1%;"id="'+elem.matiere+'Note1">'+chapterCount+'</td><td style="padding-left: 0.1%; padding-right: 0.1%;" id="'+elem.matiere+'Note2">'+activityCount+'</td><tr> '; 
          var table = table1;
          
          document.getElementById('tableBilan').innerHTML += table;
        }).catch(function(err) {
          console.log("Error : ", err);
        });
      }).catch(function(err) {
        console.log("Error : ", err);
      });
      
      
      
    }); 
    
    var moyenneGenerale = 0;
    var totalGeneral = 0;
    var nbGenerale = 0;
    
    
    
    
    
  }).catch(function(err) {
    console.log('Error :', err);
  });
  
}

function initDevoirsRendus() {
  
  var user = auth.currentUser;
  
  /* for(var i = 0; i < 5; i++)
  {
    var table1 = '<tr><td>Français - Devoir 1</td>';
    var table2 = '<td><i class="fas fa-check"></i></td></tr>';
    
    var totalTable = table1 + table2;
    
    document.getElementById('devoirsTable').innerHTML += totalTable;
  } */
  
  /*  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    var fullName = docUser.data().firstName.substring(0,1);
    fullName = fullName + docUser.data().lastName;
    console.log(fullName);
    
    docUser.data().matieres.forEach(function(elem) {
      
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
      .then(function(querySnapshot) {
        
        //For every chapter we have to check if the evaluation has been uploaded
        querySnapshot.forEach(function(doc) {
          
          if(doc.id != 'duration')
          {
            if(doc.data().numeroChapitre != undefined)
            {
              // console.log("Matière : "+elem.matiere +" // Chapitre: "+doc.data().numeroChapitre);
              
              var nomMatiere = elem.matiere;
              if(nomMatiere.indexOf(' ') >= 0)
              {
                // console.log("true");
                nomMatiere = nomMatiere.replace(/\s+/g, '-');
              }
              
              nomMatiere = nomMatiere.replace('é', 'e');
              nomMatiere = nomMatiere.replace('è', 'e');
              // console.log("ICI :"+ nomMatiere);
              
              var newNumeroChapitre = doc.data().numeroChapitre;
              if(newNumeroChapitre.indexOf(' ') >= 0)
              {
                // console.log("true");
                newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
              }
              
              
              var evalUrl = 'sujets_evaluations/'+docUser.data().idAdmin+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+".pdf";
              // console.log(evalUrl);
              firebase.storage().ref(evalUrl).getDownloadURL().then(function(fileUrl) {
                console.log("Eval"+elem.matiere+"-"+doc.data().numeroChapitre+ "is present");
                //Here we can build a row and check if student has already uploaded his eval
                
                var studentUrl = 'devoirs_ecrits/'+docUser.data().idAdmin+'_'+fullName+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+'.pdf';
                firebase.storage().ref(studentUrl).getDownloadURL().then(function(fileUrl) {
                  //Here the student already has uploaded the eval.
                  var table1 = '<tr><td>'+elem.matiere+' - '+doc.data().numeroChapitre+'</td>';
                  var table2 = '<td><i class="fas fa-check"></i></td></tr>';
                  
                  var totalTable = table1 + table2;
                  
                  document.getElementById('devoirsTable').innerHTML += totalTable;
                  
                }).catch((err) => {
                  //Here the student hasn't uploaded the eval yet.
                  var table1 = '<tr><td>'+elem.matiere+' - '+doc.data().numeroChapitre+'</td>';
                  var table2 = '<td>NON</td></tr>';
                  
                  var totalTable = table1 + table2;
                  
                  document.getElementById('devoirsTable').innerHTML += totalTable;
                });
                
              }).catch((err) => {
                console.log("Eval is NOT present");
              });
              
            }
          }
          
          
        });
        
      }).catch(function(err) {
        console.log("Error: ", err);
      });
      
    });
    
    
  }).catch(function(err) {
    console.log("Error :", err);
  }); */
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    var fullName = docUser.data().firstName.substring(0,1);
    fullName = fullName + docUser.data().lastName;
    console.log(fullName);
    
    docUser.data().matieres.forEach(function(elem) {
      
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection(elem.matiere).get()
      .then(function(querySnapshot) {
        
        var nomMatiere = elem.matiere;
        if(nomMatiere.indexOf(' ') >= 0)
        {
          // console.log("true");
          nomMatiere = nomMatiere.replace(/\s+/g, '-');
        }
        
        nomMatiere = nomMatiere.replace('é', 'e');
        nomMatiere = nomMatiere.replace('è', 'e');
        console.log("ICI :"+ nomMatiere);
        querySnapshot.forEach(function(doc){
          
          if(doc.id != 'duration' && doc.id != 'Chapitre 1') 
          {
            var newNumeroChapitre = doc.data().numeroChapitre;
            if(newNumeroChapitre.indexOf(' ') >= 0)
            {
              // console.log("true");
              newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
            }
            console.log(newNumeroChapitre);

            var evalUrl = 'sujets_evaluations/'+docUser.data().idAdmin+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+".pdf";
            firebase.storage().ref(evalUrl).getDownloadURL().then(function(url) {
              //We now need to query students 
              var studentUrl = 'devoirs_ecrits/'+docUser.data().idAdmin+'_'+fullName+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+'.pdf';
              
              firebase.storage().ref(studentUrl).getDownloadURL().then(function(studUrl) {

              }).catch(function(error) {
                console.log("Error getting doc :", error);
                var table1 = '<tr><td>'+elem.matiere+' - '+doc.data().numeroChapitre+'</td>';
                var table2 = '<td>NON</td></tr>';
                
                var totalTable = table1 + table2;
                
                document.getElementById('devoirsTable').innerHTML += totalTable;
              });
            }).catch(function(err) {
              console.log("Error getting doc : ", err);
            });
          }   
        }); 
      }).catch(function(err) {
        console.log("Error : ", err);
      });  
    }); 
    
    
    /* firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).get()
    .then(function(doc) {
      
      if(doc.data().lastEvals != undefined)
      {
        var arrayMatieres = [];
        docUser.data().matieres.forEach(function(elem) {
          arrayMatieres.push(elem.matiere);
        });
        
        console.log(arrayMatieres);
        doc.data().lastEvals.forEach(function(elem) {
          if(arrayMatieres.includes(elem.matiere))
          {
            
            var nomMatiere = elem.matiere;
            if(nomMatiere.indexOf(' ') >= 0)
            {
              // console.log("true");
              nomMatiere = nomMatiere.replace(/\s+/g, '-');
            }
            
            nomMatiere = nomMatiere.replace('é', 'e');
            nomMatiere = nomMatiere.replace('è', 'e');
            // console.log("ICI :"+ nomMatiere);
            
            var newNumeroChapitre = elem.numeroChapitre;
            if(newNumeroChapitre.indexOf(' ') >= 0)
            {
              // console.log("true");
              newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
            }
            
            var evalUrl = 'sujets_evaluations/'+docUser.data().idAdmin+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+".pdf";
            // console.log(evalUrl);
            firebase.storage().ref(evalUrl).getDownloadURL().then(function(fileUrl) {
              console.log("Eval"+elem.matiere+"-"+elem.numeroChapitre+ "is present");
              //Here we can build a row and check if student has already uploaded his eval
              
              var studentUrl = 'devoirs_ecrits/'+docUser.data().idAdmin+'_'+fullName+'_'+nomMatiere+'_'+docUser.data().classe+'_'+newNumeroChapitre+'.pdf';
              firebase.storage().ref(studentUrl).getDownloadURL().then(function(fileUrl) {
                //Here the student already has uploaded the eval.
                var table1 = '<tr><td>'+elem.matiere+' - '+elem.numeroChapitre+'</td>';
                var table2 = '<td><i class="fas fa-check"></i></td></tr>';
                
                var totalTable = table1 + table2;
                
                document.getElementById('devoirsTable').innerHTML += totalTable;
                
              }).catch((err) => {
                //Here the student hasn't uploaded the eval yet.
                var table1 = '<tr><td>'+elem.matiere+' - '+elem.numeroChapitre+'</td>';
                var table2 = '<td>NON</td></tr>';
                
                var totalTable = table1 + table2;
                
                document.getElementById('devoirsTable').innerHTML += totalTable;
              });
              
            }).catch((err) => {
              console.log("Eval is NOT present");
            });
          }
        });
        
      }
      else {
        var table1 = '<tr><td>Aucun sujet</td>';
        var table2 = '<td><i class="fas fa-times"></i></td></tr>';
        
        var totalTable = table1 + table2;
        
        document.getElementById('devoirsTable').innerHTML += totalTable;
      }
      
    }).catch(function(err) {
      console.log("Error :", err);
    }); */
    
  }).catch(function(err) {
    console.log("Error: ", err);
  });
  
  
}

function initCopiesCorrigees() {
  
  var user = auth.currentUser
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    if(docUser.data().matieres != undefined)
    {
      var selectedMatiere = document.getElementById('selectMatiere');
      docUser.data().matieres.forEach(function(elem) {
        selectedMatiere.selectize.addOption({value: elem.matiere, text:elem.matiere});
        var  $select = $('select#selectMatiere').selectize();
        var control = $select[0].selectize;
        control.clear();
      });
    }
    
  }).catch(function(err) {
    console.log("Error : ", err);
  });
  
}

$('select#selectMatiere').on('change', function() {
  
  document.getElementById('corrigesTable').innerHTML = '';
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    var fullName = docUser.data().firstName.substring(0, 1)+docUser.data().lastName;
    var nomMatiere = $('select#selectMatiere').val();
    if(nomMatiere.indexOf(' ') >= 0)
    {
      nomMatiere = nomMatiere.replace(/\s+/g, '-');
    }
    nomMatiere = nomMatiere.replace('é', 'e');
    nomMatiere = nomMatiere.replace('è', 'e');
    
    firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(docUser.data().classe).collection($('select#selectMatiere').val()).get()
    .then(function(querySnapshot) {
      
      querySnapshot.forEach(function(doc) {
        
        if(doc.id != 'duration' && doc.id != 'Chapitre 1')
        {
          //For every chapter different than 'duration', we check in storage if the corrected copy is present.
          //If so we display
          var newNumeroChapitre = doc.data().numeroChapitre;
          if(newNumeroChapitre.indexOf(' ') >= 0)
          {
            newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
          }
          var fileUrl = "devoirs_corriges/"+docUser.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+docUser.data().classe+"_"+newNumeroChapitre+".pdf";
          firebase.storage().ref(fileUrl).getDownloadURL().then(function(url) {
            //The file is present, we display
            var table1 = '<tr><td>'+doc.data().numeroChapitre+'</td>';
            var table2 = '<td><a href="'+url+'" target="_blank"><button class="btn bg-school-plus btn-min-width text-bold-600" type="button">Télécharger</button></a></td></tr>';
            
            var totalTable = table1 + table2;
            
            document.getElementById('corrigesTable').innerHTML += totalTable;
          }).catch(function(err) {
            console.log("Error : ", err);
            //The file doesn't exists, we do nothing
          });
        }
      });
    }).catch(function(err) {
      console.log("Error : ", err);
    });
    
  }).catch(function(err) {
    console.log("Error : ", err);
  });
  
});

