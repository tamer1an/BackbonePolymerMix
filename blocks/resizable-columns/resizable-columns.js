modules.define('resizable-columns', ['loader_type_js','jquery'], function(provide, loader) {
    loader('/admin/store.js', function() {    });

    loader('/admin/resizable-columns.js', function() {
        provide($);
    })
});

