modules.define('find-me',
            ['react', 'button', 'glyphicon', 'dropdown', 'input', 'select',
                'underscore', 'tool-tip', 'i-error', 'cookie', 'i-config',
                'jquery', 'action'],
            function(provide, React, Button, Glyphicon, Dropdown, Input, Select,
                _, ToolTip, iError, Cookie, iConfig, $, Action) {
    var blockName = this.name;

    var Try = React.createClass({ displayName: 'Try',
        getInitialState: function() {
            var userData = this.props.userData;

            return {
                data: this.props.data,
                devices: this.props.devices,
                optionsAssign: {
                    bound: 'Bound phone',
                    home: 'Home phone (' + (userData.homePhone.length ? userData.homePhone : 'Not defined') + ')',
                    cell: 'Mobile phone (' + (userData.cellPhone.length ? userData.cellPhone : 'Not defined') + ')',
                    assigned: 'All assigned'
                }
            };
        },

        onSelectType: function(index, name, value) {
            var data = this.state.data;

            if ( value !== '0' ) {
                data[index] = {
                    type: value,
                    value: ''
                };
            } else {
                data[index] = {
                    type: null,
                    value: ''
                };
            }

            this.setState({
                data: data
            });
        },

        setUser: function (index, user) {
            var options = [],
                data = this.state.data;

            if ( user && user !== 'clear' ) {
                options = [
                    {
                        name: 'Business',
                        value: user.extension
                    },
                    {
                        name: 'Mobile',
                        value: user.cellPhone
                    },
                    {
                        name: 'Home',
                        value: user.homePhone
                    }
                ];
            } else {
                options = false;
            }

            data[index].numbers = options;

            this.setState({
                data: data
            });
        },

        setNumber: function (index, value) {
            var data = this.state.data;

            data[index].value = value;

            this.setState({
                data: data
            });
        },

        setDevice: function (index, value) {
            this.setNumber(index, value.deviceId);
        },

        setAssigned: function (index, name, value) {
            this.setNumber(index, value);
        },

        confirmData: function () {
            var data = [
                    { Ext: [] },
                    { Id: [] },
                    { Assigned: [] },
                    { All: [false] }
                ],
                newData = false;

            this.state.data.forEach(function (elem) {
                if (elem.type === 'Ext' && elem.value.length) {
                    newData = true;
                    data[0].Ext.push(elem.value);
                } else if (elem.type === 'Id' && elem.value.length) {
                    newData = true;
                    data[1].Id.push(elem.value);
                } else if (elem.type === 'Assigned') {
                    newData = true;
                    if (elem.value.length) {
                        data[2].Assigned.push(elem.value);
                    } else {
                        data[2].Assigned.push('bound');
                    }
                } else if (elem.type === 'All') {
                    newData = true;
                    data[3].All = [true];
                }
            });

            if (this.props.confirmHandler && newData) {
                this.props.confirmHandler(data);
            }
        },

        render: function () {
            var that = this,
                data = this.state.data,
                content = [],
                optionsSelect = [
                    { text: '...', value: 0 },
                    { text: 'Phone #', value: 'Ext' },
                    { text: 'Phone ID', value: 'Id' },
                    { text: 'Predefined phone', value: 'Assigned' },
                    { text: 'All my phones', value: 'All' },
                ],
                counter = 0;

            data.map(function (elem, index) {
                var control,
                    value,
                    select;

                select = (<Select
                            name='type'
                            options={optionsSelect}
                            error='disabled'
                            select={elem.type}
                            onChangeHandler={that.onSelectType.bind(that, index)}/>);

                counter++;

                if ( elem.type === 'Ext' ) {
                    var numbers;

                    value = (
                        <div className={blockName + '__try-control-value'}>
                            {elem.value}
                        </div>
                    );

                    if ( elem.numbers )  {
                        numbers = elem.numbers.map(function (number, i) {
                            if ( number.value.length ) {
                                return (
                                    <div key={i} className={blockName + '__try-control-number'}>
                                        <span className={blockName + '__try-control-number-header'}>
                                            {number.name}
                                        </span>
                                        {': '}
                                        <span className={blockName + '__try-control-number-value'}
                                            onClick={that.setNumber.bind(that, index, number.value)}>
                                            {number.value}
                                        </span>
                                    </div>
                                );
                            }
                        });
                    }

                    if ( that.props.users ) {
                        control = (
                            <div className={blockName + '__try-control-element'}>
                                <ToolTip
                                    searchList={that.props.users}
                                    fields={['firstName', 'lastName']}
                                    onChangeHandler={that.setUser.bind(that, index)}
                                    placeholder='Search in User list'/>
                                {numbers}
                            </div>
                        );
                    }
                } else if ( elem.type === 'Id' ) {
                    value = (
                        <div className={blockName + '__try-control-value'}>
                            {elem.value}
                        </div>
                    );

                    if ( that.state.devices ) {
                        control = (
                            <div className={blockName + '__try-control-element'}>
                                <ToolTip
                                    searchList={that.state.devices}
                                    fields={['deviceId']}
                                    onChangeHandler={that.setDevice.bind(that, index)}
                                    placeholder='Search in Devices list'/>
                                {numbers}
                            </div>
                        );
                    }
                } else if ( elem.type === 'Assigned' ) {
                    var options = [],
                        idValues = that.state.optionsAssign,
                        idValuesKeys = _.keys(that.state.optionsAssign);

                    options = idValuesKeys.map(function (key) {
                        return {
                            text: idValues[key],
                            value: key
                        };
                    });

                    value = (
                        <div className={blockName + '__try-control-value'}>
                            <Select
                                    options={options}
                                    error='disabled'
                                    select={elem.value}
                                    onChangeHandler={that.setAssigned.bind(that, index)}/>
                        </div>
                    );
                }

                content.push(
                    <div key={counter} className={blockName + '__try-control'}>
                        {counter}
                        {select}
                        {value}
                        {control}
                    </div>
                );
            });

            return (
                <div className={blockName + '__try-control-wrapper'}>
                    {content}
                    <div className={blockName + '__try-control-confirm'}>
                        <Button clickHandler={this.confirmData}>Confirm</Button>
                    </div>
                </div>
            );
        }
    });

    var FindMe = React.createClass({

        getInitialState: function() {
            var that = this,
                data = this.props.data,
                tryData = [], badData = [], updateData = '',
                userData = this.props.userData;

            $.ajax({
                type: "GET",
                url: iConfig.getProps('url-api') + '/newapi/config/devices',
                data: {
                    session: Cookie.get('token'),
                    command: 'get_device_list'
                },
                dataType: 'json'
            }).done(function(data) {
                that.setState({
                    devices: data.devices
                });
            }).fail(function(jqXHR, textStatus, errorThrown) {
                iError.parceError(jqXHR, textStatus, errorThrown);
            });

            data.map(function (elem) {
                if (elem.Try) {
                    tryData.push(elem);
                } else if (elem.Bad) {
                    badData.push(elem);
                } else if ( elem === 'Updates' ) {
                    updateData = elem;
                }
            });

            return {
                tryData: tryData,
                badData: badData,
                updateData: updateData,
                tryToString: [],
                optionsAssign: {
                    bound: 'Bound phone',
                    home: 'Home phone (' + (userData.homePhone.length ? userData.homePhone : 'Not defined') + ')',
                    cell: 'Mobile phone (' + (userData.cellPhone.length ? userData.cellPhone : 'Not defined') + ')',
                    assigned: 'All assigned'
                }
            };
        },

        dellTryHandler: function (index) {
            var tryData = this.state.tryData;

            tryData.splice(index, 1);

            this.setState({
                tryData: tryData
            });
        },

        addTryHandler: function () {
            var tryData = this.state.tryData,
                emptyData = {Try:[{To:[]},{For:[15]},{Ask:[0]}]};

            tryData.push(emptyData);

            this.setState({
                tryData: tryData
            });
        },

        render: function() {
            return (
                <div className={blockName}>
                    <div className={[blockName, blockName + '__box', blockName + '__box--try'].join(' ')}>
                        {this.renderTry()}
                    </div>
                    {this.renderBad()}
                    {this.renderUpdates()}
                </div>
            );
        },

        renderTry: function () {
            var data = this.state.tryData,
                that = this,
                content, plus;

            content = data.map(function (tryElem, index) {
                return (
                    <div className={blockName + '__try-elem'} key={index}>
                        Try
                        {that.renderTryTo(tryElem.Try[0], index)}
                        {that.renderTryFor(tryElem.Try[1], index)}
                        {that.renderTryAsk(tryElem.Try[2], index)}
                        <span onClick={that.dellTryHandler.bind(that, index)}>
                            <Glyphicon icon='remove'/>
                        </span>
                    </div>
                );
            });

            if ( data.length < 4 ) {
                plus = (<div className={blockName + '__add'} onClick={that.addTryHandler}>
                    <Glyphicon icon='plus'/>
                </div>);
            }

            return (
                <div className={blockName + '__try'}>
                    {content}
                    {plus}
                </div>
            );
        },

        confirmTryHandler: function (index, tryData) {
            var data = this.state.tryData;
            data[index].Try[0].To = tryData;

            this.setState({
                tryData: data
            });

            this.confirmChanges('try', data);
        },

        setUpdates: function (name, value) {
            var updateData = this.state.updateData;

            if (value === '1') {
                updateData = 'Updates';
            } else {
                updateData = null;
            }

            this.setState({
                updateData: updateData
            });

            this.confirmChanges('updates', updateData);
        },

        confirmChanges: function(type, data) {
            var newData = [],
                tryData = this.state.tryData,
                badData = this.state.badData,
                updateData = this.state.updateData;

            if ( type === 'try' ) {
                tryData = data;
            } else if ( type === 'bad' ) {
                badData = data;
            } else if ( type === 'updates' ) {
                updateData = data;
            }

            newData = tryData.concat(badData);

            if (type === 'updates' && data) {
                newData.push(data);
            }
        },

        onSetActions: function (bad) {
            var data = [{Bad: bad}];

            this.setState({
                badData: data
            });

            this.confirmChanges('bad', data);
        },

        renderTryTo: function (data, index) {
            var that = this,
                str = '',
                content,
                control,
                tryControl = [];

            if ( data.To.length ) {
                str = [];

                data.To.map(function (elem) {
                    if ( elem.Ext && elem.Ext.length ) {
                        elem.Ext.map(function (ext) {
                            str.push(ext);

                            tryControl.push({
                                type: 'Ext',
                                value: ext
                            });
                        });
                    } else if ( elem.Id && elem.Id.length ) {
                        elem.Id.map(function (id) {
                            str.push(id);

                            tryControl.push({
                                type: 'Id',
                                value: id
                            });
                        });
                    } else if ( elem.Assigned && elem.Assigned.length ) {
                        var options = that.state.optionsAssign;

                        elem.Assigned.map(function (assigned) {
                            str.push(options[assigned]);

                            tryControl.push({
                                type: 'Assigned',
                                value: assigned
                            });
                        });
                    } else if ( elem.All && elem.All.length ) {
                        if ( elem.All[0] ) {
                            str.push('All my phones');

                            tryControl.push({
                                type: 'All',
                                value: true
                            });
                        }
                    }
                });

                str = str.join(', ');
            } else {
                str = 'Plese, specify ';
            }

            if ( tryControl.length < 4 ) {
                for ( var i = 4 - tryControl.length; i > 0 ; i-- ) {
                    tryControl.push({
                        type: null,
                        value: ''
                    });
                }
            }

            content = <Try userData={this.props.userData} data={tryControl} devices={this.state.devices} users={this.props.users} confirmHandler={this.confirmTryHandler.bind(this, index)}/>;

            control = <Dropdown mixCls={blockName + '__try-elem-control'} type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

            return control;
        },

        renderTryFor: function (data) {
            var content, control,
                str =  data.For[0];

            content = (
                <div className={[blockName + '__dropdown', blockName + '__dropdown--time'].join(' ')}>
                    <Input name='NoAnswer' text={data.For[0]} />
                    <Button size='sm' >OK</Button>
                </div>
            );

            control = <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>;

            return (
                <div className={blockName + '__text'}>
                    {'for '}
                    {control}
                    {' seconds'}
                </div>
            );
        },

        renderTryAsk: function (data) {
            var options = [
                    {
                        text: 'ask before connect',
                        value: 0
                    },
                    {
                        text:  'connect immediately',
                        value: 1
                    }
                ],
                str = '',
                control;

            if ( data.Ask ) {
                str = ' ' + options[data.Ask[0]];
            }

            control = <Select mixCls={blockName + '__try-ask'} options={options} error='disabled' select={data.Ask[0]}/>;

            return control;
        },

        renderBad: function () {
            var actions = this.state.badData[0].Bad,
                content,
                str = 'Please, specify';

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
                }
            }

            content = <Action users={this.props.users} action={actions} unsuccessfull={true} onSetActions={this.onSetActions}/>;

            return (
                <div className={[blockName + '__action-rule', blockName + '__action-rule--bad'].join(' ')}>
                    <h6>If unsuccessfull</h6>
                    <div className={[blockName + '__box', blockName + '__box--unsucc'].join(' ')}>
                        <Dropdown type='simple' opened={false} header={str} content={content} disAutoClose={true}/>
                    </div>
                </div>
            );
        },

        renderUpdates: function () {
            var options = [
                    {
                        value: 1,
                        text: 'Provide'
                    },
                    {
                        value: 0,
                        text: 'Don\'t provide'
                    }
                ],
                select = this.state.updateData ? 1 : 0;

            return (
                <div className={[blockName + '__action-rule', blockName + '__action-rule--provide'].join(' ')}>
                    <Select options={options} onChangeHandler={this.setUpdates} select={select}/>
                    updates to the caller while system tries to find me.
                </div>
            );
        }
    });

    provide(FindMe);
});
