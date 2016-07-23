import Rx from "rxjs/RX";
import {createSubscriber} from './lib/util.es6'

// Rx.Observable.interval(5000)
//         .take(5)
//         .subscribe(createSubscriber('one'));

// Rx.Observable.timer(5000,500)
//     .take(3)
//     .subscribe(createSubscriber('timer'));

//take multiple arg each becomes next
Rx.Observable.of("hello world",42,"3rd").subscribe(createSubscriber('of'));

//take array like (Iterate) thing and flat in out
Rx.Observable.from("hello world").subscribe(createSubscriber('from'));

// function* genrate () {
//     yield 1;
//     yield 5;
//     yield 'hey';
// }

//stops and always thow error
Rx.Observable.throw(3.14)
    .subscribe(createSubscriber("error"));

//not throw the error not terminate
Rx.Observable.from([new Error('hey')]);

const arr = [1,42,7];
Rx.Observable.from(arr)
    .map(i=>i*5)
    .subscribe(createSubscriber("from"));

//might return item or nothing =>
Rx.Observable.empty()
    .subscribe(createSubscriber("empty"));

let sideEffect = 0;
const defer$ = Rx.Observable.defer(() => {
    sideEffect++;
    return Rx.Observable.of(sideEffect);
});

defer$.subscribe(createSubscriber('defer 1'));
defer$.subscribe(createSubscriber('defer 2'));
defer$.subscribe(createSubscriber('defer 3'));

Rx.Observable.never().subscribe(createSubscriber('never'));

Rx.Observable.range(10,30)
    .subscribe(createSubscriber('range'));