'use strict';

angular
    .module('Interactive', [
        'Events',
        'Data'
    ])

    .constant( "defaultIdleTimer", "300" );