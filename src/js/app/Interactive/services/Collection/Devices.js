"use strict";

angular
    .module( "Interactive" )
    .factory( "CollectionDevices", [ "CollectionMerge", function( Collection ){
        function CollectionDevices(){
            var self = new Collection();

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line
                equality: function( $e ){
                    return {
                        zone: $e.zone,
                        type: $e.type,
                        subtype: $e.subtype
                    };
                }
            };

            return self;
        }

        return new CollectionDevices();
    }]);