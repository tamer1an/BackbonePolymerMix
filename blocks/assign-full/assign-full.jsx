modules.define('assign-full', [
    'react',
    'i-config',
    'cookie',
    'glyphicon',
    'button',
    'input',
    'checkbox',
    'jquery',
    'underscore',
    'react-dom'
], function(provide, React, iConfig, Cookie, Glyphicon, Button, Input, Checkbox, $, _, ReactDOM) {
    var blockName = this.name;

    var AssignFull = React.createClass({
        getDefaultProps: function() {
            return {
                fields: iConfig.getProps('user-card'),
                urlAPI: iConfig.getProps('url-api')
            };
        },

        getInitialState: function() {
            return {
                direction: true,
                usersAssign: [],
                devicesAssign: [],
                usersSort: null,
                devicesSort: null,
                showFreeUsers: 'all',
                showFreeDevices: 'all',
                users: [],
                devices: [],
                error: false,
                done: false,
                read: this.props.read.indexOf('get_user_list') !== -1 && this.props.read.indexOf('get_device_list') !== -1,
                modify: this.props.write.indexOf('update_user') !== -1 && this.props.write.indexOf('assign_devices') !== -1
            };
        },

        componentDidMount: function () {
            var winH = window.innerHeight,
                assignOffsetT = this.refs.assignFullContent && ReactDOM.findDOMNode(this.refs.assignFullContent).offsetTop,
                fullListH = this.refs.assignFullList && ReactDOM.findDOMNode(this.refs.assignFullList).offsetTop;

            this.setState({
                assignContentHeight: winH - assignOffsetT - 2,
                fullListHeight: winH - assignOffsetT - fullListH - 15
            });
        },

        componentWillMount: function () {
            this.getList();
        },

        getList: function () {
            var that = this;

            [
                {
                    type: 'users',
                    command: 'get_user_list'
                },
                {
                    type: 'devices',
                    command: 'get_device_list'
                }
            ].map(function (elem) {
                that.getListAJAX(elem);
            });
        },

        getListAJAX: function (obj) {
            var that = this;

            $.ajax({
                type: "GET",
                url: this.props.urlAPI + 'newapi/config/' + obj.type,
                data: {
                    session: Cookie.get('token'),
                    command: obj.command
                },
                dataType: 'json'
            }).done(function(data) {
                var list = {};

                list[obj.type] = data[obj.type];

                that.setState(list);

                that.updateAssign();
            }).fail(function() {
                alert('An error has occurred, reload this page or try again later');
            });
        },

        changeDirection: function (value) {
            if ( value !== this.state.direction) {
                this.reset();

                this.setState({
                    direction: value
                });
            }
        },

        addAssignUser: function (elem, add) {
            var that = this,
                direction = this.state.direction,
                usersAssign = this.state.usersAssign,
                finded;

            finded = _.find(usersAssign, function (pred) {
                return pred.userRecId === elem.userRecId;
            });

            if ( finded && !add ) {
                usersAssign = _.reject(usersAssign, function (pred) {
                    return pred.userRecId === elem.userRecId;
                });
            } else {
                if ( direction ) {
                    usersAssign = [];
                }
                usersAssign.push(elem);
            }

            if ( direction ) {
                this.state.devicesAssign = [];

                usersAssign.map(function (user) {
                    if ( user.devices.length ) {
                        user.devices.map(function (device) {
                            that.addAssignDevice(device, add);
                        });
                    }
                });
            }

            this.setState({
                usersAssign: usersAssign,
            });
        },

        addAssignDevice: function (elem, add) {
            var that = this,
                direction = this.state.direction,
                devicesAssign = this.state.devicesAssign,
                finded;

            finded = _.find(devicesAssign, function (pred) {
               return pred.deviceRecId === elem.deviceRecId;
            });

            if ( finded && !add ) {
                devicesAssign = _.reject(devicesAssign, function (pred) {
                    return pred.deviceRecId === elem.deviceRecId;
                });
            } else {
                if ( !direction ) {
                    devicesAssign = [];
                }
                devicesAssign.push(elem);
            }

            if ( !direction ) {
                this.state.usersAssign = [];

                devicesAssign.map(function (device) {
                    if ( device.users.length ) {
                        device.users.map(function (user) {
                            var addedUser = _.find(that.state.users, function (userElem) {
                                return user === userElem.userRecId;
                            });

                            that.addAssignUser(addedUser, add);
                        });
                    }
                });
            }

            this.setState({
                devicesAssign: devicesAssign
            });
        },

        reset: function () {
            this.setState({
                usersAssign: [],
                devicesAssign: []
            });
        },

        sort: function (type, name, value) {
            var obj = {},
                sorted,
                re = new RegExp(value, 'g'),
                list = this.state.users;

            if ( type === 'devices' ) {
                list = this.state.devices;
            }

            if ( !list[0].join ) {
                list.map(function (elem) {
                    elem.join = _.values(elem).join('');
                });
            }

            if ( value && value.length ) {
                sorted = _.filter(list, function (elem) {
                    return elem.join.match(re);
                });
            } else {
                sorted = false;
            }

            obj[type + 'Sort'] = sorted;

            this.setState(obj);
        },

        changeShowAssigned: function (type, value) {
            if ( type === 'users' && value !== this.state.showFreeUsers ) {
                this.setState({
                    showFreeUsers: value
                });
            } else if ( value !== this.state.showFreeDevices ) {
                this.setState({
                    showFreeDevices: value
                });
            }
        },

        sendData: function () {
            var that = this,
                state = this.state,
                ajaxUrl = that.props.urlAPI + 'newapi/assign',
                command = state.direction ? 'assign_devices' : 'assign_users',
                data = {};

            if ( state.direction && !state.usersAssign[0] ||
                    !state.direction && !state.devicesAssign[0] ) {
                return;
            }

            data.users = state.usersAssign.map(function (user) {
                return user.userRecId;
            });
            data.devices = state.devicesAssign.map(function (device) {
                return device.deviceRecId;
            });

            $.ajax({
                type: "POST",
                url: ajaxUrl,
                contentType: 'json',
                data: {
                    session: Cookie.get('token'),
                    command: command,
                    data: JSON.stringify(data)
                }
            }).done(function (data) {
                var error = data.error;

                if ( error ) {
                    that.setState({
                        error: true
                    });

                    setTimeout(function () {
                        that.setState({
                            error: false
                        });
                    }, 1900);
                } else  {
                    that.getList();
                    that.setState({
                        done: true
                    });

                    setTimeout(function () {
                        that.setState({
                            done: false
                        });
                    }, 1900);
                }
            }).fail(function () {
                alert('An error has occurred, reload this page or try again later');
            });
        },

        updateAssign: function () {
            var that = this,
                usersAssign = this.state.usersAssign,
                devicesAssign = this.state.devicesAssign;

            usersAssign = usersAssign.map(function (userA) {
                var upUser;

                upUser = _.find(that.state.users, function (user) {
                    return user.userRecId === userA.userRecId;
                });

                return upUser;
            });

            devicesAssign = devicesAssign.map(function (deviceA) {
                var upDev;

                upDev = _.find(that.state.devices, function (device) {
                    return device.deviceRecId === deviceA.deviceRecId;
                });

                return upDev;
            });

            this.setState({
                usersAssign: usersAssign,
                devicesAssign: devicesAssign
            });
        },

        render: function() {
            var that = this,
                usersList = [],
                usersAssignList = '',
                sortedUserList = [],
                devicesList = [],
                devicesAssignList = '',
                sortedDeviceList = [],
                usersListDesc = 'User for Assign',
                devicesListDesc = 'Devices for Assign',
                error = '',
                done = '',
                block,
                assignStyle = {
                    height: this.state.assignContentHeight
                },
                contentStyle = {
                    height: this.state.fullListHeight
                };

            if (this.state.users.length) {
                sortedUserList = this.state.usersSort || this.state.users;

                if ( this.state.showFreeUsers !== 'all' ) {
                    sortedUserList = _.filter(sortedUserList, function (user) {
                        return that.state.showFreeUsers === 'free' && !user.devices.length ||
                                that.state.showFreeUsers === 'busy' && user.devices.length;
                    });
                } else {
                    sortedUserList = sortedUserList;
                }

                usersList = this.createUsersList(sortedUserList, true);
            }

            if (this.state.usersAssign.length  !== 'all' ) {
                usersAssignList = this.createUsersList(this.state.usersAssign);
            }

            if (this.state.devices.length) {
                sortedDeviceList = this.state.devicesSort || this.state.devices;

                if ( this.state.showFreeDevices !== 'all' ) {
                    sortedDeviceList = _.filter(sortedDeviceList, function (device) {
                        return  that.state.showFreeDevices === 'free' && !device.users.length ||
                                    that.state.showFreeDevices === 'busy' && device.users.length;
                    });
                } else {
                    sortedDeviceList = sortedDeviceList;
                }

                devicesList = this.createDevicesList(sortedDeviceList, true);
            }

            if (this.state.devicesAssign.length) {
                devicesAssignList = this.createDevicesList(this.state.devicesAssign);
            }

            if (!this.state.direction) {
                usersListDesc = 'Users for Assign';
                devicesListDesc = 'Device for Assign';
            }

            if ( this.state.error ) {
                error = (
                    <div className={blockName + '__content-error'}>
                        Error
                    </div>
                );
            }

            if ( this.state.done ) {
                done = (
                    <div className={blockName + '__content-done'}>
                        Done
                    </div>
                );
            }

            if ( this.state.read || this.state.write ) {
                block = (
                    <div className='assign-full s-page'>
                        <div className='s-page__head row'>
                            <div className='col-md-2'>
                                <h2 className='s-page__head-title'>
                                    Assign
                                </h2>
                            </div>
                            <div className='col-md-10 assign-full__head-controls'>
                                <div className='btn-group' data-toggle='buttons'>
                                    <label
                                        className='btn btn-default active'
                                        onClick={this.changeDirection.bind(this, true)}>
                                        <input
                                            type='radio'
                                            name='options'
                                            id='option1'
                                            autoComplete='off'/>
                                        devices to user
                                    </label>
                                    <label
                                        className='btn btn-default'
                                        onClick={this.changeDirection.bind(this, false)}>
                                        <input
                                            type='radio'
                                            name='options'
                                            id='option2'
                                            autoComplete='off'/>
                                        users to device
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div
                            className='s-page__content assign-full__content row'
                            ref='assignFullContent'
                            style={assignStyle}>
                            {error}
                            {done}
                            <div className='col-md-5'>
                                <h3>Users</h3>
                                <div className={[blockName + '__list', blockName + '__list--prew'].join(' ')}>
                                    <div className={blockName + '__list-desc'}>
                                        {usersListDesc}
                                    </div>
                                    <table className={blockName + '__list-table'}>
                                        <tbody>
                                            {usersAssignList}
                                        </tbody>
                                    </table>
                                </div>
                                {this.createListsFilter('users')}
                                <div
                                    className={blockName+'__list'}
                                    ref='assignFullList'
                                    style={contentStyle}>
                                    <table className={blockName + '__list-table'}>
                                        <tbody>
                                            {usersList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='col-md-2'>
                                {this.createControls()}
                            </div>
                            <div className='col-md-5'>
                                <h3>Devices</h3>
                                <div className={[blockName + '__list', blockName + '__list--prew'].join(' ')}>
                                    <div className={blockName + '__list-desc'}>
                                            {devicesListDesc}
                                    </div>
                                    <table className={blockName + '__list-table'}>
                                        <tbody>
                                            {devicesAssignList}
                                        </tbody>
                                    </table>
                                </div>
                                {this.createListsFilter('devices')}
                                <div
                                    className={blockName+'__list'}
                                    style={contentStyle}>
                                    <table className={blockName + '__list-table'}>
                                        <tbody>
                                            {devicesList}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            } else {
                block = (
                    <div className='assign-full s-page'>
                        <div className='s-page__head row'>
                            <div className='col-md-12'>
                                <h2 className='s-page__head-title'>
                                    Assign
                                </h2>
                            </div>
                        </div>
                        <div
                            className='s-page__content assign-full__content row'>
                            <div className='col-md-12'>
                                <h4>
                                    You are not authorized to view this page
                                </h4>
                            </div>
                        </div>
                    </div>
                );
            }

            return block;
        },

        createListsFilter: function (type) {
            var btnGroup;

            btnGroup = (<div className='btn-group' data-toggle='buttons'>
                <label
                    className='btn btn-default btn-sm active'
                    onClick={this.changeShowAssigned.bind(this, type, 'all')}>
                    <input
                        type='radio'
                        name='options'
                        id='option1'
                        autoComplete='off'/>
                    All
                </label>
                <label
                    className='btn btn-default btn-sm'
                    onClick={this.changeShowAssigned.bind(this, type, 'free')}>
                    <input
                        type='radio'
                        name='options'
                        id='option2'
                        autoComplete='off'/>
                    Free
                </label>
                <label
                    className='btn btn-default btn-sm'
                    onClick={this.changeShowAssigned.bind(this, type, 'busy')}>
                    <input
                        type='radio'
                        name='options'
                        id='option2'
                        autoComplete='off'/>
                    Busy
                </label>
            </div>);

            return (<div className={blockName + '__sort row'}>
                <div className='col-md-8'>
                    <Input
                        placeholder={'Search in ' + type}
                        clear={true}
                        onChangeHandler={this.sort.bind(this, type)}/>
                </div>
                <div className='col-md-4'>
                    {btnGroup}
                </div>
            </div>);
        },

        createControls: function () {
            var cls = blockName + '__controls',
                chevron = this.state.direction ? 'left' : 'right',
                controlsDirection,
                disableAssignButton;

            if ( this.state.direction && !this.state.usersAssign.length ||
                 !this.state.direction && !this.state.devicesAssign.length) {
                disableAssignButton = true;
            }

            controlsDirection = (
                <div
                    className={cls + '-direction' + ' ' + (this.state.direction ? '' : cls + '-direction-right' )}>
                    <Glyphicon icon={'chevron-' + chevron}/>
                    <Glyphicon icon={'chevron-' + chevron}/>
                    <Glyphicon icon={'chevron-' + chevron}/>
                    <Glyphicon icon={'chevron-' + chevron}/>
                    <Glyphicon icon={'chevron-' + chevron}/>
                </div>
            );

            return (<div className={cls}>
                {this.state.modify && <div className={cls + '-arrows'}>
                    {controlsDirection}
                    <Button
                        size='lg'
                        disabled={disableAssignButton}
                        clickHandler={this.sendData}>Apply</Button>
                    {controlsDirection}
                </div>}
                <div className={cls + '-reset'}>
                    <Button clickHandler={this.reset}>Reset</Button>
                </div>
            </div>);
        },

        createUsersList: function (usersList, add) {
            var that = this,
                list,
                elemCls = blockName + '__card';

            list = usersList.map(function (elem, i) {
                return (
                    <tr
                        className={elemCls + ' ' + elemCls + '--user'}
                        key={i}
                        onClick={that.addAssignUser.bind(that, elem, add)}>
                        <td className={elemCls + '-name'}>
                            {elem.firstName + ' ' + elem.lastName}
                        </td>
                        <td className={elemCls + '-text'}>
                            {elem.login}
                        </td>
                        <td className={elemCls + '-action'}>
                            <Glyphicon icon='phone-alt'/>
                            <span className={elemCls + '-action-text'}>
                                {elem.devices ? elem.devices.length : 0}
                            </span>
                        </td>
                    </tr>
                );
            });

            return list;
        },

        createDevicesList: function (devicesList, add) {
            var that = this,
                list,
                elemCls = blockName + '__card';

            list = devicesList.map(function (elem, i) {
                return (
                    <tr
                        className={elemCls}
                        key={i}
                        onClick={that.addAssignDevice.bind(that, elem, add)}>
                        <td className={elemCls + '-name'}>
                            {elem.deviceType}
                        </td>
                        <td className={elemCls + '-text'}>
                            {elem.deviceId}
                        </td>
                        <td className={elemCls + '-action'}>
                            <Glyphicon icon='user'/>
                            <span className={elemCls + '-action-text'}>
                                {elem.users && elem.users.length}
                            </span>
                        </td>
                    </tr>
                );
            });

            return list;
        }
    });

    provide(AssignFull);
});
