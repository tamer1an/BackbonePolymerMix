'use strict';

angular.module( "Data" )
    .service( "Cache", ['Dispatcher', function( Dispatcher ){
        var storage = {};

        Dispatcher.observe( '*.updated', function( event, data ){
           storage[event.split('.')[0]] = data;
        });

        return {
            get: function( key ){
                if( angular.isDefined( storage[key] ) ){
                    return storage[key];
                }

                return false;
            }
        };
    }]);