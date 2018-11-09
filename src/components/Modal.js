import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({
    handleCardToggle,
    handleClose,
    show,
    wordClicked,
    children,
}) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <p>
                    <b>
                        {wordClicked}
                    </b>
                </p>
                <div className="div-center">
                    <button className="modal-button input-elements" type="button" onClick={handleCardToggle}>
                        Toggle
                    </button>
                </div>
                <div className="div-center">
                    <button className="modal-button input-elements" type="button" onClick={handleClose}>
                        Close window
                    </button>
                </div>
            </section>
        </div>
    );
};

Modal.propTypes = {
    handleCardToggle: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    wordClicked: PropTypes.string,
    children: PropTypes.node,
};

Modal.defaultProps = {
    show: false,
    children: null,
    wordClicked: 'ERROR',
};

export default Modal;
