<?php
     $to      = $_POST['createAdresse'];
     $subject = 'Inscription School +';
     
     // create email headers
	$headers = "From: no-reply@myschool.plus\r\n";
	$headers .= "Reply-To: no-reply@myschool.plus\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";

	$email_message = "<html><body><p>Bonjour ".$_POST['createFirstname'];
	$email_message .= ",</p><p>";
  // $email_message .= $_POST['createFirstname'];
  $email_message .= "L'admin de votre établissement vous a ajouté en tant que nouvel utilisateur sur la plateform School +.";
	// $email_message .= $user_message;
  $email_message .= "</i></p><p>Cliquez sur ce <a href='http://hackschooling.myschool.plus/pages/fr/register.php'>lien</a> pour vous inscrire et créer votre compte.</p>";
  // $email_message .= $firstname_from;
  $email_message .= "<p>Une fois votre compte créé, rendez-vous sur <a href='https://hackschooling.myschool.plus'>https://hackschooling.myschool.plus</a> pour vous connecter.";
  $email_message .= "</p><p>A très vite,</p><br><p><i>L'Equipe School +</i></p></body></html>";

     mail($to, $subject, $email_message, $headers);
 ?>