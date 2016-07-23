module.exports = function(grunt) {

    grunt.initConfig({
        "jshint": {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globalstrict: true,
                globals: {
                    angular: true
                }
            },
            uses_defaults: ['src/js/app/**/*.js'] //, 'src/**/*.js'

            //beforeconcat: ['src/foo.js', 'src/bar.js'],
            //afterconcat: ['dist/output.js']

            //with_overrides: {
            //    options: {
            //        curly: false,
            //        undef: true
            //    },
            //    files: {
            //        src: ['dir3/**/*.js', 'dir4/**/*.js']
            //    }
            //}
        },

        "stylus": {
            options: {
                compress: false
            },
            files: {
                cwd: 'src/stylus',
                src: '*.styl',
                dest: 'static/css',
                expand: true,
                ext: '.css',
                filter: function(fileName) {
                    //return true only if file's basename doesn't start with an underscore
                    var parts = fileName.split('/');
                    return (parts.length && parts[parts.length - 1][0] !== '_');
                }
            }
        },

        "jade": {
            options: {
                pretty: true
            },
            files: {
                cwd:    'src/jade/app/',
                src:    [ '*.jade', '**/*.jade'],
                dest:   'static/html',
                expand: true,
                ext:    '.html'
            },

            index:{
                options: {
                    pretty: true
                },
                files: {
                    "static/index.html": "src/jade/index.jade"
                }
            }

        },

        "clean": {
            html:{
                src: ['static/html/**/*']
            },
            css:{
                src: ['static/css/**/*']
            },
            img:{
                src: ['static/img/**/*']
            },
            js: {
                src: [
                    'static/js/app/*',
                    'static/languages/*'
                ]
            },
            "compiled-html": {
                src: ['static/html']
            }
        },

        "concat": {
            production: {
                options: {
                    "banner": "'use strict';\n",
                    "process": function (src, filepath) {
                        return '// Source: ' + filepath + '\n' + src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    }
                },
                "src": [
                    'src/js/app/**/module.js',
                    'src/js/app/module.js',
                    'src/js/app/**/*.js'
                ],
                "dest": 'static/js/app.js'
            },

            dev: {
                options: {
                    banner: "function require(path){" +
                    "var s = document.createElement('script');" +
                    "s.type = 'text/javascript'; " +
                    "s.src = path;" +
                    "document.getElementsByTagName('head')[0].appendChild(s);" +
                    "};" +

                        // Это пиздец какой грязный костыль, но что не сделаешь ради счастливого тим-лида.
                    "angular.element(document).ready(function() { angular.bootstrap(document, ['InteractiveApplication']); });\n",

                    process: function (src, filepath) {
                        return "require('/" + require('path').relative('src', filepath) + "');";
                    }
                },
                src: [
                    'src/js/app/module.js',
                    'src/js/app/**/module.js',
                    'src/js/app/**/*.js'
                ],
                dest: 'static/js/app.js'
            }
        },

        "copy": {
            "i18":{
                 src: [
                     'src/languages/*.json'
                 ],
                 dest: "static/languages/",
                 flatten: true,
                 expand: true,
                 filter: "isFile"
            },
            "languages": {
                src: 'src/languages.json',
                dest: 'static/languages.json'
            },
            "js": {
                cwd:  "src/js/app",
                src:  "**/*.js",
                dest: "static/js/app/",
                expand: true
            },
            "images": {
                cwd: "src/img",
                src:  "**",
                dest: "static/img/",
                expand: true
            },
            "fonts": {
                cwd: "src/fonts",
                src:  "**",
                dest: "static/fonts/",
                expand: true
            }
        },

        "modernizr": {
            dist: {
                "options" : [
                    "setClasses",
                    "addTest",
                    "html5printshiv",
                    //"load",
                    "fnBind",
                    "testProp"
                ],
                "uglify" : false,
                "parseFiles" : false,
                "tests": ['datauri','localstorage'],
                "outputFile" : "static/js/vendor/modernizr/modernizr.js"
            }
        },

        "bower-install-simple": {
            options: {
                color:       true,
                production:  false,
                directory:   "static/js/vendor"
            },
            prod: {
                production: true
            }
        },

        "karma": {
            options:{
                configFile: "interactive.conf.coffee",
                browsers: ['Chrome','Safari','IE','Firefox']
            },

            continuous:{
                singleRun: true,
                browsers: ['PhantomJS']
            },

            silent:{
                browsers: ['PhantomJS'],
                reporter: "dots"
            },

            dev:{
                reporter: "dots"
            }
        },

        "watch": {
            jade: {
                files: ['**/*.jade'],
                tasks: ['clean:html', 'jade']
            },
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:js-dev']
            },
            css: {
                files: ['**/*.styl'],
                tasks: ['clean:css', 'stylus']
            }
        },

        "i18nextract-visonic": {
            default:{
                suffix: '.json',
                src: [
                    'src/jade/app/**/*.jade',
                    'src/js/app/**/*.js'
                ],
                keyEmpty: true,
                lang: ( function(){
                    var list = grunt.file.readJSON( "src/languages.json" ),
                        response = [];

                    for( var index in list ){
                        if( list.hasOwnProperty( index ) ){
                            response.push( list[index].code );
                        }
                    }

                    return response;
                })(),
                dest: 'src/languages'
            }
        },
        "webfont": {
            default : {
                src: 'src/img/icons/svg/**/*.svg',
                dest: 'src/fonts',
                destCss: 'src/stylus/core',
                options: {
                    font: '_svgFont',
                    relativeFontPath:'../fonts',
                    stylesheet: 'styl',
                    types: 'woff,svg,ttf',
                    htmlDemo: true,
                    destHtml: 'src/demo',
                    templateOptions: {
                        baseClass: 'glyph'
                    }
                }
            }
        },

        "inline_angular_templates": {
            dist: {
                options: {
                    base: 'static/',    // (Optional) ID of the <script> tag will be relative to this folder. Default is project dir.
                    prefix: '',            // (Optional) Prefix path to the ID. Default is empty string.
                    selector: 'body',       // (Optional) CSS selector of the element to use to insert the templates. Default is `body`.
                    method: 'prepend',       // (Optional) DOM insert method. Default is `prepend`.

                    unescape: {             // (Optional) List of escaped characters to unescape
                        '&lt;': '<',
                        '&gt;': '>',
                        '&apos;': '\'',
                        '&amp;': '&'
                    }
                },
                files: {
                    'static/index.html': ['static/html/**/*.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks("grunt-modernizr");
    grunt.loadNpmTasks("grunt-bower-install-simple");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-angular-translate');
    grunt.loadNpmTasks('grunt-webfont');
    grunt.loadNpmTasks('grunt-inline-angular-templates');

    grunt.registerTask('default', [
        'clean:html',
        'clean:css',
        'jade',
        'stylus',
        'clean:js',
        'i18nextract-visonic',
        'concat:dev',
        'copy',
        'jshint'
    ]);

    grunt.registerTask( "prod", [
        "clean",
        "jade",
        "inline_angular_templates",
        "clean:compiled-html",
        "stylus",
        "concat:production",
        "i18nextract-visonic",
        'copy:i18',
        'copy:fonts',
        'copy:languages',
        'copy:images'
    ]);

    grunt.registerTask('bower-install', [
        'bower-install-simple',
        'modernizr'
    ]);
};
