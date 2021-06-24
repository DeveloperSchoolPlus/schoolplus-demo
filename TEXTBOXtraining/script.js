	angular.module("textAngularTest", ['textAngular']);
	function wysiwygeditor($scope) {
		$scope.orightml = '<h2>Titre du chapitre</h2><p>Sous-titre</p><p><b>Sommaire :</b></p><ol><li>Chapitre 1</li><li>Chapitre 2 et <b>exercices</b></li><li style="color: green;">Travaux dirigés</li><li>SChapitre 3</li></ol><p><b>Video disponible sur le lien suivant :</b> <a href="https://www.youtube.com/watch?v=oerRPbjFDjY&app=desktop">VIDEO</a> </p>';
		$scope.htmlcontent = $scope.orightml;
		$scope.disabled = false;
	}; 