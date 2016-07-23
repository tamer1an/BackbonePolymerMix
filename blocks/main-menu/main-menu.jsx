modules.define('main-menu', [
    'react',
    'img',
    'i-history',
    'i-config',
    'jquery',
    'underscore',
    'breadcrumb'
], function(provide, React, Img, iHistory, iConfig, $, _, Breadcrumb) {
    var blockName = this.name;

    var Menu = React.createClass({
        mixins: [React.addons.LinkedStateMixin],

        getDefaultProps: function() {
            return {
                urlApi: iConfig.getProps('url-api'),
                list: [
                    {
                        text: 'Managment',
                        menuGroup: 'managment',
                        disabled: false,
                        submenu: [
                            { text: 'Users', page: 'users' },
                            { text: 'Devices', page: 'devices' },
                            { text: 'Assignment', page: 'assignment' }
                        ]
                    },
                    {
                        text: 'Statistic',
                        disabled: true
                    },
                    {
                        text: 'Provision',
                        disabled: true
                    }
                ]
            };
        },

        getInitialState: function() {
            var that = this,
                menuGroup = false;

            menuGroup = _.find(this.props.list, function (elem) {
                return elem.submenu.map(function (subelem) {
                    return subelem.page === that.props.page.value;
                });
            });

            return {
                path: [],
                pageValue: this.props.page && this.props.page.value,
                windowWidth: window.innerWidth,
                visibleCls: false,
                menuGroup: menuGroup.menuGroup
            };
        },

        toggleMenu: function(e) {
            var visibleCls = !this.state.visibleCls;

            if ( e && e.which || this.state.windowWidth > 1350 ) {
                visibleCls = false;
            }

            this.setState({
                visibleCls: visibleCls
            });
        },

        selected: function (elem) {
            this.setState({
                pageValue: elem.dataset.page
            });
        },

        onMenuClick: function(e) {
            var menuGroup = false;

            if ( e.target.dataset.menugroup !== this.state.menuGroup ) {
                menuGroup = e.target.dataset.menugroup;
            }

            this.setState({
                menuGroup: menuGroup
            });
        },

        onSelectPage: function (e) {
            var value = e.target.dataset.page;

            iHistory.setProp({ page: value });
            this.props.page.requestChange(value);
            this.selected(e.target);
            this.toggleMenu();
        },

        handleResize: function (e) {
            if ( e.target ) {
                this.setState({
                    windowWidth: e.target.innerWidth
                });
            }
        },

        render: function() {
            var that = this,
                cls = '',
                pageValue = this.state.pageValue,
                list,
                url = this.props.urlApi + 'i/logo_bw.png';

            list = (
                <ul className='main-menu__list'>
                    {this.props.list.map(function (elem, i) {
                        var item,
                            submenu,
                            cls = 'main-menu__list-item',
                            textСls = 'main-menu__list-text';

                        if ( elem.disabled ) {
                            textСls = [textСls, 'disabled'].join(' ');
                        }

                        if ( that.state.menuGroup === elem.menuGroup ) {
                            cls = cls + ' opened';
                        }

                        if (elem.submenu) {
                            submenu = (
                                <ul className='main-menu__sublist'>
                                    {
                                        elem.submenu.map(function (subelem, i) {
                                            var subelemCls = 'main-menu__sublist-item';

                                            if ( subelem.page === pageValue ) {
                                                subelemCls = subelemCls + ' selected';

                                                that.state.path = [elem.text, subelem.text];
                                            }

                                            return (
                                                <li className={subelemCls} key={i}>
                                                    <div
                                                        className='main-menu__sublist-text'
                                                        data-bc={[elem.text, subelem.text]}
                                                        data-page={subelem.page}
                                                        onClick={that.onSelectPage}>

                                                        {subelem.text}
                                                    </div>
                                                </li>
                                            );
                                        })
                                    }
                                </ul>
                            );
                        }

                        item = (
                            <li className={cls} key={i}>
                                <div
                                    className={textСls}
                                    data-menugroup={elem.menuGroup}
                                    onClick={!elem.disabled && that.onMenuClick}>

                                    {elem.text}
                                </div>
                                {submenu}
                            </li>
                        );

                        return item;
                    })}
                </ul>
            );

            window.addEventListener('resize', this.handleResize);
            window.addEventListener('keyup', this.toggleMenu);

            cls = [blockName, this.state.visibleCls ? 'visible' : '' ].join(' ');

            return (
                <div className={cls} onKeyPress={this.handleKeyDown}>
                    <div className='main-menu__button' onClick={this.toggleMenu}>
                        <span className='glyphicon glyphicon-align-justify'></span>
                    </div>
                    <Breadcrumb path={this.state.path}/>
                    <div className='main-menu__paranja' onClick={this.toggleMenu}></div>
                    <div className='main-menu__menu'>
                        <div className='main-menu__logo'>
                            <Img url={url} alt='logo'/>
                        </div>
                        {list}
                    </div>

                </div>
            );
        }
    });

    provide(Menu);

});
