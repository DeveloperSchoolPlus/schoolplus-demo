const USER = [];
firestore.collection('users').where('instituteName','==', 'Hackschooling Institute').get()
.then(function(querySnapshot) {

  querySnapshot.forEach(function(doc) {
    USER.push([doc.data().lastName, doc.data().firstName,doc.data().email, doc.data().instituteName]);
  });

  firestore.collection('users').where('instituteName', '==', 'estia').get()
  .then(function(querySnapshot2) {
    querySnapshot2.forEach(function(doc2) {
      USER.push([doc2.data().lastName, doc2.data().firstName, doc2.data().email, doc2.data().instituteName]);
    });
    var wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "User list",
      Subject:'List of users'
    };
    wb.SheetNames.push("User list");
    var ws_data = USER;
    
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    wb.Sheets["User list"] = ws;

    var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
    saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'test.xlsx');
  }).catch(function(err) {
    console.log("er");
  });

  

  console.log(USER);
}).catch(function(err) {
  console.log("err) ");
});





        function s2ab(s) {
  
                var buf = new ArrayBuffer(s.length);
                var view = new Uint8Array(buf);
                for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
                
        }
$("#button-a").click(function(){
  
});