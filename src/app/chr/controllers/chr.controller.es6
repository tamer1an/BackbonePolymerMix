(function() {
    'use strict';

    angular
        .module('app.chr')
        .controller('ChrController', [
            '$scope',
            '$mdDialog',
            '$state',
            'ChrRequest',
            'User',
            'settings',
            ChrController]);

    /** CHR list Controller in CHR module
     *  name   {ChrController}
     *  params {$scope, $mdDialog, $state, RequestServiceFactory, User, settings}
     *  init   {User, settings} params resoled by config.route.es6
     * */
    function ChrController($scope, $mdDialog, $state, Request, User, settings) {
        settings.checkSession(User.getSession(),$state);
        $scope.user = User;

        const nextRule =  {
            address: '',
            addresseeId: '',
            ownerType: 'User',
            displayUserIDForExCall: false,
            enabled: true,
            number: 1,
            rule: {
                Actions: [{ Reject: [] }],
                Triggers:[{NoAnswer:[5]}],
                Conditions:[]
            },
            ruleId: '',
            ruleName:'New rule'
        };

        function createNextRule(number) {
            if (Object.is(parseInt(number),NaN)){
                return false;
            }
            let rule = new Object(nextRule);
            rule.number = number+2;

            return rule;
        }

        $scope.createNewRule = function(user) {
            return createNextRule((angular.isArray(user.chr.rules))? user.chr.rules.length : 1);
        };
        $scope.createDescription = (rule) => {
            let actions = (angular.isArray(rule.rule.Actions) && rule.rule.Actions.length > 0)?rule.rule.Actions.reduce(
                (x, y) => `${Object.keys(x)[0]} ${Object.keys(y)[0]} `
            ):'';

            let triggers = (angular.isArray(rule.rule.Triggers) && rule.rule.Triggers.length > 0)?rule.rule.Triggers.reduce(
                (x, y) => `${angular.isString(x)?x:Object.keys(x)[0]} ${Object.keys(y)[0]} `
            ):'';

            let conditions = (angular.isArray(rule.rule.Conditions) && rule.rule.Conditions.length > 0)?rule.rule.Conditions.reduce(
                (x, y) => `${angular.isString(x)?x: Object.keys(x)[0]} ${Object.keys(y)[0]} `
            ):'';

            return `${Object.keys(actions)[0]} when ${angular.isObject(triggers)?Object.keys(triggers)[0]:triggers} and ${angular.isObject(conditions)?Object.keys(conditions)[0]:conditions}`;
        };
        $scope.newRule = (user) => {
            if(User.userSession.is_logged) {
                let nextRule = $scope.createNewRule(user);

                if (angular.isObject(nextRule)){
                    $scope.navigateTo(nextRule, false, nextRule);
                }
            }
        };
        $scope.deleteRule = (rule) => {
            Request.deleteRule(rule,$scope)
        };
        $scope.navigateTo = function(
                 rule,
                 targetEvent,
                 RAW_rule = {}, //default params
                 ruleObj = {Conditions:{},Actions:{},Triggers:{}},
                 ruleWeakMap = new WeakMap(),
                 fullscreen = true
            ){

            $scope.user.chr.newRule = (targetEvent === false)?rule:false;
            $scope.user.chr.editState = true;

            for(let section in ruleObj){
                let i=0;

                if(!angular.isUndefined(rule.rule[section]))
                    rule.rule[section].forEach((v) => {
                        let ruleName = Object.keys(v)[0];

                        if(Object.keys(v)[0]==0){ //TODO: remove true statement after API changes
                            ruleName = 'Updates';
                            ruleObj[section][ruleName] = {'Updates':[]};
                        } else {
                            ruleObj[section][ruleName] = v[ruleName];
                        }

                        switch (ruleName){
                            case 'ForwardToVM':
                                var greeting = 0,
                                    greetingSwitch = false;

                                if(angular.isArray(ruleObj[section][ruleName])){
                                    let split = ruleObj[section][ruleName][0].split('.');
                                    greeting = split[0];

                                    if(split.length>1){
                                        greetingSwitch = true;
                                    }
                                }

                                ruleWeakMap.set(ruleObj[section][ruleName], {
                                    rule_item: v,
                                    ruleName: ruleName,
                                    ruleObj: ruleObj,
                                    rule: rule,
                                    RAW_rule: RAW_rule,
                                    action: {
                                        greeting,
                                        greetingSwitch
                                    }
                                });

                                break;
                                
                            case 'TimeFrame':
                                ruleWeakMap.set(ruleObj[section][ruleName], {
                                    ruleName,
                                    ruleObj,
                                    rule,
                                    RAW_rule,
                                    rule_item: v,
                                    parsed : {
                                        frames : [],
                                        genInput(item){
                                            this.frames = _.chunk(item.TimeFrame, 2).map((v)=>{
                                                return {
                                                    from: new Date(1970, 0, 1, v[0].slice(0,2), v[0].slice(3,5) , 0),
                                                    to: new Date(1970, 0, 1, v[1].slice(0,2), v[1].slice(3,5) , 0)
                                                }
                                            });
                                        },
                                        getTime(item){
                                            item.TimeFrame = _.flatten(this.frames.map(function (v) {
                                                let f = v.from.toTimeString().split(' '),
                                                    t = v.to.toTimeString().split(' '),
                                                    fTime = f[0].split(':'),
                                                    tTime = t[0].split(':');

                                                return [fTime[0] + ':' + fTime[1], tTime[0] + ':' + tTime[1]];
                                            }))
                                        },
                                        title(frames){
                                            if (this.frames.length > 0){
                                                return 'from '+ frames.reduce((result,next,i)=>
                                                    `${result}${(i % 2 != 0)?' to':', from'} ${next}`);
                                            }
                                            return 'please select';
                                        },
                                        more(map){
                                            if (map.rule_item.TimeFrame.length <= 4){
                                                map.rule_item.TimeFrame.push('00:00');
                                                map.rule_item.TimeFrame.push('12:00');
                                                map.parsed.genInput(map.rule_item);
                                            }
                                        },
                                        change(map){
                                            map.parsed.getTime(map.rule_item);
                                            map.parsed.title(map.rule_item.TimeFrame);
                                        },
                                        less(map){
                                            map.rule_item.TimeFrame.pop();
                                            map.rule_item.TimeFrame.pop();
                                            map.parsed.genInput(map.rule_item);
                                        }
                                    }
                                });

                                ruleWeakMap.get(ruleObj[section][ruleName]).parsed.genInput(ruleWeakMap.get(ruleObj[section][ruleName]).rule_item);
                                break;

                            case 'FindMe':
                                let sorted = _.groupBy(v.FindMe,(o)=>{ return o.hasOwnProperty('Try')}),
                                    tryMap = [], greeting = 0, greetingSwitch = false;

                                if (angular.isArray(sorted.true)){
                                    tryMap = sorted.true.map((v)=> {
                                        return v.Try[0].To;
                                    }).map((v)=> {
                                        let y = {};
                                        v.forEach((i)=> {
                                            y[Object.keys(i)[0]] = i[Object.keys(i)[0]]
                                        });
                                        return y;
                                    });
                                } else {
                                    if (angular.isObject(sorted)){
                                        sorted.true = [];
                                    }else{
                                        sorted = {
                                            true:[],
                                            bad:[]
                                        }
                                    }
                                }

                                if(angular.isArray(sorted.false[0].Bad[0].ForwardToVM)){
                                    let split = sorted.false[0].Bad[0].ForwardToVM[0].split('.');
                                        greeting = split[0];

                                    if(split.length>1){
                                        greetingSwitch = true;
                                    }
                                }

                                ruleWeakMap.set(ruleObj[section][ruleName], {
                                    ruleName,
                                    ruleObj,
                                    rule,
                                    RAW_rule,
                                    rule_item: v,
                                    action: {
                                        try: sorted.true,
                                        bad: sorted.false,
                                        allItems:[],
                                        badInputModel:[],
                                        currentIdx:0,
                                        tryMap,
                                        greeting,
                                        greetingSwitch,
                                        get titleBad(){
                                            if (angular.isArray(this.bad))
                                                return Object.keys(this.bad[0].Bad[0])[0] || "please select";
                                        },
                                        get all(){
                                            let m = this.tryMap.map((v)=>_.concat(v.All, v.Id, v.Assigned, v.Ext));
                                            m.forEach((i,key)=>{
                                                m[key] = i.map((v)=>{
                                                    return { businessPhone:v }
                                                })
                                            });
                                            this.allItems = m;
                                            this.badInputModel = this.bad[0].Bad[0][Object.keys(this.bad[0].Bad[0])[0]];

                                            return this.allItems;
                                        }
                                    }
                                });
                                break;

                            case 'DateRange':
                                let fActive = ruleObj.Conditions.DateRange[0].length>1,
                                    tActive = ruleObj.Conditions.DateRange[1].length>1;

                                ruleWeakMap.set(ruleObj[section][ruleName], {
                                    ruleName,
                                    ruleObj,
                                    rule,
                                    RAW_rule,
                                    rule_item: v,
                                    parsed: {
                                        from: {
                                            date: fActive? new Date(ruleObj.Conditions.DateRange[0]) : new Date(),
                                            active:fActive
                                        },
                                        to: {
                                            date:tActive?new Date(ruleObj.Conditions.DateRange[1]): new Date(),
                                            active:tActive
                                        },
                                        title(dateRange){
                                            let title = 'Please select';

                                            if (this.from.active || this.to.active){
                                                let f = this.from.date.toLocaleDateString(),
                                                    t = this.to.date.toLocaleDateString();

                                                title =`${this.from.active?`from ${f}`:``} ${this.to.active?`to ${t}`:``}`;
                                                dateRange[0] = (this.from.active)? f : '';
                                                dateRange[1] = (this.to.active)  ? t : '';
                                            }
                                            return title;
                                        }
                                    }
                                });
                                break;

                            default:
                                ruleWeakMap.set(ruleObj[section][ruleName], {
                                    rule_item: v,
                                    ruleName,
                                    ruleObj,
                                    rule,
                                    RAW_rule
                                });
                        }
                    });
            }

            $scope.createRule = (rule) => {
                Request.createRule(rule,$scope)
            };

            $scope.saveRule = (rule) => {
                Request.saveRule(rule,$scope)
            };

            $scope.onFindMeToVMChangeGreet= (map) => {
               let FT = (map.ruleName == 'ForwardToVM')? map.rule_item.ForwardToVM : map.action.bad[0].Bad[0].ForwardToVM,
                   split = FT[0].split('.');

                   FT[0] =  (split.length > 1)?map.action.greeting + '.p':FT[0] =  map.action.greeting;
            };

            $scope.onFindMeToVMChange = (map) => {
                let FT = map.ruleName == 'ForwardToVM'? map.rule_item.ForwardToVM : map.action.bad[0].Bad[0].ForwardToVM,
                    split = FT[0].split('.');

                if(map.action.greetingSwitch){
                    if (split.length <= 1)
                        FT[0] +='.p';
                } else {
                    FT[0] = split[0];
                }
            };

            $scope.selectFindMeBad = (map,badRuleName) => {
                let bad = {Bad:[{[badRuleName]:[]}]},
                    badRule = bad.Bad[0][badRuleName];

                _.pull(map.ruleObj.Actions.FindMe, map.action.bad[0]);
                map.action.bad.shift();

                switch (badRuleName){
                    case 'Reject':
                        break;

                    case 'ForwardToVM':
                        badRule.push('0');
                        break;

                    case 'ForwardTo':
                        badRule.push('1001');
                        break;
                }

                map.action.badInputModel = badRule;
                map.action.bad.unshift(bad);
                map.ruleObj.Actions.FindMe.push(bad);
            };

            $scope.addTry = (map,tryRule) => {
                if (angular.isArray(map.action.try) && map.action.try.length >= 4)
                    return;

                let sorted = [tryRule],
                    tryMap = [];

                tryMap = sorted.map(function (v) {
                    return v.Try[0].To;
                }).map(function (v) {
                    let y = {};
                    v.forEach(function (i) {
                        y[Object.keys(i)[0]] = i[Object.keys(i)[0]];
                    });
                    return y;
                });

                map.rule_item.FindMe.unshift(tryRule);
                map.action.try.unshift(tryRule);
                map.action.tryMap.unshift(tryMap[0]);
            };
            
            $scope.deleteTry = (key, tryRule, map) => {
                if (angular.isArray(map.rule_item.FindMe)){
                    _.pull(map.rule_item.FindMe, tryRule);
                    _.pull(map.action.try, tryRule);
                    _.pull(map.action.tryMap,map.action.tryMap[key]);
                    map.action.all;
                }
            };

            $mdDialog.show({
                controller: function DialogController($scope, $mdDialog, RequestServiceFactory) {   console.log('Dialog controller');
                    var self = $scope;
                    self.querySearch = querySearch;
                    self.allContacts = ((s)=>s.User.addressBook)($scope);
                    self.contacts = [self.allContacts[0]];
                    self.filterSelected = true;

                    $scope.findAnyCheck = (name,checked=false,map,idx) =>{
                        switch (name){
                            case 'bound':
                            case 'home':
                            case 'cell':
                            case 'assigned':
                                if(checked)
                                    _.pull(map.action.tryMap[idx].Assigned,name);
                                else
                                    map.action.tryMap[idx].Assigned.push(name);

                                break;

                            default:
                                map.action.tryMap[idx].All[0] = !checked
                        }
                        map.action.all;
                    };
                    /**
                     * Search for contacts.
                     */
                    function querySearch (query) {
                        var results = query ?
                            self.allContacts.filter(createFilterFor(query)) : [];
                        return results;
                    }
                    /**
                     * Create filter function for a query string
                     */
                    function createFilterFor(query) {
                        var lowercaseQuery = angular.lowercase(query);
                        return function filterFn(contact) {
                            return (contact.businessPhone.indexOf(lowercaseQuery) != -1);
                        };
                    }

                    function changeEditState(settings,state){
                        settings.editState = state;
                    }
                    initScope();
                    $scope.toggleConditionsSwitch = function(condition) {
                        condition.selected = !condition.selected;
                        if (!angular.isArray(this.rule.rule.Conditions)){
                            this.rule.rule.Conditions = [];
                        }

                        if(condition.selected){
                            this.ruleObj.Conditions[condition.type] = [];
                            this.rule.rule.Conditions.push({
                                [condition.type] : this.ruleObj.Conditions[condition.type]
                            });

                            switch (condition.type){
                                case 'TimeFrame':
                                    ruleWeakMap.set(this.ruleObj.Conditions[condition.type], {
                                        ruleName: condition.type,
                                        ruleObj: this.ruleObj,
                                        rule_item:this.rule.rule.Conditions[this.rule.rule.Conditions.length-1],
                                        rule: this.rule,
                                        RAW_rule: this.RAW_rule,
                                        parsed : {
                                            frames : [{
                                                from: new Date(1970, 0, 1, '00', '00', 0),
                                                to: new Date(1970, 0, 1, '12', '00' , 0)
                                            }],
                                            genInput(item){
                                                this.frames = _.chunk(item.TimeFrame, 2).map((v)=>{
                                                    return {
                                                        from: new Date(1970, 0, 1, v[0].slice(0,2), v[0].slice(3,5) , 0),
                                                        to: new Date(1970, 0, 1, v[1].slice(0,2), v[1].slice(3,5) , 0)
                                                    }
                                                });
                                            },
                                            getTime(item){
                                                item.TimeFrame = _.flatten(this.frames.map(function (v) {
                                                    let f = v.from.toTimeString().split(' '),
                                                        t = v.to.toTimeString().split(' '),
                                                        fTime = f[0].split(':'),
                                                        tTime = t[0].split(':');

                                                    return [fTime[0] + ':' + fTime[1], tTime[0] + ':' + tTime[1]];
                                                }))
                                            },
                                            title(frames){
                                                if (this.frames.length > 0){
                                                    return 'from '+ frames.reduce((result,next,i)=>
                                                            `${result}${(i % 2 != 0)?' to':', from'} ${next}`)
                                                }
                                                return 'please select';
                                            },
                                            more(map){
                                                if (map.rule_item.TimeFrame.length <= 4){
                                                    map.rule_item.TimeFrame.push('00:00');
                                                    map.rule_item.TimeFrame.push('12:00');
                                                    map.parsed.genInput(map.rule_item);
                                                }
                                            },
                                            change(map){
                                                map.parsed.getTime(map.rule_item);
                                                map.parsed.title(map.rule_item.TimeFrame);
                                            },
                                            less(map){
                                                map.rule_item.TimeFrame.pop();
                                                map.rule_item.TimeFrame.pop();
                                                map.parsed.genInput(map.rule_item);
                                            }
                                        }
                                    });

                                    this.ruleWeakMap.get(this.ruleObj.Conditions[condition.type])
                                               .parsed
                                               .genInput(this.ruleWeakMap.get(this.ruleObj.Conditions[condition.type]).rule_item);
                                    break;


                                case 'DateRange':
                                    let fActive = 0,
                                        tActive = 0;

                                    ruleWeakMap.set(ruleObj.Conditions[condition.type], {
                                        ruleName: condition.type,
                                        rule_item: rule.rule.Conditions[rule.rule.length-1],
                                        rule,
                                        ruleObj,
                                        RAW_rule,
                                        parsed: {
                                            from: {
                                                date: fActive? new Date(ruleObj.Conditions.DateRange[0]) : new Date(),
                                                active:fActive
                                            },
                                            to: {
                                                date:tActive?new Date(ruleObj.Conditions.DateRange[1]): new Date(),
                                                active:tActive
                                            },
                                            title(dateRange){
                                                let title = 'Please select';

                                                if (this.from.active || this.to.active){
                                                    let f = this.from.date.toLocaleDateString(),
                                                        t = this.to.date.toLocaleDateString();

                                                    title =`${this.from.active?`from ${f}`:``} ${this.to.active?`to ${t}`:``}`;
                                                    dateRange[0] = (this.from.active)? f : '';
                                                    dateRange[1] = (this.to.active)  ? t : '';
                                                }

                                                return title;
                                            }
                                        }
                                    });

                                    break;


                                default:
                                    ruleWeakMap.set(this.ruleObj.Conditions[condition.type],{
                                        ruleName: condition.type,
                                        rule_item: rule.rule.Conditions[rule.rule.length-1],
                                        ruleObj,
                                        rule,
                                        RAW_rule
                                    });
                            }
                        } else{
                            ruleWeakMap.delete(this.ruleObj.Conditions[condition.type]);
                            delete this.ruleObj.Conditions[condition.type];
                            this.rule.rule.Conditions = this.rule.rule.Conditions.filter(function(v){
                                let f = this.ruleObj.Conditions[Object.keys(v)[0]];
                                return angular.isArray(f) || angular.isObject(f);
                            },this);
                        }
                    };

                    $scope.callFromAny = function (type,condition,src) {
                        if (condition.incomingSrc[type]){
                            if (src.CallFrom.indexOf(type) !== -1)
                                _.pull(src.CallFrom,type);

                            condition.incomingSrc[type] = false;
                        } else {
                            if (src.CallFrom.indexOf(type) === -1)
                                src.CallFrom.push(type);

                            condition.incomingSrc[type] = true;
                        }
                    };
                    $scope.toggleConditions = function(condition,type) {
                        condition.selected = !condition.selected;
                        switch (type){
                            case 'Trigger':
                                let i = this.ruleObj.Triggers.hasOwnProperty(condition.id);
                                if (condition.selected && !i) {
                                    this.ruleObj.Triggers[condition.id] = [];
                                    this.rule.rule.Triggers.push({[condition.id] : this.ruleObj.Triggers[condition.id]});
                                    this.ruleWeakMap.set(this.ruleObj.Triggers[condition.id],{
                                        ruleName: condition.id,
                                        ruleObj: this.ruleObj,
                                        rule_item:rule.rule.Triggers[rule.rule.Triggers.length-1],
                                        rule: this.rule,
                                        RAW_rule: this.RAW_rule
                                    })
                                } else if (!condition.selected && i) {
                                    ruleWeakMap.delete(this.ruleObj.Triggers[condition.id]);
                                    delete this.ruleObj.Triggers[condition.id];
                                    this.rule.rule.Triggers = this.rule.rule.Triggers.filter(function(v){
                                        let f = this.ruleObj.Triggers[Object.keys(v)[0]];
                                        return angular.isArray(f) || angular.isObject(f)
                                    },this);
                                }
                                break;

                            case 'WeekDays':
                                let day = condition.day,
                                    include = this.ruleObj.Conditions[type].includes(day);

                                if(condition.selected && !include){
                                    this.ruleObj.Conditions[type].push(day);
                                } else if(!condition.selected && include) {
                                    _.pull(this.ruleObj.Conditions[type],day);
                                }

                                break;

                            case 'Presence':
                                let idx =  condition.index,
                                    inc = this.ruleObj.Conditions[type].includes(idx);

                                if(condition.selected && !inc){
                                    this.ruleObj.Conditions[type].push(idx);
                                } else if(!condition.selected && inc) {
                                    _.pull(this.ruleObj.Conditions[type],idx);
                                }

                                break;
                        }
                    };
                    $scope.cancel = function(option) {
                        changeEditState($scope.user.chr,false);
                        $mdDialog[option]();
                    };
                    $scope.save = function(rule){
                        if(angular.isArray(this.ruleObj.Conditions.TimeFrame))
                            ruleWeakMap.get(this.ruleObj.Conditions.TimeFrame)
                               .parsed.getTime(
                                    this.ruleWeakMap.get(this.ruleObj.Conditions.TimeFrame).rule_item
                                );

                        if(angular.isArray(this.ruleObj.Actions.FindMe)){
                            this.ruleWeakMap.get(this.ruleObj.Actions.FindMe)
                                .action.tryMap.forEach((v)=>{
                                    while (v.Assigned.length > 0){
                                        v.Assigned.pop();
                                    }
                                    while (v.Ext.length > 0){
                                        v.Ext.pop();
                                    }
                                    while (v.Id.length > 0){
                                        v.Id.pop();
                                    }
                                    while (v.All.length > 0){
                                        v.All.pop();
                                    }
                            });

                            this.ruleWeakMap.get(this.ruleObj.Actions.FindMe)
                                .action.allItems.forEach(function(v,k){

                                v.forEach(function(item){
                                    switch (item.businessPhone){
                                        case 'bound':
                                        case 'home':
                                        case 'cell':
                                        case 'assigned':
                                            this.map.action.tryMap[this.key].Assigned.push(item.businessPhone);
                                            break;

                                        case true:
                                            this.map.action.tryMap[this.key].All.push(item.businessPhone);
                                            break;

                                        default:
                                            if(angular.isString(item.businessPhone) && angular.isArray(item.businessPhone.match(/[A-Za-z]/))){
                                                this.map.action.tryMap[this.key].Id.push(item.businessPhone);
                                            } else {
                                                this.map.action.tryMap[this.key].Ext.push(item.businessPhone);
                                            }
                                            break;
                                    }
                                },{map:this,key:k})
                            },this.ruleWeakMap.get(this.ruleObj.Actions.FindMe));
                        }

                        if ($scope.User.chr.newRule === false){
                            $scope.saveRule(rule);
                        }else{
                            $scope.createRule(rule);
                        }

                        changeEditState($scope.user.chr,false);
                        $mdDialog.hide(rule);
                    };

                    function initTimeOfDay (selected){
                        if (selected){
                            //TODO: debugger
                        }
                    }

                    function initScope() {
                        const defaultTitle = {
                            d: 'please select'
                        };

                        $scope.ruleObj = ruleObj;
                        $scope.ruleWeakMap = ruleWeakMap;

                        $scope.presence = {
                            btnTitle:function(title=''){
                                this.classes.forEach((v,i)=> title = v.selected? `${title} ${v.label},`:title);
                                return title===''?defaultTitle.d:title;
                            },
                            classes : [{
                                index: 0,
                                selected:false,
                                label:'Logged Out',
                                title:'',
                                abr:'L'
                            },{
                                index: 1,
                                selected:false,
                                label:'Available',
                                title:'',
                                abr:'A'
                            },{
                                index: 2,
                                selected:false,
                                label:'Not Available',
                                title:'',
                                abr:'NA'
                            },{
                                index: 3,
                                selected:false,
                                label:'Busy',
                                title:'',
                                abr:'B'
                            },{
                                index: 4,
                                selected:false,
                                label:'At Lunch',
                                title:'',
                                abr:'AL'
                            },{
                                index: 5,
                                selected:false,
                                label:'In a Meeting',
                                title:'',
                                abr:'IM'
                            },{
                                index: 6,
                                selected:false,
                                label:'Be Right Back',
                                title:'',
                                abr:'BRB'
                            },{
                                index: 7,
                                selected:false,
                                label:'Appear Offline',
                                title:'',
                                abr:'AO'
                            },{
                                index: 8,
                                selected:false,
                                label:'On the Phone',
                                title:'',
                                abr:'OtP'
                            }]
                        };

                        $scope.presence.classes.forEach(function(v,i){
                            if (angular.isArray(ruleObj.Conditions && ruleObj.Conditions.Presence))
                                v.selected = ruleObj.Conditions.Presence.includes(i);
                        },ruleObj);

                        $scope.msgWeekDays = {
                            btnTitle:function(title=''){
                                this.weekDays.forEach((v,i)=> title = v.selected? `${title} ${v.abr},`:title);
                                return title===''?defaultTitle.d:title;
                            },
                            weekDays: [{
                                abr:'Su',
                                selected:false,
                                label :'Sunday',
                                day:0,
                                title:''
                            },{
                                abr:'Mo',
                                day:1,
                                selected:false,
                                label :'Monday',
                                title:''
                            },{
                                abr:'Tu',
                                selected:false,
                                label :'Tuesday',
                                day:2,
                                title:''
                            },{
                                abr:'We',
                                selected:false,
                                day:3,
                                label :'Wednesday',
                                title:''
                            },{
                                abr:'Th',
                                selected:false,
                                label :'Thursday',
                                day:4,
                                title:''
                            },{
                                abr:'Fr',
                                selected:false,
                                label :'Friday',
                                day:5,
                                title:''
                            },{
                                abr:'Sa',
                                day:6,
                                selected:false,
                                label :'Saturday',
                                title:''
                            }]
                        };

                        $scope.msgWeekDays.weekDays.forEach(function(v){
                            if (angular.isArray(ruleObj.Conditions && ruleObj.Conditions.WeekDays))
                                v.selected = ruleObj.Conditions.WeekDays.includes(v.day);
                        },ruleObj);

                        $scope.triggers = [
                            {
                                id: 'Busy',
                                title:'Using phone',
                                label:'When i am using the phone',
                                selected: angular.isArray(ruleObj.Triggers.Busy)
                            },{
                                id: 'NoAnswer',
                                title: 'No Answer',
                                label: 'When no answer',
                                selected: angular.isArray(ruleObj.Triggers.NoAnswer)
                            },{
                                id: 'AnyCall',
                                title: 'Incoming call',
                                label: 'All incoming call',
                                selected: angular.isArray(ruleObj.Triggers.AnyCall)
                            }];

                        $scope.conditions = [
                        {
                            title:'Presence',
                            url:'condition-presence',
                            label:'Presence',
                            type:'Presence',
                            selected: angular.isArray(ruleObj.Conditions.Presence)
                        },{
                            type:'CallFrom',
                            title: 'Call from...',
                            url:'condition-call-from',
                            label: 'Call from',
                            incomingSrc: {
                                Internal: false,
                                External: false
                            },
                            selected: angular.isArray(ruleObj.Conditions.CallFrom)
                        },{
                            type:'DateRange',
                            title: 'Date range',
                            url:'condition-date-range',
                            label: 'Date range',
                            selected: angular.isArray(ruleObj.Conditions.DateRange)
                        },{
                            type:'TimeFrame',
                            title: 'Time of Day',
                            url:'condition-time-of-day',
                            label: 'Time of Day',
                            selected:angular.isArray(ruleObj.Conditions.TimeFrame)
                        },{
                            type:'WeekDays',
                            title: 'On days of week',
                            url:'condition-days-of-week',
                            label: 'On days of week',
                            selected:angular.isArray(ruleObj.Conditions.WeekDays)
                        },{
                            type:'Holidays',
                            title: 'Holidays',
                            url:'condition-holidays',
                            label: 'Holidays',
                            selected:angular.isArray(ruleObj.Conditions.Holidays)
                        }];

                        if(angular.isObject(ruleObj.Conditions) && angular.isArray(ruleObj.Conditions.CallFrom)) {
                            $scope.conditions[1].incomingSrc.Internal = (ruleObj.Conditions.CallFrom.indexOf('Internal') !== -1);
                            $scope.conditions[1].incomingSrc.External = (ruleObj.Conditions.CallFrom.indexOf('External') !== -1);
                        }

                        initTimeOfDay(_.find($scope.conditions,{type:'TimeFrame'}).selected);

                        $scope.getDefaultTry = () =>  new Object({
                            'Try': [{
                                'To': [{
                                    'Ext': []
                                }, {
                                    'Id': []
                                }, {
                                    'Assigned': ['assigned']
                                }, {
                                    'All': []
                                }]
                            }, {
                                'For': [0]
                            }, {
                                'Ask': [0]
                            }]
                        });
                        $scope.getDefaultFindMe = () =>  {
                            return new Object({
                                'Try': [{
                                    'To': [{
                                        'Ext': []
                                    }, {
                                        'Id': []
                                    }, {
                                        'Assigned': ['assigned']
                                    }, {
                                        'All': []
                                    }]
                                }, {
                                    'For': [0]
                                }, {
                                    'Ask': [0]
                                }]
                            });
                        };
                        $scope.getDefaultFindMe = function () {
                            let action = new Object({
                                'FindMe': [{
                                    'Try': [{
                                        'To': [{
                                            'Ext': []
                                        }, {
                                            'Id': []
                                        }, {
                                            'Assigned': ['assigned']
                                        }, {
                                            'All': []
                                        }]
                                    }, {
                                        'For': [0]
                                    }, {
                                        'Ask': [0]
                                    }]
                                }, {
                                    'Bad': [{ 'ForwardToVM': ['0'] }]
                                }]
                            });

                            this.ruleObj.Actions = action;

                            let sorted = [action.FindMe[0]],
                                tryMap = [], greeting = 0, greetingSwitch = false;

                            tryMap = sorted.map((v) => v.Try[0].To).map((v) => {
                                let y = {};
                                v.forEach((i) => y[Object.keys(i)[0]] = i[Object.keys(i)[0]]);
                                return y;
                            });

                            if(angular.isArray(action.FindMe[1].Bad[0].ForwardToVM)){
                                let split = action.FindMe[1].Bad[0].ForwardToVM[0].split('.')

                                if(split.length>1){
                                    greeting = split[0];
                                    greetingSwitch = true;
                                }
                            }

                            this.ruleWeakMap.set(this.ruleObj.Actions.FindMe, {
                                ruleName: 'FindMe',
                                ruleObj:this.ruleObj,
                                rule:this.rule,
                                RAW_rule:this.RAW_rule,
                                rule_item: action,
                                action: {
                                    try: [action.FindMe[0]],
                                    bad: [action.FindMe[1]],
                                    allItems:[],
                                    badInputModel:[],
                                    tryMap:[tryMap[0]],
                                    currentIdx:0,
                                    greetingSwitch,
                                    greeting,
                                    get titleBad(){
                                        if (angular.isArray(this.bad))
                                            return Object.keys(this.bad[0].Bad[0])[0] || "please select";
                                    },
                                    get all(){
                                        let m = this.tryMap.map((v)=>_.concat(v.All, v.Id, v.Assigned, v.Ext));
                                        m.forEach(
                                            (i,key) => m[key] = i.map((v)=> new Object({ businessPhone:v }))
                                        );
                                        this.allItems = m;
                                        this.badInputModel = this.bad[0].Bad[0][Object.keys(this.bad[0].Bad[0])[0]];
                                        return this.allItems;
                                    }
                                }
                            });
                            this.rule.rule.Actions = [action];
                        };
                        $scope.getDefaultForwardTo = function (){
                            this.ruleObj.Actions =  new Object({
                                'ForwardTo':['1001']
                            });
                            this.rule.rule.Actions = [this.ruleObj.Actions];
                        };
                        $scope.getDefaultForwardToVM =  function (){
                            let greetingSwitch = false,
                                greeting = 0,
                                action = { 'ForwardToVM':['0.p'] };
                            this.ruleObj.Actions = action;
                            this.ruleWeakMap.set(this.ruleObj.Actions.ForwardToVM, {
                                rule_item: action,
                                ruleName: 'ForwardToVM',
                                ruleObj:this.ruleObj,
                                rule:this.rule,
                                RAW_rule:this.RAW_rule,
                                action: {
                                    greetingSwitch,
                                    greeting
                                }
                            });
                            this.rule.rule.Actions = [action];
                        };
                        $scope.getDefaultReject = ()=> new Object({
                            'Reject':[]
                        });

                        $scope.findMeTitile = (v,k) => (angular.isObject(v))
                            ? v.businessPhone
                            : `${v} ${k.businessPhone}`;

                        $scope.toggleFindMeUpdates = function(findMe) {
                            if(findMe.indexOf("Updates")!=-1){
                                _.pull(this.ruleWeakMap.get(findMe).action.bad,"Updates");
                                _.pull(findMe,"Updates")
                            } else {
                                this.ruleWeakMap.get(findMe).action.bad.push("Updates");
                                findMe.push("Updates")
                            }
                        };

                        if (ruleObj.Actions.FindMe){
                            $scope.currentAction = 'FindMe';
                        } else if(ruleObj.Actions.ForwardTo) {
                            $scope.currentAction = 'ForwardTo';
                        } else if(ruleObj.Actions.ForwardToVM) {
                            $scope.currentAction = 'ForwardToVM';
                        } else {
                            $scope.currentAction = 'Reject';
                        }
                    }
                },
                scope: angular.extend($scope.$new(), {rule: rule}),
                ariaLabel: 'Dialog',
                templateUrl: 'app/chr/components/dialog.tpl.html',
                parent: angular.element(document.querySelector('.UP_uiView')),
                clickOutsideToClose:false,
                escapeToClose:false,
                targetEvent,
                fullscreen
            }).then(function(answer) {
                $scope.status = `You said the information was "${answer}".`;
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
        };

        if(User.userSession.is_logged){
            Request.getList($scope);
        }
    }
})();