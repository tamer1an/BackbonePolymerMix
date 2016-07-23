'use strict';

angular.module( "Interactive" )
    .service( "FilterDate", [ 'Filter', 'ComparatorDate', function( Filter, Comparator ){
        return ( new Filter( new Comparator() ) ).setTargetField( 'datetime' );
    }] );