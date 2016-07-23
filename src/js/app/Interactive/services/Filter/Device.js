'use strict';

angular.module( "Interactive" )
    .service( "FilterDevice", [ 'Filter', 'ComparatorDevice', function( Filter, Comparator ){
        return new Filter( new Comparator() );
    }] );