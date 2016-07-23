modules.define('info-line', ['react'], function(provide, React) {
    /**
     * Line for additionsl info
     *
     * @property {String} type      - type form
     */
    var InfoLine = React.createClass({
        render: function() {
            var blockName = 'info-line',
                cls,
                type = this.props.type ? blockName + '--' + this.props.type : '',
                mixCls = this.props.mixCls || '';

            cls = [blockName, type, 'row', mixCls].join(' ');

            return (
                <div {...this.props} className={cls}>
                    <div className={ blockName + '__message-text col-md-12'}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
    });

    provide(InfoLine);
});
