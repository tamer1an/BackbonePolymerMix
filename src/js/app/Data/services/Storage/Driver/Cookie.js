'use strict';

angular
    .module("Data")

    .factory("StorageDriverCookie", [ '$cookies', function( $cookie ){
        return {
            set: function ( key, value ){
                if ( angular.isObject( value ) ){
                    return $cookie.putObject( key, value );
                }

                return $cookie.put( key, value );
            },

            get: function( key ){
                try {
                    var data = $cookie.getObject(key);
                    if ( angular.isObject( data ) ){
                        return data;
                    }
                }
                catch(e){}

                return $cookie.get( key );
            },

            remove: function(key ){
                return $cookie.remove( key );
            }
        };
    }]);
