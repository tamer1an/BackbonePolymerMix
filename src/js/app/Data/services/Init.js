'use strict';

angular.module( "Data" )
    .factory( "Init", [ 'Dispatcher', 'Data', 'Commands', 'Restangular', 'accessTokenHeaderName', "Pollers", "StateChangeTimer", "NetworkChecker", function( Dispatcher, Data, Commands, Restangular, accessTokenHeaderName, Pollers, StateChangeTimer, NetworkChecker ){
        return function(){

            Dispatcher.observe( "auth.signIn", function( event, data ){
                Data.signIn( data.webName, data.code );
            });

            Dispatcher.observe( "auth.signOut", function(){
                Data.signOut();
            });

            Dispatcher.observe( "auth.signedOut", Pollers.stop );

            Dispatcher.observe( "auth.expired", Pollers.stop );

            Dispatcher.observe( "auth.signedIn", function(){
                Pollers.run();
                Data.updateZones();
            });

            Dispatcher.observe( "auth.expired", function(){
                Pollers.stop();
            });

            Dispatcher.observe("network.offline", function(){
                Pollers.stop();
            });

            Dispatcher.observe("network.online", function(){
                Pollers.run();
            });

            Dispatcher.observe( "command.token.store", function( event, token ){
                var headers = {};
                headers[accessTokenHeaderName] = token;

                Restangular.setDefaultHeaders( headers );
            });

            Dispatcher.observe( "command.token.clear", function(){
                Restangular.setDefaultHeaders( {} );
            });

            Dispatcher.observe( "command.state.change", function( event, state ){
                switch( state ){
                    case 'away':
                        Commands.away();
                        break;
                    case 'away.latchkey':
                        Commands.awayLatchkey();
                        break;
                    case 'away.instant':
                        Commands.awayInstant();
                        break;
                    case 'home':
                        Commands.home();
                        break;
                    case 'home.instant':
                        Commands.homeInstant();
                        break;
                    case 'disarm':
                        Commands.disarm();
                        break;
                    default:
                        Dispatcher.dispatch( "error.state.unknown", state );
                        return;
                }
            });

            Dispatcher.observe( "command.bypass", function( events, data ){
                Commands.bypass( data );
            });

            Dispatcher.observe( "command.bypass", function(){
                Pollers.poller( 'devices' ).changeInterval( 5000 );
            });

            Dispatcher.observe( 'devices.updated', function(){
                Pollers.poller( 'devices' ).changeInterval( 30000 );
            });


            Dispatcher.observe( "command.state.changing", function(){
                Pollers.poller( 'status' ).changeInterval( 5000 );
                StateChangeTimer.run();
            });

            Dispatcher.observe( 'status.updated', function( event, data ){
                if( data.content.state.indexOf( "Delay" ) === -1  ){
                    Pollers.poller( 'status' ).changeInterval( 30000 );
                }
            });

            Restangular.setErrorInterceptor( function( response ){
                switch( response.status ){
                    case 0:
                        NetworkChecker.offline();
                        return;

                    case 440:
                    case 441:
                        Dispatcher.dispatch( "command.token.clear" );
                        Dispatcher.dispatch( "auth.expired" );

                        return false;

                    case 400:
                        Dispatcher.dispatch( "command.badRequest", response.data );
                        return false;
                }
            });
        };
    }]);
