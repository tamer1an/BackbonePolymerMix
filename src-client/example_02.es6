import Rx from "rxjs/RX";

const simple$ = new Rx.Observable(observer => {
    console.log('gen observ');
    setTimeout(() => {
        observer.next("An item!");
        setTimeout(()=>{
            observer.next("Another item!");
            observer.complete();
        },1000);
    },1000);
});

const error$ = new Rx.Observable(observer => {
    observer.error(new Error('`stack` me'));
});

simple$.subscribe(
    item => console.log('next',item),
    item => console.log('error',error),
    item => console.log('done')
);

setTimeout(()=>{
    error$.subscribe({
        next: item => console.log('next',item),
        error(error){ console.log(error) }
    });
},3000);

// Promise API
//
// const promise = new Promise((resolve,reject)=>{
//     console.log('in promise');
//     setTimeout(()=>{
//         resolve('hey')
//     },2000);
// });
//
// promise.then(item => console.log('then item',item));