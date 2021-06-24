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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const urlFormation = urlParams.get('formation');
const urlTheme = urlParams.get('theme');
const urlOI = urlParams.get('oi');

console.log(urlFormation);
console.log(urlTheme);
console.log(urlOI);

//HTML VARIABLES
const navMenu = document.getElementById('main-menu-navigation');
const rightMenu = document.getElementById('rightMenu');

const selectedClass = document.getElementById('selectClass');
const selectedMatiere = document.getElementById('selectMatiere');
const username = document.getElementById('username');
const profilPicUser = document.getElementById('profilepic');
const chapitreNumber = document.getElementById('chapitreNumberValue');
const chapitreName = document.getElementById('chapitreName');
const expectedSkills = document.getElementById('expectedSkills');
const challenges = document.getElementById('challenges');
const numberChapitre = document.getElementById('numberChapitre');
// const endDate = document.getElementById('endDate');
const modifyChapitreNumber = document.getElementById('modifyChapitreNumber');
const modifyChapitreName = document.getElementById('modifyChapitreName');
const modifyExpectedSkills = document.getElementById('modifySkills');
const modifyChallenges = document.getElementById('modifyChallenges');
const modifyTitle = document.getElementById('modifyTitle');
// const modifyEndDate = document.getElementById('modifyEndDate');





function getViewport() {
  // https://stackoverflow.com/a/8876069
  const width = Math.max(
    document.documentElement.clientWidth,
    window.innerWidth || 0
  )
  if (width <= 576) return 'xs'
  if (width <= 768) return 'sm'
  if (width <= 992) return 'md'
  if (width <= 1200) return 'lg'
  return 'xl'
}
// $(document).ready(function () {
//   var myWidth = document.getElementById("myDiv").offsetWidth;
// console.log(myWidth);
// document.getElementById('myDiv2').style.width = myWidth;
// console.log(document.getElementById('myDiv2').offsetWidth);
//   let viewport = getViewport()
//   let debounce
//   $(window).resize(() => {
//     debounce = setTimeout(() => {
//       const currentViewport = getViewport()
//       if (currentViewport !== viewport) {
//         viewport = currentViewport
//         $(window).trigger('newViewport', viewport)
//       }
//     }, 500)
//   })
//   $(window).on('newViewport', (viewport) => {
//     // do something with viewport
//     console.log(getViewport());
//     document.getElementById('myDiv2').style.width = '100px;';
//   });
//   // run when page loads
//   $(window).trigger('newViewport', viewport);
// });




function myscroll() {
  if ($(document).scrollTop() > 400) {
    console.log
    var newPos = $(document).scrollTop() + 400;
    $('#sideMenu').css({ top: newPos });
  }

  else {
    $('#sideMenu').css({ top: 400 });
  }
}






