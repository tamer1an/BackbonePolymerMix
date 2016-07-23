(function() {
    'use strict';

    angular
        .module('app.chr')
        .controller('chrController', [
            '$scope',
            '$mdDialog',
            '$mdMedia',
            '$state',
            'requestServiceFactory',
            'User',
            'settings',
            chrController]);


    function chrController($scope, $mdDialog, $mdMedia, $state, requestServiceFactory, User, settings) {
        settings.checkSession(User.getSession(),$state);

        $scope.user = User;
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.navigateTo = function(
                 rule,
                 event,
                 RAW_rule,

                 ruleDetails = rule.rule,
                 ruleObj = {'Conditions':{},Actions:{},Triggers:{}},
                 ruleWeakMap = new WeakMap(),
                 useFullScreen = true //($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen
            ){

            $scope.user.chr.editState = true;

            ////noinspection JSUnresolvedFunction
            for(let section in ruleObj){
                let i=0;
                ruleDetails[section].forEach((v) => {
                    let ruleName = Object.keys(v)[0];

                    if(Object.keys(v)[0]==0){ //TODO: remove true statement after API changes
                        ruleName = 'Updates';
                        ruleObj[section][ruleName] = {'Updates':[]};
                    } else {
                        ruleObj[section][ruleName] = v[ruleName];
                    }

                    ruleWeakMap.set(ruleObj[section][ruleName], {
                        index: i++,
                        ruleName: ruleName,
                        ruleObj: ruleObj,
                        rule_item:v,
                        rule: rule,
                        RAW_rule: RAW_rule
                    });
                });
            }

            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog) {   console.log('Dialog controller');
                    initScope();

                    $scope.toggleConditions = function(condition) {
                        condition.selected = !condition.selected;
                    };
                    $scope.hide = function() {
                        console.log('Dialog hide');
                        setState($scope.user.chr,false);
                        $mdDialog.hide();
                    };
                    $scope.cancel = function() {
                        console.log('Dialog cancel');
                        setState($scope.user.chr,false);
                        $mdDialog.cancel();
                    };
                    $scope.answer = function(rule){
                        console.log('Dialog answer');
                        setState($scope.user.chr,false);
                        $mdDialog.hide(rule);
                    };

                    function setState(settings,state){
                        settings.editState = false;
                    }

                    function initScope() {
                        $scope.ruleObj = ruleObj;
                        $scope.ruleWeakMap = ruleWeakMap;

                        $scope.presence = {
                            btnTitle:function(title=''){
                                this.classes.forEach((v,i)=> title = v.selected? `${title} ${v.label},`:title);
                                return title===''?'Presence':title;
                            },
                            classes : [{
                                selected:false,
                                label:'Logged Out',
                                title:'',
                                abr:'L'
                            },{
                                selected:false,
                                label:'Available',
                                title:'',
                                abr:'A'
                            },{
                                selected:false,
                                label:'Not Available',
                                title:'',
                                abr:'NA'
                            },{
                                selected:false,
                                label:'Busy',
                                title:'',
                                abr:'B'
                            },{
                                selected:false,
                                label:'At Lunch',
                                title:'',
                                abr:'AL'
                            },{
                                selected:false,
                                label:'In a Meeting',
                                title:'',
                                abr:'IM'
                            },{
                                selected:false,
                                label:'Be Right Back',
                                title:'',
                                abr:'BRB'
                            },{
                                selected:false,
                                label:'Appear Offline',
                                title:'',
                                abr:'AO'
                            },{
                                selected:false,
                                label:'On the Phone',
                                title:'',
                                abr:'OtP'
                            }]
                        };
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
                        $scope.triggers = [
                            {
                                title:'Using phone',
                                label:'When i am using the phone',
                                selected: angular.isArray(ruleObj.Triggers.Busy)
                            },{
                                title: 'No Answer',
                                label: 'When no answer',
                                selected: angular.isArray(ruleObj.Triggers.NoAnswer)
                            },{
                                title: 'Incoming call',
                                label: 'All incoming call',
                                selected: angular.isArray(ruleObj.Triggers.AnyCall)
                            }];
                        $scope.conditions = [
                        {
                            title:'Presence',
                            url:'condition-presence',
                            label:'Presence',
                            selected: false
                        },{
                            title: 'Call from...',
                            url:'condition-call-from',
                            label: 'Call from',
                            selected: false
                        },{
                            title: 'Date range',
                            url:'condition-date-range',
                            label: 'Date range',
                            selected: false
                        },{
                            title: 'Time of Day',
                            url:'condition-time-of-day',
                            label: 'Time of Day',
                            selected:false
                        },{
                            title: 'On days of week',
                            url:'condition-days-of-week',
                            label: 'On days of week',
                            selected:false
                        },{
                            title: 'Holidays',
                            url:'condition-holidays',
                            label: 'Holidays',
                            selected:false
                        }];

                        $scope.getDefaultFindMe = () =>  new Object({
                            'FindMe': [{
                                'Try': [{
                                    'To': [{
                                        'Ext': [1]
                                    }, {
                                        'Id': [1]
                                    }, {
                                        'Assigned': ['assigned']
                                    }, {
                                        'All': [true]
                                    }]
                                }, {
                                    'For': [0]
                                }, {
                                    'Ask': [0]
                                }]
                            }, {
                                'Bad': [{'ForwardToVM': ['0']}]
                            }]
                        });
                        $scope.getDefaultForwardTo = ()=> new Object({
                            'ForwardTo':['1001']
                        });
                        $scope.getDefaultForwardToVM = ()=> new Object({
                            'ForwardToVM':['0.p']
                        });
                        $scope.getDefaultReject = ()=> new Object({
                            'Reject':[]
                        });

                        if (ruleObj.Actions.FindMe){
                            $scope.group1 = 'FindMe';
                        } else if(ruleObj.Actions.ForwardTo) {
                            $scope.group1 = 'ForwardTo';
                        } else if(ruleObj.Actions.ForwardToVM) {
                            $scope.group1 = 'ForwardToVM';
                        } else { // (ruleObj.Actions.Reject){
                            $scope.group1 = 'Reject';
                        }
                    }
                },
                scope: angular.extend($scope.$new(), {rule: rule}),
                ariaLabel: 'Dialog',
                templateUrl: 'app/chr/components/dialog.tpl.html',
                parent: angular.element(document.querySelector('.UP_uiView')),
                targetEvent: event,
                clickOutsideToClose:false,
                escapeToClose:false,
                fullscreen: useFullScreen

            }).then(function(answer) {
                $scope.status = `You said the information was "${answer}".`;
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        requestServiceFactory.chr.getList()
            .then((function(response){
                    if (response.status !== 200) {
                        console.log(`Looks like there was a problem. Status Code: ${response.status}`);
                        return;
                    }
                    response.json().then((function(data) {
                        this.user.chr.rules = data.chr_rules;
                        this.user.chr.RAW_rules = angular.copy(data.chr_rules);
                        this.$apply();
                    }).bind(this));

                }).bind($scope))
            .catch(err => console.log('Fetch Error :-S', err));

        //    requestServiceFactory.chr.getList(User)
        //        .then(function successCallback(response) {
        //            debugger
        //            // this callback will be called asynchronously
        //            // when the response is available
        //        }, function errorCallback(response) {
        //            // called asynchronously if an error occurs
        //            // or server returns response with an error status.
        //        });
    }
})();