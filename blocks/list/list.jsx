modules.define('list', ['react', 'cookie', 'pagination', 'underscore', 'i-config', 'i-error', 'jquery', 'select', 'resizable-columns'],
                function(provide, React, Cookie, Pagination, _, iConfig, iError, $, Select) {

    var blockName = this.name,
        listGridView = ['get_device_list','get_user_list'],
        List = {
        componentWillMount: function () {
            var that = this;

            $.getJSON(this.props.urlApi + this.props.dataUrl, function( data ) {
                that.setState({ columns: data });
            });
        },

        getDefaultProps: function() {
            return {
                urlApi: iConfig.getProps('url-api')
            };
        },

        showColumnsModal: function() {
            if ( this.refs.modal ) {
                this.refs.modal.open();
            }
        },

        showDeleteModal: function () {
            this.refs.modalDelete.open();
        },

        componentDidMount: function() {
            this.getList();
        },

        getList: function () {
            var that = this,
                spin = this.refs.Spin,
                props = this.props,
                state = this.state;

            $.ajax({
                type: "GET",
                url: props.urlApi + props.listUrl,
                data: {
                    session: Cookie.get('token'),
                    command: props.command
                },
                beforeSend: function () {
                    if ( spin ) {
                        spin.show();
                    }
                },
                dataType: 'json'
            }).done(function(data) {
                that.fullCollections = data[props.dataOwner];

                that.setState({
                    fullCollections: that.fullCollections,
                    multipleRows: {
                        all: false,
                        selected: []
                    }
                });

                if (listGridView.indexOf(data.command)!=-1){
                    $(".list__table").resizableColumns({
                        store: store
                    });
                }

                if ( state.sort ) {
                    that.sort(state.sort);
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                iError.parceError(jqXHR, textStatus, errorThrown);
            }).always(function () {
                if ( spin ) {
                    spin.hide();
                }
            });
        },

        thClickHandler: function (e) {
            $('.sort', $(e.target).parent()).trigger('click');
        },

        search: function (value) {
            var that = this,
                val = value.toLowerCase(),
                re = new RegExp(val, 'g');

            if ( val.length ) {
                var filtered;

                if ( ! (_.has(this.fullCollections[0], 'join')) ) {
                    this.fullCollections.forEach(function (elem) {
                        /**
                         * Search these keys on
                         */
                        elem.join = that.props.searchFields.map(function (field) {
                            return elem[field];
                        }).join('').toLowerCase();

                        return elem;
                    });
                }

                filtered = _.filter(this.fullCollections, function (user) {
                    return user.join.match(re);
                });

                this.setState({
                    fullCollections: filtered,
                    pageCurrent: 0,
                    filter: null
                });
            } else {
                this.setState({
                    fullCollections: this.fullCollections,
                    pageCurrent: 0,
                    filter: null
                });
            }
        },

        pageChange: function (targetPage) {
            if ( targetPage !== this.state.pageCurrent ) {

                var page = 0;

                if ( targetPage === 'less'  ) {
                    page = this.state.pageCurrent - 1;
                } else if ( targetPage === 'more' ) {
                    page = this.state.pageCurrent + 1;
                } else {
                    page = targetPage;
                }

                if ( page >= 0 &&
                        (page + 1) * this.state.pageOffset <= this.state.fullCollections.length + +this.state.pageOffset) {
                            this.setState({
                                pageCurrent: page
                            });
                        }

            }
        },

        statusMessage: function (obj) {
            var error = false;

            if ( obj.status === 'delete' ) {
                error = true;
            }

            this.getList();

            this.setState({ message: {
                msg: obj.msg,
                error: error
            }});
        },

        getColumns: function() {
            var that = this,
                columns;

            if ( this.state.selectedColumns ) {
                columns = this.state.selectedColumns.map(function(elem) {
                    return that.state.columns[elem];
                });
            }

            return columns;
        },

        delItems: function (e) {
            var newObj = this.state.multipleRows.selected[0];

            if ( this.state.multipleRows.selected.length > 1 ) {
                newObj = this.prepNewMultipleObj(this.state.multipleRows.selected);
            }

            this.refs.Card.deleteHandle(newObj);

            this.refs.modalDelete.close();

            e.preventDefault();
        },

        createPagination: function () {
            var start = 0,
                end = this.state.fullCollections.length,
                pagination = '',
                current = this.state.pageCurrent,
                offset = this.state.pageOffset;

            start = current * offset;
            end = +start + +offset;

            pagination = (
                <div className='list__footer'>
                    <Pagination
                        current={current}
                        max={this.state.fullCollections.length}
                        offset={offset}
                        change={this.pageChange} />
                </div>
            );

            return {
                pagination: pagination,
                start: start,
                end: end
            };
        },

        createLinesPerPage: function () {
            var options;

            options = [
                { text: '5', value: '5' },
                { text: '10', value: '10' },
                { text: '20', value: '20' },
                { text: '30', value: '30' },
                { text: '40', value: '40' },
                { text: '50', value: '50' }
            ];

            return (
                <div className={blockName + '__control-lines'}>
                    Lines per page
                    <Select
                        name='linesPerPage'
                        select={this.state.pageOffset}
                        options={options}
                        onChangeHandler={this.changeLinesPerPage}/>
                </div>
            );
        },

        changeLinesPerPage: function (name, value) {
            if ( value !== this.state.pageOffset ) {
                this.setState({
                    pageOffset: value
                });
            }
        },

        selectRow: function (data, e) {
            var selected = this.state.multipleRows.selected,
                recIndex = selected.indexOf(data);

            if ( ~recIndex ) {
                selected.splice(recIndex, 1);
            } else {
                selected.push(data);
            }

            this.setState({
                multipleRows: {
                    all: false,
                    selected: selected
                }
            });

            e.stopPropagation();
        }
    };

    provide(List);
});