/* Initialisation create chapter editor */
var createChapterApp = angular.module('createChapterApp', ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']);



createChapterApp.config(function ($provide) {
  $provide.decorator('taOptions', ['taRegisterTool', 'taToolFunctions', '$delegate', function (taRegisterTool, taToolFunctions, taOptions) {
    // $delegate is the taOptions we are decorating
    // register the tool with textAngular

    taRegisterTool('uploadImage', {
      iconclass: "fa fa-picture-o",
      tooltiptext: "Uploader une image depuis l'ordinateur",
      onElementSelect: {
        element: 'img',
        action: taToolFunctions.imgOnSelectAction
      },
      action: function () {
        var $editor = this.$editor;

        // Create a virtual input element.
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = "image/*";

        input.onchange = function () {
          var reader = new FileReader();

          if (this.files && this.files[0]) {
            reader.onload = function (e) {
              $editor().wrapSelection('insertHtml', '<img src=' + e.target.result + '>', true);
            };

            reader.readAsDataURL(this.files[0]);
          }
        };

        // Click on a virtual input element.
        input.click();
      }
    });

    taRegisterTool('backgroundColor', {
      display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
      action: function (color) {
        var me = this;
        if (!this.$editor().wrapSelection) {
          setTimeout(function () {
            me.action(color);
          }, 100)
        } else {
          return this.$editor().wrapSelection('backColor', color);
        }
      },
      options: {
        replacerClassName: 'fa fa-paint-brush', showButtons: false
      },
      color: "#fff"
    });
    taRegisterTool('fontColor', {
      display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
      action: function (color) {
        var me = this;
        if (!this.$editor().wrapSelection) {
          setTimeout(function () {
            me.action(color);
          }, 100)
        } else {
          return this.$editor().wrapSelection('foreColor', color);
        }
      },
      options: {
        replacerClassName: 'fa fa-font', showButtons: false
      },
      color: "#000"
    });


    taRegisterTool('fontName', {
      display: "<span class='bar-btn-dropdown dropdown'>" +
        "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
        "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
      action: function (event, font) {
        //Ask if event is really an event.
        if (!!event.stopPropagation) {
          //With this, you stop the event of textAngular.
          event.stopPropagation();
          //Then click in the body to close the dropdown.
          $("body").trigger("click");
        }
        return this.$editor().wrapSelection('fontName', font);
      },
      options: [
        { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
        { name: 'Serif', css: "'times new roman', serif" },
        { name: 'Wide', css: "'arial black', sans-serif" },
        { name: 'Narrow', css: "'arial narrow', sans-serif" },
        { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
        { name: 'Courier New', css: "'courier new', monospace" },
        { name: 'Garamond', css: 'garamond, serif' },
        { name: 'Georgia', css: 'georgia, serif' },
        { name: 'Tahoma', css: 'tahoma, sans-serif' },
        { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
        { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
        { name: 'Verdana', css: 'verdana, sans-serif' },
        { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
      ]
    });


    taRegisterTool('fontSize', {
      display: "<span class='bar-btn-dropdown dropdown'>" +
        "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px; padding-right:2px;'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
        "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
        "</span>",
      action: function (event, size) {
        //Ask if event is really an event.
        if (!!event.stopPropagation) {
          //With this, you stop the event of textAngular.
          event.stopPropagation();
          //Then click in the body to close the dropdown.
          $("body").trigger("click");
        }
        return this.$editor().wrapSelection('fontSize', parseInt(size));
      },
      options: [
        { name: 'xx-small', css: 'xx-small', value: 1 },
        { name: 'x-small', css: 'x-small', value: 2 },
        { name: 'small', css: 'small', value: 3 },
        { name: 'medium', css: 'medium', value: 4 },
        { name: 'large', css: 'large', value: 5 },
        { name: 'x-large', css: 'x-large', value: 6 },
        { name: 'xx-large', css: 'xx-large', value: 7 }

      ]
    });


    // add the button to the default toolbar definition
    taOptions.toolbar[1].push('uploadImage', 'backgroundColor', 'fontColor', 'fontName', 'fontSize');
    return taOptions;
  }]);
});
function skillsAppController($scope) {
  // alert('la');
  $scope.html = '<h2 style="text-align: center;">Titre du chapitre</h2><p style="text-align: center;">Sous-titre</p><p style="text-align: center;"><br/></p><p><b>Sommaire :</b></p><ol><li>Chapitre 1</li><li>Chapitre 2 et <b>exercices</b></li><li style="color: green;">Travaux dirigés</li><li>SChapitre 3</li></ol><p><b>Video disponible sur le lien suivant :</b> <a href="https://www.youtube.com/watch?v=oerRPbjFDjY&amp;app=desktop">VIDEO</a> </p>';
  $scope.htmlcontent = $scope.html;
  $scope.disabled = false;
}
function challengesAppController($scope) {


  $scope.html = '<h3>Challenges:</h3>';
  $scope.htmlcontent2 = $scope.html;
  $scope.disabled = false;
}
function modifyChallengesController($scope) {
  $scope.html = '';
  $scope.htmlcontent = $scope.html;
  $scope.disabled = false;
}
function createContentController($scope) {
  $scope.html = '';
  $scope.htmlcontent = $scope.html;
  $scope.disabled = false;
}

/* Fin initialisation create chapter editor */


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
        // setUserInterface(doc.data().userCategory, doc.data().instituteCategory, doc.data().soutien, doc.data().instituteName);
        getUserNotif();

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


function createChapter() {

  var chapterName = document.getElementById('chapterTitle').value;
  if (chapterName == '') {
    alert('Attention, vous devez spécifier un nom à votre thème.');
  }
  else {
    document.getElementById('btnCreateChapter').style.display = 'none';
    document.getElementById('createChapterLoading').style.display = 'inline';
    document.getElementById('chapterTitle').disabled = true;
    document.getElementById('btnCreateChapter').disabled = true;
    document.getElementById('btnCreateChapter').innerHTML = '<i class="far fa-check-circle"></i> Thème créé';

    //Ok for creation in database
    var user = auth.currentUser;
    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc("niveau").collection('matiere').add({
          numeroChapitre: chapterName
        }).then(function (docChapter) {
          console.log(docChapter.id);
          document.getElementById('chapterID').setAttribute('name', docChapter.id);// We set the ID on html element to retrieve it afterwards
          document.getElementById('createChapterLoading').style.display = 'none';
          document.getElementById('btnCreateChapter').style.opacity = '1';
          document.getElementById('btnCreateChapter').style.color = 'black';
          document.getElementById('btnCreateChapter').style.display = 'inline';

          //Swal alert
          swal({
            title: "Thème créé",
            text: "Le contenu que vous allez ajouter sera automatiquement sauvegardé.",
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
              document.getElementById('allContents').style.display = 'block';
              document.getElementById('sideMenu').style.display = 'block';

              // document.getElementById('myFooter').removeAttribute('position');
              var cssObject = $('#myFooter').prop('style');
              cssObject.removeProperty('position');
            }
          });
          //Now we can display all modules

        }).catch(function (err) {
          console.log("Error adding doc: ", err);
        });

      }).catch(function (err) {
        console.log("Error :", err);
      })



  }

}


function checkUrl(number) {
  console.log("check url");
  console.log(urlFormation);
  if (number == 1) {
    if (urlFormation != null) {
      console.log("not null");
      var $select = $('select#selectClass').selectize();
      var control = $select[0].selectize;
      control.setValue(urlFormation, false);
      // $('select#selectClass').val('aaaa');
    }
  }
  else if (number == 2) {
    if (urlTheme != null) {
      console.log("not null");
      var $select = $('select#selectMatiere').selectize();
      var control = $select[0].selectize;
      control.setValue(urlTheme, false);
    }

  }
  else if (number == 3) {
    if (urlOI != null) {
      console.log("not null");
      var $select = $('select#selectChapter').selectize();
      var control = $select[0].selectize;
      control.setValue(urlOI, false);
    }

  }

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

  //To get existing content linked to the chapter and category of content
  function getExistingContent(niveau, matiere, chapitre) {
    var user = auth.currentUser;
    // console.log("Get Existing Content");
    document.getElementById('listCreatedCours').innerHTML = '';
    document.getElementById('listCreatedExercices').innerHTML = '';
    document.getElementById('listCreatedEval').innerHTML = '';
  
    var hasCours = false;
    var hasExo = false;
    var hasEval = false;
  
    var arrayOrder = [];
  
    firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
            firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc(niveau).collection(matiere).doc(chapitre).get()
                .then(function (docChapter) {
                    var indexOfContentCours = 0;
  
                    if (docChapter.data().createdContent != undefined) {
                        docChapter.data().createdContent.forEach(function (elem) {
                            /* header */
                            var html1 = '<div id="heading';
                            var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                            var html3 = '" aria-expanded="false" aria-controls="accordion';
                            var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                            /* title here */
                            var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right; padding-right:0px;margin-right:5px;"><button title="Modifer le contenu" onClick="modifyContent(\'' + elem.contentId + '\');" type="button" ><i class="fas fa-edit"></i></button></div></div>';
  
                            /* body */
                            var html5 = '<div id="accordion';
                            var html6 = '" role="tabpanel" aria-labelledby="heading';
                            var html7 = '" class="collapse" style="">';
                            var html8 = '<div class="card-content"><div class="card-body">';
                            /* text here */
                            var html9 = '</div></div></div>';
  
                            var contentCategory = '';
                            var destination = '';
                            if (elem.contentType == 'cours') {
                                // console.log("1");
                                contentCategory = ' - Fiche théorique';
                                destination = 'Cours';
                                document.getElementById('missingContentCours').style.display = 'none';
                            }
                            else if (elem.contentType == 'exercices') {
                                // console.log("2");
  
                                contentCategory = ' - Fiche d\'activité';
                                destination = 'Exercices';
                                document.getElementById('missingContentExercices').style.display = 'none';
  
                            }
                            else if (elem.contentType == 'evaluationC' || elem.contentType == 'evaluationF') {
                                // console.log("3");
  
                                contentCategory = ' - Evaluation';
                                destination = 'Eval';
                                document.getElementById('missingContentEval').style.display = 'none';
  
  
                            }
                            // console.log(contentCategory);
                            arrayOrder.push(elem);
                            console.log(arrayOrder.length);
                            // console.log("ABOUT TO DISPLAY THIS : " + docChapter.data().id + " - "+ elem.title)
                            // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
                            // document.getElementById('listCreated' + destination).innerHTML += total;
                            indexOfContentCours++;
  
                            // console.log("FICHE DE : " + elem.contentType);
                            // console.log("TITRE : " + elem.title);
  
                        });
                        //End for each
                        getExistingContentFromJson(thisIsLevel, thisIsMatiere, thisIsChapter, indexOfContentCours, arrayOrder)
                    }
                    else {
                        // document.getElementById('missingContent').style.display = 'block';
                        // document.getElementById('listCreatedContent').style.display = 'none';
                        getExistingContentFromJson(thisIsLevel, thisIsMatiere, thisIsChapter, indexOfContentCours, arrayOrder)
  
                    }
                }).catch(function (err) {
                    console.log("Error :", err);
                });
        }).catch(function (err) {
            console.log("Error: ", err);
        });
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
    username.innerHTML = "<b>" + userName + "</b>";
    var childName = 'profile_pictures/' + user.uid;
    firebase.storage().ref(childName).getDownloadURL().then(function (avatarUrl) {
      profilPicUser.src = avatarUrl;
    }).catch((err) => {
      profilPicUser.src = "../../app-assets/images/logo/no_avatar.png";
    });
    setUserInterface(doc.data().userCategory, doc.data().soutien, doc.id, '');

    //Gérer le formulaire selon si CollegE/Lycée ou SoutienScolaire
    if (doc.data().instituteCategory == "lycee" || doc.data().instituteCategory == "college") {
      console.log("HEY3)");
      firestore.collection('users').doc(user.uid).get()
        .then(function (docCurrentUser) {
          firestore.collection('users').doc(docCurrentUser.data().idAdmin).collection('classes').get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc2) {
                selectedClass.selectize.addOption({ value: doc2.data().nomClasse, text: doc2.data().nomClasse });
                // selectedClass.selectize.addItem(doc2.data().nomClasse);
                // selectedClassTeacher.selectize.addItem(doc2.data().nomClasse);
                var $select = $('select#selectClass').selectize();
                var control = $select[0].selectize;
                control.clear();
                console.log(doc2.data().nomClasse);
              });
              checkUrl(1);
            }).catch(function (err) {
              console.log("error : ", err);
            });

        }).catch(function (err) {
          console.log("Error: ", err);
        });


    } else if (doc.data().instituteCategory == "soutien") {
      //document.getElementById('collegeLycee')
    }
  }).catch(function (err) {
    console.log('Error displaying user info: ', err);
  });
}

  //To get existing content linked to chapter but from json
  function getExistingContentFromJson(niveau, matiere, chapitre, indexOfContentCours, arrayOrder) {
    console.log("THIS IS GETEXISTINGCONTENTFROMJSON");
  
    var user = auth.currentUser;
  
    firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(thisIsLevel).collection(thisIsMatiere).doc(thisIsChapter).collection('createdContent').get()
                .then(function (querySnapshot) {
                    // console.log("SIZE : ", querySnapshot.size);
  
                    if (querySnapshot.size > 0) {
                        //There is new 
                        var customIndex = 0;
                        console.log(querySnapshot.size);
                        querySnapshot.forEach(function (doc) {
                            // console.log("FICHE DE : " + doc.data().contentType);
                            // console.log("TITRE DE LA FICHE : " + doc.data().title);
                            //Now we need to read the json and build html
                            //First download the url of file
                            firebase.storage().ref("created_content/" + doc.id).getDownloadURL().then(function (contentUrl) {
                                //We downloaded the url now we read the json
                                $.ajax({
                                    type: 'GET',
                                    url: contentUrl
                                }).then(function (data) {
                                    //We have the data, now build the html
                                    // console.log("data : ", data.content);
                                    // console.log(byteLength(data.content))
  
                                    //BUILD HTML HERE
                                    /* header */
                                    var html1 = '<div id="heading';
                                    var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
                                    var html3 = '" aria-expanded="false" aria-controls="accordion';
                                    var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
                                    /* title here */
                                    var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right; padding-right:0px;margin-right:5px;"><button title="Modifer le contenu" onClick="modifyContent(\'' + doc.id + '\');" type="button" ><i class="fas fa-edit"></i></button></div></div>';
  
                                    /* body */
                                    var html5 = '<div id="accordion';
                                    var html6 = '" role="tabpanel" aria-labelledby="heading';
                                    var html7 = '" class="collapse" style="">';
                                    var html8 = '<div class="card-content"><div class="card-body">';
                                    /* text here */
                                    var html9 = '</div></div></div>';
  
                                    var contentCategory = '';
                                    var destination = '';
                                    if (doc.data().contentType == 'cours') {
                                        // console.log("1");
                                        contentCategory = ' - Fiche théorique';
                                        destination = 'Cours';
                                        document.getElementById('missingContentCours').style.display = 'none';
                                    }
                                    else if (doc.data().contentType == 'exercices') {
                                        // console.log("2");
  
                                        contentCategory = ' - Fiche d\'activité';
                                        destination = 'Exercices';
                                        document.getElementById('missingContentExercices').style.display = 'none';
  
                                    }
                                    else if (doc.data().contentType == 'evaluation') {
                                        // console.log("3");
  
                                        contentCategory = ' - Evaluation';
                                        destination = 'Eval';
                                        document.getElementById('missingContentEval').style.display = 'none';
  
  
                                    }
                                    // console.log(contentCategory);
                                    // console.log("ABOUT TO DISPLAY THIS : " + thisIsChapter + " - "+ doc.data().title)
                                    // console.log(doc);
                                    // console.log(doc.data());
                                    var obj = doc.data();
                                    obj.content = data.content;
                                    arrayOrder.push(obj);
                                    console.log(arrayOrder.length)
  
                                    // var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + doc.data().title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + data.content + html9;
                                    // document.getElementById('listCreated' + destination).innerHTML += total;
                                    // indexOfContentCours++;
                                    customIndex++;
                                    if (customIndex == querySnapshot.size) {
                                        displayContentWithOrder(arrayOrder);
  
                                    }
  
                                    // console.log("FICHE DE : " + doc.data().contentType);
                                    // console.log("TITRE : " + doc.data().title);
                                })
                            }).catch(function (err) {
                                console.log("Error: ", err);
                            })
  
                        })
                        console.log("THIS IS ARRAY ORDER");
                        console.log(arrayOrder);
                        console.log(arrayOrder[0]);
  
                    }
                    else {
                        console.log("THIS IS ARRAY ORDER");
  
                        console.log(arrayOrder);
                        displayContentWithOrder(arrayOrder);
  
                        //There is no new content
                        console.log("NO NEW CONTENT");
                    }
                }).catch(function (err) {
                    console.log("Error ", err);
                });
        }).catch(function (err) {
            console.log("error :", err);
        });
  
  
  }
  
  function displayContentWithOrder(arrayOrder) {
    console.log("displayContentWithOrder();");
    console.log(arrayOrder);
    // arrayOrder.sort();
    console.log(arrayOrder[0]);
    var indexOfContentCours = 0;
  
    arrayOrder.sort(function (x, y) {
        return x.timestampOfCreation - y.timestampOfCreation;
    })
    console.log(arrayOrder);
  
    arrayOrder.forEach(function (elem) {
        var html1 = '<div id="heading';
        var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
        var html3 = '" aria-expanded="false" aria-controls="accordion';
        var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
        /* title here */
        var html4bis = '</a><div class="col-6 col-md-4" style="text-align:center;float: right; padding-right:0px;margin-right:5px;"><button title="Modifer le contenu" onClick="modifyContent(\'' + elem.contentId + '\');" type="button" ><i class="fas fa-edit"></i></button></div></div>';
  
        /* body */
        var html5 = '<div id="accordion';
        var html6 = '" role="tabpanel" aria-labelledby="heading';
        var html7 = '" class="collapse" style="">';
        var html8 = '<div class="card-content"><div class="card-body">';
        /* text here */
        var html9 = '</div></div></div>';
  
        var contentCategory = '';
        var destination = '';
        if (elem.contentType == 'cours') {
            // console.log("1");
            contentCategory = ' - Fiche théorique';
            destination = 'Cours';
            document.getElementById('missingContentCours').style.display = 'none';
        }
        else if (elem.contentType == 'exercices') {
            // console.log("2");
  
            contentCategory = ' - Fiche d\'activité';
            destination = 'Exercices';
            document.getElementById('missingContentExercices').style.display = 'none';
  
        }
        else if (elem.contentType == 'evaluation') {
            // console.log("3");
  
            contentCategory = ' - Evaluation';
            destination = 'Eval';
            document.getElementById('missingContentEval').style.display = 'none';
  
  
        }
        var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
        document.getElementById('listCreated' + destination).innerHTML += total;
        indexOfContentCours++;
    })
  
  }

function addNewEditor() {
  // alert(document.getElementsByName('coursEditor').length);

  var index = document.getElementsByName('coursEditor').length;
  var g = document.createElement('div');
  g.setAttribute('id', 'newCoursEditor' + index);
  g.setAttribute('name', 'coursEditor');
  g.setAttribute('ng-App', 'newApp' + index)
  document.getElementById('container').appendChild(g);
  document.getElementById('newCoursEditor' + index).innerHTML += '<div><div text-angular ng-model="html"></div><div ng-bind-html="html"></div></div>';
  angular.module('newApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
    $scope.orightml = 'This is your new editor';
    $scope.htmlcontent = $scope.orightml;
    $scope.disabled = false;
  });
  angular.module('newApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
    $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function (taRegisterTool, taOptions) {
      // $delegate is the taOptions we are decorating
      // register the tool with textAngular

      taRegisterTool('backgroundColor', {
        display: "<div spectrum-colorpicker ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></div>",
        action: function (color) {
          var me = this;
          if (!this.$editor().wrapSelection) {
            setTimeout(function () {
              me.action(color);
            }, 100)
          } else {
            return this.$editor().wrapSelection('backColor', color);
          }
        },
        options: {
          replacerClassName: 'fa fa-paint-brush', showButtons: false
        },
        color: "#fff"
      });
      taRegisterTool('fontColor', {
        display: "<spectrum-colorpicker trigger-id='{{trigger}}' ng-model='color' on-change='!!color && action(color)' format='\"hex\"' options='options'></spectrum-colorpicker>",
        action: function (color) {
          var me = this;
          if (!this.$editor().wrapSelection) {
            setTimeout(function () {
              me.action(color);
            }, 100)
          } else {
            return this.$editor().wrapSelection('foreColor', color);
          }
        },
        options: {
          replacerClassName: 'fa fa-font', showButtons: false
        },
        color: "#000"
      });
      taRegisterTool('fontName', {
        display: "<span class='bar-btn-dropdown dropdown'>" +
          "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-font'></i><i class='fa fa-caret-down'></i></button>" +
          "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'><i ng-if='o.active' class='fa fa-check'></i>{{o.name}}</button></li></ul></span>",
        action: function (event, font) {
          //Ask if event is really an event.
          if (!!event.stopPropagation) {
            //With this, you stop the event of textAngular.
            event.stopPropagation();
            //Then click in the body to close the dropdown.
            $("body").trigger("click");
          }
          return this.$editor().wrapSelection('fontName', font);
        },
        options: [
          { name: 'Sans-Serif', css: 'Arial, Helvetica, sans-serif' },
          { name: 'Serif', css: "'times new roman', serif" },
          { name: 'Wide', css: "'arial black', sans-serif" },
          { name: 'Narrow', css: "'arial narrow', sans-serif" },
          { name: 'Comic Sans MS', css: "'comic sans ms', sans-serif" },
          { name: 'Courier New', css: "'courier new', monospace" },
          { name: 'Garamond', css: 'garamond, serif' },
          { name: 'Georgia', css: 'georgia, serif' },
          { name: 'Tahoma', css: 'tahoma, sans-serif' },
          { name: 'Trebuchet MS', css: "'trebuchet ms', sans-serif" },
          { name: "Helvetica", css: "'Helvetica Neue', Helvetica, Arial, sans-serif" },
          { name: 'Verdana', css: 'verdana, sans-serif' },
          { name: 'Proxima Nova', css: 'proxima_nova_rgregular' }
        ]
      });
      taRegisterTool('fontSize', {
        display: "<span class='bar-btn-dropdown dropdown'>" +
          "<button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px'><i class='fa fa-text-height'></i><i class='fa fa-caret-down'></i></button>" +
          "<ul class='dropdown-menu'><li ng-repeat='o in options'><button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'><i ng-if='o.active' class='fa fa-check'></i> {{o.name}}</button></li></ul>" +
          "</span>",
        action: function (event, size) {
          //Ask if event is really an event.
          if (!!event.stopPropagation) {
            //With this, you stop the event of textAngular.
            event.stopPropagation();
            //Then click in the body to close the dropdown.
            $("body").trigger("click");
          }
          return this.$editor().wrapSelection('fontSize', parseInt(size));
        },
        options: [
          { name: 'xx-small', css: 'xx-small', value: 1 },
          { name: 'x-small', css: 'x-small', value: 2 },
          { name: 'small', css: 'small', value: 3 },
          { name: 'medium', css: 'medium', value: 4 },
          { name: 'large', css: 'large', value: 5 },
          { name: 'x-large', css: 'x-large', value: 6 },
          { name: 'xx-large', css: 'xx-large', value: 7 }

        ]
      });
      // add the button to the default toolbar definition
      // taOptions.toolbar[1].push('backgroundColor','fontColor','fontName','fontSize');
      return taOptions;
    }]);
  });
  angular.bootstrap(document.getElementById('newCoursEditor' + index), ['newApp' + index]);

}

