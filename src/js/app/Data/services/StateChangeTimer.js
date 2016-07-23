"use strict";


angular
    .module( "Data" )
    .service( "StateChangeTimer", [ "$timeout", "Dispatcher", "Cache", function( $timeout, Dispatcher, Cache ){
        this.run = function(){
            var promise = $timeout( function(){
                var cached = Cache.get( "status" );
                if( cached ){
                    Dispatcher.dispatch( "status.updated", cached );
                }
            }, 120 * 1000);

            Dispatcher.once( "status.updated", function(){
                $timeout.cancel( promise );
            });
        };
    }]);