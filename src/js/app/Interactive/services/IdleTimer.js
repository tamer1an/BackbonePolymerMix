"use strict";

angular
    .module("Interactive")
    .service( "IdleTimer", [ "Storage", "$timeout", "Dispatcher", "$mdToast", "defaultIdleTimer", "$translate", function( Storage, $timeout, Dispatcher, $mdToast, defaultIdleTimer, $translate ){
        var promise,
            self = this;

        this.run = function(){
            promise = $timeout( function(){
                Dispatcher.dispatch( "timer.expired" );
            }, Storage.get( "idleTimer", defaultIdleTimer ) * 1000 );

            return this;
        };

        this.stop = function(){
            $timeout.cancel( promise );

            return this;
        };

        this.touch = function(){
            return self.stop().run();
        };


        Dispatcher.observe( "timer.expired", function(){
            Dispatcher.dispatch( "auth.signOut" );

            $translate( "Idle timer expired" )
                .then( function( text ){
                    Dispatcher.dispatch("error.show", { content: text });
                });
        });

        Dispatcher.observe( "timer.changed", self.touch );
        Dispatcher.observe( "timer.refresh", self.touch );
    }]);