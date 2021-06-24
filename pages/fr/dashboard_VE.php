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



 <?php
         if(!isset($_COOKIE["userRole"]))
         {
            echo '<script>location.href="login.php"</script>';
         }
         else
         {
            include '../../../bibliotheque/modules/dashboard/'.$_COOKIE["userRole"].'/css.php';
         }       
    ?>





</head>

<body class="content-detached-right-sidebar   menu-expanded fixed-navbar" data-open="click" data-menu="vertical-compact-menu" data-col="content-detached-right-sidebar">

 <!-- navbar -->
 <?php include "../../../bibliotheque/components/navbar/navbar_dashboard.php" ?>
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
            include '../../../bibliotheque/components/vertical-menu/'.$_COOKIE["userRole"].'/vertical-menu_dashboard.php';
         }       
    ?>


 <!-- end vertical-menu -->

 <?php
         if(!isset($_COOKIE["userRole"]))
         {
            echo '<script>location.href="login.php"</script>';
         }
         else
         {
            include '../../../bibliotheque/modules/dashboard/'.$_COOKIE["userRole"].'/main.php';
         }       
    ?>





 <!-- ////////////////////////////////////////////////////////////////////////////-->


 <!-- FIREBASE -->
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-app.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-auth.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-firestore.js"></script>
 <script src="https://www.gstatic.com/firebasejs/8.2.10/firebase-storage.js"></script>



 <?php
         if(!isset($_COOKIE["userRole"]))
         {
            echo '<script>location.href="login.php"</script>';
         }
         else
         {
            include '../../../bibliotheque/modules/dashboard/'.$_COOKIE["userRole"].'/scripts.php';
         }       
    ?>
 <script>console.log('test')</script>


 <script src="dashboard_VE.js"></script>


 <!-- END PAGE LEVEL JS-->
</body>

</html>