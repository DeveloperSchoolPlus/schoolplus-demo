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
const navMenu = document.getElementById('main-menu-navigation');
const profilPicUser = document.getElementById('profilepic');
const tabMatieres = document.getElementById('tabMatieres');
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
        setUserInterface(doc.data().soutien);
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
    console.log("IS DEV : ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    
    doc.data().matieres.forEach(function(elem) {
      selectedMatiere.selectize.addOption({value: elem, text: elem});
      var $select = $('select#selectMatiere').selectize();
      var control = $select[0].selectize;
    });
    
    doc.data().classe.forEach(function(elem) {
      selectedClass.selectize.addOption({value: elem, text: elem});
      var $select = $('select#selectClass').selectize();
      var control = $select[0].selectize;
    });   
    
  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });
  
}

function setUserInterface(soutien) {
  // console.log("set user interface");
  
  
  

    if(soutien == undefined)
    {
    navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboard.php"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item active"><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span data-i18n="nav.dash.main">Devoirs</span></a></li>';
    navMenu.innerHTML += '<li data-menu="dropdown" class="dropdown nav-item"><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilan</span></a></li>';
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
      var nav11 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a><ul class="dropdown-menu"><li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sophia</span></a></li><li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Sam</span></a></li><li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Noé</span></a></li><li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Thomas</span></a></li><li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1"  class="dropdown-item"><span data-i18n="nav.dash.main">Timéo</span></a></li></ul></li>';
      
      
      
      
      
      navMenu.innerHTML = nav1+nav2+nav3+nav4+nav5+nav6+nav7+nav8+nav9+nav10+nav11;
      
      rightMenu.innerHTML = '<a href="mes-eleves.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves</a>';
      rightMenu.innerHTML += '<a href="mes-eleves-soutien.php" class="dropdown-item"><i class="fas fa-users"></i> Mes élèves - Soutien</a>';
      rightMenu.innerHTML += '<a href="personnel-etablissement.php" class="dropdown-item"><i class="fas fa-users"></i> Personnel établissement</a>';

    }
    
   
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

}

$('select#selectMatiere').on('change', function() {
  var user = auth.currentUser;
  
  if($('select#selectClass').val() != '' && $('select#selectChapter').val() != '')
  {
    console.log("Good to get exams");
    //We can init chapters
    firestore.collection('users').doc(user.uid).get()
    .then(function(doc) {
      document.getElementById('basicContainer').innerHTML ="";
      initChapters(doc.data().instituteName)
    }).catch(function(err) {
      console.log("Error :",err);
    });
    
  } else {
    console.log("Not good yet, something's missing");
  }
  
});

$('select#selectClass').on('change', function() {
  var user = auth.currentUser;
  
  if($('select#selectMatiere').val() != '' && $('select#selectChapter').val() != '')
  {
    console.log("Good to get exams");
    //We can init chapters
    firestore.collection('users').doc(user.uid).get()
    .then(function(doc) {
      document.getElementById('basicContainer').innerHTML ="";
      initChapters(doc.data().instituteName)
    }).catch(function(err) {
      console.log("Error :",err);
    });
    
  } else {
    console.log("Not good yet, something's missing");
  }
});

$('select#selectChapter').on('change', function() {
  
  if($('select#selectClass').val() != '' && $('select#selectMatiere').val() != '')
  {
    alert("Good to get exams");
  } else {
    alert("Not good yet, something's missing");
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

function initChapters(instituteName) {
  var user = auth.currentUser;  
  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"
  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time'>";
  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Compétences attendues</h4><p class='card-text text-xs-left'>";
  var sponshtml6 = "</p><p> </p><h6 class=' card-title text-bold-600'>Les challenges</h4><p class='card-text text-xs-left'>";
  var sponshtml7 = "</p><p> </p><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'>";
  var sponshtml8 = "</span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div><div><progress value='0' max='100' class='progress progress-md progress-info progress";
  var sponshtml9 = "'></progress></div></div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='33%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600'type='button' ";
  var sponshtml10 = " onclick='showExams(\"";
  var sponshtml11 = "\");'>Consulter les copies</button></th><th width='33%' style='text-align: center'></th><th style='text-align: center' width='33%'><button class='btn bg-school-plus btn-min-width text-bold-600'type='button' ";
  var sponshtml12 = " onclick='showCorrectedCopies(\"";
  var sponshtml13 = "\");'>Dépôt des copies corrigées</button></th></tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";
  
  firestore.collection('users').where("userCategory", "==", "admin").where('instituteName', '==', instituteName).get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      firestore.collection('users').doc(doc.data().id).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
      .then(function(querySnapshot2) {
        chapterCount = querySnapshot2.size;
        querySnapshot2.forEach(function(doc2) {
          if(doc2.data().numeroChapitre != undefined){
            if(doc2.id != 'duration')
            {
              html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
              + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + "" + sponshtml9 + sponshtml10 +doc2.data().numeroChapitre + sponshtml11 +  sponshtml12 + doc2.data().numeroChapitre+ sponshtml13;
              
              addElement('basicContainer', 'div', html);
            }
          }
        });
      }).catch(function(err) {
        console.log("Error :", err);
      });
    }); 
  }).catch(function(err) {
    console.log("Error :", err);
  });
}

