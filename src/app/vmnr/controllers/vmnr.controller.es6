(function() {
    'use strict';

    angular
        .module('app.vmnr')
        .controller('VmnrController', [
            '$scope',
            '$mdDialog',
            '$state',
            '$mdToast',
            '$document',
            'VmnrRequest',
            'User',
            'settings',VmnrController]);

    /** VMNR list Controller in VMNR module
     *  name   {VmnrController}
     *  params {$scope, $mdDialog, $state, Request, User, settings}
     *  init   {User, settings} params resoled by config.route.es6
     * */
    function VmnrController($scope, $mdDialog, $state, $mdToast, $document, Request, User, settings) {
        //INIT
        settings.checkSession(User.getSession(),$state);
        $scope.user = User;

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $scope.toastPosition = angular.extend({},last);
        $scope.getToastPosition = function() {
            sanitizePosition();
            return Object.keys($scope.toastPosition)
                .filter(function(pos) { return $scope.toastPosition[pos]; })
                .join(' ');
        };
        function sanitizePosition() {
            var current = $scope.toastPosition;
            if ( current.bottom && last.top ) current.top = false;
            if ( current.top && last.bottom ) current.bottom = false;
            if ( current.right && last.left ) current.left = false;
            if ( current.left && last.right ) current.right = false;
            last = angular.extend({},current);
        }
        $scope.showOrderingToast = function(rule,idx) {
            $mdToast.show({
                controller: function($scope, $mdToast) {
                    $scope.closeToast = function() {
                        $mdToast.hide();
                    };
                },
                template: `<md-toast>
                                  <span flex>Custom toast!</span>
                                  <md-button ng-click="closeToast()">
                                    Close
                                  </md-button>
                                </md-toast>`,
                parent : $document[0].querySelector(`md-button[data-Item=${idx}]`),
                hideDelay: 6000,
                position: $scope.getToastPosition()
            });
        };

        const nextRule = {
            rule: [{Enabled: [true]}, {IfUnread: ["delete"]}, {"Notify": []}],
            ruleId: '',
            number:0,
            ruleName: 'New Rule'
        };

        function createNextRule(number) {
            if (Object.is(parseInt(number),NaN)){
                return false;
            }
            var rule = new Object(nextRule);
                rule.number = number+2;

            return rule;
        }

        $scope.createNewRule = function(user) {
            return createNextRule(user.vmnr.rules.length);
        };

        $scope.newRule = (user) => {
            if(User.userSession.is_logged) {
                let nextRule = $scope.createNewRule(user);

                if (angular.isObject(nextRule)){
                    $scope.navigateTo(nextRule, false, nextRule);
                }
            }
        };

        $scope.createDescription = (rule) => {
            return rule.rule.reduce((x,y,z,all)=>
                `${z===1?'':x} ${Object.keys(y)[0]},`
            );
            // return [for (item of rule.rule) ()=> Object.keys(item)[0]]; //.join(' ');
        };


        $scope.deleteRule = (rule) => {
            Request.deleteRule(rule,$scope);
        };

        //EDIT RULE
        $scope.navigateTo = function(
            rule,
            event,
            RAW_rule = {},
            ruleObj = {},
            ruleWeakMap = new WeakMap(),
            useFullScreen = true
        ) {
            //INIT EDIT MODE
            $scope.user.vmnr.newRule = (event === false)?rule:false;
            $scope.user.vmnr.editState = true;
            rule.rule.forEach((v,i) => {
                let ruleName = Object.keys(v)[0];
                switch (ruleName){
                    case 'Notify':
                        ruleObj[ruleName] = {
                            items : v[ruleName]
                        };
                    break;
                    default:
                        ruleObj[ruleName] = v[ruleName];
                }
                ruleWeakMap.set(ruleObj[ruleName], {
                    index: i, //TODO: outdated after clear any of conditions
                    ruleName: ruleName,
                    ruleObj: ruleObj,
                    rule_item:v,
                    rule: rule,
                    RAW_rule: RAW_rule
                });
            });

            if (!ruleObj.hasOwnProperty('Notify')){
                ruleObj.Notify = {
                    items:[]
                };
                rule.rule.push({'Notify':[]});
                ruleWeakMap.set(ruleObj.Notify, {
                    ruleName: 'Notify',
                    ruleObj: ruleObj,
                    rule_item:rule.rule[rule.rule.length-1],
                    rule: rule,
                    RAW_rule: RAW_rule
                });
            }

            $scope.createRule = (rule) => {
                Request.createRule(rule,$scope);
            };
            $scope.saveRule = (rule)=>{
                Request.saveRule(rule,$scope);
            };

            //SHOW FORM
            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    function changeEditState(settings,state){
                        settings.editState = state;
                    }
                    //INIT BASE MODEL
                    initScope();
                    //DEFINE BLOCK
                    $scope.addNotif = function (method)  {
                        this.ruleObj.Notify.items.push(this.getDefaultNotif(method));
                    };
                    $scope.delete = function(
                        index,
                        notif = this.ruleObj.Notify.items,
                        cleanValue = []
                    ){
                        delete notif[index];
                        cleanValue = _.compact(notif);
                        this.ruleWeakMap.get(this.ruleObj.Notify).rule_item.Notify=cleanValue;
                        this.ruleObj.Notify.items = cleanValue;
                    };
                    $scope.toggleConditionsSwitch = function(condition) {
                        condition.selected = !condition.selected;

                        if(condition.selected){
                            this.ruleObj[condition.type] = [];
                            this.rule.rule.push({[condition.type]:this.ruleObj[condition.type]});

                            ruleWeakMap.set(this.ruleObj[condition.type],{
                                ruleName: condition.type,
                                ruleObj: ruleObj,
                                rule_item:rule.rule[rule.rule.length-1],
                                rule: rule,
                                RAW_rule: RAW_rule
                            });

                            switch (condition.id){
                                case 'older':
                                    initOlderThan(true);
                                    //ruleWeakMap.get(this.ruleObj[condition.type]);
                                    break;

                                case 'time':
                                    if(!this.ruleObj[condition.type].length){
                                        this.ruleObj[condition.type].push('08:00');
                                        this.ruleObj[condition.type].push('18:00');
                                    }
                                    initTimeOfDay(true);
                                    break;
                            }
                        } else{
                            ruleWeakMap.delete(this.ruleObj[condition.type]);
                            delete this.ruleObj[condition.type];
                            this.rule.rule = this.rule.rule.filter(function(v){
                                let f = this.ruleObj[Object.keys(v)[0]];
                                return angular.isArray(f) || angular.isObject(f)
                            },this);
                        }
                    };
                    $scope.toggleConditions = function(condition,type) {
                        condition.selected = !condition.selected;

                        switch (type){
                            case 'DaysOfWeek':
                                let day = condition.day,
                                    include = this.ruleObj[type].includes(day);

                                if(condition.selected && !include){
                                    this.ruleObj[type].push(day);
                                } else if(!condition.selected && include) {
                                    _.pull(this.ruleObj[type],day)
                                }

                                break;

                            case 'MessageClass':
                                let label = condition.label.toLocaleLowerCase(),
                                    inc = angular.isArray(this.ruleObj[type])? this.ruleObj[type].includes(label):false,
                                    item;

                                if(condition.selected && !inc && !angular.isArray(this.ruleObj[type])){
                                    this.ruleObj[type] = [label];
                                    this.rule.rule.push({[type]:this.ruleObj[type]});
                                } else if(condition.selected && !inc){
                                    this.ruleObj[type].push(label)
                                } else if(!condition.selected && inc) {
                                    item = this.ruleObj[type];
                                    delete item[item.indexOf(label)];
                                    this.ruleWeakMap
                                        .get(this.ruleObj[type])
                                        .rule_item[type] = _.compact(item);
                                }
                                break;
                        }
                    };
                    $scope.cancel = function(option) {
                        changeEditState($scope.user.vmnr,false);
                        $mdDialog[option]();
                    };
                    $scope.save = function(rule){
                        if(angular.isArray(this.ruleObj.MessageOlderThan)){
                            ruleWeakMap.get(ruleObj.MessageOlderThan).rule_item.MessageOlderThan[0] = ruleWeakMap.get(ruleObj.MessageOlderThan).parsed.setSeconds();
                        }

                        if(angular.isArray(this.ruleObj.WhenTimeOfDay)){
                            ruleWeakMap.get(ruleObj.WhenTimeOfDay).rule_item.WhenTimeOfDay = ruleWeakMap.get(ruleObj.WhenTimeOfDay).parsed.getTime();
                        }

                        if(angular.isArray(this.ruleObj.Notify.items)){
                            this.ruleObj.Notify.items.forEach((v)=>{
                                v.Transport[3].Attempts[0] = parseInt(v.Transport[3].Attempts[0]);
                                v.Transport[4].ToAttach[0] = (v.Transport[4].ToAttach[0] === 'true');
                                v.Transport[5].Pause[0] = parseInt(v.Transport[5].Pause[0]);
                            });
                            this.ruleWeakMap.get(this.ruleObj.Notify).rule_item.Notify = this.ruleObj.Notify.items;
                        }

                        if ($scope.User.vmnr.newRule === false){
                            $scope.saveRule(rule);
                        }else{
                            $scope.createRule(rule);
                        }

                        changeEditState($scope.user.vmnr,false);
                        $mdDialog.hide(rule);
                    };

                    function getConvertOlderThanTime (milliseconds){
                        let today = new Date(0),
                            than = new Date(milliseconds),
                            diffMs = (than - today), // milliseconds between now & than
                            diffDays = Math.round(diffMs / 86400000), // days
                            diffHrs = Math.round((diffMs % 86400000) / 3600000), // hours
                            diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000), // minutes
                            diffSec = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds

                        return {
                            days:diffDays,
                            hours:diffHrs,
                            minutes:diffMins,
                            seconds:diffSec
                        }
                    }

                    function initOlderThan (selected){
                        if (selected){
                            let MessageOlderThan = {
                                seconds:0,
                                current:{
                                    days:0,
                                    hours:0,
                                    minutes:0,
                                    seconds:0
                                },
                                title(){
                                    return `${this.current.days}d ${this.current.hours}h ${this.current.minutes}m ${this.current.seconds}s`
                                },
                                setSeconds(){
                                    let seconds = (this.current.days*24*60*60) + (this.current.hours*60*60) + (this.current.minutes*60) + (this.current.seconds);
                                    this.seconds = seconds;
                                    return seconds;
                                }
                            };
                            MessageOlderThan.seconds = !Object.is(NaN,parseInt(ruleObj.MessageOlderThan[0]))?parseInt(ruleObj.MessageOlderThan[0]):0;
                            MessageOlderThan.current = getConvertOlderThanTime(parseInt(MessageOlderThan.seconds)*1000);
                            ruleWeakMap.get(ruleObj.MessageOlderThan).parsed = MessageOlderThan;
                        }
                    }

                    function initTimeOfDay (selected){
                        if (selected){
                            let from = ruleObj.WhenTimeOfDay[0].split(':'),
                                to = ruleObj.WhenTimeOfDay[1].split(':');

                            ruleWeakMap.get(ruleObj.WhenTimeOfDay).parsed = {
                                from: new Date(1970, 0, 1, from[0], from[1], 0),
                                to: new Date(1970, 0, 1,  to[0], to[1], 0),
                                getTime(){
                                    // if (!angular.isString(this.from) || !angular.isString(this.to)){
                                    //     return
                                    // }

                                    let f = this.from.toTimeString().split(' '),
                                        t = this.to.toTimeString().split(' '),
                                        fTime=f[0].split(':'),
                                        tTime=t[0].split(':');

                                    return [`${fTime[0]}:${fTime[1]}`,`${tTime[0]}:${tTime[1]}`];
                                },
                                title(){
                                    // TODD: CALL FROM FIREFOX
                                    // if (!angular.isString(this.from) || !angular.isString(this.to)){
                                    //     return
                                    // }

                                    let f = this.from.toTimeString().split(' '),
                                        t = this.to.toTimeString().split(' '),
                                        fTime=f[0].split(':'),
                                        tTime=t[0].split(':');

                                    return `From ${fTime[0]}:${fTime[1]} To ${tTime[0]}:${tTime[1]}`;
                                }
                            };
                        }
                    }

                    function initScope(){
                        const defaultTitle = {
                            d: 'please select'
                        };

                        $scope.ruleObj = ruleObj;
                        $scope.ruleWeakMap = ruleWeakMap;
                        $scope.msgWeekDays = {
                            btnTitle:function(title=''){
                                this.weekDays.forEach((v,i)=> title = v.selected? `${title} ${v.abr},`:title);
                                return title===''?defaultTitle.d:title;
                            },
                            weekDays: [{
                                abr:'Su',
                                selected:false,
                                label :'Sunday',
                                day: 0,
                                title:''
                            },{
                                abr:'Mo',
                                selected:false,
                                label :'Monday',
                                day: 1,
                                title:''
                            },{
                                abr:'Tu',
                                selected:false,
                                label :'Tuesday',
                                day: 2,
                                title:''
                            },{
                                abr:'We',
                                selected:false,
                                label :'Wednesday',
                                day: 3,
                                title:''
                            },{
                                abr:'Th',
                                selected:false,
                                label :'Thursday',
                                day: 4,
                                title:''
                            },{
                                abr:'Fr',
                                selected:false,
                                label :'Friday',
                                day: 5,
                                title:''
                            },{
                                abr:'Sa',
                                selected:false,
                                label :'Saturday',
                                day: 6,
                                title:''
                            }]
                        };

                        $scope.msgWeekDays.weekDays.forEach(function(v){
                            if (angular.isArray(this.DaysOfWeek))
                                v.selected = this.DaysOfWeek.includes(v.day);
                        },ruleObj);

                        $scope.msgClass = {
                            btnTitle:function(title=''){
                                this.classes.forEach((v)=> {
                                        title = v.selected ? `${title} ${v.abr},` : title
                                    });
                                return title===''?defaultTitle.d:title;
                            },
                            classes : [{
                                selected:false,
                                label:'Normal',
                                title:"Normal class of the message 'N'",
                                abr:'Normal'
                            },{
                                selected:false,
                                label:'Urgent',
                                title:"Urgent messages 'U'",
                                abr:'Urgent'
                            },{
                                selected:false,
                                label:'Private',
                                title:"Private messages 'P'",
                                abr:'Private'
                            }]
                        };

                        $scope.msgClass.classes.forEach(function(v){
                            if (angular.isArray(this.MessageClass))
                                v.selected = this.MessageClass.includes(v.label.toLocaleLowerCase());
                        },ruleObj);

                        $scope.conditions = [
                            {
                                id:'media',
                                title:'Selected media',
                                url:'message-media',
                                label:'Message Media',
                                type: 'MessageMedia',
                                hidden:false,
                                selected: angular.isArray(ruleObj.MessageMedia)
                            },{
                                id:'from',
                                title:'Message from',
                                url:'message-from',
                                label:'Message from',
                                type: 'MessageFrom',
                                hidden:false,
                                selected: angular.isArray(ruleObj.MessageFrom)
                            },{
                                id:'class',
                                title:'Message class',
                                url:'message-class',
                                type: 'MessageClass',
                                selected: angular.isArray(ruleObj.MessageClass),
                                hidden:false,
                                label:'Message class'
                            },{
                                id:'time',
                                title:'Time of Day',
                                url:'message-time-of-day',
                                label:'Time of Day',
                                type: 'WhenTimeOfDay',
                                hidden:false,
                                selected:angular.isArray(ruleObj.WhenTimeOfDay)
                            },{
                                id:'older',
                                title:'Message is older than',
                                url:'message-is-older',
                                label:'Older than',
                                type: 'MessageOlderThan',
                                hidden:false,
                                selected:angular.isArray(ruleObj.MessageOlderThan)
                            },{
                                id:'interval',
                                title:'Interval',
                                url:'message-interval',
                                type: 'NotifInterval',
                                hidden:true,
                                label:'Interval'
                            },{
                                id:'weekdays',
                                hidden:false,
                                title:'On days of week',
                                url:'message-days-of-week',
                                label:'On days of week',
                                type: 'DaysOfWeek',
                                selected:angular.isArray(ruleObj.DaysOfWeek)
                            }
                        ];

                        initOlderThan(_.find($scope.conditions,{id:'older'}).selected);
                        initTimeOfDay(_.find($scope.conditions,{id:'time'}).selected);

                        $scope.toggleInterval = function(state){
                            $scope.interval = {
                                optionState: state,
                                label: state ? 'interval' : 'eachtime'
                            };
                            $scope.conditions[5].selected = state;

                            if (state){
                                var condition=$scope.conditions[5];
                                if(!angular.isArray(this.ruleObj[condition.type])){
                                    this.ruleObj[condition.type] = [{Period:['1']},{StartFrom:['12:00']}];
                                    this.rule.rule.push({[condition.type]:this.ruleObj[condition.type]});

                                    ruleWeakMap.set(this.ruleObj[condition.type],{
                                        ruleName: condition.type,
                                        ruleObj: this.ruleObj,
                                        rule_item: this.rule.rule[rule.rule.length-1],
                                        rule: this.rule,
                                        RAW_rule: this.RAW_rule
                                    });
                                }

                                let anyMail = false;
                                this.ruleObj.Notify.items.forEach((v)=>{
                                    if (anyMail===false && v.Transport[0].By[0] == 'e-mail'){
                                        anyMail = v;
                                    }
                                });

                                if(anyMail===false)
                                    this.ruleObj.Notify.items = [this.getDefaultNotif('e-mail')]
                                else
                                    this.ruleObj.Notify.items = [anyMail]

                            } else {
                                let condition=$scope.conditions[5];

                                ruleWeakMap.delete(this.ruleObj[condition.type]);
                                delete this.ruleObj[condition.type];
                                this.rule.rule = this.rule.rule.filter(function(v){
                                    let f = this.ruleObj[Object.keys(v)[0]];
                                    return angular.isArray(f) || angular.isObject(f);
                                },this);
                            }
                        };
                        $scope.getDefaultNotif = (method)=> new Object({
                            'Transport' : [{
                                    'By': [method]
                                }, {
                                    'Destination': ['']
                                }, {
                                    'CallMethod': ['simultaneously']
                                }, {
                                    'Attempts': [0]
                                }, {
                                    'ToAttach': [false]
                                }, {
                                    'Pause': [0]
                            }]
                        });
                        $scope.toggleInterval(angular.isArray($scope.ruleObj.NotifInterval));
                    }
                },
                scope: angular.extend($scope.$new(), {rule: rule}),
                ariaLabel: 'Dialog',
                templateUrl: 'app/vmnr/components/dialog.tpl.html',
                parent: angular.element(document.querySelector('.UP_uiView')),
                targetEvent: event,
                clickOutsideToClose:false,
                escapeToClose:false,
                fullscreen: useFullScreen
            }).then(function(answer) {
                $scope.status = `You said the information was "${answer}'.`;
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });

            return this;
        };

        if(User.userSession.is_logged){
            Request.getList($scope);
        }
    }
})();