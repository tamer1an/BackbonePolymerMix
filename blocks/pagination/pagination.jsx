modules.define('pagination', ['react', 'jquery'], function(provide, React, $) {
    /**
     * Pagination based on http://getbootstrap.com/components/#pagination
     *
     * @property {number} [current=1]
     * @property {number} [max=5]
     * @property {number} offset
     * @property {function} change
     *
     * @emits Pagination#handleChange
     */
    var Pagination = React.createClass({
        getInitialState: function() {
            return {
                itemsNum: 5
            };
        },

        /**
        * Event Change
        * Fire event from sort owner
        *
        * @event Pagination#handleChange
        * @property {Object} e - react event
        */
        handleChange: function (value, e) {
            if (this.props.change) {
                this.props.change(value);
            }

            e.preventDefault();
        },

        render: function() {
            'use strict';

            var cls,
                itemsNum = this.state.itemsNum,
                clsMix = this.props.clsMix || '',
                current = this.props.current ? this.props.current : 0,
                maxItems = this.props.max && this.props.max <= itemsNum ? this.props.max : itemsNum,
                maxValue = maxItems,
                pages = [];


            if ( current >= itemsNum) {
                var group = 0;

                group = Math.floor( current / itemsNum );
                maxValue = group * itemsNum + maxItems;
            }


            cls = ['pagination', clsMix].join(' ');

            for (var i = maxItems; i > 0; i--) {
                var dataPage = maxValue-i,
                    elem = '',
                    value = maxValue-i+1,
                    classes = value === current + 1 ? 'active' : '';

                if ( (dataPage + 1) * this.props.offset <= +this.props.max + +this.props.offset ) {
                    elem = (
                        <li className={classes} key={dataPage} onClick={this.handleChange.bind(this, dataPage)}>
                            <a href="#">
                                {value}
                            </a>
                        </li>
                    );

                    pages.push(elem);
                }
            }

            return (
                <nav className={cls}>
                    <ul className="pagination">
                        <li data-page="less" onClick={this.handleChange.bind(this, 'less')}>
                            <a href="#" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>
                        {pages}
                        <li data-page="more" onClick={this.handleChange.bind(this, 'more')}>
                            <a href="#" aria-label="Next">
                                <span data-page="more" aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            );
        }
    });

    provide(Pagination);
});
