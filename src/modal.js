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
                <button type="button" onClick={handleCardToggle}>
                    Toggle
                </button>
                <button type="button" onClick={handleClose}>
                    Close window
                </button>
            </section>
        </div>
    );
};

Modal.propTypes = {
    handleCardToggle: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    wordClicked: PropTypes.string.isRequired,
    children: PropTypes.node,
};

Modal.defaultProps = {
    show: false,
    children: null,
};

export default Modal;
