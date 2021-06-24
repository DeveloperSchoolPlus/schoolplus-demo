//Initialise textAngular
/* Initialisation create chapter editor */
var createChapterApp = angular.module('createChapterApp', ['textAngular', 'angularSpectrumColorpicker', 'ui.bootstrap.dropdownToggle']);
createChapterApp.config(function ($provide) {
  $provide.decorator('taOptions', ['taRegisterTool', 'taToolFunctions', '$delegate', function (taRegisterTool, taToolFunctions, taOptions) {
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
              console.log("ici");
              // console.log(e.target);
            };

            reader.readAsDataURL(this.files[0]);
            // console.log(reader.readAsDataURL(this.files[0]));
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
      display: "<span class='bar-btn-dropdown dropdown'> \n\
                            <button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px;padding-bottom:4px;'> \n\
                                <i class='fa fa-font'></i> \n\
                                <i class='fa fa-caret-down'></i>\n\
                            </button> \n\
                            <ul class='dropdown-menu'>\n\
                                <li ng-repeat='o in options'>\n\
                                    <button class='btn btn-blue checked-dropdown' style='font-family: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.css)'>\n\
                                        <i ng-if='o.active' class='fa fa-check'></i>{{o.name}}\n\
                                    </button>\n\
                                </li>\n\
                            </ul>\n\
                        </span>",
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
      display: "<span class='bar-btn-dropdown dropdown' style='padding-right: 0px;padding-left:0px;'>\n\
                            <button class='btn btn-blue dropdown-toggle' type='button' ng-disabled='showHtml()' style='padding-top: 4px;padding-bottom:4px;'>\n\
                                <i class='fa fa-text-height'></i>\n\
                                <i class='fa fa-caret-down'></i>\n\
                            </button>\n\
                            <ul class='dropdown-menu'>\n\
                                <li ng-repeat='o in options'>\n\
                                    <button class='btn btn-blue checked-dropdown' style='font-size: {{o.css}}; width: 100%' type='button' ng-click='action($event, o.value)'>\n\
                                        <i ng-if='o.active' class='fa fa-check'></i> {{o.name}}\n\
                                    </button>\n\
                                </li>\n\
                            </ul>\n\
                        </span>",
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

function sendMessageController($scope) {
  $scope.html = '';
  $scope.htmlcontent = $scope.html;
  $scope.disabled = false;
}




//Detect a change on the user catgory filter
$('select#selectRecipientCategory').on('change', function () {
  console.log($(this).val());
  if ($(this).val() == 'all') {
    selectAllUsers();
  }
  else {
    initRecipientList($(this).val());
  }
});


function selectAllUsers() {
  var user = auth.currentUser;
  document.getElementById('RecipientMailForm').style.display = 'none';// A CHANGER EN NONE APRES TEST
  document.getElementById('selectMailRecipient').selectize.clearOptions();

  firestore.collection('users').doc(user.uid).get().then(function (docUser) {
    firestore.collection('users').where('instituteName', '==', docUser.data().instituteName).get()
      .then(function (querySnapshot) {
        var tempArray = [];
        querySnapshot.forEach(function (doc) {
          if (doc.id != user.uid) {
            document.getElementById('selectMailRecipient').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
            tempArray.push(doc.id);
          }
        });
        var $select = $('select#selectMailRecipient').selectize();
        var control = $select[0].selectize;
        control.setValue(tempArray);
      }).catch(function (err) {
        console.log("Error: ", err);
      })
  }).catch(function (err) {
    console.log("Error: ", err);
  });


}

function initRecipientList(userCategory) {
  console.log("initRecipientList");
  console.log(userCategory);
  if (userCategory != '') {
    var user = auth.currentUser;
    var categorie;
    switch (userCategory) {
      case 'student':
        categorie = 'apprenants';
        break;
      case 'teacher':
        categorie = 'formateurs';
        break;
      case 'author':
        categorie = 'auteurs';
        break;
      case 'admin':
        categorie = 'administrateurs';
        break;
    }

    document.getElementById('selectMailRecipient').selectize.clearOptions();

    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {
        //1st query user doc to get instituteName
        //Then query all users
        firestore.collection('users').where('instituteName', '==', docUser.data().instituteName).where('userCategory', '==', userCategory).get()
          .then(function (querySnapshot) {
            document.getElementById('selectMailRecipient').selectize.addOption({ value: 'all', text: 'Tous les ' + categorie });
            querySnapshot.forEach(function (doc) {
              if (doc.id != user.uid) {
                //We take every users except the one who sends the mail
                document.getElementById('selectMailRecipient').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
              }
              var $select = $('select#selectMailRecipient').selectize();
              var control = $select[0].selectize;
              control.clear();
            });
            document.getElementById('RecipientMailForm').style.display = 'block';
          }).catch(function (err) {
            console.log("error: ", err);
          });
      }).catch(function (err) {
        console.log("Error: ", err);
      });

  }

}

//Initialise the form depending on userCategory
function initMessageForm(userCategory) {

  switch (userCategory) {
    case 'admin':
      document.getElementById('adminMailForm').style.display = 'none';
      // document.getElementById('adminMailForm').className = '';

      break;
    case 'parent':
      document.getElementById('parentMailForm').style.display = 'none';
      document.getElementById('studentMailForm').style.display = 'none';
      break;
    case 'teacher':
      document.getElementById('teacherMailForm').style.display = 'none';
      document.getElementById('adminMailForm').style.display = 'none';
      break;
    case 'student':
      document.getElementById('parentMailForm').style.display = 'none';
      document.getElementById('studentMailForm').style.display = 'none';
      break;
  }
}

//Initialise Admin list
function initAdminList(instituteName) {
  firestore.collection('users').where('userCategory', '==', 'admin').where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docAdmin) {
        document.getElementById('selectMailAdmin').selectize.addOption({ value: docAdmin.id, text: docAdmin.data().firstName + ' ' + docAdmin.data().lastName });
      });
      var $select = $('select#selectMailAdmin').selectize();
      var control = $select[0].selectize;
      control.clear();
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

//Initialise Parent list
function initParentList(instituteName) {
  firestore.collection('users').where('userCategory', '==', 'parent').where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docParent) {

        firestore.collection('users').doc(docParent.data().linkedAccount).get()
          .then(function (docStud) {

            if (docStud.data().displayTestAccount == true || docStud.data().displayTestAccount == undefined) {
              document.getElementById('selectMailParent').selectize.addOption({ value: docParent.id, text: docParent.data().firstName + ' ' + docParent.data().lastName + ' (' + docStud.data().firstName + ' ' + docStud.data().lastName + ')' });

            }

          }).catch(function (err) {
            console.log("error: ", err);
          });


      });
      var $select = $('select#selectMailParent').selectize();
      var control = $select[0].selectize;
      control.clear();
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

//Initialise Teacher list
function initTeacherList(instituteName) {

  var userNotToDisplay = ["5ZLrnXE5FXSKWzVZhjSge9BcGPn2", "CMBhDZ0T0lZxqPUBiXYMqKcRtxg2", "cVdmeheFOMS7hUbFL5k3bTTvVWD3"];
  //Antonina, Philippe Malvaux, Philippe Viot

  firestore.collection('users').where('userCategory', '==', 'teacher').where('instituteName', '==', instituteName).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (docTeacher) {
        if (!userNotToDisplay.includes(docTeacher.id)) {
          document.getElementById('selectMailTeacher').selectize.addOption({ value: docTeacher.id, text: docTeacher.data().firstName + ' ' + docTeacher.data().lastName });
        }
      });
      var $select = $('select#selectMailTeacher').selectize();
      var control = $select[0].selectize;
      control.clear();
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

//Initialise a filtered Student list
function initFilteredStudentList(array) {
  var user = auth.currentUser;
  console.log("New filter");
  //1st we clear student select
  document.getElementById('selectMailStudent').selectize.clearOptions();

  //We query the user to get institueName

  firestore.collection('users').doc(user.uid).get()
    .then(function (docUser) {

      if (array.length == 0) {
        firestore.collection('users').where('userCategory', '==', 'student').where('instituteName', '==', docUser.data().instituteName).get()
          .then(function (querySnapshot) {
            document.getElementById('selectMailStudent').selectize.addOption({ value: 'all', text: 'Tous les élèves' });

            querySnapshot.forEach(function (docStud) {
              if (docStud.data().displayTestAccount == true || docStud.data().displayTestAccount == undefined) {
                if (docStud.data().soutien != true) {
                  document.getElementById('selectMailStudent').selectize.addOption({ value: docStud.id, text: docStud.data().firstName + ' ' + docStud.data().lastName });
                  var $select = $('select#selectMailStudent').selectize();
                  var control = $select[0].selectize;
                  control.clear();
                }

              }
            });
          }).catch(function (err) {
            console.log("error: ", err);
          });
      }
      else {
        //2nd we go through the array and look for wanted students
        document.getElementById('selectMailStudent').selectize.addOption({ value: 'groupe', text: 'Tout le groupe' });


        for (var i = 0; i < array.length; i++) {
          firestore.collection('users').where('instituteName', '==', docUser.data().instituteName).where('userCategory', '==', 'student').where('classe', '==', array[i]).get()
            .then(function (querySnapshot) {
              querySnapshot.forEach(function (doc) {

                if (doc.data().displayTestAccount == true || doc.data().displayTestAccount == undefined) {
                  document.getElementById('selectMailStudent').selectize.addOption({ value: doc.id, text: doc.data().firstName + ' ' + doc.data().lastName });
                  var $select = $('select#selectMailStudent').selectize();
                  var control = $select[0].selectize;
                  control.clear();
                }

              });
            }).catch(function (err) {
              console.log("error: ", err);
            });

        }
      }







    }).catch(function (err) {
      console.log("Error: ", err);
    })




}

//Initialise filter list
function initLevelList(idAdmin) {
  firestore.collection('users').doc(idAdmin).collection('classes').get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        document.getElementById('selectMailLevel').selectize.addOption({ value: doc.id, text: doc.data().nomClasse });
      });
      var $select = $('select#selectMailLevel').selectize();
      var control = $select[0].selectize;
      control.clear();
    }).catch(function (err) {
      console.log("Error: ", err);
    });
}