function showExams(numeroChapitre) 
{
  var user = auth.currentUser;
  document.getElementById('okBtn').style.display = 'inline';
  document.getElementById('submitBtn').style.display = 'none';
  //Rebuild table header
  document.getElementById('modalTitle').innerText = "Devoirs - "+numeroChapitre;
  document.getElementById('modalClass').innerText = $('select#selectClass').val();
  var tableHeader = "<tr><th width='70%' style='text-align: left !important;'>Nom et prénom de l'élève</th><th width='15%'>Sujet écrit</th><th width='15%'>Sujet oral</th></tr>";                                
  document.getElementById('tableDevoirs').innerHTML = tableHeader
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    
    firestore.collection('users').where("instituteName", "==", docUser.data().instituteName).where("userCategory", "==", "student").where("classe", "==", $('select#selectClass').val()).get()
    .then(function(querySnapshot) {
      
      querySnapshot.forEach(function(doc) {

        if(!docUser.data().dev && docUser.data().dev != undefined)
        {
          if(!docUser.data().testAccounts.includes(doc.id))
          {
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
              var table1 = "<tr><td width='70%'>"+doc.data().firstName+" "+doc.data().lastName+"</td>";
              var table2 = "<td width='15%' style='text-align: center;'id='"+doc.data().id+"WrittenTd'><a href='' id='"+doc.data().id+"WrittenLink' target='_blank'><button class='btn bg-school-plus btn-min-width text-bold-600' type='button'>Télécharger</button></a></td>";
              var table3 = "<td style='text-align: center;' width='15%'id='"+doc.data().id+"OralTd' ><a href='' id='"+doc.data().id+"OralLink' target='_blank'><button class='btn bg-school-plus btn-min-width text-bold-600' type='button'>Télécharger</button></a></td></tr>";
              var totalTable = table1 + table2 + table3;
              
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
              var pdfURL = "devoirs_ecrits/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".pdf";
              //Now that we built the url we can start downloading the file
              firebase.storage().ref(pdfURL).getDownloadURL().then(function(url) {
                document.getElementById(doc.data().id+"WrittenLink").href = url;
              }).catch(function(err) {
                console.log("Error :", err);
                document.getElementById(doc.data().id+"WrittenTd").innerHTML = 'Aucun sujet écrit déposé.'
              });
              
              var mp3URL = "devoirs_oraux/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".mp3";
              firebase.storage().ref(mp3URL).getDownloadURL().then(function(url) {
                document.getElementById(doc.data().id+"OralLink").href = url;
              }).catch(function(err) {
                console.log("Error :", err);
                document.getElementById(doc.data().id+"OralTd").innerHTML = 'Aucun sujet oral déposé.'
              });
            }
          }
        }
        else
        {
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
            var table1 = "<tr><td width='70%'>"+doc.data().firstName+" "+doc.data().lastName+"</td>";
            var table2 = "<td width='15%' style='text-align: center;'id='"+doc.data().id+"WrittenTd'><a href='' id='"+doc.data().id+"WrittenLink' target='_blank'><button class='btn bg-school-plus btn-min-width text-bold-600' type='button'>Télécharger</button></a></td>";
            var table3 = "<td style='text-align: center;' width='15%'id='"+doc.data().id+"OralTd' ><a href='' id='"+doc.data().id+"OralLink' target='_blank'><button class='btn bg-school-plus btn-min-width text-bold-600' type='button'>Télécharger</button></a></td></tr>";
            var totalTable = table1 + table2 + table3;
            
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
            var pdfURL = "devoirs_ecrits/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".pdf";
            //Now that we built the url we can start downloading the file
            firebase.storage().ref(pdfURL).getDownloadURL().then(function(url) {
              document.getElementById(doc.data().id+"WrittenLink").href = url;
            }).catch(function(err) {
              console.log("Error :", err);
              document.getElementById(doc.data().id+"WrittenTd").innerHTML = 'Aucun sujet écrit déposé.'
            });
            
            var mp3URL = "devoirs_oraux/"+doc.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+doc.data().classe+"_"+newNumeroChapitre+".mp3";
            firebase.storage().ref(mp3URL).getDownloadURL().then(function(url) {
              document.getElementById(doc.data().id+"OralLink").href = url;
            }).catch(function(err) {
              console.log("Error :", err);
              document.getElementById(doc.data().id+"OralTd").innerHTML = 'Aucun sujet oral déposé.'
            });
          }
        }
      });
    }).catch(function(err) {
      console.log("Error :", err);
    });
  }).catch(function(err) {
    console.log("Error :", err);
  });                                   
  
  $('#modalDevoirs').modal();
  // console.log(numeroChapitre);
}

