modules.define('call-from', [
    'react', 'checkbox', 'tool-tip'
], function(provide, React, Checkbox, ToolTip) {
    /**
     * Call from control for roll card
     *
     * @property {Obj[]}        - users list
     * @property {String[]}     - list of known numbers
     */
    var blockName = this.name,
        CallFrom = React.createClass({
        getInitialState: function() {
            return {
                numbers: [],
                value: this.props.value
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
                    key: 'login',
                    name: 'SIP',
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

        remove: function (elem) {
            var list = this.state.value,
                index = list.indexOf(elem);

            list.splice(index, 1);

            this.setState({
                value: list
            });
        },

        add: function (elem) {
            var list = this.state.value;

            list.push(elem);

            this.setState({
                value: list
            });
        },

        render: function() {
            var that = this,
                internalDis = false,
                externalDis = false;

            if ( this.state.value && this.state.value.indexOf('Internal') !== -1 ) {
                internalDis = true;
            }

            if ( this.state.value && this.state.value.indexOf('External') !== -1 ) {
                externalDis = true;
            }

            return (
                <div className={blockName}>
                    <div className={blockName + '__value'}>
                        {this.state.value.map(function (elem, index) {
                            return (
                                <span
                                    key={index}
                                    className={blockName + '__value-elem'}
                                    onClick={that.remove.bind(that, elem)}>
                                    {elem}
                                    <span className={blockName + '__value-elem-rem'}>
                                        ×
                                    </span>
                                </span>
                            );
                        })}
                    </div>
                    <div className={blockName + '__control'}>
                        <div className={blockName + '__control-row'}>
                            <div className={
                                    [
                                        blockName + '__add-button',
                                        internalDis ? blockName + '__add-button' + '--dis' : ''
                                    ].join(' ')
                                }
                                onClick={!internalDis && that.add.bind(that, 'Internal')}>
                                + Any Internal Source
                            </div>
                            <div className={
                                    [
                                        blockName + '__add-button',
                                        externalDis ? blockName + '__add-button' + '--dis' : ''
                                    ].join(' ')
                                }
                                onClick={!externalDis && that.add.bind(that, 'External')}>
                                + Any External Source
                            </div>
                        </div>
                        {
                            this.props.userList && <div className={blockName + '__control-row'}>
                                Phone Number or User ID
                                {this.createUserList(internalDis, externalDis)}
                                {this.createAddNumbers(internalDis, externalDis)}
                            </div>
                        }
                    </div>
                </div>
            );
        },

        createAddNumbers: function (internalDis, externalDis) {
            var that = this,
                numbers;

            if ( this.state.numbers && (!internalDis || !externalDis) ) {
                numbers = this.state.numbers.map(function (number, key) {
                    if (number.value) {
                        return (
                            <div className={blockName + '__phone'} key={key}>
                                {number.name + ': '}
                                <div
                                    className={blockName + '__add-button'}
                                    onClick={that.add.bind(that, number.value)}>
                                    {'+ ' + number.value}
                                </div>
                            </div>
                        );
                    }
                });
            }

            return numbers;
        },

        createUserList: function (internalDis, externalDis) {
            return <ToolTip
                        disabled={internalDis && externalDis}
                        onChangeHandler={this.onSelectUser}
                        searchList={this.props.userList}
                        fields={['firstName', 'lastName']}
                        placeholder='Search in User list'/>;
        }
        });

    provide(CallFrom);
});
