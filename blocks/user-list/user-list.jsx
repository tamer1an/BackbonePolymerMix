modules.define('user-list', [
    'react',
    'jquery',
    'underscore',
    'modal',
    'checkbox',
    'cookie',
    'sort',
    'search',
    'glyphicon',
    'user-card',
    'button',
    'spin',
    'i-config',
    'select',
    'info-line',
    'list',
    'i-error',
    'react-dom'
], function(provide, React, $, _, Modal, Checkbox, Cookie, Sort, Search,
                Glyphicon, UserCard, Button, Spin, iConfig, Select, InfoLine, List,
                iError, ReactDOM) {
    var UserList = React.createClass({
        mixins: [List],

        getDefaultProps: function() {
            return {
                key: 'userRecId',
                dataOwner: 'users',
                searchFields: ['firstName', 'lastName', 'extension', 'login', 'userId'],
                listUrl: 'newapi/config/users',
                command: 'get_user_list',
                dataUrl: 'json/user-list.json'
            };
        },

        componentWillMount: function () {
            var that = this;

            //GET mx status list
            $.ajax({
                type: "GET",
                url: that.props.urlApi + 'newapi/system/status',
                data: {
                    session: Cookie.get('token'),
                    command: 'get_status'
                },
                dataType: 'json'
            }).done(function(data) {
                if ( data.mxGMembers && data.mxGMembers.length > 1 ) {
                    /**
                     * For current MX set Home System ID ("0")
                     */
                    data.MXGMembers.map(function (member) {
                        if ( data.mxGroupId === member.mxMemberId ) {
                            member.mxMemberId = 0;
                        }
                    });

                    that.setState({
                        mxGroupMembers: data.mxGMembers
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                iError.parceError(jqXHR, textStatus, errorThrown);
            });
        },

        getInitialState: function() {
            var selectedColumns = [
                    'firstName',
                    'lastName',
                    'extension',
                    'voiceDID',
                    'faxDID',
                    'callerId',
                    'userProfile',
                    'adminProfile'
                ],
                sort = null;

            if ( localStorage.getItem('selectedColumns') ) {
                selectedColumns = JSON.parse(localStorage.getItem('selectedColumns'));
            }

            if ( localStorage.getItem('sortUsers') ) {
                sort = JSON.parse(localStorage.getItem('sortUsers'));
            }

            return {
                selectedColumns: selectedColumns,
                pageOffset: 20,
                pageCurrent: 0,
                users: [],
                userCard: {},
                sort: sort,
                multipleRows: {
                    all: false,
                    selected: []
                },
                columns: [],
                readList: this.props.read.indexOf('get_user_list') !== -1,
                modify: this.props.write.indexOf('update_user') !== -1
            };
        },

        changeColumnsSet: function(e) {
            var checkedBoxes = [];

            $('input:checkbox:checked', $(ReactDOM.findDOMNode(this.refs.modal))).each(function(index, elem){
                checkedBoxes.push($(elem).attr('name'));
            });

            this.setState({selectedColumns: checkedBoxes});

            localStorage.setItem('selectedColumns', JSON.stringify(checkedBoxes));

            this.refs.modal.close();

            e.preventDefault();
        },

        sort: function (obj) {
            var sort = {
                    field: obj.field,
                    direction: obj.direction
                },
                sorted = _.sortBy(this.state.fullCollections, obj.field);

            if ( obj.direction !== 'forvard' ) {
                sorted = sorted.reverse();
            }

            localStorage.setItem('sortUsers', JSON.stringify(sort));

            this.setState({
                fullCollections: sorted,
                sort: sort
            });
        },

        callUserCard: function (userData, e) {
            /**
             * $.extend(true, {}, userData)
             * Костыль для создания нового экземпяра,
             * чтобы при вызове карточки
             * не править исходные данные
             */
            // new user
            if ( userData.newUser ) {
                this.refs.Card.show($.extend(true, {}, userData));
            }
            //1 user card
            else if ( _.isArray(userData[0].userRecId) && userData.userRecId.length === 1 ) {
                this.refs.Card.show($.extend(true, {}, userData[0]));
            }
            //Multiple user card
            else {
                var newObj = this.prepNewMultipleObj(userData);

                this.refs.Card.show(newObj);
            }

            e.preventDefault();
        },

        prepNewMultipleObj: function (userData) {
            var keys = _.keys(userData[0]),
                newObj = {};

            keys.map(function (val) {
                var keyArr = newObj[val] = [];

                userData.map(function (elem) {
                    keyArr.push(elem[val]);
                });
            });

            _.map(newObj, function (val, key) {
                var keyObj = _.union(val);

                if ( key !== 'userRecId' && keyObj.length > 1  ) {
                    newObj[key] = { disabled: true };
                } else if ( key !== 'userRecId' ) {
                    newObj[key] = keyObj[0];
                }
            });

            return newObj;
        },

        changeLocation: function (name, value) {
            var filtered = this.fullCollections;

            if ( value !== 'all' ) {
                filtered = _.filter(this.fullCollections, function (user) {
                    return user.HomeSystem === value;
                });
            }

            this.setState({
                users: filtered,
                filter: null,
                sort: null
            });
        },

        selectAllUserRow: function (e) {
            var selected = [],
                all = false;

            if ( e.target.checked ) {
                all = true;
                this.state.fullCollections.map(function (elem) {
                    selected.push(elem);
                });
            }

            this.setState({
                controls: true,
                multipleRows: {
                    all: all,
                    selected: selected
                }
            });
        },

        render: function() {
            var that = this,
                content = '',
                checkboxes,
                modal,
                rows,
                pagination,
                userCard,
                columns = [],
                head = '',
                badge = '',
                message,
                paginationObj,
                multipleRowsControl = '',
                controlsButton,
                linesPerPage,
                mxgroup;

            if (this.state.fullCollections && this.state.columns) {
                columns = this.getColumns();

                head = this.createHead(columns);
                badge = <span title="Users in the list" className="badge">{this.state.fullCollections.length}</span>;
                checkboxes = this.createCheckboxes();

                paginationObj = this.createPagination();
                pagination = paginationObj.pagination;

                rows = this.createUsers(columns, paginationObj.start, paginationObj.end);

                multipleRowsControl = this.createMultypleRowsControl();
                mxgroup = this.createMXGroup();
            }

            // console.log(this.state.modify, this.state.readList);

            if ( this.fullCollections ) {
                userCard = <UserCard
                                ref='Card'
                                rights={this.state.modify}
                                columns={this.state.columns}
                                users={this.fullCollections}
                                statusMessage={this.statusMessage}/>;
            }


            controlsButton = this.createControlButton();
            linesPerPage = this.createLinesPerPage();

            if ( this.state.message ) {
                var msgType = '';

                if ( this.state.message.error ) {
                    msgType = 'error';
                }

                message = (
                    <InfoLine type={msgType}>
                        {this.state.message.msg}
                    </InfoLine>
                );
            }

            modal = (
                <Modal
                    ref="modal"
                    id='columns'
                    header='Controls'
                    confirm='Confirm'
                    onConfirm={this.changeColumnsSet}>
                    {linesPerPage}
                    {checkboxes}
                </Modal>
            );

            if ( this.state.modify || this.state.readList ) {
                content = (
                    <div className='list'>
                        <Spin ref='Spin'/>
                        <div className='s-page__head row'>
                            <div className='col-md-2 col-sm-12'>
                                <h2 className='s-page__head-title'>
                                    Users
                                    {badge}
                                </h2>
                            </div>
                            <div className='col-md-4 col-sm-4'>
                                {this.state.modify && multipleRowsControl}
                            </div>
                            <div className='col-md-2 col-sm-3'>
                                {mxgroup}
                            </div>
                            <div className='col-md-3 col-sm-4'>
                                <Search text='Search for users' searchHandler={this.search}/>
                            </div>
                            <div className='col-md-1 col-sm-1'>{controlsButton}</div>
                            {this.state.modify && <Button mixCls='add-button' option='primary' clickHandler={that.callUserCard.bind(that, {newUser:true})}>+</Button>}
                            {modal}
                        </div>
                        {message}
                        <div className='s-page__content table-responsive'>
                            <table className='list__table table table-hover'>
                                <thead>
                                    <tr>
                                        {head}
                                    </tr>
                                </thead>
                                <tbody className='list__table-body'>
                                    {rows}
                                </tbody>
                            </table>
                            {pagination}
                        </div>
                        {userCard}
                    </div>
                );
            } else {
                content = (
                    <div className='user-list list'>
                        <Spin ref='Spin'/>
                        <div className='s-page__head row'>
                            <div className='col-md-12'>
                                <h2 className='s-page__head-title'>
                                    Users
                                </h2>
                            </div>
                        </div>
                        <div className='s-page__content table-responsive'>
                            <div className='col-md-12'>
                                <h4>
                                    You are not authorized to view this page
                                </h4>
                            </div>
                        </div>
                    </div>
                );
            }

            return content;
        },

        createControlButton: function () {
            var controlsButton = '',
                ctrlButtonCls = 'list__control-button';

            controlsButton = (
                <div className={ctrlButtonCls} onMouseDown={this.showColumnsModal}>
                    <Glyphicon icon='th-list' />
                </div>
            );

            return controlsButton;
        },

        createMXGroup: function () {
            var that = this,
                mxgroup,
                mxgroupList = [{
                    value: 'all',
                    text: 'All Locations'
                }];

            if (this.state.mxGroupMembers && this.state.mxGroupMembers.length > 1) {
                this.state.mxGroupMembers.map(function (member) {
                    mxgroupList.push({ value: member.MXMemberId, text: member.MXMemberName });
                });

                mxgroup = <Select name='location' options={mxgroupList} onChangeHandler={that.changeLocation}/>;
            }

            return mxgroup;
        },

        createMultypleRowsControl: function () {
            var multipleRows = this.state.multipleRows,
                text = '0 users selected',
                deleteButtonDisabled = true,
                editButtonDisabled = true,
                modal = '',
                modalContent = '';

            if ( multipleRows.selected.length === 1 ) {
                text = '1 user selected';
                editButtonDisabled = false;
                deleteButtonDisabled = false;
            } else if ( multipleRows.selected.length > 1 ) {
                text = multipleRows.selected.length + ' users selected';
                deleteButtonDisabled = false;
                editButtonDisabled = false;
            }

            modalContent = (
                <div className='list__modals-text'>
                    {'You trying to delete ' +multipleRows.selected.length + (multipleRows.selected.length === 1 ? ' user' : ' users')}
                </div>
            );

            modal = (
                <Modal
                    ref='modalDelete'
                    id='columns'
                    header='Delete'
                    confirm='Confirm'
                    onConfirm={this.delItems}>
                    {modalContent}
                </Modal>
            );

            return (
                <div className='list__control-multiple'>
                    <span className='list__control-multiple-text'>
                        {text}
                    </span>
                    <Button
                        title="Edit selected users"
                        disabled={editButtonDisabled}
                        option='success'
                        clickHandler={this.callUserCard.bind(this, multipleRows.selected)}>
                        Edit
                    </Button>
                    <Button
                        title="Delete selected users"
                        disabled={deleteButtonDisabled}
                        option='danger'
                        clickHandler={this.showDeleteModal}>
                        Delete
                    </Button>
                    {modal}
                </div>
            );
        },

        createHead: function (columns) {
            var that = this,
                head;

            head = [
                <th key={0} className='list__th' onClick={this.state.modify && this.selectAllUserRow}>
                    {this.state.modify && <Checkbox checked={that.state.multipleRows.all}/>}
                </th>,
                columns.map(function(column, i) {
                    var sort = '',
                        sortField = that.state.sort && that.state.sort.field,
                        sortDirection = 'forvard',
                        key = i++,
                        active = false;

                    if ( sortField === column.id ) {
                        active = true,
                        sortDirection = that.state.sort.direction;
                    }

                    sort = <Sort
                                active={active}
                                name={column.id}
                                size='s'
                                direction={sortDirection}
                                sort={that.sort}/>;

                    return (
                        <th data-resizable-column-id={'userList-'+key} key={key} className='list__th'>
                            <span className='list__th-text' onClick={that.thClickHandler}>
                                {column.text}
                            </span>
                            { sort }
                        </th>
                    );
                })
            ];

            return head;
        },

        createCheckboxes: function () {
            var that = this,
                checkboxes;

            checkboxes = Object.keys(this.state.columns).map( function(column, i) {
               var field = that.state.columns[column],
                   checked = _.contains(that.state.selectedColumns, field.id);

               if ( field.view ) {
                   return (
                       <div key={i} className="list__modals-checkboxrows">
                           <Checkbox
                               name={field.id}
                               text={field.text}
                               checked={checked}/>
                       </div>
                   );
               }
           });

           return (
               <div>
                   <h5>Columns</h5>
                   {checkboxes}
                </div>
            );
        },

        createUsers: function (columns, start, end) {
            var that = this,
                rows,
                selectedRows = this.state.multipleRows.selected,
                users = this.state.fullCollections.slice(start, end);

            rows = users.map(function(user, i){
                var clsRow = 'list__table-tr',
                    checked = false,
                    checkbox;

                if (~selectedRows.indexOf(user) || that.state.multipleRows.all) {
                    clsRow = clsRow + ' ' + clsRow + '--active';
                    checked = true;
                }

                checkbox = (
                    <td key={0} onClick={that.selectRow.bind(that, user)}>
                        {that.state.modify && <Checkbox checked={checked}/>}
                    </td>
                );

                return (
                    <tr
                        className={clsRow}
                        key={i}
                        onClick={that.callUserCard.bind(that, [user])}>
                        {checkbox}
                        {columns.map(function (column, i) {
                            var key = i++;
                            return (
                                <td key={key}>
                                    { _.isObject(user[column.id]) ? user[column.id].profileName : user[column.id] }
                                </td>
                            );
                        })}
                    </tr>
                );
            });

            return rows;
        }
    });

    provide(UserList);
});
