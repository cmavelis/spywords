import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import Board from './components/Board';
import Modal from './components/Modal';
import './Game.css';
import 'seedrandom';


const getWordList = (fileName) => {
    // populate wordList from adjacent file
    let wordsReceived = '';
    const xhr = new XMLHttpRequest();
    xhr.onload = () => {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                wordsReceived = xhr.responseText;
            }
        }
    };
    xhr.open('GET', fileName, false);
    xhr.send(null);

    const wordList = wordsReceived.split(/\r?\n/);
    const listLength = wordList.length - 1;
    return [wordList, listLength];
};

const wordFiles = {
    cardsClassic: {
        filename: 'words_classic.csv',
        wordList: [],
        listLength: 0,
    },
    cardsSimple: {
        filename: 'words_simple.csv',
        wordList: [],
        listLength: 0,
    },
    seedAdjectives: {
        filename: 'seed_adjectives.csv',
        wordList: [],
        listLength: 0,
    },
    seedNouns: {
        filename: 'seed_nouns.csv',
        wordList: [],
        listLength: 0,
    },
};

const getWords = () => {
    Object.keys(wordFiles)
        .forEach((key) => {
            const [wordList, listLength] = getWordList(wordFiles[key].filename);
            wordFiles[key].wordList = wordList;
            wordFiles[key].listLength = listLength;
        });
};

const promiseGetWords = new Promise((succeed, fail) => {
    succeed(getWords());
});

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

