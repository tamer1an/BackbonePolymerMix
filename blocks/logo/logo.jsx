modules.define('logo', [
    'react',
    'i-config',
    'img'
], function(provide, React, iConfig, Img) {

    var Logo = React.createClass({

        render: function() {
            var url = iConfig.getProps('url-api') + 'i/logo.png';

            return (
                <div className='logo'>
                    <Img url={url} alt='logo'/>
                </div>
            );
        }
    });

    provide(Logo);
});
