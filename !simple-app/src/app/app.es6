"use strict";

var Application = (function($) {
    var App = {
        stores: {},
        views: {},
        presenters: {}
    };

    // MODEL
    var User = Backbone.Model.extend({
        defaults: function () {
            return { // User Entity
                gender : '',
                fname : '',
                date : '',
                street : '',
                streetNumber : '',
                plz : '',
                ort : '',
                email : '',
                password : '',
                repassword : ''
            };
        }
    });

    // Form Application
    var AppController = Backbone.View.extend({
        el: "body",
        events: {
            "click form input": "validate",
            "keypress form input": "saveChanges",
            "change form input": "saveChanges",
            "submit form":"submit"
        },
        user : new User,
        initialize: function () {
            console.log('init', this.user);
            _.bindAll(this, 'saveChanges','validate','submit');
        },
        submit:  function (e)  {
            console.log('submit');
        },
        validate: function (e)  {
            console.log('validate');
        },
        saveChanges: function(e) {
            this.user[e.currentTarget.id] = e.currentTarget.value;
            console.log('saved',this.user);
        }
    });

    //APP CONSTRUCTOR:
    $(document).ready(() => {
        console.log('doc ready');
        Backbone.history.start();
        App.presenters.AppController = new AppController();
    });

    return App;
})(jQuery);