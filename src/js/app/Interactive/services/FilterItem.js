'use strict';

angular.module("Interactive")
    .service( "FilterItem", function(){

        function FilterItem( name, count, isSelected, isAll ){
            this._count = 1;
            this._isSelected = false;
            this._name = '';

            this.setCount( count );
            this.setIsSelected( isSelected );
            this.setName( name );

            if( !!isAll ){
                this.setAll();
            }
        }

        angular.extend( FilterItem.prototype, {
            setCount: function( count ){
                if( angular.isUndefined( count ) ){
                    return this;
                }

                this._count = parseInt( count );

                return this;
            },
            incCount: function(){
                ++ this._count;

                return this;
            },
            getCount: function(){
                return this._count;
            },

            setIsSelected: function( isSelected ){
                this._isSelected = !!isSelected;

                return this;
            },
            isSelected: function(){
                return this._isSelected;
            },
            select: function(){
                return this.setIsSelected( true );
            },
            unSelect: function(){
                return this.setIsSelected( false );
            },

            setName: function( name ){
                this._name = name;

                return this;
            },
            getName: function(){
                return this._name;
            },

            apply: function( value ){
                if( this.isAll() ){
                    return true;
                }

                var names = this._comparator.compare( value );
                if( ! angular.isArray( names ) ){
                    names = [names];
                }
                return ( names.indexOf( this.getName() ) > -1 );
            },

            setAll: function(){
                this._isAll = true;

                return this;
            },
            isAll: function(){
                return !! this._isAll;
            },

            setComparator: function( comparator ){
                this._comparator = comparator;

                return this;
            }
        });

        return FilterItem;
    });