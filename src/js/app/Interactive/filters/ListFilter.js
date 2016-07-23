'use strict';

angular.module('Interactive')
    .filter( 'listFilter', function(){
        /**
         * @param items Object[]
         * @param filterItems FilterItem[]
         * @param field string
         *
         * @return Object[]
         */
        return function( items, filterItem, field ){
            if( ! angular.isArray( items ) ){
                return items;
            }

            var filteredItems = [];

            angular.forEach( items, function( item ){
                var target = ( angular.isUndefined( field ) ) ? item : item[field];

                if( filterItem.apply( target ) ){
                    filteredItems.push( item );
                }
            });

            return filteredItems;
        };
    });
