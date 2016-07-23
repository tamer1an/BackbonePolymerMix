'use strict';

angular.module("Interactive")
    .service( "PrettifyAlert", [ '$q', '$translate', function( $q, $translate ){

        var title = function( type ){
            switch(type){
                case "AC_FAILURE"            : return $translate("AC Failure");
                case "ALARM_IN_MEMORY"       : return $translate("Alarm in Memory");
                case "BYPASS"                : return $translate("Bypassed");
                case "CLEAN_ME"              : return $translate("Clean me");
                case "COLD_ALERT"            : return $translate("Cold");
                case "COMM_FAILURE"          : return $translate("Communication Failure");
                case "EMERGENCY"             : return $translate("Emergency");
                case "FIRE"                  : return $translate("Fire");
                case "FREEZER_ALERT"         : return $translate("Freezer");
                case "FREEZING_ALERT"        : return $translate("Freezing");
                case "FUSE"                  : return $translate("Fuse");
                case "HEAT_MEMORY"           : return $translate("Heat Memory");
                case "HEAT_OPEN"             : return $translate("Opened");
                case "HEAT_TROUBLE"          : return $translate("Trouble");
                case "HOT_ALERT"             : return $translate("Hot");
                case "INACTIVE"              : return $translate("Inactive");
                case "JAMMED"                : return $translate("Jammed");
                case "LINE_FAILURE"          : return $translate("Line Failure");
                case "LOW_BATTERY"           : return $translate("Low Battery");
                case "MARK_FOR_SERVICE"      : return $translate("Marked for Service");
                case "MASKING_TROUBLE"       : return $translate("Masking Trouble");
                case "NETWORK_TROUBLE"       : return $translate("Network Trouble");
                case "NO_ACTIVE"             : return $translate("No Activity");
                case "OPENED"                : return $translate("Opened");
                case "PANIC"                 : return $translate("Panic");
                case "REPORTED_1_WAY"        : return $translate("1-way");
                case "RSSI_LOW"              : return $translate("Low signal(RSSI)");
                case "RSSI_POOR_OR_LESS_24H" : return $translate("Poor signal for 24h.(RSSI)");
                case "RSSI_POOR_OR_LESS_NOW" : return $translate("Poor signal(RSSI)");
                case "SIM_NOT_VERIFIED"      : return $translate("SIM Not Verified");
                case "SMOKE_MEMORY"          : return $translate("Smoke in Memory");
                case "SMOKE_OPEN"            : return $translate("Opened");
                case "SMOKE_TROUBLE"         : return $translate("Trouble");
                case "SOAK_FAILED"           : return $translate("Soak Failed");
                case "TAMPER"                : return $translate("Tamper");
                case "TAMPER_MEMORY"         : return $translate("Tamper Memory");
                case "TROUBLE"               : return $translate("Trouble");
                case "WENT_OFFLINE"          : return $translate("Offline");
                case "WORKING_1_WAY"         : return $translate("Working 1-way");

                default                      : return $translate("Alert");
            }
        };

        var icon = function( type ){
            switch( type ){
                case "AC_FAILURE"            : return "ic_ac_failure";
                case "ALARM_IN_MEMORY"       : return "ic_alarm";
                case "BYPASS"                : return "ic_bypass";
                case "CLEAN_ME"              : return "ic_default";
                case "COLD_ALERT"            : return "ic_cold_alert";
                case "COMM_FAILURE"          : return "ic_default";
                case "EMERGENCY"             : return "ic_emergency";
                case "FIRE"                  : return "ic_fire";
                case "FREEZER_ALERT"         : return "ic_freezer_alert";
                case "FREEZING_ALERT"        : return "ic_freezer_alert";
                case "FUSE"                  : return "ic_default";
                case "HEAT_MEMORY"           : return "ic_heat";
                case "HEAT_OPEN"             : return "ic_tamper";
                case "HEAT_TROUBLE"          : return "ic_default";
                case "HOT_ALERT"             : return "ic_heat";
                case "INACTIVE"              : return "ic_inactive";
                case "JAMMED"                : return "ic_jammed";
                case "LINE_FAILURE"          : return "ic_went_offline";
                case "LOW_BATTERY"           : return "ic_low_battery";
                case "MARK_FOR_SERVICE"      : return "ic_default";
                case "MASKING_TROUBLE"       : return "ic_default";
                case "NETWORK_TROUBLE"       : return "ic_default";
                case "NO_ACTIVE"             : return "ic_inactive";
                case "OPENED"                : return "ic_tamper";
                case "PANIC"                 : return "ic_panic";
                case "REPORTED_1_WAY"        : return "ic_default";
                case "RSSI_LOW"              : return "ic_default";
                case "RSSI_POOR_OR_LESS_24H" : return "ic_default";
                case "RSSI_POOR_OR_LESS_NOW" : return "ic_default";
                case "SIM_NOT_VERIFIED"      : return "ic_default";
                case "SMOKE_MEMORY"          : return "ic_default";
                case "SMOKE_OPEN"            : return "ic_tamper";
                case "SMOKE_TROUBLE"         : return "ic_default";
                case "SOAK_FAILED"           : return "ic_default";
                case "TAMPER"                : return "ic_tamper";
                case "TAMPER_MEMORY"         : return "ic_tamper";
                case "TROUBLE"               : return "ic_default";
                case "WENT_OFFLINE"          : return "ic_went_offline";
                case "WORKING_1_WAY"         : return "ic_default";

                default                      : return "ic_default";
            }
        };

        return function( alert ){
            var deferred = $q.defer();

            title(alert.alert_type).then(function( title ){
                deferred.resolve({
                    title: title,
                    icon: icon(alert.alert_type)
                });
            }, function(){
                deferred.resolve({
                    title: alert.alert_type,
                    icon: icon(alert.alert_type)
                });
            });

            return deferred.promise;
        };
    }]);