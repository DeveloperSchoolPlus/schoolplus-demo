<?php
  // EDIT THE 2 LINES BELOW AS REQUIRED
  $email_from = $_POST['sender-email'];
  //$email_from = "arnaudchalons@by-the-wave.com";
  $email_to = "arnaud@bythewave.surf"; // required

  $user_message = nl2br(stripslashes($_POST['sender-message']));

	// create email headers
	$headers = "From: ".$email_from."\r\n";
	$headers .= "Reply-To: ".$email_from."\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=utf-8\r\n";

  $email_subject = "Handi Surf: message from contact us ";

	$email_message = "<html><body><p>Le message:</p><br><p><i>";
	$email_message .= $user_message;
  $email_message .= "</i></p></body></html>";

mail($email_to, $email_subject, $email_message, $headers);
?>
