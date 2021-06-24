<!DOCTYPE php>
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
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/extensions/sweetalert.css">
  <!-- font icons-->
  <link rel="stylesheet" type="text/css" href="../../app-assets/fonts/icomoon.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/fonts/flag-icon-css/css/flag-icon.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/sliders/slick/slick.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/extensions/pace.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/charts/morris.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/extensions/unslider.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/weather-icons/climacons.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/file-uploaders/dropzone.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/ui/prism.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/toggle/bootstrap-switch.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/toggle/switchery.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/selects/selectize.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/selects/selectize.default.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/calendars/fullcalendar.min.css">

  <!-- END VENDOR CSS-->
  <!-- BEGIN ROBUST CSS-->
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/bootstrap-extended.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/app.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/colors.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/selects/select2.min.css">
  <!-- END ROBUST CSS-->
  <!-- BEGIN Page Level CSS-->
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/horizontal-menu.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/vertical-overlay-menu.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/colors/palette-climacon.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/pages/users.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/plugins/file-uploaders/dropzone.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css-rtl/plugins/forms/switch.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css-rtl/core/colors/palette-switch.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/file-uploaders/blueimp-gallery.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/file-uploaders/jquery.fileupload.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/file-uploaders/jquery.fileupload-ui.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/js/core/libraries/@fullcalendar/core/main.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/js/core/libraries/@fullcalendar/daygrid/main.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/js/core/libraries/@fullcalendar/timegrid/main.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/js/core/libraries/@fullcalendar/bootstrap/main.css">
  <!-- <link rel="stylesheet" type="text/css" href="../../app-assets/css/plugins/calendars/fullcalendar.css"> -->
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/plugins/forms/selectize/selectize.min.css">
  <!-- END Page Level CSS-->
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-storage.js"></script>

  <!-- BEGIN Custom CSS-->
  <link rel="stylesheet" type="text/css" href="../../assets/css/style.css">
  <link rel="stylesheet" type="text/css" href="../../assets/css/style-rtl.css">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.2/css/all.css" integrity="sha384-fnmOCqbTlWIlj8LyTjo7mOUStjsKC4pOpQbqyi7RrhN7udi9RwhKkMHpvLbHG9Sr" crossorigin="anonymous">
  <!-- END Custom CSS-->
</head>

<body id="page-body" data-open="hover" data-menu="horizontal-menu" data-col="2-columns" class="horizontal-layout horizontal-menu 2-columns ">

  <!-- navbar-fixed-top-->
  <nav class="header-navbar navbar navbar-with-menu navbar-static-top navbar-dark bg-cyan navbar-border navbar-brand-center">
    <div class="navbar-wrapper">
      <div class="navbar-header">
        <ul class="nav navbar-nav">

        <li class="nav-item mobile-menu hidden-md-up float-xs-left"><a class="nav-link nav-menu-main menu-toggle hidden-xs"><i class="icon-menu5 font-large-1"></i></a></li>

<li class="nav-item"><a href="dashboardV2.php" class="navbar-brand nav-link"><img alt="branding logo" src="../../assets/images/logo/logo-brand.png" height="38px" width="50px" class="brand-logo"></a></li>

