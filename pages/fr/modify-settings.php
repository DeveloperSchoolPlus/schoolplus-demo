<!DOCTYPE php>
<html lang="en" data-textdirection="ltr" class="loading">

<head>
  <!--<META HTTP-EQUIV="refresh" CONTENT="15">-->
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
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/icheck/icheck.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/forms/icheck/custom.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/charts/morris.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/extensions/unslider.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/weather-icons/climacons.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/file-uploaders/dropzone.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/ui/prism.min.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/vendors/css/ui/dragula.min.css">
  <!-- END VENDOR CSS-->
  <!-- BEGIN ROBUST CSS-->
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/bootstrap-extended.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/app.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/colors.css">
  <!-- END ROBUST CSS-->
  <!-- BEGIN Page Level CSS-->
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/horizontal-menu.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/menu/menu-types/vertical-overlay-menu.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/core/colors/palette-climacon.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/pages/users.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/plugins/file-uploaders/dropzone.css">
  <link rel="stylesheet" type="text/css" href="../../app-assets/css/pages/login-register.css">
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-app.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-firestore.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-auth.js"></script>
  <script src="https://www.gstatic.com/firebasejs/5.5.4/firebase-storage.js"></script>
  <!-- END Page Level CSS-->
  <!-- BEGIN Custom CSS-->
  <link rel="stylesheet" type="text/css" href="../../assets/css/style.css">
  <link rel="stylesheet" href="../../app-assets/css/fontawesome/css/all.css">

  <!-- END Custom CSS-->
  <style>
  #map {
    height: 100%;
  }
  </style>

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
            <li class="dropdown dropdown-notification nav-item"><a href="#" data-toggle="dropdown" class="nav-link nav-link-label" id="notifAria"><i
                  class="ficon icon-bell4" id="notifLink"></i><span class="tag tag-pill tag-default tag-danger tag-default tag-up"
                  id="notifNumberTop"></span></a>
              <ul class="dropdown-menu dropdown-menu-media dropdown-menu-left">
                <li class="dropdown-menu-header">
                  <h6 class="dropdown-header m-0"><span class="grey darken-2">Notifications</span><span
                      class="notification-tag tag tag-default tag-danger float-xs-right m-0" id="notifNumberIn"></span></h6>
                </li>
                <li class="scrollable-container list-group w-100 ps-container ps-theme-dark ps-active-y" id="notifications">
                </li>
                <div class="help-block text-bold-600 font-small-3 mt-1 mb-1" style="display:none; text-align:center" id="error-message1">Vous n'avez
                  pas de notifications.</div>
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
                <a href="user-profile.php" class="dropdown-item"><i class="fas fa-user"></i> Voir Profil</a>
                <div id="rightMenu"></div>
                <a href="#" class="dropdown-item active" style="background:whitesmoke"><i class="fas fa-cog"></i> Paramètres</a>
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
    <div role="navigation" data-menu="menu-wrapper"
      class="header-navbar navbar navbar-horizontal navbar-fixed navbar-light navbar-without-dd-arrow navbar-bordered navbar-shadow">
      <!-- Horizontal menu content-->
      <div data-menu="menu-container" class="navbar-container main-menu-content container center-layout">
        <!-- include ../../includes/mixins-->
        <ul id="main-menu-navigation" data-menu="menu-navigation" class="nav navbar-nav">
          <div id="adminSection" style="display: none;">
            <li data-menu="dropdown" class="dropdown nav-item">
              <a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion
                  EVOL</span></a>
              <ul class="dropdown-menu">
                <li data-menu=""><a href="dashboard.php" class="dropdown-item"><span data-i18n="nav.dash.main">Plannings</span></a></li>
                <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
                <a href="#" class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Matières</span></a>
                <ul class="dropdown-menu">
                  <!-- <li data-menu=""><a href="create-classes.php?target=addClass" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter une classe</span></a></li> -->
                  <li data-menu=""><a href="create-classes.php?target=createSubject" class="dropdown-item"><span data-i18n="nav.dash.main">Créer une matière</span></a></li>
                </ul>
              </li>
              <!--  -->
              <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
              <a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a>
              <ul class="dropdown-menu">
              <li data-menu=""><a href="create-user.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li>
              <li data-menu=""><a href="create-user.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li>
              <!-- <li data-menu=""><a href="create-classes.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li>
              <li data-menu=""><a href="create-classes.php?target=subjectTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Professeurs</span></a></li> -->
              </ul>
              </li>
                <li data-menu=""><a href="contenu-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Programme de cours</span></a></li>
                <!--  -->
              <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
                <a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a>
                <ul class="dropdown-menu">
                <li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li>
                <li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li>
                </ul>
              </li>

              <!--  -->
                <li data-menu=""><a href="bilan.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>
                <li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>
              </ul>
            </li>
            <li data-menu="dropdown" class="dropdown nav-item">
              <a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion
                  Soutien</span></a>
              <ul class="dropdown-menu">
                <li data-menu=""><a href="dashboard-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>
                <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
              <a class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Gestion utilisateurs</span></a>
              <ul class="dropdown-menu">
              <li data-menu=""><a href="create-user-soutien.php?target=addUser" class="dropdown-item"><span data-i18n="nav.dash.main">Ajouter un compte utilisateur</span></a></li>
              <li data-menu=""><a href="create-user-soutien.php?target=modifyUser" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un compte utilisateur</span></a></li>
              <li data-menu=""><a href="create-user-soutien.php?target=subjectStudent" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter des matières - Élèves</span></a></li>
              <li data-menu=""><a href="create-user-soutien.php?target=soutienTeacher" class="dropdown-item"><span data-i18n="nav.dash.main">Affecter un professeur EVOL au soutien scolaire</span></a></li>
              </ul>
              </li>
                <li data-menu=""><a href="contenu-cours-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Programme de
                      cours</span></a></li>
                <li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>
              </ul>
            </li>
          </div>
          <div id="teacherSection" style="display: none;">
            <li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard.php" class="nav-link"><i class="far fa-calendar-alt"></i><span
                  data-i18n="nav.dash.main">Agenda</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span
                  data-i18n="nav.dash.main">Classe virtuelle</span></a>
              <ul class="dropdown-menu">
                <li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1" class="dropdown-item"><span
                      data-i18n="nav.dash.main">Sophia</span></a></li>
                <li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1" class="dropdown-item"><span
                      data-i18n="nav.dash.main">Sam</span></a></li>
                <li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1" class="dropdown-item">
                    <spandata-i18n="nav.dash.main">Noé</span>
                  </a></li>
                <li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1" class="dropdown-item">
                    <spandata-i18n="nav.dash.main">Thomas</span>
                  </a></li>
                <li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="dropdown-item">
                    <spandata-i18n="nav.dash.main">Timéo</span>
                  </a></li>
              </ul>
            </li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours.php" class="nav-link"><i class="fas fa-book"></i><span
                  data-i18n="nav.dash.main">Mes cours</span></a></li>
                  <!--  -->
              <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
                <a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a>
                <ul class="dropdown-menu">
                <li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li>
                <li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li>
                </ul>
              </li>

              <!--  -->
            <li data-menu="dropdown" class="dropdown nav-item "><a href="devoirs.php" class="nav-link"><i class="fas fa-file-alt"></i><span
                  data-i18n="nav.dash.main">Devoirs</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="bilan-teacher.php" class="nav-link"><i class="fas fa-chart-line"></i><span
                  data-i18n="nav.dash.main">Bilan</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item"><a href="planning+" class="nav-link"><i class="far fa-calendar-plus"></i><span
                  data-i18n="nav.dash.main">Planning+</span></a></li>
          </div>
          <div id="teacherSoutienSection" style="display: none;">
            <ul id="main-menu-navigation" data-menu="menu-navigation" class="nav navbar-nav">
              <li data-menu="dropdown" class="dropdown nav-item "><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i
                    class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion EVOL</span></a>
                <ul class="dropdown-menu">
                  <li data-menu=""><a href="dashboard.php" class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>
                  <li data-menu=""><a href="mes-cours.php" class="dropdown-item"><span data-i18n="nav.dash.main">Mes cours</span></a></li>
                  <!--  -->
              <li data-menu="" class="dropdown  dropdown-item dropdown-submenu">
                <a  class="dropdown-toggle dropdown-item-submenu" data-toggle="dropdown"><span data-i18n="nav.dash.main">Outils pédagogiques</span></a>
                <ul class="dropdown-menu">
                <li data-menu=""><a href="create-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Créer un contenu</span></a></li>
                <li data-menu=""><a href="modify-content.php" class="dropdown-item"><span data-i18n="nav.dash.main">Modifier un contenu existant</span></a></li>
                </ul>
              </li>

              <!--  -->
                  <li data-menu=""><a href="devoirs.php" class="dropdown-item"><span data-i18n="nav.dash.main">Devoirs</span></a></li>
                  <li data-menu=""><a href="bilan-teacher.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>
                  <li data-menu=""><a href="planning+" class="dropdown-item"><span data-i18n="nav.dash.main">Planning+</span></a></li>
                </ul>
              </li>
              <li data-menu="dropdown" class="dropdown nav-item"><a href="#" data-toggle="dropdown" class="dropdown-toggle nav-link"><i
                    class="fas fa-school"></i><span data-i18n="nav.dash.main">Gestion Soutien</span></a>
                <ul class="dropdown-menu">
                  <li data-menu=""><a href="dashboard-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Agenda</span></a></li>
                  <li data-menu=""><a href="contenu-cours-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Programme de
                        cours</span></a></li>
                  <li data-menu=""><a href="bilan-soutien.php" class="dropdown-item"><span data-i18n="nav.dash.main">Bilan</span></a></li>
                </ul>
              </li>
              <li data-menu="dropdown" class="dropdown nav-item"><a href="#" class="nav-link"><i class="fas fa-pencil-ruler"></i><span
                    data-i18n="nav.dash.main">Classe virtuelle</span></a>
                <ul class="dropdown-menu">
                  <li data-menu=""><a href="https://draw.chat/DC9075A8EB12606C765:5s7sn1wx#p1,0,0,r0,s1" class="dropdown-item"><span
                        data-i18n="nav.dash.main">Sophia</span></a></li>
                  <li data-menu=""><a href="https://draw.chat/CC8E4D30DAB57A93C2E:6xhth89d#p2,-153,257,r0,s1" class="dropdown-item"><span
                        data-i18n="nav.dash.main">Sam</span></a></li>
                  <li data-menu=""><a href="https://draw.chat/D07AC100BEF519E9A47:n7bxs5s0#p1,0,0,r0,s1" class="dropdown-item"><span
                        data-i18n="nav.dash.main">Noé</span></a></li>
                  <li data-menu=""><a href="https://draw.chat/FA6BC37126E89A70B1E:f7nsl71c#p1,0,0,r0,s1" class="dropdown-item"><span
                        data-i18n="nav.dash.main">Thomas</span></a></li>
                  <li data-menu=""><a href="https://draw.chat/B4606F12BD103285A8C:obs01whc#p1,0,0,r0,s1" class="dropdown-item"><span
                        data-i18n="nav.dash.main">Timéo</span></a></li>
                </ul>
              </li>
            </ul>
          </div>
          <div id="studentSection" style="display: none;">
          <li data-menu="dropdown" class="dropdown nav-item"><a href="dashboardV2.php" class="nav-link"><i class="fas fa-water"></i><span data-i18n="nav.dash.main">Tableau de bord</span></a></li>

            <li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard.php" class="nav-link"><i class="far fa-calendar-alt"></i><span
                  data-i18n="nav.dash.main">Tutorat</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="#" class="nav-link" id="virtualClass"><i
                  class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours-eleve.php" class="nav-link"><i class="fas fa-book"></i><span
                  data-i18n="nav.dash.main">Mes cours</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin.php" class="nav-link"><i class="fas fa-chart-line"></i><span
                  data-i18n="nav.dash.main">Mon bilan</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item"><a href="mon-planning-extra.php" class="nav-link"><i
                  class="far fa-calendar-plus"></i><span data-i18n="nav.dash.main">Mon planning extrascolaire</span></a></li>
          </div>
          <div id="teacherSoutienSection" style="display: none;">
            <!-- TODO -->
          </div>
          <div id="studentSoutienSection" style="display: none;">
            <li data-menu="dropdown" class="dropdown nav-item"><a href="dashboard-soutien.php" class="nav-link"><i
                  class="far fa-calendar-alt"></i><span data-i18n="nav.dash.main">Agenda</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="#" class="nav-link" id="virtualClass"><i
                  class="fas fa-pencil-ruler"></i><span data-i18n="nav.dash.main">Classe virtuelle</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item "><a href="mes-cours-eleve-soutien.php" class="nav-link"><i
                  class="fas fa-book"></i><span data-i18n="nav.dash.main">Mes cours</span></a></li>
            <li data-menu="dropdown" class="dropdown nav-item"><a href="mon-bulletin-soutien.php" class="nav-link"><i
                  class="fas fa-chart-line"></i><span data-i18n="nav.dash.main">Mon bilan</span></a></li>
          </div>
        </ul>
      </div>


      <!-- /horizontal menu content-->
    </div>
    <!-- Horizontal navigation-->
  </div>

  <div class="app-content container center-layout mt-2">
    <div class="row">
      <div class="col-xl-12 col-md-12 col-xs-12 mt-2">
        <div class="content-body">
          <div class="card">
            <form class="form-horizontal mr-1 ml-1" id="password-form" action="#" novalidate action="#" method="POST">
              <div class="form-body">
                <h4 class="form-section"><i class="icon-key3"></i> Modifier mon mot de passe</h4>
                <div class="row">
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="current-password">Mot de passe actuel</label>
                      <input type="password" name="current-password" id="current-password" class="form-control"
                        placeholder="Entrez votre mot de passe." tabindex="7" required
                        data-validation-required-message="Entrez votre mot de passe actuel.">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="new-password">Nouveau mot de passe</label>
                      <input type="password" name="new-password" id="new-password" class="form-control" placeholder="Nouveau mot de passe"
                        tabindex="6" required data-validation-required-message="Entrez votre nouveau mot de passe.">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="password_confirmation">Confirmation du mot de passe</label>
                      <input type="password" name="password_confirmation" id="password_confirmation" class="form-control"
                        placeholder="Confirmez le mot de passe." tabindex="7" data-validation-matches-match="new-password"
                        data-validation-matches-message="Mot de passe différent.">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <span class="help-block text-bold-600 text-danger mb-1 font-small-3" style="display:none; text-align:left" id="error-message1"></span>
                <span class="help-block text-bold-600 text-danger mb-1 font-small-3" style="display:none; text-align:left" id="error-message2"></span>
                <button type="submit" id="password-submit" class="btn bg-ride-plus text-bold-600">
                  <i class="icon-check2"></i> Enregistrer
                </button>
              </div>
            </form>

            <form class="form-horizontal mr-1 ml-1" id="email-form" action="#" novalidate action="#" method="POST">
              <div class="form-body">
                <h4 class="form-section"><i class="far fa-envelope"></i> Modifier mon adresse mail</h4>
                <div class="row">
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="current-email">Adresse mail actuelle</label>
                      <input type="text" name="current-email" id="current-email" class="form-control" tabindex="7" disabled="">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="new-email">Nouvelle adresse mail</label>
                      <input type="email" name="new-email" id="new-email" class="form-control" placeholder="Nouvelle adresse mail" tabindex="6"
                        required data-validation-required-message="Entrez votre nouvelle adresse mail.">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                  <div class="col-xl-4 col-md-4 col-xs-12">
                    <fieldset class="form-group">
                      <label for="password_confirmation">Mot de passe</label>
                      <input type="password" name="password" id="password" class="form-control" placeholder="Entrez votre mot de passe." tabindex="7">
                      <div class="help-block text-bold-600 danger font-small-3"></div>
                    </fieldset>
                  </div>
                </div>
              </div>
              <div class="form-actions">
                <span class="help-block text-bold-600 text-danger mb-1 font-small-3" style="display:none; text-align:left" id="error-message3"></span>
                <span class="help-block text-bold-600 text-success mb-1 font-small-3" style="display:none; text-align:left"
                  id="error-message4"></span>
                <button type="submit" id="email-submit" class="btn bg-ride-plus text-bold-600">
                  <i class="icon-check2"></i> Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <!-- ////////////////////////////////////////////////////////////////////////////-->
  <!-- <footer class="footer  footer-static footer-transparent" style="background:lightgray">
