modules.define('button', ['react'], function(provide, React) {
    /**
     * Create new bootstrap input group
     *
     * @property {string} [option='default']    - options from http://getbootstrap.com/css/#buttons-options
     * @property {string} [size]                - size from http://getbootstrap.com/css/#buttons-sizes
     * @property {string} [type='button']       - button type
     * @property {string} mixCls                - css classes for mix
     *
     * @property {function} [clickHandler]      - callback function
     */
    var Button = React.createClass({
        clickHandler: function (e) {
            if (this.props.clickHandler) {
                this.props.clickHandler(e);
            }
        },

        render: function() {
            var cls,
                option = this.props.option ? 'btn-' + this.props.option : 'btn-default',
                size = this.props.size ? 'btn-' + this.props.size : '',
                type = this.props.type || 'button',
                mixCls = this.props.mixCls || '';

            cls = [mixCls, 'button', 'btn', option, size].join(' ');

            return (
                <button {...this.props} className={cls} type={type} onMouseDown={this.clickHandler}>
                    {this.props.children}
                </button>
            );
        }
    });

    provide(Button);
});
