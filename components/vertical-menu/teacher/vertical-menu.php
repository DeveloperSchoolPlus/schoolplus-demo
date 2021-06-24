<?php echo '
<!-- To highlight a <li> element, replace the class \'menu-item\' with \'active\' -->
<div class="main-menu menu-fixed menu-light menu-accordion menu-shadow">
    <div class="main-menu-content">
        <ul class="navigation navigation-main" id="main-menu-navigation" data-menu="menu-navigation">

            <li class=" nav-item"><a href="../../../pages/fr/dashboardV2.php"><i class="icon-home"></i><span class="menu-title" data-i18n="nav.dash.main">Tableau de bord</span></a></li>
            <li class=" nav-item"><a href="#"><i class="icon-calendar"></i><span class="menu-title" data-i18n="nav.dash.main">Agenda</span></a></li>
            <li class=" nav-item"><a href="#"><i class="icon-graduation"></i><span class="menu-title" data-i18n="nav.dash.main">Mes formations</span></a>
            <ul class="menu-content">
              <li><a class="menu-item" href="create-formation.php" data-i18n="nav.dash.fitness">Ajouter ou éditer</a>
              </li>
              <li><a class="menu-item" href="mes-outils.php" data-i18n="nav.dash.project">Outils pédagogiques</a>
              </li>
              
            </ul>
            </li>
            <li class=" nav-item"><a href="mes-outils-scratch.php"><i class="icon-notebook"></i><span class="menu-title" data-i18n="nav.dash.main">Bibliothèque</span></a>
            </li>
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