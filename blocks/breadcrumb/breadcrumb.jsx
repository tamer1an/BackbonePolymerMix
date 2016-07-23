modules.define('breadcrumb', [
    'react'
], function(provide, React) {

    var Breadcrumb = React.createClass({
        render: function() {
            return (
                <ol className='breadcrumb'>
                    {
                        this.props.path.map(function(elem, i) {
                            return (<li key={i}>{elem}</li>);
                        })
                    }
                </ol>
            );
        }
    });

    provide(Breadcrumb);
});
