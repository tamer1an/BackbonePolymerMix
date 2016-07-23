'use strict';

angular.module("Interactive")
    .service( "ComparatorDevice", function(){
        function ComparatorDevice(){}

        angular.extend( ComparatorDevice.prototype, {
            compare: function( item ){
                var names = [];

                if( item.bypass_availability && item.bypass ){
                    names.push( "Bypassed" );
                }

                if( item.troubles !== null ){
                    names.push( "Requires attention" );
                }

                return names;
            }
        });

        return ComparatorDevice;
    });