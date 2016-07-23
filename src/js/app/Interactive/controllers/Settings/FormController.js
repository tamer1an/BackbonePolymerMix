"use strict";

angular
    .module( "Interactive" )
    .controller( "SettingsFormController", [ "$scope", "Data", "$translate", "Storage", "$q", "defaultIdleTimer", function( $scope, data, translate, storage, $q, defaultIdleTimer ){
        $scope.language = null;
        $scope.languages = [];

        $scope.idleTimer = window.parseInt( storage.get( "idleTimer", defaultIdleTimer ) );

        $q.all( [ data.getAvailableLanguages(),
                  $q.when( storage.get( "idleTimer", defaultIdleTimer ) ) ] )
            .then(function( resolved ){
                $scope.languages = resolved[0].plain();
                $scope.language = window._.find( $scope.languages, { code: storage.get( 'language', translate.preferredLanguage() ) } );

                if( resolved[1] ){
                    $scope.idleTimer = window.parseInt( resolved[1] );
                }

                $scope.$watch( "language", function( language, oldLanguage ){
                    if( language !== oldLanguage ){
                        translate.use( language.code );
                        storage.set( "language", language.code );
                        $scope.$emit( "language.saved" );
                    }
                });

                $scope.$watch( "idleTimer", function( idleTimer, oldTimer ){
                    if( idleTimer !== oldTimer ){
                        if( $scope.settingsForm.$valid ){
                            storage.set( "idleTimer", idleTimer );
                            $scope.$emit( "timer.saved" );
                        }
                    }
                });
            });
    }]);
