"use strict";

angular
    .module( "Data" )
    .factory( "Poller", [ "poller", "$q", "md5", function( poller, $q, md5 ){
        return function( _resource, delay ){
            var resource = _resource,
                deferred = $q.defer(),
                instance = null,
                checkSum = null;

            delay = delay || 30000;

            return {
                run: function(){
                    instance = poller.get( resource, {
                        delay: delay,
                        smart: true
                    });

                    instance
                        .promise
                        .then( null, null, function( data ){
                            var _checkSum = md5.createHash( window.JSON.stringify( data ) );
                            if( _checkSum !== checkSum ){
                                checkSum = _checkSum;
                                deferred.notify( data );
                            }
                        });
                },

                promise: function(){
                    return deferred.promise;
                },

                stop: function(){
                    if( instance !== null ){
                        instance.stop();
                        instance = null;
                    }

                    return this;
                },

                changeInterval: function( interval ){
                    if( delay !== interval ){
                        delay = interval;
                        this.restart();
                    }

                    return this;
                },

                restart: function(){
                    if( instance !== null ){
                        this.stop();
                        this.run();
                    }
                }
            };
        };
    }]);
