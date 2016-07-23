modules.define('checkbox', ['react'], function(provide, React) {
    /**
     * Create new bootstrap checkbox group
     *
     * @property {String} name              - value for name
     * @property {String} text              - value for label
     * @property {Boolean} checked
     * @property {Boolean} disabled
     *
     * @property {function} onChangeHandler - on checnge event
     */
    var Checkbox = React.createClass({
        getInitialState: function() {
            return {
                checked: this.props.checked
            };
        },

        onChangeHandler: function (name, value, event) {
            if ( this.props.onChangeHandler ) {
                this.props.onChangeHandler(name, value, event);
            }
        },

        handleChange: function(event) {
            this.setState({checked: event.target.checked});

            this.onChangeHandler(this.props.name, event.target.checked, event);
        },

        componentWillReceiveProps: function(nextProps) {
            this.setState({
                checked: nextProps.checked
            });
        },

        render: function() {
            var cls,
                mixCls = this.props.mixCls || '',
                checked = this.state.checked;

            cls = ['checkbox', mixCls].join(' ');

            return (
                <div className={cls}>
                    <label>
                        <input
                            type="checkbox"
                            name={this.props.name}
                            checked={checked}
                            disabled={this.props.disabled}
                            onChange={this.handleChange}/>
                        {this.props.text}
                    </label>
                </div>
            );
        }
    });

    provide(Checkbox);
});
