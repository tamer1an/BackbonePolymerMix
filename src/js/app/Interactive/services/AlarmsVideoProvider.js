'use strict';

angular.module("Interactive")
    .service( "AlarmsVideoProvider", [ "Data", "$q", function( Data, $q ){
        angular.extend( this, {
            getPreviews: function( alarm ){
                return $q( function( resolve, reject ){
                    Data.getAlarmVideoPreviews( alarm.evt_id, resolve );
                });
            },

            getVideo: function( alarm, cameraId, videoFormat ){
                return $q( function( resolve, reject ){
                    Data.getAlarmVideo( alarm.evt_id, cameraId, videoFormat, resolve );
                });
            },


            getFrames: function( alarm, cameraId ){
                return $q( function( resolve, reject ){
                    Data.getAlarmVideoFrames( alarm.evt_id, cameraId, resolve );
                });
            }
        });
    }]);