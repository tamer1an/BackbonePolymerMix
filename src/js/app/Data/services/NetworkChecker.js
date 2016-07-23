"use strict";

angular
    .module( "Data" )
    .service( "NetworkChecker", [ "poller", "Transport", "Dispatcher", function( poller, Transport, Dispatcher ){
        var online = true;

        this.offline = function(){
            if( ! online ){
                return;
            }
            online = false;

            Dispatcher.dispatch("network.offline");

            var pingPoller = poller.get( Transport.resources.dump, { delay: 2000 });

            pingPoller.promise.then(null, null, function(){
                online = true;
                pingPoller.stop();

                Dispatcher.dispatch("network.online");
            });
        };
    }]);