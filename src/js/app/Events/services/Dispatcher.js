'use strict';

/**
 * Service for dispatching events
 */
angular.module('Events')
    .service('Dispatcher', [ 'Namespace', function( _Namespace ){
        var Namespace = _Namespace,
            rootNamespace = new Namespace();

        var dispatchEvent = function ( namespaces, data, root, eventName ) {
            if (namespaces.length === 0) {
                root.invokeCallbacks(eventName, data);
                return;
            }

            var nsName = namespaces.shift();
            var ns = root.getChildNamespace(nsName);
            if (ns) {
                dispatchEvent(namespaces.slice(0), data, ns, eventName );
            }
            var anyNs = root.getAnyNamespace();
            if (anyNs) {
                dispatchEvent(namespaces.slice(0), data, anyNs, eventName );
            }
        };

        var addObserver = function( namespaces, callback, root ) {
            var namespaceName = namespaces.shift();

            var namespace = root.getChildNamespace( namespaceName );
            if( !angular.isObject( namespace ) ){
                namespace = new Namespace(namespaceName);
                root.addChildNamespace( namespaceName, namespace );
            }

            if (namespaces.length === 0) {
                namespace.addCallback( callback );
                return;
            }
            addObserver( namespaces, callback, namespace);
        };

        return {
            dispatch: function ( event, data ) {
                var namespaces = event.split('.');
                dispatchEvent( namespaces, data, rootNamespace, event );
            },

            observe: function( event, callback ) {
                var namespaces = event.split('.');

                if( angular.isUndefined( callback.invocations ) ){
                    callback.invocations = Infinity;
                }

                addObserver(namespaces, callback, rootNamespace);
            },

            once: function( event, callback ){
                callback.invocations = 1;
                this.observe( event, callback );
            },

            exact: function( count ){
                var self = this;

                return {
                    observe: function( event, callback ){
                        callback.invocations = count;
                        self.observe( event, callback );
                    }
                };
            }
        };
    }]);
