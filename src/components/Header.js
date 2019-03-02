import React from 'react';
import PropTypes from 'prop-types';


const Header = ({
    randomSeed,
    headerIsHidden,
    toggleHeaderHide,
    handleInputChange,
    seedNewGame,
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
                    value={randomSeed}
                    className="input-elements"
                    onChange={handleInputChange}
                />
            </div>
            <div className="utilities-box">
                <button
                    type="button"
                    className="input-elements"
                    onClick={seedNewGame}
                >
                    Refresh game
                </button>
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

Header.propTypes = {
    randomSeed: PropTypes.string.isRequired,
    headerIsHidden: PropTypes.bool.isRequired,
    toggleHeaderHide: PropTypes.func.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    seedNewGame: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
};

export default Header;
