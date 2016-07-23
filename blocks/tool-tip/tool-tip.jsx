modules.define('tool-tip', [
    'react', 'input', 'underscore'
], function(provide, React, Input, _) {
    /**
     * Search input with tool-tip
     *
     * @property {Objects[]}  searchList        - array of objects for search
     * @property {String[]}  [fields=0]         - fields for search in list, all for default
     * @property {Number} [length=5]            - elem counts in dropdown tool-tip
     *
     * @property {Function} [onChangeHandler]
     */
    var blockName = this.name,
        ToolTip = React.createClass({
            getInitialState: function() {
                var searchList = [],
                    fields = this.props.fields;

                if ( this.props.searchList ) {
                    searchList = this.createList(this.props.searchList, fields);
                }

                return {
                    opened: false,
                    searchList: searchList,
                    length: this.props.length || 5,
                    searched: [],
                    fields: fields
                };
            },

            createList: function (data, fields) {
                var searchList = [];

                searchList = data.map(function (elem) {
                    var toolTip = '';

                    if ( fields ) {
                        fields.forEach(function (field) {
                            toolTip = toolTip + elem[field];
                        });
                    }

                    elem.toolTip = toolTip.toLowerCase();
                    return elem;
                });

                return searchList;
            },

            onChangeInputHandler: function (name, value) {
                var val = value.toLowerCase(),
                    re = new RegExp(val, 'g');

                if ( val.length ) {
                    var filtered;

                    filtered = _.filter(this.state.searchList, function (user) {
                        return user.toolTip.match(re);
                    });

                    if ( filtered.length > this.state.length ) {
                        filtered = filtered.slice(0, this.state.length);
                    }

                    this.setState({
                        opened: true,
                        value: value,
                        searched: filtered
                    });
                } else {
                    this.setState({
                        opened: false,
                        value: '',
                        searched: []
                    });

                    if ( this.props.onChangeHandler ) {
                        this.props.onChangeHandler('clear');
                    }
                }
            },

            componentWillReceiveProps: function(nextProps) {
                if (nextProps.searchList) {
                    this.setState({
                        searchList: this.createList(nextProps.searchList, nextProps.fields),
                        fields: nextProps.fields
                    });
                }
            },

            onSelectValue: function (value, card) {
                this.setState({
                    opened: false,
                    value: value
                });

                if ( this.props.onChangeHandler ) {
                    this.props.onChangeHandler(card);
                }
            },

            render: function() {
                var that = this,
                    value = this.state.value || '',
                    list,
                    clsDropdown = 'dropdown',
                    cls = blockName;

                if ( this.state.searched.length ) {
                    clsDropdown = [clsDropdown, this.state.opened ? 'open' : ''].join(' ');
                    list = this.state.searched.map(function (elem, index) {
                        var value = [];

                        that.state.fields.forEach(function (field) {
                            value.push(elem[field]);
                        });

                        value = value.join(' ');

                        return (
                            <div key={index} className={blockName + '__list-elem'} onClick={that.onSelectValue.bind(that, value, elem)}>
                                {value}
                            </div>
                        );
                    });
                }

                return (
                    <div className={cls}>
                        <Input
                            disabled={this.props.disabled}
                            clear={true}
                            updateble={true}
                            text={value}
                            placeholder={this.props.placeholder}
                            onChangeHandler={this.onChangeInputHandler}/>
                        <div className={clsDropdown}>
                            <div className="dropdown-menu" aria-labelledby="dLabel">
                                {list}
                            </div>
                        </div>
                    </div>
                );
            }
    });

    provide(ToolTip);
});
