"use strict";

angular
    .module( "Interactive" )
    .service( "ScreenStandart", [ "Screen", function( Screen ){
        return {
            $scope: null,
            callback: null,

            grid: {
                'sm': 1,
                'md': 2,
                'lg': 3,
                'gt-lg': 4
            },

            setScope: function( $scope ){
                this.$scope = $scope;
                return this;
            },

            setCallback: function( callback ){
                this.callback = callback;
                return this;
            },

            init: function(){
                if( this.$scope && this.callback ){
                    Screen.watch( this.$scope,
                                  window._.keys( this.grid ),
                                  this.callback );
                }
            },

            place: function( key ){
                var tiles = this.grid[Screen.currentScreen],
                    place = 0;

                if( ( key+1 ) % tiles === 0 ){
                    place = key + 1;
                }
                else{
                    place = ( ( window.Math.floor( ( key+1 ) / tiles ) ) + 1 ) * tiles;
                }

                return place;
            }
        };
    }]);