<li class="nav-item hidden-md-up float-xs-right"><a data-toggle="collapse" data-target="#navbar-mobile" class="nav-link open-navbar-container"><i class="icon-ellipsis pe-2x icon-icon-rotate-right-right"></i></a></li>
        </ul>
      </div>
      <div class="navbar-container container center-layout">
        <div id="navbar-mobile" class="collapse navbar-toggleable-sm">
          <ul class="nav navbar-nav">
            <li class="dropdown dropdown-notification nav-item"><a href="#" data-toggle="dropdown" class="nav-link nav-link-label" id="notifAria"><i class="ficon icon-bell4" id="notifLink"></i><span class="tag tag-pill tag-default tag-danger tag-default tag-up" id="notifNumberTop"></span></a>
              <ul class="dropdown-menu dropdown-menu-media dropdown-menu-left">
                <li class="dropdown-menu-header">
                  <h6 class="dropdown-header m-0"><span class="grey darken-2">Notifications</span><span class="notification-tag tag tag-default tag-danger float-xs-right m-0" id="notifNumberIn"></span></h6>
                </li>
                <li class="scrollable-container list-group w-100 ps-container ps-theme-dark ps-active-y" id="notifications">
                </li>
                <div class="help-block text-bold-600 font-small-3 mt-1 mb-1" style="display:none; text-align:center" id="error-message1">Vous n'avez pas de notifications.</div>
                <li class="dropdown-menu-footer">
                  <div class="row">
                    <div class="col-xl-6 col-md-6 col-xs-12" style="padding-right: 0px;">
                      <a href="#" class="dropdown-item text-muted text-xs-center text-bold-600" id="notif-clearall">Marquer comme lues</a>
                    </div>
                    <div class="col-xl-6 col-md-6 col-xs-12" style="padding-left: 0px;">
                      <a href="#" class="dropdown-item text-muted text-xs-center text-bold-600">Voir toutes</a>
                    </div>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
          <ul class="nav navbar-nav float-xs-right">
            <li class="dropdown dropdown-notification nav-item">
              <a href="user-profile.php" data-toggle="dropdown" class="nav-link nav-link-label">
                <img id="profilepic" src="" alt="avatar" class="rounded-circle" width="32px" height="32px">
                <i></i>
              </a>
            </li>

            <li class="dropdown dropdown-user nav-item">
              <a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link dropdown-user-link" style="height: 100%;text-align: center;">
                <span class="user-name" id="username" style="display: block; text-align: center">Username</span>
              </a>
              <div class="dropdown-menu dropdown-menu-right ">
                <a href="#" class="dropdown-item" style="background:whitesmoke"><i class="fas fa-user"></i> Voir Profil</a>
                <div id="rightMenu">
                
                </div>
                <a href="modify-settings.php" class="dropdown-item"><i class="fas fa-cog"></i> Paramètres</a>
                <div class="dropdown-divider">
                </div>
                <a id="hrefLogOut" class="dropdown-item"><i class="icon-power3"></i> Déconnexion</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- ////////////////////////////////////////////////////////////////////////////-->
  <div id='topmenu-container'>
    <!-- Horizontal navigation-->
    <div role="navigation" data-menu="menu-wrapper" class="header-navbar navbar navbar-horizontal navbar-fixed navbar-light navbar-without-dd-arrow navbar-bordered navbar-shadow">
      <!-- Horizontal menu content-->
      <div data-menu="menu-container" class="navbar-container main-menu-content container center-layout">
        <!-- include ../../includes/mixins-->
        <ul id="main-menu-navigation" data-menu="menu-navigation" class="nav navbar-nav">
          <button class="btn text-bold-900 float-xs-left mt-1" style="display: none;" id="btnAccueil" onclick="window.location.href='dashboard.php'"> Accueil </button>
          <button class="btn text-bold-900 float-xs-left mt-1" style="display: none;" id="btnAccueilSoutien" onclick="window.location.href='dashboard-soutien.php'"> Accueil </button>
        </ul>
      </div>
      <!-- /horizontal menu content-->
    </div>
    <!-- Horizontal navigation-->
  </div>

  <div class="app-content container center-layout mt-2">
    <div class="content-wrapper">

      <div class="content-body">
        <div id="user-profile">
          <div class="row">
            <div class="col-xl-12 col-md-12 col-xs-12">
              <div class="card">
                <div class="row">
                  <div class="col-xl-4 col-md-4 col-xs-12 text-xs-center">
                    <div class="media pt-2 pb-1">
                      <img id="user-picture" src="" alt="avatar" class="rounded-circle" height="200px" width="200px"><i></i>
                    </div>
                    <div class="pb-1">
                      <span id="upload-button" class="btn btn-success fileinput-button mr-1">
                        <span>Changer ma photo</span>
                        <input type="file" id="upload-picture" name="files[]" accept="image/*">
                      </span>
                      <div class="help-block text-bold-600 danger font-small-3" style="display:none; text-align:center" id="error-message"></div>
                    </div>
                  </div>
                  <div class="col-xl-8 col-md-8 col-xs-12">
                    <form class="form mr-1" id="personal-form" action="#" novalidate method="POST">
                      <div class="form-body">
                        <h4 class="form-section"><i class="icon-head"></i> Informations personnelles</h4>
                        <div class="row">
                          <div class="col-md-6 col-xs-12">
                            <div class="form-group">
                              <label for="firstname">Prénom</label>
                              <input type="text" id="firstname" class="form-control" placeholder="Prénom" name="fname" value="" required maxlength="25">
                            </div>
                          </div>
                          <div class="col-md-6 col-xs-12">
                            <div class="form-group">
                              <label for="lastname">Nom</label>
                              <input type="text" id="lastname" class="form-control" placeholder="Nom" name="lname" value="" required maxlength="25">
                            </div>
                          </div>
                          <div class="col-md-6 col-xs-12">
                            <div class="form-group">
                              <label for="phoneNumber">Téléphone</label>
                              <input type="tel" id="phoneNumber" class="form-control" placeholder="Numéro de téléphone" name="fname" value="" required maxlength="25">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-actions">
                        <span class="help-block text-bold-600 text-danger mb-1 font-small-3" style="display:none; text-align:left" id="error-message1"></span>
                        <span class="help-block text-bold-600 text-success mb-1 font-small-3" style="display:none; text-align:left" id="error-message2"></span>
                        <button type="submit" id="personal-submit" class="btn bg-ride-plus text-bold-600">
                          <i class="icon-check2"></i> Save
                        </button>
                      </div>
                    </form>
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

  <footer class="footer  footer-static footer-transparent" style="background:lightgray">
    <ul class="nav navbar-nav ml-1">
      <li class="nav-item"><a href="#" class="nav-link text-muted">Foire aux questions</a></li>
      <li class="nav-item"><a href="https://myschool.plus/politique-de-confidentialite/" target="_blank" class="nav-link text-muted">Informations légales</a></li>
      <li class="nav-item"><a href="#" class="nav-link text-muted" id="contact-us">Contactez-nous</a></li>

    </ul>
    <ul class="nav navbar-nav float-xs-right">
      <li class="nav-item"> <a href="#" style="color:#4267B2"><i class="fab fa-facebook-square fa-3x"></i></a> </li>
      <li class="nav-item"><a href="#" style="color:#DD6544"><i class="fab fa-instagram fa-3x"></i></a> </li>
    </ul>
    <br>
    <br>
    <br>
    <p class="clearfix text-muted text-sm-center mb-0 px-2">
      <span class="float-md-left d-xs-block d-md-inline-block">Copyright &copy; <script type="text/javascript"> document.write(new Date().getFullYear()); </script> <a href="https://bythewave.surf" target="_blank" class="text-bold-800 grey darken-2">School + </a>
        , All rights reserved. Plus d'informations sur <a href="https://www.myschool.plus/" target="_blank" class="text-bold-800 grey darken-2"> MySchool.plus </span>
      <span class="float-md-right d-xs-block d-md-inline-block">Hand-crafted & Made with <i class="icon-heart5 pink"></i></span>
    </p>

    <span class="hidden" id="rideNumber"></span>
    <span class="hidden" id="pointsWon"></span>
    <span class="hidden" id="textSwal"></span>
    <iframe name="hiddenFrame" style="display: none;"></iframe>

    <div style="display: none;">
      <form name="contactUsForm" id="contactUsForm" method="post" action="../../php/send_mail_contact_us.php" target="hiddenFrame">
        <table width="450px">
          <tr>
            <td valign="top">
              <input type="text" name="sender-email" id="sender-email">
            </td>
          </tr>
          <tr>
            <td valign="top">
              <input type="text" name="sender-message" id="sender-message">
            </td>
          </tr>
        </table>
      </form>
    </div>
  </footer>


  <!-- BEGIN VENDOR JS-->
  <script src="../../app-assets/js/core/libraries/jquery.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/tether.min.js" type="text/javascript"></script>
  <script src="../../app-assets/js/core/libraries/bootstrap.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/perfect-scrollbar.jquery.min.js" type="text/javascript"></script>
  <!-- <script src="../../app-assets/vendors/js/ui/unison.min.js" type="text/javascript"></script> -->
  <script src="../../app-assets/vendors/js/ui/blockUI.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/jquery.matchHeight-min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/jquery-sliding-menu.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/sliders/slick/slick.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/screenfull.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/pace.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/select/selectize.min.js"></script>
  <!-- BEGIN VENDOR JS-->
  <!-- BEGIN PAGE VENDOR JS-->
  <script src="../../app-assets/vendors/js/forms/toggle/bootstrap-switch.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/toggle/bootstrap-checkbox.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/prism.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/sweetalert.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/select/select2.full.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/toggle/bootstrap-switch.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/toggle/switchery.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/vendor/jquery.ui.widget.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/vendor/tmpl.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/vendor/load-image.all.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/vendor/canvas-to-blob.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/vendor/jquery.blueimp-gallery.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.iframe-transport.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-process.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-image.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-audio.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-video.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-validate.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery-file-upload/jquery.fileupload-ui.js" type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/moment/moment.js'></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/core/main.js' type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/daygrid/main.js' type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/timegrid/main.js' type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/bootstrap/main.js' type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/moment/main.js' type="text/javascript"></script>
  <script src='../../app-assets/js/core/libraries/@fullcalendar/interaction/main.js' type="text/javascript"></script>
  <!-- END PAGE VENDOR JS-->
  <!-- BEGIN ROBUST JS-->
  <script src="../../app-assets/js/core/app-menu.js" type="text/javascript"></script>
  <script src="../../app-assets/js/core/app.js" type="text/javascript"></script>
  <!-- <script src="../../app-assets/js/core/app-menu.js" type="text/javascript"></script> -->

  <script src="../../app-assets/js/scripts/ui/fullscreenSearch.js" type="text/javascript"></script>
  <!-- END ROBUST JS-->
  <!-- BEGIN PAGE LEVEL JS-->

  <script src="../../app-assets/js/scripts/forms/form-login-register.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/forms/select/form-selectize.min.js"></script>
  <script src="../../app-assets/js/scripts/pages/common-script.js"></script>
  <script src="../../app-assets/js/scripts/pages/user-profile.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/extensions/dropzone.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/forms/select/form-select2.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/forms/switch.js" type="text/javascript"></script>
  <script src="https://code.jquery.com/jquery-2.1.3.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.6-rc.0/js/select2.min.js"></script>
  <!-- END PAGE LEVEL JS-->
</body>

</html>