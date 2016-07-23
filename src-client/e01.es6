// import Rx from "rxjs/RX";
// import {createSubscriber} from './lib/util.es6';
// import fs from '../node_modules/fs';
var fs = require('fs');
var Rx = require('rxjs/RX');
var createSubscriber = require('./lib/c_util.es6').createSubscriber;
// console.log(fs);
// fs.readdir(".",(err,items) => {
//     if (err) console.error(err);
//     else {
//         console.log(items)
//     }
// });git

const readdir$ = Rx.Observable.bindNodeCallback(fs.readdir);

// console.log(typeof readdir$);

readdir$('./src-server')
    .flatMap(files => Rx.Observable.from(files))
    .map(file => `extended ${file}`)
    .subscribe(createSubscriber('readdir'));