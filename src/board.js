import React from 'react';
import PropTypes from 'prop-types';

function Card(props) {
    const {
        onClick,
        status,
        value,
    } = props;
    return (
        <button className="card" onClick={onClick}>
            {status ? value : '?'}
        </button>
    );
}

class Board extends React.Component {
    renderCard(i) {
        const {
            words,
            onClick,
            squares,
        } = this.props;
        return (
            <Card
                value={words[i]}
                key={i}
                onClick={() => onClick(i)}
                status={squares[i]}
            />
        );
    }

    render() {
        const { cardIDs } = this.props;
        return (
            <div className="game-board">
                {cardIDs.map((row, i) => (
                    <div className="board-row" key={i}>
                        {row.map((card, j) => this.renderCard(i * 5 + j))}
                    </div>
                ))}
            </div>
        );
    }
}

Board.propTypes = {
    onClick: PropTypes.func.isRequired,
    words: PropTypes.array.isRequired,
    squares: PropTypes.array.isRequired,
    cardIDs: PropTypes.array.isRequired,
};
Card.propTypes = {
    onClick: PropTypes.func.isRequired,
    status: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
};
export { Board };
