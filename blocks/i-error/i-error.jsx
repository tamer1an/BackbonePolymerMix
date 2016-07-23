modules.define('i-error', ['react', 'underscore', 'jquery', 'cookie'], function(provide, React, _, $, Cookie) {

    var iError = React.createClass({
        statics: {
            parceError: function (jqXHR, textStatus, errorThrown) {
                if ( textStatus === 'error' ) {
                    var status = jqXHR.status;

                    if ( status === 401 ) {
                        alert('You are not authorized');
                        Cookie.set('token', null, { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
                        window.location.reload();
                    } else if ( status === 503 ) {

                    }
                }
            }
        },

        render: function () {}
    });

    provide(iError);
});
