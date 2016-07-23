"use strict";

angular
    .module( "Interactive" )
    .factory( "CollectionAlerts", [ "CollectionMerge", function( Collection ){
        function CollectionAlerts(){
            var self = new Collection();

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line
                equality: function( $e ){
                    return { zone: $e.zone, alert_type: $e.alert_type };
                }
            };

            return self;
        }

        return new CollectionAlerts();
    }]);
