"use strict";

angular
    .module( "Interactive" )
    .service( "VideoOnDemandPreviewBuilder", [ "VideoPreview", "VideoOnDemand", "$q", function( videoPreview, videoOnDemand, $q ){
        return function( camera ){
            return {
                receive: function(){
                    var deferred = $q.defer();

                    videoOnDemand( camera.zone )
                        .receive()
                        .then( function( provider ){
                            deferred.resolve(
                                videoPreview(
                                    camera.location,
                                    camera.preview_path,
                                    "video on demand",
                                    provider
                                )
                            );
                        })
                        .catch(function(){
                            deferred.reject( arguments );
                        });

                    return deferred.promise;
                },
                request: function(){
                    var deferred = $q.defer();

                    videoOnDemand( camera.zone )
                        .request()
                        .then( function( provider ){
                            deferred.resolve(
                                videoPreview(
                                    camera.location,
                                    camera.preview_path,
                                    "video on demand",
                                    provider
                                )
                            );
                        })
                        .catch(function(){
                            deferred.reject( arguments );
                        });

                    return deferred.promise;
                }
            };


        };
    }]);