<ul class="nav navbar-nav ml-1">
<li class="nav-item"><a href="#" class="nav-link text-muted">Foire aux questions</a></li>
<li class="nav-item"><a href="https://bythewave.surf/fr/politique-de-confidentialite/" class="nav-link text-muted">Informations légales</a></li>
<li class="nav-item"><a href="#" class="nav-link text-muted" id="contact-us">Contactez-nous</a></li>
</ul>
<ul class="nav navbar-nav float-xs-right">
<li class="nav-item"> <a href="https://www.facebook.com/SantochaCapbreton" style="color:#4267B2"><i class="fab fa-facebook-square fa-3x"></i></a> </li>
<li class="nav-item"><a href="https://www.instagram.com/santocha_capbreton/" style="color:#DD6544"><i class="fab fa-instagram fa-3x"></i></a> </li>
</ul>
<br>
<br>
<br>
<p class="clearfix text-muted text-sm-center mb-0 px-2">
<span class="float-md-left d-xs-block d-md-inline-block">Copyright  &copy; 2019 <a href="https://bythewave.surf" target="_blank" class="text-bold-800 grey darken-2">BYTHEWAVE Technologies </a>
, All rights reserved. Plus d'informations sur <a href="https://www.santocha.org/" target="_blank" class="text-bold-800 grey darken-2"> Santocha.org </span>
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
  </footer> -->
  <footer class="footer footer-static footer-transparent" style="background:lightgray">
    <ul class="nav navbar-nav ml-1">
      <li class="nav-item"><a href="#" class="nav-link text-muted">Foire aux questions</a></li>
      <li class="nav-item"><a href="https://myschool.plus/politique-de-confidentialite/" class="nav-link text-muted">Informations légales</a></li>
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
      <span class="float-md-left d-xs-block d-md-inline-block">Copyright &copy; <script type="text/javascript"> document.write(new Date().getFullYear()); </script> <a href="https://myschool.plus/" target="_blank"
          class="text-bold-800 grey darken-2">School +</a>
        , All rights reserved. Plus d'informations sur <a href="https://www.myschool.plus/" target="_blank" class="text-bold-800 grey darken-2">
          MySchool.plus </span>
      <span class="float-md-right d-xs-block d-md-inline-block">Hand-crafted & Made with <i class="icon-heart5 pink"></i></span>
    </p>
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
  <script src="../../app-assets/vendors/js/ui/jquery.sticky.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/sliders/slick/slick.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/screenfull.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/pace.min.js" type="text/javascript"></script>
  <!-- BEGIN VENDOR JS-->
  <!-- BEGIN PAGE VENDOR JS-->
  <script src="../../app-assets/vendors/js/extensions/dragula.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/charts/gmaps.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/icheck/icheck.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/jquery.knob.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/charts/raphael-min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/charts/morris.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/unslider-min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/charts/echarts/echarts.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/dropzone.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/ui/prism.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/extensions/sweetalert.min.js" type="text/javascript"></script>
  <script src="../../app-assets/vendors/js/forms/validation/jqBootstrapValidation.js" type="text/javascript"></script>
  <!-- END PAGE VENDOR JS-->
  <!-- BEGIN ROBUST JS-->
  <script src="../../app-assets/js/core/app-menu.js" type="text/javascript"></script>
  <script src="../../app-assets/js/core/app.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/ui/fullscreenSearch.js" type="text/javascript"></script>
  <!-- END ROBUST JS-->
  <!-- BEGIN PAGE LEVEL JS-->
  <script src="../../app-assets/js/scripts/pages/common-script.js"></script>
  <script src="../../app-assets/js/scripts/pages/modify-settings.js" type="text/javascript"></script>
  <script src="../../app-assets/js/scripts/forms/form-login-register.js" type="text/javascript"></script>
  <!-- END PAGE LEVEL JS-->
</body>

</html>