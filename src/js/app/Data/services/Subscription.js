"use strict";

angular.module( "Data" )
    .service( "Subscription", [ 'Cache', 'Dispatcher', '$q', function( Cache, Dispatcher, $q ){
        return {
            subscribe: function( type ){
                var deferred = $q.defer();

                Dispatcher.observe( type + ".updated", function( event, data ){
                    deferred.notify( data );
                });

                $q.when( Cache.get( type ) ).then( function( data ){
                    if( data !== false ){
                        deferred.notify( data );
                    }
                });

                return deferred.promise;
            }
        };
    }]);