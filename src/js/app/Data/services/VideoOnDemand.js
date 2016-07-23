'use strict';

angular
    .module( "Data")
    .service( "VideoOnDemand", [ "Data", "poller", "Transport", "$q", function( Data, poller, Transport, $q ) {
        var buildProvider = function( cameraId ){
            return {
                getVideo: function( videoFormat ){
                    var deferred = $q.defer();
                    Data.getOnDemandVideo( cameraId, videoFormat, function( data ){
                        deferred.resolve( data.content );
                    } );

                    return deferred.promise;
                },
                getFrames: function(){
                    var deferred = $q.defer();
                    Data.getOnDemandFrames( cameraId, function( data ){
                        deferred.resolve( data.content );
                    });

                    return deferred.promise;
                }
            };
        };

        return function( cameraId ){
            return {
                receive: function(){
                    var deferred = $q.defer();

                    if ( cameraId === null ){
                        deferred.reject( "camera id is null" );
                        return deferred.promise;
                    }

                    Data.isVideoPresent( cameraId, function( response ){
                        if( response.content === true ){
                            deferred.resolve( buildProvider( cameraId ) );
                        }
                        else{
                            deferred.reject( "video is not present" );
                        }
                    });

                    return deferred.promise;
                },

                request: function(){
                    var deferred = $q.defer();

                    if ( cameraId === null ){
                        deferred.reject( "camera id is null" );
                        return deferred.promise;
                    }

                    Data.makeVideo( cameraId, function(){
                        var _poller = poller.get( Transport.resources.isVideoPresent, {
                            delay: 1000,
                            argumentsArray:[{
                                camera_id: window.parseInt( cameraId )
                            }]
                        });

                        _poller.promise.then( null, null, function( data ){
                            if( data.content === true ){
                                _poller.stop();
                                deferred.resolve( buildProvider( cameraId ) );
                            }
                        });
                    });

                    return deferred.promise;
                }
            };


        };
    }]);