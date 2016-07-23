modules.define('react-dom', ['react','loader_type_js'], function(provide, react, loader) {
    loader('https://fb.me/react-dom-0.14.3.js', function() {

        provide(ReactDOM);

        delete window.React;
        delete window.ReactDOM;
    });
});