//Opens mail modal
function sendMailToGroup() {
  console.log("sendMailToGroup();");
  $('#modalMessage').modal();
}

//Create the array with Ids of all recipients
function sendGroupMessage() {
  console.log("MESSAGE");
  console.log("Destinataires: " + $('select#selectMailRecipient').val());
  console.log("Nombre de destinataires :" + $('select#selectMailRecipient').val().length);

  if ($('select#selectMailRecipient').val().length == 0) {
    console.log("case 1")
    alert("Attention, vous devez sélectionner au moins un destinataire.");
    // $('#modalMessage').modal();

  }
  else {
    console.log("case 2");
    //Initialise the progress modal
    document.getElementById('progressAddMail').value = 0;
    document.getElementById('progressMessageMail').value = "Le message est en cours d'envoi, veuillez patienter s'il vous plaît.";
    document.getElementById('progressAddValueMail').innerText = "0%"
    //Opening the progress modal
    $('#modalProgressMail').modal({
      backdrop: 'static', //Both parameters to prevent closing the modal if download not finished
      keyboard: false
    });
    //UNCOMMENT ABOVE WHEN OK

    var user = auth.currentUser;
    var destinatairesIds = [];
    //Change for student after test
    var destinatairesMails = [];
    var destinatairesNames = [];

    //Initialise destintaires array
    destinatairesIds = $('select#selectMailRecipient').val();

    //Check if ALL is selected
    if (destinatairesIds.includes('all')) {
      destinatairesIds = [];
      var options = $('select#selectMailRecipient')[0].selectize.options;
      Object.keys(options).forEach(function (key) {
        if (options[key].value != 'all') {
          destinatairesIds.push(options[key].value);
        }
      });
    }
    console.log(destinatairesIds);
    getMailFromIds(destinatairesIds, destinatairesMails, destinatairesNames, 0);
  }
}

