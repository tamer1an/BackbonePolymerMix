'use strict';

angular.module("Interactive")
    .service( "Binder", [function(){
        return function( source, variable, methods ){
            var target = {};

            angular.forEach( source, function( method, name ){
                if( !angular.isArray(methods) || methods.indexOf(name) > -1 ){
                    target[name] = window._.partial( method, variable );
                }
            });

            return target;
        };
    }]);