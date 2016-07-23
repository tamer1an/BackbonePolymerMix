'use strict';
/* global _:false */

angular.module( "Data" )
       .service( "Zone", ['Subscription', '$q', function( Subscription, $q ){
            var self = this;

            self.data = [];
            self.deferred = $q.defer();

            Subscription
                .subscribe( "zones" )
                .then( null, null, function( data ){
                    self.data = data;
                    self.deferred.notify( data );
                });

            angular.extend( self, {
                getZoneById: function( id ){
                    var deferred = $q.defer(),
                        send = function( data ){
                            var zone = window._.find( data, { zone: id } ) || false;
                            deferred.resolve( zone );
                        };
                

                    if( self.data.length ){
                        send( self.data );
                    }
                    else{
                        self.deferred.promise.then( null, null, send );
                    }

                    return deferred.promise;
                }
            });
    }]);