//Create another array with emails based on previously generated array, then send the message
function getMailFromIds(destinatairesIds, destinatairesMails, destinatairesNames, index) {

  if (index < destinatairesIds.length) {
    firestore.collection('users').doc(destinatairesIds[index]).get()
      .then(function (doc) {
        destinatairesMails.push(doc.data().email);
        destinatairesNames.push(doc.data().firstName + ' ' + doc.data().lastName);
        index++;
        getMailFromIds(destinatairesIds, destinatairesMails, destinatairesNames, index);
      }).catch(function (err) {
        console.log("Error: ", err);
        messageNotSent();
      });
  }
  else {
    console.log(destinatairesMails);
    console.log("Done. Good to send message");

    console.log(document.getElementById('sendMessageArea').value);

    document.getElementById('form-messageMail').value = document.getElementById('sendMessageArea').value;
    var destinataires = '';
    for (var i = 0; i < destinatairesMails.length; i++) {
      if (i == destinatairesMails.length - 1) {
        destinataires += destinatairesMails[i];
      }
      else {
        destinataires += destinatairesMails[i] + ',';
      }
    }

    var user = auth.currentUser;
    firestore.collection('users').doc(user.uid).get()
      .then(function (docUser) {

        console.log(destinataires);
        document.getElementById('form-firstnametoMail').value = 'test';
        document.getElementById('form-subjectMail').value = document.getElementById('subject').value;

        document.getElementById('form-recipientMail').value = destinataires;
        document.getElementById('form-firstnamefromMail').value = docUser.data().firstName;

        document.getElementById('form-senderMail').value = user.email;

        console.log(destinataires);

        /* Prepare for saving */
        //We include in formation of the user sending the mail
        destinatairesIds.push(user.uid);
        destinatairesMails.push(docUser.data().email);
        destinatairesNames.push(docUser.data().firstName + ' ' + docUser.data().lastName);

        console.log(destinatairesIds);
        console.log(destinatairesNames)
        //Now we're ready to save. Before saving we need to check whether the conversation already exists or not

        saveTheConversation(destinatairesIds, destinatairesMails, destinatairesNames, docUser.data().instituteName);
        //UNCOMENT ABOVE WHEN READY
        //uncomment to send email, add the discount code to the message
        // document.getElementById('sendMailToGroupForm').submit();

      }).catch(function (err) {
        console.log('Error: ', err);
        messageNotSent();
      });



  }

}

