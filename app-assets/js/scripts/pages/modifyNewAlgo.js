eventClick: function (info) {  //When an event is clicked this function is triggered
  
  console.log(info.event.id);
  
  var oldTitle = info.event.title;
  var oldStartDate = info.event.start.getTime();
  var query = firestore.collection('activities').doc(info.event.id);
  query.get().then(function (doc) {
    if (doc.data().editable != true) {
      // alert("Vous ne pouvez pas modifier ou supprimer cet événement");
      
      firestore.collection('users').doc(doc.data().idUser).get()
      .then(function (doc2) {
        
        if (doc2.data().userCategory == "student") {
          $('#modalShowEvent').modal();
          showMatiere.value = doc.data().title;
          showActivities.value = doc.data().typeActivity;
          showDescription.value = doc.data().description;
          showClassName.innerText = doc.data().classe;
          
        } else if (doc2.data().userCategory == "teacher") {
          $('#modalModifyTeacher').modal();
          $("input[value='" + doc.data().typeActivity + "']").prop("checked", true);
          modifyEventDescriptionTeacher.value = doc.data().description;
          modifyEventTitleTeacher.value = doc.data().title;
          classNameTeacher.innerText = doc.data().classe;
          attendeesTeacher.innerHTML = '';
          if (!doc.data().attendees.includes("classe")) {
            doc.data().attendees.forEach(function (elem) {
              firestore.collection('users').doc(elem).get()
              .then(function (doc) {
                attendeesTeacher.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
              }).catch(function (err) {
                console.log("Error :", err);
              });
            });
          }
          // Arnaud pour faire l'appel
          var buttonValue = doc.data().idUser + '%' + doc.data().startDate + '%' + doc.data().classe + '%' + doc.data().title + '%' + doc.data().endDate;
          var appelButton = document.getElementById('appel-button');
          appelButton.removeAttribute('disabled');
          appelButton.setAttribute('enabled', '');
          var appelStatus = document.getElementById('appel-status');
          if (doc.data().startDate <= Date.now()) {
            if (doc.data().appelDone == null || !doc.data().appelDone) {
              appelButton.value = buttonValue;
              appelButton.style.display = '';
              appelStatus.style.display = 'none';
            }
            else {
              appelButton.style.display = 'none';
              appelStatus.style.display = '';
            }
          }
          else {
            appelButton.style.display = '';
            appelButton.setAttribute('disabled', '');
            appelStatus.style.display = 'none';
            
          }
          // end Arnaud
          
          $('#formModifyEventTeacher').submit(function (ev) {
            ev.preventDefault();
            var modifiedEventType = $("input[name='modifyEventTypeTeacher']:checked").val();
            console.log(modifiedEventType);
            
            
            
            
            query.set({
              // title: modifyEventTitleTeacher.value,
              description: modifyEventDescriptionTeacher.value,
              typeActivity: modifiedEventType/* ,
              eventColor: modifiedEventColor */
            }, {
              merge: true
            }).then(function () {
              
              //Modify Admin and students activities
              
              firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  console.log(doc.data().id);
                  firestore.collection('activities').doc(doc.data().id)
                  .set({
                    // title: modifyEventTitleTeacher.value,
                    description: modifyEventDescriptionTeacher.value,
                    typeActivity: modifiedEventType
                    // eventColor: modifiedEventColor
                  }, {
                    merge: true
                  }).catch(function (err) {
                    console.log("Error: ", err);
                  });
                });
              }).catch(function (err) {
                console.log("Error :", err);
              });
            }).catch(function (err) {
              console.log("Error: ", err);
            });
            
            
            info.event.setProp('title', modifyEventTitleTeacher.value);
            info.event.setProp('description', modifyEventDescriptionTeacher.value);
            /* info.event.setProp('backgroundColor', modifiedEventColor);
            info.event.setProp('borderColor', modifiedEventColor); */
            
            
            $("#modalModifyTeacher").modal("hide");
            
          });
          
          
          
          
          
          
          
          
        }
        
      }).catch(function (err) {
        console.log("Error : ", err);
      });
      
      
      
    } else {
      
      //ADMIN SECTION
      
      var oldClass = doc.data().classe;
      var oldAttendees = doc.data().attendees;
      var oldTeacher = doc.data().teacherID;
      console.log("oldtitle :", oldTitle);
      console.log("OldStartDate :", oldStartDate);
      console.log("oldClass :", oldClass);
      $('#modalModifyEvent').modal();
      
      var modifiedEventTitle = document.getElementById("modifyEventTitle");
      var modifiedEventDescription = document.getElementById("modifyEventDescription");
      
      // Once the modal is opened we clear all text areas
      // modifiedEventTitle.value = "";   
      modifiedEventDescription.value = "";
      className.innerText = doc.data().classe;
      attendeesAdmin.innerHTML = '';
      selectModifyMatiere.innerHTML = '';
      selectModifyClass.innerHTML = '';
      selectModifyStudent.innerHTML = '';
      
      //For each inputs we set their values according to user's activity data
      //Creation of attendees' list
      if (!doc.data().attendees.includes("classe")) {
        doc.data().attendees.forEach(function (elem) {
          firestore.collection('users').doc(elem).get()
          .then(function (doc) {
            attendeesAdmin.innerHTML += '<p>' + doc.data().firstName + ' ' + doc.data().lastName + '</p>';
          }).catch(function (err) {
            console.log("Error :", err);
          });
        });
      }
      //Setting time inputs
      // modifiedEventTitle.value = info.event.title;
      $('#modifyStartEvent').val(getTimeWithoutOffset(doc.data().startDate));
      $('#modifyEndEvent').val(getTimeWithoutOffset(doc.data().endDate));
      $('#modifyDateEvent').text(getDateTime(Date.parse($('#modifyStartEvent').val()), Date.parse($('#modifyEndEvent').val())));
      $('#modifyStartRecur').val(getTimeWithoutOffset(doc.data().startDate).slice(0, -13));
      $('select#selectModifyTeacher').val(doc.data().teacherID);
      
      firestore.collection('users').where("id", "==", $('select#selectModifyTeacher').val()).get()
      .then(function (querySnapshot) {
        
        querySnapshot.forEach(function (doc) {
          //We create the list of subjects according to teacher's profile
          for (var i = 0; i < doc.data().matieres.length; i++) {
            selectModifyMatiere.innerHTML += "<option value='" + doc.data().matieres[i] + "'>" + doc.data().matieres[i] + "</option>";
          }
          
          //We create the list of classes according to teacher's profile
          for (var j = 0; j < doc.data().classe.length; j++) {
            selectModifyClass.innerHTML += "<option value='" + doc.data().classe[j] + "'>" + doc.data().classe[j] + "</option>";
          }
        });
        
        //We then set these select with the according value
        $('select#selectModifyClass').val(doc.data().classe);
        $('select#selectModifyMatiere').val(doc.data().title);
        
        //Generate list of students according to the seleced class and subject (also checks for specialty subjects)
        initModifyStudentSelection($('select#selectModifyClass').val(), doc.data().instituteName, doc.data().attendees);
        
        //We check whether the event is recurring or not. We set according inputs depending on the case
        if (doc.data().startRecur == undefined || doc.data().startRecur == '') {
          //Event is not recurrent, we don't display recurring section
          $('select#selectModifyRecur').val('non');
          document.getElementById('modifyRecurrenceSection').style.display = "none";
          
        } else {
          //Event is reccurent, we display recurring section along with setting the end recurring date
          $('select#selectModifyRecur').val('oui');
          document.getElementById('modifyRecurrenceSection').style.display = "block";
          $('#modifyEndRecur').val(getTimeWithoutOffset(new Date(doc.data().endRecur)).slice(0, -13));
        }
        
      }).catch(function (err) {
        console.log("Error :", err);
      });
      
      //We set description
      modifiedEventDescription.value = doc.data().description;
      
      //If description is empty we set placeholder
      if (info.event.description == undefined || info.event.description == "") {
        modifiedEventDescription.placeholder = "Décrivez l'événement...";  // We set placeholders
      }
      
      //We check corresponding activity type
      $("input[value='" + doc.data().typeActivity + "']").prop("checked", true); // We check corresponding checkbox
      // End filling up inputs
      
      $('#formModifyEvent').submit(function (eve) {
        
        eve.preventDefault();
        var modifiedEventType = $("input[name='modifyEventType']:checked").val();
        var newStartDate = Date.parse($('#modifyStartEvent').val());
        var newEndDate = Date.parse($('#modifyEndEvent').val());
        if($('select#selectModifyRecur').val() == "non")
        {
          var newRecur = firebase.firestore.FieldValue.delete();
          var modifyStartEventRecur = firebase.firestore.FieldValue.delete();
          var modifyEndEventRecur = firebase.firestore.FieldValue.delete();
          var modifyStartRecur = firebase.firestore.FieldValue.delete();
          var modifyEndRecur = firebase.firestore.FieldValue.delete();
        } 
        else
        {
          var newDateRecur = new Date(newStartDate);
          var newRecur = [newDateRecur.getDay()];
          var modifyStartEventRecur = new Date(Date.parse($('#modifyStartEvent').val())).getHours();
          modifyStartEventRecur = modifyStartEventRecur * 3600000;
          var modifyEndEventRecur = new Date(Date.parse($('#modifyEndEvent').val())).getHours();
          modifyEndEventRecur = modifyEndEventRecur * 3600000
          var modifyStartRecur = Date.parse($('#modifyStartRecur').val());
          var modifyEndRecur = Date.parse($('#modifyEndRecur').val());
        }
        
        var newColor;
        
        switch ($('select#selectModifyClass').val()) {
          case '1EVOL':
          newColor = '#434690';
          break;
          case '3EVOL':
          newColor = '#eebf42';
          break;
          case 'TS_EVOL':
          newColor = '#52a03a';
          break;
          case '2EVOL':
          newColor = '#d55828';
          break;
          case '1STMG_EVOL':
          newColor = '#46a2da';
          break;
          default:
          newColor = 'red';
        }
        
        if (oldTitle != $('select#selectModifyMatiere').val() || oldStartDate != newStartDate || oldClass != $('select#selectModifyClass').val()) {
          //In this case we should recreate the event for each affected user and delete their old activity
          
          firestore.collection('activities').doc(user.uid+'_'+newStartDate+"_"+$('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
          .set({
            idUser: user.uid,
            typeActivity: modifiedEventType,
            id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
            eventColor: newColor,
            startDate: newStartDate,
            endDate: newEndDate,
            title: $('select#selectModifyMatiere').val(),
            editable: true,
            description: modifiedEventDescription.value,
            classe: $('select#selectModifyClass').val(),
            attendees: $('select#selectModifyStudent').val(),
            activityDone: false,
            teacherID: $('select#selectModifyTeacher').val(),
            startTime: modifyStartEventRecur,
            endTime: modifyEndEventRecur,
            startRecur: modifyStartRecur,
            endRecur: modifyEndRecur,
            daysOfWeek: newRecur
          },
          {
            merge: true
          }).then(function() {
            
            console.log("New admin's document created. About to delete the old one");
            query.delete();
            console.log("Old admin's event deleted");
            info.event.remove();
                    calendar.addEvent({
                      title: $('select#selectModifyMatiere').val(),
                      start: newStartDate,
                      end: newEndDate,
                      description: modifiedEventDescription.value,
                      id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                      color: newColor,
                      editable: true,
                      classe: $('select#selectModifyClass').val(),
                      allDay: false
                    });
            
          }).catch(function(err) {
            console.log("Error while creating new event for Admin :", err);
          });
          
          
        }
        else {
          //In this case we don't have to recreate events, update only. Yet, we have to check for different teacher AND/OR different students to delete and create activites
          
          if ($('select#selectModifyRecur').val() == "non") {
            //Event not recurrent                  
            firestore.collection('activities').doc(info.event.id).update({
              typeActivity: modifiedEventType,
              eventColor: newColor,
              endDate: newEndDate,
              description: modifiedEventDescription.value,
              attendees: $('select#selectModifyStudent').val(),
              teacherID: $('select#selectModifyTeacher').val(),
              startTime: firebase.firestore.FieldValue.delete(),
              endTime: firebase.firestore.FieldValue.delete(),
              startRecur: firebase.firestore.FieldValue.delete(),
              endRecur: firebase.firestore.FieldValue.delete(),
              daysOfWeek: firebase.firestore.FieldValue.delete()
            }).then(function() {
              console.log("Admin's activity updated");
              info.event.remove();
              calendar.addEvent({
                title: $('select#selectModifyMatiere').val(),
                start: newStartDate,
                end: newEndDate,
                description: modifiedEventDescription.value,
                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                color: newColor,
                editable: true,
                classe: $('select#selectModifyClass').val(),
                allDay: false
              });
              
              //Now we can start updating teacher's activity
              //First we need to check whether the teacher has changed
              //If so we need to delete previous teacher's activity and create a new one for new teacher
              //If it's the same teacher we juste have to update his activity
              /* firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
              console.log("shouldve deleted it");
              if(oldTeacher != $('select#selectModifyTeacher').val())
              {
                //Teacher has changed. We thus need to delete previous teacher's activity first.
                firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
                console.log("Just deleted old teacher's activity");
              } */
              //After some thoughts, as changing teacher will automatically results in changing the subject
              //We don't need to manage it here. We can just upload.
              firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).update({
                typeActivity: modifiedEventType,
                eventColor: newColor,
                endDate: newEndDate,
                description: modifiedEventDescription.value,
                attendees: $('select#selectModifyStudent').val(),
                teacherID: $('select#selectModifyTeacher').val(),
                startTime: firebase.firestore.FieldValue.delete(),
                endTime: firebase.firestore.FieldValue.delete(),
                startRecur: firebase.firestore.FieldValue.delete(),
                endRecur: firebase.firestore.FieldValue.delete(),
                daysOfWeek: firebase.firestore.FieldValue.delete()
              }).then(function() {
                console.log("Teacher's activity is now updated");
                //Now we can proceed the update of students' activities
                
                //IN THIS SECTION WE FIRST DELETE ACTIVITIES OF CONCERNED USERS THEN CREATE NEW ACTIVITIES FOR SELECTED USERS
                
                //Then we have to check for students who have been added/removed from the event
                if (!oldAttendees.includes('classe')) {
                  //In this case a group of student is concerned. We delete corresponding activities
                  oldAttendees.forEach(function (elem) {
                    firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
                    console.log(elem + " has been deleted");
                  });
                }
                else {
                  //In this case the whole class is concerned. We delete corresponding activities
                  firestore.collection('users').where("userCategory", "==", "student").where("classe", "==", doc.data().classe).get()  //Maybe Check for same instituteName?
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc2) {
                      console.log("about to delete activity :" + doc2.id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title);
                      firestore.collection('activities').doc(doc2.id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                }
                
                //If a group of student is selected. We create their activities
                if (!$('select#selectModifyStudent').val().includes("classe")) {
                  $('select#selectModifyStudent').val().forEach(function (elem) {
                    console.log("LOOK HERE : ", elem);
                    firestore.collection('activities').doc(elem+"_" +newStartDate+"_"+$('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
                    .set({
                      idUser: elem,
                      typeActivity: modifiedEventType,
                      id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                      eventColor: newColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: $('select#selectModifyMatiere').val(),
                      editable: false,
                      description: modifiedEventDescription.value,
                      classe: $('select#selectModifyClass').val(),
                      activityDone: false,
                      teacherID: $('select#selectModifyTeacher').val()
                    }).then(function () {
                      console.log("Activities created.");
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });
                  });
                }
                else {
                  //If the whole class is selected. We create an activity for each student of the selected class
                  firestore.collection('users').where("userCategory", "==", "student").where("classe", "==", $('select#selectModifyClass').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc2) {
                      firestore.collection('activities').doc(doc2.id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
                      .set({
                        idUser: doc2.id,
                        typeActivity: modifiedEventType,
                        id: doc2.id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                        eventColor: newColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: $('select#selectModifyMatiere').val(),
                        editable: false,
                        description: modifiedEventDescription.value,
                        classe: $('select#selectModifyClass').val(),
                        activityDone: false,
                        teacherID: $('select#selectModifyTeacher').val()
                      }).then(function () {
                        console.log("Activities created.");
                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                }
              }).catch(function(err) {
                console.log("Error while updating teacher's activity :", err);
              });
              
              
              
            }).catch(function(err) {
              console.log("Error while updating admin's activity :", err);
            });
            
            
            
          } else if ($('select#selectModifyRecur').val() == "oui")
          {
            
            
            //Event is recurrent, we can start creating new activity for admin, then delete the older one
            var newQuery = firestore.collection('activities').doc(user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val());
            newQuery.set({
              idUser: user.uid,
              typeActivity: modifiedEventType,
              id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
              eventColor: newColor,
              startDate: newStartDate,
              endDate: newEndDate,
              title: $('select#selectModifyMatiere').val(),
              editable: true,
              description: modifiedEventDescription.value,
              classe: $('select#selectModifyClass').val(),
              attendees: $('select#selectModifyStudent').val(),
              activityDone: false,
              teacherID: $('select#selectModifyTeacher').val(),
              startTime: modifyStartEventRecur * 3600000,
              endTime: modifyEndEventRecur * 3600000,
              startRecur: modifyStartRecur,
              endRecur: modifyEndRecur,
              daysOfWeek: [newRecur.getDay()]
              
            }).then(function () {
              console.log("HERE :", info.event.id);
              info.event.remove();
              calendar.addEvent({
                title: $('select#selectModifyMatiere').val(),
                start: newStartDate,
                end: newEndDate,
                description: modifiedEventDescription.value,
                id: user.uid + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                color: newColor,
                editable: true,
                classe: $('select#selectModifyClass').val(),
                allDay: false,
                startTime: modifyStartEventRecur * 3600000,
                endTime: modifyEndEventRecur * 3600000,
                startRecur: modifyStartRecur,
                endRecur: modifyEndRecur,
                daysOfWeek: [newRecur.getDay()]
              });
              
              
              //Since we're already in the case where at least title, startDate or Class have changed meaning that the id of activity changes
              //we have to delete old events and recreate an event for each user
              
              //We delete previous activity of teacher
              firestore.collection('activities').doc(doc.data().teacherID + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
              //Then we create teacher's new activity
              firestore.collection('activities').doc($('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
              .set({
                idUser: $('select#selectModifyTeacher').val(),
                typeActivity: modifiedEventType,
                id: $('select#selectModifyTeacher').val() + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                eventColor: newColor,
                startDate: newStartDate,
                endDate: newEndDate,
                title: $('select#selectModifyMatiere').val(),
                editable: false,
                description: modifiedEventDescription.value,
                classe: $('select#selectModifyClass').val(),
                attendees: $('select#selectModifyStudent').val(),
                activityDone: false,
                teacherID: $('select#selectModifyTeacher').val(),
                startTime: modifyStartEventRecur * 3600000,
                endTime: modifyEndEventRecur * 3600000,
                startRecur: modifyStartRecur,
                endRecur: modifyEndRecur,
                daysOfWeek: [newRecur.getDay()]
              }).then(function () {
                console.log("Teacher's activity has change");
                
                //IN THIS SECTION WE FIRST DELETE ACTIVITIES OF CONCERNED USERS THEN CREATE NEW ACTIVITIES FOR SELECTED USERS
                
                //Then we have to check for students who have been added/removed from the event
                if (!oldAttendees.includes('classe')) {
                  //In this case a group of student is concerned. We delete corresponding activities
                  oldAttendees.forEach(function (elem) {
                    firestore.collection('activities').doc(elem + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
                    console.log(elem + " has been deleted");
                  });
                }
                else {
                  //In this case the whole class is concerned. We delete corresponding activities
                  firestore.collection('users').where("userCategory", "==", "student").where("classe", "==", doc.data().classe).get()  //Maybe Check for same instituteName?
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc2) {
                      console.log("about to delete activity :" + doc2.id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title);
                      firestore.collection('activities').doc(doc2.id + "_" + doc.data().startDate + "_" + doc.data().classe + "_" + doc.data().title).delete();
                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                }
                
                //If a group of student is selected. We create their activities
                if (!$('select#selectModifyStudent').val().includes("classe")) {
                  $('select#selectModifyStudent').val().forEach(function (elem) {
                    firestore.collection('activities').doc(elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
                    .set({
                      idUser: elem,
                      typeActivity: modifiedEventType,
                      id: elem + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                      eventColor: newColor,
                      startDate: newStartDate,
                      endDate: newEndDate,
                      title: $('select#selectModifyMatiere').val(),
                      editable: false,
                      description: modifiedEventDescription.value,
                      classe: $('select#selectModifyClass').val(),
                      activityDone: false,
                      teacherID: $('select#selectModifyTeacher').val(),
                      startTime: modifyStartEventRecur * 3600000,
                      endTime: modifyEndEventRecur * 3600000,
                      startRecur: modifyStartRecur,
                      endRecur: modifyEndRecur,
                      daysOfWeek: [newRecur.getDay()]
                    }).then(function () {
                      console.log("Activities created.");
                    }).catch(function (err) {
                      console.log("Error :", err);
                    });
                  });
                }
                else {
                  //If the whole class is selected. We create an activity for each student of the selected class
                  firestore.collection('users').where("userCategory", "==", "student").where("classe", "==", $('select#selectModifyClass').val()).get()
                  .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc2) {
                      firestore.collection('activities').doc(doc2.id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val())
                      .set({
                        idUser: doc2.id,
                        typeActivity: modifiedEventType,
                        id: doc2.id + "_" + newStartDate + "_" + $('select#selectModifyClass').val() + "_" + $('select#selectModifyMatiere').val(),
                        eventColor: newColor,
                        startDate: newStartDate,
                        endDate: newEndDate,
                        title: $('select#selectModifyMatiere').val(),
                        editable: false,
                        description: modifiedEventDescription.value,
                        classe: $('select#selectModifyClass').val(),
                        activityDone: false,
                        teacherID: $('select#selectModifyTeacher').val(),
                        startTime: modifyStartEventRecur * 3600000,
                        endTime: modifyEndEventRecur * 3600000,
                        startRecur: modifyStartRecur,
                        endRecur: modifyEndRecur,
                        daysOfWeek: [newRecur.getDay()]
                      }).then(function () {
                        console.log("Activities created.");
                      }).catch(function (err) {
                        console.log("Error :", err);
                      });
                    });
                  }).catch(function (err) {
                    console.log("Error :", err);
                  });
                }
                
                
                
              }).catch(function (err) {
                console.log("Error :", err);
              });
              
            }).catch(function (err) {
              console.log("Error writing :", err);
            });
            
          }
          
          
          /* query.set({
            title: modifiedEventTitle.value,
            description: modifiedEventDescription.value,
            typeActivity: modifiedEventType
            // eventColor: modifiedEventColor
          }, {
            merge: true
          }).then(function () {
            
            if(userCategory =="admin")
            {
              
              firestore.collection('activities').where("classe","==",doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", oldTitle).get()
              .then(function(querySnapshot) 
              {
                querySnapshot.forEach(function(doc) {
                  firestore.collection('activities').doc(doc.data().id)
                  .set({
                    title: modifiedEventTitle.value,
                    description: modifiedEventDescription.value,
                    typeActivity: modifiedEventType
                    // eventColor: modifiedEventColor
                  }, {
                    merge: true
                  }).catch(function(err) {
                    console.log("Error: ",err);
                  });
                });
              }).catch(function(err) {
                console.log("Error :", err);
              });
            }
            console.log("Modification done !");
          }).catch(function (err) {
            console.log("Error: ", err);
          });
          info.event.setProp('title', modifiedEventTitle.value);
          info.event.setProp('description', modifiedEventDescription.value);            
          $("#modalModifyEvent").modal("hide"); */
        }
        $('#modalModifyEvent').modal("hide");
        
      });
      
      
      $('#btnDeleteEvent').click(function () {
        
        if (!confirm("Êtes-vous sûr de vouloir supprimer cet événement?")) {
          console.log("no delete");
        } else {
          /* query.delete()
          .then(function()
          { */
            // Then we delete activities docs for each student
            /*  if(userCategory == "teacher")
            {
              for(var i = 0; i<doc.data().students.length; i++)
              {
                firestore.collection('activities').doc(doc.data().students[i]+"_"+info.event.start.getTime()).delete(); 
              }
            } */
            
            if (userCategory == "admin") {
              firestore.collection('activities').where("classe", "==", doc.data().classe).where("startDate", "==", doc.data().startDate).where("title", "==", doc.data().title).get()
              .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                  console.log()
                  firestore.collection('activities').doc(doc.data().id).delete();
                }).then(function () {
                  query.delete();
                });
              }).catch(function (err) {
                console.log("Error :", err);
              });
            }
            /* }); */
            info.event.remove();
            console.log("Delete");
          }
          $("#modalModifyEvent").modal("hide");
        });
      }
    }).catch(function(err) {
      console.log("Error :", err);
    });
    
    
    
  }