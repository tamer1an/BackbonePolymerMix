modules.define('modal', ['react', 'button', 'jquery', 'react-dom'], function(provide, React, Button, $, ReactDOM) {

    /**

     * Modal window

     *

     * @property {string} [confirm]          - Add confirm button type submit

     * @property {string} [delete]           - Add delete button, fire deleteHandle event

     *

     * @property {function} [deleteHandle]   - Handle for delete buton

     * @property {function} [onHiddenEvent]  - Handle for hidden event

     * @property {function} [onShownEvent]   - Handle for shown event

     */

    var MXAdmin = React.createClass({

        close: function() {

            $(ReactDOM.findDOMNode(this)).modal('hide');

        },


        open: function() {

            $(ReactDOM.findDOMNode(this)).modal('show');

        },


        deleteHandle: function (e) {

            if ( this.props.deleteHandle ) {

                this.props.deleteHandle(e);

            }

        },


        componentDidMount: function () {

            var that = this;


            if (this.props.onHiddenEvent) {

                $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', function (e) {

                    that.props.onHiddenEvent(e);

                });

            }


            if (this.props.onShownEvent) {

                $(ReactDOM.findDOMNode(this)).on('shown.bs.modal', function (e) {

                    that.props.onHiddenEvent(e);

                });

            }

        },


        render: function() {

            var confirmButton = null,

                deleteButton = null,

                cls,

                clsMix = this.props.clsMix || ' ';


            cls = ['modal', 'fade', clsMix].join(' ');


            if (this.props.confirm) {

                confirmButton = (

                    <Button title="Save this record" type='submit' option='primary' onClick={this.handleSubmit}>
                        {this.props.confirm}

                    </Button>

                );

            }


            if ( this.props.delete ) {

                deleteButton = (

                    <Button  title="Delete this record" type='button' option='danger' onClick={this.deleteHandle}>

                        {this.props.delete}

                    </Button>

                );

            }


            return (

                <div className={cls} id={this.props.id} tabIndex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>

                    <div className='modal-dialog'>

                        <div className='modal-content'>
                            <div className='modal-header'>

                                <button title="Close this window" type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>

                                <h4 className='modal-title'>{this.props.header}</h4>

                            </div>

                            <div className='modal-body'>

                                {this.props.children}

                            </div>
                            {(confirmButton || deleteButton) && <div className='modal-footer'>
                                {confirmButton}

                                {deleteButton}
                            </div>}

                        </div>
                    </div>

                </div>

            );

        },


        handleSubmit: function(e) {

            if ( this.props.onConfirm ) {

                this.props.onConfirm(e);

            }

        }

    });


    provide(MXAdmin);


});

