modules.define('user-card', [
    'react',
    'underscore',
    'jquery',
    'modal',
    'i-config',
    'input',
    'checkbox',
    'panels',
    'select',
    'i-xml',
    'cookie',
    'spin',
    'button',
    'info-line',
    'assign',
    'i-error',
    'rules',
    'notif'
], function(provide, React, _, $, Modal, iConfig, Input, Checkbox, Panels,
                Select, iXML, Cookie, Spin, Button, InfoLine, Assign, iError, Rules, Notifications) {
    var blockName = this.name,
        UserCard = React.createClass({
        componentWillMount: function () {
            var that = this;

            $.ajax({
                type: "GET",
                url: this.props.urlAPI + 'newapi/config/devices',
                data: {
                    session: Cookie.get('token'),
                    command: 'get_device_list'
                },
                dataType: 'json'
            }).done(function(data) {
                that.setState({
                    fullList: data.devices
                });
            }).fail(function(jqXHR, textStatus, errorThrown) {
                iError.parceError(jqXHR, textStatus, errorThrown);
            });

            [
                {
                    url: 'user',
                    id: 'userProfile',
                    command: 'get_profile_list'
                },
                {
                    url: 'admin',
                    id: 'adminProfile',
                    command: 'get_admin_profile_list'
                },
                {
                    url: 'callrec',
                    id: 'callRecProfile',
                    command: 'get_callrec_profile_list'
                },
                {
                    url: 'paging',
                    id: 'pagingProfile',
                    command: 'get_paging_profile_list'
                }
            ].map(function (elem) {
                that.getListsProfiles(elem);
            });
        },

        getDefaultProps: function() {
            return {
                fields: iConfig.getProps('user-card'),
                urlAPI: iConfig.getProps('url-api')
            };
        },

        getInitialState: function() {
            return {
                data: {},
                columns: this.props.columns,
                userProfile: [],
                defaultRole: _.union(
                    [{ text: 'User', value: 'User' }]
                ),
                adminProfile: [],
                pagingProfile: [],
                callRecProfile: [],
                rules: null,
                notifications: null
            };
        },

        getListsProfiles: function (elem) {
            var that = this,
                url = this.props.urlAPI + 'newapi/config/profiles/' + elem.url,
                dataJSON = {
                    session: Cookie.get('token'),
                    command: elem.command
                };

            $.get(url, dataJSON, function (data) {
                var a = [],
                    state = {};

                if ( data.profiles && data.profiles.length > 0 ) {
                    a = data.profiles.map(function (profile) {
                        return { text: profile.profileName, value: profile.profileId };
                    });
                }

                state[elem.id] = _.union(
                    [{ text: '...', value: '' }],
                    a
                );

                that.setState(state);
            });
        },

        show: function (data) {
            var columns = this.state.columns,
                formData = {};

            //clean disabled
            _.map(columns, function (val) {
                if ( val.disabled ) {
                    val.disabled = false;
                }
            });

            //New user
            if ( data.newUser ) {
                formData.newUser = data.newUser;
                formData.devices = [];
            }
            //Multiple users
            else if ( _.isArray(data.UserRecId) && data.UserRecId.length > 1 ) {
                formData = this.multipleColumnsData(data);
            }
            //Alone user
            else {
                formData.userRecId = data.userRecId;
            }

            this.formData = formData;

            this.setState({
                data: data,
                error: false,
                msg: false,
                deleteMsg: false,
                assign: false
            });
            this.checkField(true);
            this.refs.userCard.open();
        },

        multipleColumnsData: function (data) {
            var columns = this.props.columns,
                formData = {};

            _.map(data, function (val, key) {
                if ( val.disabled && columns[key] ) {
                    columns[key].disabled = true;
                }
            });

            formData.userRecId = data.userRecId;

            columns.pin.disabled = columns.password.disabled = true;

            this.setState({
                columns: columns
            });

            return formData;
        },

        hide: function () {
            this.refs.userCard.close();
        },

        handleSubmit: function (e) {
            var hasErrors = this.checkField();

            this.setState({error: false});

            if ( !hasErrors ) {
                this.postData();
            }

            e.preventDefault(e);
        },

        checkField: function (clearErrors) {
            var that = this,
                columns = this.props.columns,
                hasErrors = null,
                data = _.extend(that.state.data, that.formData);

            columns.password.required = data.newUser;

            this.props.fields.map(function (field) {
                field.content.map(function (row) {
                    if ( clearErrors ) {
                        if ( columns[row].error ) {
                            columns[row].error = null;
                        }
                    } else {
                        if ( columns[row].required && !data[row] ) {
                            hasErrors = true;
                            columns[row].error = 'Required field';
                        } else if ( columns[row].required && _.has(data, row) ) {
                            columns[row].error = null;
                        } else if ( row === 'password' && data.newUser ) {
                            hasErrors = true;
                            columns[row].error = 'Required field';
                        }
                    }
                });
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

        postData: function (type) {
            var that = this,
                command = '',
                ajaxUrl = '',
                path = '',
                data;

            this.setState({
                error: false,
                msg: false
            });

            if ( type === 'delete') {
                command = 'delete_user';
                path = 'newapi/config/users/delete';
            } else if (this.state.data && this.state.data.newUser) {
                command = 'add_user';
                path = 'newapi/config/users/add';
            } else {
                command = 'update_user';
                path = 'newapi/config/users/update';
            }

            data = JSON.stringify(this.formData);

            ajaxUrl = that.props.urlAPI + path;

            $.ajax({
                type: "POST",
                url: ajaxUrl,
                contentType: 'json',
                data: {
                    session: Cookie.get('token'),
                    command: command,
                    data: data
                },
                beforeSend: function () {
                    that.refs.Spin.show();
                }
            }).done(function (data) {
                var error = data.error,
                    dataComand = data.command,
                    dataStatus = data.success;

                if ( error ) {
                    var columns = that.state.columns,msg = 'Error';

                    try {
                        error.fields.map(function (element) {
                            columns[element.name].error = element.msg;
                        });
                    } catch(e) { msg = 'Unable to proceed request due to general error.' }

                    that.setState({
                        error: msg,
                        columns: columns
                    });
                } else if ( dataStatus ) {
                    that.statusMessageList(
                        dataComand,
                        '',
                        1
                    );

                    if (data.chr_rules) {
                        that.setState({
                            rules: data.chr_rules
                        });
                    }

                    if (data.vmnr_rules) {
                        that.setState({
                            notifications: data.vmnr_rules
                        });
                    }
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                iError.parceError(jqXHR, textStatus, errorThrown);
            }).always(function () {
                that.refs.Spin.hide();
            });
        },

        statusMessageList: function (status, user, num) {
            var msg = '',
                msgUser = 'User ' + user,
                msgStatus = 'added';

            if ( num > 1 ) {
                msgUser = num + ' users';
            }

            if ( status === 'delete_user' ) {
                msgStatus = 'deleted';
            } else if ( status === 'update_user' ) {
                msgStatus = 'updated';
            }

            msg = msgUser + ' ' + msgStatus;

            if ( this.props.statusMessage && status !== 'update_user' ) {
                this.hide();
            } else {
                this.setState({ msg: msg });
            }

            this.props.statusMessage({
                status: status,
                user: user,
                msg: msg
            });
        },

        // Delete handler for `refs`
        deleteHandle: function (data) {
            var formData = {};

            formData.userRecId = data.userRecId;

            if ( !_.isArray(formData.userRecId) ) {
                formData.userRecId = [formData.userRecId];
            }

            this.formData = formData;

            this.postData('delete');
        },

        toggleDeleteDialog: function (deleteMsg) {
            this.setState({ deleteMsg: deleteMsg });
        },

        handleInputChange: function (name, value, error) {
            var formData = this.formData || {},
                errorFields = this.errorFields || {};

            errorFields[name] = error;
            formData[name] = value;

            this.errorFields = errorFields;
            this.formData = formData;
        },

        toggleAssign: function () {
            this.setState({
                assign: !this.state.assign
            });
        },

        changeAssigned: function (list) {
            this.formData.devices = list;
        },

        onRulesListChange: function (data) {
            this.formData.chr_rules = data;
        },

        onNotificationsListChange: function (data) {
            this.formData.vmnr_rules = data;
        },

        render: function() {
            'use strict';

            var that = this,
                modal,
                content,
                headerText,
                error = '',
                message = '',
                deleteMsg = '',
                assign = '',
                access = 'SAVE',
                deleteButton = access ? 'DELETE' : false,
                deleteHandle = null,
                userData = this.state.data,
                multipleEdit = false;

            if ( this.state.error ) {
                error = (
                    <div className='user-card__error row'>
                        {this.state.error}
                    </div>
                );
            }

            if ( this.state.msg ) {
                message = (
                    <InfoLine>
                        {this.state.msg}
                    </InfoLine>
                );
            }

            if ( this.state.deleteMsg ) {
                deleteMsg = (
                    <InfoLine mixCls='user-card__delete'>
                        <span className='user-card__delete-text'>Are you sure you wont to delete the user?</span>
                        <Button type='button' option='danger' title="Delete this user from database" onClick={this.deleteHandle.bind(this, this.formData)}>YES</Button>
                        <Button type='button' option='primary' title="Cancel delete operation" onClick={this.toggleDeleteDialog.bind(this, false)}>NO</Button>
                    </InfoLine>
                );
            }

            if ( access && !userData.newUser ) {
                deleteHandle = this.deleteHandle;
            }

            if ( userData ) {
                if ( userData.newUser ) {
                    headerText = 'New user';
                    deleteButton = false;
                } else if ( userData.userRecId && userData.userRecId.length > 1 ) {
                    headerText = userData.userRecId.length + ' users';
                } else {
                    headerText = (
                        <div className='user-card__header'>
                            <span className='user-card__header-text'>
                                {userData.login}
                            </span>
                        </div>
                    );
                }
                if ( !userData.newUser ) {
                    assign = <Assign
                                key='1'
                                write={this.props.rights}
                                fullList={this.state.fullList}
                                mixCls='user-card__box user-card__assign'
                                type='user'
                                changeAssigned={this.changeAssigned}
                                ownerData={this.state.data}/>;
                }

                multipleEdit = _.isArray(userData.userRecId) && userData.userRecId.length > 1;
            }

            if ( !that.props.rights ) {
                deleteButton = access = null;
            }

            content = (
                <div className={blockName + '__content'} key='0'>
                    {this.createContent(access, multipleEdit)}
                    {assign}
                </div>
            );

            //TODO: disable multi edit
            //debugger
            //if (multipleEdit)

            modal = (
                <Modal
                    clsMix='user-card__modal'
                    ref='userCard'
                    id='userCard'
                    header={headerText}
                    confirm={this.props.rights && access}
                    delete={this.props.rights && deleteButton}
                    onHiddenEvent={this.onHiddenEvent}
                    deleteHandle={this.toggleDeleteDialog.bind(this, true)}
                    onConfirm={this.handleSubmit}>

                    <div className='user-card__container'>
                        {error}
                        {message}
                        <Panels
                            panels={[
                                {
                                    header: 'Main properties',
                                    name: 'main',
                                    content: [
                                        content
                                    ]
                                },
                                {
                                    header: 'Call handling rules',
                                    name: 'rules',
                                    content: <Rules
                                                rules={that.state.rules}
                                                userData={userData}
                                                users={that.props.users}
                                                onUpdateRule={that.onUpdateRule}
                                                onRulesListChange={that.onRulesListChange}/>
                                }
                                ,{
                                    header: 'Notification rules',
                                    name: 'notifications',
                                    content: <Notifications
                                                notifications={that.state.notifications}
                                                userData={userData}
                                                users={that.props.users}
                                                onUpdateRule={that.onUpdateRule}
                                                onNotificationsListChange={that.onNotificationsListChange}/>
                                }
                            ]}
                            onChangeHandler={this.onTabChange}/>
                        {deleteMsg}
                    </div>
                </Modal>
            );

            return (
                <div className='user-card'>
                    {modal}
                    <Spin ref='Spin' />
                </div>
            );
        },

        createContent: function (access, multipleEdit) {
            var that = this,
                content;

            content = this.props.fields.map(function (field, i) {
                return (
                    <div className='user-card__box' key={i}>
                        <h4 className='user-card__box-header'>
                            {field.header}
                        </h4>
                        <div className='user-card__box-content'>
                            {field.content.map(function (row, i) {
                                var rowData = '',
                                    rowLabel = '',
                                    rowLabelPresent = null,
                                    columns = that.state.columns,
                                    column = columns[row],
                                    label = column && column.text || '',
                                    inputValue = that.state.data[row] || '',
                                    key = _.random(0, 1000) + '_' + i,
                                    disabled = false,
                                    type = column && column.type || '',
                                    name = column && column.id || '',
                                    error = column && column.error || '',
                                    illegalSymb = column && column.illegalSymb || '',
                                    maxLength = column && column.maxLength || '';

                                if ( !access ||
                                        !that.props.rights ||
                                        that.state.data.HomeSystem &&
                                        that.state.data.HomeSystem !== '0' &&
                                        !columns[row].remoteEdit ) {
                                    disabled = true;
                                }

                                if ( multipleEdit && ( column && column.disabled || column && !column.multipleEdit )) {
                                    disabled = true;
                                    inputValue = '~~~~~~~~~';
                                }

                                if ( !type ) {
                                    rowLabelPresent = true;

                                    rowData = <Input name={name}
                                                text={inputValue}
                                                error={error}
                                                maxLength={maxLength}
                                                illegalSymb={illegalSymb}
                                                patterns={column && column.patterns || ''}
                                                clear='true'
                                                disabled={disabled}
                                                placeholder={"↵ " + label}
                                                onChangeHandler={that.handleInputChange}/>;
                                } else if ( type === 'checkbox' ) {
                                    var checked = inputValue === 'true';

                                    rowData = <Checkbox
                                                name={name}
                                                text={label}
                                                checked={checked}
                                                disabled={disabled}
                                                onChangeHandler={that.handleInputChange}/>;
                                } else if ( type === 'select' ) {
                                    rowLabelPresent = true;

                                    rowData = <Select
                                                name={name}
                                                select={inputValue.profileId}
                                                options={that.state[name]}
                                                error={error}
                                                disabled={disabled}
                                                onChangeHandler={that.handleInputChange}/>;
                                } else if ( type === 'password' ) {
                                    rowLabelPresent = true;
                                    rowData = <Input
                                                type='password'
                                                name={name}
                                                placeholder={"↵ " + label}
                                                text={inputValue}
                                                error={error}
                                                maxLength={maxLength}
                                                clear='true'
                                                disabled={disabled}
                                                onChangeHandler={that.handleInputChange}/>;
                                }

                                if ( rowLabelPresent ) {
                                    rowLabel = (<div className='user-card__box-row-label col-md-4'>
                                        {label}
                                    </div>);
                                }

                                if ( that.state.data.UserRecId ) {
                                    key = that.state.data.UserRecId + key;
                                }

                                return (
                                    <div className='user-card__box-row row' key={key}>
                                        {rowLabel}
                                        <div className='user-card__box-row-data col-md-8'>
                                            {rowData}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            });

            return content;
        }
    });

    provide(UserCard);
});
