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
            "todo":                 "todo",
            "search/:query":        "search",
            "search/:query/p:done": "search"
        },

        help: function() {
            // console.log('[route] help');
        },

        search: function(query, done) {
            // console.log('[route] search',query, done);
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
            "click paper-checkbox" : "close"
            // "change paper-input": "save",
        },
        
        initialize: function(){
            _.bindAll(this, 'render','close');
        },
        
        close: function(e){
            var cb = $(e.currentTarget);

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
            var fragment = $(document.createDocumentFragment()),
                taskState = this.model.get('done');
                
                fragment.append($('<paper-checkbox '+ (taskState?'checked':'') +'></paper-checkbox>').get(0))
                        .append($('<paper-input '+ (taskState?'disabled':'') +' value="'+this.model.get('body')+'"/>').get(0));

            this.$el.append(fragment);
            return this.el;
        }
    });
    
    // VIEW LIST
    var TaskListView= Backbone.View.extend({
        
        mode: 'not-ready',
        
        el: 'completed-items',
      
        initialize: function(){
            _.bindAll(this, 'render');
        },
        
        addItem: function(item){
             this.$el.find('#todosContainer').append(item.render());
        },
        
        redraw: function(){
            
        },
        
        refreshTodoList : function(list) {
            var container = $('div#todosContainer');
        
            container.html('');
        
            list.remaining().forEach(function(val){
               container.append(new TaskView({model : val}).render());
            })
        },
        
        refreshDoneList : function(list) {
            var container = $('div#DoneContainer');
            
            container.html('');
            
            list.done().forEach(function(val){
               container.append(new TaskView({model : val}).render());
            })
        },
    });

    // MAIN CONTROLLER
    var AppController = Backbone.View.extend({
        
        el: "body",
        
        model : {},
        
        router: new Workspace,
        
        events: {
            "click    add-items-section form input": "validate",
            "keypress add-items-section form input": "validate",
            "change   add-items-section form input": "validate",
            
            "submit   add-items-section form"      : "submit",
            
            "submit   completed-items  form"      : function(){ return false; }
        },
        
        setupCustomRouters : function(){
            this.router.on("route:help", function(page) {
                // console.log('help route fired');
            });
            
            this.router.on("route:search", this.showDone);
            this.router.on("route:todo", this.showTodo);
        },
        
        showDone : function(){
           this.elemTodos.hide();
           this.elemDone.show();
           
           this.taskList.refreshDoneList(this.list);
        },
        
        showTodo : function(){
           this.elemTodos.show();
           this.elemDone.hide();
          
          this.taskList.refreshTodoList(this.list);
        },
        
        initialize: function () {
            _.bindAll(this, 'saveChanges','validate','submit','refreshModel','refreshCollection','showDone','showTodo');
            
            this.addTaskInput = $('add-items-section input');
            this.elemTodos = $('div#todosContainer');
            this.elemDone = $('div#DoneContainer');
            
            this.setupCustomRouters();
            
            this.list = new TaskList;
            this.list.on("change reset", this.refreshModel, this);             // this.listenTo(this.model, 'change', this.render);
            this.list.on("add remove", this.refreshCollection, this);
            
            this.taskList = new TaskListView({collection:this.list});
            
            this.list.fetch();
        },
        
        refreshModel : function(model,options) {
            // console.log(JSON.stringify(model) + ' [changed/reset]');
        },
        
        refreshCollection : function(model,options) {
            this.taskList.addItem(new TaskView({
                model: model
            }));
        },
        
        submit:  function (e)  {
            if(this.addTaskInput.val().trim() != ""){
                this.list.create(this.model);
                e.stopImmediatePropagation();
                e.preventDefault();
                
            } else {
                // console.log('[submit] fail!');
            }
        },

        validate: function ()  {
            var taskBody = this.addTaskInput.val().trim();
            
            if (taskBody != ""){
                this.saveChanges(taskBody);
            } else {
                // console.log('not valid');
            }
        },
        
        saveChanges: function(taskBody) {
            this.model.body = taskBody;
            return true;
        }
    });

    //APP CONSTRUCTOR:
    $(document).ready(() => {
        HTMLImports.whenReady(() => {
            App.presenters.AppController = new AppController();
            Backbone.history.start();
        });
    });

    return App;
})(jQuery);