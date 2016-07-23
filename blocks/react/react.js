modules.define('react', ['loader_type_js'], function(provide, loader) {
    loader('https://fb.me/react-with-addons-0.14.3.js', function() {
        provide(React);
    });
});
