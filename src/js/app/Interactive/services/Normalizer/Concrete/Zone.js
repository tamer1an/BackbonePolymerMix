'use strict';

angular.module( "Interactive" )
    .service( "NormalizerConcreteZone", [ "Zone", function( Zone ){
        function NormalizerConcreteZone(){}

        angular.extend( NormalizerConcreteZone.prototype, {
            normalize: function( object ){
                if( object.device_type === "CONTROL_PANEL" ){
                    object.zone_name = "Control Panel";
                    return object;
                }

                Zone.getZoneById( object.zone )
                    .then( function( zone ){
                        if (angular.isObject( zone ) && angular.isDefined( zone.location ) ) {
                            object.zone_name = zone.location;
                        }
                        else{
                            object.zone_name = "Unknown Zone";
                        }
                    });

                return object;
            }
        });

        return NormalizerConcreteZone;
    }]);