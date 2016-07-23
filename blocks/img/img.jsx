modules.define('img', [
    'react'
], function(provide, React) {
    /**
     * Create new DOM Image
     *
     * @property {string} url               - value for img src
     * @property {string} [alt='Image']     - value for img alt
     * @property {string} [cls='img']       - value for img class
     */
    var Img = React.createClass({

        render: function() {
            var url = this.props.url,
                alt = this.props.alt || 'Image',
                cls = this.props.cls ? this.props.cls + ' img' : 'img';
            return (
                <img className={cls} src={url} alt={alt}/>
            );
        }
    });

    provide(Img);
});
