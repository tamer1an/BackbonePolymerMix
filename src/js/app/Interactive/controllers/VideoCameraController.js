'use strict';

angular.module( "Interactive" )
    .controller( "VideoCameraController", [ "$scope", "CamerasPreviewsSubscription", "VideoOnDemandPreviewBuilder", "$controller", function( $scope, CamerasPreviewsSubscription, videoOnDemandPreviewBuilder, $controller ){
        $controller('DialogController', { $scope: $scope });

        $scope.clear = function(){
            $scope.select( null );
            $scope.previews = [];
            $scope.videoOnDemandPreview = null; // video on demand tile
            $scope.isVideoOnDemandInProgress = false; //Is video on demand in progress?
        };

        $scope.$watch( 'camera', function( camera ){
            if( camera === null ){
                $scope.clear();
                return false;
            }

            $scope.isVideoOnDemandInProgress = true;

            CamerasPreviewsSubscription
                .subscribeByCameraId( camera.zone, function( videoPreviews ){
                    $scope.previews = videoPreviews;
                });

            videoOnDemandPreviewBuilder( $scope.camera )
                .receive()
                .then( function( preview ){
                    $scope.videoOnDemandPreview = preview;
                    $scope.select(preview);
                    $scope.isVideoOnDemandInProgress = false;
                })
                .catch( function(){
                    $scope.videoOnDemandPreview = null;
                    $scope.isVideoOnDemandInProgress = false;
                    if ( $scope.previews.length ) {
                        $scope.select($scope.previews[0]);
                    }
                });
        });

        $scope.select = function( preview ){
            $scope.selected = preview;
        };

        $scope.videoOnDemand = function(){
            $scope.isVideoOnDemandInProgress = true;

            videoOnDemandPreviewBuilder( $scope.camera )
                .request()
                .then( function( preview ){
                    $scope.isVideoOnDemandInProgress = false;
                    $scope.videoOnDemandPreview = preview;
                })
                .catch( function(){
                    $scope.isVideoOnDemandInProgress = false;
                });
        };
    }]);