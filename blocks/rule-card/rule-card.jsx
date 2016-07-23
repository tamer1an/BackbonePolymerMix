modules.define(
    'rule-card',
    ['react', 'button', 'dropdown', 'checkbox', 'input', 'underscore', 'cookie',
     'jquery', 'i-error', 'time-range', 'call-from', 'date-range', 'action', 'find-me',
     'glyphicon'],
    function(provide, React, Button, Dropdown, Checkbox, Input, _, Cookie, $,
                iError, TimeRange, CallFrom, DateRange, Action, FindMe, Glyphicon) {
    var blockName = this.name,
        RuleCard = React.createClass({
            triggers: null,
            conditions: null,

            getInitialState: function() {
                var rule = this.props.rule.rule,
                    busy, noAnswer, anyCall,
                    presence, callFrom, dateRange, timeFrame, weekDays, holidays,
                    triggers, conditions;

                if ( rule.Triggers ) {
                    rule.Triggers.map(function (trigger) {
                        if ( trigger.AnyCall ) {
                            anyCall = trigger.AnyCall;
                        } else if ( trigger.Busy ) {
                            busy = trigger.Busy;
                        } else if ( trigger.NoAnswer ) {
                            noAnswer = trigger.NoAnswer;
                        }
                    });
                }

                triggers = [
                    {
                        text: 'When I am using the phone',
                        name: 'Busy',
                        visibility: !!busy,
                        content: busy
                    },
                    {
                        text: 'No answer',
                        name: 'NoAnswer',
                        visibility: !!noAnswer,
                        content: noAnswer
                    },
                    {
                        text: 'Any incoming call',
                        name: 'AnyCall',
                        visibility: !!anyCall,
                        content: anyCall
                    }
                ];

                if ( rule.Conditions ) {
                    rule.Conditions.map(function (condition) {
                        if ( condition.Presence ) {
                            presence = condition.Presence;
                        } else if ( condition.CallFrom ) {
                            callFrom = condition.CallFrom;
                        } else if ( condition.DateRange ) {
                            dateRange = condition.DateRange;
                        } else if ( condition.TimeFrame ) {
                            timeFrame = condition.TimeFrame;
                        } else if ( condition.WeekDays ) {
                            weekDays = condition.WeekDays;
                        } else if ( condition.Holidays ) {
                            holidays = condition.Holidays;
                        }
                    });
                }

                conditions = [
                    {
                        text: 'My presence',
                        name: 'Presence',
                        visibility: !!presence,
                        content: presence
                    },
                    {
                        text: 'Call from...',
                        name: 'CallFrom',
                        visibility: !!callFrom,
                        content: callFrom
                    },
                    {
                        text: 'Date range',
                        name: 'DateRange',
                        visibility: !!dateRange,
                        content: dateRange
                    },
                    {
                        text: 'Time of the day',
                        name: 'TimeFrame',
                        visibility: !!timeFrame,
                        content: timeFrame
                    },
                    {
                        text: 'On days of week',
                        name: 'WeekDays',
                        visibility: !!weekDays,
                        content: weekDays
                    },
                    {
                        text: 'Holidays',
                        name: 'Holidays',
                        visibility: !!holidays,
                        content: holidays
                    }
                ];

                this.rule = JSON.parse(JSON.stringify(this.props.rule));

                return {
                    rule: rule,
                    actions: rule.Actions,
                    triggers: triggers,
                    conditions: conditions,
                    warning: false,
                    edit: false
                };
            },

            changeDescriptionHandler: function (type, name, value) {
                var obj = {},
                    group = this.state[type],
                    rule;

                rule = _.find(group, function (elem) {
                    return elem.name === name;
                });

                if ( rule ) {
                    rule.visibility = value;
                    if (type === 'conditions' && name === 'Holidays' ||
                        type === 'triggers' && (name === 'AnyCall' || name === 'Busy')) {
                        rule.content = [];
                    }
                }

                obj[type] = group;

                this.setState(obj);
            },

            changeTriggers: function () {
                var triggers = this.triggers || JSON.parse(JSON.stringify(this.state.triggers));

                if ( arguments[0] === 'NoAnswer' ) {
                    triggers[1].content = [arguments[1]];
                }

                this.triggers = triggers;
            },

            changeConditions: function(){
                var conditions = this.conditions || JSON.parse(JSON.stringify(this.state.conditions)),
                    action, cond, content, place;

                if ( arguments[0] === 'Presence' || arguments[0] === 'WeekDays') {
                    action = arguments[0] === 'Presence' ? 0 : 4;
                    cond = conditions[action];

                    if ( !cond.content ) {
                        cond.content = [];
                    }

                    content = cond.content;
                    place = content.indexOf(arguments[1]);

                    if ( place !== -1 && !arguments[2] ) {
                        content.splice(place, 1);
                    } else if ( place === -1 ) {
                        content.push(arguments[1]);
                    }

                    content = content.sort();
                } else if ( arguments[0] === 'timeFrame' && !arguments[1] ) {
                    action = 3;
                    cond = conditions[action];

                    cond.content = arguments[2];
                }

                this.conditions = conditions;
            },

            setChanges: function (type) {
                if ( type === 'triggers') {
                    this.setState({
                        triggers: this.triggers || this.state.triggers
                    });

                    this.triggers = null;
                }

                if ( type === 'conditions') {
                    this.setState({
                        conditions: this.conditions || this.state.conditions
                    });

                    this.conditions = null;
                }
            },

            onSetActions: function (actions) {
                this.setState({
                    actions: actions
                });
            },

            editRul: function (value) {
                this.setState({
                    edit: value
                });
            },

            onChangeName: function (name, value) {
                this.rule.ruleName = value;
            },

            changeEnabled: function (name, value) {
                this.rule.enabled = value;
                this.confirmChange();
            },

            changeDisplayUserID: function (name, value) {
                this.rule.displayUserIDForExCall = value;
            },

            checkEmpty: function () {
                var triggers = this.state.triggers,
                    conditions = this.state.conditions,
                    empty = false;

                triggers.forEach(function (trigger) {
                    if (trigger.visibility && !trigger.content) {
                        empty = true;
                    }
                });

                conditions.forEach(function (trigger) {
                    if (trigger.visibility && !trigger.content) {
                        empty = true;
                    }
                });

                this.setState({
                    warning: empty ? 'Please specify all fields' : empty
                });

                return empty;
            },

            confirmChange: function () {
                var newData = this.rule;

                if (this.checkEmpty()) {
                    return;
                }

                newData.rule.Actions = this.state.actions;

                newData.rule.Triggers = [];
                this.state.triggers.forEach(function (elem) {
                    if (elem.visibility) {
                        var o = {};
                        o[elem.name] = elem.content;
                        newData.rule.Triggers.push(o);
                    }
                });

                newData.rule.Conditions = [];
                this.state.conditions.forEach(function (elem) {
                    if (elem.visibility) {
                        var o = {};
                        o[elem.name] = elem.content;
                        newData.rule.Conditions.push(o);
                    }
                });

                if (this.props.onUpdateRule) {
                    this.props.onUpdateRule(newData);
                }

                this.setState({
                    edit: false
                });
            },

            removeRule: function () {
                if (this.props.onUpdateRule) {
                    this.props.onUpdateRule(false);
                }
            },

            render: function() {
                var rule = this.props.rule,
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
                            <Input placeholder="↵ Rule name" text={rule.ruleName} onChangeHandler={this.onChangeName}/>
                            <span className={blockName + '__header-control'} title="Apply changes" onClick={this.confirmChange}>
                                <Glyphicon icon='ok'/>
                            </span>
                            <span className={blockName + '__header-control'}  title="Discard changes" onClick={this.editRul.bind(this, false)}>
                                <Glyphicon icon='chevron-up'/>
                            </span>
                        </h4>
                    );
                    content = this.createRule(rule.rule);
                } else {
                    header = (
                        <h4 className={blockName + '__header'}>
                            <Checkbox mixCls={blockName + '__header-enabled'} checked={rule.enabled} onChangeHandler={this.changeEnabled}/>
                            {rule.ruleName}
                            <span title="Edit rule" className={blockName + '__header-control'} onClick={this.editRul.bind(this, true)}>
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
            },

            createRule: function (obj, description) {
                var that = this,
                    rule,
                    triggers = this.state.triggers,
                    triggersRule,
                    conditions = this.state.conditions,
                    conditionsRule;

                triggersRule = triggers.map(function (elem, index) {
                    var disabled = false,
                        checked = elem.visibility;

                    if ( triggers[2].visibility && index !== 2 ) {
                        checked = false;
                        disabled = true;
                    }

                    return <Checkbox
                                name={elem.name}
                                text={elem.text}
                                key={index}
                                disabled={disabled}
                                checked={checked}
                                onChangeHandler={that.changeDescriptionHandler.bind(that, 'triggers')}/>;
                });

                conditionsRule = conditions.map(function (elem, index) {
                    return <Checkbox
                                name={elem.name}
                                text={elem.text}
                                checked={elem.visibility}
                                key={index}
                                onChangeHandler={that.changeDescriptionHandler.bind(that, 'conditions')}/>;
                });

                if (!description) {
                    rule = (
                        <div className='row'>
                            <div className='col-md-4'>
                                <h5>
                                    Events triggering the rule
                                </h5>
                                {triggersRule}
                                <h5>
                                    Conditions you want to apply to this rule
                                </h5>
                                {conditionsRule}
                                <div className={blockName + '__user-caller'}>
                                    <Checkbox
                                        text='Display user caller ID for external calls'
                                        onChangeHandler={this.changeDisplayUserID}
                                        checked={this.props.rule.displayUserIDForExCall}/>
                                </div>
                            </div>
                            <div className='col-md-8'>
                                <h5>
                                    Rule description (click on highlighted value to edit it)
                                </h5>
                                {this.newRuleDescription(obj, triggers, conditions)}
                            </div>
                        </div>
                    );
                } else {
                    rule = this.newRuleDescription(obj, triggers, conditions, description);
                }

                return rule;
            },

            newRuleDescription: function (obj, triggers, conditions, description) {
                var block,
                    elemClsOr = [blockName + '__action-rule', blockName + '__action-rule--or'].join(' '),
                    elemClsAnd = [blockName + '__action-rule', blockName + '__action-rule--and'].join(' '),
                    triggersView, conditionsView;

                triggersView = _.find(triggers, function (trigger) {
                    return trigger.visibility;
                });

                conditionsView = _.find(conditions, function (condition) {
                    return condition.visibility;
                });

                if (!description) {
                    block = (
                        <div className={blockName + '__rule-desc'}>
                            {
                                triggersView && (
                                    <div className={blockName + '__action-wrapper'}>
                                        <h6 className={blockName + '__action-header'}>
                                            Apply this rule
                                        </h6>
                                        <div className={blockName + '__action-content'}>
                                            {!triggers[2].visibility && triggers[0].visibility && <div className={elemClsOr}>when I using the phone</div>}
                                            {!triggers[2].visibility && triggers[1].visibility && <div className={elemClsOr}>when no answer {this.createNoAnswerTime(triggers[1].content)}</div>}
                                            {triggers[2].visibility && <div className={elemClsOr}>for any incoming call</div>}
                                        </div>
                                    </div>
                                )
                            }
                            {
                                conditionsView && (
                                    <div className={blockName + '__action-wrapper'}>
                                        <h6 className={blockName + '__action-header'}>
                                            {triggersView ? 'And when' : 'When'}
                                        </h6>
                                        <div className={blockName + '__action-content'}>
                                            {conditions[0].visibility && <div className={elemClsAnd}>my presence is {this.createCBGroup(conditions[0].content, 'Presence')}</div>}
                                            {conditions[1].visibility && <div className={elemClsAnd}>call is from {this.createCallFrom(conditions[1].content, conditions)}</div>}
                                            {conditions[2].visibility && <div className={elemClsAnd}>in {this.createDateRange(conditions[2].content, conditions)}</div>}
                                            {conditions[3].visibility && <div className={elemClsAnd}>within {this.createTimeFrame(conditions[3].content)}</div>}
                                            {conditions[4].visibility && <div className={elemClsAnd}>on {this.createCBGroup(conditions[4].content, 'WeekDays')}</div>}
                                            {conditions[5].visibility && <div className={elemClsAnd}>holidays</div>}
                                        </div>
                                    </div>
                                )
                            }
                            {
                                (conditionsView || triggersView) && (
                                    <div className={blockName + '__action-wrapper'}>
                                        <h6 className={blockName + '__action-header'}>
                                            Action
                                        </h6>
                                        {this.createActions()}
                                    </div>
                                )
                            }
                        </div>
                    );
                } else {
                    block = [];

                    if (triggersView) {
                        if (!triggers[2].visibility && triggers[0].visibility) {
                            block.push('when I using the phone');
                        }

                        if (!triggers[2].visibility && triggers[1].visibility ) {
                            block.push('when no answer after ' + triggers[1].content + ' sec');
                        }

                        if (triggers[2].visibility) {
                            block.push('for any incoming call');
                        }
                    }

                    if (conditionsView) {
                        if (conditions[0].visibility) {
                            block.push('my presence is status');
                        }

                        if (conditions[1].visibility) {
                            block.push('call is from ' + conditions[1].content.join(' '));
                        }

                        if (conditions[2].visibility) {
                            block.push('in from ' + conditions[2].content[0] + ' to ' + conditions[2].content[1]);
                        }

                        if (conditions[3].visibility) {
                            block.push('within from ' + conditions[3].content[0] + ' to ' + conditions[3].content[1]);
                        }

                        if (conditions[4].visibility) {
                            block.push('on some week days');
                        }

                        if (conditions[5].visibility) {
                            block.push('hollidays');
                        }
                    }

                    block = block.join(', ');
                }

                return block;
            },

            createNoAnswerTime: function (sec) {
                var control, content,
                    str = 'Please specify';

                if ( sec ) {
                    str = 'after ' + sec[0] + ' second(s)';
                }

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        <Input name='NoAnswer' text={sec && sec[0]} onChangeHandler={this.changeTriggers}/>
                        <Button size='sm' clickHandler={this.setChanges.bind(this, 'triggers')}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

                return control;
            },

            createCBGroup: function (values, type) {
                var that = this,
                    list,
                    content,
                    control,
                    joinStr,
                    str = 'Please, specify';

                if ( type === 'Presence' ) {
                    list = ['Logged Out', 'Aviailable', 'Not Available', 'Busy', 'At Lunch', 'In a Meeting', 'Be Right Back', 'Apper Offline', 'On the Phone'];
                    joinStr = ' or ';
                } else {
                    list = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    joinStr = ', ';
                }

                if ( values && values.length ) {
                    str = values.map(function (value) {
                        return list[value];
                    }).join (joinStr);
                }

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                        {
                            list.map(function(elem, index){
                                var checked = values && values.indexOf(index) !== -1;

                                return <Checkbox
                                    name={index}
                                    text={elem}
                                    checked={checked}
                                    key={index}
                                    onChangeHandler={that.changeConditions.bind(that, type)}/>;
                            })
                        }
                        <Button size='sm' clickHandler={this.setChanges.bind(this, 'conditions')}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

                return control;
            },

            createTimeFrame: function (range) {
                var that = this,
                    str = 'specific time frame',
                    content, control;

                if ( range ) {
                    str = ['from', TimeRange.convertTime(range[0], 'string'), 'to', TimeRange.convertTime(range[1], 'string')].join(' ');
                }

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--time-range'].join(' ')}>
                        <TimeRange time={range || ['00:00','00:00']} onChangeHandler={this.changeConditions.bind(that, 'timeFrame')}/>
                        <Button size='sm' clickHandler={this.setChanges.bind(this, 'conditions')}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

                return control;
            },

            createCallFrom: function (values, conditions) {
                var str = 'Please, specify',
                    content, control;

                if ( values && values.length ) {
                    str = values.map(function (value) {
                        return value;
                    }).join(', ');
                } else {
                    values = [];
                    conditions[1].content = values;
                }

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--call-from'].join(' ')}>
                        <CallFrom
                            userList={this.props.users}
                            value={values}/>
                        <Button size='sm' clickHandler={this.setChanges.bind(this, 'conditions')}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

                return control;
            },

            createDateRange: function (range, conditions) {
                var str = 'specific date span',
                    now = new Date(),
                    dateStr,
                    content,
                    control;

                if ( !range ) {
                    dateStr = [now.getMonth(), now.getDate(), now.getFullYear()].join('/');
                    range = [dateStr, dateStr];
                    conditions[2].content = range;
                }

                str = [range[0].length ? 'from' : '', range[0], range[1].length ? 'to' : '', range[1]].join(' ');

                content = (
                    <div className={[blockName + '__dropdown', blockName + '__dropdown--call-from'].join(' ')}>
                        <DateRange dateRange={conditions[2].content}/>
                        <Button size='sm' clickHandler={this.setChanges.bind(this, 'conditions')}>OK</Button>
                    </div>
                );

                control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

                return control;
            },

            createActions: function () {
                var actions = this.state.actions,
                    str = 'Select specific action',
                    content,
                    control,
                    findMe;

                if ( actions.length ) {
                    if ( actions[0].Reject ) {
                        str = 'Reject';
                    } else if ( actions[0].ForwardTo ) {
                        str = 'Forward to ' + actions[0].ForwardTo[0];
                    } else if ( actions[0].ForwardToVM ) {
                        var options, greeting = actions[0].ForwardToVM[0].split('.');

                        options = [
                            { text: 'No Greeting', value: '-3' },
                            { text: 'System Greeting', value: '-2' },
                            { text: 'Active Greeting', value: '0' },
                            { text: 'Greeting 1', value: '1' },
                            { text: 'Greeting 2', value: '2' },
                            { text: 'Greeting 3', value: '3' },
                            { text: 'Greeting 4', value: '4' }
                        ];

                        str = 'Forward to Voice mail, ' + _.find(options, function (elem) {
                            return elem.value === greeting[0];
                        }).text;

                        if (greeting[1]) {
                            str = str + ', Disconnect after greeting';
                        } else {
                            str = str + ', Record message';
                        }
                    } else if ( actions[0].FindMe ) {
                        str = 'Find me';

                        findMe = <FindMe userData={this.props.userData} users={this.props.users} data={actions[0].FindMe}/>;
                    }
                }

                content = <Action users={this.props.users} action={actions} onSetActions={this.onSetActions}/>;

                control = (
                    <div className={blockName + '__action-rule'}>
                        <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>
                        {findMe}
                    </div>
                );

                return control;
            }
        });

    provide(RuleCard);
});
