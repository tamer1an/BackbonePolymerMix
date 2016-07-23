class AnchorDirective {
    constructor () {
        this.restrict = 'E';
    }

    link (scope, elem, attrs) {
        elem.on('click', (event) => {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                event.preventDefault();
                event.stopPropagation();
            }
        });
    }

}

export default AnchorDirective;
