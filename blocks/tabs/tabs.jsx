modules.define('tabs', [
    'react'
], function(provide, React) {
    /**
     * Tabs
     *
     * @property {Arr} tabs                          - array of tabs
     * @property {Obj} tabs[n]                       - object with tabs properties
     * @property {String} tabs[n].tabName            - Tabs name
     * @property {String|HTML} tabs[n].tabContent    - Tabs content
     *
     * @property {function} [onChangeTab]            - callback function, return index of selected tabs
     */
    var Tabs = React.createClass({
        getInitialState: function() {
            return {
                current:  this.props.current || 0
            };
        },

        onChangeTab: function (index) {
            this.setState({
                current: index
            });

            if ( this.props.onChangeTab ) {
                this.props.onChangeTab(index);
            }
        },

        render: function () {
            var that = this,
                cls,
                blockName = 'tabs',
                tabHeads = [],
                tabContents = [],
                tabs = this.props.tabs || [],
                currentTab = this.state.current;

            if ( this.props.clsMix ) {
                cls = [blockName, this.props.clsMix].join(' ');
            }

            tabs.map(function (value, index) {
                var clsHeadTab = blockName + '__heads-tab',
                    clsContTab = blockName + '__contens-tab';

                if ( currentTab === index ) {
                    clsHeadTab = [clsHeadTab, clsHeadTab + '--current'].join(' ');
                    clsContTab = [clsContTab, clsContTab + '--current'].join(' ');
                }

                tabHeads.push(<div className={clsHeadTab} key={index} onClick={that.onChangeTab.bind(null, index)}>{value.tabName}</div>);
                tabContents.push(<div className={clsContTab} key={index}>{value.tabContent}</div>);
            });

            return (
                <div className={cls}>
                    <div className={blockName + '__heads'}>
                        {tabHeads}
                    </div>
                    <div className={blockName + '__contens'}>
                        {tabContents}
                    </div>
                </div>
            );
        }
    });

    provide(Tabs);
});
