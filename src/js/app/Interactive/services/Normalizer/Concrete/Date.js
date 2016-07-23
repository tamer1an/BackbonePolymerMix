'use strict';

angular.module( "Interactive" )
       .service( "NormalizerConcreteDate", function(){
            function NormalizerConcreteDate( fields ){

                if( angular.isDefined( fields ) && angular.isArray( fields ) ){
                    this._fields = fields;
                }
                else{
                    this._fields = [];
                }
            }

            angular.extend( NormalizerConcreteDate.prototype, {
                normalize: function( object ){
                    angular.forEach( this._fields, function( fieldName ){
                        if( angular.isDefined( object[fieldName] ) ){
                            if( ! angular.isDate( object[fieldName] ) ){
                                object[fieldName] = new Date( object[fieldName].replace(/(\d+)-(\d+)-(\d+)/, '$2/$3/$1' ));
                            }
                        }
                    });

                    return object;
                },

                addField: function( fieldName ){
                    this._fields.push( fieldName );

                    return this;
                }
            });

            return NormalizerConcreteDate;
       });