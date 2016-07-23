modules.define('dropdown', ['react', 'underscore', 'i-outside-click', 'react-dom'], function(provide, React, _, iOutsideClick, ReactDOM) {
    /**
     * Create dropdown control
     *
     * @property {Obj} content                  - content for dropdown
     * @property {String} [type=simple]         - control type
     * @property {Boolean|String} disabled      - disabled attribute for control
     * @property {String} mixCls                - css classes for mix
     * @property {String} [header]
     * @property {Boolean} [disAutoClose]
     * @property {Boolean} [opened]             - declare open class
     *
     * @property {function} [onChangeOpen]      - fire event when opened, useble with disAutoClose only
     */
    var Button = React.createClass({
        mixins: [iOutsideClick],

        hadleOutsideClick: function (e) {
            var elem = ReactDOM.findDOMNode(this);

            if ( !elem.contains(e.target) && this.state.opened ) {
                this.toggleOpen();
            }
        },

        getDefaultProps: function() {
            return {
                id: 'dropdownMenu' + _.random(0,1000)
            };
        },

        getInitialState: function() {
            return {
                opened: this.props.opened || false
            };
        },

        componentWillReceiveProps: function (nextProps) {
            if ( _.has(nextProps, 'opened') ) {
                this.setState({
                    opened: nextProps.opened
                });
            }
        },

        toggleOpen: function () {
            if ( this.props.disAutoClose ) {
                this.setState({
                    opened: !this.state.opened
                });

                if ( this.props.onChangeOpen ) {
                    this.props.onChangeOpen();
                }
            }
        },

        render: function() {
            var cls,
                mixCls = this.props.mixCls || '',
                header = this.props.current || this.props.header || '...',
                caret = !this.props.disabled && (<span className='caret'></span>),
                dataToggle = 'dropdown',
                opened = '',
                control;

            if ( this.state.opened ) {
                opened = 'open';
            }

            if ( this.props.disAutoClose )  {
                dataToggle = null;
                opened = this.state.opened && 'open';
            }

            if ( this.props.type === 'simple' ) {
                control = (
                    <span
                        className='link link-simple dropdown-toggle'
                        id={this.props.id}
                        data-toggle={dataToggle}
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={this.toggleOpen}>
                        {header}
                        {caret}
                    </span>
                );
            } else {
                control = (
                    <button
                        disabled={this.props.disabled}
                        className='btn btn-default dropdown-toggle'
                        type='button'
                        id={this.props.id}
                        data-toggle={dataToggle}
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={this.toggleOpen}>
                        {header}
                        {caret}
                    </button>
                );
            }

            cls = [mixCls, 'dropdown', opened, this.props.type === 'simple' ? 'dropdown_type_simple' : ''].join(' ');

            return (
                <div className={cls}>
                    {control}
                    <div className='dropdown-menu' role='menu' aria-labelledby={this.props.id}>
                        {this.props.content}
                    </div>
                </div>
            );
        }
    });

    provide(Button);
});
