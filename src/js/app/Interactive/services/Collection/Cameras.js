"use strict";

angular
    .module( "Interactive" )
    .factory( "CollectionCameras", [ "CollectionMerge", function( Collection ){
        function CollectionCameras(){
            var self = new Collection();

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line
                equality: function( $e ){
                    return { zone: $e.zone };
                }
            };

            return self;
        }

        return new CollectionCameras();
    }]);