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
            return {
               title:'',
               body:'',
               type:''
            };
        }
    });

    var TaskList = Backbone.Collection.extend({
        url:'/',
        initialize: function(){
            this.dropdown = $('#video-filter');
        },
        model: Task
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
            "keypress form input": "validate",
            "change form input": "validate",
            "submit form":"submit"
        },
        task : new Task,
        initialize: function () {
            console.log('init', this.task);
            this.addInput = document.querySelector('add-items-section input');

            _.bindAll(this, 'saveChanges','validate','submit');

            this.router.on("route:help", function(page) {
                console.log('help 1');
            });

            this.list = new TaskList();
        },
        submit:  function (e)  {
            if(this.addInput.value != ""){
                this.list.add(this.task);
                this.task = new Task;
                e.stopImmediatePropagation();
                e.preventDefault();
                console.log('submit');
            } else {
                console.log('submit fail!');
            }
        },
        validate: function ()  {
            if (this.addInput.value != ""){
                this.saveChanges();
            } else {
                console.log('not valid');
            }
        },
        saveChanges: function() {
            this.task.body = this.addInput.value;
            console.log('saved',this.task);
            return true;
        }
    });

    //APP CONSTRUCTOR:
    $(document).ready(() => {
        HTMLImports.whenReady(() => {
            console.log('doc ready');

            App.presenters.AppController = new AppController();
            Backbone.history.start();
        });
    });

    return App;
})(jQuery);