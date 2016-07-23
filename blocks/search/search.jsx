modules.define('search', ['react', 'jquery', 'input', 'react-dom'], function(provide, React, $, Input, ReactDOM) {
    /**
     * Search block in header
     */
    var Sort = React.createClass({
        handleChange: function (name, value) {
            if (this.props.searchHandler) {
                this.props.searchHandler(value);
            }
        },

        clearInput: function (e) {
            $('input', ReactDOM.findDOMNode(this)).val('').trigger('change');
            this.handleChange(e);
        },

        render: function() {
            var cls,
                text = this.props.text || '',
                clsMix = this.props.clsMix || '';

            cls = ['search', clsMix].join(' ');

            return (
                <div className={cls} onClick={this.handleClick}>
                    <div className='input-group search__input-group'>
                        <Input type='text' className='form-control' placeholder={text} clear='true' onChangeHandler={this.handleChange}/>
                    </div>
                </div>
            );
        }
    });

    provide(Sort);
});
