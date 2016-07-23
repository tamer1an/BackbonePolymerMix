'use strict';

angular.module( "Data" )
       .service( "Data", [ 'Transport', 'poller', 'Dispatcher', '$translate', function( transport, poller, dispatcher, $translate ){

            var Transport = transport,
                Dispatcher = dispatcher;

            return {
                signIn: function( panelName, code ){
                    Transport
                        .signIn( panelName, code )
                        .then(
                            function( data ){
                                Dispatcher.dispatch( 'command.token.store', data.content );
                                Dispatcher.dispatch( 'auth.signedIn' ); //some comment
                            },
                            function( response ){
                                var promise = null;

                                switch( response.status ){
                                    case 442:
                                        promise = $translate("Login attempts limit reached");
                                        break;

                                    case 443:
                                        promise = $translate("Max logged in devices limit reached");
                                        break;

                                    case 444:
                                    case 445:
                                        promise = $translate("Wrong credentials");
                                        break;

                                    case 446:
                                        promise = $translate("Discovery in progress");
                                        break;

                                    case 447:
                                        promise = $translate("Max sessions limit reached");
                                        break;

                                    default:
                                        promise = $translate("Unknown error");
                                }

                                promise.then( function( message ){
                                    Dispatcher.dispatch( 'auth.failed',
                                        {
                                            message: message,
                                            status: response.status
                                        });
                                });
                            }
                    );
                },

                signOut: function(){
                    Transport.signOut();

                    Dispatcher.dispatch( 'command.token.clear' );
                    Dispatcher.dispatch( 'auth.signedOut' );
                },

                updateZones: function(){
                    Transport
                        .updateZones()
                        .then( function( data ){
                            Dispatcher.dispatch( 'zones.updated', data.content );
                        });
                },

                getAlarmVideoPreviews: function( eventId, callback ){
                    Transport
                        .getAlarmVideoPreviews( eventId )
                        .then( function( data ){
                            callback( data.content );
                        });
                },

                getAlarmVideo: function( eventId, cameraId, videoFormat, callback ){
                    Transport
                        .getAlarmVideo( eventId, cameraId, videoFormat )
                        .then( function( data ){
                            callback( data.content );
                        });
                },

                getAlarmVideoFrames: function( eventId, cameraId, callback ){
                    Transport
                        .getAlarmVideoFrames( eventId, cameraId )
                        .then( function( data ){
                            callback( data.content );
                        });
                },

                makeVideo: function( cameraId, callback ){
                    Transport
                        .makeVideo( cameraId )
                        .then( function(){
                            callback();
                        });
                },

                isVideoPresent: function( cameraId, callback ){
                    Transport
                        .isVideoPresent( cameraId )
                        .then( function( data ){
                            if( angular.isDefined( data.content ) ){
                                callback( data );
                            }
                        });
                },

                getOnDemandVideo: function( cameraId, videoFormat, callback ){
                    Transport
                        .getOnDemandVideo( cameraId, videoFormat )
                        .then( function( data ){
                            callback( data );
                        });
                },

                getOnDemandFrames: function( cameraId, callback ){
                    Transport
                        .getOnDemandFrames( cameraId )
                        .then( function( data ){
                            callback( data );
                        });
                },

                getAvailableLanguages: function(){
                    return Transport.getAvailableLanguages();
                }
            };
       }]);
