modules.define('btn-group-nesting', [
    'react',
    'button'
], function(provide, React, Button) {
    /**
     * Create new bootstrap btn group
     *
     * @property {array} list       - list of data
     * @property {array} [number=4] - length of visible items
     */
    var BtnGN = React.createClass({
        getInitialState: function() {
            return {
                active: null
            };
        },

        clickHandler: function (e) {
            var active = null;

            if ( e.target.id !== this.state.active ) {
                active = e.target.id;
            }

            this.setState({active: active});

            if ( this.props.callbackHandler ) {
                this.props.callbackHandler(active);
            }
        },

        render: function() {
            var that = this,
                length = this.props.length || 4,
                active = that.state.active || that.props.active,
                buttons,
                dropdown;

            buttons = this.props.list.slice(0, length).map(function (item, i) {
                var mixCls = item.id.toString() === active ? 'active' : '';

                return (
                    <Button key={i} mixCls={mixCls} id={item.id} clickHandler={that.clickHandler}>
                        {item.text}
                    </Button>
                );
            });

            //TODO: finish dropdown list
            if ( this.props.list + 1 > length ) {
                dropdown = (
                    <div className="btn-group" role="group">
                        <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            More&nbsp;
                            <span className="caret"></span>
                        </button>
                        <ul className="dropdown-menu" role="menu">
                            <li><a href="#">Dropdown link</a></li>
                            <li><a href="#">Dropdown link</a></li>
                        </ul>
                    </div>
                )
            }

            return (
                <div className="btn-group-nesting btn-group" role="group" aria-label="...">
                    {buttons}
                </div>
            );
        }
    });

    provide(BtnGN);
});
