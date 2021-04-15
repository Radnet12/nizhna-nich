<?
require_once 'PHPMailer/PHPMailerAutoload.php';

$admin_email = "sergeyvasylenko4@gmail.com";

$form_subject = trim($_POST["form_subject"]);

$mail = new PHPMailer;
$mail->CharSet = 'UTF-8';


$json = $_POST['Товары'];
$myArray = json_decode($json, true);

$prod = '';
foreach ($myArray as $key => $value) {
		$title = $value["title"];
		$price = $value["price"];
		$quantity = $value["quantity"];
		$size = $value["size"];
		$color = $value["color"];
		$additionalText = $value["additionalText"];
		$forWhatProduct = $value["forWhatProduct"];
	    $prod .= "
			<tr>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$title</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$size</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$color</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$quantity</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$price</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$additionalText</td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$forWhatProduct</td>
			</tr>
			";
	}
$c = true;
$message = '';
foreach ( $_POST as $key => $value ) {
	if ( $value != ""  && $key != "admin_email" && $key != "form_subject"  && $key != "Товары") {
		if (is_array($value)) {
			$val_text = '';
			foreach ($value as $val) {
				if ($val && $val != '') {
					$val_text .= ($val_text==''?'':', ').$val;
				}
			}
			$value = $val_text;
		}
		$message .= "
		" . ( ($c = !$c) ? '<tr>':'<tr>' ) . "
		<td style='padding: 10px; width: auto;'><b>$key:</b></td>
		<td style='padding: 10px;width: 100%;'>$value</td>
		</tr>
		";
	}
}
$message = "<table style='width: 70%;'>$message . $prod</table>";

// От кого
$mail->setFrom('adm@' . $_SERVER['HTTP_HOST'], 'Ніжна нічь');

// Кому
$mail->addAddress($admin_email);
// Тема письма
$mail->Subject = $form_subject;
// Тело письма
$body = $message;
// $mail->isHTML(true);  это если прям верстка
$mail->msgHTML($body);

$mail->send();
?>