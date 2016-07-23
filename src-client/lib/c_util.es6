'use strict';

exports.createinterval$ = function(time) {
    return new Rx.Observable(observer => {
        let index = 0;
        let interval = setInterval(()=>{
            console.log(`Generating... ${index}`);
            observer.next(index++)
        },time);
        return ()=>{
            clearInterval(interval);
        }
    })
};

exports.createSubscriber = function(tag){
    return {
        next(item) { console.log(`${tag}.next ${item}`); },
        error(error){ console.log(`${tag}.next ${error.stack || error}`);},
        complete(){ console.log('done'); }
    };
};