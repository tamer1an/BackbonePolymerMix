'use strict';

angular.module('Interactive')
    .filter( 'iconFilter', function(){

        var map = {
            "all"                    : "menu/ic_all",

            //"alarms/alarm_in_memory" : "alarms/ic_alarm",
            //"alarms/heat_memory"     : "alarms/ic_alarm",
            //"alarms/smoke_memory"    : "alarms/ic_alarm",
            //"alarms/tamper_memory"   : "alarms/ic_alarm",

            "alerts/tamper"          : "alerts/ic_general",

            "alerts/no_active"       : "alerts/ic_inactive",
            "alerts/freezing_alert"  : "alerts/ic_freezer_alert",

            "alerts/heat_trouble"    : "alerts/ic_heat",
            "alerts/hot_alert"       : "alerts/ic_heat",
            "alerts/heat_open"       : "alerts/ic_heat",
            "alerts/heat_memory"     : "alerts/ic_heat",
            "alerts/fire"            : "alerts/ic_fire",
            "alerts/panic"           : "alerts/ic_panic",
            "alerts/emergency"       : "alerts/ic_emergency",
            "alerts/alarm_in_memory" : "alerts/ic_alarm",
            "alerts/tamper_memory"   : "alerts/ic_tamper",

            "alerts/smoke_memory"          : "alerts/ic_general",
            "alerts/network_trouble"       : "alerts/ic_general",
            "alerts/rssi_low"              : "alerts/ic_general",
            "alerts/smoke_trouble"         : "alerts/ic_general",
            "alerts/reported_1_way"        : "alerts/ic_general",
            "alerts/trouble"               : "alerts/ic_general",
            "alerts/opened"                : "alerts/ic_general",
            "alerts/smoke_open"            : "alerts/ic_general",
            "alerts/line_failure"          : "alerts/ic_general",
            "alerts/sim_not_verified"      : "alerts/ic_general",
            "alerts/clean_me"              : "alerts/ic_general",
            "alerts/bypass"                : "alerts/ic_general",
            "alerts/comm_failure"          : "alerts/ic_general",
            "alerts/fuse"                  : "alerts/ic_general",
            "alerts/soak_failed"           : "alerts/ic_general",
            "alerts/went_offline"          : "alerts/ic_general",
            "alerts/rssi_poor_or_less_now" : "alerts/ic_general",
            "alerts/rssi_poor_or_less_24h" : "alerts/ic_general",
            "alerts/masking_trouble"       : "alerts/ic_general",
            "alerts/mark_for_service"      : "alerts/ic_general"
        };

        /**
         * @param type string
         *
         * @return string
         */
        return function( name, type ){
            if( angular.isUndefined( name ) ){
                return '';
            }

            name = name.toLowerCase();

            if( map.hasOwnProperty( type + "/" + name ) ){
                return "img/icons/svg/" + map[type + "/" + name] + ".svg";
            }

            if( map.hasOwnProperty( name ) ){
                return "img/icons/svg/" + map[name] + ".svg";
            }

            return "img/icons/svg/" + type + "/ic_" + name + ".svg";
        };
    });