$('select#selectChapter').on('change', function () {


  if ($('select#selectClass').val() != '' && $('select#selectMatiere').val() != '' && $('select#selectChapter').val() != '') {
    getExistingContent($('select#selectClass').val(), $('select#selectMatiere').val(), $('select#selectChapter').val());
  }

});

function modifyChapter(numeroChapitre) {
  var user = auth.currentUser;
  console.log(numeroChapitre);
  console.log("Modal open");



  $("#modalModifyChapter").modal();
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
    .then(function (doc) {
      modifyTitle.innerText = doc.data().numeroChapitre;
      modifyChapitreNumber.value = doc.data().numeroChapitre;
      modifyChapitreName.value = doc.data().nomChapitre;
      // modifyExpectedSkills.value = doc.data().competences;
      var scope = angular.element($('#modifyChallengesEditor')).scope();
      scope.$apply(function () {
        scope.html = doc.data().challenges;
      });
      var scope2 = angular.element($('#modifySkillsEditor')).scope();
      scope2.$apply(function () {
        scope2.html = doc.data().competences;
      });
      // modifyChallenges.value = doc.data().challenges;
      // modifyEndDate.value = doc.data().endDate;
    }).catch(function (err) {
      console.log("Error : ", err);
    });
}

function setContentForm(value) {
  switch (value) {
    case 'cours':
      document.getElementById('createCours').style.display = 'block';
      document.getElementById('createExercice').style.display = 'none';
      document.getElementById('createEvaluationC').style.display = 'none';
      document.getElementById('createEvaluationF').style.display = 'none';
      document.getElementById('contentForm').style.display = 'block';
      break;
    case 'exercices':
      document.getElementById('createCours').style.display = 'none';
      document.getElementById('createExercice').style.display = 'block';
      document.getElementById('createEvaluationC').style.display = 'none';
      document.getElementById('createEvaluationF').style.display = 'none';
      document.getElementById('contentForm').style.display = 'block';
      break;
    case 'evaluationF':
      document.getElementById('createCours').style.display = 'none';
      document.getElementById('createExercice').style.display = 'none';
      document.getElementById('createEvaluationF').style.display = 'block';
      document.getElementById('createEvaluationC').style.display = 'none';
      document.getElementById('contentForm').style.display = 'block';
      break;
    case 'evaluationC':
      document.getElementById('createCours').style.display = 'none';
      document.getElementById('createExercice').style.display = 'none';
      document.getElementById('createEvaluationC').style.display = 'block';
      document.getElementById('createEvaluationF').style.display = 'none';
      document.getElementById('contentForm').style.display = 'block';
      break;
    case '':
      document.getElementById('createCours').style.display = 'none';
      document.getElementById('createEvaluationC').style.display = 'none';
      document.getElementById('createEvaluationF').style.display = 'none';
      document.getElementById('createExercice').style.display = 'none';
      document.getElementById('contentForm').style.display = 'none';
      break;
  }
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
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';

        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Catalogue des formations</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations en cours</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations réalisées</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning personel</span></a></li>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5/*++ nav4bis + nav5 + nav6  nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3 + right4;


        break;
      case 'parent':
        navMenu.innerHTML = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php"  class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Tutorat</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link" id="virtualClass"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mes-cours-eleveV2.php" class="nav-link"><i class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon Bilan</span></a></li><li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>';
        rightMenu.innerHTML = '<a href="mes-profs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes profs</a>';


        document.getElementById('virtualClass').setAttribute('href', '#');
        break;
      case 'admin':
        console.log("here");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-user"></i><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Valider l\'inscription des utilisateurs</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-baseball-ball"></i><span data-i18n="nav.dash.main">Gestion organisations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-orga.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une organisation</span></a></li></ul></li>';
        var nav4bis = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu=""><a href="modify-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';

        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li><button style="float:right;" class="mt-1 mb-1 btn color-blue btn-min-width text-bold-600" onclick="sendMailToGroup()" name="" value="" id="btnMailGroup"><i class="fas fa-envelope"></i> Envoyer un message</button>';


        var nav7 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>';
        var nav8 = '<ul class="dropdown-menu"><li data-menu=""><a href="dashboard-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav9 = '<li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li><li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li></ul></li>';
        var nav10 = '<li data-menu=""><a href="contenu-cours-soutien.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>';
        var nav11 = '<li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li></ul></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav4bis + nav5 + nav6 /*+ nav7 + nav8 + nav9 + nav10 + nav11 */;

        var right1 = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes formateurs</a>';
        var right2 = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Mes auteurs</a>';
        var right3 = '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Mes apprenants</a>';
        var right4 = '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Mes organisations</a>';


        document.getElementById('rightMenu').innerHTML = right1 + right2 + right3 + right4;
        break;
      case 'teacher':
        console.log("formateur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item"><a href="#"  class="nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item active "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Outils pédagogiques</span></a><ul class="dropdown-menu"><li data-menu=""><a href="create-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu de formation</span></a></li><li data-menu=""><a href="modify-content.php"  class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Salle virtuelle</span></a></li></ul></li>';
        var nav4 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="contenu-cours.php?function=addFormation"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une formation</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addTheme"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un thème</span></a></li><li data-menu=""><a href="contenu-cours.php?function=addOI"  class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un OI</span></a></li><li data-menu=""><a href="contenu-cours.php?function=list"  class="dropdown-item"><span data-i18n="nav.dash.main">Mes formations</span></a></li></ul></li>';
        var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2 + nav3 + nav4 + nav5;

        rightMenu.innerHTML = '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';
        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';


        // setTeachersVirtualClasses(instituteName);
        break;
      case 'author':
        console.log("auteur");
        var nav1 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>';
        // var nav2 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>';
        var nav2 = '<li data-menu="dropdown" class="dropdown nav-item active"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Contenu pédagogique</span></a><ul class="dropdown-menu"><li data-menu="" class="dropdown  dropdown-item dropdown-submenu"><a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Création de contenu</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Vidéos</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Texte</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Questionnaire</span></a></li><li data-menu=""><a href="#" class="dropdown-item"><span data-i18n="nav.dash.main">Enregistrement</span></a></li></ul></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Contenu créé</span></a></li></ul></li>';
        var nav3 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chalkboard-teacher"></i><span data-i18n="nav.dash.main">Formations</span></a><ul class="dropdown-menu"><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Créer une nouvelle formation</span></a></li><li data-menu=""><a href="#"  class="dropdown-item"><span data-i18n="nav.dash.main">Formations en cours</span></a></li></ul></li>';
        // var nav5 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';

        navMenu.innerHTML = nav1 + nav2/*  + nav3 + nav4 + nav5 */;

        rightMenu.innerHTML = '<a href="mes-formateurs.php" class="dropdown-item"><i class="fas fa-users"></i> Formateurs</a>';
        rightMenu.innerHTML += '<a href="mes-auteurs.php" class="dropdown-item"><i class="fas fa-users"></i> Auteurs</a>';

        rightMenu.innerHTML += '<a href="mes-apprenants.php" class="dropdown-item"><i class="fas fa-users"></i> Apprenants</a>';
        rightMenu.innerHTML += '<a href="mes-organisations.php" class="dropdown-item"><i class="fas fa-users"></i> Organisations</a>';

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

function setTeachersVirtualClasses(instituteName) {

  var user = auth.currentUser;

  firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docTeacher) {
        if (docTeacher.id != 'cVdmeheFOMS7hUbFL5k3bTTvVWD3') {
          if (docTeacher.id != user.uid) {
            document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="' + docTeacher.data().virtualRoom + '"  class="dropdown-item"><span data-i18n="nav.dash.main">' + docTeacher.data().firstName + ' ' + docTeacher.data().lastName + '</span></a></li>';
          }
          else {
            document.getElementById('virtualClassList').innerHTML += '<li data-menu=""><a href="' + docTeacher.data().virtualRoom + '"  class="dropdown-item"><span data-i18n="nav.dash.main">Ma classe virtuelle</span></a></li>';

          }
        }
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });

}

function openCreationContent() {
  $('#modalCreateContent').modal();
}

function jumpTo(id) {
  var element = document.getElementById(id);
  element.scrollIntoView({
    behavior: 'auto',
    block: 'center',
    inline: 'center'
  });
}

$('select#selectClass').on('change', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).get()
    .then(function (docCurrentUser) {
      firestore.collection('users').doc(docCurrentUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).get()
        .then(function (doc) {
          selectedMatiere.selectize.clearOptions();
          var $select2 = $('select#selectMatiere').selectize();
          var control2 = $select2[0].selectize;
          control2.clear();
          for (var i = 0; i < doc.data().matieres.length; i++) {
            selectedMatiere.selectize.addOption({ value: doc.data().matieres[i], text: doc.data().matieres[i] });
            // selectedClass.selectize.addItem(doc2.data().nomClasse);
            // selectedClassTeacher.selectize.addItem(doc2.data().nomClasse);
            var $select = $('select#selectMatiere').selectize();
            var control = $select[0].selectize;
            control.clear();
          }
          checkUrl(2);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    }).catch(function (err) {
      console.log("Error: ", err);
    });


});

