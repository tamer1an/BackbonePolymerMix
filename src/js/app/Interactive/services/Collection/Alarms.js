"use strict";

angular
    .module( "Interactive" )
    .factory( "CollectionAlarms", [ "CollectionMerge", function( Collection ){
        function CollectionAlarms(){
            var self = new Collection();

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line
                equality: function( $e ){
                    return { evt_id: $e.evt_id };
                }
            };

            return self;
        }

        return new CollectionAlarms();
    }]);