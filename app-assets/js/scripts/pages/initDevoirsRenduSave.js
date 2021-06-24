function initDevoirsRendus() {
  
  var user = auth.currentUser;
  
  /* for(var i = 0; i < 5; i++)
  {
    var table1 = '<tr><td>Français - Devoir 1</td>';
    var table2 = '<td><i class="fas fa-check"></i></td></tr>';
    
    var totalTable = table1 + table2;
    
    document.getElementById('devoirsTable').innerHTML += totalTable;
  } */
  
  firestore.collection('users').doc(user.uid).get()
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
  });
  
  
  
}