const CardCounter = ({
    counts,
}) => (
    <div className="board-row">
        <div className="card counter-red">
                Red cards remaining:
            {' '}
            {counts && counts.r
                ? counts.r
                : 0}
        </div>
        <div className="card counter-blue">
                Blue cards remaining:
            {' '}
            {counts && counts.b
                ? counts.b
                : 0}
        </div>
    </div>
);

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            words: Array(25).fill(''),
            cardColors: cardColorsSample,
            cardIDs: [0, 1, 2, 3, 4].map(i => Array(5).fill(i)),
            history: [{
                squares: Array(25).fill(false),
            }],
            xIsNext: true,
            stepNumber: 0,
            modalShown: false,
            cardClicked: null,
            randomSeed: '1',
            counts: _.countBy(cardColorsSample),
            headerIsHidden: false,
        };
    }

    // seedNewWords should go in the constructor I think
    componentDidMount() {
        const { randomSeed } = this.state;
        if (randomSeed === '1') {
            Math.seedrandom(Date.now());
            const randomAdjective = this.getRandomWord(wordFiles.seedAdjectives);
            const randomNoun = this.getRandomWord(wordFiles.seedNouns);
            this.setState(
                { randomSeed: `${randomAdjective} ${randomNoun}` },
            );
        }
        promiseGetWords.then(this.seedNewGame)
            .catch(err => console.log(`There was an error:${err}`));
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

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value.toLowerCase() });
    };

    getRandomWord = (wordObject) => {
        const { wordList, listLength } = wordObject;
        return wordList[Math.floor(Math.random() * listLength)];
    };

    seedNewGame = () => {
        const { randomSeed } = this.state;
        const { wordList, listLength } = wordFiles.cardsClassic;
        const today = new Date();
        const todayValue = today.getFullYear().toString() + today.getMonth() + today.getDate();
        if (randomSeed === 'test') {
            Math.seedrandom(randomSeed);
        } else {
            Math.seedrandom(randomSeed * todayValue);
        }
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
        this.setState({
            cardColors: _.shuffle(fullArray),
            words: wordsSelected,
        });
        this.updateBoard();
    };

    toggleHeaderHide = () => {
        const { headerIsHidden } = this.state;
        this.setState({
            headerIsHidden: !headerIsHidden,
        });
    };

    updateBoard = () => {
        const {
            xIsNext,
            cardClicked,
            history,
            stepNumber,
            cardColors,
        } = this.state;
        // get current board
        const historySlice = history.slice(0, stepNumber + 1);
        const current = historySlice[historySlice.length - 1];
        const squares = current.squares.slice();

        // if (calculateWinner(squares) || squares[i]) {
        //   return;
        // }

        // change revealed status of clicked card
        // if LEADER, reveal all
        if (cardClicked === 'REVEAL') {
            squares.fill(true);
        } if (cardClicked === 'HIDE') {
            squares.fill(false);
        } if (!_.isNaN(cardClicked)) {
            squares[cardClicked] = !squares[cardClicked];
        }

        // update state
        this.setState({
            xIsNext: !xIsNext,
            history: historySlice.concat([{
                squares,
                whoMoved: xIsNext ? 'X' : 'O',
                moveLocation: [Math.floor(cardClicked / 5), cardClicked % 5],
            }]),
            stepNumber: historySlice.length,
            counts: _.countBy(cardColors.filter((cc, i) => !squares[i])),
        });
    };

    handleCardToggle = () => {
        this.updateBoard();
        this.hideModal();
    };

    // jumpTo(step) {
    //   this.setState({
    //     stepNumber: step,
    //     xIsNext: (step % 2) === 0,
    //   });
    // }

    render() {
        const {
            history,
            words,
            cardIDs,
            cardColors,
            // startingCount,
            stepNumber,
            modalShown,
            cardClicked,
            counts,
            randomSeed,
            headerIsHidden,
        } = this.state;
        const current = history[stepNumber];
        const squares = current.squares.slice();

        // const winner = calculateWinner(current.squares);

        // const moves = history.map((step, move) => {
        //   const desc = move ?
        //      'Go to move #'+ move + ': ' + step.whoMoved + ' to (r,c) ' + step.moveLocation :
        //      'Go to game start';
        //   return (
        //     <li key={move}>
        //        {this.state.stepNumber == move ? (
        //         <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>
        //         ):
        //        (<button onClick={() => this.jumpTo(move)}>{desc}</button>)
        //        }
        //     </li>
        //   );
        // });

        // let status;
        // if (winner) {
        //   status = 'Winner: ' + winner;
        // } else {
        //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }

        return (
            <div>
                <div className="game">
                    {/* make header its own container */}
                    <header className={`hiding-box ${headerIsHidden ? 'hiding-box-hidden' : ''}`}>
                        <button
                            type="button"
                            className="hide-button"
                            onClick={this.toggleHeaderHide}
                        />
                        <div className="utility-row">
                            <div className="utilities-box">
                                <p>Game code</p>
                                <input
                                    name="randomSeed"
                                    value={randomSeed}
                                    className="input-elements"
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="utilities-box">
                                <button
                                    type="button"
                                    className="input-elements"
                                    onClick={this.seedNewGame}
                                >
                            Refresh game
                                </button>
                            </div>
                            <div className="utilities-box">
                                <button
                                    type="button"
                                    className="input-elements"
                                    onClick={() => this.showModal('REVEAL')}
                                >
                            REVEAL ALL
                                </button>
                                <button
                                    type="button"
                                    className="input-elements"
                                    onClick={() => this.showModal('HIDE')}
                                >
                            HIDE ALL
                                </button>
                            </div>
                        </div>
                    </header>
                    <Board
                        words={words}
                        cardIDs={cardIDs}
                        squares={current.squares}
                        onClick={this.showModal}
                        modalClick={this.handleCardToggle}
                        cardColors={cardColors}
                    />

                    {/* <div className="game-info"> */}
                    {/* <div>{status}</div> */}
                    {/* <ol>{moves}</ol> */}
                    {/* </div> */}
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
                        <p>
                            {squares[cardClicked] ? 'Hide card?' : 'Reveal card?'}
                        </p>
                    </Modal>
                </div>
            </div>
        );
    }
}

CardCounter.propTypes = {
    counts: PropTypes.shape({
        r: PropTypes.number,
        b: PropTypes.number,
        k: PropTypes.number,
        w: PropTypes.number,
    }).isRequired,
};

export default Game;
