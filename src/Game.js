/* eslint-disable react/prop-types */
import _ from 'underscore';
import React from 'react';
import Board from './components/Board';
import Modal from './components/Modal';
import './Game.css';
import 'seedrandom';


const wordFile = 'words_simple.csv';
let wordsReceived = '';
const xhr = new XMLHttpRequest();
xhr.open('GET', wordFile, false);

xhr.onload = () => {
    if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
            wordsReceived = xhr.responseText;
        }
    }
};
xhr.send(null);

// generate placeholder words
const wordList = wordsReceived.split(/\r?\n/);

const numberOfWords = wordList.length - 1;

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
            randomSeedWords: 1,
        };
    }

    componentDidMount() {
        this.seedNewWords();
    }

    showModal = (cardID) => {
        this.setState({
            modalShown: true,
            cardClicked: cardID,
        });
    };

    hideModal = () => {
        this.setState({ modalShown: false });
    };

    handleCardToggle = () => {
        const {
            history,
            xIsNext,
            stepNumber,
            cardClicked,
            cardColors,
        } = this.state;
        const historySlice = history.slice(0, stepNumber + 1);
        const current = historySlice[historySlice.length - 1];
        const squares = current.squares.slice();
        // if (calculateWinner(squares) || squares[i]) {
        //   return;
        // }
        squares[cardClicked] = !squares[cardClicked];

        const counts = _.countBy(cardColors.filter((cc, i) => squares[i]));

        this.setState({
            xIsNext: !xIsNext,
            history: historySlice.concat([{
                squares,
                whoMoved: xIsNext ? 'X' : 'O',
                moveLocation: [Math.floor(cardClicked / 5), cardClicked % 5],
            }]),
            stepNumber: historySlice.length,
            counts,
        });

        this.hideModal();
    };

    handleInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    seedNewWords = () => {
        const { randomSeedWords } = this.state;
        Math.seedrandom(randomSeedWords);

        // select sample of words using seed, ignoring repeats
        const wordsSelected = [];
        let wordToAdd = '';
        while (wordsSelected.length < 25) {
            wordToAdd = wordList[Math.floor(Math.random() * numberOfWords)];
            if (!wordsSelected.includes(wordToAdd)) wordsSelected.push(wordToAdd);
        }
        this.setState({ words: wordsSelected });
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
            randomSeedWords,
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
                    <header>
                        <p>Random seed</p>
                        <input
                            name="randomSeedWords"
                            value={randomSeedWords}
                            className="input-elements"
                            onChange={this.handleInputChange}
                        />
                        <button
                            type="button"
                            className="input-elements"
                            onClick={this.seedNewWords}
                        >
                            Refresh
                        </button>
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
                    <div className="board-row">
                        <div className="card counter-red">
                            Red cards remaining:
                            {' '}
                            {counts && counts.r
                                ? _.countBy(cardColors).r - counts.r
                                : _.countBy(cardColors).r}
                        </div>
                        <div className="card counter-blue">
                            Blue cards remaining:
                            {' '}
                            {counts && counts.b
                                ? _.countBy(cardColors).b - counts.b
                                : _.countBy(cardColors).b}
                        </div>
                    </div>
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

export default Game;
