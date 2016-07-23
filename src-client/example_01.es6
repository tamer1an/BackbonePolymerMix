import Rx from "rxjs/RX";
import $ from "jquery";


$(function () {
    const $title = $('#title');
    const $result = $('#result');

    Rx.Observable.fromEvent($title,"keyup")
    .map(e => e.target.value)
    .distinctUntilChanged()
    .debounceTime(500)
    .switchMap(getItems) // mergeMap - flatMap
        .subscribe(items => {
            $result.empty();
            $result.append(items.map(i => $('<li />').text(i)));
        });
});

function getItems(title) {
    console.log(`title is: ${title}`);
    return new Promise((resolve,reject) => {
        window.setTimeout(()=>{
            resolve([title,"Item 2", `Another ${Math.random()}`])
        },500 + (Math.random()*5000));
    });
}