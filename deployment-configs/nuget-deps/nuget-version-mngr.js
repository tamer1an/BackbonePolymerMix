var fileName, getVersionsData, isValidPackageName, nugetVersions, writeToFile;

fileName = __dirname + '/nuget-versions.json';

nugetVersions = {};

getVersionsData = function () {
    var jsonObj, overwriteFile;
    jsonObj = require(fileName) || {};
    overwriteFile = false;
    if (!jsonObj.hasOwnProperty('app') || jsonObj['app'].constructor !== Array) {
        jsonObj['app'] = [ 0, 0, 0 ];
        overwriteFile = true;
    }
    if (!jsonObj.hasOwnProperty('vendors') || jsonObj['vendors'].constructor !== Array) {
        jsonObj['vendors'] = [ 0, 0, 0 ];
        overwriteFile = true;
    }
    if (overwriteFile) {
        writeToFile(jsonObj);
    }
    return jsonObj;
};

isValidPackageName = function (name) {
    if (name !== 'app' && name !== 'vendors') {
        console.log('Wrong package name: "' + name + '". Valid names: "app", "vendors"');
        return false;
    }
    return true;
};

writeToFile = function (jsonObj) {
    var fs;
    fs = require('fs');
    fs.writeFile(fileName, JSON.stringify(jsonObj, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('New versions numbers saved to ' + fileName);
        }
    });
};

nugetVersions.get = function (packageName) {
    var jsonObj;
    if (!isValidPackageName(packageName)) {
        return;
    }
    jsonObj = getVersionsData();
    return jsonObj[packageName].join('.');
};

nugetVersions.generateNew = function (packageName) {
    var jsonObj, lastSegmentIndex, pkgVersion;
    if (!isValidPackageName(packageName)) {
        return;
    }
    jsonObj = getVersionsData();
    pkgVersion = jsonObj[packageName];
    lastSegmentIndex = pkgVersion.length - 1;
    pkgVersion[lastSegmentIndex] = pkgVersion[lastSegmentIndex] + 1;
    writeToFile(jsonObj);
    return pkgVersion.join('.');
};

module.exports = nugetVersions;
