import Rx from "rxjs/RX";
import {createSubscriber} from './lib/util.es6'
import {createinterval$} from './lib/util.es6'

function take$(sourceObservable$,amount) {
    return new Rx.Observable(observer => {
        let count = 0;
        const subscription = sourceObservable$.subscribe({
            next(item){
                observer.next(item);
                if(++count >= amount)
                    observer.complete();
            },
            error(error){
                logError(error);
            },
            complete(){
                console.log('FIVE DONE!')
                observer.complete();
            }
        });

        return () => subscription.unsubscribe();
    })
}

function logError(error) {
    console.log(`${tag}.next ${error.stack || error}`);
}

const everySecond$ = createinterval$(1000);
const firstfive = take$(everySecond$,5);
const subscription = firstfive.subscribe(createSubscriber('one'));
