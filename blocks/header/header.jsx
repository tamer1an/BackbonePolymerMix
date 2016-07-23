modules.define('header', [
    'react',
    'logo',
    'main-menu',
    'glyphicon'
], function(provide, React, Logo, Menu, Glyphicon) {

    var Header = React.createClass({
        handleLogOut: function () {
            if ( this.props.handleLogOut ) {
                this.props.handleLogOut();
            }
        },

        render: function() {
            return (
                <div className="row">
                    <div className="header">
                        <Menu page={this.props.page}/>
                        <Logo />
                        <Glyphicon icon='log-out' onClick={this.handleLogOut}/>
                    </div>
                </div>
            );
        }
    });

    provide(Header);
});
