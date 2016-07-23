modules.define('webcomponents', ['loader_type_js','loader_type_html'], function(provide, loaderJS, loaderHTML) {
    loaderJS('/admin/webcomponents.js', function() {
        loaderHTML('html/call-notifications-rules/notifications-list.html', function() {
            provide({});
        });
    });
});

