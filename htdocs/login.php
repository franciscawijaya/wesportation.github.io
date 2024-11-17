<?php
// Include the Google API client library
require_once 'vendor/autoload.php';

// Include your config file
require_once 'config.php';

// Initialize the session
session_start();

// Check if the user is already logged in. If yes, then redirect them to the welcome page.
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
    header("location: welcome.php");
    exit;
}

// Create the Google Client object
$client = new Google_Client();
$client->setClientId(GOOGLE_CLIENT_ID);
$client->setClientSecret(GOOGLE_CLIENT_SECRET);
$client->setRedirectUri(GOOGLE_REDIRECT_URI);
$client->addScope("email");
$client->addScope("profile");

// Generate the login URL for Google OAuth
$login_url = $client->createAuthUrl();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="icon" href="home/favicon.png" type="image/png">

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css">
    <style type="text/css">
        /* Centering the entire page content */
        body {
            font: 14px sans-serif;
            height: 100vh;                /* Take the full height of the viewport */
            margin: 0;                    /* Remove default margin */
            display: flex;                /* Use flexbox for centering */
            justify-content: center;      /* Center horizontally */
            align-items: center;          /* Center vertically */
            background-color: #8B0000;    /* Dark Red background color */
            color: black;                 /* Black text for regular content */
            position: relative;           /* To position the images properly */
        }

        /* Wrapper to hold the form */
        .wrapper {
            width: 350px;
            padding: 15px;                /* Reduced padding to bring the form elements closer */
            background-color: white;      /* White background for the form */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional box shadow */
            border-radius: 8px;           /* Optional rounded corners */
            text-align: center;           /* Center the content inside the wrapper */
            z-index: 1;                   /* Ensure the wrapper is above the images */
        }

        h2 {
            display: flex;                /* Use Flexbox to align image and text */
            align-items: center;          /* Vertically center the image and text */
            justify-content: center;      /* Center the image and text horizontally */
            margin-bottom: 10px;           /* Reduced the space below the logo */
        }

        h2 img {
            width: auto;                  /* Keep the image at its original size */
            height: auto;                 /* Maintain aspect ratio */
            max-width: 100%;              /* Make sure the image doesn't exceed the container's width */
            margin-right: 10px;           /* Space between the image and text */
        }

        /* Custom Google Login Button */
        .btn-google {
            background-color: #b22222;    /* Darker red background */
            color: white;                 /* White text */
            width: 100%;                  /* Full width button */
            padding: 12px 20px;           /* Padding for the button */
            border-radius: 4px;           /* Rounded corners */
            border: none;                 /* No border */
            text-align: center;           /* Center text */
            font-size: 16px;              /* Text size */
            cursor: pointer;             /* Pointer cursor on hover */
            display: inline-block;        /* Make sure it behaves like a block-level element */
            margin-bottom: 10px;          /* Reduced space between the button and the text */
        }

        /* Hover effect for Google button */
        .btn-google:hover {
            background-color: #8b0000;    /* Even darker red on hover */
        }

        /* Style for the privacy policy link */
        .privacy-policy {
            margin-top: 10px;
            text-align: center;
            color: black;                 /* Change privacy policy text color to black */
        }

        .privacy-policy a {
            text-decoration: none;
            color: #007bff;               /* Blue color for links */
        }

        .privacy-policy a:hover {
            text-decoration: underline;
        }

        /* Change text color of the sign-up link to match the site theme */
        p a {
            color: #007bff;               /* Blue color for links */
        }

        /* Positioning the images (leftside and rightside) */
        .image-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
        }

        .image-container img {
            position: absolute;
            z-index: 0;
            height: auto;                /* Keep aspect ratio intact */
        }

        /* Left image */
        .left-image {
            left: 0;               /* Align to the left */
            top: 50%;              /* Vertically center the image */
            transform: translateY(-50%); /* Center vertically */
            margin-left: 30px;     /* Small margin from the left edge */
            width: 500px;          /* Adjusted smaller size */
        }

        /* Right image */
        .right-image {
            right: 0;              /* Align to the right */
            top: 50%;              /* Vertically center the image */
            transform: translateY(-50%); /* Center vertically */
            margin-right: 30px;    /* Small margin from the right edge */
            width: 500px;          /* Adjusted smaller size */
        }
    </style>
</head>
<body>
    <div class="image-container">
        <!-- Positioned images around the screen -->
        <img src="leftside.png" class="left-image" alt="Left Side Image">
        <img src="rightside.png" class="right-image" alt="Right Side Image">
    </div>

    <div class="wrapper">
        <h2><img src="logo.png" alt="Wesportation Logo" width="200"> </h2> <!-- Image and text on the same line -->
        <p>Please login using your <span class="bold-text">Wesleyan email</span>:</p>
        
        <!-- Google OAuth Login Button with custom styling -->
        <a href="<?php echo $login_url; ?>" class="btn-google">
            Login with Google
        </a>

        <!-- Privacy Policy Link -->
        <div class="privacy-policy">
            <p>By signing in, you agree to our <a href="privacy-policy.php" target="_blank">Privacy Policy</a> and
                <a href="terms-of-service.php" target="_blank">Terms of Service</a>.
            </p>
        </div>
        
        <p>Don't have an account? <a href="index.php">Sign up now</a>.</p>
    </div>
</body>
</html>
