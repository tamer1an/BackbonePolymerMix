'use strict';

angular.module('Interactive')
    .controller('CameraController', [ "$scope", 'CamerasPreviewsSubscription', '$mdDialog', function( $scope, CamerasPreviewsSubscription, $mdDialog ){
        $scope.previews = [];
        $scope.preview = null;

        $scope.$watch( 'camera', function( camera ){
            if( camera === null ){
                $scope.clear();
                return false;
            }

            CamerasPreviewsSubscription
                .subscribeByCameraId( camera.zone, function( previews ){
                    $scope.previews = previews || [];
                });
        });

        $scope.$watch( "previews", function( previews ){
            $scope.videosCount = previews.length;

            if( $scope.camera.preview_path ){
                $scope.videosCount++;
            }

            var lastPreview = window._.reduce( previews, function( currentValue, item ){
                var time = (new Date(item.time)).getTime();

                if( item.preview && ( currentValue.time < time || ! currentValue.preview ) ){
                    return {
                        time: time,
                        preview: item.preview
                    };
                }

                return currentValue;
            }, {
                time: (new Date($scope.camera.timestamp)).getTime(),
                preview: $scope.camera.preview_path
            } );

            $scope.preview = lastPreview.preview;
            $scope.previewTime = new Date(lastPreview.time);
        } );

        $scope.showAdvanced = function (event) {
            $mdDialog
                .show({
                    controller: 'VideoCameraController',
                    templateUrl: 'html/directives/video/camera.html',
                    scope: angular.extend($scope.$new(), { camera: $scope.camera }),
                    disableParentScroll: false,
                    targetEvent: event
                });
        };
    }]);