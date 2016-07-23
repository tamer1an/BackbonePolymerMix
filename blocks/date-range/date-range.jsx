modules.define('date-range', [
    'react',
    'date-picker',
    'checkbox'
], function(provide, React, DatePicker, Checkbox) {
    var blockName = this.name, Content;

    Content = React.createClass({
        getInitialState: function() {
            var dateFrom, dateFromSplit, dateFromChecked,
                dateTo, dateToSplit, dateToChecked,
                dateRange = this.props.dateRange;

            if (dateRange && dateRange[0] && dateRange[0].length) {
                dateFromChecked = true;
                dateFromSplit = dateRange[0].split('/');
                dateFrom = new Date(dateFromSplit[2], dateFromSplit[0] - 1, dateFromSplit[1]);
            }

            if (dateRange && dateRange[1] && dateRange[1].length) {
                dateToChecked = true;
                dateToSplit = dateRange[1].split('/');
                dateTo = new Date(dateToSplit[2], dateToSplit[0] - 1, dateToSplit[1]);
            }

            return {
                error: false,
                dateRange: dateRange || [],
                dateFrom: dateFrom,
                dateFromChecked: dateFromChecked,
                dateToChecked: dateToChecked,
                dateTo: dateTo
            };
        },

        onSelect: function (index, dateO) {
            var date = [dateO.getMonth() + 1, dateO.getDate(), dateO.getFullYear()],
                error = false, dateFrom, dateTo;

            if ( index === '0' ) {
                dateFrom = dateO.valueOf();
                dateTo = this.state.dateRange[1].split('/');
                dateTo = new Date(dateTo[2], dateTo[0] - 1, dateTo[1]).valueOf();
            } else {
                dateFrom = this.state.dateRange[0].split('/');
                dateFrom = new Date(dateFrom[2], dateFrom[0] - 1, dateFrom[1]).valueOf();
                dateTo = dateO.valueOf();
            }

            if ( dateFrom > dateTo ) {
                error = true;
            } else {
                 this.state.dateRange[index] = date.join('/');
            }

            this.setState({
                error: error
            });
        },

        changeChecked: function (name, value) {
            var o = {},
                dateRange = this.state.dateRange;

            o[name] = value;
            this.setState(o);

            if ( name === 'dateFromChecked' && !dateRange[0].length ) {
                this.onSelect('0', new Date());
            } else if (name === 'dateToChecked' && !dateRange[1].length) {
                this.onSelect('1', new Date());
            }
        },

        render: function() {
            var content;

            content = <div className={blockName}>
                <div className={blockName + '__row'}>
                    <div className={blockName + '__label'}>
                        <Checkbox
                            checked={this.state.dateFromChecked}
                            text='From'
                            name='dateFromChecked'
                            onChangeHandler={this.changeChecked}/>
                    </div>
                    <div className={blockName + '__control'}>
                        <DatePicker
                            disabled={!this.state.dateFromChecked}
                            selected={this.state.dateFrom}
                            onSelect={this.onSelect.bind(this, '0')}/>
                    </div>
                </div>
                <div className={blockName + '__row'}>
                    <div className={blockName + '__label'}>
                        <Checkbox
                            checked={this.state.dateToChecked}
                            text='To'
                            name='dateToChecked'
                            onChangeHandler={this.changeChecked}/>
                    </div>
                    <div className={blockName + '__control'}>
                        <DatePicker
                            disabled={!this.state.dateToChecked}
                            selected={this.state.dateTo}
                            onSelect={this.onSelect.bind(this, '1')}/>
                    </div>
                </div>
                <div className={
                        [
                            blockName + '__error',
                            this.state.error ? blockName + '__error--vis' : ''
                        ].join(' ')}>
                    The 'date from' can not be later than the 'date to'.
                </div>
            </div>;

            return content;
        }
    });

    provide(Content);

});
