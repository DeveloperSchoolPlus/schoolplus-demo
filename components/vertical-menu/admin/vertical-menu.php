<?php echo '
<!-- To highlight a <li> element, replace the class \'menu-item\' with \'active\' -->
<div class="main-menu menu-fixed menu-light menu-accordion menu-shadow">
    <div class="main-menu-content">
        <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">

            <li class=" nav-item"><a href="../../../pages/fr/dashboardV2.php"><i class="icon-home"></i><span class="menu-title" data-i18n="nav.dash.main">Tableau de bord</span></a></li>
            <li class=" nav-item"><a href="#"><i class="icon-calendar"></i><span class="menu-title" data-i18n="nav.dash.main">Agenda</span></a></li>
            <li class=" nav-item"><a href="#"><i class="icon-user-follow"></i><span class="menu-title" data-i18n="nav.dash.main">Utilisateurs</span></a>
            <ul class="menu-content">
              <li><a class="menu-item" href="../../../pages/fr/create-user.php" data-i18n="nav.dash.fitness">Ajouter un compte utilisateur</a>
              </li>
              <li><a class="menu-item" href="#" data-i18n="nav.dash.project">Valider une inscription</a>
              </li>           
            </ul>
            </li>
            <li class=" nav-item"><a href="#"><i class="icon-social-dribbble"></i><span class="menu-title" data-i18n="nav.dash.main">Organisations</span></a>
            <ul class="menu-content">
              <li><a class="menu-item" href="../../../pages/fr/create-orga.php" data-i18n="nav.dash.fitness">Ajouter une organisation</a>
              </li>
                        
            </ul>
            </li>
            <li class=" nav-item"><a href="#"><i class="icon-note"></i><span class="menu-title" data-i18n="nav.dash.main">Outils création</span></a>
            <ul class="menu-content">
              <li><a class="menu-item" href="mes-outils.php" data-i18n="nav.dash.fitness">Créer contenu - Formation</a>
              </li>
              <li><a class="menu-item" href="mes-outils-scratch.php" data-i18n="nav.dash.project">Créer contenu - Bibliothèque</a>
              </li>           
            </ul>
            </li>
            <li class=" nav-item"><a href="../../../pages/fr/contenu-cours.php?function=addFormation"><i class="icon-graduation"></i><span class="menu-title" data-i18n="nav.dash.main">Mes formations</span></a></li>
            
            <li class=" nav-item"><a href="#"><i class="icon-graph"></i><span class="menu-title" data-i18n="nav.dash.main">Bilans</span></a></li>
                
        </ul>
        <div class="text-center pb-1" style="position:absolute;bottom:0; width:100%;"> <!-- Custom style applied to have the footer at the bottom of the menu -->
            <span class=" d-xs-block d-md-inline-block"><a href="https://myschool.plus/" target="_blank" class=" text-bold-600 grey darken-3">School +</a></span>
            <span class=" d-xs-block d-md-inline-block"> Copyright © <script type="text/javascript"> document.write(new Date().getFullYear()); </script></span>
        </div>
    </div>
</div>
'
?>