'use strict';

angular.module("Interactive")
       .service( "ComparatorSimple", function(){
            function ComparatorSimple(){}

            angular.extend( ComparatorSimple.prototype, {
                compare: function( value ){
                    return value;
                }
            });

            return ComparatorSimple;
       });