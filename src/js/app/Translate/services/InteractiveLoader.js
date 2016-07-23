"use strict";

angular
    .module( "pascalprecht.translate" )

    .factory( 'InteractiveLoader', [ '$translateStaticFilesLoader', 'scriptLoader', '$q', function( $translateStaticFilesLoader, scriptLoader, $q ){
        return function( options ){
            
            var files = [],
                locales = [];

            angular.forEach( options, function( part ){
                if( angular.isDefined( part.language ) ){
                    files.push({
                        prefix: part.prefix,
                        suffix: part.suffix
                    });
                }

                if( angular.isDefined( part.locale ) ){
                    locales.push({
                        prefix: part.prefix,
                        suffix: part.suffix
                    });
                }
            });
            return $q( function( resolve, reject ){
                var promises = [];
                angular.forEach( locales, function( locale ){
                    promises.push( scriptLoader.load( locale.prefix + options.key + locale.suffix ) );
                });

                $q.all( promises )
                    .then( function(){
                        $translateStaticFilesLoader({
                            files: files,
                            key: options.key
                        }).then( resolve, reject );
                    });
            });
        };
    }]);