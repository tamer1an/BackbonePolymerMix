modules.define('sort', ['react', 'glyphicon', 'jquery'], function(provide, React, Glyphicon, $) {
    /**
     * Sort button
     *
     * @property {string} [size=s]               - sizes, s | m | l | xl
     * @property {string} name                   - elem name for callback
     * @property {Boolean} active
     * @property {string} [direction=forvard]    - direction forvard|reverse
     *
     * @emits Sort#sortFires
     */
    var Sort = React.createClass({
        getInitialState: function() {
            return {
                active: this.props.active,
                direction: this.props.direction
            };
        },

        handleClick: function (e) {
            var active = this.state.active,
                direction = this.state.direction;

            if ( this.state.active ) {
                direction = this.state.direction === 'forvard' ? 'reverse' : 'forvard';
            }

            this.setState({
                active: true,
                direction: direction
            });

            this.sortFires({
                field: this.props.name,
                direction: direction
            });
        },

        componentWillReceiveProps: function (nextProps) {
            this.setState({
                active: nextProps.active
            });
        },

        /**
        * Event Sort
        * Fire event from sort owner
        *
        * @event Sort#sortFires
        * @property {Object} sortProps - react event
        */
        sortFires: function (sortProps) {
            if( this.props.sort ) {
                this.props.sort(sortProps);
            }
        },

        render: function() {
            var cls,
                icons,
                direction =  this.state.direction === 'forvard' ? 'sort--order' : 'sort--order-alt',
                size = this.props.size ? 'sort--' + this.props.size : '',
                active = this.state.active ? '' : 'sort--inactive';

            cls = ['sort', direction, active, size].join(' ');

            icons = (
                <span className='sort__icons'>
                    <Glyphicon icon='arrow-up'/>
                    <Glyphicon icon='arrow-down'/>
                </span>
            )

            return (
                <span className={cls} onClick={this.handleClick}>
                    {icons}
                </span>
            );
        }
    });

    provide(Sort);
});
