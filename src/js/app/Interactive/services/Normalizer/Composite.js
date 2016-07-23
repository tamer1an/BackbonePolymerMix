'use strict';

angular.module("Interactive")
       .service( "NormalizerComposite", function(){

            function Composite( normalizers ){
                var self = this;
                this._normalizers = [];

                if( angular.isDefined( normalizers ) ){
                    if( angular.isArray( normalizers ) ){
                        angular.forEach( normalizers, function( normalizer ){
                            self.addNormalizer( normalizer );
                        });
                    }
                    else{
                        this.addNormalizer( normalizers );
                    }

                }
            }

            angular.extend( Composite.prototype, {
                addNormalizer: function( normalizer ){
                    if( angular.isDefined( normalizer.normalize ) ){
                        this._normalizers.push( normalizer );
                    }

                    return this;
                },

                normalize: function( data ){
                    var self = this;
                    if( angular.isArray( data ) ){
                        var response = [];
                        angular.forEach( data, function( item ){
                            response.push( self._normalize( item ) );
                        });

                        return response;
                    }
                    else{
                        return self._normalize( data );
                    }
                },

                _normalize: function( object ){
                    angular.forEach( this._normalizers, function( normalizer ){
                        object = normalizer.normalize( object );
                    });

                    return object;
                }
            });

            return Composite;
       });