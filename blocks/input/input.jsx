modules.define('input', ['react', 'underscore', 'glyphicon'], function(provide, React, _, Glyphicon) {
    /**
     * Create new bootstrap input group
     *
     * @property {string} name                  - value for name and id, for label
     * @property {string} id                    - if null generate random
     * @property {string} [type='text']         - input type
     * @property {string} text                  - value for input
     * @property {string} [error='Error']       - value for error field
     * @property {string} [maxLength]           - maximum length for input value
     * @property {string} [placeholder]
     * @property {Boolean} disabled
     * @property {Boolean} clear                - clear element
     * @property {Boolean} updateble               - Updateble when recive new props
     *
     * @property {function} [onChangeHandler]   - callback function
     */
    var Input = React.createClass({
        getInitialState: function() {
            var textLength = this.props.text && this.props.text.length || 0;

            return {
                value: this.props.text,
                type: this.props.type || 'text',
                error: this.props.error,
                currentLength: textLength,
                clearView: this.props.text && this.props.text.length > 0
            };
        },

        componentWillReceiveProps: function (nextProps) {
            if ( this.props.updateble && nextProps.text !== this.state.value ) {
                this.setState({
                    value: nextProps.text
                });
            }
        },

        getDefaultProps: function () {
            return {
                type: 'text',
                inputId: _.random(0, 100)
            };
        },

        handleChange: function(event) {
            var str = event.target.value,
                error = false;

            if ( this.props.illegalSymb && str.length && this.props.type === 'text' ) {
                var re = new RegExp(this.props.illegalSymb.re);

                if ( str.match(re) ) {
                    error = 'Illegal symbol " ' + str.match(re)[0] + ' "';
                }
            }

            if ( this.props.maxLength && this.props.maxLength < str.length ) {
                error = 'Wrong length';
            }

            if ( this.props.patterns && str.length ) {
                this.props.patterns.map(function (pattern) {
                    var re = new RegExp(pattern.re);

                    if ( !re.test(str) ) {
                        error = pattern.errorText;
                    }
                });
            }

            this.setState({
                value: str,
                error: error,
                currentLength: str.length,
                clearView: str.length > 0
            });

            if ( this.props.onChangeHandler ) {
                this.props.onChangeHandler(this.props.name, str, error);
            }
        },

        clearInput: function () {
            this.setState({
                value: '',
                error: false,
                currentLength: 0,
                clearView: false
            });

            if ( this.props.onChangeHandler ) {
                this.props.onChangeHandler(this.props.name, '');
            }
        },

        render: function() {
            var inputType = this.state.type,
                inputId = this.props.id || this.props.inputId,
                value = this.state.value,
                currentLength = this.state.currentLength,
                error = '',
                clear = '',
                cls = 'input',
                lengthElem,
                disabled = this.props.disabled;

            if ( !disabled && this.props.maxLength && this.state.value ) {
                var maxLengthString = currentLength + '/' + this.props.maxLength;

                lengthElem = (
                    <div className='input__length'>
                        {maxLengthString}
                    </div>
                );
            }

            if ( !disabled && this.state.error || this.props.error ) {
                var errorText = this.state.error || this.props.error;

                cls = [cls, cls + '--error'].join(' ');

                error = (
                    <div className='input__error'>
                        {errorText}
                    </div>
                );
            }

            if ( !disabled && this.props.clear && this.state.clearView ) {
                clear = (
                    <div className='input__clear' onClick={this.clearInput}>
                        <Glyphicon title="Clear current value" icon='remove' />
                    </div>
                );
            }

            return (
                <div className={cls}>
                    <input
                        placeholder={this.props.placeholder}
                        className="form-control"
                        type={inputType}
                        id={inputId}
                        name={this.props.name}
                        value={value}
                        disabled={disabled}
                        onChange={this.handleChange}
                        onFocus={this.onFocusHandler}
                        onBlur={this.onBlurHandler}/>
                    {error}
                    {lengthElem}
                    {clear}
                </div>
            );
        }
    });

    provide(Input);
});
