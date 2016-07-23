'use strict';

angular.module("Interactive")
    .service( "ComparatorDate", function(){

        function ComparatorDate( now ){
            this.setNow( now );
        }

        angular.extend( ComparatorDate.prototype, {
            compare: function( value ){
                if( ! angular.isDate( value ) ){
                    return "unknown";
                }

                if( this.isToday( value ) ){
                    return "TODAY";
                }

                if( this.isThisWeek( value ) ){
                    return "THIS WEEK";
                }

                return "THIS MONTH";
            },
            daysSinceEpoch: function( value ){
                return Math.ceil( value.getTime() / 86400000 );
            },
            weeksSinceEpoch: function( value ){
                return Math.ceil( ( this.daysSinceEpoch( value ) - 4 ) / 7 );
            },
            isToday: function( value ){
                return this.daysSinceEpoch( value ) === this.daysSinceEpoch( this.getNow() );
            },
            isThisWeek: function( value ){
                return this.weeksSinceEpoch( value ) === this.weeksSinceEpoch( this.getNow() );
            },
            getNow: function(){
                return this._now;
            },
            setNow: function( now ){
                if( ! angular.isDate( now ) ){
                    now = new Date();
                }
                this._now = now;

                return this;
            }
        });

        return ComparatorDate;
    });