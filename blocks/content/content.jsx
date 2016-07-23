modules.define('content', [
    'react',
    'form-login',
    'mx-admin',
    'cookie'
], function(provide, React, FormLogin, MXAdmin, Cookie) {

    var Content = React.createClass({
        getInitialState: function() {
            var token = Cookie.get('token'),
                read = Cookie.get('token_read'),
                write = Cookie.get('token_write');

            return {
                logined: token || false,
                read: read && read.split(','),
                write: write && write.split(',')
            };
        },

        handleLogin: function (data) {
            Cookie.set('token', data.session, { expires: 0.042 });
            Cookie.set('token_read', data.read_commands, { expires: 0.042 });
            Cookie.set('token_write', data.write_commands, { expires: 0.042 });

            this.setState({
                logined: data.session,
                read: data.read_commands,
                write: data.write_commands
            });
        },

        handleLogOut: function () {
            Cookie.set('token', null, { expires: 'Thu, 01 Jan 1970 00:00:01 GMT' });
            window.location.reload();
        },

        render: function() {
            var content;

            if (this.state.logined) {
                content = <MXAdmin read={this.state.read} write={this.state.write} handleLogOut={this.handleLogOut}/>;
            } else {
                content = <FormLogin handleLogin={this.handleLogin}/>;
            }

            return content;
        }
    });

    provide(Content);

});
