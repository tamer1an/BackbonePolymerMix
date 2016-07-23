modules.define('devices-list', [
    'react',
    'jquery',
    'underscore',
    'modal',
    'checkbox',
    'cookie',
    'sort',
    'search',
    'glyphicon',
    'device-card',
    'button',
    'spin',
    'i-config',
    'info-line',
    'list'
], function(provide, React, $, _, Modal, Checkbox, Cookie, Sort, Search, Glyphicon,
             DeviceCard, Button, Spin, iConfig, InfoLine, List) {
    var DevicesList = React.createClass({
        mixins: [List],

        getDefaultProps: function() {
            return {
                key: 'DeviceRecId',
                dataOwner: 'devices',
                searchFields: ['deviceId', 'macAddr', 'profileName', 'deviceType', 'location'],
                listUrl: 'newapi/config/devices',
                command: 'get_device_list',
                dataUrl: 'json/devices-list.json'
            };
        },

        getInitialState: function() {
            var sort = null,
                pageOffset;

            if ( localStorage.getItem('sortDevices') ) {
                sort = JSON.parse(localStorage.getItem('sortDevices'));
            }

            if ( localStorage.getItem('pageOffset') ) {
                pageOffset = JSON.parse(localStorage.getItem('pageOffset')).devices;
            }
            return {
                selectedColumns: iConfig.getProps('device-list'),
                pageOffset: pageOffset || 20,
                pageCurrent: 0,
                devices: [],
                deviceCard: {},
                sort: sort,
                multipleRows: {
                    all: false,
                    selected: []
                },
                readList: this.props.read.indexOf('get_device_list') !== -1,
                modify: this.props.write.indexOf('update_device') !== -1
            };
        },

        sort: function (obj) {
            var sort = {
                    field: obj.field,
                    direction: obj.direction
                },
                sorted = '';

            sorted = _.sortBy(this.state.fullCollections, function (device) {
                return device[obj.field] || device.lines[0][obj.field];
            });

            if ( obj.direction !== 'forvard' ) {
                sorted = sorted.reverse();
            }

            localStorage.setItem('sortDevices', JSON.stringify(sort));

            this.setState({
                fullCollections: sorted,
                sort: sort
            });
        },

        callDeviceCard: function (deviceData, e) {
            /**
             * $.extend(true, {}, deviceData)
             * Костыль для создания нового экземпяра,
             * чтобы при вызове карточки
             * не править исходные данные
             */
            if ( deviceData.newUser ) {
                this.refs.Card.show($.extend(true, {}, deviceData));
            } else {
                this.refs.Card.show($.extend(true, {}, deviceData));
            }

            e.preventDefault();
        },

        prepNewMultipleObj: function (deviceData) {
            var keys = _.keys(deviceData[0]),
                newObj = {};

            keys.map(function (val) {
                var keyArr = newObj[val] = [];

                deviceData.map(function (elem) {
                    keyArr.push(elem[val]);
                });
            });

            _.map(newObj, function (val, key) {
                var keyObj = _.union(val);

                if ( key !== 'deviceRecId' && keyObj.length > 1  ) {
                    newObj[key] = { disabled: true };
                } else if ( key !== 'deviceRecId' ) {
                    newObj[key] = keyObj[0];
                }
            });

            return newObj;
        },

        updateConfigs: function () {
            var that = this,
                spin = this.refs.Spin,
                props = this.props,
                state = this.state,
                devices = '';

            devices = state.multipleRows.selected.map(function (elem) {
                return elem.deviceRecId;
            });

            $.ajax({
                type: "POST",
                url: props.urlApi + 'newapi/config/update',
                data: {
                    data: JSON.stringify({devices: devices}),
                    session: Cookie.get('token'),
                    command: 'update_device_cfg'
                },
                beforeSend: function () {
                    if ( spin ) {
                        spin.show();
                    }
                },
                dataType: 'json'
            }).done(function(data) {
                console.log(data);
            }).fail(function() {
                alert('An error has occurred, reload this page or try again later');
            }).always(function () {
                if ( spin ) {
                    spin.hide();
                }
            });
        },

        render: function() {
            'use strict';

            var that = this,
                content = '',
                rows,
                pagination,
                device,
                columns = [],
                head = '',
                badge = '',
                message,
                multipleRowsControl = '',
                controlsButton,
                modal,
                linesPerPage,
                paginationObj;

            device = <DeviceCard
                        ref='Card'
                        rights={this.state.modify}
                        columns={this.state.columns || []}
                        statusMessage={this.statusMessage}/>;

            if (this.state.fullCollections && this.state.columns) {
                columns = this.getColumns();

                head = this.createHead(columns);
                badge = <span title="Devices in the list" className="badge">{this.state.fullCollections.length}</span>;

                paginationObj = this.createPagination();
                pagination = paginationObj.pagination;
                rows = this.createDevices(columns, paginationObj.start, paginationObj.end);

                multipleRowsControl = this.createMultypleRowsControl();
            }

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

            controlsButton = this.createControlButton();
            linesPerPage = this.createLinesPerPage();

            modal = (
                <Modal
                    ref="modal"
                    id='columns'
                    header='Controls'>
                    {linesPerPage}
                </Modal>
            );
            if ( this.state.modify || this.state.readList ) {
                content = (
                    <div className='list'>
                        <Spin ref='Spin'/>
                        <div className='s-page__head row'>
                            <div className="col-md-4 col-sm-12">
                                <h2 className="s-page__head-title">
                                    Devices
                                    {badge}
                                </h2>
                            </div>
                            <div className='col-md-4 col-sm-7'>
                                {this.state.modify && multipleRowsControl}
                            </div>
                            <div className="col-md-3 col-sm-4">
                                <Search text='Search device' searchHandler={this.search}/>
                            </div>
                            <div className="col-md-1 col-sm-1">
                                {controlsButton}
                            </div>
                            {this.state.modify && <Button mixCls='add-button' option='primary' clickHandler={that.callDeviceCard.bind(that, {new:true})}>+</Button>}
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
                                <tbody className="list__table-body">
                                    {rows}
                                </tbody>
                            </table>
                        </div>
                        {pagination}
                        {device}
                    </div>
                );
            } else {
                content = (
                    <div className='list'>
                        <div className='s-page__head row'>
                            <div className="col-md-12">
                                <h2 className="s-page__head-title">
                                    Devices
                                </h2>
                            </div>
                        </div>
                        <div className='s-page__content table-responsive'>
                            <div className="col-md-12">
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

        createHead: function (columns) {
            var that = this,
                head,
                emptyTh;

            emptyTh = (
                (<th key={-1} className='list__th'></th>)
            );

            head = [
                emptyTh,
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
                        <th data-resizable-column-id={'deviceList-'+key} key={key} className='list__th'>
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

        createDevices: function (columns, start, end) {
            var that = this,
                rows,
                selectedRows = this.state.multipleRows.selected,
                devices = this.state.fullCollections.slice(start, end);

            rows = devices.map(function(device, i){
                var clsRow = 'list__table-tr',
                    checked = false;

                if (~selectedRows.indexOf(device) || that.state.multipleRows.all) {
                    clsRow = clsRow + ' ' + clsRow + '--active';
                    checked = true;
                }

                return (
                    <tr
                        className={clsRow}
                        key={i}
                        onClick={that.callDeviceCard.bind(that, device)}>
                            <td key={-1} onClick={that.state.modify && that.selectRow.bind(that, device)}>
                                {that.state.modify && <Checkbox checked={checked}/>}
                            </td>
                            {columns.map(function (column, i) {
                                var text = device[column.id] || device.lines && device.lines[0] && device.lines[0][column.id];
                                return (
                                    <td key={i}>
                                        {text}
                                    </td>
                                );
                            })}
                    </tr>
                );
            });

            return rows;
        },

        createMultypleRowsControl: function () {
            var multipleRows = this.state.multipleRows,
                text = '0 devices selected',
                deleteButtonDisabled = true,
                modal = '',
                modalContent = '';

            if ( multipleRows.selected.length === 1 ) {
                text = '1 device selected';
                deleteButtonDisabled = false;
            } else if ( multipleRows.selected.length > 1 ) {
                text = multipleRows.selected.length + ' devices selected';
                deleteButtonDisabled = false;
            }

            modalContent = (
                <div className='list__modals-text'>
                    {'You trying to delete ' + multipleRows.selected.length + ' users'}
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
                        disabled={deleteButtonDisabled}
                        option='danger'
                        clickHandler={this.showDeleteModal}>
                        Delete
                    </Button>
                    <Button
                        disabled={deleteButtonDisabled}
                        option='info'
                        clickHandler={this.updateConfigs}>
                        Update
                    </Button>
                    {modal}
                </div>
            );
        }
    });

    provide(DevicesList);
});
