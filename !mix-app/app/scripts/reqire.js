require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        }
    },
    paths: {
        jquery: '../../../backbone_1_static/app/bower_components/jquery/jquery',
        backbone: '../../../backbone_1_static/app/bower_components/backbone/backbone',
        underscore: '../../../backbone_1_static/app/bower_components/underscore/underscore'
    }
});

require([
    '../../../backbone_1_static/app/bower_components/backbone/backbone'
], function (Backbone) {
    Backbone.history.start();
    console.log('Hello from Backbone!');
});
