'use strict';

angular.module("Interactive")
    .service( "FilterAggregator", [ 'FilterItem', function( FilterItem ){
        return function( items, field, comparator ){
            if( ! angular.isArray( items ) ){
                return [];
            }

            var filters = {};
            angular.forEach( items, function( item ){
                var target = ( field === null ) ? item : item[field];
                var names = comparator.compare( target );

                names = ( ! angular.isArray( names ) ) ? [ names ] : names;

                angular.forEach( names, function( name ){
                    if( ! angular.isDefined( filters[name] ) ){
                        var filterItem = new FilterItem( name );
                        filterItem.setComparator( comparator );
                        filters[name] = filterItem;
                    }
                    else{
                        filters[name].incCount();
                    }
                });
            });

            var response = [];
            response.push( new FilterItem( 'All', items.length, true, true ) );
            angular.forEach( filters, function( filter ){
                response.push( filter );
            });

            return response;
        };
    }]);