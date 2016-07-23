"use strict";

angular
    .module( "Interactive" )
    .factory( "VideoPreview", [function(){
        return function( name, path, time, provider ){
            return {
                name: name,
                path: path,
                time: time,
                provider: provider
            };
        };
    }]);