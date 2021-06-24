<?php
  // EDIT THE 2 LINES BELOW AS REQUIRED
  $email_from = $_POST['form-sender1'];
  //$email_from = "arnaudchalons@by-the-wave.com";
  $email_to = "adress MAIL HANDISURF"; // required
	$firstname_from = $_POST['form-firstnamefrom1']; // required

  $user_message = nl2br(stripslashes($_POST['form-message1']));

	// create email headers
	$headers = "From: ".$email_from."\r\n";
	$headers .= "Reply-To: ".$email_from."\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";

  /*$email_subject = "Handi Surf App: nouveau message reçu";

  $email_message = "<html><body><p>coucou c'est moi</p></body></html>";*/

  $email_subject = "Handi Surf App Assistance: Mail de ".$firstname_from;

	$email_message = "<html><body><p>Bonjour ";
	$email_message .= ",</p><p>";
  $email_message .= $firstname_from;
  $email_message .= " vous a envoye un message ";
	$email_message .= $user_message;
  $email_message .= "</i></p><p>Repondez simplement a cet email pour repondre au message de ";
  $email_message .= $firstname_from;
  $email_message .= "</p><p>Bon ride,</p><br><p><i>L'Equipe Handi Surf App</i></p></body></html>";

mail($email_to, $email_subject, $email_message, $headers);
?>
