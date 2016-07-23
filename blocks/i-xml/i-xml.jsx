modules.define('i-xml', ['react', 'underscore'], function(provide, React, _) {

    var iXML = React.createClass({
        statics: {
            convert: function (o) {
                var that = this,
                    XMLString = [];

                if ( _.isObject(o) ) {
                    XMLString.push(that._convertObject(o));
                }

                return XMLString.join('');
            },

            _convertObject: function (o) {
                var that = this,
                    XMLString = [],
                    pairs = _.pairs(o);

                if ( pairs.length ) {
                    pairs.map(function (pair) {
                        var tag = pair[0],
                            node,
                            string = '';

                        if ( _.isArray(pair[1]) ) {
                            var subString = [];

                            for ( var i = 0; i < pair[1].length; i++ ) {
                                subString.push('<' + tag + '>' + that.convert(pair[1][i]) + '</' + tag + '>');
                            }

                            string = subString.join('');
                        } else {
                            node = pair[1];
                            string = '<' + tag + '>' + node + '</' + tag + '>';
                        }

                        XMLString.push(string);
                    });
                }

                return XMLString;
            }
        },

        render: function () {}
    });

    provide(iXML);
});
