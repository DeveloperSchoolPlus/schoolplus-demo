

//Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
  authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
  databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
  projectId: "schoolplus-dev-e8a2d",
  storageBucket: "",
  messagingSenderId: "330523876306",
  appId: "1:330523876306:web:cbdcee87b7e3e007"
};
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
const auth = firebase.auth();
//console.log(auth.currentUser);



// Add a realtime listener for Firebase Authentification
firebase.auth().onAuthStateChanged(firebaseUser => {

  if(firebaseUser)
  {
    var user = auth.currentUser;
    var query = firestore.collection("students").doc(user.uid);

    query.get().then(function(doc) {
      if(doc.exists)
      {
        var userFirstName = doc.data().firstName;
        var userLastName = doc.data().lastName;

        console.log("Hello "+userFirstName+" "+userLastName+"\n"+user.uid);
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
document.addEventListener('DOMContentLoaded', function () {
  
var user = auth.currentUser;
console.log(user);
  
  $('#bootstrap').on('hidden.bs.modal', function() {  //Permet de clear les sélections effectuées par l'utilisateur lorsque celui ci
    //console.log('modal fermé');                    // annule la création d'un événement en cliquant ailleurs / fermant le modal
    $("#formEvent").off();
  });
  
  var calendarEl = document.getElementById('calendar'); // Refer to calendar html element
  
  var events_array = [                  //Array of events
    {
      title: 'Test1',
      start: 1562925600000,
      end: 1562932800000,
      tip: 'Personal tip 1'},
      {
        title: 'Test2',
        start: 1562940000*1000,
        end: 1562950800*1000,
        tip: 'Personal tip 2'},
        {
          title: 'TestTimestamp',
          start:1562817600000,
          end:1562821200000,
          tip: 'Personnal tip 3'
        }
      ];
      
      
      
      
      var calendar = new FullCalendar.Calendar(calendarEl, {
        plugins: ['dayGrid', 'timeGrid','bootstrap','interaction','moment'], // List of used fullcalendar's plugins
        header: false,
        /* {
          left: 'title',
          center: 'today prev,next',
          right:''

        }, */
        defaultView: 'timeGridWeek',  //Default view set on Agenda view with times
        firstDay: 1,  //Defines agenda's view first day on Monday
        locale: 'fr', //Defines calendar's lang
        timeZone: 'local', //Timezone set on local
        
        //eventOverlap: false,
        allDaySlot: true,
        weekends: false, // Afficher - cacher les weekends
        themeSystem: 'bootstrap', //Theme utilisé 
        events: events_array,
        selectable: true, 
        unselectAuto: true,

        select: function(info) {  //When a period is selected, this function is triggered
          
          $("#bootstrap").modal(); //Display modal which contains Event Creation form
          
          $("#formEvent").submit(function(ev) {  //Once the form is submitted
            
            var newEventTitle = document.getElementById("newEventTitle");
            var newEventType = $("input[name='newEventType']:checked").val();
            var newEventDescription = document.getElementById("newEventDescription");
            
            ev.preventDefault();     
            var newEventColor;
            switch(newEventType)
            {
              case 'révisions':
                newEventColor = "yellow";
                break;
              case 'extraScolaire':
                newEventColor = "red";
                break;
              case 'perso':
                newEventColor = "green";
                break;
            }

            //Write data into Firebase
            var query = firestore.collection("activities").doc(user)

            calendar.addEvent({
              title: newEventTitle.value,
              start: info.start.getTime(),
              end:info.end.getTime(),
              color: newEventColor,
              allDay: false
            });
            
            console.log("New event :"+"\n"+ "Title : "+newEventTitle.value+ "\n"+ "Start : "+info.start.getTime()+"\n"+"End:" +info.end.getTime()+ "\n"+"Type: "+newEventType +"\n"+"Description : "+newEventDescription.value);
            $("#bootstrap").modal("hide"); //Hide modal
          });                     
        }   
      });
      calendar.render();  
    });
    
