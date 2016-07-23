modules.define('device-card', [
    'react',
    'jquery',
    'underscore',
    'modal',
    'i-config',
    'input',
    'select',
    'checkbox',
    'dropdown',
    'tabs',
    'button',
    'i-xml',
    'cookie',
    'info-line',
    'spin',
    'react-dom'
], function(provide, React, $, _, Modal, iConfig, Input, Select,
                Checkbox, Dropdown, Tabs, Button, iXML, Cookie, InfoLine, Spin, ReactDOM) {
    var DeviceCard = React.createClass({
        componentWillMount: function () {
            var that = this,
                cookieToken = Cookie.get('token');

            $.ajaxSetup({
                type: "GET",
                global: false,
                data: {
                    session: cookieToken
                },
                dataType: 'json',
                error: function() {
                    alert('An error has occurred, reload this page or try again later');
                }
            });

            $.ajax({
                url: that.props.urlApi + 'newapi/config/profiles/device',
                data: {
                    command: 'get_device_profile_list'
                }
            }).done(function(data) {
                that.types(data.deviceProfiles);
            });

            $.ajax({
                url: that.props.urlApi + '/newapi/config/locations',
                data: {
                    command: 'get_locations'
                }
            }).done(function(data) {
                that.setState({
                    locations: data.locations
                });
            });
        },

        getDefaultProps: function() {
            return {
                fields: iConfig.getProps('device-card'),
                urlApi: iConfig.getProps('url-api')
            };
        },

        getInitialState: function() {
            return {
                profileProps: null,
                deviceData: null,
                line: 1,
                useMacSettings: {},
                activeLine: 0
            };
        },

        getDevicesProfileProperties: function (fieldName, profileName) {
            var that = this;

            $.ajax({
                type: "GET",
                url: that.props.urlApi + 'newapi/profileDetails',
                data: {
                    session: Cookie.get('token'),
                    name: profileName,
                    command: 'get_device_profile_details'
                },
                dataType: 'json'
            }).done(function(data) {
                that.setState({
                    profileProps: data.profile,
                    line: data.profile.enabledLines
                });

                that.newData.profileName = data.profile.name;
            }).fail(function() {
                alert('An error has occurred, reload this page or try again later');
            });
        },

        types: function (profiles) {
            var result = {},
                list = {},
                knownTypes = iConfig.getProps('devices-type'),
                profileList;

            profiles.map(function (profile) {
                knownTypes.map(function (type) {
                    if ( profile.deviceType === type.name ) {
                        result[type.name] = result[type.name] || [];
                        result[type.name].push(profile.name);

                        list[type.section] = list[type.section] || [];

                        if ( list[type.section].indexOf(profile.deviceType) ) {
                            list[type.section].push(profile.deviceType);
                        }
                    }
                });
            });

            profileList = _.map(list, function (value, key) {
                return {
                    groupName: key,
                    groupItems: value.sort()
                };
            });

            this.setState({
                knownProfiles: profiles,
                profileList: _.sortBy(profileList, 'groupName'),
                devices: result
            });
        },

        show: function (data) {
            var currentDevice,
                disabledDeviceTypeSelect,
                macAddress = '000BEA000000',
                deviceId = '',
                keyCash = 0,
                useMacSettings = {0:true};

            this.newData = {};

            if ( data.new ) {
                keyCash = _.random(100, 1000);
                this.newData = {
                    new: true,
                    lines: [{
                        deviceId: macAddress,
                        sipAuth: deviceId
                    }],
                    macAddress: macAddress,
                    location: this.state.locations[0].name
                };

                deviceId = {
                    0: macAddress
                };
            } else {
                this.newData.deviceRecId = keyCash = data.deviceRecId;
                this.newData.lines = data.lines;

                currentDevice = data.deviceType;

                this.getDevicesProfileProperties('profileName', data.profileName);

                disabledDeviceTypeSelect = true;

                _.map(data.lines, function (line, index) {
                    if ( line.deviceId === data.macAddress ) {
                        useMacSettings[index] = true;
                    }
                });

                macAddress = data.macAddress;
            }

            this.deviceId = deviceId;

            this.setState({
                error: false,
                deleteDialog: false,
                line: 1,
                deviceData: data,
                keyCash: keyCash,
                disabledDeviceTypeSelect: disabledDeviceTypeSelect,
                currentDevice: currentDevice || false,
                macAddress: macAddress,
                msg: null,
                useMacSettings: useMacSettings
            });

            this.refs.deviceCard.open();
        },

        hide: function () {
            this.refs.deviceCard.close();
        },

        checkField: function (clearErrors) {
            var columns = this.props.columns,
                hasErrors = null,
                data = _.extend(this.state.deviceData, this.newData);

            this.props.fields.map(function (field) {
                if ( !_.isArray(field) ) {
                    if ( clearErrors ) {
                        if ( columns[field].error ) {
                            columns[field].error = null;
                        }
                    } else {
                        if ( columns[field].required && !data[field] ) {
                            hasErrors = true;
                            columns[field].error = 'Required field';
                        } else if ( columns[field].required && _.has(data, field) ) {
                            columns[field].error = null;
                        }
                    }
                } else {
                    field.map(function (linesField) {
                        if ( clearErrors ) {
                            if ( columns[linesField].error ) {
                                columns[linesField].error = null;
                            }
                        } else {
                            if ( columns[linesField].required && !data[field] ) {
                                hasErrors = true;
                                columns[linesField].error = 'Required field';
                            } else if ( columns[linesField].required && _.has(data, field) ) {
                                columns[linesField].error = null;
                            }
                        }
                    });
                }
            });

            if ( _.some(this.errorFields) ) {
                _.each(this.errorFields, function (value, key) {
                    hasErrors = true;
                    columns[key].error = value;
                });
            }

            this.setState({ columns: columns });

            return hasErrors;
        },

        handleSubmit: function (e) {
            if ( !this.checkField() ) {
                this.sendData();
            }

            e.preventDefault();
        },

        sendData: function (type) {
            var that = this,
                command,
                ajaxUrl,
                path,
                data = {};

            if ( type === 'delete') {
                command = 'delete_device';
                path = 'newapi/config/devices/delete';
            } else if (this.state.deviceData && this.state.deviceData.new) {
                command = 'add_device';
                path = 'newapi/config/devices/add';
            } else {
                command = 'update_device';
                path = 'newapi/config/devices/update';
            }

            ajaxUrl = that.props.urlApi + path;

            if ( _.isArray(this.newData.deviceRecId) ) {
                data = JSON.stringify(this.newData);
            } else {
                if ( !this.newData.new ) {
                    this.newData.deviceRecId = [this.newData.deviceRecId];
                }

                data = JSON.stringify(_.extend(this.state.deviceData, this.newData));
            }

            console.log(this.newData);

            this.checkField(true);

            $.ajax({
                type: "POST",
                url: ajaxUrl,
                dataType: 'json',
                data: {
                    data: data,
                    command: command,
                    session: Cookie.get('token')
                },
                beforeSend: function () {
                    that.refs.Spin.show();
                }
            }).done(function (data) {
                var error = data.error,
                    dataComand = data.command,
                    dataStatus = data.success;

                if ( error ) {
                    var columns = that.state.columns,
                        errorMsg = 'Error';

                    if ( error.fields ) {
                        error.fields.map(function (element) {
                            columns[element.name].error = element.msg;
                        });
                    } else {
                        errorMsg = error.msg;
                    }

                    that.setState({
                        error: errorMsg,
                        columns: columns
                    });
                } else if ( dataStatus ) {
                    that.statusMessageList(
                        dataComand,
                        '',
                        1
                    );
                }
            }).fail(function () {
                alert('An error has occurred, reload this page or try again later');
            }).always(function () {
                that.refs.Spin.hide();
            });
        },

        statusMessageList: function (status, device, num) {
            var msg = '',
                msgUser = 'Device ' + device,
                msgStatus = 'added';

            if ( num > 1 ) {
                msgUser = num + ' devices';
            }

            if ( status === 'delete_device' ) {
                msgStatus = 'deleted';
            } else if ( status === 'update_device' ) {
                msgStatus = 'updated';
            }

            msg = msgUser + ' ' + msgStatus;

            if ( this.props.statusMessage && status !== 'update_device' ) {
                this.hide();
            } else {
                this.setState({ msg: msg });
            }

            this.props.statusMessage({
                status: status,
                device: device,
                msg: msg
            });
        },

        onInputHandlerChange: function (name, value, error) {
            if ( !error ) {
                if ( ~this.props.fields[4].indexOf(name) ) {
                    this.onChangeInputInTab(name, value);
                } else {
                    this.newData[name] = value;
                }
            }
        },

        onChangeInputInTab: function (name, value) {
            var that = this,
                newLineData = {},
                lineIndex;

            lineIndex = this.newData.lines[that.state.activeLine];

            if ( lineIndex && value.length > 0 ) {
                this.newData.lines[that.state.activeLine][name] = value;
            } else if ( !lineIndex && value.length > 0 ) {
                newLineData[name] = value;

                this.newData.lines.push(newLineData);
            } else if ( lineIndex && value.length === 0 ) {
                if ( _.isEmpty(_.omit(lineIndex, name)) ) {
                    that.newData.lines.splice(that.state.activeLine, 1);
                }
            }

            if ( name === 'deviceId' ) {
                var deviceId = this.deviceId || {};

                deviceId[this.state.activeLine] = value;

                this.newData.lines[this.state.activeLine].sipAuth = value;

                this.deviceId = deviceId;

                $('input',  ReactDOM.findDOMNode(this.refs['sipAuth' + this.state.activeLine])).val(value);
            }
        },

        setActiveLine: function (activeLine) {
            this.setState({
                activeLine: activeLine
            });
        },

        toggleDeleteDialog: function (deleteDialog) {
            this.setState({
                deleteDialog: deleteDialog
            });
        },

        deleteHandle: function (data) {
            if ( data ) {
                var formData = {};

                formData.deviceRecId = data.deviceRecId;

                this.newData = formData;
            }

            this.sendData('delete');
        },

        onMacChange: function (name, value, error) {
            var that = this,
                deviceId = this.deviceId || {};

            _.map(this.state.useMacSettings, function (key, tab) {
                if ( key ) {
                    if ( !_.isObject(that.newData.lines[tab]) ) {
                        that.newData.lines[tab] = {};
                    }
                    that.newData.lines[tab].deviceId = value;
                    that.newData.lines[tab].sipAuth = value;

                    deviceId[tab] = value;
                }
            });

            this.setState({
                macAddress: value,
                deviceId: deviceId
            });

            this.onInputHandlerChange(name, value, error);
        },

        useMac: function (name, checked) {
            var useMacSettings = this.state.useMacSettings,
                tabNumber = this.state.activeLine;

            this.state.useMacSettings[tabNumber] = checked;

            this.onChangeInputInTab('deviceId', checked ? this.state.macAddress : '');

            this.setState({
                useMacSettings: useMacSettings
            });
        },

        onSelectDeviceType: function (name, value) {
            this.newData[name] = value;
            this.getDevicesProfileProperties('profileName', this.state.devices[value] && this.state.devices[value][0]);
            this.setState({
                currentDevice: value
            });
        },

        render: function() {
            var content,
                deviceList = '',
                message = '',
                deleteButton,
                deleteDialog = '',
                headerText = 'Device';

            if ( this.state.deviceData ) {
                deviceList = (
                    <div className='device-card__row row'>
                        <div className='device-card__row-label col-md-4'>
                            Device type
                        </div>
                        <div className='device-card__row-data col-md-8'>
                            <Dropdown
                                disabled={this.state.disabledDeviceTypeSelect}
                                content={this.createDeviceList(this.state.profileList)}
                                header={this.state.currentDevice || 'Select device type'}
                                current={this.state.currentDevice}/>
                        </div>
                    </div>
                );

                content = this.renderContent();

                if ( this.state.deviceData.DeviceId ) {
                    headerText = headerText + ' ' + this.state.deviceData.DeviceId;
                }
            }

            if ( this.state.error ) {
                message = (
                    <InfoLine type='error'>
                        {this.state.error}
                    </InfoLine>
                );
            } else if ( this.state.msg ) {
                message = (
                    <InfoLine>
                        {this.state.msg}
                    </InfoLine>
                );
            }

            if ( this.newData && !this.newData.new ) {
                deleteButton = 'DELETE';
            }

            if ( this.state.deleteDialog ) {
                deleteDialog = (
                    <InfoLine mixCls='user-card__delete'>
                        <span className='user-card__delete-text'>Are you sure you want to delete the device?</span>
                        <Button type='button' option='danger' onClick={this.deleteHandle.bind(this, false)}>YES</Button>
                        <Button type='button' option='primary' onClick={this.toggleDeleteDialog.bind(this, false)}>NO</Button>
                    </InfoLine>
                );
            }

            return (
                <Modal
                    ref='deviceCard'
                    id='deviceCard'
                    confirm={this.props.rights && 'Save'}
                    delete={this.props.rights && deleteButton}
                    deleteHandle={this.toggleDeleteDialog.bind(this, true)}
                    onConfirm={this.handleSubmit}
                    header={headerText}>

                    <div className='device-card'>
                        {message}
                        {deviceList}
                        {content}
                        {deleteDialog}
                        <Spin ref='Spin' />
                    </div>
                </Modal>
            );
        },

        createDeviceList: function (list) {
            var that = this,
                items = [];

            items = list.map(function (value, i) {
                var cls = 'dropdown__menu-item',
                    item = [];

                if ( that.props.current === value ) {
                    cls = [cls, cls + '--active'].join(' ');
                }

                if ( _.isString(value) ) {
                    item = (
                        <div role='presentation'
                            data-value={value}
                            className={cls}
                            onClick={that.onSelectDeviceType.bind(that, 'deviceType', value)}
                            key={i}>
                            {value}
                        </div>
                    );
                } else {
                    item.push(<div role='presentation' className='dropdown-header' key={i}>{value.groupName}</div>);
                    item.push(that.createDeviceList(value.groupItems));
                }

                return item;
            });

            return items;
        },

        renderContent: function () {
            var that = this,
                content;

            content = this.props.fields.map(function (field, i) {
                var block;

                if ( _.isArray(field) ) {
                    var lines = [],
                        key = that.state.keyCash + i,
                        profileLinesLength = that.state.line;

                    for ( var y = 0; y < profileLinesLength; y++ ) {
                        var tabName = 'Line ' + ( y + 1 ),
                            tabContent = '',
                            linesData = that.state.deviceData.lines && that.state.deviceData.lines[y];

                        tabContent = field.map(function (fieldValue, fieldIndex) {
                            return that.renderRow(fieldValue, fieldIndex, linesData || {}, y);
                        });

                        lines.push({
                            tabName: tabName,
                            tabContent: tabContent
                        });
                    }

                    block = <Tabs
                        clsMix='device-card__lines'
                        current={that.state.activeLine}
                        key={key}
                        tabs={lines}
                        onChangeTab={that.setActiveLine}/>;
                } else {
                    block = that.renderRow(field, i, that.state.deviceData);
                }

                return block;
            });

            return content;
        },

        renderRow: function (field, i, data, tabNumber) {
            var that = this,
                column = that.props.columns[field],
                recording = that.props.rights,
                label = column.text,
                control = data[field] || '',
                required = column.required,
                error = column.error,
                illegalSymb = column && column.illegalSymb || '',
                maxLength = column && column.maxLength || '',
                key = that.state.keyCash + i;

            if ( recording ) {
                if ( !column.type ) {
                    control = <Input
                                clear={true}
                                name={column.id}
                                text={control}
                                error={error}
                                required={required}
                                placeholder={"↵ " + label}
                                maxLength={maxLength}
                                illegalSymb={illegalSymb}
                                onChangeHandler={that.onInputHandlerChange}/>;

                } else if ( column.id === 'profileName' && that.state.devices ) {
                    var currentDevice = that.state.currentDevice,
                        profileName = this.newData && this.newData.deviceProfileName || that.state.deviceData.deviceProfileName,
                        devicesOptions = [];

                    if ( currentDevice ) {
                        devicesOptions = that.state.devices[currentDevice].map(function (deviceProfile) {
                            return {
                                text: deviceProfile,
                                value: deviceProfile
                            };
                        });
                    }

                    control = <Select
                        disabled={!that.state.currentDevice}
                        name={column.id}
                        select={profileName}
                        error={error}
                        onChangeHandler={that.getDevicesProfileProperties}
                        options={devicesOptions}/>;
                } else if ( column.id === 'location' ) {
                    var locations = this.state.locations,
                        locationsOptions = [];

                    if ( locations ) {
                        locationsOptions = this.state.locations.map(function (item) {
                            return {
                                text: item.name,
                                value: item.name
                            };
                        });
                    }

                    control = <Select
                        name={column.id}
                        select={control}
                        error={error}
                        onChangeHandler={that.onInputHandlerChange}
                        options={locationsOptions}/>;
                } else if ( column.type === 'useMac' ) {
                    var useMacChecked = false,
                        disabled = false,
                        text = control;

                    if ( this.state.useMacSettings[tabNumber] ) {
                        useMacChecked = true;
                        disabled = true;
                        text = this.state.macAddress;
                    }

                    label = (
                        <div className="device-card__label-group">
                            {label}
                            <Checkbox
                                text='Use Mac'
                                checked={useMacChecked}
                                onChangeHandler={that.useMac}/>
                        </div>
                    );

                    control = <Input
                                clear={true}
                                updateble={true}
                                error={error}
                                placeholder={"↵ " + label}
                                name={column.id}
                                text={text}
                                disabled={disabled}
                                onChangeHandler={that.onInputHandlerChange}/>;
                } else if (column.type === 'InputMAC') {
                    control = <Input
                                clear={true}
                                updateble={true}
                                error={error}
                                name={column.id}
                                placeholder="↵ MAC address"
                                maxLength={maxLength}
                                text={that.state.macAddress}
                                onChangeHandler={that.onMacChange}/>;
                } else if ( column.id === 'sipAuth' ) {
                    if ( _.isObject(this.deviceId) ) {
                        control = this.deviceId[tabNumber];
                    }

                    control = <Input
                                ref={'sipAuth' + tabNumber}
                                updateble={true}
                                name={column.id}
                                placeholder={"↵ " + label}
                                error={error}
                                disabled={true}
                                text={control}/>;
                }
            }

            return (
                <div className='device-card__row row' key={key}>
                    <div className='device-card__row-label col-md-4'>
                        {label}
                    </div>
                    <div className='device-card__row-data col-md-8'>
                        {control}
                    </div>
                </div>
            );
        }
    });

    provide(DeviceCard);
});
