<?php
if(isset($_POST['email'])) {
 
    // EDIT THE 2 LINES BELOW AS REQUIRED
    $email_from = "no-reply@bythewave.surf";
	$email_kevin = "kevin@bythewave.surf";
 
 
    $email_to = $_POST['email']; // required
	$partner_name = $_POST['partner-name']; // required
	$discount_code = $_POST['discount-code']; // required
	$reward_desc = $_POST['reward-desc']; // required
	$partner_url = $_POST['partner-url']; // required
	$end_date = $_POST['end-date']; // required
	$first_name= $_POST['first-name']; // required
	$reward_id = $_POST['reward-id']; // required	
	 
	// create email headers
	$headers = "From: " . $email_from . "\r\n";
	$headers .= "Reply-To: ". $email_from . "\r\n";
	$headers .= "MIME-Version: 1.0\r\n";
	$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
	
	$email_message = "<html><body><p>Hi ";
	$email_message .= $first_name;
	$email_message .= ",</p><br><p> </p><p>You just got the following reward: <i>";
	//$email_message = "<html><body><p>Tu viens d'obtenir la récompense suivante: </p><p> </p><p><i>";
	$email_message .= $reward_desc;
	
	if ($reward_id == "Wm7brLkCXo23RrieNMIa")
	{
		$subject_kevin = "FREEWAX REQUEST: ".$discount_code;
		$message_kevin = "<html><body><p>L'utilisateur ayant l'adresse mail suivante a commandé une wax: ".$email_to;
		$message_kevin .= "</p></body></html>";
		
		// send mail to Kévin
		mail($email_kevin, $subject_kevin, $message_kevin, $headers);
		
		// create email headers for special user
		$headers = "From: " . $email_kevin . "\r\n";
		$headers .= "Reply-To: ". $email_kevin . "\r\n";
		$headers .= "MIME-Version: 1.0\r\n";
		$headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
		
		$email_subject = "Confirmation FREEWAX - ".$discount_code;
		
		$email_message .= "</i></p><p>To get your free wax delivery, reply to this email and specify the following information:</p><p>- your firstname and lastname,</p><p>- your shipping address,</p><p>- your phone number.</p><p>A confirmation email will be sent to you upon shipment.</p><p>Have a good ride,</p><br><p><i>The ByTheWave Team</i></p><br><h6>CONDITIONS: Shipping can only be done within metropolitan France. This offer is valid until 12/31/18 and can only be activated once.</h6></body></html>";
	}
	else
	{
		$email_subject = "Your discount code ".$partner_name;

		$email_message .= "</i></p><p>To activate it, go to the <a href=\"";
		$email_message .= $partner_url;
		$email_message .= "\">website</a> of ";
		$email_message .= $partner_name;
		$email_message .= " and use the following code below before the payment:</p><p> </p><h4>";
		$email_message .= $discount_code;
		$email_message .= "</h4><p> </p><p>This code will be valid until ";
		$email_message .= $end_date;
		$email_message .= ".</p><p> </p><p>Have a good ride,</p><br><p><i>The ByTheWave Team</i></p></body></html>";
	}
 
mail($email_to, $email_subject, $email_message, $headers);  
?>
 
<!-- include your own success html here -->
 
Thank you for contacting us. We will be in touch with you very soon.
 
<?php
 
}
?>