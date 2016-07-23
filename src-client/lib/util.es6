export function createinterval$(time) {
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
}

export function createSubscriber(tag) {
    return {
        next(item) { console.log(`${tag}.next ${item}`); },
        error(error){ console.log(`${tag}.next ${error.stack || error}`);},
        complete(){ console.log('done'); }
    };
}