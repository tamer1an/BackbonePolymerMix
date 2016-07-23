(function() {
    'use strict';

    angular
        .module('app.vmnr')
        .controller('vmnrController', [
            '$scope',
            '$mdDialog',
            '$mdMedia',
            '$state',
            'requestServiceFactory',
            'User',
            'settings',vmnrController]);

    function vmnrController($scope, $mdDialog, $mdMedia, $state, requestServiceFactory, User, settings) {
        settings.checkSession(User.getSession(),$state);

        $scope.user = User;
        //$scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.navigateTo = function(
            rule,
            event,
            RAW_rule,

            ruleObj = {},
            ruleWeakMap = new WeakMap(),
            useFullScreen = true
        ) {

            $scope.user.vmnr.editState = true;

            //noinspection JSUnresolvedFunction
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
                    index: i,
                    ruleName: ruleName,
                    ruleObj: ruleObj,
                    rule_item:v,
                    rule: rule,
                    RAW_rule: RAW_rule
                });
            });

            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {
                    initScope();

                    $scope.addNotif = function (method)  {
                        this.ruleObj.Notify.items.push(this.getDefaultNotif(method));
                    };
                    $scope.delete = function(index,notif = this.ruleObj.Notify.items,cleanValue = []){
                        delete notif[index];
                        cleanValue = _.compact(notif);
                        this.ruleWeakMap.get(this.ruleObj.Notify).rule_item.Notify=cleanValue;
                        this.ruleObj.Notify.items = cleanValue;
                    };
                    $scope.toggleConditions = function(condition) {
                        condition.selected = !condition.selected;
                    };
                    $scope.hide = function() {
                        setState($scope.user.vmnr,false);
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        setState($scope.user.vmnr,false);
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(rule) {
                        setState($scope.user.vmnr,false);
                        $mdDialog.hide(rule);
                    };

                    function setState(settings,state){
                        settings.editState = false;
                    }

                    function initScope(){
                        $scope.ruleObj = ruleObj;
                        $scope.ruleWeakMap = ruleWeakMap;
                        $scope.msgWeekDays = {
                            btnTitle:function(title=''){
                                this.weekDays.forEach((v,i)=> title = v.selected? `${title} ${v.abr},`:title);
                                return title===''?'Seven-day ':title;
                            },
                            weekDays: [{
                                abr:'Su',
                                selected:false,
                                label :'Sunday',
                                title:''
                            },{
                                abr:'Mo',
                                selected:false,
                                label :'Monday',
                                title:''
                            },{
                                abr:'Tu',
                                selected:false,
                                label :'Tuesday',
                                title:''
                            },{
                                abr:'We',
                                selected:false,
                                label :'Wednesday',
                                title:''
                            },{
                                abr:'Th',
                                selected:false,
                                label :'Thursday',
                                title:''
                            },{
                                abr:'Fr',
                                selected:false,
                                label :'Friday',
                                title:''
                            },{
                                abr:'Sa',
                                selected:false,
                                label :'Saturday',
                                title:''
                            }]
                        };
                        $scope.msgClass = {
                            btnTitle:function(title=''){
                                this.classes.forEach((v,i)=> title = v.selected? `${title} ${v.abr},`:title);
                                return title===''?'Class':title;
                            },
                            classes : [{
                                selected:false,
                                label:'Normal',
                                title:"Normal class of the message 'N'",
                                abr:'N'
                            },{
                                selected:false,
                                label:'Urgent',
                                title:"Urgent messages 'U'",
                                abr:'U'
                            },{
                                selected:false,
                                label:'Private',
                                title:"Private messages 'P'",
                                abr:'P'
                            }]
                        };
                        $scope.conditions = [
                            {
                                id:'media',
                                title:'Msg. media',
                                url:'message-media',
                                label:'Media',
                                selected: angular.isArray(ruleObj.MessageMedia)
                            },{
                                id:'from',
                                title:'Msg. from',
                                url:'message-from',
                                label:'From',
                                selected: angular.isArray(ruleObj.MessageFrom)
                            },{
                                id:'class',
                                title:'Message class',
                                url:'message-class',
                                selected: angular.isArray(ruleObj.MessageClass),
                                label:'Class'
                            },{
                                id:'time',
                                title:'Time of Day',
                                url:'message-time-of-day',
                                label:'Time of Day',
                                selected:angular.isArray(ruleObj.WhenTimeOfDay)
                            },{
                                id:'older',
                                title:'Message is older than',
                                url:'message-is-older',
                                label:'Older than',
                                selected:angular.isArray(ruleObj.MessageOlderThan)
                            },{
                                id:'interval',
                                title:'Interval',
                                url:'message-interval',
                                label:'Interval'
                            },{
                                id:'weekdays',
                                title:'On days of week',
                                url:'message-days-of-week',
                                label:'On days of week',
                                selected:angular.isArray(ruleObj.DaysOfWeek)
                            }
                        ];

                        $scope.toggleInterval = function(state){
                            $scope.interval = {
                                optionState: state,
                                label: state ? 'interval' : 'eachtime'
                            };
                            $scope.conditions[5].selected = state;

                            if (state){
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
        };

        requestServiceFactory.vmnr.getList()
            .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }

                    response.json().then((function(data) {
                        this.user.vmnr.rules = data.vmnr_rules;
                        this.user.vmnr.RAW_rules = angular.copy(data.vmnr_rules);
                        this.$apply();
                    }).bind(this));

                }).bind($scope))
            .catch(err => console.log('Fetch Error :-S', err));
    }
})();