function getSuiviArray() {
  var user = auth.currentUser;
  var hasSubject = false;
  var suiviPlanArray = [];


  firestore.collection('users').where('userCategory', '==', 'student').where("classe", "==", $('select#selectClass').val()).where("instituteName", "==", 'Hackschooling Institute').get()
    .then(function (queryShaphot) {

      queryShaphot.forEach(function (doc) {

        doc.data().matieres.forEach(function (elem) {
          if (elem.matiere == $('select#selectMatiere').val()) {
            hasSubject = true;
          }
        });
        if (hasSubject && doc.data().id != 'Qzi8n3zr2sbHd0jZGQIAIOAs6mj1') {
          suiviPlanArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "happy", studentLevel: doc.data().classe, studentClasse: doc.data().realClasse })
          hasSubject = false;
        }


      });
      console.log("COPIER ICI");
      console.log(suiviPlanArray);



      firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
        .then(function (querySnapshot) {

          querySnapshot.forEach(function (docChap) {
            if (docChap.data().createdContent != undefined) {
              var existingArray = docChap.data().createdContent;

              existingArray.forEach(function (elem) {

                if (elem.contentType != 'evaluation') {
                  elem.suivi = suiviPlanArray;
                }

              });
              console.log($('select#selectClass').val());
              console.log($('select#selectMatiere').val());
              console.log(docChap.id);
              console.log(existingArray);

              if (docChap.id != undefined) {
                firestore.collection('users').doc('8wtvYfMmxaUynaQHrzarHeShF8H2').collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(docChap.id).update({
                  createdContent: existingArray

                }).then(function () {
                  console.log("Updated for ", docChap.id);
                }).catch(function (err) {
                  console.log("Error: ", err);
                });
              }


            }


          });

        }).catch(function (err) {
          console.log("Error: ", err);
        });





    }).catch(function (err) {
      console.log("Error: ", err);
    });




}

