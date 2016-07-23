modules.define('select', ['react'], function(provide, React) {
    /**
     * Create new bootstrap select
     *
     * @property {String} name               - value for name
     * @property {String} select             - selected value
     * @property {Array} options             - array of options
     * @property {String} options[i].text    - option's text
     * @property {String} options[i].value   - option's value
     * @property {Boolean} disabled
     * @property {string} [error='Error']   - value for error field
     */
    var Checkbox = React.createClass({
        getInitialState: function() {
            return {
                select: this.props.select
            };
        },

        onChangeHandler: function (name, value) {
            if ( this.props.onChangeHandler ) {
                this.props.onChangeHandler(name, value);
            }
        },

        handleChange: function(event) {
            this.setState({select: event.target.value});

            this.onChangeHandler(this.props.name, event.target.value);
        },

        render: function() {
            var cls = 'select',
                options = this.props.options.map(function (option, i) {
                    var text = option.text,
                        value = option.value;
                    return (<option key={i} value={value}>{text}</option>);
                }),
                value = this.state.select || this.props.select,
                error;

            if ( this.props.error ) {
                var errorText = this.props.error || 'Error';

                error = (
                    <div className='select__error'>
                        {errorText}
                    </div>
                );
            }

            if ( this.props.error === 'disabled' ) {
                cls = [cls, cls + '--error-dis'].join(' ');
            }

            return (
                <div className={cls}>
                    <select
                        className='form-control'
                        name={this.props.name}
                        value={value}
                        disabled={this.props.disabled}
                        onChange={this.handleChange}>
                        {options}
                    </select>
                    {error}
                </div>
            );
        }
    });

    provide(Checkbox);
});
