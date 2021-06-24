<?php echo '
<!-- fixed-top, hide top scroll, logo to fix-->
<nav class="header-navbar navbar-expand-md navbar navbar-with-menu navbar-hide-on-scroll fixed-top navbar-dark bg-cyan navbar-shadow navbar-brand-center">
  <div class="navbar-wrapper">
    <div class="navbar-header">
      <ul class="nav navbar-nav flex-row">
        <li class="nav-item mobile-menu d-md-none mr-auto"><a class="nav-link nav-menu-main menu-toggle hidden-xs" href="#"><i class="ft-menu font-large-1"></i></a></li>
        <li class="nav-item"><a class="navbar-brand" href="#"><img class="brand-logo" alt="School+ logo" src="../../assets/images/logo/logo-brand.png">
             <h3 class="brand-text" style="padding:0;"><script type="text/javascript"> document.write(document.getElementById(\'pageTitle\').innerHTML); </script></h3></a></li> <!-- STYLE PADDING TO REMOVE ONCE WE HAVE THE LOGO -->
        <li class="nav-item d-md-none"><a class="nav-link open-navbar-container" data-toggle="collapse" data-target="#navbar-mobile"><i class="fa fa-ellipsis-v"></i></a></li>
      </ul>
    </div>
    <div class="navbar-container content">
      <div class="collapse navbar-collapse" id="navbar-mobile">
        <ul class="nav navbar-nav mr-auto float-left">
          <li class="nav-item d-none d-md-block"><a class="nav-link nav-menu-main menu-toggle hidden-xs" href="#"><i class="ft-menu"></i></a></li>
        </ul>
        <ul class="nav navbar-nav float-right">
          <li class="dropdown dropdown-notification nav-item d-none"><a class="nav-link nav-link-label" href="#" onClick ="openMail();" data-toggle="dropdown" aria-expanded="false"><i class="ficon ft-mail"></i></a>
            
          </li>
          <li class="dropdown dropdown-user nav-item"><a class="dropdown-toggle nav-link dropdown-user-link" href="#" data-toggle="dropdown"><span class="avatar avatar-online"><img src="../../../bibliotheque/app-assets/images/portrait/small/no_avatar.png" alt="avatar" id="profilePic"><i></i></span><span class="user-name" id="userName">User Name</span></a>
            <div class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" href="../../../pages/fr/user-profile.php"><i class="ft-user"></i> Mon profil</a>
              <a class="dropdown-item" href="../../../pages/fr/mes-auteurs.php"><i class="ft-users"></i> Auteurs</a>
              <a class="dropdown-item" href="../../../pages/fr/mes-apprenants.php"><i class="ft-users"></i> Apprenants</a>
              <a class="dropdown-item" href="../../../pages/fr/mes-formateurs.php"><i class="ft-users"></i> Formateurs</a>

              <a class="dropdown-item" href="../../../pages/fr/modify-settings.php"><i class="ft-settings"></i> Paramètres</a>
              <div class="dropdown-divider"></div><a class="dropdown-item" href="#" id="hrefLogOut"><i class="ft-power"></i> Déconnexion</a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
'
?>