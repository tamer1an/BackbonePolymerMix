'use strict';

angular.module( "Data" )
    .service( "Commands", [ 'Transport', 'Dispatcher', function( _Transport, _Dispatcher ){
        var Transport = _Transport,
            Dispatcher = _Dispatcher;

        return {
            away: function(){
                Transport
                    .away()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "away" );
                    });
            },
            awayInstant: function(){
                Transport
                    .awayInstant()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "away.instant" );
                    });
            },
            awayLatchkey: function(){
                Transport
                    .awayLatchkey()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "away.latchkey" );
                    });
            },
            home: function(){
                Transport
                    .home()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "home" );
                    });
            },
            homeInstant: function(){
                Transport
                    .homeInstant()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "home.instant" );
                    });
            },
            disarm: function(){
                Transport
                    .disarm()
                    .then(function(){
                        Dispatcher.dispatch( "command.state.changing", "disarm" );
                    });
            },
            bypass: function( data ){
                Transport
                    .bypass( data.zone, data.state )
                    .then(function(){
                        Dispatcher.dispatch( "command.bypassing", data );
                    });
            }

        };
    }]);