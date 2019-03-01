import React from 'react';
import PropTypes from 'prop-types';


const CardCounter = ({
    counts,
}) => (
    <div className="board-row">
        <div className="card counter card-color-r">
            {counts && counts.r
                ? counts.r
                : 0}
        </div>
        <div className="card counter card-color-blank any-width">
            cards remaining
        </div>
        <div className="card counter card-color-b">
            {counts && counts.b
                ? counts.b
                : 0}
        </div>
    </div>
);

CardCounter.propTypes = {
    counts: PropTypes.shape({
        r: PropTypes.number,
        b: PropTypes.number,
        k: PropTypes.number,
        w: PropTypes.number,
    }).isRequired,
};

export default CardCounter;
