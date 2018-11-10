import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({
    handleCardToggle,
    handleClose,
    show,
    wordClicked,
    children,
    cardClicked,
}) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
    const displayText = cardClicked < 25 && cardClicked > 0 ? wordClicked : cardClicked;

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <p>
                    <b>
                        {displayText}
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
    cardClicked: PropTypes.string,
    wordClicked: PropTypes.string,
    children: PropTypes.node,
};

Modal.defaultProps = {
    show: false,
    children: null,
    wordClicked: 'ERROR',
    cardClicked: undefined,
};

export default Modal;
