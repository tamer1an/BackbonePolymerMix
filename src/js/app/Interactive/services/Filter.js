'use strict';
angular
    .module("Interactive")
    .service( "Filter", [ 'FilterAggregator', "CollectionMerge", function( filterAggregator, CollectionMerge ){
        function Filter( comparator ){
            var self = new CollectionMerge();

            self.__proto__ = { // jshint ignore:line
                __proto__: self.__proto__, // jshint ignore:line

                targetField: null,

                setComparator: function( comparator ){
                    if( angular.isUndefined( comparator.compare ) ){
                        throw "Compare method is not defined";
                    }

                    this._comparator = comparator;
                },

                update: function( items ){
                    this.merge( filterAggregator( items, this.targetField, this._comparator ) );
                },

                activate: function( filterItem ){
                    angular.forEach( this, function( item ){
                        if( item.getName() === filterItem.getName() ){
                            item.select();
                        }
                        else{
                            item.unSelect();
                        }
                    });
                },

                setTargetField: function( field ){
                    this.targetField = field;

                    return this;
                },

                equality: function( $e ){
                    return { _name: $e.getName() };
                }
            };

            self.setComparator( comparator );

            return self;
        }


        return Filter;
    }]);

