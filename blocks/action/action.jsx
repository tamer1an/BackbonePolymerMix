modules.define('action',
    ['react', 'underscore', 'dropdown', 'input', 'tool-tip', 'select', 'checkbox', 'button'],
    function(provide, React, _, Dropdown, Input, ToolTip, Select, Checkbox, Button) {
    var blockName = this.name,
        Action = React.createClass({
        getInitialState: function() {
            return {
                action: this.props.action || [],
                name: 'optionsRadios' + _.random(0, 1000),
                numbers: null
            };
        },

        onSelectUser: function (user) {
            var keys = [
                {
                    key: 'extension',
                    name: 'Business',
                    value: ''
                },
                {
                    key: 'cellPhone',
                    name: 'Mobile',
                    value: ''
                },
                {
                    key: 'homePhone',
                    name: 'Home',
                    value: ''
                }
            ],
            numbers = [];

            numbers = keys.map(function (key) {
                key.value = user[key.key];
                return key;
            });

            this.setState({
                numbers: numbers
            });
        },

        setFrowardToPhone: function (number) {
            this.setState({
                action: [{ForwardTo:[number]}]
            });
        },

        selectAction: function (actionName) {
            var o = {};

            o[actionName] = [];

            if ( actionName === 'ForwardToVM' ) {
                o[actionName] = ['-3'];
            } else if ( actionName === 'FindMe' ) {
                o[actionName] = [{Bad:[{ForwardToVM:[ '-3' ]}]}];
            }

            this.setState({
                action: [o]
            });

            if ( actionName !== 'ForwardTo' ) {
                this.setState({
                    numbers: null
                });
            }
        },

        onSelectGreetingHndler: function (name, value) {
            var greeting = this.state.action[0].ForwardToVM[0];

            greeting = greeting.split('.');

            if ( name && greeting[1] && value ) {
                greeting[1] = 'p';
            } else if ( name && greeting[1] ) {
                greeting.splice(1,1);
            } else if (name && !greeting[1]) {
                greeting.push('p');
            } else if (!name) {
                greeting[0] = value;
            }

            this.setState({
                action: [{ForwardToVM : [greeting.join('.')]}]
            });
        },

        onSetActions: function (action) {
            if ( this.props.onSetActions ) {
                this.props.onSetActions(action);
            }
        },

        render: function() {
            var content,
                disabled = 'disabled';

            content = this.createContent();

            if ( this.state.action.length && this.state.action[0] && !this.state.action[0].ForwardTo ||
                 this.state.action[0] && this.state.action[0].ForwardTo && this.state.action[0].ForwardTo.length ) {
                disabled = false;
            }

            return (
                <div className={blockName}>
                    {content}
                    <div className={blockName + '__controls'}>
                        <Button disabled={disabled} onClick={this.onSetActions.bind(this, this.state.action)}>OK</Button>
                        <Button onClick={this.onSetActions.bind(this, this.props.action)}>Cancel</Button>
                    </div>
                </div>
            );
        },

        createContent: function () {
            var content,
                cls = blockName + '__content',
                action = this.state.action;

            content = (
                <div className={cls}>
                    {this.createFrowardTo(cls)}
                    {this.forwardForVM(cls)}
                    {!this.props.unsuccessfull && <div className={cls + '-row'}>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    name={this.state.name}
                                    value='findMe'
                                    checked={  action[0].FindMe }
                                    onChange={this.selectAction.bind(this, 'FindMe')}/>
                                Find Me
                            </label>
                        </div>
                    </div>}
                    <div className={cls + '-row'}>
                        <div className='radio'>
                            <label>
                                <input
                                    type='radio'
                                    name={this.state.name}
                                    value='Reject'
                                    checked={  action[0].Reject }
                                    onChange={this.selectAction.bind(this, 'Reject')}/>
                                Reject
                            </label>
                        </div>
                        <div className={cls + '-row-descr'}>
                            All calls matching this rule will be dropped by the system without notification!
                        </div>
                    </div>
                </div>
            );

            return content;
        },

        forwardForVM: function (cls) {
            var options,
                disabled = true,
                select = '0',
                greeting,
                checked;

            options = [
                { text: 'No Greeting', value: '-3' },
                { text: 'System Greeting', value: '-2' },
                { text: 'Active Greeting', value: '0' },
                { text: 'Greeting 1', value: '1' },
                { text: 'Greeting 2', value: '2' },
                { text: 'Greeting 3', value: '3' },
                { text: 'Greeting 4', value: '4' }
            ];

            if (this.state.action[0] && this.state.action[0].ForwardToVM) {
                disabled = false;

                greeting = this.state.action[0].ForwardToVM[0].split('.');

                select = greeting[0];

                if ( greeting[1] ) {
                    checked = true;
                }
            }

            return (
                <div className={cls + '-row'}>
                    <div className='radio'>
                        <label>
                            <input
                                type='radio'
                                name={this.state.name}
                                value='voiceMail'
                                checked={ this.state.action[0].ForwardToVM }
                                onChange={this.selectAction.bind(this, 'ForwardToVM')}/>
                            Forward to Voice mail
                        </label>
                    </div>
                    <Select
                        options={options}
                        error='disabled'
                        select={select}
                        disabled={disabled}
                        onChangeHandler={this.onSelectGreetingHndler}/>
                    <Checkbox
                        text='Disconnect after greeting'
                        name='p'
                        checked={checked}
                        disabled={disabled}
                        onChangeHandler={this.onSelectGreetingHndler}/>
                </div>
            );
        },

        createFrowardTo: function (cls) {
            var that = this,
                toolTip, numbers,
                disabled = true,
                str = 'Forward to ';

            if (this.state.action[0] && this.state.action[0].ForwardTo) {
                disabled = false;
                str = str + this.state.action[0].ForwardTo;
            }

            if (this.props.users) {
                toolTip = <ToolTip
                    disabled={disabled}
                    onChangeHandler={this.onSelectUser}
                    searchList={this.props.users}
                    fields={['firstName', 'lastName']}
                    placeholder='Search in User list'/>;
            }

            if ( this.state.numbers ) {
                numbers = this.state.numbers.map(function (number, key) {
                    if (number.value) {
                        return (
                            <div className={blockName + '__phone'} key={key} onClick={that.setFrowardToPhone.bind(that, number.value)}>
                                {number.name + ': '}
                                <div
                                    className={blockName + '__add-button'}>
                                    {'+ ' + number.value}
                                </div>
                            </div>
                        );
                    }
                });
            }

            return (
                <div className={cls + '-row'}>
                    <div className='radio'>
                        <label>
                            <input
                                type='radio'
                                name={this.state.name}
                                value='forwardTo'
                                checked={this.state.action[0].ForwardTo}
                                onChange={this.selectAction.bind(this, 'ForwardTo')}/>
                            {str}
                        </label>
                    </div>
                    {toolTip}
                    {numbers}
                </div>
            );
        }
    });

    provide(Action);
});
