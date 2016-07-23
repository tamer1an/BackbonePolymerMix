modules.define('notif',
    ['react', 'button', 'dropdown', 'checkbox', 'underscore', 'cookie', 'jquery', 'i-error', 'i-config', 'notif-card'],
    function(provide, React, Button, Dropdown, Checkbox, _, Cookie, $, iError, iConfig, NotificationCard) {

        var blockName = this.name,
        Notif = React.createClass({

            getDefaultProps: function() {
                return {
                    fields: iConfig.getProps('user-card'),
                    urlAPI: iConfig.getProps('url-api')
                };
            },

            componentWillReceiveProps: function (newProps) {
                if ( newProps.userData && newProps.userData.userRecId && newProps.userData.userRecId[0] &&
                    newProps.userData.userRecId[0] !== this.state.userRecId ) {
                    this.getNotification(newProps.userData.userRecId[0]);
                }

                if (newProps.notifications) {
                    this.setState({
                        notifications: newProps.notifications
                    });
                }
            },

            getInitialState: function() {
                return {
                    new: {
                        name: 'User Name',
                        preference: 'Rule description',
                        events: [],
                        conditions: [],
                        description: [],
                        new: true
                    }
                };
            },

            getNotification: function (userRecId) {
                var that = this;

                $.ajax({
                    type: "GET",
                    url: '/admin/newapi/config/vmnr_list',
                    data: {
                        session: Cookie.get('token'),
                        command: 'get_vmnr_list',
                        userRecId: userRecId
                    },
                    dataType: 'json'
                }).done(function(data) {
                    that.setState({
                        notifications: data.vmnr_rules,
                        userRecId: userRecId
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    iError.parceError(jqXHR, textStatus, errorThrown);
                });
            },

            addRule: function () {
                var notifications = this.state.notifications,
                    user = this.props.userData;


                if (_.isArray(notifications)){
                    notifications.push({
                        number: notifications.length,
                        ownerType: "User",
                        rule: [{Enabled: [true]}, {IfUnread: ["delete"]}, {"Notify": []}],
                        ruleId: '',
                        ruleName: [user.firstName, user.lastName, 'rule', notifications.length + 1].join(' '),
                        userId: user.userRecId[0]
                    });
                } else {
                    notifications = [{
                        number: 0,
                        ownerType: "User",
                        rule: [{Enabled: [true]}, {IfUnread: ["delete"]}, {"Notify": []}],
                        ruleId: '',
                        ruleName: [user.firstName, user.lastName, 'rule', 1].join(' '),
                        userId: user.userRecId[0]
                    }];
                }

                this.setState({
                    notifications: notifications
                });

                if (this.props.onNotificationsListChange) {
                    this.props.onNotificationsListChange(notifications);
                }
            },

            updateRule: function (index, data) {
                var notifications = this.state.notifications;

                if (data) {
                    notifications[index] = data;
                } else {
                    notifications.splice(index, 1);
                }

                this.setState({
                    notifications: notifications
                });

                if (this.props.onNotificationsListChange) {
                    this.props.onNotificationsListChange(notifications);
                }
            },

            render: function() {
                var that = this,
                    addButton,
                    content = [],
                    notifications = this.state.notifications;

                if ( notifications ) {
                    content = [];

                    _.sortBy(notifications, 'number').map(function (rule, i) {
                        content.push(
                            <NotificationCard
                                onUpdateRule={that.updateRule.bind(that, i)}
                                userData={that.props.userData}
                                users={that.props.users}
                                key={i}
                                rule={rule}/>
                        );
                    });
                }

                addButton = (
                    <div className={blockName + '__add-button'}>
                        <Button title="Add new notification rule" clickHandler={this.addRule}>Add rule</Button>
                    </div>
                );

                return (
                    <div className={blockName}>
                        <ul className={blockName + '__list'}>
                            {content}
                        </ul>
                        {addButton}
                    </div>
                );
            }
        });
    provide(Notif);
});