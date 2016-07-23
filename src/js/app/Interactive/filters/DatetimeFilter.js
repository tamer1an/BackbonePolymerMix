'use strict';

angular.module('Interactive')
    .filter( 'datetimeFilter', function( $filter ){
        /**
         * @param date string|Date
         * @return string
         */
        return function( date ){
            if( ! angular.isDate(date) ){
                date = new Date(date);
            }

            if( date.toDateString() === (new Date()).toDateString() ) {
                return $filter('date')(date, "hh:mm");
            }

            return $filter('date')(date, "hh:mm MMM, d");
        };
    });
