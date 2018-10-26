import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({
    handleCardToggle,
    handleClose,
    show,
    cardClicked,
    children,
}) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {children}
                <button onClick={handleCardToggle}>
                    `toggle { cardClicked }`
                </button>
                <button onClick={handleClose}>close</button>
            </section>
        </div>
    );
};

Modal.propTypes = {
    handleCardToggle: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node,
};

export default Modal;
