modules.define('header_type_empty', [
    'react',
    'logo',
    'main-menu'
], function(provide, React, Logo, Menu) {

    var Header = React.createClass({

        render: function() {
            return (
                <div className="row">
                    <div className="header header_type_empty">
                        <Logo />
                    </div>
                </div>
            );
        }
    });

    provide(Header);
});