//Used to update/create doc and creating json
function saveTheConversation(arrayIds, arrayMails, arrayNames, instituteName) {

  var user = auth.currentUser;
  console.log(arrayIds);

  //Update the progress modal message
  document.getElementById('progressMessageMail').innerText = 'Sauvegarde du message en cours';

  firestore.collection('messages').where('discussionUsersIds', 'array-contains', user.uid).get()
    .then(function (querySnapshot) {
      if (querySnapshot.size == 0) {
        //The conversation does not exist yet
        //We need to build the json + doc

        console.log("the conversation doesnt exist");
        var dateOfMessage = Date.now();



        //Create the doc with automatically generated Id
        firestore.collection('messages').add({
          dateOfFirstMessage: dateOfMessage,
          dateOfLastMessage: dateOfMessage,
          discussionUsersIds: arrayIds,
          discussionUsersNames: arrayNames,
          discussionUsersMails: arrayMails,
          numberOfMessage: 1,
          instituteName: instituteName
        }).then(function (docRef) {
          //Create then save the json
          var recipientIds = [];
          for (var i = 0; i < arrayIds.length; i++) {
            if (i < arrayIds.length - 1) {
              recipientIds.push(arrayIds[i]);
            }
          }
          console.log(recipientIds);
          var jsonObject = {
            "messages": [
              {
                "dateOfMessage": dateOfMessage,
                "message": document.getElementById('sendMessageArea').value,
                "senderId": user.uid,
                "recipientId": recipientIds,
                "subject": document.getElementById('subject').value
              }
            ]
          };
          var formatedJson = JSON.stringify(jsonObject);
          var file = new Blob([formatedJson], { type: 'application/json' });
          saveTheJson(file, docRef);
        }).catch(function (err) {
          console.log("Error : ", err);
          messageNotSent();
        });

      }
      else {
        //The conversation already exists
        //We need to update the json, get the new number of message, and then update the doc
        console.log("maybe the conversation already exists");
        //Here we have to check for every doc if it exists

        var conversationExists = false;
        var isIncluded = false;
        var idOfExistingConversation = '';

        /* Bloc to detect if the conversation exists */
        querySnapshot.forEach(function (doc) {

          if (doc.data().discussionUsersIds.length == arrayIds.length) {
            var arrayExist = [];
            doc.data().discussionUsersIds.forEach(function (elem) {
              if (arrayIds.includes(elem)) {
                arrayExist.push(true);
              }
              else {
                arrayExist.push(false);
              }
            });

            if (!arrayExist.includes(false)) {
              conversationExists = true;
              idOfExistingConversation = doc.id
            }
          }

        });
        /* End of bloc */
        if (conversationExists) {
          console.log("The conversation actually already exists");
          console.log("the id: ", idOfExistingConversation);
          //Here we need to get the json, update it, update the doc
          firebase.storage().ref("messages/" + idOfExistingConversation).getDownloadURL().then(function (contentUrl) {
            $.ajax({
              type: 'GET',
              
              url: contentUrl
            }).then(function (data) {
              console.log(data);
              var existingMessages = data.messages;
              var dateOfMessage = Date.now();
              console.log(arrayIds);
              console.log(arrayIds.length);
              var recipientIds = [];
              for (var i = 0; i < arrayIds.length; i++) {
                if (i < arrayIds.length - 1) {
                  recipientIds.push(arrayIds[i]);
                }
              }

              console.log(recipientIds);
              existingMessages.push({
                "dateOfMessage": dateOfMessage,
                "message": document.getElementById('sendMessageArea').value,
                "senderId": user.uid,
                "recipientId": recipientIds,
                "subject": document.getElementById('subject').value
              });
              var jsonObject = {
                "messages": existingMessages
              };
              var numberOfMessages = existingMessages.length;
              console.log(jsonObject);

              //Update the doc and then upload new json;
              firestore.collection('messages').doc(idOfExistingConversation).update({
                numberOfMessage: numberOfMessages,
                dateOfLastMessage: dateOfMessage
              }).then(function () {
                //Update json
                var formatedJson = JSON.stringify(jsonObject);
                var file = new Blob([formatedJson], { type: 'application/json' });
                console.log(formatedJson);
                var docRef = {
                  id: idOfExistingConversation
                };
                saveTheJson(file, docRef, jsonObject);

              }).catch(function (err) {
                console.log("Error: ", err);
                messageNotSent();
              });

            });
          }).catch(function (err) {
            console.log("Error: ", err);
            messageNotSent();
          });

        }
        else {
          console.log("Actually the conversation doesnt exists");
          var dateOfMessage = Date.now();



          //Create the doc with automatically generated Id
          firestore.collection('messages').add({
            dateOfFirstMessage: dateOfMessage,
            dateOfLastMessage: dateOfMessage,
            discussionUsersIds: arrayIds,
            discussionUsersNames: arrayNames,
            discussionUsersMails: arrayMails,
            numberOfMessage: 1,
            instituteName: instituteName
          }).then(function (docRef) {
            //Create then save the json
            var recipientIds = [];
            for (var i = 0; i < arrayIds.length; i++) {
              if (i < arrayIds.length - 1) {
                recipientIds.push(arrayIds[i]);
              }
            }
            console.log(recipientIds);
            var jsonObject = {
              "messages": [
                {
                  "dateOfMessage": dateOfMessage,
                  "message": document.getElementById('sendMessageArea').value,
                  "senderId": user.uid,
                  "recipientId": recipientIds,
                  "subject": document.getElementById('subject').value
                }
              ]
            };
            var formatedJson = JSON.stringify(jsonObject);
            var file = new Blob([formatedJson], { type: 'application/json' });
            console.log(formatedJson);
            saveTheJson(file, docRef);
          }).catch(function (err) {
            console.log("Error : ", err);
            messageNotSent();
          });

        }

      }
    }).catch(function (err) {
      console.log("Error: ", err);
      messageNotSent();
    });

}

