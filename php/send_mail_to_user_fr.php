<?php
  // EDIT THE 2 LINES BELOW AS REQUIRED
  $email_from = $_POST['form-sender1'];
  $email_to = $_POST['form-recipient1']; // required
	$firstname_from = $_POST['form-firstnamefrom1']; // required
  $firstname_to = $_POST['form-firstnameto1'];

  $user_message = nl2br($_POST['form-message1']);

 

	// create email headers
	$headers = "From: ".$email_from."\r\n";
	$headers .= "Reply-To: ".$email_from."\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";

  /*$email_subject = "Handi Surf App: nouveau message reçu";

  $email_message = "<html><body><p>coucou c'est moi</p></body></html>";*/

  $email_subject = "School+: nouveau message de la part de ".$firstname_from;

	$email_message = "<html><body><p>Bonjour ";
	$email_message .= $firstname_to;
	$email_message .= ",</p><p>";
  $email_message .= $firstname_from;
  $email_message .= " vous a envoye un message ";
  /* $email_message .= $sessionDate;
  $email_message .= " a ";
  $email_message .= $sessionTime; */
  $email_message .= ": </p><p><i>";
	$email_message .= $user_message;
  $email_message .= "</i></p><p>Repondez simplement a cet email pour repondre au message de ";
  $email_message .= $firstname_from;
  $email_message .= "</p><p>A bientôt,</p><br><p><i>L'Equipe School+</i></p></body></html>";

  echo $email_message;
mail($email_to, $email_subject, $email_message, $headers);
?>
