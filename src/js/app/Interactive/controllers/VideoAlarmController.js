'use strict';

angular.module( "Interactive" )
    .controller( "VideoAlarmController", [ '$scope', 'CamerasPreviewsSubscription', '$controller', function( $scope, CamerasPreviewsSubscription, $controller ){
        $controller('DialogController', { $scope: $scope });

        $scope.clear = function(){
            $scope.selected = null;
            $scope.previews = [];
        };

        $scope.$watch( 'alarm', function( alarm ){
            if( alarm === null ){
                $scope.clear();
                return false;
            }

            CamerasPreviewsSubscription
                .subscribeByEventId( alarm.evt_id )
                .then( function( videoPreviews ){
                    $scope.previews = videoPreviews;
                    if( $scope.previews.length ){
                        $scope.select( $scope.previews[0] );
                    } else {
                        $scope.select( null );
                    }
                });
        });

        $scope.select = function( preview ){
            $scope.selected = preview;
        };
    }]);
