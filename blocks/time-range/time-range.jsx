modules.define('time-range', ['react'], function(provide, React) {
    /**
     * Date Range
     *
     * @property {string} mixCls                - css classes for mix
     *
     * @property {Function} onChangeHandler
     */
    var blockName = this.name,
        TimeRange = React.createClass({
        statics: {
            /*
             * Convert time from 24h to 12h AM/PM
             *
             * @param {string} [date=00:00]
             * @param {string} [string=array]
             *
             * @returns {string[]}
             * @returns {string} string[0] - Time in 12h
             * @returns {string} string[0] - AM|PM
             */
            convertTime: function (string, type) {
                var str = string || '00:00',
                    min, hour,
                    splitString,
                    time = [];

                splitString = str.split(':');
                hour = splitString[0];
                min = splitString[1];

                if ( +hour === 0 ) {
                    time = ['12', min, 'AM'];
                } else if ( +hour === 24 ) {
                    time = ['12', min, 'PM'];
                } else if ( +hour < 12 ) {
                    time = [hour, min, 'AM'];
                } else {
                    var newHour = +hour % 12 + '';

                    if ( newHour === '0' ) {
                        newHour = '12';
                    }

                    if ( newHour.length === 1 ) {
                        newHour = '0' + newHour;
                    }

                    time = [newHour, min,'PM'];
                }

                if ( type === 'string') {
                    time = time[0] + ':' + time[1] + ' ' + time[2];
                }

                return time;
            }
        },

        getInitialState: function () {
            var timeFrom = this.constructor.convertTime(this.props.time[0]),
                timeTo = this.constructor.convertTime(this.props.time[1]),
                checkError = this.checkErrors(timeFrom, timeTo);

            return {
                timeError: checkError.timeError,
                valueError: checkError.valueError,
                timeFrom: timeFrom,
                timeTo: timeTo
            };
        },

        onChangeTime: function (type, name, event) {
            var obj = {},
                value = event.target.value,
                timeState = this.state[type],
                val = +value;

            if ( name === 'hr' ) {
                if ( val > 12 ) {
                    val = '12';
                } else {
                    val = value;
                }

                timeState[0] = val;
            } else if ( name === 'min' ) {
                if ( val > 59 ) {
                    val = '59';
                } else {
                    val = value;
                }

                timeState[1] = val;
            }

            obj[type] = timeState;
            this.setState(obj);
            this.setState(this.checkErrors());
            this.onChangeHandler();
        },

        onChangeMer: function (type, value) {
            var obj = {},
                timeState = this.state[type];

            timeState[2] = value;

            obj[type] = timeState;
            this.setState(obj);
            this.setState(this.checkErrors());
            this.onChangeHandler();
        },

        checkErrors: function (from, to) {
            var controlError = {
                    timeError: false,
                    valueError: false
                },
                timeFrom = from || this.state.timeFrom,
                timeTo = to || this.state.timeTo,
                timeFromHr = timeFrom[2] === 'AM' ? +timeFrom[0] : +timeFrom[0] + 12,
                timeToHr =  timeTo[2] === 'AM' ? +timeTo[0] : +timeTo[0] + 12,
                timeFromMin = timeFrom[1],
                timeToMin = timeTo[1];

            if ( timeToHr < timeFromHr ||
                 timeToHr === timeFromHr && timeToMin < timeFromMin ||
                 timeToHr === timeFromHr && timeToMin === timeFromMin) {
                controlError.timeError = true;
            }

            if ( +timeToHr === 0 || +timeFromHr === 0 ) {
                controlError.valueError = true;
            }

            return controlError;
        },

        onChangeHandler: function () {
            if ( this.props.onChangeHandler ) {
                var controlError = this.checkErrors(),
                    timeFrom = this.state.timeFrom,
                    timeTo = this.state.timeTo,
                    timeFromHr = timeFrom[2] === 'AM' ? +timeFrom[0] : +timeFrom[0] + 12,
                    timeToHr =  timeTo[2] === 'AM' ? +timeTo[0] : +timeTo[0] + 12,
                    timeFromMin = timeFrom[1],
                    timeToMin = timeTo[1],
                    timeFromString = [timeFromHr, timeFromMin].join(':'),
                    timeToString = [timeToHr, timeToMin].join(':');

                this.props.onChangeHandler(controlError.timeError || controlError.valueError, [timeFromString, timeToString]);
            }
        },

        render: function() {
            var cls,
                timeError = '',
                valueError = '',
                mixCls = this.props.mixCls || '';

            cls = [blockName, mixCls].join(' ');

            if ( this.state.timeError ) {
                timeError = (
                    <div className={blockName + '__error'}>
                        Invalid time range.
                    </div>
                );
            }

            if ( this.state.valueError ) {
                valueError = (
                    <div className={blockName + '__error'}>
                        Invalid value.
                    </div>
                );
            }

            return (
                <div className={cls}>
                    <div className={blockName + '__text'}>From </div>
                    {this.createControl('timeFrom')}
                    <div className={blockName + '__text'}>to </div>
                    {this.createControl('timeTo')}
                    {timeError}
                    {valueError}
                </div>
            );
        },

        createControl: function (type) {
            var arrTime = this.state[type],
                hr = arrTime[0],
                min = arrTime[1],
                mer = arrTime[2],
                content = '';

            content = (
                <div className={blockName + '__control'}>
                    <input
                        type="number"
                        className={['form-control', blockName + '__input'].join(' ')}
                        value={hr}
                        max="12"
                        min="1"
                        onChange={this.onChangeTime.bind(this, type, 'hr')}/>
                    :
                    <input
                        type="number"
                        className={['form-control', blockName + '__input'].join(' ')}
                        value={min}
                        max="60"
                        min="0"
                        onChange={this.onChangeTime.bind(this, type, 'min')}/>
                    <div className='btn-group' data-toggle='buttons'>
                        <label
                            className={['btn btn-default btn-sm', mer === 'AM' && 'active'].join(' ')}
                            onClick={this.onChangeMer.bind(this, type, 'AM')}>
                            <input
                                type='radio'
                                name='options'
                                id='option1'
                                autoComplete='off'/>
                            AM
                        </label>
                        <label
                            className={['btn btn-default btn-sm', mer === 'PM' && 'active'].join(' ')}
                            onClick={this.onChangeMer.bind(this, type, 'PM')}>
                            <input
                                type='radio'
                                name='options'
                                id='option2'
                                autoComplete='off'/>
                            PM
                        </label>
                    </div>
                </div>
            );

            return content;
        }
    });

    provide(TimeRange);
});
