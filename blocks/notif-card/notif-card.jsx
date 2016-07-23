modules.define(
    'notif-card',
    ['react', 'button', 'dropdown', 'checkbox', 'input', 'underscore', 'cookie',
     'jquery', 'i-error', 'time-range', 'call-from', 'date-range', 'find-me',
     'glyphicon'],
    function(provide, React, Button, Dropdown, Checkbox, Input, _, Cookie, $,
                iError, TimeRange, CallFrom, DateRange, FindMe, Glyphicon) {
    var blockName = this.name,
        NotifCard = React.createClass({
            defaultNotifyCall: {
                 "Transport" : [{
                     "By" : [ "call" ]
                 },{
                     "Destination" : [ ]
                 },{
                     "CallMethod" : [ "simultaneously" ]
                 },{
                     "Attempts" : [ 0 ]
                 },{
                     "ToAttach" : [ false ]
                 },{
                     "Pause" : [ 0 ]
                 }]
             },
            defaultNotifyEmail: {
                "Transport": [{
                    "By": ["e-mail"]
                },{
                    "Destination": [ ]
                },{
                    "CallMethod": [ "simultaneously" ]
                },{
                    "ToAttach": [ false ]
                },{
                    "Pause": [ 0 ]
                }]
            },
            getInitialState: function() {
                var conditions, rule = {
                    Enabled: [],
                    NotifInterval: [],
                    MessageOlderThan: [],
                    MessageFrom: [],
                    WhenTimeOfDay: [],
                    MessageMedia: [],
                    MessageClass: [],
                    DaysOfWeek: [],
                    Notify: [],
                    IfUnread: []
                }, MessageFrom, MessageMedia, MessageClass, DaysOfWeek, MessageOlderThan, WhenTimeOfDay, IfUnread, NotifInterval, Notify;

                this.defaultPlaceHolder = 'Please, specify';
                this.NotifInterval = 'Notification interval';
                this.triggersDescription = ['Each time I recive a new message', 'With an aggregated notification at a regular interval'];
                this.IfUnreadDescription = ['Leave the message marked as unread on phone system', 'Mark the message as saved on the system', 'Delete the message from my mailbox on the phone'];
                this.mediaTypes = ['Voice', 'Fax'];
                this.MessageClass = ['Normal', 'Urgent', 'Private'];
                this.DaysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                this.IfUnread = ['mark_unread', 'mark_saved', 'delete'];
                this.attachMessage = ['do not attach message', 'attach message'];
                this.callMethodMessage = ['simultaneously', 'sequentially'];

                this.props.rule.rule.forEach(function (v) {
                    rule[Object.keys(v)[0]] = v[Object.keys(v)[0]];
                });
                this.rule = JSON.parse(JSON.stringify(this.props.rule));

                //////// Notify /////////
                Notify = {
                    active: Array.isArray(rule.Notify) && rule.Notify.length > 0,
                    elements: []
                };
                if (Notify.active) {
                    Notify.elements = rule.Notify;
                } else {
                    this.rule.rule.push({"Notify": []})
                }
                //////// IfUnread /////////
                IfUnread = {
                    active: Array.isArray(rule.IfUnread) && rule.IfUnread.length > 0,
                    text: this.IfUnread[0],
                    checked: [0]
                };
                if (IfUnread.active) {
                    IfUnread.checked = this.IfUnread.indexOf(rule.IfUnread[0]);
                    IfUnread.text = this.IfUnreadDescription[IfUnread.checked];
                }
                //////// NotifInterval /////////
                NotifInterval = {
                    active: Array.isArray(rule.NotifInterval) && rule.NotifInterval.length > 0,
                    text: this.defaultPlaceHolder,
                    Period: 0,
                    StartFrom: '00:00',
                    state: {
                        min: 0,
                        hr: 0,
                        dt: 'AM'
                    }
                };
                if (NotifInterval.active) {
                    NotifInterval.Period    = rule.NotifInterval[0].Period[0];
                    NotifInterval.StartFrom = rule.NotifInterval[1].StartFrom[0];

                    var intervalCalc = this.getInterval(NotifInterval,true);

                    NotifInterval.state.hr  = intervalCalc.hr;
                    NotifInterval.state.dt  = intervalCalc.dt;
                    NotifInterval.state.min = intervalCalc.min;
                    NotifInterval.text      = intervalCalc.text;
                }
                //////// MessageFrom /////////
                MessageFrom  = {
                    active: Array.isArray(rule.MessageFrom) && rule.MessageFrom.length>0,
                    text: this.defaultPlaceHolder,
                    inputValue: ''
                };
                if (MessageFrom.active){
                    MessageFrom.text = rule.MessageFrom[0];
                    MessageFrom.inputValue = rule.MessageFrom[0];
                }
                //////// MessageOlderThan /////////
                MessageOlderThan = {
                    active:(Array.isArray(rule.MessageOlderThan) && rule.MessageOlderThan.length>0),
                    text: this.defaultPlaceHolder,
                    seconds:0,
                    current:{
                        days:0,
                        hours:0,
                        minutes:0,
                        seconds:0
                    }
                };
                if (MessageOlderThan.active){
                    MessageOlderThan.seconds = parseInt(rule.MessageOlderThan[0]);
                    MessageOlderThan.current = this.getConvertOlderThanTime(parseInt(rule.MessageOlderThan[0])*1000);
                    MessageOlderThan.text = this.getOlderThanString(MessageOlderThan.current);
                }
                //////// MessageMedia /////////
                MessageMedia = {
                    active: Array.isArray(rule.MessageMedia) && rule.MessageMedia.length>0,
                    checked:0,
                    text: this.defaultPlaceHolder
                };
                if (MessageMedia.active){
                    MessageMedia.checked = (rule.MessageMedia[0]=='fax')?1:0;
                    MessageMedia.text = this.mediaTypes[MessageMedia.checked];
                }
                //////// WhenTimeOfDay /////////
                WhenTimeOfDay = {
                    active:(Array.isArray(rule.WhenTimeOfDay) && rule.WhenTimeOfDay.length>0),
                    text: this.defaultPlaceHolder,
                    from:'00:00',
                    to:'12:00',
                    h24:{
                        from:'00:00',
                        to:'00:00'
                    }
                };
                if (WhenTimeOfDay.active){
                    WhenTimeOfDay.text = this.createWhenTimeOfDayTitle([rule.WhenTimeOfDay[0], rule.WhenTimeOfDay[1]]);
                    WhenTimeOfDay.from = rule.WhenTimeOfDay[0];
                    WhenTimeOfDay.to = rule.WhenTimeOfDay[1];
                    WhenTimeOfDay.h24.from = rule.WhenTimeOfDay[0];
                    WhenTimeOfDay.h24.to = rule.WhenTimeOfDay[1];
                }
                //////// WhenTimeOfDay /////////
                DaysOfWeek = {
                    text: this.defaultPlaceHolder,
                    active:(rule.DaysOfWeek.length || rule.DaysOfWeek.length>0)?true:false,
                    checked:[false,false,false,false,false,false,false]
                };
                if (DaysOfWeek.active){
                    rule.DaysOfWeek.forEach(function(v){
                        DaysOfWeek.checked[v] = true;
                    });
                    DaysOfWeek.text = this.createHeaderString(DaysOfWeek.checked,'DaysOfWeek').join(' ');
                }
                //////// MessageClass /////////
                MessageClass = {
                    text: this.defaultPlaceHolder,
                    active:(Array.isArray(rule.MessageClass) && rule.MessageClass.length>0),
                    checked:[false,false,false]
                };
                if (MessageClass.active){
                    MessageClass.checked = this.MessageClass.map(function(v){
                        return (rule.MessageClass.includes(v.toLowerCase()));
                    });
                    MessageClass.text = this.createHeaderString(MessageClass.checked,'MessageClass').join(' ');
                }

                //////// conditions /////////
                conditions = [
                    {
                        text: 'Message media',
                        name: 'MessageMedia',
                        checked: MessageMedia.active,
                        visibility: MessageMedia.active
                    },{
                        text: 'Message class',
                        name: 'MessageClass',
                        checked: MessageClass.active,
                        visibility: MessageClass.active,
                        content: this.MessageClass
                    }
                    ,{
                        text: 'Message from...',
                        name: 'MessageFrom',
                        checked: MessageFrom.active,
                        visibility: MessageFrom.active
                    },{
                        text: 'Message is older than',
                        name: 'MessageOlderThan',
                        checked: MessageOlderThan.active,
                        visibility:MessageOlderThan.active
                    },{
                        text: 'Time of day',
                        name: 'WhenTimeOfDay',
                        checked:  WhenTimeOfDay.active,
                        visibility:  WhenTimeOfDay.active
                    },{
                        text: 'On days of week',
                        name: 'DaysOfWeek',
                        checked: DaysOfWeek.active,
                        visibility:DaysOfWeek.active,
                        content: this.DaysOfWeek
                    },{
                        text: 'Notification interval',
                        name: 'NotifInterval',
                        checked: NotifInterval.active,
                        visibility: NotifInterval.active
                    }
                ];

                return {
                    rule: rule,
                    warning: false,
                    edit: false,
                    conditions: conditions,
                    Enabled: rule.Enabled[0],
                    NotifInterval: NotifInterval,
                    IfUnread: IfUnread,
                    MessageMedia: MessageMedia,
                    DaysOfWeek: DaysOfWeek,
                    MessageClass: MessageClass,
                    MessageFrom: MessageFrom,
                    MessageOlderThan: MessageOlderThan,
                    WhenTimeOfDay: {
                        text:  WhenTimeOfDay.text,
                        from:   WhenTimeOfDay.from,
                        to: WhenTimeOfDay.to,
                        h24: {
                            from: WhenTimeOfDay.h24.from,
                            to: WhenTimeOfDay.h24.to
                        }
                    },
                    Notify: Notify
                };
            },
            onChangeMessageOlderThan: function(e){
                this.state.MessageOlderThan.current[e.target.name] = parseInt(e.target.value);
            },
            onChangeMessageFrom: function(e){
                this.state.MessageFrom.inputValue = e.target.value;
            },
            onChangeMedia: function(e){
                this.setState({
                    MessageMedia: {active:this.state.MessageMedia.active, checked:e.target.value, text: this.mediaTypes[e.target.value]}
                });
            },
            onChangeName: function (name, value) {
                this.rule.ruleName = value;
            },
            onChangeDefaultAction:function (e) {
                this.setState({
                    IfUnread: {checked:e.target.value, text:this.IfUnreadDescription[e.target.value]}
                });
            },
            onChangeRadioTrigger: function(e){
                var obj = {
                    NotifInterval: {
                        active: this.state.NotifInterval.active,
                        text :this.state.NotifInterval.text,
                        state: []
                    }
                };

                if (!(e.target.value==0 && this.state.NotifInterval.active)){
                    obj = {
                            NotifInterval: {
                                active: true,
                                text :this.state.NotifInterval.text,
                                state:[{"Period": [
                                    0
                                ]},{ "StartFrom": [
                                    ""
                                ]}]
                            }
                        }
                } else {
                    obj.NotifInterval.active = false;
                }
                this.setState(obj);
            },
            onChangeInterval:function(prop,e){
                var notif =  this.state.NotifInterval,
                    val =  e.target.value,
                    start;

                switch (prop){
                    case 'hr':
                    case 'min':
                        notif.state[prop] = val;
                        start = this.getInterval(notif,false);
                        break;
                    case 'AM':
                    case 'PM':
                        notif.state.dt = prop;
                        break;
                    case 'period':
                        notif.Period = val;
                        break;
                }
            },
            changeEnabled: function (name, value) {
                this.setState({
                    Enabled: value
                });
            },
            changeDescriptionHandler: function(type, name, value){
                var obj = {},
                    group = this.state[type],
                    rule, keys = [], tempObj = {};

                rule = _.find(group, function (elem) {
                    return elem.name === name;
                });

                if ( rule ) {
                    if(value){
                        this.rule.rule.forEach((function(v,i){
                            this.push(Object.keys(v)[0]);
                        }).bind(keys));

                        if (keys.indexOf(name) == -1){
                            tempObj = {};
                            tempObj[name] = [];
                            this.rule.rule.push(tempObj);
                        }
                    }else{
                        this.rule.rule = this.rule.rule.map((function(v,i){
                            if(!(this == Object.keys(v)[0])){
                                return v
                            }else {
                                tempObj = {};
                                tempObj[this] = [];
                                return tempObj;
                            }
                        }).bind(name));
                    }
                    rule.visibility = value;
                    rule.checked = value;
                }

                obj[type] = group;
                this.setState(obj);
            },
            changeDaysOfWeekConditions: function(name, index, value, e){
                this.state.DaysOfWeek.checked[index] = value;
            },
            changeMessageClassConditions: function(name, index, value, e){
                this.state.MessageClass.checked[index] = value;
            },
            changeWhenTimeOfDay: function (notValid,timeArr) {
                if (!notValid){
                    this.state.WhenTimeOfDay.from = timeArr[0];
                    this.state.WhenTimeOfDay.to = timeArr[1];
                }
            },
            getConvertOlderThanTime: function(milliseconds){
                var today = new Date(0);
                var than = new Date(milliseconds);
                var diffMs = (than - today); // milliseconds between now & than
                var diffDays = Math.round(diffMs / 86400000); // days
                var diffHrs = Math.round((diffMs % 86400000) / 3600000); // hours
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                var diffSec = Math.round((((diffMs % 86400000) % 3600000) % 60000) / 1000); // seconds

                return {
                    days:diffDays,
                    hours:diffHrs,
                    minutes:diffMins,
                    seconds:diffSec
                }
            },
            getInterval : function (NotifInterval, StarFrom) {
                var  hr, min;

                if(StarFrom){
                    StarFrom = NotifInterval.StartFrom.split(':');
                    hr  = parseInt(StarFrom[0]);
                    NotifInterval.state.min = parseInt(StarFrom[1]);
                    NotifInterval.state.dt  = hr > 12 ? 'PM' : 'AM';
                }else{
                    hr  = parseInt(NotifInterval.state.hr);
                    NotifInterval.state.min = parseInt(NotifInterval.state.min);
                }

                NotifInterval.state.hr =  hr > 12 ? hr-12 : hr;
                hr = NotifInterval.state.hr.toString().length==1? '0' + NotifInterval.state.hr : NotifInterval.state.hr;
                min =  NotifInterval.state.min.toString().length==1? '0' + NotifInterval.state.min : NotifInterval.state.min;
                NotifInterval.StartFrom = hr+':'+min;

                return {
                    hr: hr,
                    min: min,
                    dt : NotifInterval.state.dt,
                    text : [NotifInterval.Period, 'hours, starting from', NotifInterval.StartFrom, NotifInterval.state.dt].join(' ')
                };
            },
            getCurrentTimeRange: function () {
                var from = this.state.WhenTimeOfDay.from,
                    to = this.state.WhenTimeOfDay.to;

                    function checkNumber(num){
                        var time = num.split(':');
                            time[0] = (time[0].length==1)? '0'+time[0]: time[0];
                            time[1] = (time[1].length==1)? '0'+time[1]: time[1];

                        return  time[0] + ':' +time[1];
                    }

                    return [checkNumber(from),checkNumber(to)];
            },
            getOlderThanString: function(current){
                var arr = [0,'days',0,'h',0,'min',0,'sec'];

                arr[0] = current.days;
                arr[2] = current.hours;
                arr[4] = current.minutes;
                arr[6] = current.seconds;

                return arr.join(' ');
            },
            setInterval : function () {
                var calcInterval = this.getInterval(this.state.NotifInterval,false),
                    notif = this.state.NotifInterval;
                    notif.text = calcInterval.text;

                this.setState(notif);
            },
            setWhenTimeOfDay: function () {
                var range = this.getCurrentTimeRange();
                this.setState({
                    WhenTimeOfDay: {
                        text: this.createWhenTimeOfDayTitle(range),
                        from: range[0],
                        to: range[1],
                        h24: {
                            from: this.state.WhenTimeOfDay.h24.from,
                            to:  this.state.WhenTimeOfDay.h24.to
                        }
                    }
                });
            },
            setMessageOlderThan: function () {
                var current = this.state.MessageOlderThan.current;
                this.setState({
                    MessageOlderThan: {
                        text: this.getOlderThanString(current),
                        current: current,
                        seconds: (current.days*24*60*60) + (current.hours*60*60) + (current.minutes*60) + (current.seconds)
                    }
                });
            },
            setMessageFromChanges: function () {
                this.setState({
                    MessageFrom: {
                        text: this.state.MessageFrom.inputValue,
                        inputValue: this.state.MessageFrom.inputValue
                    }
                });
            },
            setChanges: function (type) {
                var that=this, msg=[], compleate=[], prefix='and';

                this.state[type].checked.forEach(function(v,i){
                    if (v){
                        msg.push(that[type][i]);
                    }
                });

                for (var idx=0;idx<msg.length;idx++){
                    if(idx==0){
                        compleate.push(msg[idx]);
                    } else {
                        compleate.push(prefix);
                        compleate.push(msg[idx]);
                    }
                }

                if ( type === 'MessageClass') {
                    this.setState({
                        MessageClass: {
                            text: compleate.join(' '),
                            checked: this.state.MessageClass.checked
                        }
                    });
                } else if ( type === 'DaysOfWeek'){
                    this.setState({
                        DaysOfWeek: {
                            text: compleate.join(' '),
                            checked: this.state.DaysOfWeek.checked
                        }
                    });
                }
            },
            createWhenTimeOfDayTitle: function (range) {
                return  ['from', TimeRange.convertTime(range[0], 'string'), 'to', TimeRange.convertTime(range[1], 'string')].join(' ');
            },
            createTimeFrame: function (range) {
                var content, control;

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--time-range'].join(' ')}>
                        <TimeRange time={range || ['00:00','00:00']} onChangeHandler={this.changeWhenTimeOfDay}/>
                        <Button size='sm' clickHandler={this.setWhenTimeOfDay}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={this.state.WhenTimeOfDay.text} content={content} disAutoClose={true}/>;

                return control;
            },
            createHeaderString: function (checked,type) {
                var that=this, msg=[], compleate=[], prefix='and';

                checked.forEach(function(v,i){
                    if (v){
                        msg.push(that[type][i]);
                    }
                });

                for (var idx=0;idx<msg.length;idx++){
                    if(idx==0){
                        compleate.push(msg[idx]);
                    } else {
                        compleate.push(prefix);
                        compleate.push(msg[idx]);
                    }
                }

                return compleate;
            },
            createNotifyRule:function(v,i){
                var content;

                switch (v.Transport[0].By[0]) {
                    case "e-mail":
                        content = this.email(v,i);
                        break;

                    case "call":
                        content = this.phone(v,i);
                        break;
                }

                return content;
            },
            createRule: function(obj, description){
                var that = this,
                    rule,
                    defaultAction,
                    trigger = this.state.NotifInterval.active,
                    conditions = this.state.conditions,
                    conditionsRule,
                    triggersDescription = this.triggersDescription,
                    notifyContent = [];

                conditionsRule = conditions.map(function (elem, index) {
                    var hiddenElem = <p className="checkbox" style={{display:'none'}} key={index}> Hidden Element</p>;

                    if(elem.name == 'MessageOlderThan' && trigger){
                        that.state.conditions[3].visibility = false;
                        return hiddenElem;
                    } else if (elem.name == 'MessageOlderThan' && !trigger && elem.checked) {
                        that.state.conditions[3].visibility = true;
                    }

                    if(elem.name == 'NotifInterval' && trigger){
                        that.state.conditions[6].visibility = true;
                        that.state.Notify.elements = [that.defaultNotifyEmail];

                        return hiddenElem;
                    } else if (elem.name == 'NotifInterval' && !trigger) {
                        that.state.conditions[6].visibility = false;
                        return hiddenElem;
                    }

                    return <Checkbox
                        name={elem.name}
                        text={elem.text}
                        checked={elem.checked}
                        key={index}
                        onChangeHandler={that.changeDescriptionHandler.bind(that, 'conditions')}/>;
                });

                if (!description) { //defaultChecked
                    defaultAction = (
                        <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                            <fieldset>
                                <input type="radio" onChange={this.onChangeDefaultAction} checked={this.state.IfUnread.checked==0?'checked':''} name='defaultAction' value="0"/>
                                {this.IfUnreadDescription[0]}
                                <br/>
                                <input type="radio" onChange={this.onChangeDefaultAction} checked={this.state.IfUnread.checked==1?'checked':''} name='defaultAction' value="1"/>
                                {this.IfUnreadDescription[1]}
                                <br/>
                                <input type="radio" onChange={this.onChangeDefaultAction} checked={this.state.IfUnread.checked==2?'checked':''} name='defaultAction' value="2"/>
                                {this.IfUnreadDescription[2]}
                            </fieldset>
                        </div>
                    );

                    this.state.Notify.elements.forEach(function(v,i){
                        notifyContent.push(that.createNotifyRule(v,i));
                    });

                    rule = (
                        <div className='row'>
                            <div className='col-md-4'>
                                <h5>
                                    Notify me:
                                </h5>
                                <fieldset>
                                    <input title="Notify me each time I recive a new message" type="radio" onChange={this.onChangeRadioTrigger} checked={trigger?'':'checked'} name={that.rule.ruleId} value="0"/>{triggersDescription[0]}
                                    <br/>
                                    <input title="Notify me with an aggregated notification at a regular interval" type="radio" onChange={this.onChangeRadioTrigger} checked={trigger?'checked':''} name={that.rule.ruleId} value="1"/>{triggersDescription[1]}
                                </fieldset>
                                <h5>
                                    Check conditions:
                                </h5>
                                {conditionsRule}
                            </div>
                            <div className='col-md-8'>
                                <h5>
                                    Rule description (click on highlighted value to edit it)
                                </h5>

                                <h6>
                                    Notify Me
                                </h6>
                                <div style={{display:trigger?'none':'block'}}>
                                    <Dropdown type='simple' opened={false} header='Add Notify Statement' content={
                                        <div style={{width: '290px'}}>
                                            <input title="Add e-mail notify" onClick={this.addNotifyEmail} className="addNotif btn btn-default btn-sm" type='button' value='E-mail notify statement'/>
                                            <input title="Add call notify" onClick={this.addNotifyCall} className="addNotif btn btn-default btn-sm" type='button' value='Call notify statement'/>
                                        </div>
                                    } disAutoClose={true}/>
                                </div>
                                {notifyContent}
                                <h6>
                                    If still unread
                                </h6>
                                <Dropdown type='simple' opened={false} header={this.state.IfUnread.text} content={defaultAction} disAutoClose={true}/>
                                <h6>
                                    Apply this rule when
                                </h6>
                                {this.newRuleDescription(obj, false, conditions)}
                            </div>
                        </div>
                    );
                } else {
                    rule = (<p>Short preview description</p>);
                }

                return rule;
            },
            createCBGroup: function (list, type) {
                var that = this,
                    content,
                    control,
                    action;

                if ( type === 'MessageClass' ) {
                    action = 'changeMessageClassConditions';
                } else if (type === 'DaysOfWeek') {
                    action = 'changeDaysOfWeekConditions';
                }

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        {
                            list.map(function(elem, index){
                                var checked = that.state[type].checked[index];

                                return <Checkbox
                                    name={index}
                                    text={elem}
                                    checked={checked}
                                    key={index}
                                    onChangeHandler={that[action].bind(that, type)}/>;
                            })
                        }
                        <Button size='sm' clickHandler={that.setChanges.bind(that, type)}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={that.state[type].text} content={content} disAutoClose={true}/>;
                return control;
            },
            createSubmitObject: function () {
                var that = this,
                    rule = this.rule.rule,
                    ruleForPost = [],
                    length =  this.rule.rule.length;
                    this.toDelete = [];

                rule.forEach((function(v,i){
                    switch(Object.keys(v)[0]){
                        case 'Enabled':
                            v[Object.keys(v)[0]][0] = this.state[Object.keys(v)[0]];
                        break;

                        case 'IfUnread':
                            v[Object.keys(v)[0]][0] = this.IfUnread[this.state[Object.keys(v)[0]].checked];
                        break;

                        case 'MessageFrom':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked) {
                                v[Object.keys(v)[0]][0] = this.state[Object.keys(v)[0]].inputValue;
                            } else {
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                        break;

                        case 'WhenTimeOfDay':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked){
                                v[Object.keys(v)[0]][0] = this.state[Object.keys(v)[0]].from;
                                v[Object.keys(v)[0]][1] = this.state[Object.keys(v)[0]].to;
                            }else{
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                            break;

                        case 'MessageMedia':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked){
                                v[Object.keys(v)[0]][0] = this.mediaTypes[this.state[Object.keys(v)[0]].checked].toLowerCase();
                            } else{
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                        break;

                        case 'MessageClass':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked){
                                v[Object.keys(v)[0]] =  _.without(this.state[Object.keys(v)[0]].checked.map((function(v,i){
                                                            return  (v)?this.MessageClass[i].toLowerCase():false;
                                                        }).bind(this)), false);
                            } else {
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                        break;

                        case 'DaysOfWeek':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked){
                                v[Object.keys(v)[0]] =  _.without(this.state[Object.keys(v)[0]].checked.map((function(v,i){
                                                            return (v)?i:false;
                                                        }).bind(this)),false);
                            } else{
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                        break;

                        case 'MessageOlderThan':
                            if (this.state.conditions[_.pluck(this.state.conditions, 'name').indexOf(Object.keys(v)[0])].checked){
                                v[Object.keys(v)[0]][0] = parseInt(this.state[Object.keys(v)[0]].seconds);
                            } else {
                                v[Object.keys(v)[0]] = [];
                                this.toDelete.push(i);
                            }
                        break;

                        case 'Notify':
                                v[Object.keys(v)[0]] = this.state[Object.keys(v)[0]].elements;
                        break;
                    }
                }).bind(that));

                for (var idx = 0; idx<length ; idx++) {
                    if (this.toDelete.indexOf(idx)==-1)
                        ruleForPost.push(this.rule.rule[idx]);
                }

                this.rule.rule = ruleForPost;

                return this.rule;
            },
            addNotifyCall: function () {
                var notif = this.state.Notify;
                notif.elements.push(this.defaultNotifyCall);

                this.setState({Notify:{
                    active: notif.active,
                    elements: notif.elements
                }});
            },
            addNotifyEmail: function () {
                var notif = this.state.Notify;
                    notif.elements.push(this.defaultNotifyEmail);

                this.setState({Notify:{
                    active: notif.active,
                    elements: notif.elements
                }});
            },
            editRule: function(value){
                this.setState({
                    edit: value
                });
            },
            removeRule: function(){
                if (this.props.onUpdateRule) {
                    this.props.onUpdateRule(false);
                }
            },
            notifAction: function (val,prop,idx,currVal,e) {
                switch (prop){
                    case "ToAttach":
                        val[0] = e.target.value==1;
                        this.setState(this.state.Notify);
                        break;

                    case "Attempts":
                        val[0] = currVal;
                        this.setState(this.state.Notify);
                        break;

                    case "Pause":
                        val[0] = currVal;
                        this.setState(this.state.Notify);
                        break;

                    case "CallMethod":
                        val[0] = this.callMethodMessage[e.target.value];
                        this.setState(this.state.Notify);
                        break;

                    case "Destination":
                        val[0] = e.target.value;
                        break;
                }
            },
            phone: function(v,i){
                var hasDestination = v.Transport[1].Destination.length > 0,
                    Destination = (hasDestination)? v.Transport[1].Destination[0] : this.defaultPlaceHolder,
                    CallMethod =  v.Transport[2].CallMethod[0],
                    call = this.callMethodMessage.indexOf(CallMethod) == 0;

                    if (!Array.isArray(v.Transport[3].Attempts)){
                        v.Transport[5] = v.Transport[4];
                        v.Transport[4] = v.Transport[3];
                        v.Transport[3] = {Attempts:[0]};
                    }

                var repeatObj = v.Transport[3].Attempts,
                    repeat = repeatObj[0],
                    pauseObj = v.Transport[5].Pause,
                    pause = pauseObj[0],
                    pauseNotif = ['do not pause','1 minute','5 minutes','10 minutes','30 minutes','60 minutes','240 minutes'],
                    pauseArr = [0,1,5,10,30,60,240],
                    repeatNotif = ['do not repeat','1 time','2 times','3 times','4 times','5 times'],
                    repeatArr = [0,1,2,3,4,5],
                    pauseContent = pauseArr.map((function(obj,v,i){
                        return  <div key={i}><input type="radio" onChange={this.notifAction.bind(this,obj,'Pause',i,v)} checked={pause==v} name='PausePhone' value={v}/> { pauseNotif[i] } <br/> </div>;
                    }).bind(this,pauseObj)),
                    repeatContent = repeatArr.map((function(obj,v,i){
                        return  <div key={i}><input type="radio" onChange={this.notifAction.bind(this,obj,'Attempts',i,v)} checked={repeat==v} name='RepeatPhone' value={v}/> { repeatNotif[i] } <br/> </div>;
                    }).bind(this,repeatObj)),
                    contentDestination = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <input type="input" name='Email' onChange={this.notifAction.bind(this, v.Transport[1].Destination, 'Destination', i, v)} defaultValue={hasDestination?v.Transport[1].Destination[0]:''}/>
                        <Button size='sm' clickHandler={this.setNotif}>OK</Button>
                    </div>,
                    contentCallMethod = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <fieldset>
                            <input type="radio" onChange={this.notifAction.bind(this, v.Transport[2].CallMethod, 'CallMethod', i, v)}  checked={call} name='callMethod' value="0"/>
                            {this.callMethodMessage[0]}
                            <br/>
                            <input type="radio" onChange={this.notifAction.bind(this, v.Transport[2].CallMethod, 'CallMethod', i, v)}  checked={!call} name='callMethod' value="1"/>
                            {this.callMethodMessage[1]}
                        </fieldset>
                    </div>,
                    contentPause = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <fieldset>
                            {pauseContent}
                        </fieldset>
                    </div>,
                    contentRepeat = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <fieldset>
                            {repeatContent}
                        </fieldset>
                    </div>;

                return <div key={i}> <input onChange={function(){}} onClick={this.setNotifIndex.bind(this,i)} className={blockName + '__numberType'} type="number" defaultValue={i}/> <h7> by Call to <Dropdown type='simple'
                          opened={false}
                          header={Destination}
                          content={contentDestination}
                          disAutoClose={true}/>, <Dropdown type='simple'
                                   opened={false}
                                   header={CallMethod}
                                   content={contentCallMethod}
                                   disAutoClose={true}/> pause for <Dropdown type='simple'
                                             opened={false}
                                             header={(pause)>0? pause: pauseNotif[0]}
                                             content={contentPause}
                                             disAutoClose={true}/> minutes <Dropdown type='simple'
                                                         opened={false}
                                                         header={(repeat>0)? repeat: repeatNotif[0]}
                                                         content={contentRepeat}
                                                         disAutoClose={true}/> repeat time</h7> <input onClick={this.removeNotif.bind(this,i)} className={blockName + '__delButton'} title="Delete record" type="button" value="x"/> </div>;
            },
            email: function(v,i){
                var hasDestination = v.Transport[1].Destination.length > 0,
                    Destination = (hasDestination)? v.Transport[1].Destination[0] : this.defaultPlaceHolder,
                    attach =  v.Transport[3].ToAttach[0],
                    pause =  v.Transport[4].Pause[0],
                    pauseNotif = ['do not pause','1 minute','5 minutes','10 minutes','30 minutes','60 minutes','240 minutes'],
                    pauseArr = [0,1,5,10,30,60,240],
                    pauseContent = pauseArr.map((function(obj,v,i){
                        return  <div key={i}><input type="radio" onChange={this.notifAction.bind(this,obj,'Pause',i,v)} checked={pause==v} name='Pause' value={v}/> { pauseNotif[i] } <br/> </div>;
                    }).bind(this,v.Transport[4].Pause)),
                    contentDestination = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <input title="e-mail to notify" type="email" name='Email' onChange={this.notifAction.bind(this, v.Transport[1].Destination, 'Destination', i, v)} defaultValue={hasDestination?v.Transport[1].Destination[0]:''}/>
                        <Button size='sm' clickHandler={this.setNotif}>OK</Button>
                    </div>,
                    contentAttachMsg = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <fieldset>
                            <input type="radio" onChange={this.notifAction.bind(this, v.Transport[3].ToAttach, 'ToAttach', i, v)} checked={!attach} name='Attach' value="0"/>
                            {this.attachMessage[0]}
                            <br/>
                            <input type="radio" onChange={this.notifAction.bind(this, v.Transport[3].ToAttach, 'ToAttach', i, v)} checked={attach} name='Attach' value="1"/>
                            {this.attachMessage[1]}
                        </fieldset>
                    </div>,
                    contentPause = <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <fieldset>
                            {pauseContent}
                        </fieldset>
                    </div>;

                return <div key={i}> <input title="Change record position" onChange={function(){}} onClick={this.setNotifIndex.bind(this,i)} className={blockName + '__numberType'} type="number" defaultValue={i}/> <h7>by Email at <Dropdown type='simple'
                           opened={false}
                           header={Destination}
                           content={contentDestination}
                           disAutoClose={true}/>, <Dropdown type='simple' opened={false}
                                         header={this.attachMessage[!attach?0:1]}
                                         content={contentAttachMsg}
                                         disAutoClose={true}/> pause for <Dropdown type='simple'
                                                           opened={false} header={(pause)>0? pause: pauseNotif[0]}
                                                           content={contentPause}
                                                           disAutoClose={true}/> minutes</h7> <input onClick={this.removeNotif.bind(this,i)} className={blockName + '__delButton'} type="button" title="Delete record" value="x"/> </div>;
            },
            removeNotif:function(idx){
                var notif = this.state.Notify;

                delete notif.elements[idx];
                notif.elements = _.compact(notif.elements);

                this.setState({Notify:notif});
            },
            setNotifIndex:function(idx,e){
                var tempObj, newIdx = idx > e.target.value? idx+1: idx -1;

                if (this.state.Notify.elements.length<=1 || _.isUndefined(this.state.Notify.elements[newIdx])){
                    e.target.value = idx;
                    return;
                }

                tempObj = this.state.Notify.elements[newIdx];
                this.state.Notify.elements[newIdx] = this.state.Notify.elements[idx];
                this.state.Notify.elements[idx] = tempObj;
                this.setState({Notify:this.state.Notify});
            },
            setNotif:function(){
                this.setState(this.state.Notify)
            },
            newRuleDescription: function(obj, triggers, conditions, description){
                var block,
                    elemClsAnd = [blockName + '__action-rule', blockName + '__action-rule--and'].join(' '),
                    conditionsView;

                conditionsView = _.find(conditions, function (condition) {
                    return condition.visibility;
                });

                if (!description) {
                    var range = this.getCurrentTimeRange(),
                        mer = this.state.NotifInterval.state.dt;

                    block = (
                        <div className={blockName + '__rule-desc'}>
                            {
                                conditionsView && (
                                    <div className={blockName + '__action-wrapper'}>
                                        <div className={blockName + '__action-content'}>
                                            {
                                                conditions[0].visibility &&
                                                <div className={elemClsAnd}>
                                                    Message media is <Dropdown type='simple' opened={false} header={this.state.MessageMedia.text} content={
                                                        <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                                                            <fieldset>
                                                                <input type="radio" onChange={this.onChangeMedia} checked={this.state.MessageMedia.checked==0?'checked':false} name='Media' value="0"/>
                                                                {this.mediaTypes[0]}
                                                                <br/>
                                                                <input type="radio" onChange={this.onChangeMedia} checked={this.state.MessageMedia.checked==0?false:'checked'} name='Media' value="1"/>
                                                                {this.mediaTypes[1]}
                                                            </fieldset>
                                                        </div>
                                                    } disAutoClose={true}/>
                                                </div>
                                            }
                                            {conditions[1].visibility && <div className={elemClsAnd}> Message class is {this.createCBGroup(conditions[1].content, 'MessageClass')}</div>}
                                            {
                                                conditions[2].visibility &&
                                                <div className={elemClsAnd}>
                                                    Message from... <Dropdown type='simple' opened={false} header={this.state.MessageFrom.text} content={ <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                                                                        <input type="input" onChange={this.onChangeMessageFrom} defaultValue={this.state.MessageFrom.inputValue}/>
                                                                        <Button size='sm' clickHandler={this.setMessageFromChanges}>OK</Button>
                                                                     </div>} disAutoClose={true}/>
                                                </div>
                                            }
                                            {
                                                conditions[3].visibility &&
                                                <div className={elemClsAnd}>
                                                    Message is older than <Dropdown type='simple' opened={false} header={this.state.MessageOlderThan.text}
                                                    content={<div className={[blockName + '__dropdown', blockName + '__dropdown--olderThan'].join(' ')}>
                                                                <table>
                                                                    <tbody>
                                                                    <tr>
                                                                        <td>Days:</td>
                                                                        <td> <input min="0" type="number" name="days" onChange={this.onChangeMessageOlderThan} defaultValue={this.state.MessageOlderThan.current.days} /></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Hours:</td>
                                                                        <td> <input min="0" type="number" name="hours" onChange={this.onChangeMessageOlderThan} defaultValue={this.state.MessageOlderThan.current.hours}/></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Minutes:</td>
                                                                        <td> <input min="0" type="number" name="minutes" onChange={this.onChangeMessageOlderThan} defaultValue={this.state.MessageOlderThan.current.minutes}/></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>Seconds:</td>
                                                                        <td> <input min="0" type="number" name="seconds" onChange={this.onChangeMessageOlderThan} defaultValue={this.state.MessageOlderThan.current.seconds}/></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <Button size='sm' clickHandler={this.setMessageOlderThan}>OK</Button>
                                                        </div>} disAutoClose={true}/>
                                                </div>
                                            }
                                            {conditions[4].visibility && <div className={elemClsAnd}> Time of day {this.createTimeFrame(range)}</div>}
                                            {conditions[5].visibility && <div className={elemClsAnd}> On days of week {this.createCBGroup(conditions[5].content, 'DaysOfWeek')}</div>}
                                            {conditions[6].visibility && <div className={elemClsAnd}> Notification Interval <Dropdown type='simple' opened={false} header={this.state.NotifInterval.text} content={
                                                        <div  className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                                                            <fieldset className="IntervalDD">
                                                               Interval <select onChange={this.onChangeInterval.bind(this,'period')} name="Interval" id="">
                                                                    <option value="1">1 Hour</option>
                                                                    <option value="2">2 Hours</option>
                                                                    <option value="3">3 Hours</option>
                                                                    <option value="4">4 Hours</option>
                                                                    <option value="6">6 Hours</option>
                                                                    <option value="12">12 Hours</option>
                                                                    <option value="24">24 Hours</option>
                                                                </select>
                                                                <p>Start from</p>
                                                                 <div className={blockName + '__control'}>
                                                                    <input
                                                                        type="number"
                                                                        className={['form-control', blockName + '__input'].join(' ')}
                                                                        defaultValue={this.state.NotifInterval.state.hr}
                                                                        max="12"
                                                                        min="1"
                                                                        onChange={this.onChangeInterval.bind(this, 'hr')}/>
                                                                    :
                                                                    <input
                                                                        type="number"
                                                                        className={['form-control', blockName + '__input'].join(' ')}
                                                                        defaultValue={this.state.NotifInterval.state.min}
                                                                        max="60"
                                                                        min="0"
                                                                        onChange={this.onChangeInterval.bind(this, 'min')}/>
                                                                    <div className='btn-group' data-toggle='buttons'>
                                                                        <label
                                                                            className={['btn btn-default btn-sm', mer === 'AM' && 'active'].join(' ')}
                                                                            onClick={this.onChangeInterval.bind(this, 'AM')}>
                                                                            <input
                                                                                type='radio'
                                                                                name='options'
                                                                                id='option1'
                                                                                autoComplete='off'/>
                                                                            AM
                                                                        </label>
                                                                        <label
                                                                            className={['btn btn-default btn-sm', mer === 'PM' && 'active'].join(' ')}
                                                                            onClick={this.onChangeInterval.bind(this, 'PM')}>
                                                                            <input
                                                                                type='radio'
                                                                                name='options'
                                                                                id='option2'
                                                                                autoComplete='off'/>
                                                                            PM
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </fieldset>
                                                            <Button size='sm' clickHandler={this.setInterval}>OK</Button>
                                                        </div>
                                                    } disAutoClose={true}/>
                                            </div>}
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    );
                } else {
                    block = [];
                }

                return block;
            },
            confirmChange: function(){
                var newData = this.createSubmitObject();

                if (this.checkEmpty()) {
                    return;
                }

                if (this.props.onUpdateRule) {
                    this.props.onUpdateRule(newData);
                }

                this.setState({
                    edit: false
                });
            },
            checkEmpty: function () {
                var empty = false;

                this.setState({
                    warning: empty ? 'Please specify all fields' : empty
                });

                return empty;
            },
            render: function() {
                var rule = this.rule,
                    header, content, warning;

                if (this.state.warning) {
                    warning = (
                        <div className={blockName + '__info'}>
                            <div className={blockName + '__warning'}>
                                {this.state.warning}
                            </div>
                        </div>
                    );
                }

                if (this.state.edit) {
                    header = (
                        <h4 className={blockName + '__header'}>
                            <Input placeholder="↵ Rule name" text={rule.ruleName} title="Enter descriptive rule name" onChangeHandler={this.onChangeName}/>
                            <span className={blockName + '__header-control'} title="Apply changes" onClick={this.confirmChange}>
                                <Glyphicon icon='ok'/>
                            </span>
                            <span className={blockName + '__header-control'} title="Discard changes" onClick={this.editRule.bind(this, false)}>
                                <Glyphicon icon='chevron-up'/>
                            </span>
                        </h4>
                    );
                    content = this.createRule(rule.rule);
                } else {
                    header = (
                        <h4 className={blockName + '__header'}>
                            <Checkbox mixCls={blockName + '__header-enabled'} checked={this.state.Enabled} onChangeHandler={this.changeEnabled}/>
                            {rule.ruleName}
                            <span title="Edit rule" className={blockName + '__header-control'} onClick={this.editRule.bind(this, true)}>
                                <Glyphicon icon='pencil'/>
                            </span>
                            <span title="Delete rule" className={blockName + '__header-control'} onClick={this.removeRule}>
                                <Glyphicon icon='remove'/>
                            </span>
                        </h4>
                    );
                    content = (
                        <div className={blockName + '__description'}>
                            {this.createRule(rule.rule, true)}
                        </div>);
                }

                return (
                    <li className={[blockName, 'container-fluid'].join(' ')}>
                        {header}
                        {warning}
                        {content}
                    </li>
                );
            }
        });

    provide(NotifCard);
});