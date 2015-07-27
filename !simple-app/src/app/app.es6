"use strict";

var Application = (function($) {
    // GLOBAL INTERFACE
    var App = {
        stores: {},
        views: {},
        presenters: {}
    };
    
    // ROUTER
    var Workspace = Backbone.Router.extend({
        routes: {
            "help":                 "help",
            "search/:query":        "search",
            "search/:query/p:done": "search"
        },

        help: function() {
            console.log('help');
        },

        search: function(query, page) {
            console.log('search');
        }
    });
    
    // MODEL -> TASK
    var Task = Backbone.Model.extend({
        defaults: function () {
            return {
               title:'New task',
               body:'',
               done:false
            };
        },
      
        initialize: function() {
          if (!this.get("title")) {
            this.set({"title": this.defaults().title});
          }
        },
        
        toggle: function() {
          this.save({done: !this.get("done")});
        }
    });
    
    // COLLECTION -> TASK
    var TaskList = Backbone.Collection.extend({
        
        model: Task,
        
        localStorage: new Backbone.LocalStorage("todos-collection"),
        
        done: function() {
          return this.filter(function(todo){ return todo.get('done'); });
        },
        
        remaining: function() {
          return this.without.apply(this, this.done());
        },
        
        nextOrder: function() {
          if (!this.length) return 1;
          return this.last().get('order') + 1;
        },
        
        comparator: function(todo) {
          return todo.get('order');
        }
    });

    var Todos =  new TaskList;

    // VIEW ITEM
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
            
            this.toggleDone();
        },

        toggleDone: function() {
          this.model.toggle();
        },
        
        render: function(){
            var fragment = document.createDocumentFragment();
                fragment.appendChild($('<paper-checkbox></paper-checkbox>')[0]);
                fragment.appendChild($('<paper-input value="'+this.model.body+'"/>')[0]);

            this.$el.append(fragment);
            return this.el;
        }
    });
    
    // VIEW LIST
    var TaskListView= Backbone.View.extend({
        
        el: 'compleated-items',
        
        initialize: function(){
            _.bindAll(this, 'render');
        },
        
        addItem: function(item){
            this.$el.find('#todosContainer').append(item.render());
        }
    });

    // MAIN CONTROLLER
    var AppController = Backbone.View.extend({
        
        el: "body",
        
        router: new Workspace,
        
        events: {
            "click    add-items-section form input": "validate",
            "keypress add-items-section form input": "validate",
            "change   add-items-section form input": "validate",
            
            "submit   add-items-section form"      : "submit",
            
            "submit   compleated-items  form"      : function(){ return false; }
        },
        model : new Task,
        
        initialize: function () {
            console.log('init', this.model);
            this.addInput = document.querySelector('add-items-section input');

            _.bindAll(this, 'saveChanges','validate','submit','refresh');

            this.router.on("route:help", function(page) {
                console.log('help route fired');
            });
            
            this.router.on("route:search", function(done) {
                console.log('filter items route fired find task-done:',done);
            });

            this.list = new TaskList;
            this.list.on("change reset add remove", this.refresh, this);             // this.listenTo(this.model, 'change', this.render);

            this.taskList = new TaskListView;
            this.list.fetch();
        },
        
        refresh : function(model,options) {
            console.log(JSON.stringify(model) + ' changed');

            this.taskList.addItem(new TaskView({
                model: model
            }));
        },
        
        submit:  function (e)  {
            if(this.addInput.value != ""){
                this.list.add(this.model);
                this.model = new Task;
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
            this.model.body = this.addInput.value;
            console.log('saved',this.model);
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