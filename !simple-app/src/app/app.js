"use strict";

var Application = (function ($) {
    var App = {
        stores: {},
        views: {},
        presenters: {},
        collections: {}
    };

    //VIEWS


    //// MODEL & COLLECTIONS
    var user = Backbone.Model.extend({
        defaults: function defaults() {
            return { // video Entity
                base_url: "url"
            };
        }
    });
    App.collections.users = Backbone.Collection.extend({
        url: "https://api.com/api/submit"
    });

    //PRESENTERS
    var AppController = Backbone.View.extend({
        el: "body",
        events: {
            "change #video-filter": "updateVideolist",
            "click picture": "showSingleVideo"
        },
        initialize: function () {

        },
        submit: function () {

        },
        validate: function () {

        }
    });

    //APP CONSTRUCTOR:
    $(document).ready(function () {
        document.ontouchmove = function (e) {
            e.preventDefault();
        };

        App.presenters.AppController = new AppController();
    });

    return App;
})(jQuery);