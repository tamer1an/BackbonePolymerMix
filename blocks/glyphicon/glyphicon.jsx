modules.define('glyphicon', [
    'react'
], function(provide, React) {
    /**
     * Create new DOM span glyphicon from Bootstrap
     *
     * @property {string} icon   - icon name from set http://getbootstrap.com/components/#glyphicons
     */
    var Glyphicon = React.createClass({
        render: function() {
            return (
                <span {...this.props} className={'glyphicon glyphicon-' + this.props.icon}></span>
            );
        }
    });

    provide(Glyphicon);
});
