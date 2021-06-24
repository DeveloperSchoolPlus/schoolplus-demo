<?php
  // EDIT THE 2 LINES BELOW AS REQUIRED
  $email_from = $_POST['form-senderMail'];
  $email_to = $_POST['form-recipientMail']; // required
	$firstname_from = $_POST['form-firstnamefromMail']; // required
  $firstname_to = $_POST['form-firstnametoMail'];
  $subject = $_POST['form-subjectMail'];

  $user_message = nl2br($_POST['form-messageMail']);

 

	// create email headers
	$headers = "From: ".$email_from."\r\n";
	$headers .= "Reply-To: ".$email_from."\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";


  /*$email_subject = "Handi Surf App: nouveau message reçu";

  $email_message = "<html><body><p>coucou c'est moi</p></body></html>";*/

  $email_subject = $subject;

	$email_message = "<html><body>";
	
  /* $email_message .= $sessionDate;
  $email_message .= " a ";
  $email_message .= $sessionTime; */
  // $email_message .= "";
	$email_message .= $user_message;
  // $email_message .= "</p>";
  $email_message .= "</body></html>";

  echo $email_message;

  if(mail($email_to, $email_subject, $email_message, $headers))
  {
    echo '<script>console.log("Sent")</script>';
  }
  else
  {
    echo '<script>console.log("An error occured sending a mail to '.$email_to.'")</script>';
    
  }
?>
