<!DOCTYPE html>
<html lang="en" data-textdirection="ltr" class="loading">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
  <meta name="description" content="La plateforme qui simplifie et optimise le soutien scolaire.">
  <meta name="keywords" content="education, support, suivi scolaire, soutien scolaire, plateforme scolaire">
  <meta name="author" content="School+">
  <title>School +</title>
  <link rel="apple-touch-icon" sizes="60x60" href="../../app-assets/images/ico/logo_schoolplus_60.png">

  <link rel="apple-touch-icon" sizes="76x76" href="../../app-assets/images/ico/logo_schoolplus_76.png">

  <link rel="apple-touch-icon" sizes="120x120" href="../../app-assets/images/ico/logo_schoolplus_120.png">

  <link rel="apple-touch-icon" sizes="152x152" href="../../app-assets/images/ico/logo_schoolplus_152.png">

  <link rel="shortcut icon" type="image/x-icon" href="../../app-assets/images/ico/logo_schoolplus_152.png">

  <link rel="shortcut icon" type="image/png" href="../../app-assets/images/ico/logo_schoolplus_152.png">
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
  <script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/6.2.4/firebase-auth.js"></script>
</head>

<body data-open="click" data-menu="vertical-overlay-menu" data-col="1-column" class="vertical-layout vertical-overlay-menu 1-column  blank-page blank-page" style="background:url(../../app-assets/images/backgrounds/schoolplusbackground.png) no-repeat center center fixed; background-size: cover">

  <!-- ////////////////////////////////////////////////////////////////////////////-->
  <p></p>
  <div class="app-content content container-fluid">
    <div class="content-wrapper">
      <div class="content-header row">
        <div class="btn-group mr-1 mb-1 show float-xs-right">
          <button id="language" class="btn btn-light btn-min-width dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" value="french">
            <i class="flag-icon flag-icon-fr"></i> Français</a>
          </button>
        
        </div>
      </div>

      <div class="content-body row">
        <div class="col-md-5 offset-md-4 col-xs-10 offset-xs-1 box-shadow-2 p-0">
          <div class="card border-grey border-lighten-3 px-1 py-1 m-0">
            <div class="card-header no-border pb-0">
              <div class="card-header no-border pb-0">
                <div class="card-title text-xs-center">
                  <img class="img-fluid" src="../../app-assets/images/logo/logo_school+_nav.png" alt="branding logo" width="350" height="64">

                </div>
                <h6 class="card-subtitle line-on-side text-muted text-xs-center font-small-3 pt-2"><span>Créer un compte</span></h6>
              </div>
              <div class="card-body collapse in">
              <div class="text-bold-600 danger font-small-3" style="display:none; text-align:center" id="error-message-1">
                  <span class="alert">Cette adresse ne semble pas encore avoir été ajoutée.</span>
                </div>
              
                <div class="text-bold-600 danger font-small-3" style="display:none; text-align:center" id="error-message-2">
                  <span class="alert">Le mot de passe doit contenir au moins 6 caractères.</span>
                </div>
           
                 <div class="card-block"> 
                <fieldset class="form-group position-relative has-icon-left">
                      <input type="email" name="verifyEmail" id="verifyEmail" class="form-control input-lg" placeholder="Adresse mail" tabindex="3" required data-validation-required-message="Entrez une adresse mail.">
                      <div class="form-control-position">
                        <i class="icon-mail6"></i>
                      </div>
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                    <button type="button" id="btnVerifyEmail" class="btn color-blue btn-block btn-lg text-bold-600"><i class="fas fa-user-check"></i> Vérifier l'adresse</button>
                    <h6 class="card-subtitle line-on-side text-muted text-xs-center font-small-3 pt-2"></h6>
                    <form id="signup-form" class="form-horizontal" action="#" novalidate method="POST">
                    <div class="row">
                    
                      <div class="col-xs-12 col-sm-6 col-md-">
                      
                        <fieldset class="form-group position-relative has-icon-left">
                          <input type="text" name="lastname" id="lastname" class="form-control input-lg" placeholder="Nom" tabindex="1">
                          <div class="form-control-position">
                            <i class="icon-head"></i>
                          </div>
                          <div class="help-block text-bold-600 danger font-small-3"></div>
                        </fieldset>
                      </div>
                      <div class="col-xs-12 col-sm-6 col-md-6">
                        <fieldset class="form-group position-relative has-icon-left">
                          <input type="text" name="firstname" id="firstname" class="form-control input-lg" placeholder="Prénom" tabindex="2">
                          <div class="form-control-position">
                            <i class="icon-head"></i>
                          </div>
                          <div class="help-block text-bold-600 danger font-small-3"></div>
                        </fieldset>
                      </div>
                      
                      <div class="col-xs-12 col-sm-12 col-md-12">
                      <fieldset class="form-group position-relative has-icon-left">
                      <input type="tel" name="phone" id="phoneNumber" class="form-control input-lg" placeholder="Numéro de téléphone" tabindex="3" required data-validation-required-message="Entrez un numéro de téléhpone.">
                      <div class="form-control-position">
                        <i class="icon-ios-telephone"></i>
                      </div>
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                      </div>
                      
                    </div>
              
                    <fieldset id ="classSection" style="display: none;"class="form-group position-relative has-icon-left">
                          <input type="text" name="classe" id="classe"  disabled class="form-control input-lg" placeholder="Classe" tabindex="2">
                          <div class="form-control-position">
                            <i class="fas fa-graduation-cap"></i>
                          </div>
                          <div class="help-block text-bold-600 danger font-small-3"></div>
                        </fieldset>
                    <div class="row">
                      <div class="col-xs-12 col-sm-6 col-md-6">
                        <fieldset class="form-group position-relative has-icon-left">
                          <input type="password" name="password" id="password" class="form-control input-lg" placeholder="Mot de passe" tabindex="6" required data-validation-required-message="Entrez un mot de passe.">
                          <div class="form-control-position">
                            <i class="icon-key3"></i>
                          </div>
                          <div class="help-block text-bold-600 danger font-small-3"></div>
                        </fieldset>
                      </div>

                      <div class="col-xs-12 col-sm-6 col-md-6">
                        <fieldset class="form-group position-relative has-icon-left">
                          <input type="password" name="password_confirmation" id="password_confirmation" class="form-control input-lg" placeholder="Confirmez le mot de passe." tabindex="7" data-validation-matches-match="password" data-validation-matches-message="Mot de passe différent.">
                          <div class="form-control-position">
                            <i class="icon-key3"></i>
                          </div>
                          <div class="help-block text-bold-600 danger font-small-3"></div>
                        </fieldset>
                      </div>
                   

                    </div>

                

                    <button type="submit" id="btnRegister" class="btn color-blue btn-block btn-lg text-bold-600" disabled="true"><i class="icon-head"></i> M'inscrire</button>
                  </form>
                  </div>  
                  <div class="card-footer border-0" style="text-align:center">
                                    <p class="float-sm-center text-center">Vous avez déjà un compte? <a class="card-link" href="../../pages/fr/login.php" class="btn btn-primary btn-block btn-lg mt-3"> Se connecter</a>
                                    </p>
                                </div>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- ////////////////////////////////////////////////////////////////////////////-->

  <footer class="footer navbar-bottom footer-dark school-plus">
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
    <p class="clearfix text-muted text-sm-center mb-0 px-2"><span class="float-md-left d-xs-block d-md-inline-block">Copyright &copy; 2020 <a href="https://myschool.plus/" target="_blank" class="text-bold-800 grey darken-2">School +</a>, All rights reserved. </span><span class="float-md-right d-xs-block d-md-inline-block">Hand-crafted & Made with <i class="icon-heart5 pink"></i></span></p>
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
  <script src="../../app-assets/js/scripts/pages/register.js" type="text/javascript"></script>
  <!-- END PAGE LEVEL JS-->
</body>

</html>