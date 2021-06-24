// //DEV
// var firebaseConfig = {
//   apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
//   authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
//   databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
//   projectId: "schoolplus-dev-e8a2d",
//   storageBucket: "schoolplus-dev-e8a2d.appspot.com",
//   messagingSenderId: "330523876306",
//   appId: "1:330523876306:web:cbdcee87b7e3e007"
// };
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


//Initialize variables to get HTML elements
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const btnValidateForm = document.getElementById('btnValidateForm');
const createUserForm = document.getElementById('createUserForm');
const selectedClass = document.getElementById('selectClass');
const selectedClassTeacher = document.getElementById('selectClassTeacher');
const selectedModifyUser = document.getElementById('selectModifyUser');
const selectedModifyType = document.getElementById('selectModifyType');
const selectedModifyClass = document.getElementById('selectModifyClass');
const selectedModifyClassTeacher = document.getElementById('selectModifyClassTeacher');
const modifyAdresse = document.getElementById('modifyAdresse');
const modifyLastName = document.getElementById('modifyLastName');
const modifyFirstName = document.getElementById('modifyFirstName');
const collegeLyceeModifySection = document.getElementById('collegeLyceeModifySection');
const collegeLyceeModifySectionTeacher = document.getElementById('collegeLyceeModifySectionTeacher');
const matieresSection = document.getElementById('matieresSection');

const parameters = location.search.substring(1).split("&");
const temp = parameters[0].split("=");
const moduleValue = decodeURI(temp[1]);


//Fix the navbar clicking and hovering bug
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
// -------------------------------------



function setPageModules(moduleValue) {
  switch(moduleValue) {
    case 'addUser':
      document.getElementById('addUser').style.display = "block";
      document.getElementById('modifyUser').style.display = 'none';
      document.getElementById('modifyStudent').style.display = "none";
      document.getElementById('soutienTeacher').style.display = 'none';
      break;
    case 'modifyUser':
      document.getElementById('addUser').style.display = "none";
      document.getElementById('modifyUser').style.display = 'block';
      document.getElementById('modifyStudent').style.display = "none";
      document.getElementById('soutienTeacher').style.display = 'none';
      break;
    case 'subjectStudent':
      document.getElementById('addUser').style.display = "none";
      document.getElementById('modifyUser').style.display = 'none';
      document.getElementById('modifyStudent').style.display = "block";
      document.getElementById('soutienTeacher').style.display = 'none';
      break;
    case 'soutienTeacher':
      document.getElementById('addUser').style.display = "none";
      document.getElementById('modifyUser').style.display = 'none';
      document.getElementById('modifyStudent').style.display = "none";
      document.getElementById('soutienTeacher').style.display = 'block';
      break;
  }
}


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
    console.log("IS DEV: ", doc.data().dev);
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function(avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });   
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

// Add a realtime listener for Firebase Authentification
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
        setPageModules(moduleValue);
        getUserInfo();
        getUserNotif();
        setModifyStudent()
        setTeacherList();
        setModificationList(doc.data().instituteName);
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

//GOOD
function addNewUser(instituteCategory, newUserCategory, newUserEmail, newUserFirstName, newUserLastName, instituteName)
{
  var user = auth.currentUser;
  
  if(newUserCategory == "student")
  {
    firestore.collection('users_temp').doc(newUserEmail)
    .set({    //, newUserCategory, newUserEmail, newUserFirstName, newUserLastName
      userCategory: newUserCategory,
      firstName: newUserFirstName,
      lastName: newUserLastName,
      email: newUserEmail,
      // instituteCategory: instituteCategory,
      instituteName: instituteName,
      idAdmin: user.uid,
      soutien: true
    }).then(function(docRef) {
      // console.log("New id : "+ docRef.id);
    }).catch(function(err) {
      console.log("Error creating new doc ", err)
    });
  } else if(newUserCategory == "teacher")
  {
    firestore.collection('users_temp').doc(newUserEmail)
    .set({    
      userCategory: newUserCategory,
      firstName: newUserFirstName,
      lastName: newUserLastName,
      email: newUserEmail,
      // instituteCategory: instituteCategory,
      instituteName: instituteName,
      idAdmin: user.uid,
      soutien: true
    }).then(function(docRef) {
      // console.log("New id : "+ docRef.id);
    }).catch(function(err) {
      console.log("Error creating new doc ", err)
    });
  }
  
  
  // console.log($('select#selectClassTeacher').val());
  
}

