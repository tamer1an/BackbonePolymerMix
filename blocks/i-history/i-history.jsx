modules.define('i-history', ['react', 'underscore', 'jquery'], function(provide, React, _, $) {

    var iHistory = React.createClass({
        statics: {
            parseSearch: function () {
                var search = window.location && window.location.search;

                if ( search.length ) {
                    var arr = {};

                    search = search.slice(1);

                    search.split('&').map( function(elem) {
                        var slElem = elem.split('=');

                        arr[slElem[0]] = slElem[1];
                    });

                    return arr;
                }
            },

            setProp: function (obj) {
                var searchObj = this.parseSearch() || {},
                    str = location.origin + location.pathname +
                            '?' + $.param(_.extend(searchObj, obj));

                if ( history ) {
                    history.pushState(null, null, str);
                } else {
                    location.replace(str);
                }
            },

            getProp: function (prop) {
                var searchObj = this.parseSearch() || {},
                    val = null;

                if ( searchObj.hasOwnProperty(prop) ) {
                    val = searchObj[prop];
                }

                return val;
            }
        },

        render: function () {}
    });

    provide(iHistory);
});
