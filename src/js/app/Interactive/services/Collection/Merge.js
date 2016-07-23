"use strict";

angular
    .module( "Interactive" )
    .factory( "CollectionMerge", [ function(){


        function Collection(){
            var self = [];

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line
                _remove: extension._remove,
                _merge: extension._merge,
                merge: extension.merge
            };

            return self;
        }

        var extension = {};

        extension._remove = function( data ){
            var $self = this,
                toDelete = [];

            angular.forEach( $self, function( $old ){
                if( ! angular.isObject( window._.find( data, $self.equality( $old ) ) ) ){
                    toDelete.push( $old );
                }
            });

            window._.remove( $self, function( element ){
                return window._.find( toDelete, $self.equality( element ) );
            });
        };

        extension._merge = function( data ){
            var $self = this;

            angular.forEach( data, function( $new ){
                var $old = window._.find( $self, $self.equality( $new ) );

                if( angular.isObject( $old ) ){
                    if( ! window._.isEqual( $new, $old ) ){
                        angular.forEach( $new, function( $value, $index ){
                            if( ! window._.isEqual( $old[$index], $value ) ){
                                $old[$index] = $value;
                            }
                        });
                    }
                }
                else{
                    $self.push( $new );
                }
            });
        };

        extension.merge = function( data ){
            this._remove( data );
            this._merge( data );
        };

        return Collection;
    }]);