// angular.module("textAngularTest", ['textAngular']);

// function wysiwygeditor($scope) {
// 	console.log($scope);
// 	$scope.orightml = 'Hello';
// 	$scope.htmlcontent = $scope.orightml;
// 	$scope.disabled = false;

// };


// function displayEditor() {

// 	var number = Math.random();

// 	// document.getElementById("test").innerHTML += '<div ng-app="textAngularTest' + number + '" ng-controller="myController' + number + '" class="container app" id="mainContainer' + number + '"><h3>TextBox2</h3><div text-angular="text-angular"  id="htmlcontent" name="htmlcontent" ng-model="htmlcontent" ta-disabled="disabled"></div><h3>HTML BRUT 2</h3><textarea ng-model="htmlcontent" style="width: 100%"></textarea>';
// 	document.getElementById("test").innerHTML += '<div ng-app="textAngularTest" ng-controller="wysiwygeditor" class="container app" id="main"><h3>TextBox2</h3><div text-angular="text-angular"  id="htmlcontent" name="htmlcontent" ng-model="htmlcontent" ta-disabled="disabled"></div><h3>HTML BRUT 2</h3><textarea ng-model="htmlcontent" style="width: 100%"></textarea>';

// 	/* angular.module('textAngularTest', ['textAngular'])
// 		.controller('wysiwyg', function ($scope) {
// 			console.log($scope);

// 			$scope.orightml = 'Hey';
// 			$scope.htmlcontent = $scope.orightml;
// 		}); */

// 	angular.module('textAngularTest', ['textAngular'])
// 		.controller('myController', function ($scope) {
// 			console.log($scope);

// 			$scope.orightml = 'Hey';
// 			$scope.htmlcontent = $scope.orightml;
// 		});
	
// 	angular.bootstrap(document.getElementById('main'), ['textAngularTest']);

// }
