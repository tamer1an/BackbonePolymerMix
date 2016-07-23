"use strict";

angular
    .module( "Interactive" )
    .service( "CamerasPreviewsSubscription", [ "Subscription", "AlarmsVideoProvider", "VideoPreview", "Binder", "$q", function( Subscription, AlarmsVideoProvider, videoPreview, binder, $q ){
        var previews = [],
            subscriptions = [],
            eventPromises = [];

        var notify = function( cameraId ){
            angular.forEach( subscriptions[cameraId], function( subscription ){
                var list = [];
                angular.forEach( previews, function( preview ){
                    if( angular.isDefined( preview[cameraId] ) ){
                        list.push( preview[cameraId] );
                    }
                });

                subscription( list );
            });
        };

        var getEventPromise = function( eventId ){
            if( angular.isUndefined( eventPromises[eventId] ) ){
                eventPromises[eventId] = $q.defer();
            }

            return eventPromises[eventId];
        };

        Subscription.subscribe( "alarms" ).then( null, null, function( alarms ){
            var changedByCamera = [],
                promises = [];

            angular.forEach( alarms.content, function( alarm ){
                if( !! alarm.has_video && angular.isUndefined( previews[alarm.evt_id] ) ){
                    var promise = AlarmsVideoProvider.getPreviews( alarm );
                    promises.push( promise );

                    promise.then( function( videoPreviews ){
                        previews[alarm.evt_id] = [];

                        angular.forEach( videoPreviews, function( preview ){
                            previews[alarm.evt_id][preview.camera_id] = videoPreview(
                                alarm.location,
                                preview.preview_path,
                                alarm.datetime,
                                binder(
                                    binder(
                                        AlarmsVideoProvider,
                                        alarm,
                                        [ "getVideo", "getFrames" ]),
                                    preview.camera_id ) );

                            changedByCamera[preview.camera_id] = true;

                            getEventPromise(alarm.evt_id).resolve(
                                window._.filter( window._.flatten( previews[alarm.evt_id] ) )
                            );
                        });
                    });
                }
            });

            $q.all( promises ).then( function(){
                if( changedByCamera.length ){
                    angular.forEach( changedByCamera, function( isChanged, cameraId ){
                        notify( cameraId );
                    });
                }
            });
        });

        angular.extend( this, {
            subscribeByEventId: function( eventId ){
                return getEventPromise( eventId ).promise;
            },

            subscribeByCameraId: function( cameraId, callback ){
                if( angular.isUndefined( subscriptions[cameraId] ) ){
                    subscriptions[cameraId] = [];
                }

                subscriptions[cameraId].push( callback );
                notify( cameraId );
            }
        });
    }]);