$('#btnAddChapter').on('click', function () {
  var user = auth.currentUser;
  var hasSubject = false;
  var suiviPlanArray = [];
  var thisIsLevel ='niveau'
  var thisIsMatiere = 'matiere';
  var thisIsChapter = document.getElementById('chapterID').getAttribute('name');
  document.getElementById('loadingAdd').style.display = 'block';
  console.log("ThisIsLevel : ", thisIsLevel);
  console.log("ThisIsMatiere : ", thisIsMatiere);
  console.log("ThisIsChapter : ", thisIsChapter);

  /* Initialise progress modal */
  document.getElementById('progressAdd').value = 0;
  document.getElementById('progressAddValue').innerText = "Préparation de la sauvegarde du contenu en cours."

  /* // */
  if (thisIsLevel != '' && thisIsMatiere != '' && thisIsChapter != '') {
    if (document.getElementById('createContentTitle').value != '') {
      console.log("GOOD TO SAVE");
      // console.log(Date.now());
      var currentDate = new Date();
      var date = currentDate.getDate();
      var month = currentDate.getMonth(); //Be careful! January is 0 not 1
      var year = currentDate.getFullYear();
      var tempMonth = month + 1;
      console.log(tempMonth.toString().length);
      if (tempMonth.toString().length < 2) {
        var dateString = date + "/0" + (month + 1) + "/" + year;
      } else {
        var dateString = date + "/" + (month + 1) + "/" + year;
      }
      console.log(dateString);
      //Now we need to check what type of content is created.
      console.log($('input[name="radio"]:checked').val());
      var contentType = $('input[name="radio"]:checked').val();
      console.log(document.getElementById('createContent').value);
      // var sample = document.getElementById('createContent').value;
      // alert("size of sample is: " + sample.length);
      // var compressed = LZString.compress(sample);
      // alert("Size of compressed sample is : " + compressed.length);
      // var string = LZString.decompress(compressed);
      // console.log("Sample is :" + string);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc(thisIsLevel).collection(thisIsMatiere).doc(thisIsChapter).get()
            .then(function (docChapter) {
              firestore.collection('users').where('userCategory', '==', 'student').where("classe", "==", thisIsLevel).where("instituteName", "==", docUser.data().instituteName).get()
                .then(function (queryShaphot) {
                  queryShaphot.forEach(function (doc) {
                    doc.data().matieres.forEach(function (elem) {
                      if (elem.matiere == thisIsMatiere) {
                        hasSubject = true;
                      }
                    });
                    if (hasSubject) {
                      suiviPlanArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "sad", studentLevel: doc.data().classe, studentClasse: doc.data().realClasse })
                      hasSubject = false;
                    }
                  });
                  console.log("COPIER ICI");
                  console.log(suiviPlanArray);
                  if (contentType != 'evaluationC' && contentType !='evaluationF') {
                    var objectToSave = { authorId: user.uid, contentId: uniqueID(), authorName: docUser.data().firstName + ' ' + docUser.data().lastName, dateOfCreation: dateString, title: document.getElementById('contentTitle').value, content: document.getElementById('createContent').value, lastModficiationDate: dateString, lastModificationUserId: user.uid, lastModificationUserName: docUser.data().firstName + ' ' + docUser.data().lastName, contentType: contentType, suivi: suiviPlanArray, timestampOfCreation: Date.now() };
                  } else {
                    var objectToSave = { authorId: user.uid, contentId: uniqueID(), authorName: docUser.data().firstName + ' ' + docUser.data().lastName, dateOfCreation: dateString, title: document.getElementById('contentTitle').value, content: document.getElementById('createContent').value, lastModficiationDate: dateString, lastModificationUserId: user.uid, lastModificationUserName: docUser.data().firstName + ' ' + docUser.data().lastName, contentType: contentType, timestampOfCreation: Date.now() };
                  }
                  console.log(objectToSave);

                  /* HERE CHECK IF EVAL. IF SO WE DO AS USUAL, IF ELSE WE DO JSON */

                  if (contentType == 'evaluationF' || contentType == 'evaluationC') {
                    if (docChapter.data().createdContent == undefined) {
                      var arrayToSave = [objectToSave];
                      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(thisIsLevel).collection(thisIsMatiere).doc(thisIsChapter)
                        .set({
                          createdContent: arrayToSave
                        },
                          {
                            merge: true
                          }).then(function () {
                            console.log("Content Saved.");
                            swal({
                              title: "Contenu créé",
                              // text: "Les matières ont bien été ajoutées au professeur.",
                              type: "success",
                              html: true,
                              showCancelButton: false,
                              // confirmButtonColor: "#ffde59",
                              confirmButtonText: "OK",
                              // cancelButtonColor:"#ffde59",
                              // cancelButtonText: "Fermer", 
                              closeOnConfirm: true,
                              closeOnCancel: true
                            }, function (isConfirm) {
                              if (isConfirm) {
                                // getExistingContent(thisIsLevel, thisIsMatiere, thisIsChapter);
                                document.getElementById('loadingAdd').style.display = 'none';

                                clearAddContent(contentType);
                              }
                            });
                          }).catch(function (err) {
                            console.log("Error: ", err);
                            let typeError = "";
                            messageError = String(err);
                            document.getElementById('loadingAdd').style.display = 'none';
                            if (String(err).includes("maximum size allowed")) {
                              typeError = `Attention le contenu est trop lourd pour être stocké. 
                                                                            Pour réduire son poids vous pouvez réduire le nombre d'images ou 
                                                                            réduire les dimensions de ces dernières.`
                            } else {
                              typeError = "Line3703 " + err;
                            }
                            var title = "Le contenu n'a pas pu être créé";
                            alertSwal(title, typeError);
                          });
                    } else {
                      var existingArray = docChapter.data().createdContent;
                      existingArray.push(objectToSave);
                      firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc(thisIsLevel).collection(thisIsMatiere).doc(thisIsChapter)
                        .update({
                          createdContent: existingArray
                        }).then(function () {
                          console.log("Content Saved.");
                          swal({
                            title: "Contenu créé",
                            // text: "Les matières ont bien été ajoutées au professeur.",
                            type: "success",
                            html: true,
                            showCancelButton: false,
                            // confirmButtonColor: "#ffde59",
                            confirmButtonText: "OK",
                            // cancelButtonColor:"#ffde59",
                            // cancelButtonText: "Fermer", 
                            closeOnConfirm: true,
                            closeOnCancel: true
                          }, function (isConfirm) {
                            if (isConfirm) {
                              // getExistingContent(thisIsLevel, thisIsMatiere, thisIsChapter);
                              document.getElementById('loadingAdd').style.display = 'none';
                              clearAddContent(contentType);
                            }
                          });
                        }).catch(function (err) {
                          console.log("Error: ", err);
                          let typeError = "";
                          document.getElementById('loadingAdd').style.display = 'none';
                          messageError = String(err);
                          if (String(err).includes("maximum size allowed")) {
                            typeError = `Attention le contenu est trop lourd pour être stocké. 
                                                                            Pour réduire son poids vous pouvez réduire le nombre d'images ou 
                                                                            réduire les dimensions de ces dernières.`
                          } else {
                            typeError = "Line3750 " + err;
                          }
                          var title = "Le contenu n'a pas pu être créé";
                          alertSwal(title, typeError);
                        });
                    }
                  }
                  else {
                    $('#modalProgress').modal({
                      backdrop: 'static', //Both parameters to prevent closing the modal if download not finished
                      keyboard: false
                    });
                    var jsonObject = {
                      contentId: objectToSave.contentId,
                      content: objectToSave.content
                    };
                    var formatedJson = JSON.stringify(jsonObject);

                    // download(formatedJson, objectToSave.contentId, 'application/json');
                    var arrayToSave = [objectToSave];

                    /* ABOUT TO UPLOAD THE FILE FIRST */

                    var a = document.createElement("a");
                    var storageRef = firebase.storage().ref();

                    var file = new Blob([formatedJson], { type: 'application/json' });


                    var uploadTask = storageRef.child("created_content_FFVoile/" + objectToSave.contentId).put(file);

                    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                      console.log('Upload is ' + progress + '% done');


                      document.getElementById('progressAdd').value = progress;
                      document.getElementById('progressAddValue').innerText = round(progress, 1) + '%'

                      if (document.getElementById('progressAddValue').innerText == '100%') {
                        document.getElementById('progressAddValue').innerText = 'Finalisation de la sauvegarde.'
                      }




                      switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                          console.log('Upload is paused');
                          break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                          console.log('Upload is running');
                          break;
                      }
                    }, function (error) {
                      alert("ERROR : ", error);
                      switch (error.code) {
                        case 'storage/unauthorized':
                          // User doesn't have permission to access the object
                          console.log('Unauthorized');
                          var title = "Le contenu n'a pas pu être créé";
                          alertSwal(title);
                          $('#modalProgress').modal('hide');
                          document.getElementById('loadingAdd').style.display = 'none';
                          break;

                        case 'storage/canceled':
                          // User canceled the upload
                          console.log('Canceled');
                          var title = "Le contenu n'a pas pu être créé";
                          alertSwal(title);
                          $('#modalProgress').modal('hide');
                          document.getElementById('loadingAdd').style.display = 'none';
                          break;

                        case 'storage/unknown':
                          // Unknown error occurred, inspect error.serverResponse
                          console.log('Unknown');
                          var title = "Le contenu n'a pas pu être créé";
                          alertSwal(title);
                          $('#modalProgress').modal('hide');
                          document.getElementById('loadingAdd').style.display = 'none';
                          break;
                      }
                    },
                      function () {
                        // Upload completed successfully, now we can get the download URL
                        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                          //console.log('File available at', downloadURL);
                          console.log('UPLOADED SUCCESSFULY');
                          firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc(thisIsLevel).collection(thisIsMatiere).doc(thisIsChapter).collection('createdContent').doc(objectToSave.contentId)
                            .set({
                              authorId: user.uid,
                              contentId: objectToSave.contentId,
                              authorName: objectToSave.authorName,
                              dateOfCreation: objectToSave.dateOfCreation,
                              title: objectToSave.title,
                              contentType: objectToSave.contentType,
                              // content: objectToSave.content,
                              timestampOfCreation: objectToSave.timestampOfCreation,
                              lastModficiationDate: objectToSave.lastModficiationDate,
                              lastModificationUserId: objectToSave.lastModificationUserId,
                              lastModificationUserName: objectToSave.lastModificationUserName,
                              suivi: objectToSave.suivi
                            },
                              {
                                merge: true
                              }).then(function () {
                                console.log("Content Saved.");
                                swal({
                                  title: "Contenu créé",
                                  // text: "Les matières ont bien été ajoutées au professeur.",
                                  type: "success",
                                  html: true,
                                  showCancelButton: false,
                                  // confirmButtonColor: "#ffde59",
                                  confirmButtonText: "OK",
                                  // cancelButtonColor:"#ffde59",
                                  // cancelButtonText: "Fermer", 
                                  closeOnConfirm: true,
                                  closeOnCancel: true
                                }, function (isConfirm) {
                                  if (isConfirm) {
                                    // getExistingContent($('select#selectClass').val(), $('select#selectMatiere').val(), $('select#selectChapter').val());
                                    document.getElementById('loadingAdd').style.display = 'none';
                                    $('#modalProgress').modal('hide');

                                    clearAddContent(contentType);
                                  }
                                });
                              }).catch(function (err) {
                                console.log("Error: ", err);
                                document.getElementById('loadingAdd').style.display = 'none';

                                let typeError = "";
                                messageError = String(err);
                                if (String(err).includes("maximum size allowed")) {
                                  typeError = `Attention le contenu est trop lourd pour être stocké. 
                                                                    Pour réduire son poids vous pouvez réduire le nombre d'images ou 
                                                                    réduire les dimensions de ces dernières.`
                                } else {
                                  typeError = "Line3703" + err;
                                }
                                var title = "Le contenu n'a pas pu être créé";
                                alertSwal(title);
                              });


                        });

                      });


                    // a.href = URL.createObjectURL(file);
                    // a.download = fileName;
                    // a.click();  
                  }
                  /*  */



                }).catch(function (err) {
                  console.log("Error: ", err);
                });
            }).catch(function (err) {
              console.log("Error: ", err);
            });
        }).catch(function (err) {
          console.log("Error: ", err);
        });
    } else {
      document.getElementById('loadingAdd').style.display = 'none';

      alert("Veuillez donner un titre un contenu pour le sauvegarder.")
    }

  } else {
    document.getElementById('loadingAdd').style.display = 'none';

    alert('Pour sauvegarder le contenu créé vous devez impérativement \n\
  sélectionner une classe, une matière ainsi que le chapitre auquel\n\
  vous souhaitez associer ce contenu.')
  }

});


  //To get PDF which linked to the content and chapter
  function initPDF(niveau, matiere, chapitre) {
    var user = auth.currentUser;
  
    document.getElementById('sectionPDFCours').innerHTML = '';
    document.getElementById('sectionPDFExercices').innerHTML = '';
    document.getElementById('sectionPDFCorrection').innerHTML = '';
    document.getElementById('sectionPDFEval').innerHTML = '';
    document.getElementById('sectionPDFEvalPAP').innerHTML = '';
  
    document.getElementById('sectionPDFCorrectionEval').data = '';
    // document.getElementById('sectionPDFCorrectionEval').style.display ='block';
    // document.getElementById('sectionPDFCorrectionEval').style.display ='none';
    // document.getElementById('sectionPDFEval').style.display ='block';
    // document.getElementById('sectionPDFEval').style.display ='none';
  
  
  
  
  
  
    firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
            // HTML to see if keep it or not
  
            // document.getElementById('evalPresent').style.display = 'none';
            // document.getElementById('evalNoPresent').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnDeleteCorrection').style.display = 'none';
            document.getElementById('btnDeleteCorrectionEval').style.display = 'none';
            document.getElementById('btnDeleteEval').style.display = 'none';
            document.getElementById('btnDeleteEvalPAP').style.display = 'none';
  
  
            // document.getElementById('unlockEval').style.display = 'none';
            // document.getElementById('lockEval').style.display = 'none';
  
            document.getElementById('divContent1').innerHTML = "";
            document.getElementById('divContent2').innerHTML = "";
            // document.getElementById('divContent3').innerHTML = "";
  
            document.getElementById('divContent1').style.display = 'none';
            document.getElementById('divContent2').style.display = 'none';
            // document.getElementById('divContent3').style.display = 'none';
  
            // document.getElementById('chapitreNumber').innerHTML = "";
  
            // var indexOfContentCours = 0;
            var niveau = thisIsLevel;
            var nomMatiere = matiere;
  
            if (nomMatiere.indexOf(' ') >= 0) {
                // console.log("nomMatier is true");
                nomMatiere = nomMatiere.replace(/\s+/g, '-');
            }
            nomMatiere = nomMatiere.replace('é', 'e');
            nomMatiere = nomMatiere.replace('è', 'e');
  
            var newNumeroChapitre = chapitre.trim();
            // console.log("newNumChapitre =>" + newNumeroChapitre);
  
            if (newNumeroChapitre.indexOf(' ') >= 0) {
                // console.log("numeroChapitre is true");
                newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
            }
  
  
            // THINK HOW TO MANAGE
            /*
             if (doc2.data().evalUnlocked == true) {
             document.getElementById('lockEval').style.display = 'inline';
             document.getElementById('unlockEval').style.display = 'none';
             } else {
             document.getElementById('unlockEval').style.display = 'inline';
             document.getElementById('lockEval').style.display = 'none';
             }
             */
  
            var arrayFichesCoursUrl = [];
  
            var arrayCorrectionExosUrl = [];
  
            // URL construction and PDF download
            //Cours PDF download
            var pdfCoursUrl = "fiches_cours_FFVoile/" + docUser.data().idAdmin + '_' + niveau + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
            console.log("urlCours " + pdfCoursUrl);
            firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
                console.log("CoursUrl --> " + coursUrl);
                btnOpenPDFCours.setAttribute("href", coursUrl);
                // pdfCours.data = coursUrl;
                coursError.style.display = "none";
                btnPDFCours.style.display = "block";
                document.getElementById('btnDeleteCours').style.display = 'block';
                document.getElementById('sectionPDFCours').style.display = 'block';
                document.getElementById('sectionPDFCours').innerHTML = '<br><object data="' + coursUrl + '" type="application/pdf" width="100%" height="800px"></object>';
  
  
  
  
  
            }).catch((err) => {
                console.log("Téléchargement échoué => Error :" + err);
                coursError.style.display = "block";
                btnPDFCours.style.display = "none";
                document.getElementById('sectionPDFCours').style.display = 'none';
  
            });
  
            //Exercices PDF download
            var arrayFichesExosUrl = [];
  
            var pdfExercicesUrl = "fiches_exos_FFVoile/" + docUser.data().idAdmin + '_' + niveau + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf';
            console.log("urlExos = " + pdfExercicesUrl);
            firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
                console.log("ExosUrl -- > " + exosUrl);
                btnOpenPDFExercices.setAttribute("href", exosUrl);
                // pdfExos.data = exosUrl;
                exosError.style.display = "none";
                btnPDFExercices.style.display = "block";
                document.getElementById('btnDeleteExo').style.display = 'block';
                document.getElementById('sectionPDFExercices').innerHTML = '<br><object data="' + exosUrl + '" type="application/pdf" width="100%" height="800px"></object>';
  
                document.getElementById('sectionPDFExercices').style.display = 'block';
  
  
  
            }).catch((err) => {
                console.log("Error :" + err);
                exosError.style.display = "block";
                btnPDFExercices.style.display = "none";
                document.getElementById('sectionPDFExercices').style.display = 'none';
  
            });
  
            // Exercices Correction PDF download
            let correctionExosUrl = 'exos_corriges_FFVoile/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + niveau + '_' + newNumeroChapitre + '.pdf';
            console.log(correctionExosUrl);
            firebase.storage().ref(correctionExosUrl)
                .getDownloadURL()
                .then(function (url) {
                    console.log("corrigé LINK " + url);
                    btnOpenPDFCorrection.setAttribute("href", url);
                    // pdfCorrection.data = url;
                    correctionError.style.display = "none";
                    btnPDFCorrection.style.display = "block";
                    document.getElementById('btnDeleteCorrection').style.display = 'block';
                    document.getElementById('sectionPDFCorrection').innerHTML = '<br><object data="' + url + '" type="application/pdf" width="100%" height="800px"></object>';
  
                    document.getElementById('sectionPDFCorrection').style.display = 'block';
  
  
  
                }).catch(function (err) {
                    console.log("Error :" + err);
                    correctionError.style.display = "block";
                    btnPDFCorrection.style.display = "none";
                    document.getElementById('sectionPDFCorrection').style.display = 'none';
  
                });
  
            // Evaluation PDF download
            var sujetEvalUrl = 'sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + niveau + '_' + newNumeroChapitre + '.pdf';
            console.log(sujetEvalUrl);
            firebase.storage().ref(sujetEvalUrl)
                .getDownloadURL()
                .then(function (url) {
                    console.log("EVAL LNK " + url);
                    // document.getElementById('evalLink').href = url;
                    // document.getElementById('evalPresent').style.display = 'block';
  
                    // document.getElementById('evalNoPresent').style.display = 'none';
                    // document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                    btnOpenPDFEval.setAttribute("href", url);
                    // pdfEval.data = url;
                    evalError.style.display = "none";
                    btnPDFEval.style.display = "block";
                    document.getElementById('btnDeleteEval').style.display = 'block';
                    document.getElementById('sectionPDFEval').innerHTML = '<br><object data="' + url + '" type="application/pdf" width="100%" height="800px"></object>';
  
                    document.getElementById('sectionPDFEval').style.display = 'block';
  
  
                }).catch(function (err) {
                    console.log("Error :", err);
                    evalError.style.display = "block";
                    btnPDFEval.style.display = "none";
                    document.getElementById('sectionPDFEval').style.display = 'none';
  
                });
            /*  */
            // Evaluation PDF download
            var sujetEvalUrlPAP = 'sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + niveau + '_' + newNumeroChapitre + '-b.pdf';
            console.log(sujetEvalUrlPAP);
            firebase.storage().ref(sujetEvalUrlPAP)
                .getDownloadURL()
                .then(function (url) {
                    console.log("EVAL LNK " + url);
                    // document.getElementById('evalLink').href = url;
                    // document.getElementById('evalPresent').style.display = 'block';
  
                    // document.getElementById('evalNoPresent').style.display = 'none';
                    // document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                    btnOpenPDFEvalPAP.setAttribute("href", url);
                    // pdfEval.data = url;
                    evalErrorPAP.style.display = "none";
                    btnPDFEvalPAP.style.display = "block";
                    document.getElementById('btnDeleteEvalPAP').style.display = 'block';
                    document.getElementById('sectionPDFEvalPAP').innerHTML = '<br><object data="' + url + '" type="application/pdf" width="100%" height="800px"></object>';
  
                    document.getElementById('sectionPDFEvalPAP').style.display = 'block';
  
  
                }).catch(function (err) {
                    console.log("Error :", err);
                    evalErrorPAP.style.display = "block";
                    btnPDFEvalPAP.style.display = "none";
                    document.getElementById('sectionPDFEvalPAP').style.display = 'none';
  
                });
  
            // Corrigé Evaluation PDF download
            var sujetCorrigesUrl = 'sujets_corriges_FFVoile/' + docUser.data().idAdmin + '_' + nomMatiere + '_' + niveau + '_' + newNumeroChapitre + '.pdf';
            console.log(sujetCorrigesUrl);
            firebase.storage().ref(sujetCorrigesUrl)
                .getDownloadURL()
                .then(function (url) {
                    console.log("EVAL CORRECTION LNK " + url);
                    // document.getElementById('evalLink').href = url;
                    // document.getElementById('evalPresent').style.display = 'block';
  
                    // document.getElementById('evalNoPresent').style.display = 'none';
                    // document.getElementById('contentNoPresentEvaluation').style.display = 'none';
                    btnOpenPDFCorrectionEval.setAttribute("href", url);
                    // document.getElementById('pdfCorrectionEval').data = url;
                    correctionEvalError.style.display = "none";
                    btnPDFCorrectionEval.style.display = "block";
                    document.getElementById('btnDeleteCorrectionEval').style.display = 'block';
                    document.getElementById('sectionPDFCorrectionEval').innerHTML = '<br><object data="' + url + '" type="application/pdf" width="100%" height="800px"></object>';
  
                    document.getElementById('sectionPDFCorrectionEval').style.display = 'block';
  
  
  
  
                }).catch(function (err) {
                    console.log("Error :", err);
                    correctionEvalError.style.display = "block";
                    btnPDFCorrectionEval.style.display = "none";
                    document.getElementById('sectionPDFCorrectionEval').style.display = 'none';
  
                });
  
  
  
            //Check if eval is locked or unlocked
            firestore.collection('users').doc(docUser.data().idAdmin).collection('contentBank').doc(niveau).collection(matiere).doc(chapitre).get()
                .then(function (docChapter) {
                    if (docChapter.data().evalUnlocked == undefined || docChapter.data().evalUnlocked == false) {
                        document.getElementById('unlockEval').style.display = 'inline';
                        document.getElementById('lockEval').style.display = 'none';
  
                    }
                    else if (docChapter.data().evalUnlocked == true) {
                        document.getElementById('unlockEval').style.display = 'none';
                        document.getElementById('lockEval').style.display = 'inline';
                    }
                }).catch(function (err) {
                    console.log('Error: ', err);
                });
  
  
        }).catch(function (err) {
            console.log("Error:  ", err);
        });
  }

  //Restarted the basic form after content creation
  function clearAddContent(contentType) {
    // var $select = $('select#selectChapter').selectize();
    // var control = $select[0].selectize;
    // control.clear();
    var scope = angular.element($('#createContentEditor')).scope();
    
    var thisIsLevel = 'niveau';
    var thisIsMatiere = 'matiere';
    var thisIsChapter =document.getElementById('chapterID').getAttribute('name');

    initPDF(thisIsLevel, thisIsMatiere, thisIsChapter);
    getExistingContent(thisIsLevel, thisIsMatiere, thisIsChapter);
    // getExistingContentFromJson(thisIsLevel, thisIsMatiere, thisIsChapter);
  
    console.log(scope);
  
    scope.$apply(function () {
        scope.htmlcontent = '<h2 style="text-align: center;">Titre du chapitre</h2>\n\
                            <p style="text-align: center;">Sous-titre</p>\n\
                            <p style="text-align: center;"><br/></p>\n\
                            <p><b>Sommaire :</b></p>\n\
                            <ol>\n\
                                <li>Chapitre 1</li>\n\
                                <li>Chapitre 2 et <b>exercices</b></li>\n\
                                <li style="color: green;">Travaux dirigés</li>\n\
                                <li>SChapitre 3</li>\n\
                            </ol>\n\
                            <p><b>Video disponible sur le lien suivant :</b>\n\
                                <a href="https://www.youtube.com/watch?v=oerRPbjFDjY&amp;app=desktop">VIDEO</a>\n\
                            </p>';
    });
    document.getElementById('createContentTitle').value = '';
  }

