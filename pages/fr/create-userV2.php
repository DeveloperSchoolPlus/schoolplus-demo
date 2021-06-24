<!DOCTYPE html>
<html class="loading" lang="en" data-textdirection="ltr">

<head>
 <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
 <meta http-equiv="X-UA-Compatible" content="IE=edge">
 <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
 <meta name="description" content="La plateforme qui simplifie et optimise le soutien scolaire.">
 <meta name="keywords" content="education, support, suivi scolaire, soutien scolaire, plateforme scolaire">
 <meta name="author" content="School+ Demo">
 <title id="pageTitle">School+ Demo</title>
 <link rel="apple-touch-icon" href="../../assets/images/logo/logo-brand.png">
 <link rel="shortcut icon" type="image/x-icon" href="../../assets/images/logo/logo-brand.png">
 <?php include '../../../bibliotheque/modules/users/create-user/css.php' ?>

</head>

<body class="vertical-layout vertical-compact-menu content-detached-right-sidebar   menu-expanded fixed-navbar" data-open="click" data-menu="vertical-compact-menu" data-col="content-detached-right-sidebar">

 <!-- navbar -->
 <?php include "../../../bibliotheque/components/navbar/navbar.php" ?>
 <!-- end navbar -->

 <!-- ////////////////////////////////////////////////////////////////////////////-->

 <!-- vertical-menu -->
 <!--The following one is for teacher. We need to come up with an idea to change the include regarding the userCategory -->
 <div id="menuInclude"></div>

 <?php
         if(!isset($_COOKIE["userRole"]))
         {
            echo '<script>location.href="login.php"</script>';
         }
         else
         {
            include '../../../bibliotheque/components/vertical-menu/'.$_COOKIE["userRole"].'/vertical-menu.php';
         }       
    ?>
 <!-- end vertical-menu -->
 <?php include '../../../bibliotheque/modules/users/create-user/main.php' ?>


 <!-- ////////////////////////////////////////////////////////////////////////////-->


 <!--  <footer class="footer footer-static footer-dark navbar-border navbar-shadow">
            <p class="clearfix blue-grey lighten-2 text-sm-center mb-0 px-2"><span class="float-md-left d-block d-md-inline-block">Copyright &copy; 2018 <a class="text-bold-800 grey darken-2" href="https://themeforest.net/user/pixinvent/portfolio?ref=pixinvent" target="_blank">PIXINVENT </a>, All rights reserved. </span><span class="float-md-right d-block d-md-inline-blockd-none d-lg-block">Hand-crafted & Made with <i class="ft-heart pink"></i></span></p>
        </footer> -->

 <!-- FIREBASE -->
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-auth.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-firestore.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-storage.js"></script>

 <?php include '../../../bibliotheque/modules/users/create-user/scripts.php' ?>
 <script src="create-userV2.js"></script>


 <!-- END PAGE LEVEL JS-->
</body>

</html>