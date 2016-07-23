modules.define('underscore', ['loader_type_js'], function(provide, loader) {

    loader('/admin/underscore.js', function() {

        provide(_);

        delete window._;

    })

})

