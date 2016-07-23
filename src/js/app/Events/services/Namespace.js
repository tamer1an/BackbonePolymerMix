'use strict';

angular.module('Events')
       .service( 'Namespace', [function(){
            function Namespace(name){
                this.name = name;
                this.namespaces = {};
                this.callbacks = [];
                this.parent = null;
                this.isAny = name === "*";
            }

            angular.extend( Namespace.prototype, {
                getName: function () {
                    return this.name;
                },

                addCallback: function( callback ){
                    this.callbacks.push( callback );
                },

                addChildNamespace: function( name, namespace ){
                    namespace.setParent( this );
                    this.namespaces[namespace.getName()] = namespace;
                },

                getChildNamespace: function( namespace ){
                    if ( angular.isDefined( this.namespaces[namespace] ) ){
                        return this.namespaces[namespace];
                    }

                    return false;
                },

                hasChildNamespace: function( namespace ){
                    return !! this.getChildNamespace( namespace );
                },

                invokeCallbacks: function( eventName, data ){
                    angular.forEach( this.callbacks, function( callback ){
                        callback( eventName, data );
                        callback.invocations --;
                    });

                    window._.remove( this.callbacks, { invocations: 0 });
                },

                setParent: function( namespace ){
                    this.parent = namespace;
                },
                hasParent: function(){
                    return this.parent != null;
                },

                getAnyNamespace: function(){
                    return this.getChildNamespace( '*' );
                },
                isAnyNamespace: function(){
                    return this.isAny;
                },
                setAnyNamespace: function(){
                    this.isAny = true;
                },
                hasAnyNamespace: function(){
                    return !! this.getAnyNamespace();
                }
            });

            return Namespace;
       }]);
