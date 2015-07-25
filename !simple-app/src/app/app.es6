"use strict";

var Application = (function($) {
    var App = {
        stores: {},
        views: {},
        presenters: {}
    };

    // MODEL
    var Task = Backbone.Model.extend({
        defaults: function () {
            return { // Task Entity
               title: '',
               body:'',
               type:''
            };
        }
    });

    var Workspace = Backbone.Router.extend({
        routes: {
            "help":                 "help",    // #help
            "search/:query":        "search",  // #search/kiwis
            "search/:query/p:page": "search"   // #search/kiwis/p7
        },

        help: function() {
            console.log('help');
        },

        search: function(query, page) {
            console.log('search');
        }
    });

    // Form Application
    var AppController = Backbone.View.extend({
        el: "body",
        router: new Workspace,
        events: {
            "click form input": "validate",
            "keypress form input": "saveChanges",
            "change form input": "saveChanges",
            "submit .app_section_form":"submit"
        },
        task : new Task,
        initialize: function () {
            console.log('init', this.task);
            _.bindAll(this, 'saveChanges','validate','submit');

            this.router.on("route:help", function(page) {
                console.log('help 1');
            });
        },
        submit:  function (e)  {
            console.log('submit');
        },
        validate: function (e)  {
            console.log('validate');
        },
        saveChanges: function(e) {
            this.task[e.currentTarget.id] = e.currentTarget.value;
            console.log('saved',this.task);
        }
    });

    //APP CONSTRUCTOR:
    $(document).ready(() => {
        console.log('doc ready');
        App.presenters.AppController = new AppController();
        Backbone.history.start();
    });

    return App;
})(jQuery);