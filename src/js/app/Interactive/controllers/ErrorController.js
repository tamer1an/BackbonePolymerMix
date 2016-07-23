"use strict";

angular
    .module( "Interactive" )
    .controller( "ErrorController", [ "$scope", "$mdToast", function( $scope, $mdToast ){
        $scope.close = $mdToast.hide;
    }]);