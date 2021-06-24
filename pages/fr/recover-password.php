<!DOCTYPE html>
<html lang="en" data-textdirection="ltr" class="loading">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
    <meta name="description" content="La plateforme qui simplifie et optimise la formation à distance et présentielle.">
  <meta name="keywords" content="education, support, formations, e-learning, plateforme e-learning, sport">
  <meta name="author" content="School+ Demo">

  <title>School+ Demo</title>

  <link rel="apple-touch-icon" sizes="60x60" href="../../assets/images/logo/logo-brand.png">
<link rel="apple-touch-icon" sizes="76x76" href="../../assets/images/logo/logo-brand.png">
<link rel="apple-touch-icon" sizes="120x120" href="../../assets/images/logo/logo-brand.png">
<link rel="apple-touch-icon" sizes="152x152" href="../../assets/images/logo/logo-brand.png">
<link rel="shortcut icon" type="image/x-icon" href="../../assets/images/logo/logo-brand.png">
<link rel="shortcut icon" type="image/png" href="../../assets/images/logo/logo-brand.png">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <!-- BEGIN VENDOR CSS-->
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/bootstrap.css">
    <!-- font icons-->
    <link rel="stylesheet" type="text/css" href="../../app-assets/fonts/icomoon.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/fonts/flag-icon-css/css/flag-icon.min.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/sliders/slick/slick.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/extensions/pace.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/icheck/icheck.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/icheck/custom.css">
    <!-- END VENDOR CSS-->
    <!-- BEGIN ROBUST CSS-->
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/bootstrap-extended.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/app.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/colors.css">
    <!-- END ROBUST CSS-->
    <!-- BEGIN Page Level CSS-->
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/vertical-overlay-menu.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/vertical-overlay-menu.css">
    <link rel="stylesheet" type="text/css" href="../../app-assets/css/pages/login-register.css">
    <!-- END Page Level CSS-->
    <!-- BEGIN Custom CSS-->
    <link rel="stylesheet" type="text/css" href="../../assets/css/style.css">
    <!-- END Custom CSS-->
    <link rel="stylesheet" href="../../app-assets/css/fontawesome/css/all.css">
    <script src="https://www.gstatic.com/firebasejs/5.2.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.2.0/firebase-firestore.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.2.0/firebase-auth.js"></script>
</head>

