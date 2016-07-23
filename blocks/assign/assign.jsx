modules.define('assign', [

    'react',

    'i-config',

    'cookie',

    'jquery',

    'underscore',

    'checkbox',

    'search',

    'glyphicon',

    'button',

    'react-dom'

], function(provide, React, iConfig, Cookie, $, _, Checkbox, Search, Glyphicon, Button, ReactDOM) {

    var blockName = this.name;


    var Assign = React.createClass({

        getDefaultProps: function() {

            return {

                urlApi: iConfig.getProps('url-api'),

                user: {

                    header: 'Device Assignment'
                }

            };

        },


        getInitialState: function() {

            return {

                fullList: [],

                assigned: [],

                seached: [],

                unAssignedOpen: null,

                userRecId: null,

                notFirstOpen: null,

                opts: 'user',

                freeOnly: true

            };

        },


        componentWillReceiveProps: function (nextProps) {

            if ( this.props.type === 'user' ) {

                var ownerData = JSON.parse(JSON.stringify(nextProps.ownerData)),

                    devices = ownerData.devices;


                if ( devices && devices.length > 0 ) {

                    this.props.fullList.map(function (fullListItem) {

                        devices.map(function (assignedItem, assignedIndex, list) {

                            if ( _.isEqual(fullListItem, assignedItem) ) {

                                list[assignedIndex] = fullListItem;

                            }

                        });

                    });

                }


                this.setState({

                    key: _.random(0, 1000),

                    fullList: nextProps.fullList,

                    assigned: devices,

                    opts: this.props.type,

                    userRecId: nextProps.userData && nextProps.userData.userRecId && nextProps.userData.userRecId[0] || false

                });

            }

        },


        componentDidMount: function() {

            window.addEventListener('click', this.hadleOutsideClick);

        },


        componentWillUnmount: function() {

            window.removeEventListener('click', this.hadleOutsideClick);

        },


        hadleOutsideClick: function (e) {

            if ( $(ReactDOM.findDOMNode(this)).hasClass(blockName + '--opened') &&

                !$(e.target).parents('.' + blockName).length) {


                this.toggleAssign();

            }


            e.stopPropagation();

        },


        change: function (data, add) {

            var assigned = this.state.assigned || [];


            if ( add ) {

                assigned.push(data);

            } else {

                assigned = _.reject(assigned, function (elem) {

                    return _.isEqual(elem, data);

                });

            }


            this.props.changeAssigned(assigned);


            this.setState({

                assigned: assigned

            });

        },


        togleFreeOnly: function (name, value, e) {

            e.stopPropagation();


            $(e.target).closest('.assign__content').toggleClass('assign__content--assigned');

        },


        changeOpenDropdown: function () {

            if ( _.isNull(this.state.notFirstOpen) ) {

                this.setState({

                    notFirstOpen: true

                });

            }

        },


        filterAssigned: function (value) {

            var re = new RegExp(value.toLowerCase(), 'g');


            $('.assign__li', '.assign__content').each(function (index, elem) {

                if ( !$(elem).data('assign-filter').match(re) ) {

                    $(elem).hide();

                } else {

                    $(elem).show();

                }

            });

        },


        toggleAssign: function (e) {

            $(ReactDOM.findDOMNode(this)).toggleClass(blockName + '--opened');

            $(ReactDOM.findDOMNode(this.refs.Assign)).toggleClass('active');

        },


        render: function() {

            var cls = [],

                unassignedList,

                addButton;

            unassignedList = this.props.write && this.createUnassigned();


            cls = [blockName, this.props.mixCls].join(' ');


            addButton = <Button

                            mixCls={blockName + '__add-button'}

                            option='info'

                            ref='Assign'

                            clickHandler={this.toggleAssign}>Assign</Button>;


            return (

                <div className={cls} key={_.random(0, 1000)}>

                    <div className={blockName + '__header'}>

                        <h4>{this.props[this.state.opts].header}</h4>

                        {this.createAssignment()}
                        {this.props.write && addButton}
                    </div>

                    {unassignedList}

                </div>

            );

        },


        createUnassigned: function () {

            var that = this,

                filtered,

                list = [],

                content,

                sort,

                filter;


            filtered = _.difference(this.state.fullList, this.state.assigned);


            this.filtered = filtered;


            sort = <Checkbox

                    mixCls={blockName + '__filter'}

                    text='Unssigned only'

                    checked={this.state.freeOnly}

                    onChangeHandler={this.togleFreeOnly}/>;

            filter = <Search text='Search...' searchHandler={this.filterAssigned}/>;


            if ( filtered.length > 0 ) {

                list = filtered.map(function (elem, index) {

                    return that.createElem(elem, index, true);

                });


                content = (

                    <div className={blockName + '__content'}>

                        {filter}

                        {sort}

                        <div className={blockName + '__add'}>

                            {list}

                        </div>

                    </div>

                );

            }


            return content;

        },


        createAssignment: function () {

            var that= this,

                assigned = this.state.assigned || [];


            if ( assigned && assigned.length ) {

                assigned = assigned.map(function (elem, index) {

                    return that.createElem(elem, index, false);

                });

            }


            return (

                <div className={blockName + '__l'}>

                    {assigned}

                </div>

            );

        },


        createElem: function (elem, index, added) {

            var that = this,

                str,

                cls = blockName + '__li',

                removeItem = '',

                lineHandler = '';


            if ( this.props.type === 'user' ) {
                str = [elem.deviceId, '(' + elem.profileName + ')'].join(' ');
            }

            if ( !added && this.props.write ) {
                removeItem = (

                    <span

                        className={blockName + '__remove'}

                        onClick={that.change.bind(that, elem, added)}>

                        ×

                    </span>

                );

            } else {

                if ( elem.users.length ) {

                    cls = [cls, cls + '--assigned'].join(' ');

                }


                lineHandler = that.change.bind(that, elem, true);

            }


            return (

                <div

                    key={index}

                    data-assign-filter={_.values(elem).join('').toLowerCase()}

                    className={cls}
                    onClick={this.props.write && lineHandler} >
                        {str}

                        {removeItem}

                </div>

            );

        }

    });


    provide(Assign);

});