function setModifyStudent() {

  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
  .then(function(docAdmin) {

    firestore.collection('users').where('instituteName', '==', docAdmin.data().instituteName).where('userCategory', '==', 'student').where('soutien', '==', true).get()
    .then(function(querySnapshot) {

      querySnapshot.forEach(function(doc) {

        if(!docAdmin.data().dev)
        {
          if(!docAdmin.data().testAccounts.includes(doc.id)) 
          {
            document.getElementById('selectStudent').selectize.addOption({value: doc.data().id, text: doc.data().firstName+' '+doc.data().lastName});
            var  $select = $('select#selectStudent').selectize();
            var control = $select[0].selectize;
            control.clear();
          }
        }
        else
        {
          document.getElementById('selectStudent').selectize.addOption({value: doc.data().id, text: doc.data().firstName+' '+doc.data().lastName});
          var  $select = $('select#selectStudent').selectize();
          var control = $select[0].selectize;
          control.clear();
        }
        

      });
    }).catch(function(err) {
      console.log("Error : ", err);
    });
  }).catch(function(err) {
    console.log("Error : ", err);
  });
}

function setTeacherList() {

  var user = auth.currentUser;

  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {
    //We get the instituteName
    //We get all teacher of the institute
    firestore.collection('users').where('instituteName', '==', docUser.data().instituteName).where('userCategory', '==', 'teacher').get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        if(doc.data().soutien != true)
        {
          if(!docUser.data().dev)
          {
            if(!docUser.data().testAccounts.includes(doc.id))
            {
              document.getElementById('selectTeacher').selectize.addOption({value: doc.data().id, text: doc.data().firstName+' '+doc.data().lastName});
              var $select = $('select#selectTeacher').selectize();
              var control = $select[0].selectize;
              control.clear();
            }
          }
          else
          {
            document.getElementById('selectTeacher').selectize.addOption({value: doc.data().id, text: doc.data().firstName+' '+doc.data().lastName});
            var $select = $('select#selectTeacher').selectize();
            var control = $select[0].selectize;
            control.clear();
          }
          
        }

      });
    }).catch(function(err) {
      console.log("Error :" , err);
    });


  }).catch(function(err) {
    console.log("Error :" ,err);
  });
}

$('select#selectStudent').on('change', function() {

  if($('select#selectStudent').val() != '')
  {
    if(matieresSection.innerHTML == '')
    {
      $.ajax({
        type:'GET',
        url: '../../assets/json/filieres.json'
      }).then(function(data) {
        for(var i=0; i<data.filieres[0].matieres.length; i++)
        {
          // console.log(data.filieres[0].matieres[i]);
          matieresSection.innerHTML+= "<div class='checkbox'><input type='checkbox'name='matieresStudent' val='"+data.filieres[0].matieres[i]+"'  id='"+data.filieres[0].matieres[i]+"_Student' class='switchery'><label for='"+data.filieres[0].matieres[i]+"'> &nbsp" +data.filieres[0].matieres[i]+"</label></div>";
          
        }  
        var elems = Array.prototype.slice.call(document.querySelectorAll('input[name="matieresStudent"]'));
        elems.forEach(function(html) {
          var switchery = new Switchery(html);
        });
  
        firestore.collection('users').doc($('select#selectStudent').val()).get()
        .then(function(docUser) {
          if(docUser.data().matieres != '')
          {
            docUser.data().matieres.forEach(function(elem) {
              console.log("LOOK", elem.matiere);
              $("[id='"+elem.matiere+"_Student']").click();
            });
          }
        }).catch(function(err) {
          console.log("Error : ", err);
        });
  
      });
    }
    else
    {
      $('input[name="matieresStudent"]:checked').click();
      firestore.collection('users').doc($('select#selectStudent').val()).get()
        .then(function(docUser) {
          if(docUser.data().matieres != '')
          {
            docUser.data().matieres.forEach(function(elem) {
              console.log("LOOK", elem.matiere);
              $("[id='"+elem.matiere+"_Student']").click();
            });
          }
        }).catch(function(err) {
          console.log("Error : ", err);
        });
    }
  }

});

