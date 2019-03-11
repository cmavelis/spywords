import React from 'react';
import PropTypes from 'prop-types';


const SetupMenu = ({
    randomSeed,
    headerIsHidden,
    toggleHeaderHide,
    handleInputChange,
    showModal,
}) => (
    <header className={`hiding-box ${headerIsHidden ? 'hiding-box-hidden' : ''}`}>
        <button
            type="button"
            className="hide-button"
            onClick={toggleHeaderHide}
        />
        <div className="utility-row">
            <div className="utilities-box">
                <p>Game code</p>
                <input
                    name="randomSeed"
                    type="text"
                    value={randomSeed}
                    className="input-elements"
                    onChange={handleInputChange}
                />
            </div>
            <div className="utilities-box">
                <button
                    type="button"
                    className="input-elements"
                    onClick={() => showModal('leader_mode')}
                >
                    LEADER MODE
                </button>
            </div>
        </div>
    </header>
);

SetupMenu.propTypes = {
    randomSeed: PropTypes.string.isRequired,
    headerIsHidden: PropTypes.bool.isRequired,
    toggleHeaderHide: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
};

export default SetupMenu;
