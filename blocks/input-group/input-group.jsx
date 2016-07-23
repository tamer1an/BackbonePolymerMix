modules.define('input-group', ['react', 'input'], function(provide, React, Input) {
    /**
     * Create new bootstrap input group
     *
     * @property {string} name              - value for name
     * @property {string} [type='text']     - input type
     * @property {string} label             - label text
     * @property {string} value             - value for input
     */
    var InputGroup = React.createClass({
        render: function() {
            var input = '',
                inputType = this.props.type || 'text',
                inputId = Math.floor(Math.random() * (1000 - 900 + 1)) + 900;

            return (
                <div className='input-field'>
                    <label htmlFor={inputId}>{this.props.label}</label>
                    <Input className='form-control' type={inputType} id={inputId} name={this.props.name} value={this.props.value}/>
                </div>
            );
        }
    });

    provide(InputGroup);
});