function showCorrectedCopies(numeroChapitre)
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

        if(!docUser.data().dev && docUser.data().dev != undefined)
        {
          if(!docUser.data().testAccounts.includes(doc.id))
          {
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
          }
        }
        else
        {
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
  
}

function uploadCorrectedCopies(id, numeroChapitre) {
  
  var user = auth.currentUser;
  console.log("ID which will be used for the upload :"+ id);
  var theFile = document.getElementById(id).files[0];
  var storageRef = firebase.storage().ref();
  console.log('THE FILE : '+ theFile.name);
  
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
  
  if(theFile.type == 'application/pdf')
  {
    firestore.collection('users').doc(id).get()
    .then(function(docUser) {
      var newFirstName = docUser.data().firstName.substring(0,1);
      var fullName = newFirstName+docUser.data().lastName;
      
      var uploadTask = storageRef.child("devoirs_corriges/"+docUser.data().idAdmin+"_"+fullName+"_"+nomMatiere+"_"+$('select#selectClass').val()+"_"+newNumeroChapitre+".pdf").put(theFile);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
        // We upload
        console.log(id+"Btn")
        document.getElementById(id+"Btn").style.display = 'none';
        document.getElementById(id+'ErrorMessage').style.display = 'none';
        document.getElementById('loading'+id).style.display = 'inline';
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
        uploadTask.snapshot.ref.getDownloadURL().then(function(URL) {
          //Once uploaded we download
          document.getElementById(docUser.data().id+"Btn").style.display = 'block';
          document.getElementById(docUser.data().id+"WrittenLink").href = URL;
          document.getElementById('loading'+docUser.data().id).style.display = 'none';
        });
      });
      
    }).catch(function(err) {
      console.log("Error :", err);
    });
  }
  
}

$('#noteForm').submit(function(ev) {
  
  ev.preventDefault();
  var user = auth.currentUser;
  var chapterNumber = document.getElementById('hiddenChapterNumber').innerText;
  var arrayNotes = [];
  
  $('input[name="inputNote"]').each(function(){
    
    console.log("USER ID: "+$(this).attr('id').substring(0, $(this).attr('id').length-4));
    console.log("NOTE: ", $(this).val());
    console.log("NOTE CONVERTIE: "+ parseFloat($(this).val()));
    console.log("TYPE OF: ", typeof parseFloat($(this).val()));
    
    if($(this).val() == 'NN')
    {
      arrayNotes.push({id: $(this).attr('id').substring(0, $(this).attr('id').length-4), note: $(this).val()});

    }
    else
    {
      arrayNotes.push({id: $(this).attr('id').substring(0, $(this).attr('id').length-4), note: parseFloat($(this).val())});
    }
    
  });
  
  console.log("This is the final array");
  console.log(arrayNotes);
  console.log("Numero du chapitre :", chapterNumber);
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(chapterNumber)
    .set({
      notes: arrayNotes
    },
    {
      merge: true
    }).then(function() {
      console.log("Document updated.");
      $('#modalDevoirs').modal("hide");
    }).catch(function(err) {
      console.log("Error :", err);
    });
  }).catch(function(err) {
    console.log("Error :", err);
  });  
});

$('input[name="inputNote"]').on('change', function() {
  alert("changed");
});


