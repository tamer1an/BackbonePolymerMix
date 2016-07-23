var less = require('less');
var path = require('path');
var fs = require ('fs');

module.exports = require('enb/techs/css').buildFlow()
    .name('css-less')
    .useFileList(['css', 'less'])
    .builder(function (sourceFiles) {
        var source = sourceFiles.map(function (file) {
            return '@import "' + file.fullname + '";';
        }).join('\n');

        return less.render(source, {
            relativeUrls: true,
            rootpath: this.node.getPath()
        })
            .then(function (output) {
                return this._processIncludes(output.css, this.node.resolvePath(this._target));
            }.bind(this))
            .catch(function (err) {
                console.log(err);

                return err;
            });
    })
    .createTech();