<body data-open="click" data-menu="vertical-overlay-menu" data-col="1-column" class="vertical-layout vertical-overlay-menu 1-column bg-full-screen-image blank-page blank-page">

    <!-- ////////////////////////////////////////////////////////////////////////////-->
    <p></p>
    <div class="app-content content container-fluid">
        <div class="content-wrapper">
            <div class="content-header row">
                <div class="btn-group mr-1 mb-1 show float-xs-right">
                    <button id="language" class="btn btn-light btn-min-width dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" value="french">
                        <i class="flag-icon flag-icon-fr"></i> Français</a>
                    </button>
                    <div class="dropdown-menu show" style="position: absolute; transform: translate3d(0px, 40px, 0px); top: 0px; left: 0px; will-change: transform; min-width:137px">
                        <a href="../../pages/en/recover-password.php" class="dropdown-item"><i class="flag-icon flag-icon-gb"></i> English</a>
                    </div>
                </div>
            </div>
            <div class="content-body row">
                <div class="col-md-4 offset-md-4 col-xs-10 offset-xs-1 box-shadow-2 p-0">
                    <div class="card border-grey border-lighten-3 px-1 py-1 m-0">
                        <div class="card-header no-border pb-0">
                            <div class="card-header no-border pb-0">
                                <div class="card-title text-xs-center">
                                <img class="img-fluid" src="../../assets/images/logo/logo-brand.png" alt="branding logo" width="50%" height="50%">

                                </div>
                                <h6 class="card-subtitle line-on-side text-muted text-xs-center font-small-3 pt-2"><span>Réinitialiser le mot de passe.</span></h6>
                            </div>

                            <div class="card-body collapse in">
                                <div class="card-block">
                                    <div class="form-horizontal" method="post" id="forgot-password">
                                        <fieldset class="form-group position-relative has-icon-left">
                                            <input type="email" name="adresse" id="adresse" class="form-control input-lg" placeholder="Adresse mail" tabindex="1" required data-validation-required-message="Entrez une adresse mail.">
                                            <div class="form-control-position">
                                                <i class="icon-mail6"></i>
                                            </div>
                                            <div class="help-block danger font-small-3" style="display:none" id="error-message"><span class="alert">Le lien n'a pas pu être envoyé, vérifiez votre adresse mail.</span></div>
                                        </fieldset>

                                        <button id="recover-password" class="btn color-blue btn-block btn-lg text-bold-600" onclick="forgotPassword()"><i class="icon-unlock2"></i> Envoyer</button>
                                    </div>
                                    <div class="help-block text-success font-small-3" style="display:none" id="link-sent">
                                        <span id="success-message"></span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-footer border-0">
                                <p class="float-sm-left text-center">
                                    <a class="card-link" href="../../pages/fr/login.php" class="btn btn-primary btn-block btn-lg mt-3"><i class="icon-arrow-left"></i> Retour</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- ////////////////////////////////////////////////////////////////////////////-->

    <footer class="footer footer-static footer-transparent" style="background:lightgray">  
          <ul class="nav navbar-nav ml-1">
            <li class="nav-item"><a href="https://myschool.plus/politique-de-confidentialite/" target="_blank" class="nav-link text-muted">Informations légales</a></li>
          </ul>
          <ul class="nav navbar-nav float-xs-right">
            <li class="nav-item"> <a href="#" style="color:#4267B2"><i class="fab fa-facebook-square fa-3x"></i></a> </li>
            <li class="nav-item"><a href="#" style="color:#DD6544"><i class="fab fa-instagram fa-3x"></i></a> </li>
          </ul>
          <br>
          <br>
          <br>
          <p class="clearfix text-muted text-sm-center mb-0 px-2"><span class="float-md-left d-xs-block d-md-inline-block">Copyright  &copy; <script type="text/javascript"> document.write(new Date().getFullYear()); </script> <a href="https://myschool.plus/" target="_blank" class="text-bold-800 grey darken-2">School +</a>, All rights reserved. </span><span class="float-md-right d-xs-block d-md-inline-block">Hand-crafted & Made with <i class="icon-heart5 pink"></i></span></p>
        </footer>

    <!-- BEGIN VENDOR JS-->
    <script src="../../app-assets/js/core/libraries/jquery.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/tether.min.js" type="text/javascript"></script>
    <script src="../../app-assets/js/core/libraries/bootstrap.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/perfect-scrollbar.jquery.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/unison.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/blockUI.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/jquery.matchHeight-min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/jquery-sliding-menu.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/sliders/slick/slick.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/ui/screenfull.min.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/extensions/pace.min.js" type="text/javascript"></script>
    <!-- BEGIN VENDOR JS-->
    <!-- BEGIN PAGE VENDOR JS-->
    <script src="../../app-assets/vendors/js/forms/validation/jqBootstrapValidation.js" type="text/javascript"></script>
    <script src="../../app-assets/vendors/js/forms/icheck/icheck.min.js" type="text/javascript"></script>
    <!-- END PAGE VENDOR JS-->
    <!-- BEGIN ROBUST JS-->
    <script src="../../app-assets/js/core/app-menu.js" type="text/javascript"></script>
    <script src="../../app-assets/js/core/app.js" type="text/javascript"></script>
    <script src="../../app-assets/js/scripts/ui/fullscreenSearch.js" type="text/javascript"></script>
    <!-- END ROBUST JS-->
    <!-- BEGIN PAGE LEVEL JS-->
    <script src="../../app-assets/js/scripts/forms/form-login-register.js" type="text/javascript"></script>
    <script src="../../app-assets/js/scripts/pages/recover-password.js" type="text/javascript"></script>
    <!-- END PAGE LEVEL JS-->
</body>

</html>