<?php
require_once 'vendor/autoload.php';
require_once 'config.php'; // Make sure this file has your Google credentials

session_start();

// Google OAuth setup
$client = new Google_Client();
$client->setClientId(GOOGLE_CLIENT_ID);  // Make sure this is correct
$client->setClientSecret(GOOGLE_CLIENT_SECRET);  // Make sure this is correct
$client->setRedirectUri(GOOGLE_REDIRECT_URI);  // This must match exactly with what you set in the Google Console
$client->addScope("email");
$client->addScope("profile");

// Debug: Log the incoming GET parameters
file_put_contents('callback_log.txt', print_r($_GET, true), FILE_APPEND);

if (isset($_GET['code'])) {
    // Debug: Log the authorization code
    file_put_contents('callback_log.txt', "Authorization Code: " . $_GET['code'] . "\n", FILE_APPEND);

    try {
        // Attempt to fetch the access token using the authorization code
        $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
        
        // Debug: Log the token response
        file_put_contents('callback_log.txt', "Token Response: " . print_r($token, true) . "\n", FILE_APPEND);

        // Check if we got an error from Google during the token fetch
        if (isset($token['error'])) {
            // Output the error in the browser instead of redirecting
            echo 'Error fetching access token: ' . htmlspecialchars($token['error']);
            exit;
        }

        // Set the access token in the client
        $client->setAccessToken($token);

        // If we successfully get the access token
        if ($client->getAccessToken()) {
            // Get user data
            $oauth2 = new Google_Service_Oauth2($client);
            $userData = $oauth2->userinfo->get();
            
            // Retrieve user data
            $google_id = $userData->id;
            $email = $userData->email;
            $name = $userData->name;

            // Debug: Log user data
            file_put_contents('callback_log.txt', "User Data: " . print_r($userData, true) . "\n", FILE_APPEND);

            // Save the access token and user data in the session
            $_SESSION['access_token'] = $token['access_token'];
            $_SESSION['google_id'] = $google_id;
            $_SESSION['email'] = $email;
            $_SESSION['name'] = $name;

            // Optional: Email domain validation (if you only want Wesleyan emails)
            $allowed_domain = "wesleyan.edu";
            $email_domain = substr(strrchr($email, "@"), 1);

            if ($email_domain !== $allowed_domain) {
                echo "Sorry, only Wesleyan students can sign up or log in. Please use a valid Wesleyan email address.";
                exit; // Stop further execution if the domain is not allowed
            }

            // Debug: Log the redirect action
            file_put_contents('callback_log.txt', "Redirecting to home/index.html\n", FILE_APPEND);

            // Redirect to the homepage after successful login
            header('Location: home/index.html');
            exit;  // Stop the script after redirect
        } else {
            echo "Could not retrieve access token.";
            exit;  // If we couldn't retrieve the access token, stop further execution
        }
    } catch (Exception $e) {
        // Catch any exceptions and display them in the browser
        echo 'An error occurred: ' . htmlspecialchars($e->getMessage());
        exit;
    }
} else {
    // If the authorization code is missing, output an error
    echo "Authorization code missing.";
    exit;
}

mysqli_close($link);
?>
