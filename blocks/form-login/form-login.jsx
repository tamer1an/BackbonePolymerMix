modules.define('form-login', [
    'react',
    'jquery',
    'input-group',
    'button',
    'header_type_empty',
    'cookie',
    'i-config',
    'react-dom'
], function(provide, React, $, InputGroup, Button, Header, Cookie, iConfig, ReactDOM) {

    var FormLogin = React.createClass({
        getDefaultProps: function() {
            return {
                urlApi: iConfig.getProps('url-api')
            };
        },

        getInitialState: function() {
            return {
                error: null
            };
        },

        handleSubmit: function (e) {
            var that = this,
                data = {};

            data.login = $('input[name="login"]', ReactDOM.findDOMNode(this)).val();
            data.password = $('input[name="password"]', ReactDOM.findDOMNode(this)).val();

            $.ajax({
                type: 'POST',
                url: that.props.urlApi + 'newapi/users',
                data: {
                    data: JSON.stringify(data)
                },
                dataType: 'json'
            })
            .done(function(data) {
                if ( data.error ) {
                    that.setState({
                        error: data.error.msg || 'Error'
                    });
                } else {
                    that.handleLogin(data);
                }
            })
            .fail(function() {
                alert('An error has occurred, reload this page or try again later');
            });

            e.preventDefault();
        },

        handleLogin: function (data) {
            this.props.handleLogin(data);
        },

        render: function() {
            var error;

            if ( this.state.error ) {
                error = (
                    <div className='form-login__error'>
                        {this.state.error}
                    </div>
                );
            }

            return (
                <div className='form-login container-fluid'>
                    <Header />
                    <div className='row'>
                        <div className='form-login__wrapper col-md-4 col-md-offset-4'>
                            {error}
                            <form role='form' type='POST' onSubmit={this.handleSubmit}>
                                <div className='form-group'>
                                    <InputGroup name='login' label='Login'/>
                                </div>
                                <div className='form-group'>
                                    <InputGroup name='password' type='password' label='Password' />
                                </div>
                                <div className='form-group'>
                                    <Button type='submit'>
                                        Submit
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
    });

    provide(FormLogin);
});
