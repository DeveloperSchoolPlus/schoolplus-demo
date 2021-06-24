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
		
	$email_message = "<html><body><p>Bonjour ";
	$email_message .= $first_name;
	$email_message .= ",</p><br><p>Tu viens d'obtenir la recompense suivante: <i>";
	//$email_message = "<html><body><p>Tu viens d'obtenir la récompense suivante: </p><p> </p><p><i>";
	$email_message .= $reward_desc;
	
	// if reward = freewax: do special procedure
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
		
		$email_message .= "</i></p><p>Afin que nous puissions t'expédier ta wax, répond à ce mail en précisant les informations suivantes:</p><p>- ton nom et ton prénom,</p><p>- ton adresse de livraison,</p><p>- ton numéro de téléphone.</p><p>Un email de confirmation te sera envoyé lors de l'expédition.</p><p>Bon ride,</p><br><p><i>L'Equipe ByTheWave</i></p><br><h6>CONDITIONS: La livraion ne peut être effectuée qu'en France métropolitaine. Cette offre est valable jusqu'au 31/12/18 et ne peut être activée qu'une seule fois.</h6></body></html>";
	}
	else
	{		
		$email_subject = "Ton code de reduction ".$partner_name;
	 
		$email_message .= "</i></p><p>Pour l'activer, va sur le <a href=\"";
		$email_message .= $partner_url;
		$email_message .= "\">site web</a> de ";
		$email_message .= $partner_name;
		$email_message .= " et utilise le code ci-dessous lors de ton achat:</p><h4>";
		$email_message .= $discount_code;
		$email_message .= "</h4><p>Ce code est valable jusqu'au ";
		$email_message .= $end_date;
		$email_message .= ".</p><p>Bon ride,</p><br><p><i>L'Equipe ByTheWave</i></p></body></html>";
	}

mail($email_to, $email_subject, $email_message, $headers);  
?>
 
<!-- include your own success html here -->
 
Thank you for contacting us. We will be in touch with you very soon.
 
<?php
 
}
?>