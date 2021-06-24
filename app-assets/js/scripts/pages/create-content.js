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
function modifySkillsController($scope) {
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


function checkUrl(number) {
  console.log("check url");
  console.log(urlFormation);
  if(number == 1)
  {
    if(urlFormation != null)
    {
      console.log("not null");
      var $select = $('select#selectClass').selectize();
      var control = $select[0].selectize;
      control.setValue(urlFormation, false);
      // $('select#selectClass').val('aaaa');
    }
  }
  else if(number == 2)
  {
    if(urlTheme != null)
    {
      console.log("not null");
      var $select = $('select#selectMatiere').selectize();
      var control = $select[0].selectize;
      control.setValue(urlTheme, false);
    }

  }
  else if(number == 3)
  {
    if(urlOI != null)
    {
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

function getExistingContent(formation, theme, oi) {
  var user = auth.currentUser;
  console.log("Get Existing Content");
  document.getElementById('listCreatedContent').innerHTML = '';

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      console.log("ok");
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc(formation).collection(theme).doc(oi).get()
        .then(function (docChapter) {
          console.log("OK2");

          if (docChapter.data().createdContent != undefined) {

            console.log("good");
            document.getElementById('missingContent').style.display = 'none';
            document.getElementById('listCreatedContent').style.display = 'block';


            var indexOfContentCours = 0;
            docChapter.data().createdContent.forEach(function (elem) {

              /* header */
              var html1 = '<div id="heading';
              var html2 = '"class="card-header"><a data-toggle="collapse"  href="#accordion';
              var html3 = '" aria-expanded="false" aria-controls="accordion';
              var html4 = '" class="card-title lead collapsed" style="color: #3BAFDA;">';
              /* title here */
              var html4bis = '</a></div>';

              /* body */
              var html5 = '<div id="accordion';
              var html6 = '" role="tabpanel" aria-labelledby="heading';
              var html7 = '" class="collapse" style="">';
              var html8 = '<div class="card-content"><div class="card-body">';
              /* text here */
              var html9 = '</div></div></div>';

              var contentCategory = '';
              if (elem.contentType == 'cours') {
                console.log("1");
                contentCategory = ' - Fiche théorique';
              }
              else if (elem.contentType == 'exercices') {
                console.log("2");

                contentCategory = ' - Fiche d\'activité';
              }
              else if (elem.contentType == 'evaluationF') {
                console.log("3");

                contentCategory = ' - Evaluation formative';
              }
              else if (elem.contentType == 'evaluationC') {
                console.log("3");

                contentCategory = ' - Evaluation certificative';
              }
              console.log(contentCategory);

              var total = html1 + indexOfContentCours + html2 + indexOfContentCours + html3 + indexOfContentCours + html4 + elem.title + contentCategory + html4bis + html5 + indexOfContentCours + html6 + indexOfContentCours + html7 + html8 + elem.content + html9;
              document.getElementById('listCreatedContent').innerHTML += total;
              indexOfContentCours++;


            });


          }
          else {
            document.getElementById('missingContent').style.display = 'block';
            document.getElementById('listCreatedContent').style.display = 'none';
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

$('select#selectChapter').on('change', function() {


  if($('select#selectClass').val() != '' && $('select#selectMatiere').val() != '' && $('select#selectChapter').val() != '')
  {
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
        var nav6 = '<li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Bilans</span></a></li>';


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


  if ($('select#selectClass').val() != '' && $('select#selectMatiere').val() != '' && $('select#selectChapter').val() != '') {

    if (document.getElementById('contentTitle').value != '') {
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
      }
      else {
        var dateString = date + "/" + (month + 1) + "/" + year;
      }

      console.log(dateString);

      //Now we need to check what type of content is created.

      console.log($('input[name="radio"]:checked').val());
      var contentType = $('input[name="radio"]:checked').val();

      firestore.collection('users').doc(user.uid).get()
        .then(function (docUser) {



          firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc($('select#selectChapter').val()).get()
            .then(function (docChapter) {

              firestore.collection('users').where('userCategory', '==', 'student').where("classe", "==", $('select#selectClass').val()).where("instituteName", "==", docUser.data().instituteName).get()
                .then(function (queryShaphot) {

                  queryShaphot.forEach(function (doc) {

                    doc.data().matieres.forEach(function (elem) {
                      if (elem.matiere == $('select#selectMatiere').val()) {
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

                  var contentId = uniqueID();

                  if (contentType != 'evaluation') {
                    var objectToSave = { authorId: user.uid, contentId: contentId, authorName: docUser.data().firstName + ' ' + docUser.data().lastName, dateOfCreation: dateString, title: document.getElementById('contentTitle').value, content: document.getElementById('newContent').value, lastModficiationDate: dateString, lastModificationUserId: user.uid, lastModificationUserName: docUser.data().firstName + ' ' + docUser.data().lastName, contentType: contentType, suivi: suiviPlanArray };

                  }
                  else {
                    var objectToSave = { authorId: user.uid, contentId: contentId, authorName: docUser.data().firstName + ' ' + docUser.data().lastName, dateOfCreation: dateString, title: document.getElementById('contentTitle').value, content: document.getElementById('newContent').value, lastModficiationDate: dateString, lastModificationUserId: user.uid, lastModificationUserName: docUser.data().firstName + ' ' + docUser.data().lastName, contentType: contentType };

                  }


                  console.log(objectToSave);


                  if (docChapter.data().createdContent == undefined) {
                    var arrayToSave = [objectToSave];
                    firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc($('select#selectChapter').val())
                      .set({
                        createdContent: arrayToSave
                      },
                        {
                          merge: true
                        }).then(function () {
                          console.log("Content Saved.");
                          if(docUser.data().createdContent == undefined || docUser.data().createdContent.length == 0)
                          {
                            var createdContent = [{idContent: contentId, dateOfCreation: dateString, queryLink: [$('select#selectClass').val(),$('select#selectMatiere').val(),$('select#selectChapter').val()]}];
                          }
                          else
                          {
                            var createdContent = docUser.data().createdContent;
                            createdContent.push({idContent: contentId, dateOfCreation: dateString, queryLink: [$('select#selectClass').val(),$('select#selectMatiere').val(),$('select#selectChapter').val()]});
                          }

                          firestore.collection('users').doc(docUser.id).update({
                            createdContent: createdContent
                          }).then(function() {
                            swal({
                              title: "Contenu créé",
                              // text: "Les matières ont bien été ajoutées au professeur.",
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
                                clearAddContent();
                              }
                            });
                          }).catch(function(err) {
                            console.log("Error: " ,err);
                          });
                          
                        }).catch(function (err) {
                          console.log("Error: ", err);
                          swal({
                            title: "Le contenu n'a pas pu être sauvegardé",
                            text: "Vous avez dépassé la limite de mémoire allouée la version alpha.",
                            type: "error",
                            html: true
                          });
                        });
                  }
                  else {
                    var existingArray = docChapter.data().createdContent;
                    existingArray.push(objectToSave);
                    firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc($('select#selectChapter').val())
                      .update({
                        createdContent: existingArray
                      }).then(function () {
                        console.log("Content Saved.");
                          if(docUser.data().createdContent == undefined || docUser.data().createdContent.length == 0)
                          {
                            var createdContent = [{idContent: contentId, dateOfCreation: dateString, queryLink: [$('select#selectClass').val(),$('select#selectMatiere').val(),$('select#selectChapter').val()]}];
                          }
                          else
                          {
                            var createdContent = docUser.data().createdContent;
                            createdContent.push({idContent: contentId, dateOfCreation: dateString, queryLink: [$('select#selectClass').val(),$('select#selectMatiere').val(),$('select#selectChapter').val()]});
                          }

                          firestore.collection('users').doc(docUser.id).update({
                            createdContent: createdContent
                          }).then(function() {
                            swal({
                              title: "Contenu créé",
                              // text: "Les matières ont bien été ajoutées au professeur.",
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
                                clearAddContent();
                              }
                            });
                          }).catch(function(err) {
                            console.log("Error: " ,err);
                          });
                      }).catch(function (err) {
                        console.log("Error: ", err);
                        swal({
                          title: "Le contenu n'a pas pu être sauvegardé",
                          text: "Vous avez dépassé la limite de mémoire allouée la version alpha.",
                          type: "error",
                          html: true
                        });
                      });
                  }


                }).catch(function (err) {
                  console.log("Error: ", err);
                });






            }).catch(function (err) {
              console.log("Error: ", err);
            });


        }).catch(function (err) {
          console.log("Error: ", err);
        });
    }
    else {
      alert("Veuillez donner un titre un contenu pour le sauvegarder.")
    }





  }
  else {

    alert('Pour sauvegarder le contenu créé vous devez impérativement sélectionner une formation, un thème ainsi que l\'OI auquel vous souhaitez associer ce contenu.')
  }

});

function clearAddContent() {
  // document.getElementById('selectChapter').selectize.clearOptions();
  // var $select = $('select#selectChapter').selectize();
  // var control = $select[0].selectize;
  // control.clear();
  setContentForm('');
  getExistingContent($('select#selectClass').val(), $('select#selectMatiere').val(), $('select#selectChapter').val());

  $("input:radio[name='radio']").each(function(i) {
    this.checked = false;
});

  var scope = angular.element($('#skillsEditor')).scope();
  // skillsAppController(scope);
  console.log(scope);

  scope.$apply(function () {
    scope.htmlcontent = '<h2 style="text-align: center;">Titre du chapitre</h2><p style="text-align: center;">Sous-titre</p><p style="text-align: center;"><br/></p><p><b>Sommaire :</b></p><ol><li>Chapitre 1</li><li>Chapitre 2 et <b>exercices</b></li><li style="color: green;">Travaux dirigés</li><li>SChapitre 3</li></ol><p><b>Video disponible sur le lien suivant :</b> <a href="https://www.youtube.com/watch?v=oerRPbjFDjY&amp;app=desktop">VIDEO</a> </p>';
    // scope.htmlcontent2 = '<h3>Challenges:</h3>';

  });
  document.getElementById('contentTitle').value = '';

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

function toDoList(numeroChapitre) {
  var user = auth.currentUser;
  // console.log(numeroChapitre);
  // console.log("Modal open");
  document.getElementById('coursContainer').innerHTML = "";
  document.getElementById('exosContainer').innerHTML = "";
  document.getElementById('evalPresent').style.display = 'none';
  document.getElementById('evalNoPresent').style.display = 'none';
  document.getElementById('btnDeleteCours').style.display = 'none';
  document.getElementById('btnDeleteExo').style.display = 'none';
  document.getElementById('unlockEval').style.display = 'none';
  document.getElementById('lockEval').style.display = 'none';
  // document.getElementById('sectionPDFCours').style.display = 'none';
  // document.getElementById('sectionPDFExercices').style.display ='none';
  $("#modalToDoList").modal();
  var pdfCoursUrl = '';
  var pdfExercicesUrl = '';
  var pdfCours = document.getElementById('pdfCours');
  pdfCours.data = '';
  var pdfExos = document.getElementById('pdfExos');
  pdfExos.data = '';
  // pdfExos.data = '';
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numeroChapitre).get()
    .then(function (doc2) {
      // modifyChapitreNumber2.value= doc2.data().numeroChapitre;
      // modifyChapitreName2.value= doc2.data().nomChapitre;
      // modifyExpectedSkills2.value = doc2.data().competences;
      // modifyChallenges2.value= doc2.data().challenges ;
      // modifyEndDate2.value = doc2.data().endDate;
      // exercicesToDoList.value = doc2.data().exercices,
      // coursToDoList.value = doc2.data().cours,  //TO CHANGE HERE
      numberChapitre.innerText = doc2.data().numeroChapitre
      document.getElementById('login').innerText = '';
      document.getElementById('mdp').innerText = '';
      // console.log(typeof doc2.data().cours);
      var coursStudentNames = [];
      var coursStudentSmileys = [];
      //SECTION COURS
      if (typeof doc2.data().cours == "object" && doc2.data().cours.length > 0) {
        // console.log("The type of 'cours' is object, we good");
        if (typeof doc2.data().cours[0] == "object") {
          doc2.data().cours.forEach(function (elem) {
            elem.suivi.forEach(function (elem2) {
              coursStudentNames.push(elem2.studentName);
              coursStudentSmileys.push(elem2.avancement);
            });
            // console.log("Cours Student Names Array ==> " + coursStudentNames);
            // console.log("Cours Student Smileys Array ==> " + coursStudentSmileys);
            // addDivCours(elem.element, coursStudentNames, coursStudentSmileys);
            addDivCoursWithText(elem.element, coursStudentNames, coursStudentSmileys);
            coursStudentNames = [];
            coursStudentSmileys = [];
          });
        } else if (typeof doc2.data().cours[0] == "string") {
          doc2.data().cours.forEach(function (elem) {
            // addDivCours(elem, coursStudentNames, coursStudentSmileys);
            addDivCoursWithText(elem, coursStudentNames, coursStudentSmileys);
          });
        }
      } else if (typeof doc2.data().cours == "string" && doc2.data().cours != '') {
        console.log("This is an old version. 'cours' is a string");
        // addDivCours(doc2.data().cours, coursStudentNames, coursStudentSmileys);
        addDivCoursWithText(doc2.data().cours, coursStudentNames, coursStudentSmileys);
      } else {
        // console.log("Nothing in DB, we present a cleared input");
        // addDivCours('', coursStudentNames, coursStudentSmileys);
        // addDivCoursInit(coursStudentNames, coursStudentSmileys);

        // console.log(document.getElementsByName('coursContainerName'));
        /* for(var i = 0; i<document.getElementsByName('coursContainerName').length;i++) {
 
          if(document.getElementsByName('coursContainerName')[i].innerHTML == '')
          {
            console.log("ID --> "+ document.getElementsByName('coursContainerName')[i].id);
            console.log("CONTENT --> "+ document.getElementsByName('coursContainerName')[i].innerHTML);
 
            addEmptyDivCours(document.getElementsByName('coursContainerName')[i].id);
 
            break;
 
          }
        } */

        addEmptyDivCours();

      }
      var exoStudentNames = [];
      var exoStudentSmileys = [];
      // SECTION EXOS
      if (typeof doc2.data().exercices == "object" && doc2.data().exercices.length > 0) {
        // console.log("The type of 'exercices' is object, we good");
        if (typeof doc2.data().exercices[0] == "object") {
          doc2.data().exercices.forEach(function (elem) {
            elem.suivi.forEach(function (elem2) {
              exoStudentNames.push(elem2.studentName);
              exoStudentSmileys.push(elem2.avancement);
            });
            // console.log("exo Student Names Array ==> " + exoStudentNames);
            // console.log("exo Student Smileys Array ==> " + exoStudentSmileys);
            // addDivExos(elem.element, exoStudentNames, exoStudentSmileys);
            addDivExosWithText(elem.element, exoStudentNames, exoStudentSmileys);
            exoStudentNames = [];
            exoStudentSmileys = [];
          });
        } else if (typeof doc2.data().exercices[0] == "string") {
          doc2.data().exercices.forEach(function (elem) {
            // addDivExos(elem, exoStudentNames, exoStudentSmileys);
            addDivExosWithText(elem, exoStudentNames, exoStudentSmileys);
          });
        }
      } else if (typeof doc2.data().exercices == "string" && doc2.data().exercices != '') {
        console.log("This is an old version. 'exercices' is a string");
        // addDivExos(doc2.data().exercices, exoStudentNames, exoStudentSmileys);
        addDivExosWithText(doc2.data().exercices, exoStudentNames, exoStudentSmileys);
      } else {
        // console.log("Nothing in DB, we present a cleared input");
        // addDivExos('', exoStudentNames, exoStudentSmileys);
        addEmptyDivExos();
      }
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);
      var newNumeroChapitre = numeroChapitre;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        // console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }

      if (doc2.data().evalUnlocked == true) {
        document.getElementById('lockEval').style.display = 'inline';
        document.getElementById('unlockEval').style.display = 'none';
      }
      else {
        document.getElementById('unlockEval').style.display = 'inline';
        document.getElementById('lockEval').style.display = 'none';

      }

      pdfCoursUrl = 'fiches_cours/' + user.uid + '_' + $('select#selectClass').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
      pdfExercicesUrl = 'fiches_exos/' + user.uid + '_' + $('select#selectClass').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
      // console.log("URL Cours :" + pdfCoursUrl);
      // console.log("URL Exos :"+ pdfExercicesUrl);
      //NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
      // console.log("About to download all urls");
      firebase.storage().ref(pdfCoursUrl).getDownloadURL().then(function (coursUrl) {
        // console.log("CoursUrl --> " + coursUrl);
        btnOpenPDFCours.setAttribute("href", coursUrl);
        pdfCours.data = coursUrl;
        coursError.style.display = "none";
        btnPDFCours.style.display = "block";
        document.getElementById('btnDeleteCours').style.display = 'block';
      }).catch((err) => {
        // console.log("Error :" + err);
        coursError.style.display = "block";
        btnPDFCours.style.display = "none";
      });
      // var pdfExercicesUrl = 'fiches_exos/NVHITdNVM1NGf8OEoQeSBBKIihC2_Terminale-0_Anglais_Chapitre-2.pdf';
      firebase.storage().ref(pdfExercicesUrl).getDownloadURL().then(function (exosUrl) {
        // console.log("ExosUrl -- > " + exosUrl);
        btnOpenPDFExercices.setAttribute("href", exosUrl);
        pdfExos.data = exosUrl;
        exosError.style.display = "none";
        btnPDFExercices.style.display = "block";
        document.getElementById('btnDeleteExo').style.display = 'block';
      }).catch((err) => {
        // console.log("Error :" + err);
        exosError.style.display = "block";
        btnPDFExercices.style.display = "none";
      });
      var sujetEvalUrl = 'sujets_evaluations/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';
      firebase.storage().ref(sujetEvalUrl).getDownloadURL().then(function (url) {
        // console.log("EVAL LNK " + url);
        document.getElementById('evalLink').href = url;
        document.getElementById('evalPresent').style.display = 'block';
        document.getElementById('evalNoPresent').style.display = 'none';

      }).catch(function (err) {
        // console.log("Error :", err);
        document.getElementById('evalPresent').style.display = 'none';
        document.getElementById('evalNoPresent').style.display = 'block';
      });
      var correctionExosUrl = 'exos_corriges/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf';
      firebase.storage().ref(correctionExosUrl).getDownloadURL().then(function (url) {
        // console.log("corrigé LNK " + url);
        document.getElementById('correctionLink').href = url;
        document.getElementById('correctionPresent').style.display = 'block';
        document.getElementById('correctionNoPresent').style.display = 'none';
      }).catch(function (err) {
        // console.log("Error :", err);
        document.getElementById('correctionPresent').style.display = 'none';
        document.getElementById('correctionNoPresent').style.display = 'block';
      });
    }).catch(function (err) {
      console.log("Error :", err);
    });
}

function addEmptyDivCours() {

  var newId = uniqueID().substr(0, 5);

  if (document.getElementsByName('coursEditor').length == 0) {
    var index = document.getElementsByName('coursEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'coursEditor' + index);
    g.setAttribute('name', 'coursEditor');
    g.setAttribute('ng-App', 'coursApp' + index);
    document.getElementById('coursContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent"><h3>Nouveau texte</h3></div><textarea style="display: none;" name="coursToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivCours()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p></fieldset>';
    document.getElementById('coursEditor' + index).innerHTML += html1 + html2 + html3;
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('coursEditor' + index), ['coursApp' + index]);
  } else {
    var index = document.getElementsByName('coursEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'coursEditor' + index);
    g.setAttribute('name', 'coursEditor');
    g.setAttribute('ng-App', 'coursApp' + index);
    document.getElementById('coursContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent"><h3>Nouveau texte</h3></div><textarea style="display: none;" name="coursToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" name="btnDelete" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivCours()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p></fieldset>';
    document.getElementById('coursEditor' + index).innerHTML += html1 + html2 + html3;
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('coursEditor' + index), ['coursApp' + index]);
  }
}

function addDivCoursWithText(text, namesArray, smileysArray) {

  var newId = uniqueID().substr(0, 5);
  // console.log("AddDivCoursWithText");
  // console.log(document.getElementsByName('coursContainerName').length);

  if (document.getElementsByName('coursEditor').length == 0) {
    var index = document.getElementsByName('coursEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'coursEditor' + index);
    g.setAttribute('name', 'coursEditor');
    g.setAttribute('ng-App', 'coursApp' + index);
    document.getElementById('coursContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent">' + text + '</div><textarea style="display: none;" name="coursToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivCours()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p>';
    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';
    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p style="margin-bottom: 0;">' + lastName + '</p></div>';
    }
    var html5 = '</div></fieldset>';
    document.getElementById('coursEditor' + index).innerHTML += html1 + html2 + html3 + html4 + html5;
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('coursEditor' + index), ['coursApp' + index]);
  } else {
    var index = document.getElementsByName('coursEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'coursEditor' + index);
    g.setAttribute('name', 'coursEditor');
    g.setAttribute('ng-App', 'coursApp' + index);
    document.getElementById('coursContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent">' + text + '</div><textarea style="display: none;" name="coursToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" name="btnDelete" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivCours()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p>';
    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';
    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p style="margin-bottom: 0;">' + lastName + '</p></div>';
    }
    var html5 = '</div></fieldset>';
    document.getElementById('coursEditor' + index).innerHTML += html1 + html2 + html3 + html4 + html5;
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('coursApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('coursEditor' + index), ['coursApp' + index]);
  }
}

function addEmptyDivExos() {

  var newId = uniqueID().substr(0, 5);
  if (document.getElementsByName('exosEditor').length == 0) {
    var index = document.getElementsByName('exosEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'exosEditor' + index);
    g.setAttribute('name', 'exosEditor');
    g.setAttribute('ng-App', 'exosApp' + index);
    document.getElementById('exosContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent"><h3>Nouveau texte</h3></div><textarea style="display: none;" name="exercicesToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivExos()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p></fieldset>';
    document.getElementById('exosEditor' + index).innerHTML += html1 + html2 + html3;
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('exosEditor' + index), ['exosApp' + index]);
  } else {
    var index = document.getElementsByName('exosEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'exosEditor' + index);
    g.setAttribute('name', 'exosEditor');
    g.setAttribute('ng-App', 'exosApp' + index);
    document.getElementById('exosContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent"><h3>Nouveau texte</h3></div><textarea style="display: none;" name="exercicesToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" name="btnDelete" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivExos()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p></fieldset>';
    document.getElementById('exosEditor' + index).innerHTML += html1 + html2 + html3;
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('exosEditor' + index), ['exosApp' + index]);
  }
}

function addDivExosWithText(text, namesArray, smileysArray) {

  var newId = uniqueID().substr(0, 5);
  // console.log("AddDivExosWithText");
  // console.log(document.getElementsByName('exercicesContainerName').length);

  if (document.getElementsByName('exosEditor').length == 0) {
    var index = document.getElementsByName('exosEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'exosEditor' + index);
    g.setAttribute('name', 'exosEditor');
    g.setAttribute('ng-App', 'exosApp' + index);
    document.getElementById('exosContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent">' + text + '</div><textarea style="display: none;" name="exercicesToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivExos()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p>';
    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';
    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p style="margin-bottom: 0;">' + lastName + '</p></div>';
    }
    var html5 = '</div></fieldset>';
    document.getElementById('exosEditor' + index).innerHTML += html1 + html2 + html3 + html4 + html5;
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('exosEditor' + index), ['exosApp' + index]);
  } else {
    var index = document.getElementsByName('exosEditor').length;
    var g = document.createElement('div');
    g.setAttribute('id', 'exosEditor' + index);
    g.setAttribute('name', 'exosEditor');
    g.setAttribute('ng-App', 'exosApp' + index);
    document.getElementById('exosContainer').appendChild(g);
    var html1 = '<fieldset class="form-group position-relative has-icon-left"><div text-angular ng-model="htmlcontent">' + text + '</div><textarea style="display: none;" name="exercicesToDoList" ng-model="htmlcontent" style="width: 100%"></textarea>';
    var html2 = '<div style="float: right;"><button class="btn btn-sm btn-danger btn-min-width text-bold-600" type="button" name="btnDelete" onclick="deleteDiv(this)" style="padding-top: 0px; padding-bottom: 0px;"><i class="far fa-trash-alt"></i> Supprimer</button> <button class="btn btn-sm bg-school-plus btn-min-width text-bold-600" onclick="addEmptyDivExos()" type="button" style="padding-top: 0px; padding-bottom: 0px;"><i class="fas fa-plus"></i> Ajouter</button></div>';
    var html3 = '<p class="card-title">Exemple: 1-5, 8, 11-13</p>';
    var html4 = '<div style="text-align: center;display: flex; flex-direction: row; width = 100%">';
    for (var i = 0; i < namesArray.length; i++) {
      var splitArray = namesArray[i].split(' ');
      // var firstName = splitArray[0];
      var lastName = splitArray[1];
      html4 += '<div style="margin-right: 10px;"><input type="radio" name="" value="' + smileysArray[i] + '" class="radio-smiley-small ' + smileysArray[i] + '" checked="checked"><p style="margin-bottom: 0;">' + lastName + '</p></div>';
    }
    var html5 = '</div></fieldset>';
    document.getElementById('exosEditor' + index).innerHTML += html1 + html2 + html3 + html4 + html5;
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).controller('myController', function ($scope) {
      $scope.orightml = 'This is your new editor';
      $scope.html = $scope.orightml;
      $scope.disabled = false;
    });
    angular.module('exosApp' + index, ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']).config(function ($provide) {
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
    angular.bootstrap(document.getElementById('exosEditor' + index), ['exosApp' + index]);
  }
}

// function wysiwygeditor($scope) {
//   // console.log($scope);
//   $scope.orightml = 'Nouveau texte';
//   $scope.htmlcontent = $scope.orightml;
//   $scope.disabled = false;

// };

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

$('#btnPDFCours').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFCours2.style.display == "none") {
      sectionPDFCours2.style.display = "block";
    }
    else if (sectionPDFCours2.style.display == "block") {
      sectionPDFCours2.style.display = "none";
    }
  } else {
    if (sectionPDFCours.style.display == "none") {
      sectionPDFCours.style.display = "block";
    }
    else if (sectionPDFCours.style.display == "block") {
      sectionPDFCours.style.display = "none";
    }
  }
});

$('#btnPDFExercices').on('click', function () {
  if ($(window).width() < 1280) {
    if (sectionPDFExercices2.style.display == "none") {
      sectionPDFExercices2.style.display = "block";
    }
    else if (sectionPDFExercices2.style.display == "block") {
      sectionPDFExercices2.style.display = "none";
    }
  }
  else {
    if (sectionPDFExercices.style.display == "none") {
      sectionPDFExercices.style.display = "block";
    }
    else if (sectionPDFExercices.style.display == "block") {
      sectionPDFExercices.style.display = "none";
    }
  }
});

$('#btnDeleteCours').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer la fiche de cours ?",
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
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);
      var newNumeroChapitre = numberChapitre.innerText;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var fileUrl = 'fiches_cours/' + doc.data().idAdmin + '_' + $('select#selectClass').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFCours').style.display = 'none';
            document.getElementById('btnDeleteCours').style.display = 'none';
            document.getElementById('btnPDFCours').style.display = 'none';
            document.getElementById('coursError').style.display = 'block';
            swal({
              title: "La fiche de cours a bien été supprimée.",
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
      swal("Annulation", "La fiche de cours n'a pas été supprimée.", "error");
    }
  });
});

$('#btnDeleteExo').click(function () {
  var user = auth.currentUser;
  var storageRef = firebase.storage().ref();
  swal({
    title: "Supprimer la fiche d'exercices ?",
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
      var nomMatiere = $('select#selectMatiere').val();
      if (nomMatiere.indexOf(' ') >= 0) {
        console.log("true");
        nomMatiere = nomMatiere.replace(/\s+/g, '-');
      }
      nomMatiere = nomMatiere.replace('é', 'e');
      nomMatiere = nomMatiere.replace('è', 'e');
      // console.log("ICI :"+ nomMatiere);
      var newNumeroChapitre = numberChapitre.innerText;
      if (newNumeroChapitre.indexOf(' ') >= 0) {
        console.log("true");
        newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
      }
      console.log("Nom Matiere :", nomMatiere);
      console.log("New Numero chapitre: ", newNumeroChapitre);
      firestore.collection('users').doc(user.uid).get()
        .then(function (doc) {
          var fileUrl = 'fiches_exos/' + doc.data().idAdmin + '_' + $('select#selectClass').val() + '_' + nomMatiere + '_' + newNumeroChapitre + ".pdf";
          var ref = storageRef.child(fileUrl);
          ref.delete().then(function () {
            console.log("Delete complete");
            document.getElementById('sectionPDFExercices').style.display = 'none';
            document.getElementById('btnDeleteExo').style.display = 'none';
            document.getElementById('btnPDFExercices').style.display = 'none';
            document.getElementById('exosError').style.display = 'block';
            swal({
              title: "La fiche d'exercices a bien été supprimée.",
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
      swal("Annulation", "La fiche d'exercice n'a pas été supprimée.", "error");
    }
  });
});

$('#formToDoList').submit(function (ev) {
  ev.preventDefault();
  var user = auth.currentUser;
  var valCours = [];
  var valExos = [];
  var suiviCoursArray = [];
  var suiviExosArray = [];
  var tempCoursArray = [];
  var tempExosArray = [];
  var hasSubject = false;
  //We store value of inputs into valCours[]
  $('textarea[name="coursToDoList"]').each(function (i) {
    if ($(this).val() != '') {
      valCours[i] = $(this).val();
    }
    // console.log("VAL :" +$(this).val());
  });
  $('textarea[name="exercicesToDoList"]').each(function (i) {
    if ($(this).val() != '') {
      valExos[i] = $(this).val();
    }
    // console.log("VAL :" +$(this).val());
  });
  console.log("Look down for valCours");
  console.log(valCours);
  console.log("Look down for valExos");
  console.log(valExos);
  //We query userdoc to get idAdmin
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      //We query considered chapter document
      firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numberChapitre.innerText).get()
        .then(function (docAdmin) {
          //COURS SECTION
          if (typeof docAdmin.data().cours == "string" || typeof docAdmin.data().cours == "object" && typeof docAdmin.data().cours[0] == "string" || typeof docAdmin.data().cours == "object" && docAdmin.data().cours.length < 1) {
            console.log("Cours is a string or object followed by a string or empty object, we can initialise");
            //We query students of the selected class. But we also need to filter student who have this particularly matiere
            firestore.collection('users').where('userCategory', '==', 'student').where("classe", "==", $('select#selectClass').val()).where("instituteName", "==", docUser.data().instituteName).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  //Now we prepare the suiviArray with name and ids of students + avancement set on sad
                  //For each student we have to check if they have the selected matiere.
                  doc.data().matieres.forEach(function (elem) {
                    if (elem.matiere == $('select#selectMatiere').val()) {
                      hasSubject = true;
                    }
                  });
                  if (hasSubject) {
                    suiviCoursArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "sad" })
                    hasSubject = false;
                  }
                });
                console.log("Look down");
                console.log(suiviCoursArray);
                //We fill tempCoursarray with inputs values + suiviCoursArray
                valCours.forEach(function (elem) {
                  tempCoursArray.push({ element: elem, suivi: suiviCoursArray });
                });
                console.log("Look Down");
                console.log(tempCoursArray);
                //We can push into db
                firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numberChapitre.innerText)
                  .set({
                    cours: tempCoursArray
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("Array written into DB");
                    }).catch(function (err) {
                      console.log("Error : ", err);
                    });
              }).catch(function (err) {
                console.log("Error: ", err);
              });
          } else if (typeof docAdmin.data().cours == "object" && docAdmin.data().cours.length > 0) {
            console.log("object with map, we check for replacement");
            var previousCoursLabels = [];
            var coursToBePushed = [];
            docAdmin.data().cours.forEach(function (elem) {
              previousCoursLabels.push(elem.element);
              coursToBePushed.push(elem);
            });
            console.log("Look down for peviousCoursLabels array");
            console.log(previousCoursLabels);
            console.log("Look down for coursToBePushed array :");
            console.log(coursToBePushed);
            docAdmin.data().cours[0].suivi.forEach(function (elem) {
              suiviCoursArray.push({ avancement: "sad", studentId: elem.studentId, studentName: elem.studentName });
            });
            console.log("Look down for suiviCoursArray");
            console.log(suiviCoursArray);
            // Case 1 : check if a value has been added --> initialise new array index
            /* if (valCours.length > previousCoursLabels.length) {
              console.log("Entering case 1");
              valCours.forEach(function (elem) {
                if (!previousCoursLabels.includes(elem)) {
                  coursToBePushed.push({ element: elem, suivi: suiviCoursArray });
                }
              });
            } */
            //Case 2 : check if a value has been removed
            /*   if (valCours.length < previousCoursLabels.length) {
                console.log("Entering case 2");
                coursToBePushed.forEach(function (elem) {
                  if (!valCours.includes(elem.element)) {
                    coursToBePushed = coursToBePushed.filter(function (value) {
                      return value !== elem;
                    });
                  }
                });
              } */
            //Case 3 : we check if values have been replaced
            // if (valCours.length == previousCoursLabels.length) {
            console.log("Entering case 3");
            valCours.forEach(function (elem) {
              if (!previousCoursLabels.includes(elem)) {
                coursToBePushed.push({ element: elem, suivi: suiviCoursArray });
              }
            });
            coursToBePushed.forEach(function (elem) {
              if (!valCours.includes(elem.element)) {
                coursToBePushed = coursToBePushed.filter(function (value) {
                  return value !== elem;
                });
              }
            });
            // }
            console.log("Look down for updated coursToBePushed");
            console.log(coursToBePushed);
            //Good to push
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numberChapitre.innerText)
              .set({
                cours: coursToBePushed
              },
                {
                  merge: true
                }).then(function () {
                  console.log("Array written into DB");
                }).catch(function (err) {
                  console.log("Error : ", err);
                });
          }
          //FIN SECTION COURS
          //SECTION EXOS
          if (typeof docAdmin.data().exercices == "string" || typeof docAdmin.data().exercices == "object" && typeof docAdmin.data().exercices[0] == "string" || typeof docAdmin.data().exercices == "object" && docAdmin.data().exercices.length < 1) {
            console.log("Cours is a string or object followed by a string or empty object, we can initialise");
            //We query students of the selected class. But we also need to filter student who have this particularly matiere
            firestore.collection('users').where('userCategory', '==', 'student').where("classe", "==", $('select#selectClass').val()).where("instituteName", "==", docUser.data().instituteName).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  //Now we prepare the suiviExosArray with name and ids of students + avancement set on sad
                  //For each student we have to check if they have the selected matiere.
                  doc.data().matieres.forEach(function (elem) {
                    if (elem.matiere == $('select#selectMatiere').val()) {
                      hasSubject = true;
                    }
                  });
                  if (hasSubject) {
                    suiviExosArray.push({ studentId: doc.data().id, studentName: doc.data().firstName + " " + doc.data().lastName, avancement: "sad" })
                    hasSubject = false;
                  }
                });
                console.log("Look down");
                console.log(suiviExosArray);
                //We fill tempCoursarray with inputs values + suiviExosArray
                valExos.forEach(function (elem) {
                  tempExosArray.push({ element: elem, suivi: suiviExosArray });
                });
                console.log("Look Down");
                console.log(tempExosArray);
                //We can push into db
                firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numberChapitre.innerText)
                  .set({
                    exercices: tempExosArray
                  },
                    {
                      merge: true
                    }).then(function () {
                      console.log("Array written into DB");
                    }).catch(function (err) {
                      console.log("Error : ", err);
                    });
              }).catch(function (err) {
                console.log("Error: ", err);
              });
          } else if (typeof docAdmin.data().exercices == "object" && docAdmin.data().exercices.length > 0) {
            console.log("object with map, we check for replacement");
            var previousExosLabels = [];
            var exosToBePushed = [];
            docAdmin.data().exercices.forEach(function (elem) {
              previousExosLabels.push(elem.element);
              exosToBePushed.push(elem);
            });
            console.log("Look down for peviousExosLabels array");
            console.log(previousExosLabels);
            console.log("Look down for exosToBePushed array :");
            console.log(exosToBePushed);
            docAdmin.data().exercices[0].suivi.forEach(function (elem) {
              suiviExosArray.push({ avancement: "sad", studentId: elem.studentId, studentName: elem.studentName });
            });
            console.log("Look down for suiviExosArray");
            console.log(suiviExosArray);
            // Case 1 : check if a value has been added --> initialise new array index
            /*  if (valExos.length > previousExosLabels.length) {
               console.log("Entering case 1");
               valExos.forEach(function (elem) {
                 if (!previousExosLabels.includes(elem)) {
                   exosToBePushed.push({ element: elem, suivi: suiviExosArray });
                 }
               });
             }
             //Case 2 : check if a value has been removed
             if (valExos.length < previousExosLabels.length) {
               console.log("Entering case 2");
               exosToBePushed.forEach(function (elem) {
                 if (!valExos.includes(elem.element)) {
                   exosToBePushed = exosToBePushed.filter(function (value) {
                     return value !== elem;
                   });
                 }
               });
             } */
            //Case 3 : we check if values have been replaced
            // if (valExos.length == previousExosLabels.length) {
            console.log("Entering case 3");
            valExos.forEach(function (elem) {
              if (!previousExosLabels.includes(elem)) {
                exosToBePushed.push({ element: elem, suivi: suiviExosArray });
              }
            });
            exosToBePushed.forEach(function (elem) {
              if (!valExos.includes(elem.element)) {
                exosToBePushed = exosToBePushed.filter(function (value) {
                  return value !== elem;
                });
              }
            });
            // }
            console.log("Look down for updated exosToBePushed");
            console.log(exosToBePushed);
            //Good to push
            firestore.collection('users').doc(docUser.data().idAdmin).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc(numberChapitre.innerText)
              .set({
                exercices: exosToBePushed
              },
                {
                  merge: true
                }).then(function () {
                  console.log("Array written into DB");
                }).catch(function (err) {
                  console.log("Error : ", err);
                });
          }
          //FIN SECTION EXOS
        }).catch(function (err) {
          console.log("Error : ", err);
        });
    }).catch(function (err) {
      console.log("Error: ", err);
    });
  console.log("Form validé");
  $("#modalToDoList").modal("hide");
  //TODO
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

  if (thePDF.type == 'application/pdf') {
    console.log(thePDF);
    console.log("this is pdf");

  document.getElementById('sectionPDFCours').innerHTML = '<br><object data="' + window.URL.createObjectURL(new Blob([thePDF], {"type":"application/pdf"})) + '" type="application/pdf" width="100%" height="800px"></object>';
  document.getElementById('sectionPDFCours').style.display = 'block';      
/* queryUser.get()
          .then(function (doc) {
              firestore.collection('users').where("userCategory", "==", "admin").where("instituteName", "==", doc.data().instituteName).get()
                  .then(function (querySnapshot) {
                      querySnapshot.forEach(function (doc2) {
                          console.log("Admin :", doc2.data().id);
                          var uploadTask = storageRef.child("fiches_cours/" + doc2.data().id + "_" + thisIsLevel + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
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
                      });
                  }).catch(function (err) {
                      console.log("Error :", err);
                  });
          }).catch(function (err) {
              console.log("Error :", err);
          }); */
  }
});

