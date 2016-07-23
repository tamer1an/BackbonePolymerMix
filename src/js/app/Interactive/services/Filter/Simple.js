'use strict';

angular.module( "Interactive" )
    .service( "FilterSimple", [ 'Filter', 'ComparatorSimple', function( Filter, Comparator ){
        return new Filter( new Comparator() );
    }] );