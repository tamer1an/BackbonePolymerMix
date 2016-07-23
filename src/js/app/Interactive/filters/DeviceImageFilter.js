'use strict';

angular.module('Interactive')
    .filter( 'deviceImageFilter', function(){

        var images = [
            "Clip-PG2.png",
            "FLD-550-PG2.png",
            "GB-501.png",
            "GSD-441-PG2.png",
            "GSD-442-PG2.png",
            "KF-234-PG2.png",
            "KF-235-PG2.png",
            "KP-250.png",
            "MC-302.png",
            "MC-302e.png",
            "MC-302V-PG2.png",
            "MCM-140.png",
            "MKP-150.png",
            "MKP-160.png",
            "Next-CAM-PG2.png",
            "Next-PG2.png",
            "PB-101-PG2.png",
            "PM-102-PG2.png",
            "RP-600-PG2.png",
            "SD-304-PG2.png",
            "SMD-426-PG2.png",
            "SMD-427-PG2.png",
            "SR-730-PG2.png",
            "TMD-560-PG2.png",
            "TOWER-20AM-PG2.png",
            "TOWER-30-PG2.png",
            "TOWER-CAM-PG2.png",
            "Undefined.png",
            "WiredZone.png"
        ];

        /**
         * @return string
         */
        return function( name ){
            if( angular.isUndefined( name ) ){
                return '';
            }

            return "img/sensors/png/" + window._.sample( images );
        };
    });
