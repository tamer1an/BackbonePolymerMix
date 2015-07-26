"use strict";

var Application = (function($) {
    // GLOBAL INTERFACE
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
    // COLLECTION
    var TaskList = Backbone.Collection.extend({
        url:'/',
        initialize: function(){

        },
        model: Task
    });

    // ROUTER
    var Workspace = Backbone.Router.extend({
        routes: {
            "help":                 "help",
            "search/:query":        "search",
            "search/:query/p:page": "search"
        },

        help: function() {
            console.log('help');
        },

        search: function(query, page) {
            console.log('search');
        }
    });

    // VIEWS
    var TaskListView= Backbone.View.extend({
        el: 'compleated-items',
        initialize: function(){
            _.bindAll(this, 'render');
        },
        addItem: function(item){
            this.$el.find('#todosContainer').append(item.render());
        }
    });

    var TaskView = Backbone.View.extend({
        tagName: 'form',
        events: {
            "click": "close"
        },
        initialize: function(){
            _.bindAll(this, 'render','close');
        },
        close: function(e){
            var cb = $(e.currentTarget).find('paper-checkbox');

            if (cb.prop('checked')){
                cb.next().prop('disabled',true);
            } else {
                cb.next().prop('disabled',false);
            }

        },
        render: function(){
            var fragment = document.createDocumentFragment();
                fragment.appendChild($('<paper-checkbox></paper-checkbox>')[0]);
                fragment.appendChild($('<paper-input value="'+this.model.body+'"/>')[0]);


            this.$el.append(fragment);
            return this.el;
        }
    });

    // MAIN CONTROLLER
    var AppController = Backbone.View.extend({
        el: "body",
        router: new Workspace,
        events: {
            "click add-items-section form input": "validate",
            "keypress add-items-section form input": "validate",
            "change add-items-section form input": "validate",
            "submit add-items-section form":"submit"
        },
        task : new Task,
        initialize: function () {
            console.log('init', this.task);
            this.addInput = document.querySelector('add-items-section input');

            _.bindAll(this, 'saveChanges','validate','submit','refresh');

            this.router.on("route:help", function(page) {
                console.log('help route fired');
            });

            this.list = new TaskList();
            this.list.on("change reset add remove", this.refresh, this);

            this.taskList = new TaskListView;
        },
        refresh : function(model,options) {
            console.log(JSON.stringify(model) + ' changed');

            this.taskList.addItem(new TaskView({
                model: model
            }));
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