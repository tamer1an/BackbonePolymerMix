'use strict';

angular.module('Interactive')
    .controller( 'AuthFormController', [ '$scope', 'Dispatcher', function( $scope, Dispatcher ){
        $scope.$watch( 'authForm.$pristine', function( value, old, context ){
            context.$parent.$parent.form.pristine = value;

            if( ! value ){
                $scope.authForm.webName.$setValidity( 'wrong', true );
                $scope.authForm.code.$setValidity( 'wrong', true );
            }
        });

        Dispatcher.observe( "auth.failed", function( event, data ){
            $scope.authForm.$setPristine();

            switch( data.status ){
                case 445:
                case 444:
                    $scope.authForm.webName.$setValidity( 'wrong', false );
                    $scope.authForm.code.$setValidity( 'wrong', false );
                    break;
            }
        });

        $scope.signIn = function(){
            if( $scope.authForm.$valid ){
                Dispatcher.dispatch( "auth.signIn",
                                    {
                                        webName: $scope.authForm.webName.$viewValue,
                                        code: $scope.authForm.code.$viewValue
                                    });
            }
        };
    }]);
