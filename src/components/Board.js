import React from 'react';
import PropTypes from 'prop-types';

function Card(props) {
    const {
        onClick,
        status,
        value,
        color,
        leaderMark,
    } = props;
    const cls = `card${status ? ` card-color-${color}` : ''}
        ${leaderMark ? ' card-leader-mark' : ''}`;
    return (
        <button type="button" className={cls} onClick={onClick}>
            {value}
        </button>
    );
}

class Board extends React.Component {
    renderCard(i) {
        const {
            words,
            onClick,
            squares,
            cardColors,
            cardLeaderMarks,
        } = this.props;
        return (
            <Card
                value={words[i]}
                key={i}
                onClick={() => onClick(i)}
                status={squares[i]}
                color={cardColors[i]}
                leaderMark={cardLeaderMarks[i]}
            />
        );
    }

    render() {
        const { cardIDs } = this.props;
        return (
            <div className="game-board">
                {cardIDs.map((row, i) => (
                    <div className="board-row" key={row.id}>
                        {row.map((card, j) => this.renderCard(i * 5 + j))}
                    </div>
                ))}
            </div>
        );
    }
}

Board.propTypes = {
    onClick: PropTypes.func.isRequired,
    words: PropTypes.arrayOf(PropTypes.string).isRequired,
    squares: PropTypes.arrayOf(PropTypes.bool).isRequired,
    cardIDs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    cardColors: PropTypes.arrayOf(PropTypes.string).isRequired,
    cardLeaderMarks: PropTypes.arrayOf(PropTypes.bool).isRequired,
};
Card.propTypes = {
    onClick: PropTypes.func.isRequired,
    status: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    leaderMark: PropTypes.bool.isRequired,
};
export default Board;