function clearAddChapter() {
  chapitreNumber.value = "";
  chapitreName.value = "";
  expectedSkills.value = "";
  challenges.value = "";
  // skillsEditorController(angular.element($('#skillsEditor')).scope());
  var scope = angular.element($('#skillsEditor')).scope();
  // skillsAppController(scope);
  console.log(scope);

  scope.$apply(function () {
    scope.htmlcontent = '<h3>Compétences attendues:</h3>';
    // scope.htmlcontent2 = '<h3>Challenges:</h3>';

  });
  var scope2 = angular.element($('#challengesEditor')).scope();
  // challengesAppController(scope2);
  // console.log(scope2);
  scope2.$apply(function () {
    scope2.htmlcontent2 = '<h3>Challenges:</h3>';
  });
  // endDate.value = "";
}

function addElement(parentId, elementTag, html) {
  // Adds an element to the document
  var p = document.getElementById(parentId);
  var newElement = document.createElement(elementTag);
  //newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
}

$('select#selectMatiere').on('change', function () {
  var user = auth.currentUser;
  document.getElementById('selectChapter').selectize.clearOptions();

  if ($('select#selectMatiere').val() != '') {
    firestore.collection('users').doc(user.uid).get()
      .then(function (docCurrentUser) {

        firestore.collection('users').doc(docCurrentUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (docChapters) {
              console.log(docChapters.data().numeroChapitre);

              if (docChapters.id != 'duration') {
                document.getElementById('selectChapter').selectize.addOption({ value: docChapters.data().numeroChapitre, text: docChapters.data().numeroChapitre + " - " + docChapters.data().nomChapitre });
                // selectedClass.selectize.addItem(doc2.data().nomClasse);
                // selectedClassTeacher.selectize.addItem(doc2.data().nomClasse);
                var $select = $('select#selectChapter').selectize();
                var control = $select[0].selectize;
                control.clear();
              }

            });
            checkUrl(3);
          }).catch(function (err) {
            console.log("Error :", err);
          });

      }).catch(function (err) {
        console.log("Error :", err);
      });
  }


});
//GOOD

function initChapters() {
  var user = auth.currentUser;
  console.log("Entering init chapters");
  var totalTime = 0;
  var chapterCount = 0;
  var chapterDuration = 0;
  var currentChapter = 0;
  const yearStartDate = 1567411200; //02/09/2019 à 08:00
  const yearEndDate = 1594929600; //16/07/2020 à 20:00
  const yearDuration = 21427200; //8 months
  const nbOfWeeks = 32; // taken on the 2019-2020 school calendar
  // html related to sponsored challenges
  // var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'><i><img src='../../app-assets/images/logo/"
  var sponshtml1 = "<div class='card-block'><div class='card-header no-border-bottom'><h4 class='card-title text-xs-center'>"
  // var sponshtml2 = ".png' height='24px' width='24px'></i>   ";
  var sponshtml3 = "</h4><div class='card-body'><div class='card-block'><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='50%' style='text-align: center'>";
  var sponshtml4 = "</th><th width='50%' style='text-align: center' class='danger time'>";
  var sponshtml5 = "</th></tr></table></div><h6 class='card-title text-bold-600'>Compétences attendues</h4><p class='card-text text-xs-left'><div style='border-width: thin; border-color:black; border-style:solid'>";
  var sponshtml6 = "</div></p><p> </p><h6 class=' card-title text-bold-600'>Les challenges</h4><p class='card-text text-xs-left'><div style='border-width: thin; border-color:black; border-style:solid'>";
  var sponshtml7 = "</div></p><p> </p><div class='insights px-2' style='display:block;'><div><span class='text-bold-600 h6 float-xs-left completion'>";
  var sponshtml8 = "</span> <span class='float-xs-right'><i class='icon-trophy'></i></span></div>";
  var sponshtml9 = "</div><p> </p><div class='table-responsive'><table width='100%' class='table table-hover'><tr><th width='33%' style='text-align: center'><button class='btn bg-school-plus btn-min-width text-bold-600 ";
  /* var sponshtml10 = "' type='button' disabled id='"; */
  var sponshtml10 = "' type='button'  id='";
  var sponshtml11 = "' onclick='modifyChapter(";
  var sponshtml12 = ")'>Modifier</button></div></th><th style='text-align: center' width='33%'></th><th width='33%' style='text-align: center'";
  var sponshtml13 = "'><button class='btn bg-school-plus btn-min-width text-bold-600'type='button' id='";
  var sponshtml14 = "' onclick='toDoList(\"";
  var sponshtml15 = "\");'>Ajouter la TODO liste</button></th>";
  // var sponshtml16 = "' onclick='closeChapter(\"";
  var sponshtml17 = "</tr></table></div></div></div></div></div>"; //<button class='btn bg-school-plus btn-min-width text-bold-600'type='button'>Nouveau Bouton</button> <div class='text-xs-center'> </div>
  var html = "";
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
    .then(function (querySnapshot2) {
      chapterCount = querySnapshot2.size;
      querySnapshot2.forEach(function (doc2) {
        if (doc2.id == "duration") {
          chapterDuration = Math.trunc(doc2.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
          totalTime = doc2.data().timeDone;
        }
        else if (doc2.data().numeroChapitre != undefined) {
          if (doc2.id != 'duration') {
            html = sponshtml1 + doc2.data().nomChapitre + sponshtml3 + doc2.data().numeroChapitre + sponshtml4 + sponshtml5 + doc2.data().competences + sponshtml6
              + doc2.data().challenges + sponshtml7 + "" + sponshtml8 + sponshtml9 + "doc2.id" + sponshtml10 + doc2.data().numeroChapitre + sponshtml11 + '"' + doc2.data().numeroChapitre + '"' + sponshtml12 + sponshtml13 + doc2.data().numeroChapitre + sponshtml14 + doc2.data().numeroChapitre + sponshtml15 + sponshtml17;
            addElement('basicContainer', 'div', html);
          }
        }
        // update progress bar
        /* if (chapterDuration != 0) {
          if (totalTime != 0 && totalTime != null) {
            currentChapter = Math.trunc(totalTime / chapterDuration) + 1;
            currentProgress = ((totalTime - (currentChapter - 1) * chapterDuration) / chapterDuration) * 100;
            var progressBars = document.getElementsByTagName('progress');
            var completion = document.getElementsByClassName('completion');
            var closingButtons = document.getElementsByClassName('btn-closing');
            for (var i = 0; i < progressBars.length; i++) {
              if (i < currentChapter - 1) {
                progressBars[i].value = 100;
                progressBars[i].className = "progress progress-md progress-success progress";
                completion[i].innerHTML = "100%";
                closingButtons[i].removeAttribute('disabled');
                closingButtons[i].setAttribute('enabled', '');
              }
              else if (i == currentChapter - 1) {
                progressBars[i].value = currentProgress;
                completion[i].innerHTML = Math.trunc(currentProgress) + "%";
                closingButtons[i].removeAttribute('disabled');
                closingButtons[i].setAttribute('enabled', '');
              }
              else
                completion[i].innerHTML = "0%";
            }
          }
        } */
        // update remaining time
        // if (chapterDuration != 0)
        //   chapterCount--;
        //var chapterNormalDuration = (yearEndDate - yearStartDate - 6696000) / (chapterCount); // get chapter normal duration in s
        /* var chapterNormalDuration = yearDuration / chapterCount;
        var timeElapsed = Date.now() / 1000 - yearStartDate;
        var classCurrentChapter = Math.trunc(timeElapsed / chapterNormalDuration);
        var durationRemaining = Math.trunc((chapterNormalDuration * (classCurrentChapter + 1) - timeElapsed) / (60 * 60 * 24));
        var deadlines = document.getElementsByClassName('time');
        for (var j = 0; j < deadlines.length; j++) {
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
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

$('#formChapitre').submit(function (ev) {

  ev.preventDefault();



  var user = auth.currentUser;



  if (modifyChapitreNumber.value != document.getElementById('modifyTitle').innerText) {
    console.log("Case 1");
    //If this condition is checked it means that the user changed the chapter number.
    //As the chapter number changed we need to check if this number is already used.

    /* firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value).get()
    .then(function(doc) {
      if(doc.exists)
      {
        //The chapter number is already used, we need to display error message
        document.getElementById('error-message').style.display = "block";
      }
      else
      {
        //The chapter number is not used, we can proceed to modification.

        //First we query the old chapter so we can create new one with former values
        firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(document.getElementById('modifyTitle').innerText).get()
        .then(function(docChapter) {
          firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value)
          .set({
            numeroChapitre: modifyChapitreNumber.value,
            nomChapitre: modifyChapitreName.value,
            challenges: modifyChallenges.value,
            competences: modifyExpectedSkills.value,
            cours: docChapter.data().cours,
            exercices: docChapter.data().exercices
            // evalUnlocked: docChapter.data().evalUnlocked,
            // notes: docChapter.data().notes
          }).then(function() {
            //Now that the new Chapter has been created we need to delete the previous one.
            firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(document.getElementById('modifyTitle').innerText).delete();
            //Then we regenerate chapters
            document.getElementById('basicContainer').innerHTML = "";
            initChapters();
            //And finally close the modal
            $("#modalModifyChapter").modal("hide");
          }).catch(function(err) {
            console.log("Error :" ,err);
          });
        }).catch(function(err) {
          console.log("Error: ", err);
        });
      }
    }).catch(function(err) {
      console.log("Error: ", err);
    }); */
  }
  else {
    console.log("Case 2");
    firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value)
      .update({
        // numeroChapitre: modifyChapitreNumber.value,
        nomChapitre: modifyChapitreName.value,
        competences: modifyExpectedSkills.value,
        challenges: modifyChallenges.value
        // endDate: modifyEndDate.value,
        // cours: '',
        // exercices: ''
      }).then(function () {
        document.getElementById('basicContainer').innerHTML = "";
        initChapters();
        $("#modalModifyChapter").modal("hide");
      })
      .catch(function (err) {
        console.log("Error : ", err);
      });
  }










  console.log("Form validé");

  $("#modalModifyChapter").modal("hide");


  //TODO
});


$('#modifyChapitreNumber').on('change', function () {
  if (document.getElementById('error-message').style.display == "block") {
    document.getElementById('error-message').style.display = "none";
  }
});

$('#btnDeleteChapter').on('click', function () {
  var user = auth.currentUser;
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(modifyChapitreNumber.value).delete();
  console.log("Chapter deleted");
  document.getElementById('basicContainer').innerHTML = "";
  initChapters();
  $("#modalModifyChapter").modal("hide");
});
$('#modalToDoList').on('hidden.bs.modal', function () {  //Permet de clear les sélections effectuées par l'utilisateur lorsque celui-ci
  //console.log('modal fermé');                            //annule la création d'un événement en cliquant ailleurs / fermant le modal
  /*  var array = document.getElementsByName('coursMainContainer');
   for(var i = 0; i<array.length; i++)
   {
     console.log(document.getElementsByName('coursMainContainer')[i].id);
   } */

  const myNode = document.getElementById("mainCours");
  while (myNode.firstChild) {
    // console.log(myNode.lastChild.id);
    myNode.removeChild(myNode.lastChild);
  }
  const myNode2 = document.getElementById("mainExos");
  while (myNode2.firstChild) {
    // console.log(myNode2.lastChild.id);
    myNode2.removeChild(myNode2.lastChild);
  }
});



function uniqueID() {
  function chr4() {
    return Math.random().toString(16).slice(-4);
  }
  return chr4() + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() +
    '-' + chr4() + chr4() + chr4();
}

function deleteDiv(button) {
  var parent = button.parentNode;
  var grand_father = parent.parentNode;
  var great_grand_father = grand_father.parentNode;
  var great_great_grand_father = great_grand_father.parentNode
  great_great_grand_father.removeChild(great_grand_father);
}

//Manage the visibility of Cours button
$('#btnPDFCours').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFCours2.style.display == "none") {
      sectionPDFCours2.style.display = "block";
    } else if (sectionPDFCours2.style.display == "block") {
      sectionPDFCours2.style.display = "none";
    }
  } else {
    if (sectionPDFCours.style.display == "none") {
      sectionPDFCours.style.display = "block";
    } else if (sectionPDFCours.style.display == "block") {
      sectionPDFCours.style.display = "none";
    }
  }
});