$('#modifyClassForm').submit(function(ev) {
  var user = auth.currentUser;
  ev.preventDefault();
  var val= [];
  var val2 = [];
  var matieresToDelete = [];
  var notExistingMatieres = [];
  var fbClassMatieres = [];
  var fbStudentMatieres = [];
  var fbStudentMatieresLabels = [];
  var collectionToCreate = [];
  var fbMatieres= [] 
  $('input[name="matieresStudent"]:checked').each(function(i) {
    val[i]={ matiere : $(this).attr('val'), timeDone: 0, timeValidated:0 };
    val2[i] = $(this).attr('val');
    
  });
  
  firestore.collection('users').doc($('select#selectStudent').val()).get()
  .then(function(doc) {

    if(doc.data().matieres != undefined && doc.data().matieres.length > 0)
    {
      doc.data().matieres.forEach(function(elem) {
      fbStudentMatieres.push(elem); // We copy the array obtained from user doc to use it later
      fbStudentMatieresLabels.push(elem.matiere); //We copy all matieres labels to make the comparison easier
    });
    
    //We have to check for case 1, case 2 or case 3
    
    if(val2.length > fbStudentMatieres.length) //Case 1 : We add 1 or more fields
    {
      val2.forEach(function(elem) {
        if(!fbStudentMatieresLabels.includes(elem))
        {
          fbStudentMatieres.push({matiere: elem, timeDone: 0, timeValidated:0});
        }
      });
    }
    else if(val2.length < fbStudentMatieres.length) //Case 2 : We remove 1 or more fields
    {
      fbStudentMatieres.forEach(function(elem) {
        if(!val2.includes(elem.matiere))
        {
          fbStudentMatieres = fbStudentMatieres.filter(function(value) {
            return value !== elem;
          });
          matieresToDelete.push(elem.matiere);
        }
      });
      
    }
    else if(val2.length == fbStudentMatieres.length) // Case 3 : We might have replaced 1 or more fields with another/others
    {
      val2.forEach(function(elem) {
        if(!fbStudentMatieresLabels.includes(elem))
        {
          fbStudentMatieres.push({matiere: elem, timeDone: 0, timeValidated:0});
        }
      });
      
      fbStudentMatieres.forEach(function(elem) {
        if(!val2.includes(elem.matiere))
        {
          fbStudentMatieres = fbStudentMatieres.filter(function(value) {
            return value !== elem;
          });
          matieresToDelete.push(elem.matiere);
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
    }).then(function() {
      console.log("Class added on student's document");
    }).catch(function(err) {
      console.log("Error writing : ", err);
    });
    } else if(doc.data().matieres == undefined || doc.data().matieres.length == 0)
    {
      console.log("doc doesn't exist yet");
      firestore.collection('users').doc($('select#selectStudent').val())
      .set({
        matieres: val
      },
      {
        merge: true
      }).then(function() {
        console.log("Student didn't have matiere array in his doc but now he does");
      }).catch(function(err) {
        console.log("Error :", err);
      });
    }
    console.log("Should enter the foreach");
    console.log("Matieres tobeDeleted");
    console.log(matieresToDelete);
    matieresToDelete.forEach(function(elem) {
      // console.log('HEY4', elem);
      console.log("About to delete :", elem);
      firestore.collection('users').doc($('select#selectStudent').val()).collection(elem).doc('duration').get()
      .then(function(doc) {
        console.log(elem);
        if(doc.exists)
        {
          firestore.collection('users').doc($('select#selectStudent').val()).collection(elem).doc('duration').delete()
          .then(function() {
            console.log(elem+ " deleted");
          });
        }
      }).catch(function(err) {
        console.log("Error : ", err);
      });
    });
  

  }).catch(function(err){
    console.log("Error :", err);
  });
  
 

  val2.forEach(function(elem) {

    firestore.collection('users').doc($('select#selectStudent').val()).collection(elem).doc('duration').get()
    .then(function(doc) {

      if(!doc.exists)
      {
        firestore.collection('users').doc($('select#selectStudent').val()).collection(elem).doc('duration')
        .set({
          nbOfHours : 0,
          timeDone: 0
        }).catch(function(err) {
          console.log("Error : " ,err);
        });
      }

      

    }).catch(function(err) {
      console.log("Error : ", err);
    });

  });

  console.log(matieresToDelete);

  for(var i =0; i<matieresToDelete.length; i++)
  {
    console.log('hey'+matieresToDelete[i]);
  }



  
  
  // ICI
  
  
  //Check in firebase is collection already exists
  
  /* firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).get()
  .then(function(doc) {
    fbClassMatieres = doc.data().matieres;
    val2.forEach(function(elem) {
      if(!fbClassMatieres.includes(elem))
      {
        fbClassMatieres.push(elem);
        collectionToCreate.push(elem);
      }
    });
    firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val())
    .update({
      matieres: fbClassMatieres
    }).catch(function(er ){
      console.log("Error while updating : ", er);
    });
    collectionToCreate.forEach(function(elem) {
      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection(elem).doc('duration')
      .set({
        duration: 0
      }).then(function() {
        console.log("Collections created");
      }).catch(function(err) {
        console.log("Error : ",err);
      });
    });
    
    console.log("Look here NOW " +collectionToCreate);
  }).catch(function(err) {
    console.log("Error :",err);
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
  },function(isConfirm) {
    if(isConfirm)
    {
      $('input[name="matieresStudent"]:checked').click();
      var $select = $('select#selectStudent').selectize();
      var control = $select[0].selectize;
      control.clear();
    }
  });
  
  // console.log("ModifyClassForm submietted");
});

//GOOD à rechecker quand les user seront définitivement inscrits
function setModificationList(instituteName){
  var user = auth.currentUser;
  
  firestore.collection('users_temp').where('instituteName', '==', instituteName).where('soutien', '==', true).get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc){
      if(doc.exists)
      {
        selectedModifyUser.selectize.addOption({value: doc.data().email, text: doc.data().firstName+ " "+doc.data().lastName});
        // selectedModifyUser.selectize.addItem(doc.data().email);
        var  $select = $('select#selectModifyUser').selectize();
        var control = $select[0].selectize;
        control.clear();
      }
      
    });
  }).catch(function (err) {
    console.log("Error : ", err);
  });
  
  firestore.collection('users').doc(user.uid).get()
  .then(function(docUser) {

    firestore.collection('users').where('instituteName', '==', instituteName).where('soutien', '==', true).get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc2) {
        if(doc2.exists)
        {
          if(doc2.data().userCategory != "admin")
          {

            if(!docUser.data().dev)
            {
              if(!docUser.data().testAccounts.includes(doc2.id))
              {
                selectedModifyUser.selectize.addOption({value: doc2.data().email, text: doc2.data().firstName+ " "+doc2.data().lastName});
                // selectedModifyUser.selectize.addItem(doc.data().email);
                var  $select = $('select#selectModifyUser').selectize();
                var control = $select[0].selectize;
                control.clear();
              }
            }
            else
            {
              selectedModifyUser.selectize.addOption({value: doc2.data().email, text: doc2.data().firstName+ " "+doc2.data().lastName});
              // selectedModifyUser.selectize.addItem(doc.data().email);
              var  $select = $('select#selectModifyUser').selectize();
              var control = $select[0].selectize;
              control.clear();
            }
            
          }
        }
      });
    }).catch(function(err){
      console.log("Error : ", err);
    });

  }).catch(function(err) {
    console.log("Error: ", err);
  });

  

}

//GOOD
function clearCreationForm()
{
  document.getElementById('createLastName').value = "";
  document.getElementById('createFirstName').value ="";
  document.getElementById('createAdresse').value ="";
  var  $select = $('select#selectType').selectize();
  var control = $select[0].selectize;
  control.clear();
}

//GOOD
function clearModifyForm()
{
  modifyAdresse.value ="";
  modifyFirstName.value ="";
  modifyLastName.value ="";
  var  $select = $('select#selectModifyType').selectize();
  var control = $select[0].selectize;
  control.clear();
  document.getElementById('selectModifyUser').selectize.clearOptions();
  var $select2 = $('select#selectModifyUser').selectize();
  var control2 = $select2[0].selectize;
  control2.clear();
  
}

//GOOD
$('select#selectModifyUser').on('change', function() {
  
  // console.log($('select#selectModifyUser').val())
  if($('select#selectModifyUser').val() != "") 
  {
    // console.log($('select#selectModifyUser').val());
    firestore.collection('users_temp').doc($('select#selectModifyUser').val()).get()
    .then(function(doc) {
      if(doc.exists)
      {
        modifyFirstName.value = doc.data().firstName;
        modifyLastName.value = doc.data().lastName;
        var $select = $('select#selectModifyType').selectize();  // This initializes the selectize control
        var selectize = $select[0].selectize;
        selectize.setValue(doc.data().userCategory);
        modifyAdresse.value = doc.data().email;
      } else 
      {
        console.log("The document isn't in temp collection, you should check into users");
        firestore.collection('users').where("email", "==",$('select#selectModifyUser').val()).get()
        .then(function(querySnapshot) {
          
          querySnapshot.forEach(function(doc2) {
            if(doc2.exists){
              console.log("THE DOCU EXISTS");
              modifyFirstName.value = doc2.data().firstName;
              modifyLastName.value = doc2.data().lastName;
              var $select = $('select#selectModifyType').selectize();  // This initializes the selectize control
              var selectize = $select[0].selectize;
              selectize.setValue(doc2.data().userCategory);
              modifyAdresse.value = doc2.data().email;
            } else {
              console.log("IT DOESNT EXIST");
            }
          });
        }).catch(function(err) {
          console.log("Error :", err);
        });
      }
    }).catch(function(err) {
      console.log("Error : ", err);
    });
  } 
});

$('#btnValidateModifyForm').click(function() {
  var user = auth.currentUser;
  
  if($('select#selectModifyUser').val() == "" ||  modifyFirstName.value == "" || modifyLastName.value == "" || $('select#selectModifyType').val() == "" || modifyAdresse.value == "" )     
  {
    alert("Vous avez oublié de remplir un ou plusieurs champs");
  } else {
    firestore.collection('users_temp').doc($('select#selectModifyUser').val()).get()
    .then(function(docUser) {
      if(docUser.exists)
      {
        //Document is in the temp collection
        if(docUser.data().email == modifyAdresse.value)
        {
          //Email adress is the same, we only need to update doc
          firestore.collection('users_temp').doc($('select#selectModifyUser').val())
          .update({
            firstName: modifyFirstName.value,
            lastName: modifyLastName.value,
            email: modifyAdresse.value,
            userCategory: $('select#selectModifyType').val()
          }).then(function() {
            console.log("Document updated successfully.");
            clearModifyForm()
            setModificationList(docUser.data().instituteName);
          }).catch(function(err) {
            console.log("Error while updating document : ", err);
          });
        }
        else
        {
          //Email adress is different than previously. We need to create a new temp doc and delete the old one
          firestore.collection('users_temp').doc(modifyAdresse.value)
          .set({
            firstName: modifyFirstName.value,
            lastName: modifyLastName.value,
            email: modifyAdresse.value,
            soutien: true,
            instituteName: docUser.data().instituteName,
            userCategory: $('select#selectModifyType').val(),
            idAdmin: user.uid
          }).then(function() {
            console.log("Document replaced.");
            firestore.collection('users_temp').doc($('select#selectModifyUser').val()).delete();
            clearModifyForm();
            setModificationList(docUser.data().instituteName);
          }).catch(function(err) {
            console.log("Error : ", err);
          });
        }      
      }
      else
      {
        //Document is in the users collection
        firestore.collection('users').doc($('select#selectModifyUser').val()).get()
        .then(function(doc) {
          if(doc.exists)
          {
            if(doc.data().email == modifyAdresse.value)
            {
              //We just need to update the document
              firestore.collection('users').doc($('select#selectModifyUser').val())
              .update({
                firstName: modifyFirstName.value,
                lastName: modifyLastName.value,
                email: modifyAdresse.value,
                userCategory: $('select#selectModifyType').val()
              }).then(function() {
                console.log("Document updated successfully.");
                clearModifyForm();
                setModificationList(doc.data().instituteName);
              }).catch(function(err) {
                console.log("Error while updating: ", err);
              });
            }
            else
            {
              firestore.collection('users').doc(modifyAdresse.value)
              .set({
                firstName: modifyFirstName.value,
                lastName: modifyLastName.value,
                email: modifyAdresse.value,
                soutien: true,
                instituteName: doc.data().instituteName,
                userCategory: $('select#selectModifyType').val(),
                idAdmin: user.uid
              }).then(function() {
                console.log("Document recreated successfully.");
                firestore.collection('users').doc($('select#selectModifyUser').val()).delete();
                clearModifyForm();
                setModificationList(doc.data().instituteName);
              }).catch(function(err) {
                console.log("Error: ", err);
              });
            }
          }
        }).catch(function(err) {
          console.log("Error : ", err);
        });     
      }
    }).catch(function(err) {
      console.log("Error : ", err);
    });
    
  }
  
});

//GOOD
$('#btnValidateForm').click(function() {
  var user = auth.currentUser;
  var createFirstName = document.getElementById('createFirstName').value;
  var createLastName = document.getElementById('createLastName').value;
  var selectType = document.getElementById('selectType').value;
  var createEmail = document.getElementById('createAdresse');
  // var createClasse = document.getElementById('createClasse').value;
  
  if(createFirstName == "" || createLastName == "" || selectType == "" || createEmail.value =="")
  {
    alert('Vous avez oublié de remplir un ou plusieurs champs');
  } else 
  {
    if(createEmail.checkValidity())
    {
      console.log("1st setp");
      //ev.preventDefault();
      swal({
        title: "Ajouter un nouvel utilisateur ?",
        text: "En cas d'erreur sur les informations indiquées, vous pourrez toujours les modifier plus tard.",
        type: "warning",
        html: true,
        showCancelButton: true,
        confirmButtonColor: "#44DA74",
        confirmButtonText: "Valider",
        cancelButtonText: "Annuler",
        closeOnConfirm: false,
        closeOnCancel: false
      }, function(isConfirm) {
        if(isConfirm)
        {
          firestore.collection('users').doc(user.uid).get()
          .then(function(doc) {
            addNewUser(doc.data().instituteCategory,selectType, createEmail.value,createFirstName, createLastName, doc.data().instituteName);
            createUserForm.submit();
            clearCreationForm();
          }).catch(function(err) {
            console.log("error : ",err);
          })
          swal({
            title: "Un nouvel utilisateur a été ajouté",
            text: "Un email contenant le lien d'inscription a été envoyé à l'adresse <i>"+createEmail.value+"</i>",
            type:"success",
            html:true
          });
        } else {
          swal("Annulation", "L'utilisateur n'a pas été ajouté", "error");  
        }
      });
    }// end if
    else {
      alert("L'adresse email n'est pas valide");
    } 
  }
});

$('#btnSoutien').click(function() {

  

  if($('select#selectTeacher').val() != '')
  {
    var user = auth.currentUser;
    firestore.collection('users').doc($('select#selectTeacher').val()).set({
      soutien: true
    },
    {
      merge: true
    }).then(function() {
      firestore.collection('users').doc($('select#selectTeacher').val()).get()
      .then(function(doc) {
        swal({
          title: "Modification prise en compte",
          text: "Les fonctionnalités du soutien scolaires ont bien été attribuées à <i>"+doc.data().firstName+' '+doc.data().lastName+"</i>",
          type:"success",
          html:true
        });
        document.getElementById('selectTeacher').selectize.clearOptions();
        setTeacherList();
      }).catch(function(err) {
        console.log("Error :" , err);
      });
      
    }).catch(function(err) {
      console.log("Error :" ,err);
    });
  }

});