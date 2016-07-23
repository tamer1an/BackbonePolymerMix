modules.define('i-outside-click', [], function(provide) {
    var OutsideClick = {
        componentDidMount: function() {
            window.addEventListener('click', this.hadleOutsideClick);
        },

        componentWillUnmount: function() {
            window.removeEventListener('click', this.hadleOutsideClick);
        }
    };

    provide(OutsideClick);
});