//Used to upload the json and then send the mail
function saveTheJson(file, docRef, jsonObject) {
  console.log(jsonObject);
  console.log(docRef);
  console.log(file);
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child("messages/" + docRef.id).put(file);

  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
    //During
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');

    document.getElementById('progressAddMail').value = progress;
    document.getElementById('progressAddValueMail').innerText = round(progress, 1) + '%'

    if (document.getElementById('progressAddValueMail').innerText == '100%') {
      document.getElementById('progressAddValueMail').innerText = 'Finalisation de la sauvegarde.'
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
    //Error
    messageNotSent();
    console.log("An error occured :", error);
  }, function () {
    //Uploaded
    console.log("The file has been uploaded successfuly.");
    //Good to send
    document.getElementById('sendMailToGroupForm').submit();
    console.log("form submitted");

    messageSent();



  });
}

//To let the user know that the message has been sent
function messageSent() {
  $('#modalProgressMail').modal('hide');

  swal({
    title: "Message envoyé",
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
    //Message sent, clear the 
    clearMailForm();
  });
}

//To let the user know the message has not been sent to a specific mail
function messageNotSent() {
  swal({
    title: "Erreur d'envoi",
    text: "Le message n'a pas pu être envoyé. Veuillez réessayer s'il vous plaît. Si le problème persiste, veuillez contacter le service technique.",
    type: "error",
    html: true,
    showCancelButton: false,
    // confirmButtonColor: "#ffde59",
    confirmButtonText: "OK",
    // cancelButtonColor:"#ffde59",
    // cancelButtonText: "Fermer", 
    closeOnConfirm: true,
    closeOnCancel: true
  }, function (isConfirm) {
    //Message not sent, we need to re open the modal with the information the user put.
    $('modalMessage').modal();
  });
}

//Used for progres bar
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

//Used to clear theform
function clearMailForm() {
  console.log("clearMailForm();");

  //Selects
  var $selectRecipient = $('select#selectMailRecipient').selectize();
  var controlRecipient = $selectRecipient[0].selectize;
  controlRecipient.clear();
  document.getElementById('selectMailRecipient').selectize.clearOptions();

  var $selectRecipientCategory = $('select#selectRecipientCategory').selectize();
  var controlRecipientCategory = $selectRecipientCategory[0].selectize;
  controlRecipientCategory.clear();



  //Subject
  document.getElementById('subject').value = '';

  //Message
  var scope = angular.element($('#sendMessageEditor')).scope();
  scope.$apply(function () {
    scope.html = '';
  });

}

