modules.define('panels', ['react', 'underscore'], function(provide, React, _) {    var blockName = this.name;    /**     * Horizontal panels     *     * @property {string} mixCls               - css classes for mix     * @property {Array} panels                - panels for show     * @property {string} panels[n].header     - header fpr panel     * @property {HTML} panels[n].content      - content for panel     * @property {HTML} panels[n].name         - name for callback     */
    var Panels = React.createClass({        getDefaultProps: function() {            return {                id: 'accordion' + _.random(0, 1000)            };        },
        render: function() {            var cls,                panels,                mixCls = this.props.mixCls || '';
            cls = [blockName, 'panel-group', mixCls].join(' ');
            panels = this.createPanels();
            return (                <div
                    className={cls}
                    id={this.props.id}
                    role='tablist'
                    aria-multiselectable='true'>
                    {panels}
                </div>
            );
        },

        onChangeHandler: function (panel, e) {            if ( this.props.onChangeHandler ) {
                this.props.onChangeHandler(panel, e);
            }
        },

        createPanels: function () {            var that = this,
                clsElem = blockName + '__panel',
                panels;

            panels = this.props.panels.map(function (panel, index) {                var collapse = 'collapse' + index,
                    clsPanel = clsElem + '-content' + ' i-clearfix collapse';

                if ( index === 0 ) {                    clsPanel = clsPanel + ' in';
                }

                return (                    <div
                        key={index}
                        className={clsElem + ' panel panel-default'}>
                        <h5
                            className={clsElem + '-header panel-heading panel-title'}
                            role='tab'
                            data-toggle='collapse'
                            data-parent={'#' + that.props.id}
                            href={'#' + collapse}
                            aria-expanded='true'
                            aria-controls={collapse}
                            onClick={that.onChangeHandler.bind(that, panel.name)}>
                            {panel.header}
                        </h5>
                        <div
                            className={clsPanel + ' panel-collapse'}
                            id={collapse}
                            role='tabpanel'
                            aria-labelledby='headingOne'>
                            {panel.content}
                        </div>
                    </div>
                );
            });

            return panels;        }
    });

    provide(Panels);});
