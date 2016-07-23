"use strict";

angular
    .module( "Data" )
    .service( "Pollers", [ "Poller", "Transport", "Dispatcher", function( poller, Transport, Dispatcher ){
        var $config = {
            alarms:  poller( Transport.resources.getAlarms ),
            alerts:  poller( Transport.resources.getAlerts ),
            status:  poller( Transport.resources.getStatus ),
            cameras: poller( Transport.resources.getCameras ),
            devices: poller( Transport.resources.getDevices ),
            events:  poller( Transport.resources.getEvents )
        };

        angular.forEach( $config, function( item, key ){
            item.promise().then( null, null, function( data ){
                Dispatcher.dispatch( key + ".updated", data );
            });
        } );

        this.run = function(){
            angular.forEach( $config, function( item ){
                item.run();
            });
        };

        this.stop = function(){
            angular.forEach( $config, function( item ){
                item.stop();
            });
        };

        this.poller = function( name ){
            return $config[name] || false;
        };
    }]);