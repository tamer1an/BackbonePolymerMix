'use strict';

angular.module("Interactive")
    .service( "PrettifyAlarm", [ '$q', '$translate', function( $q, $translate ){

        var title = function( type ){
            switch(type){
                case "PANIC"           : return $translate("Panic Alarm");
                case "EMERGENCY"       : return $translate("Emergency");
                case "ALARM_IN_MEMORY" : return $translate("Alarm");
                case "FIRE"            : return $translate("Fire Alarm");
                case "SMOKE_MEMORY"    : return $translate("Smoke Alarm");
                case "HEAT_MEMORY"     : return $translate("Heat Alarm");
                case "TAMPER_MEMORY"   : return $translate("Tamper Alarm");

                default                : return $translate("Alarm");
            }
        };

        var icon = function( type ){
            switch( type ){
                case "PANIC"           : return "ic_alarm";
                case "EMERGENCY"       : return "ic_emergency";
                case "ALARM_IN_MEMORY" : return "ic_alarm";
                case "FIRE"            : return "ic_fire";
                case "SMOKE_MEMORY"    : return "ic_alarm";
                case "HEAT_MEMORY"     : return "ic_alarm_heat";
                case "TAMPER_MEMORY"   : return "ic_tamper";

                default                : return "ic_alarm";
            }
        };

        return function( alarm ){
            var deferred = $q.defer();

            title(alarm.alarm_type).then(function( title ){
                deferred.resolve({
                    title: title,
                    icon: icon(alarm.alarm_type)
                });
            }, function( reason ){
                deferred.resolve({
                    title: alarm.alarm_type,
                    icon: icon(alarm.alarm_type)
                });
            });

            return deferred.promise;
        };
    }]);