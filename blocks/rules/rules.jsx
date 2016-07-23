modules.define('rules',
    ['react', 'button', 'dropdown', 'checkbox', 'underscore', 'cookie', 'jquery', 'i-error', 'i-config', 'rule-card'],
    function(provide, React, Button, Dropdown, Checkbox, _, Cookie, $, iError, iConfig, RuleCard) {
    var blockName = this.name,
        Rules = React.createClass({
            getDefaultProps: function() {
                return {
                    fields: iConfig.getProps('user-card'),
                    urlAPI: iConfig.getProps('url-api')
                };
            },

            componentWillReceiveProps: function (newProps) {
                if ( newProps.userData && newProps.userData.userRecId && newProps.userData.userRecId[0] &&
                     newProps.userData.userRecId[0] !== this.state.userRecId ) {
                    this.getRule(newProps.userData.userRecId[0]);
                }

                if (newProps.rules) {
                    this.setState({
                        rules: newProps.rules
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

            getRule: function (userRecId) {
                var that = this;

                $.ajax({
                    type: "GET",
                    url: '/admin/newapi/config/rules',
                    data: {
                        session: Cookie.get('token'),
                        command: 'get_chr_list',
                        userRecId: userRecId
                    },
                    dataType: 'json'
                }).done(function(data) {
                    that.setState({
                        rules: data.chr_rules,
                        userRecId: userRecId
                    });
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    iError.parceError(jqXHR, textStatus, errorThrown);
                });
            },

            addRule: function () {
                var rules = this.state.rules,
                    user = this.props.userData;

                rules.push({
                    address: '',
                    addresseeId: '',
                    displayUserIDForExCall: false,
                    enabled: true,
                    number: rules.length,
                    ownerType: 'User',
                    rule: {
                        Actions: [{Reject: []}]
                    },
                    ruleId: '',
                    ruleName: [user.firstName, user.lastName, 'rule', rules.length + 1].join(' '),
                    userId: user.userRecId[0]
                });

                this.setState({
                    rules: rules
                });

                if (this.props.onRulesListChange) {
                    this.props.onRulesListChange(rules);
                }
            },

            updateRule: function (index, data) {
                var rules = this.state.rules;

                if (data) {
                    rules[index] = data;
                } else {
                    rules.splice(index, 1);
                }

                this.setState({
                    rules: rules
                });

                if (this.props.onRulesListChange) {
                    this.props.onRulesListChange(rules);
                }
            },

            render: function() {
                var that = this,
                    addButton,
                    content,
                    rules = this.state.rules;

                if ( rules ) {
                    content = [];

                    _.sortBy(rules, 'number').map(function (rule, i) {
                        content.push(
                            <RuleCard
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
                        <Button  title="Add new call handling rule" clickHandler={this.addRule}>Add rule</Button>
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

    provide(Rules);
});
