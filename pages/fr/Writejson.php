<?php
   $json = $_POST['json'];

   /* sanity check */
   if (json_decode($json) != null)
   {
     $file = fopen('../../assets/json/matieresList.json','w+');
     fwrite($file, $json);
     fclose($file);
     
    }
   else
   {
     // user has posted invalid JSON, handle the error 
     alert('Error');
   }

  

?>