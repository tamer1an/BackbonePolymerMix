"use strict";

angular
    .module( "Data" )
    .provider( "Storage", [function(){
        var $driver,
            $driverName;

        return {
            setDriver: function( driverName ){
                $driverName = driverName;
            },

            $get: [ '$injector', function(injector){
                switch( $driverName ){
                    case "cookie": // jshint ignore:line
                    default:
                        $driver = injector.get( 'StorageDriverCookie' );
                        break;
                }

                return {
                    set: function( key, value ){
                        return $driver.set( key, value );
                    },

                    get: function( key, $default ){
                        var stored = $driver.get( key );
                        if( stored ){
                            return stored;
                        }

                        if( $default ){
                            return $default;
                        }

                        return false;
                    },

                    remove: function( key ){
                        return $driver.remove( key );
                    }
                };
            }]
        };
    }]);
