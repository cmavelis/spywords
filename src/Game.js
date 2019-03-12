import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import Board from './components/Board';
import CardCounter from './components/CardCounter';
import Modal from './components/Modal';
import 'seedrandom';


// hard-coded cardColors grid
// 9 for 1st team, 8 for 2nd team
// 1 death, 7 neutral
const cardColorsSample = _.flatten([
    ['b', 'r', 'w', 'w', 'b'],
    ['b', 'r', 'w', 'b', 'b'],
    ['b', 'r', 'r', 'r', 'w'],
    ['b', 'r', 'w', 'k', 'w'],
    ['b', 'r', 'w', 'r', 'b'],
]);


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: Array(25).fill('-'),
            cardColors: cardColorsSample,
            cardShownStatus: Array(25).fill(false),
            modalShown: false,
            cardClicked: null,
            counts: _.countBy(cardColorsSample),
            cardLeaderMarks: Array(25).fill(false),
        };
    }

    componentDidMount() {
        const { generateNewSeed } = this.props;
        generateNewSeed();
    }

    componentDidUpdate(prevProps) {
        const { randomSeed, leaderMode } = this.props;
        console.log('game updated');
        if (prevProps.randomSeed !== randomSeed) {
            this.seedNewGame(randomSeed);
        }
        if (prevProps.leaderMode !== leaderMode) {
            if (leaderMode) {
                this.setState({
                    cardShownStatus: Array(25).fill(leaderMode),
                });
            } else {
                this.setState({
                    cardShownStatus: Array(25).fill(leaderMode),
                    cardLeaderMarks: Array(25).fill(false),
                });
            }
        }
    }

    showModal = (cardID) => {
        this.setState({
            modalShown: true,
            cardClicked: cardID,
        });
    };

    hideModal = () => {
        this.setState({ modalShown: false, cardClicked: undefined });
    };

    updateCounter = () => {
        this.setState(prevState => (
            {
                counts: _.countBy(prevState.cardColors.filter(
                    (cc, i) => !prevState.cardShownStatus[i],
                )),
            }
        ));
    };

    seedNewGame = () => {
        let { randomSeed } = this.props;
        const { wordFile } = this.props;
        const { wordList, listLength } = wordFile;
        const today = new Date();
        const todayValue = today.getUTCFullYear().toString()
            + today.getUTCMonth() + today.getUTCDate();
        if (randomSeed !== 'test') {
            randomSeed = todayValue + randomSeed;
        }
        randomSeed = randomSeed.replace(/\s+/g, '');
        Math.seedrandom(randomSeed);
        // select sample of words using seed, ignoring repeats
        const wordsSelected = [];
        let wordToAdd = '';
        while (wordsSelected.length < 25) {
            wordToAdd = wordList[Math.floor(Math.random() * listLength)];
            if (!wordsSelected.includes(wordToAdd)) wordsSelected.push(wordToAdd);
        }

        let redHasMore;

        // uses odd/even to determine who goes first
        if (typeof Number(randomSeed) === 'number' && _.isFinite(randomSeed)) {
            redHasMore = (Number(randomSeed) % 2);
        } else {
            Math.seedrandom(randomSeed);
            redHasMore = 1 * (Math.random() > 0.5);
        }

        const redArray = Array(8 + redHasMore).fill('r');
        const blueArray = Array(9 - redHasMore).fill('b');
        const whiteArray = Array(7).fill('w');
        const blackArray = ['k'];

        const fullArray = redArray.concat(blueArray, whiteArray, blackArray);
        // apply random seed before shuffling the Array
        Math.seedrandom(randomSeed);
        const newCardColors = _.shuffle(fullArray);
        this.setState({
            cardColors: newCardColors,
            words: wordsSelected,
            cardShownStatus: Array(25).fill(false),
            cardLeaderMarks: Array(25).fill(false),
        });
        this.updateCounter();
    };

    updateBoard = () => {
        const { leaderMode } = this.props;
        // change revealed status of clicked card
        // if LEADER, mark instead of reveal, since all will be revealed

        // update state
        this.setState((prevState) => {
            const prevClick = prevState.cardClicked;
            let updateArray;
            if (!_.isNaN(prevClick)) {
                if (leaderMode) {
                    updateArray = prevState.cardLeaderMarks;
                    updateArray[prevClick] = !updateArray[prevClick];
                    return {
                        cardLeaderMarks: updateArray,
                        cardShownStatus: Array(25)
                            .fill(true),
                    };
                }
                updateArray = prevState.cardShownStatus;
                updateArray[prevClick] = !updateArray[prevClick];
                return { cardShownStatus: updateArray };
            }
            return prevState;
        });
        this.updateCounter();
    };

    handleCardToggle = () => {
        this.setState((prevState) => {
            if (prevState.cardClicked === 'leader_mode') {
                return {
                    leaderMode: true,
                    cardShownStatus: Array(25)
                        .fill(true),
                };
            }
            return {
                prevState,
            };
        });
        this.updateBoard();
        this.hideModal();
    };

    render() {
        const {
            cardShownStatus,
            words,
            cardColors,
            modalShown,
            cardClicked,
            counts,
            cardLeaderMarks,
        } = this.state;

        return (
            <div>
                <div className="game">
                    <Board
                        words={words}
                        squares={cardShownStatus}
                        onClick={this.showModal}
                        modalClick={this.handleCardToggle}
                        cardColors={cardColors}
                        cardLeaderMarks={cardLeaderMarks}
                    />
                    <CardCounter
                        counts={counts}
                    />
                </div>
                <div>
                    <Modal
                        show={modalShown}
                        handleClose={this.hideModal}
                        handleCardToggle={this.handleCardToggle}
                        cardClicked={cardClicked}
                        wordClicked={words[cardClicked]}
                    >
                        {cardClicked === 'leader_mode'
                            ? (
                                <p>
                                    Turn on leader mode?
                                </p>
                            )
                            : (
                                <p>
                                    {cardShownStatus[cardClicked] ? 'Hide card?' : 'Reveal card?'}
                                </p>
                            )
                        }
                    </Modal>
                </div>
            </div>
        );
    }
}

Game.propTypes = {
    generateNewSeed: PropTypes.func.isRequired,
    wordFile: PropTypes.object.isRequired,
    randomSeed: PropTypes.string.isRequired,
    leaderMode: PropTypes.bool.isRequired,
};

export default Game;