//Manage the visibility of Correction button
$('#btnPDFCorrection').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFCorrection2.style.display == "none") {
      sectionPDFCorrection2.style.display = "block";
    } else if (sectionPDFCorrection2.style.display == "block") {
      sectionPDFCorrection2.style.display = "none";
    }
  } else {
    if (sectionPDFCorrection.style.display == "none") {
      sectionPDFCorrection.style.display = "block";
    } else if (sectionPDFCorrection.style.display == "block") {
      sectionPDFCorrection.style.display = "none";
    }
  }
});

//Manage the visibility of CorrectionEVAL button
$('#btnPDFCorrectionEval').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFCorrectionEval2.style.display == "none") {
      sectionPDFCorrectionEval2.style.display = "block";
    } else if (sectionPDFCorrectionEval2.style.display == "block") {
      sectionPDFCorrectionEval2.style.display = "none";
    }
  } else {
    if (sectionPDFCorrectionEval.style.display == "none") {
      sectionPDFCorrectionEval.style.display = "block";
    } else if (sectionPDFCorrectionEval.style.display == "block") {
      sectionPDFCorrectionEval.style.display = "none";
    }
  }
});

//Manage the visibility of Eval button
$('#btnPDFEval').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFEval2.style.display == "none") {
      sectionPDFEval2.style.display = "block";
    } else if (sectionPDFEval2.style.display == "block") {
      sectionPDFEval2.style.display = "none";
    }
  } else {
    if (sectionPDFEval.style.display == "none") {
      sectionPDFEval.style.display = "block";
    } else if (sectionPDFEval.style.display == "block") {
      sectionPDFEval.style.display = "none";
    }
  }
});

//Manage the visibility of EvalPAP button
$('#btnPDFEvalPAP').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFEval2PAP.style.display == "none") {
      sectionPDFEval2PAP.style.display = "block";
    } else if (sectionPDFEval2PAP.style.display == "block") {
      sectionPDFEval2PAP.style.display = "none";
    }
  } else {
    if (sectionPDFEvalPAP.style.display == "none") {
      sectionPDFEvalPAP.style.display = "block";
    } else if (sectionPDFEvalPAP.style.display == "block") {
      sectionPDFEvalPAP.style.display = "none";
    }
  }
});

//Manage visibility of Exercice button
$('#btnPDFExercices').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFExercices2.style.display == "none") {
      sectionPDFExercices2.style.display = "block";
    } else if (sectionPDFExercices2.style.display == "block") {
      sectionPDFExercices2.style.display = "none";
    }
  } else {
    if (sectionPDFExercices.style.display == "none") {
      sectionPDFExercices.style.display = "block";
    } else if (sectionPDFExercices.style.display == "block") {
      sectionPDFExercices.style.display = "none";
    }
  }
});

$('#btnDeleteCours').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF - Théorie ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var fileUrl = 'fiches_cours_FFVoile/' + doc.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'block';
            swal({
              title: "Le PDF - Théorie a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});

// To delet Exo PDF
$('#btnDeleteExo').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF - Activités ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      console.log(newNumeroChapitre);

      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var fileUrl = 'fiches_exos_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFExercices').style.display = 'none';
            document.getElementById('sectionPDFExercices').innerHTML = '';

            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosError').style.display = 'block';
            document.getElementById('sectionPDFExercices2').style.display = 'none';
            // document.getElementById('pdfExos').data = '';

            swal({
              title: "Le PDF - Activités a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});
// To delet Eval PDF
$('#btnDeleteEval').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF - Évaluation certificative ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      console.log(newNumeroChapitre);

      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var fileUrl = 'sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFEval').style.display = 'none';
            document.getElementById('btnDeleteEval').style.display = 'none';
            document.getElementById('btnPDFEval').style.display = 'none';
            document.getElementById('evalError').style.display = 'block';
            document.getElementById('sectionPDFEval2').style.display = 'none';
            document.getElementById('sectionPDFEval').innerHTML = '';

            swal({
              title: "Le PDF - Évaluation certificative a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});

// To delet EvalPAP PDF
$('#btnDeleteEvalPAP').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF - Évaluation formative?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      console.log(newNumeroChapitre);

      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var fileUrl = 'sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + "-b.pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFEvalPAP').style.display = 'none';
            document.getElementById('btnDeleteEvalPAP').style.display = 'none';
            document.getElementById('btnPDFEvalPAP').style.display = 'none';
            document.getElementById('evalErrorPAP').style.display = 'block';
            document.getElementById('sectionPDFEval2PAP').style.display = 'none';
            document.getElementById('sectionPDFEvalPAP').innerHTML = '';

            swal({
              title: "Le PDF - Évaluation formative a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});

// To delet Correction PDF
$('#btnDeleteCorrection').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF de corrigés des activités ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      console.log(newNumeroChapitre);

      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var fileUrl = 'exos_corriges_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCorrection').style.display = 'none';
            document.getElementById('btnDeleteCorrection').style.display = 'none';
            document.getElementById('btnPDFCorrection').style.display = 'none';
            document.getElementById('correctionError').style.display = 'block';
            document.getElementById('sectionPDFCorrection2').style.display = 'none';
            document.getElementById('sectionPDFCorrection').innerHTML = '';

            swal({
              title: "Le PDF de corrigés des activités a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});

// To delet Eval Correction PDF
$('#btnDeleteCorrectionEval').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer le PDF de correction ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: false,
    closeOnCancel: false
  }, function (isConfirm) {
    if (isConfirm) {
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      console.log(newNumeroChapitre);

      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var fileUrl = 'sujets_corriges_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCorrectionEval').style.display = 'none';
            document.getElementById('btnDeleteCorrectionEval').style.display = 'none';
            document.getElementById('btnPDFCorrectionEval').style.display = 'none';
            document.getElementById('correctionEvalError').style.display = 'block';
            document.getElementById('sectionPDFCorrectionEval2').style.display = 'none';
            document.getElementById('sectionPDFCorrectionEval').innerHTML = '';

            swal({
              title: "Le PDF de correction a bien été supprimé.",
              type: "success",
              html: true
            });
          }).catch(function (err) {
            console.log("Error deleting :", err);
            swal({
              title: "Un problème est survenu, veuillez réessayer.",
              type: "error",
              html: true
            });
          });
          console.log("FILE URL " + fileUrl);
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    } else {
      swal({
        title: "Le PDF n'a pas été supprimé.",
        type: "error",
        html: true
      });
    }
  });
});

//Upload Cours PDF
$('#upload-cours').change(function () {
  var user = auth.currentUser;
  var errorMessage = document.getElementById('error-message');
  var thePDF = document.getElementById('upload-cours').files[0];
  var storageRef = firebase.storage().ref();
  var uploadCoursButton = document.getElementById('upload-cours');
  var queryUser = firestore.collection('users').doc(user.uid);
  console.log("Entering cours upload function");
  errorMessage.style.display = "none";

  var chapterID = document.getElementById('chapterID').getAttribute('name');
  console.log(chapterID);

  if (thePDF.type == 'application/pdf') {
    queryUser.get()
      .then(function (doc) {
        firestore.collection('users').doc(doc.data().idAdmin).get()
          .then(function (doc2) {

            console.log("Admin :", doc2.data().id);
            var uploadTask = storageRef.child("fiches_cours_FFVoile/" + doc2.data().id + "_" + 'niveau' + "_" + 'matiere' + "_" + chapterID + ".pdf").put(thePDF);
            console.log("URL : " + uploadTask);

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
              uploadCoursButton.setAttribute('disabled', '');
              document.getElementById('btnPDFCours').style.display = 'none';
              document.getElementById('btnDeleteCours').style.display = 'none';
              document.getElementById('coursError').style.display = 'none';
              document.getElementById('coursLoading').style.display = 'inline';
            }, function (error) {
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
            },
              function () {
                // Upload completed successfully, now we can get the download URL
                uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                  //console.log('File available at', downloadURL);
                  document.getElementById('sectionPDFCours').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';
                  document.getElementById('sectionPDFCours').style.display = 'block';
                  $('#upload-cours').val('');
                  document.getElementById('coursLoading').style.display = 'none';
                  document.getElementById('coursError').style.display = 'none';
                  document.getElementById('btnPDFCours').style.display = 'block';
                  document.getElementById('btnDeleteCours').style.display = 'block';
                });
                uploadCoursButton.removeAttribute('disabled');
                uploadCoursButton.setAttribute('enabled', '');
              });

          }).catch(function (err) {
            console.log("Error :", err);
          });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
  else {
    alert('Attention, le document doit être au format .pdf');
  }
});

//Upload Exo PDF
$('#upload-exos').change(function () {
  var user = auth.currentUser;
  var errorMessage2 = document.getElementById('error-message2');
  var thePDF = document.getElementById('upload-exos').files[0];
  var storageRef = firebase.storage().ref();
  var uploadExosButton = document.getElementById('upload-exos');
  var queryUser = firestore.collection('users').doc(user.uid);
  console.log("Entering exo upload function");
  errorMessage2.style.display = "none";
  var nomMatiere = 'matiere';
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (thePDF.type == 'application/pdf') {
    //METTRE UNE LIMITE SUR LA TAILLE DE FICHIER? 
    queryUser.get()
      .then(function (docUser) {
        var uploadTask = storageRef.child("fiches_exos_FFVoile/" + docUser.data().idAdmin + "_" + 'niveau' + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
        console.log("URL for uploaded exo: " + uploadTask);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          uploadExosButton.setAttribute('disabled', '');
          document.getElementById('exosError').style.display = 'none';
          document.getElementById('btnDeleteExo').style.display = 'none';
          document.getElementById('btnPDFExercices').style.display = 'none';
          document.getElementById('exosLoading').style.display = 'block';
        }, function (error) {
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
        },
          function () {
            // Upload completed successfully, now we can get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
              //console.log('File available at', downloadURL);
              document.getElementById('sectionPDFExercices').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';
              document.getElementById('sectionPDFExercices').style.display = 'block';

              $('#upload-exos').val('');
              document.getElementById('exosLoading').style.display = 'none';
              document.getElementById('exosError').style.display = 'none';
              document.getElementById('btnPDFExercices').style.display = 'block';
              document.getElementById('btnDeleteExo').style.display = 'block';
            });
            uploadExosButton.removeAttribute('disabled');
            uploadExosButton.setAttribute('enabled', '');
          });
      }).catch(function (err) {
        console.log('Error :', err);
      });

  }
});

