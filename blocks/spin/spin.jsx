modules.define('spin', ['react', 'glyphicon'], function(provide, React, Glyphicon) {
    /**
     * Create new bootstrap checkbox group
     *
     * @property {String} name              - value for name
     * @property {String} text              - value for label
     * @property {Boolean} checked          - value for input
     */
    var Spin = React.createClass({
        getInitialState: function() {
            return { visible: false };
        },

        show: function () {
            this.setState({ visible: true });
        },

        hide: function () {
            this.setState({ visible: false });
        },

        render: function() {
            var cls = '';

            if ( this.state.visible ) {
                cls = 'spin spin--visible';
            } else {
                cls = 'spin';
            }

            return (
                <div className={cls}>
                    <Glyphicon icon='refresh'/>
                </div>
            );
        }
    });

    provide(Spin);
});
