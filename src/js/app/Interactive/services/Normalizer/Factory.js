'use strict';

angular.module("Interactive")
       .factory( "NormalizerFactory", [ 'NormalizerComposite', 'NormalizerConcreteDate', 'NormalizerConcreteZone', function( Composite, Date, Zone ){
            return {
                simple: function(){
                    var composite = new Composite();
                    composite.addNormalizer( new Date( ['datetime'] ) );
                    composite.addNormalizer( new Zone() );

                    return composite;
                },

                dateTime: function(){
                    return new Composite( new Date( ['datetime'] ) );
                }
            };
       }]);