//Upload Evaluation PDF
$('#upload-eval').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-eval').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = 'matiere';
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        var uploadTask = storageRef.child('sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          document.getElementById('upload-eval').setAttribute('disabled', '');
          // document.getElementById('loadingImg').style.display = 'inline';
          // document.getElementById('evalPresent').style.display = 'none';
          // document.getElementById('evalNoPresent').style.display = 'none';
          document.getElementById('evalError').style.display = 'none';
          document.getElementById('btnDeleteEval').style.display = 'none';
          document.getElementById('btnPDFEval').style.display = 'none';
          document.getElementById('loadingImg').style.display = 'block';

        }, function (error) {
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
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

            // document.getElementById('unlockEval').style.display = 'inline';
            document.getElementById('sectionPDFEval').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';
            document.getElementById('sectionPDFEval').style.display = 'block';

            $('#upload-eval').val('');
            document.getElementById('loadingImg').style.display = 'none';
            document.getElementById('evalError').style.display = 'none';
            document.getElementById('btnPDFEval').style.display = 'block';
            document.getElementById('btnDeleteEval').style.display = 'block';

          });
          //Attributes
          document.getElementById('upload-eval').removeAttribute('disabled');
          document.getElementById('upload-eval').setAttribute('enabled', '');
          document.getElementById('upload-eval').value = '';
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
});
//Upload Correction PDF
$('#upload-correction').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-correction').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = 'matiere';
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {
    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {
        var uploadTask = storageRef.child('exos_corriges_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          document.getElementById('upload-correction').setAttribute('disabled', '');
          document.getElementById('loadingImgCorrection').style.display = 'inline';
        }, function (error) {
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
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
            $('#upload-correction').val('');
            document.getElementById('loadingImgCorrection').style.display = 'none';
            document.getElementById('sectionPDFCorrection').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';

            document.getElementById('sectionPDFCorrection').style.display = 'block';
            document.getElementById('correctionError').style.display = 'none';
            document.getElementById('btnPDFCorrection').style.display = 'block';
            document.getElementById('btnDeleteCorrection').style.display = 'block';
          });
          //Attributes
          document.getElementById('upload-correction').removeAttribute('disabled');
          document.getElementById('upload-correction').setAttribute('enabled', '');
          document.getElementById('upload-correction').value = '';
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
});
//Upload EvaluationPAP PDF
$('#upload-evalPAP').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-evalPAP').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = 'matiere';
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        var uploadTask = storageRef.child('sujets_evaluations_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + '-b.pdf').put(theFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          document.getElementById('upload-evalPAP').setAttribute('disabled', '');
          // document.getElementById('loadingImg').style.display = 'inline';
          // document.getElementById('evalPresent').style.display = 'none';
          // document.getElementById('evalNoPresent').style.display = 'none';
          document.getElementById('evalErrorPAP').style.display = 'none';
          document.getElementById('btnDeleteEvalPAP').style.display = 'none';
          document.getElementById('btnPDFEvalPAP').style.display = 'none';
          document.getElementById('loadingImgPAP').style.display = 'block';

        }, function (error) {
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
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

            // document.getElementById('unlockEval').style.display = 'inline';
            document.getElementById('sectionPDFEvalPAP').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';
            document.getElementById('sectionPDFEvalPAP').style.display = 'block';

            $('#upload-evalPAP').val('');
            document.getElementById('loadingImgPAP').style.display = 'none';
            document.getElementById('evalErrorPAP').style.display = 'none';
            document.getElementById('btnPDFEvalPAP').style.display = 'block';
            document.getElementById('btnDeleteEvalPAP').style.display = 'block';

          });
          //Attributes
          document.getElementById('upload-evalPAP').removeAttribute('disabled');
          document.getElementById('upload-evalPAP').setAttribute('enabled', '');
          document.getElementById('upload-evalPAP').value = '';
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
});

//Upload Correction Evaluation PDF
$('#upload-correction-eval').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-correction-eval').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = 'matiere';
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        var uploadTask = storageRef.child('sujets_corriges_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre + '.pdf').put(theFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          document.getElementById('upload-correction-eval').setAttribute('disabled', '');
          // document.getElementById('loadingImg').style.display = 'inline';
          // document.getElementById('evalPresent').style.display = 'none';
          // document.getElementById('evalNoPresent').style.display = 'none';
          document.getElementById('correctionEvalError').style.display = 'none';
          document.getElementById('btnDeleteCorrectionEval').style.display = 'none';
          document.getElementById('btnPDFCorrectionEval').style.display = 'none';
          document.getElementById('loadingImgCorrectionEval').style.display = 'block';

        }, function (error) {
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
        }, function () {
          uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {

            // document.getElementById('unlockEval').style.display = 'inline';
            document.getElementById('sectionPDFCorrectionEval').innerHTML = '<br><object data="' + downloadURL + '" type="application/pdf" width="100%" height="800px"></object>';
            document.getElementById('sectionPDFCorrectionEval').style.display = 'block'
            $('#upload-correction-eval').val('');
            document.getElementById('loadingImgCorrectionEval').style.display = 'none';
            document.getElementById('correctionEvalError').style.display = 'none';
            document.getElementById('btnPDFCorrectionEval').style.display = 'block';
            document.getElementById('btnDeleteCorrectionEval').style.display = 'block';

          });
          //Attributes
          document.getElementById('upload-correction-eval').removeAttribute('disabled');
          document.getElementById('upload-correction-eval').setAttribute('enabled', '');
          document.getElementById('upload-correction-eval').value = '';
        });
      }).catch(function (err) {
        console.log("Error :", err);
      });
  }
});

// select a video
$('#upload-video-file').change(function () {
  console.log("UPLOAD VIDEO")
  var user = auth.currentUser;
  var theVideo = document.getElementById('upload-video-file').files[0];
  console.log(theVideo);
  console.log(theVideo.type);
  var cancelBtn = document.getElementById('cancel-upload');
  var toCancel = document.getElementById('cancel-upload-status');
  var progressPercent = document.getElementById('progress-percent');
  var progressBar = document.getElementById('upload-progress');
  var uploadButton = document.getElementById('thereIsNoVideoDiv');
  var uploadDone = document.getElementById('upload-done');


  if (theVideo != undefined) {
    if (theVideo.type == 'video/mp4') {
      document.getElementById('thereIsNoVideoDiv').style.display = 'none';
      document.getElementById('noVidMessage').style.display = 'none';
      uploadButton.style.display = "none";


      var storageRef = firebase.storage().ref();
      var nomMatiere = 'matiere';
      if (nomMatiere.indexOf(' ') >= 0) {
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      var newNumeroChapitre = document.getElementById('chapterID').getAttribute('name');
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }


      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {
          var videoRef = 'videos_FFVoile/' + docUser.data().idAdmin + '_' + 'niveau' + '_' + nomMatiere + '_' + newNumeroChapitre;
          var uploadTask = storageRef.child(videoRef).put(theVideo);
          $('#modalUploadVideo').modal({
            backdrop: 'static', //Both parameters to prevent closing the modal if download not finished
            keyboard: false
          });

          uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

            if (toCancel.innerHTML == '1')
              uploadTask.cancel();

            progressBar.value = progress;
            progressPercent.innerHTML = Number.parseFloat(progress).toFixed(1) + '%';
          }, function (error) {

            switch (error.code) {
              case 'storage/unauthorized':
                // User doesn't have permission to access the object
                console.log('Unauthorized');
                break;

              case 'storage/canceled':
                // User canceled the upload
                console.log('Canceled');

                toCancel.innerHTML = "";
                break;

              case 'storage/unknown':
                // Unknown error occurred, inspect error.serverResponse
                console.log('Unknown');
                break;
            }

          },
            function () {
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                //console.log('File available at', downloadURL);
                $('#upload-video-file').val('');

                document.getElementById('videoDiv').innerHTML = '<video width="320" height="240" controls=""><source id="videoPlayer" src="' + downloadURL + '" type="video/mp4" playsinline="" preload="none"></video>';
                document.getElementById('btnDownload').href = downloadURL;
                document.getElementById('btnDownload').style.display = '';
                document.getElementById('btnDeleteVideo').setAttribute('name', videoRef);
                document.getElementById('btnDeleteVideo').style.display = 'block';

                document.getElementById('noVidMessage').style.display = 'none';
                document.getElementById('thereIsNoVideoDiv').style.display = 'block';
                document.getElementById('thereIsVideoDiv').style.display = 'block';
                $('#modalUploadVideo').modal('hide');
              });



            });

        }).catch(function (err) {
          console.log("Error: ", err);;
        })
    }
    else {
      $('#upload-video-file').val('');
      alert('Attention, la vidéo doit être au format .mp4');
    }

  }







});

function cancelUpload() {
  var toCancel = document.getElementById('cancel-upload-status');
  toCancel.innerHTML = "1";
  $('#upload-video-file').val('');
  var uploadButton = document.getElementById('thereIsNoVideoDiv');
  uploadButton.style.display = 'block';
  if (document.getElementById('btnDownload').getAttribute('href') == '') {
    document.getElementById('noVidMessage').style.display = 'block';

  }
  var progressPercent = document.getElementById('progress-percent');
  var progressBar = document.getElementById('upload-progress');

  progressPercent.value = 0;
  progressBar.value = 0;

  document.getElementById('thereIsNoVideoDiv').style.display = 'block';
  $('#modalUploadVideo').modal('hide');




}


function deleteThisVid(url) {

  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  var ref = storageRef.child(url);

  swal({
    title: "Supprimer la vidéo ?",
    type: "warning",
    html: true,
    showCancelButton: true,
    confirmButtonColor: "#44DA74",
    confirmButtonText: "Valider",
    cancelButtonText: "Annuler",
    closeOnConfirm: true,
    closeOnCancel: true
  },
    function (isConfirm) {
      if (isConfirm) {
        console.log("OK);");
        ref.delete().then(function () {

          document.getElementById('btnDeleteVideo').style.display = 'none';
          document.getElementById('btnDownload').style.display = 'none';
          document.getElementById('videoDiv').innerHTML = '';
          document.getElementById('noVidMessage').style.display = 'block';
          // document.getElementById('thereIsNoVideoDiv').style.display = 'none';
          document.getElementById('thereIsVideoDiv').style.display = 'none';

          swal({
            title: "La vidéo a bien été supprimée.",
            type: "success",
            html: true
          });

        }).catch(function (err) {
          console.log("Errr: ", err);
        })
      }
      else {
        swal({
          title: "La vidéo n'a pas été supprimée.",
          type: "error",
          html: true
        });
      }

    })



}



$('#unlockEval').on('click', function () {
  var user = auth.currentUser;
  document.getElementById('unlockEval').style.display = 'none';
  document.getElementById('loadingImg').style.display = 'inline';

  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(document.getElementById('numberChapitre').innerText)
    .set({
      evalUnlocked: true
    },
      {
        merge: true
      }).then(function () {
        console.log("Eval Unlocked");
        document.getElementById('loadingImg').style.display = 'none';
        document.getElementById('lockEval').style.display = 'inline';
      }).catch(function (err) {
        console.log("err: ", err);
        document.getElementById('unlockEval').style.display = 'inline';

      });

});

$('#lockEval').on('click', function () {
  var user = auth.currentUser;
  document.getElementById('lockEval').style.display = 'none';
  document.getElementById('loadingImg').style.display = 'inline';

  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(document.getElementById('numberChapitre').innerText)
    .set({
      evalUnlocked: false
    },
      {
        merge: true
      }).then(function () {
        console.log("Eval locked");
        document.getElementById('loadingImg').style.display = 'none';

        document.getElementById('unlockEval').style.display = 'inline';
        document.getElementById('lockEval').style.display = 'none';
      }).catch(function (err) {
        console.log("err: ", err);
        document.getElementById('lockEval').style.display = 'inline';
      });

});