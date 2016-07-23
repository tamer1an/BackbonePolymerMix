'use strict';

angular
    .module('pascalprecht.translate')

    .service('scriptLoader', ['$document', '$q', '$timeout', function ($document, $q, $timeout) {
        function loader(createElement) {
            var promises = {};

            return function(url) {
                if (typeof promises[url] === 'undefined') {
                    var deferred = $q.defer();
                    var element = createElement(url);

                    element.onload = element.onreadystatechange = function (e) {
                        $timeout(function () {
                            deferred.resolve(e);
                        });
                    };
                    element.onerror = function (e) {
                        $timeout(function () {
                            deferred.reject(e);
                        });
                    };

                    promises[url] = deferred.promise;
                }

                return promises[url];
            };
        }

        /**
         * Dynamically loads the given script
         * @param src The url of the script to load dynamically
         * @returns {*} Promise that will be resolved once the script has been loaded.
         */
        this.load = loader(function (src) {
            var script = $document[0].createElement('script');

            script.src = src;

            $document[0].body.appendChild(script);
            return script;
        });
    }]);