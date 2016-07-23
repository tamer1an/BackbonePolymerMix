#!/usr/bin/env node
var child_process = require( "child_process" );

// install commander
child_process.exec( "npm install commander", function( error ){
    if( error ){
        console.error( "Cannot install package `commander` " );
        process.exit(2);
        return;
    }

    var fs = require("fs"),
        path = require("path"),
        program = require('commander');

    program
        .version("0.0.1")
        .option('-b, --build <n>', 'Build number', parseInt )
        .parse( process.argv );

    var node_modules = path.join( __dirname, 'node_modules' );

    if( ! fs.existsSync( node_modules ) ){
        fs.mkdirSync( node_modules );
        console.info( "folder `node_modules` created" );
    }

    fs.symlinkSync(
        path.join( __dirname, 'rest', 'routes' ),
        path.join( __dirname, 'node_modules', 'rest-routes' )
    );
    console.info( "symlink for `rest-routes` created" );

    fs.symlinkSync(
        path.join( __dirname, 'rest', 'services' ),
        path.join( __dirname, 'node_modules', 'rest-services' )
    );
    console.info( "symlink for `rest-services` created" );

    fs.symlinkSync(
        path.join( __dirname, 'rest', 'helpers' ),
        path.join( __dirname, 'node_modules', 'rest-helpers' )
    );
    console.info( "symlink for `rest-helpers` created" );


    try{
        console.info( "start `npm install` process" );
        child_process.exec( "npm install", function( error ){
            if( error ){
                throw {
                    "message": "npm install error:\n",
                    "error": error
                };
            }
            console.info( "npm install completed" );

            console.info( "start `bower install` process" );
            child_process.exec( "grunt bower-install", function( error ){
                if( error ){
                    throw {
                        "message": "bower install  error:\n",
                        "error": error
                    };
                }
                console.info( "bower install completed" );

                child_process.exec( "grunt jshint", function( error ){
                    if( error ){
                        throw {
                            "message": "jshint error:\n",
                            "error": error
                        };
                    }
                    console.info( "jshint completed" );

                    child_process.exec( "grunt karma:continuous", function( error ){
                        if( error ){
                            throw {
                                "message": "karma error:\n",
                                "error": error
                            };
                        }
                        console.info( "karma completed" );

                        child_process.exec( "grunt prod", function( error ){
                            if( error ){
                                throw {
                                    "message": "Grunt build  error:\n",
                                    "error": error
                                };
                            }

                            console.info( "grunt build completed" );

                            fs.renameSync(
                                path.join( __dirname, 'static' ),
                                path.join( __dirname, '_static' )
                            );

                            child_process.exec( "git checkout -f release", function( error ){
                                if( error ){
                                    throw {
                                        "message": "Checkout branch release failed:\n",
                                        "error": error
                                    };
                                }

                                console.info( "branch release checked out" );

                                child_process.exec( "rm -rf ./static", function( error ){
                                    if( error ){
                                        throw {
                                            "message": "Error removing directory `static` :\n",
                                            "error": error
                                        };
                                    }

                                    fs.renameSync(
                                        path.join( __dirname, '_static' ),
                                        path.join( __dirname, 'static' )
                                    );

                                    child_process.exec( "git add --all ./static/", function(){
                                        child_process.exec( "git commit -m \"Build #" + program.build + "\"", function(){
                                            console.info( "changes for build #" + program.build + " commited" );

                                            child_process.exec( "git push", function(){
                                                console.info( "changes for build #" + program.build + " pushed" );

                                                console.info( "cleaning up" );
                                                child_process.exec( "rm -rf ./*", function(){
                                                    console.info( "cleaned" ); // test hook

                                                    process.exit(0);
                                                    return;
                                                });
                                            });
                                        });
                                    });
                                } );
                            });
                        });
                    });
                });
            });
        });
    }
    catch( e ){
        console.error( e.message + "\n" + e.error );
        process.exit(1);
        return;
    }
});