$('#upload-exos').change(function () {
  var user = auth.currentUser;
  var errorMessage2 = document.getElementById('error-message2');
  var thePDF = document.getElementById('upload-exos').files[0];
  var storageRef = firebase.storage().ref();
  var uploadExosButton = document.getElementById('upload-exos');
  var queryUser = firestore.collection('users').doc(user.uid);
  //var uploadTask = storageRef.child('fiches_cours/')
  console.log("Entering upload function");
  errorMessage2.style.display = "none";
  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = numberChapitre.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (thePDF.type == 'application/pdf') {
    //METTRE UNE LIMITE SUR LA TAILLE DE FICHIER? 
    var uploadTask = storageRef.child("fiches_exos/" + user.uid + "_" + $('select#selectClass').val() + "_" + nomMatiere + "_" + newNumeroChapitre + ".pdf").put(thePDF);
    console.log("URL : " + uploadTask);
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
          pdfExos.data = downloadURL;
          $('#upload-exos').val('');
          document.getElementById('exosLoading').style.display = 'none';
          document.getElementById('exosError').style.display = 'none';
          document.getElementById('btnPDFExercices').style.display = 'block';
          document.getElementById('btnDeleteExo').style.display = 'block';
        });
        uploadExosButton.removeAttribute('disabled');
        uploadExosButton.setAttribute('enabled', '');
      });
  }
});
$('#upload-eval').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-eval').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = numberChapitre.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {
    var uploadTask = storageRef.child('sujets_evaluations/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf').put(theFile);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
      document.getElementById('upload-eval').setAttribute('disabled', '');
      document.getElementById('loadingImg').style.display = 'inline';
      document.getElementById('evalPresent').style.display = 'none';
      document.getElementById('evalNoPresent').style.display = 'none';
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
      uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
        document.getElementById('loadingImg').style.display = 'none';
        document.getElementById('evalLink').href = url;
        document.getElementById('evalNoPresent').style.display = 'none';
        document.getElementById('evalPresent').style.display = 'block';
        // document.getElementById('unlockEval').style.display = 'inline';
        // put a notif to the user
        var newNotif = {
          date: Math.floor(Date.now() / 1000),
          icon: "icon-mail icon-bg-circle bg-cyan",
          viewed: false,
          title: { en: "New message", fr: "Nouvelle évaluation" },
          description: { en: '<b>' + '</b> sent you a message. Go to the inbox corresponding to your email address (<i>' + 'la' + '</i>) to answer the message.', fr: 'Une nouvelle <b>évaluation</b> a été ajoutée pour le <b>' + numberChapitre.innerText + '</b> en <b>' + $('select#selectMatiere').val() + '</b>. Rendez-vous sur la page <i>Mes cours</i>pour la télécharger.' },
          url: "#"
        }
        firestore.collection('users').where('userCategory', '==', 'student').where('classe', '==', $('select#selectClass').val()).get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (docStudent) {
              console.log(docStudent.data().firstName + " " + docStudent.data().lastName);
              docStudent.data().matieres.forEach(function (elem) {
                if (elem.matiere == $('select#selectMatiere').val()) {
                  firestore.collection('users').doc(docStudent.data().id).update({
                    notifications: firebase.firestore.FieldValue.arrayUnion(newNotif),
                    newNotif: firebase.firestore.FieldValue.increment(1)
                  })
                    .then(() => {
                      setTimeout(() => {
                        console.log("Good");
                      }, 500);
                    })
                    .catch(err => {
                      console.log('Error updating the recipient: ' + err);
                    });
                }
              });
            });
          }).catch(function (err) {
            console.log("Error: ", err);
          });
      });
      //Attributes
      document.getElementById('upload-eval').removeAttribute('disabled');
      document.getElementById('upload-eval').setAttribute('enabled', '');
      document.getElementById('upload-eval').value = '';
    });
  }
});
$('#upload-correction').change(function () {
  var user = auth.currentUser;
  var theFile = document.getElementById('upload-correction').files[0];
  var storageRef = firebase.storage().ref();
  var nomMatiere = $('select#selectMatiere').val();
  if (nomMatiere.indexOf(' ') >= 0) {
    nomMatiere = nomMatiere.replace(/\s+/g, '-');
  }
  nomMatiere = nomMatiere.replace('é', 'e');
  nomMatiere = nomMatiere.replace('è', 'e');
  var newNumeroChapitre = chapitreNumber.innerText;
  if (newNumeroChapitre.indexOf(' ') >= 0) {
    newNumeroChapitre = newNumeroChapitre.replace(/\s+/g, '-');
  }
  if (theFile.type == 'application/pdf') {
    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {
        var uploadTask = storageRef.child('exos_corriges/' + user.uid + '_' + nomMatiere + '_' + $('select#selectClass').val() + '_' + newNumeroChapitre + '.pdf').put(theFile);
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
          document.getElementById('upload-correction').setAttribute('disabled', '');
          document.getElementById('loadingImgCorrection').style.display = 'inline';
          document.getElementById('correctionPresent').style.display = 'none';
          document.getElementById('correctionNoPresent').style.display = 'none';
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
          uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
            document.getElementById('loadingImgCorrection').style.display = 'none';
            document.getElementById('correctionLink').href = url;
            document.getElementById('correctionNoPresent').style.display = 'none';
            document.getElementById('correctionPresent').style.display = 'block';
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
function closeChapter(chapter) {
  $("#modalClosing").modal();
  var user = auth.currentUser;
  var submitButton = document.getElementById('submit-closing');
  var theClass = document.getElementById('classNameClosing');
  theClass.innerHTML = $('select#selectClass').val();
  var theTitle = document.getElementById('modalTitleClosing');
  theTitle.innerHTML = $('select#selectMatiere').val() + " - Clôturer le " + chapter;
  // var instituteName = document.getElementById('instituteName');
  var studentsList = document.getElementById('studentsList');
  studentsList.style.display = "";
  studentsList.innerHTML = "";
  // var idAdmin = document.getElementById('idAdmin').innerHTML;
  const studentsListHtml0 = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title text-bold-600">Pour toute la classe</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><input type="checkbox" id="wholeClass" class="switchery switchery-wholeclass"></div></div></fieldset><span class="hidden" id="closinChapterNumber">' + chapter + '</span><br>';
  const studentsListHtml1 = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title">';
  const studentsListHtml2 = '</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><input type="checkbox" id="';
  const studentsListHtml3 = '" class="switchery switchery-students"></div></div></fieldset>';
  const studentsListHtml0bis = '<fieldset class="form-group floating-label-form-group"><div class="row"><div class="col-xl-8 col-md-8 col-sm-8"><label class="card-title text-bold-600">Pour toute la classe</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><div class="help-block text-bold-600 text-success font-small-3"><i class="far fa-check-circle"></i> Chapitre terminé.</div></div></div></fieldset><span class="hidden" id="closinChapterNumber">' + chapter + '</span><br>';
  const studentsListHtml2bis = '</label></div><div class="col-xl-4 col-md-4 col-sm-4" style="text-align:center"><div class="help-block text-bold-600 text-success font-small-3"><i class="far fa-check-circle"></i> Chapitre terminé.</div></div></fieldset>';
  var studentsListHtml = "";
  var chapterCounter = 0;
  var chapterDuration = 0;
  var selectedChapter = 0;
  var missingTime = 0;
  var currentTime = 0;
  var hasStudentNotDone = false;
  var timeDone = 0;
  var currentChapter = 0;
  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {
      firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
        .then(function (querySnapshot2) {
          chapterCount = querySnapshot2.size;
          querySnapshot2.forEach(function (doc) {
            chapterCounter++;
            if (doc.id == "duration") {
              chapterDuration = Math.trunc(doc.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
              timeDone = doc.data().timeDone;
            }
            else {
              if (doc.data().numeroChapitre == chapter) {
                selectedChapter = chapterCounter;
              }
            }
          });
          goalDuration = chapterDuration * selectedChapter;
          firestore.collection('users').where("userCategory", '==', "student").where("instituteName", "==", docUser.data().instituteName).where("classe", "==", $('select#selectClass').val()).get()
            .then(function (querySnapshot) {
              querySnapshot.forEach((doc) => {
                if (doc.data().matieres != null) {
                  for (var j = 0; j < doc.data().matieres.length; j++) {
                    if (doc.data().matieres[j].matiere == $('select#selectMatiere').val()) {
                      currentTime = doc.data().matieres[j].timeDone + doc.data().matieres[j].timeValidated;
                      missingTime = goalDuration - currentTime;
                      currentChapter = Math.trunc(currentTime / chapterDuration) + 1;
                      if (missingTime >= chapterDuration)
                        currentProgress = 0;
                      else
                        currentProgress = ((currentTime - (currentChapter - 1) * chapterDuration) / chapterDuration) * 100;
                      if (missingTime >= 1) {
                        hasStudentNotDone = true;
                        studentsListHtml += studentsListHtml1 + doc.data().firstName + ' ' + doc.data().lastName + ' (' + Math.trunc(currentProgress) + '%) ' + studentsListHtml2 + doc.id + studentsListHtml3;
                      }
                      else
                        studentsListHtml += studentsListHtml1 + doc.data().firstName + ' ' + doc.data().lastName + studentsListHtml2bis;
                      break;
                    }
                  }
                }
              });
              if (!hasStudentNotDone && goalDuration <= timeDone) {
                studentsList.innerHTML = studentsListHtml0bis + studentsListHtml;
                var loadingPicture = document.getElementById('loading-picture');
                loadingPicture.style.display = "none";
              }
              else {
                studentsList.innerHTML = studentsListHtml0 + studentsListHtml;
                var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
                elems.forEach(function (html) {
                  var switchery = new Switchery(html, { size: 'medium' });
                });
                var changeCheckbox = document.querySelector('.switchery-wholeclass');
                changeCheckbox.onchange = function () {
                  if (changeCheckbox.checked) {
                    var students = document.getElementsByClassName('switchery-students');
                    for (var i = 0; i < students.length; i++) {
                      if (!students[i].checked)
                        students[i].click();
                    }
                  }
                };
                submitButton.removeAttribute('disabled');
                submitButton.setAttribute('enabled', '');
                var loadingPicture = document.getElementById('loading-picture');
                loadingPicture.style.display = "none";
              }
            })
            .catch((err) => {
              console.log("error getting students " + err);
            });
        })
        .catch((err) => {
          console.log("Error getting subject: " + err);
        });
    }).catch(function (err) {
      console.log("Error : ", err);;
    })
}
function closeChapterCallback(studentsCounter, goalDuration) {
  if (studentsCounter >= 1) {
    var studentId = 0;
    var myStudent = 0;
    var nbStudents = 0;
    var missingTime = 0;
    var currentTime = 0;
    var subjectArray = [];
    var students = document.getElementsByClassName('switchery-students');
    for (var i = 0; i < students.length; i++) {
      if (students[i].checked) {
        nbStudents++;
        if (nbStudents == studentsCounter)
          studentId = students[i].id;
      }
    }
    firestore.collection('users').doc(studentId).get()
      .then((doc) => {
        if (doc.data().matieres != null) {
          subjectArray = doc.data().matieres;
          for (var j = 0; j < subjectArray.length; j++) {
            if (subjectArray[j].matiere == $('select#selectMatiere').val()) {
              currentTime = subjectArray[j].timeDone + subjectArray[j].timeValidated;
              missingTime = goalDuration - currentTime;
              if (missingTime >= 1)
                subjectArray[j].timeValidated += missingTime;
              break;
            }
          }
          if (missingTime >= 0) {
            firestore.collection('users').doc(studentId).update({
              matieres: subjectArray
            })
              .then(() => {
                closeChapterCallback(studentsCounter - 1, goalDuration);
              })
              .catch((err) => {
                console.log("Error updating the student: " + err);
              });
          }
          else {
            closeChapterCallback(studentsCounter - 1, goalDuration);
            $("#modalClosing").modal("hide");
          }
        }
      })
      .catch((err) => {
        console.log("Error getting the student: " + err);
      });
  }
  else {
    $("#modalClosing").modal("hide");
  }
};
$('#formClosing').submit(function (ev) {
  ev.preventDefault();
  var user = auth.currentUser;
  var submitButton = document.getElementById('submit-closing');
  submitButton.removeAttribute('enabled');
  submitButton.setAttribute('disabled', '');
  var studentsList = document.getElementById('studentsList');
  studentsList.style.display = "none";
  var loadingPicture = document.getElementById('loading-picture');
  loadingPicture.style.display = "";
  // var instituteName = document.getElementById('instituteName').innerHTML;
  // var idAdmin = document.getElementById('idAdmin').innerHTML;
  var chapterNumber = document.getElementById('closinChapterNumber').innerHTML;
  var chapter = 0;
  var chapterCounter = 0;
  var selectedChapter = 0;
  var goalDuration = 0;
  var nbStudents = 0;
  var timeDone = 0;
  firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).get()
    .then(function (querySnapshot2) {
      chapterCount = querySnapshot2.size;
      querySnapshot2.forEach(function (doc) {
        chapterCounter++;
        if (doc.id == "duration") {
          chapterDuration = Math.trunc(doc.data().nbOfHours / (chapterCount - 1)); // to get the theorical number of hours per week of the current subject
          timeDone = doc.data().timeDone;
        }
        else {
          if (doc.data().numeroChapitre == chapterNumber) {
            selectedChapter = chapterCounter;
          }
        }
      });
      goalDuration = chapterDuration * selectedChapter;
      var students = document.getElementsByClassName('switchery-students');
      for (var i = 0; i < students.length; i++) {
        if (students[i].checked) {
          nbStudents++;
        }
      }
      var wholeClass = document.getElementById('wholeClass');
      if (wholeClass.checked && goalDuration > timeDone) {
        // update the duration document corresponding to the subject so that it reaches 100% if wholeClass is checked
        firestore.collection('users').doc(user.uid).collection('classes').doc($('select#selectClass').val()).collection($('select#selectMatiere').val()).doc('duration').update({
          timeDone: goalDuration
        })
          .then(() => {
            var progressBars = document.getElementsByTagName('progress');
            var completion = document.getElementsByClassName('completion');
            var closingButtons = document.getElementsByClassName('btn-closing');
            progressBars[selectedChapter - 1].value = 100;
            progressBars[selectedChapter - 1].className = "progress progress-md progress-success progress";
            completion[selectedChapter - 1].innerHTML = "100%";
            if (closingButtons[selectedChapter] != null) {
              closingButtons[selectedChapter].removeAttribute('disabled');
              closingButtons[selectedChapter].setAttribute('enabled', '');
            }
            closeChapterCallback(nbStudents, goalDuration);
          })
          .catch((err) => {
            console.log("Error updating the global duration: " + err);
          });
      }
      else
        closeChapterCallback(nbStudents, goalDuration);
    })
    .catch((err) => {
      console.log("Error getting the chapters " + err);
    });
});



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