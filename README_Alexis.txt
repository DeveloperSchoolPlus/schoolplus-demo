
ATTENTION : Ce dossier comprends les 2 versions sur la m�me plateforme (cas hackschooling)

Il faudra refaire les fonctions des NavBar pour avoir 3 version distinctes :

Version Hackschooling : Lyc�e + Soutien

Version Lyc�e : juste les fichiers li�s au lyc�e

Version Soutien : juste les fichiers li�es au soutien



Snippet DEV : 

//DEV
 var firebaseConfig = {
    apiKey: "AIzaSyBqDmaonfAb_FiK-2Vm9od_dpS1sXGW-Qg",
    authDomain: "schoolplus-dev-e8a2d.firebaseapp.com",
    databaseURL: "https://schoolplus-dev-e8a2d.firebaseio.com",
    projectId: "schoolplus-dev-e8a2d",
    storageBucket: "schoolplus-dev-e8a2d.appspot.com",
    messagingSenderId: "330523876306",
    appId: "1:330523876306:web:cbdcee87b7e3e007"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);


  Snippet PROD : 

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




Pages Version Lyc�e :

- create-institute php/js (a refaire pour la version sourtien/am�liorer pour la version lyc�e)

- register php/js

- recover-password php/js

- login php/js

- dashboard-student  php/js

- create-user php/js (admin)

- create-classes php/js (admin)

- contenu-cours php/js (admin)

- bilan php/js (admin)

- planning+ php/js (admin/teacher)

- notifications php/js 

- user-profile php/js

- mes-eleves php/js (admin / teacher)

- mes-profs php/js (admin/student)

- personnel-etablissement php/js (teacher)

- modify-settings php/js 

- mes-cours php/js (teacher)

- devoirs php/js (teacher)

- bilan-teacher php/js (teacher)

- mon-planning-extra php/js (student)

- mes-cours-eleves php/js (student)

- mon-bulletin php/js (student)

- common-script.js (pr�sent dans toutes les pages)



Pages Version Soutien :

ATTENTION : pour le moment la version soutien scolaire ne prend pas en compte les professeurs

On est parti du principe qu'au d�but les admins auraient le r�le du prof (d'o� l'ajout de la TODO list possible pour un admin)



- create-institute (� faire pour le soutien)

- register-soutien php/js

- recover-password php/js

- login php/js (la m�me que la version lyc�e)

- dashboard-soutien php/js

- create-user-soutien php/js (admin)

- contenu-cours-soutien php/js (admin)

- bilan-soutien php/js (admin)

- user-profile php/js (la m�me que la version lyc�e)

- modify-settings php/js

- mes-eleves-soutien php/js (admin)

- mes-profs-soutien php/js (admin/student)

- bilan-soutien php/js (admin)

- mon-bulletin-soutien php/js (student)

- mes-cours-eleves-soutien php/js (student)

- notifications php/js


