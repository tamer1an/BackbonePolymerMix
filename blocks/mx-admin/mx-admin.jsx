modules.define('mx-admin', [
    'react',
    'jquery',
    'cookie',
    'user-list',
    'devices-list',
    'assign-full',
    'header',
    'i-history',
    'i-config',
    'i-error',
    'rules',
    'webcomponents'
], function(provide, React, $, Cookie, UserList, DevicesList, AssignFull, Header, iHistory, iConfig, iError, Rules, webComp) {

    var MXAdmin = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        getDefaultProps: function() {
            return {
                urlApi: iConfig.getProps('url-api')
            };
        },

        getInitialState: function() {
            return {
                page: iHistory.getProp('page')
            };
        },

        onPopState: function() {
            this.setState({ page: iHistory.getProp('page') });
        },

        handleLogOut: function () {
            if ( this.props.handleLogOut ) {
                this.props.handleLogOut();
            }
        },

        render: function() {
            var content = '';

            if ( this.state.page === 'users' ) {
                content = <UserList read={this.props.read} write={this.props.write}/>;
            } else if ( this.state.page === 'devices' ) {
                content = <DevicesList read={this.props.read} write={this.props.write}/>;
            } else if ( this.state.page === 'assignment' ) {
                content = <AssignFull  read={this.props.read} write={this.props.write}/>;
            }

            window.onpopstate = this.onPopState;

            return (
                <div className="mx-admin container-fluid">
                    <Header page={this.linkState('page')} handleLogOut={this.handleLogOut}/>
                    {content}
                </div>
            );
        }
    });

    provide(MXAdmin);

});
